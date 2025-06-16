"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Bot, Send, Settings, Share, Download, Copy, Sparkles, RefreshCw, Trash, ImageIcon, Mic } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { ModelSelector } from "./model-selector"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  timestamp: Date
  model?: string
  loading?: boolean
}

export function AIPlayground() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [temperature, setTemperature] = useState(0.7)
  const [maxTokens, setMaxTokens] = useState(1024)
  const [streamResponse, setStreamResponse] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Focus input on load
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    // Add assistant message (initially loading)
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: "",
      timestamp: new Date(),
      model: "Luuna-70B",
      loading: true,
    }

    setMessages((prev) => [...prev, userMessage, assistantMessage])
    setInput("")
    setIsLoading(true)

    // Simulate streaming response
    if (streamResponse) {
      const response = generateFakeResponse(input)
      let displayedResponse = ""
      const words = response.split(" ")

      for (let i = 0; i < words.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 50))
        displayedResponse += (i === 0 ? "" : " ") + words[i]
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessage.id
              ? { ...msg, content: displayedResponse, loading: i < words.length - 1 }
              : msg,
          ),
        )
      }
    } else {
      // Simulate non-streaming response
      await new Promise((resolve) => setTimeout(resolve, 1000))
      const response = generateFakeResponse(input)
      setMessages((prev) =>
        prev.map((msg) => (msg.id === assistantMessage.id ? { ...msg, content: response, loading: false } : msg)),
      )
    }

    setIsLoading(false)
  }

  const generateFakeResponse = (prompt: string): string => {
    // This is just a simple fake response generator
    // In a real application, this would call an actual AI model API
    const responses = [
      `I've analyzed your query about "${prompt.substring(0, 30)}${
        prompt.length > 30 ? "..." : ""
      }". Based on the latest research, there are several approaches to consider. First, we should examine the underlying assumptions. The data suggests that this is a complex problem requiring a multifaceted solution. Would you like me to elaborate on any specific aspect?`,
      `That's an interesting question about "${prompt.substring(0, 30)}${
        prompt.length > 30 ? "..." : ""
      }". From my analysis, there are three key factors to consider: context, methodology, and application. The most current research indicates a paradigm shift in how we approach this topic. I can provide more detailed information if you'd like to explore a particular angle.`,
      `Regarding "${prompt.substring(0, 30)}${
        prompt.length > 30 ? "..." : ""
      }", I've processed several relevant datasets. The patterns indicate that this is an evolving field with significant recent developments. The consensus among experts suggests a correlation between multiple variables that wasn't previously recognized. Would you like me to explain the practical implications?`,
    ]
    return responses[Math.floor(Math.random() * responses.length)]
  }

  const clearConversation = () => {
    setMessages([])
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // You could add a toast notification here
  }

  return (
    <div className="flex flex-col h-full">
      <Tabs defaultValue="chat" className="flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <TabsList className="bg-slate-800/50 p-1">
            <TabsTrigger value="chat" className="data-[state=active]:bg-slate-700 data-[state=active]:text-cyan-400">
              Chat
            </TabsTrigger>
            <TabsTrigger value="image" className="data-[state=active]:bg-slate-700 data-[state=active]:text-cyan-400">
              Image
            </TabsTrigger>
            <TabsTrigger value="audio" className="data-[state=active]:bg-slate-700 data-[state=active]:text-cyan-400">
              Audio
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 border-slate-700 bg-slate-800/50 hover:bg-slate-700/50"
              onClick={clearConversation}
            >
              <Trash className="h-4 w-4 mr-2" />
              Clear
            </Button>
            <Button variant="outline" size="sm" className="h-8 border-slate-700 bg-slate-800/50 hover:bg-slate-700/50">
              <Share className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm" className="h-8 border-slate-700 bg-slate-800/50 hover:bg-slate-700/50">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <TabsContent value="chat" className="flex-1 flex flex-col space-y-4 mt-0">
          <div className="flex-1 flex">
            <div className="flex-1 flex flex-col">
              <Card className="flex-1 flex flex-col bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
                <CardHeader className="pb-2 border-b border-slate-700/50">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-slate-100 flex items-center text-base">
                      <Bot className="mr-2 h-5 w-5 text-cyan-500" />
                      AI Playground
                    </CardTitle>
                    <Badge variant="outline" className="bg-slate-800/50 text-cyan-400 border-cyan-500/50">
                      <div className="h-1.5 w-1.5 rounded-full bg-cyan-500 mr-1 animate-pulse"></div>
                      LIVE
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 p-0 overflow-hidden">
                  <ScrollArea className="h-[calc(100vh-22rem)]">
                    <div className="p-4 space-y-4">
                      {messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 text-center">
                          <Sparkles className="h-12 w-12 text-slate-600 mb-4" />
                          <h3 className="text-lg font-medium text-slate-400">Start a conversation</h3>
                          <p className="text-sm text-slate-500 max-w-md mt-2">
                            Choose a model and start typing to interact with the AI. You can adjust model parameters in
                            the settings panel.
                          </p>
                        </div>
                      ) : (
                        messages.map((message) => (
                          <div
                            key={message.id}
                            className={cn(
                              "flex items-start space-x-3",
                              message.role === "user" ? "justify-end" : "justify-start",
                            )}
                          >
                            {message.role === "assistant" && (
                              <Avatar className="h-8 w-8 mt-1">
                                <AvatarImage src="/placeholder.svg?height=40&width=40" alt="AI" />
                                <AvatarFallback className="bg-slate-700 text-cyan-500">AI</AvatarFallback>
                              </Avatar>
                            )}
                            <div
                              className={cn(
                                "max-w-[80%] rounded-lg px-4 py-2 text-sm",
                                message.role === "user"
                                  ? "bg-cyan-600/20 border border-cyan-500/30 text-slate-200"
                                  : "bg-slate-800/70 border border-slate-700/50 text-slate-300",
                              )}
                            >
                              {message.loading ? (
                                <div className="flex items-center space-x-2">
                                  <div className="h-2 w-2 rounded-full bg-cyan-500 animate-pulse"></div>
                                  <div className="h-2 w-2 rounded-full bg-cyan-500 animate-pulse delay-150"></div>
                                  <div className="h-2 w-2 rounded-full bg-cyan-500 animate-pulse delay-300"></div>
                                </div>
                              ) : (
                                <>
                                  <div className="whitespace-pre-wrap">{message.content}</div>
                                  {message.role === "assistant" && (
                                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-700/30">
                                      <div className="flex items-center space-x-2">
                                        <Badge
                                          variant="outline"
                                          className="text-xs bg-slate-800/50 border-slate-700 text-slate-400"
                                        >
                                          {message.model || "Luuna-70B"}
                                        </Badge>
                                        <span className="text-xs text-slate-500">
                                          {message.timestamp.toLocaleTimeString()}
                                        </span>
                                      </div>
                                      <div className="flex items-center space-x-1">
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          className="h-6 w-6 text-slate-500 hover:text-slate-300"
                                          onClick={() => copyToClipboard(message.content)}
                                        >
                                          <Copy className="h-3 w-3" />
                                        </Button>
                                      </div>
                                    </div>
                                  )}
                                </>
                              )}
                            </div>
                            {message.role === "user" && (
                              <Avatar className="h-8 w-8 mt-1">
                                <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User" />
                                <AvatarFallback className="bg-slate-700 text-cyan-500">U</AvatarFallback>
                              </Avatar>
                            )}
                          </div>
                        ))
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>
                </CardContent>
                <CardFooter className="border-t border-slate-700/50 p-4">
                  <form onSubmit={handleSubmit} className="w-full">
                    <div className="flex items-end space-x-2">
                      <div className="flex-1 relative">
                        <Textarea
                          ref={inputRef}
                          placeholder="Type your message..."
                          className="min-h-[80px] resize-none bg-slate-800/50 border-slate-700/50 focus:border-cyan-500/50 focus:ring-cyan-500/20 text-slate-200"
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault()
                              handleSubmit(e)
                            }
                          }}
                        />
                        <div className="absolute bottom-2 right-2 flex space-x-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full bg-slate-700/50 text-slate-400 hover:text-slate-200"
                          >
                            <ImageIcon className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full bg-slate-700/50 text-slate-400 hover:text-slate-200"
                          >
                            <Mic className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <Button
                        type="submit"
                        className="bg-cyan-600 hover:bg-cyan-700 h-10 w-10 rounded-full p-0 flex items-center justify-center"
                        disabled={isLoading || !input.trim()}
                      >
                        {isLoading ? <RefreshCw className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                      </Button>
                    </div>
                  </form>
                </CardFooter>
              </Card>
            </div>

            <div className="w-64 ml-4">
              <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-slate-100 flex items-center text-base">
                    <Settings className="mr-2 h-5 w-5 text-slate-400" />
                    Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="model" className="text-sm text-slate-400">
                      Model
                    </Label>
                    <ModelSelector />
                  </div>

                  <Separator className="bg-slate-700/50" />

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="temperature" className="text-sm text-slate-400">
                        Temperature
                      </Label>
                      <span className="text-xs text-cyan-400">{temperature.toFixed(1)}</span>
                    </div>
                    <Slider
                      id="temperature"
                      min={0}
                      max={1}
                      step={0.1}
                      value={[temperature]}
                      onValueChange={(value) => setTemperature(value[0])}
                      className="[&>span]:bg-cyan-500"
                    />
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>Precise</span>
                      <span>Creative</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="max-tokens" className="text-sm text-slate-400">
                        Max Tokens
                      </Label>
                      <span className="text-xs text-cyan-400">{maxTokens}</span>
                    </div>
                    <Slider
                      id="max-tokens"
                      min={256}
                      max={4096}
                      step={256}
                      value={[maxTokens]}
                      onValueChange={(value) => setMaxTokens(value[0])}
                      className="[&>span]:bg-cyan-500"
                    />
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>Shorter</span>
                      <span>Longer</span>
                    </div>
                  </div>

                  <Separator className="bg-slate-700/50" />

                  <div className="flex items-center justify-between">
                    <Label htmlFor="stream" className="text-sm text-slate-400">
                      Stream Response
                    </Label>
                    <Switch
                      id="stream"
                      checked={streamResponse}
                      onCheckedChange={setStreamResponse}
                      className="data-[state=checked]:bg-cyan-500"
                    />
                  </div>

                  <div className="pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full border-slate-700 bg-slate-800/50 hover:bg-slate-700/50 text-xs"
                    >
                      Advanced Settings
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="image" className="flex-1 flex flex-col space-y-4 mt-0">
          <Card className="flex-1 flex flex-col bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
            <CardHeader className="pb-2 border-b border-slate-700/50">
              <CardTitle className="text-slate-100 flex items-center text-base">
                <ImageIcon className="mr-2 h-5 w-5 text-purple-500" />
                Image Generation
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-6 flex items-center justify-center">
              <div className="text-center">
                <ImageIcon className="h-16 w-16 text-slate-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-400">Image Generation</h3>
                <p className="text-sm text-slate-500 max-w-md mt-2 mb-4">
                  Generate images from text descriptions using Luuna Vision models.
                </p>
                <Button className="bg-purple-600 hover:bg-purple-700">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Coming Soon
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audio" className="flex-1 flex flex-col space-y-4 mt-0">
          <Card className="flex-1 flex flex-col bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
            <CardHeader className="pb-2 border-b border-slate-700/50">
              <CardTitle className="text-slate-100 flex items-center text-base">
                <Mic className="mr-2 h-5 w-5 text-blue-500" />
                Audio Processing
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-6 flex items-center justify-center">
              <div className="text-center">
                <Mic className="h-16 w-16 text-slate-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-400">Audio Processing</h3>
                <p className="text-sm text-slate-500 max-w-md mt-2 mb-4">
                  Speech recognition, transcription, and audio generation using Luuna Audio models.
                </p>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Coming Soon
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
