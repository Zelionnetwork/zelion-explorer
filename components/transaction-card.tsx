"use client";

import { 
  CheckCircleIcon, 
  XCircleIcon, 
  ClockIcon,
  DocumentTextIcon,
  UserIcon,
  BuildingOfficeIcon,
  FireIcon,
  CalendarIcon,
  ArrowPathIcon
    } from "@heroicons/react/24/outline";
    import { formatAddress, formatTimeAgo, getStatusColor, getStatusBadgeClass } from "../lib/blockchain";

interface TransactionData {
  status?: 'success' | 'pending' | 'failed';
  block?: number | null;
  from?: string;
  to?: string;
  gasUsed?: string | null;
  events?: any[];
  txHash?: string;
  error?: string; // Added for error handling
}

interface TransactionCardProps {
  data?: TransactionData;
  chain: string;
  isLoading?: boolean;
}

export function TransactionCard({ data, chain, isLoading = false }: TransactionCardProps) {
  // Check if we have actual transaction data
  const hasData = data && data.txHash && data.from && data.to;
  
  // Check if there was an error (like transaction not found)
  const hasError = data && data.error;
  
  // Default values for placeholder state
  const displayData = {
    status: data?.status || 'pending',
    block: data?.block || null,
    from: data?.from || '0x0000000000000000000000000000000000000000',
    to: data?.to || '0x0000000000000000000000000000000000000000',
    gasUsed: data?.gasUsed || null,
    events: data?.events || [],
    txHash: data?.txHash || '0x0000000000000000000000000000000000000000000000000000000000000000'
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'failed':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      case 'pending':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'success':
        return 'Confirmed';
      case 'failed':
        return 'Failed';
      case 'pending':
        return hasData ? 'Pending' : 'Ready to Search';
      default:
        return 'Ready to Search';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-2 sm:px-0">
      {/* Header */}
      <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-lg sm:rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6 shadow-2xl">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <img 
              src="/zelion-logo.png" 
              alt="Zelion Logo" 
              className="h-6 w-6 sm:h-8 sm:w-8"
            />
            <div>
              <h1 className="text-lg sm:text-2xl font-bold text-white">
                {hasData ? 'Transaction Details' : 'Transaction Explorer'}
              </h1>
              <p className="text-xs sm:text-sm text-gray-400">
                {hasData ? `Chain: ${chain}` : 'Search for a transaction to view details'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className={`px-2 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold ${getStatusBadgeClass(displayData.status)}`}>
              <div className="flex items-center space-x-1 sm:space-x-2">
                {isLoading ? (
                  <>
                    <ArrowPathIcon className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                    <span className="hidden sm:inline">Searching...</span>
                    <span className="sm:hidden">...</span>
                  </>
                ) : (
                  <>
                    {getStatusIcon(displayData.status)}
                    <span className="hidden sm:inline">{getStatusText(displayData.status)}</span>
                    <span className="sm:hidden">{getStatusText(displayData.status).split(' ')[0]}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Transaction Hash */}
        <div className="bg-gray-800/30 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-700/30">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm text-gray-400 font-medium">Transaction Hash</span>
            {hasData && (
              <button 
                className="text-cyan-400 hover:text-cyan-300 transition-colors p-1.5 sm:p-2 rounded-lg hover:bg-cyan-500/10"
                onClick={() => navigator.clipboard.writeText(displayData.txHash)}
                title="Copy transaction hash"
              >
                <DocumentTextIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </button>
            )}
          </div>
          <code className={`text-sm sm:text-lg font-mono break-all mt-2 block ${
            hasData ? 'text-cyan-400' : 'text-gray-500'
          }`}>
            {hasData ? displayData.txHash : (
              isLoading ? (
                <span className="animate-pulse">Searching for transaction...</span>
              ) : (
                'Enter a transaction hash to search...'
              )
            )}
          </code>
        </div>
      </div>

      {/* Transaction Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-6 mb-4 sm:mb-6">
        {/* From Address */}
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-lg sm:rounded-2xl p-4 sm:p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <UserIcon className="h-5 w-5 sm:h-6 sm:w-6 text-blue-400" />
              <h3 className="text-base sm:text-lg font-semibold text-white">From Address</h3>
            </div>
            {hasData && (
              <button
                onClick={() => navigator.clipboard.writeText(displayData.from)}
                className="text-blue-400 hover:text-blue-300 transition-colors p-1.5 sm:p-2 rounded-lg hover:bg-blue-500/10"
                title="Copy from address"
              >
                <DocumentTextIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </button>
            )}
          </div>
          <div className="bg-gray-800/30 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-700/30">
            <code className={`text-sm sm:text-lg font-mono break-all ${
              hasData ? 'text-blue-400' : 'text-gray-500'
            }`}>
              {hasData ? formatAddress(displayData.from) : (
                isLoading ? (
                  <span className="animate-pulse">Searching...</span>
                ) : (
                  'Waiting for transaction data...'
                )
              )}
            </code>
          </div>
        </div>

        {/* To Address */}
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-lg sm:rounded-2xl p-4 sm:p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <BuildingOfficeIcon className="h-5 w-5 sm:h-6 sm:w-6 text-green-400" />
              <h3 className="text-base sm:text-lg font-semibold text-white">To Address</h3>
            </div>
            {hasData && (
              <button
                onClick={() => navigator.clipboard.writeText(displayData.to)}
                className="text-green-400 hover:text-green-300 transition-colors p-1.5 sm:p-2 rounded-lg hover:bg-green-500/10"
                title="Copy to address"
              >
                <DocumentTextIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </button>
            )}
          </div>
          <div className="bg-gray-800/30 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-700/30">
            <code className={`text-sm sm:text-lg font-mono break-all ${
              hasData ? 'text-green-400' : 'text-gray-500'
            }`}>
              {hasData ? formatAddress(displayData.to) : (
                isLoading ? (
                  <span className="animate-pulse">Searching...</span>
                ) : (
                  'Waiting for transaction data...'
                )
              )}
            </code>
          </div>
        </div>
      </div>

      {/* Transaction Details */}
      <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-lg sm:rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6 shadow-2xl">
        <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">Transaction Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
          {/* Block Number */}
          <div className="bg-gray-800/30 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-700/30">
            <div className="flex items-center space-x-2 mb-2">
              <CalendarIcon className="h-4 w-4 sm:h-5 sm:w-5 text-purple-400" />
              <span className="text-xs sm:text-sm text-gray-400 font-medium">Block Number</span>
            </div>
            <div className={`text-lg sm:text-xl font-bold ${
              hasData ? 'text-white' : 'text-gray-500'
            }`}>
              {hasData ? (displayData.block ? displayData.block.toLocaleString() : 'Pending') : '—'}
            </div>
          </div>

          {/* Gas Used */}
          <div className="bg-gray-800/30 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-700/30">
            <div className="flex items-center space-x-2 mb-2">
              <FireIcon className="h-4 w-4 sm:h-5 sm:w-5 text-orange-400" />
              <span className="text-xs sm:text-sm text-gray-400 font-medium">Gas Used</span>
            </div>
            <div className={`text-lg sm:text-xl font-bold ${
              hasData ? 'text-white' : 'text-gray-500'
            }`}>
              {hasData ? (displayData.gasUsed ? parseInt(displayData.gasUsed).toLocaleString() : 'N/A') : '—'}
            </div>
          </div>

          {/* Events Count */}
          <div className="bg-gray-800/30 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-700/30">
            <div className="flex items-center space-x-2 mb-2">
              <DocumentTextIcon className="h-4 w-4 sm:h-5 sm:w-5 text-cyan-400" />
              <span className="text-xs sm:text-sm text-gray-400 font-medium">Events</span>
            </div>
            <div className={`text-lg sm:text-xl font-bold ${
              hasData ? 'text-white' : 'text-gray-500'
            }`}>
              {hasData ? displayData.events.length : '—'}
            </div>
          </div>
        </div>
      </div>

      {/* Events Section - Only show when there are events */}
      {hasData && displayData.events.length > 0 && (
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-lg sm:rounded-2xl p-4 sm:p-6 shadow-2xl">
          <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">Events ({displayData.events.length})</h3>
          <div className="space-y-2 sm:space-y-3">
            {displayData.events.map((event, index) => (
              <div key={index} className="bg-gray-800/30 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-700/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs sm:text-sm font-medium text-cyan-400">{event.event}</span>
                  <span className="text-xs text-gray-500">Log #{event.logIndex}</span>
                </div>
                <div className="text-xs sm:text-sm text-gray-300">
                  <span className="text-gray-500">Contract: </span>
                  <code className="text-blue-400">{formatAddress(event.address)}</code>
                </div>
                {event.args && Object.keys(event.args).length > 0 && (
                  <div className="mt-2 text-xs sm:text-sm text-gray-300">
                    <span className="text-gray-500">Arguments: </span>
                    <pre className="text-xs text-gray-400 mt-1 overflow-x-auto">
                      {JSON.stringify(event.args, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State Message */}
      {!hasData && !hasError && (
        <div className="text-center py-8 sm:py-12">
          <img 
            src="/zelion-logo.png" 
            alt="Zelion Logo" 
            className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-3 sm:mb-4 opacity-60"
          />
          <div className="text-gray-400 text-base sm:text-lg">Ready to Explore</div>
          <div className="text-gray-500 text-xs sm:text-sm">Enter a transaction hash above to view detailed information</div>
        </div>
      )}

      {/* Error Message */}
      {hasError && (
        <div className="text-center py-8 sm:py-12">
          <XCircleIcon className="h-12 w-12 sm:h-16 sm:w-16 text-red-500 mx-auto mb-3 sm:mb-4" />
          <div className="text-gray-400 text-base sm:text-lg">Transaction Not Found</div>
          <div className="text-gray-500 text-xs sm:text-sm mb-3 sm:mb-4">
            The transaction with hash <code className="text-red-400 font-mono text-xs sm:text-sm">{data?.txHash || 'unknown'}</code> was not found on {chain}.
          </div>
          <div className="text-gray-600 text-xs">
            This could mean the transaction doesn't exist, hasn't been mined yet, or you're searching on the wrong chain.
          </div>
        </div>
      )}
    </div>
  );
}
