"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Brain,
  Play,
  Pause,
  RotateCcw,
  Download,
  Share2,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  Activity,
  Zap,
  Target,
  Users,
} from "lucide-react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ChromosomeViewer } from "@/components/genomic-visualizations/chromosome-viewer"
import { GeneStructureViewer } from "@/components/genomic-visualizations/gene-structure-viewer"
import { KaryotypeViewer } from "@/components/genomic-visualizations/karyotype-viewer"
import { ProteinStructureViewer } from "@/components/genomic-visualizations/protein-structure-viewer"
import { MolecularDynamicsViewer } from "@/components/genomic-visualizations/molecular-dynamics-viewer"

export default function ClinicalDemoPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [selectedChromosome, setSelectedChromosome] = useState("17")

  const demoSteps = [
    {
      title: "Patient Data Upload",
      description: "Secure upload of genomic data from various sources",
      duration: "2-3 minutes",
      status: "completed",
    },
    {
      title: "Genomic Profile Analysis",
      description: "AI-powered analysis of genetic variants and SNPs",
      duration: "5-8 minutes",
      status: "active",
    },
    {
      title: "Risk Assessment",
      description: "Comprehensive disease risk prediction",
      duration: "3-5 minutes",
      status: "pending",
    },
    {
      title: "Drug Response Simulation",
      description: "Pharmacogenomic interaction analysis",
      duration: "4-6 minutes",
      status: "pending",
    },
    {
      title: "Clinical Report Generation",
      description: "Automated clinical decision support report",
      duration: "1-2 minutes",
      status: "pending",
    },
  ]

  const patientData = {
    id: "PT-2024-001",
    name: "Sarah M. (Demo Patient)",
    age: 45,
    gender: "Female",
    ethnicity: "European",
    conditions: ["Hypertension", "Family history of breast cancer"],
    medications: ["Lisinopril", "Metformin"],
  }

  const genomicFindings = [
    {
      gene: "BRCA1",
      variant: "c.5266dupC",
      classification: "Pathogenic",
      risk: "High",
      condition: "Breast/Ovarian Cancer",
      recommendation: "Enhanced screening, genetic counseling",
    },
    {
      gene: "CYP2D6",
      variant: "*1/*4",
      classification: "Intermediate Metabolizer",
      risk: "Moderate",
      condition: "Drug Metabolism",
      recommendation: "Adjust dosing for CYP2D6 substrates",
    },
    {
      gene: "APOE",
      variant: "ε3/ε4",
      classification: "Risk Factor",
      risk: "Moderate",
      condition: "Alzheimer's Disease",
      recommendation: "Lifestyle modifications, monitoring",
    },
  ]

  const drugInteractions = [
    {
      drug: "Warfarin",
      gene: "CYP2C9, VKORC1",
      recommendation: "Reduce initial dose by 25-50%",
      confidence: "High",
      evidence: "FDA approved",
    },
    {
      drug: "Clopidogrel",
      gene: "CYP2C19",
      recommendation: "Consider alternative therapy",
      confidence: "High",
      evidence: "Clinical guidelines",
    },
    {
      drug: "Simvastatin",
      gene: "SLCO1B1",
      recommendation: "Standard dosing, monitor for myopathy",
      confidence: "Moderate",
      evidence: "Research studies",
    },
  ]

  // Sample data for genomic visualizations
  const chromosomeData = {
    chromosome: selectedChromosome,
    length: selectedChromosome === "17" ? 83257441 : 155138000,
    variants: [
      {
        position: 43044295,
        gene: "BRCA1",
        variant: "c.5266dupC",
        classification: "Pathogenic" as const,
        condition: "Breast/Ovarian Cancer",
        risk: "High" as const,
      },
      {
        position: 43070927,
        gene: "BRCA1",
        variant: "c.181T>G",
        classification: "VUS" as const,
        condition: "Breast Cancer",
        risk: "Moderate" as const,
      },
      {
        position: 43091434,
        gene: "BRCA1",
        variant: "c.4327C>T",
        classification: "Likely Pathogenic" as const,
        condition: "Ovarian Cancer",
        risk: "High" as const,
      },
    ],
    genes: [
      {
        name: "BRCA1",
        start: 43044295,
        end: 43125483,
        strand: "-" as const,
        function: "DNA repair, tumor suppression",
      },
      {
        name: "NBR1",
        start: 43200000,
        end: 43250000,
        strand: "+" as const,
        function: "Autophagy regulation",
      },
    ],
  }

  const geneData = {
    name: "BRCA1",
    chromosome: "17",
    start: 43044295,
    end: 43125483,
    strand: "-",
    transcripts: [
      {
        id: "ENST00000357654",
        name: "BRCA1-201",
        exons: [
          { number: 1, start: 43044295, end: 43044394, type: "non-coding" as const },
          { number: 2, start: 43045802, end: 43045933, type: "coding" as const },
          { number: 3, start: 43047643, end: 43047703, type: "coding" as const },
          { number: 4, start: 43049194, end: 43049294, type: "coding" as const },
          { number: 5, start: 43051062, end: 43051117, type: "coding" as const },
          { number: 6, start: 43057051, end: 43057135, type: "coding" as const },
          { number: 7, start: 43063332, end: 43063373, type: "coding" as const },
          { number: 8, start: 43063873, end: 43063951, type: "coding" as const },
          { number: 9, start: 43067607, end: 43067695, type: "coding" as const },
          { number: 10, start: 43070927, end: 43071238, type: "coding" as const },
          { number: 11, start: 43074330, end: 43074521, type: "coding" as const },
          { number: 12, start: 43076487, end: 43076614, type: "coding" as const },
          { number: 13, start: 43082403, end: 43082575, type: "coding" as const },
          { number: 14, start: 43091434, end: 43091583, type: "coding" as const },
          { number: 15, start: 43093394, end: 43093579, type: "coding" as const },
          { number: 16, start: 43095845, end: 43095922, type: "coding" as const },
          { number: 17, start: 43097243, end: 43097289, type: "coding" as const },
          { number: 18, start: 43099774, end: 43099880, type: "coding" as const },
          { number: 19, start: 43104121, end: 43104261, type: "coding" as const },
          { number: 20, start: 43104867, end: 43104956, type: "coding" as const },
          { number: 21, start: 43106455, end: 43106533, type: "coding" as const },
          { number: 22, start: 43115725, end: 43115779, type: "coding" as const },
          { number: 23, start: 43124016, end: 43124115, type: "coding" as const },
          { number: 24, start: 43125270, end: 43125483, type: "non-coding" as const },
        ],
        variants: [
          {
            position: 43044295,
            type: "Insertion" as const,
            consequence: "frameshift_variant",
            impact: "High" as const,
            aminoAcid: "p.Gln1756Profs*74",
          },
          {
            position: 43070927,
            type: "SNV" as const,
            consequence: "missense_variant",
            impact: "Moderate" as const,
            aminoAcid: "p.Cys61Gly",
          },
          {
            position: 43091434,
            type: "SNV" as const,
            consequence: "nonsense_variant",
            impact: "High" as const,
            aminoAcid: "p.Arg1443*",
          },
        ],
      },
    ],
    function:
      "BRCA1 is a tumor suppressor gene that plays a critical role in DNA repair through homologous recombination. It is essential for maintaining genomic stability and preventing the development of cancer, particularly breast and ovarian cancers.",
    pathways: [
      "DNA Damage Response",
      "Homologous Recombination",
      "Cell Cycle Checkpoint",
      "p53 Signaling Pathway",
      "PARP-mediated DNA repair",
      "Fanconi Anemia Pathway",
    ],
    diseases: [
      "Hereditary Breast Cancer",
      "Hereditary Ovarian Cancer",
      "Breast-Ovarian Cancer Syndrome",
      "Fanconi Anemia",
    ],
  }

  const karyotypeData = {
    chromosomes: Array.from({ length: 24 }, (_, i) => {
      const chrName = i < 22 ? (i + 1).toString() : i === 22 ? "X" : "Y"
      return {
        name: chrName,
        length: chrName === "1" ? 249250621 : chrName === "17" ? 83257441 : 155000000,
        bands: [
          { name: "p13.3", start: 0, end: 4500000, stain: "gneg" as const },
          { name: "p13.2", start: 4500000, end: 7200000, stain: "gpos50" as const },
          { name: "p13.1", start: 7200000, end: 12900000, stain: "gneg" as const },
          { name: "p12", start: 12900000, end: 16000000, stain: "gpos75" as const },
          { name: "p11.2", start: 16000000, end: 22200000, stain: "gneg" as const },
          { name: "p11.1", start: 22200000, end: 25700000, stain: "acen" as const },
          { name: "q11.1", start: 25700000, end: 27400000, stain: "acen" as const },
          { name: "q11.2", start: 27400000, end: 30400000, stain: "gneg" as const },
          { name: "q12", start: 30400000, end: 35300000, stain: "gpos50" as const },
          { name: "q21.1", start: 35300000, end: 40200000, stain: "gneg" as const },
          { name: "q21.2", start: 40200000, end: 43000000, stain: "gpos25" as const },
          { name: "q21.31", start: 43000000, end: 46700000, stain: "gneg" as const },
          { name: "q21.32", start: 46700000, end: 50400000, stain: "gpos50" as const },
          { name: "q21.33", start: 50400000, end: 54900000, stain: "gneg" as const },
          { name: "q22", start: 54900000, end: 59500000, stain: "gpos75" as const },
          { name: "q23.1", start: 59500000, end: 63700000, stain: "gneg" as const },
          { name: "q23.2", start: 63700000, end: 68400000, stain: "gpos50" as const },
          { name: "q23.3", start: 68400000, end: 72100000, stain: "gneg" as const },
          { name: "q24.1", start: 72100000, end: 75200000, stain: "gpos50" as const },
          { name: "q24.2", start: 75200000, end: 78700000, stain: "gneg" as const },
          { name: "q24.3", start: 78700000, end: 83257441, stain: "gpos100" as const },
        ],
        variants:
          chrName === "17"
            ? [
                {
                  position: 43044295,
                  type: "Deletion" as const,
                  size: 1000,
                  significance: "Pathogenic" as const,
                },
                {
                  position: 43070927,
                  type: "CNV" as const,
                  size: 50000,
                  significance: "VUS" as const,
                },
              ]
            : chrName === "13"
              ? [
                  {
                    position: 32900000,
                    type: "Duplication" as const,
                    size: 200000,
                    significance: "Likely Pathogenic" as const,
                  },
                ]
              : [],
      }
    }),
  }

  // Sample protein structure data for BRCA1
  const proteinData = {
    name: "BRCA1 Protein",
    pdbId: "1JM7",
    gene: "BRCA1",
    length: 1863,
    domains: [
      {
        name: "RING Domain",
        start: 1,
        end: 109,
        type: "DNA Binding",
        color: "#FF6B6B",
        function: "E3 ubiquitin ligase activity, protein-protein interactions",
      },
      {
        name: "Coiled-coil",
        start: 1391,
        end: 1424,
        type: "Structural",
        color: "#4ECDC4",
        function: "Protein oligomerization and stability",
      },
      {
        name: "BRCT Domain 1",
        start: 1650,
        end: 1736,
        type: "DNA Binding",
        color: "#45B7D1",
        function: "Phosphopeptide binding, DNA damage response",
      },
      {
        name: "BRCT Domain 2",
        start: 1760,
        end: 1863,
        type: "DNA Binding",
        color: "#96CEB4",
        function: "Phosphopeptide binding, transcriptional activation",
      },
    ],
    variants: [
      {
        position: 61,
        wildType: "C",
        mutant: "G",
        impact: "High" as const,
        consequence: "missense_variant",
        structuralEffect: "Disrupts zinc coordination in RING domain",
        stabilityChange: -3.2,
        bindingAffinity: -5.8,
        pathogenicity: "Pathogenic" as const,
      },
      {
        position: 1443,
        wildType: "R",
        mutant: "*",
        impact: "High" as const,
        consequence: "nonsense_variant",
        structuralEffect: "Truncates protein, removes BRCT domains",
        stabilityChange: -8.5,
        bindingAffinity: -10.0,
        pathogenicity: "Pathogenic" as const,
      },
      {
        position: 1699,
        wildType: "Q",
        mutant: "R",
        impact: "Moderate" as const,
        consequence: "missense_variant",
        structuralEffect: "Alters BRCT domain surface charge",
        stabilityChange: -1.1,
        bindingAffinity: -2.3,
        pathogenicity: "Likely Pathogenic" as const,
      },
      {
        position: 1756,
        wildType: "Q",
        mutant: "P",
        impact: "High" as const,
        consequence: "missense_variant",
        structuralEffect: "Disrupts BRCT domain folding",
        stabilityChange: -4.7,
        bindingAffinity: -6.2,
        pathogenicity: "Pathogenic" as const,
      },
    ],
    bindingSites: [
      {
        name: "Zinc Binding Site",
        residues: [24, 27, 61, 64],
        ligand: "Zn2+",
        function: "Structural integrity of RING domain",
      },
      {
        name: "Phosphopeptide Binding",
        residues: [1702, 1704, 1706, 1760, 1763],
        ligand: "Phosphoserine/Threonine",
        function: "Recognition of DNA damage signaling proteins",
      },
      {
        name: "DNA Binding Interface",
        residues: [1650, 1655, 1699, 1702, 1760, 1763],
        ligand: "DNA",
        function: "Direct DNA binding for repair processes",
      },
    ],
    secondaryStructure: [
      { type: "helix" as const, start: 10, end: 25 },
      { type: "sheet" as const, start: 30, end: 45 },
      { type: "loop" as const, start: 46, end: 60 },
      { type: "helix" as const, start: 1395, end: 1420 },
      { type: "sheet" as const, start: 1655, end: 1670 },
      { type: "helix" as const, start: 1675, end: 1690 },
      { type: "sheet" as const, start: 1695, end: 1710 },
      { type: "helix" as const, start: 1765, end: 1780 },
      { type: "sheet" as const, start: 1785, end: 1800 },
      { type: "loop" as const, start: 1801, end: 1863 },
    ],
  }

  // Sample molecular dynamics data for BRCA1
  const molecularDynamicsData = {
    protein: {
      name: "BRCA1",
      sequence:
        "MDLSALRVEEVQNVINAMQKILECPICLELIKEPVSTKCDHIFCKFCMLKLLNQKKGPSQCPLCKNDITKRSLQESTRFSQLVEELLKIICAFQLDTGLEYANSYNFAKKENNSPEHLKDEVSIIQSMGYRNRAKRLLQSEPENPSLQETSLSVQLSNLGTVRTLRTKQRIQPQKTSVYIELGSDSSEDTVNKATYCSVGDQELLQITPQGTRDEISLDSAKKAACEFSETDVTNTEHHQPSNNDLNTTEKRAAERHPEKYQGSSVSNLHVEPCGTNTHASSLQHENSSLLLTKDRMNVEKAEFCNKSKQPGLARSQHNRWAGSKETCNDRRTPSTEKKVDLNADPLCERKEWNKQKLPCSENPRDTEDVPWITLNSSIQKVNEWSRQRWWESWSVPCS",
      length: 1863,
      temperature: 310,
      simulationTime: 100,
    },
    variants: [
      {
        position: 61,
        wildType: "C",
        mutant: "G",
        impact: "High" as const,
        stabilityEffect: -3.2,
        flexibilityChange: 0.15,
        bindingEffect: -5.8,
      },
      {
        position: 1443,
        wildType: "R",
        mutant: "*",
        impact: "High" as const,
        stabilityEffect: -8.5,
        flexibilityChange: 0.45,
        bindingEffect: -10.0,
      },
      {
        position: 1699,
        wildType: "Q",
        mutant: "R",
        impact: "Moderate" as const,
        stabilityEffect: -1.1,
        flexibilityChange: 0.08,
        bindingEffect: -2.3,
      },
    ],
    trajectory: Array.from({ length: 1000 }, (_, frameIndex) => ({
      timepoint: frameIndex * 0.1,
      coordinates: Array.from({ length: 200 }, (_, residueIndex) => ({
        x: Math.sin(frameIndex * 0.01 + residueIndex * 0.1) * (1 + Math.random() * 0.2),
        y: Math.cos(frameIndex * 0.01 + residueIndex * 0.1) * (1 + Math.random() * 0.2),
        z: Math.sin(frameIndex * 0.02 + residueIndex * 0.05) * (1 + Math.random() * 0.1),
      })),
      energy: -15000 + Math.sin(frameIndex * 0.05) * 500 + Math.random() * 200,
      rmsd: 1.2 + Math.sin(frameIndex * 0.03) * 0.3 + Math.random() * 0.1,
      rmsf: Array.from(
        { length: 200 },
        (_, residueIndex) => 0.5 + Math.sin(residueIndex * 0.1) * 0.3 + Math.random() * 0.2,
      ),
      secondaryStructure: [
        { type: "helix" as const, start: 10, end: 25, stability: 0.8 + Math.sin(frameIndex * 0.02) * 0.2 },
        { type: "sheet" as const, start: 30, end: 45, stability: 0.9 + Math.sin(frameIndex * 0.03) * 0.1 },
        { type: "loop" as const, start: 46, end: 60, stability: 0.6 + Math.sin(frameIndex * 0.04) * 0.3 },
        { type: "helix" as const, start: 140, end: 160, stability: 0.85 + Math.sin(frameIndex * 0.025) * 0.15 },
        { type: "sheet" as const, start: 165, end: 180, stability: 0.92 + Math.sin(frameIndex * 0.035) * 0.08 },
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

  const startDemo = () => {
    setIsPlaying(true)
    setCurrentStep(0)
    setAnalysisProgress(0)

    // Simulate analysis progress
    const interval = setInterval(() => {
      setAnalysisProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsPlaying(false)
          return 100
        }
        return prev + 2
      })
    }, 100)
  }

  const resetDemo = () => {
    setIsPlaying(false)
    setCurrentStep(0)
    setAnalysisProgress(0)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F7FA] to-white">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-6 bg-[#2E8B57] text-white hover:bg-[#2E8B57]/90">
              Interactive Clinical Demonstration
            </Badge>
            <h1 className="text-4xl sm:text-5xl font-bold text-[#4A4A4A] mb-6">
              <span className="text-[#1E90FF]">Genomic Twin</span> Clinical Workflow
            </h1>
            <p className="text-xl text-[#4A4A4A]/80 mb-8 max-w-3xl mx-auto">
              Experience how our AI-powered genomic analysis platform transforms patient data into actionable clinical
              insights for precision medicine.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button
                size="lg"
                onClick={startDemo}
                disabled={isPlaying}
                className="bg-[#1E90FF] hover:bg-[#1E90FF]/90 text-white px-8 py-3"
              >
                {isPlaying ? <Pause className="mr-2 h-5 w-5" /> : <Play className="mr-2 h-5 w-5" />}
                {isPlaying ? "Analysis Running..." : "Start Clinical Demo"}
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={resetDemo}
                className="border-[#1E90FF] text-[#1E90FF] hover:bg-[#1E90FF]/10 px-8 py-3 bg-transparent"
              >
                <RotateCcw className="mr-2 h-5 w-5" />
                Reset Demo
              </Button>
            </div>

            {/* Progress Indicator */}
            {analysisProgress > 0 && (
              <div className="max-w-md mx-auto">
                <div className="flex justify-between text-sm mb-2">
                  <span>Genomic Analysis Progress</span>
                  <span>{analysisProgress}%</span>
                </div>
                <Progress value={analysisProgress} className="h-3" />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Demo Workflow Steps */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-[#4A4A4A] text-center mb-12">Clinical Analysis Workflow</h2>

          <div className="grid md:grid-cols-5 gap-6 mb-12">
            {demoSteps.map((step, index) => (
              <Card
                key={index}
                className={`border-0 shadow-lg transition-all ${
                  index <= currentStep || analysisProgress > index * 20 ? "ring-2 ring-[#1E90FF]" : ""
                }`}
              >
                <CardContent className="p-6 text-center">
                  <div
                    className={`w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center ${
                      index < currentStep || analysisProgress > (index + 1) * 20
                        ? "bg-[#2E8B57] text-white"
                        : index === currentStep ||
                            (analysisProgress > index * 20 && analysisProgress <= (index + 1) * 20)
                          ? "bg-[#1E90FF] text-white"
                          : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {index < currentStep || analysisProgress > (index + 1) * 20 ? (
                      <CheckCircle className="h-6 w-6" />
                    ) : index === currentStep ||
                      (analysisProgress > index * 20 && analysisProgress <= (index + 1) * 20) ? (
                      <Clock className="h-6 w-6" />
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </div>
                  <h3 className="font-semibold text-[#4A4A4A] mb-2">{step.title}</h3>
                  <p className="text-sm text-[#4A4A4A]/70 mb-2">{step.description}</p>
                  <Badge variant="outline" className="text-xs">
                    {step.duration}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Results Tabs */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#F5F7FA]">
        <div className="max-w-7xl mx-auto">
          <Tabs defaultValue="patient" className="space-y-6">
            <TabsList className="grid w-full grid-cols-8">
              <TabsTrigger value="patient">Patient Profile</TabsTrigger>
              <TabsTrigger value="karyotype">Karyotype</TabsTrigger>
              <TabsTrigger value="chromosome">Chromosome View</TabsTrigger>
              <TabsTrigger value="gene">Gene Structure</TabsTrigger>
              <TabsTrigger value="protein">3D Protein</TabsTrigger>
              <TabsTrigger value="dynamics">Dynamics</TabsTrigger>
              <TabsTrigger value="variants">Variants</TabsTrigger>
              <TabsTrigger value="report">Clinical Report</TabsTrigger>
            </TabsList>

            <TabsContent value="patient" className="space-y-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-[#1E90FF]" />
                    Demo Patient Profile
                  </CardTitle>
                  <CardDescription>Comprehensive patient information and medical history</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-[#4A4A4A] mb-2">Patient Information</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-[#4A4A4A]/70">Patient ID:</span>
                            <span className="font-medium">{patientData.id}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[#4A4A4A]/70">Name:</span>
                            <span className="font-medium">{patientData.name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[#4A4A4A]/70">Age:</span>
                            <span className="font-medium">{patientData.age} years</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[#4A4A4A]/70">Gender:</span>
                            <span className="font-medium">{patientData.gender}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[#4A4A4A]/70">Ethnicity:</span>
                            <span className="font-medium">{patientData.ethnicity}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-[#4A4A4A] mb-2">Medical History</h4>
                        <div className="space-y-2">
                          {patientData.conditions.map((condition, index) => (
                            <Badge key={index} variant="outline" className="mr-2">
                              {condition}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-[#4A4A4A] mb-2">Current Medications</h4>
                        <div className="space-y-2">
                          {patientData.medications.map((medication, index) => (
                            <Badge key={index} variant="outline" className="mr-2 bg-[#1E90FF]/10">
                              {medication}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="karyotype" className="space-y-6">
              <KaryotypeViewer data={karyotypeData} patientSex="Female" />
            </TabsContent>

            <TabsContent value="chromosome" className="space-y-6">
              <ChromosomeViewer
                data={chromosomeData}
                selectedChromosome={selectedChromosome}
                onChromosomeSelect={setSelectedChromosome}
              />
            </TabsContent>

            <TabsContent value="gene" className="space-y-6">
              <GeneStructureViewer data={geneData} />
            </TabsContent>

            <TabsContent value="protein" className="space-y-6">
              <ProteinStructureViewer data={proteinData} />
            </TabsContent>

            <TabsContent value="dynamics" className="space-y-6">
              <MolecularDynamicsViewer data={molecularDynamicsData} showComparison={false} />
            </TabsContent>

            <TabsContent value="variants" className="space-y-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-[#1E90FF]" />
                    Genomic Analysis Results
                  </CardTitle>
                  <CardDescription>Key genetic variants and their clinical significance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {genomicFindings.map((finding, index) => (
                      <div key={index} className="p-4 rounded-lg border bg-white">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-semibold text-[#4A4A4A]">{finding.gene}</h4>
                            <p className="text-sm text-[#4A4A4A]/70">{finding.variant}</p>
                          </div>
                          <Badge
                            className={`${
                              finding.risk === "High"
                                ? "bg-[#DC143C]"
                                : finding.risk === "Moderate"
                                  ? "bg-[#FF8C00]"
                                  : "bg-[#2E8B57]"
                            } text-white`}
                          >
                            {finding.risk} Risk
                          </Badge>
                        </div>

                        <div className="grid md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-[#4A4A4A]/70">Classification:</span>
                            <p className="font-medium">{finding.classification}</p>
                          </div>
                          <div>
                            <span className="text-[#4A4A4A]/70">Associated Condition:</span>
                            <p className="font-medium">{finding.condition}</p>
                          </div>
                          <div>
                            <span className="text-[#4A4A4A]/70">Clinical Recommendation:</span>
                            <p className="font-medium">{finding.recommendation}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="report" className="space-y-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-[#1E90FF]" />
                    Clinical Decision Support Report
                  </CardTitle>
                  <CardDescription>Comprehensive report for clinical decision making</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Report Summary */}
                    <div className="p-4 rounded-lg bg-[#1E90FF]/10 border border-[#1E90FF]/20">
                      <h4 className="font-semibold text-[#4A4A4A] mb-3">Executive Summary</h4>
                      <p className="text-sm text-[#4A4A4A] mb-3">
                        This 45-year-old female patient carries a pathogenic BRCA1 variant (c.5266dupC) conferring
                        significantly elevated lifetime risks for breast (87%) and ovarian (44%) cancers. Additional
                        findings include intermediate CYP2D6 metabolism and APOE ε4 allele presence.
                      </p>
                      <div className="grid md:grid-cols-3 gap-4 text-sm">
                        <div className="text-center p-3 rounded bg-white">
                          <div className="text-2xl font-bold text-[#DC143C]">3</div>
                          <div className="text-[#4A4A4A]/70">High-Risk Variants</div>
                        </div>
                        <div className="text-center p-3 rounded bg-white">
                          <div className="text-2xl font-bold text-[#FF8C00]">5</div>
                          <div className="text-[#4A4A4A]/70">Drug Interactions</div>
                        </div>
                        <div className="text-center p-3 rounded bg-white">
                          <div className="text-2xl font-bold text-[#2E8B57]">8</div>
                          <div className="text-[#4A4A4A]/70">Recommendations</div>
                        </div>
                      </div>
                    </div>

                    {/* Action Items */}
                    <div>
                      <h4 className="font-semibold text-[#4A4A4A] mb-3">Immediate Action Items</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-[#DC143C]/10">
                          <AlertTriangle className="h-4 w-4 text-[#DC143C]" />
                          <span className="text-sm">Refer to genetic counselor for BRCA1 variant discussion</span>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-[#DC143C]/10">
                          <AlertTriangle className="h-4 w-4 text-[#DC143C]" />
                          <span className="text-sm">Initiate enhanced breast and ovarian cancer screening</span>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-[#FF8C00]/10">
                          <Clock className="h-4 w-4 text-[#FF8C00]" />
                          <span className="text-sm">Review current medications for CYP2D6 interactions</span>
                        </div>
                      </div>
                    </div>

                    {/* Report Actions */}
                    <div className="flex gap-4 pt-4 border-t">
                      <Button className="bg-[#1E90FF] hover:bg-[#1E90FF]/90">
                        <Download className="mr-2 h-4 w-4" />
                        Download PDF Report
                      </Button>
                      <Button variant="outline" className="border-[#1E90FF] text-[#1E90FF] bg-transparent">
                        <Share2 className="mr-2 h-4 w-4" />
                        Share with Team
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Key Features Highlight */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#4A4A4A] mb-4">Platform Capabilities Demonstrated</h2>
            <p className="text-[#4A4A4A]/70 text-lg">Key features showcased in this clinical demonstration</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-0 shadow-lg text-center">
              <CardContent className="p-6">
                <Activity className="h-12 w-12 text-[#1E90FF] mx-auto mb-4" />
                <h3 className="font-semibold text-[#4A4A4A] mb-2">3D Protein Visualization</h3>
                <p className="text-sm text-[#4A4A4A]/70">
                  Interactive 3D protein structure with variant impact analysis
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg text-center">
              <CardContent className="p-6">
                <Target className="h-12 w-12 text-[#DC143C] mx-auto mb-4" />
                <h3 className="font-semibold text-[#4A4A4A] mb-2">Structural Impact</h3>
                <p className="text-sm text-[#4A4A4A]/70">
                  Detailed analysis of how variants affect protein structure and function
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg text-center">
              <CardContent className="p-6">
                <Zap className="h-12 w-12 text-[#FF8C00] mx-auto mb-4" />
                <h3 className="font-semibold text-[#4A4A4A] mb-2">Real-time Analysis</h3>
                <p className="text-sm text-[#4A4A4A]/70">Instant genomic data processing and clinical interpretation</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg text-center">
              <CardContent className="p-6">
                <FileText className="h-12 w-12 text-[#2E8B57] mx-auto mb-4" />
                <h3 className="font-semibold text-[#4A4A4A] mb-2">Clinical Reports</h3>
                <p className="text-sm text-[#4A4A4A]/70">Automated clinical decision support documentation</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-[#1E90FF] to-[#DC143C]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Transform Your Clinical Practice?</h2>
          <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
            Experience the power of AI-driven genomic analysis in your healthcare practice. Start your clinical trial
            today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="bg-white text-[#1E90FF] hover:bg-white/90 px-8 py-3">
                Start Clinical Trial
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white/10 px-8 py-3 bg-transparent"
              >
                Schedule Consultation
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
