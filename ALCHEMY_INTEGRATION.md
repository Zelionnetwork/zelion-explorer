# Alchemy API Integration Guide

## Overview

This application now uses **Alchemy's blockchain APIs** to explore transaction hashes, addresses, and blocks directly from the blockchain. There is no external API dependency - all data comes directly from Alchemy's RPC endpoints.

## How It Works

### 1. **Environment Configuration**
The app reads Alchemy API keys from `.env.local`:

```bash
# Required Alchemy WebSocket endpoints
ALCHEMY_ARBITRUM_SEPOLIA_WS=wss://arb-sepolia.g.alchemy.com/v2/YOUR_API_KEY
ALCHEMY_POLYGON_AMOY_WS=wss://polygon-amoy.g.alchemy.com/v2/YOUR_API_KEY
ALCHEMY_ARBITRUM_ONE_WS=wss://arb-mainnet.g.alchemy.com/v2/YOUR_API_KEY
ALCHEMY_POLYGON_POS_WS=wss://polygon-mainnet.g.alchemy.com/v2/YOUR_API_KEY

# Optional HTTP fallback endpoints
ALCHEMY_ARBITRUM_SEPOLIA_HTTP=https://arb-sepolia.g.alchemy.com/v2/YOUR_API_KEY
ALCHEMY_POLYGON_AMOY_HTTP=https://polygon-amoy.g.alchemy.com/v2/YOUR_API_KEY
ALCHEMY_ARBITRUM_ONE_HTTP=https://arb-mainnet.g.alchemy.com/v2/YOUR_API_KEY
ALCHEMY_POLYGON_POS_HTTP=https://polygon-mainnet.g.alchemy.com/v2/YOUR_API_KEY
```

### 2. **Provider Management**
- **Primary**: WebSocket endpoints for real-time data
- **Fallback**: HTTP endpoints if WebSocket fails
- **Hardcoded**: Placeholder URLs as final fallback

### 3. **API Routes**
All API routes now use the appropriate Alchemy provider:

- **`/api/tx/[hash]`** - Fetch transaction details and logs
- **`/api/address/[address]`** - Get address balances and transfer history
- **`/api/block/[number]`** - Retrieve block information
- **`/api/search`** - Search for transactions, addresses, or blocks

### 4. **Chain Support**
The app supports multiple networks:
- **Arbitrum Sepolia** (testnet)
- **Polygon Amoy** (testnet)  
- **Arbitrum One** (mainnet)
- **Polygon PoS** (mainnet)

## Setup Instructions

### 1. **Get Alchemy API Keys**
1. Visit [Alchemy](https://www.alchemy.com/)
2. Create an account and app
3. Copy your API keys for each network

### 2. **Configure Environment**
```bash
# Copy example file
cp config/env.example .env.local

# Edit with your real API keys
nano .env.local
```

### 3. **Test Configuration**
```bash
# Test if API keys are configured
pnpm test:alchemy

# Start development server
pnpm dev
```

## Usage Examples

### **Search for Transaction**
```
GET /api/search?q=0x1234...&chain=arbitrumOne
```

### **Get Transaction Details**
```
GET /api/tx/0x1234...?chain=arbitrumOne
```

### **View Address**
```
GET /api/address/0x1234...?chain=arbitrumOne
```

### **Get Block Info**
```
GET /api/block/12345?chain=arbitrumOne
```

## Frontend Integration

### **Transaction Page**
- **Before**: Used external API with `NEXT_PUBLIC_BASE_URL`
- **After**: Uses local API route `/api/tx/[hash]`

### **Search Functionality**
- Main page search calls `/api/search`
- Automatically redirects to appropriate detail pages
- Supports all supported chains

## Error Handling

### **Missing API Keys**
- Graceful fallback to placeholder URLs
- Clear error messages indicating missing configuration
- Validation prevents app crashes

### **Network Issues**
- Timeout handling (10 seconds)
- Connection testing before use
- Detailed logging for debugging

## Benefits

1. **Real-time Data**: Direct blockchain access via Alchemy
2. **No External Dependencies**: Self-contained blockchain explorer
3. **Multi-chain Support**: Explore multiple networks from one app
4. **Robust Fallbacks**: Multiple provider options for reliability
5. **Developer Friendly**: Clear error messages and validation

## Troubleshooting

### **Common Issues**

1. **"Missing RPC env var"**
   - Check `.env.local` exists
   - Verify API keys are set correctly
   - Run `pnpm test:alchemy`

2. **Connection Timeout**
   - Check internet connection
   - Verify API key validity
   - Try HTTP fallback endpoints

3. **Transaction Not Found**
   - Verify transaction hash format
   - Check if transaction exists on selected chain
   - Ensure chain parameter is correct

### **Debug Commands**
```bash
# Check environment setup
pnpm setup

# Test Alchemy integration
pnpm test:alchemy

# View logs
pnpm dev
```

## Architecture

```
Frontend → API Routes → Alchemy Providers → Blockchain
    ↓           ↓           ↓              ↓
  Search → /api/search → getProvider() → Alchemy RPC
  TX Page → /api/tx → getProvider() → Alchemy RPC
  Address → /api/address → getProvider() → Alchemy RPC
  Block → /api/block → getProvider() → Alchemy RPC
```

The application now provides a complete, self-contained blockchain exploration experience using Alchemy's powerful APIs.
