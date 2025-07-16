"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Dna, Shield, Activity, Search, Filter, BarChart, Lightbulb, Stethoscope } from "lucide-react"

interface Mutation {
  id: string
  gene: string
  aminoAcidChange: string // e.g., "V600E"
  nucleotideChange: string // e.g., "c.1799T>A"
  type: "missense" | "nonsense" | "frameshift" | "deletion" | "insertion"
  resistanceLevel: "high" | "medium" | "low" | "none"
  mechanism: string // e.g., "Altered drug binding", "Increased efflux"
  clinicalSignificance: string // e.g., "Resistant to Drug A", "Reduced efficacy of Drug B"
  prevalence: number // percentage
  structuralImpact: string // e.g., "Disrupts active site", "Stabilizes inactive conformation"
  allostericEffect: string // e.g., "Modulates allosteric site X"
  alternativeTherapies: string[]
}

interface DrugResistanceAnalyzerProps {
  patientId: string
  drugName: string
  mutations: Mutation[]
}

export function DrugResistanceAnalyzer({ patientId, drugName, mutations }: DrugResistanceAnalyzerProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterGene, setFilterGene] = useState("all")
  const [filterResistance, setFilterResistance] = useState("all")
  const [analysisTab, setAnalysisTab] = useState("overview")

  const uniqueGenes = Array.from(new Set(mutations.map((m) => m.gene)))

  const filteredMutations = mutations.filter((mutation) => {
    const matchesSearch =
      searchTerm === "" ||
      mutation.aminoAcidChange.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mutation.gene.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mutation.mechanism.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesGene = filterGene === "all" || mutation.gene === filterGene
    const matchesResistance = filterResistance === "all" || mutation.resistanceLevel === filterResistance

    return matchesSearch && matchesGene && matchesResistance
  })

  const getResistanceColor = (level: string) => {
    switch (level) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-orange-100 text-orange-800"
      case "low":
        return "bg-yellow-100 text-yellow-800"
      case "none":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const calculateOverallResistance = useCallback(() => {
    if (mutations.length === 0) return { level: "none", score: 0 }

    let totalScore = 0
    mutations.forEach((m) => {
      if (m.resistanceLevel === "high") totalScore += 3
      else if (m.resistanceLevel === "medium") totalScore += 2
      else if (m.resistanceLevel === "low") totalScore += 1
    })

    const maxScore = mutations.length * 3
    const scorePercentage = maxScore > 0 ? (totalScore / maxScore) * 100 : 0

    let overallLevel: "high" | "medium" | "low" | "none" = "none"
    if (scorePercentage > 70) overallLevel = "high"
    else if (scorePercentage > 40) overallLevel = "medium"
    else if (scorePercentage > 10) overallLevel = "low"

    return { level: overallLevel, score: Number.parseFloat(scorePercentage.toFixed(1)) }
  }, [mutations])

  const overallResistance = calculateOverallResistance()

  return (
    <TooltipProvider>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-[#DC143C]" />
            Drug Resistance Mutation Analysis: {drugName}
          </CardTitle>
          <CardDescription>
            Analyze patient-specific mutations to predict drug resistance and elucidate mechanisms.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search mutations, genes, or mechanisms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 w-full"
              />
            </div>
            <div className="w-full md:w-auto">
              <Select value={filterGene} onValueChange={setFilterGene}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <Filter className="h-4 w-4 mr-2 text-gray-500" />
                  <SelectValue placeholder="Filter by Gene" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Genes</SelectItem>
                  {uniqueGenes.map((gene) => (
                    <SelectItem key={gene} value={gene}>
                      {gene}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-full md:w-auto">
              <Select value={filterResistance} onValueChange={setFilterResistance}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <Shield className="h-4 w-4 mr-2 text-gray-500" />
                  <SelectValue placeholder="Filter by Resistance" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="high">High Resistance</SelectItem>
                  <SelectItem value="medium">Medium Resistance</SelectItem>
                  <SelectItem value="low">Low Resistance</SelectItem>
                  <SelectItem value="none">No Resistance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-red-50 border-red-200">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-red-700">Overall Resistance Level</p>
                  <p className="text-xl font-bold text-red-900 capitalize">{overallResistance.level}</p>
                </div>
                <Shield className="h-8 w-8 text-red-500" />
              </CardContent>
            </Card>
            <Card className="bg-purple-50 border-purple-200">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-700">Resistance Score</p>
                  <p className="text-xl font-bold text-purple-900">{overallResistance.score}%</p>
                </div>
                <BarChart className="h-8 w-8 text-purple-500" />
              </CardContent>
            </Card>
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-700">Total Mutations Found</p>
                  <p className="text-xl font-bold text-blue-900">{mutations.length}</p>
                </div>
                <Dna className="h-8 w-8 text-blue-500" />
              </CardContent>
            </Card>
          </div>

          <Tabs value={analysisTab} onValueChange={(value: any) => setAnalysisTab(value)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Mutation Overview</TabsTrigger>
              <TabsTrigger value="mechanisms">Mechanisms & Impact</TabsTrigger>
              <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="mt-4">
              <div className="space-y-4">
                {filteredMutations.length === 0 ? (
                  <p className="text-center text-gray-500">No mutations found matching your criteria.</p>
                ) : (
                  filteredMutations.map((mutation) => (
                    <Card key={mutation.id} className="border-0 shadow-sm bg-gray-50">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="text-lg font-semibold text-[#4A4A4A]">
                              {mutation.gene}: {mutation.aminoAcidChange}
                            </h3>
                            <p className="text-sm text-[#4A4A4A]/70">{mutation.nucleotideChange}</p>
                          </div>
                          <Badge className={getResistanceColor(mutation.resistanceLevel)}>
                            {mutation.resistanceLevel} Resistance
                          </Badge>
                        </div>
                        <p className="text-sm text-[#4A4A4A]/80 mb-2">{mutation.clinicalSignificance}</p>
                        <div className="flex items-center gap-2 text-sm text-[#4A4A4A]/70">
                          <Activity className="h-4 w-4" />
                          <span>Type: {mutation.type}</span>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="ml-4 flex items-center gap-1">
                                <BarChart className="h-4 w-4" /> Prevalence: {mutation.prevalence.toFixed(1)}%
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Percentage of population with this mutation.</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>
            <TabsContent value="mechanisms" className="mt-4">
              <div className="space-y-4">
                {filteredMutations.length === 0 ? (
                  <p className="text-center text-gray-500">No mutations found for mechanism analysis.</p>
                ) : (
                  filteredMutations.map((mutation) => (
                    <Card key={mutation.id} className="border-0 shadow-sm bg-gray-50">
                      <CardContent className="p-4">
                        <h3 className="text-lg font-semibold text-[#4A4A4A] mb-2">
                          {mutation.gene}: {mutation.aminoAcidChange} - Mechanism
                        </h3>
                        <div className="space-y-2 text-sm">
                          <div>
                            <p className="text-[#4A4A4A]/70">Mechanism of Resistance:</p>
                            <p className="font-medium">{mutation.mechanism}</p>
                          </div>
                          <div>
                            <p className="text-[#4A4A4A]/70">Structural Impact:</p>
                            <p className="font-medium">{mutation.structuralImpact}</p>
                          </div>
                          {mutation.allostericEffect && (
                            <div>
                              <p className="text-[#4A4A4A]/70">Allosteric Effect:</p>
                              <p className="font-medium">{mutation.allostericEffect}</p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>
            <TabsContent value="recommendations" className="mt-4">
              <div className="space-y-4">
                {filteredMutations.length === 0 ? (
                  <p className="text-center text-gray-500">No mutations to provide recommendations for.</p>
                ) : (
                  <>
                    <Card className="border-0 shadow-sm bg-green-50">
                      <CardContent className="p-4">
                        <h3 className="text-lg font-semibold text-green-800 flex items-center gap-2 mb-2">
                          <Lightbulb className="h-5 w-5" /> Alternative Therapy Recommendations
                        </h3>
                        <ul className="list-disc list-inside text-sm text-green-700 space-y-1">
                          {Array.from(new Set(filteredMutations.flatMap((m) => m.alternativeTherapies))).map(
                            (therapy, index) => (
                              <li key={index}>{therapy}</li>
                            ),
                          )}
                          {Array.from(new Set(filteredMutations.flatMap((m) => m.alternativeTherapies))).length ===
                            0 && <li>No specific alternative therapies recommended based on current mutations.</li>}
                        </ul>
                      </CardContent>
                    </Card>
                    <Card className="border-0 shadow-sm bg-yellow-50">
                      <CardContent className="p-4">
                        <h3 className="text-lg font-semibold text-yellow-800 flex items-center gap-2 mb-2">
                          <Stethoscope className="h-5 w-5" /> Clinical Outcome Integration
                        </h3>
                        <p className="text-sm text-yellow-700">
                          Integrate with patient's clinical history and treatment response data for personalized
                          recommendations.
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-3 bg-transparent text-yellow-800 border-yellow-300 hover:bg-yellow-100"
                        >
                          View Clinical History
                        </Button>
                      </CardContent>
                    </Card>
                  </>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </TooltipProvider>
  )
}
