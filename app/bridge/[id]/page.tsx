"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ArrowsRightLeftIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClipboardDocumentIcon,
} from "@heroicons/react/24/outline"
import Link from "next/link"
import { formatAddress, formatTimeAgo, getStatusBadgeClass, getChainName } from "@/lib/blockchain"

interface BridgeTransferDetails {
  id: string
  txHash: string
  sourceChain: string
  destChain: string
  sourceAddress: string
  destAddress: string
  amount: string
  token: string
  status: string
  timestamp: number
  confirmations: number
  bridgeFee: string
  estimatedTime: string
  errorReason?: string
}

export default function BridgeTransferPage({ params }: { params: { id: string } }) {
  const [transfer, setTransfer] = useState<BridgeTransferDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchTransferDetails() {
      try {
        // TODO: Implement real API call to fetch bridge transfer details
        // For now, we'll show an error state until the endpoint is implemented
        setError("Bridge transfer details endpoint not yet implemented")
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch transfer details")
      } finally {
        setLoading(false)
      }
    }

    fetchTransferDetails()
  }, [params.id])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-800 rounded w-1/3"></div>
            <div className="h-64 bg-gray-800 rounded"></div>
            <div className="h-48 bg-gray-800 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !transfer) {
    return (
      <div className="min-h-screen bg-gray-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <Card className="bg-gray-900/50 border-red-500/30">
            <CardContent className="p-8 text-center">
              <div className="text-red-400 text-lg font-semibold mb-2">Bridge Transfer Not Found</div>
              <div className="text-gray-400 mb-4">{error}</div>
              <Link href="/bridge">
                <Button
                  variant="outline"
                  className="border-[#00f1fe]/30 text-[#00f1fe] hover:bg-[#00f1fe]/10 bg-transparent"
                >
                  Back to Bridge
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-gray-400 mb-4">
            <Link href="/" className="hover:text-[#00f1fe] transition-colors">
              Explorer
            </Link>
            <span>/</span>
            <Link href="/bridge" className="hover:text-[#00f1fe] transition-colors">
              Bridge
            </Link>
            <span>/</span>
            <span className="text-white">{transfer.id}</span>
          </div>
          <div className="flex items-center space-x-3">
            <ArrowsRightLeftIcon className="h-8 w-8 text-[#00f1fe]" />
            <h1 className="text-2xl sm:text-3xl font-bold">Bridge Transfer Details</h1>
            <Badge className={getStatusBadgeClass(transfer.status)}>{transfer.status}</Badge>
          </div>
        </div>

        {/* Transfer Overview */}
        <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-700/50 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ArrowsRightLeftIcon className="h-5 w-5 text-[#00f1fe]" />
              <span>Transfer Overview</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-gray-700/30">
                  <span className="text-gray-400">Transfer ID</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-sm">{transfer.id}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(transfer.id)}
                      className="h-6 w-6 p-0 hover:bg-gray-800"
                    >
                      <ClipboardDocumentIcon className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-gray-700/30">
                  <span className="text-gray-400">Status</span>
                  <div className="flex items-center space-x-2">
                    {transfer.status === "confirmed" && <CheckCircleIcon className="h-4 w-4 text-green-400" />}
                    {transfer.status === "pending" && <ClockIcon className="h-4 w-4 text-yellow-400" />}
                    {transfer.status === "failed" && <ExclamationTriangleIcon className="h-4 w-4 text-red-400" />}
                    <Badge className={getStatusBadgeClass(transfer.status)}>{transfer.status}</Badge>
                  </div>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-gray-700/30">
                  <span className="text-gray-400">Route</span>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                      {getChainName(transfer.sourceChain)}
                    </Badge>
                    <ArrowsRightLeftIcon className="h-4 w-4 text-[#00f1fe]" />
                    <Badge variant="secondary" className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                      {getChainName(transfer.destChain)}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-gray-700/30">
                  <span className="text-gray-400">Amount</span>
                  <div className="text-right">
                    <div className="font-semibold text-[#00f1fe]">
                      {transfer.amount} {transfer.token}
                    </div>
                    <div className="text-xs text-gray-500">
                      ≈ ${(Number.parseFloat(transfer.amount) * 0.245).toFixed(2)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-gray-700/30">
                  <span className="text-gray-400">Bridge Fee</span>
                  <Badge variant="secondary" className="bg-gray-700/50 text-gray-300 border-gray-600/50">
                    {transfer.bridgeFee} ZYL
                  </Badge>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-gray-700/30">
                  <span className="text-gray-400">Transaction Hash</span>
                  <div className="flex items-center space-x-2">
                    <Link
                      href={`/tx/${transfer.txHash}`}
                      className="text-[#00f1fe] hover:text-white transition-colors font-mono text-sm"
                    >
                      {formatAddress(transfer.txHash)}
                    </Link>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(transfer.txHash)}
                      className="h-6 w-6 p-0 hover:bg-gray-800"
                    >
                      <ClipboardDocumentIcon className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-gray-700/30">
                  <span className="text-gray-400">From Address</span>
                  <div className="flex items-center space-x-2">
                    <Link
                      href={`/address/${transfer.sourceAddress}`}
                      className="text-[#00f1fe] hover:text-white transition-colors font-mono text-sm"
                    >
                      {formatAddress(transfer.sourceAddress)}
                    </Link>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(transfer.sourceAddress)}
                      className="h-6 w-6 p-0 hover:bg-gray-800"
                    >
                      <ClipboardDocumentIcon className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-gray-700/30">
                  <span className="text-gray-400">To Address</span>
                  <div className="flex items-center space-x-2">
                    <Link
                      href={`/address/${transfer.destAddress}`}
                      className="text-[#00f1fe] hover:text-white transition-colors font-mono text-sm"
                    >
                      {formatAddress(transfer.destAddress)}
                    </Link>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(transfer.destAddress)}
                      className="h-6 w-6 p-0 hover:bg-gray-800"
                    >
                      <ClipboardDocumentIcon className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-gray-700/30">
                  <span className="text-gray-400">Timestamp</span>
                  <div className="text-right">
                    <div className="text-sm">{formatTimeAgo(transfer.timestamp)}</div>
                    <div className="text-xs text-gray-500">{new Date(transfer.timestamp).toLocaleString()}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-gray-700/30">
                  <span className="text-gray-400">Confirmations</span>
                  <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
                    {transfer.confirmations}
                  </Badge>
                </div>
              </div>
            </div>

            {transfer.errorReason && (
              <div className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
                  <span className="text-red-400 font-semibold">Transfer Failed</span>
                </div>
                <div className="text-sm text-gray-300">{transfer.errorReason}</div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
