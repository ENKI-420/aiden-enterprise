/**
 * Enhanced API Middleware Layer
 * Provides centralized error handling, validation, rate limiting, and security
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Rate limiting store (in production, use Redis)
const rateLimit = new Map<string, { count: number; resetTime: number }>();

export interface ApiHandlerConfig {
    methods: string[];
    requireAuth?: boolean;
    rateLimit?: {
        requests: number;
        windowMs: number;
    };
    validation?: {
        body?: z.ZodSchema;
        query?: z.ZodSchema;
        params?: z.ZodSchema;
    };
    cors?: {
        origins: string[];
        methods: string[];
    };
}

export interface ApiContext {
    req: NextRequest;
    user?: any;
    body?: any;
    query?: any;
    params?: any;
}

export type ApiHandler = (context: ApiContext) => Promise<NextResponse | any>;

// Security headers
const securityHeaders = {
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
};

// CORS headers
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
};

export function withApiMiddleware(config: ApiHandlerConfig, handler: ApiHandler) {
    return async (request: NextRequest) => {
        try {
            // Security and CORS headers
            const headers = { ...securityHeaders };
            if (config.cors) {
                Object.assign(headers, corsHeaders);
            }

            // Handle CORS preflight
            if (request.method === 'OPTIONS') {
                return new NextResponse(null, { status: 200, headers });
            }

            // Method validation
            if (!config.methods.includes(request.method || '')) {
                return NextResponse.json(
                    { error: 'Method not allowed', code: 'METHOD_NOT_ALLOWED' },
                    { status: 405, headers }
                );
            }

            // Rate limiting
            if (config.rateLimit) {
                const clientId = getClientId(request);
                const rateLimitResult = checkRateLimit(clientId, config.rateLimit);

                if (!rateLimitResult.allowed) {
                    return NextResponse.json(
                        {
                            error: 'Rate limit exceeded',
                            code: 'RATE_LIMIT_EXCEEDED',
                            retryAfter: rateLimitResult.retryAfter
                        },
                        {
                            status: 429,
                            headers: {
                                ...headers,
                                'Retry-After': rateLimitResult.retryAfter.toString(),
                                'X-RateLimit-Limit': config.rateLimit.requests.toString(),
                                'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
                                'X-RateLimit-Reset': rateLimitResult.resetTime.toString()
                            }
                        }
                    );
                }
            }

            // Authentication
            let user = null;
            if (config.requireAuth) {
                user = await validateAuth(request);
                if (!user) {
                    return NextResponse.json(
                        { error: 'Authentication required', code: 'AUTH_REQUIRED' },
                        { status: 401, headers }
                    );
                }
            }

            // Parse and validate request data
            const context: ApiContext = { req: request, user };

            // Body validation
            if (config.validation?.body && ['POST', 'PUT', 'PATCH'].includes(request.method || '')) {
                try {
                    const body = await request.json();
                    context.body = config.validation.body.parse(body);
                } catch (error) {
                    return NextResponse.json(
                        {
                            error: 'Invalid request body',
                            code: 'VALIDATION_ERROR',
                            details: error instanceof z.ZodError ? error.errors : error
                        },
                        { status: 400, headers }
                    );
                }
            }

            // Query validation
            if (config.validation?.query) {
                try {
                    const url = new URL(request.url);
                    const query = Object.fromEntries(url.searchParams.entries());
                    context.query = config.validation.query.parse(query);
                } catch (error) {
                    return NextResponse.json(
                        {
                            error: 'Invalid query parameters',
                            code: 'VALIDATION_ERROR',
                            details: error instanceof z.ZodError ? error.errors : error
                        },
                        { status: 400, headers }
                    );
                }
            }

            // Execute handler
            const result = await handler(context);

            // Return response with security headers
            if (result instanceof NextResponse) {
                // Add headers to existing response
                Object.entries(headers).forEach(([key, value]) => {
                    result.headers.set(key, value);
                });
                return result;
            }

            // Wrap result in NextResponse
            return NextResponse.json(result, { headers });

        } catch (error) {
            console.error('API Middleware Error:', error);

            // Handle different error types
            if (error instanceof z.ZodError) {
                return NextResponse.json(
                    {
                        error: 'Validation error',
                        code: 'VALIDATION_ERROR',
                        details: error.errors
                    },
                    { status: 400, headers: securityHeaders }
                );
            }

            if (error instanceof Error && error.message.includes('Authentication')) {
                return NextResponse.json(
                    { error: 'Authentication failed', code: 'AUTH_FAILED' },
                    { status: 401, headers: securityHeaders }
                );
            }

            // Generic error response
            return NextResponse.json(
                {
                    error: 'Internal server error',
                    code: 'INTERNAL_ERROR',
                    requestId: generateRequestId()
                },
                { status: 500, headers: securityHeaders }
            );
        }
    };
}

// Helper functions
function getClientId(request: NextRequest): string {
    // In production, use proper IP extraction with proxy headers
    const forwarded = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const ip = forwarded?.split(',')[0] || realIp || 'unknown';

    // Include user agent for better rate limiting
    const userAgent = request.headers.get('user-agent') || '';
    return `${ip}:${userAgent.slice(0, 50)}`;
}

function checkRateLimit(clientId: string, config: { requests: number; windowMs: number }) {
    const now = Date.now();
    const windowStart = now - config.windowMs;

    let clientData = rateLimit.get(clientId);

    // Clean up old entries
    if (!clientData || clientData.resetTime < windowStart) {
        clientData = { count: 0, resetTime: now + config.windowMs };
        rateLimit.set(clientId, clientData);
    }

    clientData.count++;

    return {
        allowed: clientData.count <= config.requests,
        remaining: Math.max(0, config.requests - clientData.count),
        retryAfter: Math.ceil((clientData.resetTime - now) / 1000),
        resetTime: clientData.resetTime
    };
}

async function validateAuth(request: NextRequest): Promise<any | null> {
    const authHeader = request.headers.get('authorization');

    if (!authHeader?.startsWith('Bearer ')) {
        return null;
    }

    const token = authHeader.slice(7);

    try {
        // In production, validate JWT token
        // For now, return mock user
        if (token === 'valid-token') {
            return {
                id: 'user-123',
                email: 'user@example.com',
                role: 'user',
                permissions: ['read', 'write']
            };
        }

        return null;
    } catch {
        return null;
    }
}

function generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

// Cleanup old rate limit entries periodically
setInterval(() => {
    const now = Date.now();
    for (const [clientId, data] of rateLimit.entries()) {
        if (data.resetTime < now - 60000) { // Clean up entries older than 1 minute
            rateLimit.delete(clientId);
        }
    }
}, 60000); // Run every minute 