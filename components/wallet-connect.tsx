"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { WalletIcon, XMarkIcon, ArrowRightIcon } from "@heroicons/react/24/outline"

// Extend Window interface to include ethereum
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>
      on: (event: string, callback: (...args: any[]) => void) => void
      removeListener: (event: string, callback: (...args: any[]) => void) => void
    }
  }
}

interface Wallet {
  id: string
  name: string
  icon: string
  description: string
  isInstalled: boolean
  installUrl?: string
}

const supportedWallets: Wallet[] = [
  {
    id: "metamask",
    name: "MetaMask",
    icon: "🦊",
    description: "Popular Ethereum wallet with multi-chain support",
    isInstalled: true,
  },
  {
    id: "walletconnect",
    name: "WalletConnect",
    icon: "🔗",
    description: "Open protocol for connecting wallets to dApps",
    isInstalled: true,
  },
  {
    id: "coinbase",
    name: "Coinbase Wallet",
    icon: "🪙",
    description: "Secure wallet from Coinbase exchange",
    isInstalled: true,
  },
  {
    id: "trust",
    name: "Trust Wallet",
    icon: "🛡️",
    description: "Multi-chain mobile wallet with DEX integration",
    isInstalled: true,
  },
]

export default function WalletConnect() {
  const [isConnected, setIsConnected] = useState(false)
  const [connectedWallet, setConnectedWallet] = useState<string>("")
  const [showModal, setShowModal] = useState(false)
  const [connecting, setConnecting] = useState(false)

  useEffect(() => {
    // Check if wallet is already connected
    const checkConnection = async () => {
      if (typeof window !== "undefined" && window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: "eth_accounts" })
          if (accounts.length > 0) {
            setIsConnected(true)
            setConnectedWallet("MetaMask")
          }
        } catch (error) {
          console.error("Failed to check wallet connection:", error)
        }
      }
    }

    checkConnection()
  }, [])

  const connectWallet = async (wallet: Wallet) => {
    setConnecting(true)
    try {
      if (wallet.id === "metamask") {
        if (typeof window !== "undefined" && window.ethereum) {
          const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
          if (accounts.length > 0) {
            setIsConnected(true)
            setConnectedWallet(wallet.name)
            setShowModal(false)
          }
        } else {
          window.open("https://metamask.io/download/", "_blank")
        }
      } else {
        // Handle other wallets
        console.log(`Connecting to ${wallet.name}...`)
        // Simulate connection for demo
        setTimeout(() => {
          setIsConnected(true)
          setConnectedWallet(wallet.name)
          setShowModal(false)
        }, 1000)
      }
    } catch (error) {
      console.error(`Failed to connect to ${wallet.name}:`, error)
    } finally {
      setConnecting(false)
    }
  }

  const disconnectWallet = () => {
    setIsConnected(false)
    setConnectedWallet("")
  }

  if (isConnected) {
    return (
      <div className="flex items-center space-x-3">
        <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
          Connected
        </Badge>
        <span className="text-sm text-gray-300">
          Your {connectedWallet} wallet is connected to Zelion Explorer
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={disconnectWallet}
          className="text-gray-400 hover:text-white hover:bg-gray-800"
        >
          <XMarkIcon className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  return (
    <>
      <Button
        onClick={() => setShowModal(true)}
        className="bg-gradient-to-r from-[#00f1fe] to-[#0099cc] hover:from-[#00d4ff] hover:to-[#0077aa] text-white font-medium px-6 py-2 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
      >
        <WalletIcon className="h-5 w-5 mr-2" />
        Connect Wallet
      </Button>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md bg-gray-900 border-gray-700">
            <CardHeader className="text-center">
              <CardTitle className="text-xl text-white">Connect Your Wallet</CardTitle>
              <CardDescription className="text-gray-400">
                Choose a wallet to connect to Zelion Explorer and access advanced features
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {supportedWallets.map((wallet) => (
                <Button
                  key={wallet.id}
                  variant="outline"
                  className="w-full justify-start bg-gray-800 border-gray-600 text-white hover:bg-gray-700 hover:border-[#00f1fe]"
                  onClick={() => connectWallet(wallet)}
                  disabled={connecting}
                >
                  <span className="text-xl mr-3">{wallet.icon}</span>
                  <div className="flex-1 text-left">
                    <div className="font-medium">{wallet.name}</div>
                    <div className="text-sm text-gray-400">{wallet.description}</div>
                  </div>
                  <ArrowRightIcon className="h-4 w-4 text-gray-400" />
                </Button>
              ))}
              <Button
                variant="ghost"
                className="w-full text-gray-400 hover:text-white"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}
