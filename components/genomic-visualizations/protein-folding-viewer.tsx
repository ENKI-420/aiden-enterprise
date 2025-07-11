"use client"

import { useRef, useEffect, useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Play, Pause, RotateCcw, ZoomIn, ZoomOut, MoveHorizontal, MoveVertical, Dna } from "lucide-react"

interface ProteinFoldingViewerProps {
  proteinName: string
  sequence: string
  foldingPathway: Array<{
    id: string
    name: string
    time: number
    conformation: string
    energy: number
    rmsd: number
    description: string
    coordinates: Array<{ x: number; y: number; z: number }>
  }>
  initialPathwayIndex?: number
  nativeStructure?: {
    helices: Array<{ start: number; end: number }>
    sheets: Array<{ start: number; end: number }>
    loops: Array<{ start: number; end: number }>
  }
  variants?: Array<{
    position: number
    wildType: string
    mutant: string
    foldingEffect: "stabilizing" | "destabilizing" | "neutral"
    energyChange: number
  }>
}

export function ProteinFoldingViewer({
  proteinName,
  sequence,
  foldingPathway,
  initialPathwayIndex = 0,
  nativeStructure,
  variants = [],
}: ProteinFoldingViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const energyCanvasRef = useRef<HTMLCanvasElement>(null)
  const [currentStepIndex, setCurrentStepIndex] = useState(initialPathwayIndex)
  const [isPlaying, setIsPlaying] = useState(false)
  const [animationSpeed, setAnimationSpeed] = useState(500) // Milliseconds per step
  const [zoom, setZoom] = useState(1)
  const [offsetX, setOffsetX] = useState(0)
  const [offsetY, setOffsetY] = useState(0)
  const animationRef = useRef<number | null>(null)
  const lastFrameTimeRef = useRef<number>(0)

  const [currentTime, setCurrentTime] = useState([0])
  const [playbackSpeed, setPlaybackSpeed] = useState([1])
  const [selectedIntermediate, setSelectedIntermediate] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<"3d" | "energy" | "kinetics" | "comparison">("3d")
  const [showEnergyBarriers, setShowEnergyBarriers] = useState(true)
  const [showNativeContacts, setShowNativeContacts] = useState(true)
  const [colorScheme, setColorScheme] = useState<"energy" | "time" | "structure" | "stability">("energy")
  const [selectedPathway, setSelectedPathway] = useState<string>("pathway1")
  const [temperatureK, setTemperatureK] = useState([310])
  const [showVariantEffects, setShowVariantEffects] = useState(false)

  const currentStep = foldingPathway[currentStepIndex]

  const drawProtein = useCallback(() => {
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

    // Draw bonds (lines between consecutive residues)
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

    // Draw residues (circles)
    currentStep.coordinates.forEach((coord, index) => {
      ctx.beginPath()
      ctx.arc(centerX + coord.x * scaleFactor, centerY + coord.y * scaleFactor, 4, 0, 2 * Math.PI)
      ctx.fillStyle = "#1E90FF" // Blue color for residues
      ctx.fill()
      ctx.strokeStyle = "#333333"
      ctx.lineWidth = 1
      ctx.stroke()

      // Optional: Add residue index for debugging/detail
      // ctx.fillStyle = "#333";
      // ctx.font = "8px Arial";
      // ctx.fillText(String(index + 1), centerX + coord.x * scaleFactor + 5, centerY + coord.y * scaleFactor + 5);
    })

    ctx.restore()
  }, [currentStep, zoom, offsetX, offsetY])

  useEffect(() => {
    drawProtein()
  }, [currentStep, drawProtein])

  const animateFolding = useCallback(
    (timestamp: DOMHighResTimeStamp) => {
      if (!lastFrameTimeRef.current) {
        lastFrameTimeRef.current = timestamp
      }

      const elapsed = timestamp - lastFrameTimeRef.current

      if (elapsed > animationSpeed) {
        setCurrentStepIndex((prevIndex) => {
          const nextIndex = (prevIndex + 1) % foldingPathway.length
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
        animationRef.current = requestAnimationFrame(animateFolding)
      }
    },
    [foldingPathway.length, isPlaying, animationSpeed],
  )

  useEffect(() => {
    if (isPlaying) {
      animationRef.current = requestAnimationFrame(animateFolding)
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
  }, [isPlaying, animateFolding])

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

  const exportData = () => {
    const exportData = {
      protein: proteinName,
      foldingPathway,
      currentState: currentStep,
      variants,
      timestamp: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${proteinName}_folding_analysis.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Dna className="h-5 w-5 text-[#1E90FF]" />
          Protein Folding Pathway Visualization: {proteinName}
        </CardTitle>
        <CardDescription>Interactive visualization of the protein folding process for {proteinName}.</CardDescription>
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
            <Label htmlFor="folding-step">
              Folding Step ({currentStepIndex + 1}/{foldingPathway.length})
            </Label>
            <Slider
              id="folding-step"
              min={0}
              max={foldingPathway.length - 1}
              step={1}
              value={[currentStepIndex]}
              onValueChange={([value]) => {
                setIsPlaying(false)
                setCurrentStepIndex(value)
              }}
              aria-label="Folding Step Slider"
            />
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>Time: {currentStep.time.toFixed(2)} ns</span>
              <span>Energy: {currentStep.energy.toFixed(2)} kcal/mol</span>
              <span>RMSD: {currentStep.rmsd.toFixed(2)} Å</span>
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
        </div>

        <div className="mt-4 p-4 bg-gray-50 rounded-lg text-sm text-gray-700">
          <h3 className="font-semibold mb-2">Current Conformation Details:</h3>
          <p>
            <strong>Name:</strong> {currentStep.name}
          </p>
          <p>
            <strong>Conformation:</strong> {currentStep.conformation}
          </p>
          <p>
            <strong>Description:</strong> {currentStep.description}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
