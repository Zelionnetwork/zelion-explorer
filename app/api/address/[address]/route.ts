import { NextResponse } from "next/server";
import { Contract, formatEther, isAddress } from "ethers";
import { getProvider } from "@/src/lib/providers";
import { extractAbi } from "@/src/lib/abi";
import { toJSON } from "@/src/lib/json";
import { CHAINS, DEFAULT_CHAIN } from "@/src/config/chains";
import ZYLToken from "@/src/abis/ZYLToken.json";

export const dynamic = "force-dynamic";

export async function GET(
  req: Request,
  { params }: { params: { address: string } }
) {
  const url = new URL(req.url);
  const chain = (url.searchParams.get("chain") ?? DEFAULT_CHAIN) as keyof typeof CHAINS;
  const address = params.address;

  console.log(`[ADDRESS-API] Fetching address: ${address} on chain: ${String(chain)}`);

  try {
    if (!isAddress(address)) {
      console.log(`[ADDRESS-API] Error: Invalid address format: ${address}`);
      return NextResponse.json({ error: "Invalid address" }, { status: 400 });
    }

    console.log(`[ADDRESS-API] Initializing provider for chain: ${String(chain)}`);
    const provider = getProvider(chain);
    const { zylToken } = CHAINS[chain];

    console.log(`[ADDRESS-API] ZYL token address: ${zylToken}`);
    const zylAbi = extractAbi(ZYLToken);
    const zyl = new Contract(zylToken, zylAbi, provider);

    console.log(`[ADDRESS-API] Fetching balances and decimals...`);
    const [ethBalBN, zylBalBN, dec] = await Promise.all([
      provider.getBalance(address),
      zyl.balanceOf(address).catch(() => BigInt(0)),
      zyl.decimals?.().catch(() => 18),
    ]);

    console.log(`[ADDRESS-API] Balances fetched:`, {
      eth: ethBalBN.toString(),
      zyl: zylBalBN.toString(),
      decimals: dec
    });

    // Recent ERC-20 Transfer logs (last ~25k blocks)
    console.log(`[ADDRESS-API] Fetching recent transfer logs...`);
    const latest = await provider.getBlockNumber();
    const fromBlock = Math.max(0, Number(latest - 25_000));
    const toBlock = latest;

    console.log(`[ADDRESS-API] Block range: ${fromBlock} to ${toBlock} (latest: ${latest})`);

    const sentFilter = await zyl.filters.Transfer(address, null);
    const recvFilter = await zyl.filters.Transfer(null, address);

    const [sentLogs, recvLogs] = await Promise.all([
      provider.getLogs({ ...sentFilter, fromBlock, toBlock }),
      provider.getLogs({ ...recvFilter, fromBlock, toBlock }),
    ]);

    console.log(`[ADDRESS-API] Transfer logs found:`, {
      sent: sentLogs.length,
      received: recvLogs.length,
      total: sentLogs.length + recvLogs.length
    });

    const transfers = [...sentLogs, ...recvLogs].sort((a, b) => (a.blockNumber ?? 0) - (b.blockNumber ?? 0));

    // Decode the transfers
    console.log(`[ADDRESS-API] Decoding transfer events...`);
    const transferEventTopic = zyl.interface?.getEvent("Transfer")?.topicHash;
    const decoded = transfers.map((log) => {
      try {
        const parsed = zyl.interface.parseLog({ topics: log.topics as string[], data: log.data });
        if (parsed) {
          return {
            txHash: log.transactionHash,
            block: log.blockNumber,
            from: parsed.args[0],
            to: parsed.args[1],
            amount: parsed.args[2].toString(),
            human: (Number(parsed.args[2]) / 10 ** Number(dec)).toString(),
          };
        }
        return null;
      } catch (error) {
        console.log(`[ADDRESS-API] Failed to decode transfer log:`, error);
        return null;
      }
    }).filter(Boolean);

    console.log(`[ADDRESS-API] Successfully decoded ${decoded.length} transfers`);

    const response = toJSON({
      chain,
      address,
      ethBalance: formatEther(ethBalBN), // ETH/MATIC depending on chain
      zylBalance: (Number(zylBalBN) / 10 ** Number(dec)).toString(),
      transfers: decoded.slice(-100), // cap the response
    });

    console.log(`[ADDRESS-API] Success: Returning address data:`, {
      chain,
      address,
      ethBalance: formatEther(ethBalBN),
      zylBalance: (Number(zylBalBN) / 10 ** Number(dec)).toString(),
      transfersCount: decoded.length
    });

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error(`[ADDRESS-API] Error fetching address ${address}:`, error);
    return NextResponse.json({ 
      error: "Failed to fetch address data", 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 });
  }
}
