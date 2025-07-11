"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TooltipProvider } from "@/components/ui/tooltip"
import { RotateCcw, Download, Play, Pause, RotateCw, Eye, EyeOff } from "lucide-react"
import { MolecularDynamicsViewer } from "./molecular-dynamics-viewer"

interface ProteinData {
  name: string
  pdbId: string
  gene: string
  length: number
  domains: Array<{
    name: string
    start: number
    end: number
    type: string
    color: string
    function: string
  }>
  variants: Array<{
    position: number
    wildType: string
    mutant: string
    impact: "High" | "Moderate" | "Low"
    consequence: string
    structuralEffect: string
    stabilityChange: number
    bindingAffinity: number
    pathogenicity: "Pathogenic" | "Likely Pathogenic" | "VUS" | "Benign"
  }>
  bindingSites: Array<{
    name: string
    residues: number[]
    ligand: string
    function: string
  }>
  secondaryStructure: Array<{
    type: "helix" | "sheet" | "loop"
    start: number
    end: number
  }>
}

interface ProteinStructureViewerProps {
  data: ProteinData
}

export function ProteinStructureViewer({ data }: ProteinStructureViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [selectedVariant, setSelectedVariant] = useState<number | null>(null)
  const [viewMode, setViewMode] = useState<"cartoon" | "surface" | "ball-stick" | "ribbon">("cartoon")
  const [colorScheme, setColorScheme] = useState<"domain" | "secondary" | "hydrophobicity" | "charge">("domain")
  const [isRotating, setIsRotating] = useState(false)
  const [showVariants, setShowVariants] = useState(true)
  const [showBindingSites, setShowBindingSites] = useState(true)
  const [zoom, setZoom] = useState([1])
  const [rotation, setRotation] = useState({ x: 0, y: 0, z: 0 })
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null)

  const molecularDynamicsData = {
    protein: {
      name: data.name,
      sequence:
        "MDLSALRVEEVQNVINAMQKILECPICLELIKEPVSTKCDHIFCKFCMLKLLNQKKGPSQCPLCKNDITKRSLQESTRFSQLVEELLKIICAFQLDTGLEYANSYNFAKKENNSPEHLKDEVSIIQSMGYRNRAKRLLQSEPENPSLQETSLSVQLSNLGTVRTLRTKQRIQPQKTSVYIELGSDSSEDTVNKATYCSVGDQELLQITPQGTRDEISLDSAKKAACEFSETDVTNTEHHQPSNNDLNTTEKRAAERHPEKYQGSSVSNLHVEPCGTNTHASSLQHENSSLLLTKDRMNVEKAEFCNKSKQPGLARSQHNRWAGSKETCNDRRTPSTEKKVDLNADPLCERKEWNKQKLPCSENPRDTEDVPWITLNSSIQKVNEWSRQRWWESWSVPCS",
      length: data.length,
      temperature: 310,
      simulationTime: 100,
    },
    variants: data.variants.map((variant) => ({
      position: variant.position,
      wildType: variant.wildType,
      mutant: variant.mutant,
      impact: variant.impact,
      stabilityEffect: variant.stabilityChange,
      flexibilityChange: Math.random() * 0.4 - 0.2,
      bindingEffect: variant.bindingAffinity,
    })),
    trajectory: Array.from({ length: 1000 }, (_, frameIndex) => ({
      timepoint: frameIndex * 0.1,
      coordinates: Array.from({ length: data.length }, (_, residueIndex) => ({
        x: Math.sin(frameIndex * 0.01 + residueIndex * 0.1) * (1 + Math.random() * 0.2),
        y: Math.cos(frameIndex * 0.01 + residueIndex * 0.1) * (1 + Math.random() * 0.2),
        z: Math.sin(frameIndex * 0.02 + residueIndex * 0.05) * (1 + Math.random() * 0.1),
      })),
      energy: -15000 + Math.sin(frameIndex * 0.05) * 500 + Math.random() * 200,
      rmsd: 1.2 + Math.sin(frameIndex * 0.03) * 0.3 + Math.random() * 0.1,
      rmsf: Array.from(
        { length: data.length },
        (_, residueIndex) => 0.5 + Math.sin(residueIndex * 0.1) * 0.3 + Math.random() * 0.2,
      ),
      secondaryStructure: [
        { type: "helix" as const, start: 10, end: 25, stability: 0.8 + Math.sin(frameIndex * 0.02) * 0.2 },
        { type: "sheet" as const, start: 30, end: 45, stability: 0.9 + Math.sin(frameIndex * 0.03) * 0.1 },
        { type: "loop" as const, start: 46, end: 60, stability: 0.6 + Math.sin(frameIndex * 0.04) * 0.3 },
      ],
    })),
    energyProfile: Array.from({ length: 1000 }, (_, frameIndex) => ({
      time: frameIndex * 0.1,
      totalEnergy: -15000 + Math.sin(frameIndex * 0.05) * 500,
      kineticEnergy: 2000 + Math.sin(frameIndex * 0.08) * 300,
      potentialEnergy: -17000 + Math.sin(frameIndex * 0.05) * 400,
      temperature: 310 + Math.sin(frameIndex * 0.06) * 5,
    })),
  }

  // Simulated 3D protein structure rendering
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Set up 3D-like perspective
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const scale = zoom[0]

    // Draw protein backbone (simplified 3D representation)
    drawProteinBackbone(ctx, centerX, centerY, scale)

    // Draw domains
    if (colorScheme === "domain") {
      drawDomains(ctx, centerX, centerY, scale)
    }

    // Draw secondary structures
    if (colorScheme === "secondary") {
      drawSecondaryStructures(ctx, centerX, centerY, scale)
    }

    // Draw variants
    if (showVariants) {
      drawVariants(ctx, centerX, centerY, scale)
    }

    // Draw binding sites
    if (showBindingSites) {
      drawBindingSites(ctx, centerX, centerY, scale)
    }

    // Auto-rotation
    if (isRotating) {
      const rotationSpeed = 0.02
      setRotation((prev) => ({
        ...prev,
        y: prev.y + rotationSpeed,
      }))
    }
  }, [zoom, rotation, viewMode, colorScheme, showVariants, showBindingSites, isRotating, selectedVariant])

  const drawProteinBackbone = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, scale: number) => {
    ctx.strokeStyle = "#4A90E2"
    ctx.lineWidth = 3 * scale
    ctx.beginPath()

    // Simulate 3D protein fold with mathematical curves
    const points = 200
    for (let i = 0; i < points; i++) {
      const t = (i / points) * Math.PI * 4
      const x = centerX + Math.cos(t) * (50 + 30 * Math.sin(t * 2)) * scale
      const y = centerY + Math.sin(t) * (40 + 20 * Math.cos(t * 3)) * scale + Math.sin(t * 5) * 10 * scale
      const z = Math.sin(t * 2) * 20 * scale

      // Apply rotation
      const rotatedX = x * Math.cos(rotation.y) - z * Math.sin(rotation.y)
      const rotatedZ = x * Math.sin(rotation.y) + z * Math.cos(rotation.y)
      const finalX = rotatedX
      const finalY = y * Math.cos(rotation.x) - rotatedZ * Math.sin(rotation.x)

      if (i === 0) {
        ctx.moveTo(finalX, finalY)
      } else {
        ctx.lineTo(finalX, finalY)
      }
    }
    ctx.stroke()
  }

  const drawDomains = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, scale: number) => {
    data.domains.forEach((domain, index) => {
      const startAngle = (domain.start / data.length) * Math.PI * 4
      const endAngle = (domain.end / data.length) * Math.PI * 4

      ctx.fillStyle = domain.color + "80" // Semi-transparent
      ctx.strokeStyle = domain.color
      ctx.lineWidth = 2 * scale

      // Draw domain as a highlighted region
      for (let angle = startAngle; angle <= endAngle; angle += 0.1) {
        const x = centerX + Math.cos(angle) * (50 + 30 * Math.sin(angle * 2)) * scale
        const y = centerY + Math.sin(angle) * (40 + 20 * Math.cos(angle * 3)) * scale
        const z = Math.sin(angle * 2) * 20 * scale

        // Apply rotation
        const rotatedX = x * Math.cos(rotation.y) - z * Math.sin(rotation.y)
        const rotatedZ = x * Math.sin(rotation.y) + z * Math.cos(rotation.y)
        const finalX = rotatedX
        const finalY = y * Math.cos(rotation.x) - rotatedZ * Math.sin(rotation.x)

        ctx.beginPath()
        ctx.arc(finalX, finalY, 4 * scale, 0, Math.PI * 2)
        ctx.fill()
      }
    })
  }

  const drawSecondaryStructures = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, scale: number) => {
    data.secondaryStructure.forEach((structure) => {
      const startAngle = (structure.start / data.length) * Math.PI * 4
      const endAngle = (structure.end / data.length) * Math.PI * 4

      let color = "#4A90E2"
      if (structure.type === "helix") color = "#FF6B6B"
      if (structure.type === "sheet") color = "#32CD32"
      if (structure.type === "loop") color = "#FFB347"

      ctx.strokeStyle = color
      ctx.lineWidth = 6 * scale
      ctx.beginPath()

      for (let angle = startAngle; angle <= endAngle; angle += 0.05) {
        const x = centerX + Math.cos(angle) * (50 + 30 * Math.sin(angle * 2)) * scale
        const y = centerY + Math.sin(angle) * (40 + 20 * Math.cos(angle * 3)) * scale
        const z = Math.sin(angle * 2) * 20 * scale

        // Apply rotation
        const rotatedX = x * Math.cos(rotation.y) - z * Math.sin(rotation.y)
        const rotatedZ = x * Math.sin(rotation.y) + z * Math.cos(rotation.y)
        const finalX = rotatedX
        const finalY = y * Math.cos(rotation.x) - rotatedZ * Math.sin(rotation.x)

        if (angle === startAngle) {
          ctx.moveTo(finalX, finalY)
        } else {
          ctx.lineTo(finalX, finalY)
        }
      }
      ctx.stroke()
    })
  }

  const drawVariants = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, scale: number) => {
    data.variants.forEach((variant, index) => {
      const angle = (variant.position / data.length) * Math.PI * 4
      const x = centerX + Math.cos(angle) * (50 + 30 * Math.sin(angle * 2)) * scale
      const y = centerY + Math.sin(angle) * (40 + 20 * Math.cos(angle * 3)) * scale
      const z = Math.sin(angle * 2) * 20 * scale

      // Apply rotation
      const rotatedX = x * Math.cos(rotation.y) - z * Math.sin(rotation.y)
      const rotatedZ = x * Math.sin(rotation.y) + z * Math.cos(rotation.y)
      const finalX = rotatedX
      const finalY = y * Math.cos(rotation.x) - rotatedZ * Math.sin(rotation.x)

      // Color based on impact
      let color = "#2E8B57" // Low impact
      if (variant.impact === "Moderate") color = "#FF8C00"
      if (variant.impact === "High") color = "#DC143C"

      const isSelected = selectedVariant === index
      const radius = isSelected ? 8 * scale : 5 * scale

      ctx.fillStyle = color
      ctx.strokeStyle = isSelected ? "#000" : color
      ctx.lineWidth = isSelected ? 3 : 1

      ctx.beginPath()
      ctx.arc(finalX, finalY, radius, 0, Math.PI * 2)
      ctx.fill()
      ctx.stroke()

      // Draw variant label for selected variant
      if (isSelected) {
        ctx.fillStyle = "#000"
        ctx.font = `${12 * scale}px Arial`
        ctx.textAlign = "center"
        ctx.fillText(`${variant.wildType}${variant.position}${variant.mutant}`, finalX, finalY - 15 * scale)
      }
    })
  }

  const drawBindingSites = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, scale: number) => {
    data.bindingSites.forEach((site, index) => {
      site.residues.forEach((residue) => {
        const angle = (residue / data.length) * Math.PI * 4
        const x = centerX + Math.cos(angle) * (50 + 30 * Math.sin(angle * 2)) * scale
        const y = centerY + Math.sin(angle) * (40 + 20 * Math.cos(angle * 3)) * scale
        const z = Math.sin(angle * 2) * 20 * scale

        // Apply rotation
        const rotatedX = x * Math.cos(rotation.y) - z * Math.sin(rotation.y)
        const rotatedZ = x * Math.sin(rotation.y) + z * Math.cos(rotation.y)
        const finalX = rotatedX
        const finalY = y * Math.cos(rotation.x) - rotatedZ * Math.sin(rotation.x)

        ctx.fillStyle = "#9370DB80" // Purple, semi-transparent
        ctx.strokeStyle = "#9370DB"
        ctx.lineWidth = 2

        ctx.beginPath()
        ctx.arc(finalX, finalY, 3 * scale, 0, Math.PI * 2)
        ctx.fill()
        ctx.stroke()
      })
    })
  }

  const handleVariantClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    // Find closest variant (simplified hit detection)
    let closestVariant = null
    let minDistance = Number.POSITIVE_INFINITY

    data.variants.forEach((variant, index) => {
      const angle = (variant.position / data.length) * Math.PI * 4
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2
      const scale = zoom[0]

      const variantX = centerX + Math.cos(angle) * (50 + 30 * Math.sin(angle * 2)) * scale
      const variantY = centerY + Math.sin(angle) * (40 + 20 * Math.cos(angle * 3)) * scale

      const distance = Math.sqrt((x - variantX) ** 2 + (y - variantY) ** 2)
      if (distance < 20 && distance < minDistance) {
        minDistance = distance
        closestVariant = index
      }
    })

    setSelectedVariant(closestVariant)
  }

  const resetView = () => {
    setZoom([1])
    setRotation({ x: 0, y: 0, z: 0 })
    setSelectedVariant(null)
    setIsRotating(false)
  }

  const getImpactColor = (impact: string) => {
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

  const getPathogenicityColor = (pathogenicity: string) => {
    switch (pathogenicity) {
      case "Pathogenic":
        return "#DC143C"
      case "Likely Pathogenic":
        return "#FF6B6B"
      case "VUS":
        return "#FFB347"
      case "Benign":
        return "#2E8B57"
      default:
        return "#808080"
    }
  }

  return (
    <TooltipProvider>
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">3D Protein Structure: {data.name}</CardTitle>
              <CardDescription>
                Interactive 3D visualization showing variant impact on protein structure (PDB: {data.pdbId})
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsRotating(!isRotating)}
                className={isRotating ? "bg-[#1E90FF] text-white" : ""}
              >
                {isRotating ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              <Button variant="outline" size="sm" onClick={resetView}>
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="structure" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="structure">3D Structure</TabsTrigger>
              <TabsTrigger value="dynamics">Dynamics</TabsTrigger>
              <TabsTrigger value="variants">Variant Analysis</TabsTrigger>
              <TabsTrigger value="domains">Protein Domains</TabsTrigger>
              <TabsTrigger value="binding">Binding Sites</TabsTrigger>
            </TabsList>

            <TabsContent value="structure" className="space-y-6">
              {/* Controls */}
              <div className="grid md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">View Mode</label>
                  <Select value={viewMode} onValueChange={(value: any) => setViewMode(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cartoon">Cartoon</SelectItem>
                      <SelectItem value="surface">Surface</SelectItem>
                      <SelectItem value="ball-stick">Ball & Stick</SelectItem>
                      <SelectItem value="ribbon">Ribbon</SelectItem>
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
                      <SelectItem value="domain">By Domain</SelectItem>
                      <SelectItem value="secondary">Secondary Structure</SelectItem>
                      <SelectItem value="hydrophobicity">Hydrophobicity</SelectItem>
                      <SelectItem value="charge">Charge</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Zoom Level</label>
                  <Slider value={zoom} onValueChange={setZoom} min={0.5} max={3} step={0.1} className="w-full" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Display Options</label>
                  <div className="flex gap-2">
                    <Button
                      variant={showVariants ? "default" : "outline"}
                      size="sm"
                      onClick={() => setShowVariants(!showVariants)}
                    >
                      {showVariants ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                      Variants
                    </Button>
                    <Button
                      variant={showBindingSites ? "default" : "outline"}
                      size="sm"
                      onClick={() => setShowBindingSites(!showBindingSites)}
                    >
                      {showBindingSites ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                      Sites
                    </Button>
                  </div>
                </div>
              </div>

              {/* 3D Viewer */}
              <div className="relative">
                <canvas
                  ref={canvasRef}
                  width={800}
                  height={500}
                  className="border rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 cursor-pointer"
                  onClick={handleVariantClick}
                />

                {/* Rotation Controls */}
                <div className="absolute top-4 right-4 space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setRotation((prev) => ({ ...prev, x: prev.x + 0.2 }))}
                  >
                    <RotateCw className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setRotation((prev) => ({ ...prev, y: prev.y + 0.2 }))}
                  >
                    <RotateCw className="h-4 w-4 rotate-90" />
                  </Button>
                </div>

                {/* Legend */}
                <div className="absolute bottom-4 left-4 bg-white/90 p-3 rounded-lg border">
                  <h5 className="text-sm font-medium mb-2">Legend</h5>
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-[#DC143C] rounded-full" />
                      <span>High Impact Variant</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-[#FF8C00] rounded-full" />
                      <span>Moderate Impact</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-[#2E8B57] rounded-full" />
                      <span>Low Impact</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-[#9370DB] rounded-full" />
                      <span>Binding Site</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Selected Variant Details */}
              {selectedVariant !== null && (
                <div className="p-4 rounded-lg bg-[#F5F7FA] border">
                  <h4 className="font-medium text-[#4A4A4A] mb-3">
                    Variant Details: {data.variants[selectedVariant].wildType}
                    {data.variants[selectedVariant].position}
                    {data.variants[selectedVariant].mutant}
                  </h4>
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-[#4A4A4A]/70">Impact:</span>
                      <Badge
                        style={{
                          backgroundColor: getImpactColor(data.variants[selectedVariant].impact),
                          color: "white",
                        }}
                        className="ml-2"
                      >
                        {data.variants[selectedVariant].impact}
                      </Badge>
                    </div>
                    <div>
                      <span className="text-[#4A4A4A]/70">Pathogenicity:</span>
                      <Badge
                        style={{
                          backgroundColor: getPathogenicityColor(data.variants[selectedVariant].pathogenicity),
                          color: "white",
                        }}
                        className="ml-2"
                      >
                        {data.variants[selectedVariant].pathogenicity}
                      </Badge>
                    </div>
                    <div>
                      <span className="text-[#4A4A4A]/70">Consequence:</span>
                      <p className="font-medium">{data.variants[selectedVariant].consequence}</p>
                    </div>
                    <div>
                      <span className="text-[#4A4A4A]/70">Structural Effect:</span>
                      <p className="font-medium">{data.variants[selectedVariant].structuralEffect}</p>
                    </div>
                    <div>
                      <span className="text-[#4A4A4A]/70">Stability Change:</span>
                      <p className="font-medium">
                        {data.variants[selectedVariant].stabilityChange > 0 ? "+" : ""}
                        {data.variants[selectedVariant].stabilityChange.toFixed(2)} kcal/mol
                      </p>
                    </div>
                    <div>
                      <span className="text-[#4A4A4A]/70">Binding Affinity:</span>
                      <p className="font-medium">
                        {data.variants[selectedVariant].bindingAffinity > 0 ? "+" : ""}
                        {data.variants[selectedVariant].bindingAffinity.toFixed(1)}x fold change
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="dynamics" className="space-y-6">
              <MolecularDynamicsViewer data={molecularDynamicsData} showComparison={false} />
            </TabsContent>

            <TabsContent value="variants" className="space-y-4">
              <div className="space-y-4">
                <h4 className="font-medium text-[#4A4A4A]">Structural Variant Analysis</h4>
                <div className="space-y-3">
                  {data.variants.map((variant, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border cursor-pointer transition-all ${
                        selectedVariant === index ? "ring-2 ring-[#1E90FF] bg-[#1E90FF]/5" : "bg-white hover:bg-gray-50"
                      }`}
                      onClick={() => setSelectedVariant(selectedVariant === index ? null : index)}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: getImpactColor(variant.impact) }}
                          />
                          <span className="font-medium">
                            {variant.wildType}
                            {variant.position}
                            {variant.mutant}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <Badge
                            style={{
                              backgroundColor: getImpactColor(variant.impact),
                              color: "white",
                            }}
                          >
                            {variant.impact} Impact
                          </Badge>
                          <Badge
                            style={{
                              backgroundColor: getPathogenicityColor(variant.pathogenicity),
                              color: "white",
                            }}
                          >
                            {variant.pathogenicity}
                          </Badge>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-[#4A4A4A]/70">Consequence:</span>
                          <p className="font-medium">{variant.consequence}</p>
                        </div>
                        <div>
                          <span className="text-[#4A4A4A]/70">Structural Effect:</span>
                          <p className="font-medium">{variant.structuralEffect}</p>
                        </div>
                        <div>
                          <span className="text-[#4A4A4A]/70">Stability Change:</span>
                          <p
                            className={`font-medium ${
                              variant.stabilityChange < -1
                                ? "text-[#DC143C]"
                                : variant.stabilityChange > 1
                                  ? "text-[#2E8B57]"
                                  : "text-[#FF8C00]"
                            }`}
                          >
                            {variant.stabilityChange > 0 ? "+" : ""}
                            {variant.stabilityChange.toFixed(2)} kcal/mol
                          </p>
                        </div>
                        <div>
                          <span className="text-[#4A4A4A]/70">Binding Affinity:</span>
                          <p
                            className={`font-medium ${
                              Math.abs(variant.bindingAffinity) > 2
                                ? "text-[#DC143C]"
                                : Math.abs(variant.bindingAffinity) > 1
                                  ? "text-[#FF8C00]"
                                  : "text-[#2E8B57]"
                            }`}
                          >
                            {variant.bindingAffinity > 0 ? "+" : ""}
                            {variant.bindingAffinity.toFixed(1)}x fold change
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="domains" className="space-y-4">
              <div className="space-y-4">
                <h4 className="font-medium text-[#4A4A4A]">Protein Domain Architecture</h4>
                <div className="space-y-3">
                  {data.domains.map((domain, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border cursor-pointer transition-all ${
                        selectedDomain === domain.name
                          ? "ring-2 ring-[#1E90FF] bg-[#1E90FF]/5"
                          : "bg-white hover:bg-gray-50"
                      }`}
                      onClick={() => setSelectedDomain(selectedDomain === domain.name ? null : domain.name)}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 rounded" style={{ backgroundColor: domain.color }} />
                          <span className="font-medium">{domain.name}</span>
                        </div>
                        <Badge variant="outline">{domain.type}</Badge>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-[#4A4A4A]/70">Position:</span>
                          <p className="font-medium">
                            {domain.start} - {domain.end}
                          </p>
                        </div>
                        <div>
                          <span className="text-[#4A4A4A]/70">Length:</span>
                          <p className="font-medium">{domain.end - domain.start + 1} residues</p>
                        </div>
                        <div className="md:col-span-2">
                          <span className="text-[#4A4A4A]/70">Function:</span>
                          <p className="font-medium">{domain.function}</p>
                        </div>
                      </div>

                      {/* Domain-specific variants */}
                      <div className="mt-3 pt-3 border-t">
                        <span className="text-[#4A4A4A]/70 text-sm">Variants in this domain:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {data.variants
                            .filter((variant) => variant.position >= domain.start && variant.position <= domain.end)
                            .map((variant, vIndex) => (
                              <Badge
                                key={vIndex}
                                style={{
                                  backgroundColor: getImpactColor(variant.impact),
                                  color: "white",
                                }}
                                className="text-xs"
                              >
                                {variant.wildType}
                                {variant.position}
                                {variant.mutant}
                              </Badge>
                            ))}
                          {data.variants.filter(
                            (variant) => variant.position >= domain.start && variant.position <= domain.end,
                          ).length === 0 && <span className="text-xs text-[#4A4A4A]/50">No variants</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="binding" className="space-y-4">
              <div className="space-y-4">
                <h4 className="font-medium text-[#4A4A4A]">Binding Sites & Functional Regions</h4>
                <div className="space-y-3">
                  {data.bindingSites.map((site, index) => (
                    <div key={index} className="p-4 rounded-lg border bg-white">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 bg-[#9370DB] rounded-full" />
                          <span className="font-medium">{site.name}</span>
                        </div>
                        <Badge variant="outline">{site.ligand}</Badge>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4 text-sm mb-3">
                        <div>
                          <span className="text-[#4A4A4A]/70">Residues:</span>
                          <p className="font-medium">{site.residues.join(", ")}</p>
                        </div>
                        <div>
                          <span className="text-[#4A4A4A]/70">Function:</span>
                          <p className="font-medium">{site.function}</p>
                        </div>
                      </div>

                      {/* Binding site variants */}
                      <div className="pt-3 border-t">
                        <span className="text-[#4A4A4A]/70 text-sm">Variants affecting this site:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {data.variants
                            .filter((variant) => site.residues.includes(variant.position))
                            .map((variant, vIndex) => (
                              <Badge
                                key={vIndex}
                                style={{
                                  backgroundColor: getImpactColor(variant.impact),
                                  color: "white",
                                }}
                                className="text-xs"
                              >
                                {variant.wildType}
                                {variant.position}
                                {variant.mutant}
                              </Badge>
                            ))}
                          {data.variants.filter((variant) => site.residues.includes(variant.position)).length === 0 && (
                            <span className="text-xs text-[#4A4A4A]/50">No variants</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </TooltipProvider>
  )
}
