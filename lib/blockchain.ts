import { ethers } from "ethers"
import ZelionBridgeV3ABI from "../src/abis/ZelionBridgeV3.json"
import ZYLTokenABI from "../src/abis/ZYLToken.json"
import RouterABI from "../src/abis/Router.json"

export function formatAddress(address: string): string {
  if (!address) return ""
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export function formatHash(hash: string): string {
  if (!hash) return ""
  return `${hash.slice(0, 10)}...${hash.slice(-8)}`
}

export function formatZylAmount(amount: string | number): string {
  const num = typeof amount === "string" ? Number.parseFloat(amount) : amount
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(2)}M ZYL`
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(2)}K ZYL`
  }
  return `${num.toFixed(2)} ZYL`
}

export function formatTimeAgo(timestamp: number): string {
  const now = Date.now()
  const diff = now - timestamp

  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`
  if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`
  if (minutes > 0) return `${minutes} min${minutes > 1 ? "s" : ""} ago`
  return `${seconds} sec${seconds > 1 ? "s" : ""} ago`
}

export function validateAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address)
}

export function validateTxHash(hash: string): boolean {
  return /^0x[a-fA-F0-9]{64}$/.test(hash)
}

export function getChainName(chainId: string): string {
  const chains: Record<string, string> = {
    "1": "Ethereum",
    "137": "Polygon",
    "56": "BSC",
    "42161": "Arbitrum",
    ethereum: "Ethereum",
    polygon: "Polygon",
    bsc: "BSC",
    arbitrum: "Arbitrum",
  }
  return chains[chainId] || "Unknown"
}

export function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case "success":
    case "confirmed":
      return "text-green-400"
    case "pending":
      return "text-yellow-400"
    case "failed":
    case "error":
      return "text-red-400"
    default:
      return "text-gray-400"
  }
}

export function getStatusBadgeClass(status: string): string {
  switch (status.toLowerCase()) {
    case "success":
    case "confirmed":
      return "bg-green-500/20 text-green-400 border-green-500/30"
    case "pending":
      return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
    case "failed":
    case "error":
      return "bg-red-500/20 text-red-400 border-red-500/30"
    default:
      return "bg-gray-500/20 text-gray-400 border-gray-500/30"
  }
}

export function getProvider(network: string): ethers.JsonRpcProvider {
  const rpcUrls: Record<string, string> = {
    "arbitrum-sepolia": process.env.ALCHEMY_ARBITRUM_SEPOLIA_WS || process.env.ALCHEMY_ARBITRUM_SEPOLIA_HTTP || "wss://arb-sepolia.g.alchemy.com/v2/LvgLMgXMdScfkKOiooWoS",
    "polygon-amoy": process.env.ALCHEMY_POLYGON_AMOY_WS || process.env.ALCHEMY_POLYGON_AMOY_HTTP || "wss://polygon-amoy.g.alchemy.com/v2/LvgLMgXMdScfkKOiooWoS",
    "arbitrum-one": process.env.ALCHEMY_ARBITRUM_ONE_WS || process.env.ALCHEMY_ARBITRUM_ONE_HTTP || "wss://arb-mainnet.g.alchemy.com/v2/LvgLMgXMdScfkKOiooWoS",
    "polygon-pos": process.env.ALCHEMY_POLYGON_POS_WS || process.env.ALCHEMY_POLYGON_POS_HTTP || "wss://polygon-mainnet.g.alchemy.com/v2/LvgLMgXMdScfkKOiooWoS",
  }

  const url = rpcUrls[network]
  if (!url) {
    const error = `RPC URL not configured for network: ${network}. Please check your environment variables.`
    console.error("[BLOCKCHAIN] Provider error:", error)
    throw new Error(error)
  }

  // const httpUrl = url.replace("wss://", "https://").replace("ws://", "http://")
  
  try {
    const provider = new ethers.JsonRpcProvider(url)
    
    console.log(`[BLOCKCHAIN] Provider created successfully for ${network}`);
    
    // Test the provider and log API responses
    provider.getBlockNumber().then(async (blockNumber) => {
      console.log(`[ALCHEMY-API] [${network}] Latest block number: ${blockNumber}`);
      
      try {
        const [networkInfo, feeData] = await Promise.all([
          provider.getNetwork(),
          provider.getFeeData()
        ]);
        
        console.log(`[ALCHEMY-API] [${network}] Network response:`, {
          chainId: networkInfo.chainId,
          name: networkInfo.name,
          gasPrice: feeData.gasPrice?.toString() || 'N/A'
        });
      } catch (error) {
        console.log(`[ALCHEMY-API] [${network}] Could not fetch network info:`, error);
      }
    }).catch(error => {
      console.error(`[ALCHEMY-API] [${network}] Failed to get block number:`, error);
    });
    
    return provider
  } catch (error) {
    console.error(`[BLOCKCHAIN] Failed to create provider for ${network}:`, error)
    throw error
  }
}

export function getContractInterface(contractType: "bridge" | "token" | "router"): ethers.Interface {
  try {
    switch (contractType) {
      case "bridge":
        return new ethers.Interface(ZelionBridgeV3ABI.abi)
      case "token":
        return new ethers.Interface(ZYLTokenABI.abi)
      case "router":
        return new ethers.Interface(RouterABI.abi)
      default:
        throw new Error(`Unknown contract type: ${contractType}`)
    }
  } catch (error) {
    console.error(`[BLOCKCHAIN] Failed to create contract interface for ${contractType}:`, error)
    throw error
  }
}

export function decodeLogs(logs: ethers.Log[]): any[] {
  const decodedLogs: any[] = []

  for (const log of logs) {
    try {
      // Try to decode with each contract interface
      const interfaces = ["bridge", "token", "router"] as const

      for (const contractType of interfaces) {
        try {
          const iface = getContractInterface(contractType)
          const decoded = iface.parseLog({
            topics: log.topics,
            data: log.data,
          })

          if (decoded) {
            decodedLogs.push({
              address: log.address,
              topics: log.topics,
              data: log.data,
              decoded: {
                event: decoded.name,
                args: Object.fromEntries(
                  decoded.args.map((arg, index) => [decoded.fragment.inputs[index].name, arg.toString()]),
                ),
              },
              contractType,
            })
            break
          }
        } catch (error) {
          // Continue to next interface
          console.error(`[BLOCKCHAIN] Failed to decode log with ${contractType} interface:`, error)
        }
      }
    } catch (error) {
      console.error("[BLOCKCHAIN] Failed to decode log:", error)
      // If no interface can decode, add raw log
      decodedLogs.push({
        address: log.address,
        topics: log.topics,
        data: log.data,
        decoded: null,
      })
    }
  }

  return decodedLogs
}

export function detectNetwork(chainId: number): string {
  const networks: Record<number, string> = {
    1: "ethereum",
    137: "polygon-pos",
    56: "bsc",
    42161: "arbitrum-one",
    421614: "arbitrum-sepolia",
    80002: "polygon-amoy",
  }

  return networks[chainId] || "unknown"
}

export function checkEnvironmentConfig(): { valid: boolean; missing: string[]; networks: string[] } {
  const requiredVars = [
    "ALCHEMY_ARBITRUM_SEPOLIA_WS",
    "ALCHEMY_POLYGON_AMOY_WS", 
    "ALCHEMY_ARBITRUM_ONE_WS",
    "ALCHEMY_POLYGON_POS_WS"
  ]
  
  const missing: string[] = []
  const networks: string[] = []
  
  for (const varName of requiredVars) {
    if (!process.env[varName] || 
        process.env[varName] === "wss://arb-sepolia.g.alchemy.com/v2/LvgLMgXMdScfkKOiooWoS" || 
        process.env[varName] === "wss://polygon-amoy.g.alchemy.com/v2/LvgLMgXMdScfkKOiooWoS" || 
        process.env[varName] === "wss://arb-mainnet.g.alchemy.com/v2/LvgLMgXMdScfkKOiooWoS" || 
        process.env[varName] === "wss://polygon-mainnet.g.alchemy.com/v2/LvgLMgXMdScfkKOiooWoS" ||
        process.env[varName] === "https://arb-sepolia.g.alchemy.com/v2/LvgLMgXMdScfkKOiooWoS" || 
        process.env[varName] === "https://polygon-amoy.g.alchemy.com/v2/LvgLMgXMdScfkKOiooWoS" || 
        process.env[varName] === "https://arb-mainnet.g.alchemy.com/v2/LvgLMgXMdScfkKOiooWoS" || 
        process.env[varName] === "https://polygon-mainnet.g.alchemy.com/v2/LvgLMgXMdScfkKOiooWoS") {
      missing.push(varName)
      console.error(`[ENV] Missing required environment variable: ${varName}`)
    } else {
      // Extract network name from variable
      const network = varName.toLowerCase().replace('alchemy_', '').replace('_ws', '')
      if (!networks.includes(network)) {
        networks.push(network)
      }
    }
  }
  
  if (missing.length > 0) {
    console.error(`[ENV] Environment validation failed. Missing: ${missing.join(', ')}`)
    return {
      valid: false,
      missing,
      networks: []
    }
  } else {
    console.log(`[ENV] Environment validation successful. Networks: ${networks.join(', ')}`)
    return {
      valid: true,
      missing,
      networks
    }
  }
  
  return {
    valid: missing.length === 0,
    missing,
    networks
  }
}

export function getSupportedNetworks(): string[] {
  const config = checkEnvironmentConfig()
  if (!config.valid) {
    console.error("[ENV] Cannot get supported networks - environment not properly configured")
    return []
  }
  
  return [
    "arbitrum-sepolia",
    "polygon-amoy", 
    "arbitrum-one",
    "polygon-pos"
  ]
}

export function validateContractAddresses(): { valid: boolean; missing: string[] } {
  const requiredAddresses = [
    "0xd873a2649c7e1e020C2249A4aaaA248eC02d837B",
    "0x20471cf7A5C04f0640d90584c0d42f01F74eC1B0"
  ]
  
  const missing: string[] = []
  
  for (const addressVar of requiredAddresses) {
    const address = process.env[addressVar]
    if (!address) {
      missing.push(addressVar)
      console.error(`[CONTRACT] Missing or invalid contract address: ${addressVar}`)
    }
  }
  
  if (missing.length > 0) {
    console.error(`[CONTRACT] Contract address validation failed. Missing: ${missing.join(', ')}`)
  } else {
    console.log("[CONTRACT] Contract address validation successful")
  }
  
  return {
    valid: missing.length === 0,
    missing
  }
}
