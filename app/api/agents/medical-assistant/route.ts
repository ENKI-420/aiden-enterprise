import { NextRequest, NextResponse } from 'next/server';

// Medical AI Agent Types
export enum AgentType {
  ONCOLOGY_ADVISOR = 'oncology_advisor',
  CLINICAL_TRIALS = 'clinical_trials',
  DRUG_INTERACTIONS = 'drug_interactions',
  IMAGING_ANALYST = 'imaging_analyst',
  PATIENT_EDUCATOR = 'patient_educator',
}

interface AgentCapability {
  name: string;
  description: string;
  inputSchema: Record<string, any>;
  outputSchema: Record<string, any>;
}

// Define agent capabilities
const AGENT_CAPABILITIES: Record<AgentType, AgentCapability[]> = {
  [AgentType.ONCOLOGY_ADVISOR]: [
    {
      name: 'analyze_tumor_markers',
      description: 'Analyze tumor marker trends and provide clinical insights',
      inputSchema: {
        markers: 'array',
        timeRange: 'string',
        patientId: 'string'
      },
      outputSchema: {
        trend: 'string',
        recommendations: 'array',
        alertLevel: 'string'
      }
    },
    {
      name: 'treatment_protocol_match',
      description: 'Match patient profile with NCCN guidelines',
      inputSchema: {
        diagnosis: 'string',
        stage: 'string',
        biomarkers: 'object'
      },
      outputSchema: {
        protocols: 'array',
        evidence_level: 'string',
        alternatives: 'array'
      }
    }
  ],
  [AgentType.CLINICAL_TRIALS]: [
    {
      name: 'find_eligible_trials',
      description: 'Search ClinicalTrials.gov for matching studies',
      inputSchema: {
        condition: 'string',
        location: 'string',
        phase: 'string'
      },
      outputSchema: {
        trials: 'array',
        eligibility_score: 'number',
        enrollment_status: 'string'
      }
    }
  ],
  [AgentType.DRUG_INTERACTIONS]: [
    {
      name: 'check_interactions',
      description: 'Analyze drug-drug and drug-condition interactions',
      inputSchema: {
        medications: 'array',
        conditions: 'array'
      },
      outputSchema: {
        interactions: 'array',
        severity: 'string',
        alternatives: 'array'
      }
    }
  ],
  [AgentType.IMAGING_ANALYST]: [
    {
      name: 'analyze_scan_progression',
      description: 'Compare imaging studies for disease progression',
      inputSchema: {
        current_scan: 'string',
        prior_scan: 'string',
        modality: 'string'
      },
      outputSchema: {
        changes: 'array',
        recist_criteria: 'string',
        measurements: 'object'
      }
    }
  ],
  [AgentType.PATIENT_EDUCATOR]: [
    {
      name: 'generate_education_material',
      description: 'Create personalized patient education content',
      inputSchema: {
        diagnosis: 'string',
        treatment_plan: 'string',
        literacy_level: 'string'
      },
      outputSchema: {
        content: 'string',
        visual_aids: 'array',
        key_points: 'array'
      }
    }
  ]
};

export async function POST(request: NextRequest) {
  try {
    const { agentType, action, parameters } = await request.json();

    if (!Object.values(AgentType).includes(agentType)) {
      return NextResponse.json(
        { error: 'Invalid agent type' },
        { status: 400 }
      );
    }

    const capabilities = AGENT_CAPABILITIES[agentType as AgentType];
    const capability = capabilities.find(c => c.name === action);

    if (!capability) {
      return NextResponse.json(
        { error: `Action ${action} not supported by ${agentType}` },
        { status: 400 }
      );
    }

    // Simulate agent processing (replace with actual AI integration)
    const result = await processAgentAction(agentType as AgentType, action, parameters);

    return NextResponse.json({
      agentType,
      action,
      result,
      timestamp: new Date().toISOString(),
      confidence: 0.92
    });

  } catch (error) {
    console.error('Medical agent error:', error);
    return NextResponse.json(
      { error: 'Agent processing failed' },
      { status: 500 }
    );
  }
}

async function processAgentAction(
  agentType: AgentType,
  action: string,
  parameters: any
): Promise<any> {
  // Simulate different agent responses
  switch (agentType) {
    case AgentType.ONCOLOGY_ADVISOR:
      if (action === 'analyze_tumor_markers') {
        return {
          trend: 'decreasing',
          recommendations: [
            'Continue current treatment protocol',
            'Schedule follow-up imaging in 3 months',
            'Monitor CA 19-9 levels monthly'
          ],
          alertLevel: 'stable'
        };
      }
      break;

    case AgentType.CLINICAL_TRIALS:
      if (action === 'find_eligible_trials') {
        return {
          trials: [
            {
              nctId: 'NCT04123456',
              title: 'Phase III Study of Novel Immunotherapy',
              sponsor: 'Baptist Health',
              status: 'Recruiting',
              distance: '0 miles'
            }
          ],
          eligibility_score: 0.85,
          enrollment_status: 'open'
        };
      }
      break;

    case AgentType.DRUG_INTERACTIONS:
      if (action === 'check_interactions') {
        return {
          interactions: [
            {
              drugs: ['Carboplatin', 'Warfarin'],
              severity: 'moderate',
              effect: 'Increased bleeding risk'
            }
          ],
          severity: 'moderate',
          alternatives: ['Consider LMWH instead of warfarin']
        };
      }
      break;

    case AgentType.IMAGING_ANALYST:
      if (action === 'analyze_scan_progression') {
        return {
          changes: [
            'Primary lesion decreased by 15%',
            'No new metastatic sites identified'
          ],
          recist_criteria: 'Partial Response',
          measurements: {
            primary: { previous: '3.2cm', current: '2.7cm' }
          }
        };
      }
      break;

    case AgentType.PATIENT_EDUCATOR:
      if (action === 'generate_education_material') {
        return {
          content: 'Understanding Your Treatment: A personalized guide...',
          visual_aids: ['treatment_timeline.svg', 'side_effects_chart.png'],
          key_points: [
            'Treatment will last 6 cycles',
            'Common side effects and management',
            'When to contact your care team'
          ]
        };
      }
      break;
  }

  return { message: 'Agent processing completed' };
}

export async function GET() {
  return NextResponse.json({
    availableAgents: Object.values(AgentType),
    capabilities: AGENT_CAPABILITIES
  });
}