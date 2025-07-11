"use client"

import type React from "react"

import { useState, useRef, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { TooltipProvider } from "@/components/ui/tooltip"
import {
  Network,
  Target,
  Activity,
  Play,
  Pause,
  RotateCcw,
  Download,
  Settings,
  Maximize,
  GitBranch,
  Radio,
  Waves,
} from "lucide-react"

interface AllostericSite {
  id: string
  name: string
  residues: number[]
  type: "orthosteric" | "allosteric" | "cryptic"
  function: string
  ligand?: string
  affinity: number
  cooperativity: number
  x: number
  y: number
}

interface AllostericPath {
  id: string
  name: string
  source: string
  target: string
  residues: number[]
  strength: number
  type: "activation" | "inhibition" | "modulation"
  mechanism: "conformational" | "dynamic" | "electrostatic"
  distance: number
  cooperativity: number
}

interface ConformationalState {
  id: string
  name: string
  energy: number
  population: number
  rmsd: number
  contacts: number[][]
  secondaryStructure: Array<{
    type: "helix" | "sheet" | "loop"
    start: number
    end: number
    stability: number
  }>
  allostericSites: Array<{
    siteId: string
    accessibility: number
    affinity: number
  }>
}

interface AllostericNetworkData {
  protein: {
    name: string
    length: number
    sequence: string
  }
  sites: AllostericSite[]
  paths: AllostericPath[]
  states: ConformationalState[]
  variants: Array<{
    position: number
    wildType: string
    mutant: string
    allostericEffect: "enhancing" | "disrupting" | "neutral"
    pathwayImpact: string[]
    cooperativityChange: number
    affinityChange: number
  }>
  dynamics: Array<{
    timepoint: number
    correlations: number[][]
    fluctuations: number[]
    pathFlux: Array<{
      pathId: string
      flux: number
      direction: number
    }>
  }>
}

interface AllostericNetworkViewerProps {
  data: AllostericNetworkData
  selectedVariants?: number[]
}

export function AllostericNetworkViewer({ data, selectedVariants = [] }: AllostericNetworkViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()

  const [isAnimating, setIsAnimating] = useState(false)
  const [currentTimepoint, setCurrentTimepoint] = useState(0)
  const [selectedSite, setSelectedSite] = useState<string | null>(null)
  const [selectedPath, setSelectedPath] = useState<string | null>(null)
  const [selectedState, setSelectedState] = useState<string>("state_1")
  const [viewMode, setViewMode] = useState<"network" | "pathways" | "dynamics" | "correlations">("network")
  const [colorScheme, setColorScheme] = useState<"type" | "strength" | "cooperativity" | "energy">("type")
  const [showPaths, setShowPaths] = useState(true)
  const [showFlux, setShowFlux] = useState(false)
  const [pathStrengthThreshold, setPathStrengthThreshold] = useState([0.3])
  const [correlationThreshold, setCorrelationThreshold] = useState([0.5])
  const [animationSpeed, setAnimationSpeed] = useState([1])
  const [zoom, setZoom] = useState([1])
  const [isFullscreen, setIsFullscreen] = useState(false)

  const totalTimepoints = data.dynamics.length
  const currentDynamics = data.dynamics[currentTimepoint] || data.dynamics[0]
  const currentState = data.states.find((s) => s.id === selectedState) || data.states[0]

  // Animation loop for dynamic visualization
  const animate = useCallback(() => {
    if (isAnimating && currentTimepoint < totalTimepoints - 1) {
      setCurrentTimepoint((prev) => prev + 1)
    } else if (isAnimating && currentTimepoint >= totalTimepoints - 1) {
      setCurrentTimepoint(0) // Loop animation
    }

    if (isAnimating) {
      const frameDelay = Math.max(50, 200 / animationSpeed[0])
      animationRef.current = setTimeout(() => {
        requestAnimationFrame(animate)
      }, frameDelay)
    }
  }, [isAnimating, currentTimepoint, totalTimepoints, animationSpeed])

  useEffect(() => {
    if (isAnimating) {
      animate()
    } else if (animationRef.current) {
      clearTimeout(animationRef.current)
    }

    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current)
      }
    }
  }, [isAnimating, animate])

  // Canvas rendering
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Apply zoom
    ctx.save()
    ctx.scale(zoom[0], zoom[0])

    // Draw based on view mode
    switch (viewMode) {
      case "network":
        drawAllostericNetwork(ctx)
        break
      case "pathways":
        drawAllostericPathways(ctx)
        break
      case "dynamics":
        drawDynamicFlux(ctx)
        break
      case "correlations":
        drawCorrelationMatrix(ctx)
        break
    }

    ctx.restore()
  }, [
    viewMode,
    currentTimepoint,
    selectedSite,
    selectedPath,
    colorScheme,
    showPaths,
    showFlux,
    zoom,
    pathStrengthThreshold,
    correlationThreshold,
  ])

  const drawAllostericNetwork = (ctx: CanvasRenderingContext2D) => {
    const canvas = canvasRef.current!
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2

    // Draw allosteric paths first (behind sites)
    if (showPaths) {
      data.paths
        .filter((path) => path.strength >= pathStrengthThreshold[0])
        .forEach((path) => {
          const sourceSite = data.sites.find((s) => s.id === path.source)
          const targetSite = data.sites.find((s) => s.id === path.target)

          if (!sourceSite || !targetSite) return

          const sourceX = centerX + sourceSite.x * 200
          const sourceY = centerY + sourceSite.y * 200
          const targetX = centerX + targetSite.x * 200
          const targetY = centerY + targetSite.y * 200

          // Path styling based on type and strength
          ctx.strokeStyle = getPathColor(path)
          ctx.lineWidth = Math.max(1, path.strength * 8)
          ctx.setLineDash(path.mechanism === "dynamic" ? [5, 5] : [])

          // Add flux animation if enabled
          if (showFlux) {
            const flux = currentDynamics.pathFlux.find((f) => f.pathId === path.id)
            if (flux) {
              const alpha = Math.abs(flux.flux) * 0.8 + 0.2
              ctx.strokeStyle =
                getPathColor(path) +
                Math.floor(alpha * 255)
                  .toString(16)
                  .padStart(2, "0")
              ctx.lineWidth = Math.max(2, Math.abs(flux.flux) * 10)
            }
          }

          ctx.beginPath()
          ctx.moveTo(sourceX, sourceY)

          // Draw curved path for better visualization
          const midX = (sourceX + targetX) / 2 + (Math.random() - 0.5) * 50
          const midY = (sourceY + targetY) / 2 + (Math.random() - 0.5) * 50
          ctx.quadraticCurveTo(midX, midY, targetX, targetY)
          ctx.stroke()

          // Draw arrowhead
          drawArrowhead(ctx, midX, midY, targetX, targetY, getPathColor(path))

          // Highlight selected path
          if (selectedPath === path.id) {
            ctx.strokeStyle = "#FFD700"
            ctx.lineWidth = 8
            ctx.setLineDash([])
            ctx.beginPath()
            ctx.moveTo(sourceX, sourceY)
            ctx.quadraticCurveTo(midX, midY, targetX, targetY)
            ctx.stroke()
          }

          ctx.setLineDash([])
        })
    }

    // Draw allosteric sites
    data.sites.forEach((site) => {
      const x = centerX + site.x * 200
      const y = centerY + site.y * 200
      const radius = getSiteRadius(site)

      // Site shadow
      ctx.fillStyle = "rgba(0,0,0,0.2)"
      ctx.beginPath()
      ctx.arc(x + 2, y + 2, radius, 0, Math.PI * 2)
      ctx.fill()

      // Site body
      ctx.fillStyle = getSiteColor(site)
      ctx.strokeStyle = selectedSite === site.id ? "#FFD700" : "#333"
      ctx.lineWidth = selectedSite === site.id ? 3 : 1
      ctx.beginPath()
      ctx.arc(x, y, radius, 0, Math.PI * 2)
      ctx.fill()
      ctx.stroke()

      // Site type indicator
      drawSiteIcon(ctx, site, x, y, radius)

      // Site label
      ctx.fillStyle = "#333"
      ctx.font = "12px Arial"
      ctx.textAlign = "center"
      ctx.fillText(site.name, x, y + radius + 15)

      // Cooperativity indicator
      if (site.cooperativity !== 1) {
        const coopRadius = radius * 0.3
        ctx.fillStyle = site.cooperativity > 1 ? "#2E8B57" : "#DC143C"
        ctx.beginPath()
        ctx.arc(x + radius * 0.7, y - radius * 0.7, coopRadius, 0, Math.PI * 2)
        ctx.fill()
      }
    })

    // Draw variant effects if any selected
    selectedVariants.forEach((variantIndex) => {
      const variant = data.variants[variantIndex]
      if (!variant) return

      // Find affected sites and paths
      const affectedPaths = data.paths.filter((path) => path.residues.includes(variant.position))

      affectedPaths.forEach((path) => {
        const sourceSite = data.sites.find((s) => s.id === path.source)
        const targetSite = data.sites.find((s) => s.id === path.target)

        if (!sourceSite || !targetSite) return

        const sourceX = centerX + sourceSite.x * 200
        const sourceY = centerY + sourceSite.y * 200
        const targetX = centerX + targetSite.x * 200
        const targetY = centerY + targetSite.y * 200

        // Variant effect visualization
        ctx.strokeStyle =
          variant.allostericEffect === "enhancing"
            ? "#2E8B57"
            : variant.allostericEffect === "disrupting"
              ? "#DC143C"
              : "#FF8C00"
        ctx.lineWidth = 4
        ctx.setLineDash([10, 5])
        ctx.beginPath()
        ctx.moveTo(sourceX, sourceY)
        ctx.lineTo(targetX, targetY)
        ctx.stroke()
        ctx.setLineDash([])
      })
    })
  }

  const drawAllostericPathways = (ctx: CanvasRenderingContext2D) => {
    const canvas = canvasRef.current!
    const width = canvas.width
    const height = canvas.height

    // Group paths by mechanism
    const pathsByMechanism = data.paths.reduce(
      (acc, path) => {
        if (!acc[path.mechanism]) acc[path.mechanism] = []
        acc[path.mechanism].push(path)
        return acc
      },
      {} as Record<string, AllostericPath[]>,
    )

    let yOffset = 50
    const mechanismColors = {
      conformational: "#1E90FF",
      dynamic: "#FF8C00",
      electrostatic: "#9370DB",
    }

    Object.entries(pathsByMechanism).forEach(([mechanism, paths]) => {
      // Mechanism header
      ctx.fillStyle = mechanismColors[mechanism as keyof typeof mechanismColors]
      ctx.font = "16px Arial"
      ctx.fillText(`${mechanism.charAt(0).toUpperCase() + mechanism.slice(1)} Pathways`, 20, yOffset)

      yOffset += 30

      // Draw pathway diagram
      paths.forEach((path, index) => {
        const pathY = yOffset + index * 40
        const startX = 50
        const endX = width - 50
        const pathWidth = path.strength * 20

        // Pathway line
        ctx.strokeStyle = mechanismColors[mechanism as keyof typeof mechanismColors]
        ctx.lineWidth = Math.max(2, pathWidth)
        ctx.beginPath()
        ctx.moveTo(startX, pathY)
        ctx.lineTo(endX, pathY)
        ctx.stroke()

        // Source and target sites
        const sourceSite = data.sites.find((s) => s.id === path.source)
        const targetSite = data.sites.find((s) => s.id === path.target)

        if (sourceSite && targetSite) {
          // Source site
          ctx.fillStyle = getSiteColor(sourceSite)
          ctx.beginPath()
          ctx.arc(startX, pathY, 8, 0, Math.PI * 2)
          ctx.fill()

          // Target site
          ctx.fillStyle = getSiteColor(targetSite)
          ctx.beginPath()
          ctx.arc(endX, pathY, 8, 0, Math.PI * 2)
          ctx.fill()

          // Labels
          ctx.fillStyle = "#333"
          ctx.font = "10px Arial"
          ctx.textAlign = "left"
          ctx.fillText(sourceSite.name, startX + 15, pathY + 3)
          ctx.textAlign = "right"
          ctx.fillText(targetSite.name, endX - 15, pathY + 3)
        }

        // Pathway strength indicator
        ctx.fillStyle = "#333"
        ctx.font = "10px Arial"
        ctx.textAlign = "center"
        ctx.fillText(`${(path.strength * 100).toFixed(0)}%`, (startX + endX) / 2, pathY - 10)
      })

      yOffset += paths.length * 40 + 20
    })
  }

  const drawDynamicFlux = (ctx: CanvasRenderingContext2D) => {
    const canvas = canvasRef.current!
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2

    // Draw sites
    data.sites.forEach((site) => {
      const x = centerX + site.x * 200
      const y = centerY + site.y * 200
      const radius = getSiteRadius(site)

      ctx.fillStyle = getSiteColor(site)
      ctx.beginPath()
      ctx.arc(x, y, radius, 0, Math.PI * 2)
      ctx.fill()
    })

    // Draw dynamic flux
    currentDynamics.pathFlux.forEach((flux) => {
      const path = data.paths.find((p) => p.id === flux.pathId)
      if (!path) return

      const sourceSite = data.sites.find((s) => s.id === path.source)
      const targetSite = data.sites.find((s) => s.id === path.target)

      if (!sourceSite || !targetSite) return

      const sourceX = centerX + sourceSite.x * 200
      const sourceY = centerY + sourceSite.y * 200
      const targetX = centerX + targetSite.x * 200
      const targetY = centerY + targetSite.y * 200

      // Flux visualization with animated particles
      const fluxIntensity = Math.abs(flux.flux)
      const particleCount = Math.floor(fluxIntensity * 10) + 1

      for (let i = 0; i < particleCount; i++) {
        const t = (i / particleCount + currentTimepoint * 0.01) % 1
        const x = sourceX + (targetX - sourceX) * t
        const y = sourceY + (targetY - sourceY) * t

        ctx.fillStyle = flux.flux > 0 ? "#2E8B57" : "#DC143C"
        ctx.beginPath()
        ctx.arc(x, y, 3, 0, Math.PI * 2)
        ctx.fill()
      }

      // Flux arrow
      ctx.strokeStyle = flux.flux > 0 ? "#2E8B57" : "#DC143C"
      ctx.lineWidth = Math.max(1, fluxIntensity * 5)
      ctx.beginPath()
      ctx.moveTo(sourceX, sourceY)
      ctx.lineTo(targetX, targetY)
      ctx.stroke()

      drawArrowhead(ctx, sourceX, sourceY, targetX, targetY, flux.flux > 0 ? "#2E8B57" : "#DC143C")
    })
  }

  const drawCorrelationMatrix = (ctx: CanvasRenderingContext2D) => {
    const canvas = canvasRef.current!
    const correlations = currentDynamics.correlations
    const size = correlations.length
    const cellSize = Math.min(canvas.width, canvas.height) / size

    // Draw correlation matrix
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        const correlation = correlations[i][j]
        if (Math.abs(correlation) < correlationThreshold[0]) continue

        const x = j * cellSize
        const y = i * cellSize

        // Color based on correlation strength and sign
        const intensity = Math.abs(correlation)
        const red = correlation > 0 ? 0 : Math.floor(255 * intensity)
        const blue = correlation > 0 ? Math.floor(255 * intensity) : 0

        ctx.fillStyle = `rgb(${red}, 0, ${blue})`
        ctx.fillRect(x, y, cellSize, cellSize)

        // Add correlation value for strong correlations
        if (Math.abs(correlation) > 0.7) {
          ctx.fillStyle = "white"
          ctx.font = `${Math.max(8, cellSize * 0.3)}px Arial`
          ctx.textAlign = "center"
          ctx.textBaseline = "middle"
          ctx.fillText(correlation.toFixed(2), x + cellSize / 2, y + cellSize / 2)
        }
      }
    }

    // Add axis labels
    ctx.fillStyle = "#333"
    ctx.font = "12px Arial"
    ctx.textAlign = "center"
    ctx.fillText("Residue Position", canvas.width / 2, canvas.height - 10)

    ctx.save()
    ctx.translate(15, canvas.height / 2)
    ctx.rotate(-Math.PI / 2)
    ctx.fillText("Residue Position", 0, 0)
    ctx.restore()
  }

  const getSiteColor = (site: AllostericSite) => {
    switch (colorScheme) {
      case "type":
        switch (site.type) {
          case "orthosteric":
            return "#DC143C"
          case "allosteric":
            return "#1E90FF"
          case "cryptic":
            return "#9370DB"
          default:
            return "#4A4A4A"
        }
      case "strength":
        const intensity = site.affinity / 10
        return `rgb(${255 * (1 - intensity)}, ${255 * intensity}, 0)`
      case "cooperativity":
        if (site.cooperativity > 1) return "#2E8B57"
        if (site.cooperativity < 1) return "#DC143C"
        return "#FF8C00"
      case "energy":
        const currentSiteState = currentState.allostericSites.find((s) => s.siteId === site.id)
        if (currentSiteState) {
          const energyIntensity = currentSiteState.affinity / 10
          return `rgb(${255 * energyIntensity}, 0, ${255 * (1 - energyIntensity)})`
        }
        return "#4A4A4A"
      default:
        return "#4A4A4A"
    }
  }

  const getPathColor = (path: AllostericPath) => {
    switch (path.type) {
      case "activation":
        return "#2E8B57"
      case "inhibition":
        return "#DC143C"
      case "modulation":
        return "#FF8C00"
      default:
        return "#4A4A4A"
    }
  }

  const getSiteRadius = (site: AllostericSite) => {
    return 15 + site.affinity * 2
  }

  const drawSiteIcon = (ctx: CanvasRenderingContext2D, site: AllostericSite, x: number, y: number, radius: number) => {
    ctx.fillStyle = "white"
    ctx.font = `${radius * 0.8}px Arial`
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"

    switch (site.type) {
      case "orthosteric":
        ctx.fillText("🎯", x, y)
        break
      case "allosteric":
        ctx.fillText("🔗", x, y)
        break
      case "cryptic":
        ctx.fillText("🔍", x, y)
        break
    }
  }

  const drawArrowhead = (
    ctx: CanvasRenderingContext2D,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    color: string,
  ) => {
    const angle = Math.atan2(y2 - y1, x2 - x1)
    const arrowLength = 10
    const arrowAngle = Math.PI / 6

    ctx.fillStyle = color
    ctx.beginPath()
    ctx.moveTo(x2, y2)
    ctx.lineTo(x2 - arrowLength * Math.cos(angle - arrowAngle), y2 - arrowLength * Math.sin(angle - arrowAngle))
    ctx.lineTo(x2 - arrowLength * Math.cos(angle + arrowAngle), y2 - arrowLength * Math.sin(angle + arrowAngle))
    ctx.closePath()
    ctx.fill()
  }

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = (event.clientX - rect.left) / zoom[0]
    const y = (event.clientY - rect.top) / zoom[0]

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2

    // Check for site clicks
    let clickedSite = null
    for (const site of data.sites) {
      const siteX = centerX + site.x * 200
      const siteY = centerY + site.y * 200
      const distance = Math.sqrt((x - siteX) ** 2 + (y - siteY) ** 2)

      if (distance <= getSiteRadius(site)) {
        clickedSite = site.id
        break
      }
    }

    setSelectedSite(clickedSite)
    if (!clickedSite) setSelectedPath(null)
  }

  const handlePlay = () => {
    setIsAnimating(!isAnimating)
  }

  const handleReset = () => {
    setIsAnimating(false)
    setCurrentTimepoint(0)
  }

  const handleTimeChange = (value: number[]) => {
    setCurrentTimepoint(value[0])
    setIsAnimating(false)
  }

  const exportData = () => {
    const exportData = {
      allostericNetwork: data,
      analysis: {
        selectedSite,
        selectedPath,
        selectedState,
        viewMode,
        currentTimepoint,
        timestamp: new Date().toISOString(),
      },
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `allosteric_network_${data.protein.name}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const selectedSiteData = selectedSite ? data.sites.find((s) => s.id === selectedSite) : null
  const selectedPathData = selectedPath ? data.paths.find((p) => p.id === selectedPath) : null

  return (
    <TooltipProvider>
      <div className={`space-y-6 ${isFullscreen ? "fixed inset-0 z-50 bg-white p-6 overflow-auto" : ""}`}>
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-[#4A4A4A] flex items-center gap-2">
              <Network className="h-6 w-6 text-[#1E90FF]" />
              Allosteric Network Analysis: {data.protein.name}
            </h2>
            <p className="text-[#4A4A4A]/70">Long-range conformational changes and allosteric communication pathways</p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePlay}
              className={isAnimating ? "bg-[#DC143C] text-white" : ""}
            >
              {isAnimating ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button variant="outline" size="sm" onClick={handleReset}>
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={exportData}>
              <Download className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => setIsFullscreen(!isFullscreen)}>
              <Maximize className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Controls */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-[#2E8B57]" />
              Analysis Controls
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-6 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">View Mode</label>
                <Select value={viewMode} onValueChange={(value: any) => setViewMode(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="network">Network View</SelectItem>
                    <SelectItem value="pathways">Pathway Analysis</SelectItem>
                    <SelectItem value="dynamics">Dynamic Flux</SelectItem>
                    <SelectItem value="correlations">Correlation Matrix</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Color Scheme</label>
                <Select value={colorScheme} onValueChange={(value: any) => setColorScheme(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="type">By Site Type</SelectItem>
                    <SelectItem value="strength">By Strength</SelectItem>
                    <SelectItem value="cooperativity">By Cooperativity</SelectItem>
                    <SelectItem value="energy">By Energy</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Conformational State</label>
                <Select value={selectedState} onValueChange={setSelectedState}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {data.states.map((state) => (
                      <SelectItem key={state.id} value={state.id}>
                        {state.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Path Strength</label>
                <Slider
                  value={pathStrengthThreshold}
                  onValueChange={setPathStrengthThreshold}
                  min={0}
                  max={1}
                  step={0.1}
                  className="w-full"
                />
                <div className="text-xs text-center">{(pathStrengthThreshold[0] * 100).toFixed(0)}%</div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Animation Speed</label>
                <Slider
                  value={animationSpeed}
                  onValueChange={setAnimationSpeed}
                  min={0.1}
                  max={5}
                  step={0.1}
                  className="w-full"
                />
                <div className="text-xs text-center">{animationSpeed[0].toFixed(1)}x</div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Display Options</label>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <Switch checked={showPaths} onCheckedChange={setShowPaths} />
                    <span className="text-sm">Paths</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch checked={showFlux} onCheckedChange={setShowFlux} />
                    <span className="text-sm">Flux</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Time Control */}
        {viewMode === "dynamics" && (
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Simulation Time</span>
                  <span>
                    {currentTimepoint} / {totalTimepoints - 1} frames
                  </span>
                </div>
                <Slider
                  value={[currentTimepoint]}
                  onValueChange={handleTimeChange}
                  min={0}
                  max={totalTimepoints - 1}
                  step={1}
                  className="w-full"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Visualization */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitBranch className="h-5 w-5 text-[#DC143C]" />
              Allosteric Network Visualization
            </CardTitle>
            <CardDescription>Interactive visualization of allosteric sites and communication pathways</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <canvas
                ref={canvasRef}
                width={1000}
                height={600}
                className="border rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 cursor-pointer"
                onClick={handleCanvasClick}
              />

              {/* Zoom Control */}
              <div className="absolute top-4 right-4">
                <div className="bg-white/90 p-2 rounded border">
                  <label className="text-xs font-medium">Zoom</label>
                  <Slider
                    value={zoom}
                    onValueChange={setZoom}
                    min={0.5}
                    max={3}
                    step={0.1}
                    className="w-20"
                    orientation="vertical"
                  />
                </div>
              </div>

              {/* Legend */}
              <div className="absolute bottom-4 left-4 bg-white/90 p-3 rounded-lg border">
                <h5 className="text-sm font-medium mb-2">Legend</h5>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-[#DC143C] rounded-full" />
                    <span>Orthosteric Site</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-[#1E90FF] rounded-full" />
                    <span>Allosteric Site</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-[#9370DB] rounded-full" />
                    <span>Cryptic Site</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-1 bg-[#2E8B57]" />
                    <span>Activation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-1 bg-[#DC143C]" />
                    <span>Inhibition</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-1 bg-[#FF8C00]" />
                    <span>Modulation</span>
                  </div>
                </div>
              </div>

              {/* Network Stats */}
              <div className="absolute top-4 left-4 bg-white/90 p-3 rounded-lg border">
                <div className="text-sm space-y-1">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-[#DC143C]" />
                    <span>{data.sites.length} sites</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <GitBranch className="h-4 w-4 text-[#2E8B57]" />
                    <span>{data.paths.length} pathways</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-[#1E90FF]" />
                    <span>{data.states.length} states</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Selection Details */}
        {(selectedSiteData || selectedPathData) && (
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Radio className="h-5 w-5 text-[#4A4A4A]" />
                Selection Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedSiteData && (
                <Tabs defaultValue="overview" className="space-y-4">
                  <TabsList>
                    <TabsTrigger value="overview">Site Overview</TabsTrigger>
                    <TabsTrigger value="pathways">Connected Pathways</TabsTrigger>
                    <TabsTrigger value="dynamics">Dynamic Properties</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-4">
                    <div className="p-4 rounded-lg bg-[#F5F7FA] border">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="text-lg font-semibold text-[#4A4A4A]">{selectedSiteData.name}</h4>
                          <p className="text-sm text-[#4A4A4A]/70">{selectedSiteData.function}</p>
                        </div>
                        <Badge
                          className={
                            selectedSiteData.type === "orthosteric"
                              ? "bg-[#DC143C] text-white"
                              : selectedSiteData.type === "allosteric"
                                ? "bg-[#1E90FF] text-white"
                                : "bg-[#9370DB] text-white"
                          }
                        >
                          {selectedSiteData.type}
                        </Badge>
                      </div>

                      <div className="grid md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-[#4A4A4A]/70">Binding Affinity:</span>
                          <p className="font-medium">{selectedSiteData.affinity.toFixed(1)} kcal/mol</p>
                        </div>
                        <div>
                          <span className="text-[#4A4A4A]/70">Cooperativity:</span>
                          <p
                            className={`font-medium ${
                              selectedSiteData.cooperativity > 1
                                ? "text-[#2E8B57]"
                                : selectedSiteData.cooperativity < 1
                                  ? "text-[#DC143C]"
                                  : "text-[#FF8C00]"
                            }`}
                          >
                            {selectedSiteData.cooperativity.toFixed(2)}
                          </p>
                        </div>
                        <div>
                          <span className="text-[#4A4A4A]/70">Residue Count:</span>
                          <p className="font-medium">{selectedSiteData.residues.length}</p>
                        </div>
                      </div>

                      {selectedSiteData.ligand && (
                        <div className="mt-3 pt-3 border-t">
                          <span className="text-[#4A4A4A]/70 text-sm">Natural Ligand:</span>
                          <p className="font-medium">{selectedSiteData.ligand}</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="pathways" className="space-y-4">
                    <div className="space-y-3">
                      {data.paths
                        .filter((path) => path.source === selectedSiteData.id || path.target === selectedSiteData.id)
                        .map((path) => {
                          const partnerId = path.source === selectedSiteData.id ? path.target : path.source
                          const partner = data.sites.find((s) => s.id === partnerId)

                          return (
                            <div key={path.id} className="p-3 rounded border bg-white">
                              <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">{partner?.name}</span>
                                  <Badge
                                    variant="outline"
                                    className={
                                      path.type === "activation"
                                        ? "bg-[#2E8B57]/10 text-[#2E8B57]"
                                        : path.type === "inhibition"
                                          ? "bg-[#DC143C]/10 text-[#DC143C]"
                                          : "bg-[#FF8C00]/10 text-[#FF8C00]"
                                    }
                                  >
                                    {path.type}
                                  </Badge>
                                </div>
                                <Badge variant="outline">{path.mechanism}</Badge>
                              </div>

                              <div className="grid grid-cols-3 gap-4 text-sm">
                                <div>
                                  <span className="text-[#4A4A4A]/70">Strength:</span>
                                  <p className="font-medium">{(path.strength * 100).toFixed(0)}%</p>
                                </div>
                                <div>
                                  <span className="text-[#4A4A4A]/70">Distance:</span>
                                  <p className="font-medium">{path.distance.toFixed(1)} Å</p>
                                </div>
                                <div>
                                  <span className="text-[#4A4A4A]/70">Cooperativity:</span>
                                  <p className="font-medium">{path.cooperativity.toFixed(2)}</p>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                    </div>
                  </TabsContent>

                  <TabsContent value="dynamics" className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Fluctuation Analysis */}
                      <Card className="border-0 shadow-sm">
                        <CardHeader>
                          <CardTitle className="text-lg">Site Fluctuations</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="h-32 flex items-end justify-center space-x-1">
                            {selectedSiteData.residues.slice(0, 20).map((residue, index) => {
                              const fluctuation = currentDynamics.fluctuations[residue] || 0
                              return (
                                <div
                                  key={index}
                                  className="bg-gradient-to-t from-[#1E90FF] to-[#87CEEB] rounded-t"
                                  style={{
                                    height: `${Math.min(fluctuation * 100, 120)}px`,
                                    width: "8px",
                                  }}
                                />
                              )
                            })}
                          </div>
                          <div className="mt-2 text-xs text-center text-gray-500">Residue Fluctuations (Å)</div>
                        </CardContent>
                      </Card>

                      {/* State Accessibility */}
                      <Card className="border-0 shadow-sm">
                        <CardHeader>
                          <CardTitle className="text-lg">State Accessibility</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {data.states.map((state) => {
                              const siteState = state.allostericSites.find((s) => s.siteId === selectedSiteData.id)
                              return (
                                <div key={state.id} className="flex justify-between items-center">
                                  <span className="text-sm font-medium">{state.name}</span>
                                  <div className="flex items-center gap-2">
                                    <div className="w-20 h-2 bg-gray-200 rounded">
                                      <div
                                        className="h-full bg-[#1E90FF] rounded"
                                        style={{ width: `${(siteState?.accessibility || 0) * 100}%` }}
                                      />
                                    </div>
                                    <span className="text-xs text-[#4A4A4A]/70">
                                      {((siteState?.accessibility || 0) * 100).toFixed(0)}%
                                    </span>
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                </Tabs>
              )}
            </CardContent>
          </Card>
        )}

        {/* Network Statistics */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#4A4A4A]/70">Allosteric Sites</p>
                  <p className="text-2xl font-bold text-[#1E90FF]">
                    {data.sites.filter((s) => s.type === "allosteric").length}
                  </p>
                </div>
                <Target className="h-8 w-8 text-[#1E90FF]" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#4A4A4A]/70">Active Pathways</p>
                  <p className="text-2xl font-bold text-[#2E8B57]">
                    {data.paths.filter((p) => p.strength >= pathStrengthThreshold[0]).length}
                  </p>
                </div>
                <GitBranch className="h-8 w-8 text-[#2E8B57]" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#4A4A4A]/70">Avg Cooperativity</p>
                  <p className="text-2xl font-bold text-[#FF8C00]">
                    {(data.sites.reduce((sum, s) => sum + s.cooperativity, 0) / data.sites.length).toFixed(2)}
                  </p>
                </div>
                <Waves className="h-8 w-8 text-[#FF8C00]" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#4A4A4A]/70">Network Density</p>
                  <p className="text-2xl font-bold text-[#9370DB]">
                    {((data.paths.length / (data.sites.length * (data.sites.length - 1))) * 100).toFixed(0)}%
                  </p>
                </div>
                <Network className="h-8 w-8 text-[#9370DB]" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </TooltipProvider>
  )
}
