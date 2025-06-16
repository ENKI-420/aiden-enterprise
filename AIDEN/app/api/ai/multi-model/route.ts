import { groq } from "@ai-sdk/groq"
import { openai } from "@ai-sdk/openai"
import { anthropic } from "@ai-sdk/anthropic"
import { xai } from "@ai-sdk/xai"
import { streamText } from "ai"
import { SYSTEM_PROMPTS, getPromptForModel } from "@/lib/ai-prompts"

// Allow responses up to 60 seconds
export const maxDuration = 60

// Lihtne konfiguratsiooni haldus (tootmises kasuta andmebaasi)
let modelConfigs: any = {
  groq: {
    apiKey: process.env.GROQ_API_KEY || "",
    models: ["llama3-70b-8192", "llama3-8b-8192", "mixtral-8x7b-32768"],
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY || "",
    models: ["gpt-4o", "gpt-4o-mini", "gpt-3.5-turbo"],
  },
  anthropic: {
    apiKey: process.env.ANTHROPIC_API_KEY || "",
    models: ["claude-3-5-sonnet-20241022", "claude-3-haiku-20240307"],
  },
  xai: {
    apiKey: process.env.XAI_API_KEY || "",
    models: ["grok-beta"],
  },
}

function getModelProvider(modelType: string, provider?: string) {
  // Vali sobiv mudel ja pakkuja
  const selectedProvider = provider || "groq" // vaikimisi Groq
  const config = modelConfigs[selectedProvider]

  if (!config || !config.apiKey) {
    // Tagasi Groq kui teine pakkuja pole saadaval
    return {
      model: groq("llama3-70b-8192"),
      provider: "groq",
    }
  }

  try {
    switch (selectedProvider) {
      case "openai":
        return {
          model: openai(config.models[0] || "gpt-4o-mini", {
            apiKey: config.apiKey,
          }),
          provider: "openai",
        }
      case "anthropic":
        return {
          model: anthropic(config.models[0] || "claude-3-haiku-20240307", {
            apiKey: config.apiKey,
          }),
          provider: "anthropic",
        }
      case "xai":
        return {
          model: xai(config.models[0] || "grok-beta", {
            apiKey: config.apiKey,
          }),
          provider: "xai",
        }
      default:
        return {
          model: groq(config.models[0] || "llama3-70b-8192"),
          provider: "groq",
        }
    }
  } catch (error) {
    console.error(`Error initializing ${selectedProvider}:`, error)
    // Tagasi Groq kui teine mudel ebaõnnestub
    return {
      model: groq("llama3-70b-8192"),
      provider: "groq",
    }
  }
}

export async function POST(req: Request) {
  try {
    const { prompt, modelType, settings, provider } = await req.json()

    if (!prompt || !modelType) {
      return new Response(JSON.stringify({ error: "Puuduvad nõutud parameetrid" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    // Hangi sobiv süsteemi prompt mudeli tüübi põhjal
    const systemPrompt = SYSTEM_PROMPTS[modelType as keyof typeof SYSTEM_PROMPTS] || SYSTEM_PROMPTS.lyrics

    // Täienda kasutaja prompti seadetega
    const enhancedPrompt = getPromptForModel(modelType, prompt, settings)

    // Vali mudel ja pakkuja
    const { model } = getModelProvider(modelType, provider)

    const result = streamText({
      model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: enhancedPrompt },
      ],
      maxTokens: 4000,
      temperature: 0.7,
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error("Viga multi-mudeli AI marsruudis:", error)
    return new Response(JSON.stringify({ error: "Päringu töötlemine ebaõnnestus" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}

// API konfiguratsiooni uuendamiseks
export async function PUT(req: Request) {
  try {
    const updates = await req.json()
    modelConfigs = { ...modelConfigs, ...updates }

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: "Konfiguratsiooni uuendamine ebaõnnestus" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
