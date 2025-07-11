"use client"

import type React from "react"

import { useState, useRef, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { TooltipProvider } from "@/components/ui/tooltip"
import {
  Network,
  Zap,
  Target,
  Search,
  Download,
  Play,
  Pause,
  RotateCcw,
  Maximize,
  Settings,
  Activity,
  AlertTriangle,
  CheckCircle,
  Info,
} from "lucide-react"

interface DrugNode {
  id: string
  name: string
  type: "drug"
  category: "approved" | "investigational" | "experimental"
  mechanism: string
  indication: string[]
  molecularWeight: number
  bioavailability: number
  halfLife: number
  sideEffects: string[]
  x?: number
  y?: number
  vx?: number
  vy?: number
}

interface ProteinNode {
  id: string
  name: string
  type: "protein"
  gene: string
  function: string
  pathway: string[]
  diseaseAssociation: string[]
  expression: "high" | "medium" | "low"
  druggability: number
  x?: number
  y?: number
  vx?: number
  vy?: number
}

interface InteractionEdge {
  id: string
  source: string
  target: string
  type: "binding" | "inhibition" | "activation" | "modulation"
  affinity: number // -log10(Kd) or IC50
  confidence: number // 0-1
  evidence: "experimental" | "computational" | "literature"
  pathway: string
  clinicalRelevance: "high" | "medium" | "low"
}

interface PathwayData {
  id: string
  name: string
  category: string
  description: string
  nodes: string[]
  significance: "critical" | "important" | "moderate"
  diseaseRelevance: string[]
}

interface DrugProteinNetworkProps {
  specialty: string
  selectedProteins?: string[]
  selectedDrugs?: string[]
}

export function DrugProteinNetwork({ specialty, selectedProteins = [], selectedDrugs = [] }: DrugProteinNetworkProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()

  const [isSimulating, setIsSimulating] = useState(false)
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [selectedEdge, setSelectedEdge] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<"all" | "drugs" | "proteins" | "pathways">("all")
  const [affinityThreshold, setAffinityThreshold] = useState([5.0])
  const [confidenceThreshold, setConfidenceThreshold] = useState([0.7])
  const [showPathways, setShowPathways] = useState(true)
  const [layoutMode, setLayoutMode] = useState<"force" | "circular" | "hierarchical">("force")
  const [colorScheme, setColorScheme] = useState<"category" | "affinity" | "pathway" | "confidence">("category")
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [zoom, setZoom] = useState([1])
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 })

  // Generate specialty-specific network data
  const generateNetworkData = (specialty: string) => {
    const drugData: DrugNode[] = [
      {
        id: "drug_olaparib",
        name: "Olaparib",
        type: "drug",
        category: "approved",
        mechanism: "PARP inhibitor",
        indication: ["Ovarian cancer", "Breast cancer", "Prostate cancer"],
        molecularWeight: 434.46,
        bioavailability: 60,
        halfLife: 11.9,
        sideEffects: ["Nausea", "Fatigue", "Anemia", "Vomiting"],
      },
      {
        id: "drug_talazoparib",
        name: "Talazoparib",
        type: "drug",
        category: "approved",
        mechanism: "PARP inhibitor",
        indication: ["Breast cancer"],
        molecularWeight: 380.36,
        bioavailability: 64,
        halfLife: 90,
        sideEffects: ["Anemia", "Neutropenia", "Thrombocytopenia", "Fatigue"],
      },
      {
        id: "drug_pembrolizumab",
        name: "Pembrolizumab",
        type: "drug",
        category: "approved",
        mechanism: "PD-1 inhibitor",
        indication: ["Melanoma", "Lung cancer", "Head and neck cancer"],
        molecularWeight: 149000,
        bioavailability: 100,
        halfLife: 504,
        sideEffects: ["Fatigue", "Rash", "Diarrhea", "Pneumonitis"],
      },
      {
        id: "drug_erlotinib",
        name: "Erlotinib",
        type: "drug",
        category: "approved",
        mechanism: "EGFR inhibitor",
        indication: ["Non-small cell lung cancer", "Pancreatic cancer"],
        molecularWeight: 393.44,
        bioavailability: 60,
        halfLife: 36,
        sideEffects: ["Rash", "Diarrhea", "Fatigue", "Anorexia"],
      },
      {
        id: "drug_cetuximab",
        name: "Cetuximab",
        type: "drug",
        category: "approved",
        mechanism: "EGFR inhibitor",
        indication: ["Colorectal cancer", "Head and neck cancer"],
        molecularWeight: 152000,
        bioavailability: 100,
        halfLife: 168,
        sideEffects: ["Skin reactions", "Hypomagnesemia", "Infusion reactions"],
      },
      {
        id: "drug_compound_x",
        name: "Compound-X-2024",
        type: "drug",
        category: "experimental",
        mechanism: "Multi-target kinase inhibitor",
        indication: ["Solid tumors"],
        molecularWeight: 456.78,
        bioavailability: 45,
        halfLife: 24,
        sideEffects: ["Under investigation"],
      },
    ]

    const proteinData: ProteinNode[] = [
      {
        id: "protein_brca1",
        name: "BRCA1",
        type: "protein",
        gene: "BRCA1",
        function: "DNA repair, tumor suppressor",
        pathway: ["Homologous recombination", "DNA damage response", "Cell cycle checkpoint"],
        diseaseAssociation: ["Breast cancer", "Ovarian cancer", "Prostate cancer"],
        expression: "medium",
        druggability: 0.3,
      },
      {
        id: "protein_parp1",
        name: "PARP1",
        type: "protein",
        gene: "PARP1",
        function: "DNA repair, chromatin remodeling",
        pathway: ["Base excision repair", "DNA damage response", "Transcriptional regulation"],
        diseaseAssociation: ["Cancer", "Neurodegeneration", "Inflammation"],
        expression: "high",
        druggability: 0.9,
      },
      {
        id: "protein_pd1",
        name: "PD-1",
        type: "protein",
        gene: "PDCD1",
        function: "Immune checkpoint receptor",
        pathway: ["T-cell activation", "Immune tolerance", "Apoptosis"],
        diseaseAssociation: ["Cancer", "Autoimmune diseases"],
        expression: "medium",
        druggability: 0.8,
      },
      {
        id: "protein_pdl1",
        name: "PD-L1",
        type: "protein",
        gene: "CD274",
        function: "Immune checkpoint ligand",
        pathway: ["T-cell inhibition", "Immune evasion", "Tumor microenvironment"],
        diseaseAssociation: ["Cancer", "Inflammatory diseases"],
        expression: "medium",
        druggability: 0.7,
      },
      {
        id: "protein_egfr",
        name: "EGFR",
        type: "protein",
        gene: "EGFR",
        function: "Growth factor receptor, tyrosine kinase",
        pathway: ["MAPK signaling", "PI3K/AKT pathway", "Cell proliferation"],
        diseaseAssociation: ["Lung cancer", "Colorectal cancer", "Glioblastoma"],
        expression: "high",
        druggability: 0.95,
      },
      {
        id: "protein_kras",
        name: "KRAS",
        type: "protein",
        gene: "KRAS",
        function: "GTPase, signal transduction",
        pathway: ["MAPK signaling", "PI3K pathway", "Cell growth"],
        diseaseAssociation: ["Pancreatic cancer", "Colorectal cancer", "Lung cancer"],
        expression: "high",
        druggability: 0.2,
      },
      {
        id: "protein_tp53",
        name: "TP53",
        type: "protein",
        gene: "TP53",
        function: "Tumor suppressor, transcription factor",
        pathway: ["DNA damage response", "Apoptosis", "Cell cycle arrest"],
        diseaseAssociation: ["Li-Fraumeni syndrome", "Various cancers"],
        expression: "medium",
        druggability: 0.1,
      },
    ]

    const interactionData: InteractionEdge[] = [
      {
        id: "int_olaparib_parp1",
        source: "drug_olaparib",
        target: "protein_parp1",
        type: "inhibition",
        affinity: 8.5,
        confidence: 0.95,
        evidence: "experimental",
        pathway: "DNA repair",
        clinicalRelevance: "high",
      },
      {
        id: "int_talazoparib_parp1",
        source: "drug_talazoparib",
        target: "protein_parp1",
        type: "inhibition",
        affinity: 9.1,
        confidence: 0.93,
        evidence: "experimental",
        pathway: "DNA repair",
        clinicalRelevance: "high",
      },
      {
        id: "int_pembrolizumab_pd1",
        source: "drug_pembrolizumab",
        target: "protein_pd1",
        type: "binding",
        affinity: 9.8,
        confidence: 0.98,
        evidence: "experimental",
        pathway: "Immune checkpoint",
        clinicalRelevance: "high",
      },
      {
        id: "int_erlotinib_egfr",
        source: "drug_erlotinib",
        target: "protein_egfr",
        type: "inhibition",
        affinity: 7.8,
        confidence: 0.92,
        evidence: "experimental",
        pathway: "EGFR signaling",
        clinicalRelevance: "high",
      },
      {
        id: "int_cetuximab_egfr",
        source: "drug_cetuximab",
        target: "protein_egfr",
        type: "binding",
        affinity: 8.9,
        confidence: 0.96,
        evidence: "experimental",
        pathway: "EGFR signaling",
        clinicalRelevance: "high",
      },
      {
        id: "int_brca1_parp1",
        source: "protein_brca1",
        target: "protein_parp1",
        type: "modulation",
        affinity: 6.5,
        confidence: 0.85,
        evidence: "literature",
        pathway: "DNA repair",
        clinicalRelevance: "high",
      },
      {
        id: "int_pd1_pdl1",
        source: "protein_pd1",
        target: "protein_pdl1",
        type: "binding",
        affinity: 7.2,
        confidence: 0.9,
        evidence: "experimental",
        pathway: "Immune checkpoint",
        clinicalRelevance: "high",
      },
      {
        id: "int_egfr_kras",
        source: "protein_egfr",
        target: "protein_kras",
        type: "activation",
        affinity: 6.8,
        confidence: 0.88,
        evidence: "experimental",
        pathway: "MAPK signaling",
        clinicalRelevance: "high",
      },
      {
        id: "int_compound_x_multiple",
        source: "drug_compound_x",
        target: "protein_egfr",
        type: "inhibition",
        affinity: 7.5,
        confidence: 0.75,
        evidence: "computational",
        pathway: "Multi-target",
        clinicalRelevance: "medium",
      },
    ]

    const pathwayData: PathwayData[] = [
      {
        id: "pathway_dna_repair",
        name: "DNA Repair Pathway",
        category: "DNA Damage Response",
        description: "Homologous recombination and base excision repair mechanisms",
        nodes: ["protein_brca1", "protein_parp1", "protein_tp53"],
        significance: "critical",
        diseaseRelevance: ["Cancer", "Genetic disorders"],
      },
      {
        id: "pathway_immune_checkpoint",
        name: "Immune Checkpoint Pathway",
        category: "Immunoregulation",
        description: "T-cell activation and immune tolerance mechanisms",
        nodes: ["protein_pd1", "protein_pdl1"],
        significance: "critical",
        diseaseRelevance: ["Cancer", "Autoimmune diseases"],
      },
      {
        id: "pathway_egfr_signaling",
        name: "EGFR Signaling Pathway",
        category: "Growth Factor Signaling",
        description: "Epidermal growth factor receptor signaling cascade",
        nodes: ["protein_egfr", "protein_kras"],
        significance: "important",
        diseaseRelevance: ["Cancer", "Developmental disorders"],
      },
    ]

    return { drugs: drugData, proteins: proteinData, interactions: interactionData, pathways: pathwayData }
  }

  const networkData = generateNetworkData(specialty)
  const [nodes, setNodes] = useState<(DrugNode | ProteinNode)[]>([...networkData.drugs, ...networkData.proteins])
  const [edges, setEdges] = useState<InteractionEdge[]>(networkData.interactions)
  const [pathways, setPathways] = useState<PathwayData[]>(networkData.pathways)

  // Filter data based on search and thresholds
  const filteredEdges = edges.filter((edge) => {
    const affinityMatch = edge.affinity >= affinityThreshold[0]
    const confidenceMatch = edge.confidence >= confidenceThreshold[0]
    const searchMatch =
      searchTerm === "" ||
      edge.pathway.toLowerCase().includes(searchTerm.toLowerCase()) ||
      nodes
        .find((n) => n.id === edge.source)
        ?.name.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      nodes
        .find((n) => n.id === edge.target)
        ?.name.toLowerCase()
        .includes(searchTerm.toLowerCase())

    return affinityMatch && confidenceMatch && searchMatch
  })

  const filteredNodes = nodes.filter((node) => {
    const hasConnections = filteredEdges.some((edge) => edge.source === node.id || edge.target === node.id)
    const typeMatch =
      filterType === "all" ||
      (filterType === "drugs" && node.type === "drug") ||
      (filterType === "proteins" && node.type === "protein")

    return hasConnections && typeMatch
  })

  // Initialize node positions
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2

    setNodes((prevNodes) =>
      prevNodes.map((node, index) => ({
        ...node,
        x: node.x || centerX + (Math.random() - 0.5) * 400,
        y: node.y || centerY + (Math.random() - 0.5) * 400,
        vx: 0,
        vy: 0,
      })),
    )
  }, [])

  // Force-directed layout simulation
  const simulateLayout = useCallback(() => {
    if (!isSimulating) return

    setNodes((prevNodes) => {
      const newNodes = [...prevNodes]
      const canvas = canvasRef.current
      if (!canvas) return newNodes

      // Apply forces
      newNodes.forEach((node, i) => {
        if (!node.x || !node.y) return

        let fx = 0,
          fy = 0

        // Repulsion between nodes
        newNodes.forEach((other, j) => {
          if (i === j || !other.x || !other.y) return

          const dx = node.x! - other.x!
          const dy = node.y! - other.y!
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance > 0) {
            const force = 1000 / (distance * distance)
            fx += (dx / distance) * force
            fy += (dy / distance) * force
          }
        })

        // Attraction along edges
        filteredEdges.forEach((edge) => {
          let other: (DrugNode | ProteinNode) | undefined
          if (edge.source === node.id) {
            other = newNodes.find((n) => n.id === edge.target)
          } else if (edge.target === node.id) {
            other = newNodes.find((n) => n.id === edge.source)
          }

          if (other && other.x && other.y) {
            const dx = other.x - node.x!
            const dy = other.y - node.y!
            const distance = Math.sqrt(dx * dx + dy * dy)

            if (distance > 0) {
              const force = (distance - 100) * 0.01 * edge.confidence
              fx += (dx / distance) * force
              fy += (dy / distance) * force
            }
          }
        })

        // Center attraction
        const centerX = canvas.width / 2
        const centerY = canvas.height / 2
        const dx = centerX - node.x!
        const dy = centerY - node.y!
        fx += dx * 0.001
        fy += dy * 0.001

        // Update velocity and position
        node.vx = (node.vx || 0) * 0.9 + fx * 0.01
        node.vy = (node.vy || 0) * 0.9 + fy * 0.01

        node.x = node.x! + node.vx
        node.y = node.y! + node.vy

        // Boundary constraints
        node.x = Math.max(30, Math.min(canvas.width - 30, node.x))
        node.y = Math.max(30, Math.min(canvas.height - 30, node.y))
      })

      return newNodes
    })
  }, [isSimulating, filteredEdges])

  // Animation loop
  useEffect(() => {
    if (isSimulating) {
      const animate = () => {
        simulateLayout()
        animationRef.current = requestAnimationFrame(animate)
      }
      animationRef.current = requestAnimationFrame(animate)
    } else if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isSimulating, simulateLayout])

  // Canvas rendering
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Apply zoom and pan
    ctx.save()
    ctx.translate(panOffset.x, panOffset.y)
    ctx.scale(zoom[0], zoom[0])

    // Draw pathway backgrounds
    if (showPathways) {
      pathways.forEach((pathway) => {
        const pathwayNodes = filteredNodes.filter((node) => pathway.nodes.includes(node.id))
        if (pathwayNodes.length < 2) return

        const minX = Math.min(...pathwayNodes.map((n) => n.x || 0)) - 40
        const maxX = Math.max(...pathwayNodes.map((n) => n.x || 0)) + 40
        const minY = Math.min(...pathwayNodes.map((n) => n.y || 0)) - 40
        const maxY = Math.max(...pathwayNodes.map((n) => n.y || 0)) + 40

        ctx.fillStyle = getPathwayColor(pathway.significance) + "20"
        ctx.strokeStyle = getPathwayColor(pathway.significance) + "40"
        ctx.lineWidth = 2
        ctx.fillRect(minX, minY, maxX - minX, maxY - minY)
        ctx.strokeRect(minX, minY, maxX - minX, maxY - minY)

        // Pathway label
        ctx.fillStyle = getPathwayColor(pathway.significance)
        ctx.font = "12px Arial"
        ctx.fillText(pathway.name, minX + 5, minY + 15)
      })
    }

    // Draw edges
    filteredEdges.forEach((edge) => {
      const sourceNode = filteredNodes.find((n) => n.id === edge.source)
      const targetNode = filteredNodes.find((n) => n.id === edge.target)

      if (!sourceNode || !targetNode || !sourceNode.x || !sourceNode.y || !targetNode.x || !targetNode.y) return

      ctx.strokeStyle = getEdgeColor(edge)
      ctx.lineWidth = Math.max(1, edge.confidence * 4)
      ctx.setLineDash(edge.evidence === "computational" ? [5, 5] : [])

      ctx.beginPath()
      ctx.moveTo(sourceNode.x, sourceNode.y)
      ctx.lineTo(targetNode.x, targetNode.y)
      ctx.stroke()

      // Draw arrowhead for directed interactions
      if (edge.type === "inhibition" || edge.type === "activation") {
        drawArrowhead(ctx, sourceNode.x, sourceNode.y, targetNode.x, targetNode.y, getEdgeColor(edge))
      }

      // Highlight selected edge
      if (selectedEdge === edge.id) {
        ctx.strokeStyle = "#FFD700"
        ctx.lineWidth = 6
        ctx.setLineDash([])
        ctx.beginPath()
        ctx.moveTo(sourceNode.x, sourceNode.y)
        ctx.lineTo(targetNode.x, targetNode.y)
        ctx.stroke()
      }
    })

    // Draw nodes
    filteredNodes.forEach((node) => {
      if (!node.x || !node.y) return

      const radius = getNodeRadius(node)
      const color = getNodeColor(node)

      // Node shadow
      ctx.fillStyle = "rgba(0,0,0,0.2)"
      ctx.beginPath()
      ctx.arc(node.x + 2, node.y + 2, radius, 0, Math.PI * 2)
      ctx.fill()

      // Node body
      ctx.fillStyle = color
      ctx.strokeStyle = selectedNode === node.id ? "#FFD700" : "#333"
      ctx.lineWidth = selectedNode === node.id ? 3 : 1
      ctx.beginPath()
      ctx.arc(node.x, node.y, radius, 0, Math.PI * 2)
      ctx.fill()
      ctx.stroke()

      // Node icon
      drawNodeIcon(ctx, node, node.x, node.y, radius)

      // Node label
      ctx.fillStyle = "#333"
      ctx.font = "12px Arial"
      ctx.textAlign = "center"
      ctx.fillText(node.name, node.x, node.y + radius + 15)
    })

    ctx.restore()
  }, [filteredNodes, filteredEdges, selectedNode, selectedEdge, showPathways, pathways, colorScheme, zoom, panOffset])

  const getNodeColor = (node: DrugNode | ProteinNode) => {
    switch (colorScheme) {
      case "category":
        if (node.type === "drug") {
          const drug = node as DrugNode
          switch (drug.category) {
            case "approved":
              return "#2E8B57"
            case "investigational":
              return "#FF8C00"
            case "experimental":
              return "#DC143C"
            default:
              return "#4A4A4A"
          }
        } else {
          return "#1E90FF"
        }
      case "pathway":
        const pathwayColors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD"]
        const pathwayIndex = pathways.findIndex((p) => p.nodes.includes(node.id))
        return pathwayColors[pathwayIndex % pathwayColors.length] || "#4A4A4A"
      default:
        return node.type === "drug" ? "#2E8B57" : "#1E90FF"
    }
  }

  const getNodeRadius = (node: DrugNode | ProteinNode) => {
    if (node.type === "protein") {
      const protein = node as ProteinNode
      return 15 + protein.druggability * 10
    } else {
      const drug = node as DrugNode
      return drug.category === "approved" ? 20 : drug.category === "investigational" ? 17 : 15
    }
  }

  const getEdgeColor = (edge: InteractionEdge) => {
    switch (colorScheme) {
      case "affinity":
        const intensity = Math.min(edge.affinity / 10, 1)
        return `rgb(${255 * (1 - intensity)}, ${255 * intensity}, 0)`
      case "confidence":
        const alpha = edge.confidence
        return `rgba(74, 144, 226, ${alpha})`
      default:
        switch (edge.type) {
          case "binding":
            return "#4A90E2"
          case "inhibition":
            return "#DC143C"
          case "activation":
            return "#2E8B57"
          case "modulation":
            return "#FF8C00"
          default:
            return "#4A4A4A"
        }
    }
  }

  const getPathwayColor = (significance: string) => {
    switch (significance) {
      case "critical":
        return "#DC143C"
      case "important":
        return "#FF8C00"
      case "moderate":
        return "#2E8B57"
      default:
        return "#4A4A4A"
    }
  }

  const drawArrowhead = (
    ctx: CanvasRenderingContext2D,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    color: string,
  ) => {
    const angle = Math.atan2(y2 - y1, x2 - x1)
    const arrowLength = 10
    const arrowAngle = Math.PI / 6

    ctx.fillStyle = color
    ctx.beginPath()
    ctx.moveTo(x2, y2)
    ctx.lineTo(x2 - arrowLength * Math.cos(angle - arrowAngle), y2 - arrowLength * Math.sin(angle - arrowAngle))
    ctx.lineTo(x2 - arrowLength * Math.cos(angle + arrowAngle), y2 - arrowLength * Math.sin(angle + arrowAngle))
    ctx.closePath()
    ctx.fill()
  }

  const drawNodeIcon = (
    ctx: CanvasRenderingContext2D,
    node: DrugNode | ProteinNode,
    x: number,
    y: number,
    radius: number,
  ) => {
    ctx.fillStyle = "white"
    ctx.font = `${radius}px Arial`
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"

    if (node.type === "drug") {
      ctx.fillText("💊", x, y)
    } else {
      ctx.fillText("🧬", x, y)
    }
  }

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = (event.clientX - rect.left - panOffset.x) / zoom[0]
    const y = (event.clientY - rect.top - panOffset.y) / zoom[0]

    // Check for node clicks
    let clickedNode = null
    for (const node of filteredNodes) {
      if (!node.x || !node.y) continue
      const distance = Math.sqrt((x - node.x) ** 2 + (y - node.y) ** 2)
      if (distance <= getNodeRadius(node)) {
        clickedNode = node.id
        break
      }
    }

    // Check for edge clicks
    let clickedEdge = null
    if (!clickedNode) {
      for (const edge of filteredEdges) {
        const sourceNode = filteredNodes.find((n) => n.id === edge.source)
        const targetNode = filteredNodes.find((n) => n.id === edge.target)

        if (!sourceNode || !targetNode || !sourceNode.x || !sourceNode.y || !targetNode.x || !targetNode.y) continue

        const distanceToLine = distancePointToLine(x, y, sourceNode.x, sourceNode.y, targetNode.x, targetNode.y)
        if (distanceToLine <= 5) {
          clickedEdge = edge.id
          break
        }
      }
    }

    setSelectedNode(clickedNode)
    setSelectedEdge(clickedEdge)
  }

  const distancePointToLine = (px: number, py: number, x1: number, y1: number, x2: number, y2: number) => {
    const A = px - x1
    const B = py - y1
    const C = x2 - x1
    const D = y2 - y1

    const dot = A * C + B * D
    const lenSq = C * C + D * D
    let param = -1
    if (lenSq !== 0) param = dot / lenSq

    let xx, yy
    if (param < 0) {
      xx = x1
      yy = y1
    } else if (param > 1) {
      xx = x2
      yy = y2
    } else {
      xx = x1 + param * C
      yy = y1 + param * D
    }

    const dx = px - xx
    const dy = py - yy
    return Math.sqrt(dx * dx + dy * dy)
  }

  const resetLayout = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2

    setNodes((prevNodes) =>
      prevNodes.map((node, index) => ({
        ...node,
        x: centerX + (Math.random() - 0.5) * 400,
        y: centerY + (Math.random() - 0.5) * 400,
        vx: 0,
        vy: 0,
      })),
    )
  }

  const exportNetwork = () => {
    const exportData = {
      nodes: filteredNodes,
      edges: filteredEdges,
      pathways: pathways,
      metadata: {
        specialty,
        timestamp: new Date().toISOString(),
        filters: {
          affinityThreshold: affinityThreshold[0],
          confidenceThreshold: confidenceThreshold[0],
          searchTerm,
          filterType,
        },
      },
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `drug_protein_network_${specialty}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const selectedNodeData = selectedNode ? filteredNodes.find((n) => n.id === selectedNode) : null
  const selectedEdgeData = selectedEdge ? filteredEdges.find((e) => e.id === selectedEdge) : null

  return (
    <TooltipProvider>
      <div className={`space-y-6 ${isFullscreen ? "fixed inset-0 z-50 bg-white p-6 overflow-auto" : ""}`}>
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-[#4A4A4A] flex items-center gap-2">
              <Network className="h-6 w-6 text-[#1E90FF]" />
              Drug-Protein Interaction Network
            </h2>
            <p className="text-[#4A4A4A]/70">
              Interactive network visualization of drug-protein binding relationships and pathways
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsSimulating(!isSimulating)}
              className={isSimulating ? "bg-[#1E90FF] text-white" : ""}
            >
              {isSimulating ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
              {isSimulating ? "Pause" : "Simulate"}
            </Button>
            <Button variant="outline" size="sm" onClick={resetLayout}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button variant="outline" size="sm" onClick={exportNetwork}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm" onClick={() => setIsFullscreen(!isFullscreen)}>
              <Maximize className="h-4 w-4 mr-2" />
              {isFullscreen ? "Exit" : "Fullscreen"}
            </Button>
          </div>
        </div>

        {/* Controls */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-[#2E8B57]" />
              Network Controls
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-6 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-[#4A4A4A]/50" />
                  <Input
                    placeholder="Search nodes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Filter Type</label>
                <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Nodes</SelectItem>
                    <SelectItem value="drugs">Drugs Only</SelectItem>
                    <SelectItem value="proteins">Proteins Only</SelectItem>
                    <SelectItem value="pathways">Pathways</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Color Scheme</label>
                <Select value={colorScheme} onValueChange={(value: any) => setColorScheme(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="category">By Category</SelectItem>
                    <SelectItem value="affinity">By Affinity</SelectItem>
                    <SelectItem value="pathway">By Pathway</SelectItem>
                    <SelectItem value="confidence">By Confidence</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Affinity Threshold</label>
                <Slider
                  value={affinityThreshold}
                  onValueChange={setAffinityThreshold}
                  min={0}
                  max={10}
                  step={0.1}
                  className="w-full"
                />
                <div className="text-xs text-center">{affinityThreshold[0].toFixed(1)}</div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Confidence Threshold</label>
                <Slider
                  value={confidenceThreshold}
                  onValueChange={setConfidenceThreshold}
                  min={0}
                  max={1}
                  step={0.01}
                  className="w-full"
                />
                <div className="text-xs text-center">{(confidenceThreshold[0] * 100).toFixed(0)}%</div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Options</label>
                <div className="flex items-center space-x-2">
                  <Switch checked={showPathways} onCheckedChange={setShowPathways} />
                  <span className="text-sm">Show Pathways</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Network Visualization */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-[#DC143C]" />
              Interactive Network Graph
            </CardTitle>
            <CardDescription>
              Click on nodes and edges to explore drug-protein interactions.
              {filteredNodes.length} nodes, {filteredEdges.length} interactions shown.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <canvas
                ref={canvasRef}
                width={1000}
                height={600}
                className="border rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 cursor-pointer"
                onClick={handleCanvasClick}
              />

              {/* Zoom Controls */}
              <div className="absolute top-4 right-4 space-y-2">
                <div className="bg-white/90 p-2 rounded border">
                  <label className="text-xs font-medium">Zoom</label>
                  <Slider
                    value={zoom}
                    onValueChange={setZoom}
                    min={0.1}
                    max={3}
                    step={0.1}
                    className="w-20"
                    orientation="vertical"
                  />
                </div>
              </div>

              {/* Legend */}
              <div className="absolute bottom-4 left-4 bg-white/90 p-3 rounded-lg border">
                <h5 className="text-sm font-medium mb-2">Legend</h5>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-[#2E8B57] rounded-full" />
                    <span>Approved Drugs</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-[#FF8C00] rounded-full" />
                    <span>Investigational</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-[#1E90FF] rounded-full" />
                    <span>Proteins</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-1 bg-[#DC143C]" />
                    <span>Inhibition</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-1 bg-[#2E8B57]" />
                    <span>Activation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-1 bg-[#4A90E2] border-dashed border" />
                    <span>Computational</span>
                  </div>
                </div>
              </div>

              {/* Network Stats */}
              <div className="absolute top-4 left-4 bg-white/90 p-3 rounded-lg border">
                <div className="text-sm space-y-1">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-[#1E90FF]" />
                    <span>{filteredNodes.length} nodes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-[#2E8B57]" />
                    <span>{filteredEdges.length} interactions</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-[#DC143C]" />
                    <span>{pathways.length} pathways</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Selection Details */}
        {(selectedNodeData || selectedEdgeData) && (
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5 text-[#4A4A4A]" />
                Selection Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedNodeData && (
                <Tabs defaultValue="overview" className="space-y-4">
                  <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="interactions">Interactions</TabsTrigger>
                    <TabsTrigger value="pathways">Pathways</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-4">
                    <div className="p-4 rounded-lg bg-[#F5F7FA] border">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="text-lg font-semibold text-[#4A4A4A]">{selectedNodeData.name}</h4>
                          <p className="text-sm text-[#4A4A4A]/70">
                            {selectedNodeData.type === "drug" ? "Drug" : "Protein"} •{" "}
                            {selectedNodeData.type === "drug"
                              ? (selectedNodeData as DrugNode).category
                              : (selectedNodeData as ProteinNode).gene}
                          </p>
                        </div>
                        <Badge
                          variant="outline"
                          className={selectedNodeData.type === "drug" ? "bg-[#2E8B57]/10" : "bg-[#1E90FF]/10"}
                        >
                          {selectedNodeData.type === "drug"
                            ? (selectedNodeData as DrugNode).mechanism
                            : (selectedNodeData as ProteinNode).function}
                        </Badge>
                      </div>

                      {selectedNodeData.type === "drug" ? (
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-[#4A4A4A]/70">Molecular Weight:</span>
                            <p className="font-medium">{(selectedNodeData as DrugNode).molecularWeight} g/mol</p>
                          </div>
                          <div>
                            <span className="text-[#4A4A4A]/70">Bioavailability:</span>
                            <p className="font-medium">{(selectedNodeData as DrugNode).bioavailability}%</p>
                          </div>
                          <div>
                            <span className="text-[#4A4A4A]/70">Half-life:</span>
                            <p className="font-medium">{(selectedNodeData as DrugNode).halfLife} hours</p>
                          </div>
                          <div>
                            <span className="text-[#4A4A4A]/70">Indications:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {(selectedNodeData as DrugNode).indication.map((indication, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {indication}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-[#4A4A4A]/70">Expression Level:</span>
                            <Badge
                              variant="outline"
                              className={
                                (selectedNodeData as ProteinNode).expression === "high"
                                  ? "bg-[#2E8B57]/10"
                                  : (selectedNodeData as ProteinNode).expression === "medium"
                                    ? "bg-[#FF8C00]/10"
                                    : "bg-[#DC143C]/10"
                              }
                            >
                              {(selectedNodeData as ProteinNode).expression}
                            </Badge>
                          </div>
                          <div>
                            <span className="text-[#4A4A4A]/70">Druggability Score:</span>
                            <p className="font-medium">
                              {((selectedNodeData as ProteinNode).druggability * 100).toFixed(0)}%
                            </p>
                          </div>
                          <div className="md:col-span-2">
                            <span className="text-[#4A4A4A]/70">Disease Associations:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {(selectedNodeData as ProteinNode).diseaseAssociation.map((disease, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {disease}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="interactions" className="space-y-4">
                    <div className="space-y-3">
                      {filteredEdges
                        .filter((edge) => edge.source === selectedNodeData.id || edge.target === selectedNodeData.id)
                        .map((edge) => {
                          const partnerId = edge.source === selectedNodeData.id ? edge.target : edge.source
                          const partner = filteredNodes.find((n) => n.id === partnerId)

                          return (
                            <div key={edge.id} className="p-3 rounded border bg-white">
                              <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">{partner?.name}</span>
                                  <Badge
                                    variant="outline"
                                    className={
                                      edge.type === "inhibition"
                                        ? "bg-[#DC143C]/10 text-[#DC143C]"
                                        : edge.type === "activation"
                                          ? "bg-[#2E8B57]/10 text-[#2E8B57]"
                                          : edge.type === "binding"
                                            ? "bg-[#1E90FF]/10 text-[#1E90FF]"
                                            : "bg-[#FF8C00]/10 text-[#FF8C00]"
                                    }
                                  >
                                    {edge.type}
                                  </Badge>
                                </div>
                                <Badge
                                  variant="outline"
                                  className={
                                    edge.clinicalRelevance === "high"
                                      ? "bg-[#2E8B57]/10 text-[#2E8B57]"
                                      : edge.clinicalRelevance === "medium"
                                        ? "bg-[#FF8C00]/10 text-[#FF8C00]"
                                        : "bg-[#4A4A4A]/10 text-[#4A4A4A]"
                                  }
                                >
                                  {edge.clinicalRelevance} relevance
                                </Badge>
                              </div>

                              <div className="grid grid-cols-3 gap-4 text-sm">
                                <div>
                                  <span className="text-[#4A4A4A]/70">Affinity:</span>
                                  <p className="font-medium">{edge.affinity.toFixed(1)}</p>
                                </div>
                                <div>
                                  <span className="text-[#4A4A4A]/70">Confidence:</span>
                                  <p className="font-medium">{(edge.confidence * 100).toFixed(0)}%</p>
                                </div>
                                <div>
                                  <span className="text-[#4A4A4A]/70">Evidence:</span>
                                  <p className="font-medium">{edge.evidence}</p>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                    </div>
                  </TabsContent>

                  <TabsContent value="pathways" className="space-y-4">
                    <div className="space-y-3">
                      {pathways
                        .filter((pathway) => pathway.nodes.includes(selectedNodeData.id))
                        .map((pathway) => (
                          <div key={pathway.id} className="p-4 rounded-lg border bg-[#F5F7FA]">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <h5 className="font-medium text-[#4A4A4A]">{pathway.name}</h5>
                                <p className="text-sm text-[#4A4A4A]/70">{pathway.category}</p>
                              </div>
                              <Badge
                                variant="outline"
                                className={
                                  pathway.significance === "critical"
                                    ? "bg-[#DC143C]/10 text-[#DC143C]"
                                    : pathway.significance === "important"
                                      ? "bg-[#FF8C00]/10 text-[#FF8C00]"
                                      : "bg-[#2E8B57]/10 text-[#2E8B57]"
                                }
                              >
                                {pathway.significance}
                              </Badge>
                            </div>

                            <p className="text-sm text-[#4A4A4A] mb-3">{pathway.description}</p>

                            <div>
                              <span className="text-[#4A4A4A]/70 text-sm">Disease Relevance:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {pathway.diseaseRelevance.map((disease, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {disease}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </TabsContent>
                </Tabs>
              )}

              {selectedEdgeData && !selectedNodeData && (
                <div className="p-4 rounded-lg bg-[#F5F7FA] border">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="text-lg font-semibold text-[#4A4A4A]">
                        {filteredNodes.find((n) => n.id === selectedEdgeData.source)?.name} ↔{" "}
                        {filteredNodes.find((n) => n.id === selectedEdgeData.target)?.name}
                      </h4>
                      <p className="text-sm text-[#4A4A4A]/70">Drug-Protein Interaction</p>
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        selectedEdgeData.type === "inhibition"
                          ? "bg-[#DC143C]/10 text-[#DC143C]"
                          : selectedEdgeData.type === "activation"
                            ? "bg-[#2E8B57]/10 text-[#2E8B57]"
                            : selectedEdgeData.type === "binding"
                              ? "bg-[#1E90FF]/10 text-[#1E90FF]"
                              : "bg-[#FF8C00]/10 text-[#FF8C00]"
                      }
                    >
                      {selectedEdgeData.type}
                    </Badge>
                  </div>

                  <div className="grid md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-[#4A4A4A]/70">Binding Affinity:</span>
                      <p className="font-medium">{selectedEdgeData.affinity.toFixed(1)} (pKd/pIC50)</p>
                    </div>
                    <div>
                      <span className="text-[#4A4A4A]/70">Confidence:</span>
                      <p className="font-medium">{(selectedEdgeData.confidence * 100).toFixed(0)}%</p>
                    </div>
                    <div>
                      <span className="text-[#4A4A4A]/70">Evidence Type:</span>
                      <Badge
                        variant="outline"
                        className={
                          selectedEdgeData.evidence === "experimental"
                            ? "bg-[#2E8B57]/10 text-[#2E8B57]"
                            : selectedEdgeData.evidence === "computational"
                              ? "bg-[#FF8C00]/10 text-[#FF8C00]"
                              : "bg-[#1E90FF]/10 text-[#1E90FF]"
                        }
                      >
                        {selectedEdgeData.evidence}
                      </Badge>
                    </div>
                    <div>
                      <span className="text-[#4A4A4A]/70">Clinical Relevance:</span>
                      <Badge
                        variant="outline"
                        className={
                          selectedEdgeData.clinicalRelevance === "high"
                            ? "bg-[#2E8B57]/10 text-[#2E8B57]"
                            : selectedEdgeData.clinicalRelevance === "medium"
                              ? "bg-[#FF8C00]/10 text-[#FF8C00]"
                              : "bg-[#4A4A4A]/10 text-[#4A4A4A]"
                        }
                      >
                        {selectedEdgeData.clinicalRelevance}
                      </Badge>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t">
                    <span className="text-[#4A4A4A]/70 text-sm">Pathway:</span>
                    <p className="font-medium">{selectedEdgeData.pathway}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Network Statistics */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#4A4A4A]/70">Total Drugs</p>
                  <p className="text-2xl font-bold text-[#2E8B57]">
                    {filteredNodes.filter((n) => n.type === "drug").length}
                  </p>
                </div>
                <Zap className="h-8 w-8 text-[#2E8B57]" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#4A4A4A]/70">Target Proteins</p>
                  <p className="text-2xl font-bold text-[#1E90FF]">
                    {filteredNodes.filter((n) => n.type === "protein").length}
                  </p>
                </div>
                <Target className="h-8 w-8 text-[#1E90FF]" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#4A4A4A]/70">High Affinity</p>
                  <p className="text-2xl font-bold text-[#DC143C]">
                    {filteredEdges.filter((e) => e.affinity >= 8).length}
                  </p>
                </div>
                <AlertTriangle className="h-8 w-8 text-[#DC143C]" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#4A4A4A]/70">Validated</p>
                  <p className="text-2xl font-bold text-[#2E8B57]">
                    {filteredEdges.filter((e) => e.evidence === "experimental").length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-[#2E8B57]" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </TooltipProvider>
  )
}
