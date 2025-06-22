/**
 * Agent Orchestration Layer
 * Manages federated AI agents across departments with context sharing
 */

import { EventEmitter } from 'events';
import {
  Agent,
  AgentMessage,
  AgentRole,
  PlatformEvent,
  WorkflowStep
} from '../types';

interface WorkflowContext {
  id: string;
  data: unknown;
  results: Map<string, unknown>;
  currentStep: number;
}

export class AgentOrchestrator extends EventEmitter {
  private agents: Map<string, Agent> = new Map();
  private messageQueue: AgentMessage[] = [];
  private activeWorkflows: Map<string, WorkflowContext> = new Map();
  private contextStore: Map<string, Record<string, unknown>> = new Map();

  constructor() {
    super();
    this.initializeDefaultAgents();
    this.startMessageProcessor();
  }

  private initializeDefaultAgents() {
    // Initialize core healthcare agents
    const defaultAgents: Agent[] = [
      {
        id: 'rad-001',
        role: 'radiology',
        name: 'Radiology Assistant',
        description: 'Handles imaging analysis, scheduling, and report generation',
        capabilities: [
          'imaging-analysis',
          'report-generation',
          'schedule-optimization',
          'protocol-recommendations'
        ],
        status: 'idle',
        lastActive: new Date(),
        metrics: {
          requestsHandled: 0,
          averageResponseTime: 0,
          errorRate: 0,
          successRate: 100
        },
        configuration: {
          model: 'gpt-4-vision',
          temperature: 0.3,
          maxTokens: 2000,
          specializedKnowledge: ['DICOM', 'HL7', 'RadLex'],
          integrations: ['PACS', 'RIS', 'Epic']
        }
      },
      {
        id: 'onc-001',
        role: 'oncology',
        name: 'Oncology Specialist',
        description: 'Provides oncology insights, treatment recommendations, and research',
        capabilities: [
          'treatment-planning',
          'clinical-trial-matching',
          'genomic-analysis',
          'drug-interaction-check'
        ],
        status: 'idle',
        lastActive: new Date(),
        metrics: {
          requestsHandled: 0,
          averageResponseTime: 0,
          errorRate: 0,
          successRate: 100
        },
        configuration: {
          model: 'claude-3-opus',
          temperature: 0.2,
          maxTokens: 4000,
          specializedKnowledge: ['NCCN-Guidelines', 'OncoKB', 'ClinicalTrials.gov'],
          integrations: ['Epic', 'Flatiron', 'Foundation Medicine']
        }
      },
      {
        id: 'trial-001',
        role: 'clinical-trial',
        name: 'Clinical Trial Coordinator',
        description: 'Manages trial matching, eligibility, and enrollment',
        capabilities: [
          'eligibility-screening',
          'trial-matching',
          'enrollment-tracking',
          'adverse-event-monitoring'
        ],
        status: 'idle',
        lastActive: new Date(),
        metrics: {
          requestsHandled: 0,
          averageResponseTime: 0,
          errorRate: 0,
          successRate: 100
        },
        configuration: {
          model: 'gpt-4',
          temperature: 0.1,
          maxTokens: 2000,
          specializedKnowledge: ['ClinicalTrials.gov', 'FDA-Regulations', 'GCP'],
          integrations: ['REDCap', 'Epic', 'Medidata']
        }
      },
      {
        id: 'admin-001',
        role: 'admin',
        name: 'Administrative Assistant',
        description: 'Handles scheduling, billing, and administrative tasks',
        capabilities: [
          'appointment-scheduling',
          'insurance-verification',
          'billing-coding',
          'documentation-assistance'
        ],
        status: 'idle',
        lastActive: new Date(),
        metrics: {
          requestsHandled: 0,
          averageResponseTime: 0,
          errorRate: 0,
          successRate: 100
        },
        configuration: {
          model: 'gpt-3.5-turbo',
          temperature: 0.3,
          maxTokens: 1000,
          specializedKnowledge: ['ICD-10', 'CPT', 'Insurance-Policies'],
          integrations: ['Epic', 'Athena', 'Billing-Systems']
        }
      }
    ];

    defaultAgents.forEach(agent => this.registerAgent(agent));
  }

  // Register a new agent
  public registerAgent(agent: Agent): void {
    this.agents.set(agent.id, agent);
    this.emit('agent:registered', { agent });

    // Log registration event
    const event: PlatformEvent = {
      id: `evt-${Date.now()}`,
      type: 'agent.registered',
      source: 'orchestrator',
      timestamp: new Date(),
      data: { agentId: agent.id, role: agent.role },
      severity: 'info',
      handled: true
    };
    this.emit('platform:event', event);
  }

  // Send message to agent(s)
  public async sendMessage(message: AgentMessage): Promise<void> {
    // Add to message queue
    this.messageQueue.push(message);

    // Track context
    if (message.correlationId) {
      const context = this.contextStore.get(message.correlationId) || {};
      context[message.from] = message.payload;
      this.contextStore.set(message.correlationId, context);
    }

    // Emit message event
    this.emit('message:sent', { message });
  }

  // Process messages from queue
  private async startMessageProcessor(): Promise<void> {
    const processMessages = async () => {
      if (this.messageQueue.length === 0) {
        setTimeout(processMessages, 100);
        return;
      }

      const message = this.messageQueue.shift()!;
      await this.processMessage(message);
      setTimeout(processMessages, 100);
    };

    setTimeout(processMessages, 100);
  }

  // Process individual message
  private async processMessage(message: AgentMessage): Promise<void> {
    const recipients = Array.isArray(message.to) ? message.to : [message.to];

    for (const recipientId of recipients) {
      const agent = this.agents.get(recipientId);

      if (!agent) {
        this.emit('error', {
          error: `Agent ${recipientId} not found`,
          message
        });
        continue;
      }

      // Update agent status
      agent.status = 'processing';
      agent.lastActive = new Date();

      try {
        // Get shared context if available
        const sharedContext = message.correlationId
          ? this.contextStore.get(message.correlationId)
          : {};

        // Process based on agent capabilities
        const response = await this.processAgentRequest(
          agent,
          message,
          sharedContext
        );

        // Send response
        if (response) {
          const responseMessage: AgentMessage = {
            id: `msg-${Date.now()}`,
            from: agent.id,
            to: message.from,
            type: 'response',
            payload: response,
            timestamp: new Date(),
            correlationId: message.correlationId,
            priority: message.priority
          };

          await this.sendMessage(responseMessage);
        }

        // Update metrics
        agent.metrics.requestsHandled++;
        agent.metrics.successRate =
          (agent.metrics.successRate * (agent.metrics.requestsHandled - 1) + 100) /
          agent.metrics.requestsHandled;

      } catch (error) {
        // Handle error
        agent.status = 'error';
        agent.metrics.errorRate++;
        agent.metrics.lastError = error instanceof Error ? error.message : 'Unknown error';

        this.emit('agent:error', { agent, error, message });
      } finally {
        // Reset status
        agent.status = 'idle';
      }
    }
  }

  // Process request based on agent capabilities
  private async processAgentRequest(
    agent: Agent,
    message: AgentMessage,
    context: any
  ): Promise<any> {
    // This is where we'd integrate with actual AI models
    // For now, return mock responses based on agent role

    const { type, data } = message.payload;

    switch (agent.role) {
      case 'radiology':
        return this.processRadiologyRequest(type, data, context);

      case 'oncology':
        return this.processOncologyRequest(type, data, context);

      case 'clinical-trial':
        return this.processClinicalTrialRequest(type, data, context);

      case 'admin':
        return this.processAdminRequest(type, data, context);

      default:
        throw new Error(`Unknown agent role: ${agent.role}`);
    }
  }

  // Radiology agent processing
  private async processRadiologyRequest(
    type: string,
    data: any,
    context: any
  ): Promise<any> {
    switch (type) {
      case 'analyze-image':
        return {
          findings: 'No acute findings. Normal chest X-ray.',
          recommendations: 'No follow-up needed.',
          confidence: 0.95
        };

      case 'schedule-scan':
        return {
          availableSlots: [
            '2024-01-15 10:00 AM',
            '2024-01-15 2:00 PM',
            '2024-01-16 9:00 AM'
          ],
          estimatedDuration: '30 minutes',
          preparation: 'No special preparation required'
        };

      default:
        return { error: 'Unknown radiology request type' };
    }
  }

  // Oncology agent processing
  private async processOncologyRequest(
    type: string,
    data: any,
    context: any
  ): Promise<any> {
    switch (type) {
      case 'treatment-recommendation':
        return {
          recommendations: [
            {
              treatment: 'Chemotherapy Protocol A',
              rationale: 'Based on tumor markers and stage',
              evidenceLevel: 'Category 1'
            }
          ],
          clinicalTrials: ['NCT12345', 'NCT67890'],
          nextSteps: 'Schedule oncology consultation'
        };

      case 'genomic-analysis':
        return {
          mutations: ['BRCA1', 'TP53'],
          actionableTargets: ['PARP inhibitors'],
          clinicalSignificance: 'High'
        };

      default:
        return { error: 'Unknown oncology request type' };
    }
  }

  // Clinical trial agent processing
  private async processClinicalTrialRequest(
    type: string,
    data: any,
    context: any
  ): Promise<any> {
    switch (type) {
      case 'eligibility-check':
        return {
          eligible: true,
          trials: [
            {
              id: 'NCT12345',
              title: 'Phase III Trial of Novel Agent',
              matchScore: 0.92
            }
          ],
          exclusionFactors: []
        };

      case 'enrollment-status':
        return {
          enrolledTrials: 1,
          screeningVisits: 2,
          nextVisit: '2024-01-20'
        };

      default:
        return { error: 'Unknown clinical trial request type' };
    }
  }

  // Admin agent processing
  private async processAdminRequest(
    type: string,
    data: any,
    context: any
  ): Promise<any> {
    switch (type) {
      case 'schedule-appointment':
        return {
          appointmentId: 'APT-12345',
          scheduledTime: '2024-01-15 10:00 AM',
          provider: 'Dr. Smith',
          location: 'Oncology Clinic, Room 201'
        };

      case 'insurance-check':
        return {
          covered: true,
          copay: 25,
          deductibleMet: 0.75,
          priorAuthRequired: false
        };

      default:
        return { error: 'Unknown admin request type' };
    }
  }

  // Execute workflow
  public async executeWorkflow(
    workflowId: string,
    steps: WorkflowStep[],
    initialData: any
  ): Promise<any> {
    const workflowContext = {
      id: workflowId,
      data: initialData,
      results: new Map<string, any>(),
      currentStep: 0
    };

    this.activeWorkflows.set(workflowId, workflowContext);

    try {
      for (const step of steps) {
        if (step.type === 'agent') {
          const agentId = step.config.agentId;
          const message: AgentMessage = {
            id: `msg-${Date.now()}`,
            from: 'workflow-engine',
            to: agentId,
            type: 'request',
            payload: {
              type: step.config.requestType,
              data: this.resolveWorkflowData(step.config.data, workflowContext)
            },
            timestamp: new Date(),
            correlationId: workflowId,
            priority: 'high'
          };

          await this.sendMessage(message);

          // Wait for response (in production, use proper async handling)
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      return workflowContext.results;
    } finally {
      this.activeWorkflows.delete(workflowId);
    }
  }

  // Resolve workflow data with context
  private resolveWorkflowData(data: any, context: any): any {
    // Simple template resolution
    if (typeof data === 'string' && data.startsWith('{{') && data.endsWith('}}')) {
      const path = data.slice(2, -2).trim();
      return this.getValueByPath(context, path);
    }

    if (typeof data === 'object' && data !== null) {
      const resolved: any = {};
      for (const [key, value] of Object.entries(data)) {
        resolved[key] = this.resolveWorkflowData(value, context);
      }
      return resolved;
    }

    return data;
  }

  // Get value by path from object
  private getValueByPath(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  // Get agent by role
  public getAgentsByRole(role: AgentRole): Agent[] {
    return Array.from(this.agents.values()).filter(agent => agent.role === role);
  }

  // Get agent metrics
  public getAgentMetrics(agentId: string): any {
    const agent = this.agents.get(agentId);
    return agent?.metrics || null;
  }

  // Get all agents
  public getAllAgents(): Agent[] {
    return Array.from(this.agents.values());
  }

  // Update agent configuration
  public updateAgentConfig(agentId: string, config: Partial<Agent['configuration']>): void {
    const agent = this.agents.get(agentId);
    if (agent) {
      agent.configuration = { ...agent.configuration, ...config };
      this.emit('agent:updated', { agent });
    }
  }
}