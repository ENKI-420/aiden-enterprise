/**
 * Enhanced Security Utilities
 * Provides enterprise-grade security, audit logging, and compliance tools
 */

import crypto from 'crypto';
import { NextRequest } from 'next/server';

// Security configuration
export interface SecurityConfig {
    encryption: {
        algorithm: string;
        keySize: number;
        ivSize: number;
    };
    audit: {
        enabled: boolean;
        logLevel: 'debug' | 'info' | 'warn' | 'error';
        retentionDays: number;
    };
    compliance: {
        frameworks: ('HIPAA' | 'SOC2' | 'CMMC' | 'GDPR')[];
        dataClassification: boolean;
        accessLogging: boolean;
    };
}

const defaultSecurityConfig: SecurityConfig = {
    encryption: {
        algorithm: 'aes-256-gcm',
        keySize: 32,
        ivSize: 16
    },
    audit: {
        enabled: true,
        logLevel: 'info',
        retentionDays: 90
    },
    compliance: {
        frameworks: ['HIPAA', 'SOC2', 'CMMC'],
        dataClassification: true,
        accessLogging: true
    }
};

// Audit log entry interface
export interface AuditLogEntry {
    id: string;
    timestamp: Date;
    userId?: string;
    action: string;
    resource: string;
    outcome: 'success' | 'failure' | 'denied';
    details: Record<string, any>;
    ipAddress?: string;
    userAgent?: string;
    sessionId?: string;
    riskScore?: number;
    complianceFrameworks: string[];
}

// Data classification levels
export enum DataClassification {
    PUBLIC = 'public',
    INTERNAL = 'internal',
    CONFIDENTIAL = 'confidential',
    RESTRICTED = 'restricted',
    PHI = 'phi', // Protected Health Information
    PII = 'pii'  // Personally Identifiable Information
}

// Security utilities class
export class SecurityManager {
    private config: SecurityConfig;
    private auditLogs: AuditLogEntry[] = [];
    private encryptionKey: Buffer;

    constructor(config: Partial<SecurityConfig> = {}, masterKey?: string) {
        this.config = { ...defaultSecurityConfig, ...config };
        this.encryptionKey = masterKey
            ? Buffer.from(masterKey, 'hex')
            : crypto.randomBytes(this.config.encryption.keySize);
    }

    // Encryption utilities
    encrypt(data: string, classification: DataClassification = DataClassification.INTERNAL): {
        encrypted: string;
        iv: string;
        tag: string;
        classification: DataClassification;
    } {
        const iv = crypto.randomBytes(this.config.encryption.ivSize);
        const cipher = crypto.createCipherGCM(this.config.encryption.algorithm, this.encryptionKey, iv);

        let encrypted = cipher.update(data, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        const tag = cipher.getAuthTag();

        this.logAuditEvent({
            action: 'data_encryption',
            resource: 'sensitive_data',
            outcome: 'success',
            details: {
                classification,
                dataLength: data.length,
                algorithm: this.config.encryption.algorithm
            }
        });

        return {
            encrypted,
            iv: iv.toString('hex'),
            tag: tag.toString('hex'),
            classification
        };
    }

    decrypt(encryptedData: {
        encrypted: string;
        iv: string;
        tag: string;
        classification: DataClassification;
    }): string {
        const iv = Buffer.from(encryptedData.iv, 'hex');
        const tag = Buffer.from(encryptedData.tag, 'hex');

        const decipher = crypto.createDecipherGCM(
            this.config.encryption.algorithm,
            this.encryptionKey,
            iv
        );
        decipher.setAuthTag(tag);

        try {
            let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
            decrypted += decipher.final('utf8');

            this.logAuditEvent({
                action: 'data_decryption',
                resource: 'sensitive_data',
                outcome: 'success',
                details: {
                    classification: encryptedData.classification,
                    algorithm: this.config.encryption.algorithm
                }
            });

            return decrypted;
        } catch (error) {
            this.logAuditEvent({
                action: 'data_decryption',
                resource: 'sensitive_data',
                outcome: 'failure',
                details: {
                    error: 'Decryption failed',
                    classification: encryptedData.classification
                }
            });
            throw new Error('Decryption failed');
        }
    }

    // Hash generation for data integrity
    generateHash(data: string, algorithm: string = 'sha256'): string {
        return crypto.createHash(algorithm).update(data).digest('hex');
    }

    // Secure token generation
    generateSecureToken(length: number = 32): string {
        return crypto.randomBytes(length).toString('hex');
    }

    // Password hashing with salt
    hashPassword(password: string, saltRounds: number = 12): Promise<string> {
        return new Promise((resolve, reject) => {
            const salt = crypto.randomBytes(16).toString('hex');
            crypto.pbkdf2(password, salt, saltRounds * 1000, 64, 'sha512', (err, derivedKey) => {
                if (err) reject(err);
                else resolve(`${salt}:${derivedKey.toString('hex')}`);
            });
        });
    }

    // Password verification
    verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            const [salt, hash] = hashedPassword.split(':');
            crypto.pbkdf2(password, salt, 12000, 64, 'sha512', (err, derivedKey) => {
                if (err) reject(err);
                else resolve(hash === derivedKey.toString('hex'));
            });
        });
    }

    // Audit logging
    logAuditEvent(event: Omit<AuditLogEntry, 'id' | 'timestamp' | 'complianceFrameworks'>): void {
        if (!this.config.audit.enabled) return;

        const auditEntry: AuditLogEntry = {
            id: this.generateSecureToken(16),
            timestamp: new Date(),
            complianceFrameworks: this.config.compliance.frameworks,
            ...event
        };

        // Calculate risk score based on action and outcome
        auditEntry.riskScore = this.calculateRiskScore(event);

        this.auditLogs.push(auditEntry);

        // In production, persist to secure audit database
        if (process.env.NODE_ENV === 'production') {
            this.persistAuditLog(auditEntry);
        }

        // Console logging for development
        if (process.env.NODE_ENV === 'development') {
            console.log('Audit Event:', auditEntry);
        }
    }

    // Risk scoring algorithm
    private calculateRiskScore(event: Omit<AuditLogEntry, 'id' | 'timestamp' | 'complianceFrameworks'>): number {
        let score = 0;

        // Base score by action type
        const actionScores: Record<string, number> = {
            'login': 2,
            'data_access': 3,
            'data_modification': 5,
            'data_encryption': 1,
            'data_decryption': 3,
            'admin_action': 7,
            'security_violation': 9,
            'authentication_failure': 6
        };

        score += actionScores[event.action] || 1;

        // Outcome modifier
        if (event.outcome === 'failure') score += 3;
        if (event.outcome === 'denied') score += 5;

        // Resource sensitivity
        if (event.resource.includes('phi') || event.resource.includes('pii')) score += 4;
        if (event.resource.includes('admin') || event.resource.includes('security')) score += 3;

        return Math.min(score, 10); // Cap at 10
    }

    // Persist audit log (placeholder for production implementation)
    private async persistAuditLog(entry: AuditLogEntry): Promise<void> {
        // In production, implement secure audit log persistence
        // Examples: AWS CloudTrail, Azure Security Center, dedicated audit database
        console.info('Audit log persisted:', entry.id);
    }

    // Data classification utilities
    classifyData(data: string): DataClassification {
        // Simple regex-based classification (enhance for production)
        const patterns = {
            [DataClassification.PHI]: [
                /\b\d{3}-\d{2}-\d{4}\b/, // SSN
                /\b\d{10}\b/, // Phone number
                /mrn|medical record|patient id/i
            ],
            [DataClassification.PII]: [
                /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/, // Email
                /\b\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}\b/, // Credit card
                /\bdob|date of birth|birthday\b/i
            ],
            [DataClassification.CONFIDENTIAL]: [
                /password|secret|key|token/i,
                /confidential|proprietary|internal use only/i
            ]
        };

        for (const [classification, regexList] of Object.entries(patterns)) {
            if (regexList.some(regex => regex.test(data))) {
                return classification as DataClassification;
            }
        }

        return DataClassification.INTERNAL;
    }

    // Compliance validation
    validateCompliance(action: string, data: any, framework: string): {
        compliant: boolean;
        violations: string[];
        recommendations: string[];
    } {
        const violations: string[] = [];
        const recommendations: string[] = [];

        switch (framework) {
            case 'HIPAA':
                if (!this.config.audit.enabled) {
                    violations.push('HIPAA requires comprehensive audit logging');
                }
                if (this.classifyData(JSON.stringify(data)) === DataClassification.PHI) {
                    if (!data.encrypted) {
                        violations.push('PHI must be encrypted in transit and at rest');
                        recommendations.push('Implement end-to-end encryption for PHI');
                    }
                }
                break;

            case 'SOC2':
                if (action.includes('admin') && !data.mfaVerified) {
                    violations.push('SOC2 Type II requires MFA for administrative actions');
                    recommendations.push('Implement multi-factor authentication');
                }
                break;

            case 'CMMC':
                if (this.classifyData(JSON.stringify(data)) === DataClassification.RESTRICTED) {
                    if (!data.accessControlVerified) {
                        violations.push('CMMC requires strict access controls for CUI');
                        recommendations.push('Implement role-based access control (RBAC)');
                    }
                }
                break;
        }

        return {
            compliant: violations.length === 0,
            violations,
            recommendations
        };
    }

    // Request security analysis
    analyzeRequest(request: NextRequest): {
        riskLevel: 'low' | 'medium' | 'high' | 'critical';
        threats: string[];
        recommendations: string[];
    } {
        const threats: string[] = [];
        const recommendations: string[] = [];
        let riskScore = 0;

        // Analyze headers
        const userAgent = request.headers.get('user-agent') || '';
        const contentType = request.headers.get('content-type') || '';

        // Suspicious user agents
        if (/bot|crawler|spider/i.test(userAgent) && !userAgent.includes('Googlebot')) {
            threats.push('Potential automated bot activity');
            riskScore += 2;
        }

        // Missing security headers
        if (!request.headers.get('x-requested-with')) {
            threats.push('Missing CSRF protection header');
            recommendations.push('Include X-Requested-With header');
            riskScore += 1;
        }

        // Content type validation
        if (request.method === 'POST' && !contentType.includes('application/json')) {
            threats.push('Unexpected content type for POST request');
            riskScore += 1;
        }

        // Rate limiting analysis (simplified)
        const timestamp = Date.now();
        const clientId = request.headers.get('x-forwarded-for') || 'unknown';
        // In production, implement proper rate limiting with Redis/database

        let riskLevel: 'low' | 'medium' | 'high' | 'critical';
        if (riskScore <= 2) riskLevel = 'low';
        else if (riskScore <= 5) riskLevel = 'medium';
        else if (riskScore <= 8) riskLevel = 'high';
        else riskLevel = 'critical';

        this.logAuditEvent({
            action: 'request_analysis',
            resource: request.url,
            outcome: riskLevel === 'critical' ? 'denied' : 'success',
            details: {
                riskLevel,
                riskScore,
                threats: threats.length,
                userAgent: userAgent.substring(0, 100)
            },
            ipAddress: clientId
        });

        return { riskLevel, threats, recommendations };
    }

    // Get audit statistics
    getAuditStatistics(timeframe: 'hour' | 'day' | 'week' | 'month' = 'day'): {
        totalEvents: number;
        failureRate: number;
        highRiskEvents: number;
        topActions: Record<string, number>;
        complianceStatus: Record<string, number>;
    } {
        const now = new Date();
        const timeframeDuration = {
            hour: 60 * 60 * 1000,
            day: 24 * 60 * 60 * 1000,
            week: 7 * 24 * 60 * 60 * 1000,
            month: 30 * 24 * 60 * 60 * 1000
        };

        const cutoff = new Date(now.getTime() - timeframeDuration[timeframe]);
        const recentLogs = this.auditLogs.filter(log => log.timestamp >= cutoff);

        const totalEvents = recentLogs.length;
        const failures = recentLogs.filter(log => log.outcome === 'failure').length;
        const highRiskEvents = recentLogs.filter(log => (log.riskScore || 0) >= 7).length;

        const topActions = recentLogs.reduce((acc, log) => {
            acc[log.action] = (acc[log.action] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const complianceStatus = this.config.compliance.frameworks.reduce((acc, framework) => {
            acc[framework] = recentLogs.filter(log =>
                log.complianceFrameworks.includes(framework) && log.outcome === 'success'
            ).length;
            return acc;
        }, {} as Record<string, number>);

        return {
            totalEvents,
            failureRate: totalEvents > 0 ? failures / totalEvents : 0,
            highRiskEvents,
            topActions,
            complianceStatus
        };
    }

    // Clear old audit logs based on retention policy
    cleanupAuditLogs(): void {
        const retentionCutoff = new Date();
        retentionCutoff.setDate(retentionCutoff.getDate() - this.config.audit.retentionDays);

        const beforeCount = this.auditLogs.length;
        this.auditLogs = this.auditLogs.filter(log => log.timestamp >= retentionCutoff);
        const afterCount = this.auditLogs.length;

        this.logAuditEvent({
            action: 'audit_cleanup',
            resource: 'audit_logs',
            outcome: 'success',
            details: {
                removedLogs: beforeCount - afterCount,
                retentionDays: this.config.audit.retentionDays
            }
        });
    }
}

// Export singleton instance
export const securityManager = new SecurityManager();

// Utility functions
export function sanitizeInput(input: string, allowedChars: RegExp = /[a-zA-Z0-9\s\-_.@]/g): string {
    return input.match(allowedChars)?.join('') || '';
}

export function validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 254;
}

export function generateCSRFToken(): string {
    return crypto.randomBytes(32).toString('hex');
}

export function validateCSRFToken(token: string, expected: string): boolean {
    return crypto.timingSafeEqual(Buffer.from(token), Buffer.from(expected));
} 