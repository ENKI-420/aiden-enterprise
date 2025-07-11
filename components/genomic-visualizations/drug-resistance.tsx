"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Shield, Search, FlaskConical } from "lucide-react"

interface Mutation {
  position: number
  wildType: string
  mutant: string
  resistanceLevel: "low" | "medium" | "high" | "unknown"
}

interface DrugResistanceAnalyzerProps {
  proteinName: string
  drugName: string
  sequence: string
  mutations: Mutation[]
}

const resistanceDescriptions = {
  low: "Low impact on drug efficacy. May still respond to treatment.",
  medium: "Moderate impact on drug efficacy. Reduced response expected.",
  high: "High impact on drug efficacy. Significant resistance, treatment likely ineffective.",
  unknown: "Resistance level unknown. Further research or testing recommended.",
}

export function DrugResistanceAnalyzer({
  proteinName,
  drugName,
  sequence,
  mutations: initialMutations,
}: DrugResistanceAnalyzerProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterLevel, setFilterLevel] = useState<"all" | "low" | "medium" | "high" | "unknown">("all")
  const [filteredMutations, setFilteredMutations] = useState<Mutation[]>(initialMutations)
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0) // Declare currentStepIndex

  useEffect(() => {
    let tempMutations = initialMutations

    if (searchTerm) {
      tempMutations = tempMutations.filter(
        (m) =>
          m.position.toString().includes(searchTerm) ||
          m.wildType.toLowerCase().includes(searchTerm.toLowerCase()) ||
          m.mutant.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (filterLevel !== "all") {
      tempMutations = tempMutations.filter((m) => m.resistanceLevel === filterLevel)
    }

    setFilteredMutations(tempMutations)
  }, [searchTerm, filterLevel, initialMutations])

  const getResistanceColor = (level: Mutation["resistanceLevel"]) => {
    switch (level) {
      case "low":
        return "text-green-600"
      case "medium":
        return "text-yellow-600"
      case "high":
        return "text-red-600"
      default:
        return "text-gray-500"
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-[#1E90FF]" />
          Drug Resistance Mutation Analysis: {proteinName} vs. {drugName}
        </CardTitle>
        <CardDescription>Analyze mutations for drug resistance prediction and mechanism elucidation.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Label htmlFor="search-mutations" className="sr-only">
              Search Mutations
            </Label>
            <Input
              id="search-mutations"
              placeholder="Search by position, wild type, or mutant"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          </div>
          <div>
            <Label htmlFor="filter-resistance">Filter by Resistance Level</Label>
            <Select
              value={filterLevel}
              onValueChange={(value: "all" | "low" | "medium" | "high" | "unknown") => setFilterLevel(value)}
            >
              <SelectTrigger id="filter-resistance">
                <SelectValue placeholder="All Levels" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="unknown">Unknown</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="overflow-x-auto border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Position</TableHead>
                <TableHead>Wild Type</TableHead>
                <TableHead>Mutant</TableHead>
                <TableHead>Resistance Level</TableHead>
                <TableHead>Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMutations.length > 0 ? (
                filteredMutations.map((mutation, index) => (
                  <TableRow key={index} onClick={() => setCurrentStepIndex(mutation.position)}>
                    <TableCell className="font-medium">{mutation.position}</TableCell>
                    <TableCell>{mutation.wildType}</TableCell>
                    <TableCell>{mutation.mutant}</TableCell>
                    <TableCell className={getResistanceColor(mutation.resistanceLevel)}>
                      {mutation.resistanceLevel.charAt(0).toUpperCase() + mutation.resistanceLevel.slice(1)}
                    </TableCell>
                    <TableCell>{resistanceDescriptions[mutation.resistanceLevel]}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4 text-gray-500">
                    No mutations found matching your criteria.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="mt-4 p-4 bg-gray-50 rounded-lg text-sm text-gray-700">
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            <FlaskConical className="h-4 w-4" />
            Sequence Context:
          </h3>
          <p className="font-mono text-xs break-all">
            ...{sequence.substring(Math.max(0, currentStepIndex - 20), currentStepIndex)}
            <span className="bg-yellow-200 text-yellow-800 font-bold">{sequence.charAt(currentStepIndex)}</span>
            {sequence.substring(currentStepIndex + 1, currentStepIndex + 20)}...
          </p>
          <p className="mt-2 text-xs text-gray-600">
            The sequence snippet highlights the region around the currently selected mutation (if any).
          </p>
        </div>

        <div className="flex justify-end">
          <Button variant="outline">Generate Report</Button>
        </div>
      </CardContent>
    </Card>
  )
}
