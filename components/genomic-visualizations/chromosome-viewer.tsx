"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ZoomIn, ZoomOut, RotateCcw, Info, AlertTriangle, CheckCircle } from "lucide-react"

interface ChromosomeData {
  chromosome: string
  length: number
  variants: Array<{
    position: number
    gene: string
    variant: string
    classification: "Pathogenic" | "Likely Pathogenic" | "VUS" | "Likely Benign" | "Benign"
    condition: string
    risk: "High" | "Moderate" | "Low"
  }>
  genes: Array<{
    name: string
    start: number
    end: number
    strand: "+" | "-"
    function: string
  }>
}

interface ChromosomeViewerProps {
  data: ChromosomeData
  selectedChromosome?: string
  onChromosomeSelect?: (chromosome: string) => void
}

export function ChromosomeViewer({ data, selectedChromosome, onChromosomeSelect }: ChromosomeViewerProps) {
  const [zoomLevel, setZoomLevel] = useState(1)
  const [selectedVariant, setSelectedVariant] = useState<number | null>(null)
  const [viewMode, setViewMode] = useState<"overview" | "detailed">("overview")

  const chromosomes = Array.from({ length: 22 }, (_, i) => (i + 1).toString()).concat(["X", "Y"])

  const getVariantColor = (classification: string) => {
    switch (classification) {
      case "Pathogenic":
        return "#DC143C"
      case "Likely Pathogenic":
        return "#FF6B6B"
      case "VUS":
        return "#FFB347"
      case "Likely Benign":
        return "#90EE90"
      case "Benign":
        return "#2E8B57"
      default:
        return "#808080"
    }
  }

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case "High":
        return <AlertTriangle className="h-3 w-3 text-[#DC143C]" />
      case "Moderate":
        return <Info className="h-3 w-3 text-[#FF8C00]" />
      case "Low":
        return <CheckCircle className="h-3 w-3 text-[#2E8B57]" />
      default:
        return null
    }
  }

  const handleZoomIn = () => setZoomLevel(Math.min(zoomLevel * 1.5, 5))
  const handleZoomOut = () => setZoomLevel(Math.max(zoomLevel / 1.5, 0.5))
  const handleReset = () => {
    setZoomLevel(1)
    setSelectedVariant(null)
    setViewMode("overview")
  }

  return (
    <TooltipProvider>
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">Chromosome {data.chromosome} Visualization</CardTitle>
              <CardDescription>Interactive genomic visualization showing variants and gene locations</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleZoomOut} disabled={zoomLevel <= 0.5}>
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleZoomIn} disabled={zoomLevel >= 5}>
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleReset}>
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Chromosome Selector */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-[#4A4A4A]">Select Chromosome</h4>
            <div className="flex flex-wrap gap-2">
              {chromosomes.map((chr) => (
                <Button
                  key={chr}
                  variant={selectedChromosome === chr ? "default" : "outline"}
                  size="sm"
                  onClick={() => onChromosomeSelect?.(chr)}
                  className={`${
                    selectedChromosome === chr
                      ? "bg-[#1E90FF] text-white"
                      : "border-[#1E90FF] text-[#1E90FF] hover:bg-[#1E90FF]/10"
                  }`}
                >
                  {chr}
                </Button>
              ))}
            </div>
          </div>

          {/* Chromosome Visualization */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-[#4A4A4A]">
                Chromosome {data.chromosome} ({(data.length / 1000000).toFixed(1)} Mb)
              </h4>
              <div className="flex gap-2">
                <Button
                  variant={viewMode === "overview" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("overview")}
                >
                  Overview
                </Button>
                <Button
                  variant={viewMode === "detailed" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("detailed")}
                >
                  Detailed
                </Button>
              </div>
            </div>

            {/* Chromosome SVG Visualization */}
            <div className="relative overflow-x-auto">
              <svg
                width={800 * zoomLevel}
                height={viewMode === "overview" ? 120 : 200}
                className="border rounded-lg bg-white"
              >
                {/* Chromosome backbone */}
                <rect
                  x={50}
                  y={viewMode === "overview" ? 50 : 80}
                  width={700}
                  height={20}
                  fill="#E5E7EB"
                  stroke="#9CA3AF"
                  strokeWidth={1}
                  rx={10}
                />

                {/* Centromere */}
                <rect x={350} y={viewMode === "overview" ? 45 : 75} width={10} height={30} fill="#6B7280" rx={5} />

                {/* Gene regions (simplified) */}
                {viewMode === "detailed" &&
                  data.genes.slice(0, 10).map((gene, index) => {
                    const x = 50 + (gene.start / data.length) * 700
                    const width = Math.max(((gene.end - gene.start) / data.length) * 700, 2)
                    return (
                      <Tooltip key={gene.name}>
                        <TooltipTrigger>
                          <rect
                            x={x}
                            y={gene.strand === "+" ? 40 : 110}
                            width={width}
                            height={8}
                            fill="#3B82F6"
                            opacity={0.7}
                            className="cursor-pointer hover:opacity-1"
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="text-xs">
                            <p className="font-medium">{gene.name}</p>
                            <p>
                              Position: {gene.start.toLocaleString()} - {gene.end.toLocaleString()}
                            </p>
                            <p>Strand: {gene.strand}</p>
                            <p>Function: {gene.function}</p>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    )
                  })}

                {/* Variants */}
                {data.variants.map((variant, index) => {
                  const x = 50 + (variant.position / data.length) * 700
                  const isSelected = selectedVariant === index
                  return (
                    <Tooltip key={index}>
                      <TooltipTrigger>
                        <g>
                          <circle
                            cx={x}
                            cy={viewMode === "overview" ? 60 : 90}
                            r={isSelected ? 8 : 5}
                            fill={getVariantColor(variant.classification)}
                            stroke={isSelected ? "#000" : "none"}
                            strokeWidth={isSelected ? 2 : 0}
                            className="cursor-pointer hover:stroke-black hover:stroke-2"
                            onClick={() => setSelectedVariant(isSelected ? null : index)}
                          />
                          {/* Variant line */}
                          <line
                            x1={x}
                            y1={viewMode === "overview" ? 70 : 100}
                            x2={x}
                            y2={viewMode === "overview" ? 85 : 130}
                            stroke={getVariantColor(variant.classification)}
                            strokeWidth={2}
                          />
                        </g>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="text-xs space-y-1">
                          <p className="font-medium">{variant.gene}</p>
                          <p>Variant: {variant.variant}</p>
                          <p>Position: {variant.position.toLocaleString()}</p>
                          <p>Classification: {variant.classification}</p>
                          <p>Condition: {variant.condition}</p>
                          <div className="flex items-center gap-1">
                            {getRiskIcon(variant.risk)}
                            <span>Risk: {variant.risk}</span>
                          </div>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  )
                })}

                {/* Scale markers */}
                {Array.from({ length: 11 }, (_, i) => {
                  const x = 50 + i * 70
                  const position = (i * data.length) / 10
                  return (
                    <g key={i}>
                      <line
                        x1={x}
                        y1={viewMode === "overview" ? 85 : 130}
                        x2={x}
                        y2={viewMode === "overview" ? 95 : 140}
                        stroke="#6B7280"
                        strokeWidth={1}
                      />
                      <text
                        x={x}
                        y={viewMode === "overview" ? 110 : 155}
                        textAnchor="middle"
                        fontSize="10"
                        fill="#6B7280"
                      >
                        {(position / 1000000).toFixed(0)}M
                      </text>
                    </g>
                  )
                })}
              </svg>
            </div>
          </div>

          {/* Legend */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-[#4A4A4A]">Variant Classification Legend</h4>
            <div className="flex flex-wrap gap-4">
              {[
                { label: "Pathogenic", color: "#DC143C" },
                { label: "Likely Pathogenic", color: "#FF6B6B" },
                { label: "VUS", color: "#FFB347" },
                { label: "Likely Benign", color: "#90EE90" },
                { label: "Benign", color: "#2E8B57" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs text-[#4A4A4A]">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Selected Variant Details */}
          {selectedVariant !== null && (
            <div className="p-4 rounded-lg bg-[#F5F7FA] border">
              <h4 className="font-medium text-[#4A4A4A] mb-3">Variant Details</h4>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-[#4A4A4A]/70">Gene:</span>
                  <p className="font-medium">{data.variants[selectedVariant].gene}</p>
                </div>
                <div>
                  <span className="text-[#4A4A4A]/70">Variant:</span>
                  <p className="font-medium">{data.variants[selectedVariant].variant}</p>
                </div>
                <div>
                  <span className="text-[#4A4A4A]/70">Position:</span>
                  <p className="font-medium">{data.variants[selectedVariant].position.toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-[#4A4A4A]/70">Classification:</span>
                  <Badge
                    style={{
                      backgroundColor: getVariantColor(data.variants[selectedVariant].classification),
                      color: "white",
                    }}
                  >
                    {data.variants[selectedVariant].classification}
                  </Badge>
                </div>
                <div>
                  <span className="text-[#4A4A4A]/70">Associated Condition:</span>
                  <p className="font-medium">{data.variants[selectedVariant].condition}</p>
                </div>
                <div>
                  <span className="text-[#4A4A4A]/70">Risk Level:</span>
                  <div className="flex items-center gap-1">
                    {getRiskIcon(data.variants[selectedVariant].risk)}
                    <span className="font-medium">{data.variants[selectedVariant].risk}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </TooltipProvider>
  )
}
