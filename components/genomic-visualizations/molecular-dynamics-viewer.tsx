"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Play, Pause, RotateCcw, Download, Activity, Zap, TrendingUp, Clock, Thermometer } from "lucide-react"

interface MolecularDynamicsData {
  protein: {
    name: string
    sequence: string
    length: number
    temperature: number
    simulationTime: number
  }
  variants: Array<{
    position: number
    wildType: string
    mutant: string
    impact: "High" | "Moderate" | "Low"
    stabilityEffect: number
    flexibilityChange: number
    bindingEffect: number
  }>
  trajectory: Array<{
    timepoint: number
    coordinates: Array<{ x: number; y: number; z: number }>
    energy: number
    rmsd: number
    rmsf: number[]
    secondaryStructure: Array<{
      type: "helix" | "sheet" | "loop"
      start: number
      end: number
      stability: number
    }>
  }>
  energyProfile: Array<{
    time: number
    totalEnergy: number
    kineticEnergy: number
    potentialEnergy: number
    temperature: number
  }>
}

interface MolecularDynamicsViewerProps {
  data: MolecularDynamicsData
  wildTypeData?: MolecularDynamicsData
  showComparison?: boolean
}

export function MolecularDynamicsViewer({ data, wildTypeData, showComparison = false }: MolecularDynamicsViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()

  const [isPlaying, setIsPlaying] = useState(false)
  const [currentFrame, setCurrentFrame] = useState(0)
  const [playbackSpeed, setPlaybackSpeed] = useState([1])
  const [selectedVariant, setSelectedVariant] = useState<number | null>(null)
  const [viewMode, setViewMode] = useState<"structure" | "flexibility" | "energy" | "comparison">("structure")
  const [colorScheme, setColorScheme] = useState<"flexibility" | "energy" | "secondary" | "variants">("flexibility")
  const [showTrajectory, setShowTrajectory] = useState(false)
  const [simulationSettings, setSimulationSettings] = useState({
    temperature: data.protein.temperature,
    timeStep: 0.1,
    dampening: 0.1,
  })

  const totalFrames = data.trajectory.length
  const currentTrajectory = data.trajectory[currentFrame]
  const maxTime = data.protein.simulationTime

  // Animation loop
  const animate = useCallback(() => {
    if (isPlaying && currentFrame < totalFrames - 1) {
      setCurrentFrame((prev) => prev + 1)
    } else if (isPlaying && currentFrame >= totalFrames - 1) {
      setCurrentFrame(0) // Loop animation
    }

    if (isPlaying) {
      const frameDelay = Math.max(50, 200 / playbackSpeed[0])
      animationRef.current = setTimeout(() => {
        requestAnimationFrame(animate)
      }, frameDelay)
    }
  }, [isPlaying, currentFrame, totalFrames, playbackSpeed])

  useEffect(() => {
    if (isPlaying) {
      animate()
    } else if (animationRef.current) {
      clearTimeout(animationRef.current)
    }

    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current)
      }
    }
  }, [isPlaying, animate])

  // Render protein structure
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !currentTrajectory) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const scale = 2

    // Draw protein backbone with dynamic coordinates
    drawDynamicProtein(ctx, centerX, centerY, scale)

    // Draw variants with dynamic effects
    if (selectedVariant !== null) {
      drawVariantEffects(ctx, centerX, centerY, scale)
    }

    // Draw trajectory path if enabled
    if (showTrajectory) {
      drawTrajectoryPath(ctx, centerX, centerY, scale)
    }

    // Draw energy visualization overlay
    if (viewMode === "energy") {
      drawEnergyOverlay(ctx, centerX, centerY, scale)
    }

    // Draw flexibility visualization
    if (viewMode === "flexibility") {
      drawFlexibilityOverlay(ctx, centerX, centerY, scale)
    }
  }, [currentFrame, selectedVariant, viewMode, colorScheme, showTrajectory])

  const drawDynamicProtein = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, scale: number) => {
    const coords = currentTrajectory.coordinates

    // Draw backbone
    ctx.strokeStyle = getBackboneColor()
    ctx.lineWidth = 3 * scale
    ctx.beginPath()

    coords.forEach((coord, index) => {
      const x = centerX + coord.x * scale * 50
      const y = centerY + coord.y * scale * 50

      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })
    ctx.stroke()

    // Draw secondary structure elements with dynamic stability
    currentTrajectory.secondaryStructure.forEach((element, index) => {
      const startCoord = coords[element.start]
      const endCoord = coords[element.end]

      if (startCoord && endCoord) {
        const startX = centerX + startCoord.x * scale * 50
        const startY = centerY + startCoord.y * scale * 50
        const endX = centerX + endCoord.x * scale * 50
        const endY = centerY + endCoord.y * scale * 50

        ctx.strokeStyle = getSecondaryStructureColor(element.type, element.stability)
        ctx.lineWidth = 6 * scale * element.stability
        ctx.beginPath()
        ctx.moveTo(startX, startY)
        ctx.lineTo(endX, endY)
        ctx.stroke()
      }
    })

    // Draw residues with flexibility coloring
    coords.forEach((coord, index) => {
      const x = centerX + coord.x * scale * 50
      const y = centerY + coord.y * scale * 50
      const flexibility = currentTrajectory.rmsf[index] || 0

      ctx.fillStyle = getFlexibilityColor(flexibility)
      ctx.beginPath()
      ctx.arc(x, y, 2 * scale * (1 + flexibility), 0, Math.PI * 2)
      ctx.fill()
    })
  }

  const drawVariantEffects = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, scale: number) => {
    const variant = data.variants[selectedVariant!]
    const coord = currentTrajectory.coordinates[variant.position]

    if (coord) {
      const x = centerX + coord.x * scale * 50
      const y = centerY + coord.y * scale * 50

      // Draw variant position with pulsing effect
      const pulseIntensity = Math.sin(currentFrame * 0.3) * 0.5 + 0.5
      const radius = 8 * scale * (1 + pulseIntensity * 0.5)

      ctx.fillStyle = getVariantColor(variant.impact)
      ctx.strokeStyle = "#000"
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(x, y, radius, 0, Math.PI * 2)
      ctx.fill()
      ctx.stroke()

      // Draw stability effect visualization
      if (variant.stabilityEffect !== 0) {
        const effectRadius = 20 * scale * Math.abs(variant.stabilityEffect)
        ctx.strokeStyle = variant.stabilityEffect > 0 ? "#2E8B57" : "#DC143C"
        ctx.lineWidth = 2
        ctx.setLineDash([5, 5])
        ctx.beginPath()
        ctx.arc(x, y, effectRadius, 0, Math.PI * 2)
        ctx.stroke()
        ctx.setLineDash([])
      }
    }
  }

  const drawTrajectoryPath = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, scale: number) => {
    if (selectedVariant === null) return

    const variant = data.variants[selectedVariant]
    const position = variant.position

    ctx.strokeStyle = "#FFB347"
    ctx.lineWidth = 1
    ctx.setLineDash([2, 2])
    ctx.beginPath()

    data.trajectory.forEach((frame, frameIndex) => {
      const coord = frame.coordinates[position]
      if (coord) {
        const x = centerX + coord.x * scale * 50
        const y = centerY + coord.y * scale * 50

        if (frameIndex === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      }
    })
    ctx.stroke()
    ctx.setLineDash([])
  }

  const drawEnergyOverlay = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, scale: number) => {
    const energy = currentTrajectory.energy
    const normalizedEnergy = Math.min(energy / 1000, 1) // Normalize to 0-1

    // Create energy heatmap overlay
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 200 * scale)
    gradient.addColorStop(0, `rgba(255, 0, 0, ${normalizedEnergy * 0.3})`)
    gradient.addColorStop(1, `rgba(255, 255, 0, ${normalizedEnergy * 0.1})`)

    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvasRef.current!.width, canvasRef.current!.height) // Declare canvas before using it
  }

  const drawFlexibilityOverlay = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, scale: number) => {
    currentTrajectory.coordinates.forEach((coord, index) => {
      const flexibility = currentTrajectory.rmsf[index] || 0
      const x = centerX + coord.x * scale * 50
      const y = centerY + coord.y * scale * 50

      if (flexibility > 0.5) {
        // Only show high flexibility regions
        ctx.fillStyle = `rgba(255, 165, 0, ${flexibility * 0.6})`
        ctx.beginPath()
        ctx.arc(x, y, 15 * scale * flexibility, 0, Math.PI * 2)
        ctx.fill()
      }
    })
  }

  const getBackboneColor = () => {
    switch (colorScheme) {
      case "energy":
        const energyIntensity = Math.min(currentTrajectory.energy / 1000, 1)
        return `rgb(${255 * energyIntensity}, ${100 * (1 - energyIntensity)}, 100)`
      case "flexibility":
        return "#4A90E2"
      case "secondary":
        return "#6B7280"
      default:
        return "#4A90E2"
    }
  }

  const getSecondaryStructureColor = (type: string, stability: number) => {
    const alpha = Math.max(0.3, stability)
    switch (type) {
      case "helix":
        return `rgba(255, 107, 107, ${alpha})`
      case "sheet":
        return `rgba(50, 205, 50, ${alpha})`
      case "loop":
        return `rgba(255, 179, 71, ${alpha})`
      default:
        return `rgba(74, 144, 226, ${alpha})`
    }
  }

  const getFlexibilityColor = (flexibility: number) => {
    const intensity = Math.min(flexibility, 1)
    return `rgb(${255 * intensity}, ${255 * (1 - intensity)}, 100)`
  }

  const getVariantColor = (impact: string) => {
    switch (impact) {
      case "High":
        return "#DC143C"
      case "Moderate":
        return "#FF8C00"
      case "Low":
        return "#2E8B57"
      default:
        return "#808080"
    }
  }

  const handlePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const handleReset = () => {
    setIsPlaying(false)
    setCurrentFrame(0)
  }

  const handleFrameChange = (value: number[]) => {
    setCurrentFrame(value[0])
    setIsPlaying(false)
  }

  const getCurrentTime = () => {
    return (currentFrame / totalFrames) * maxTime
  }

  const getEnergyStats = () => {
    const energyData = data.energyProfile[currentFrame]
    return energyData || data.energyProfile[0]
  }

  return (
    <TooltipProvider>
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-[#1E90FF]" />
                Molecular Dynamics Simulation: {data.protein.name}
              </CardTitle>
              <CardDescription>
                Time-based protein movement simulation showing dynamic effects of variants
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePlay}
                className={isPlaying ? "bg-[#DC143C] text-white" : ""}
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              <Button variant="outline" size="sm" onClick={handleReset}>
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs value={viewMode} onValueChange={(value: any) => setViewMode(value)} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="structure">Structure</TabsTrigger>
              <TabsTrigger value="flexibility">Flexibility</TabsTrigger>
              <TabsTrigger value="energy">Energy</TabsTrigger>
              <TabsTrigger value="comparison">Comparison</TabsTrigger>
            </TabsList>

            <TabsContent value="structure" className="space-y-6">
              {/* Simulation Controls */}
              <div className="grid md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Color Scheme</label>
                  <Select value={colorScheme} onValueChange={(value: any) => setColorScheme(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="flexibility">Flexibility</SelectItem>
                      <SelectItem value="energy">Energy</SelectItem>
                      <SelectItem value="secondary">Secondary Structure</SelectItem>
                      <SelectItem value="variants">Variants</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Playback Speed</label>
                  <Slider
                    value={playbackSpeed}
                    onValueChange={setPlaybackSpeed}
                    min={0.1}
                    max={5}
                    step={0.1}
                    className="w-full"
                  />
                  <div className="text-xs text-center">{playbackSpeed[0].toFixed(1)}x</div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Variant Selection</label>
                  <Select
                    value={selectedVariant?.toString() || ""}
                    onValueChange={(value) => setSelectedVariant(value ? Number.parseInt(value) : null)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select variant" />
                    </SelectTrigger>
                    <SelectContent>
                      {data.variants.map((variant, index) => (
                        <SelectItem key={index} value={index.toString()}>
                          {variant.wildType}
                          {variant.position}
                          {variant.mutant}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Display Options</label>
                  <div className="flex gap-2">
                    <Button
                      variant={showTrajectory ? "default" : "outline"}
                      size="sm"
                      onClick={() => setShowTrajectory(!showTrajectory)}
                    >
                      Trajectory
                    </Button>
                  </div>
                </div>
              </div>

              {/* Time Control */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Simulation Time</span>
                  <span>
                    {getCurrentTime().toFixed(2)} ns / {maxTime} ns
                  </span>
                </div>
                <Slider
                  value={[currentFrame]}
                  onValueChange={handleFrameChange}
                  min={0}
                  max={totalFrames - 1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Frame {currentFrame + 1}</span>
                  <span>of {totalFrames}</span>
                </div>
              </div>

              {/* 3D Simulation Viewer */}
              <div className="relative">
                <canvas
                  ref={canvasRef}
                  width={800}
                  height={500}
                  className="border rounded-lg bg-gradient-to-br from-gray-50 to-gray-100"
                />

                {/* Simulation Info Overlay */}
                <div className="absolute top-4 left-4 bg-white/90 p-3 rounded-lg border space-y-2">
                  <div className="text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-[#1E90FF]" />
                      <span className="font-medium">{getCurrentTime().toFixed(2)} ns</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Thermometer className="h-4 w-4 text-[#FF8C00]" />
                      <span>{getEnergyStats().temperature.toFixed(1)} K</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-[#DC143C]" />
                      <span>{currentTrajectory.energy.toFixed(0)} kJ/mol</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-[#2E8B57]" />
                      <span>RMSD: {currentTrajectory.rmsd.toFixed(2)} Å</span>
                    </div>
                  </div>
                </div>

                {/* Legend */}
                <div className="absolute bottom-4 left-4 bg-white/90 p-3 rounded-lg border">
                  <h5 className="text-sm font-medium mb-2">Legend</h5>
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-[#FF6B6B] rounded" />
                      <span>α-Helix</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-[#32CD32] rounded" />
                      <span>β-Sheet</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-[#FFB347] rounded" />
                      <span>Loop</span>
                    </div>
                    {selectedVariant !== null && (
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-[#DC143C] rounded-full" />
                        <span>Selected Variant</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Selected Variant Analysis */}
              {selectedVariant !== null && (
                <div className="p-4 rounded-lg bg-[#F5F7FA] border">
                  <h4 className="font-medium text-[#4A4A4A] mb-3">
                    Dynamic Analysis: {data.variants[selectedVariant].wildType}
                    {data.variants[selectedVariant].position}
                    {data.variants[selectedVariant].mutant}
                  </h4>
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-[#4A4A4A]/70">Stability Effect:</span>
                      <p
                        className={`font-medium ${
                          data.variants[selectedVariant].stabilityEffect < 0 ? "text-[#DC143C]" : "text-[#2E8B57]"
                        }`}
                      >
                        {data.variants[selectedVariant].stabilityEffect > 0 ? "+" : ""}
                        {data.variants[selectedVariant].stabilityEffect.toFixed(2)} kJ/mol
                      </p>
                    </div>
                    <div>
                      <span className="text-[#4A4A4A]/70">Flexibility Change:</span>
                      <p
                        className={`font-medium ${
                          data.variants[selectedVariant].flexibilityChange > 0 ? "text-[#FF8C00]" : "text-[#2E8B57]"
                        }`}
                      >
                        {data.variants[selectedVariant].flexibilityChange > 0 ? "+" : ""}
                        {(data.variants[selectedVariant].flexibilityChange * 100).toFixed(1)}%
                      </p>
                    </div>
                    <div>
                      <span className="text-[#4A4A4A]/70">Binding Effect:</span>
                      <p
                        className={`font-medium ${
                          Math.abs(data.variants[selectedVariant].bindingEffect) > 1
                            ? "text-[#DC143C]"
                            : "text-[#2E8B57]"
                        }`}
                      >
                        {data.variants[selectedVariant].bindingEffect > 0 ? "+" : ""}
                        {data.variants[selectedVariant].bindingEffect.toFixed(1)}x fold
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="flexibility" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Flexibility Chart */}
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">Residue Flexibility (RMSF)</CardTitle>
                    <CardDescription>Root Mean Square Fluctuation over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-end justify-center space-x-1">
                      {currentTrajectory.rmsf.slice(0, 50).map((rmsf, index) => (
                        <div
                          key={index}
                          className="bg-gradient-to-t from-[#FF8C00] to-[#FFB347] rounded-t"
                          style={{
                            height: `${Math.min(rmsf * 200, 240)}px`,
                            width: "8px",
                            opacity:
                              selectedVariant !== null && Math.abs(index - data.variants[selectedVariant].position) < 5
                                ? 1
                                : 0.7,
                          }}
                        />
                      ))}
                    </div>
                    <div className="mt-2 text-xs text-center text-gray-500">Residue Position (1-50 shown)</div>
                  </CardContent>
                </Card>

                {/* Flexibility Statistics */}
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">Flexibility Statistics</CardTitle>
                    <CardDescription>Current frame analysis</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 rounded bg-[#F5F7FA]">
                        <div className="text-2xl font-bold text-[#FF8C00]">
                          {(currentTrajectory.rmsf.reduce((a, b) => a + b, 0) / currentTrajectory.rmsf.length).toFixed(
                            2,
                          )}
                        </div>
                        <div className="text-sm text-gray-600">Avg RMSF (Å)</div>
                      </div>
                      <div className="text-center p-3 rounded bg-[#F5F7FA]">
                        <div className="text-2xl font-bold text-[#DC143C]">
                          {Math.max(...currentTrajectory.rmsf).toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-600">Max RMSF (Å)</div>
                      </div>
                    </div>

                    {/* Most flexible regions */}
                    <div>
                      <h5 className="font-medium mb-2">Most Flexible Regions</h5>
                      <div className="space-y-2">
                        {currentTrajectory.rmsf
                          .map((rmsf, index) => ({ rmsf, index }))
                          .sort((a, b) => b.rmsf - a.rmsf)
                          .slice(0, 5)
                          .map((item, rank) => (
                            <div key={item.index} className="flex justify-between text-sm">
                              <span>Residue {item.index + 1}</span>
                              <Badge variant="outline" className="bg-[#FF8C00]/10">
                                {item.rmsf.toFixed(2)} Å
                              </Badge>
                            </div>
                          ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="energy" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Energy Timeline */}
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">Energy Profile</CardTitle>
                    <CardDescription>Energy changes over simulation time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 relative">
                      <svg width="100%" height="100%" className="border rounded">
                        {/* Energy plot */}
                        <polyline
                          points={data.energyProfile
                            .map(
                              (point, index) =>
                                `${(index / data.energyProfile.length) * 400},${250 - (point.totalEnergy / 2000) * 200}`,
                            )
                            .join(" ")}
                          fill="none"
                          stroke="#1E90FF"
                          strokeWidth="2"
                        />
                        {/* Current time indicator */}
                        <line
                          x1={`${(currentFrame / totalFrames) * 400}`}
                          y1="0"
                          x2={`${(currentFrame / totalFrames) * 400}`}
                          y2="250"
                          stroke="#DC143C"
                          strokeWidth="2"
                          strokeDasharray="5,5"
                        />
                      </svg>
                    </div>
                  </CardContent>
                </Card>

                {/* Current Energy Stats */}
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">Current Energy State</CardTitle>
                    <CardDescription>Frame {currentFrame + 1} analysis</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 rounded bg-[#F5F7FA]">
                        <div className="text-2xl font-bold text-[#1E90FF]">
                          {getEnergyStats().totalEnergy.toFixed(0)}
                        </div>
                        <div className="text-sm text-gray-600">Total Energy (kJ/mol)</div>
                      </div>
                      <div className="text-center p-3 rounded bg-[#F5F7FA]">
                        <div className="text-2xl font-bold text-[#2E8B57]">
                          {getEnergyStats().kineticEnergy.toFixed(0)}
                        </div>
                        <div className="text-sm text-gray-600">Kinetic Energy (kJ/mol)</div>
                      </div>
                      <div className="text-center p-3 rounded bg-[#F5F7FA]">
                        <div className="text-2xl font-bold text-[#FF8C00]">
                          {getEnergyStats().potentialEnergy.toFixed(0)}
                        </div>
                        <div className="text-sm text-gray-600">Potential Energy (kJ/mol)</div>
                      </div>
                      <div className="text-center p-3 rounded bg-[#F5F7FA]">
                        <div className="text-2xl font-bold text-[#9370DB]">
                          {getEnergyStats().temperature.toFixed(1)}
                        </div>
                        <div className="text-sm text-gray-600">Temperature (K)</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="comparison" className="space-y-6">
              {showComparison && wildTypeData ? (
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="border-0 shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-lg">Wild Type</CardTitle>
                      <CardDescription>Normal protein dynamics</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
                        <span className="text-gray-500">Wild Type Simulation</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-lg">Variant</CardTitle>
                      <CardDescription>Mutant protein dynamics</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
                        <span className="text-gray-500">Variant Simulation</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">Comparison mode requires wild-type reference data</p>
                  <Button className="mt-4 bg-transparent" variant="outline">
                    Load Wild Type Data
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </TooltipProvider>
  )
}
