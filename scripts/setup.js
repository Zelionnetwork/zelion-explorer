#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 Zelion Explorer Setup Script\n');

// Check if .env.local exists
const envPath = path.join(process.cwd(), '.env.local');
const envExamplePath = path.join(process.cwd(), 'config', 'env.example');

if (fs.existsSync(envPath)) {
  console.log('✅ .env.local file already exists');
} else {
  console.log('📝 Creating .env.local file...');
  
  if (fs.existsSync(envExamplePath)) {
    const exampleContent = fs.readFileSync(envExamplePath, 'utf8');
    fs.writeFileSync(envPath, exampleContent);
    console.log('✅ .env.local file created from template');
  } else {
    console.log('❌ config/env.example not found');
    process.exit(1);
  }
}

// Check required environment variables
console.log('\n🔍 Checking environment configuration...');

const requiredVars = [
  'ALCHEMY_ARBITRUM_SEPOLIA_WS',
  'ALCHEMY_POLYGON_AMOY_WS',
  'ALCHEMY_ARBITRUM_ONE_WS',
  'ALCHEMY_POLYGON_POS_WS'
];

const missingVars = [];
const configuredVars = [];

requiredVars.forEach(varName => {
  if (process.env[varName]) {
    configuredVars.push(varName);
  } else {
    missingVars.push(varName);
  }
});

if (configuredVars.length > 0) {
  console.log(`✅ Configured variables: ${configuredVars.length}/${requiredVars.length}`);
  configuredVars.forEach(varName => {
    console.log(`   - ${varName}`);
  });
}

if (missingVars.length > 0) {
  console.log(`\n⚠️  Missing variables: ${missingVars.length}/${requiredVars.length}`);
  missingVars.forEach(varName => {
    console.log(`   - ${varName}`);
  });
  
  console.log('\n📋 To complete setup:');
  console.log('1. Edit .env.local file');
  console.log('2. Add your Alchemy API keys');
  console.log('3. Update contract addresses if available');
  console.log('\n🔗 Get API keys from: https://www.alchemy.com/');
}

// Check dependencies
console.log('\n📦 Checking dependencies...');

try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const requiredDeps = ['ethers', 'next', 'react'];
  
  const missingDeps = requiredDeps.filter(dep => !packageJson.dependencies[dep]);
  
  if (missingDeps.length === 0) {
    console.log('✅ All required dependencies are installed');
  } else {
    console.log(`❌ Missing dependencies: ${missingDeps.join(', ')}`);
    console.log('Run: pnpm install');
  }
} catch (error) {
  console.log('❌ Could not read package.json');
}

// Check ABIs
console.log('\n📄 Checking smart contract ABIs...');

const abiDir = path.join(process.cwd(), 'src', 'abis');
const requiredAbis = ['ZelionBridgeV3.json', 'ZYLToken.json', 'Router.json'];

if (fs.existsSync(abiDir)) {
  const abiFiles = fs.readdirSync(abiDir);
  const missingAbis = requiredAbis.filter(abi => !abiFiles.includes(abi));
  
  if (missingAbis.length === 0) {
    console.log('✅ All required ABIs are present');
  } else {
    console.log(`❌ Missing ABIs: ${missingAbis.join(', ')}`);
  }
} else {
  console.log('❌ src/abis directory not found');
}

console.log('\n🎯 Next steps:');
console.log('1. Configure your API keys in .env.local');
console.log('2. Run: pnpm dev');
console.log('3. Open: http://localhost:3000');

if (missingVars.length === 0) {
  console.log('\n🎉 Setup complete! You can now run the development server.');
} else {
  console.log('\n⚠️  Setup incomplete. Please configure missing environment variables.');
}
