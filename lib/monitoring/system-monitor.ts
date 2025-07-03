/**
 * System Monitoring Utilities
 * Provides comprehensive performance tracking, error monitoring, and operational insights
 */

// System metrics interface
export interface SystemMetrics {
    timestamp: Date;
    performance: {
        responseTime: number;
        throughput: number;
        errorRate: number;
        cpuUsage?: number;
        memoryUsage?: number;
    };
    application: {
        activeUsers: number;
        requestsPerMinute: number;
        failedRequests: number;
        successfulRequests: number;
    };
    business: {
        totalRevenue?: number;
        conversionRate?: number;
        userEngagement?: number;
        featureUsage: Record<string, number>;
    };
}

// Error tracking interface
export interface ErrorEvent {
    id: string;
    timestamp: Date;
    level: 'error' | 'warning' | 'critical';
    message: string;
    stack?: string;
    context: {
        userId?: string;
        url: string;
        userAgent: string;
        component?: string;
        action?: string;
    };
    metadata: Record<string, any>;
    resolved: boolean;
    fingerprint: string;
}

// Performance monitoring
export class PerformanceTracker {
    private static instance: PerformanceTracker;
    private metrics: SystemMetrics[] = [];
    private errors: ErrorEvent[] = [];
    private performanceMarks: Map<string, number> = new Map();
    private readonly maxMetricsHistory = 1000;

    static getInstance(): PerformanceTracker {
        if (!PerformanceTracker.instance) {
            PerformanceTracker.instance = new PerformanceTracker();
        }
        return PerformanceTracker.instance;
    }

    // Track performance metrics
    recordMetrics(metrics: Partial<SystemMetrics>): void {
        const fullMetrics: SystemMetrics = {
            timestamp: new Date(),
            performance: {
                responseTime: 0,
                throughput: 0,
                errorRate: 0,
                ...metrics.performance
            },
            application: {
                activeUsers: 0,
                requestsPerMinute: 0,
                failedRequests: 0,
                successfulRequests: 0,
                ...metrics.application
            },
            business: {
                featureUsage: {},
                ...metrics.business
            }
        };

        this.metrics.push(fullMetrics);

        // Maintain sliding window
        if (this.metrics.length > this.maxMetricsHistory) {
            this.metrics.shift();
        }

        // Alert on critical thresholds
        this.checkThresholds(fullMetrics);
    }

    // Error tracking
    trackError(error: Error | string, context: Partial<ErrorEvent['context']> = {}): void {
        const errorMessage = typeof error === 'string' ? error : error.message;
        const stack = typeof error === 'object' ? error.stack : undefined;

        const errorEvent: ErrorEvent = {
            id: this.generateId(),
            timestamp: new Date(),
            level: this.determineErrorLevel(errorMessage),
            message: errorMessage,
            stack,
            context: {
                url: typeof window !== 'undefined' ? window.location.href : '',
                userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
                ...context
            },
            metadata: {
                browserInfo: this.getBrowserInfo(),
                screenResolution: this.getScreenInfo(),
                networkInfo: this.getNetworkInfo()
            },
            resolved: false,
            fingerprint: this.generateFingerprint(errorMessage, stack || '')
        };

        this.errors.push(errorEvent);

        // Log to console in development
        if (process.env.NODE_ENV === 'development') {
            console.error('Error tracked:', errorEvent);
        }

        // Send to external monitoring service in production
        if (process.env.NODE_ENV === 'production') {
            this.sendToMonitoringService(errorEvent);
        }
    }

    // Performance timing utilities
    startTiming(label: string): void {
        this.performanceMarks.set(label, performance.now());
    }

    endTiming(label: string): number | null {
        const startTime = this.performanceMarks.get(label);
        if (!startTime) return null;

        const duration = performance.now() - startTime;
        this.performanceMarks.delete(label);

        // Record as metric
        this.recordMetrics({
            performance: {
                responseTime: duration,
                throughput: 1,
                errorRate: 0
            }
        });

        return duration;
    }

    // Feature usage tracking
    trackFeatureUsage(feature: string, metadata: Record<string, any> = {}): void {
        const currentMetrics = this.getLatestMetrics();
        const featureUsage = { ...currentMetrics?.business.featureUsage };
        featureUsage[feature] = (featureUsage[feature] || 0) + 1;

        this.recordMetrics({
            business: {
                featureUsage,
                ...metadata
            }
        });
    }

    // Get analytics
    getAnalytics(timeframe: 'hour' | 'day' | 'week' = 'hour'): {
        performance: {
            avgResponseTime: number;
            totalRequests: number;
            errorRate: number;
            throughput: number;
        };
        errors: {
            total: number;
            byLevel: Record<string, number>;
            topErrors: Array<{ message: string; count: number; }>;
            resolved: number;
        };
        trends: {
            responseTimeTrend: number[];
            errorRateTrend: number[];
            throughputTrend: number[];
        };
        features: {
            mostUsed: Array<{ feature: string; usage: number; }>;
            leastUsed: Array<{ feature: string; usage: number; }>;
        };
    } {
        const timeframeDuration = {
            hour: 60 * 60 * 1000,
            day: 24 * 60 * 60 * 1000,
            week: 7 * 24 * 60 * 60 * 1000
        };

        const cutoff = new Date(Date.now() - timeframeDuration[timeframe]);
        const recentMetrics = this.metrics.filter(m => m.timestamp >= cutoff);
        const recentErrors = this.errors.filter(e => e.timestamp >= cutoff);

        // Performance analytics
        const avgResponseTime = recentMetrics.length > 0
            ? recentMetrics.reduce((sum, m) => sum + m.performance.responseTime, 0) / recentMetrics.length
            : 0;

        const totalRequests = recentMetrics.reduce(
            (sum, m) => sum + m.application.successfulRequests + m.application.failedRequests, 0
        );

        const totalErrors = recentMetrics.reduce((sum, m) => sum + m.application.failedRequests, 0);
        const errorRate = totalRequests > 0 ? totalErrors / totalRequests : 0;

        const throughput = recentMetrics.length > 0
            ? recentMetrics.reduce((sum, m) => sum + m.performance.throughput, 0) / recentMetrics.length
            : 0;

        // Error analytics
        const errorsByLevel = recentErrors.reduce((acc, error) => {
            acc[error.level] = (acc[error.level] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const errorCounts = recentErrors.reduce((acc, error) => {
            acc[error.message] = (acc[error.message] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const topErrors = Object.entries(errorCounts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 10)
            .map(([message, count]) => ({ message, count }));

        // Trends (simplified moving averages)
        const responseTimeTrend = this.calculateTrend(recentMetrics, 'performance.responseTime');
        const errorRateTrend = this.calculateErrorRateTrend(recentMetrics);
        const throughputTrend = this.calculateTrend(recentMetrics, 'performance.throughput');

        // Feature usage analytics
        const allFeatureUsage = recentMetrics.reduce((acc, m) => {
            Object.entries(m.business.featureUsage).forEach(([feature, usage]) => {
                acc[feature] = (acc[feature] || 0) + usage;
            });
            return acc;
        }, {} as Record<string, number>);

        const sortedFeatures = Object.entries(allFeatureUsage)
            .sort(([, a], [, b]) => b - a)
            .map(([feature, usage]) => ({ feature, usage }));

        return {
            performance: {
                avgResponseTime,
                totalRequests,
                errorRate,
                throughput
            },
            errors: {
                total: recentErrors.length,
                byLevel: errorsByLevel,
                topErrors,
                resolved: recentErrors.filter(e => e.resolved).length
            },
            trends: {
                responseTimeTrend,
                errorRateTrend,
                throughputTrend
            },
            features: {
                mostUsed: sortedFeatures.slice(0, 10),
                leastUsed: sortedFeatures.slice(-10).reverse()
            }
        };
    }

    // Health check
    getHealthStatus(): {
        status: 'healthy' | 'degraded' | 'unhealthy';
        checks: Array<{
            name: string;
            status: 'pass' | 'warn' | 'fail';
            message: string;
            responseTime?: number;
        }>;
        uptime: number;
        lastUpdated: Date;
    } {
        const checks = [];
        const latest = this.getLatestMetrics();

        // Response time check
        const responseTimeStatus = !latest || latest.performance.responseTime < 1000 ? 'pass'
            : latest.performance.responseTime < 3000 ? 'warn' : 'fail';

        checks.push({
            name: 'Response Time',
            status: responseTimeStatus,
            message: `Average response time: ${latest?.performance.responseTime.toFixed(2)}ms`,
            responseTime: latest?.performance.responseTime
        });

        // Error rate check
        const errorRateStatus = !latest || latest.performance.errorRate < 0.01 ? 'pass'
            : latest.performance.errorRate < 0.05 ? 'warn' : 'fail';

        checks.push({
            name: 'Error Rate',
            status: errorRateStatus,
            message: `Error rate: ${((latest?.performance.errorRate || 0) * 100).toFixed(2)}%`
        });

        // Memory usage check (if available)
        if (latest?.performance.memoryUsage) {
            const memoryStatus = latest.performance.memoryUsage < 0.8 ? 'pass'
                : latest.performance.memoryUsage < 0.9 ? 'warn' : 'fail';

            checks.push({
                name: 'Memory Usage',
                status: memoryStatus,
                message: `Memory usage: ${(latest.performance.memoryUsage * 100).toFixed(1)}%`
            });
        }

        // Overall status
        const failCount = checks.filter(c => c.status === 'fail').length;
        const warnCount = checks.filter(c => c.status === 'warn').length;

        let overallStatus: 'healthy' | 'degraded' | 'unhealthy';
        if (failCount > 0) overallStatus = 'unhealthy';
        else if (warnCount > 0) overallStatus = 'degraded';
        else overallStatus = 'healthy';

        return {
            status: overallStatus,
            checks,
            uptime: performance.now(),
            lastUpdated: new Date()
        };
    }

    // Helper methods
    private checkThresholds(metrics: SystemMetrics): void {
        const thresholds = {
            responseTime: 3000, // 3 seconds
            errorRate: 0.05,    // 5%
            memoryUsage: 0.9    // 90%
        };

        if (metrics.performance.responseTime > thresholds.responseTime) {
            this.trackError(`High response time: ${metrics.performance.responseTime}ms`, {
                component: 'performance-monitor'
            });
        }

        if (metrics.performance.errorRate > thresholds.errorRate) {
            this.trackError(`High error rate: ${(metrics.performance.errorRate * 100).toFixed(2)}%`, {
                component: 'performance-monitor'
            });
        }
    }

    private determineErrorLevel(message: string): 'error' | 'warning' | 'critical' {
        if (message.toLowerCase().includes('critical') ||
            message.toLowerCase().includes('fatal') ||
            message.toLowerCase().includes('security')) {
            return 'critical';
        }

        if (message.toLowerCase().includes('warn') ||
            message.toLowerCase().includes('deprecated')) {
            return 'warning';
        }

        return 'error';
    }

    private generateFingerprint(message: string, stack: string): string {
        const content = `${message}${stack}`.replace(/\d+/g, 'N'); // Normalize line numbers
        let hash = 0;
        for (let i = 0; i < content.length; i++) {
            const char = content.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return hash.toString(36);
    }

    private generateId(): string {
        return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    private getBrowserInfo(): Record<string, any> {
        if (typeof navigator === 'undefined') return {};

        return {
            userAgent: navigator.userAgent,
            language: navigator.language,
            platform: navigator.platform,
            cookieEnabled: navigator.cookieEnabled,
            onLine: navigator.onLine
        };
    }

    private getScreenInfo(): Record<string, any> {
        if (typeof screen === 'undefined') return {};

        return {
            width: screen.width,
            height: screen.height,
            colorDepth: screen.colorDepth,
            pixelDepth: screen.pixelDepth
        };
    }

    private getNetworkInfo(): Record<string, any> {
        if (typeof navigator === 'undefined' || !('connection' in navigator)) return {};

        const connection = (navigator as any).connection;
        return {
            effectiveType: connection?.effectiveType,
            downlink: connection?.downlink,
            rtt: connection?.rtt
        };
    }

    private getLatestMetrics(): SystemMetrics | null {
        return this.metrics.length > 0 ? this.metrics[this.metrics.length - 1] : null;
    }

    private calculateTrend(metrics: SystemMetrics[], path: string): number[] {
        const values = metrics.map(m => {
            const keys = path.split('.');
            let value: any = m;
            for (const key of keys) {
                value = value?.[key];
            }
            return value || 0;
        });

        // Simple moving average
        const windowSize = Math.min(10, values.length);
        const trend: number[] = [];

        for (let i = windowSize - 1; i < values.length; i++) {
            const slice = values.slice(i - windowSize + 1, i + 1);
            const avg = slice.reduce((sum, val) => sum + val, 0) / slice.length;
            trend.push(avg);
        }

        return trend;
    }

    private calculateErrorRateTrend(metrics: SystemMetrics[]): number[] {
        return metrics.map(m => {
            const total = m.application.successfulRequests + m.application.failedRequests;
            return total > 0 ? m.application.failedRequests / total : 0;
        });
    }

    private async sendToMonitoringService(error: ErrorEvent): Promise<void> {
        // Placeholder for external monitoring service integration
        // Examples: Sentry, DataDog, New Relic, etc.
        console.info('Error sent to monitoring service:', error.id);
    }
}

// Export singleton instance
export const performanceTracker = PerformanceTracker.getInstance();

// Utility functions for easy integration
export function trackTiming<T>(
    operation: () => Promise<T> | T,
    label: string
): Promise<T> {
    performanceTracker.startTiming(label);

    try {
        const result = operation();

        if (result instanceof Promise) {
            return result.finally(() => {
                performanceTracker.endTiming(label);
            });
        } else {
            performanceTracker.endTiming(label);
            return Promise.resolve(result);
        }
    } catch (error) {
        performanceTracker.endTiming(label);
        performanceTracker.trackError(error as Error, { component: label });
        throw error;
    }
}

export function withErrorTracking<T extends (...args: any[]) => any>(
    fn: T,
    context?: Partial<ErrorEvent['context']>
): T {
    return ((...args: Parameters<T>) => {
        try {
            const result = fn(...args);

            if (result instanceof Promise) {
                return result.catch((error) => {
                    performanceTracker.trackError(error, context);
                    throw error;
                });
            }

            return result;
        } catch (error) {
            performanceTracker.trackError(error as Error, context);
            throw error;
        }
    }) as T;
} 