"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

interface AgentWorkflowButtonProps {
  patientContext?: any;
  onWorkflowComplete?: (results: any) => void;
}

const WORKFLOWS = [
  {
    id: "tumor_board_prep",
    name: "Tumor Board Prep",
    icon: "🏥",
    description: "Complete analysis for presentation",
    duration: "~45s"
  },
  {
    id: "treatment_change_analysis",
    name: "Treatment Review",
    icon: "💊",
    description: "Evaluate treatment modifications",
    duration: "~30s"
  },
  {
    id: "patient_education_package",
    name: "Patient Education",
    icon: "📚",
    description: "Generate education materials",
    duration: "~20s"
  }
];

export default function AgentWorkflowButton({
  patientContext,
  onWorkflowComplete
}: AgentWorkflowButtonProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [currentWorkflow, setCurrentWorkflow] = useState<string | null>(null);

  const runWorkflow = async (workflowId: string) => {
    setIsRunning(true);
    setCurrentWorkflow(workflowId);

    try {
      const response = await fetch("/api/agents/orchestrator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workflow: workflowId,
          patientContext: patientContext || { id: "demo", name: "Demo Patient" }
        })
      });

      if (response.ok) {
        const data = await response.json();
        onWorkflowComplete?.(data);

        // Show notification
        const notification = new Notification("Workflow Complete", {
          body: `${data.tasksCompleted} tasks completed. ${data.summary}`,
          icon: "🤖"
        });
      }
    } catch (error) {
      console.error("Workflow failed:", error);
    } finally {
      setIsRunning(false);
      setCurrentWorkflow(null);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          disabled={isRunning}
          className="relative"
        >
          {isRunning ? (
            <>
              <span className="animate-spin mr-2">⚙️</span>
              Running Workflow...
            </>
          ) : (
            <>
              <span className="mr-2">🤖</span>
              AI Workflows
            </>
          )}
          {currentWorkflow && (
            <Badge className="ml-2" variant="secondary">
              {WORKFLOWS.find(w => w.id === currentWorkflow)?.icon}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64">
        {WORKFLOWS.map((workflow) => (
          <DropdownMenuItem
            key={workflow.id}
            onClick={() => runWorkflow(workflow.id)}
            disabled={isRunning}
            className="flex flex-col items-start p-3"
          >
            <div className="flex items-center justify-between w-full">
              <span className="font-semibold">
                {workflow.icon} {workflow.name}
              </span>
              <Badge variant="outline" className="text-xs">
                {workflow.duration}
              </Badge>
            </div>
            <span className="text-xs text-gray-500 mt-1">
              {workflow.description}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}