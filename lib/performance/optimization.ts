/**
 * Performance Optimization Utilities
 * Provides code splitting, lazy loading, and bundle optimization tools
 */

import { ComponentType, lazy, LazyExoticComponent } from 'react';

// Enhanced lazy loading with error boundaries
interface LazyComponentOptions {
    fallback?: ComponentType;
    chunkName?: string;
    retryCount?: number;
    timeout?: number;
}

export function createLazyComponent<T extends ComponentType<any>>(
    importFn: () => Promise<{ default: T }>,
    options: LazyComponentOptions = {}
): LazyExoticComponent<T> {
    const {
        retryCount = 3,
        timeout = 10000
    } = options;

    let retries = 0;

    const wrappedImportFn = async (): Promise<{ default: T }> => {
        try {
            const timeoutPromise = new Promise<never>((_, reject) => {
                setTimeout(() => reject(new Error('Import timeout')), timeout);
            });

            const module = await Promise.race([importFn(), timeoutPromise]);
            retries = 0; // Reset on success
            return module;
        } catch (error) {
            if (retries < retryCount) {
                retries++;
                console.warn(`Retrying component import (${retries}/${retryCount}):`, error);
                // Wait before retry with exponential backoff
                await new Promise(resolve => setTimeout(resolve, Math.pow(2, retries) * 1000));
                return wrappedImportFn();
            }
            throw error;
        }
    };

    return lazy(wrappedImportFn);
}

// Preload utilities for better UX
const preloadedComponents = new Set<string>();

export function preloadComponent(
    importFn: () => Promise<any>,
    componentName: string
): void {
    if (preloadedComponents.has(componentName)) {
        return;
    }

    preloadedComponents.add(componentName);

    // Preload on idle or after a delay
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
        window.requestIdleCallback(() => {
            importFn().catch(console.warn);
        });
    } else {
        setTimeout(() => {
            importFn().catch(console.warn);
        }, 2000);
    }
}

// Bundle size monitoring
export const bundleAnalyzer = {
    trackImport: (componentName: string, startTime: number = performance.now()) => {
        return {
            end: () => {
                const loadTime = performance.now() - startTime;
                console.debug(`Component ${componentName} loaded in ${loadTime.toFixed(2)}ms`);

                // In production, send to analytics
                if (typeof window !== 'undefined' && (window as any).gtag) {
                    (window as any).gtag('event', 'component_load', {
                        component_name: componentName,
                        load_time: loadTime
                    });
                }
            }
        };
    },

    measureBundleSize: async (importFn: () => Promise<any>, name: string) => {
        const startTime = performance.now();
        const startMemory = (performance as any).memory?.usedJSHeapSize;

        try {
            await importFn();
            const endTime = performance.now();
            const endMemory = (performance as any).memory?.usedJSHeapSize;

            const metrics = {
                loadTime: endTime - startTime,
                memoryDelta: endMemory ? endMemory - startMemory : undefined,
                component: name
            };

            console.debug('Bundle metrics:', metrics);
            return metrics;
        } catch (error) {
            console.error(`Failed to load bundle ${name}:`, error);
            throw error;
        }
    }
};

// Image optimization utilities
export interface OptimizedImageProps {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    className?: string;
    priority?: boolean;
    placeholder?: 'blur' | 'empty';
    blurDataURL?: string;
}

export function createOptimizedImage({
    src,
    alt,
    width,
    height,
    className = '',
    priority = false,
    placeholder = 'empty'
}: OptimizedImageProps) {
    // Generate blur placeholder for better UX
    const blurDataURL = placeholder === 'blur'
        ? `data:image/svg+xml;base64,${Buffer.from(
            `<svg width="${width || 400}" height="${height || 300}" xmlns="http://www.w3.org/2000/svg">
              <rect width="100%" height="100%" fill="#1e293b"/>
            </svg>`
        ).toString('base64')}`
        : undefined;

    return {
        src,
        alt,
        width,
        height,
        className,
        priority,
        placeholder,
        blurDataURL,
        loading: priority ? 'eager' as const : 'lazy' as const,
        decoding: 'async' as const
    };
}

// Resource hints for better performance
export const resourceHints = {
    preloadFont: (fontUrl: string) => {
        if (typeof document !== 'undefined') {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = fontUrl;
            link.as = 'font';
            link.type = 'font/woff2';
            link.crossOrigin = 'anonymous';
            document.head.appendChild(link);
        }
    },

    preloadCriticalCSS: (cssUrl: string) => {
        if (typeof document !== 'undefined') {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = cssUrl;
            link.as = 'style';
            document.head.appendChild(link);
        }
    },

    prefetchPage: (pageUrl: string) => {
        if (typeof document !== 'undefined') {
            const link = document.createElement('link');
            link.rel = 'prefetch';
            link.href = pageUrl;
            document.head.appendChild(link);
        }
    }
};

// Performance monitoring
export class PerformanceMonitor {
    private static instance: PerformanceMonitor;
    private metrics: Map<string, number[]> = new Map();

    static getInstance(): PerformanceMonitor {
        if (!PerformanceMonitor.instance) {
            PerformanceMonitor.instance = new PerformanceMonitor();
        }
        return PerformanceMonitor.instance;
    }

    mark(name: string): void {
        if (typeof performance !== 'undefined') {
            performance.mark(name);
        }
    }

    measure(name: string, startMark: string, endMark?: string): number | null {
        if (typeof performance === 'undefined') return null;

        try {
            const endMarkName = endMark || `${startMark}-end`;
            this.mark(endMarkName);

            performance.measure(name, startMark, endMarkName);
            const measure = performance.getEntriesByName(name, 'measure')[0];

            if (measure) {
                const duration = measure.duration;

                // Store metric
                if (!this.metrics.has(name)) {
                    this.metrics.set(name, []);
                }
                this.metrics.get(name)!.push(duration);

                return duration;
            }
        } catch (error) {
            console.warn('Performance measurement failed:', error);
        }

        return null;
    }

    getMetrics(name: string): { avg: number; min: number; max: number; count: number } | null {
        const measurements = this.metrics.get(name);
        if (!measurements || measurements.length === 0) return null;

        return {
            avg: measurements.reduce((a, b) => a + b) / measurements.length,
            min: Math.min(...measurements),
            max: Math.max(...measurements),
            count: measurements.length
        };
    }

    clearMetrics(name?: string): void {
        if (name) {
            this.metrics.delete(name);
        } else {
            this.metrics.clear();
        }
    }

    getAllMetrics(): Record<string, ReturnType<PerformanceMonitor['getMetrics']>> {
        const result: Record<string, ReturnType<PerformanceMonitor['getMetrics']>> = {};

        for (const [name] of this.metrics) {
            result[name] = this.getMetrics(name);
        }

        return result;
    }
}

// Utility for critical resource loading
export async function loadCriticalResources(resources: string[]): Promise<void> {
    const loadPromises = resources.map(async (resource) => {
        try {
            if (resource.endsWith('.js')) {
                await import(resource);
            } else if (resource.endsWith('.css')) {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = resource;
                document.head.appendChild(link);

                return new Promise((resolve, reject) => {
                    link.onload = resolve;
                    link.onerror = reject;
                });
            }
        } catch (error) {
            console.warn(`Failed to load critical resource ${resource}:`, error);
        }
    });

    await Promise.allSettled(loadPromises);
}

// Utility functions for easy integration
export function trackTiming<T>(
    operation: () => Promise<T> | T,
    label: string
): Promise<T> {
    const monitor = PerformanceMonitor.getInstance();
    monitor.mark(`${label}-start`);

    try {
        const result = operation();

        if (result instanceof Promise) {
            return result.finally(() => {
                monitor.measure(label, `${label}-start`);
            });
        } else {
            monitor.measure(label, `${label}-start`);
            return Promise.resolve(result);
        }
    } catch (error) {
        monitor.measure(label, `${label}-start`);
        throw error;
    }
}

// Export performance monitor instance
export const performanceMonitor = PerformanceMonitor.getInstance(); 