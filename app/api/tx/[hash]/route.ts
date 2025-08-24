import { NextResponse } from "next/server";
import { Interface } from "ethers";
import { getProvider } from "@/src/lib/providers";
import { extractAbi } from "@/src/lib/abi";
import { toJSON } from "@/src/lib/json";
import ZelionBridgeV3 from "@/src/abis/ZelionBridgeV3.json";
import ZYLToken from "@/src/abis/ZYLToken.json";
import Router from "@/src/abis/Router.json";

export const dynamic = "force-dynamic";

export async function GET(
  req: Request,
  { params }: { params: { hash: string } }
) {
  const hash = params.hash;
  const url = new URL(req.url);
  const chain = url.searchParams.get("chain") || "arbitrumSepolia";
  
  console.log(`[TX-API] Fetching transaction: ${hash} on chain: ${chain}`);

  try {
    const provider = getProvider(chain as any);
    console.log(`[TX-API] Provider initialized for chain: ${chain}`);

    // fetch tx & receipt
    console.log(`[TX-API] Fetching transaction and receipt...`);
    const [tx, receipt] = await Promise.all([
      provider.getTransaction(hash),
      provider.getTransactionReceipt(hash),
    ]);

    console.log(`[TX-API] Transaction found:`, { 
      exists: !!tx, 
      blockNumber: tx?.blockNumber,
      from: tx?.from,
      to: tx?.to 
    });

    if (!tx) {
      console.log(`[TX-API] Error: Transaction not found: ${hash}`);
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }

    // Build a combined interface for log decoding
    console.log(`[TX-API] Building interface for log decoding...`);
    const iface = new Interface([
      ...extractAbi(ZelionBridgeV3),
      ...extractAbi(ZYLToken),
      ...extractAbi(Router),
    ]);

    const events = [];
    if (receipt?.logs) {
      console.log(`[TX-API] Processing ${receipt.logs.length} logs...`);
      for (const log of receipt.logs) {
        try {
          const parsed = iface.parseLog({ topics: log.topics as string[], data: log.data });
          if (parsed) {
            const argsObj: Record<string, any> = {};
            parsed.fragment.inputs.forEach((input, idx) => {
              const v = parsed.args[idx];
              argsObj[input.name || String(idx)] = typeof v === "bigint" ? v.toString() : v;
            });
            events.push({
              address: log.address,
              event: parsed.name,
              args: argsObj,
              logIndex: log.index,
            });
            console.log(`[TX-API] Parsed event: ${parsed.name} from ${log.address}`);
          }
        } catch (error) {
          console.log(`[TX-API] Failed to parse log:`, error);
          // not one of our known ABIs — ignore
        }
      }
    }

    const status =
      receipt?.status == null ? "pending" : receipt.status === 1 ? "success" : "failed";

    const response = toJSON({
      status,
      block: receipt?.blockNumber ?? null,
      from: tx.from,
      to: tx.to,
      gasUsed: receipt?.gasUsed ?? null,
      events,
      txHash: tx.hash,
    });

    console.log(`[TX-API] Success: Returning transaction data:`, {
      status,
      block: receipt?.blockNumber,
      eventsCount: events.length,
      gasUsed: receipt?.gasUsed?.toString()
    });

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error(`[TX-API] Error fetching transaction ${hash}:`, error);
    return NextResponse.json({ 
      error: "Failed to fetch transaction", 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 });
  }
}
