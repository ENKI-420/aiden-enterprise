"use client"

import { useRef, useEffect, useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Play, Pause, RotateCcw, Waves, ZoomIn, ZoomOut, MoveHorizontal, MoveVertical } from "lucide-react"

interface MembraneProteinDynamicsViewerProps {
  proteinName: string
  sequence: string
  membraneType: string
  initialState: {
    id: string
    name: string
    time: number
    conformation: string
    lipidInteractions: number
    transmembraneDepth: number
    tiltAngle: number
    allostericState: string
    coordinates: Array<{ x: number; y: number; z: number }>
    description: string
  }
}

// Dummy data for simulation steps
const generateSimulationSteps = (initialState: any, numSteps = 100) => {
  const steps = [initialState]
  for (let i = 1; i < numSteps; i++) {
    const prev = steps[i - 1]
    steps.push({
      id: `step-${i}`,
      name: `Simulation Step ${i}`,
      time: prev.time + 0.1, // Increment time
      conformation: i % 20 === 0 ? (prev.conformation === "closed" ? "open" : "closed") : prev.conformation,
      lipidInteractions: Math.max(0, prev.lipidInteractions + (Math.random() - 0.5) * 2),
      transmembraneDepth: Math.max(10, prev.transmembraneDepth + (Math.random() - 0.5) * 0.5),
      tiltAngle: Math.max(0, Math.min(30, prev.tiltAngle + (Math.random() - 0.5) * 0.2)),
      allostericState:
        i % 30 === 0 ? (prev.allostericState === "inactive" ? "active" : "inactive") : prev.allostericState,
      coordinates: prev.coordinates.map((coord: any) => ({
        x: coord.x + (Math.random() - 0.5) * 0.1,
        y: coord.y + (Math.random() - 0.5) * 0.1,
        z: coord.z + (Math.random() - 0.5) * 0.05,
      })),
      description: `Dynamic state at ${prev.time + 0.1} ns.`,
    })
  }
  return steps
}

export function MembraneProteinDynamicsViewer({
  proteinName,
  sequence,
  membraneType,
  initialState,
}: MembraneProteinDynamicsViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const simulationSteps = useRef(generateSimulationSteps(initialState, 200))
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [animationSpeed, setAnimationSpeed] = useState(200) // Milliseconds per step
  const [zoom, setZoom] = useState(1)
  const [offsetX, setOffsetX] = useState(0)
  const [offsetY, setOffsetY] = useState(0)
  const animationRef = useRef<number | null>(null)
  const lastFrameTimeRef = useRef<number>(0)

  const currentStep = simulationSteps.current[currentStepIndex]

  const drawProteinAndMembrane = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.save()

    // Apply zoom and pan
    ctx.translate(canvas.width / 2 + offsetX, canvas.height / 2 + offsetY)
    ctx.scale(zoom, zoom)
    ctx.translate(-canvas.width / 2, -canvas.height / 2)

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const scaleFactor = 5 // Adjust this to control the size of the protein visualization

    // Draw membrane (simplified as a rectangle)
    const membraneHeight = 80
    const membraneY = centerY - membraneHeight / 2
    ctx.fillStyle = "rgba(100, 149, 237, 0.5)" // CornflowerBlue with transparency
    ctx.fillRect(0, membraneY, canvas.width, membraneHeight)
    ctx.strokeStyle = "rgba(65, 105, 225, 0.8)" // RoyalBlue
    ctx.lineWidth = 2
    ctx.strokeRect(0, membraneY, canvas.width, membraneHeight)
    ctx.font = "12px Arial"
    ctx.fillStyle = "#333"
    ctx.fillText(`Membrane: ${membraneType}`, 10, membraneY + 20)

    // Draw protein (similar to protein folding viewer)
    ctx.strokeStyle = "#888888"
    ctx.lineWidth = 2
    ctx.beginPath()
    for (let i = 0; i < currentStep.coordinates.length - 1; i++) {
      const p1 = currentStep.coordinates[i]
      const p2 = currentStep.coordinates[i + 1]
      ctx.moveTo(centerX + p1.x * scaleFactor, centerY + p1.y * scaleFactor)
      ctx.lineTo(centerX + p2.x * scaleFactor, centerY + p2.y * scaleFactor)
    }
    ctx.stroke()

    currentStep.coordinates.forEach((coord: any) => {
      ctx.beginPath()
      ctx.arc(centerX + coord.x * scaleFactor, centerY + coord.y * scaleFactor, 4, 0, 2 * Math.PI)
      ctx.fillStyle = "#FF4500" // OrangeRed for membrane proteins
      ctx.fill()
      ctx.strokeStyle = "#333333"
      ctx.lineWidth = 1
      ctx.stroke()
    })

    ctx.restore()
  }, [currentStep, zoom, offsetX, offsetY, membraneType])

  useEffect(() => {
    drawProteinAndMembrane()
  }, [currentStep, drawProteinAndMembrane])

  const animateDynamics = useCallback(
    (timestamp: DOMHighResTimeStamp) => {
      if (!lastFrameTimeRef.current) {
        lastFrameTimeRef.current = timestamp
      }

      const elapsed = timestamp - lastFrameTimeRef.current

      if (elapsed > animationSpeed) {
        setCurrentStepIndex((prevIndex) => {
          const nextIndex = (prevIndex + 1) % simulationSteps.current.length
          if (nextIndex === 0 && !isPlaying) {
            // Stop animation if it's a single loop and not continuous play
            cancelAnimationFrame(animationRef.current!)
            animationRef.current = null
            return prevIndex // Stay at the last frame
          }
          return nextIndex
        })
        lastFrameTimeRef.current = timestamp
      }

      if (isPlaying) {
        animationRef.current = requestAnimationFrame(animateDynamics)
      }
    },
    [isPlaying, animationSpeed],
  )

  useEffect(() => {
    if (isPlaying) {
      animationRef.current = requestAnimationFrame(animateDynamics)
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
        animationRef.current = null
      }
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isPlaying, animateDynamics])

  const handlePlayPause = () => {
    setIsPlaying((prev) => !prev)
  }

  const handleReset = () => {
    setIsPlaying(false)
    setCurrentStepIndex(0)
    setZoom(1)
    setOffsetX(0)
    setOffsetY(0)
  }

  const handleZoom = (factor: number) => {
    setZoom((prev) => Math.max(0.1, prev * factor))
  }

  const handlePan = (dx: number, dy: number) => {
    setOffsetX((prev) => prev + dx)
    setOffsetY((prev) => prev + dy)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Waves className="h-5 w-5 text-[#1E90FF]" />
          Membrane Protein Dynamics: {proteinName}
        </CardTitle>
        <CardDescription>
          Simulate and visualize conformational changes and allosteric networks within the membrane.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="relative w-full h-[400px] border rounded-lg overflow-hidden bg-gray-50">
          <canvas
            ref={canvasRef}
            width={800}
            height={400}
            className="w-full h-full"
            aria-label="Membrane Protein Dynamics Visualization"
          />
          <div className="absolute top-2 right-2 flex flex-col gap-2 p-2 bg-white/80 rounded-md shadow-sm">
            <Button variant="ghost" size="icon" onClick={() => handleZoom(1.1)} aria-label="Zoom In">
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => handleZoom(0.9)} aria-label="Zoom Out">
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => handlePan(0, -10)} aria-label="Pan Up">
              <MoveVertical className="h-4 w-4 rotate-90" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => handlePan(0, 10)} aria-label="Pan Down">
              <MoveVertical className="h-4 w-4 -rotate-90" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => handlePan(-10, 0)} aria-label="Pan Left">
              <MoveHorizontal className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => handlePan(10, 0)} aria-label="Pan Right">
              <MoveHorizontal className="h-4 w-4 rotate-180" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="simulation-step">
              Simulation Step ({currentStepIndex + 1}/{simulationSteps.current.length})
            </Label>
            <Slider
              id="simulation-step"
              min={0}
              max={simulationSteps.current.length - 1}
              step={1}
              value={[currentStepIndex]}
              onValueChange={([value]) => {
                setIsPlaying(false)
                setCurrentStepIndex(value)
              }}
              aria-label="Simulation Step Slider"
            />
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>Time: {currentStep.time.toFixed(2)} ns</span>
              <span>Lipid Interactions: {currentStep.lipidInteractions.toFixed(0)}</span>
              <span>Depth: {currentStep.transmembraneDepth.toFixed(1)} Å</span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="animation-speed">Animation Speed</Label>
            <Select
              value={String(animationSpeed)}
              onValueChange={(value) => setAnimationSpeed(Number(value))}
              aria-label="Animation Speed Selector"
            >
              <SelectTrigger id="animation-speed">
                <SelectValue placeholder="Select speed" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1000">Slow (1s/step)</SelectItem>
                <SelectItem value="500">Normal (0.5s/step)</SelectItem>
                <SelectItem value="200">Fast (0.2s/step)</SelectItem>
                <SelectItem value="50">Very Fast (0.05s/step)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-center gap-4">
          <Button
            onClick={handlePlayPause}
            className="min-w-[100px]"
            aria-label={isPlaying ? "Pause Simulation" : "Play Simulation"}
          >
            {isPlaying ? <Pause className="h-5 w-5 mr-2" /> : <Play className="h-5 w-5 mr-2" />}
            {isPlaying ? "Pause" : "Play"}
          </Button>
          <Button
            onClick={handleReset}
            variant="outline"
            className="min-w-[100px] bg-transparent"
            aria-label="Reset Simulation"
          >
            <RotateCcw className="h-5 w-5 mr-2" />
            Reset
          </Button>
        </div>

        <div className="mt-4 p-4 bg-gray-50 rounded-lg text-sm text-gray-700">
          <h3 className="font-semibold mb-2">Current State Details:</h3>
          <p>
            <strong>Conformation:</strong> {currentStep.conformation}
          </p>
          <p>
            <strong>Tilt Angle:</strong> {currentStep.tiltAngle.toFixed(1)} degrees
          </p>
          <p>
            <strong>Allosteric State:</strong> {currentStep.allostericState}
          </p>
          <p>
            <strong>Description:</strong> {currentStep.description}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
