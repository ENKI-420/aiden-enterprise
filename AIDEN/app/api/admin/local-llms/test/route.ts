import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

async function checkAuth() {
  const cookieStore = await cookies()
  const session = cookieStore.get("admin-session")
  return !!session
}

export async function POST(request: NextRequest) {
  try {
    const isAuthenticated = await checkAuth()
    if (!isAuthenticated) {
      return NextResponse.json({ error: "Pole autoriseeritud" }, { status: 401 })
    }

    const { llmId, model, prompt, config } = await request.json()

    // Get LLM configuration (in production, fetch from database)
    const response = await fetch("/api/admin/local-llms")
    const llms = await response.json()
    const llm = llms.find((l: any) => l.id === llmId)

    if (!llm) {
      return NextResponse.json({ error: "LLM ei leitud" }, { status: 404 })
    }

    const startTime = Date.now()
    let result: any

    try {
      if (llm.type === "ollama") {
        const ollamaResponse = await fetch(`${llm.endpoint}/api/generate`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(llm.apiKey && { Authorization: `Bearer ${llm.apiKey}` }),
          },
          body: JSON.stringify({
            model,
            prompt,
            stream: false,
            options: {
              temperature: config?.temperature || 0.7,
              num_predict: config?.maxTokens || 1000,
            },
          }),
        })

        if (!ollamaResponse.ok) {
          throw new Error(`Ollama API error: ${ollamaResponse.statusText}`)
        }

        const data = await ollamaResponse.json()
        result = {
          response: data.response,
          model: data.model,
          tokens: data.eval_count || 0,
          duration: data.total_duration || 0,
        }
      } else if (llm.type === "llamacpp") {
        const llamaResponse = await fetch(`${llm.endpoint}/completion`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(llm.apiKey && { Authorization: `Bearer ${llm.apiKey}` }),
          },
          body: JSON.stringify({
            prompt,
            n_predict: config?.maxTokens || 1000,
            temperature: config?.temperature || 0.7,
            top_p: config?.topP || 0.9,
          }),
        })

        if (!llamaResponse.ok) {
          throw new Error(`LlamaCPP API error: ${llamaResponse.statusText}`)
        }

        const data = await llamaResponse.json()
        result = {
          response: data.content,
          tokens: data.tokens_predicted || 0,
          duration: Date.now() - startTime,
        }
      } else {
        // Custom endpoint
        const customResponse = await fetch(`${llm.endpoint}/generate`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(llm.apiKey && { Authorization: `Bearer ${llm.apiKey}` }),
          },
          body: JSON.stringify({
            prompt,
            max_tokens: config?.maxTokens || 1000,
            temperature: config?.temperature || 0.7,
          }),
        })

        if (!customResponse.ok) {
          throw new Error(`Custom API error: ${customResponse.statusText}`)
        }

        const data = await customResponse.json()
        result = {
          response: data.text || data.response || data.content,
          tokens: data.tokens || 0,
          duration: Date.now() - startTime,
        }
      }

      const endTime = Date.now()
      const responseTime = endTime - startTime

      // Log the interaction (in production, save to database)
      const logEntry = {
        timestamp: new Date().toISOString(),
        llmId,
        model,
        prompt: prompt.substring(0, 100) + (prompt.length > 100 ? "..." : ""),
        response: result.response.substring(0, 200) + (result.response.length > 200 ? "..." : ""),
        responseTime,
        tokens: result.tokens,
        success: true,
      }

      return NextResponse.json({
        success: true,
        result: {
          ...result,
          responseTime,
        },
        log: logEntry,
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Tundmatu viga"

      // Log the error
      const logEntry = {
        timestamp: new Date().toISOString(),
        llmId,
        model,
        prompt: prompt.substring(0, 100) + (prompt.length > 100 ? "..." : ""),
        error: errorMessage,
        responseTime: Date.now() - startTime,
        success: false,
      }

      return NextResponse.json({
        success: false,
        error: errorMessage,
        log: logEntry,
      })
    }
  } catch (error) {
    return NextResponse.json({ error: "Serveri viga" }, { status: 500 })
  }
}
