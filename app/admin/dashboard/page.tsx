"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Settings,
  LogOut,
  Save,
  Key,
  Bot,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff,
  Server,
  FileText,
  BookOpen,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { LocalLLMManager } from "@/components/admin/local-llm-manager"
import { InteractionLogs } from "@/components/admin/interaction-logs"
import { LLMDocumentation } from "@/components/admin/llm-documentation"

interface ModelConfig {
  apiKey: string
  models: string[]
}

interface ModelConfigs {
  [key: string]: ModelConfig
}

export default function AdminDashboard() {
  const [configs, setConfigs] = useState<ModelConfigs>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showApiKeys, setShowApiKeys] = useState<{ [key: string]: boolean }>({})
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    checkAuth()
    loadConfigs()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/admin/auth")
      const data = await response.json()
      if (!data.authenticated) {
        router.push("/admin")
      }
    } catch (error) {
      router.push("/admin")
    }
  }

  const loadConfigs = async () => {
    try {
      const response = await fetch("/api/admin/models")
      if (response.ok) {
        const data = await response.json()
        setConfigs(data)
      }
    } catch (error) {
      toast({
        title: "Viga",
        description: "Ei saanud konfiguratsioone laadida",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const saveConfigs = async () => {
    setSaving(true)
    try {
      const response = await fetch("/api/admin/models", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(configs),
      })

      if (response.ok) {
        toast({
          title: "Salvestatud",
          description: "Konfiguratsiooned on edukalt salvestatud",
        })
      } else {
        throw new Error("Salvestamine ebaõnnestus")
      }
    } catch (error) {
      toast({
        title: "Viga",
        description: "Ei saanud konfiguratsioone salvestada",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth", { method: "DELETE" })
      router.push("/admin")
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  const updateApiKey = (provider: string, apiKey: string) => {
    setConfigs((prev) => ({
      ...prev,
      [provider]: {
        ...prev[provider],
        apiKey,
      },
    }))
  }

  const updateModels = (provider: string, models: string) => {
    const modelArray = models.split("\n").filter((m) => m.trim())
    setConfigs((prev) => ({
      ...prev,
      [provider]: {
        ...prev[provider],
        models: modelArray,
      },
    }))
  }

  const toggleApiKeyVisibility = (provider: string) => {
    setShowApiKeys((prev) => ({
      ...prev,
      [provider]: !prev[provider],
    }))
  }

  const getProviderStatus = (provider: string) => {
    const config = configs[provider]
    if (!config || !config.apiKey) {
      return { status: "inactive", text: "Pole konfigureeritud" }
    }
    return { status: "active", text: "Aktiivne" }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black to-slate-900 flex items-center justify-center">
        <div className="text-white">Laadin...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-slate-900 p-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <Settings className="h-8 w-8 text-cyan-500" />
            <h1 className="text-3xl font-bold text-white">Administraatori paneel</h1>
          </div>
          <div className="flex items-center space-x-3">
            <Button onClick={saveConfigs} disabled={saving} className="bg-green-600 hover:bg-green-700">
              <Save className="h-4 w-4 mr-2" />
              {saving ? "Salvestamine..." : "Salvesta"}
            </Button>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="border-slate-700 text-slate-300 hover:bg-slate-800"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logi välja
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="models" className="space-y-6">
          <TabsList className="bg-slate-800/50 p-1">
            <TabsTrigger value="models" className="data-[state=active]:bg-slate-700 data-[state=active]:text-cyan-400">
              <Bot className="h-4 w-4 mr-2" />
              AI Mudelid
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="data-[state=active]:bg-slate-700 data-[state=active]:text-cyan-400"
            >
              <Settings className="h-4 w-4 mr-2" />
              Seaded
            </TabsTrigger>
            <TabsTrigger
              value="local-llms"
              className="data-[state=active]:bg-slate-700 data-[state=active]:text-cyan-400"
            >
              <Server className="h-4 w-4 mr-2" />
              Kohalikud LLM-id
            </TabsTrigger>
            <TabsTrigger value="logs" className="data-[state=active]:bg-slate-700 data-[state=active]:text-cyan-400">
              <FileText className="h-4 w-4 mr-2" />
              Logid
            </TabsTrigger>
            <TabsTrigger
              value="documentation"
              className="data-[state=active]:bg-slate-700 data-[state=active]:text-cyan-400"
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Dokumentatsioon
            </TabsTrigger>
          </TabsList>

          <TabsContent value="models" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(configs).map(([provider, config]) => {
                const status = getProviderStatus(provider)
                return (
                  <Card key={provider} className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-white capitalize flex items-center">
                          <Key className="h-5 w-5 mr-2 text-cyan-500" />
                          {provider}
                        </CardTitle>
                        <Badge
                          variant={status.status === "active" ? "default" : "secondary"}
                          className={status.status === "active" ? "bg-green-600 hover:bg-green-700" : "bg-slate-600"}
                        >
                          {status.status === "active" ? (
                            <CheckCircle className="h-3 w-3 mr-1" />
                          ) : (
                            <XCircle className="h-3 w-3 mr-1" />
                          )}
                          {status.text}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-slate-300">API võti</Label>
                        <div className="relative">
                          <Input
                            type={showApiKeys[provider] ? "text" : "password"}
                            value={config.apiKey}
                            onChange={(e) => updateApiKey(provider, e.target.value)}
                            className="bg-slate-800/50 border-slate-700 text-white pr-10"
                            placeholder={`Sisesta ${provider} API võti`}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-full px-3 text-slate-400 hover:text-white"
                            onClick={() => toggleApiKeyVisibility(provider)}
                          >
                            {showApiKeys[provider] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-slate-300">Saadaolevad mudelid (üks rea kohta)</Label>
                        <Textarea
                          value={config.models.join("\n")}
                          onChange={(e) => updateModels(provider, e.target.value)}
                          className="bg-slate-800/50 border-slate-700 text-white min-h-[100px]"
                          placeholder="Sisesta mudelite nimed, üks rea kohta"
                        />
                      </div>

                      <div className="text-xs text-slate-400">Mudeleid: {config.models.length}</div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Üldised seaded</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert className="bg-blue-900/20 border-blue-800">
                  <AlertDescription className="text-blue-200">
                    Siin saad tulevikus konfigureerida täiendavaid seadeid nagu maksimaalset tokeni arvu, temperatuuri
                    vaikeväärtusi ja teisi parameetreid.
                  </AlertDescription>
                </Alert>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-slate-300">Maksimaalne tokeni arv</Label>
                    <Input type="number" defaultValue="4000" className="bg-slate-800/50 border-slate-700 text-white" />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-300">Vaikimisi temperatuur</Label>
                    <Input
                      type="number"
                      step="0.1"
                      min="0"
                      max="2"
                      defaultValue="0.7"
                      className="bg-slate-800/50 border-slate-700 text-white"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="local-llms" className="space-y-6">
            <LocalLLMManager />
          </TabsContent>

          <TabsContent value="logs" className="space-y-6">
            <InteractionLogs />
          </TabsContent>

          <TabsContent value="documentation" className="space-y-6">
            <LLMDocumentation />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
