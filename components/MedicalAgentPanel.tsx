"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert } from "@/components/ui/alert";

interface AgentResponse {
  agentType: string;
  action: string;
  result: any;
  timestamp: string;
  confidence: number;
}

interface MedicalAgentPanelProps {
  transcript?: string;
  patientContext?: any;
}

export default function MedicalAgentPanel({ transcript = "", patientContext }: MedicalAgentPanelProps) {
  const [activeAgent, setActiveAgent] = useState("oncology_advisor");
  const [agentResponses, setAgentResponses] = useState<AgentResponse[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [autoAnalyze, setAutoAnalyze] = useState(true);

  // Auto-analyze transcript for medical terms
  useEffect(() => {
    if (!autoAnalyze || !transcript || transcript.length < 50) return;

    const medicalTerms = detectMedicalTerms(transcript);
    if (medicalTerms.length > 0) {
      analyzeWithAgent("oncology_advisor", "analyze_tumor_markers", {
        markers: medicalTerms,
        timeRange: "recent",
        patientId: patientContext?.id || "demo"
      });
    }
  }, [transcript, autoAnalyze, patientContext]);

  const detectMedicalTerms = (text: string): string[] => {
    const medicalKeywords = [
      "CA 19-9", "CEA", "PSA", "HER2", "EGFR", "PD-L1",
      "metastatic", "primary", "lesion", "tumor", "marker",
      "chemotherapy", "immunotherapy", "radiation"
    ];

    return medicalKeywords.filter(term =>
      text.toLowerCase().includes(term.toLowerCase())
    );
  };

  const analyzeWithAgent = async (agentType: string, action: string, parameters: any) => {
    setIsProcessing(true);
    try {
      const response = await fetch("/api/agents/medical-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agentType, action, parameters })
      });

      if (response.ok) {
        const data = await response.json();
        setAgentResponses(prev => [data, ...prev].slice(0, 10)); // Keep last 10
      }
    } catch (error) {
      console.error("Agent analysis failed:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const agentActions = {
    oncology_advisor: [
      {
        name: "Analyze Markers",
        action: "analyze_tumor_markers",
        icon: "📊",
        params: { markers: ["CA 19-9", "CEA"], timeRange: "6months", patientId: "demo" }
      },
      {
        name: "Treatment Match",
        action: "treatment_protocol_match",
        icon: "🎯",
        params: { diagnosis: "NSCLC", stage: "IIIA", biomarkers: { EGFR: "positive" } }
      }
    ],
    clinical_trials: [
      {
        name: "Find Trials",
        action: "find_eligible_trials",
        icon: "🔬",
        params: { condition: "lung cancer", location: "Louisville, KY", phase: "III" }
      }
    ],
    drug_interactions: [
      {
        name: "Check Interactions",
        action: "check_interactions",
        icon: "💊",
        params: { medications: ["Carboplatin", "Paclitaxel", "Warfarin"], conditions: ["CKD"] }
      }
    ],
    imaging_analyst: [
      {
        name: "Compare Scans",
        action: "analyze_scan_progression",
        icon: "🩻",
        params: { current_scan: "CT_2024_01", prior_scan: "CT_2023_10", modality: "CT" }
      }
    ],
    patient_educator: [
      {
        name: "Create Materials",
        action: "generate_education_material",
        icon: "📚",
        params: { diagnosis: "breast cancer", treatment_plan: "chemotherapy", literacy_level: "8th grade" }
      }
    ]
  };

  return (
    <Card className="w-full max-w-md p-4 bg-gray-900 text-white">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">AI Medical Assistants</h3>
        <Button
          size="sm"
          variant={autoAnalyze ? "default" : "outline"}
          onClick={() => setAutoAnalyze(!autoAnalyze)}
        >
          Auto: {autoAnalyze ? "ON" : "OFF"}
        </Button>
      </div>

      <Tabs value={activeAgent} onValueChange={setActiveAgent}>
        <TabsList className="grid grid-cols-3 gap-1 bg-gray-800">
          <TabsTrigger value="oncology_advisor" className="text-xs">Oncology</TabsTrigger>
          <TabsTrigger value="clinical_trials" className="text-xs">Trials</TabsTrigger>
          <TabsTrigger value="drug_interactions" className="text-xs">Drugs</TabsTrigger>
        </TabsList>

        <div className="mt-2 grid grid-cols-2 gap-1">
          <TabsTrigger value="imaging_analyst" className="text-xs bg-gray-800">Imaging</TabsTrigger>
          <TabsTrigger value="patient_educator" className="text-xs bg-gray-800">Education</TabsTrigger>
        </div>

        {Object.entries(agentActions).map(([agent, actions]) => (
          <TabsContent key={agent} value={agent} className="mt-4 space-y-2">
            {actions.map((action) => (
              <Button
                key={action.action}
                onClick={() => analyzeWithAgent(agent, action.action, action.params)}
                disabled={isProcessing}
                className="w-full justify-start"
                variant="outline"
              >
                <span className="mr-2">{action.icon}</span>
                {action.name}
              </Button>
            ))}
          </TabsContent>
        ))}
      </Tabs>

      {/* Results Display */}
      <div className="mt-4 space-y-2 max-h-64 overflow-y-auto">
        {agentResponses.map((response, idx) => (
          <Alert key={idx} className="bg-gray-800 border-gray-700">
            <div className="flex justify-between items-start mb-1">
              <Badge variant="outline" className="text-xs">
                {response.agentType.replace("_", " ")}
              </Badge>
              <span className="text-xs text-gray-400">
                {new Date(response.timestamp).toLocaleTimeString()}
              </span>
            </div>
            <div className="text-sm mt-2">
              {renderAgentResult(response.result)}
            </div>
            <div className="mt-1">
              <span className="text-xs text-gray-500">
                Confidence: {(response.confidence * 100).toFixed(0)}%
              </span>
            </div>
          </Alert>
        ))}
      </div>

      {isProcessing && (
        <div className="mt-2 text-center text-sm text-blue-400">
          Processing with AI agent...
        </div>
      )}
    </Card>
  );
}

function renderAgentResult(result: any): JSX.Element {
  if (result.recommendations) {
    return (
      <ul className="list-disc list-inside space-y-1">
        {result.recommendations.map((rec: string, idx: number) => (
          <li key={idx} className="text-xs">{rec}</li>
        ))}
      </ul>
    );
  }

  if (result.trials) {
    return (
      <div className="space-y-2">
        {result.trials.map((trial: any, idx: number) => (
          <div key={idx} className="text-xs">
            <strong>{trial.nctId}</strong>: {trial.title}
            <Badge className="ml-2" variant="secondary">{trial.status}</Badge>
          </div>
        ))}
      </div>
    );
  }

  if (result.interactions) {
    return (
      <div className="space-y-1">
        {result.interactions.map((interaction: any, idx: number) => (
          <div key={idx} className="text-xs">
            <Badge variant={interaction.severity === "severe" ? "destructive" : "default"}>
              {interaction.severity}
            </Badge>
            <span className="ml-2">{interaction.effect}</span>
          </div>
        ))}
      </div>
    );
  }

  if (result.changes) {
    return (
      <div className="space-y-1">
        <Badge className="mb-2">{result.recist_criteria}</Badge>
        {result.changes.map((change: string, idx: number) => (
          <div key={idx} className="text-xs">• {change}</div>
        ))}
      </div>
    );
  }

  return <pre className="text-xs">{JSON.stringify(result, null, 2)}</pre>;
}