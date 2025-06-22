/**
 * Healthcare SaaS/AIaaS Platform Type Definitions
 * Core types for the federated multi-agent healthcare system
 */

// Agent Types
export type AgentRole = 'radiology' | 'oncology' | 'clinical-trial' | 'admin' | 'nursing' | 'pharmacy' | 'research';
export type AgentStatus = 'idle' | 'processing' | 'error' | 'offline';

export interface Agent {
  id: string;
  role: AgentRole;
  name: string;
  description: string;
  capabilities: string[];
  status: AgentStatus;
  lastActive: Date;
  metrics: AgentMetrics;
  configuration: AgentConfiguration;
}

export interface AgentMetrics {
  requestsHandled: number;
  averageResponseTime: number;
  errorRate: number;
  successRate: number;
  lastError?: string;
}

export interface AgentConfiguration {
  model: string;
  temperature: number;
  maxTokens: number;
  specializedKnowledge: string[];
  integrations: string[];
}

// Message Bus Types
export interface AgentMessage {
  id: string;
  from: string;
  to: string | string[];
  type: 'request' | 'response' | 'event' | 'error';
  payload: any;
  timestamp: Date;
  correlationId?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

// Compliance Types
export type ComplianceFramework = 'HIPAA' | 'GDPR' | 'CMMC' | 'HITRUST' | 'FDA' | 'PCI';
export type DataClassification = 'PHI' | 'PII' | 'Confidential' | 'Internal' | 'Public';

export interface CompliancePolicy {
  id: string;
  framework: ComplianceFramework;
  name: string;
  description: string;
  rules: ComplianceRule[];
  active: boolean;
  version: string;
  lastUpdated: Date;
}

export interface ComplianceRule {
  id: string;
  type: 'access' | 'retention' | 'encryption' | 'audit' | 'transfer';
  condition: string;
  action: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
}

export interface ComplianceViolation {
  id: string;
  policyId: string;
  ruleId: string;
  timestamp: Date;
  userId: string;
  action: string;
  details: string;
  remediation?: string;
  resolved: boolean;
}

// Data Management Types
export interface DataIngestionConfig {
  source: string;
  type: 'ehr' | 'device' | 'document' | 'api';
  schedule?: string;
  transformation?: DataTransformation[];
  validation?: DataValidation[];
  classification: DataClassification;
}

export interface DataTransformation {
  type: 'sanitize' | 'tokenize' | 'encrypt' | 'anonymize' | 'pseudonymize';
  fields: string[];
  options?: Record<string, any>;
}

export interface DataValidation {
  field: string;
  type: 'required' | 'format' | 'range' | 'custom';
  rule: string;
  errorMessage: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: Date;
  userId: string;
  action: string;
  resource: string;
  details: Record<string, any>;
  ipAddress: string;
  userAgent: string;
  result: 'success' | 'failure';
  dataAccessed?: string[];
}

// RAG Pipeline Types
export interface RAGConfiguration {
  vectorStore: 'pinecone' | 'weaviate' | 'qdrant' | 'chroma';
  embeddingModel: string;
  chunkSize: number;
  chunkOverlap: number;
  retrievalLimit: number;
  similarityThreshold: number;
}

export interface KnowledgeSource {
  id: string;
  name: string;
  type: 'document' | 'database' | 'api' | 'stream';
  category: 'clinical-guidelines' | 'research' | 'drug-info' | 'protocols' | 'regulations';
  lastUpdated: Date;
  updateFrequency: string;
  quality: 'verified' | 'peer-reviewed' | 'preliminary' | 'external';
}

export interface RAGQuery {
  query: string;
  context?: string;
  filters?: {
    sources?: string[];
    dateRange?: { start: Date; end: Date };
    categories?: string[];
    qualityLevel?: string[];
  };
  maxResults?: number;
}

export interface RAGResult {
  answer: string;
  sources: {
    id: string;
    content: string;
    score: number;
    metadata: Record<string, any>;
  }[];
  confidence: number;
  processingTime: number;
}

// Analytics Types
export interface AnalyticsMetric {
  id: string;
  name: string;
  type: 'counter' | 'gauge' | 'histogram' | 'summary';
  value: number;
  timestamp: Date;
  tags: Record<string, string>;
  unit?: string;
}

export interface ROIMetrics {
  timeSaved: number; // hours
  errorReduction: number; // percentage
  patientSatisfaction: number; // 1-10 scale
  clinicianSatisfaction: number; // 1-10 scale
  costSavings: number; // dollars
  efficiencyGain: number; // percentage
  complianceScore: number; // percentage
}

export interface UsageMetrics {
  activeUsers: number;
  totalQueries: number;
  averageResponseTime: number;
  peakConcurrentUsers: number;
  featureUsage: Record<string, number>;
  errorRate: number;
  uptime: number; // percentage
}

// Integration Types
export interface EHRIntegration {
  type: 'epic' | 'cerner' | 'athena' | 'allscripts';
  version: string;
  endpoint: string;
  authentication: {
    type: 'oauth2' | 'saml' | 'api-key';
    credentials: Record<string, string>;
  };
  capabilities: string[];
  dataMapping: Record<string, string>;
}

export interface FHIRResource {
  resourceType: string;
  id: string;
  meta?: {
    versionId?: string;
    lastUpdated?: string;
    profile?: string[];
  };
  [key: string]: any;
}

// User & Access Types
export interface User {
  id: string;
  email: string;
  role: UserRole;
  department: string;
  permissions: Permission[];
  attributes: Record<string, any>;
  lastLogin: Date;
  mfaEnabled: boolean;
}

export interface UserRole {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  dataAccess: DataAccessPolicy[];
}

export interface Permission {
  resource: string;
  actions: ('read' | 'write' | 'delete' | 'execute')[];
  conditions?: Record<string, any>;
}

export interface DataAccessPolicy {
  dataType: DataClassification;
  accessLevel: 'full' | 'partial' | 'none';
  conditions?: {
    department?: string[];
    purpose?: string[];
    timeWindow?: { start: string; end: string };
  };
}

// Deployment Types
export type DeploymentModel = 'on-premises' | 'cloud-saas' | 'hybrid';
export type CloudProvider = 'aws' | 'azure' | 'gcp';

export interface DeploymentConfig {
  model: DeploymentModel;
  provider?: CloudProvider;
  region?: string;
  highAvailability: boolean;
  backupStrategy: {
    frequency: string;
    retention: number; // days
    encryption: boolean;
  };
  scalingPolicy?: {
    minInstances: number;
    maxInstances: number;
    targetCPU: number;
    targetMemory: number;
  };
}

// Workflow Types
export interface Workflow {
  id: string;
  name: string;
  description: string;
  steps: WorkflowStep[];
  triggers: WorkflowTrigger[];
  owner: string;
  created: Date;
  lastModified: Date;
  active: boolean;
}

export interface WorkflowStep {
  id: string;
  type: 'agent' | 'condition' | 'transform' | 'notification';
  config: Record<string, any>;
  nextSteps: {
    condition?: string;
    stepId: string;
  }[];
}

export interface WorkflowTrigger {
  type: 'schedule' | 'event' | 'manual' | 'api';
  config: Record<string, any>;
}

// Platform Events
export interface PlatformEvent {
  id: string;
  type: string;
  source: string;
  timestamp: Date;
  data: Record<string, any>;
  severity: 'info' | 'warning' | 'error' | 'critical';
  handled: boolean;
}