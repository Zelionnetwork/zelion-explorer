import { WebSocketProvider } from "ethers";
import { CHAINS, type ChainKey, DEFAULT_CHAIN } from "@/src/config/chains";

export function getProvider(chain: ChainKey = DEFAULT_CHAIN) {
  const wsEnvKey = CHAINS[chain].rpcEnv;
  const httpEnvKey = wsEnvKey.replace('_WS', '_HTTP');
  
  // Try WebSocket first, then HTTP fallback, then hardcoded fallback
  const url = process.env[wsEnvKey] || process.env[httpEnvKey] || getHardcodedRpcUrl(chain);
  
  console.log(`[PROVIDER] Getting provider for chain: ${chain}`, {
    wsEnvKey,
    httpEnvKey,
    hasUrl: !!url,
    urlLength: url?.length || 0
  });
  
  if (!url || url.includes("YOUR_API_KEY")) {
    console.error(`[PROVIDER] Missing RPC environment variable: ${wsEnvKey} or ${httpEnvKey}`);
    throw new Error(`Missing RPC env var: ${wsEnvKey} or ${httpEnvKey}`);
  }
  
  console.log(`[PROVIDER] Creating provider for ${chain}`);
  
  try {
    // Convert WebSocket URLs to HTTP URLs for better compatibility
    const httpUrl = url.replace("wss://", "https://").replace("ws://", "http://");
    
    // Use JsonRpcProvider instead of WebSocketProvider for better compatibility
    const { JsonRpcProvider } = require("ethers");
    const provider = new JsonRpcProvider(httpUrl);
    
    // Test the connection with a timeout
    const connectionTest = provider.getBlockNumber().catch((error: unknown) => {
      console.error(`[PROVIDER] Connection test failed for ${chain}:`, error);
      throw new Error(`Failed to connect to ${chain} RPC: ${error instanceof Error ? error.message : String(error)}`);
    });
    
    // Set a 10 second timeout for the connection test
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Connection timeout')), 10000);
    });
    
    Promise.race([connectionTest, timeoutPromise])
      .then(async (blockNumber) => {
        console.log(`[PROVIDER] Provider connection test successful for ${chain}`);
        console.log(`[ALCHEMY-API] [${chain}] Latest block number: ${blockNumber}`);
        
        // Get additional chain info to log API responses
        try {
          const [network, gasPrice, feeData] = await Promise.all([
            provider.getNetwork(),
            provider.getGasPrice(),
            provider.getFeeData()
          ]);
          
          console.log(`[ALCHEMY-API] [${chain}] Network info:`, {
            chainId: network.chainId,
            name: network.name,
            gasPrice: gasPrice.toString(),
            feeData: {
              gasPrice: feeData.gasPrice?.toString(),
              maxFeePerGas: feeData.maxFeePerGas?.toString(),
              maxPriorityFeePerGas: feeData.maxPriorityFeePerGas?.toString()
            }
          });
        } catch (error) {
          console.log(`[ALCHEMY-API] [${chain}] Could not fetch additional network info:`, error);
        }
      })
      .catch((error: unknown) => {
        console.error(`[PROVIDER] Provider connection test failed for ${chain}:`, error);
        throw error;
      });
    
    console.log(`[PROVIDER] Provider created successfully for ${chain}`);
    return provider;
  } catch (error: unknown) {
    console.error(`[PROVIDER] Failed to create provider for ${chain}:`, error);
    throw error;
  }
}

function getHardcodedRpcUrl(chain: ChainKey): string {
  const hardcodedUrls: Record<ChainKey, string> = {
    arbitrumSepolia: "https://arb-sepolia.g.alchemy.com/v2/LvgLMgXMdScfkKOiooWoS",
    polygonAmoy: "https://polygon-amoy.g.alchemy.com/v2/LvgLMgXMdScfkKOiooWoS",
    arbitrumOne: "https://arb-mainnet.g.alchemy.com/v2/LvgLMgXMdScfkKOiooWoS",
    polygonPOS: "https://polygon-mainnet.g.alchemy.com/v2/LvgLMgXMdScfkKOiooWoS",
  };
  return hardcodedUrls[chain];
}
