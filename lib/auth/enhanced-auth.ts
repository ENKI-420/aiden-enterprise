/**
 * Enhanced Authentication System for IRIS-AI Enterprise
 * Implements OAuth2/OIDC, Multi-Factor Authentication, and Biometric Support
 */

import crypto from 'crypto';
import { NextRequest } from 'next/server';
import { securityManager } from '../security/enhanced-security';

export interface AuthUser {
    id: string;
    email: string;
    name: string;
    roles: string[];
    clearanceLevel: 'PUBLIC' | 'INTERNAL' | 'CONFIDENTIAL' | 'SECRET' | 'TOP_SECRET';
    department: 'HEALTHCARE' | 'DEFENSE' | 'LEGAL' | 'RESEARCH' | 'ADMIN';
    permissions: string[];
    lastLogin: Date;
    mfaEnabled: boolean;
    biometricEnabled: boolean;
    sessionId: string;
}

export interface AuthSession {
    sessionId: string;
    userId: string;
    expiresAt: Date;
    refreshToken: string;
    accessToken: string;
    ipAddress: string;
    userAgent: string;
    isActive: boolean;
    mfaVerified: boolean;
    biometricVerified: boolean;
    clearanceLevel: string;
}

export interface MFAChallenge {
    challengeId: string;
    userId: string;
    method: 'totp' | 'sms' | 'email' | 'push';
    expiresAt: Date;
    attempts: number;
    maxAttempts: number;
}

export interface BiometricData {
    userId: string;
    type: 'fingerprint' | 'faceID' | 'voiceprint' | 'retina';
    template: string; // Encrypted biometric template
    confidence: number;
    deviceId: string;
    registeredAt: Date;
}

export class EnhancedAuthSystem {
    private sessions: Map<string, AuthSession> = new Map();
    private mfaChallenges: Map<string, MFAChallenge> = new Map();
    private biometricData: Map<string, BiometricData[]> = new Map();
    private rateLimiter: Map<string, number[]> = new Map();

    // OAuth2/OIDC Configuration
    private oauthConfig = {
        clientId: process.env.OAUTH_CLIENT_ID || 'iris-ai-enterprise',
        clientSecret: process.env.OAUTH_CLIENT_SECRET || '',
        redirectUri: process.env.OAUTH_REDIRECT_URI || 'https://iris-ai.com/auth/callback',
        scope: 'openid profile email roles clearance',
        authorizationEndpoint: 'https://auth.iris-ai.com/oauth/authorize',
        tokenEndpoint: 'https://auth.iris-ai.com/oauth/token',
        userInfoEndpoint: 'https://auth.iris-ai.com/oauth/userinfo',
        jwksUri: 'https://auth.iris-ai.com/.well-known/jwks.json'
    };

    // Generate OAuth2 authorization URL
    public generateAuthUrl(state?: string): string {
        const params = new URLSearchParams({
            response_type: 'code',
            client_id: this.oauthConfig.clientId,
            redirect_uri: this.oauthConfig.redirectUri,
            scope: this.oauthConfig.scope,
            state: state || crypto.randomBytes(32).toString('hex')
        });

        return `${this.oauthConfig.authorizationEndpoint}?${params.toString()}`;
    }

    // Handle OAuth2 callback
    public async handleOAuthCallback(code: string, state: string): Promise<AuthUser> {
        try {
            // Exchange authorization code for tokens
            const tokenResponse = await fetch(this.oauthConfig.tokenEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': `Basic ${Buffer.from(
                        `${this.oauthConfig.clientId}:${this.oauthConfig.clientSecret}`
                    ).toString('base64')}`
                },
                body: new URLSearchParams({
                    grant_type: 'authorization_code',
                    code,
                    redirect_uri: this.oauthConfig.redirectUri
                })
            });

            if (!tokenResponse.ok) {
                throw new Error('Token exchange failed');
            }

            const tokens = await tokenResponse.json();

            // Get user info
            const userInfoResponse = await fetch(this.oauthConfig.userInfoEndpoint, {
                headers: {
                    'Authorization': `Bearer ${tokens.access_token}`
                }
            });

            if (!userInfoResponse.ok) {
                throw new Error('User info retrieval failed');
            }

            const userInfo = await userInfoResponse.json();

            // Create auth user
            const authUser: AuthUser = {
                id: userInfo.sub,
                email: userInfo.email,
                name: userInfo.name,
                roles: userInfo.roles || ['user'],
                clearanceLevel: userInfo.clearance || 'INTERNAL',
                department: userInfo.department || 'RESEARCH',
                permissions: this.calculatePermissions(userInfo.roles, userInfo.clearance),
                lastLogin: new Date(),
                mfaEnabled: userInfo.mfa_enabled || false,
                biometricEnabled: userInfo.biometric_enabled || false,
                sessionId: crypto.randomBytes(32).toString('hex')
            };

            // Create session
            await this.createSession(authUser, tokens.access_token, tokens.refresh_token);

            // Log successful authentication
            securityManager.logAuditEvent({
                action: 'oauth_login',
                resource: 'authentication',
                outcome: 'success',
                details: {
                    userId: authUser.id,
                    email: authUser.email,
                    clearanceLevel: authUser.clearanceLevel,
                    department: authUser.department,
                    mfaEnabled: authUser.mfaEnabled
                }
            });

            return authUser;

        } catch (error) {
            securityManager.logAuditEvent({
                action: 'oauth_login',
                resource: 'authentication',
                outcome: 'failure',
                details: {
                    error: error instanceof Error ? error.message : 'Unknown error',
                    code,
                    state
                }
            });
            throw error;
        }
    }

    // Create authenticated session
    private async createSession(user: AuthUser, accessToken: string, refreshToken: string): Promise<void> {
        const session: AuthSession = {
            sessionId: user.sessionId,
            userId: user.id,
            expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000), // 8 hours
            refreshToken,
            accessToken,
            ipAddress: 'unknown', // Would be populated from request
            userAgent: 'unknown', // Would be populated from request
            isActive: true,
            mfaVerified: !user.mfaEnabled, // If MFA disabled, consider verified
            biometricVerified: !user.biometricEnabled,
            clearanceLevel: user.clearanceLevel
        };

        this.sessions.set(session.sessionId, session);
    }

    // Initiate MFA Challenge
    public async initiateMFAChallenge(userId: string, method: 'totp' | 'sms' | 'email' | 'push'): Promise<MFAChallenge> {
        const challenge: MFAChallenge = {
            challengeId: crypto.randomBytes(32).toString('hex'),
            userId,
            method,
            expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
            attempts: 0,
            maxAttempts: 3
        };

        this.mfaChallenges.set(challenge.challengeId, challenge);

        // Send challenge based on method
        switch (method) {
            case 'totp':
                // User enters TOTP code from authenticator app
                break;
            case 'sms':
                await this.sendSMSChallenge(userId, challenge.challengeId);
                break;
            case 'email':
                await this.sendEmailChallenge(userId, challenge.challengeId);
                break;
            case 'push':
                await this.sendPushChallenge(userId, challenge.challengeId);
                break;
        }

        securityManager.logAuditEvent({
            action: 'mfa_challenge_initiated',
            resource: 'authentication',
            outcome: 'success',
            details: {
                userId,
                method,
                challengeId: challenge.challengeId
            }
        });

        return challenge;
    }

    // Verify MFA Challenge
    public async verifyMFAChallenge(challengeId: string, code: string): Promise<boolean> {
        const challenge = this.mfaChallenges.get(challengeId);

        if (!challenge) {
            securityManager.logAuditEvent({
                action: 'mfa_verification',
                resource: 'authentication',
                outcome: 'failure',
                details: { error: 'Challenge not found', challengeId }
            });
            return false;
        }

        if (challenge.expiresAt < new Date()) {
            this.mfaChallenges.delete(challengeId);
            securityManager.logAuditEvent({
                action: 'mfa_verification',
                resource: 'authentication',
                outcome: 'failure',
                details: { error: 'Challenge expired', challengeId }
            });
            return false;
        }

        if (challenge.attempts >= challenge.maxAttempts) {
            this.mfaChallenges.delete(challengeId);
            securityManager.logAuditEvent({
                action: 'mfa_verification',
                resource: 'authentication',
                outcome: 'failure',
                details: { error: 'Max attempts exceeded', challengeId }
            });
            return false;
        }

        challenge.attempts++;

        // Verify code based on method
        let isValid = false;
        switch (challenge.method) {
            case 'totp':
                isValid = await this.verifyTOTP(challenge.userId, code);
                break;
            case 'sms':
            case 'email':
            case 'push':
                isValid = await this.verifyOTPCode(challengeId, code);
                break;
        }

        if (isValid) {
            // Update session MFA status
            const sessions = Array.from(this.sessions.values())
                .filter(s => s.userId === challenge.userId && s.isActive);

            sessions.forEach(session => {
                session.mfaVerified = true;
            });

            this.mfaChallenges.delete(challengeId);

            securityManager.logAuditEvent({
                action: 'mfa_verification',
                resource: 'authentication',
                outcome: 'success',
                details: {
                    userId: challenge.userId,
                    method: challenge.method,
                    challengeId
                }
            });
        } else {
            securityManager.logAuditEvent({
                action: 'mfa_verification',
                resource: 'authentication',
                outcome: 'failure',
                details: {
                    userId: challenge.userId,
                    method: challenge.method,
                    challengeId,
                    attempts: challenge.attempts
                }
            });
        }

        return isValid;
    }

    // Biometric Authentication
    public async registerBiometric(userId: string, type: BiometricData['type'], template: string, deviceId: string): Promise<boolean> {
        try {
            const biometricEntry: BiometricData = {
                userId,
                type,
                template: securityManager.encrypt(template).encrypted,
                confidence: 0.95,
                deviceId,
                registeredAt: new Date()
            };

            const userBiometrics = this.biometricData.get(userId) || [];
            userBiometrics.push(biometricEntry);
            this.biometricData.set(userId, userBiometrics);

            securityManager.logAuditEvent({
                action: 'biometric_registration',
                resource: 'authentication',
                outcome: 'success',
                details: {
                    userId,
                    type,
                    deviceId
                }
            });

            return true;
        } catch (error) {
            securityManager.logAuditEvent({
                action: 'biometric_registration',
                resource: 'authentication',
                outcome: 'failure',
                details: {
                    userId,
                    type,
                    deviceId,
                    error: error instanceof Error ? error.message : 'Unknown error'
                }
            });
            return false;
        }
    }

    // Verify Biometric
    public async verifyBiometric(userId: string, type: BiometricData['type'], template: string, deviceId: string): Promise<boolean> {
        const userBiometrics = this.biometricData.get(userId) || [];
        const registeredBiometric = userBiometrics.find(b => b.type === type && b.deviceId === deviceId);

        if (!registeredBiometric) {
            securityManager.logAuditEvent({
                action: 'biometric_verification',
                resource: 'authentication',
                outcome: 'failure',
                details: { error: 'Biometric not registered', userId, type, deviceId }
            });
            return false;
        }

        try {
            const decryptedTemplate = securityManager.decrypt({
                encrypted: registeredBiometric.template,
                iv: '', // Would be stored separately
                tag: '', // Would be stored separately
                classification: 'CONFIDENTIAL'
            });

            // In production, use proper biometric matching algorithms
            const similarity = this.calculateBiometricSimilarity(template, decryptedTemplate);
            const isMatch = similarity >= 0.85; // 85% similarity threshold

            if (isMatch) {
                // Update session biometric status
                const sessions = Array.from(this.sessions.values())
                    .filter(s => s.userId === userId && s.isActive);

                sessions.forEach(session => {
                    session.biometricVerified = true;
                });

                securityManager.logAuditEvent({
                    action: 'biometric_verification',
                    resource: 'authentication',
                    outcome: 'success',
                    details: {
                        userId,
                        type,
                        deviceId,
                        similarity,
                        confidence: registeredBiometric.confidence
                    }
                });
            } else {
                securityManager.logAuditEvent({
                    action: 'biometric_verification',
                    resource: 'authentication',
                    outcome: 'failure',
                    details: {
                        userId,
                        type,
                        deviceId,
                        similarity,
                        threshold: 0.85
                    }
                });
            }

            return isMatch;
        } catch (error) {
            securityManager.logAuditEvent({
                action: 'biometric_verification',
                resource: 'authentication',
                outcome: 'failure',
                details: {
                    userId,
                    type,
                    deviceId,
                    error: error instanceof Error ? error.message : 'Unknown error'
                }
            });
            return false;
        }
    }

    // Session Management
    public async validateSession(sessionId: string): Promise<AuthUser | null> {
        const session = this.sessions.get(sessionId);

        if (!session || !session.isActive) {
            return null;
        }

        if (session.expiresAt < new Date()) {
            await this.invalidateSession(sessionId);
            return null;
        }

        // Get user details
        const user = await this.getUserById(session.userId);
        if (!user) {
            await this.invalidateSession(sessionId);
            return null;
        }

        return user;
    }

    // Dynamic Permission System
    private calculatePermissions(roles: string[], clearanceLevel: string): string[] {
        const permissions = new Set<string>();

        // Base permissions for all users
        permissions.add('read:profile');
        permissions.add('update:profile');

        // Role-based permissions
        roles.forEach(role => {
            switch (role) {
                case 'admin':
                    permissions.add('admin:*');
                    break;
                case 'healthcare_provider':
                    permissions.add('read:patient_data');
                    permissions.add('write:patient_data');
                    permissions.add('access:medical_ai');
                    break;
                case 'defense_analyst':
                    permissions.add('read:classified_data');
                    permissions.add('access:defense_ai');
                    permissions.add('analyze:threat_data');
                    break;
                case 'legal_counsel':
                    permissions.add('read:legal_documents');
                    permissions.add('access:legal_ai');
                    permissions.add('draft:contracts');
                    break;
                case 'researcher':
                    permissions.add('access:research_data');
                    permissions.add('run:simulations');
                    permissions.add('access:spectra');
                    break;
            }
        });

        // Clearance-based permissions
        switch (clearanceLevel) {
            case 'TOP_SECRET':
                permissions.add('access:top_secret');
            // fall through
            case 'SECRET':
                permissions.add('access:secret');
            // fall through
            case 'CONFIDENTIAL':
                permissions.add('access:confidential');
            // fall through
            case 'INTERNAL':
                permissions.add('access:internal');
                break;
        }

        return Array.from(permissions);
    }

    // Helper methods
    private async sendSMSChallenge(userId: string, challengeId: string): Promise<void> {
        // Implementation would send SMS via service like Twilio
        console.log(`SMS challenge sent to user ${userId}: ${challengeId}`);
    }

    private async sendEmailChallenge(userId: string, challengeId: string): Promise<void> {
        // Implementation would send email via service like SendGrid
        console.log(`Email challenge sent to user ${userId}: ${challengeId}`);
    }

    private async sendPushChallenge(userId: string, challengeId: string): Promise<void> {
        // Implementation would send push notification
        console.log(`Push challenge sent to user ${userId}: ${challengeId}`);
    }

    private async verifyTOTP(userId: string, code: string): Promise<boolean> {
        // Implementation would verify TOTP code using secret key
        return code.length === 6 && /^\d{6}$/.test(code);
    }

    private async verifyOTPCode(challengeId: string, code: string): Promise<boolean> {
        // Implementation would verify OTP code against stored value
        return code.length === 6 && /^\d{6}$/.test(code);
    }

    private calculateBiometricSimilarity(template1: string, template2: string): number {
        // Placeholder - in production, use proper biometric matching
        return template1 === template2 ? 1.0 : 0.8;
    }

    private async getUserById(userId: string): Promise<AuthUser | null> {
        // Implementation would fetch user from database
        return null; // Placeholder
    }

    private async invalidateSession(sessionId: string): Promise<void> {
        const session = this.sessions.get(sessionId);
        if (session) {
            session.isActive = false;
            securityManager.logAuditEvent({
                action: 'session_invalidated',
                resource: 'authentication',
                outcome: 'success',
                details: {
                    sessionId,
                    userId: session.userId
                }
            });
        }
    }

    // Security metrics
    public getSecurityMetrics(): {
        activeSessions: number;
        mfaAdoption: number;
        biometricAdoption: number;
        averageSessionDuration: number;
        securityIncidents: number;
    } {
        const activeSessions = Array.from(this.sessions.values())
            .filter(s => s.isActive).length;

        const totalUsers = new Set(Array.from(this.sessions.values()).map(s => s.userId)).size;
        const mfaUsers = Array.from(this.sessions.values())
            .filter(s => s.mfaVerified).length;
        const biometricUsers = this.biometricData.size;

        return {
            activeSessions,
            mfaAdoption: totalUsers > 0 ? (mfaUsers / totalUsers) * 100 : 0,
            biometricAdoption: totalUsers > 0 ? (biometricUsers / totalUsers) * 100 : 0,
            averageSessionDuration: 8 * 60 * 60 * 1000, // 8 hours in ms
            securityIncidents: 0 // Would be calculated from audit logs
        };
    }
}

// Export singleton
export const enhancedAuthSystem = new EnhancedAuthSystem();

// Middleware for request authentication
export async function authenticateRequest(request: NextRequest): Promise<AuthUser | null> {
    const authHeader = request.headers.get('authorization');
    const sessionCookie = request.cookies.get('session_id');

    if (authHeader?.startsWith('Bearer ')) {
        // JWT token authentication
        const token = authHeader.slice(7);
        // Implement JWT validation
        return null;
    }

    if (sessionCookie) {
        // Session-based authentication
        return await enhancedAuthSystem.validateSession(sessionCookie.value);
    }

    return null;
}

// Permission check utility
export function checkPermission(user: AuthUser, permission: string): boolean {
    return user.permissions.includes(permission) || user.permissions.includes('admin:*');
}

// Clearance level check
export function checkClearanceLevel(user: AuthUser, requiredLevel: string): boolean {
    const levels = ['PUBLIC', 'INTERNAL', 'CONFIDENTIAL', 'SECRET', 'TOP_SECRET'];
    const userLevel = levels.indexOf(user.clearanceLevel);
    const requiredLevelIndex = levels.indexOf(requiredLevel);

    return userLevel >= requiredLevelIndex;
} 