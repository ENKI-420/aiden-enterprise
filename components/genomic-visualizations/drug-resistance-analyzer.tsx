"use client"

import type React from "react"

import { useState, useRef, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { TooltipProvider } from "@/components/ui/tooltip"
import {
  Shield,
  AlertTriangle,
  TrendingUp,
  Target,
  Zap,
  Activity,
  Search,
  Download,
  Play,
  Pause,
  RotateCcw,
  Settings,
  Database,
  Microscope,
  Pill,
  DnaIcon as DNA,
  ChevronRight,
  Info,
  CheckCircle,
  Clock,
  BarChart3,
} from "lucide-react"

interface ResistanceMutation {
  id: string
  position: number
  wildType: string
  mutant: string
  gene: string
  protein: string
  resistanceLevel: "High" | "Moderate" | "Low" | "Sensitizing"
  mechanism: "Binding Site" | "Allosteric" | "Efflux" | "Metabolism" | "Target Bypass" | "DNA Repair"
  foldChange: number
  clinicalEvidence: "Established" | "Emerging" | "Predicted" | "Conflicting"
  drugs: string[]
  cancerTypes: string[]
  frequency: number
  coOccurringMutations: string[]
  structuralImpact: {
    bindingAffinity: number
    proteinStability: number
    conformationalChange: number
    allostericEffect: number
  }
  clinicalOutcome: {
    responseRate: number
    progressionFreeTime: number
    overallSurvival: number
  }
  alternativeTherapies: string[]
}

interface DrugResistanceProfile {
  drug: string
  target: string
  mechanism: string
  resistanceMutations: ResistanceMutation[]
  sensitizingMutations: ResistanceMutation[]
  combinationStrategies: string[]
  biomarkers: string[]
  clinicalTrials: number
}

interface ResistancePathway {
  id: string
  name: string
  description: string
  mutations: string[]
  mechanism: string
  timeToResistance: number
  prevalence: number
  interventions: string[]
}

interface DrugResistanceAnalyzerProps {
  patientMutations?: ResistanceMutation[]
  selectedDrug?: string
  cancerType?: string
}

export function DrugResistanceAnalyzer({
  patientMutations = [],
  selectedDrug = "Erlotinib",
  cancerType = "Lung Cancer",
}: DrugResistanceAnalyzerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()

  const [selectedMutation, setSelectedMutation] = useState<string | null>(null)
  const [analysisMode, setAnalysisMode] = useState<"overview" | "mechanisms" | "pathways" | "predictions">("overview")
  const [filterResistanceLevel, setFilterResistanceLevel] = useState<string>("all")
  const [filterMechanism, setFilterMechanism] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [showPredictions, setShowPredictions] = useState(true)
  const [confidenceThreshold, setConfidenceThreshold] = useState([0.7])
  const [timeHorizon, setTimeHorizon] = useState([12])
  const [isSimulating, setIsSimulating] = useState(false)
  const [currentTimepoint, setCurrentTimepoint] = useState(0)

  // Sample resistance mutation data
  const [resistanceMutations] = useState<ResistanceMutation[]>([
    {
      id: "mut_egfr_t790m",
      position: 790,
      wildType: "T",
      mutant: "M",
      gene: "EGFR",
      protein: "EGFR",
      resistanceLevel: "High",
      mechanism: "Binding Site",
      foldChange: 150,
      clinicalEvidence: "Established",
      drugs: ["Erlotinib", "Gefitinib", "Afatinib"],
      cancerTypes: ["Lung Cancer", "Glioblastoma"],
      frequency: 0.6,
      coOccurringMutations: ["EGFR L858R", "EGFR Del19"],
      structuralImpact: {
        bindingAffinity: -2.5,
        proteinStability: 0.3,
        conformationalChange: 0.8,
        allostericEffect: 0.4,
      },
      clinicalOutcome: {
        responseRate: 0.15,
        progressionFreeTime: 3.2,
        overallSurvival: 8.5,
      },
      alternativeTherapies: ["Osimertinib", "Combination therapy", "Immunotherapy"],
    },
    {
      id: "mut_egfr_c797s",
      position: 797,
      wildType: "C",
      mutant: "S",
      gene: "EGFR",
      protein: "EGFR",
      resistanceLevel: "High",
      mechanism: "Binding Site",
      foldChange: 200,
      clinicalEvidence: "Established",
      drugs: ["Osimertinib"],
      cancerTypes: ["Lung Cancer"],
      frequency: 0.25,
      coOccurringMutations: ["EGFR T790M"],
      structuralImpact: {
        bindingAffinity: -3.2,
        proteinStability: -0.1,
        conformationalChange: 1.2,
        allostericEffect: 0.6,
      },
      clinicalOutcome: {
        responseRate: 0.08,
        progressionFreeTime: 2.1,
        overallSurvival: 6.8,
      },
      alternativeTherapies: ["Combination therapy", "Antibody-drug conjugates", "CAR-T therapy"],
    },
    {
      id: "mut_kras_g12c",
      position: 12,
      wildType: "G",
      mutant: "C",
      gene: "KRAS",
      protein: "KRAS",
      resistanceLevel: "Moderate",
      mechanism: "Target Bypass",
      foldChange: 8,
      clinicalEvidence: "Emerging",
      drugs: ["Sotorasib", "Adagrasib"],
      cancerTypes: ["Lung Cancer", "Colorectal Cancer"],
      frequency: 0.13,
      coOccurringMutations: ["TP53 mutations", "STK11 mutations"],
      structuralImpact: {
        bindingAffinity: -1.8,
        proteinStability: -0.5,
        conformationalChange: 0.9,
        allostericEffect: 1.2,
      },
      clinicalOutcome: {
        responseRate: 0.32,
        progressionFreeTime: 6.8,
        overallSurvival: 12.5,
      },
      alternativeTherapies: ["Combination with MEK inhibitors", "Immunotherapy", "SHP2 inhibitors"],
    },
    {
      id: "mut_brca1_c61g",
      position: 61,
      wildType: "C",
      mutant: "G",
      gene: "BRCA1",
      protein: "BRCA1",
      resistanceLevel: "High",
      mechanism: "DNA Repair",
      foldChange: 45,
      clinicalEvidence: "Established",
      drugs: ["Olaparib", "Talazoparib", "Niraparib"],
      cancerTypes: ["Breast Cancer", "Ovarian Cancer"],
      frequency: 0.08,
      coOccurringMutations: ["TP53 mutations", "BRCA2 mutations"],
      structuralImpact: {
        bindingAffinity: 0.2,
        proteinStability: 1.5,
        conformationalChange: 0.3,
        allostericEffect: 0.1,
      },
      clinicalOutcome: {
        responseRate: 0.18,
        progressionFreeTime: 4.2,
        overallSurvival: 9.8,
      },
      alternativeTherapies: ["Platinum-based chemotherapy", "Immunotherapy", "CDK4/6 inhibitors"],
    },
    {
      id: "mut_abl1_t315i",
      position: 315,
      wildType: "T",
      mutant: "I",
      gene: "ABL1",
      protein: "ABL1",
      resistanceLevel: "High",
      mechanism: "Binding Site",
      foldChange: 300,
      clinicalEvidence: "Established",
      drugs: ["Imatinib", "Dasatinib", "Nilotinib"],
      cancerTypes: ["CML", "ALL"],
      frequency: 0.15,
      coOccurringMutations: ["BCR-ABL fusion"],
      structuralImpact: {
        bindingAffinity: -4.1,
        proteinStability: 0.8,
        conformationalChange: 1.5,
        allostericEffect: 0.9,
      },
      clinicalOutcome: {
        responseRate: 0.05,
        progressionFreeTime: 1.8,
        overallSurvival: 5.2,
      },
      alternativeTherapies: ["Ponatinib", "Asciminib", "Stem cell transplant"],
    },
  ])

  const [resistancePathways] = useState<ResistancePathway[]>([
    {
      id: "pathway_egfr_sequential",
      name: "Sequential EGFR Resistance",
      description: "Progressive acquisition of resistance mutations in EGFR pathway",
      mutations: ["EGFR L858R", "EGFR T790M", "EGFR C797S"],
      mechanism: "Sequential binding site modifications",
      timeToResistance: 12,
      prevalence: 0.45,
      interventions: ["Sequential TKI therapy", "Combination approaches", "Liquid biopsy monitoring"],
    },
    {
      id: "pathway_bypass_activation",
      name: "Bypass Pathway Activation",
      description: "Alternative pathway activation to circumvent drug target",
      mutations: ["MET amplification", "HER2 amplification", "PIK3CA mutations"],
      mechanism: "Alternative signaling pathway activation",
      timeToResistance: 8,
      prevalence: 0.25,
      interventions: ["Combination therapy", "Multi-target inhibitors", "Pathway switching"],
    },
    {
      id: "pathway_dna_repair_restoration",
      name: "DNA Repair Restoration",
      description: "Restoration of homologous recombination in BRCA-deficient tumors",
      mutations: ["BRCA1 reversion", "BRCA2 reversion", "53BP1 loss"],
      mechanism: "Restoration of DNA repair capacity",
      timeToResistance: 18,
      prevalence: 0.35,
      interventions: ["Alternative PARP inhibitors", "Combination with chemotherapy", "Immunotherapy"],
    },
  ])

  // Filter mutations based on current settings
  const filteredMutations = resistanceMutations.filter((mutation) => {
    const levelMatch = filterResistanceLevel === "all" || mutation.resistanceLevel === filterResistanceLevel
    const mechanismMatch = filterMechanism === "all" || mutation.mechanism === filterMechanism
    const searchMatch =
      searchTerm === "" ||
      mutation.gene.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mutation.drugs.some((drug) => drug.toLowerCase().includes(searchTerm.toLowerCase())) ||
      mutation.cancerTypes.some((cancer) => cancer.toLowerCase().includes(searchTerm.toLowerCase()))

    return levelMatch && mechanismMatch && searchMatch
  })

  // Resistance prediction simulation
  const simulateResistanceEvolution = useCallback(() => {
    if (!isSimulating) return

    setCurrentTimepoint((prev) => {
      const next = prev + 1
      return next >= 100 ? 0 : next
    })
  }, [isSimulating])

  useEffect(() => {
    if (isSimulating) {
      const interval = setInterval(simulateResistanceEvolution, 100)
      return () => clearInterval(interval)
    }
  }, [isSimulating, simulateResistanceEvolution])

  // Canvas visualization for resistance networks
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw resistance network
    drawResistanceNetwork(ctx, canvas.width, canvas.height)
  }, [filteredMutations, selectedMutation, currentTimepoint])

  const drawResistanceNetwork = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const centerX = width / 2
    const centerY = height / 2
    const radius = Math.min(width, height) * 0.35

    // Draw drug at center
    ctx.fillStyle = "#1E90FF"
    ctx.beginPath()
    ctx.arc(centerX, centerY, 30, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = "white"
    ctx.font = "12px Arial"
    ctx.textAlign = "center"
    ctx.fillText("Drug", centerX, centerY + 4)

    // Draw mutations around the circle
    filteredMutations.forEach((mutation, index) => {
      const angle = (index / filteredMutations.length) * Math.PI * 2
      const x = centerX + Math.cos(angle) * radius
      const y = centerY + Math.sin(angle) * radius

      // Mutation node
      const nodeRadius = 15 + mutation.foldChange / 20
      ctx.fillStyle = getResistanceColor(mutation.resistanceLevel)
      ctx.beginPath()
      ctx.arc(x, y, nodeRadius, 0, Math.PI * 2)
      ctx.fill()

      // Selection highlight
      if (selectedMutation === mutation.id) {
        ctx.strokeStyle = "#FFD700"
        ctx.lineWidth = 3
        ctx.stroke()
      }

      // Connection to center
      const connectionStrength = Math.min(mutation.foldChange / 50, 1)
      ctx.strokeStyle = `rgba(220, 20, 60, ${connectionStrength})`
      ctx.lineWidth = 2 + connectionStrength * 3
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.lineTo(x, y)
      ctx.stroke()

      // Mutation label
      ctx.fillStyle = "#333"
      ctx.font = "10px Arial"
      ctx.textAlign = "center"
      ctx.fillText(`${mutation.wildType}${mutation.position}${mutation.mutant}`, x, y + nodeRadius + 12)
    })

    // Draw resistance pathways
    resistancePathways.forEach((pathway, pathwayIndex) => {
      const pathwayAngle = (pathwayIndex / resistancePathways.length) * Math.PI * 2
      const pathwayX = centerX + Math.cos(pathwayAngle) * (radius + 80)
      const pathwayY = centerY + Math.sin(pathwayAngle) * (radius + 80)

      // Pathway node
      ctx.fillStyle = "#FF8C00"
      ctx.beginPath()
      ctx.arc(pathwayX, pathwayY, 20, 0, Math.PI * 2)
      ctx.fill()

      // Pathway label
      ctx.fillStyle = "#333"
      ctx.font = "9px Arial"
      ctx.textAlign = "center"
      ctx.fillText(pathway.name.split(" ")[0], pathwayX, pathwayY + 3)
    })

    // Draw time evolution if simulating
    if (isSimulating) {
      const evolutionRadius = 50 + (currentTimepoint / 100) * 100
      ctx.strokeStyle = `rgba(255, 140, 0, ${0.3 + (currentTimepoint / 100) * 0.7})`
      ctx.lineWidth = 2
      ctx.setLineDash([5, 5])
      ctx.beginPath()
      ctx.arc(centerX, centerY, evolutionRadius, 0, Math.PI * 2)
      ctx.stroke()
      ctx.setLineDash([])
    }
  }

  const getResistanceColor = (level: string) => {
    switch (level) {
      case "High":
        return "#DC143C"
      case "Moderate":
        return "#FF8C00"
      case "Low":
        return "#32CD32"
      case "Sensitizing":
        return "#1E90FF"
      default:
        return "#4A4A4A"
    }
  }

  const getEvidenceColor = (evidence: string) => {
    switch (evidence) {
      case "Established":
        return "bg-[#2E8B57]/10 text-[#2E8B57]"
      case "Emerging":
        return "bg-[#FF8C00]/10 text-[#FF8C00]"
      case "Predicted":
        return "bg-[#1E90FF]/10 text-[#1E90FF]"
      case "Conflicting":
        return "bg-[#DC143C]/10 text-[#DC143C]"
      default:
        return "bg-[#4A4A4A]/10 text-[#4A4A4A]"
    }
  }

  const getMechanismIcon = (mechanism: string) => {
    switch (mechanism) {
      case "Binding Site":
        return <Target className="h-4 w-4" />
      case "Allosteric":
        return <Activity className="h-4 w-4" />
      case "Efflux":
        return <TrendingUp className="h-4 w-4" />
      case "Metabolism":
        return <Zap className="h-4 w-4" />
      case "Target Bypass":
        return <ChevronRight className="h-4 w-4" />
      case "DNA Repair":
        return <DNA className="h-4 w-4" />
      default:
        return <Shield className="h-4 w-4" />
    }
  }

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const radius = Math.min(canvas.width, canvas.height) * 0.35

    // Check for mutation clicks
    filteredMutations.forEach((mutation, index) => {
      const angle = (index / filteredMutations.length) * Math.PI * 2
      const mutX = centerX + Math.cos(angle) * radius
      const mutY = centerY + Math.sin(angle) * radius
      const nodeRadius = 15 + mutation.foldChange / 20

      const distance = Math.sqrt((x - mutX) ** 2 + (y - mutY) ** 2)
      if (distance <= nodeRadius) {
        setSelectedMutation(selectedMutation === mutation.id ? null : mutation.id)
      }
    })
  }

  const selectedMutationData = selectedMutation ? filteredMutations.find((m) => m.id === selectedMutation) : null

  const calculateResistanceRisk = (mutations: ResistanceMutation[]) => {
    if (mutations.length === 0) return 0
    const avgFoldChange = mutations.reduce((sum, m) => sum + m.foldChange, 0) / mutations.length
    return Math.min(avgFoldChange / 100, 1)
  }

  const predictResistanceTimeline = (drug: string) => {
    const relevantMutations = filteredMutations.filter((m) => m.drugs.includes(drug))
    const avgTime =
      relevantMutations.reduce((sum, m) => {
        const pathway = resistancePathways.find((p) => p.mutations.some((mut) => mut.includes(m.gene)))
        return sum + (pathway?.timeToResistance || 12)
      }, 0) / Math.max(relevantMutations.length, 1)

    return avgTime
  }

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-[#4A4A4A] flex items-center gap-2">
              <Shield className="h-6 w-6 text-[#DC143C]" />
              Drug Resistance Analysis
            </h2>
            <p className="text-[#4A4A4A]/70">
              Comprehensive mutation analysis for resistance prediction and mechanism elucidation
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsSimulating(!isSimulating)}
              className={isSimulating ? "bg-[#FF8C00] text-white" : ""}
            >
              {isSimulating ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
              {isSimulating ? "Pause" : "Simulate"}
            </Button>
            <Button variant="outline" size="sm" onClick={() => setCurrentTimepoint(0)}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button variant="outline" size="sm">
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
              Analysis Controls
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-5 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-[#4A4A4A]/50" />
                  <Input
                    placeholder="Search mutations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Resistance Level</label>
                <Select value={filterResistanceLevel} onValueChange={setFilterResistanceLevel}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="High">High Resistance</SelectItem>
                    <SelectItem value="Moderate">Moderate Resistance</SelectItem>
                    <SelectItem value="Low">Low Resistance</SelectItem>
                    <SelectItem value="Sensitizing">Sensitizing</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Mechanism</label>
                <Select value={filterMechanism} onValueChange={setFilterMechanism}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Mechanisms</SelectItem>
                    <SelectItem value="Binding Site">Binding Site</SelectItem>
                    <SelectItem value="Allosteric">Allosteric</SelectItem>
                    <SelectItem value="Efflux">Efflux</SelectItem>
                    <SelectItem value="Metabolism">Metabolism</SelectItem>
                    <SelectItem value="Target Bypass">Target Bypass</SelectItem>
                    <SelectItem value="DNA Repair">DNA Repair</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Confidence Threshold</label>
                <Slider
                  value={confidenceThreshold}
                  onValueChange={setConfidenceThreshold}
                  min={0}
                  max={1}
                  step={0.01}
                  className="w-full"
                />
                <div className="text-xs text-center">{(confidenceThreshold[0] * 100).toFixed(0)}%</div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Time Horizon (months)</label>
                <Slider
                  value={timeHorizon}
                  onValueChange={setTimeHorizon}
                  min={1}
                  max={36}
                  step={1}
                  className="w-full"
                />
                <div className="text-xs text-center">{timeHorizon[0]} months</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Analysis */}
        <Tabs value={analysisMode} onValueChange={(value: any) => setAnalysisMode(value)} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="mechanisms">Mechanisms</TabsTrigger>
            <TabsTrigger value="pathways">Pathways</TabsTrigger>
            <TabsTrigger value="predictions">Predictions</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Summary Statistics */}
            <div className="grid md:grid-cols-4 gap-4">
              <Card className="border-0 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-[#4A4A4A]/70">Total Mutations</p>
                      <p className="text-2xl font-bold text-[#4A4A4A]">{filteredMutations.length}</p>
                    </div>
                    <Database className="h-8 w-8 text-[#1E90FF]" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-[#4A4A4A]/70">High Resistance</p>
                      <p className="text-2xl font-bold text-[#DC143C]">
                        {filteredMutations.filter((m) => m.resistanceLevel === "High").length}
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
                      <p className="text-sm font-medium text-[#4A4A4A]/70">Avg Resistance Time</p>
                      <p className="text-2xl font-bold text-[#FF8C00]">
                        {predictResistanceTimeline(selectedDrug).toFixed(1)}mo
                      </p>
                    </div>
                    <Clock className="h-8 w-8 text-[#FF8C00]" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-[#4A4A4A]/70">Risk Score</p>
                      <p className="text-2xl font-bold text-[#DC143C]">
                        {(calculateResistanceRisk(filteredMutations) * 100).toFixed(0)}%
                      </p>
                    </div>
                    <BarChart3 className="h-8 w-8 text-[#DC143C]" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Interactive Network Visualization */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Microscope className="h-5 w-5 text-[#DC143C]" />
                  Resistance Network Visualization
                </CardTitle>
                <CardDescription>
                  Interactive network showing drug-mutation relationships and resistance mechanisms
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <canvas
                    ref={canvasRef}
                    width={800}
                    height={500}
                    className="border rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 cursor-pointer"
                    onClick={handleCanvasClick}
                  />

                  {/* Legend */}
                  <div className="absolute bottom-4 left-4 bg-white/90 p-3 rounded-lg border">
                    <h5 className="text-sm font-medium mb-2">Resistance Levels</h5>
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-[#DC143C] rounded-full" />
                        <span>High Resistance</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-[#FF8C00] rounded-full" />
                        <span>Moderate Resistance</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-[#32CD32] rounded-full" />
                        <span>Low Resistance</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-[#1E90FF] rounded-full" />
                        <span>Sensitizing</span>
                      </div>
                    </div>
                  </div>

                  {/* Network Stats */}
                  <div className="absolute top-4 left-4 bg-white/90 p-3 rounded-lg border">
                    <div className="text-sm space-y-1">
                      <div className="flex items-center gap-2">
                        <Pill className="h-4 w-4 text-[#1E90FF]" />
                        <span>Drug: {selectedDrug}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-[#DC143C]" />
                        <span>{filteredMutations.length} mutations</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Activity className="h-4 w-4 text-[#FF8C00]" />
                        <span>{resistancePathways.length} pathways</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Mutation List */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DNA className="h-5 w-5 text-[#4A4A4A]" />
                  Resistance Mutations ({filteredMutations.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {filteredMutations.map((mutation) => (
                    <div
                      key={mutation.id}
                      className={`p-4 rounded-lg border cursor-pointer transition-all ${
                        selectedMutation === mutation.id
                          ? "ring-2 ring-[#DC143C] bg-[#DC143C]/5"
                          : "bg-white hover:bg-gray-50"
                      }`}
                      onClick={() => setSelectedMutation(selectedMutation === mutation.id ? null : mutation.id)}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                          {getMechanismIcon(mutation.mechanism)}
                          <div>
                            <span className="font-medium text-lg">
                              {mutation.gene} {mutation.wildType}
                              {mutation.position}
                              {mutation.mutant}
                            </span>
                            <p className="text-sm text-[#4A4A4A]/70">{mutation.mechanism}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Badge className={`${getResistanceColor(mutation.resistanceLevel)} text-white`}>
                            {mutation.resistanceLevel}
                          </Badge>
                          <Badge variant="outline" className={getEvidenceColor(mutation.clinicalEvidence)}>
                            {mutation.clinicalEvidence}
                          </Badge>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-[#4A4A4A]/70">Fold Change:</span>
                          <p className="font-medium">{mutation.foldChange}x</p>
                        </div>
                        <div>
                          <span className="text-[#4A4A4A]/70">Frequency:</span>
                          <p className="font-medium">{(mutation.frequency * 100).toFixed(1)}%</p>
                        </div>
                        <div>
                          <span className="text-[#4A4A4A]/70">Response Rate:</span>
                          <p className="font-medium">{(mutation.clinicalOutcome.responseRate * 100).toFixed(1)}%</p>
                        </div>
                        <div>
                          <span className="text-[#4A4A4A]/70">PFS:</span>
                          <p className="font-medium">{mutation.clinicalOutcome.progressionFreeTime} months</p>
                        </div>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-1">
                        {mutation.drugs.slice(0, 3).map((drug, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {drug}
                          </Badge>
                        ))}
                        {mutation.drugs.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{mutation.drugs.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mechanisms" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-[#FF8C00]" />
                  Resistance Mechanisms
                </CardTitle>
                <CardDescription>Detailed analysis of molecular mechanisms underlying drug resistance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {["Binding Site", "Allosteric", "Target Bypass", "DNA Repair", "Efflux", "Metabolism"].map(
                    (mechanism) => {
                      const mechanismMutations = filteredMutations.filter((m) => m.mechanism === mechanism)
                      if (mechanismMutations.length === 0) return null

                      return (
                        <div key={mechanism} className="p-4 rounded-lg bg-[#F5F7FA] border">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              {getMechanismIcon(mechanism)}
                              <h4 className="font-medium text-[#4A4A4A]">{mechanism}</h4>
                            </div>
                            <Badge variant="outline">{mechanismMutations.length} mutations</Badge>
                          </div>

                          <div className="grid md:grid-cols-3 gap-4 mb-4">
                            <div className="text-center p-3 rounded bg-white">
                              <div className="text-2xl font-bold text-[#DC143C]">
                                {mechanismMutations.filter((m) => m.resistanceLevel === "High").length}
                              </div>
                              <div className="text-sm text-[#4A4A4A]/70">High Resistance</div>
                            </div>
                            <div className="text-center p-3 rounded bg-white">
                              <div className="text-2xl font-bold text-[#FF8C00]">
                                {(
                                  mechanismMutations.reduce((sum, m) => sum + m.foldChange, 0) /
                                  mechanismMutations.length
                                ).toFixed(0)}
                                x
                              </div>
                              <div className="text-sm text-[#4A4A4A]/70">Avg Fold Change</div>
                            </div>
                            <div className="text-center p-3 rounded bg-white">
                              <div className="text-2xl font-bold text-[#2E8B57]">
                                {(
                                  (mechanismMutations.reduce((sum, m) => sum + m.frequency, 0) /
                                    mechanismMutations.length) *
                                  100
                                ).toFixed(1)}
                                %
                              </div>
                              <div className="text-sm text-[#4A4A4A]/70">Avg Frequency</div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            {mechanismMutations.slice(0, 3).map((mutation) => (
                              <div key={mutation.id} className="flex justify-between items-center p-2 rounded bg-white">
                                <span className="font-medium">
                                  {mutation.gene} {mutation.wildType}
                                  {mutation.position}
                                  {mutation.mutant}
                                </span>
                                <div className="flex gap-2">
                                  <Badge variant="outline">{mutation.foldChange}x</Badge>
                                  <Badge className={`${getResistanceColor(mutation.resistanceLevel)} text-white`}>
                                    {mutation.resistanceLevel}
                                  </Badge>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    },
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pathways" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-[#2E8B57]" />
                  Resistance Pathways
                </CardTitle>
                <CardDescription>Evolution pathways and temporal patterns of resistance development</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {resistancePathways.map((pathway) => (
                    <div key={pathway.id} className="p-4 rounded-lg border bg-[#F5F7FA]">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-medium text-[#4A4A4A]">{pathway.name}</h4>
                          <p className="text-sm text-[#4A4A4A]/70">{pathway.description}</p>
                        </div>
                        <Badge variant="outline" className="bg-[#2E8B57]/10 text-[#2E8B57]">
                          {(pathway.prevalence * 100).toFixed(0)}% prevalence
                        </Badge>
                      </div>

                      <div className="grid md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <span className="text-[#4A4A4A]/70 text-sm">Time to Resistance:</span>
                          <p className="font-medium">{pathway.timeToResistance} months</p>
                        </div>
                        <div>
                          <span className="text-[#4A4A4A]/70 text-sm">Mechanism:</span>
                          <p className="font-medium">{pathway.mechanism}</p>
                        </div>
                        <div>
                          <span className="text-[#4A4A4A]/70 text-sm">Mutations:</span>
                          <p className="font-medium">{pathway.mutations.length} steps</p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <span className="text-[#4A4A4A]/70 text-sm">Mutation Sequence:</span>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          {pathway.mutations.map((mutation, index) => (
                            <div key={index} className="flex items-center gap-1">
                              <Badge variant="outline" className="text-xs">
                                {mutation}
                              </Badge>
                              {index < pathway.mutations.length - 1 && (
                                <ChevronRight className="h-3 w-3 text-[#4A4A4A]/50" />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <span className="text-[#4A4A4A]/70 text-sm">Intervention Strategies:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {pathway.interventions.map((intervention, index) => (
                            <Badge key={index} variant="outline" className="text-xs bg-[#1E90FF]/10 text-[#1E90FF]">
                              {intervention}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="predictions" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-[#1E90FF]" />
                  Resistance Predictions
                </CardTitle>
                <CardDescription>
                  AI-powered predictions for resistance development and alternative therapies
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Risk Assessment */}
                  <div className="p-4 rounded-lg bg-[#F5F7FA] border">
                    <h4 className="font-medium text-[#4A4A4A] mb-3">Resistance Risk Assessment</h4>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Overall Risk Score</span>
                          <span>{(calculateResistanceRisk(filteredMutations) * 100).toFixed(0)}%</span>
                        </div>
                        <Progress value={calculateResistanceRisk(filteredMutations) * 100} className="h-3" />
                        <p className="text-xs text-[#4A4A4A]/70 mt-1">
                          Based on mutation profile and clinical evidence
                        </p>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Time to Resistance</span>
                          <span>{predictResistanceTimeline(selectedDrug).toFixed(1)} months</span>
                        </div>
                        <Progress value={(predictResistanceTimeline(selectedDrug) / 24) * 100} className="h-3" />
                        <p className="text-xs text-[#4A4A4A]/70 mt-1">
                          Estimated median time to resistance development
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Alternative Therapies */}
                  <div className="p-4 rounded-lg bg-[#F5F7FA] border">
                    <h4 className="font-medium text-[#4A4A4A] mb-3">Recommended Alternative Therapies</h4>
                    <div className="space-y-3">
                      {selectedMutationData?.alternativeTherapies.map((therapy, index) => (
                        <div key={index} className="flex items-center justify-between p-3 rounded bg-white">
                          <div className="flex items-center gap-3">
                            <Pill className="h-4 w-4 text-[#2E8B57]" />
                            <span className="font-medium">{therapy}</span>
                          </div>
                          <Badge variant="outline" className="bg-[#2E8B57]/10 text-[#2E8B57]">
                            Recommended
                          </Badge>
                        </div>
                      )) || (
                        <p className="text-[#4A4A4A]/70 text-sm">
                          Select a mutation to view alternative therapy recommendations
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Monitoring Recommendations */}
                  <div className="p-4 rounded-lg bg-[#F5F7FA] border">
                    <h4 className="font-medium text-[#4A4A4A] mb-3">Monitoring Recommendations</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-[#2E8B57]" />
                          <span className="text-sm">Liquid biopsy every 3 months</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-[#2E8B57]" />
                          <span className="text-sm">Imaging assessment every 6 weeks</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-[#2E8B57]" />
                          <span className="text-sm">Biomarker panel monitoring</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-[#FF8C00]" />
                          <span className="text-sm">Watch for T790M emergence</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-[#FF8C00]" />
                          <span className="text-sm">Monitor bypass pathway activation</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-[#FF8C00]" />
                          <span className="text-sm">Track co-occurring mutations</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Selected Mutation Details */}
        {selectedMutationData && (
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5 text-[#4A4A4A]" />
                Mutation Details: {selectedMutationData.gene} {selectedMutationData.wildType}
                {selectedMutationData.position}
                {selectedMutationData.mutant}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="overview" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="structural">Structural Impact</TabsTrigger>
                  <TabsTrigger value="clinical">Clinical Outcomes</TabsTrigger>
                  <TabsTrigger value="alternatives">Alternatives</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <span className="text-[#4A4A4A]/70 text-sm">Resistance Mechanism:</span>
                        <p className="font-medium flex items-center gap-2">
                          {getMechanismIcon(selectedMutationData.mechanism)}
                          {selectedMutationData.mechanism}
                        </p>
                      </div>
                      <div>
                        <span className="text-[#4A4A4A]/70 text-sm">Fold Change in Resistance:</span>
                        <p className="font-medium text-[#DC143C]">{selectedMutationData.foldChange}x</p>
                      </div>
                      <div>
                        <span className="text-[#4A4A4A]/70 text-sm">Population Frequency:</span>
                        <p className="font-medium">{(selectedMutationData.frequency * 100).toFixed(1)}%</p>
                      </div>
                      <div>
                        <span className="text-[#4A4A4A]/70 text-sm">Clinical Evidence:</span>
                        <Badge variant="outline" className={getEvidenceColor(selectedMutationData.clinicalEvidence)}>
                          {selectedMutationData.clinicalEvidence}
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <span className="text-[#4A4A4A]/70 text-sm">Affected Drugs:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {selectedMutationData.drugs.map((drug, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {drug}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <span className="text-[#4A4A4A]/70 text-sm">Cancer Types:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {selectedMutationData.cancerTypes.map((cancer, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {cancer}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <span className="text-[#4A4A4A]/70 text-sm">Co-occurring Mutations:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {selectedMutationData.coOccurringMutations.map((mutation, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {mutation}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="structural" className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <span className="text-[#4A4A4A]/70 text-sm">Binding Affinity Change:</span>
                        <div className="flex items-center gap-2">
                          <Progress
                            value={Math.abs(selectedMutationData.structuralImpact.bindingAffinity) * 20}
                            className="flex-1 h-2"
                          />
                          <span
                            className={`font-medium ${
                              selectedMutationData.structuralImpact.bindingAffinity < 0
                                ? "text-[#DC143C]"
                                : "text-[#2E8B57]"
                            }`}
                          >
                            {selectedMutationData.structuralImpact.bindingAffinity > 0 ? "+" : ""}
                            {selectedMutationData.structuralImpact.bindingAffinity.toFixed(1)} kcal/mol
                          </span>
                        </div>
                      </div>
                      <div>
                        <span className="text-[#4A4A4A]/70 text-sm">Protein Stability Change:</span>
                        <div className="flex items-center gap-2">
                          <Progress
                            value={Math.abs(selectedMutationData.structuralImpact.proteinStability) * 50}
                            className="flex-1 h-2"
                          />
                          <span
                            className={`font-medium ${
                              selectedMutationData.structuralImpact.proteinStability < 0
                                ? "text-[#DC143C]"
                                : "text-[#2E8B57]"
                            }`}
                          >
                            {selectedMutationData.structuralImpact.proteinStability > 0 ? "+" : ""}
                            {selectedMutationData.structuralImpact.proteinStability.toFixed(1)} kcal/mol
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <span className="text-[#4A4A4A]/70 text-sm">Conformational Change:</span>
                        <div className="flex items-center gap-2">
                          <Progress
                            value={selectedMutationData.structuralImpact.conformationalChange * 100}
                            className="flex-1 h-2"
                          />
                          <span className="font-medium text-[#FF8C00]">
                            {(selectedMutationData.structuralImpact.conformationalChange * 100).toFixed(0)}%
                          </span>
                        </div>
                      </div>
                      <div>
                        <span className="text-[#4A4A4A]/70 text-sm">Allosteric Effect:</span>
                        <div className="flex items-center gap-2">
                          <Progress
                            value={selectedMutationData.structuralImpact.allostericEffect * 100}
                            className="flex-1 h-2"
                          />
                          <span className="font-medium text-[#9370DB]">
                            {(selectedMutationData.structuralImpact.allostericEffect * 100).toFixed(0)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="clinical" className="space-y-4">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="text-center p-4 rounded-lg bg-[#F5F7FA]">
                      <div className="text-2xl font-bold text-[#DC143C]">
                        {(selectedMutationData.clinicalOutcome.responseRate * 100).toFixed(0)}%
                      </div>
                      <div className="text-sm text-[#4A4A4A]/70">Response Rate</div>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-[#F5F7FA]">
                      <div className="text-2xl font-bold text-[#FF8C00]">
                        {selectedMutationData.clinicalOutcome.progressionFreeTime}
                      </div>
                      <div className="text-sm text-[#4A4A4A]/70">PFS (months)</div>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-[#F5F7FA]">
                      <div className="text-2xl font-bold text-[#2E8B57]">
                        {selectedMutationData.clinicalOutcome.overallSurvival}
                      </div>
                      <div className="text-sm text-[#4A4A4A]/70">OS (months)</div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="alternatives" className="space-y-4">
                  <div className="space-y-3">
                    {selectedMutationData.alternativeTherapies.map((therapy, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-[#F5F7FA]">
                        <div className="flex items-center gap-3">
                          <Pill className="h-4 w-4 text-[#2E8B57]" />
                          <span className="font-medium">{therapy}</span>
                        </div>
                        <Badge variant="outline" className="bg-[#2E8B57]/10 text-[#2E8B57]">
                          Alternative
                        </Badge>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}
      </div>
    </TooltipProvider>
  )
}
