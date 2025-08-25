"use client";

import { XMarkIcon, ExclamationTriangleIcon, CheckCircleIcon, InformationCircleIcon } from "@heroicons/react/24/outline";

interface TransactionNotFoundPopupProps {
  isOpen: boolean;
  onClose: () => void;
  transactionHash: string;
  chain: string;
}

export function TransactionNotFoundPopup({ isOpen, onClose, transactionHash, chain }: TransactionNotFoundPopupProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4">
      <div className="bg-gray-900/95 backdrop-blur-sm border border-gray-700/50 rounded-lg sm:rounded-2xl p-4 sm:p-6 lg:p-8 max-w-sm sm:max-w-md w-full shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <img 
              src="/zelion-logo.png" 
              alt="Zelion Logo" 
              className="h-6 w-6 sm:h-8 sm:w-8 opacity-80"
            />
            <h2 className="text-lg sm:text-xl font-bold text-white">Transaction Not Found</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-gray-800/50"
          >
            <XMarkIcon className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-3 sm:space-y-4">
          <p className="text-sm sm:text-base text-gray-300">
            The transaction with hash <code className="text-yellow-400 font-mono text-xs sm:text-sm bg-gray-800/50 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">
              {transactionHash.slice(0, 8)}...{transactionHash.slice(-6)}
            </code> was not found on <span className="text-cyan-400 font-semibold">{chain}</span>.
          </p>

          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg sm:rounded-xl p-3 sm:p-4">
            <div className="flex items-start space-x-2 sm:space-x-3">
              <InformationCircleIcon className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
              <div className="text-xs sm:text-sm text-yellow-200">
                <p className="font-semibold mb-1.5 sm:mb-2">Please check the following:</p>
                <ul className="space-y-0.5 sm:space-y-1 text-yellow-100">
                  <li>• Confirm the transaction hash is correct</li>
                  <li>• Verify you're searching on the right chain</li>
                  <li>• The transaction may not have been mined yet</li>
                  <li>• The transaction might be on a different network</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg sm:rounded-xl p-3 sm:p-4">
            <div className="flex items-start space-x-2 sm:space-x-3">
              <CheckCircleIcon className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500 mt-0.5 flex-shrink-0" />
              <div className="text-xs sm:text-sm text-blue-200">
                <p className="font-semibold mb-1">Tips:</p>
                <ul className="space-y-0.5 sm:space-y-1 text-blue-100">
                  <li>• Copy the hash from your wallet or block explorer</li>
                  <li>• Double-check the chain selection above</li>
                  <li>• Try searching on other supported chains</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 mt-4 sm:mt-6">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-700/50 hover:bg-gray-600/50 border border-gray-600/50 text-white font-semibold py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg sm:rounded-xl transition-all duration-200 text-sm sm:text-base"
          >
            Got it
          </button>
          <button
            onClick={() => {
              navigator.clipboard.writeText(transactionHash);
              onClose();
            }}
            className="flex-1 bg-blue-600/50 hover:bg-blue-500/50 border border-blue-500/50 text-white font-semibold py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg sm:rounded-xl transition-all duration-200 text-sm sm:text-base"
          >
            Copy Hash
          </button>
        </div>
      </div>
    </div>
  );
}
