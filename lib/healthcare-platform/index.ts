/**
 * Healthcare SaaS/AIaaS Platform
 * Main orchestrator for the federated multi-agent healthcare system
 */

import { EventEmitter } from 'events';
import { AgentOrchestrator } from './agents/orchestrator';
import { AnalyticsEngine } from './analytics/analytics-engine';
import { PolicyEngine } from './compliance/policy-engine';
import { DataSecurityManager } from './data/security-manager';
import { EHRConnector } from './integrations/ehr-connector';
import { RAGPipeline } from './rag/rag-pipeline';
import {
    AgentMessage,
    DataIngestionConfig,
    DeploymentConfig,
    RAGQuery,
    User,
    Workflow
} from './types';

export * from './types';

export class HealthcarePlatform extends EventEmitter {
  private agentOrchestrator: AgentOrchestrator;
  private policyEngine: PolicyEngine;
  private dataSecurityManager: DataSecurityManager;
  private ragPipeline: RAGPipeline;
  private analyticsEngine: AnalyticsEngine;
  private ehrConnector: EHRConnector;
  private deploymentConfig: DeploymentConfig;
  private initialized = false;

  constructor(config?: Partial<DeploymentConfig>) {
    super();

    // Initialize deployment configuration
    this.deploymentConfig = {
      model: config?.model || 'hybrid',
      provider: config?.provider,
      region: config?.region,
      highAvailability: config?.highAvailability || true,
      backupStrategy: config?.backupStrategy || {
        frequency: 'daily',
        retention: 30,
        encryption: true
      },
      scalingPolicy: config?.scalingPolicy
    };

    // Initialize all modules
    this.agentOrchestrator = new AgentOrchestrator();
    this.policyEngine = new PolicyEngine();
    this.dataSecurityManager = new DataSecurityManager(process.env.MASTER_ENCRYPTION_KEY);
    this.ragPipeline = new RAGPipeline({
      vectorStore: 'pinecone',
      embeddingModel: 'text-embedding-ada-002',
      chunkSize: 1000,
      chunkOverlap: 200,
      retrievalLimit: 10,
      similarityThreshold: 0.7
    });
    this.analyticsEngine = new AnalyticsEngine();
    this.ehrConnector = new EHRConnector();

    this.setupEventHandlers();
  }

  // Initialize the platform
  public async initialize(): Promise<void> {
    if (this.initialized) return;

    this.emit('platform:initializing');

    try {
      // Connect to default EHR systems
      await this.ehrConnector.connect('epic-main');

      // Start analytics collection
      this.analyticsEngine.on('metric:recorded', (data) => {
        this.emit('analytics:metric', data);
      });

      // Setup audit logging
      this.dataSecurityManager.on('audit:entry', async (entry) => {
        // In production, persist to immutable audit log
        this.emit('audit:log', entry);
      });

      this.initialized = true;
      this.emit('platform:initialized');
    } catch (error) {
      this.emit('platform:error', { error });
      throw error;
    }
  }

  // Setup cross-module event handlers
  private setupEventHandlers(): void {
    // Agent events
    this.agentOrchestrator.on('agent:error', ({ agent, error }) => {
      this.analyticsEngine.recordMetric({
        id: `error-${Date.now()}`,
        name: 'agent_error',
        type: 'counter',
        value: 1,
        timestamp: new Date(),
        tags: { agentId: agent.id, role: agent.role }
      });
    });

    // Policy violations
    this.policyEngine.on('violation:created', ({ violation }) => {
      this.emit('compliance:violation', violation);

      // Track in analytics
      this.analyticsEngine.recordMetric({
        id: `violation-${Date.now()}`,
        name: 'compliance_violation',
        type: 'counter',
        value: 1,
        timestamp: new Date(),
        tags: {
          policyId: violation.policyId,
          severity: violation.details
        }
      });
    });

    // Data operations
    this.dataSecurityManager.on('token:created', ({ token, field }) => {
      this.emit('security:tokenized', { token, field });
    });

    // RAG operations
    this.ragPipeline.on('query:completed', ({ query, resultCount, processingTime }) => {
      this.analyticsEngine.recordMetric({
        id: `rag-query-${Date.now()}`,
        name: 'rag_query',
        type: 'counter',
        value: 1,
        timestamp: new Date(),
        tags: { resultCount: resultCount.toString() }
      });

      this.analyticsEngine.recordMetric({
        id: `rag-time-${Date.now()}`,
        name: 'rag_processing_time',
        type: 'gauge',
        value: processingTime,
        timestamp: new Date(),
        tags: {},
        unit: 'ms'
      });
    });

    // EHR data access
    this.ehrConnector.on('data:retrieved', ({ integrationId, resourceType, count }) => {
      this.analyticsEngine.recordMetric({
        id: `ehr-access-${Date.now()}`,
        name: 'ehr_data_access',
        type: 'counter',
        value: count,
        timestamp: new Date(),
        tags: { integrationId, resourceType }
      });
    });
  }

  // Execute a healthcare workflow
  public async executeWorkflow(
    workflow: Workflow,
    user: User,
    initialData: any
  ): Promise<any> {
    // Check permissions
    const accessCheck = await this.policyEngine.evaluateAccess(
      user,
      'workflow:' + workflow.id,
      'execute'
    );

    if (!accessCheck.allowed) {
      throw new Error(`Access denied: ${accessCheck.violations.map(v => v.details).join(', ')}`);
    }

    // Track workflow execution
    this.analyticsEngine.recordMetric({
      id: `workflow-${Date.now()}`,
      name: 'workflow_execution',
      type: 'counter',
      value: 1,
      timestamp: new Date(),
      tags: { workflowId: workflow.id, userId: user.id }
    });

    // Execute through agent orchestrator
    return await this.agentOrchestrator.executeWorkflow(
      workflow.id,
      workflow.steps,
      initialData
    );
  }

  // Query with RAG
  public async query(
    query: RAGQuery,
    user: User
  ): Promise<any> {
    // Check data access permissions
    const accessCheck = await this.policyEngine.evaluateAccess(
      user,
      'knowledge:query',
      'read',
      { query: query.query }
    );

    if (!accessCheck.allowed) {
      throw new Error('Access denied for knowledge query');
    }

    // Execute RAG query
    const result = await this.ragPipeline.query(query);

    // Track user query
    this.analyticsEngine.recordMetric({
      id: `user-query-${Date.now()}`,
      name: 'user_query',
      type: 'counter',
      value: 1,
      timestamp: new Date(),
      tags: { userId: user.id, confidence: result.confidence.toString() }
    });

    return result;
  }

  // Process and secure data
  public async processData(
    data: any,
    config: DataIngestionConfig,
    user: User
  ): Promise<any> {
    // Evaluate data handling compliance
    const complianceCheck = await this.policyEngine.evaluateDataHandling(
      'ingest',
      data,
      { userId: user.id, source: config.source }
    );

    if (!complianceCheck.compliant) {
      throw new Error(`Compliance check failed: ${complianceCheck.violations.map(v => v.details).join(', ')}`);
    }

    // Apply required transformations
    if (complianceCheck.requiredTransformations.length > 0) {
      config.transformation = [
        ...(config.transformation || []),
        ...complianceCheck.requiredTransformations.map(t => {
          const [type, fields] = t.split(':');
          return {
            type: type as any,
            fields: fields.split(',')
          };
        })
      ];
    }

    // Process through security manager
    return await this.dataSecurityManager.processData(data, config);
  }

  // Get patient data with compliance
  public async getPatientData(
    patientId: string,
    user: User
  ): Promise<any> {
    // Check access permissions
    const accessCheck = await this.policyEngine.evaluateAccess(
      user,
      `patient:${patientId}`,
      'read',
      { dataType: 'PHI' }
    );

    if (!accessCheck.allowed) {
      throw new Error('Access denied to patient data');
    }

    // Fetch from EHR
    const patientSummary = await this.ehrConnector.getPatientSummary(
      'epic-main',
      patientId
    );

    // Apply any required data transformations for the user's role
    if (user.role.name !== 'physician') {
      // Sanitize sensitive data for non-physicians
      const sanitized = await this.dataSecurityManager.processData(
        patientSummary,
        {
          source: 'ehr',
          type: 'ehr',
          classification: 'PHI',
          transformation: [{
            type: 'sanitize',
            fields: ['patient.identifier', 'patient.telecom']
          }]
        }
      );
      return sanitized.processedData;
    }

    return patientSummary;
  }

  // Send message to agent
  public async sendAgentMessage(
    message: Omit<AgentMessage, 'id' | 'timestamp'>,
    user: User
  ): Promise<void> {
    // Check permissions
    const accessCheck = await this.policyEngine.evaluateAccess(
      user,
      `agent:${message.to}`,
      'execute'
    );

    if (!accessCheck.allowed) {
      throw new Error('Access denied to agent');
    }

    // Create full message
    const fullMessage: AgentMessage = {
      ...message,
      id: `msg-${Date.now()}`,
      timestamp: new Date()
    };

    // Send through orchestrator
    await this.agentOrchestrator.sendMessage(fullMessage);
  }

  // Get platform analytics
  public async getAnalytics(
    period: 'daily' | 'weekly' | 'monthly',
    user: User
  ): Promise<any> {
    // Check admin permissions
    if (user.role.name !== 'admin' && user.role.name !== 'executive') {
      throw new Error('Access denied to analytics');
    }

    const report = this.analyticsEngine.generateReport(period);

    // Add compliance status
    report.compliance = this.policyEngine.getComplianceStatus();

    // Add agent performance
    const agents = this.agentOrchestrator.getAllAgents();
    for (const agent of agents) {
      this.analyticsEngine.trackAgentPerformance(agent);
    }

    return report;
  }

  // Update knowledge source
  public async updateKnowledgeSource(
    sourceId: string,
    user: User
  ): Promise<void> {
    // Check admin permissions
    const accessCheck = await this.policyEngine.evaluateAccess(
      user,
      `knowledge:${sourceId}`,
      'write'
    );

    if (!accessCheck.allowed) {
      throw new Error('Access denied to update knowledge source');
    }

    await this.ragPipeline.updateKnowledgeSource(sourceId);
  }

  // Generate compliance report
  public async generateComplianceReport(user: User): Promise<any> {
    // Check permissions
    if (!user.permissions.some(p => p.resource === 'compliance' && p.actions.includes('read'))) {
      throw new Error('Access denied to compliance reports');
    }

    return this.policyEngine.generateComplianceReport();
  }

  // Rotate encryption keys
  public async rotateEncryptionKeys(
    fields: string[],
    user: User
  ): Promise<void> {
    // Check security admin permissions
    if (user.role.name !== 'security-admin') {
      throw new Error('Access denied: Security admin required');
    }

    await this.dataSecurityManager.rotateKeys(fields);

    this.emit('security:keys-rotated', { fields, userId: user.id });
  }

  // Get platform status
  public getStatus(): {
    initialized: boolean;
    deployment: DeploymentConfig;
    modules: {
      agents: { count: number; active: number };
      compliance: { frameworks: number; violations: number };
      rag: { sources: number };
      ehr: { connections: number };
      analytics: { metrics: number };
    };
  } {
    const agents = this.agentOrchestrator.getAllAgents();
    const complianceStatus = this.policyEngine.getComplianceStatus();
    const ragStats = this.ragPipeline.getSourceStatistics();

    return {
      initialized: this.initialized,
      deployment: this.deploymentConfig,
      modules: {
        agents: {
          count: agents.length,
          active: agents.filter(a => a.status !== 'offline').length
        },
        compliance: {
          frameworks: Object.keys(complianceStatus.frameworks).length,
          violations: this.policyEngine.getActiveViolations().length
        },
        rag: {
          sources: Object.keys(ragStats).length
        },
        ehr: {
          connections: 2 // Epic and Cerner
        },
        analytics: {
          metrics: this.analyticsEngine.getCurrentUsage().totalQueries
        }
      }
    };
  }

  // Shutdown platform
  public async shutdown(): Promise<void> {
    this.emit('platform:shutting-down');

    // Disconnect from EHR systems
    this.ehrConnector.disconnect('epic-main');
    this.ehrConnector.disconnect('cerner-main');

    // Export final analytics
    const finalReport = this.analyticsEngine.generateReport('daily');
    this.emit('platform:final-report', finalReport);

    this.initialized = false;
    this.emit('platform:shutdown');
  }
}

// Export individual modules for advanced usage
export {
    AgentOrchestrator, AnalyticsEngine, DataSecurityManager, EHRConnector, PolicyEngine, RAGPipeline
};
