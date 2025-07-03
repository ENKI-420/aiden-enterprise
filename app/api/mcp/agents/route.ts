import { ApiContext, withApiMiddleware } from '@/lib/middleware/api-middleware';
import { performanceTracker } from '@/lib/monitoring/system-monitor';
import { DataClassification, securityManager } from '@/lib/security/enhanced-security';
import { NextResponse } from 'next/server';
import { z } from 'zod';

// Enhanced validation schemas
const AgentSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1).max(100),
  role: z.string().min(1).max(200),
  status: z.enum(['Active', 'Inactive', 'Maintenance']),
  capabilities: z.array(z.string()).optional(),
  metadata: z.record(z.any()).optional()
});

const AgentUpdateSchema = AgentSchema.extend({
  id: z.number().min(1)
});

// Enhanced agent interface with security and monitoring
interface Agent {
  id: number;
  name: string;
  role: string;
  status: 'Active' | 'Inactive' | 'Maintenance';
  capabilities?: string[];
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  security: {
    classification: DataClassification;
    accessLevel: 'public' | 'internal' | 'restricted';
  };
}

// Enhanced in-memory store with security
let agents: Agent[] = [
  {
    id: 1,
    name: "PriorAuthAgent",
    role: "Prior Authorization",
    status: "Active",
    capabilities: ["authorization", "validation", "compliance"],
    metadata: { version: "1.0.0", lastHealth: new Date() },
    createdAt: new Date(),
    updatedAt: new Date(),
    security: {
      classification: DataClassification.CONFIDENTIAL,
      accessLevel: 'internal'
    }
  },
  {
    id: 2,
    name: "SummarizerAgent",
    role: "Summarization",
    status: "Active",
    capabilities: ["summarization", "nlp", "text_analysis"],
    metadata: { version: "1.2.0", lastHealth: new Date() },
    createdAt: new Date(),
    updatedAt: new Date(),
    security: {
      classification: DataClassification.INTERNAL,
      accessLevel: 'internal'
    }
  },
  {
    id: 3,
    name: "ComplianceAgent",
    role: "Compliance",
    status: "Active",
    capabilities: ["compliance", "audit", "validation"],
    metadata: { version: "2.0.0", lastHealth: new Date() },
    createdAt: new Date(),
    updatedAt: new Date(),
    security: {
      classification: DataClassification.CONFIDENTIAL,
      accessLevel: 'restricted'
    }
  }
];

// Enhanced GET handler with security and monitoring
async function getAgentsHandler(context: ApiContext) {
  const startTime = performance.now();

  try {
    // Log access attempt
    securityManager.logAuditEvent({
      action: 'agents_list_access',
      resource: 'mcp_agents',
      outcome: 'success',
      details: {
        totalAgents: agents.length,
        activeAgents: agents.filter(a => a.status === 'Active').length
      },
      userId: context.user?.id,
      ipAddress: context.req.headers.get('x-forwarded-for') || 'unknown'
    });

    // Filter agents based on access level (simplified)
    const filteredAgents = agents.filter(agent => {
      // In production, implement proper RBAC
      if (agent.security.accessLevel === 'public') return true;
      if (agent.security.accessLevel === 'internal' && context.user) return true;
      if (agent.security.accessLevel === 'restricted' && context.user?.role === 'admin') return true;
      return false;
    });

    // Track performance
    const processingTime = performance.now() - startTime;
    performanceTracker.recordMetrics({
      performance: {
        responseTime: processingTime,
        throughput: 1,
        errorRate: 0
      },
      application: {
        activeUsers: 1,
        requestsPerMinute: 1,
        failedRequests: 0,
        successfulRequests: 1
      }
    });

    return NextResponse.json({
      agents: filteredAgents,
      metadata: {
        total: filteredAgents.length,
        filtered: agents.length - filteredAgents.length,
        processingTime: `${processingTime.toFixed(2)}ms`,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    performanceTracker.trackError(error as Error, {
      component: 'agents-api',
      action: 'list_agents'
    });

    securityManager.logAuditEvent({
      action: 'agents_list_access',
      resource: 'mcp_agents',
      outcome: 'failure',
      details: { error: (error as Error).message },
      userId: context.user?.id
    });

    throw error;
  }
}

// Enhanced POST handler with validation and security
async function createAgentHandler(context: ApiContext) {
  const startTime = performance.now();

  try {
    const agentData = context.body;

    // Security validation
    const requestAnalysis = securityManager.analyzeRequest(context.req);
    if (requestAnalysis.riskLevel === 'critical') {
      throw new Error('Request blocked due to security concerns');
    }

    // Create enhanced agent
    const newAgent: Agent = {
      ...agentData,
      id: Date.now(),
      createdAt: new Date(),
      updatedAt: new Date(),
      security: {
        classification: securityManager.classifyData(JSON.stringify(agentData)),
        accessLevel: 'internal' // Default access level
      }
    };

    agents.push(newAgent);

    // Log creation
    securityManager.logAuditEvent({
      action: 'agent_creation',
      resource: 'mcp_agents',
      outcome: 'success',
      details: {
        agentId: newAgent.id,
        agentName: newAgent.name,
        role: newAgent.role,
        classification: newAgent.security.classification
      },
      userId: context.user?.id,
      ipAddress: context.req.headers.get('x-forwarded-for') || 'unknown'
    });

    // Track performance
    const processingTime = performance.now() - startTime;
    performanceTracker.recordMetrics({
      performance: {
        responseTime: processingTime,
        throughput: 1,
        errorRate: 0
      },
      application: {
        activeUsers: 1,
        requestsPerMinute: 1,
        failedRequests: 0,
        successfulRequests: 1
      }
    });

    return NextResponse.json({
      agent: newAgent,
      metadata: {
        processingTime: `${processingTime.toFixed(2)}ms`,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    performanceTracker.trackError(error as Error, {
      component: 'agents-api',
      action: 'create_agent'
    });

    securityManager.logAuditEvent({
      action: 'agent_creation',
      resource: 'mcp_agents',
      outcome: 'failure',
      details: { error: (error as Error).message },
      userId: context.user?.id
    });

    throw error;
  }
}

// Enhanced PUT handler
async function updateAgentHandler(context: ApiContext) {
  const startTime = performance.now();

  try {
    const agentData = context.body;
    const agentIndex = agents.findIndex(a => a.id === agentData.id);

    if (agentIndex === -1) {
      throw new Error('Agent not found');
    }

    // Security check - can user modify this agent?
    const existingAgent = agents[agentIndex];
    if (existingAgent.security.accessLevel === 'restricted' && context.user?.role !== 'admin') {
      throw new Error('Insufficient permissions to modify this agent');
    }

    // Update agent
    const updatedAgent = {
      ...existingAgent,
      ...agentData,
      updatedAt: new Date(),
      security: {
        ...existingAgent.security,
        classification: securityManager.classifyData(JSON.stringify(agentData))
      }
    };

    agents[agentIndex] = updatedAgent;

    // Log update
    securityManager.logAuditEvent({
      action: 'agent_update',
      resource: 'mcp_agents',
      outcome: 'success',
      details: {
        agentId: updatedAgent.id,
        changes: Object.keys(agentData).filter(k => k !== 'id')
      },
      userId: context.user?.id,
      ipAddress: context.req.headers.get('x-forwarded-for') || 'unknown'
    });

    // Track performance
    const processingTime = performance.now() - startTime;
    performanceTracker.recordMetrics({
      performance: {
        responseTime: processingTime,
        throughput: 1,
        errorRate: 0
      }
    });

    return NextResponse.json({
      success: true,
      agent: updatedAgent,
      metadata: {
        processingTime: `${processingTime.toFixed(2)}ms`,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    performanceTracker.trackError(error as Error, {
      component: 'agents-api',
      action: 'update_agent'
    });

    securityManager.logAuditEvent({
      action: 'agent_update',
      resource: 'mcp_agents',
      outcome: 'failure',
      details: { error: (error as Error).message },
      userId: context.user?.id
    });

    throw error;
  }
}

// Enhanced DELETE handler
async function deleteAgentHandler(context: ApiContext) {
  const startTime = performance.now();

  try {
    const agentData = context.body;
    const agentIndex = agents.findIndex(a => a.id === agentData.id);

    if (agentIndex === -1) {
      throw new Error('Agent not found');
    }

    // Security check
    const existingAgent = agents[agentIndex];
    if (existingAgent.security.accessLevel === 'restricted' && context.user?.role !== 'admin') {
      throw new Error('Insufficient permissions to delete this agent');
    }

    // Remove agent
    const deletedAgent = agents.splice(agentIndex, 1)[0];

    // Log deletion
    securityManager.logAuditEvent({
      action: 'agent_deletion',
      resource: 'mcp_agents',
      outcome: 'success',
      details: {
        agentId: deletedAgent.id,
        agentName: deletedAgent.name,
        role: deletedAgent.role
      },
      userId: context.user?.id,
      ipAddress: context.req.headers.get('x-forwarded-for') || 'unknown'
    });

    // Track performance
    const processingTime = performance.now() - startTime;
    performanceTracker.recordMetrics({
      performance: {
        responseTime: processingTime,
        throughput: 1,
        errorRate: 0
      }
    });

    return NextResponse.json({
      success: true,
      deletedAgent: {
        id: deletedAgent.id,
        name: deletedAgent.name,
        role: deletedAgent.role
      },
      metadata: {
        processingTime: `${processingTime.toFixed(2)}ms`,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    performanceTracker.trackError(error as Error, {
      component: 'agents-api',
      action: 'delete_agent'
    });

    securityManager.logAuditEvent({
      action: 'agent_deletion',
      resource: 'mcp_agents',
      outcome: 'failure',
      details: { error: (error as Error).message },
      userId: context.user?.id
    });

    throw error;
  }
}

// Apply middleware and export handlers
export const GET = withApiMiddleware(
  {
    methods: ['GET'],
    requireAuth: false, // Set to true in production
    rateLimit: {
      requests: 100,
      windowMs: 60 * 1000 // 100 requests per minute
    },
    cors: {
      origins: ['*'],
      methods: ['GET']
    }
  },
  getAgentsHandler
);

export const POST = withApiMiddleware(
  {
    methods: ['POST'],
    requireAuth: true, // Require auth for modifications
    rateLimit: {
      requests: 20,
      windowMs: 60 * 1000 // 20 requests per minute
    },
    validation: {
      body: AgentSchema
    },
    cors: {
      origins: ['*'],
      methods: ['POST']
    }
  },
  createAgentHandler
);

export const PUT = withApiMiddleware(
  {
    methods: ['PUT'],
    requireAuth: true,
    rateLimit: {
      requests: 20,
      windowMs: 60 * 1000
    },
    validation: {
      body: AgentUpdateSchema
    },
    cors: {
      origins: ['*'],
      methods: ['PUT']
    }
  },
  updateAgentHandler
);

export const DELETE = withApiMiddleware(
  {
    methods: ['DELETE'],
    requireAuth: true,
    rateLimit: {
      requests: 10,
      windowMs: 60 * 1000 // 10 requests per minute for deletions
    },
    cors: {
      origins: ['*'],
      methods: ['DELETE']
    }
  },
  deleteAgentHandler
);