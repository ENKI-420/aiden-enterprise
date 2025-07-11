"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import {
  Activity,
  Play,
  Pause,
  RotateCcw,
  Settings,
  TrendingUp,
  TrendingDown,
  Heart,
  Brain,
  Zap,
  Target,
  Clock,
  BarChart3,
  LineChart,
  AlertTriangle,
  CheckCircle,
} from "lucide-react"

interface SimulationModel {
  id: string
  name: string
  type: "Disease Progression" | "Drug Response" | "Risk Assessment" | "Treatment Outcome"
  description: string
  parameters: Record<string, number>
  status: "Running" | "Completed" | "Paused" | "Failed"
  progress: number
  startTime: string
  estimatedDuration: number
  results?: SimulationResult[]
}

interface SimulationResult {
  timepoint: number
  biomarkers: Record<string, number>
  riskScore: number
  recommendations: string[]
  confidence: number
}

interface BiomarkerTrend {
  name: string
  current: number
  predicted: number
  unit: string
  trend: "increasing" | "decreasing" | "stable"
  significance: "high" | "medium" | "low"
}

export function HealthSimulationsPanel() {
  const [activeSimulation, setActiveSimulation] = useState<string | null>(null)
  const [selectedModel, setSelectedModel] = useState<string>("cancer-progression")
  const [simulationSpeed, setSimulationSpeed] = useState([1])
  const [showPredictions, setShowPredictions] = useState(true)
  const [timeHorizon, setTimeHorizon] = useState([12])

  const [simulations, setSimulations] = useState<SimulationModel[]>([
    {
      id: "sim_001",
      name: "BRCA1 Cancer Progression Model",
      type: "Disease Progression",
      description: "Simulating breast cancer progression in BRCA1 mutation carriers",
      parameters: {
        age: 45,
        mutationStatus: 1,
        familyHistory: 1,
        hormonalFactors: 0.7,
        lifestyle: 0.6,
      },
      status: "Running",
      progress: 73,
      startTime: "2024-01-15T10:00:00Z",
      estimatedDuration: 15,
    },
    {
      id: "sim_002",
      name: "Alzheimer's Risk Assessment",
      type: "Risk Assessment",
      description: "Long-term cognitive decline prediction with APOE4 variants",
      parameters: {
        age: 62,
        apoeStatus: 4,
        cognitiveBaseline: 28,
        education: 16,
        cardiovascularRisk: 0.4,
      },
      status: "Completed",
      progress: 100,
      startTime: "2024-01-15T08:30:00Z",
      estimatedDuration: 20,
      results: [
        {
          timepoint: 0,
          biomarkers: { "Amyloid-β": 450, Tau: 280, MMSE: 28, "Hippocampal Volume": 3200 },
          riskScore: 35,
          recommendations: ["Baseline cognitive assessment", "Lifestyle interventions"],
          confidence: 0.85,
        },
        {
          timepoint: 6,
          biomarkers: { "Amyloid-β": 520, Tau: 320, MMSE: 26, "Hippocampal Volume": 3100 },
          riskScore: 45,
          recommendations: ["Enhanced monitoring", "Consider clinical trial enrollment"],
          confidence: 0.78,
        },
        {
          timepoint: 12,
          biomarkers: { "Amyloid-β": 610, Tau: 380, MMSE: 24, "Hippocampal Volume": 2950 },
          riskScore: 62,
          recommendations: ["Pharmacological intervention", "Caregiver support planning"],
          confidence: 0.72,
        },
      ],
    },
    {
      id: "sim_003",
      name: "Pharmacogenomic Response Prediction",
      type: "Drug Response",
      description: "Predicting response to targeted therapy based on genomic profile",
      parameters: {
        drugConcentration: 50,
        metabolizerStatus: 2,
        tumorMutationBurden: 15,
        immuneProfile: 0.8,
      },
      status: "Paused",
      progress: 45,
      startTime: "2024-01-15T14:00:00Z",
      estimatedDuration: 10,
    },
  ])

  const modelTemplates = [
    {
      id: "cancer-progression",
      name: "Cancer Progression Model",
      description: "Simulate tumor growth and metastasis patterns",
      icon: Target,
      color: "#DC143C",
    },
    {
      id: "alzheimers-risk",
      name: "Alzheimer's Risk Model",
      description: "Predict cognitive decline and dementia onset",
      icon: Brain,
      color: "#4A90E2",
    },
    {
      id: "cardiovascular-risk",
      name: "Cardiovascular Risk Model",
      description: "Assess heart disease and stroke probability",
      icon: Heart,
      color: "#DC143C",
    },
    {
      id: "drug-response",
      name: "Drug Response Model",
      description: "Predict therapeutic efficacy and adverse effects",
      icon: Zap,
      color: "#2E8B57",
    },
  ]

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSimulations((prev) =>
        prev.map((sim) => {
          if (sim.status === "Running" && sim.progress < 100) {
            const newProgress = Math.min(sim.progress + Math.random() * 3 * simulationSpeed[0], 100)
            return {
              ...sim,
              progress: newProgress,
              status: newProgress >= 100 ? "Completed" : "Running",
            }
          }
          return sim
        }),
      )
    }, 2000)

    return () => clearInterval(interval)
  }, [simulationSpeed])

  const getBiomarkerTrends = (simulationId: string): BiomarkerTrend[] => {
    const trends = {
      sim_002: [
        {
          name: "Amyloid-β",
          current: 450,
          predicted: 610,
          unit: "pg/mL",
          trend: "increasing" as const,
          significance: "high" as const,
        },
        {
          name: "Tau Protein",
          current: 280,
          predicted: 380,
          unit: "pg/mL",
          trend: "increasing" as const,
          significance: "high" as const,
        },
        {
          name: "MMSE Score",
          current: 28,
          predicted: 24,
          unit: "points",
          trend: "decreasing" as const,
          significance: "medium" as const,
        },
        {
          name: "Hippocampal Volume",
          current: 3200,
          predicted: 2950,
          unit: "mm³",
          trend: "decreasing" as const,
          significance: "high" as const,
        },
      ],
    }

    return trends[simulationId as keyof typeof trends] || []
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Running":
        return "text-[#1E90FF]"
      case "Completed":
        return "text-[#2E8B57]"
      case "Paused":
        return "text-[#FF8C00]"
      case "Failed":
        return "text-[#DC143C]"
      default:
        return "text-[#4A4A4A]"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Running":
        return <Play className="h-4 w-4 text-[#1E90FF]" />
      case "Completed":
        return <CheckCircle className="h-4 w-4 text-[#2E8B57]" />
      case "Paused":
        return <Pause className="h-4 w-4 text-[#FF8C00]" />
      case "Failed":
        return <AlertTriangle className="h-4 w-4 text-[#DC143C]" />
      default:
        return <Clock className="h-4 w-4 text-[#4A4A4A]" />
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "increasing":
        return <TrendingUp className="h-4 w-4 text-[#DC143C]" />
      case "decreasing":
        return <TrendingDown className="h-4 w-4 text-[#2E8B57]" />
      default:
        return <Activity className="h-4 w-4 text-[#FF8C00]" />
    }
  }

  const handleStartSimulation = () => {
    const newSimulation: SimulationModel = {
      id: `sim_${Date.now()}`,
      name: `New ${modelTemplates.find((m) => m.id === selectedModel)?.name}`,
      type: "Disease Progression",
      description: "Custom simulation based on patient parameters",
      parameters: {},
      status: "Running",
      progress: 0,
      startTime: new Date().toISOString(),
      estimatedDuration: 15,
    }

    setSimulations((prev) => [newSimulation, ...prev])
    setActiveSimulation(newSimulation.id)
  }

  const handlePauseResume = (simulationId: string) => {
    setSimulations((prev) =>
      prev.map((sim) =>
        sim.id === simulationId ? { ...sim, status: sim.status === "Running" ? "Paused" : "Running" } : sim,
      ),
    )
  }

  const handleReset = (simulationId: string) => {
    setSimulations((prev) =>
      prev.map((sim) => (sim.id === simulationId ? { ...sim, status: "Paused", progress: 0 } : sim)),
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#4A4A4A] flex items-center gap-2">
            <Activity className="h-6 w-6 text-[#1E90FF]" />
            Health Simulations Engine
          </h2>
          <p className="text-[#4A4A4A]/70">Advanced predictive modeling for personalized medicine</p>
        </div>

        <div className="flex items-center gap-2">
          <Select value={selectedModel} onValueChange={setSelectedModel}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {modelTemplates.map((template) => (
                <SelectItem key={template.id} value={template.id}>
                  <div className="flex items-center gap-2">
                    <template.icon className="h-4 w-4" style={{ color: template.color }} />
                    {template.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleStartSimulation} className="bg-[#1E90FF] hover:bg-[#1E90FF]/90">
            <Play className="h-4 w-4 mr-2" />
            Start Simulation
          </Button>
        </div>
      </div>

      {/* Model Templates */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-[#2E8B57]" />
            Simulation Models
          </CardTitle>
          <CardDescription>Choose from pre-configured simulation models</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            {modelTemplates.map((template) => (
              <div
                key={template.id}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedModel === template.id ? "ring-2 ring-[#1E90FF] bg-[#1E90FF]/5" : "hover:bg-gray-50"
                }`}
                onClick={() => setSelectedModel(template.id)}
              >
                <div className="text-center">
                  <template.icon className="h-8 w-8 mx-auto mb-2" style={{ color: template.color }} />
                  <h3 className="font-medium text-[#4A4A4A] mb-1">{template.name}</h3>
                  <p className="text-sm text-[#4A4A4A]/70">{template.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Simulation Controls */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-[#4A4A4A]" />
            Simulation Controls
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Simulation Speed</label>
              <Slider
                value={simulationSpeed}
                onValueChange={setSimulationSpeed}
                min={0.1}
                max={5}
                step={0.1}
                className="w-full"
              />
              <div className="text-xs text-center">{simulationSpeed[0].toFixed(1)}x</div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Time Horizon (months)</label>
              <Slider value={timeHorizon} onValueChange={setTimeHorizon} min={1} max={60} step={1} className="w-full" />
              <div className="text-xs text-center">{timeHorizon[0]} months</div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Show Predictions</label>
              <div className="flex items-center space-x-2">
                <Switch checked={showPredictions} onCheckedChange={setShowPredictions} />
                <span className="text-sm">Enable forecasting</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Active Simulations</label>
              <div className="text-2xl font-bold text-[#1E90FF]">
                {simulations.filter((s) => s.status === "Running").length}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Simulations */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-[#1E90FF]" />
            Active Simulations
          </CardTitle>
          <CardDescription>Monitor running simulations and view results</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {simulations.map((simulation) => (
              <div key={simulation.id} className="p-4 rounded-lg border bg-[#F5F7FA]">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(simulation.status)}
                    <div>
                      <h4 className="font-medium text-[#4A4A4A]">{simulation.name}</h4>
                      <p className="text-sm text-[#4A4A4A]/70">{simulation.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={getStatusColor(simulation.status)}>
                      {simulation.status}
                    </Badge>
                    <Badge variant="outline">{simulation.type}</Badge>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progress</span>
                      <span>{simulation.progress.toFixed(1)}%</span>
                    </div>
                    <Progress value={simulation.progress} className="h-2" />
                  </div>

                  <div className="text-sm">
                    <span className="text-[#4A4A4A]/70">Started:</span>
                    <p className="font-medium">{new Date(simulation.startTime).toLocaleString()}</p>
                  </div>

                  <div className="text-sm">
                    <span className="text-[#4A4A4A]/70">Est. Duration:</span>
                    <p className="font-medium">{simulation.estimatedDuration} minutes</p>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePauseResume(simulation.id)}
                      disabled={simulation.status === "Completed"}
                    >
                      {simulation.status === "Running" ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleReset(simulation.id)}>
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveSimulation(simulation.id)}
                    disabled={!simulation.results}
                  >
                    <BarChart3 className="h-4 w-4 mr-2" />
                    View Results
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Simulation Results */}
      {activeSimulation && (
        <Tabs defaultValue="biomarkers" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="biomarkers">Biomarkers</TabsTrigger>
            <TabsTrigger value="predictions">Predictions</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            <TabsTrigger value="parameters">Parameters</TabsTrigger>
          </TabsList>

          <TabsContent value="biomarkers" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="h-5 w-5 text-[#2E8B57]" />
                  Biomarker Trends
                </CardTitle>
                <CardDescription>Real-time biomarker changes and predictions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {getBiomarkerTrends(activeSimulation).map((trend, index) => (
                    <div key={index} className="p-4 rounded-lg border bg-white">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-[#4A4A4A]">{trend.name}</h4>
                          {getTrendIcon(trend.trend)}
                        </div>
                        <Badge
                          variant="outline"
                          className={
                            trend.significance === "high"
                              ? "bg-[#DC143C]/10 text-[#DC143C]"
                              : trend.significance === "medium"
                                ? "bg-[#FF8C00]/10 text-[#FF8C00]"
                                : "bg-[#2E8B57]/10 text-[#2E8B57]"
                          }
                        >
                          {trend.significance} significance
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-[#4A4A4A]/70">Current:</span>
                          <p className="font-medium text-lg">
                            {trend.current} {trend.unit}
                          </p>
                        </div>
                        <div>
                          <span className="text-[#4A4A4A]/70">Predicted:</span>
                          <p
                            className={`font-medium text-lg ${
                              trend.trend === "increasing" ? "text-[#DC143C]" : "text-[#2E8B57]"
                            }`}
                          >
                            {trend.predicted} {trend.unit}
                          </p>
                        </div>
                      </div>

                      <div className="mt-3">
                        <div className="flex justify-between text-xs mb-1">
                          <span>Change</span>
                          <span>
                            {trend.trend === "increasing" ? "+" : ""}
                            {(((trend.predicted - trend.current) / trend.current) * 100).toFixed(1)}%
                          </span>
                        </div>
                        <Progress
                          value={Math.abs(((trend.predicted - trend.current) / trend.current) * 100)}
                          className="h-2"
                        />
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
                  Predictive Analysis
                </CardTitle>
                <CardDescription>Long-term health outcome predictions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border flex items-center justify-center">
                  <div className="text-center">
                    <LineChart className="h-12 w-12 text-[#1E90FF] mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-[#4A4A4A] mb-2">Predictive Timeline</h3>
                    <p className="text-[#4A4A4A]/70 mb-4">
                      Interactive timeline showing predicted health outcomes over {timeHorizon[0]} months
                    </p>
                    <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
                      <div className="p-3 bg-white rounded border">
                        <div className="text-sm font-medium text-[#4A4A4A]">Risk Score</div>
                        <div className="text-2xl font-bold text-[#DC143C]">62%</div>
                      </div>
                      <div className="p-3 bg-white rounded border">
                        <div className="text-sm font-medium text-[#4A4A4A]">Confidence</div>
                        <div className="text-2xl font-bold text-[#2E8B57]">72%</div>
                      </div>
                      <div className="p-3 bg-white rounded border">
                        <div className="text-sm font-medium text-[#4A4A4A]">Time to Event</div>
                        <div className="text-2xl font-bold text-[#FF8C00]">18mo</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-[#2E8B57]" />
                  Clinical Recommendations
                </CardTitle>
                <CardDescription>AI-generated recommendations based on simulation results</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      priority: "High",
                      category: "Monitoring",
                      recommendation: "Increase cognitive assessment frequency to every 3 months",
                      rationale: "Accelerated biomarker changes indicate need for enhanced surveillance",
                    },
                    {
                      priority: "Medium",
                      category: "Treatment",
                      recommendation: "Consider enrollment in clinical trial for early intervention",
                      rationale: "Patient profile matches inclusion criteria for promising therapeutic studies",
                    },
                    {
                      priority: "Medium",
                      category: "Lifestyle",
                      recommendation: "Implement structured cognitive training program",
                      rationale: "Evidence suggests potential to slow cognitive decline in high-risk individuals",
                    },
                    {
                      priority: "Low",
                      category: "Family",
                      recommendation: "Genetic counseling for family members",
                      rationale: "APOE4 status has implications for relatives' risk assessment",
                    },
                  ].map((rec, index) => (
                    <div key={index} className="p-4 rounded-lg border bg-white">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <Badge
                            className={
                              rec.priority === "High"
                                ? "bg-[#DC143C] text-white"
                                : rec.priority === "Medium"
                                  ? "bg-[#FF8C00] text-white"
                                  : "bg-[#2E8B57] text-white"
                            }
                          >
                            {rec.priority} Priority
                          </Badge>
                          <Badge variant="outline">{rec.category}</Badge>
                        </div>
                      </div>
                      <h4 className="font-medium text-[#4A4A4A] mb-2">{rec.recommendation}</h4>
                      <p className="text-sm text-[#4A4A4A]/70">{rec.rationale}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="parameters" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-[#4A4A4A]" />
                  Simulation Parameters
                </CardTitle>
                <CardDescription>Model inputs and configuration settings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium text-[#4A4A4A]">Patient Parameters</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-[#4A4A4A]/70">Age</span>
                        <span className="font-medium">62 years</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-[#4A4A4A]/70">APOE Status</span>
                        <Badge variant="outline" className="bg-[#DC143C]/10 text-[#DC143C]">
                          ε4/ε4
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-[#4A4A4A]/70">Baseline MMSE</span>
                        <span className="font-medium">28/30</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-[#4A4A4A]/70">Education</span>
                        <span className="font-medium">16 years</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-[#4A4A4A]">Model Configuration</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-[#4A4A4A]/70">Time Horizon</span>
                        <span className="font-medium">{timeHorizon[0]} months</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-[#4A4A4A]/70">Simulation Speed</span>
                        <span className="font-medium">{simulationSpeed[0].toFixed(1)}x</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-[#4A4A4A]/70">Confidence Interval</span>
                        <span className="font-medium">95%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-[#4A4A4A]/70">Monte Carlo Runs</span>
                        <span className="font-medium">10,000</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
