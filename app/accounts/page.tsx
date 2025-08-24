import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  CubeIcon,
  CommandLineIcon,
  UserGroupIcon,
  ScaleIcon,
  BanknotesIcon,
  Cog6ToothIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowPathIcon,
  WalletIcon,
  ShieldCheckIcon,
  StarIcon,
} from "@heroicons/react/24/outline"
import Link from "next/link"
import { SearchBar } from "@/components/search-bar"
import WalletConnect from "@/components/wallet-connect"

export default function AccountsPage() {
  const accounts = [
    {
      address: "5Hj3kLm9Wz3pQr7sT2uV8xY1zA4bC6dE9fG2hI5jK8lM3nO6pQ",
      identity: "Alice Stash",
      type: "Validator",
      balance: "125,847.2345 DOT",
      bonded: "100,000 DOT",
      unbonding: "5,000 DOT",
      reserved: "847.2345 DOT",
      nonce: 1247,
      transactions: 8934,
      lastActive: "2 mins ago",
      judgements: ["Reasonable", "KnownGood"],
      verified: true,
    },
    {
      address: "5Gk2mN7oP1qR4sT6uV9xY2zA5bC7dE0fG3hI6jK9lM4nO8pQ1r",
      identity: "Bob Controller",
      type: "Nominator",
      balance: "45,123.8901 DOT",
      bonded: "40,000 DOT",
      unbonding: "0 DOT",
      reserved: "123.8901 DOT",
      nonce: 567,
      transactions: 2341,
      lastActive: "5 mins ago",
      judgements: ["Reasonable"],
      verified: true,
    },
    {
      address: "5Fm1nO2pQ3rS5tU7vW9xY1zA3bC5dE7fG9hI1jK3lM5nO7pQ9r",
      identity: "Charlie Nominator",
      type: "Regular",
      balance: "12,456.7890 DOT",
      bonded: "10,000 DOT",
      unbonding: "2,000 DOT",
      reserved: "456.7890 DOT",
      nonce: 234,
      transactions: 1567,
      lastActive: "12 mins ago",
      judgements: [],
      verified: false,
    },
    {
      address: "5Hn4oP6qR8sT0uV2wX4yZ6aB8cD0eF2gH4iJ6kL8mN0oP2qR4s",
      identity: "Dave Treasury",
      type: "Treasury",
      balance: "2,847,392.1234 DOT",
      bonded: "0 DOT",
      unbonding: "0 DOT",
      reserved: "847,392.1234 DOT",
      nonce: 89,
      transactions: 456,
      lastActive: "1 hour ago",
      judgements: ["KnownGood", "Reasonable"],
      verified: true,
    },
    {
      address: "5Jm8pQ0rS2tU4vW6xY8zA0bC2dE4fG6hI8jK0lM2nO4pQ6rS8t",
      identity: null,
      type: "Regular",
      balance: "8,234.5678 DOT",
      bonded: "5,000 DOT",
      unbonding: "1,000 DOT",
      reserved: "234.5678 DOT",
      nonce: 123,
      transactions: 789,
      lastActive: "3 hours ago",
      judgements: [],
      verified: false,
    },
  ]

  const getAccountTypeColor = (type: string) => {
    const colors = {
      Validator: "bg-purple-500/20 text-purple-400 border-purple-500/30",
      Nominator: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      Treasury: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      Regular: "bg-gray-500/20 text-gray-400 border-gray-500/30",
    }
    return colors[type as keyof typeof colors] || "bg-gray-500/20 text-gray-400 border-gray-500/30"
  }

  const getAccountTypeIcon = (type: string) => {
    switch (type) {
      case "Validator":
        return <ScaleIcon className="h-4 w-4" />
      case "Nominator":
        return <StarIcon className="h-4 w-4" />
      case "Treasury":
        return <BanknotesIcon className="h-4 w-4" />
      default:
        return <WalletIcon className="h-4 w-4" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Navigation Bar */}
      <nav className="bg-gray-900/80 backdrop-blur-sm border-b border-gray-700/50 px-6 py-4 sticky top-0 z-50">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-[#00f1fe] to-[#0099cc] rounded-lg flex items-center justify-center">
              <CubeIcon className="h-5 w-5 text-white" />
            </div>
            <div className="text-2xl font-bold bg-gradient-to-r from-[#00f1fe] to-white bg-clip-text text-transparent">
              Zelion Explorer
            </div>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/blocks"
              className="flex items-center space-x-2 text-gray-300 hover:text-[#00f1fe] transition-colors group"
            >
              <CubeIcon className="h-4 w-4 group-hover:text-[#00f1fe]" />
              <span>Blocks</span>
            </Link>
            <Link
              href="/extrinsics"
              className="flex items-center space-x-2 text-gray-300 hover:text-[#00f1fe] transition-colors group"
            >
              <CommandLineIcon className="h-4 w-4 group-hover:text-[#00f1fe]" />
              <span>Extrinsics</span>
            </Link>
            <Link href="/accounts" className="flex items-center space-x-2 text-[#00f1fe] transition-colors group">
              <UserGroupIcon className="h-4 w-4" />
              <span>Accounts</span>
            </Link>
            <Link
              href="/validators"
              className="flex items-center space-x-2 text-gray-300 hover:text-[#00f1fe] transition-colors group"
            >
              <ScaleIcon className="h-4 w-4 group-hover:text-[#00f1fe]" />
              <span>Validators</span>
            </Link>
            <Link
              href="/democracy"
              className="flex items-center space-x-2 text-gray-300 hover:text-[#00f1fe] transition-colors group"
            >
              <BanknotesIcon className="h-4 w-4 group-hover:text-[#00f1fe]" />
              <span>Democracy</span>
            </Link>
            <Link
              href="/treasury"
              className="flex items-center space-x-2 text-gray-300 hover:text-[#00f1fe] transition-colors group"
            >
              <Cog6ToothIcon className="h-4 w-4 group-hover:text-[#00f1fe]" />
              <span>Treasury</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <SearchBar />
            <WalletConnect />
          </div>
        </div>
      </nav>

      {/* Page Header */}
      <div className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700/50 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2 flex items-center space-x-3">
                <UserGroupIcon className="h-8 w-8 text-[#00f1fe]" />
                <span>Accounts Explorer</span>
              </h1>
              <p className="text-gray-400">Explore account balances, identities, and transaction history</p>
            </div>
            <div className="flex items-center space-x-4">
              <Select>
                <SelectTrigger className="w-48 bg-gray-800/50 border-gray-700/50">
                  <SelectValue placeholder="All Account Types" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="all">All Account Types</SelectItem>
                  <SelectItem value="validator">Validators</SelectItem>
                  <SelectItem value="nominator">Nominators</SelectItem>
                  <SelectItem value="treasury">Treasury</SelectItem>
                  <SelectItem value="regular">Regular</SelectItem>
                </SelectContent>
              </Select>
              <Button className="bg-[#00f1fe]/20 hover:bg-[#00f1fe]/30 border border-[#00f1fe]/50 text-[#00f1fe] hover:text-white">
                <ArrowPathIcon className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Account Stats */}
      <div className="bg-gray-800/30 backdrop-blur-sm border-b border-gray-700/30 px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {[
              { label: "Total Accounts", value: "1,247,392", accent: true },
              { label: "Active Validators", value: "297", color: "text-purple-400" },
              { label: "Active Nominators", value: "12,847", color: "text-blue-400" },
              { label: "Total Staked", value: "847.2M DOT", color: "text-green-400" },
              { label: "Verified Identities", value: "8,934", color: "text-yellow-400" },
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-gray-900/50 rounded-lg p-4 border border-gray-700/30 hover:border-[#00f1fe]/30 transition-colors"
              >
                <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">{stat.label}</div>
                <div className={`text-lg font-bold ${stat.accent ? "text-[#00f1fe]" : stat.color || "text-white"}`}>
                  {stat.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Accounts Table */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-700/50">
          <CardHeader className="border-b border-gray-700/30 pb-6">
            <div className="flex items-center justify-between">
              <CardTitle className="text-white flex items-center space-x-2">
                <span>Account Directory</span>
                <Badge variant="secondary" className="bg-[#00f1fe]/20 text-[#00f1fe] border-[#00f1fe]/30">
                  Live
                </Badge>
              </CardTitle>
              <div className="flex items-center space-x-4">
                <Select>
                  <SelectTrigger className="w-40 bg-gray-800/50 border-gray-700/50">
                    <SelectValue placeholder="Show 25" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="25">Show 25</SelectItem>
                    <SelectItem value="50">Show 50</SelectItem>
                    <SelectItem value="100">Show 100</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700/30">
                    <th className="text-left py-4 px-6 text-gray-400 font-medium text-xs uppercase tracking-wider">
                      Account
                    </th>
                    <th className="text-left py-4 px-6 text-gray-400 font-medium text-xs uppercase tracking-wider">
                      Type
                    </th>
                    <th className="text-left py-4 px-6 text-gray-400 font-medium text-xs uppercase tracking-wider">
                      Balance
                    </th>
                    <th className="text-left py-4 px-6 text-gray-400 font-medium text-xs uppercase tracking-wider">
                      Bonded
                    </th>
                    <th className="text-left py-4 px-6 text-gray-400 font-medium text-xs uppercase tracking-wider">
                      Reserved
                    </th>
                    <th className="text-left py-4 px-6 text-gray-400 font-medium text-xs uppercase tracking-wider">
                      Transactions
                    </th>
                    <th className="text-left py-4 px-6 text-gray-400 font-medium text-xs uppercase tracking-wider">
                      Last Active
                    </th>
                    <th className="text-left py-4 px-6 text-gray-400 font-medium text-xs uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {accounts.map((account, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-700/20 hover:bg-gray-800/30 transition-colors group"
                    >
                      <td className="py-6 px-6">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#00f1fe] to-[#0099cc] flex items-center justify-center">
                              <div className="w-3 h-3 bg-white rounded-full"></div>
                            </div>
                            <div>
                              {account.identity ? (
                                <div className="flex items-center space-x-2">
                                  <span className="text-white font-semibold">{account.identity}</span>
                                  {account.verified && <ShieldCheckIcon className="h-4 w-4 text-green-400" />}
                                </div>
                              ) : (
                                <span className="text-gray-400 text-sm">No Identity</span>
                              )}
                              <Link
                                href={`/accounts/${account.address}`}
                                className="text-[#00f1fe] hover:text-white transition-colors font-mono text-xs block truncate max-w-64"
                              >
                                {account.address}
                              </Link>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-6 px-6">
                        <Badge variant="secondary" className={getAccountTypeColor(account.type)}>
                          <div className="flex items-center space-x-1">
                            {getAccountTypeIcon(account.type)}
                            <span>{account.type}</span>
                          </div>
                        </Badge>
                      </td>
                      <td className="py-6 px-6">
                        <span className="text-white font-mono text-sm font-semibold">{account.balance}</span>
                      </td>
                      <td className="py-6 px-6">
                        <span className="text-purple-400 font-mono text-sm">{account.bonded}</span>
                      </td>
                      <td className="py-6 px-6">
                        <span className="text-yellow-400 font-mono text-sm">{account.reserved}</span>
                      </td>
                      <td className="py-6 px-6">
                        <Badge variant="secondary" className="bg-gray-700/50 text-gray-300 border-gray-600/50">
                          {account.transactions.toLocaleString()}
                        </Badge>
                      </td>
                      <td className="py-6 px-6">
                        <span className="text-gray-400 text-sm">{account.lastActive}</span>
                      </td>
                      <td className="py-6 px-6">
                        <div className="space-y-1">
                          {account.verified ? (
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                              <span className="text-green-400 text-sm">Verified</span>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                              <span className="text-gray-400 text-sm">Unverified</span>
                            </div>
                          )}
                          {account.judgements.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {account.judgements.map((judgement, idx) => (
                                <Badge
                                  key={idx}
                                  variant="secondary"
                                  className="bg-green-500/20 text-green-400 border-green-500/30 text-xs"
                                >
                                  {judgement}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-8">
          <div className="text-sm text-gray-400">Showing accounts 1 to 25 of 1,247,392 total accounts</div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="bg-gray-800/50 border-gray-700/50 text-gray-300 hover:bg-gray-700/50 hover:text-white"
            >
              <ChevronLeftIcon className="h-4 w-4 mr-2" />
              Previous
            </Button>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, "...", 49896].map((page, index) => (
                <Button
                  key={index}
                  variant={page === 1 ? "default" : "outline"}
                  className={
                    page === 1
                      ? "bg-[#00f1fe] text-black hover:bg-[#00f1fe]/80"
                      : "bg-gray-800/50 border-gray-700/50 text-gray-300 hover:bg-gray-700/50 hover:text-white"
                  }
                  size="sm"
                >
                  {page}
                </Button>
              ))}
            </div>
            <Button
              variant="outline"
              className="bg-gray-800/50 border-gray-700/50 text-gray-300 hover:bg-gray-700/50 hover:text-white"
            >
              Next
              <ChevronRightIcon className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
