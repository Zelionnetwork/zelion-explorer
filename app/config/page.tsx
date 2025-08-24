"use client"

import { useState, useEffect } from "react"
import { CheckCircleIcon, ExclamationTriangleIcon, InformationCircleIcon } from "@heroicons/react/24/outline"
import Link from "next/link"
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"

interface ConfigStatus {
  valid: boolean
  missing: string[]
  networks: string[]
  totalRequired: number
  configuredCount: number
  missingCount: number
}

export default function ConfigPage() {
  const [configStatus, setConfigStatus] = useState<ConfigStatus | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkConfig()
  }, [])

  const checkConfig = async () => {
    try {
      const response = await fetch("/api/config/status")
      if (response.ok) {
        const data = await response.json()
        setConfigStatus(data)
      }
    } catch (error) {
      console.error("Failed to check config status:", error)
    } finally {
      setLoading(false)
    }
  }

  const requiredVars = [
    {
      name: "ALCHEMY_ARBITRUM_SEPOLIA_WS",
      description: "Arbitrum Sepolia testnet RPC endpoint",
      example: "wss://arb-sepolia.g.alchemy.com/v2/LvgLMgXMdScfkKOiooWoS",
      network: "arbitrum-sepolia"
    },
    {
      name: "ALCHEMY_POLYGON_AMOY_WS", 
      description: "Polygon Amoy testnet RPC endpoint",
      example: "wss://polygon-amoy.g.alchemy.com/v2/LvgLMgXMdScfkKOiooWoS",
      network: "polygon-amoy"
    },
    {
      name: "ALCHEMY_ARBITRUM_ONE_WS",
      description: "Arbitrum One mainnet RPC endpoint", 
      example: "wss://arb-mainnet.g.alchemy.com/v2/LvgLMgXMdScfkKOiooWoS",
      network: "arbitrum-one"
    },
    {
      name: "ALCHEMY_POLYGON_POS_WS",
      description: "Polygon POS mainnet RPC endpoint",
      example: "wss://polygon-mainnet.g.alchemy.com/v2/LvgLMgXMdScfkKOiooWoS", 
      network: "polygon-pos"
    }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white p-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded w-64 mb-6"></div>
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-32 bg-gray-800 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Configuration</h1>
          <p className="text-gray-400">
            Set up your environment variables to connect to supported blockchain networks
          </p>
        </div>

        {/* Configuration Status */}
        {configStatus && (
          <Card className="mb-8 bg-gray-900/50 border-gray-700/50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <InformationCircleIcon className="h-5 w-5 text-[#00f1fe]" />
                <span>Configuration Status</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{configStatus.totalRequired}</div>
                  <div className="text-sm text-gray-400">Required</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">{configStatus.configuredCount}</div>
                  <div className="text-sm text-gray-400">Configured</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-400">{configStatus.missingCount}</div>
                  <div className="text-sm text-gray-400">Missing</div>
                </div>
              </div>
              
              {configStatus.valid ? (
                <Alert className="border-green-500/30 bg-green-500/10">
                  <CheckCircleIcon className="h-4 w-4 text-green-500" />
                  <AlertTitle className="text-green-500">All Set!</AlertTitle>
                  <AlertDescription className="text-green-400">
                    Your configuration is complete. All {configStatus.totalRequired} required environment variables are set.
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert className="border-yellow-500/30 bg-yellow-500/10">
                  <ExclamationTriangleIcon className="h-4 w-4 text-yellow-500" />
                  <AlertTitle className="text-yellow-500">Configuration Required</AlertTitle>
                  <AlertDescription className="text-yellow-400">
                    You need to configure {configStatus.missingCount} more environment variables to use all features.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        )}

        {/* Setup Instructions */}
        <Card className="mb-8 bg-gray-900/50 border-gray-700/50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <InformationCircleIcon className="h-5 w-5 text-[#00f1fe]" />
              <span>Setup Instructions</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gray-800/50 rounded-lg p-4">
              <h3 className="font-semibold text-white mb-2">1. Get Alchemy API Keys</h3>
              <p className="text-gray-400 mb-3">
                Visit <a href="https://www.alchemy.com/" target="_blank" rel="noopener noreferrer" className="text-[#00f1fe] hover:underline">Alchemy</a> and create apps for each network you want to support.
              </p>
              <Button asChild variant="outline" size="sm">
                <a href="https://www.alchemy.com/" target="_blank" rel="noopener noreferrer">
                  Get API Keys
                </a>
              </Button>
            </div>

            <div className="bg-gray-800/50 rounded-lg p-4">
              <h3 className="font-semibold text-white mb-2">2. Create Environment File</h3>
              <p className="text-gray-400 mb-3">
                Create a <code className="bg-gray-700 px-2 py-1 rounded text-sm">.env.local</code> file in your project root.
              </p>
              <Button asChild variant="outline" size="sm">
                <a href="/config/env.example" target="_blank" rel="noopener noreferrer">
                  View Template
                </a>
              </Button>
            </div>

            <div className="bg-gray-800/50 rounded-lg p-4">
              <h3 className="font-semibold text-white mb-2">3. Run Setup Script</h3>
              <p className="text-gray-400 mb-3">
                Use the provided setup script to verify your configuration.
              </p>
              <code className="bg-gray-700 px-3 py-2 rounded text-sm block">
                pnpm setup
              </code>
            </div>
          </CardContent>
        </Card>

        {/* Required Variables */}
        <Card className="mb-8 bg-gray-900/50 border-gray-700/50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <InformationCircleIcon className="h-5 w-5 text-[#00f1fe]" />
              <span>Required Environment Variables</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {requiredVars.map((variable) => {
                const isConfigured = configStatus?.networks.includes(variable.network)
                const isMissing = configStatus?.missing.includes(variable.name)
                
                return (
                  <div key={variable.name} className="border border-gray-700/50 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-mono text-white text-sm">{variable.name}</h3>
                        <p className="text-gray-400 text-sm">{variable.description}</p>
                      </div>
                      <Badge 
                        variant={isConfigured ? "default" : "destructive"}
                        className={isConfigured ? "bg-green-500/20 text-green-400 border-green-500/30" : ""}
                      >
                        {isConfigured ? "Configured" : "Missing"}
                      </Badge>
                    </div>
                    <div className="bg-gray-800/50 rounded p-3">
                      <code className="text-gray-300 text-sm">{variable.example}</code>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={checkConfig}>
            Recheck Configuration
          </Button>
          <Button asChild>
            <Link href="/">
              Back to Explorer
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
