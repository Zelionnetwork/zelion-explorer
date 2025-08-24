import { NextResponse } from "next/server";
import { getProvider } from "@/src/lib/providers";
import { CHAINS, DEFAULT_CHAIN } from "@/src/config/chains";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const chain = (url.searchParams.get("chain") ?? DEFAULT_CHAIN) as keyof typeof CHAINS;

  console.log(`[LATEST-BLOCK-API] Getting latest block for chain: ${String(chain)}`);

  try {
    const provider = getProvider(chain);
    
    // Get latest block number
    const latestBlock = await provider.getBlockNumber();
    
    console.log(`[LATEST-BLOCK-API] Latest block for ${String(chain)}: ${latestBlock}`);
    
    return NextResponse.json({ 
      chain, 
      latestBlock: latestBlock.toString(),
      timestamp: Date.now()
    });
    
  } catch (error) {
    console.error(`[LATEST-BLOCK-API] Error getting latest block for ${String(chain)}:`, error);
    return NextResponse.json({ 
      error: "Failed to get latest block", 
      details: error instanceof Error ? error.message : String(error),
      chain
    }, { status: 500 });
  }
}
