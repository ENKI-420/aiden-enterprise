/**
 * Policy & Compliance Engine
 * Central engine for HIPAA/GDPR/CMMC policy enforcement
 */

import { EventEmitter } from 'events';
import {
    AuditLogEntry,
    ComplianceFramework,
    CompliancePolicy,
    ComplianceViolation,
    DataClassification,
    User
} from '../types';

export class PolicyEngine extends EventEmitter {
  private policies: Map<string, CompliancePolicy> = new Map();
  private violations: ComplianceViolation[] = [];
  private dataClassifications: Map<string, DataClassification> = new Map();

  constructor() {
    super();
    this.initializeDefaultPolicies();
  }

  private initializeDefaultPolicies() {
    // HIPAA Policy Set
    const hipaaPolicy: CompliancePolicy = {
      id: 'hipaa-core',
      framework: 'HIPAA',
      name: 'HIPAA Privacy and Security Rules',
      description: 'Core HIPAA compliance policies for PHI protection',
      active: true,
      version: '2.0',
      lastUpdated: new Date(),
      rules: [
        {
          id: 'hipaa-access-control',
          type: 'access',
          condition: 'data.classification === "PHI"',
          action: 'requireAuthentication && checkMinimumNecessary',
          severity: 'critical'
        },
        {
          id: 'hipaa-encryption',
          type: 'encryption',
          condition: 'data.classification === "PHI"',
          action: 'requireEncryption(AES256)',
          severity: 'critical'
        },
        {
          id: 'hipaa-audit-logging',
          type: 'audit',
          condition: 'data.classification === "PHI" && action.type === "access"',
          action: 'logAccess(detailed)',
          severity: 'error'
        },
        {
          id: 'hipaa-retention',
          type: 'retention',
          condition: 'data.type === "medical-record"',
          action: 'retainMinimum(6years)',
          severity: 'warning'
        },
        {
          id: 'hipaa-breach-notification',
          type: 'audit',
          condition: 'event.type === "unauthorized-access" && data.classification === "PHI"',
          action: 'notifyBreachWithin(60days)',
          severity: 'critical'
        }
      ]
    };

    // GDPR Policy Set
    const gdprPolicy: CompliancePolicy = {
      id: 'gdpr-core',
      framework: 'GDPR',
      name: 'GDPR Data Protection Policies',
      description: 'EU General Data Protection Regulation compliance',
      active: true,
      version: '1.0',
      lastUpdated: new Date(),
      rules: [
        {
          id: 'gdpr-consent',
          type: 'access',
          condition: 'data.classification === "PII" && user.location === "EU"',
          action: 'requireExplicitConsent',
          severity: 'critical'
        },
        {
          id: 'gdpr-right-to-erasure',
          type: 'retention',
          condition: 'request.type === "erasure" && data.subject === request.subject',
          action: 'deleteWithin(30days)',
          severity: 'error'
        },
        {
          id: 'gdpr-data-portability',
          type: 'transfer',
          condition: 'request.type === "portability"',
          action: 'exportInMachineReadableFormat',
          severity: 'warning'
        },
        {
          id: 'gdpr-cross-border',
          type: 'transfer',
          condition: 'data.classification === "PII" && destination.country !== "EU"',
          action: 'requireAdequacyDecision || standardContractualClauses',
          severity: 'error'
        }
      ]
    };

    // CMMC Policy Set
    const cmmcPolicy: CompliancePolicy = {
      id: 'cmmc-level3',
      framework: 'CMMC',
      name: 'CMMC Level 3 Requirements',
      description: 'Cybersecurity Maturity Model Certification for defense contractors',
      active: true,
      version: '2.0',
      lastUpdated: new Date(),
      rules: [
        {
          id: 'cmmc-access-control',
          type: 'access',
          condition: 'data.classification === "CUI"',
          action: 'requireMultiFactor && logAllAccess',
          severity: 'critical'
        },
        {
          id: 'cmmc-incident-response',
          type: 'audit',
          condition: 'event.type === "security-incident"',
          action: 'reportWithin(72hours) && preserveEvidence',
          severity: 'critical'
        },
        {
          id: 'cmmc-system-monitoring',
          type: 'audit',
          condition: 'system.type === "cui-processing"',
          action: 'continuousMonitoring && threatDetection',
          severity: 'error'
        }
      ]
    };

    this.registerPolicy(hipaaPolicy);
    this.registerPolicy(gdprPolicy);
    this.registerPolicy(cmmcPolicy);
  }

  // Register a compliance policy
  public registerPolicy(policy: CompliancePolicy): void {
    this.policies.set(policy.id, policy);
    this.emit('policy:registered', { policy });
  }

  // Evaluate data access request
  public async evaluateAccess(
    user: User,
    resource: string,
    action: string,
    context: Record<string, any> = {}
  ): Promise<{
    allowed: boolean;
    violations: ComplianceViolation[];
    requiredActions: string[];
  }> {
    const violations: ComplianceViolation[] = [];
    const requiredActions: string[] = [];
    let allowed = true;

    // Get data classification
    const dataClass = this.dataClassifications.get(resource) || 'Public';

    // Evaluate against all active policies
    for (const policy of this.policies.values()) {
      if (!policy.active) continue;

      for (const rule of policy.rules) {
        if (rule.type === 'access') {
          const ruleContext = {
            user,
            resource,
            action,
            data: { classification: dataClass },
            ...context
          };

          if (this.evaluateCondition(rule.condition, ruleContext)) {
            const actionResult = this.evaluateAction(rule.action, ruleContext);

            if (!actionResult.success) {
              allowed = false;
              violations.push(this.createViolation(
                policy.id,
                rule.id,
                user.id,
                action,
                actionResult.message
              ));
            }

            if (actionResult.requiredActions) {
              requiredActions.push(...actionResult.requiredActions);
            }
          }
        }
      }
    }

    // Log the access attempt
    await this.logAccess(user, resource, action, allowed, violations);

    return { allowed, violations, requiredActions };
  }

  // Evaluate data handling operation
  public async evaluateDataHandling(
    operation: string,
    data: any,
    context: Record<string, any> = {}
  ): Promise<{
    compliant: boolean;
    requiredTransformations: string[];
    violations: ComplianceViolation[];
  }> {
    const violations: ComplianceViolation[] = [];
    const requiredTransformations: string[] = [];
    let compliant = true;

    // Determine data classification
    const dataClass = this.classifyData(data);
    this.dataClassifications.set(data.id || 'temp', dataClass);

    // Check against all policies
    for (const policy of this.policies.values()) {
      if (!policy.active) continue;

      for (const rule of policy.rules) {
        const ruleContext = {
          operation,
          data: { ...data, classification: dataClass },
          ...context
        };

        if (this.evaluateCondition(rule.condition, ruleContext)) {
          const actionResult = this.evaluateAction(rule.action, ruleContext);

          if (!actionResult.success) {
            compliant = false;
            violations.push(this.createViolation(
              policy.id,
              rule.id,
              context.userId || 'system',
              operation,
              actionResult.message
            ));
          }

          if (actionResult.transformations) {
            requiredTransformations.push(...actionResult.transformations);
          }
        }
      }
    }

    return { compliant, requiredTransformations, violations };
  }

  // Classify data based on content
  private classifyData(data: any): DataClassification {
    // Simple classification logic - in production, use ML models
    const dataStr = JSON.stringify(data).toLowerCase();

    if (dataStr.includes('ssn') || dataStr.includes('social security')) {
      return 'PHI';
    }
    if (dataStr.includes('diagnosis') || dataStr.includes('medication')) {
      return 'PHI';
    }
    if (dataStr.includes('email') || dataStr.includes('phone')) {
      return 'PII';
    }
    if (dataStr.includes('classified') || dataStr.includes('cui')) {
      return 'Confidential';
    }

    return 'Internal';
  }

  // Evaluate rule condition
  private evaluateCondition(condition: string, context: any): boolean {
    // Simple condition evaluation - in production, use a proper expression engine
    try {
      // Create a safe evaluation context
      const evalContext = {
        data: context.data,
        user: context.user,
        action: context.action,
        event: context.event,
        request: context.request,
        system: context.system,
        destination: context.destination
      };

      // Simple condition parsing
      if (condition.includes('===')) {
        const [left, right] = condition.split('===').map(s => s.trim());
        const leftValue = this.getValueFromPath(evalContext, left);
        const rightValue = right.replace(/['"]/g, '');
        return leftValue === rightValue;
      }

      if (condition.includes('&&')) {
        const parts = condition.split('&&').map(s => s.trim());
        return parts.every(part => this.evaluateCondition(part, context));
      }

      return true;
    } catch (error) {
      console.error('Error evaluating condition:', error);
      return false;
    }
  }

  // Get value from object path
  private getValueFromPath(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  // Evaluate rule action
  private evaluateAction(
    action: string,
    context: any
  ): {
    success: boolean;
    message?: string;
    requiredActions?: string[];
    transformations?: string[];
  } {
    // Parse action requirements
    const actions = action.split('&&').map(a => a.trim());
    const results = {
      success: true,
      requiredActions: [] as string[],
      transformations: [] as string[]
    };

    for (const act of actions) {
      if (act.startsWith('require')) {
        const requirement = act.match(/require(\w+)(?:\(([^)]+)\))?/);
        if (requirement) {
          const [, type, params] = requirement;

          switch (type) {
            case 'Authentication':
              if (!context.user || !context.user.id) {
                results.success = false;
                results.message = 'Authentication required';
              }
              break;

            case 'MultiFactor':
              if (!context.user?.mfaEnabled) {
                results.success = false;
                results.message = 'Multi-factor authentication required';
                results.requiredActions?.push('enable-mfa');
              }
              break;

            case 'Encryption':
              results.transformations?.push(`encrypt:${params || 'AES256'}`);
              break;

            case 'ExplicitConsent':
              if (!context.consent) {
                results.success = false;
                results.message = 'Explicit consent required';
                results.requiredActions?.push('obtain-consent');
              }
              break;
          }
        }
      }

      if (act.includes('checkMinimumNecessary')) {
        // Check if access follows minimum necessary principle
        if (!this.checkMinimumNecessary(context)) {
          results.success = false;
          results.message = 'Access exceeds minimum necessary';
        }
      }

      if (act.startsWith('log')) {
        results.requiredActions?.push(act);
      }

      if (act.includes('deleteWithin') || act.includes('retainMinimum')) {
        results.requiredActions?.push(act);
      }
    }

    return results;
  }

  // Check minimum necessary access
  private checkMinimumNecessary(context: any): boolean {
    // Check if user's role and purpose justify the access
    const user = context.user;
    const resource = context.resource;

    // Simple implementation - in production, use more sophisticated rules
    if (user.role.name === 'physician' && resource.includes('patient')) {
      return true;
    }

    if (user.role.name === 'admin' && context.action === 'billing') {
      return true;
    }

    return false;
  }

  // Create violation record
  private createViolation(
    policyId: string,
    ruleId: string,
    userId: string,
    action: string,
    details: string
  ): ComplianceViolation {
    const violation: ComplianceViolation = {
      id: `vio-${Date.now()}`,
      policyId,
      ruleId,
      timestamp: new Date(),
      userId,
      action,
      details,
      resolved: false
    };

    this.violations.push(violation);
    this.emit('violation:created', { violation });

    return violation;
  }

  // Log access attempt
  private async logAccess(
    user: User,
    resource: string,
    action: string,
    allowed: boolean,
    violations: ComplianceViolation[]
  ): Promise<void> {
    const logEntry: AuditLogEntry = {
      id: `audit-${Date.now()}`,
      timestamp: new Date(),
      userId: user.id,
      action,
      resource,
      details: {
        allowed,
        violations: violations.map(v => v.id),
        userRole: user.role.name,
        department: user.department
      },
      ipAddress: '0.0.0.0', // Would get from request context
      userAgent: 'Platform API',
      result: allowed ? 'success' : 'failure'
    };

    this.emit('audit:log', { entry: logEntry });
  }

  // Get active violations
  public getActiveViolations(): ComplianceViolation[] {
    return this.violations.filter(v => !v.resolved);
  }

  // Resolve violation
  public resolveViolation(violationId: string, remediation: string): void {
    const violation = this.violations.find(v => v.id === violationId);
    if (violation) {
      violation.resolved = true;
      violation.remediation = remediation;
      this.emit('violation:resolved', { violation });
    }
  }

  // Get compliance status
  public getComplianceStatus(): {
    frameworks: Record<ComplianceFramework, {
      compliant: boolean;
      violations: number;
      lastAudit: Date;
    }>;
    overallScore: number;
  } {
    const frameworks: any = {};
    let totalScore = 0;
    let frameworkCount = 0;

    for (const policy of this.policies.values()) {
      if (!frameworks[policy.framework]) {
        frameworks[policy.framework] = {
          compliant: true,
          violations: 0,
          lastAudit: new Date()
        };
        frameworkCount++;
      }

      const frameworkViolations = this.violations.filter(
        v => v.policyId === policy.id && !v.resolved
      );

      if (frameworkViolations.length > 0) {
        frameworks[policy.framework].compliant = false;
        frameworks[policy.framework].violations += frameworkViolations.length;
      }

      // Calculate score (100 - violations * 10, min 0)
      const score = Math.max(0, 100 - frameworkViolations.length * 10);
      totalScore += score;
    }

    return {
      frameworks,
      overallScore: frameworkCount > 0 ? totalScore / frameworkCount : 100
    };
  }

  // Export compliance report
  public generateComplianceReport(): any {
    const status = this.getComplianceStatus();
    const policies = Array.from(this.policies.values());
    const recentViolations = this.violations
      .slice(-100)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    return {
      generatedAt: new Date(),
      status,
      policies: policies.map(p => ({
        id: p.id,
        framework: p.framework,
        name: p.name,
        version: p.version,
        active: p.active,
        ruleCount: p.rules.length
      })),
      violations: {
        total: this.violations.length,
        active: this.getActiveViolations().length,
        recent: recentViolations
      },
      recommendations: this.generateRecommendations()
    };
  }

  // Generate compliance recommendations
  private generateRecommendations(): string[] {
    const recommendations: string[] = [];
    const activeViolations = this.getActiveViolations();

    if (activeViolations.length > 0) {
      recommendations.push(`Address ${activeViolations.length} active compliance violations`);
    }

    const criticalViolations = activeViolations.filter(v => {
      const policy = this.policies.get(v.policyId);
      const rule = policy?.rules.find(r => r.id === v.ruleId);
      return rule?.severity === 'critical';
    });

    if (criticalViolations.length > 0) {
      recommendations.push(`URGENT: ${criticalViolations.length} critical violations require immediate attention`);
    }

    // Check for missing MFA
    const mfaViolations = activeViolations.filter(v =>
      v.details.includes('Multi-factor authentication')
    );
    if (mfaViolations.length > 0) {
      recommendations.push('Enable multi-factor authentication for all users accessing sensitive data');
    }

    return recommendations;
  }
}