import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

// Lihtne andmete salvestamine (tootmises kasuta andmebaasi)
let modelConfigs: any = {
  groq: {
    apiKey: process.env.GROQ_API_KEY || "",
    models: ["llama3-70b-8192", "llama3-8b-8192", "mixtral-8x7b-32768"],
  },
  openai: {
    apiKey: "",
    models: ["gpt-4o", "gpt-4o-mini", "gpt-3.5-turbo"],
  },
  anthropic: {
    apiKey: "",
    models: ["claude-3-5-sonnet-20241022", "claude-3-haiku-20240307"],
  },
  xai: {
    apiKey: process.env.XAI_API_KEY || "",
    models: ["grok-beta"],
  },
}

async function checkAuth() {
  const cookieStore = await cookies()
  const session = cookieStore.get("admin-session")
  return !!session
}

export async function GET() {
  try {
    const isAuthenticated = await checkAuth()
    if (!isAuthenticated) {
      return NextResponse.json({ error: "Pole autoriseeritud" }, { status: 401 })
    }

    return NextResponse.json(modelConfigs)
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

    const updates = await request.json()
    modelConfigs = { ...modelConfigs, ...updates }

    return NextResponse.json({ success: true, configs: modelConfigs })
  } catch (error) {
    return NextResponse.json({ error: "Serveri viga" }, { status: 500 })
  }
}
