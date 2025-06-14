"use client"

import { useEffect, useState, useRef } from "react"
import {
  Activity,
  Bell,
  Brain,
  Command,
  Database,
  Download,
  FileText,
  Globe,
  Hexagon,
  type LucideIcon,
  MessageSquare,
  Moon,
  Search,
  Settings,
  Shield,
  Sparkles,
  Terminal,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { ModelCard } from "@/components/model-card"

export default function LuunaAIPlatform() {
  const [systemStatus, setSystemStatus] = useState(85)
  const [cpuUsage, setCpuUsage] = useState(42)
  const [memoryUsage, setMemoryUsage] = useState(68)
  const [networkStatus, setNetworkStatus] = useState(92)
  const [securityLevel, setSecurityLevel] = useState(75)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isLoading, setIsLoading] = useState(true)
  const [selectedModel, setSelectedModel] = useState("luuna-70b")
  const [searchQuery, setSearchQuery] = useState("")

  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  // Update time
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // Simulate changing data
  useEffect(() => {
    const interval = setInterval(() => {
      setCpuUsage(Math.floor(Math.random() * 30) + 30)
      setMemoryUsage(Math.floor(Math.random() * 20) + 60)
      setNetworkStatus(Math.floor(Math.random() * 15) + 80)
      setSystemStatus(Math.floor(Math.random() * 10) + 80)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  // Particle effect
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    const particles: Particle[] = []
    const particleCount = 100

    class Particle {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      color: string

      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 3 + 1
        this.speedX = (Math.random() - 0.5) * 0.5
        this.speedY = (Math.random() - 0.5) * 0.5
        this.color = `rgba(${Math.floor(Math.random() * 100) + 100}, ${Math.floor(Math.random() * 100) + 150}, ${Math.floor(Math.random() * 55) + 200}, ${Math.random() * 0.5 + 0.2})`
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY

        if (this.x > canvas.width) this.x = 0
        if (this.x < 0) this.x = canvas.width
        if (this.y > canvas.height) this.y = 0
        if (this.y < 0) this.y = canvas.height
      }

      draw() {
        if (!ctx) return
        ctx.fillStyle = this.color
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle())
    }

    function animate() {
      if (!ctx || !canvas) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (const particle of particles) {
        particle.update()
        particle.draw()
      }

      requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      if (!canvas) return
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  // Format time
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  // Format date
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // AI models data
  const featuredModels = [
    {
      id: "luuna-70b",
      name: "Luuna-70B",
      description: "Our flagship large language model with 70B parameters",
      category: "Text",
      icon: Brain,
      color: "cyan",
      performance: 92,
      usage: 78,
    },
    {
      id: "luuna-vision",
      name: "Luuna Vision",
      description: "Multimodal model for image understanding and generation",
      category: "Vision",
      icon: Sparkles,
      color: "purple",
      performance: 88,
      usage: 65,
    },
    {
      id: "luuna-code",
      name: "Luuna Code",
      description: "Specialized model for code generation and completion",
      category: "Code",
      icon: Terminal,
      color: "green",
      performance: 85,
      usage: 72,
    },
  ]

  return (
    <div className="dark min-h-screen bg-gradient-to-br from-black to-slate-900 text-slate-100 relative overflow-hidden">
      {/* Background particle effect */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-30" />

      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="flex flex-col items-center">
            <div className="relative w-24 h-24">
              <div className="absolute inset-0 border-4 border-cyan-500/30 rounded-full animate-ping"></div>
              <div className="absolute inset-2 border-4 border-t-cyan-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
              <div className="absolute inset-4 border-4 border-r-purple-500 border-t-transparent border-b-transparent border-l-transparent rounded-full animate-spin-slow"></div>
              <div className="absolute inset-6 border-4 border-b-blue-500 border-t-transparent border-r-transparent border-l-transparent rounded-full animate-spin-slower"></div>
              <div className="absolute inset-8 border-4 border-l-green-500 border-t-transparent border-r-transparent border-b-transparent rounded-full animate-spin"></div>
            </div>
            <div className="mt-4 text-cyan-500 font-mono text-sm tracking-wider">LUUNA OS INITIALIZING</div>
          </div>
        </div>
      )}

      <div className="container mx-auto p-4 relative z-10">
        {/* Header */}
        <header className="flex items-center justify-between py-4 border-b border-slate-700/50 mb-6">
          <div className="flex items-center space-x-2">
            <Hexagon className="h-8 w-8 text-cyan-500" />
            <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              LUUNA OS
            </span>
          </div>

          <div className="flex items-center space-x-6">
            <div className="hidden md:flex items-center space-x-1 bg-slate-800/50 rounded-full px-3 py-1.5 border border-slate-700/50 backdrop-blur-sm">
              <Search className="h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search models, datasets, tools..."
                className="bg-transparent border-none focus:outline-none text-sm w-64 placeholder:text-slate-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex items-center space-x-3">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative text-slate-400 hover:text-slate-100">
                      <Bell className="h-5 w-5" />
                      <span className="absolute -top-1 -right-1 h-2 w-2 bg-cyan-500 rounded-full animate-pulse"></span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Notifications</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        // Theme toggle handled by ThemeProvider
                      }}
                      className="text-slate-400 hover:text-slate-100"
                    >
                      <Moon className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Toggle theme</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <Avatar>
                <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User" />
                <AvatarFallback className="bg-slate-700 text-cyan-500">LU</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Main content */}
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar */}
          <div className="col-span-12 md:col-span-3 lg:col-span-2">
            <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm h-full">
              <CardContent className="p-4">
                <nav className="space-y-2">
                  <NavItem icon={Command} label="Dashboard" active />
                  <NavItem icon={Brain} label="AI Models" />
                  <NavItem icon={Database} label="Datasets" />
                  <NavItem icon={Activity} label="Experiments" href="/experiments" />
                  <NavItem icon={Globe} label="Deployments" />
                  <NavItem icon={FileText} label="Documentation" />
                  <NavItem icon={MessageSquare} label="Community" />
                  <NavItem icon={Settings} label="Settings" />
                  <NavItem icon={Shield} label="Admin" href="/admin" />
                </nav>

                <div className="mt-8 pt-6 border-t border-slate-700/50">
                  <div className="text-xs text-slate-500 mb-2 font-mono">SYSTEM STATUS</div>
                  <div className="space-y-3">
                    <StatusItem label="LuunaOS" value={systemStatus} color="cyan" />
                    <StatusItem label="Security" value={securityLevel} color="green" />
                    <StatusItem label="Network" value={networkStatus} color="blue" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main dashboard */}
          <div className="col-span-12 md:col-span-9 lg:col-span-7">
            <div className="grid gap-6">
              {/* Welcome banner */}
              <Card className="bg-gradient-to-r from-slate-900/90 to-blue-900/30 border-slate-700/50 backdrop-blur-sm overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
                    <div>
                      <h1 className="text-2xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                        Welcome to LuunaOS AI Platform
                      </h1>
                      <p className="text-slate-300 mb-4 max-w-2xl">
                        Access state-of-the-art AI models, tools, and resources to build, train, and deploy machine
                        learning applications.
                      </p>
                      <div className="flex flex-wrap gap-3">
                        <Button className="bg-cyan-600 hover:bg-cyan-700">
                          <Sparkles className="mr-2 h-4 w-4" />
                          Explore Models
                        </Button>
                        <Button variant="outline" className="border-slate-700 bg-slate-800/50 hover:bg-slate-700/50">
                          <FileText className="mr-2 h-4 w-4" />
                          Documentation
                        </Button>
                      </div>
                    </div>
                    <div className="hidden md:block relative w-32 h-32">
                      <div className="absolute inset-0 border-4 border-cyan-500/30 rounded-full"></div>
                      <div className="absolute inset-2 border-4 border-t-cyan-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                      <div className="absolute inset-4 border-4 border-r-purple-500 border-t-transparent border-b-transparent border-l-transparent rounded-full animate-spin-slow"></div>
                      <div className="absolute inset-6 border-4 border-b-blue-500 border-t-transparent border-r-transparent border-l-transparent rounded-full animate-spin-slower"></div>
                      <div className="absolute inset-8 border-4 border-l-green-500 border-t-transparent border-r-transparent border-b-transparent rounded-full animate-spin"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Featured Models */}
              <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm overflow-hidden">
                <CardHeader className="border-b border-slate-700/50 pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-slate-100 flex items-center">
                      <Brain className="mr-2 h-5 w-5 text-cyan-500" />
                      Featured AI Models
                    </CardTitle>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 border-slate-700 bg-slate-800/50 hover:bg-slate-700/50"
                      >
                        View All Models
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {featuredModels.map((model) => (
                      <ModelCard
                        key={model.id}
                        id={model.id}
                        name={model.name}
                        description={model.description}
                        category={model.category}
                        icon={model.icon}
                        color={model.color}
                        performance={model.performance}
                        usage={model.usage}
                        isSelected={selectedModel === model.id}
                        onSelect={() => setSelectedModel(model.id)}
                      />
                    ))}
                  </div>

                  <div className="mt-8">
                    <Tabs defaultValue="overview" className="w-full">
                      <div className="flex items-center justify-between mb-4">
                        <TabsList className="bg-slate-800/50 p-1">
                          <TabsTrigger
                            value="overview"
                            className="data-[state=active]:bg-slate-700 data-[state=active]:text-cyan-400"
                          >
                            Overview
                          </TabsTrigger>
                          <TabsTrigger
                            value="performance"
                            className="data-[state=active]:bg-slate-700 data-[state=active]:text-cyan-400"
                          >
                            Performance
                          </TabsTrigger>
                          <TabsTrigger
                            value="usage"
                            className="data-[state=active]:bg-slate-700 data-[state=active]:text-cyan-400"
                          >
                            Usage
                          </TabsTrigger>
                        </TabsList>

                        <div className="flex items-center space-x-2 text-xs text-slate-400">
                          <div className="flex items-center">
                            <div className="h-2 w-2 rounded-full bg-cyan-500 mr-1"></div>
                            Accuracy
                          </div>
                          <div className="flex items-center">
                            <div className="h-2 w-2 rounded-full bg-purple-500 mr-1"></div>
                            Latency
                          </div>
                          <div className="flex items-center">
                            <div className="h-2 w-2 rounded-full bg-blue-500 mr-1"></div>
                            Throughput
                          </div>
                        </div>
                      </div>

                      <TabsContent value="overview" className="mt-0">
                        <div className="bg-slate-800/30 rounded-lg border border-slate-700/50 p-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h3 className="text-lg font-medium text-slate-200 mb-2">
                                {featuredModels.find((m) => m.id === selectedModel)?.name || "Luuna-70B"}
                              </h3>
                              <p className="text-slate-400 mb-4">
                                {featuredModels.find((m) => m.id === selectedModel)?.description ||
                                  "Our flagship large language model with 70B parameters. Optimized for natural language understanding and generation with enhanced reasoning capabilities."}
                              </p>
                              <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-slate-400">Model Type</span>
                                  <span className="text-sm text-slate-300">Transformer</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-slate-400">Parameters</span>
                                  <span className="text-sm text-slate-300">70 Billion</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-slate-400">Context Length</span>
                                  <span className="text-sm text-slate-300">128K tokens</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-slate-400">Training Data</span>
                                  <span className="text-sm text-slate-300">Up to April 2024</span>
                                </div>
                              </div>
                              <div className="mt-4">
                                <Button className="bg-cyan-600 hover:bg-cyan-700 mr-2">
                                  <Sparkles className="mr-2 h-4 w-4" />
                                  Try Model
                                </Button>
                                <Button
                                  variant="outline"
                                  className="border-slate-700 bg-slate-800/50 hover:bg-slate-700/50"
                                >
                                  <FileText className="mr-2 h-4 w-4" />
                                  Documentation
                                </Button>
                              </div>
                            </div>
                            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
                              <h4 className="text-sm font-medium text-slate-300 mb-3">Capabilities</h4>
                              <div className="space-y-3">
                                <div>
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="text-xs text-slate-400">Text Generation</span>
                                    <span className="text-xs text-cyan-400">98%</span>
                                  </div>
                                  <Progress value={98} className="h-1.5 bg-slate-700">
                                    <div
                                      className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                                      style={{ width: "98%" }}
                                    />
                                  </Progress>
                                </div>
                                <div>
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="text-xs text-slate-400">Reasoning</span>
                                    <span className="text-xs text-cyan-400">92%</span>
                                  </div>
                                  <Progress value={92} className="h-1.5 bg-slate-700">
                                    <div
                                      className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                                      style={{ width: "92%" }}
                                    />
                                  </Progress>
                                </div>
                                <div>
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="text-xs text-slate-400">Code Generation</span>
                                    <span className="text-xs text-cyan-400">85%</span>
                                  </div>
                                  <Progress value={85} className="h-1.5 bg-slate-700">
                                    <div
                                      className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                                      style={{ width: "85%" }}
                                    />
                                  </Progress>
                                </div>
                                <div>
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="text-xs text-slate-400">Multimodal</span>
                                    <span className="text-xs text-cyan-400">78%</span>
                                  </div>
                                  <Progress value={78} className="h-1.5 bg-slate-700">
                                    <div
                                      className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                                      style={{ width: "78%" }}
                                    />
                                  </Progress>
                                </div>
                              </div>
                              <div className="mt-4 pt-3 border-t border-slate-700/50">
                                <h4 className="text-sm font-medium text-slate-300 mb-2">Benchmarks</h4>
                                <div className="grid grid-cols-2 gap-2">
                                  <div className="bg-slate-800/70 rounded p-2">
                                    <div className="text-xs text-slate-500">MMLU</div>
                                    <div className="text-sm font-medium text-cyan-400">89.2%</div>
                                  </div>
                                  <div className="bg-slate-800/70 rounded p-2">
                                    <div className="text-xs text-slate-500">HumanEval</div>
                                    <div className="text-sm font-medium text-cyan-400">76.5%</div>
                                  </div>
                                  <div className="bg-slate-800/70 rounded p-2">
                                    <div className="text-xs text-slate-500">GSM8K</div>
                                    <div className="text-sm font-medium text-cyan-400">92.3%</div>
                                  </div>
                                  <div className="bg-slate-800/70 rounded p-2">
                                    <div className="text-xs text-slate-500">HELM</div>
                                    <div className="text-sm font-medium text-cyan-400">85.7%</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="performance" className="mt-0">
                        <div className="h-64 w-full relative bg-slate-800/30 rounded-lg border border-slate-700/50 overflow-hidden">
                          <PerformanceChart />
                          <div className="absolute bottom-4 right-4 bg-slate-900/80 backdrop-blur-sm rounded-md px-3 py-2 border border-slate-700/50">
                            <div className="text-xs text-slate-400">Model Performance</div>
                            <div className="text-lg font-mono text-cyan-400">92.5%</div>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="usage" className="mt-0">
                        <div className="bg-slate-800/30 rounded-lg border border-slate-700/50 overflow-hidden">
                          <div className="grid grid-cols-12 text-xs text-slate-400 p-3 border-b border-slate-700/50 bg-slate-800/50">
                            <div className="col-span-3">Application</div>
                            <div className="col-span-2">Model</div>
                            <div className="col-span-2">Requests</div>
                            <div className="col-span-2">Tokens</div>
                            <div className="col-span-2">Latency</div>
                            <div className="col-span-1">Status</div>
                          </div>

                          <div className="divide-y divide-slate-700/30">
                            <UsageRow
                              app="Customer Support"
                              model="Luuna-70B"
                              requests="12,458"
                              tokens="3.2M"
                              latency="245ms"
                              status="active"
                            />
                            <UsageRow
                              app="Content Generation"
                              model="Luuna-70B"
                              requests="8,721"
                              tokens="5.7M"
                              latency="312ms"
                              status="active"
                            />
                            <UsageRow
                              app="Code Assistant"
                              model="Luuna-Code"
                              requests="4,532"
                              tokens="1.8M"
                              latency="189ms"
                              status="active"
                            />
                            <UsageRow
                              app="Image Analysis"
                              model="Luuna-Vision"
                              requests="2,145"
                              tokens="0.9M"
                              latency="356ms"
                              status="active"
                            />
                            <UsageRow
                              app="Research Assistant"
                              model="Luuna-70B"
                              requests="1,876"
                              tokens="4.2M"
                              latency="278ms"
                              status="active"
                            />
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                </CardContent>
              </Card>

              {/* Tools & Frameworks */}
              <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-slate-100 flex items-center text-base">
                    <Terminal className="mr-2 h-5 w-5 text-green-500" />
                    Tools & Frameworks
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <FrameworkCard name="TensorFlow" icon="/placeholder.svg?height=40&width=40" />
                    <FrameworkCard name="PyTorch" icon="/placeholder.svg?height=40&width=40" />
                    <FrameworkCard name="scikit-learn" icon="/placeholder.svg?height=40&width=40" />
                    <FrameworkCard name="Keras" icon="/placeholder.svg?height=40&width=40" />
                    <FrameworkCard name="Hugging Face" icon="/placeholder.svg?height=40&width=40" />
                    <FrameworkCard name="OpenCV" icon="/placeholder.svg?height=40&width=40" />
                    <FrameworkCard name="NLTK" icon="/placeholder.svg?height=40&width=40" />
                    <FrameworkCard name="XGBoost" icon="/placeholder.svg?height=40&width=40" />
                  </div>
                </CardContent>
              </Card>

              {/* Community & Resources */}
              <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                  <CardTitle className="text-slate-100 flex items-center text-base">
                    <MessageSquare className="mr-2 h-5 w-5 text-blue-500" />
                    Community & Resources
                  </CardTitle>
                  <Badge variant="outline" className="bg-slate-800/50 text-blue-400 border-blue-500/50">
                    4 New Updates
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <ResourceItem
                      title="Getting Started with LuunaOS"
                      time="2 days ago"
                      description="Learn how to set up and configure LuunaOS for your AI projects."
                      icon={FileText}
                      unread
                    />
                    <ResourceItem
                      title="Model Fine-tuning Workshop"
                      time="1 week ago"
                      description="Join our live workshop on fine-tuning Luuna models for specific domains."
                      icon={Sparkles}
                      unread
                    />
                    <ResourceItem
                      title="Community Showcase: Healthcare AI"
                      time="2 weeks ago"
                      description="See how researchers are using Luuna models for medical diagnosis assistance."
                      icon={Activity}
                      unread
                    />
                    <ResourceItem
                      title="API Documentation Update"
                      time="3 weeks ago"
                      description="New endpoints and features added to the Luuna API."
                      icon={Terminal}
                      unread
                    />
                  </div>
                </CardContent>
                <CardFooter className="border-t border-slate-700/50 pt-4">
                  <div className="flex items-center w-full space-x-2">
                    <input
                      type="text"
                      placeholder="Search resources..."
                      className="flex-1 bg-slate-800/50 border border-slate-700/50 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500"
                    />
                    <Button size="icon" className="bg-blue-600 hover:bg-blue-700">
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </div>
          </div>

          {/* Right sidebar */}
          <div className="col-span-12 lg:col-span-3">
            <div className="grid gap-6">
              {/* System time */}
              <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm overflow-hidden">
                <CardContent className="p-0">
                  <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 border-b border-slate-700/50">
                    <div className="text-center">
                      <div className="text-xs text-slate-500 mb-1 font-mono">SYSTEM TIME</div>
                      <div className="text-3xl font-mono text-cyan-400 mb-1">{formatTime(currentTime)}</div>
                      <div className="text-sm text-slate-400">{formatDate(currentTime)}</div>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-slate-800/50 rounded-md p-3 border border-slate-700/50">
                        <div className="text-xs text-slate-500 mb-1">Uptime</div>
                        <div className="text-sm font-mono text-slate-200">14d 06:42:18</div>
                      </div>
                      <div className="bg-slate-800/50 rounded-md p-3 border border-slate-700/50">
                        <div className="text-xs text-slate-500 mb-1">LuunaOS</div>
                        <div className="text-sm font-mono text-slate-200">v2.4.5</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick actions */}
              <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-slate-100 text-base">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    <ActionButton icon={Brain} label="AI Playground" href="/playground" />
                    <ActionButton icon={Brain} label="New Model" />
                    <ActionButton icon={Database} label="Add Dataset" />
                    <ActionButton icon={Terminal} label="API Console" />
                    <ActionButton icon={Download} label="Export" />
                  </div>
                </CardContent>
              </Card>

              {/* Available Models */}
              <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-slate-100 text-base">Available Models</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-sm text-slate-400">Luuna-70B</div>
                        <div className="text-xs text-cyan-400">Available</div>
                      </div>
                      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                          style={{ width: "100%" }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-sm text-slate-400">Luuna-Vision</div>
                        <div className="text-xs text-purple-400">Available</div>
                      </div>
                      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                          style={{ width: "100%" }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-sm text-slate-400">Luuna-Code</div>
                        <div className="text-xs text-blue-400">Available</div>
                      </div>
                      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                          style={{ width: "100%" }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-sm text-slate-400">Luuna-7B</div>
                        <div className="text-xs text-green-400">Available</div>
                      </div>
                      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                          style={{ width: "100%" }}
                        ></div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-700/50">
                      <div className="flex items-center justify-between text-sm">
                        <div className="text-slate-400">Model Priority</div>
                        <div className="flex items-center">
                          <Slider defaultValue={[3]} max={5} step={1} className="w-24 mr-2" />
                          <span className="text-cyan-400">3/5</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* External Models */}
              <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-slate-100 text-base">External Models</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center mr-2">
                          <span className="text-xs text-cyan-400">GPT</span>
                        </div>
                        <Label className="text-sm text-slate-400">GPT-4o</Label>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center mr-2">
                          <span className="text-xs text-purple-400">CL</span>
                        </div>
                        <Label className="text-sm text-slate-400">Claude-3.5</Label>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center mr-2">
                          <span className="text-xs text-blue-400">LL</span>
                        </div>
                        <Label className="text-sm text-slate-400">Llama-3</Label>
                      </div>
                      <Switch />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center mr-2">
                          <span className="text-xs text-green-400">MI</span>
                        </div>
                        <Label className="text-sm text-slate-400">Mistral-Large</Label>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Component for nav items
function NavItem({
  icon: Icon,
  label,
  active,
  href,
}: { icon: LucideIcon; label: string; active?: boolean; href?: string }) {
  const buttonClasses = `w-full justify-start ${active ? "bg-slate-800/70 text-cyan-400" : "text-slate-400 hover:text-slate-100"}`

  if (href) {
    return (
      <Button variant="ghost" className={buttonClasses} asChild>
        <a href={href}>
          <Icon className="mr-2 h-4 w-4" />
          {label}
        </a>
      </Button>
    )
  }

  return (
    <Button variant="ghost" className={buttonClasses}>
      <Icon className="mr-2 h-4 w-4" />
      {label}
    </Button>
  )
}

// Component for status items
function StatusItem({ label, value, color }: { label: string; value: number; color: string }) {
  const getColorClasses = () => {
    if (color === "cyan") return "from-cyan-500 to-blue-500"
    if (color === "green") return "from-green-500 to-emerald-500"
    if (color === "blue") return "from-blue-500 to-indigo-500"
    if (color === "purple") return "from-purple-500 to-pink-500"
    return "from-cyan-500 to-blue-500"
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <div className="text-xs text-slate-400">{label}</div>
        <div className="text-xs text-slate-400">{value}%</div>
      </div>
      <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r ${getColorClasses()} rounded-full`}
          style={{ width: `${value}%` }}
        ></div>
      </div>
    </div>
  )
}

// Performance chart component
function PerformanceChart() {
  return (
    <div className="h-full w-full flex items-end justify-between px-4 pt-4 pb-8 relative">
      {/* Y-axis labels */}
      <div className="absolute left-2 top-0 h-full flex flex-col justify-between py-4">
        <div className="text-xs text-slate-500">100%</div>
        <div className="text-xs text-slate-500">75%</div>
        <div className="text-xs text-slate-500">50%</div>
        <div className="text-xs text-slate-500">25%</div>
        <div className="text-xs text-slate-500">0%</div>
      </div>

      {/* X-axis grid lines */}
      <div className="absolute left-0 right-0 top-0 h-full flex flex-col justify-between py-4 px-10">
        <div className="border-b border-slate-700/30 w-full"></div>
        <div className="border-b border-slate-700/30 w-full"></div>
        <div className="border-b border-slate-700/30 w-full"></div>
        <div className="border-b border-slate-700/30 w-full"></div>
        <div className="border-b border-slate-700/30 w-full"></div>
      </div>

      {/* Chart bars */}
      <div className="flex-1 h-full flex items-end justify-between px-2 z-10">
        {Array.from({ length: 24 }).map((_, i) => {
          const cpuHeight = Math.floor(Math.random() * 60) + 20
          const memHeight = Math.floor(Math.random() * 40) + 40
          const netHeight = Math.floor(Math.random() * 30) + 30

          return (
            <div key={i} className="flex space-x-0.5">
              <div
                className="w-1 bg-gradient-to-t from-cyan-500 to-cyan-400 rounded-t-sm"
                style={{ height: `${cpuHeight}%` }}
              ></div>
              <div
                className="w-1 bg-gradient-to-t from-purple-500 to-purple-400 rounded-t-sm"
                style={{ height: `${memHeight}%` }}
              ></div>
              <div
                className="w-1 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-sm"
                style={{ height: `${netHeight}%` }}
              ></div>
            </div>
          )
        })}
      </div>

      {/* X-axis labels */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-between px-10">
        <div className="text-xs text-slate-500">00:00</div>
        <div className="text-xs text-slate-500">06:00</div>
        <div className="text-xs text-slate-500">12:00</div>
        <div className="text-xs text-slate-500">18:00</div>
        <div className="text-xs text-slate-500">24:00</div>
      </div>
    </div>
  )
}

// Usage row component
function UsageRow({
  app,
  model,
  requests,
  tokens,
  latency,
  status,
}: {
  app: string
  model: string
  requests: string
  tokens: string
  latency: string
  status: string
}) {
  return (
    <div className="grid grid-cols-12 py-2 px-3 text-sm hover:bg-slate-800/50">
      <div className="col-span-3 text-slate-300">{app}</div>
      <div className="col-span-2 text-slate-400">{model}</div>
      <div className="col-span-2 text-cyan-400">{requests}</div>
      <div className="col-span-2 text-purple-400">{tokens}</div>
      <div className="col-span-2 text-blue-400">{latency}</div>
      <div className="col-span-1">
        <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/30 text-xs">
          {status}
        </Badge>
      </div>
    </div>
  )
}

// Framework card component
function FrameworkCard({ name, icon }: { name: string; icon: string }) {
  return (
    <Button
      variant="outline"
      className="h-auto py-3 px-3 border-slate-700 bg-slate-800/50 hover:bg-slate-700/50 flex flex-col items-center justify-center space-y-2 w-full"
    >
      <Avatar className="h-8 w-8 rounded-md">
        <AvatarImage src={icon || "/placeholder.svg"} alt={name} />
        <AvatarFallback className="bg-slate-700 text-cyan-500 rounded-md">{name.charAt(0)}</AvatarFallback>
      </Avatar>
      <span className="text-xs">{name}</span>
    </Button>
  )
}

// Resource item component
function ResourceItem({
  title,
  time,
  description,
  icon: Icon,
  unread,
}: {
  title: string
  time: string
  description: string
  icon: LucideIcon
  unread?: boolean
}) {
  return (
    <div className={`flex space-x-3 p-2 rounded-md ${unread ? "bg-slate-800/50 border border-slate-700/50" : ""}`}>
      <div className="flex-shrink-0 h-8 w-8 bg-slate-800 rounded-full flex items-center justify-center">
        <Icon className="h-4 w-4 text-cyan-500" />
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium text-slate-200">{title}</div>
          <div className="text-xs text-slate-500">{time}</div>
        </div>
        <div className="text-xs text-slate-400 mt-1">{description}</div>
      </div>
      {unread && (
        <div className="flex-shrink-0 self-center">
          <div className="h-2 w-2 rounded-full bg-cyan-500"></div>
        </div>
      )}
    </div>
  )
}

// Action button component
function ActionButton({ icon: Icon, label, href }: { icon: LucideIcon; label: string; href?: string }) {
  const ButtonContent = (
    <>
      <Icon className="h-5 w-5 text-cyan-500" />
      <span className="text-xs">{label}</span>
    </>
  )

  return href ? (
    <Button
      variant="outline"
      className="h-auto py-3 px-3 border-slate-700 bg-slate-800/50 hover:bg-slate-700/50 flex flex-col items-center justify-center space-y-1 w-full"
      asChild
    >
      <a href={href}>{ButtonContent}</a>
    </Button>
  ) : (
    <Button
      variant="outline"
      className="h-auto py-3 px-3 border-slate-700 bg-slate-800/50 hover:bg-slate-700/50 flex flex-col items-center justify-center space-y-1 w-full"
    >
      {ButtonContent}
    </Button>
  )
}
