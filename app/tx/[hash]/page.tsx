import { ArrowLeftIcon, DocumentTextIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

type PageProps = { params: { hash: string }, searchParams: { chain?: string } };

export default async function TxPage({ params, searchParams }: PageProps) {
  const chain = searchParams.chain ?? "arbitrumOne";
  const res = await fetch(`/api/tx/${params.hash}?chain=${chain}`, { cache: "no-store" });
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
              <DocumentTextIcon className="h-6 w-6 text-cyan-400" />
              <h1 className="text-2xl font-bold text-white">Transaction Details</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {/* Transaction Hash Display */}
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 mb-8 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Transaction Hash</h2>
            <div className="px-3 py-1 bg-cyan-500/20 border border-cyan-500/30 rounded-full text-cyan-400 text-sm font-mono">
              {chain}
            </div>
          </div>
          <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/30">
            <code className="text-lg text-cyan-400 font-mono break-all">{params.hash}</code>
          </div>
        </div>

        {/* Transaction Data */}
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Transaction Data</h2>
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

        {/* Quick Actions */}
        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href={`/address/${data?.from}?chain=${chain}`}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            View From Address
          </Link>
          {data?.to && (
            <Link
              href={`/address/${data.to}?chain=${chain}`}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              View To Address
            </Link>
          )}
          {data?.block && (
            <Link
              href={`/api/block/${data.block}?chain=${chain}`}
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              View Block
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
