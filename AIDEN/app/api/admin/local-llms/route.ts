import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

interface LocalLLM {
  id: string
  name: string
  type: "ollama" | "llamacpp" | "textgen" | "custom"
  endpoint: string
  apiKey?: string
  models: string[]
  status: "online" | "offline" | "error"
  lastChecked: string
  config: {
    maxTokens?: number
    temperature?: number
    topP?: number
    timeout?: number
  }
  metadata: {
    version?: string
    description?: string
    tags?: string[]
  }
}

// In-memory storage (replace with database in production)
let localLLMs: LocalLLM[] = [
  {
    id: "ollama-local",
    name: "Ollama Local",
    type: "ollama",
    endpoint: "http://localhost:11434",
    models: ["llama2", "codellama", "mistral"],
    status: "offline",
    lastChecked: new Date().toISOString(),
    config: {
      maxTokens: 4000,
      temperature: 0.7,
      timeout: 30000,
    },
    metadata: {
      description: "Local Ollama instance",
      tags: ["local", "ollama"],
    },
  },
]

async function checkAuth() {
  const cookieStore = await cookies()
  const session = cookieStore.get("admin-session")
  return !!session
}

async function checkLLMStatus(llm: LocalLLM): Promise<"online" | "offline" | "error"> {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), llm.config.timeout || 5000)

    let healthEndpoint = llm.endpoint
    if (llm.type === "ollama") {
      healthEndpoint = `${llm.endpoint}/api/tags`
    } else if (llm.type === "llamacpp") {
      healthEndpoint = `${llm.endpoint}/health`
    }

    const response = await fetch(healthEndpoint, {
      signal: controller.signal,
      headers: llm.apiKey ? { Authorization: `Bearer ${llm.apiKey}` } : {},
    })

    clearTimeout(timeoutId)
    return response.ok ? "online" : "error"
  } catch (error) {
    return "offline"
  }
}

export async function GET() {
  try {
    const isAuthenticated = await checkAuth()
    if (!isAuthenticated) {
      return NextResponse.json({ error: "Pole autoriseeritud" }, { status: 401 })
    }

    // Check status of all LLMs
    const updatedLLMs = await Promise.all(
      localLLMs.map(async (llm) => {
        const status = await checkLLMStatus(llm)
        return {
          ...llm,
          status,
          lastChecked: new Date().toISOString(),
        }
      }),
    )

    localLLMs = updatedLLMs
    return NextResponse.json(localLLMs)
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

    const newLLM: Omit<LocalLLM, "id" | "status" | "lastChecked"> = await request.json()

    const llm: LocalLLM = {
      ...newLLM,
      id: `${newLLM.type}-${Date.now()}`,
      status: "offline",
      lastChecked: new Date().toISOString(),
    }

    // Check initial status
    llm.status = await checkLLMStatus(llm)

    localLLMs.push(llm)
    return NextResponse.json({ success: true, llm })
  } catch (error) {
    return NextResponse.json({ error: "Serveri viga" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const isAuthenticated = await checkAuth()
    if (!isAuthenticated) {
      return NextResponse.json({ error: "Pole autoriseeritud" }, { status: 401 })
    }

    const updatedLLM: LocalLLM = await request.json()
    const index = localLLMs.findIndex((llm) => llm.id === updatedLLM.id)

    if (index === -1) {
      return NextResponse.json({ error: "LLM ei leitud" }, { status: 404 })
    }

    // Check status after update
    updatedLLM.status = await checkLLMStatus(updatedLLM)
    updatedLLM.lastChecked = new Date().toISOString()

    localLLMs[index] = updatedLLM
    return NextResponse.json({ success: true, llm: updatedLLM })
  } catch (error) {
    return NextResponse.json({ error: "Serveri viga" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const isAuthenticated = await checkAuth()
    if (!isAuthenticated) {
      return NextResponse.json({ error: "Pole autoriseeritud" }, { status: 401 })
    }

    const { id } = await request.json()
    localLLMs = localLLMs.filter((llm) => llm.id !== id)

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Serveri viga" }, { status: 500 })
  }
}
