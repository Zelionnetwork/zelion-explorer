import { NextResponse } from "next/server"
import { checkEnvironmentConfig } from "../../../../lib/blockchain"

export async function GET() {
  try {
    const config = checkEnvironmentConfig()
    
    return NextResponse.json({
      valid: config.valid,
      missing: config.missing,
      networks: config.networks,
      timestamp: new Date().toISOString(),
      totalRequired: 4,
      configuredCount: config.networks.length,
      missingCount: config.missing.length
    })
  } catch (error) {
    console.error("[v0] Config status API error:", error)
    return NextResponse.json({ 
      error: "Failed to check configuration status",
      valid: false,
      missing: ["UNKNOWN_ERROR"],
      networks: []
    }, { status: 500 })
  }
}
