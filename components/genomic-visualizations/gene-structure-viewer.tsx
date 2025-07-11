"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ZoomIn, ZoomOut, RotateCcw, Download, Share2 } from "lucide-react"

interface GeneData {
  name: string
  chromosome: string
  start: number
  end: number
  strand: "+" | "-"
  transcripts: Array<{
    id: string
    name: string
    exons: Array<{
      number: number
      start: number
      end: number
      type: "coding" | "non-coding"
    }>
    variants: Array<{
      position: number
      type: "SNV" | "Insertion" | "Deletion" | "CNV"
      consequence: string
      impact: "High" | "Moderate" | "Low" | "Modifier"
      aminoAcid?: string
    }>
  }>
  function: string
  pathways: string[]
  diseases: string[]
}

interface GeneStructureViewerProps {
  data: GeneData
}

export function GeneStructureViewer({ data }: GeneStructureViewerProps) {
  const [selectedTranscript, setSelectedTranscript] = useState(0)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [selectedVariant, setSelectedVariant] = useState<number | null>(null)

  const transcript = data.transcripts[selectedTranscript]
  const geneLength = data.end - data.start

  const getVariantColor = (impact: string) => {
    switch (impact) {
      case "High":
        return "#DC143C"
      case "Moderate":
        return "#FF8C00"
      case "Low":
        return "#32CD32"
      case "Modifier":
        return "#9370DB"
      default:
        return "#808080"
    }
  }

  const getConsequenceColor = (consequence: string) => {
    if (consequence.includes("stop") || consequence.includes("frameshift")) return "#DC143C"
    if (consequence.includes("missense") || consequence.includes("splice")) return "#FF8C00"
    if (consequence.includes("synonymous") || consequence.includes("UTR")) return "#32CD32"
    return "#9370DB"
  }

  const handleZoomIn = () => setZoomLevel(Math.min(zoomLevel * 1.5, 5))
  const handleZoomOut = () => setZoomLevel(Math.max(zoomLevel / 1.5, 0.5))
  const handleReset = () => {
    setZoomLevel(1)
    setSelectedVariant(null)
  }

  return (
    <TooltipProvider>
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">{data.name} Gene Structure</CardTitle>
              <CardDescription>
                Chromosome {data.chromosome}: {data.start.toLocaleString()} - {data.end.toLocaleString()} ({data.strand}{" "}
                strand)
              </CardDescription>
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

        <CardContent>
          <Tabs defaultValue="structure" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="structure">Gene Structure</TabsTrigger>
              <TabsTrigger value="variants">Variants</TabsTrigger>
              <TabsTrigger value="function">Function</TabsTrigger>
              <TabsTrigger value="pathways">Pathways</TabsTrigger>
            </TabsList>

            <TabsContent value="structure" className="space-y-6">
              {/* Transcript Selector */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-[#4A4A4A]">Select Transcript</h4>
                <div className="flex flex-wrap gap-2">
                  {data.transcripts.map((transcript, index) => (
                    <Button
                      key={transcript.id}
                      variant={selectedTranscript === index ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedTranscript(index)}
                      className={`${
                        selectedTranscript === index
                          ? "bg-[#1E90FF] text-white"
                          : "border-[#1E90FF] text-[#1E90FF] hover:bg-[#1E90FF]/10"
                      }`}
                    >
                      {transcript.name}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Gene Structure Visualization */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-[#4A4A4A]">
                    {transcript.name} ({transcript.exons.length} exons)
                  </h4>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>

                {/* Gene Structure SVG */}
                <div className="relative overflow-x-auto">
                  <svg width={900 * zoomLevel} height={200} className="border rounded-lg bg-white">
                    {/* Gene backbone */}
                    <line x1={50} y1={100} x2={850} y2={100} stroke="#9CA3AF" strokeWidth={2} />

                    {/* Exons */}
                    {transcript.exons.map((exon, index) => {
                      const exonStart = 50 + ((exon.start - data.start) / geneLength) * 800
                      const exonWidth = ((exon.end - exon.start) / geneLength) * 800
                      const isCoding = exon.type === "coding"

                      return (
                        <Tooltip key={exon.number}>
                          <TooltipTrigger>
                            <rect
                              x={exonStart}
                              y={isCoding ? 85 : 90}
                              width={Math.max(exonWidth, 8)}
                              height={isCoding ? 30 : 20}
                              fill={isCoding ? "#1E90FF" : "#87CEEB"}
                              stroke="#0F4C75"
                              strokeWidth={1}
                              className="cursor-pointer hover:opacity-80"
                            />
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="text-xs">
                              <p className="font-medium">Exon {exon.number}</p>
                              <p>
                                Position: {exon.start.toLocaleString()} - {exon.end.toLocaleString()}
                              </p>
                              <p>Type: {exon.type}</p>
                              <p>Length: {(exon.end - exon.start).toLocaleString()} bp</p>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      )
                    })}

                    {/* Introns */}
                    {transcript.exons.slice(0, -1).map((exon, index) => {
                      const intronStart = 50 + ((exon.end - data.start) / geneLength) * 800
                      const nextExonStart = 50 + ((transcript.exons[index + 1].start - data.start) / geneLength) * 800
                      const intronWidth = nextExonStart - intronStart

                      return (
                        <g key={`intron-${index}`}>
                          <line
                            x1={intronStart}
                            y1={100}
                            x2={nextExonStart}
                            y2={100}
                            stroke="#9CA3AF"
                            strokeWidth={1}
                            strokeDasharray="3,3"
                          />
                          {/* Intron splice sites */}
                          <circle cx={intronStart + 5} cy={100} r={2} fill="#FF6B6B" />
                          <circle cx={nextExonStart - 5} cy={100} r={2} fill="#FF6B6B" />
                        </g>
                      )
                    })}

                    {/* Variants */}
                    {transcript.variants.map((variant, index) => {
                      const x = 50 + ((variant.position - data.start) / geneLength) * 800
                      const isSelected = selectedVariant === index

                      return (
                        <Tooltip key={index}>
                          <TooltipTrigger>
                            <g>
                              <line
                                x1={x}
                                y1={60}
                                x2={x}
                                y2={140}
                                stroke={getVariantColor(variant.impact)}
                                strokeWidth={isSelected ? 3 : 2}
                                className="cursor-pointer"
                                onClick={() => setSelectedVariant(isSelected ? null : index)}
                              />
                              <circle
                                cx={x}
                                cy={50}
                                r={isSelected ? 6 : 4}
                                fill={getVariantColor(variant.impact)}
                                stroke={isSelected ? "#000" : "none"}
                                strokeWidth={isSelected ? 2 : 0}
                                className="cursor-pointer"
                                onClick={() => setSelectedVariant(isSelected ? null : index)}
                              />
                            </g>
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="text-xs space-y-1">
                              <p className="font-medium">Position: {variant.position.toLocaleString()}</p>
                              <p>Type: {variant.type}</p>
                              <p>Consequence: {variant.consequence}</p>
                              <p>Impact: {variant.impact}</p>
                              {variant.aminoAcid && <p>Amino Acid: {variant.aminoAcid}</p>}
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      )
                    })}

                    {/* Direction arrow */}
                    <g>
                      <polygon
                        points={data.strand === "+" ? "870,95 870,105 885,100" : "30,95 30,105 15,100"}
                        fill="#4B5563"
                      />
                      <text x={data.strand === "+" ? 875 : 25} y={125} textAnchor="middle" fontSize="12" fill="#4B5563">
                        {data.strand}
                      </text>
                    </g>

                    {/* Scale */}
                    {Array.from({ length: 9 }, (_, i) => {
                      const x = 50 + i * 100
                      const position = data.start + (i * geneLength) / 8
                      return (
                        <g key={i}>
                          <line x1={x} y1={150} x2={x} y2={160} stroke="#6B7280" strokeWidth={1} />
                          <text x={x} y={175} textAnchor="middle" fontSize="10" fill="#6B7280">
                            {(position / 1000).toFixed(0)}k
                          </text>
                        </g>
                      )
                    })}
                  </svg>
                </div>

                {/* Legend */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h5 className="text-sm font-medium text-[#4A4A4A]">Exon Types</h5>
                    <div className="flex gap-4">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-[#1E90FF] border border-[#0F4C75]" />
                        <span className="text-xs">Coding Exon</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-[#87CEEB] border border-[#0F4C75]" />
                        <span className="text-xs">Non-coding Exon</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-1 bg-[#9CA3AF]" style={{ borderStyle: "dashed" }} />
                        <span className="text-xs">Intron</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h5 className="text-sm font-medium text-[#4A4A4A]">Variant Impact</h5>
                    <div className="flex gap-4">
                      {[
                        { label: "High", color: "#DC143C" },
                        { label: "Moderate", color: "#FF8C00" },
                        { label: "Low", color: "#32CD32" },
                        { label: "Modifier", color: "#9370DB" },
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

              {/* Selected Variant Details */}
              {selectedVariant !== null && (
                <div className="p-4 rounded-lg bg-[#F5F7FA] border">
                  <h4 className="font-medium text-[#4A4A4A] mb-3">Variant Details</h4>
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-[#4A4A4A]/70">Position:</span>
                      <p className="font-medium">{transcript.variants[selectedVariant].position.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-[#4A4A4A]/70">Type:</span>
                      <p className="font-medium">{transcript.variants[selectedVariant].type}</p>
                    </div>
                    <div>
                      <span className="text-[#4A4A4A]/70">Impact:</span>
                      <Badge
                        style={{
                          backgroundColor: getVariantColor(transcript.variants[selectedVariant].impact),
                          color: "white",
                        }}
                      >
                        {transcript.variants[selectedVariant].impact}
                      </Badge>
                    </div>
                    <div className="md:col-span-2">
                      <span className="text-[#4A4A4A]/70">Consequence:</span>
                      <p className="font-medium">{transcript.variants[selectedVariant].consequence}</p>
                    </div>
                    {transcript.variants[selectedVariant].aminoAcid && (
                      <div>
                        <span className="text-[#4A4A4A]/70">Amino Acid Change:</span>
                        <p className="font-medium">{transcript.variants[selectedVariant].aminoAcid}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="variants" className="space-y-4">
              <div className="space-y-4">
                <h4 className="font-medium text-[#4A4A4A]">All Variants in {data.name}</h4>
                <div className="space-y-2">
                  {transcript.variants.map((variant, index) => (
                    <div key={index} className="p-3 rounded-lg border bg-white">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: getVariantColor(variant.impact) }}
                          />
                          <span className="font-medium">Position {variant.position.toLocaleString()}</span>
                        </div>
                        <Badge
                          style={{
                            backgroundColor: getConsequenceColor(variant.consequence),
                            color: "white",
                          }}
                        >
                          {variant.type}
                        </Badge>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-[#4A4A4A]/70">Consequence:</span>
                          <p>{variant.consequence}</p>
                        </div>
                        <div>
                          <span className="text-[#4A4A4A]/70">Impact:</span>
                          <p>{variant.impact}</p>
                        </div>
                        {variant.aminoAcid && (
                          <div className="md:col-span-2">
                            <span className="text-[#4A4A4A]/70">Amino Acid Change:</span>
                            <p className="font-mono">{variant.aminoAcid}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="function" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-[#4A4A4A] mb-2">Gene Function</h4>
                  <p className="text-[#4A4A4A]/80">{data.function}</p>
                </div>

                <div>
                  <h4 className="font-medium text-[#4A4A4A] mb-2">Associated Diseases</h4>
                  <div className="flex flex-wrap gap-2">
                    {data.diseases.map((disease, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="bg-[#DC143C]/10 text-[#DC143C] border-[#DC143C]/20"
                      >
                        {disease}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="pathways" className="space-y-4">
              <div>
                <h4 className="font-medium text-[#4A4A4A] mb-2">Biological Pathways</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  {data.pathways.map((pathway, index) => (
                    <div key={index} className="p-3 rounded-lg border bg-white">
                      <p className="font-medium text-[#1E90FF]">{pathway}</p>
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
