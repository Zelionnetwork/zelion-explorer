# Zelion Explorer

A blockchain explorer for the Zelion ecosystem, supporting multiple chains and bridge operations.

## Features

- **Multi-chain Support**: Arbitrum Sepolia, Polygon Amoy, Arbitrum One, Polygon PoS
- **Transaction Lookup**: Search and decode transaction details with event parsing
- **Address Explorer**: View balances and transfer history for any address
- **Bridge Events**: Monitor recent bridge operations across chains
- **Search API**: Unified search endpoint for transactions, addresses, and blocks

## API Endpoints

### Search
```
GET /api/search?q={query}&chain={chain}
```
Redirects to appropriate endpoint based on query type:
- Transaction hash (0x...64 chars) → `/api/tx/{hash}`
- Address (0x...40 chars) → `/api/address/{address}`
- Block number → `/api/block/{num}`

### Transaction Details
```
GET /api/tx/{hash}?chain={chain}
```
Returns transaction information including:
- Status (pending/success/failed)
- Block number and gas usage
- Decoded events from known contracts

### Address Information
```
GET /api/address/{address}?chain={chain}
```
Returns address details including:
- ETH/MATIC balance
- ZYL token balance
- Recent transfer history (last 100)

### Bridge Events
```
GET /api/bridge/recent?chain={chain}&limit={limit}
```
Returns recent bridge operations:
- BridgeInitiated events
- MessageReceived events
- Configurable limit (1-200)

### Block Information
```
GET /api/block/{num}?chain={chain}
```
Returns block details including transactions.

## Environment Setup

1. Copy `config/env.example` to `.env.local`
2. Add your Alchemy API keys for each chain:
   ```
   ALCHEMY_ARBITRUM_SEPOLIA_WS=wss://arb-sepolia.g.alchemy.com/v2/YOUR_KEY
   ALCHEMY_POLYGON_AMOY_WS=wss://polygon-amoy.g.alchemy.com/v2/YOUR_KEY
   ALCHEMY_ARBITRUM_ONE_WS=wss://arb-mainnet.g.alchemy.com/v2/YOUR_KEY
   ALCHEMY_POLYGON_POS_WS=wss://polygon-mainnet.g.alchemy.com/v2/YOUR_KEY
   ```

## Development

```bash
npm install
npm run dev
```

## Usage Examples

### Search for a transaction
```
GET /api/search?q=0x1234...&chain=arbitrumOne
```

### Get address details
```
GET /api/address/0x1234...?chain=polygonAmoy
```

### View recent bridge events
```
GET /api/bridge/recent?chain=arbitrumSepolia&limit=25
```

## Architecture

- **Chains Config**: Centralized chain configuration in `src/config/chains.ts`
- **Providers**: WebSocket provider factory in `src/lib/providers.ts`
- **Utilities**: ABI extraction, JSON serialization, and validation helpers
- **API Routes**: Next.js App Router with dynamic imports and no caching
- **Frontend**: Minimal UI with JSON display for Phase 1

## Next Steps

- [ ] Add real contract addresses to chains config
- [ ] Implement proper error handling and validation
- [ ] Add pagination for large result sets
- [ ] Create rich UI components for Phase 2
- [ ] Add transaction status tracking
- [ ] Implement real-time updates
