export type ChainKey = 'arbitrumSepolia' | 'polygonAmoy' | 'arbitrumOne' | 'polygonPOS';

type ChainConfig = {
  id: number;
  name: string;
  rpcEnv: string;      
  zylToken: `0x${string}`;
  bridge: `0x${string}`;
};

export const CHAINS: Record<ChainKey, ChainConfig> = {
  arbitrumSepolia: {
    id: 421614,
    name: "Arbitrum Sepolia",
    rpcEnv: "ALCHEMY_ARBITRUM_SEPOLIA_WS",
    zylToken: "0xd873a2649c7e1e020C2249A4aaaA248eC02d837B", 
    bridge:  "0x20471cf7A5C04f0640d90584c0d42f01F74eC1B0", 
  },
  polygonAmoy: {
    id: 80002,
    name: "Polygon Amoy",
    rpcEnv: "ALCHEMY_POLYGON_AMOY_WS",
    zylToken: "0xd873a2649c7e1e020C2249A4aaaA248eC02d837B", 
    bridge:  "0x20471cf7A5C04f0640d90584c0d42f01F74eC1B0", 
  },
  arbitrumOne: {
    id: 42161,
    name: "Arbitrum One",
    rpcEnv: "ALCHEMY_ARBITRUM_ONE_WS",
    zylToken: "0xd873a2649c7e1e020C2249A4aaaA248eC02d837B", 
    bridge:  "0x20471cf7A5C04f0640d90584c0d42f01F74eC1B0", 
  },
  polygonPOS: {
    id: 137,
    name: "Polygon PoS",
    rpcEnv: "ALCHEMY_POLYGON_POS_WS",
    zylToken: "0xd873a2649c7e1e020C2249A4aaaA248eC02d837B", 
    bridge:  "0x20471cf7A5C04f0640d90584c0d42f01F74eC1B0", 
  },
};

export const DEFAULT_CHAIN: ChainKey = 'arbitrumSepolia';