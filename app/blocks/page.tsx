import { Card, CardContent, CardHeader, CardTitle }  from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
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
} from "@heroicons/react/24/outline"
import Link from "next/link"
import { SearchBar } from "../../components/search-bar"
import WalletConnect from "../../components/wallet-connect"

export default function BlocksPage() {
  const blocks = [
    {
      number: 18589247,
      hash: "0x8a3f...c2e4",
      timestamp: "12 secs ago",
      transactions: 124,
      validatorName: "Zelion Validator 1",
      size: "2.4 MB",
      gasUsed: "12,847,392",
      gasLimit: "15,000,000",
      baseFee: "25.4 Gwei",
      extraData: "0x",
      nonce: 0,
    },
    {
      number: 18589246,
      hash: "0x7b2e...d3f4",
      timestamp: "18 secs ago",
      transactions: 150,
      validatorName: "Staking Pool Alpha",
      size: "3.1 MB",
      gasUsed: "18,765,432",
      gasLimit: "20,000,000",
      baseFee: "30.5 Gwei",
      extraData: "0x1234567890abcdef",
      nonce: 1,
    },
    {
      number: 18589245,
      hash: "0x9c4a...e5f6",
      timestamp: "24 secs ago",
      transactions: 100,
      validatorName: "Validator Node Beta",
      size: "1.8 MB",
      gasUsed: "10,000,000",
      gasLimit: "12,000,000",
      baseFee: "20.0 Gwei",
      extraData: "0x0000000000000000",
      nonce: 2,
    },
    {
      number: 18589244,
      hash: "0x6d5b...f6a7",
      timestamp: "30 secs ago",
      transactions: 170,
      validatorName: "Community Validator",
      size: "4.2 MB",
      gasUsed: "20,000,000",
      gasLimit: "25,000,000",
      baseFee: "35.0 Gwei",
      extraData: "0x1122334455667788",
      nonce: 3,
    },
    {
      number: 18589243,
      hash: "0x3e7c...f4a5",
      timestamp: "36 secs ago",
      transactions: 110,
      validatorName: "Secure Staking Co",
      size: "2.9 MB",
      gasUsed: "15,000,000",
      gasLimit: "18,000,000",
      baseFee: "28.0 Gwei",
      extraData: "0x9988776655443322",
      nonce: 4,
    },
  ]

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
            <Link href="/blocks" className="flex items-center space-x-2 text-[#00f1fe] transition-colors group">
              <CubeIcon className="h-4 w-4" />
              <span>Blocks</span>
            </Link>
            <Link
              href="/extrinsics"
              className="flex items-center space-x-2 text-gray-300 hover:text-[#00f1fe] transition-colors group"
            >
              <CommandLineIcon className="h-4 w-4 group-hover:text-[#00f1fe]" />
              <span>Extrinsics</span>
            </Link>
            <Link
              href="/accounts"
              className="flex items-center space-x-2 text-gray-300 hover:text-[#00f1fe] transition-colors group"
            >
              <UserGroupIcon className="h-4 w-4 group-hover:text-[#00f1fe]" />
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
                <CubeIcon className="h-8 w-8 text-[#00f1fe]" />
                <span>Blocks Explorer</span>
              </h1>
              <p className="text-gray-400">Browse and analyze Zelion blockchain blocks in real-time</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button className="bg-[#00f1fe]/20 hover:bg-[#00f1fe]/30 border border-[#00f1fe]/50 text-[#00f1fe] hover:text-white">
                <ArrowPathIcon className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Blocks Table */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-700/50">
          <CardHeader className="border-b border-gray-700/30 pb-6">
            <div className="flex items-center justify-between">
              <CardTitle className="text-white flex items-center space-x-2">
                <span>Latest Blocks</span>
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
                      Block Number
                    </th>
                    <th className="text-left py-4 px-6 text-gray-400 font-medium text-xs uppercase tracking-wider">
                      Timestamp
                    </th>
                    <th className="text-left py-4 px-6 text-gray-400 font-medium text-xs uppercase tracking-wider">
                      Extrinsics
                    </th>
                    <th className="text-left py-4 px-6 text-gray-400 font-medium text-xs uppercase tracking-wider">
                      Events
                    </th>
                    <th className="text-left py-4 px-6 text-gray-400 font-medium text-xs uppercase tracking-wider">
                      Validator
                    </th>
                    <th className="text-left py-4 px-6 text-gray-400 font-medium text-xs uppercase tracking-wider">
                      Size
                    </th>
                    <th className="text-left py-4 px-6 text-gray-400 font-medium text-xs uppercase tracking-wider">
                      Weight
                    </th>
                    <th className="text-left py-4 px-6 text-gray-400 font-medium text-xs uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {blocks.map((block, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-700/20 hover:bg-gray-800/30 transition-colors group"
                    >
                      <td className="py-6 px-6">
                        <div className="space-y-1">
                          <Link
                            href={`/blocks/${block.number}`}
                            className="text-[#00f1fe] hover:text-white transition-colors font-mono text-lg font-semibold"
                          >
                            {block.number}
                          </Link>
                          <div className="text-xs text-gray-400">{block.timestamp}</div>
                        </div>
                      </td>
                      <td className="py-6 px-6">
                        <div className="text-gray-300 font-mono text-sm">{block.hash}</div>
                      </td>
                      <td className="py-6 px-6">
                        <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                          {block.transactions}
                        </Badge>
                      </td>
                      <td className="py-6 px-6">
                        <Badge variant="secondary" className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                          {/* Events are not directly available in this block structure, so we'll leave it empty or remove if not needed */}
                          {/* {block.events} */}
                        </Badge>
                      </td>
                      <td className="py-6 px-6">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#00f1fe] to-[#0099cc] flex items-center justify-center">
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            </div>
                            <span className="text-gray-300 font-mono text-sm">{block.validatorName}</span>
                          </div>
                          {/* <div className="text-xs text-gray-400 ml-8">{block.validatorName}</div> */}
                        </div>
                      </td>
                      <td className="py-6 px-6">
                        <span className="text-gray-300 font-mono text-sm">{block.size}</span>
                      </td>
                      <td className="py-6 px-6">
                        <span className="text-gray-300 font-mono text-sm">Gas: {block.gasUsed}/{block.gasLimit}</span>
                        <br />
                        <span className="text-gray-300 font-mono text-sm">Base Fee: {block.baseFee}</span>
                      </td>
                      <td className="py-6 px-6">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <span className="text-green-400 text-sm">Finalized</span>
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
          <div className="text-sm text-gray-400">
            Showing blocks 18,589,243 to 18,589,247 of 18,589,247 total blocks
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="bg-gray-800/50 border-gray-700/50 text-gray-300 hover:bg-gray-700/50 hover:text-white"
            >
              <ChevronLeftIcon className="h-4 w-4 mr-2" />
              Previous
            </Button>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, "...", 1000].map((page, index) => (
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