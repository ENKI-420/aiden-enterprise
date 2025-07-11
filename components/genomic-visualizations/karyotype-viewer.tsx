"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { RotateCcw, Download } from "lucide-react"

interface KaryotypeData {
  chromosomes: Array<{
    name: string
    length: number
    bands: Array<{
      name: string
      start: number
      end: number
      stain: "gneg" | "gpos25" | "gpos50" | "gpos75" | "gpos100" | "acen" | "gvar" | "stalk"
    }>
    variants: Array<{
      position: number
      type: "CNV" | "Translocation" | "Inversion" | "Deletion" | "Duplication"
      size?: number
      significance: "Pathogenic" | "Likely Pathogenic" | "VUS" | "Benign"
    }>
  }>
}

interface KaryotypeViewerProps {
  data: KaryotypeData
  patientSex: "Male" | "Female"
}

export function KaryotypeViewer({ data, patientSex }: KaryotypeViewerProps) {
  const [selectedChromosome, setSelectedChromosome] = useState<string | null>(null)
  const [highlightVariants, setHighlightVariants] = useState(true)

  const getBandColor = (stain: string) => {
    switch (stain) {
      case "gneg":
        return "#FFFFFF"
      case "gpos25":
        return "#E5E5E5"
      case "gpos50":
        return "#CCCCCC"
      case "gpos75":
        return "#999999"
      case "gpos100":
        return "#666666"
      case "acen":
        return "#FF6B6B"
      case "gvar":
        return "#87CEEB"
      case "stalk":
        return "#DDA0DD"
      default:
        return "#FFFFFF"
    }
  }

  const getVariantColor = (significance: string) => {
    switch (significance) {
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

  const getVariantSymbol = (type: string) => {
    switch (type) {
      case "CNV":
        return "◆"
      case "Translocation":
        return "⟷"
      case "Inversion":
        return "⟲"
      case "Deletion":
        return "−"
      case "Duplication":
        return "+"
      default:
        return "●"
    }
  }

  const chromosomeOrder = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
    "13",
    "14",
    "15",
    "16",
    "17",
    "18",
    "19",
    "20",
    "21",
    "22",
    "X",
    "Y",
  ]

  const displayedChromosomes = patientSex === "Female" ? chromosomeOrder.filter((chr) => chr !== "Y") : chromosomeOrder

  const reset = () => {
    setSelectedChromosome(null)
    setHighlightVariants(true)
  }

  return (
    <TooltipProvider>
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Karyotype Analysis</CardTitle>
              <CardDescription>
                Chromosomal overview showing structural variants and copy number changes
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={highlightVariants ? "default" : "outline"}
                size="sm"
                onClick={() => setHighlightVariants(!highlightVariants)}
              >
                {highlightVariants ? "Hide" : "Show"} Variants
              </Button>
              <Button variant="outline" size="sm" onClick={reset}>
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Karyotype Grid */}
          <div className="grid grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-4">
            {displayedChromosomes.map((chrName) => {
              const chromosome = data.chromosomes.find((chr) => chr.name === chrName)
              if (!chromosome) return null

              const isSelected = selectedChromosome === chrName
              const hasVariants = chromosome.variants.length > 0

              return (
                <div key={chrName} className="flex flex-col items-center space-y-2">
                  <div
                    className={`relative cursor-pointer transition-all ${
                      isSelected ? "ring-2 ring-[#1E90FF] scale-110" : ""
                    }`}
                    onClick={() => setSelectedChromosome(isSelected ? null : chrName)}
                  >
                    <svg width={40} height={120} className="border rounded">
                      {/* Chromosome outline */}
                      <rect x={5} y={10} width={30} height={100} fill="none" stroke="#333" strokeWidth={1} rx={15} />

                      {/* Chromosome bands */}
                      {chromosome.bands.map((band, index) => {
                        const bandHeight = ((band.end - band.start) / chromosome.length) * 100
                        const bandY = 10 + (band.start / chromosome.length) * 100

                        return (
                          <Tooltip key={band.name}>
                            <TooltipTrigger>
                              <rect
                                x={6}
                                y={bandY}
                                width={28}
                                height={Math.max(bandHeight, 1)}
                                fill={getBandColor(band.stain)}
                                stroke="#333"
                                strokeWidth={0.5}
                                className="cursor-pointer hover:opacity-80"
                              />
                            </TooltipTrigger>
                            <TooltipContent>
                              <div className="text-xs">
                                <p className="font-medium">
                                  {chrName}
                                  {band.name}
                                </p>
                                <p>
                                  Position: {band.start.toLocaleString()} - {band.end.toLocaleString()}
                                </p>
                                <p>Stain: {band.stain}</p>
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        )
                      })}

                      {/* Centromere */}
                      <ellipse cx={20} cy={60} rx={18} ry={8} fill="none" stroke="#333" strokeWidth={2} />

                      {/* Variants */}
                      {highlightVariants &&
                        chromosome.variants.map((variant, index) => {
                          const variantY = 10 + (variant.position / chromosome.length) * 100

                          return (
                            <Tooltip key={index}>
                              <TooltipTrigger>
                                <g>
                                  <circle
                                    cx={38}
                                    cy={variantY}
                                    r={3}
                                    fill={getVariantColor(variant.significance)}
                                    stroke="#fff"
                                    strokeWidth={1}
                                    className="cursor-pointer"
                                  />
                                  <text x={38} y={variantY + 1} textAnchor="middle" fontSize="6" fill="white">
                                    {getVariantSymbol(variant.type)}
                                  </text>
                                </g>
                              </TooltipTrigger>
                              <TooltipContent>
                                <div className="text-xs space-y-1">
                                  <p className="font-medium">{variant.type}</p>
                                  <p>Position: {variant.position.toLocaleString()}</p>
                                  {variant.size && <p>Size: {variant.size.toLocaleString()} bp</p>}
                                  <p>Significance: {variant.significance}</p>
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          )
                        })}
                    </svg>

                    {/* Variant indicator */}
                    {hasVariants && highlightVariants && (
                      <div className="absolute -top-1 -right-1">
                        <div className="w-3 h-3 bg-[#DC143C] rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">{chromosome.variants.length}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Chromosome label */}
                  <div className="text-center">
                    <p className="text-sm font-medium text-[#4A4A4A]">{chrName}</p>
                    <p className="text-xs text-[#4A4A4A]/70">{(chromosome.length / 1000000).toFixed(0)}Mb</p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Selected Chromosome Details */}
          {selectedChromosome && (
            <div className="space-y-4">
              <h4 className="font-medium text-[#4A4A4A]">Chromosome {selectedChromosome} Details</h4>

              {(() => {
                const chromosome = data.chromosomes.find((chr) => chr.name === selectedChromosome)
                if (!chromosome) return null

                return (
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Chromosome Info */}
                    <div className="space-y-3">
                      <div className="p-3 rounded-lg bg-[#F5F7FA] border">
                        <h5 className="font-medium text-[#4A4A4A] mb-2">Chromosome Information</h5>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-[#4A4A4A]/70">Length:</span>
                            <span>{chromosome.length.toLocaleString()} bp</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[#4A4A4A]/70">Bands:</span>
                            <span>{chromosome.bands.length}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[#4A4A4A]/70">Variants:</span>
                            <span>{chromosome.variants.length}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Variants List */}
                    <div className="space-y-3">
                      <h5 className="font-medium text-[#4A4A4A]">Structural Variants</h5>
                      {chromosome.variants.length > 0 ? (
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                          {chromosome.variants.map((variant, index) => (
                            <div key={index} className="p-2 rounded border bg-white">
                              <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-lg">{getVariantSymbol(variant.type)}</span>
                                  <span className="font-medium text-sm">{variant.type}</span>
                                </div>
                                <Badge
                                  style={{
                                    backgroundColor: getVariantColor(variant.significance),
                                    color: "white",
                                  }}
                                  className="text-xs"
                                >
                                  {variant.significance}
                                </Badge>
                              </div>
                              <div className="text-xs text-[#4A4A4A]/70">
                                Position: {variant.position.toLocaleString()}
                                {variant.size && ` | Size: ${variant.size.toLocaleString()} bp`}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-[#4A4A4A]/70">No structural variants detected</p>
                      )}
                    </div>
                  </div>
                )
              })()}
            </div>
          )}

          {/* Legend */}
          <div className="space-y-4">
            <h4 className="font-medium text-[#4A4A4A]">Legend</h4>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Band Staining */}
              <div className="space-y-2">
                <h5 className="text-sm font-medium text-[#4A4A4A]">Chromosome Bands</h5>
                <div className="space-y-1">
                  {[
                    { label: "Negative (gneg)", color: "#FFFFFF", border: true },
                    { label: "Positive 25% (gpos25)", color: "#E5E5E5" },
                    { label: "Positive 50% (gpos50)", color: "#CCCCCC" },
                    { label: "Positive 75% (gpos75)", color: "#999999" },
                    { label: "Positive 100% (gpos100)", color: "#666666" },
                    { label: "Centromere (acen)", color: "#FF6B6B" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-2">
                      <div
                        className={`w-4 h-3 ${item.border ? "border border-gray-300" : ""}`}
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-xs">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Variant Types */}
              <div className="space-y-2">
                <h5 className="text-sm font-medium text-[#4A4A4A]">Variant Types</h5>
                <div className="space-y-1">
                  {[
                    { label: "Copy Number Variant", symbol: "◆" },
                    { label: "Translocation", symbol: "⟷" },
                    { label: "Inversion", symbol: "⟲" },
                    { label: "Deletion", symbol: "−" },
                    { label: "Duplication", symbol: "+" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-2">
                      <span className="text-lg w-4 text-center">{item.symbol}</span>
                      <span className="text-xs">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Clinical Significance */}
              <div className="space-y-2">
                <h5 className="text-sm font-medium text-[#4A4A4A]">Clinical Significance</h5>
                <div className="space-y-1">
                  {[
                    { label: "Pathogenic", color: "#DC143C" },
                    { label: "Likely Pathogenic", color: "#FF6B6B" },
                    { label: "VUS", color: "#FFB347" },
                    { label: "Benign", color: "#2E8B57" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-xs">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Summary Statistics */}
          <div className="p-4 rounded-lg bg-[#F5F7FA] border">
            <h4 className="font-medium text-[#4A4A4A] mb-3">Karyotype Summary</h4>
            <div className="grid md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-[#1E90FF]">
                  {data.chromosomes.reduce((sum, chr) => sum + chr.variants.length, 0)}
                </div>
                <div className="text-sm text-[#4A4A4A]/70">Total Variants</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-[#DC143C]">
                  {data.chromosomes.reduce(
                    (sum, chr) => sum + chr.variants.filter((v) => v.significance === "Pathogenic").length,
                    0,
                  )}
                </div>
                <div className="text-sm text-[#4A4A4A]/70">Pathogenic</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-[#FF8C00]">
                  {data.chromosomes.reduce(
                    (sum, chr) => sum + chr.variants.filter((v) => v.significance === "VUS").length,
                    0,
                  )}
                </div>
                <div className="text-sm text-[#4A4A4A]/70">VUS</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-[#2E8B57]">
                  {data.chromosomes.reduce(
                    (sum, chr) => sum + chr.variants.filter((v) => v.significance === "Benign").length,
                    0,
                  )}
                </div>
                <div className="text-sm text-[#4A4A4A]/70">Benign</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  )
}
