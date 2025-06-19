import { NextRequest, NextResponse } from 'next/server';

interface AgentTask {
  id: string;
  agent: string;
  action: string;
  parameters: any;
  dependencies?: string[];
  priority: number;
}

interface WorkflowTemplate {
  name: string;
  description: string;
  tasks: AgentTask[];
}

// Pre-defined workflows for common oncology scenarios
const WORKFLOW_TEMPLATES: WorkflowTemplate[] = [
  {
    name: "tumor_board_prep",
    description: "Comprehensive patient analysis for tumor board presentation",
    tasks: [
      {
        id: "markers",
        agent: "oncology_advisor",
        action: "analyze_tumor_markers",
        parameters: { timeRange: "6months" },
        priority: 1
      },
      {
        id: "imaging",
        agent: "imaging_analyst",
        action: "analyze_scan_progression",
        parameters: { modality: "CT" },
        priority: 1
      },
      {
        id: "trials",
        agent: "clinical_trials",
        action: "find_eligible_trials",
        parameters: { phase: "all" },
        dependencies: ["markers"],
        priority: 2
      },
      {
        id: "treatment",
        agent: "oncology_advisor",
        action: "treatment_protocol_match",
        parameters: {},
        dependencies: ["markers", "imaging"],
        priority: 2
      },
      {
        id: "interactions",
        agent: "drug_interactions",
        action: "check_interactions",
        parameters: {},
        dependencies: ["treatment"],
        priority: 3
      }
    ]
  },
  {
    name: "treatment_change_analysis",
    description: "Evaluate need for treatment modification",
    tasks: [
      {
        id: "response",
        agent: "imaging_analyst",
        action: "analyze_scan_progression",
        parameters: { criteria: "RECIST" },
        priority: 1
      },
      {
        id: "toxicity",
        agent: "drug_interactions",
        action: "check_interactions",
        parameters: { includeAdverseEvents: true },
        priority: 1
      },
      {
        id: "alternatives",
        agent: "oncology_advisor",
        action: "treatment_protocol_match",
        parameters: { findAlternatives: true },
        dependencies: ["response", "toxicity"],
        priority: 2
      }
    ]
  },
  {
    name: "patient_education_package",
    description: "Generate comprehensive patient education materials",
    tasks: [
      {
        id: "diagnosis_ed",
        agent: "patient_educator",
        action: "generate_education_material",
        parameters: { topic: "diagnosis" },
        priority: 1
      },
      {
        id: "treatment_ed",
        agent: "patient_educator",
        action: "generate_education_material",
        parameters: { topic: "treatment" },
        priority: 1
      },
      {
        id: "side_effects",
        agent: "drug_interactions",
        action: "check_interactions",
        parameters: { patientFriendly: true },
        priority: 2
      }
    ]
  }
];

export async function POST(request: NextRequest) {
  try {
    const { workflow, customTasks, patientContext } = await request.json();

    let tasks: AgentTask[] = [];

    // Use pre-defined workflow or custom tasks
    if (workflow) {
      const template = WORKFLOW_TEMPLATES.find(t => t.name === workflow);
      if (!template) {
        return NextResponse.json(
          { error: `Workflow ${workflow} not found` },
          { status: 400 }
        );
      }
      tasks = template.tasks;
    } else if (customTasks) {
      tasks = customTasks;
    } else {
      return NextResponse.json(
        { error: "Either workflow or customTasks must be provided" },
        { status: 400 }
      );
    }

    // Execute workflow
    const results = await executeWorkflow(tasks, patientContext);

    return NextResponse.json({
      workflow: workflow || "custom",
      tasksCompleted: results.length,
      results,
      summary: generateWorkflowSummary(results),
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Orchestrator error:', error);
    return NextResponse.json(
      { error: 'Workflow execution failed' },
      { status: 500 }
    );
  }
}

async function executeWorkflow(tasks: AgentTask[], context: any): Promise<any[]> {
  const results: Map<string, any> = new Map();
  const tasksByPriority = groupTasksByPriority(tasks);

  // Execute tasks by priority level
  for (const [priority, priorityTasks] of tasksByPriority) {
    // Execute tasks at same priority level in parallel
    const promises = priorityTasks.map(async (task) => {
      // Check dependencies
      if (task.dependencies) {
        for (const dep of task.dependencies) {
          if (!results.has(dep)) {
            throw new Error(`Dependency ${dep} not satisfied for task ${task.id}`);
          }
        }
      }

      // Enrich parameters with dependency results
      const enrichedParams = {
        ...task.parameters,
        ...context,
        dependencyResults: task.dependencies?.map(dep => results.get(dep))
      };

      // Execute agent task
      const result = await callAgent(task.agent, task.action, enrichedParams);
      return { taskId: task.id, result };
    });

    const priorityResults = await Promise.all(promises);

    // Store results for next priority level
    priorityResults.forEach(({ taskId, result }) => {
      results.set(taskId, result);
    });
  }

  return Array.from(results.values());
}

function groupTasksByPriority(tasks: AgentTask[]): Map<number, AgentTask[]> {
  const grouped = new Map<number, AgentTask[]>();

  tasks.forEach(task => {
    const priority = task.priority || 1;
    if (!grouped.has(priority)) {
      grouped.set(priority, []);
    }
    grouped.get(priority)!.push(task);
  });

  // Sort by priority (ascending)
  return new Map([...grouped.entries()].sort((a, b) => a[0] - b[0]));
}

async function callAgent(agent: string, action: string, parameters: any): Promise<any> {
  // In production, this would call the actual agent service
  // For demo, return simulated results
  const response = await fetch("/api/agents/medical-assistant", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ agentType: agent, action, parameters })
  });

  if (!response.ok) {
    throw new Error(`Agent ${agent} failed: ${response.statusText}`);
  }

  const data = await response.json();
  return data.result;
}

function generateWorkflowSummary(results: any[]): string {
  // Generate executive summary from all agent results
  const summaryPoints: string[] = [];

  results.forEach(result => {
    if (result.recommendations) {
      summaryPoints.push(...result.recommendations.slice(0, 2));
    }
    if (result.recist_criteria) {
      summaryPoints.push(`Imaging shows: ${result.recist_criteria}`);
    }
    if (result.trials && result.trials.length > 0) {
      summaryPoints.push(`${result.trials.length} clinical trials identified`);
    }
    if (result.severity) {
      summaryPoints.push(`Drug interaction severity: ${result.severity}`);
    }
  });

  return summaryPoints.join(". ");
}

export async function GET() {
  return NextResponse.json({
    availableWorkflows: WORKFLOW_TEMPLATES.map(w => ({
      name: w.name,
      description: w.description,
      taskCount: w.tasks.length
    })),
    capabilities: {
      parallelExecution: true,
      dependencyResolution: true,
      contextEnrichment: true
    }
  });
}