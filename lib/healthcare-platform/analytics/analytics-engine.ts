/**
 * Analytics Engine
 * Tracks ROI metrics, usage patterns, and generates insights
 */

import { EventEmitter } from 'events';
import {
    Agent,
    AnalyticsMetric,
    ROIMetrics,
    UsageMetrics
} from '../types';

export class AnalyticsEngine extends EventEmitter {
  private metrics: Map<string, AnalyticsMetric[]> = new Map();
  private roiBaseline: ROIMetrics;
  private usageHistory: UsageMetrics[] = [];

  constructor() {
    super();
    this.roiBaseline = this.initializeBaseline();
    this.startMetricsCollection();
  }

  private initializeBaseline(): ROIMetrics {
    return {
      timeSaved: 0,
      errorReduction: 0,
      patientSatisfaction: 7.5,
      clinicianSatisfaction: 7.0,
      costSavings: 0,
      efficiencyGain: 0,
      complianceScore: 85
    };
  }

  // Start periodic metrics collection
  private startMetricsCollection() {
    // Collect metrics every minute
    setInterval(() => {
      this.collectUsageMetrics();
    }, 60000);

    // Calculate ROI every hour
    setInterval(() => {
      this.calculateROI();
    }, 3600000);
  }

  // Record a metric
  public recordMetric(metric: AnalyticsMetric): void {
    const metricType = metric.type;

    if (!this.metrics.has(metricType)) {
      this.metrics.set(metricType, []);
    }

    this.metrics.get(metricType)!.push(metric);

    // Emit for real-time dashboards
    this.emit('metric:recorded', { metric });

    // Trigger aggregation if needed
    if (this.metrics.get(metricType)!.length >= 100) {
      this.aggregateMetrics(metricType);
    }
  }

  // Track agent performance
  public trackAgentPerformance(agent: Agent): void {
    const metrics = agent.metrics;

    // Record agent-specific metrics
    this.recordMetric({
      id: `agent-perf-${Date.now()}`,
      name: `${agent.role}_response_time`,
      type: 'gauge',
      value: metrics.averageResponseTime,
      timestamp: new Date(),
      tags: {
        agentId: agent.id,
        role: agent.role
      },
      unit: 'ms'
    });

    this.recordMetric({
      id: `agent-success-${Date.now()}`,
      name: `${agent.role}_success_rate`,
      type: 'gauge',
      value: metrics.successRate,
      timestamp: new Date(),
      tags: {
        agentId: agent.id,
        role: agent.role
      },
      unit: 'percentage'
    });

    // Calculate efficiency improvements
    this.calculateAgentROI(agent);
  }

  // Calculate agent-specific ROI
  private calculateAgentROI(agent: Agent): void {
    const metrics = agent.metrics;

    // Estimate time saved based on automation
    const avgManualTime = this.getManualProcessTime(agent.role);
    const avgAutomatedTime = metrics.averageResponseTime / 1000; // Convert to seconds
    const timeSavedPerRequest = Math.max(0, avgManualTime - avgAutomatedTime);
    const totalTimeSaved = timeSavedPerRequest * metrics.requestsHandled / 3600; // Hours

    // Update ROI metrics
    this.updateROIMetric('timeSaved', totalTimeSaved);

    // Calculate error reduction
    const baselineErrorRate = 5; // 5% baseline human error rate
    const errorReduction = Math.max(0, baselineErrorRate - (100 - metrics.successRate));
    this.updateROIMetric('errorReduction', errorReduction);
  }

  // Get manual process time estimates
  private getManualProcessTime(role: string): number {
    const manualTimes: Record<string, number> = {
      'radiology': 900, // 15 minutes
      'oncology': 1800, // 30 minutes
      'clinical-trial': 2400, // 40 minutes
      'admin': 600, // 10 minutes
      'nursing': 480, // 8 minutes
      'pharmacy': 720, // 12 minutes
      'research': 3600 // 60 minutes
    };

    return manualTimes[role] || 600;
  }

  // Update ROI metric
  private updateROIMetric(metric: keyof ROIMetrics, value: number): void {
    const current = this.getCurrentROI();
    current[metric] = (current[metric] + value) / 2; // Running average

    this.recordMetric({
      id: `roi-${metric}-${Date.now()}`,
      name: `roi_${metric}`,
      type: 'gauge',
      value: current[metric],
      timestamp: new Date(),
      tags: { metric }
    });
  }

  // Collect usage metrics
  private collectUsageMetrics(): void {
    // In production, query actual system metrics
    const usage: UsageMetrics = {
      activeUsers: this.getActiveUserCount(),
      totalQueries: this.getTotalQueries(),
      averageResponseTime: this.getAverageResponseTime(),
      peakConcurrentUsers: this.getPeakConcurrentUsers(),
      featureUsage: this.getFeatureUsage(),
      errorRate: this.getErrorRate(),
      uptime: this.getUptime()
    };

    this.usageHistory.push(usage);

    // Keep only last 24 hours of history
    const dayAgo = Date.now() - 24 * 60 * 60 * 1000;
    this.usageHistory = this.usageHistory.filter(u =>
      new Date().getTime() - dayAgo < 24 * 60 * 60 * 1000
    );

    this.emit('usage:collected', { usage });
  }

  // Calculate comprehensive ROI
  private calculateROI(): void {
    const roi = this.getCurrentROI();

    // Calculate cost savings
    const hourlyRate = 75; // Average healthcare worker hourly rate
    roi.costSavings = roi.timeSaved * hourlyRate;

    // Calculate efficiency gain
    const usage = this.getCurrentUsage();
    roi.efficiencyGain = (usage.totalQueries * roi.timeSaved) /
      (usage.activeUsers * 8); // Assuming 8-hour workday

    // Update satisfaction scores based on usage patterns
    if (usage.errorRate < 1) {
      roi.clinicianSatisfaction = Math.min(10, roi.clinicianSatisfaction + 0.1);
    }

    // Emit ROI update
    this.emit('roi:calculated', { roi });

    // Generate insights
    const insights = this.generateROIInsights(roi);
    this.emit('insights:generated', { insights });
  }

  // Generate ROI insights
  private generateROIInsights(roi: ROIMetrics): string[] {
    const insights: string[] = [];

    if (roi.timeSaved > 100) {
      insights.push(`Platform has saved ${Math.round(roi.timeSaved)} hours this month`);
    }

    if (roi.errorReduction > 3) {
      insights.push(`Error rate reduced by ${roi.errorReduction.toFixed(1)}% compared to manual processes`);
    }

    if (roi.costSavings > 10000) {
      insights.push(`Estimated cost savings: $${Math.round(roi.costSavings).toLocaleString()}`);
    }

    if (roi.clinicianSatisfaction > 8) {
      insights.push('High clinician satisfaction indicates strong user adoption');
    }

    if (roi.complianceScore > 95) {
      insights.push('Excellent compliance score ensures regulatory adherence');
    }

    return insights;
  }

  // Get current ROI metrics
  public getCurrentROI(): ROIMetrics {
    const latestMetrics: ROIMetrics = { ...this.roiBaseline };

    // Aggregate latest values from metrics
    for (const [key, value] of Object.entries(latestMetrics)) {
      const metricHistory = this.metrics.get(`roi_${key}`);
      if (metricHistory && metricHistory.length > 0) {
        latestMetrics[key as keyof ROIMetrics] =
          metricHistory[metricHistory.length - 1].value;
      }
    }

    return latestMetrics;
  }

  // Get current usage metrics
  public getCurrentUsage(): UsageMetrics {
    return this.usageHistory.length > 0
      ? this.usageHistory[this.usageHistory.length - 1]
      : {
          activeUsers: 0,
          totalQueries: 0,
          averageResponseTime: 0,
          peakConcurrentUsers: 0,
          featureUsage: {},
          errorRate: 0,
          uptime: 100
        };
  }

  // Helper methods for metrics collection
  private getActiveUserCount(): number {
    // Mock implementation
    return Math.floor(Math.random() * 50) + 10;
  }

  private getTotalQueries(): number {
    const queryMetrics = this.metrics.get('counter');
    return queryMetrics?.filter(m => m.name.includes('query')).length || 0;
  }

  private getAverageResponseTime(): number {
    const responseMetrics = this.metrics.get('gauge');
    const responseTimes = responseMetrics?.filter(m =>
      m.name.includes('response_time')
    ) || [];

    if (responseTimes.length === 0) return 0;

    const sum = responseTimes.reduce((acc, m) => acc + m.value, 0);
    return sum / responseTimes.length;
  }

  private getPeakConcurrentUsers(): number {
    // Mock implementation
    return Math.floor(Math.random() * 100) + 20;
  }

  private getFeatureUsage(): Record<string, number> {
    return {
      'agent-queries': Math.floor(Math.random() * 1000),
      'rag-searches': Math.floor(Math.random() * 500),
      'compliance-checks': Math.floor(Math.random() * 200),
      'data-encryption': Math.floor(Math.random() * 1500),
      'workflow-executions': Math.floor(Math.random() * 100)
    };
  }

  private getErrorRate(): number {
    const errorMetrics = this.metrics.get('counter');
    const errors = errorMetrics?.filter(m => m.name.includes('error')).length || 0;
    const total = this.getTotalQueries();
    return total > 0 ? (errors / total) * 100 : 0;
  }

  private getUptime(): number {
    // Mock implementation - in production, calculate from actual downtime
    return 99.95;
  }

  // Aggregate metrics to reduce memory usage
  private aggregateMetrics(metricType: string): void {
    const metrics = this.metrics.get(metricType);
    if (!metrics || metrics.length < 100) return;

    // Keep only aggregated values for older metrics
    const oneHourAgo = Date.now() - 3600000;
    const recent = metrics.filter(m =>
      m.timestamp.getTime() > oneHourAgo
    );

    const older = metrics.filter(m =>
      m.timestamp.getTime() <= oneHourAgo
    );

    if (older.length > 0) {
      // Create aggregated metric
      const aggregated: AnalyticsMetric = {
        id: `agg-${metricType}-${Date.now()}`,
        name: `${metricType}_aggregated`,
        type: metricType as any,
        value: older.reduce((sum, m) => sum + m.value, 0) / older.length,
        timestamp: new Date(oneHourAgo),
        tags: { aggregated: 'true', count: older.length.toString() }
      };

      this.metrics.set(metricType, [aggregated, ...recent]);
    }
  }

  // Generate analytics report
  public generateReport(period: 'daily' | 'weekly' | 'monthly'): any {
    const roi = this.getCurrentROI();
    const usage = this.getCurrentUsage();
    const insights = this.generateROIInsights(roi);

    // Calculate period-specific metrics
    const periodHours = period === 'daily' ? 24 : period === 'weekly' ? 168 : 720;
    const periodMetrics = this.calculatePeriodMetrics(periodHours);

    return {
      period,
      generatedAt: new Date(),
      roi: {
        ...roi,
        projectedAnnualSavings: roi.costSavings * 365 / 30 // Assuming monthly calculation
      },
      usage: {
        ...usage,
        averageUsersPerDay: usage.activeUsers,
        totalQueriesInPeriod: periodMetrics.totalQueries
      },
      topFeatures: this.getTopFeatures(),
      agentPerformance: this.getAgentPerformanceSummary(),
      insights,
      recommendations: this.generateRecommendations(roi, usage)
    };
  }

  // Calculate period-specific metrics
  private calculatePeriodMetrics(hours: number): any {
    const periodStart = Date.now() - hours * 60 * 60 * 1000;
    const periodMetrics = Array.from(this.metrics.values())
      .flat()
      .filter(m => m.timestamp.getTime() > periodStart);

    return {
      totalQueries: periodMetrics.filter(m => m.name.includes('query')).length,
      averageResponseTime: this.getAverageResponseTime(),
      errorCount: periodMetrics.filter(m => m.name.includes('error')).length
    };
  }

  // Get top features by usage
  private getTopFeatures(): Array<{ feature: string; usage: number }> {
    const usage = this.getCurrentUsage();
    return Object.entries(usage.featureUsage)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([feature, usage]) => ({ feature, usage }));
  }

  // Get agent performance summary
  private getAgentPerformanceSummary(): any {
    const agentMetrics: any = {};

    // Aggregate by agent role
    const performanceMetrics = this.metrics.get('gauge') || [];

    for (const metric of performanceMetrics) {
      if (metric.tags?.role) {
        const role = metric.tags.role;
        if (!agentMetrics[role]) {
          agentMetrics[role] = {
            responseTime: [],
            successRate: []
          };
        }

        if (metric.name.includes('response_time')) {
          agentMetrics[role].responseTime.push(metric.value);
        }
        if (metric.name.includes('success_rate')) {
          agentMetrics[role].successRate.push(metric.value);
        }
      }
    }

    // Calculate averages
    const summary: any = {};
    for (const [role, metrics] of Object.entries(agentMetrics)) {
      const m = metrics as any;
      summary[role] = {
        avgResponseTime: m.responseTime.reduce((a: number, b: number) => a + b, 0) / m.responseTime.length || 0,
        avgSuccessRate: m.successRate.reduce((a: number, b: number) => a + b, 0) / m.successRate.length || 0
      };
    }

    return summary;
  }

  // Generate recommendations based on analytics
  private generateRecommendations(roi: ROIMetrics, usage: UsageMetrics): string[] {
    const recommendations: string[] = [];

    if (usage.errorRate > 2) {
      recommendations.push('Consider additional training for users to reduce error rate');
    }

    if (roi.efficiencyGain < 20) {
      recommendations.push('Explore automation opportunities in high-volume workflows');
    }

    if (usage.peakConcurrentUsers > usage.activeUsers * 2) {
      recommendations.push('Consider scaling infrastructure for peak usage periods');
    }

    if (roi.clinicianSatisfaction < 7) {
      recommendations.push('Gather user feedback to improve clinician experience');
    }

    const underutilized = Object.entries(usage.featureUsage)
      .filter(([_, usage]) => usage < 50)
      .map(([feature]) => feature);

    if (underutilized.length > 0) {
      recommendations.push(`Promote underutilized features: ${underutilized.join(', ')}`);
    }

    return recommendations;
  }

  // Export metrics for external analysis
  public exportMetrics(format: 'json' | 'csv' = 'json'): string {
    const allMetrics = Array.from(this.metrics.values()).flat();

    if (format === 'json') {
      return JSON.stringify({
        metrics: allMetrics,
        roi: this.getCurrentROI(),
        usage: this.getCurrentUsage(),
        exported: new Date()
      }, null, 2);
    }

    // CSV format
    const headers = ['id', 'name', 'type', 'value', 'timestamp', 'tags'];
    const rows = allMetrics.map(m => [
      m.id,
      m.name,
      m.type,
      m.value,
      m.timestamp.toISOString(),
      JSON.stringify(m.tags)
    ]);

    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }
}