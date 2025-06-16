"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, Search, Download, Trash2, Clock, CheckCircle, XCircle, RefreshCw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

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

export function InteractionLogs() {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedLLM, setSelectedLLM] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [llms, setLLMs] = useState<any[]>([])
  const { toast } = useToast()

  useEffect(() => {
    loadLogs()
    loadLLMs()
  }, [])

  const loadLogs = async () => {
    try {
      const response = await fetch("/api/admin/local-llms/logs")
      if (response.ok) {
        const data = await response.json()
        setLogs(data.logs)
      }
    } catch (error) {
      toast({
        title: "Viga",
        description: "Ei saanud logisid laadida",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const loadLLMs = async () => {
    try {
      const response = await fetch("/api/admin/local-llms")
      if (response.ok) {
        const data = await response.json()
        setLLMs(data)
      }
    } catch (error) {
      console.error("Failed to load LLMs:", error)
    }
  }

  const clearLogs = async () => {
    try {
      const response = await fetch("/api/admin/local-llms/logs", {
        method: "DELETE",
      })

      if (response.ok) {
        setLogs([])
        toast({
          title: "Kustutatud",
          description: "Kõik logid on kustutatud",
        })
      }
    } catch (error) {
      toast({
        title: "Viga",
        description: "Ei saanud logisid kustutada",
        variant: "destructive",
      })
    }
  }

  const exportLogs = () => {
    const filteredLogs = getFilteredLogs()
    const csvContent = [
      "Timestamp,LLM,Model,Prompt,Response,Error,Response Time (ms),Tokens,Success",
      ...filteredLogs.map((log) =>
        [
          log.timestamp,
          log.llmName,
          log.model,
          `"${log.prompt.replace(/"/g, '""')}"`,
          `"${(log.response || "").replace(/"/g, '""')}"`,
          `"${(log.error || "").replace(/"/g, '""')}"`,
          log.responseTime,
          log.tokens || 0,
          log.success,
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `llm-logs-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const getFilteredLogs = () => {
    return logs.filter((log) => {
      const matchesSearch =
        searchTerm === "" ||
        log.prompt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (log.response || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.llmName.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesLLM = selectedLLM === "all" || log.llmId === selectedLLM

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "success" && log.success) ||
        (statusFilter === "error" && !log.success)

      return matchesSearch && matchesLLM && matchesStatus
    })
  }

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString()
  }

  const formatResponseTime = (ms: number) => {
    if (ms < 1000) return `${ms}ms`
    return `${(ms / 1000).toFixed(1)}s`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-white">Laadin logisid...</div>
      </div>
    )
  }

  const filteredLogs = getFilteredLogs()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <FileText className="h-6 w-6 text-cyan-500" />
          <h2 className="text-2xl font-bold text-white">Interaktsiooni logid</h2>
        </div>
        <div className="flex items-center space-x-3">
          <Button onClick={loadLogs} variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800">
            <RefreshCw className="h-4 w-4 mr-2" />
            Värskenda
          </Button>
          <Button onClick={exportLogs} variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800">
            <Download className="h-4 w-4 mr-2" />
            Ekspordi CSV
          </Button>
          <Button onClick={clearLogs} variant="outline" className="border-red-700 text-red-300 hover:bg-red-900/20">
            <Trash2 className="h-4 w-4 mr-2" />
            Kustuta kõik
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-slate-300">Otsi</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-slate-800 border-slate-700 pl-10"
                  placeholder="Otsi promptidest või vastustest..."
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-slate-300">LLM</label>
              <Select value={selectedLLM} onValueChange={setSelectedLLM}>
                <SelectTrigger className="bg-slate-800 border-slate-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="all">Kõik LLM-id</SelectItem>
                  {llms.map((llm) => (
                    <SelectItem key={llm.id} value={llm.id}>
                      {llm.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-slate-300">Staatus</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="bg-slate-800 border-slate-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="all">Kõik</SelectItem>
                  <SelectItem value="success">Õnnestunud</SelectItem>
                  <SelectItem value="error">Ebaõnnestunud</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-slate-300">Statistika</label>
              <div className="text-sm text-slate-400">
                Kokku: {filteredLogs.length} / {logs.length}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Logs */}
      <div className="space-y-4">
        {filteredLogs.length === 0 ? (
          <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
            <CardContent className="text-center py-12">
              <FileText className="h-12 w-12 text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">Logisid ei leitud</h3>
              <p className="text-slate-400">Muuda filtreerimise kriteeriume või testi LLM-e</p>
            </CardContent>
          </Card>
        ) : (
          filteredLogs.map((log) => (
            <Card key={log.id} className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <Badge variant="secondary" className={log.success ? "bg-green-600" : "bg-red-600"}>
                      {log.success ? <CheckCircle className="h-3 w-3 mr-1" /> : <XCircle className="h-3 w-3 mr-1" />}
                      {log.success ? "Õnnestus" : "Ebaõnnestus"}
                    </Badge>
                    <span className="text-sm text-slate-300">{log.llmName}</span>
                    <span className="text-sm text-slate-400">•</span>
                    <span className="text-sm text-slate-400">{log.model}</span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-slate-400">
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatResponseTime(log.responseTime)}
                    </div>
                    {log.tokens && <div>{log.tokens} tokenid</div>}
                    <div>{formatTime(log.timestamp)}</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="text-sm font-medium text-slate-300 mb-1">Prompt:</div>
                    <div className="text-sm text-slate-400 bg-slate-800/50 p-2 rounded border-l-2 border-blue-500">
                      {log.prompt}
                    </div>
                  </div>

                  {log.success && log.response && (
                    <div>
                      <div className="text-sm font-medium text-slate-300 mb-1">Vastus:</div>
                      <div className="text-sm text-slate-400 bg-slate-800/50 p-2 rounded border-l-2 border-green-500">
                        {log.response}
                      </div>
                    </div>
                  )}

                  {!log.success && log.error && (
                    <div>
                      <div className="text-sm font-medium text-slate-300 mb-1">Viga:</div>
                      <div className="text-sm text-red-400 bg-slate-800/50 p-2 rounded border-l-2 border-red-500">
                        {log.error}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
