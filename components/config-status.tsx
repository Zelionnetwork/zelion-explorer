"use client"

import { useState, useEffect } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircleIcon, ExclamationTriangleIcon, XCircleIcon } from "@heroicons/react/24/outline"

interface ConfigStatus {
  valid: boolean
  missing: string[]
  networks: string[]
}

export function ConfigStatus() {
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

  if (loading) {
    return (
      <Alert className="mb-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-700 rounded w-32 mb-2"></div>
          <div className="h-3 bg-gray-700 rounded w-48"></div>
        </div>
      </Alert>
    )
  }

  if (!configStatus) {
    return null
  }

  if (configStatus.valid) {
    return (
      <Alert className="mb-6 border-green-500/30 bg-green-500/10">
        <CheckCircleIcon className="h-4 w-4 text-green-500" />
        <AlertTitle className="text-green-500">Configuration Complete</AlertTitle>
        <AlertDescription className="text-green-400">
          All required environment variables are configured. Supporting networks:{" "}
          {configStatus.networks.map((network, index) => (
            <Badge key={network} variant="secondary" className="ml-1 bg-green-500/20 text-green-400 border-green-500/30">
              {network}
            </Badge>
          ))}
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Alert className="mb-6 border-yellow-500/30 bg-yellow-500/10">
      <ExclamationTriangleIcon className="h-4 w-4 text-yellow-500" />
      <AlertTitle className="text-yellow-500">Configuration Required</AlertTitle>
      <AlertDescription className="text-yellow-400">
        <div className="mb-3">
          Missing environment variables: {configStatus.missing.length}/{configStatus.missing.length + configStatus.networks.length}
        </div>
        <div className="mb-3">
          <strong>Missing:</strong>
          <div className="mt-1 space-y-1">
            {configStatus.missing.map((varName) => (
              <Badge key={varName} variant="destructive" className="mr-1">
                {varName}
              </Badge>
            ))}
          </div>
        </div>
        <div className="mb-3">
          <strong>Configured:</strong>
          <div className="mt-1">
            {configStatus.networks.length > 0 ? (
              configStatus.networks.map((network) => (
                <Badge key={network} variant="secondary" className="mr-1 bg-green-500/20 text-green-400 border-green-500/30">
                  {network}
                </Badge>
              ))
            ) : (
              <span className="text-yellow-300">None</span>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2 mt-4">
          <Button variant="outline" size="sm" onClick={checkConfig}>
            Recheck
          </Button>
          <Button variant="outline" size="sm" asChild>
            <a href="/config/env.example" target="_blank" rel="noopener noreferrer">
              View Template
            </a>
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  )
}
