"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MembraneProteinDynamicsViewer } from "@/components/genomic-visualizations/membrane-protein-dynamics"
import { PharmacokineticModelingInterface } from "@/components/clinical/pharmacokinetic-modeling"
import { DrugResistanceAnalyzer } from "@/components/genomic-visualizations/drug-resistance"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Dna, Waves, Shield, Pill } from "lucide-react"

export default function MembranePKDashboard() {
  const [activeTab, setActiveTab] = useState("membrane-dynamics")

  return (
    <div className="container mx-auto py-8 px-4 md:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#333333] flex items-center gap-3">
          <Dna className="h-8 w-8 text-[#1E90FF]" />
          Genomic Twin: Membrane & PK Dashboard
        </h1>
        <p className="text-[#4A4A4A]/80 mt-2">
          Comprehensive analysis dashboard for membrane protein dynamics, pharmacokinetics, and drug resistance.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={(value: string) => setActiveTab(value)} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-3">
          <TabsTrigger value="membrane-dynamics" className="flex items-center gap-2">
            <Waves className="h-4 w-4" /> Membrane Dynamics
          </TabsTrigger>
          <TabsTrigger value="pharmacokinetics" className="flex items-center gap-2">
            <Pill className="h-4 w-4" /> Pharmacokinetics
          </TabsTrigger>
          <TabsTrigger value="drug-resistance" className="flex items-center gap-2">
            <Shield className="h-4 w-4" /> Drug Resistance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="membrane-dynamics">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Waves className="h-5 w-5 text-[#1E90FF]" />
                Membrane Protein Dynamics Visualization
              </CardTitle>
              <CardDescription>
                Visualize and analyze conformational changes and lipid interactions of membrane proteins.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MembraneProteinDynamicsViewer
                proteinName="GPCR"
                sequence="MGLSDGEWQLVLNVWGKVEADIPGHGQEVLIRLFKGHPETLEKFD"
                membraneType="POPC"
                initialState={{
                  id: "initial",
                  name: "Initial State",
                  time: 0,
                  conformation: "closed",
                  lipidInteractions: 60,
                  transmembraneDepth: 25,
                  tiltAngle: 5,
                  allostericState: "inactive",
                  coordinates: Array.from({ length: 45 }, (_, i) => ({
                    x: Math.sin(i * 0.2) * 10,
                    y: Math.cos(i * 0.2) * 10,
                    z: i * 0.5,
                  })),
                  description: "Initial closed conformation in POPC membrane.",
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pharmacokinetics">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Pill className="h-5 w-5 text-[#1E90FF]" />
                Pharmacokinetic Modeling Interface
              </CardTitle>
              <CardDescription>
                Simulate and analyze drug absorption, distribution, metabolism, and excretion (ADME).
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PharmacokineticModelingInterface />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="drug-resistance">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-[#1E90FF]" />
                Drug Resistance Mutation Analysis
              </CardTitle>
              <CardDescription>
                Predict drug resistance through mutation analysis and elucidate underlying mechanisms.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DrugResistanceAnalyzer
                proteinName="HIV-1 Protease"
                drugName="Darunavir"
                sequence="PQITLWQRPLVTIKIGGQLKEALLDTGADDTVLEEMSLPGRWKPKMIGGIGGFIKVRQYDQILIEICGHKAIGTVLVGPTPVNIIGRNLLTQIGCTLNF"
                mutations={[
                  { position: 50, wildType: "I", mutant: "V", resistanceLevel: "high" },
                  { position: 84, wildType: "V", mutant: "A", resistanceLevel: "medium" },
                ]}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
