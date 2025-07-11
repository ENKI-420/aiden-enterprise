"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dna, Activity, AlertTriangle, CheckCircle, Clock, Database, Zap, Target, Heart } from "lucide-react"
import { ChromosomeViewer } from "@/components/genomic-visualizations/chromosome-viewer"
import { GeneStructureViewer } from "@/components/genomic-visualizations/gene-structure-viewer"
import { KaryotypeViewer } from "@/components/genomic-visualizations/karyotype-viewer"

interface GenomicVariant {
  id: string
  chromosome: string
  position: number
  ref: string
  alt: string
  gene: string
  consequence: string
  impact: "High" | "Moderate" | "Low" | "Modifier"
  clinicalSignificance: "Pathogenic" | "Likely Pathogenic" | "VUS" | "Likely Benign" | "Benign"
  alleleFrequency: number
  quality: number
  depth: number
  drugResponse?: string
  diseaseAssociation?: string
}

interface AnalysisJob {
  id: string
  name: string
  status: "Running" | "Completed" | "Failed" | "Queued"
  progress: number
  startTime: string
  estimatedCompletion?: string
  sampleCount: number
  variantCount?: number
}

export function GenomicAnalyticsPanel() {
  const [selectedAnalysis, setSelectedAnalysis] = useState<string>("variants")
  const [selectedChromosome, setSelectedChromosome] = useState<string>("1")
  const [filterImpact, setFilterImpact] = useState<string>("all")
  const [analysisJobs, setAnalysisJobs] = useState<AnalysisJob[]>([
    {
      id: "job_001",
      name: "Whole Exome Sequencing - Cohort A",
      status: "Running",
      progress: 67,
      startTime: "2024-01-15T10:30:00Z",
      estimatedCompletion: "2024-01-15T14:45:00Z",
      sampleCount: 156,
    },
    {
      id: "job_002",
      name: "Pharmacogenomic Analysis - Cancer Panel",
      status: "Completed",
      progress: 100,
      startTime: "2024-01-15T08:15:00Z",
      sampleCount: 89,
      variantCount: 2847,
    },
    {
      id: "job_003",
      name: "Structural Variant Detection",
      status: "Queued",
      progress: 0,
      startTime: "2024-01-15T15:00:00Z",
      sampleCount: 234,
    },
  ])

  const [genomicVariants] = useState<GenomicVariant[]>([
    {
      id: "var_001",
      chromosome: "17",
      position: 43094692,
      ref: "G",
      alt: "A",
      gene: "BRCA1",
      consequence: "missense_variant",
      impact: "High",
      clinicalSignificance: "Pathogenic",
      alleleFrequency: 0.0001,
      quality: 98.5,
      depth: 145,
      drugResponse: "Increased sensitivity to PARP inhibitors",
      diseaseAssociation: "Hereditary breast and ovarian cancer",
    },
    {
      id: "var_002",
      chromosome: "17",
      position: 7674894,
      ref: "C",
      alt: "T",
      gene: "TP53",
      consequence: "nonsense_variant",
      impact: "High",
      clinicalSignificance: "Pathogenic",
      alleleFrequency: 0.00005,
      quality: 95.2,
      depth: 178,
      drugResponse: "Resistance to MDM2 inhibitors",
      diseaseAssociation: "Li-Fraumeni syndrome",
    },
    {
      id: "var_003",
      chromosome: "7",
      position: 55181320,
      ref: "T",
      alt: "C",
      gene: "EGFR",
      consequence: "missense_variant",
      impact: "Moderate",
      clinicalSignificance: "Likely Pathogenic",
      alleleFrequency: 0.002,
      quality: 92.8,
      depth: 134,
      drugResponse: "Enhanced response to tyrosine kinase inhibitors",
      diseaseAssociation: "Non-small cell lung cancer",
    },
    {
      id: "var_004",
      chromosome: "12",
      position: 25245350,
      ref: "G",
      alt: "T",
      gene: "KRAS",
      consequence: "missense_variant",
      impact: "High",
      clinicalSignificance: "Pathogenic",
      alleleFrequency: 0.001,
      quality: 97.1,
      depth: 156,
      drugResponse: "Resistance to EGFR inhibitors",
      diseaseAssociation: "Colorectal cancer, lung cancer",
    },
  ])

  // Simulate real-time job updates
  useEffect(() => {
    const interval = setInterval(() => {
      setAnalysisJobs((prev) =>
        prev.map((job) => {
          if (job.status === "Running" && job.progress < 100) {
            const newProgress = Math.min(job.progress + Math.random() * 5, 100)
            return {
              ...job,
              progress: newProgress,
              status: newProgress >= 100 ? "Completed" : "Running",
              variantCount: newProgress >= 100 ? Math.floor(Math.random() * 5000) + 1000 : undefined,
            }
          }
          return job
        }),
      )
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const filteredVariants = genomicVariants.filter((variant) => {
    if (filterImpact === "all") return true
    return variant.impact === filterImpact
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Running":
        return "text-[#1E90FF]"
      case "Completed":
        return "text-[#2E8B57]"
      case "Failed":
        return "text-[#DC143C]"
      case "Queued":
        return "text-[#FF8C00]"
      default:
        return "text-[#4A4A4A]"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Running":
        return <Activity className="h-4 w-4 text-[#1E90FF]" />
      case "Completed":
        return <CheckCircle className="h-4 w-4 text-[#2E8B57]" />
      case "Failed":
        return <AlertTriangle className="h-4 w-4 text-[#DC143C]" />
      case "Queued":
        return <Clock className="h-4 w-4 text-[#FF8C00]" />
      default:
        return <Database className="h-4 w-4 text-[#4A4A4A]" />
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "High":
        return "bg-[#DC143C] text-white"
      case "Moderate":
        return "bg-[#FF8C00] text-white"
      case "Low":
        return "bg-[#2E8B57] text-white"
      default:
        return "bg-[#4A4A4A] text-white"
    }
  }

  const getClinicalSignificanceColor = (significance: string) => {
    switch (significance) {
      case "Pathogenic":
        return "bg-[#DC143C]/10 text-[#DC143C]"
      case "Likely Pathogenic":
        return "bg-[#FF6B6B]/10 text-[#FF6B6B]"
      case "VUS":
        return "bg-[#FFB347]/10 text-[#FFB347]"
      case "Likely Benign":
        return "bg-[#90EE90]/10 text-[#2E8B57]"
      case "Benign":
        return "bg-[#2E8B57]/10 text-[#2E8B57]"
      default:
        return "bg-[#4A4A4A]/10 text-[#4A4A4A]"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#4A4A4A] flex items-center gap-2">
            <Dna className="h-6 w-6 text-[#1E90FF]" />
            Genomic Analytics
          </h2>
          <p className="text-[#4A4A4A]/70">Comprehensive genomic variant analysis and interpretation</p>
        </div>

        <div className="flex items-center gap-2">
          <Select value={filterImpact} onValueChange={setFilterImpact}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Impact Levels</SelectItem>
              <SelectItem value="High">High Impact</SelectItem>
              <SelectItem value="Moderate">Moderate Impact</SelectItem>
              <SelectItem value="Low">Low Impact</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Analysis Jobs Status */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-[#2E8B57]" />
            Active Analysis Jobs
          </CardTitle>
          <CardDescription>Real-time status of genomic analysis pipelines</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analysisJobs.map((job) => (
              <div key={job.id} className="p-4 rounded-lg border bg-[#F5F7FA]">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(job.status)}
                    <div>
                      <h4 className="font-medium text-[#4A4A4A]">{job.name}</h4>
                      <p className="text-sm text-[#4A4A4A]/70">
                        {job.sampleCount} samples
                        {job.variantCount && ` • ${job.variantCount.toLocaleString()} variants`}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className={getStatusColor(job.status)}>
                    {job.status}
                  </Badge>
                </div>

                {job.status === "Running" && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{job.progress.toFixed(1)}%</span>
                    </div>
                    <Progress value={job.progress} className="h-2" />
                    {job.estimatedCompletion && (
                      <p className="text-xs text-[#4A4A4A]/50">
                        Estimated completion: {new Date(job.estimatedCompletion).toLocaleTimeString()}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Analysis Tabs */}
      <Tabs value={selectedAnalysis} onValueChange={setSelectedAnalysis} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="variants">Variant Catalog</TabsTrigger>
          <TabsTrigger value="chromosomes">Chromosomes</TabsTrigger>
          <TabsTrigger value="genes">Gene Structure</TabsTrigger>
          <TabsTrigger value="karyotype">Karyotype</TabsTrigger>
          <TabsTrigger value="pharmacogenomics">Pharmacogenomics</TabsTrigger>
        </TabsList>

        <TabsContent value="variants" className="space-y-6">
          {/* Variant Summary Stats */}
          <div className="grid md:grid-cols-4 gap-4">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#4A4A4A]/70">Total Variants</p>
                    <p className="text-2xl font-bold text-[#4A4A4A]">{genomicVariants.length.toLocaleString()}</p>
                  </div>
                  <Dna className="h-8 w-8 text-[#1E90FF]" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#4A4A4A]/70">High Impact</p>
                    <p className="text-2xl font-bold text-[#DC143C]">
                      {genomicVariants.filter((v) => v.impact === "High").length}
                    </p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-[#DC143C]" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#4A4A4A]/70">Pathogenic</p>
                    <p className="text-2xl font-bold text-[#DC143C]">
                      {genomicVariants.filter((v) => v.clinicalSignificance === "Pathogenic").length}
                    </p>
                  </div>
                  <Target className="h-8 w-8 text-[#DC143C]" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#4A4A4A]/70">Drug Response</p>
                    <p className="text-2xl font-bold text-[#2E8B57]">
                      {genomicVariants.filter((v) => v.drugResponse).length}
                    </p>
                  </div>
                  <Zap className="h-8 w-8 text-[#2E8B57]" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Variant Table */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-[#4A4A4A]" />
                Genomic Variant Catalog
              </CardTitle>
              <CardDescription>
                Comprehensive list of identified genomic variants with clinical annotations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredVariants.map((variant) => (
                  <div key={variant.id} className="p-4 rounded-lg border bg-white hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <div className="text-lg font-mono font-bold text-[#4A4A4A]">{variant.gene}</div>
                        <Badge variant="outline" className="font-mono">
                          chr{variant.chromosome}:{variant.position.toLocaleString()}
                        </Badge>
                        <Badge variant="outline" className="font-mono">
                          {variant.ref}→{variant.alt}
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        <Badge className={getImpactColor(variant.impact)}>{variant.impact} Impact</Badge>
                        <Badge variant="outline" className={getClinicalSignificanceColor(variant.clinicalSignificance)}>
                          {variant.clinicalSignificance}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-[#4A4A4A]/70">Consequence:</span>
                        <p className="font-medium">{variant.consequence.replace(/_/g, " ")}</p>
                      </div>
                      <div>
                        <span className="text-[#4A4A4A]/70">Allele Frequency:</span>
                        <p className="font-medium">{(variant.alleleFrequency * 100).toFixed(4)}%</p>
                      </div>
                      <div>
                        <span className="text-[#4A4A4A]/70">Quality Score:</span>
                        <p className="font-medium">
                          {variant.quality.toFixed(1)} (depth: {variant.depth}x)
                        </p>
                      </div>
                    </div>

                    {variant.drugResponse && (
                      <div className="mt-3 p-3 rounded bg-[#2E8B57]/5 border border-[#2E8B57]/20">
                        <div className="flex items-center gap-2 mb-1">
                          <Zap className="h-4 w-4 text-[#2E8B57]" />
                          <span className="text-sm font-medium text-[#2E8B57]">Drug Response</span>
                        </div>
                        <p className="text-sm text-[#4A4A4A]">{variant.drugResponse}</p>
                      </div>
                    )}

                    {variant.diseaseAssociation && (
                      <div className="mt-3 p-3 rounded bg-[#DC143C]/5 border border-[#DC143C]/20">
                        <div className="flex items-center gap-2 mb-1">
                          <Heart className="h-4 w-4 text-[#DC143C]" />
                          <span className="text-sm font-medium text-[#DC143C]">Disease Association</span>
                        </div>
                        <p className="text-sm text-[#4A4A4A]">{variant.diseaseAssociation}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chromosomes">
          <ChromosomeViewer chromosome={selectedChromosome} variants={genomicVariants} />
        </TabsContent>

        <TabsContent value="genes">
          <GeneStructureViewer gene="BRCA1" variants={genomicVariants.filter((v) => v.gene === "BRCA1")} />
        </TabsContent>

        <TabsContent value="karyotype">
          <KaryotypeViewer variants={genomicVariants} />
        </TabsContent>

        <TabsContent value="pharmacogenomics" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-[#2E8B57]" />
                Pharmacogenomic Analysis
              </CardTitle>
              <CardDescription>Drug response predictions based on genomic variants</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {genomicVariants
                  .filter((variant) => variant.drugResponse)
                  .map((variant) => (
                    <div key={variant.id} className="p-4 rounded-lg border bg-[#F5F7FA]">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-medium text-[#4A4A4A]">{variant.gene} Variant</h4>
                          <p className="text-sm text-[#4A4A4A]/70 font-mono">
                            {variant.ref}
                            {variant.position}
                            {variant.alt}
                          </p>
                        </div>
                        <Badge className={getImpactColor(variant.impact)}>{variant.impact} Impact</Badge>
                      </div>

                      <div className="p-3 rounded bg-[#2E8B57]/5 border border-[#2E8B57]/20">
                        <div className="flex items-center gap-2 mb-2">
                          <Zap className="h-4 w-4 text-[#2E8B57]" />
                          <span className="font-medium text-[#2E8B57]">Drug Response Prediction</span>
                        </div>
                        <p className="text-sm text-[#4A4A4A]">{variant.drugResponse}</p>
                      </div>

                      <div className="mt-3 grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-[#4A4A4A]/70">Clinical Significance:</span>
                          <Badge
                            variant="outline"
                            className={getClinicalSignificanceColor(variant.clinicalSignificance)}
                          >
                            {variant.clinicalSignificance}
                          </Badge>
                        </div>
                        <div>
                          <span className="text-[#4A4A4A]/70">Population Frequency:</span>
                          <p className="font-medium">{(variant.alleleFrequency * 100).toFixed(4)}%</p>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
