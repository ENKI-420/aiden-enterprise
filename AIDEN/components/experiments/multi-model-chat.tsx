"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import {
  Bot,
  Send,
  Music,
  Mic,
  Video,
  Sparkles,
  RefreshCw,
  Trash,
  Download,
  Copy,
  Play,
  Volume2,
  Sliders,
  Loader2,
  AlertCircle,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  model?: string
  loading?: boolean
  type?: "lyrics" | "voice" | "music" | "composition" | "video"
  modelOutputs?: {
    [key: string]: {
      content: string
      loading: boolean
      error?: string
    }
  }
}

export function MultiModelChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [activeModels, setActiveModels] = useState<string[]>([
    "lyrics-model",
    "voice-model",
    "music-model",
    "composition-model",
    "video-model",
  ])
  const [experimentType, setExperimentType] = useState<"lyrics" | "voice" | "music" | "composition" | "video">("lyrics")
  const [voiceSettings, setVoiceSettings] = useState({
    pitch: 50,
    gender: 50,
    speed: 50,
    clarity: 50,
    emotion: 50,
  })
  const [musicSettings, setMusicSettings] = useState({
    genre: "pop",
    tempo: 120,
    mood: "energetic",
    instruments: ["piano", "guitar", "drums"],
  })
  const [videoSettings, setVideoSettings] = useState({
    style: "modern",
    duration: 30,
    resolution: "1080p",
  })

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const { toast } = useToast()

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Focus input on load
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const fetchAIResponse = async (
    modelType: string,
    userPrompt: string,
    messageId: string,
    settings: any = {},
  ): Promise<string> => {
    try {
      const response = await fetch("/api/ai/multi-model", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: userPrompt,
          modelType,
          settings:
            modelType === "voice"
              ? voiceSettings
              : modelType === "music"
                ? musicSettings
                : modelType === "video"
                  ? videoSettings
                  : {},
        }),
      })

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`)
      }

      // Handle streaming response
      const reader = response.body?.getReader()
      if (!reader) throw new Error("Response body is not readable")

      let accumulatedResponse = ""

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        // Convert the Uint8Array to a string
        const chunk = new TextDecoder().decode(value)

        try {
          // Parse the chunk as JSON
          const lines = chunk
            .split("\n")
            .filter((line) => line.trim() !== "")
            .map((line) => line.replace(/^data: /, ""))

          for (const line of lines) {
            if (line === "[DONE]") continue

            try {
              const parsedLine = JSON.parse(line)
              if (parsedLine.type === "text" && parsedLine.text) {
                accumulatedResponse += parsedLine.text

                // Update the message in state with the accumulated response
                setMessages((prev) =>
                  prev.map((msg) => {
                    if (msg.id === messageId && msg.modelOutputs) {
                      const updatedOutputs = { ...msg.modelOutputs }
                      updatedOutputs[`${modelType}-model`] = {
                        content: accumulatedResponse,
                        loading: true,
                      }
                      return { ...msg, modelOutputs: updatedOutputs }
                    }
                    return msg
                  }),
                )
              }
            } catch (e) {
              console.error("Error parsing line:", line, e)
            }
          }
        } catch (e) {
          console.error("Error processing chunk:", e)
        }
      }

      return accumulatedResponse
    } catch (error) {
      console.error(`Error fetching AI response for ${modelType}:`, error)
      throw error
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
      type: experimentType,
    }

    // Add assistant message with multiple model outputs
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: "",
      timestamp: new Date(),
      type: experimentType,
      modelOutputs: {},
    }

    // Initialize model outputs
    activeModels.forEach((model) => {
      if (assistantMessage.modelOutputs) {
        assistantMessage.modelOutputs[model] = {
          content: "",
          loading: true,
        }
      }
    })

    setMessages((prev) => [...prev, userMessage, assistantMessage])
    setInput("")
    setIsLoading(true)

    // Process each active model
    const modelPromises = activeModels.map(async (model) => {
      const modelType = model.split("-")[0] // Extract model type from model ID

      try {
        // Fetch AI response for this model
        const response = await fetchAIResponse(
          modelType,
          input,
          assistantMessage.id,
          modelType === "voice"
            ? voiceSettings
            : modelType === "music"
              ? musicSettings
              : modelType === "video"
                ? videoSettings
                : {},
        )

        // Update the message with the completed response
        setMessages((prev) =>
          prev.map((msg) => {
            if (msg.id === assistantMessage.id && msg.modelOutputs) {
              const updatedOutputs = { ...msg.modelOutputs }
              updatedOutputs[model] = {
                content: response,
                loading: false,
              }
              return { ...msg, modelOutputs: updatedOutputs }
            }
            return msg
          }),
        )
      } catch (error) {
        console.error(`Error with ${model}:`, error)

        // Update the message with the error
        setMessages((prev) =>
          prev.map((msg) => {
            if (msg.id === assistantMessage.id && msg.modelOutputs) {
              const updatedOutputs = { ...msg.modelOutputs }
              updatedOutputs[model] = {
                content: "An error occurred while generating the response.",
                loading: false,
                error: error instanceof Error ? error.message : "Unknown error",
              }
              return { ...msg, modelOutputs: updatedOutputs }
            }
            return msg
          }),
        )

        toast({
          title: "Error",
          description: `Failed to generate ${modelType} content. Please try again.`,
          variant: "destructive",
        })
      }
    })

    // Wait for all models to complete
    try {
      await Promise.all(modelPromises)
    } finally {
      setIsLoading(false)
    }
  }

  const clearConversation = () => {
    setMessages([])
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied to clipboard",
      description: "The content has been copied to your clipboard.",
    })
  }

  const handleExperimentTypeChange = (value: string) => {
    setExperimentType(value as any)
  }

  return (
    <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
      <CardHeader className="border-b border-slate-700/50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-slate-100 flex items-center">
            <Bot className="mr-2 h-5 w-5 text-purple-500" />
            Multi-Model Music Lab
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="bg-slate-800/50 text-purple-400 border-purple-500/50">
              <div className="h-1.5 w-1.5 rounded-full bg-purple-500 mr-1 animate-pulse"></div>
              EXPERIMENTAL
            </Badge>
            <Select defaultValue="lyrics" onValueChange={handleExperimentTypeChange}>
              <SelectTrigger className="w-[180px] bg-slate-800/50 border-slate-700">
                <SelectValue placeholder="Experiment Type" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-700">
                <SelectItem value="lyrics">Song Lyrics</SelectItem>
                <SelectItem value="voice">Voice Generation</SelectItem>
                <SelectItem value="music">Music Style</SelectItem>
                <SelectItem value="composition">Song Composition</SelectItem>
                <SelectItem value="video">Music Video</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid grid-cols-12 h-[calc(100vh-20rem)]">
          {/* Model selection sidebar */}
          <div className="col-span-3 border-r border-slate-700/50 p-4">
            <div className="mb-4">
              <h3 className="text-sm font-medium text-slate-300 mb-2">Active Models</h3>
              <div className="space-y-2">
                <ModelToggle
                  id="lyrics-model"
                  label="Lyrics Generator"
                  description="Creates song lyrics based on prompts"
                  icon={Music}
                  color="cyan"
                  isActive={activeModels.includes("lyrics-model")}
                  onToggle={() => {
                    setActiveModels((prev) =>
                      prev.includes("lyrics-model")
                        ? prev.filter((m) => m !== "lyrics-model")
                        : [...prev, "lyrics-model"],
                    )
                  }}
                />
                <ModelToggle
                  id="voice-model"
                  label="Voice Synthesizer"
                  description="Generates customizable voice clips"
                  icon={Mic}
                  color="green"
                  isActive={activeModels.includes("voice-model")}
                  onToggle={() => {
                    setActiveModels((prev) =>
                      prev.includes("voice-model") ? prev.filter((m) => m !== "voice-model") : [...prev, "voice-model"],
                    )
                  }}
                />
                <ModelToggle
                  id="music-model"
                  label="Music Generator"
                  description="Creates music in various styles"
                  icon={Music}
                  color="purple"
                  isActive={activeModels.includes("music-model")}
                  onToggle={() => {
                    setActiveModels((prev) =>
                      prev.includes("music-model") ? prev.filter((m) => m !== "music-model") : [...prev, "music-model"],
                    )
                  }}
                />
                <ModelToggle
                  id="composition-model"
                  label="Composition Assistant"
                  description="Provides reasoning and composition help"
                  icon={Sparkles}
                  color="blue"
                  isActive={activeModels.includes("composition-model")}
                  onToggle={() => {
                    setActiveModels((prev) =>
                      prev.includes("composition-model")
                        ? prev.filter((m) => m !== "composition-model")
                        : [...prev, "composition-model"],
                    )
                  }}
                />
                <ModelToggle
                  id="video-model"
                  label="Video Renderer"
                  description="Creates music videos from prompts"
                  icon={Video}
                  color="pink"
                  isActive={activeModels.includes("video-model")}
                  onToggle={() => {
                    setActiveModels((prev) =>
                      prev.includes("video-model") ? prev.filter((m) => m !== "video-model") : [...prev, "video-model"],
                    )
                  }}
                />
              </div>
            </div>

            <Separator className="my-4 bg-slate-700/50" />

            {/* Settings based on experiment type */}
            <div>
              <h3 className="text-sm font-medium text-slate-300 mb-2">Model Settings</h3>

              {experimentType === "voice" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs text-slate-400">Pitch</Label>
                      <span className="text-xs text-cyan-400">{voiceSettings.pitch}%</span>
                    </div>
                    <Slider
                      value={[voiceSettings.pitch]}
                      min={0}
                      max={100}
                      step={1}
                      onValueChange={(value) => setVoiceSettings((prev) => ({ ...prev, pitch: value[0] }))}
                      className="[&>span]:bg-green-500"
                    />
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>Lower</span>
                      <span>Higher</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs text-slate-400">Gender</Label>
                      <span className="text-xs text-cyan-400">{voiceSettings.gender}%</span>
                    </div>
                    <Slider
                      value={[voiceSettings.gender]}
                      min={0}
                      max={100}
                      step={1}
                      onValueChange={(value) => setVoiceSettings((prev) => ({ ...prev, gender: value[0] }))}
                      className="[&>span]:bg-green-500"
                    />
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>Masculine</span>
                      <span>Feminine</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs text-slate-400">Speed</Label>
                      <span className="text-xs text-cyan-400">{voiceSettings.speed}%</span>
                    </div>
                    <Slider
                      value={[voiceSettings.speed]}
                      min={0}
                      max={100}
                      step={1}
                      onValueChange={(value) => setVoiceSettings((prev) => ({ ...prev, speed: value[0] }))}
                      className="[&>span]:bg-green-500"
                    />
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>Slower</span>
                      <span>Faster</span>
                    </div>
                  </div>
                </div>
              )}

              {experimentType === "music" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-xs text-slate-400">Genre</Label>
                    <Select
                      defaultValue={musicSettings.genre}
                      onValueChange={(value) => setMusicSettings((prev) => ({ ...prev, genre: value }))}
                    >
                      <SelectTrigger className="w-full bg-slate-800/50 border-slate-700 h-8 text-xs">
                        <SelectValue placeholder="Select genre" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 border-slate-700">
                        <SelectItem value="pop">Pop</SelectItem>
                        <SelectItem value="rock">Rock</SelectItem>
                        <SelectItem value="jazz">Jazz</SelectItem>
                        <SelectItem value="electronic">Electronic</SelectItem>
                        <SelectItem value="classical">Classical</SelectItem>
                        <SelectItem value="hip-hop">Hip-Hop</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs text-slate-400">Tempo (BPM)</Label>
                      <span className="text-xs text-cyan-400">{musicSettings.tempo}</span>
                    </div>
                    <Slider
                      value={[musicSettings.tempo]}
                      min={60}
                      max={200}
                      step={1}
                      onValueChange={(value) => setMusicSettings((prev) => ({ ...prev, tempo: value[0] }))}
                      className="[&>span]:bg-purple-500"
                    />
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>Slow</span>
                      <span>Fast</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs text-slate-400">Mood</Label>
                    <Select
                      defaultValue={musicSettings.mood}
                      onValueChange={(value) => setMusicSettings((prev) => ({ ...prev, mood: value }))}
                    >
                      <SelectTrigger className="w-full bg-slate-800/50 border-slate-700 h-8 text-xs">
                        <SelectValue placeholder="Select mood" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 border-slate-700">
                        <SelectItem value="energetic">Energetic</SelectItem>
                        <SelectItem value="melancholic">Melancholic</SelectItem>
                        <SelectItem value="relaxed">Relaxed</SelectItem>
                        <SelectItem value="aggressive">Aggressive</SelectItem>
                        <SelectItem value="uplifting">Uplifting</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {experimentType === "video" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-xs text-slate-400">Visual Style</Label>
                    <Select
                      defaultValue={videoSettings.style}
                      onValueChange={(value) => setVideoSettings((prev) => ({ ...prev, style: value }))}
                    >
                      <SelectTrigger className="w-full bg-slate-800/50 border-slate-700 h-8 text-xs">
                        <SelectValue placeholder="Select style" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 border-slate-700">
                        <SelectItem value="modern">Modern</SelectItem>
                        <SelectItem value="retro">Retro</SelectItem>
                        <SelectItem value="surreal">Surreal</SelectItem>
                        <SelectItem value="minimalist">Minimalist</SelectItem>
                        <SelectItem value="cinematic">Cinematic</SelectItem>
                        <SelectItem value="anime">Anime</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs text-slate-400">Duration (seconds)</Label>
                      <span className="text-xs text-cyan-400">{videoSettings.duration}s</span>
                    </div>
                    <Slider
                      value={[videoSettings.duration]}
                      min={15}
                      max={180}
                      step={15}
                      onValueChange={(value) => setVideoSettings((prev) => ({ ...prev, duration: value[0] }))}
                      className="[&>span]:bg-pink-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs text-slate-400">Resolution</Label>
                    <Select
                      defaultValue={videoSettings.resolution}
                      onValueChange={(value) => setVideoSettings((prev) => ({ ...prev, resolution: value }))}
                    >
                      <SelectTrigger className="w-full bg-slate-800/50 border-slate-700 h-8 text-xs">
                        <SelectValue placeholder="Select resolution" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 border-slate-700">
                        <SelectItem value="720p">720p</SelectItem>
                        <SelectItem value="1080p">1080p</SelectItem>
                        <SelectItem value="4k">4K</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {(experimentType === "lyrics" || experimentType === "composition") && (
                <div className="p-4 bg-slate-800/50 rounded-md border border-slate-700/50 text-xs text-slate-400">
                  <p className="mb-2">
                    {experimentType === "lyrics"
                      ? "The lyrics generator creates original song lyrics based on your prompts."
                      : "The composition assistant provides creative reasoning and songwriting guidance."}
                  </p>
                  <p>Try specifying:</p>
                  <ul className="list-disc pl-4 mt-1 space-y-1">
                    <li>Theme or topic</li>
                    <li>Mood or emotion</li>
                    <li>Genre or style</li>
                    <li>Specific keywords</li>
                    {experimentType === "composition" && (
                      <>
                        <li>Song structure</li>
                        <li>Harmonic preferences</li>
                      </>
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Chat area */}
          <div className="col-span-9 flex flex-col">
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-6">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 text-center">
                    <Sparkles className="h-12 w-12 text-slate-600 mb-4" />
                    <h3 className="text-lg font-medium text-slate-400">Start a music experiment</h3>
                    <p className="text-sm text-slate-500 max-w-md mt-2">
                      Enter a prompt to generate content from multiple AI models simultaneously. Compare different
                      outputs side-by-side.
                    </p>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div key={message.id} className="space-y-2">
                      {/* User message */}
                      {message.role === "user" && (
                        <div className="flex items-start justify-end space-x-2">
                          <div className="bg-purple-600/20 border border-purple-500/30 rounded-lg px-4 py-2 max-w-[80%]">
                            <div className="text-sm text-slate-200 whitespace-pre-wrap">{message.content}</div>
                            <div className="mt-1 flex items-center justify-between text-xs text-slate-400">
                              <span>{message.timestamp.toLocaleTimeString()}</span>
                              <Badge variant="outline" className="bg-slate-800/50 border-slate-700 text-xs">
                                {message.type?.charAt(0).toUpperCase() + message.type?.slice(1) || "General"}
                              </Badge>
                            </div>
                          </div>
                          <Avatar className="h-8 w-8">
                            <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User" />
                            <AvatarFallback className="bg-slate-700 text-purple-500">U</AvatarFallback>
                          </Avatar>
                        </div>
                      )}

                      {/* Assistant message with multiple model outputs */}
                      {message.role === "assistant" && message.modelOutputs && (
                        <div className="space-y-4">
                          <div className="flex items-center space-x-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src="/placeholder.svg?height=40&width=40" alt="AI" />
                              <AvatarFallback className="bg-slate-700 text-purple-500">AI</AvatarFallback>
                            </Avatar>
                            <div className="text-sm font-medium text-slate-300">Multi-Model Results</div>
                          </div>

                          <div className="grid grid-cols-1 gap-3 pl-10">
                            {Object.entries(message.modelOutputs).map(([modelId, output]) => {
                              const modelType = modelId.split("-")[0]
                              const modelIcon =
                                modelType === "lyrics"
                                  ? Music
                                  : modelType === "voice"
                                    ? Mic
                                    : modelType === "music"
                                      ? Music
                                      : modelType === "composition"
                                        ? Sparkles
                                        : modelType === "video"
                                          ? Video
                                          : Bot

                              const modelColor =
                                modelType === "lyrics"
                                  ? "cyan"
                                  : modelType === "voice"
                                    ? "green"
                                    : modelType === "music"
                                      ? "purple"
                                      : modelType === "composition"
                                        ? "blue"
                                        : modelType === "video"
                                          ? "pink"
                                          : "slate"

                              const getModelIconClasses = (modelColor: string) => {
                                switch (modelColor) {
                                  case "cyan":
                                    return "bg-cyan-500/20 text-cyan-400"
                                  case "green":
                                    return "bg-green-500/20 text-green-400"
                                  case "purple":
                                    return "bg-purple-500/20 text-purple-400"
                                  case "blue":
                                    return "bg-blue-500/20 text-blue-400"
                                  case "pink":
                                    return "bg-pink-500/20 text-pink-400"
                                  default:
                                    return "bg-slate-500/20 text-slate-400"
                                }
                              }

                              return (
                                <Card key={modelId} className="bg-slate-800/50 border-slate-700/50">
                                  <CardHeader className="py-2 px-4 flex flex-row items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                      <div
                                        className={`h-6 w-6 rounded-full ${getModelIconClasses(modelColor)} flex items-center justify-center`}
                                      >
                                        <modelIcon className="h-3.5 w-3.5" />
                                      </div>
                                      <h4 className="text-sm font-medium text-slate-200">
                                        {modelType.charAt(0).toUpperCase() + modelType.slice(1)} Model
                                      </h4>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6 text-slate-400 hover:text-slate-200"
                                        onClick={() => copyToClipboard(output.content)}
                                        disabled={output.loading || !!output.error}
                                      >
                                        <Copy className="h-3.5 w-3.5" />
                                      </Button>
                                      {(modelType === "voice" || modelType === "music" || modelType === "video") && (
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          className="h-6 w-6 text-slate-400 hover:text-slate-200"
                                          disabled={output.loading || !!output.error}
                                        >
                                          <Download className="h-3.5 w-3.5" />
                                        </Button>
                                      )}
                                    </div>
                                  </CardHeader>
                                  <CardContent className="py-3 px-4">
                                    {output.loading ? (
                                      <div className="flex items-center space-x-2 h-20 justify-center">
                                        <Loader2 className="h-5 w-5 text-purple-500 animate-spin" />
                                        <span className="text-sm text-slate-400">Generating response...</span>
                                      </div>
                                    ) : output.error ? (
                                      <Alert variant="destructive" className="bg-red-900/20 border-red-800">
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertTitle>Error</AlertTitle>
                                        <AlertDescription className="text-xs">
                                          Failed to generate content. Please try again.
                                        </AlertDescription>
                                      </Alert>
                                    ) : (
                                      <div className="text-sm text-slate-300 whitespace-pre-wrap">
                                        {output.content}

                                        {/* Voice player UI */}
                                        {modelType === "voice" && (
                                          <div className="mt-4 bg-slate-900/50 rounded-md border border-slate-700/50 p-3">
                                            <div className="flex items-center justify-between mb-3">
                                              <div className="flex items-center space-x-2">
                                                <Button
                                                  variant="outline"
                                                  size="icon"
                                                  className="h-8 w-8 rounded-full bg-purple-600 hover:bg-purple-700 border-none"
                                                >
                                                  <Play className="h-4 w-4" />
                                                </Button>
                                                <div className="h-1 bg-slate-700 rounded-full w-32 relative">
                                                  <div className="absolute h-full w-1/3 bg-purple-500 rounded-full"></div>
                                                </div>
                                              </div>
                                              <div className="flex items-center space-x-2">
                                                <Button
                                                  variant="ghost"
                                                  size="icon"
                                                  className="h-6 w-6 text-slate-400 hover:text-slate-200"
                                                >
                                                  <Volume2 className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                  variant="ghost"
                                                  size="icon"
                                                  className="h-6 w-6 text-slate-400 hover:text-slate-200"
                                                >
                                                  <Sliders className="h-4 w-4" />
                                                </Button>
                                              </div>
                                            </div>
                                            <div className="text-xs text-slate-500">Voice sample • 00:00 / 00:30</div>
                                          </div>
                                        )}

                                        {/* Music player UI */}
                                        {modelType === "music" && (
                                          <div className="mt-4 bg-slate-900/50 rounded-md border border-slate-700/50 p-3">
                                            <div className="flex items-center justify-between mb-3">
                                              <div className="flex items-center space-x-2">
                                                <Button
                                                  variant="outline"
                                                  size="icon"
                                                  className="h-8 w-8 rounded-full bg-purple-600 hover:bg-purple-700 border-none"
                                                >
                                                  <Play className="h-4 w-4" />
                                                </Button>
                                                <div className="h-1 bg-slate-700 rounded-full w-32 relative">
                                                  <div className="absolute h-full w-1/4 bg-purple-500 rounded-full"></div>
                                                </div>
                                              </div>
                                              <div className="flex items-center space-x-2">
                                                <Button
                                                  variant="ghost"
                                                  size="icon"
                                                  className="h-6 w-6 text-slate-400 hover:text-slate-200"
                                                >
                                                  <Volume2 className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                  variant="ghost"
                                                  size="icon"
                                                  className="h-6 w-6 text-slate-400 hover:text-slate-200"
                                                >
                                                  <Download className="h-4 w-4" />
                                                </Button>
                                              </div>
                                            </div>
                                            <div className="text-xs text-slate-500">
                                              {musicSettings.genre} • {musicSettings.tempo} BPM • 00:00 / 01:45
                                            </div>
                                          </div>
                                        )}

                                        {/* Video player UI */}
                                        {modelType === "video" && (
                                          <div className="mt-4 bg-slate-900/50 rounded-md border border-slate-700/50 p-3">
                                            <div className="aspect-video bg-slate-800 rounded-md flex items-center justify-center mb-3">
                                              <div className="text-center">
                                                <Video className="h-10 w-10 text-slate-600 mx-auto mb-2" />
                                                <Button
                                                  variant="outline"
                                                  size="sm"
                                                  className="bg-purple-600 hover:bg-purple-700 border-none"
                                                >
                                                  <Play className="h-4 w-4 mr-2" />
                                                  Preview Video
                                                </Button>
                                              </div>
                                            </div>
                                            <div className="flex items-center justify-between text-xs text-slate-500">
                                              <span>
                                                {videoSettings.resolution} • {videoSettings.duration}s
                                              </span>
                                              <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-6 text-xs text-slate-400 hover:text-slate-200"
                                              >
                                                <Download className="h-3.5 w-3.5 mr-1" />
                                                Download
                                              </Button>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </CardContent>
                                </Card>
                              )
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            <div className="p-4 border-t border-slate-700/50">
              <form onSubmit={handleSubmit} className="flex space-x-2">
                <div className="flex-1 relative">
                  <Textarea
                    ref={inputRef}
                    placeholder={`Enter a prompt for ${experimentType} generation...`}
                    className="min-h-[80px] resize-none bg-slate-800/50 border-slate-700/50 focus:border-purple-500/50 focus:ring-purple-500/20 text-slate-200"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        handleSubmit(e)
                      }
                    }}
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <Button
                    type="submit"
                    className="bg-purple-600 hover:bg-purple-700 h-10 px-4"
                    disabled={isLoading || !input.trim()}
                  >
                    {isLoading ? <RefreshCw className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="border-slate-700 bg-slate-800/50 hover:bg-slate-700/50 h-10"
                    onClick={clearConversation}
                  >
                    <Trash className="h-5 w-5" />
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Model toggle component
function ModelToggle({
  id,
  label,
  description,
  icon: Icon,
  color,
  isActive,
  onToggle,
}: {
  id: string
  label: string
  description: string
  icon: React.ElementType
  color: string
  isActive: boolean
  onToggle: () => void
}) {
  const getToggleClasses = () => {
    if (!isActive) return "bg-slate-800/50 border-slate-700/50"

    switch (color) {
      case "cyan":
        return "bg-cyan-500/10 border-cyan-500/30"
      case "green":
        return "bg-green-500/10 border-green-500/30"
      case "purple":
        return "bg-purple-500/10 border-purple-500/30"
      case "blue":
        return "bg-blue-500/10 border-blue-500/30"
      case "pink":
        return "bg-pink-500/10 border-pink-500/30"
      default:
        return "bg-slate-800/50 border-slate-700/50"
    }
  }

  const getIconClasses = () => {
    switch (color) {
      case "cyan":
        return "bg-cyan-500/20 text-cyan-400"
      case "green":
        return "bg-green-500/20 text-green-400"
      case "purple":
        return "bg-purple-500/20 text-purple-400"
      case "blue":
        return "bg-blue-500/20 text-blue-400"
      case "pink":
        return "bg-pink-500/20 text-pink-400"
      default:
        return "bg-slate-500/20 text-slate-400"
    }
  }

  const getSwitchClasses = () => {
    switch (color) {
      case "cyan":
        return "data-[state=checked]:bg-cyan-500"
      case "green":
        return "data-[state=checked]:bg-green-500"
      case "purple":
        return "data-[state=checked]:bg-purple-500"
      case "blue":
        return "data-[state=checked]:bg-blue-500"
      case "pink":
        return "data-[state=checked]:bg-pink-500"
      default:
        return "data-[state=checked]:bg-slate-500"
    }
  }

  return (
    <div
      className={`p-3 rounded-md border ${getToggleClasses()} cursor-pointer hover:bg-slate-800/70 transition-colors`}
      onClick={onToggle}
    >
      <div className="flex items-center space-x-2">
        <div className={`h-8 w-8 rounded-full ${getIconClasses()} flex items-center justify-center`}>
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <div className="text-sm font-medium text-slate-200">{label}</div>
          <div className="text-xs text-slate-400">{description}</div>
        </div>
        <div className="ml-auto">
          <Switch checked={isActive} className={getSwitchClasses()} />
        </div>
      </div>
    </div>
  )
}
