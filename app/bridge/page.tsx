import { ArrowLeftIcon, ArrowsRightLeftIcon, ClockIcon, CheckCircleIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

type PageProps = { searchParams: { chain?: string; limit?: string } };

export default async function BridgePage({ searchParams }: PageProps) {
  const chain = searchParams.chain ?? "arbitrumSepolia";
  const limit = searchParams.limit ?? "50";
  const res = await fetch(`/api/bridge/recent?chain=${chain}&limit=${limit}`, { cache: "no-store" });
  const data = await res.json();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "initiated":
        return <ClockIcon className="h-5 w-5 text-yellow-400" />;
      case "received":
        return <CheckCircleIcon className="h-5 w-5 text-green-400" />;
      default:
        return <ExclamationTriangleIcon className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "initiated":
        return "bg-yellow-500/20 border-yellow-500/30 text-yellow-400";
      case "received":
        return "bg-green-500/20 border-green-500/30 text-green-400";
      default:
        return "bg-gray-500/20 border-gray-500/30 text-gray-400";
    }
  };

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
              <ArrowsRightLeftIcon className="h-6 w-6 text-cyan-400" />
              <h1 className="text-2xl font-bold text-white">Bridge Events</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {/* Stats Header */}
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 mb-8 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Recent Bridge Events</h2>
              <p className="text-gray-400">Monitoring cross-chain bridge operations</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="px-4 py-2 bg-cyan-500/20 border border-cyan-500/30 rounded-full text-cyan-400 text-sm font-mono">
                {chain}
              </div>
              <div className="px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-full text-purple-400 text-sm font-mono">
                Limit: {limit}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/30">
              <div className="text-3xl font-bold text-cyan-400 mb-2">{data?.length || 0}</div>
              <div className="text-gray-400">Total Events</div>
            </div>
            <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/30">
              <div className="text-3xl font-bold text-green-400 mb-2">
                {data?.filter((e: any) => e.status === "received")?.length || 0}
              </div>
              <div className="text-gray-400">Completed</div>
            </div>
            <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/30">
              <div className="text-3xl font-bold text-yellow-400 mb-2">
                {data?.filter((e: any) => e.status === "initiated")?.length || 0}
              </div>
              <div className="text-gray-400">Pending</div>
            </div>
          </div>
        </div>

        {/* Bridge Events */}
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 mb-8 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Bridge Events</h2>
            <div className="flex space-x-2">
              <button className="px-4 py-2 bg-gray-800/50 border border-gray-600/50 rounded-lg text-gray-300 hover:bg-gray-700/50 transition-colors text-sm">
                Refresh
              </button>
            </div>
          </div>
          
          {data && data.length > 0 ? (
            <div className="space-y-4">
              {data.map((event: any, index: number) => (
                <div key={index} className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/30 hover:border-cyan-500/30 transition-colors">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                        <ArrowsRightLeftIcon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-white font-semibold">{event.status}</span>
                          {getStatusIcon(event.status)}
                        </div>
                        <div className="text-sm text-gray-400">Bridge Event</div>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(event.status)}`}>
                      {event.status}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="text-sm text-gray-400 mb-2">From Address</div>
                      <div className="text-white font-mono text-sm break-all">{event.from}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400 mb-2">To Address</div>
                      <div className="text-white font-mono text-sm break-all">{event.to}</div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-700/30">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <div className="text-sm text-gray-400 mb-1">Token</div>
                        <div className="text-white font-semibold">{event.token}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-400 mb-1">Amount</div>
                        <div className="text-white font-semibold">{event.amount}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-400 mb-1">Transaction</div>
                        <Link 
                          href={`/tx/${event.txHash}?chain=${chain}`}
                          className="text-cyan-400 hover:text-cyan-300 transition-colors font-mono text-sm break-all"
                        >
                          {event.txHash.slice(0, 8)}...{event.txHash.slice(-6)}
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <ArrowsRightLeftIcon className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <div className="text-gray-400 text-lg">No bridge events found</div>
              <div className="text-gray-500 text-sm">No recent bridge operations on this chain</div>
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
