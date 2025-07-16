"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Activity,
  Zap,
  MicroscopeIcon as Molecule,
  TrendingUp,
  Settings,
  Play,
  Pause,
  RotateCcw,
  Download,
  Share2,
} from "lucide-react"

export default function MembranePKDashboardPage() {
  const [isSimulationRunning, setIsSimulationRunning] = useState(false)
  const [simulationProgress, setSimulationProgress] = useState(0)
  const [selectedProtein, setSelectedProtein] = useState("gpcr-a")
  const [temperature, setTemperature] = useState([310])
  const [pH, setPH] = useState([7.4])
  const [ionicStrength, setIonicStrength] = useState([150])

  const proteinData = [
    { id: "gpcr-a", name: "GPCR-A Receptor", type: "G-Protein Coupled", stability: 85 },
    { id: "ion-channel", name: "Sodium Channel", type: "Ion Channel", stability: 92 },
    { id: "transporter", name: "ABC Transporter", type: "Transporter", stability: 78 },
  ]

  const pkParameters = [
    { parameter: "Clearance", value: "2.4 L/h", change: "+5.2%" },
    { parameter: "Volume of Distribution", value: "45.8 L", change: "-2.1%" },
    { parameter: "Half-life", value: "8.3 h", change: "+1.8%" },
    { parameter: "Bioavailability", value: "67%", change: "+3.4%" },
  ]

  const handleSimulationToggle = () => {
    setIsSimulationRunning(!isSimulationRunning)
    if (!isSimulationRunning) {
      // Simulate progress
      const interval = setInterval(() => {
        setSimulationProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            setIsSimulationRunning(false)
            return 100
          }
          return prev + 2
        })
      }, 100)
    } else {
      setSimulationProgress(0)
    }
  }

  const resetSimulation = () => {
    setIsSimulationRunning(false)
    setSimulationProgress(0)
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Membrane & PK Dashboard</h1>
          <p className="text-muted-foreground">Membrane protein dynamics and pharmacokinetic modeling interface</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Tabs defaultValue="membrane" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="membrane">Membrane Dynamics</TabsTrigger>
          <TabsTrigger value="pharmacokinetics">Pharmacokinetics</TabsTrigger>
          <TabsTrigger value="analysis">Combined Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="membrane" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Simulation Controls */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Simulation Controls
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Protein Selection</Label>
                  <Select value={selectedProtein} onValueChange={setSelectedProtein}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {proteinData.map((protein) => (
                        <SelectItem key={protein.id} value={protein.id}>
                          {protein.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Temperature: {temperature[0]}K</Label>
                  <Slider value={temperature} onValueChange={setTemperature} min={280} max={340} step={1} />
                </div>

                <div className="space-y-2">
                  <Label>pH: {pH[0]}</Label>
                  <Slider value={pH} onValueChange={setPH} min={6.0} max={8.5} step={0.1} />
                </div>

                <div className="space-y-2">
                  <Label>Ionic Strength: {ionicStrength[0]} mM</Label>
                  <Slider value={ionicStrength} onValueChange={setIonicStrength} min={50} max={300} step={10} />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={handleSimulationToggle}
                    className="flex-1"
                    disabled={simulationProgress > 0 && simulationProgress < 100}
                  >
                    {isSimulationRunning ? (
                      <>
                        <Pause className="h-4 w-4 mr-2" />
                        Running...
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Start
                      </>
                    )}
                  </Button>
                  <Button variant="outline" onClick={resetSimulation}>
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>

                {simulationProgress > 0 && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{simulationProgress}%</span>
                    </div>
                    <Progress value={simulationProgress} />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Protein Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Molecule className="h-5 w-5" />
                  Protein Properties
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {proteinData
                  .filter((protein) => protein.id === selectedProtein)
                  .map((protein) => (
                    <div key={protein.id} className="space-y-3">
                      <div>
                        <h3 className="font-semibold">{protein.name}</h3>
                        <Badge variant="secondary">{protein.type}</Badge>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Stability Score</span>
                          <span>{protein.stability}%</span>
                        </div>
                        <Progress value={protein.stability} />
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Molecular Weight</span>
                          <p className="font-medium">45.2 kDa</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Membrane Spans</span>
                          <p className="font-medium">7 TM</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Hydrophobicity</span>
                          <p className="font-medium">0.42</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Flexibility</span>
                          <p className="font-medium">High</p>
                        </div>
                      </div>
                    </div>
                  ))}
              </CardContent>
            </Card>

            {/* Real-time Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Live Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Conformational Energy</span>
                    <span className="font-mono text-sm">-245.8 kcal/mol</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">RMSD</span>
                    <span className="font-mono text-sm">2.34 Å</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Radius of Gyration</span>
                    <span className="font-mono text-sm">18.7 Å</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Surface Area</span>
                    <span className="font-mono text-sm">12,450 Ų</span>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-2">Membrane Interactions</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Lipid Contacts</span>
                      <span>142</span>
                    </div>
                    <div className="flex justify-between">
                      <span>H-Bonds</span>
                      <span>28</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Hydrophobic Contacts</span>
                      <span>89</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Visualization Area */}
          <Card>
            <CardHeader>
              <CardTitle>3D Membrane Visualization</CardTitle>
              <CardDescription>Interactive molecular dynamics simulation of membrane protein</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                <div className="text-center space-y-2">
                  <Molecule className="h-12 w-12 mx-auto text-gray-400" />
                  <p className="text-gray-500">3D Membrane Protein Visualization</p>
                  <p className="text-sm text-gray-400">Interactive molecular dynamics simulation will appear here</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pharmacokinetics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* PK Parameters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  PK Parameters
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pkParameters.map((param, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{param.parameter}</p>
                        <p className="text-2xl font-bold">{param.value}</p>
                      </div>
                      <Badge variant={param.change.startsWith("+") ? "default" : "secondary"}>{param.change}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Dosing Regimen */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Dosing Optimization
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Dose (mg)</Label>
                  <Slider defaultValue={[100]} min={10} max={500} step={10} />
                </div>
                <div className="space-y-2">
                  <Label>Dosing Interval (hours)</Label>
                  <Slider defaultValue={[12]} min={4} max={24} step={2} />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="steady-state" />
                  <Label htmlFor="steady-state">Steady State Analysis</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="population-pk" />
                  <Label htmlFor="population-pk">Population PK</Label>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* PK Curves */}
          <Card>
            <CardHeader>
              <CardTitle>Pharmacokinetic Profiles</CardTitle>
              <CardDescription>Concentration-time curves and PK/PD relationships</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                <div className="text-center space-y-2">
                  <TrendingUp className="h-12 w-12 mx-auto text-gray-400" />
                  <p className="text-gray-500">PK/PD Visualization</p>
                  <p className="text-sm text-gray-400">Concentration-time curves and dose-response relationships</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Integrated Analysis</CardTitle>
                <CardDescription>Combined membrane dynamics and pharmacokinetic modeling</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                  <div className="text-center space-y-2">
                    <Activity className="h-12 w-12 mx-auto text-gray-400" />
                    <p className="text-gray-500">Combined Analysis View</p>
                    <p className="text-sm text-gray-400">Integrated membrane-PK relationships</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Predictive Models</CardTitle>
                <CardDescription>AI-driven predictions and recommendations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900">Recommendation</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      Optimal dosing interval: 8-12 hours based on membrane permeability
                    </p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-900">Prediction</h4>
                    <p className="text-sm text-green-700 mt-1">
                      85% probability of therapeutic efficacy at current parameters
                    </p>
                  </div>
                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <h4 className="font-medium text-yellow-900">Alert</h4>
                    <p className="text-sm text-yellow-700 mt-1">
                      Consider pH adjustment for improved membrane stability
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
