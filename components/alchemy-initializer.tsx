"use client";

import { useEffect } from 'react';

/**
 * Client component that initializes Alchemy APIs on app startup
 * This runs in the browser to test all API endpoints
 */
export function AlchemyInitializer() {
  useEffect(() => {
    // Initialize Alchemy APIs when the component mounts
    const initAlchemy = async () => {
      try {
        console.log('🚀 [ALCHEMY-CLIENT] Starting Alchemy API initialization...');
        
        // Test a simple API call to verify connectivity
        const testResponse = await fetch('/api/config');
        if (testResponse.ok) {
          console.log('✅ [ALCHEMY-CLIENT] API routes are accessible');
          
          // Test each chain by making a simple request
          const chains = ['arbitrumSepolia', 'polygonAmoy', 'arbitrumOne', 'polygonPOS'];
          
          for (const chain of chains) {
            try {
              console.log(`🔗 [ALCHEMY-CLIENT] Testing ${chain} connectivity...`);
              
              // Test by getting the latest block number (this will trigger the provider)
              const response = await fetch(`/api/block/latest?chain=${chain}`);
              if (response.ok) {
                console.log(`✅ [ALCHEMY-CLIENT] ${chain} is accessible`);
              } else {
                console.log(`⚠️ [ALCHEMY-CLIENT] ${chain} returned status: ${response.status}`);
              }
            } catch (error) {
              console.error(`❌ [ALCHEMY-CLIENT] ${chain} test failed:`, error);
            }
          }
        } else {
          console.log('⚠️ [ALCHEMY-CLIENT] API routes returned status:', testResponse.status);
        }
        
      } catch (error) {
        console.error('❌ [ALCHEMY-CLIENT] Failed to initialize Alchemy APIs:', error);
      }
    };

    // Small delay to ensure the app is fully loaded
    const timer = setTimeout(initAlchemy, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // This component doesn't render anything visible
  return null;
}
