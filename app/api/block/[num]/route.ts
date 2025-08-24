import { NextResponse } from "next/server";
import { getProvider } from "@/src/lib/providers";
import { CHAINS, DEFAULT_CHAIN } from "@/src/config/chains";
import { toJSON } from "@/src/lib/json";

export const dynamic = "force-dynamic";

export async function GET(req: Request, { params }: { params: { num: string } }) {
  const url = new URL(req.url);
  const chain = (url.searchParams.get("chain") ?? DEFAULT_CHAIN) as keyof typeof CHAINS;
  const blockNum = Number(params.num);

  console.log(`[BLOCK-API] Fetching block: ${blockNum} on chain: ${String(chain)}`);

  try {
    if (!Number.isInteger(blockNum) || blockNum < 0) {
      console.log(`[BLOCK-API] Error: Invalid block number: ${blockNum}`);
      return NextResponse.json({ error: "Invalid block number" }, { status: 400 });
    }

    console.log(`[BLOCK-API] Initializing provider for chain: ${String(chain)}`);
    const provider = getProvider(chain);

    console.log(`[BLOCK-API] Fetching block ${blockNum}...`);
    const block = await provider.getBlock(blockNum, true); // include txs: true

    if (!block) {
      console.log(`[BLOCK-API] Error: Block ${blockNum} not found`);
      return NextResponse.json({ error: "Block not found" }, { status: 404 });
    }

    console.log(`[BLOCK-API] Block found:`, {
      number: block.number,
      hash: block.hash,
      timestamp: block.timestamp,
      transactions: block.transactions?.length || 0
    });

    const response = toJSON({ chain, block });
    console.log(`[BLOCK-API] Success: Returning block data for block ${blockNum}`);

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error(`[BLOCK-API] Error fetching block ${blockNum}:`, error);
    return NextResponse.json({ 
      error: "Failed to fetch block", 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 });
  }
}
