import { ArrowLeftIcon, UserIcon, CurrencyDollarIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

type PageProps = { params: { address: string }, searchParams: { chain?: string } };

export default async function AddressPage({ params, searchParams }: PageProps) {
  const chain = searchParams.chain ?? "arbitrumOne";
  const res = await fetch(`/api/address/${params.address}?chain=${chain}`, { cache: "no-store" });
  const data = await res.json();

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex items-center space-x-4">
            <Link 
              href="/" 
              className="flex items-center space-x-2 text-gray-400 hover:text-cyan-400 transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5" />
              <span>Back to Explorer</span>
            </Link>
            <div className="h-6 w-px bg-gray-600"></div>
            <div className="flex items-center space-x-2">
              <UserIcon className="h-6 w-6 text-cyan-400" />
              <h1 className="text-2xl font-bold text-white">Address Details</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {/* Address Display */}
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 mb-8 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Address</h2>
            <div className="px-3 py-1 bg-cyan-500/20 border border-cyan-500/30 rounded-full text-cyan-400 text-sm font-mono">
              {chain}
            </div>
          </div>
          <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/30">
            <code className="text-lg text-cyan-400 font-mono break-all">{params.address}</code>
          </div>
        </div>

        {/* Balances */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 shadow-2xl">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
                <CurrencyDollarIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Native Balance</h3>
                <p className="text-gray-400 text-sm">ETH/MATIC</p>
              </div>
            </div>
            <div className="text-3xl font-bold text-cyan-400">
              {data?.ethBalance || "0.0000"}
            </div>
          </div>

          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 shadow-2xl">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <ArrowPathIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">ZYL Token Balance</h3>
                <p className="text-gray-400 text-sm">ZYL Tokens</p>
              </div>
            </div>
            <div className="text-3xl font-bold text-green-400">
              {data?.zylBalance || "0.0000"}
            </div>
          </div>
        </div>

        {/* Transfer History */}
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 mb-8 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Recent Transfers</h2>
            <div className="text-sm text-gray-400">
              Last {data?.transfers?.length || 0} transfers
            </div>
          </div>
          
          {data?.transfers && data.transfers.length > 0 ? (
            <div className="space-y-4">
              {data.transfers.slice(-10).reverse().map((transfer: any, index: number) => (
                <div key={index} className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/30 hover:border-cyan-500/30 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                        <ArrowPathIcon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-400">Amount</div>
                        <div className="text-white font-semibold">{transfer.human} ZYL</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-400">Block</div>
                      <div className="text-white font-mono">{transfer.block}</div>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-700/30">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">From: </span>
                        <Link 
                          href={`/address/${transfer.from}?chain=${chain}`}
                          className="text-cyan-400 hover:text-cyan-300 transition-colors font-mono"
                        >
                          {transfer.from.slice(0, 8)}...{transfer.from.slice(-6)}
                        </Link>
                      </div>
                      <div>
                        <span className="text-gray-400">To: </span>
                        <Link 
                          href={`/address/${transfer.to}?chain=${chain}`}
                          className="text-cyan-400 hover:text-cyan-300 transition-colors font-mono"
                        >
                          {transfer.to.slice(0, 8)}...{transfer.to.slice(-6)}
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <ArrowPathIcon className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <div className="text-gray-400 text-lg">No transfers found</div>
              <div className="text-gray-500 text-sm">This address hasn't made any ZYL transfers yet</div>
            </div>
          )}
        </div>

        {/* Raw Data */}
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Raw Data</h2>
            <div className="flex space-x-2">
              <button className="px-4 py-2 bg-gray-800/50 border border-gray-600/50 rounded-lg text-gray-300 hover:bg-gray-700/50 transition-colors text-sm">
                Copy JSON
              </button>
            </div>
          </div>
          
          <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/30">
            <pre className="text-sm text-gray-200 overflow-auto max-h-96 font-mono">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
