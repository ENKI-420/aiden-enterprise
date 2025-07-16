"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Play, Pause, RotateCcw, Download, Atom } from "lucide-react"
import { Label } from "@/components/ui/label"

interface ProteinFoldingState {
  id: string
  name: string
  time: number // in nanoseconds (ns)
  rmsd: number // Root Mean Square Deviation from native state
  gyrationRadius: number // Radius of gyration
  hBonds: number // Number of intramolecular hydrogen bonds
  conformation: string // e.g., "unfolded", "intermediate", "folded"
  energy: number // Total energy of the system
  coordinates: Array<{ x: number; y: number; z: number }> // Simplified 3D coordinates
  description: string
}

interface ProteinFoldingViewerProps {
  proteinName: string
  sequence: string
  initialState: ProteinFoldingState
}

// Dummy data for protein folding states
const generateFoldingStates = (initialState: ProteinFoldingState, numSteps = 500): ProteinFoldingState[] => {
  const states: ProteinFoldingState[] = []
  const sequenceLength = initialState.coordinates.length

  for (let i = 0; i < numSteps; i++) {
    const time = i * 0.1 // 0.1 ns per step
    let conformation = "unfolded"
    if (i > numSteps * 0.3) conformation = "intermediate"
    if (i > numSteps * 0.7) conformation = "folded"

    const rmsd = Math.max(0.5, 5.0 * Math.exp(-0.01 * i) + Math.random() * 0.2)
    const gyrationRadius = Math.max(1.5, 3.0 * Math.exp(-0.005 * i) + Math.random() * 0.1)
    const hBonds = Math.min(sequenceLength / 5, 2 + i * 0.1 + Math.random() * 2)
    const energy = -100 + i * 0.5 + Math.random() * 10 // Energy decreases as it folds

    const coordinates = initialState.coordinates.map((coord, idx) => ({
      x: coord.x + Math.sin(idx * 0.1 + i * 0.01) * 0.5,
      y: coord.y + Math.cos(idx * 0.1 + i * 0.01) * 0.5,
      z: coord.z + Math.sin(idx * 0.05 + i * 0.005) * 0.2,
    }))

    states.push({
      id: `state_${i}`,
      name: `Folding Step ${i}`,
      time: Number.parseFloat(time.toFixed(1)),
      rmsd: Number.parseFloat(rmsd.toFixed(2)),
      gyrationRadius: Number.parseFloat(gyrationRadius.toFixed(2)),
      hBonds: Math.round(hBonds),
      conformation,
      energy: Number.parseFloat(energy.toFixed(1)),
      coordinates,
      description: `State at ${time} ns, in ${conformation} conformation.`,
    })
  }
  return states
}

export function ProteinFoldingViewer({ proteinName, sequence, initialState }: ProteinFoldingViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()

  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState([0])
  const [playbackSpeed, setPlaybackSpeed] = useState([1]) // 1x, 2x, 0.5x
  const [viewMode, setViewMode] = useState<"3d" | "metrics" | "energy" | "trajectory">("3d")

  const foldingStates = useRef(generateFoldingStates(initialState, 500))
  const maxTime = foldingStates.current[foldingStates.current.length - 1]?.time || 0

  const getCurrentFoldingState = useCallback(() => {
    const time = currentTime[0]
    if (foldingStates.current.length === 0) return initialState

    for (let i = 0; i < foldingStates.current.length - 1; i++) {
      if (time >= foldingStates.current[i].time && time <= foldingStates.current[i + 1].time) {
        const t =
          (time - foldingStates.current[i].time) / (foldingStates.current[i + 1].time - foldingStates.current[i].time)
        // Simple linear interpolation for properties
        return {
          ...foldingStates.current[i],
          rmsd: foldingStates.current[i].rmsd + t * (foldingStates.current[i + 1].rmsd - foldingStates.current[i].rmsd),
          gyrationRadius:
            foldingStates.current[i].gyrationRadius +
            t * (foldingStates.current[i + 1].gyrationRadius - foldingStates.current[i].gyrationRadius),
          hBonds: Math.round(
            foldingStates.current[i].hBonds +
              t * (foldingStates.current[i + 1].hBonds - foldingStates.current[i].hBonds),
          ),
          energy:
            foldingStates.current[i].energy +
            t * (foldingStates.current[i + 1].energy - foldingStates.current[i].energy),
          coordinates: foldingStates.current[i].coordinates.map((coord, idx) => ({
            x: coord.x + t * (foldingStates.current[i + 1].coordinates[idx].x - coord.x),
            y: coord.y + t * (foldingStates.current[i + 1].coordinates[idx].y - coord.y),
            z: coord.z + t * (foldingStates.current[i + 1].coordinates[idx].z - coord.z),
          })),
        }
      }
    }
    return foldingStates.current[foldingStates.current.length - 1] || initialState
  }, [currentTime, initialState])

  const currentFoldingState = getCurrentFoldingState()

  // Animation loop
  useEffect(() => {
    if (isPlaying) {
      const animate = () => {
        setCurrentTime((prev) => {
          const newTime = prev[0] + playbackSpeed[0] * 0.1 // Advance by 0.1 ns per frame
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
    const scale = 10 // Adjust scale for better visualization

    // Draw protein backbone
    const coords = currentFoldingState.coordinates
    ctx.strokeStyle = "#4CAF50" // Green for protein backbone
    ctx.lineWidth = 3
    ctx.beginPath()

    coords.forEach((coord, i) => {
      // Project 3D to 2D (simple orthographic projection)
      const x = centerX + coord.x * scale
      const y = centerY + coord.y * scale

      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })
    ctx.stroke()

    // Draw residues (circles)
    ctx.fillStyle = "#2196F3" // Blue for residues
    ctx.strokeStyle = "#1976D2"
    ctx.lineWidth = 1.5
    coords.forEach((coord) => {
      const x = centerX + coord.x * scale
      const y = centerY + coord.y * scale
      ctx.beginPath()
      ctx.arc(x, y, 4, 0, Math.PI * 2)
      ctx.fill()
      ctx.stroke()
    })
  }, [currentFoldingState])

  const resetAnimation = () => {
    setCurrentTime([0])
    setIsPlaying(false)
  }

  const exportData = () => {
    const exportData = {
      protein: proteinName,
      sequence,
      foldingTrajectory: foldingStates.current,
      currentFoldingState,
      timestamp: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${proteinName}_folding_trajectory.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handlePlayPause = () => {
    setIsPlaying((prev) => !prev)
  }

  const handleReset = () => {
    resetAnimation()
  }

  return (
    <TooltipProvider>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Atom className="h-5 w-5 text-[#4CAF50]" />
            Protein Folding Pathway Visualization: {proteinName}
          </CardTitle>
          <CardDescription>
            Visualize the dynamic process of protein folding and track key biophysical metrics.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="relative w-full h-[400px] border rounded-lg overflow-hidden bg-gray-50">
            <canvas
              ref={canvasRef}
              width={800}
              height={400}
              className="w-full h-full"
              aria-label="Protein Folding Visualization"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="simulation-time">
                Simulation Time ({currentFoldingState.time.toFixed(1)} / {maxTime.toFixed(1)} ns)
              </Label>
              <Slider
                id="simulation-time"
                min={0}
                max={maxTime}
                step={0.1}
                value={currentTime}
                onValueChange={setCurrentTime}
                aria-label="Simulation Time Slider"
              />
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>RMSD: {currentFoldingState.rmsd.toFixed(2)} Å</span>
                <span>Rg: {currentFoldingState.gyrationRadius.toFixed(2)} Å</span>
                <span>H-Bonds: {currentFoldingState.hBonds}</span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="playback-speed">Playback Speed</Label>
              <Select
                value={String(playbackSpeed[0])}
                onValueChange={(value) => setPlaybackSpeed([Number(value)])}
                aria-label="Playback Speed Selector"
              >
                <SelectTrigger id="playback-speed">
                  <SelectValue placeholder="Select speed" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0.5">0.5x</SelectItem>
                  <SelectItem value="1">1x (Normal)</SelectItem>
                  <SelectItem value="2">2x</SelectItem>
                  <SelectItem value="5">5x</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <Button
              onClick={handlePlayPause}
              className="min-w-[100px]"
              aria-label={isPlaying ? "Pause Animation" : "Play Animation"}
            >
              {isPlaying ? <Pause className="h-5 w-5 mr-2" /> : <Play className="h-5 w-5 mr-2" />}
              {isPlaying ? "Pause" : "Play"}
            </Button>
            <Button
              onClick={handleReset}
              variant="outline"
              className="min-w-[100px] bg-transparent"
              aria-label="Reset Animation"
            >
              <RotateCcw className="h-5 w-5 mr-2" />
              Reset
            </Button>
            <Button
              onClick={exportData}
              variant="outline"
              className="min-w-[100px] bg-transparent"
              aria-label="Export Data"
            >
              <Download className="h-5 w-5 mr-2" />
              Export
            </Button>
          </div>

          <div className="mt-4 p-4 bg-gray-50 rounded-lg text-sm text-gray-700">
            <h3 className="font-semibold mb-2">Current Conformation Details:</h3>
            <p>
              <strong>Conformation State:</strong> {currentFoldingState.conformation}
            </p>
            <p>
              <strong>Total Energy:</strong> {currentFoldingState.energy.toFixed(1)} kcal/mol
            </p>
            <p>
              <strong>Description:</strong> {currentFoldingState.description}
            </p>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  )
}
