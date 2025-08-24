#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🧪 Testing Alchemy API Integration\n');

// Check if .env.local exists
const envPath = path.join(process.cwd(), '.env.local');
if (!fs.existsSync(envPath)) {
  console.log('❌ .env.local file not found');
  console.log('📝 Please create .env.local with your Alchemy API keys');
  console.log('🔗 Get API keys from: https://www.alchemy.com/');
  process.exit(1);
}

// Read and parse .env.local
const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};

envContent.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split('=');
  if (key && valueParts.length > 0) {
    envVars[key.trim()] = valueParts.join('=').trim();
  }
});

console.log('🔍 Checking Alchemy API keys...\n');

const requiredKeys = [
  'ALCHEMY_ARBITRUM_SEPOLIA_WS',
  'ALCHEMY_POLYGON_AMOY_WS',
  'ALCHEMY_ARBITRUM_ONE_WS',
  'ALCHEMY_POLYGON_POS_WS'
];

let allValid = true;

requiredKeys.forEach(key => {
  const value = envVars[key];
  if (!value || value.includes('YOUR_API_KEY')) {
    console.log(`❌ ${key}: Not configured`);
    allValid = false;
  } else {
    console.log(`✅ ${key}: Configured`);
  }
});

if (!allValid) {
  console.log('\n⚠️  Some API keys are missing or contain placeholder values');
  console.log('📝 Please update your .env.local file with real Alchemy API keys');
  process.exit(1);
}

console.log('\n✅ All Alchemy API keys are configured!');
console.log('\n🚀 You can now:');
console.log('1. Run: pnpm dev');
console.log('2. Open: http://localhost:3000');
console.log('3. Search for transaction hashes, addresses, or block numbers');
console.log('4. The app will use Alchemy APIs to fetch real blockchain data');

console.log('\n🔗 Test URLs:');
console.log('- Search: http://localhost:3000/?q=0x...');
console.log('- Transaction: http://localhost:3000/tx/0x...?chain=arbitrumOne');
console.log('- Address: http://localhost:3000/address/0x...?chain=arbitrumOne');
console.log('- Block: http://localhost:3000/block/12345?chain=arbitrumOne');
