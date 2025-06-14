"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  Server,
  Plus,
  Trash2,
  Play,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertCircle,
  Monitor,
  Activity,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

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

interface TestResult {
  success: boolean
  result?: any
  error?: string
  log?: any
}

export function LocalLLMManager() {
  const [llms, setLLMs] = useState<LocalLLM[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [editingLLM, setEditingLLM] = useState<LocalLLM | null>(null)
  const [testingLLM, setTestingLLM] = useState<string | null>(null)
  const [testPrompt, setTestPrompt] = useState("Hello, how are you?")
  const [testResult, setTestResult] = useState<TestResult | null>(null)
  const { toast } = useToast()

  const [newLLM, setNewLLM] = useState({
    name: "",
    type: "ollama" as const,
    endpoint: "http://localhost:11434",
    apiKey: "",
    models: "",
    config: {
      maxTokens: 4000,
      temperature: 0.7,
      topP: 0.9,
      timeout: 30000,
    },
    metadata: {
      description: "",
      tags: "",
    },
  })

  useEffect(() => {
    loadLLMs()
  }, [])

  const loadLLMs = async () => {
    try {
      const response = await fetch("/api/admin/local-llms")
      if (response.ok) {
        const data = await response.json()
        setLLMs(data)
      }
    } catch (error) {
      toast({
        title: "Viga",
        description: "Ei saanud LLM-e laadida",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const refreshStatus = async () => {
    setRefreshing(true)
    await loadLLMs()
    setRefreshing(false)
    toast({
      title: "Värskendatud",
      description: "LLM-ide staatus on värskendatud",
    })
  }

  const addLLM = async () => {
    try {
      const llmData = {
        ...newLLM,
        models: newLLM.models.split("\n").filter((m) => m.trim()),
        metadata: {
          ...newLLM.metadata,
          tags: newLLM.metadata.tags
            .split(",")
            .map((t) => t.trim())
            .filter((t) => t),
        },
      }

      const response = await fetch("/api/admin/local-llms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(llmData),
      })

      if (response.ok) {
        await loadLLMs()
        setShowAddDialog(false)
        setNewLLM({
          name: "",
          type: "ollama",
          endpoint: "http://localhost:11434",
          apiKey: "",
          models: "",
          config: {
            maxTokens: 4000,
            temperature: 0.7,
            topP: 0.9,
            timeout: 30000,
          },
          metadata: {
            description: "",
            tags: "",
          },
        })
        toast({
          title: "Lisatud",
          description: "LLM on edukalt lisatud",
        })
      }
    } catch (error) {
      toast({
        title: "Viga",
        description: "Ei saanud LLM-i lisada",
        variant: "destructive",
      })
    }
  }

  const deleteLLM = async (id: string) => {
    try {
      const response = await fetch("/api/admin/local-llms", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })

      if (response.ok) {
        await loadLLMs()
        toast({
          title: "Kustutatud",
          description: "LLM on edukalt kustutatud",
        })
      }
    } catch (error) {
      toast({
        title: "Viga",
        description: "Ei saanud LLM-i kustutada",
        variant: "destructive",
      })
    }
  }

  const testLLM = async (llm: LocalLLM, model: string) => {
    setTestingLLM(llm.id)
    setTestResult(null)

    try {
      const response = await fetch("/api/admin/local-llms/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          llmId: llm.id,
          model,
          prompt: testPrompt,
          config: llm.config,
        }),
      })

      const data = await response.json()
      setTestResult(data)

      if (data.success) {
        toast({
          title: "Test õnnestus",
          description: `Vastus saadud ${data.result.responseTime}ms jooksul`,
        })
      } else {
        toast({
          title: "Test ebaõnnestus",
          description: data.error,
          variant: "destructive",
        })
      }
    } catch (error) {
      setTestResult({
        success: false,
        error: "Ühenduse viga",
      })
      toast({
        title: "Viga",
        description: "Ei saanud LLM-i testida",
        variant: "destructive",
      })
    } finally {
      setTestingLLM(null)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "online":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "offline":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      default:
        return <Monitor className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-600 hover:bg-green-700"
      case "offline":
        return "bg-red-600 hover:bg-red-700"
      case "error":
        return "bg-yellow-600 hover:bg-yellow-700"
      default:
        return "bg-gray-600 hover:bg-gray-700"
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-white">Laadin LLM-e...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Server className="h-6 w-6 text-cyan-500" />
          <h2 className="text-2xl font-bold text-white">Kohalikud LLM-id</h2>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            onClick={refreshStatus}
            disabled={refreshing}
            variant="outline"
            className="border-slate-700 text-slate-300 hover:bg-slate-800"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
            Värskenda
          </Button>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button className="bg-cyan-600 hover:bg-cyan-700">
                <Plus className="h-4 w-4 mr-2" />
                Lisa LLM
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-2xl">
              <DialogHeader>
                <DialogTitle>Lisa uus kohalik LLM</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Nimi</Label>
                    <Input
                      value={newLLM.name}
                      onChange={(e) => setNewLLM({ ...newLLM, name: e.target.value })}
                      className="bg-slate-800 border-slate-700"
                      placeholder="LLM nimi"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Tüüp</Label>
                    <Select value={newLLM.type} onValueChange={(value: any) => setNewLLM({ ...newLLM, type: value })}>
                      <SelectTrigger className="bg-slate-800 border-slate-700">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="ollama">Ollama</SelectItem>
                        <SelectItem value="llamacpp">LlamaCPP</SelectItem>
                        <SelectItem value="textgen">Text Generation WebUI</SelectItem>
                        <SelectItem value="custom">Kohandatud</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>API Endpoint</Label>
                  <Input
                    value={newLLM.endpoint}
                    onChange={(e) => setNewLLM({ ...newLLM, endpoint: e.target.value })}
                    className="bg-slate-800 border-slate-700"
                    placeholder="http://localhost:11434"
                  />
                </div>

                <div className="space-y-2">
                  <Label>API võti (valikuline)</Label>
                  <Input
                    type="password"
                    value={newLLM.apiKey}
                    onChange={(e) => setNewLLM({ ...newLLM, apiKey: e.target.value })}
                    className="bg-slate-800 border-slate-700"
                    placeholder="API võti"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Mudelid (üks rea kohta)</Label>
                  <Textarea
                    value={newLLM.models}
                    onChange={(e) => setNewLLM({ ...newLLM, models: e.target.value })}
                    className="bg-slate-800 border-slate-700"
                    placeholder="llama2&#10;codellama&#10;mistral"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Max tokenid</Label>
                    <Input
                      type="number"
                      value={newLLM.config.maxTokens}
                      onChange={(e) =>
                        setNewLLM({
                          ...newLLM,
                          config: { ...newLLM.config, maxTokens: Number.parseInt(e.target.value) },
                        })
                      }
                      className="bg-slate-800 border-slate-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Temperatuur</Label>
                    <Input
                      type="number"
                      step="0.1"
                      min="0"
                      max="2"
                      value={newLLM.config.temperature}
                      onChange={(e) =>
                        setNewLLM({
                          ...newLLM,
                          config: { ...newLLM.config, temperature: Number.parseFloat(e.target.value) },
                        })
                      }
                      className="bg-slate-800 border-slate-700"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Kirjeldus</Label>
                  <Input
                    value={newLLM.metadata.description}
                    onChange={(e) =>
                      setNewLLM({
                        ...newLLM,
                        metadata: { ...newLLM.metadata, description: e.target.value },
                      })
                    }
                    className="bg-slate-800 border-slate-700"
                    placeholder="LLM kirjeldus"
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowAddDialog(false)}
                    className="border-slate-700 text-slate-300"
                  >
                    Tühista
                  </Button>
                  <Button onClick={addLLM} className="bg-cyan-600 hover:bg-cyan-700">
                    Lisa LLM
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* LLM Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {llms.map((llm) => (
          <Card key={llm.id} className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white flex items-center">
                  <Server className="h-5 w-5 mr-2 text-cyan-500" />
                  {llm.name}
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className={getStatusColor(llm.status)}>
                    {getStatusIcon(llm.status)}
                    <span className="ml-1 capitalize">{llm.status}</span>
                  </Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteLLM(llm.id)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="text-sm text-slate-400">
                {llm.type.toUpperCase()} • {llm.endpoint}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-slate-300">
                <div>Mudeleid: {llm.models.length}</div>
                <div>Viimati kontrollitud: {new Date(llm.lastChecked).toLocaleString()}</div>
              </div>

              {llm.metadata.description && <div className="text-sm text-slate-400">{llm.metadata.description}</div>}

              {llm.models.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-slate-300">Testi mudel</Label>
                  <div className="flex space-x-2">
                    <Select>
                      <SelectTrigger className="bg-slate-800 border-slate-700 flex-1">
                        <SelectValue placeholder="Vali mudel" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        {llm.models.map((model) => (
                          <SelectItem key={model} value={model}>
                            {model}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      onClick={() => testLLM(llm, llm.models[0])}
                      disabled={testingLLM === llm.id || llm.status !== "online"}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {testingLLM === llm.id ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              )}

              {testResult && testingLLM !== llm.id && (
                <Alert
                  className={testResult.success ? "bg-green-900/20 border-green-800" : "bg-red-900/20 border-red-800"}
                >
                  <AlertDescription className={testResult.success ? "text-green-200" : "text-red-200"}>
                    {testResult.success ? (
                      <div>
                        <div>✅ Test õnnestus</div>
                        <div className="text-xs mt-1">Vastus: {testResult.result?.response?.substring(0, 100)}...</div>
                      </div>
                    ) : (
                      <div>❌ Test ebaõnnestus: {testResult.error}</div>
                    )}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {llms.length === 0 && (
        <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
          <CardContent className="text-center py-12">
            <Server className="h-12 w-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">Kohalikke LLM-e ei leitud</h3>
            <p className="text-slate-400 mb-4">Lisa oma esimene kohalik LLM, et alustada</p>
            <Button onClick={() => setShowAddDialog(true)} className="bg-cyan-600 hover:bg-cyan-700">
              <Plus className="h-4 w-4 mr-2" />
              Lisa LLM
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Test Interface */}
      <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Activity className="h-5 w-5 mr-2 text-cyan-500" />
            LLM Testimine
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-slate-300">Test prompt</Label>
            <Textarea
              value={testPrompt}
              onChange={(e) => setTestPrompt(e.target.value)}
              className="bg-slate-800 border-slate-700 text-white"
              placeholder="Sisesta test prompt..."
              rows={3}
            />
          </div>
          <div className="text-sm text-slate-400">
            Kasuta ülaltoodud LLM kaartide teste, et kontrollida ühendust ja jõudlust.
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
