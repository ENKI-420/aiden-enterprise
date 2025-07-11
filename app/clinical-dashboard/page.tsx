"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Activity,
  Users,
  AlertTriangle,
  Brain,
  Dna,
  Zap,
  Target,
  BarChart3,
  Clock,
  CheckCircle,
  Atom,
} from "lucide-react"
import { GenomicAnalyticsPanel } from "@/components/clinical/genomic-analytics-panel"
import { PatientProfilesPanel } from "@/components/clinical/patient-profiles-panel"
import { HealthSimulationsPanel } from "@/components/clinical/health-simulations-panel"
import { DataUploadPanel } from "@/components/clinical/data-upload-panel"
import { ClinicalSettingsPanel } from "@/components/clinical/clinical-settings-panel"
import { ThreeDVisualizationPanel } from "@/components/clinical/3d-visualization-panel"

interface DashboardMetrics {
  totalPatients: number
  activeAnalyses: number
  criticalAlerts: number
  completedStudies: number
  genomicSequenced: number
  runningSimulations: number
}

interface SystemAlert {
  id: string
  type: "Critical" | "Warning" | "Info"
  message: string
  timestamp: string
  specialty?: string
  patientId?: string
}

export default function ClinicalDashboard() {
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("oncology")
  const [activeTab, setActiveTab] = useState("overview")
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalPatients: 1247,
    activeAnalyses: 23,
    criticalAlerts: 5,
    completedStudies: 89,
    genomicSequenced: 892,
    runningSimulations: 7,
  })

  const [systemAlerts] = useState<SystemAlert[]>([
    {
      id: "alert_001",
      type: "Critical",
      message: "High-risk BRCA1 variant detected in patient MRN-2024-001",
      timestamp: "2024-01-15T10:30:00Z",
      specialty: "oncology",
      patientId: "pt_001",
    },
    {
      id: "alert_002",
      type: "Warning",
      message: "Simulation convergence issue in Alzheimer's risk model",
      timestamp: "2024-01-15T09:45:00Z",
      specialty: "neurology",
    },
    {
      id: "alert_003",
      type: "Info",
      message: "New genomic analysis pipeline completed successfully",
      timestamp: "2024-01-15T08:15:00Z",
    },
    {
      id: "alert_004",
      type: "Critical",
      message: "Drug interaction alert for patient MRN-2024-004",
      timestamp: "2024-01-15T07:30:00Z",
      specialty: "oncology",
      patientId: "pt_004",
    },
  ])

  const specialties = [
    { id: "oncology", name: "Oncology", icon: Target, color: "#DC143C", patients: 342 },
    { id: "neurology", name: "Neurology", icon: Brain, color: "#4A90E2", patients: 198 },
    { id: "immunotherapy", name: "Immunotherapy", icon: Zap, color: "#2E8B57", patients: 156 },
    { id: "osteology", name: "Osteology", icon: Activity, color: "#FF8C00", patients: 89 },
    { id: "nervous-system", name: "Nervous System", icon: Activity, color: "#9370DB", patients: 134 },
  ]

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics((prev) => ({
        ...prev,
        activeAnalyses: prev.activeAnalyses + Math.floor(Math.random() * 3) - 1,
        runningSimulations: Math.max(0, prev.runningSimulations + Math.floor(Math.random() * 3) - 1),
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const getAlertColor = (type: string) => {
    switch (type) {
      case "Critical":
        return "bg-[#DC143C] text-white"
      case "Warning":
        return "bg-[#FF8C00] text-white"
      case "Info":
        return "bg-[#1E90FF] text-white"
      default:
        return "bg-[#4A4A4A] text-white"
    }
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "Critical":
        return <AlertTriangle className="h-4 w-4" />
      case "Warning":
        return <Clock className="h-4 w-4" />
      case "Info":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <Activity className="h-4 w-4" />
    }
  }

  const selectedSpecialtyData = specialties.find((s) => s.id === selectedSpecialty)

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F7FA] to-[#C3CFE2] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#4A4A4A] flex items-center gap-3">
              <Activity className="h-8 w-8 text-[#1E90FF]" />
              Clinical Dashboard
            </h1>
            <p className="text-[#4A4A4A]/70 mt-1">Advanced genomic analytics and patient management platform</p>
          </div>

          <div className="flex items-center gap-3">
            <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {specialties.map((specialty) => (
                  <SelectItem key={specialty.id} value={specialty.id}>
                    <div className="flex items-center gap-2">
                      <specialty.icon className="h-4 w-4" style={{ color: specialty.color }} />
                      {specialty.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Badge variant="outline" className="bg-white">
              {selectedSpecialtyData?.patients} patients
            </Badge>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#4A4A4A]/70">Total Patients</p>
                  <p className="text-2xl font-bold text-[#4A4A4A]">{metrics.totalPatients.toLocaleString()}</p>
                </div>
                <Users className="h-8 w-8 text-[#1E90FF]" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#4A4A4A]/70">Active Analyses</p>
                  <p className="text-2xl font-bold text-[#2E8B57]">{metrics.activeAnalyses}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-[#2E8B57]" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#4A4A4A]/70">Critical Alerts</p>
                  <p className="text-2xl font-bold text-[#DC143C]">{metrics.criticalAlerts}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-[#DC143C]" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#4A4A4A]/70">Completed Studies</p>
                  <p className="text-2xl font-bold text-[#FF8C00]">{metrics.completedStudies}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-[#FF8C00]" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#4A4A4A]/70">Genomic Sequenced</p>
                  <p className="text-2xl font-bold text-[#9370DB]">{metrics.genomicSequenced}</p>
                </div>
                <Dna className="h-8 w-8 text-[#9370DB]" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#4A4A4A]/70">Running Simulations</p>
                  <p className="text-2xl font-bold text-[#1E90FF]">{metrics.runningSimulations}</p>
                </div>
                <Activity className="h-8 w-8 text-[#1E90FF]" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* System Alerts */}
        <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-[#DC143C]" />
              System Alerts
            </CardTitle>
            <CardDescription>Real-time notifications and critical updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {systemAlerts.slice(0, 4).map((alert) => (
                <div key={alert.id} className="flex items-start gap-3 p-3 rounded-lg border bg-[#F5F7FA]">
                  <Badge className={getAlertColor(alert.type)}>
                    {getAlertIcon(alert.type)}
                    {alert.type}
                  </Badge>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[#4A4A4A]">{alert.message}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-[#4A4A4A]/50">{new Date(alert.timestamp).toLocaleString()}</span>
                      {alert.specialty && (
                        <Badge variant="outline" className="text-xs">
                          {alert.specialty}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main Dashboard Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-7 bg-white/90 backdrop-blur-sm">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="genomics">Genomic Analytics</TabsTrigger>
            <TabsTrigger value="patients">Patient Profiles</TabsTrigger>
            <TabsTrigger value="simulations">Health Simulations</TabsTrigger>
            <TabsTrigger value="3d-visualization">3D Visualization</TabsTrigger>
            <TabsTrigger value="data-upload">Data Upload</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Specialty Overview */}
            <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {selectedSpecialtyData && (
                    <selectedSpecialtyData.icon className="h-5 w-5" style={{ color: selectedSpecialtyData.color }} />
                  )}
                  {selectedSpecialtyData?.name} Overview
                </CardTitle>
                <CardDescription>
                  Comprehensive analytics for {selectedSpecialtyData?.name.toLowerCase()} patients and research
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Patient Distribution */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-[#4A4A4A]">Patient Distribution</h4>
                    <div className="space-y-3">
                      {specialties.map((specialty) => (
                        <div key={specialty.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <specialty.icon className="h-4 w-4" style={{ color: specialty.color }} />
                            <span className="text-sm">{specialty.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{specialty.patients}</span>
                            <div className="w-16 h-2 bg-gray-200 rounded-full">
                              <div
                                className="h-2 rounded-full"
                                style={{
                                  backgroundColor: specialty.color,
                                  width: `${(specialty.patients / 342) * 100}%`,
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-[#4A4A4A]">Recent Activity</h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-sm">
                        <div className="w-2 h-2 bg-[#2E8B57] rounded-full" />
                        <span>Genomic analysis completed for 12 patients</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <div className="w-2 h-2 bg-[#1E90FF] rounded-full" />
                        <span>3 new simulations started</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <div className="w-2 h-2 bg-[#FF8C00] rounded-full" />
                        <span>Risk assessment updated for high-risk cohort</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <div className="w-2 h-2 bg-[#DC143C] rounded-full" />
                        <span>2 critical variants identified</span>
                      </div>
                    </div>
                  </div>

                  {/* Performance Metrics */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-[#4A4A4A]">Performance Metrics</h4>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Analysis Completion Rate</span>
                          <span>94%</span>
                        </div>
                        <Progress value={94} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Data Quality Score</span>
                          <span>87%</span>
                        </div>
                        <Progress value={87} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>System Uptime</span>
                          <span>99.8%</span>
                        </div>
                        <Progress value={99.8} className="h-2" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Frequently used tools and shortcuts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-4">
                  <Button
                    variant="outline"
                    className="h-20 flex flex-col gap-2 bg-transparent"
                    onClick={() => setActiveTab("genomics")}
                  >
                    <Dna className="h-6 w-6 text-[#1E90FF]" />
                    <span>Genomic Analysis</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex flex-col gap-2 bg-transparent"
                    onClick={() => setActiveTab("patients")}
                  >
                    <Users className="h-6 w-6 text-[#2E8B57]" />
                    <span>Patient Profiles</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex flex-col gap-2 bg-transparent"
                    onClick={() => setActiveTab("simulations")}
                  >
                    <Activity className="h-6 w-6 text-[#FF8C00]" />
                    <span>Run Simulation</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex flex-col gap-2 bg-transparent"
                    onClick={() => setActiveTab("3d-visualization")}
                  >
                    <Atom className="h-6 w-6 text-[#DC143C]" />
                    <span>3D Visualization</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="genomics">
            <GenomicAnalyticsPanel />
          </TabsContent>

          <TabsContent value="patients">
            <PatientProfilesPanel />
          </TabsContent>

          <TabsContent value="simulations">
            <HealthSimulationsPanel />
          </TabsContent>

          <TabsContent value="3d-visualization">
            <ThreeDVisualizationPanel specialty={selectedSpecialty} />
          </TabsContent>

          <TabsContent value="data-upload">
            <DataUploadPanel />
          </TabsContent>

          <TabsContent value="settings">
            <ClinicalSettingsPanel />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
