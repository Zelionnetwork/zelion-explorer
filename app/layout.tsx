import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "../styles/globals.css"
import { ThemeProvider } from "next-themes"
import { Toaster } from "../components/ui/sonner"
import { AlchemyInitializer } from "../components/alchemy-initializer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Zelion Explorer - Multi-Chain Block Explorer",
  description: "Advanced multi-chain blockchain explorer for Zelion ecosystem with real-time data and futuristic interface",
  keywords: ["blockchain", "explorer", "zelion", "ethereum", "polygon", "arbitrum", "bridge", "defi"],
  authors: [{ name: "Zelion Team" }],
  creator: "Zelion Team",
  publisher: "Zelion",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://explorer.zelion.com",
    title: "Zelion Explorer - Multi-Chain Block Explorer",
    description: "Advanced multi-chain blockchain explorer for Zelion ecosystem with real-time data and futuristic interface",
    siteName: "Zelion Explorer",
  },
  twitter: {
    card: "summary_large_image",
    title: "Zelion Explorer - Multi-Chain Block Explorer",
    description: "Advanced multi-chain blockchain explorer for Zelion ecosystem with real-time data and futuristic interface",
    creator: "@zelion",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="antialiased">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <AlchemyInitializer />
          {children}
          <Toaster position="top-left" />
        </ThemeProvider>
      </body>
    </html>
  )
}
