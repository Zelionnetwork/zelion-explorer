import { getProvider } from "@/src/lib/providers";
import { CHAINS, type ChainKey } from "@/src/config/chains";

/**
 * Initialize and test all Alchemy API endpoints
 * This runs when the app starts up to verify connectivity
 */
export async function initializeAlchemyAPIs() {
  console.log('🚀 [ALCHEMY-INIT] Initializing Alchemy API connections...\n');
  
  const results: Record<string, { success: boolean; error?: string; data?: any }> = {};
  
  // Test each supported chain
  for (const [chainKey, chainConfig] of Object.entries(CHAINS)) {
    const config = chainConfig as { name: string };
    try {
      console.log(`🔗 [ALCHEMY-INIT] Testing ${config.name} (${chainKey})...`);
      
      const provider = getProvider(chainKey as ChainKey);
      
      // Test basic connectivity
      const blockNumber = await provider.getBlockNumber();
      
      // Get network information
      const network = await provider.getNetwork();
      const gasPrice = await provider.getGasPrice();
      const feeData = await provider.getFeeData();
      
      // Get recent block info
      const latestBlock = await provider.getBlock(blockNumber);
      
      const chainData = {
        chainId: network.chainId,
        name: network.name,
        latestBlock: {
          number: blockNumber,
          hash: latestBlock?.hash,
          timestamp: latestBlock?.timestamp,
          transactions: latestBlock?.transactions?.length || 0
        },
        gasInfo: {
          currentGasPrice: gasPrice.toString(),
          feeData: {
            gasPrice: feeData.gasPrice?.toString(),
            maxFeePerGas: feeData.maxFeePerGas?.toString(),
            maxPriorityFeePerGas: feeData.maxPriorityFeePerGas?.toString()
          }
        }
      };
      
      results[chainKey] = { success: true, data: chainData };
      
      console.log(`✅ [ALCHEMY-INIT] ${config.name} connection successful:`, {
        chainId: chainData.chainId,
        latestBlock: chainData.latestBlock.number,
        gasPrice: chainData.gasInfo.currentGasPrice
      });
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      results[chainKey] = { success: false, error: errorMessage };
      
      console.error(`❌ [ALCHEMY-INIT] ${config.name} connection failed:`, errorMessage);
    }
    
    console.log(''); // Add spacing between chains
  }
  
  // Summary
  const successfulChains = Object.values(results).filter(r => r.success).length;
  const totalChains = Object.keys(results).length;
  
  console.log(`📊 [ALCHEMY-INIT] Summary: ${successfulChains}/${totalChains} chains connected successfully`);
  
  if (successfulChains === totalChains) {
    console.log('🎉 [ALCHEMY-INIT] All Alchemy API endpoints are working!');
  } else {
    console.log('⚠️  [ALCHEMY-INIT] Some chains failed to connect. Check your API keys and network connectivity.');
  }
  
  return results;
}

/**
 * Test a specific transaction hash on a specific chain
 * Useful for debugging specific API calls
 */
export async function testTransactionAPI(chain: ChainKey, txHash: string) {
  try {
    console.log(`🔍 [ALCHEMY-TEST] Testing transaction API for ${chain}: ${txHash}`);
    
    const provider = getProvider(chain);
    
    // Test transaction fetching
    const tx = await provider.getTransaction(txHash);
    const receipt = await provider.getTransactionReceipt(txHash);
    
    if (tx) {
      console.log(`✅ [ALCHEMY-TEST] Transaction found:`, {
        from: tx.from,
        to: tx.to,
        value: tx.value.toString(),
        blockNumber: tx.blockNumber,
        status: receipt?.status === 1 ? 'success' : receipt?.status === 0 ? 'failed' : 'pending'
      });
      
      return { success: true, transaction: tx, receipt };
    } else {
      console.log(`❌ [ALCHEMY-TEST] Transaction not found`);
      return { success: false, error: 'Transaction not found' };
    }
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`❌ [ALCHEMY-TEST] Failed to fetch transaction:`, errorMessage);
    return { success: false, error: errorMessage };
  }
}
