"use client";
import { useState, useEffect } from "react";
import { 
  MagnifyingGlassIcon, 
  SparklesIcon, 
  ChartBarIcon, 
  ClockIcon, 
  CurrencyDollarIcon,
  ArrowPathIcon,
  FireIcon,
  GlobeAltIcon,
  CubeIcon,
  UserGroupIcon,
  XMarkIcon
} from "@heroicons/react/24/outline";
import { TransactionCard } from "../components/transaction-card";
import { TransactionNotFoundPopup } from "../components/transaction-not-found-popup";
import { toast } from "sonner";

interface DashboardStats {
  totalTransactions: number;
  totalBlocks: number;
  activeAddresses: number;
  totalVolume: string;
  averageBlockTime: number;
  networkHashrate: string;
}

interface RecentTransaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  timestamp: number;
  status: 'success' | 'pending' | 'failed';
  chain: string;
}

export default function Home() {
  const [q, setQ] = useState("");
  const [json, setJson] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showNotFoundPopup, setShowNotFoundPopup] = useState(false);
  const [notFoundHash, setNotFoundHash] = useState("");
  const [stats, setStats] = useState<DashboardStats>({
    totalTransactions: 0,
    totalBlocks: 0,
    activeAddresses: 0,
    totalVolume: "0",
    averageBlockTime: 0,
    networkHashrate: "0"
  });
  const [recentTxs, setRecentTxs] = useState<RecentTransaction[]>([]);
  const [selectedChain, setSelectedChain] = useState("arbitrumOne");

  // Initialize with empty data - will be populated by real API calls
  useEffect(() => {
    // TODO: Replace with real API calls to get actual blockchain data
    console.log('[DASHBOARD] Dashboard initialized - ready for real data');
  }, []);

  // Fetch real data when chain changes
  useEffect(() => {
    if (selectedChain) {
      fetchChainData(selectedChain);
    }
  }, [selectedChain]);

  const fetchChainData = async (chain: string) => {
    try {
      console.log(`[DASHBOARD] Fetching data for chain: ${chain}`);
      // TODO: Implement real API calls to fetch:
      // - Chain statistics
      // - Recent transactions
      // - Network metrics
      
      // For now, just log the chain change
      setStats({
        totalTransactions: 0,
        totalBlocks: 0,
        activeAddresses: 0,
        totalVolume: "0",
        averageBlockTime: 0,
        networkHashrate: "0"
      });
      setRecentTxs([]);
    } catch (error) {
      console.error(`[DASHBOARD] Failed to fetch chain data:`, error);
    }
  };

  async function onSearch(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setJson(null);
    
    try {
      console.log(`[FRONTEND] Starting search for: ${q}`);
      
      // Add timeout to prevent hanging
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 300000);
      
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&chain=${selectedChain}`, { 
        redirect: "follow",
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${res.status}: ${res.statusText}`);
      }
      
      const data = await res.json();
      console.log(`[FRONTEND] Search completed successfully:`, data);
      
      // If it's a redirect response, handle it
      if (data.redirect) {
        window.location.href = data.redirect;
        return;
      }
      
      // Check if transaction was found
      if (data.error && data.error.includes("not found")) {
        setNotFoundHash(q);
        setShowNotFoundPopup(true);
      } else if (data.txHash) {
        toast.success("Transaction Found!", {
          description: `Successfully retrieved transaction details from ${selectedChain}`,
          duration: 4000,
          className: "bg-green-500/90 border-green-500/50 text-white",
        });
      }
      
      setJson(data);
    } catch (e: any) {
      console.error(`[FRONTEND] Search failed:`, e);
      if (e.name === 'AbortError') {
        toast.error("Search Timed Out", {
          description: "Search timed out after 3 minutes. Please check your RPC configuration.",
          duration: 6000,
          className: "bg-red-500/90 border-red-500/50 text-white",
        });
        setJson({ error: "Search timed out after 3 minutes. Please check your RPC configuration." });
      } else {
        toast.error("Search Failed", {
          description: e?.message ?? String(e),
          duration: 5000,
          className: "bg-red-500/90 border-red-500/50 text-white",
        });
        setJson({ error: e?.message ?? String(e) });
      }
    } finally {
      setLoading(false);
    }
  }

  const clearSearch = () => {
    setQ("");
    setJson(null);
    setLoading(false);
  };

  const formatTimeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    return `${Math.floor(seconds / 3600)}h ago`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-400';
      case 'pending': return 'text-yellow-400';
      case 'failed': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return '●';
      case 'pending': return '○';
      case 'failed': return '✕';
      default: return '?';
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="bg-gray-900/80 backdrop-blur-sm border-b border-gray-700/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg sm:rounded-xl flex items-center justify-center">
                  <CubeIcon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <h1 className="text-base sm:text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">
                  Zelion Explorer
                </h1>
              </div>
              <div className="hidden sm:block h-6 w-px bg-gray-600"></div>
              <div className="flex items-center space-x-2">
                <GlobeAltIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                <select 
                  value={selectedChain}
                  onChange={(e) => setSelectedChain(e.target.value)}
                  className="bg-gray-800/50 border border-gray-600/50 rounded-lg px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm text-white focus:border-cyan-500/50 focus:outline-none"
                >
                  <option value="arbitrumOne">Arbitrum One</option>
                  <option value="polygonPOS">Polygon PoS</option>
                  <option value="arbitrumSepolia">Arbitrum Sepolia</option>
                  <option value="polygonAmoy">Polygon Amoy</option>
                </select>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full text-green-400 text-xs font-medium">
                Live
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8">
        {/* Stats Grid */}
        {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hover:border-cyan-500/30 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
                <ChartBarIcon className="h-6 w-6 text-white" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-white">{stats.totalTransactions.toLocaleString()}</div>
                <div className="text-sm text-gray-400">Total TXs</div>
              </div>
            </div>
            <div className="text-xs text-gray-400">No data available</div>
          </div>

          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hover:border-purple-500/30 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                <CubeIcon className="h-6 w-6 text-white" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-white">{stats.totalBlocks.toLocaleString()}</div>
                <div className="text-sm text-gray-400">Blocks</div>
              </div>
            </div>
            <div className="text-xs text-gray-400">No data available</div>
          </div>

          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hover:border-green-500/30 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <UserGroupIcon className="h-6 w-6 text-white" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-white">{stats.activeAddresses.toLocaleString()}</div>
                <div className="text-sm text-gray-400">Active Addresses</div>
              </div>
            </div>
            <div className="text-xs text-gray-400">No data available</div>
          </div>

          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hover:border-orange-500/30 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                <CurrencyDollarIcon className="h-6 w-6 text-white" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-white">${stats.totalVolume}M</div>
                <div className="text-sm text-gray-400">Total Volume</div>
              </div>
            </div>
            <div className="text-xs text-gray-400">No data available</div>
          </div>

          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hover:border-yellow-500/30 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center">
                <ClockIcon className="h-6 w-6 text-white" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-white">{stats.averageBlockTime.toFixed(1)}s</div>
                <div className="text-sm text-gray-400">Avg Block Time</div>
              </div>
            </div>
            <div className="text-xs text-gray-400">No data available</div>
          </div>

          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hover:border-red-500/30 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center">
                <FireIcon className="h-6 w-6 text-white" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-white">{stats.networkHashrate} TH/s</div>
                <div className="text-sm text-gray-400">Hashrate</div>
              </div>
            </div>
            <div className="text-xs text-gray-400">No data available</div>
          </div>
        </div> */}

        {/* Search Section */}
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-lg sm:rounded-2xl p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8 shadow-2xl">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">Search the Blockchain</h2>
            <p className="text-sm sm:text-base text-gray-400">Enter a transaction hash, address, or block number to explore</p>
          </div>

          <form onSubmit={onSearch} className="max-w-2xl mx-auto space-y-4 sm:space-y-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400" />
              </div>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="0x1234... (transaction hash, address, or block number)"
                className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 bg-gray-800/50 border border-gray-600/50 rounded-lg sm:rounded-xl text-white placeholder-gray-400 focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 focus:outline-none transition-all duration-200 text-base sm:text-lg"
              />
              
              {/* Clear Search Button */}
              {(json || q) && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 bg-gray-700 hover:bg-gray-600/50 border border-gray-600/50 text-gray-300 hover:text-white transition-all duration-200 p-1.5 sm:p-2 rounded-lg hover:shadow-lg"
                  title="Clear search"
                >
                  <XMarkIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </button>
              )}
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-lg sm:rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-cyan-500/25"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <ArrowPathIcon className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                  <span className="text-sm sm:text-base">Searching...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <MagnifyingGlassIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="text-sm sm:text-base">Search Blockchain</span>
                </div>
              )}
            </button>
          </form>
        </div>

        {/* Transaction Card - Always Visible */}
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-lg sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-2xl">
          <TransactionCard data={json} chain={selectedChain} isLoading={loading} />
        </div>
      </div>

      <TransactionNotFoundPopup
        isOpen={showNotFoundPopup}
        onClose={() => setShowNotFoundPopup(false)}
        transactionHash={notFoundHash}
        chain={selectedChain}
      />
    </div>
  );
}
