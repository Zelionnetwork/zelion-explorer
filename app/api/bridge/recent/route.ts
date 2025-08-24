import { NextResponse } from "next/server";
import { Contract } from "ethers";
import { getProvider } from "@/src/lib/providers";
import { CHAINS, type ChainKey, DEFAULT_CHAIN } from "@/src/config/chains";
import { extractAbi } from "@/src/lib/abi";
import { toJSON } from "@/src/lib/json";
import ZelionBridgeV3 from "@/src/abis/ZelionBridgeV3.json";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const chain = (url.searchParams.get("chain") ?? DEFAULT_CHAIN) as ChainKey;
  const limit = Math.max(1, Math.min(200, Number(url.searchParams.get("limit") ?? 50)));

  console.log(`[BRIDGE-API] Fetching bridge events:`, { chain, limit, url: req.url });

  try {
    console.log(`[BRIDGE-API] Initializing provider for chain: ${chain}`);
    const provider = getProvider(chain);
    const { bridge } = CHAINS[chain];

    console.log(`[BRIDGE-API] Bridge contract address: ${bridge}`);
    const abi = extractAbi(ZelionBridgeV3);
    const contract = new Contract(bridge, abi, provider);

    // Figure out recent window
    console.log(`[BRIDGE-API] Determining block range...`);
    const latest = await provider.getBlockNumber();
    const fromBlock = Math.max(0, Number(latest - 50_000));
    const toBlock = latest;

    console.log(`[BRIDGE-API] Block range: ${fromBlock} to ${toBlock} (latest: ${latest})`);

    // Two event types
    console.log(`[BRIDGE-API] Creating event filters...`);
    const evInitiated = await contract.filters.BridgeInitiated?.();
    const evReceived  = await contract.filters.MessageReceived?.();

    console.log(`[BRIDGE-API] Fetching event logs...`);
    const [logsA, logsB] = await Promise.all([
      provider.getLogs({ ...evInitiated, fromBlock, toBlock }).catch(() => []),
      provider.getLogs({ ...evReceived,  fromBlock, toBlock }).catch(() => []),
    ]);

    console.log(`[BRIDGE-API] Logs found:`, {
      initiated: logsA.length,
      received: logsB.length,
      total: logsA.length + logsB.length
    });

    const all = [...logsA, ...logsB].slice(-limit).reverse();
    console.log(`[BRIDGE-API] Processing ${all.length} events (limited to ${limit})`);

    const items = all.map((log, index) => {
      try {
        const parsed = contract.interface.parseLog({ topics: log.topics as string[], data: log.data });
        if (parsed) {
          const name = parsed.name;
          const args = parsed.args;

          console.log(`[BRIDGE-API] Event ${index + 1}: ${name}`, { args: args.map(arg => arg?.toString()) });

          // Map to standard shape; adjust arg names to match your ABI if they differ
          const base = {
            txHash: log.transactionHash,
            chain,
          };

          if (name === "BridgeInitiated") {
            const obj = {
              from: args.from ?? args[0],
              to: args.to ?? args[1],
              token: args.token ?? args[2],
              amount: (args.amount ?? args[3])?.toString?.() ?? "",
              status: "initiated",
            };
            return { ...base, ...obj };
          }

          if (name === "MessageReceived") {
            const obj = {
              from: args.from ?? args[0],
              to: args.to ?? args[1],
              token: args.token ?? args[2],
              amount: (args.amount ?? args[3])?.toString?.() ?? "",
              status: "received",
            };
            return { ...base, ...obj };
          }

          // Fallback (shouldn't happen often)
          console.log(`[BRIDGE-API] Unknown event type: ${name}`);
          return { ...base, status: name, rawArgs: args };
        }
        return null;
      } catch (error) {
        console.log(`[BRIDGE-API] Failed to parse log ${index}:`, error);
        return null;
      }
    }).filter(Boolean);

    console.log(`[BRIDGE-API] Successfully processed ${items.length} events`);

    const response = toJSON(items);
    console.log(`[BRIDGE-API] Success: Returning bridge events:`, {
      chain,
      eventsCount: items.length,
      limit
    });

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error(`[BRIDGE-API] Error fetching bridge events:`, error);
    return NextResponse.json({ 
      error: "Failed to fetch bridge events", 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 });
  }
}
