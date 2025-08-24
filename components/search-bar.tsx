"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline"
import { useRouter } from "next/navigation"

interface SearchBarProps {
  className?: string
}

export function SearchBar({ className }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const router = useRouter()

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setIsSearching(true)
    console.log("[v0] Search initiated:", { query: searchQuery })

    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery.trim())}`)

      if (response.ok) {
        const result = await response.json()
        console.log("[v0] Search result:", result)

        if (result.redirectPath) {
          router.push(result.redirectPath)
        } else {
          // Show suggestions or error message
          console.log("[v0] No direct match found. Suggestions:", result.suggestions)
          // For now, just alert the user
          alert(`No match found for "${searchQuery}". ${result.suggestions?.join(", ") || ""}`)
        }
      } else {
        console.error("[v0] Search API error:", response.status)
        alert("Search failed. Please try again.")
      }
    } catch (error) {
      console.error("[v0] Search error:", error)
      alert("Search failed. Please try again.")
    } finally {
      setIsSearching(false)
      setSearchQuery("")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  return (
    <div
      className={`flex items-center space-x-2 bg-gray-800/50 backdrop-blur-sm rounded-lg p-1 border border-gray-700/50 ${className}`}
    >
      <Input
        placeholder="Search by tx hash, address, block number, or bridge ID..."
        value={searchQuery}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
        onKeyPress={handleKeyPress}
        disabled={isSearching}
        className="flex-1 bg-transparent border-none text-white placeholder-gray-400 focus:ring-0 disabled:opacity-50"
      />
      <Button
        onClick={handleSearch}
        disabled={isSearching || !searchQuery.trim()}
        className="bg-[#00f1fe]/20 hover:bg-[#00f1fe]/30 border border-[#00f1fe]/50 text-[#00f1fe] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSearching ? (
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#00f1fe] border-t-transparent" />
        ) : (
          <MagnifyingGlassIcon className="h-4 w-4" />
        )}
      </Button>
    </div>
  )
}
