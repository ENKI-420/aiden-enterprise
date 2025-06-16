import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

interface LogEntry {
  id: string
  timestamp: string
  llmId: string
  llmName: string
  model: string
  prompt: string
  response?: string
  error?: string
  responseTime: number
  tokens?: number
  success: boolean
}

// In-memory storage (replace with database in production)
let interactionLogs: LogEntry[] = []

async function checkAuth() {
  const cookieStore = await cookies()
  const session = cookieStore.get("admin-session")
  return !!session
}

export async function GET(request: NextRequest) {
  try {
    const isAuthenticated = await checkAuth()
    if (!isAuthenticated) {
      return NextResponse.json({ error: "Pole autoriseeritud" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const llmId = searchParams.get("llmId")
    const limit = Number.parseInt(searchParams.get("limit") || "50")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    let filteredLogs = interactionLogs
    if (llmId) {
      filteredLogs = interactionLogs.filter((log) => log.llmId === llmId)
    }

    // Sort by timestamp (newest first)
    filteredLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    const paginatedLogs = filteredLogs.slice(offset, offset + limit)

    return NextResponse.json({
      logs: paginatedLogs,
      total: filteredLogs.length,
      hasMore: offset + limit < filteredLogs.length,
    })
  } catch (error) {
    return NextResponse.json({ error: "Serveri viga" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const isAuthenticated = await checkAuth()
    if (!isAuthenticated) {
      return NextResponse.json({ error: "Pole autoriseeritud" }, { status: 401 })
    }

    const logData = await request.json()
    const logEntry: LogEntry = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...logData,
    }

    interactionLogs.push(logEntry)

    // Keep only last 1000 logs to prevent memory issues
    if (interactionLogs.length > 1000) {
      interactionLogs = interactionLogs.slice(-1000)
    }

    return NextResponse.json({ success: true, log: logEntry })
  } catch (error) {
    return NextResponse.json({ error: "Serveri viga" }, { status: 500 })
  }
}

export async function DELETE() {
  try {
    const isAuthenticated = await checkAuth()
    if (!isAuthenticated) {
      return NextResponse.json({ error: "Pole autoriseeritud" }, { status: 401 })
    }

    interactionLogs = []
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Serveri viga" }, { status: 500 })
  }
}
