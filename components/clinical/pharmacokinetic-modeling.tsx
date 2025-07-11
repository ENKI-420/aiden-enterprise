"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Pill } from "lucide-react"

interface PKParameters {
  dose: number // mg
  volumeOfDistribution: number // L
  eliminationRateConstant: number // 1/hr
  absorptionRateConstant: number // 1/hr (for oral administration)
  bioavailability: number // fraction (0-1)
}

interface PKDataPoint {
  time: number // hours
  concentration: number // mg/L
}

// Function to simulate single-dose oral administration (one-compartment model)
const simulateOralPK = (params: PKParameters, timePoints: number[]): PKDataPoint[] => {
  const { dose, volumeOfDistribution, eliminationRateConstant, absorptionRateConstant, bioavailability } = params
  const data: PKDataPoint[] = []

  if (absorptionRateConstant <= 0 || eliminationRateConstant <= 0 || volumeOfDistribution <= 0) {
    return [] // Avoid division by zero or invalid parameters
  }

  const F_D_Vd = (bioavailability * dose) / volumeOfDistribution

  for (const t of timePoints) {
    if (t < 0) {
      data.push({ time: t, concentration: 0 })
      continue
    }
    let concentration = 0
    if (absorptionRateConstant !== eliminationRateConstant) {
      concentration =
        ((F_D_Vd * absorptionRateConstant) / (absorptionRateConstant - eliminationRateConstant)) *
        (Math.exp(-eliminationRateConstant * t) - Math.exp(-absorptionRateConstant * t))
    } else {
      // Handle the special case where Ka = Ke (though rare in practice)
      concentration = F_D_Vd * absorptionRateConstant * t * Math.exp(-eliminationRateConstant * t)
    }
    data.push({ time: t, concentration: Math.max(0, concentration) }) // Concentration cannot be negative
  }
  return data
}

export function PharmacokineticModelingInterface() {
  const [parameters, setParameters] = useState<PKParameters>({
    dose: 100,
    volumeOfDistribution: 10,
    eliminationRateConstant: 0.1,
    absorptionRateConstant: 0.5,
    bioavailability: 1.0,
  })
  const [pkData, setPkData] = useState<PKDataPoint[]>([])
  const [timeHorizon, setTimeHorizon] = useState(24) // hours

  const timePoints = Array.from({ length: timeHorizon * 10 + 1 }, (_, i) => i * 0.1)

  useEffect(() => {
    const data = simulateOralPK(parameters, timePoints)
    setPkData(data)
  }, [parameters, timeHorizon]) // Re-simulate when parameters or time horizon change

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target
    setParameters((prev) => ({
      ...prev,
      [name]: type === "number" ? Number.parseFloat(value) : value,
    }))
  }

  const handleTimeHorizonChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTimeHorizon(Number.parseFloat(e.target.value))
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Pill className="h-5 w-5 text-[#1E90FF]" />
          Pharmacokinetic Modeling
        </CardTitle>
        <CardDescription>
          Simulate drug absorption, distribution, metabolism, and excretion (ADME) processes.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="dose">Dose (mg)</Label>
            <Input
              id="dose"
              name="dose"
              type="number"
              value={parameters.dose}
              onChange={handleChange}
              min="0"
              step="1"
            />
          </div>
          <div>
            <Label htmlFor="volumeOfDistribution">Volume of Distribution (L)</Label>
            <Input
              id="volumeOfDistribution"
              name="volumeOfDistribution"
              type="number"
              value={parameters.volumeOfDistribution}
              onChange={handleChange}
              min="0.1"
              step="0.1"
            />
          </div>
          <div>
            <Label htmlFor="eliminationRateConstant">Elimination Rate Constant (1/hr)</Label>
            <Input
              id="eliminationRateConstant"
              name="eliminationRateConstant"
              type="number"
              value={parameters.eliminationRateConstant}
              onChange={handleChange}
              min="0.001"
              step="0.001"
            />
          </div>
          <div>
            <Label htmlFor="absorptionRateConstant">Absorption Rate Constant (1/hr)</Label>
            <Input
              id="absorptionRateConstant"
              name="absorptionRateConstant"
              type="number"
              value={parameters.absorptionRateConstant}
              onChange={handleChange}
              min="0.001"
              step="0.001"
            />
          </div>
          <div>
            <Label htmlFor="bioavailability">Bioavailability (0-1)</Label>
            <Input
              id="bioavailability"
              name="bioavailability"
              type="number"
              value={parameters.bioavailability}
              onChange={handleChange}
              min="0"
              max="1"
              step="0.01"
            />
          </div>
          <div>
            <Label htmlFor="timeHorizon">Time Horizon (hours)</Label>
            <Input
              id="timeHorizon"
              name="timeHorizon"
              type="number"
              value={timeHorizon}
              onChange={handleTimeHorizonChange}
              min="1"
              step="1"
            />
          </div>
        </div>

        <div className="h-[350px] w-full">
          <ChartContainer
            config={{
              concentration: {
                label: "Drug Concentration (mg/L)",
                color: "hsl(var(--chart-1))",
              },
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={pkData}
                margin={{
                  top: 10,
                  right: 30,
                  left: 0,
                  bottom: 0,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="time"
                  label={{ value: "Time (hours)", position: "insideBottom", offset: -5 }}
                  tickFormatter={(value) => value.toFixed(1)}
                />
                <YAxis
                  label={{ value: "Concentration (mg/L)", angle: -90, position: "insideLeft" }}
                  tickFormatter={(value) => value.toFixed(2)}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="concentration"
                  stroke="var(--color-concentration)"
                  activeDot={{ r: 8 }}
                  name="Concentration"
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>

        <div className="mt-4 p-4 bg-gray-50 rounded-lg text-sm text-gray-700">
          <h3 className="font-semibold mb-2">Simulation Insights:</h3>
          {pkData.length > 0 && (
            <>
              <p>
                <strong>Peak Concentration (Cmax):</strong> {Math.max(...pkData.map((d) => d.concentration)).toFixed(2)}{" "}
                mg/L
              </p>
              <p>
                <strong>Time to Peak (Tmax):</strong>{" "}
                {pkData
                  .find((d) => d.concentration === Math.max(...pkData.map((p) => p.concentration)))
                  ?.time.toFixed(1)}{" "}
                hours
              </p>
              <p>
                <strong>Half-life (t1/2):</strong> {(Math.log(2) / parameters.eliminationRateConstant).toFixed(2)} hours
              </p>
            </>
          )}
          <p className="mt-2 text-xs text-gray-600">
            Note: This is a simplified one-compartment oral PK model. Real-world pharmacokinetics are more complex.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
