"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Microscope, Dna, Activity, Network, Shield, Target, Zap, RotateCcw, Settings, Plus } from "lucide-react"
import { ProteinStructureViewer } from "@/components/genomic-visualizations/protein-structure-viewer"
import { MolecularDynamicsViewer } from "@/components/genomic-visualizations/molecular-dynamics-viewer"
import { DrugProteinNetwork } from "@/components/clinical/drug-protein-network"
import { ProteinFoldingViewer } from "@/components/genomic-visualizations/protein-folding-viewer"
import { AllostericNetworkViewer } from "@/components/genomic-visualizations/allosteric-network-viewer"
import { DrugResistanceAnalyzer } from "@/components/genomic-visualizations/drug-resistance-analyzer"

interface Patient {
  id: string
  name: string
  mutations: any[]
  cancerType: string
  currentTreatment: string
}

export function ThreeDVisualizationPanel() {
  const [selectedVisualization, setSelectedVisualization] = useState<string>("protein-structure")
  const [selectedProtein, setSelectedProtein] = useState<string>("BRCA1")
  const [selectedDrug, setSelectedDrug] = useState<string>("Erlotinib")
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [analysisMode, setAnalysisMode] = useState<string>("individual")

  // Sample patient data with resistance mutations
  const samplePatients: Patient[] = [
    {
      id: "pt_001",
      name: "Sarah Johnson",
      mutations: [
        { gene: "EGFR", mutation: "T790M", resistanceLevel: "High" },
        { gene: "EGFR", mutation: "L858R", resistanceLevel: "Moderate" },
      ],
      cancerType: "Lung Cancer",
      currentTreatment: "Erlotinib",
    },
    {
      id: "pt_002",
      name: "Michael Chen",
      mutations: [
        { gene: "BRCA1", mutation: "C61G", resistanceLevel: "High" },
        { gene: "TP53", mutation: "R273H", resistanceLevel: "Moderate" },
      ],
      cancerType: "Breast Cancer",
      currentTreatment: "Olaparib",
    },
  ]

  // Sample protein data for visualizations
  const proteinData = {
    BRCA1: {
      name: "BRCA1",
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
          function: "E3 ubiquitin ligase activity",
        },
        {
          name: "Coiled-coil",
          start: 1391,
          end: 1424,
          type: "Protein Interaction",
          color: "#4ECDC4",
          function: "Protein-protein interactions",
        },
        {
          name: "BRCT Domain 1",
          start: 1650,
          end: 1736,
          type: "Phosphoprotein Binding",
          color: "#45B7D1",
          function: "Phosphopeptide recognition",
        },
        {
          name: "BRCT Domain 2",
          start: 1760,
          end: 1855,
          type: "Phosphoprotein Binding",
          color: "#96CEB4",
          function: "Phosphopeptide recognition",
        },
      ],
      variants: [
        {
          position: 61,
          wildType: "C",
          mutant: "G",
          impact: "High" as const,
          consequence: "missense_variant",
          structuralEffect: "Destabilizing",
          stabilityChange: -2.1,
          bindingAffinity: 0.3,
          pathogenicity: "Pathogenic" as const,
        },
        {
          position: 1775,
          wildType: "M",
          mutant: "R",
          impact: "High" as const,
          consequence: "missense_variant",
          structuralEffect: "Loss of function",
          stabilityChange: -1.8,
          bindingAffinity: -0.5,
          pathogenicity: "Pathogenic" as const,
        },
      ],
      bindingSites: [
        {
          name: "DNA Binding Site",
          residues: [24, 26, 61, 64],
          ligand: "DNA",
          function: "Double-strand break recognition",
        },
        {
          name: "BARD1 Interface",
          residues: [1760, 1775, 1812],
          ligand: "BARD1",
          function: "Heterodimer formation",
        },
      ],
      secondaryStructure: [
        { type: "helix" as const, start: 10, end: 25 },
        { type: "sheet" as const, start: 30, end: 45 },
        { type: "loop" as const, start: 46, end: 60 },
      ],
    },
    EGFR: {
      name: "EGFR",
      pdbId: "1M17",
      gene: "EGFR",
      length: 1210,
      domains: [
        {
          name: "Kinase Domain",
          start: 712,
          end: 979,
          type: "Catalytic",
          color: "#FF6B6B",
          function: "ATP binding and phosphorylation",
        },
        {
          name: "Regulatory Domain",
          start: 980,
          end: 1210,
          type: "Regulatory",
          color: "#4ECDC4",
          function: "Autoinhibition and regulation",
        },
      ],
      variants: [
        {
          position: 790,
          wildType: "T",
          mutant: "M",
          impact: "High" as const,
          consequence: "missense_variant",
          structuralEffect: "Drug resistance",
          stabilityChange: 0.3,
          bindingAffinity: -2.5,
          pathogenicity: "Pathogenic" as const,
        },
        {
          position: 858,
          wildType: "L",
          mutant: "R",
          impact: "High" as const,
          consequence: "missense_variant",
          structuralEffect: "Activating",
          stabilityChange: -0.2,
          bindingAffinity: 1.2,
          pathogenicity: "Pathogenic" as const,
        },
      ],
      bindingSites: [
        {
          name: "ATP Binding Site",
          residues: [718, 721, 790, 837],
          ligand: "ATP",
          function: "Kinase activity",
        },
        {
          name: "Drug Binding Site",
          residues: [790, 797, 858],
          ligand: "Erlotinib",
          function: "Tyrosine kinase inhibition",
        },
      ],
      secondaryStructure: [
        { type: "helix" as const, start: 720, end: 735 },
        { type: "sheet" as const, start: 740, end: 755 },
        { type: "loop" as const, start: 785, end: 800 },
      ],
    },
  }

  const getCurrentProteinData = () => {
    return proteinData[selectedProtein as keyof typeof proteinData] || proteinData.BRCA1
  }

  const getPatientResistanceMutations = () => {
    if (!selectedPatient) return []

    return selectedPatient.mutations.map((mut) => ({
      id: `mut_${mut.gene.toLowerCase()}_${mut.mutation.toLowerCase()}`,
      position: Number.parseInt(mut.mutation.match(/\d+/)?.[0] || "0"),
      wildType: mut.mutation.charAt(0),
      mutant: mut.mutation.slice(-1),
      gene: mut.gene,
      protein: mut.gene,
      resistanceLevel: mut.resistanceLevel,
      mechanism: "Binding Site",
      foldChange: mut.resistanceLevel === "High" ? 150 : 50,
      clinicalEvidence: "Established",
      drugs: [selectedDrug],
      cancerTypes: [selectedPatient.cancerType],
      frequency: 0.3,
      coOccurringMutations: [],
      structuralImpact: {
        bindingAffinity: -2.0,
        proteinStability: 0.1,
        conformationalChange: 0.8,
        allostericEffect: 0.4,
      },
      clinicalOutcome: {
        responseRate: 0.2,
        progressionFreeTime: 4.5,
        overallSurvival: 9.2,
      },
      alternativeTherapies: ["Osimertinib", "Combination therapy"],
    }))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#4A4A4A] flex items-center gap-2">
            <Microscope className="h-6 w-6 text-[#1E90FF]" />
            3D Molecular Visualization Suite
          </h2>
          <p className="text-[#4A4A4A]/70">
            Advanced 3D visualization and analysis of protein structures, dynamics, and drug interactions
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Select value={selectedProtein} onValueChange={setSelectedProtein}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="BRCA1">BRCA1</SelectItem>
              <SelectItem value="EGFR">EGFR</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedDrug} onValueChange={setSelectedDrug}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Erlotinib">Erlotinib</SelectItem>
              <SelectItem value="Olaparib">Olaparib</SelectItem>
              <SelectItem value="Osimertinib">Osimertinib</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Analysis
          </Button>
        </div>
      </div>

      {/* Patient Selection */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-[#2E8B57]" />
            Analysis Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Analysis Mode</label>
              <Select value={analysisMode} onValueChange={setAnalysisMode}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="individual">Individual Analysis</SelectItem>
                  <SelectItem value="comparative">Comparative Analysis</SelectItem>
                  <SelectItem value="population">Population Study</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Patient Data</label>
              <Select
                value={selectedPatient?.id || ""}
                onValueChange={(value) => setSelectedPatient(samplePatients.find((p) => p.id === value) || null)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select patient" />
                </SelectTrigger>
                <SelectContent>
                  {samplePatients.map((patient) => (
                    <SelectItem key={patient.id} value={patient.id}>
                      {patient.name} - {patient.cancerType}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Visualization Focus</label>
              <Select value={selectedVisualization} onValueChange={setSelectedVisualization}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="protein-structure">Protein Structure</SelectItem>
                  <SelectItem value="molecular-dynamics">Molecular Dynamics</SelectItem>
                  <SelectItem value="drug-network">Drug-Protein Network</SelectItem>
                  <SelectItem value="protein-folding">Protein Folding</SelectItem>
                  <SelectItem value="allosteric-network">Allosteric Networks</SelectItem>
                  <SelectItem value="drug-resistance">Drug Resistance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {selectedPatient && (
            <div className="mt-4 p-3 rounded-lg bg-[#F5F7FA] border">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Patient: {selectedPatient.name}</span>
                <Badge variant="outline">{selectedPatient.cancerType}</Badge>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span>
                  Current Treatment: <strong>{selectedPatient.currentTreatment}</strong>
                </span>
                <span>
                  Mutations: <strong>{selectedPatient.mutations.length}</strong>
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Main Visualization Area */}
      <Tabs value={selectedVisualization} onValueChange={setSelectedVisualization} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="protein-structure" className="flex items-center gap-1">
            <Dna className="h-4 w-4" />
            Structure
          </TabsTrigger>
          <TabsTrigger value="molecular-dynamics" className="flex items-center gap-1">
            <Activity className="h-4 w-4" />
            Dynamics
          </TabsTrigger>
          <TabsTrigger value="drug-network" className="flex items-center gap-1">
            <Network className="h-4 w-4" />
            Networks
          </TabsTrigger>
          <TabsTrigger value="protein-folding" className="flex items-center gap-1">
            <RotateCcw className="h-4 w-4" />
            Folding
          </TabsTrigger>
          <TabsTrigger value="allosteric-network" className="flex items-center gap-1">
            <Target className="h-4 w-4" />
            Allostery
          </TabsTrigger>
          <TabsTrigger value="drug-resistance" className="flex items-center gap-1">
            <Shield className="h-4 w-4" />
            Resistance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="protein-structure">
          <ProteinStructureViewer data={getCurrentProteinData()} />
        </TabsContent>

        <TabsContent value="molecular-dynamics">
          <MolecularDynamicsViewer
            data={{
              protein: {
                name: getCurrentProteinData().name,
                sequence:
                  "MDLSALRVEEVQNVINAMQKILECPICLELIKEPVSTKCDHIFCKFCMLKLLNQKKGPSQCPLCKNDITKRSLQESTRFSQLVEELLKIICAFQLDTGLEYANSYNFAKKENNSPEHLKDEVSIIQSMGYRNRAKRLLQSEPENPSLQETSLSVQLSNLGTVRTLRTKQRIQPQKTSVYIELGSDSSEDTVNKATYCSVGDQELLQITPQGTRDEISLDSAKKAACEFSETDVTNTEHHQPSNNDLNTTEKRAAERHPEKYQGSSVSNLHVEPCGTNTHASSLQHENSSLLLTKDRMNVEKAEFCNKSKQPGLARSQHNRWAGSKETCNDRRTPSTEKKVDLNADPLCERKEWNKQKLPCSENPRDTEDVPWITLNSSIQKVNEWSRQRWWESWSVPCS",
                length: getCurrentProteinData().length,
                temperature: 310,
                simulationTime: 100,
              },
              variants: getCurrentProteinData().variants.map((v) => ({
                position: v.position,
                wildType: v.wildType,
                mutant: v.mutant,
                impact: v.impact,
                stabilityEffect: v.stabilityChange,
                flexibilityChange: Math.random() * 0.4 - 0.2,
                bindingEffect: v.bindingAffinity,
              })),
              trajectory: Array.from({ length: 1000 }, (_, frameIndex) => ({
                timepoint: frameIndex * 0.1,
                coordinates: Array.from({ length: getCurrentProteinData().length }, (_, residueIndex) => ({
                  x: Math.sin(frameIndex * 0.01 + residueIndex * 0.1) * (1 + Math.random() * 0.2),
                  y: Math.cos(frameIndex * 0.01 + residueIndex * 0.1) * (1 + Math.random() * 0.2),
                  z: Math.sin(frameIndex * 0.02 + residueIndex * 0.05) * (1 + Math.random() * 0.1),
                })),
                energy: -15000 + Math.sin(frameIndex * 0.05) * 500 + Math.random() * 200,
                rmsd: 1.2 + Math.sin(frameIndex * 0.03) * 0.3 + Math.random() * 0.1,
                rmsf: Array.from(
                  { length: getCurrentProteinData().length },
                  (_, residueIndex) => 0.5 + Math.sin(residueIndex * 0.1) * 0.3 + Math.random() * 0.2,
                ),
                secondaryStructure: [
                  { type: "helix" as const, start: 10, end: 25, stability: 0.8 + Math.sin(frameIndex * 0.02) * 0.2 },
                  { type: "sheet" as const, start: 30, end: 45, stability: 0.9 + Math.sin(frameIndex * 0.03) * 0.1 },
                  { type: "loop" as const, start: 46, end: 60, stability: 0.6 + Math.sin(frameIndex * 0.04) * 0.3 },
                ],
              })),
              energyProfile: Array.from({ length: 1000 }, (_, frameIndex) => ({
                time: frameIndex * 0.1,
                totalEnergy: -15000 + Math.sin(frameIndex * 0.05) * 500,
                kineticEnergy: 2000 + Math.sin(frameIndex * 0.08) * 300,
                potentialEnergy: -17000 + Math.sin(frameIndex * 0.05) * 400,
                temperature: 310 + Math.sin(frameIndex * 0.06) * 5,
              })),
            }}
            showComparison={false}
          />
        </TabsContent>

        <TabsContent value="drug-network">
          <DrugProteinNetwork
            specialty="Oncology"
            selectedProteins={[selectedProtein]}
            selectedDrugs={[selectedDrug]}
          />
        </TabsContent>

        <TabsContent value="protein-folding">
          <ProteinFoldingViewer
            proteinData={{
              name: getCurrentProteinData().name,
              sequence:
                "MDLSALRVEEVQNVINAMQKILECPICLELIKEPVSTKCDHIFCKFCMLKLLNQKKGPSQCPLCKNDITKRSLQESTRFSQLVEELLKIICAFQLDTGLEYANSYNFAKKENNSPEHLKDEVSIIQSMGYRNRAKRLLQSEPENPSLQETSLSVQLSNLGTVRTLRTKQRIQPQKTSVYIELGSDSSEDTVNKATYCSVGDQELLQITPQGTRDEISLDSAKKAACEFSETDVTNTEHHQPSNNDLNTTEKRAAERHPEKYQGSSVSNLHVEPCGTNTHASSLQHENSSLLLTKDRMNVEKAEFCNKSKQPGLARSQHNRWAGSKETCNDRRTPSTEKKVDLNADPLCERKEWNKQKLPCSENPRDTEDVPWITLNSSIQKVNEWSRQRWWESWSVPCS",
              length: getCurrentProteinData().length,
              domains: getCurrentProteinData().domains,
              variants: getCurrentProteinData().variants,
            }}
            simulationParameters={{
              temperature: 310,
              timeStep: 0.1,
              totalTime: 100,
              solventModel: "implicit",
            }}
          />
        </TabsContent>

        <TabsContent value="allosteric-network">
          <AllostericNetworkViewer
            proteinData={{
              name: getCurrentProteinData().name,
              pdbId: getCurrentProteinData().pdbId,
              sequence:
                "MDLSALRVEEVQNVINAMQKILECPICLELIKEPVSTKCDHIFCKFCMLKLLNQKKGPSQCPLCKNDITKRSLQESTRFSQLVEELLKIICAFQLDTGLEYANSYNFAKKENNSPEHLKDEVSIIQSMGYRNRAKRLLQSEPENPSLQETSLSVQLSNLGTVRTLRTKQRIQPQKTSVYIELGSDSSEDTVNKATYCSVGDQELLQITPQGTRDEISLDSAKKAACEFSETDVTNTEHHQPSNNDLNTTEKRAAERHPEKYQGSSVSNLHVEPCGTNTHASSLQHENSSLLLTKDRMNVEKAEFCNKSKQPGLARSQHNRWAGSKETCNDRRTPSTEKKVDLNADPLCERKEWNKQKLPCSENPRDTEDVPWITLNSSIQKVNEWSRQRWWESWSVPCS",
              length: getCurrentProteinData().length,
              variants: getCurrentProteinData().variants,
            }}
            selectedVariants={selectedPatient?.mutations.map((m) => m.gene + "_" + m.mutation) || []}
          />
        </TabsContent>

        <TabsContent value="drug-resistance">
          <DrugResistanceAnalyzer
            patientMutations={getPatientResistanceMutations()}
            selectedDrug={selectedDrug}
            cancerType={selectedPatient?.cancerType || "Lung Cancer"}
          />
        </TabsContent>
      </Tabs>

      {/* Analysis Summary */}
      {selectedPatient && (
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-[#FF8C00]" />
              Patient Analysis Summary
            </CardTitle>
            <CardDescription>Integrated analysis results for {selectedPatient.name}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-[#F5F7FA] border">
                <h4 className="font-medium text-[#4A4A4A] mb-2">Mutation Profile</h4>
                <div className="space-y-2">
                  {selectedPatient.mutations.map((mutation, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm">
                        {mutation.gene} {mutation.mutation}
                      </span>
                      <Badge
                        variant="outline"
                        className={
                          mutation.resistanceLevel === "High"
                            ? "bg-[#DC143C]/10 text-[#DC143C]"
                            : "bg-[#FF8C00]/10 text-[#FF8C00]"
                        }
                      >
                        {mutation.resistanceLevel}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-lg bg-[#F5F7FA] border">
                <h4 className="font-medium text-[#4A4A4A] mb-2">Treatment Status</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Current Drug:</span>
                    <span className="font-medium">{selectedPatient.currentTreatment}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Resistance Risk:</span>
                    <Badge variant="outline" className="bg-[#DC143C]/10 text-[#DC143C]">
                      High
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Est. Time to Resistance:</span>
                    <span className="font-medium">8-12 months</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-[#F5F7FA] border">
                <h4 className="font-medium text-[#4A4A4A] mb-2">Recommendations</h4>
                <div className="space-y-2">
                  <div className="text-sm">• Consider combination therapy</div>
                  <div className="text-sm">• Monitor liquid biopsy q3mo</div>
                  <div className="text-sm">• Prepare alternative agents</div>
                  <Button size="sm" className="w-full mt-2 bg-[#2E8B57] hover:bg-[#2E8B57]/90">
                    Generate Full Report
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
