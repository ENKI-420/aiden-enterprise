"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import {
  Users,
  User,
  Heart,
  Brain,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  Search,
  Filter,
  Plus,
  Calendar,
  Dna,
  Pill,
  TrendingUp,
  TrendingDown,
} from "lucide-react"

interface Patient {
  id: string
  name: string
  age: number
  gender: "Male" | "Female" | "Other"
  mrn: string
  diagnosis: string[]
  riskScore: number
  genomicStatus: "Sequenced" | "Pending" | "Not Available"
  lastVisit: string
  nextAppointment?: string
  criticalAlerts: number
  medications: string[]
  allergies: string[]
  familyHistory: string[]
  genomicVariants?: number
  clinicalTrials?: number
}

interface ClinicalNote {
  id: string
  patientId: string
  date: string
  type: "Progress Note" | "Consultation" | "Lab Results" | "Genomic Report"
  provider: string
  content: string
  tags: string[]
  priority: "High" | "Medium" | "Low"
}

interface RiskAssessment {
  category: string
  score: number
  factors: string[]
  recommendations: string[]
  trend: "increasing" | "stable" | "decreasing"
}

export function PatientProfilesPanel() {
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [activeTab, setActiveTab] = useState("overview")

  const [patients] = useState<Patient[]>([
    {
      id: "pt_001",
      name: "Sarah Johnson",
      age: 45,
      gender: "Female",
      mrn: "MRN-2024-001",
      diagnosis: ["Breast Cancer", "BRCA1 Mutation"],
      riskScore: 85,
      genomicStatus: "Sequenced",
      lastVisit: "2024-01-10",
      nextAppointment: "2024-01-25",
      criticalAlerts: 2,
      medications: ["Tamoxifen", "Metformin", "Lisinopril"],
      allergies: ["Penicillin", "Sulfa drugs"],
      familyHistory: ["Breast cancer (mother)", "Ovarian cancer (aunt)"],
      genomicVariants: 12,
      clinicalTrials: 3,
    },
    {
      id: "pt_002",
      name: "Michael Chen",
      age: 62,
      gender: "Male",
      mrn: "MRN-2024-002",
      diagnosis: ["Alzheimer's Disease", "Type 2 Diabetes"],
      riskScore: 72,
      genomicStatus: "Sequenced",
      lastVisit: "2024-01-08",
      nextAppointment: "2024-01-22",
      criticalAlerts: 1,
      medications: ["Donepezil", "Metformin", "Atorvastatin"],
      allergies: ["None known"],
      familyHistory: ["Alzheimer's (father)", "Diabetes (mother)"],
      genomicVariants: 8,
      clinicalTrials: 1,
    },
    {
      id: "pt_003",
      name: "Emily Rodriguez",
      age: 34,
      gender: "Female",
      mrn: "MRN-2024-003",
      diagnosis: ["Lynch Syndrome", "Colorectal Cancer Risk"],
      riskScore: 68,
      genomicStatus: "Pending",
      lastVisit: "2024-01-12",
      criticalAlerts: 0,
      medications: ["Aspirin", "Folic Acid"],
      allergies: ["Latex"],
      familyHistory: ["Colorectal cancer (father)", "Endometrial cancer (grandmother)"],
      genomicVariants: 0,
      clinicalTrials: 2,
    },
    {
      id: "pt_004",
      name: "David Thompson",
      age: 58,
      gender: "Male",
      mrn: "MRN-2024-004",
      diagnosis: ["Lung Cancer", "EGFR Mutation"],
      riskScore: 91,
      genomicStatus: "Sequenced",
      lastVisit: "2024-01-14",
      nextAppointment: "2024-01-21",
      criticalAlerts: 3,
      medications: ["Erlotinib", "Prednisone", "Albuterol"],
      allergies: ["Contrast dye"],
      familyHistory: ["Lung cancer (brother)", "Heart disease (father)"],
      genomicVariants: 15,
      clinicalTrials: 4,
    },
  ])

  const [clinicalNotes] = useState<ClinicalNote[]>([
    {
      id: "note_001",
      patientId: "pt_001",
      date: "2024-01-10",
      type: "Progress Note",
      provider: "Dr. Smith",
      content:
        "Patient responding well to tamoxifen therapy. No significant side effects reported. Genomic analysis reveals BRCA1 pathogenic variant with implications for family screening.",
      tags: ["oncology", "genetics", "follow-up"],
      priority: "Medium",
    },
    {
      id: "note_002",
      patientId: "pt_001",
      date: "2024-01-05",
      type: "Genomic Report",
      provider: "Genomics Lab",
      content:
        "Comprehensive genomic profiling identified pathogenic BRCA1 variant (c.185delAG). Increased risk for breast and ovarian cancer. Recommend cascade testing for family members.",
      tags: ["genomics", "BRCA1", "family-screening"],
      priority: "High",
    },
    {
      id: "note_003",
      patientId: "pt_002",
      date: "2024-01-08",
      type: "Consultation",
      provider: "Dr. Johnson",
      content:
        "Cognitive assessment shows mild decline. APOE4 homozygous status confirms increased Alzheimer's risk. Adjusting treatment plan accordingly.",
      tags: ["neurology", "cognitive", "APOE4"],
      priority: "High",
    },
  ])

  const getRiskAssessments = (patientId: string): RiskAssessment[] => {
    const assessments = {
      pt_001: [
        {
          category: "Cancer Recurrence",
          score: 85,
          factors: ["BRCA1 mutation", "Family history", "Age at diagnosis"],
          recommendations: ["Enhanced surveillance", "Prophylactic surgery consideration", "Genetic counseling"],
          trend: "stable" as const,
        },
        {
          category: "Cardiovascular Risk",
          score: 45,
          factors: ["Age", "Medication effects"],
          recommendations: ["Regular monitoring", "Lifestyle modifications"],
          trend: "decreasing" as const,
        },
      ],
      pt_002: [
        {
          category: "Cognitive Decline",
          score: 72,
          factors: ["APOE4 homozygous", "Age", "Family history"],
          recommendations: ["Cognitive training", "Medication optimization", "Regular assessments"],
          trend: "increasing" as const,
        },
        {
          category: "Diabetes Complications",
          score: 38,
          factors: ["HbA1c levels", "Medication compliance"],
          recommendations: ["Glucose monitoring", "Dietary counseling"],
          trend: "stable" as const,
        },
      ],
    }

    return assessments[patientId as keyof typeof assessments] || []
  }

  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.mrn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.diagnosis.some((d) => d.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesFilter =
      filterStatus === "all" ||
      (filterStatus === "high-risk" && patient.riskScore >= 80) ||
      (filterStatus === "sequenced" && patient.genomicStatus === "Sequenced") ||
      (filterStatus === "alerts" && patient.criticalAlerts > 0)

    return matchesSearch && matchesFilter
  })

  const selectedPatientData = selectedPatient ? patients.find((p) => p.id === selectedPatient) : null
  const patientNotes = selectedPatient ? clinicalNotes.filter((note) => note.patientId === selectedPatient) : []
  const riskAssessments = selectedPatient ? getRiskAssessments(selectedPatient) : []

  const getRiskColor = (score: number) => {
    if (score >= 80) return "text-[#DC143C]"
    if (score >= 60) return "text-[#FF8C00]"
    return "text-[#2E8B57]"
  }

  const getRiskBadgeColor = (score: number) => {
    if (score >= 80) return "bg-[#DC143C] text-white"
    if (score >= 60) return "bg-[#FF8C00] text-white"
    return "bg-[#2E8B57] text-white"
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Sequenced":
        return "bg-[#2E8B57]/10 text-[#2E8B57]"
      case "Pending":
        return "bg-[#FF8C00]/10 text-[#FF8C00]"
      case "Not Available":
        return "bg-[#4A4A4A]/10 text-[#4A4A4A]"
      default:
        return "bg-[#4A4A4A]/10 text-[#4A4A4A]"
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#4A4A4A] flex items-center gap-2">
            <Users className="h-6 w-6 text-[#1E90FF]" />
            Patient Profile Management
          </h2>
          <p className="text-[#4A4A4A]/70">Comprehensive patient records with genomic integration</p>
        </div>

        <Button className="bg-[#1E90FF] hover:bg-[#1E90FF]/90">
          <Plus className="h-4 w-4 mr-2" />
          Add New Patient
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#4A4A4A]/50" />
              <Input
                placeholder="Search patients by name, MRN, or diagnosis..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Patients</SelectItem>
                <SelectItem value="high-risk">High Risk (≥80)</SelectItem>
                <SelectItem value="sequenced">Genomically Sequenced</SelectItem>
                <SelectItem value="alerts">With Alerts</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Patient List */}
        <Card className="border-0 shadow-lg lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-[#4A4A4A]" />
              Patient List ({filteredPatients.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredPatients.map((patient) => (
                <div
                  key={patient.id}
                  className={`p-4 cursor-pointer transition-all border-l-4 ${
                    selectedPatient === patient.id
                      ? "bg-[#1E90FF]/5 border-l-[#1E90FF]"
                      : "hover:bg-gray-50 border-l-transparent"
                  }`}
                  onClick={() => setSelectedPatient(patient.id)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium text-[#4A4A4A]">{patient.name}</h4>
                      <p className="text-sm text-[#4A4A4A]/70">
                        {patient.mrn} • {patient.age}y {patient.gender}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {patient.criticalAlerts > 0 && (
                        <Badge className="bg-[#DC143C] text-white">{patient.criticalAlerts} alerts</Badge>
                      )}
                      <Badge className={getRiskBadgeColor(patient.riskScore)}>Risk: {patient.riskScore}</Badge>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-2">
                    {patient.diagnosis.slice(0, 2).map((diagnosis, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {diagnosis}
                      </Badge>
                    ))}
                    {patient.diagnosis.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{patient.diagnosis.length - 2} more
                      </Badge>
                    )}
                  </div>

                  <div className="flex justify-between items-center text-xs text-[#4A4A4A]/70">
                    <span>Last visit: {new Date(patient.lastVisit).toLocaleDateString()}</span>
                    <Badge variant="outline" className={getStatusColor(patient.genomicStatus)}>
                      {patient.genomicStatus}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Patient Details */}
        <div className="lg:col-span-2">
          {selectedPatientData ? (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="genomics">Genomics</TabsTrigger>
                <TabsTrigger value="risk">Risk Assessment</TabsTrigger>
                <TabsTrigger value="notes">Clinical Notes</TabsTrigger>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* Patient Header */}
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-2xl">{selectedPatientData.name}</CardTitle>
                        <CardDescription>
                          {selectedPatientData.mrn} • {selectedPatientData.age} years old • {selectedPatientData.gender}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        {selectedPatientData.criticalAlerts > 0 && (
                          <Badge className="bg-[#DC143C] text-white">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            {selectedPatientData.criticalAlerts} Critical Alerts
                          </Badge>
                        )}
                        <Badge className={getRiskBadgeColor(selectedPatientData.riskScore)}>
                          Risk Score: {selectedPatientData.riskScore}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium text-[#4A4A4A] mb-2">Primary Diagnoses</h4>
                          <div className="space-y-1">
                            {selectedPatientData.diagnosis.map((diagnosis, index) => (
                              <Badge key={index} variant="outline" className="mr-2 mb-1">
                                {diagnosis}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium text-[#4A4A4A] mb-2">Current Medications</h4>
                          <div className="space-y-1">
                            {selectedPatientData.medications.map((medication, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <Pill className="h-4 w-4 text-[#2E8B57]" />
                                <span className="text-sm">{medication}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium text-[#4A4A4A] mb-2">Appointments</h4>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                              <Calendar className="h-4 w-4 text-[#4A4A4A]/70" />
                              <span>Last visit: {new Date(selectedPatientData.lastVisit).toLocaleDateString()}</span>
                            </div>
                            {selectedPatientData.nextAppointment && (
                              <div className="flex items-center gap-2 text-sm">
                                <Calendar className="h-4 w-4 text-[#1E90FF]" />
                                <span>Next: {new Date(selectedPatientData.nextAppointment).toLocaleDateString()}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium text-[#4A4A4A] mb-2">Allergies</h4>
                          <div className="space-y-1">
                            {selectedPatientData.allergies.map((allergy, index) => (
                              <Badge key={index} variant="outline" className="bg-[#DC143C]/10 text-[#DC143C] mr-2 mb-1">
                                {allergy}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium text-[#4A4A4A] mb-2">Family History</h4>
                          <div className="space-y-1">
                            {selectedPatientData.familyHistory.map((history, index) => (
                              <div key={index} className="text-sm text-[#4A4A4A]/70">
                                • {history}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Stats */}
                <div className="grid md:grid-cols-4 gap-4">
                  <Card className="border-0 shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-[#4A4A4A]/70">Genomic Status</p>
                          <Badge variant="outline" className={getStatusColor(selectedPatientData.genomicStatus)}>
                            {selectedPatientData.genomicStatus}
                          </Badge>
                        </div>
                        <Dna className="h-8 w-8 text-[#1E90FF]" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-[#4A4A4A]/70">Variants</p>
                          <p className="text-2xl font-bold text-[#4A4A4A]">
                            {selectedPatientData.genomicVariants || 0}
                          </p>
                        </div>
                        <Activity className="h-8 w-8 text-[#2E8B57]" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-[#4A4A4A]/70">Clinical Trials</p>
                          <p className="text-2xl font-bold text-[#4A4A4A]">{selectedPatientData.clinicalTrials || 0}</p>
                        </div>
                        <FileText className="h-8 w-8 text-[#FF8C00]" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-[#4A4A4A]/70">Risk Score</p>
                          <p className={`text-2xl font-bold ${getRiskColor(selectedPatientData.riskScore)}`}>
                            {selectedPatientData.riskScore}
                          </p>
                        </div>
                        <Heart className="h-8 w-8 text-[#DC143C]" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="genomics" className="space-y-6">
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Dna className="h-5 w-5 text-[#1E90FF]" />
                      Genomic Profile
                    </CardTitle>
                    <CardDescription>Comprehensive genomic analysis and variant interpretation</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {selectedPatientData.genomicStatus === "Sequenced" ? (
                      <div className="space-y-6">
                        <div className="grid md:grid-cols-3 gap-4">
                          <div className="text-center p-4 rounded-lg bg-[#F5F7FA]">
                            <div className="text-2xl font-bold text-[#1E90FF]">
                              {selectedPatientData.genomicVariants}
                            </div>
                            <div className="text-sm text-[#4A4A4A]/70">Total Variants</div>
                          </div>
                          <div className="text-center p-4 rounded-lg bg-[#F5F7FA]">
                            <div className="text-2xl font-bold text-[#DC143C]">
                              {Math.floor((selectedPatientData.genomicVariants || 0) * 0.15)}
                            </div>
                            <div className="text-sm text-[#4A4A4A]/70">Pathogenic</div>
                          </div>
                          <div className="text-center p-4 rounded-lg bg-[#F5F7FA]">
                            <div className="text-2xl font-bold text-[#2E8B57]">
                              {Math.floor((selectedPatientData.genomicVariants || 0) * 0.25)}
                            </div>
                            <div className="text-sm text-[#4A4A4A]/70">Actionable</div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h4 className="font-medium text-[#4A4A4A]">Key Genomic Findings</h4>
                          {selectedPatientData.id === "pt_001" && (
                            <div className="p-4 rounded-lg border bg-[#DC143C]/5 border-[#DC143C]/20">
                              <div className="flex items-center gap-2 mb-2">
                                <AlertTriangle className="h-4 w-4 text-[#DC143C]" />
                                <span className="font-medium text-[#DC143C]">BRCA1 Pathogenic Variant</span>
                              </div>
                              <p className="text-sm text-[#4A4A4A] mb-2">
                                c.185delAG (p.Glu62ValfsTer19) - Frameshift variant resulting in protein truncation
                              </p>
                              <div className="text-sm">
                                <strong>Clinical Implications:</strong> Significantly increased risk for breast and
                                ovarian cancer. Recommend enhanced surveillance and consideration of prophylactic
                                measures.
                              </div>
                            </div>
                          )}
                          {selectedPatientData.id === "pt_002" && (
                            <div className="p-4 rounded-lg border bg-[#FF8C00]/5 border-[#FF8C00]/20">
                              <div className="flex items-center gap-2 mb-2">
                                <Brain className="h-4 w-4 text-[#FF8C00]" />
                                <span className="font-medium text-[#FF8C00]">APOE4 Homozygous</span>
                              </div>
                              <p className="text-sm text-[#4A4A4A] mb-2">
                                ε4/ε4 genotype - Highest risk variant for late-onset Alzheimer's disease
                              </p>
                              <div className="text-sm">
                                <strong>Clinical Implications:</strong> 10-15x increased risk for Alzheimer's disease.
                                Consider early intervention strategies and enhanced monitoring.
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Dna className="h-12 w-12 text-[#4A4A4A]/30 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-[#4A4A4A] mb-2">
                          Genomic Sequencing {selectedPatientData.genomicStatus}
                        </h3>
                        <p className="text-[#4A4A4A]/70 mb-4">
                          {selectedPatientData.genomicStatus === "Pending"
                            ? "Genomic analysis is currently in progress. Results will be available soon."
                            : "No genomic data available for this patient."}
                        </p>
                        {selectedPatientData.genomicStatus === "Not Available" && (
                          <Button className="bg-[#1E90FF] hover:bg-[#1E90FF]/90">Order Genomic Testing</Button>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="risk" className="space-y-6">
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Heart className="h-5 w-5 text-[#DC143C]" />
                      Risk Assessment
                    </CardTitle>
                    <CardDescription>Comprehensive risk analysis across multiple health domains</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {riskAssessments.map((assessment, index) => (
                        <div key={index} className="p-4 rounded-lg border bg-[#F5F7FA]">
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                              <h4 className="font-medium text-[#4A4A4A]">{assessment.category}</h4>
                              {getTrendIcon(assessment.trend)}
                            </div>
                            <Badge className={getRiskBadgeColor(assessment.score)}>{assessment.score}% Risk</Badge>
                          </div>

                          <div className="mb-4">
                            <div className="flex justify-between text-sm mb-1">
                              <span>Risk Level</span>
                              <span>{assessment.score}%</span>
                            </div>
                            <Progress value={assessment.score} className="h-2" />
                          </div>

                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <h5 className="font-medium text-[#4A4A4A] mb-2">Risk Factors</h5>
                              <ul className="space-y-1">
                                {assessment.factors.map((factor, factorIndex) => (
                                  <li key={factorIndex} className="text-sm text-[#4A4A4A]/70 flex items-center gap-2">
                                    <div className="w-1 h-1 bg-[#DC143C] rounded-full" />
                                    {factor}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div>
                              <h5 className="font-medium text-[#4A4A4A] mb-2">Recommendations</h5>
                              <ul className="space-y-1">
                                {assessment.recommendations.map((recommendation, recIndex) => (
                                  <li key={recIndex} className="text-sm text-[#4A4A4A]/70 flex items-center gap-2">
                                    <CheckCircle className="w-3 h-3 text-[#2E8B57]" />
                                    {recommendation}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="notes" className="space-y-6">
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <FileText className="h-5 w-5 text-[#4A4A4A]" />
                          Clinical Notes
                        </CardTitle>
                        <CardDescription>Comprehensive clinical documentation and reports</CardDescription>
                      </div>
                      <Button className="bg-[#1E90FF] hover:bg-[#1E90FF]/90">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Note
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {patientNotes.map((note) => (
                        <div key={note.id} className="p-4 rounded-lg border bg-white">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <Badge variant="outline">{note.type}</Badge>
                                <Badge
                                  variant="outline"
                                  className={
                                    note.priority === "High"
                                      ? "bg-[#DC143C]/10 text-[#DC143C]"
                                      : note.priority === "Medium"
                                        ? "bg-[#FF8C00]/10 text-[#FF8C00]"
                                        : "bg-[#2E8B57]/10 text-[#2E8B57]"
                                  }
                                >
                                  {note.priority} Priority
                                </Badge>
                              </div>
                              <p className="text-sm text-[#4A4A4A]/70">
                                {note.provider} • {new Date(note.date).toLocaleDateString()}
                              </p>
                            </div>
                          </div>

                          <p className="text-sm text-[#4A4A4A] mb-3">{note.content}</p>

                          <div className="flex flex-wrap gap-1">
                            {note.tags.map((tag, tagIndex) => (
                              <Badge key={tagIndex} variant="outline" className="text-xs">
                                #{tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="timeline" className="space-y-6">
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-[#4A4A4A]" />
                      Patient Timeline
                    </CardTitle>
                    <CardDescription>Chronological view of patient care events and milestones</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Timeline items */}
                      <div className="relative">
                        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-[#E5E7EB]" />

                        <div className="relative flex items-start gap-4 pb-6">
                          <div className="w-8 h-8 bg-[#DC143C] rounded-full flex items-center justify-center">
                            <AlertTriangle className="h-4 w-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-[#4A4A4A]">Genomic Report Available</span>
                              <Badge className="bg-[#DC143C] text-white">High Priority</Badge>
                            </div>
                            <p className="text-sm text-[#4A4A4A]/70 mb-2">January 5, 2024</p>
                            <p className="text-sm text-[#4A4A4A]">
                              BRCA1 pathogenic variant identified. Genetic counseling scheduled.
                            </p>
                          </div>
                        </div>

                        <div className="relative flex items-start gap-4 pb-6">
                          <div className="w-8 h-8 bg-[#2E8B57] rounded-full flex items-center justify-center">
                            <CheckCircle className="h-4 w-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-[#4A4A4A]">Treatment Response Evaluation</span>
                              <Badge className="bg-[#2E8B57] text-white">Completed</Badge>
                            </div>
                            <p className="text-sm text-[#4A4A4A]/70 mb-2">January 10, 2024</p>
                            <p className="text-sm text-[#4A4A4A]">
                              Patient showing good response to tamoxifen therapy. Continue current regimen.
                            </p>
                          </div>
                        </div>

                        <div className="relative flex items-start gap-4 pb-6">
                          <div className="w-8 h-8 bg-[#FF8C00] rounded-full flex items-center justify-center">
                            <Calendar className="h-4 w-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-[#4A4A4A]">Follow-up Appointment Scheduled</span>
                              <Badge className="bg-[#FF8C00] text-white">Upcoming</Badge>
                            </div>
                            <p className="text-sm text-[#4A4A4A]/70 mb-2">January 25, 2024</p>
                            <p className="text-sm text-[#4A4A4A]">
                              Routine follow-up to assess treatment progress and discuss family screening.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          ) : (
            <Card className="border-0 shadow-lg">
              <CardContent className="p-12 text-center">
                <User className="h-12 w-12 text-[#4A4A4A]/30 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-[#4A4A4A] mb-2">Select a Patient</h3>
                <p className="text-[#4A4A4A]/70">
                  Choose a patient from the list to view their detailed profile and clinical information.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
