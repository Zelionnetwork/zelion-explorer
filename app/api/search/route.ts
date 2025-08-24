import { NextResponse } from "next/server";
import { isAddress } from "ethers";
import { isTxHash } from "@/src/lib/is";
import { DEFAULT_CHAIN, CHAINS } from "@/src/config/chains";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = (url.searchParams.get("q") || "").trim();
  const chain = url.searchParams.get("chain") ?? DEFAULT_CHAIN;

  console.log(`[SEARCH-API] Search request:`, { query: q, chain, url: req.url });

  // Quick environment check
  const envKey = CHAINS[chain as keyof typeof CHAINS].rpcEnv;
  const rpcUrl = process.env[envKey];
  const hasRpcUrl = !!rpcUrl && !rpcUrl.includes("YOUR_ACTUAL_API_KEY_HERE");
  
  if (!hasRpcUrl) {
    console.error(`[SEARCH-API] Missing RPC environment variable: ${envKey}`);
    return NextResponse.json({ 
      error: "RPC endpoint not configured", 
      details: `Missing environment variable: ${envKey}`,
      solution: "Please set up your RPC endpoints in .env.local"
    }, { status: 500 });
  }

  console.log(`[ALCHEMY-API] [${chain}] RPC endpoint configured, proceeding with search`);

  if (!q) {
    console.log(`[SEARCH-API] Error: Missing query parameter`);
    return NextResponse.json({ error: "Missing q" }, { status: 400 });
  }

  // 66 chars: 0x + 64 => tx hash
  if (q.length === 66 && isTxHash(q)) {
    console.log(`[SEARCH-API] Redirecting to transaction: ${q}`);
    return NextResponse.redirect(new URL(`/api/tx/${q}?chain=${chain}`, req.url), 307);
  }

  // Address?
  if (isAddress(q)) {
    console.log(`[SEARCH-API] Redirecting to address: ${q}`);
    return NextResponse.redirect(new URL(`/api/address/${q}?chain=${chain}`, req.url), 307);
  }

  // Block number?
  const n = Number(q);
  if (Number.isInteger(n) && n >= 0) {
    console.log(`[SEARCH-API] Redirecting to block: ${n}`);
    const target = new URL(`/api/block/${n}?chain=${chain}`, req.url);
    return NextResponse.redirect(target, 307);
  }

  console.log(`[SEARCH-API] Error: Unrecognized query type: ${q}`);
  return NextResponse.json({ error: "Unrecognized query" }, { status: 400 });
}
