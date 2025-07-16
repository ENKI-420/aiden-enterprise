"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { FlaskConical, Clock, BarChart2, Calculator } from "lucide-react"

interface PKParameters {
  dose: number // mg
  administrationRoute: "oral" | "iv" | "subcutaneous" | "intramuscular"
  absorptionRate: number // 1/hr (ka)
  distributionVolume: number // L (Vd)
  eliminationRate: number // 1/hr (ke)
  bioavailability: number // fraction (F)
  clearance: number // L/hr (CL)
  halfLife: number // hr (t1/2)
}

interface PKSimulationResult {
  time: number // hr
  concentration: number // mg/L
}

interface PharmacokineticModelingProps {
  drugName: string
  initialParameters?: Partial<PKParameters>
}

export function PharmacokineticModelingInterface({ drugName, initialParameters = {} }: PharmacokineticModelingProps) {
  const [pkParameters, setPkParameters] = useState<PKParameters>({
    dose: initialParameters.dose || 100,
    administrationRoute: initialParameters.administrationRoute || "oral",
    absorptionRate: initialParameters.absorptionRate || 0.5, // ka
    distributionVolume: initialParameters.distributionVolume || 10, // Vd
    eliminationRate: initialParameters.eliminationRate || 0.1, // ke
    bioavailability: initialParameters.bioavailability || 0.8, // F
    clearance: initialParameters.clearance || 1, // L/hr (calculated if not provided)
    halfLife: initialParameters.halfLife || 6.93, // hr (calculated if not provided)
  })
  const [simulationResults, setSimulationResults] = useState<PKSimulationResult[]>([])
  const [simulationDuration, setSimulationDuration] = useState([24]) // hours
  const [selectedModel, setSelectedModel] = useState<"one-compartment" | "two-compartment">("one-compartment")

  // Recalculate clearance and half-life based on Vd and ke
  useEffect(() => {
    const newClearance = pkParameters.eliminationRate * pkParameters.distributionVolume
    const newHalfLife = Math.log(2) / pkParameters.eliminationRate
    setPkParameters((prev) => ({
      ...prev,
      clearance: Number.parseFloat(newClearance.toFixed(2)),
      halfLife: Number.parseFloat(newHalfLife.toFixed(2)),
    }))
  }, [pkParameters.eliminationRate, pkParameters.distributionVolume])

  const simulatePK = useCallback(() => {
    const results: PKSimulationResult[] = []
    const { dose, administrationRoute, absorptionRate, distributionVolume, eliminationRate, bioavailability } =
      pkParameters
    const duration = simulationDuration[0]
    const timeStep = 0.1 // hours

    if (selectedModel === "one-compartment") {
      // Oral administration (first-order absorption)
      if (administrationRoute === "oral") {
        for (let t = 0; t <= duration; t += timeStep) {
          const concentration =
            ((dose * bioavailability * absorptionRate) / (distributionVolume * (absorptionRate - eliminationRate))) *
            (Math.exp(-eliminationRate * t) - Math.exp(-absorptionRate * t))
          results.push({
            time: Number.parseFloat(t.toFixed(1)),
            concentration: Math.max(0, Number.parseFloat(concentration.toFixed(2))),
          })
        }
      } else {
        // IV administration (instantaneous absorption)
        for (let t = 0; t <= duration; t += timeStep) {
          const concentration = (dose / distributionVolume) * Math.exp(-eliminationRate * t)
          results.push({
            time: Number.parseFloat(t.toFixed(1)),
            concentration: Math.max(0, Number.parseFloat(concentration.toFixed(2))),
          })
        }
      }
    }
    // Two-compartment model simulation would go here
    // For simplicity, we'll just use the one-compartment for now.

    setSimulationResults(results)
  }, [pkParameters, simulationDuration, selectedModel])

  useEffect(() => {
    simulatePK()
  }, [simulatePK])

  const handleParameterChange = (param: keyof PKParameters, value: string | number) => {
    setPkParameters((prev) => ({
      ...prev,
      [param]: typeof value === "string" ? Number.parseFloat(value) : value,
    }))
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FlaskConical className="h-5 w-5 text-[#FF8C00]" />
          Pharmacokinetic Modeling: {drugName}
        </CardTitle>
        <CardDescription>Simulate drug absorption, distribution, metabolism, and excretion (ADME).</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <Tabs value={selectedModel} onValueChange={(value: any) => setSelectedModel(value)}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="one-compartment">One-Compartment Model</TabsTrigger>
            <TabsTrigger value="two-compartment" disabled>
              Two-Compartment Model (Coming Soon)
            </TabsTrigger>
          </TabsList>
          <TabsContent value="one-compartment" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dose">Dose (mg)</Label>
                <Input
                  id="dose"
                  type="number"
                  value={pkParameters.dose}
                  onChange={(e) => handleParameterChange("dose", e.target.value)}
                  min="1"
                  step="1"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="route">Administration Route</Label>
                <Select
                  value={pkParameters.administrationRoute}
                  onValueChange={(value: any) => handleParameterChange("administrationRoute", value)}
                >
                  <SelectTrigger id="route">
                    <SelectValue placeholder="Select route" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="oral">Oral</SelectItem>
                    <SelectItem value="iv">Intravenous (IV)</SelectItem>
                    <SelectItem value="subcutaneous">Subcutaneous</SelectItem>
                    <SelectItem value="intramuscular">Intramuscular</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {pkParameters.administrationRoute === "oral" && (
                <div className="space-y-2">
                  <Label htmlFor="absorption-rate">Absorption Rate (ka, 1/hr)</Label>
                  <Slider
                    id="absorption-rate"
                    min={0.01}
                    max={2}
                    step={0.01}
                    value={[pkParameters.absorptionRate]}
                    onValueChange={([value]) => handleParameterChange("absorptionRate", value)}
                  />
                  <div className="text-xs text-center">{pkParameters.absorptionRate.toFixed(2)}</div>
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="distribution-volume">Volume of Distribution (Vd, L)</Label>
                <Slider
                  id="distribution-volume"
                  min={1}
                  max={100}
                  step={1}
                  value={[pkParameters.distributionVolume]}
                  onValueChange={([value]) => handleParameterChange("distributionVolume", value)}
                />
                <div className="text-xs text-center">{pkParameters.distributionVolume.toFixed(0)} L</div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="elimination-rate">Elimination Rate (ke, 1/hr)</Label>
                <Slider
                  id="elimination-rate"
                  min={0.01}
                  max={1}
                  step={0.01}
                  value={[pkParameters.eliminationRate]}
                  onValueChange={([value]) => handleParameterChange("eliminationRate", value)}
                />
                <div className="text-xs text-center">{pkParameters.eliminationRate.toFixed(2)}</div>
              </div>
              {pkParameters.administrationRoute === "oral" && (
                <div className="space-y-2">
                  <Label htmlFor="bioavailability">Bioavailability (F)</Label>
                  <Slider
                    id="bioavailability"
                    min={0.01}
                    max={1}
                    step={0.01}
                    value={[pkParameters.bioavailability]}
                    onValueChange={([value]) => handleParameterChange("bioavailability", value)}
                  />
                  <div className="text-xs text-center">{pkParameters.bioavailability.toFixed(2)}</div>
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="simulation-duration">Simulation Duration (hours)</Label>
                <Slider
                  id="simulation-duration"
                  min={1}
                  max={72}
                  step={1}
                  value={simulationDuration}
                  onValueChange={setSimulationDuration}
                />
                <div className="text-xs text-center">{simulationDuration[0]} hours</div>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-700">Calculated Clearance (CL)</p>
                    <p className="text-xl font-bold text-blue-900">{pkParameters.clearance.toFixed(2)} L/hr</p>
                  </div>
                  <Calculator className="h-8 w-8 text-blue-500" />
                </CardContent>
              </Card>
              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-700">Calculated Half-Life (t½)</p>
                    <p className="text-xl font-bold text-green-900">{pkParameters.halfLife.toFixed(2)} hours</p>
                  </div>
                  <Clock className="h-8 w-8 text-green-500" />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart2 className="h-5 w-5 text-[#2E8B57]" />
              Concentration-Time Curve
            </CardTitle>
            <CardDescription>Visual representation of drug concentration over time.</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={simulationResults}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" label={{ value: "Time (hours)", position: "insideBottom", offset: -5 }} />
                <YAxis
                  label={{ value: "Concentration (mg/L)", angle: -90, position: "insideLeft", offset: 10 }}
                  domain={[0, "dataMax + 10"]}
                />
                <Tooltip
                  formatter={(value: number) => [`${value.toFixed(2)} mg/L`, "Concentration"]}
                  labelFormatter={(label: number) => `Time: ${label.toFixed(1)} hours`}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="concentration"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                  name="Drug Concentration"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  )
}
