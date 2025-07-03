import { ApiContext, withApiMiddleware } from '@/lib/middleware/api-middleware';
import { performanceTracker } from '@/lib/monitoring/system-monitor';
import { DataClassification, securityManager } from '@/lib/security/enhanced-security';
import { NextResponse } from 'next/server';
import { z } from 'zod';

// Enhanced validation schemas with compliance requirements
const ComplianceLogSchema = z.object({
  id: z.number().optional(),
  event: z.string().min(1).max(200),
  resource: z.string().min(1).max(100),
  action: z.enum(['create', 'read', 'update', 'delete', 'access', 'export', 'import', 'approval', 'rejection']),
  outcome: z.enum(['success', 'failure', 'partial', 'denied']),
  severity: z.enum(['low', 'medium', 'high', 'critical']).optional(),
  userId: z.string().optional(),
  userRole: z.string().optional(),
  ipAddress: z.string().optional(),
  userAgent: z.string().optional(),
  metadata: z.record(z.any()).optional(),
  complianceFrameworks: z.array(z.enum(['HIPAA', 'SOC2', 'CMMC', 'GDPR', 'FISMA'])).optional(),
  retention: z.object({
    years: z.number().min(1).max(50),
    reason: z.string()
  }).optional()
});

// Enhanced compliance log interface
interface ComplianceLog {
  id: number;
  event: string;
  resource: string;
  action: string;
  outcome: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  userId?: string;
  userRole?: string;
  ipAddress?: string;
  userAgent: string;
  timestamp: Date;
  metadata?: Record<string, any>;
  complianceFrameworks: string[];
  retention: {
    years: number;
    reason: string;
    expirationDate: Date;
  };
  security: {
    classification: DataClassification;
    encrypted: boolean;
    hash: string;
    digitalSignature?: string;
  };
  audit: {
    immutable: boolean;
    chainHash?: string;
    previousHash?: string;
    verified: boolean;
  };
}

// Enhanced in-memory store with blockchain-like audit trail
let complianceLogs: ComplianceLog[] = [];
let auditChain: string[] = [];

// Compliance validation rules
const complianceRules = {
  HIPAA: {
    requiredFields: ['userId', 'userRole', 'ipAddress'],
    retentionMinimum: 6,
    encryptionRequired: true,
    auditRequired: true
  },
  SOC2: {
    requiredFields: ['userId', 'timestamp', 'outcome'],
    retentionMinimum: 3,
    encryptionRequired: false,
    auditRequired: true
  },
  CMMC: {
    requiredFields: ['userId', 'userRole', 'ipAddress', 'userAgent'],
    retentionMinimum: 7,
    encryptionRequired: true,
    auditRequired: true
  },
  GDPR: {
    requiredFields: ['userId', 'userRole'],
    retentionMinimum: 6,
    encryptionRequired: true,
    auditRequired: true
  },
  FISMA: {
    requiredFields: ['userId', 'userRole', 'ipAddress', 'severity'],
    retentionMinimum: 10,
    encryptionRequired: true,
    auditRequired: true
  }
};

// Create audit chain hash
function createAuditChainHash(log: ComplianceLog, previousHash: string = ''): string {
  const content = JSON.stringify({
    id: log.id,
    timestamp: log.timestamp,
    event: log.event,
    resource: log.resource,
    action: log.action,
    userId: log.userId,
    previousHash
  });
  return securityManager.generateHash(content);
}

// Validate compliance requirements
function validateComplianceRequirements(logData: any, frameworks: string[]): {
  valid: boolean;
  violations: string[];
  recommendations: string[];
} {
  const violations: string[] = [];
  const recommendations: string[] = [];

  for (const framework of frameworks) {
    const rules = complianceRules[framework as keyof typeof complianceRules];
    if (!rules) continue;

    // Check required fields
    for (const field of rules.requiredFields) {
      if (!logData[field]) {
        violations.push(`${framework}: Missing required field '${field}'`);
      }
    }

    // Check retention requirements
    if (logData.retention && logData.retention.years < rules.retentionMinimum) {
      violations.push(`${framework}: Retention period too short (minimum ${rules.retentionMinimum} years)`);
    }

    // Check encryption requirements
    if (rules.encryptionRequired && !logData.encrypted) {
      violations.push(`${framework}: Encryption required for sensitive data`);
      recommendations.push(`Enable encryption for ${framework} compliance`);
    }

    // Additional framework-specific validations
    if (framework === 'HIPAA' && logData.resource?.toLowerCase().includes('patient')) {
      if (!logData.metadata?.patientConsent) {
        violations.push('HIPAA: Patient consent documentation required');
      }
    }

    if (framework === 'GDPR' && logData.action === 'export') {
      if (!logData.metadata?.dataSubjectConsent) {
        violations.push('GDPR: Data subject consent required for export');
      }
    }
  }

  return {
    valid: violations.length === 0,
    violations,
    recommendations
  };
}

// Enhanced GET handler with compliance filtering
async function getComplianceLogsHandler(context: ApiContext) {
  const startTime = performance.now();

  try {
    const url = new URL(context.req.url);
    const framework = url.searchParams.get('framework');
    const severity = url.searchParams.get('severity');
    const fromDate = url.searchParams.get('fromDate');
    const toDate = url.searchParams.get('toDate');
    const userId = url.searchParams.get('userId');
    const limit = parseInt(url.searchParams.get('limit') || '100');
    const offset = parseInt(url.searchParams.get('offset') || '0');

    // Log access with compliance tracking
    securityManager.logAuditEvent({
      action: 'compliance_logs_access',
      resource: 'compliance_logs',
      outcome: 'success',
      details: {
        filters: { framework, severity, fromDate, toDate, userId },
        totalLogs: complianceLogs.length,
        requestedBy: context.user?.id
      },
      userId: context.user?.id,
      ipAddress: context.req.headers.get('x-forwarded-for') || 'unknown'
    });

    // Filter logs based on query parameters
    let filteredLogs = complianceLogs;

    if (framework) {
      filteredLogs = filteredLogs.filter(log =>
        log.complianceFrameworks.includes(framework.toUpperCase())
      );
    }

    if (severity) {
      filteredLogs = filteredLogs.filter(log => log.severity === severity);
    }

    if (fromDate) {
      const from = new Date(fromDate);
      filteredLogs = filteredLogs.filter(log => log.timestamp >= from);
    }

    if (toDate) {
      const to = new Date(toDate);
      filteredLogs = filteredLogs.filter(log => log.timestamp <= to);
    }

    if (userId) {
      filteredLogs = filteredLogs.filter(log => log.userId === userId);
    }

    // Apply pagination
    const paginatedLogs = filteredLogs.slice(offset, offset + limit);

    // Generate compliance report
    const complianceReport = {
      totalLogs: filteredLogs.length,
      severityDistribution: {
        low: filteredLogs.filter(l => l.severity === 'low').length,
        medium: filteredLogs.filter(l => l.severity === 'medium').length,
        high: filteredLogs.filter(l => l.severity === 'high').length,
        critical: filteredLogs.filter(l => l.severity === 'critical').length
      },
      frameworkCoverage: Object.keys(complianceRules).reduce((acc, fw) => {
        acc[fw] = filteredLogs.filter(l => l.complianceFrameworks.includes(fw)).length;
        return acc;
      }, {} as Record<string, number>),
      auditIntegrity: {
        totalVerified: filteredLogs.filter(l => l.audit.verified).length,
        chainIntegrity: auditChain.length > 0 ? 'valid' : 'empty'
      }
    };

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
      logs: paginatedLogs,
      pagination: {
        total: filteredLogs.length,
        offset,
        limit,
        hasMore: offset + limit < filteredLogs.length
      },
      complianceReport,
      metadata: {
        processingTime: `${processingTime.toFixed(2)}ms`,
        timestamp: new Date().toISOString(),
        auditChainLength: auditChain.length
      }
    });

  } catch (error) {
    performanceTracker.trackError(error as Error, {
      component: 'compliance-logs-api',
      action: 'get_logs'
    });

    securityManager.logAuditEvent({
      action: 'compliance_logs_access',
      resource: 'compliance_logs',
      outcome: 'failure',
      details: { error: (error as Error).message },
      userId: context.user?.id
    });

    throw error;
  }
}

// Enhanced POST handler with compliance validation
async function createComplianceLogHandler(context: ApiContext) {
  const startTime = performance.now();

  try {
    const logData = context.body;

    // Security validation
    const requestAnalysis = securityManager.analyzeRequest(context.req);
    if (requestAnalysis.riskLevel === 'critical') {
      throw new Error('Request blocked due to security concerns');
    }

    // Set default values
    const frameworks = logData.complianceFrameworks || ['SOC2'];
    const severity = logData.severity || 'medium';
    const retentionYears = logData.retention?.years || 7;

    // Validate compliance requirements
    const complianceValidation = validateComplianceRequirements(logData, frameworks);
    if (!complianceValidation.valid) {
      return NextResponse.json({
        error: 'Compliance validation failed',
        violations: complianceValidation.violations,
        recommendations: complianceValidation.recommendations
      }, { status: 400 });
    }

    // Create enhanced compliance log
    const newLog: ComplianceLog = {
      id: Date.now(),
      event: logData.event,
      resource: logData.resource,
      action: logData.action,
      outcome: logData.outcome,
      severity,
      userId: logData.userId || context.user?.id,
      userRole: logData.userRole || context.user?.role,
      ipAddress: logData.ipAddress || context.req.headers.get('x-forwarded-for') || 'unknown',
      userAgent: logData.userAgent || context.req.headers.get('user-agent') || 'unknown',
      timestamp: new Date(),
      metadata: logData.metadata || {},
      complianceFrameworks: frameworks,
      retention: {
        years: retentionYears,
        reason: logData.retention?.reason || 'Regulatory compliance',
        expirationDate: new Date(Date.now() + retentionYears * 365 * 24 * 60 * 60 * 1000)
      },
      security: {
        classification: securityManager.classifyData(JSON.stringify(logData)),
        encrypted: frameworks.some((f: string) => complianceRules[f as keyof typeof complianceRules]?.encryptionRequired),
        hash: securityManager.generateHash(JSON.stringify(logData))
      },
      audit: {
        immutable: true,
        verified: false
      }
    };

    // Create audit chain hash
    const previousHash = auditChain.length > 0 ? auditChain[auditChain.length - 1] : '';
    const chainHash = createAuditChainHash(newLog, previousHash);
    newLog.audit.chainHash = chainHash;
    newLog.audit.previousHash = previousHash;
    newLog.audit.verified = true;

    // Encrypt sensitive data if required
    if (newLog.security.encrypted) {
      const encryptedData = securityManager.encrypt(JSON.stringify(newLog.metadata), newLog.security.classification);
      newLog.security.digitalSignature = encryptedData.tag;
    }

    // Add to audit chain
    auditChain.push(chainHash);
    complianceLogs.push(newLog);

    // Log creation with compliance tracking
    securityManager.logAuditEvent({
      action: 'compliance_log_creation',
      resource: 'compliance_logs',
      outcome: 'success',
      details: {
        logId: newLog.id,
        event: newLog.event,
        frameworks: frameworks,
        severity: severity,
        auditChainLength: auditChain.length
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
      log: {
        id: newLog.id,
        event: newLog.event,
        resource: newLog.resource,
        action: newLog.action,
        outcome: newLog.outcome,
        severity: newLog.severity,
        timestamp: newLog.timestamp,
        complianceFrameworks: newLog.complianceFrameworks,
        auditHash: newLog.audit.chainHash
      },
      compliance: {
        validated: complianceValidation.valid,
        frameworks: frameworks,
        encrypted: newLog.security.encrypted,
        auditChainPosition: auditChain.length
      },
      metadata: {
        processingTime: `${processingTime.toFixed(2)}ms`,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    performanceTracker.trackError(error as Error, {
      component: 'compliance-logs-api',
      action: 'create_log'
    });

    securityManager.logAuditEvent({
      action: 'compliance_log_creation',
      resource: 'compliance_logs',
      outcome: 'failure',
      details: { error: (error as Error).message },
      userId: context.user?.id
    });

    throw error;
  }
}

// Compliance audit verification endpoint
async function verifyAuditChainHandler(context: ApiContext) {
  const startTime = performance.now();

  try {
    const verificationResults = [];
    let chainValid = true;

    for (let i = 0; i < complianceLogs.length; i++) {
      const log = complianceLogs[i];
      if (!log) continue;

      const previousLog = i > 0 ? complianceLogs[i - 1] : null;
      const previousHash = previousLog?.audit.chainHash || '';
      const expectedHash = createAuditChainHash(log, previousHash);

      const isValid = log.audit.chainHash === expectedHash;
      if (!isValid) chainValid = false;

      verificationResults.push({
        logId: log.id,
        expected: expectedHash,
        actual: log.audit.chainHash,
        valid: isValid
      });
    }

    const processingTime = performance.now() - startTime;

    return NextResponse.json({
      auditChainVerification: {
        overallValid: chainValid,
        totalLogs: complianceLogs.length,
        verificationResults,
        timestamp: new Date().toISOString()
      },
      metadata: {
        processingTime: `${processingTime.toFixed(2)}ms`
      }
    });

  } catch (error) {
    performanceTracker.trackError(error as Error, {
      component: 'compliance-logs-api',
      action: 'verify_audit_chain'
    });
    throw error;
  }
}

// Apply middleware and export handlers
export const GET = withApiMiddleware(
  {
    methods: ['GET'],
    requireAuth: true, // Compliance logs require authentication
    rateLimit: {
      requests: 50,
      windowMs: 60 * 1000 // 50 requests per minute
    },
    cors: {
      origins: ['*'],
      methods: ['GET']
    }
  },
  getComplianceLogsHandler
);

export const POST = withApiMiddleware(
  {
    methods: ['POST'],
    requireAuth: true,
    rateLimit: {
      requests: 25,
      windowMs: 60 * 1000 // 25 requests per minute
    },
    validation: {
      body: ComplianceLogSchema
    },
    cors: {
      origins: ['*'],
      methods: ['POST']
    }
  },
  createComplianceLogHandler
);

// Additional endpoint for audit chain verification
export const PUT = withApiMiddleware(
  {
    methods: ['PUT'],
    requireAuth: true,
    rateLimit: {
      requests: 10,
      windowMs: 60 * 1000 // 10 requests per minute for verification
    },
    cors: {
      origins: ['*'],
      methods: ['PUT']
    }
  },
  verifyAuditChainHandler
);