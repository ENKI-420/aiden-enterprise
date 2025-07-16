"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { TooltipProvider } from "@/components/ui/tooltip"
import {
  Play,
  Pause,
  RotateCcw,
  FastForward,
  Rewind,
  Download,
  Settings,
  Atom,
  Waves,
  Network,
  FlaskConical,
  BarChart3,
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface MembraneProteinState {
  id: string
  name: string
  time: number // ps
  conformation: string // e.g., "open", "closed", "intermediate"
  lipidInteractions: number // number of contacts with lipids
  transmembraneDepth: number // Angstroms
  tiltAngle: number // degrees
  allostericState: "active" | "inactive" | "modulated"
  coordinates: Array<{ x: number; y: number; z: number }>
  description: string
}

interface MembraneProteinDynamicsProps {
  proteinName: string
  sequence: string
  membraneType: "POPC" | "DPPC" | "cholesterol-rich" | "mixed"
  initialState: MembraneProteinState
}

// Dummy data for membrane protein states
const generateProteinStates = (sequence: string, numSteps = 500): MembraneProteinState[] => {
  const states: MembraneProteinState[] = []
  const sequenceLength = sequence.length

  for (let i = 0; i < numSteps; i++) {
    const time = i * 10 // 10 ps per step
    const conformation = i < numSteps / 3 ? "closed" : i < (2 * numSteps) / 3 ? "intermediate" : "open"
    const lipidInteractions = 50 + Math.sin(i * 0.1) * 20 + Math.random() * 5
    const transmembraneDepth = 20 + Math.cos(i * 0.05) * 5 + Math.random() * 2
    const tiltAngle = 10 + Math.sin(i * 0.08) * 8 + Math.random() * 3
    const allostericState = i < numSteps / 4 ? "inactive" : i < (3 * numSteps) / 4 ? "modulated" : "active"

    const coordinates = Array.from({ length: sequenceLength }, (_, idx) => ({
      x: Math.sin(idx * 0.1 + i * 0.01) * 10 + Math.random() * 2,
      y: Math.cos(idx * 0.1 + i * 0.01) * 10 + Math.random() * 2,
      z: Math.sin(idx * 0.05 + i * 0.005) * 5 + transmembraneDepth,
    }))

    states.push({
      id: `state_${i}`,
      name: `Conformation ${i}`,
      time,
      conformation,
      lipidInteractions: Math.round(lipidInteractions),
      transmembraneDepth: Number.parseFloat(transmembraneDepth.toFixed(1)),
      tiltAngle: Number.parseFloat(tiltAngle.toFixed(1)),
      allostericState,
      coordinates,
      description: `State at ${time} ps, showing ${conformation} conformation.`,
    })
  }
  return states
}

export function MembraneProteinDynamicsViewer({
  proteinName,
  sequence,
  membraneType,
  initialState,
}: MembraneProteinDynamicsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()

  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState([0])
  const [playbackSpeed, setPlaybackSpeed] = useState([1])
  const [viewMode, setViewMode] = useState<"3d" | "interactions" | "allosteric" | "simulation">("3d")
  const [showLipidBilayer, setShowLipidBilayer] = useState(true)
  const [showAllostericNetwork, setShowAllostericNetwork] = useState(true)

  // New simulation parameters
  const [forceField, setForceField] = useState<"CHARMM" | "AMBER" | "GROMOS">("CHARMM")
  const [temperatureC, setTemperatureC] = useState([37])
  const [pressureBar, setPressureBar] = useState([1])
  const [simulationEnsemble, setSimulationEnsemble] = useState<"NPT" | "NVT" | "NVE">("NPT")
  const [integrationTimeStep, setIntegrationTimeStep] = useState([2]) // in femtoseconds (fs)
  const [solventModel, setSolventModel] = useState<"TIP3P" | "SPC/E" | "TIP4P">("TIP3P")
  const [periodicBoundaryConditions, setPeriodicBoundaryConditions] = useState(true)

  const proteinStates = useRef(generateProteinStates(sequence, 500))
  const maxTime = proteinStates.current[proteinStates.current.length - 1]?.time || 0

  const getCurrentProteinState = useCallback(() => {
    const time = currentTime[0]
    if (proteinStates.current.length === 0) return initialState

    for (let i = 0; i < proteinStates.current.length - 1; i++) {
      if (time >= proteinStates.current[i].time && time <= proteinStates.current[i + 1].time) {
        const t =
          (time - proteinStates.current[i].time) / (proteinStates.current[i + 1].time - proteinStates.current[i].time)
        // Simple linear interpolation for properties
        return {
          ...proteinStates.current[i],
          conformation: proteinStates.current[i].conformation, // Conformation is discrete, not interpolated
          lipidInteractions: Math.round(
            proteinStates.current[i].lipidInteractions +
              t * (proteinStates.current[i + 1].lipidInteractions - proteinStates.current[i].lipidInteractions),
          ),
          transmembraneDepth: Number.parseFloat(
            (
              proteinStates.current[i].transmembraneDepth +
              t * (proteinStates.current[i + 1].transmembraneDepth - proteinStates.current[i].transmembraneDepth)
            ).toFixed(1),
          ),
          tiltAngle: Number.parseFloat(
            (
              proteinStates.current[i].tiltAngle +
              t * (proteinStates.current[i + 1].tiltAngle - proteinStates.current[i].tiltAngle)
            ).toFixed(1),
          ),
          allostericState: proteinStates.current[i].allostericState, // Allosteric state is discrete
          coordinates: proteinStates.current[i].coordinates.map((coord, idx) => ({
            x: coord.x + t * (proteinStates.current[i + 1].coordinates[idx].x - coord.x),
            y: coord.y + t * (proteinStates.current[i + 1].coordinates[idx].y - coord.y),
            z: coord.z + t * (proteinStates.current[i + 1].coordinates[idx].z - coord.z),
          })),
        }
      }
    }
    return proteinStates.current[proteinStates.current.length - 1] || initialState
  }, [currentTime, initialState])

  const currentProteinState = getCurrentProteinState()

  // Animation loop
  useEffect(() => {
    if (isPlaying) {
      const animate = () => {
        setCurrentTime((prev) => {
          const newTime = prev[0] + playbackSpeed[0] * 10 // Advance by 10 ps per frame
          return [newTime > maxTime ? 0 : newTime]
        })
        animationRef.current = requestAnimationFrame(animate)
      }
      animationRef.current = requestAnimationFrame(animate)
    } else if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isPlaying, playbackSpeed, maxTime])

  // 3D Rendering on Canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const scale = 5 // Adjust scale for better visualization

    // Draw lipid bilayer
    if (showLipidBilayer) {
      ctx.fillStyle = "rgba(100, 150, 255, 0.3)" // Blueish for membrane
      const membraneThickness = 40
      ctx.fillRect(0, centerY - membraneThickness / 2, canvas.width, membraneThickness)

      // Add some lipid head groups (simplified)
      ctx.fillStyle = "rgba(50, 100, 200, 0.8)"
      for (let i = 0; i < canvas.width; i += 10) {
        ctx.beginPath()
        ctx.arc(i + 5, centerY - membraneThickness / 2, 3, 0, Math.PI * 2)
        ctx.fill()
        ctx.beginPath()
        ctx.arc(i + 5, centerY + membraneThickness / 2, 3, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    // Draw protein backbone
    const coords = currentProteinState.coordinates
    ctx.strokeStyle = "#FF6347" // Tomato red for protein
    ctx.lineWidth = 3
    ctx.beginPath()

    coords.forEach((coord, i) => {
      // Project 3D to 2D (simple orthographic projection)
      const x = centerX + coord.x * scale
      const y = centerY + (coord.y + coord.z) * scale * 0.5 // Simple depth perception

      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })
    ctx.stroke()

    // Draw allosteric network (simplified as nodes/connections)
    if (showAllostericNetwork) {
      ctx.fillStyle = "#32CD32" // Lime green for allosteric sites
      ctx.strokeStyle = "#32CD32"
      ctx.lineWidth = 1.5

      // Example allosteric sites (dummy positions relative to protein center)
      const allostericSites = [
        { x: coords[0].x + 5, y: coords[0].y + 5, z: coords[0].z },
        { x: coords[coords.length - 1].x - 5, y: coords[coords.length - 1].y - 5, z: coords[coords.length - 1].z },
        {
          x: coords[Math.floor(coords.length / 2)].x,
          y: coords[Math.floor(coords.length / 2)].y + 8,
          z: coords[Math.floor(coords.length / 2)].z,
        },
      ]

      allostericSites.forEach((site, i) => {
        const x = centerX + site.x * scale
        const y = centerY + (site.y + site.z) * scale * 0.5
        ctx.beginPath()
        ctx.arc(x, y, 4, 0, Math.PI * 2)
        ctx.fill()

        // Draw connections between sites
        if (i > 0) {
          const prevSite = allostericSites[i - 1]
          const prevX = centerX + prevSite.x * scale
          const prevY = centerY + (prevSite.y + prevSite.z) * scale * 0.5
          ctx.beginPath()
          ctx.moveTo(prevX, prevY)
          ctx.lineTo(x, y)
          ctx.stroke()
        }
      })
    }
  }, [currentProteinState, showLipidBilayer, showAllostericNetwork])

  const resetAnimation = () => {
    setCurrentTime([0])
    setIsPlaying(false)
  }

  const exportData = () => {
    const exportData = {
      protein: proteinName,
      sequence,
      membraneType,
      dynamics: proteinStates.current,
      currentSimulationState: currentProteinState,
      simulationParameters: {
        forceField,
        temperatureC: temperatureC[0],
        pressureBar: pressureBar[0],
        simulationEnsemble,
        integrationTimeStep: integrationTimeStep[0],
        solventModel,
        periodicBoundaryConditions,
      },
      timestamp: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${proteinName}_membrane_dynamics.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-[#4A4A4A] flex items-center gap-2">
              <Waves className="h-6 w-6 text-[#1E90FF]" />
              Membrane Protein Dynamics
            </h2>
            <p className="text-[#4A4A4A]/70">
              Interactive simulation and analysis of {proteinName} in a {membraneType} membrane
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={exportData}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Controls */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-[#2E8B57]" />
              Simulation Controls
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              <div className="space-y-2">
                <Label htmlFor="force-field">Force Field</Label>
                <Select value={forceField} onValueChange={(value: any) => setForceField(value)}>
                  <SelectTrigger id="force-field">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CHARMM">CHARMM</SelectItem>
                    <SelectItem value="AMBER">AMBER</SelectItem>
                    <SelectItem value="GROMOS">GROMOS</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="simulation-ensemble">Ensemble</Label>
                <Select value={simulationEnsemble} onValueChange={(value: any) => setSimulationEnsemble(value)}>
                  <SelectTrigger id="simulation-ensemble">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NPT">NPT (Constant Pressure, Temp)</SelectItem>
                    <SelectItem value="NVT">NVT (Constant Volume, Temp)</SelectItem>
                    <SelectItem value="NVE">NVE (Constant Energy, Volume)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="integration-time-step">Integration Time Step (fs)</Label>
                <Slider
                  id="integration-time-step"
                  value={integrationTimeStep}
                  onValueChange={setIntegrationTimeStep}
                  min={0.5}
                  max={5}
                  step={0.1}
                  className="w-full"
                />
                <div className="text-xs text-center">{integrationTimeStep[0].toFixed(1)} fs</div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="temperature">Temperature (°C)</Label>
                <Slider
                  id="temperature"
                  value={temperatureC}
                  onValueChange={setTemperatureC}
                  min={0}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <div className="text-xs text-center">{temperatureC[0]}°C</div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pressure">Pressure (bar)</Label>
                <Slider
                  id="pressure"
                  value={pressureBar}
                  onValueChange={setPressureBar}
                  min={0.5}
                  max={5}
                  step={0.1}
                  className="w-full"
                />
                <div className="text-xs text-center">{pressureBar[0].toFixed(1)} Bar</div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="solvent-model">Solvent Model</Label>
                <Select value={solventModel} onValueChange={(value: any) => setSolventModel(value)}>
                  <SelectTrigger id="solvent-model">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TIP3P">TIP3P</SelectItem>
                    <SelectItem value="SPC/E">SPC/E</SelectItem>
                    <SelectItem value="TIP4P">TIP4P</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2 col-span-full md:col-span-1">
                <Switch
                  id="periodic-boundary-conditions"
                  checked={periodicBoundaryConditions}
                  onCheckedChange={setPeriodicBoundaryConditions}
                />
                <Label htmlFor="periodic-boundary-conditions">Periodic Boundary Conditions</Label>
              </div>

              <div className="space-y-2 col-span-full md:col-span-2 lg:col-span-3 xl:col-span-2">
                <Label htmlFor="playback-speed">Playback Speed</Label>
                <Slider
                  id="playback-speed"
                  value={playbackSpeed}
                  onValueChange={setPlaybackSpeed}
                  min={0.1}
                  max={5}
                  step={0.1}
                  className="w-full"
                />
                <div className="text-xs text-center">{playbackSpeed[0].toFixed(1)}x</div>
              </div>

              <div className="space-y-2 col-span-full md:col-span-2 lg:col-span-3 xl:col-span-2">
                <Label>Display Options</Label>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Switch checked={showLipidBilayer} onCheckedChange={setShowLipidBilayer} id="show-lipids" />
                    <Label htmlFor="show-lipids">Lipid Bilayer</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={showAllostericNetwork}
                      onCheckedChange={setShowAllostericNetwork}
                      id="show-allosteric"
                    />
                    <Label htmlFor="show-allosteric">Allosteric Network</Label>
                  </div>
                </div>
              </div>
            </div>

            {/* Time Slider */}
            <div className="mt-6 space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="simulation-time-slider">Simulation Time</Label>
                <span className="text-sm text-[#4A4A4A]/70">
                  {currentTime[0].toFixed(0)} / {maxTime} ps
                </span>
              </div>
              <Slider
                id="simulation-time-slider"
                value={currentTime}
                onValueChange={setCurrentTime}
                min={0}
                max={maxTime}
                step={10}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-[#4A4A4A]/50">
                <span>Start</span>
                <span>Equilibration</span>
                <span>Dynamics</span>
              </div>
            </div>

            <div className="flex justify-center gap-4 mt-6">
              <Button onClick={() => setCurrentTime([Math.max(0, currentTime[0] - 100)])} variant="outline" size="sm">
                <Rewind className="h-4 w-4" />
              </Button>
              <Button variant="default" size="sm" onClick={() => setIsPlaying(!isPlaying)}>
                {isPlaying ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                {isPlaying ? "Pause" : "Play"}
              </Button>
              <Button
                onClick={() => setCurrentTime([Math.min(maxTime, currentTime[0] + 100)])}
                variant="outline"
                size="sm"
              >
                <FastForward className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={resetAnimation}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Main Visualization */}
        <Tabs value={viewMode} onValueChange={(value: any) => setViewMode(value)} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="3d">3D Dynamics</TabsTrigger>
            <TabsTrigger value="interactions">Lipid Interactions</TabsTrigger>
            <TabsTrigger value="allosteric">Allosteric Network</TabsTrigger>
            <TabsTrigger value="simulation">Simulation Data</TabsTrigger>
          </TabsList>

          <TabsContent value="3d">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Atom className="h-5 w-5 text-[#1E90FF]" />
                  3D Membrane Protein Dynamics
                </CardTitle>
                <CardDescription>
                  Real-time visualization of {proteinName} conformational changes in membrane
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid lg:grid-cols-3 gap-6">
                  {/* 3D Structure Canvas */}
                  <div className="lg:col-span-2">
                    <canvas
                      ref={canvasRef}
                      width={600}
                      height={400}
                      className="border rounded-lg bg-gradient-to-br from-blue-50 to-blue-100"
                    />
                  </div>

                  {/* Current State Info */}
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-[#F5F7FA] border">
                      <h4 className="font-medium text-[#4A4A4A] mb-3">Current State</h4>
                      <div className="space-y-3 text-sm">
                        <div>
                          <span className="text-[#4A4A4A]/70">Conformation:</span>
                          <p className="font-medium capitalize">{currentProteinState.conformation}</p>
                        </div>
                        <div>
                          <span className="text-[#4A4A4A]/70">Lipid Interactions:</span>
                          <p className="font-medium">{currentProteinState.lipidInteractions} contacts</p>
                        </div>
                        <div>
                          <span className="text-[#4A4A4A]/70">Transmembrane Depth:</span>
                          <p className="font-medium">{currentProteinState.transmembraneDepth} Å</p>
                        </div>
                        <div>
                          <span className="text-[#4A4A4A]/70">Tilt Angle:</span>
                          <p className="font-medium">{currentProteinState.tiltAngle}°</p>
                        </div>
                        <div>
                          <span className="text-[#4A4A4A]/70">Allosteric State:</span>
                          <p className="font-medium capitalize">{currentProteinState.allostericState}</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-lg bg-[#F5F7FA] border">
                      <h4 className="font-medium text-[#4A4A4A] mb-3">Simulation Parameters</h4>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-[#4A4A4A]/70">Membrane Type:</span>
                          <p className="font-medium">{membraneType}</p>
                        </div>
                        <div>
                          <span className="text-[#4A4A4A]/70">Force Field:</span>
                          <p className="font-medium">{forceField}</p>
                        </div>
                        <div>
                          <span className="text-[#4A4A4A]/70">Ensemble:</span>
                          <p className="font-medium">{simulationEnsemble}</p>
                        </div>
                        <div>
                          <span className="text-[#4A4A4A]/70">Time Step:</span>
                          <p className="font-medium">{integrationTimeStep[0].toFixed(1)} fs</p>
                        </div>
                        <div>
                          <span className="text-[#4A4A4A]/70">Temperature:</span>
                          <p className="font-medium">{temperatureC[0]}°C</p>
                        </div>
                        <div>
                          <span className="text-[#4A4A4A]/70">Pressure:</span>
                          <p className="font-medium">{pressureBar[0].toFixed(1)} Bar</p>
                        </div>
                        <div>
                          <span className="text-[#4A4A4A]/70">Solvent Model:</span>
                          <p className="font-medium">{solventModel}</p>
                        </div>
                        <div>
                          <span className="text-[#4A4A4A]/70">PBC:</span>
                          <p className="font-medium">{periodicBoundaryConditions ? "Enabled" : "Disabled"}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="interactions">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Network className="h-5 w-5 text-[#FF8C00]" />
                  Lipid Interaction Analysis
                </CardTitle>
                <CardDescription>
                  Detailed analysis of protein-lipid interactions and membrane embedding
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-[#4A4A4A]/70">
                    This section would display charts and data related to lipid contacts, membrane insertion depth over
                    time, and lipid ordering around the protein.
                  </p>
                  {/* Placeholder for charts/data */}
                  <div className="h-64 w-full bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                    Charts and data for lipid interactions
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="allosteric">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FlaskConical className="h-5 w-5 text-[#DC143C]" />
                  Allosteric Network Analysis
                </CardTitle>
                <CardDescription>Visualization and analysis of allosteric communication pathways</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-[#4A4A4A]/70">
                    This section would display the allosteric network, key allosteric sites, and how allosteric
                    communication changes with protein conformation.
                  </p>
                  {/* Placeholder for charts/data */}
                  <div className="h-64 w-full bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                    Allosteric network visualization and data
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="simulation">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-[#2E8B57]" />
                  Raw Simulation Data
                </CardTitle>
                <CardDescription>
                  Detailed metrics and trajectories from the molecular dynamics simulation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-[#4A4A4A]/70">
                    This section would provide tables and raw data for various simulation parameters like RMSD, Rg,
                    hydrogen bonds, etc., over time.
                  </p>
                  {/* Placeholder for tables/raw data */}
                  <div className="h-64 w-full bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                    Tables and raw simulation data
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </TooltipProvider>
  )
}
