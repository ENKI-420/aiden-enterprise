/**
 * Data Ingestion & Storage Layer
 * Handles logging, storage, and retrieval of all system data
 */

import { EventEmitter } from 'events';
import { CodeDiff, CodeGeneration, PerformanceMetrics, UserEdit } from './core';

// Storage interfaces
export interface DataStore {
  saveGeneration(generation: CodeGeneration): Promise<void>;
  saveUserEdit(edit: UserEdit): Promise<void>;
  savePerformanceMetrics(metrics: PerformanceMetrics): Promise<void>;
  saveFeedback(feedback: UserFeedback): Promise<void>;

  getGeneration(id: string): Promise<CodeGeneration | null>;
  getGenerationsBySession(sessionId: string): Promise<CodeGeneration[]>;
  getEditsByGeneration(generationId: string): Promise<UserEdit[]>;
  getMetricsByGeneration(generationId: string): Promise<PerformanceMetrics | null>;

  queryGenerations(query: DataQuery): Promise<CodeGeneration[]>;
  aggregateMetrics(timeRange: TimeRange): Promise<AggregatedMetrics>;
}

export interface UserFeedback {
  generationId: string;
  type: 'explicit' | 'implicit';
  rating?: number; // 1-5 for explicit
  comment?: string;
  action?: 'deployed' | 'discarded' | 'modified' | 'reused';
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface DataQuery {
  sessionId?: string;
  userId?: string;
  timeRange?: TimeRange;
  qualityThreshold?: number;
  hasEdits?: boolean;
  promptPattern?: string;
}

export interface TimeRange {
  start: Date;
  end: Date;
}

export interface AggregatedMetrics {
  totalGenerations: number;
  averageQuality: number;
  editRate: number;
  averagePerformance: PerformanceMetrics;
  topIssues: Array<{ type: string; count: number }>;
  successRate: number;
}

// Data Ingestion Pipeline
export class DataIngestionPipeline extends EventEmitter {
  private dataStore: DataStore;
  private diffCalculator: DiffCalculator;
  private performanceCollector: PerformanceCollector;
  private feedbackCollector: FeedbackCollector;

  constructor(dataStore: DataStore) {
    super();
    this.dataStore = dataStore;
    this.diffCalculator = new DiffCalculator();
    this.performanceCollector = new PerformanceCollector();
    this.feedbackCollector = new FeedbackCollector();
  }

  async logGeneration(
    prompt: string,
    generatedCode: string,
    modelVersion: string,
    sessionId: string,
    userId?: string,
    metadata?: Record<string, any>
  ): Promise<CodeGeneration> {
    const generation: CodeGeneration = {
      id: this.generateId(),
      prompt,
      generatedCode,
      timestamp: new Date(),
      modelVersion,
      sessionId,
      userId,
      metadata: {
        ...metadata,
        codeStats: this.calculateCodeStats(generatedCode)
      }
    };

    await this.dataStore.saveGeneration(generation);
    this.emit('generation:logged', generation);

    // Start performance collection in background
    this.performanceCollector.collectForGeneration(generation.id).catch(err => {
      console.error('Performance collection failed:', err);
    });

    return generation;
  }

  async logUserEdit(
    generationId: string,
    originalCode: string,
    modifiedCode: string,
    editDuration: number
  ): Promise<UserEdit> {
    const diff = await this.diffCalculator.calculate(originalCode, modifiedCode);

    const edit: UserEdit = {
      generationId,
      originalCode,
      modifiedCode,
      diff,
      timestamp: new Date(),
      editDuration
    };

    await this.dataStore.saveUserEdit(edit);
    this.emit('edit:logged', edit);

    // Trigger implicit feedback based on edit
    await this.feedbackCollector.recordImplicitFeedback(generationId, 'modified');

    return edit;
  }

  async logPerformanceMetrics(
    generationId: string,
    metrics: Partial<PerformanceMetrics>
  ): Promise<void> {
    const fullMetrics: PerformanceMetrics = {
      generationId,
      loadTime: metrics.loadTime || 0,
      renderTime: metrics.renderTime || 0,
      bundleSize: metrics.bundleSize || 0,
      lighthouseScores: metrics.lighthouseScores || {
        performance: 0,
        accessibility: 0,
        bestPractices: 0,
        seo: 0
      },
      coreWebVitals: metrics.coreWebVitals || {
        lcp: 0,
        fid: 0,
        cls: 0
      }
    };

    await this.dataStore.savePerformanceMetrics(fullMetrics);
    this.emit('metrics:logged', fullMetrics);
  }

  async logFeedback(
    generationId: string,
    rating?: number,
    comment?: string
  ): Promise<void> {
    const feedback: UserFeedback = {
      generationId,
      type: 'explicit',
      rating,
      comment,
      timestamp: new Date()
    };

    await this.dataStore.saveFeedback(feedback);
    this.emit('feedback:logged', feedback);
  }

  private generateId(): string {
    return `gen_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private calculateCodeStats(code: string): Record<string, any> {
    const lines = code.split('\n');
    const nonEmptyLines = lines.filter(line => line.trim().length > 0);

    return {
      totalLines: lines.length,
      nonEmptyLines: nonEmptyLines.length,
      characters: code.length,
      avgLineLength: code.length / lines.length,
      imports: (code.match(/import\s+/g) || []).length,
      exports: (code.match(/export\s+/g) || []).length,
      functions: (code.match(/function\s+\w+|const\s+\w+\s*=.*=>/g) || []).length,
      components: (code.match(/function\s+[A-Z]\w*|const\s+[A-Z]\w*\s*=/g) || []).length
    };
  }
}

// Diff Calculator
export class DiffCalculator {
  async calculate(original: string, modified: string): Promise<CodeDiff[]> {
    const originalLines = original.split('\n');
    const modifiedLines = modified.split('\n');
    const diffs: CodeDiff[] = [];

    // Simple line-by-line diff (in production, use a proper diff algorithm)
    const maxLength = Math.max(originalLines.length, modifiedLines.length);

    for (let i = 0; i < maxLength; i++) {
      const origLine = originalLines[i];
      const modLine = modifiedLines[i];

      if (origLine === undefined && modLine !== undefined) {
        diffs.push({
          type: 'add',
          lineNumber: i + 1,
          content: modLine,
          context: this.getContext(modifiedLines, i)
        });
      } else if (origLine !== undefined && modLine === undefined) {
        diffs.push({
          type: 'remove',
          lineNumber: i + 1,
          content: origLine,
          context: this.getContext(originalLines, i)
        });
      } else if (origLine !== modLine) {
        diffs.push({
          type: 'modify',
          lineNumber: i + 1,
          content: modLine || '',
          context: this.getContext(modifiedLines, i)
        });
      }
    }

    return diffs;
  }

  private getContext(lines: string[], index: number, contextSize: number = 2): string {
    const start = Math.max(0, index - contextSize);
    const end = Math.min(lines.length, index + contextSize + 1);
    return lines.slice(start, end).join('\n');
  }
}

// Performance Collector
export class PerformanceCollector {
  async collectForGeneration(generationId: string): Promise<PerformanceMetrics> {
    // In a real implementation, this would:
    // 1. Deploy/preview the component
    // 2. Run Lighthouse or similar tools
    // 3. Collect Core Web Vitals
    // 4. Measure bundle size

    // Mock implementation
    return {
      generationId,
      loadTime: Math.random() * 1000 + 500,
      renderTime: Math.random() * 100 + 50,
      bundleSize: Math.random() * 100000 + 50000,
      lighthouseScores: {
        performance: Math.floor(Math.random() * 30 + 70),
        accessibility: Math.floor(Math.random() * 20 + 80),
        bestPractices: Math.floor(Math.random() * 15 + 85),
        seo: Math.floor(Math.random() * 10 + 90)
      },
      coreWebVitals: {
        lcp: Math.random() * 2 + 1,
        fid: Math.random() * 100 + 50,
        cls: Math.random() * 0.1
      }
    };
  }
}

// Feedback Collector
export class FeedbackCollector {
  private dataStore: DataStore;

  constructor(dataStore?: DataStore) {
    this.dataStore = dataStore || new InMemoryDataStore();
  }

  async recordImplicitFeedback(
    generationId: string,
    action: 'deployed' | 'discarded' | 'modified' | 'reused'
  ): Promise<void> {
    const feedback: UserFeedback = {
      generationId,
      type: 'implicit',
      action,
      timestamp: new Date()
    };

    await this.dataStore.saveFeedback(feedback);
  }
}

// In-Memory Data Store (for development/testing)
export class InMemoryDataStore implements DataStore {
  private generations = new Map<string, CodeGeneration>();
  private edits = new Map<string, UserEdit[]>();
  private metrics = new Map<string, PerformanceMetrics>();
  private feedback = new Map<string, UserFeedback[]>();

  async saveGeneration(generation: CodeGeneration): Promise<void> {
    this.generations.set(generation.id, generation);
  }

  async saveUserEdit(edit: UserEdit): Promise<void> {
    const edits = this.edits.get(edit.generationId) || [];
    edits.push(edit);
    this.edits.set(edit.generationId, edits);
  }

  async savePerformanceMetrics(metrics: PerformanceMetrics): Promise<void> {
    this.metrics.set(metrics.generationId, metrics);
  }

  async saveFeedback(feedback: UserFeedback): Promise<void> {
    const feedbacks = this.feedback.get(feedback.generationId) || [];
    feedbacks.push(feedback);
    this.feedback.set(feedback.generationId, feedbacks);
  }

  async getGeneration(id: string): Promise<CodeGeneration | null> {
    return this.generations.get(id) || null;
  }

  async getGenerationsBySession(sessionId: string): Promise<CodeGeneration[]> {
    return Array.from(this.generations.values()).filter(g => g.sessionId === sessionId);
  }

  async getEditsByGeneration(generationId: string): Promise<UserEdit[]> {
    return this.edits.get(generationId) || [];
  }

  async getMetricsByGeneration(generationId: string): Promise<PerformanceMetrics | null> {
    return this.metrics.get(generationId) || null;
  }

  async queryGenerations(query: DataQuery): Promise<CodeGeneration[]> {
    let results = Array.from(this.generations.values());

    if (query.sessionId) {
      results = results.filter(g => g.sessionId === query.sessionId);
    }

    if (query.userId) {
      results = results.filter(g => g.userId === query.userId);
    }

    if (query.timeRange) {
      results = results.filter(g =>
        g.timestamp >= query.timeRange.start &&
        g.timestamp <= query.timeRange.end
      );
    }

    if (query.hasEdits !== undefined) {
      results = results.filter(g => {
        const hasEdits = this.edits.has(g.id) && this.edits.get(g.id)!.length > 0;
        return hasEdits === query.hasEdits;
      });
    }

    if (query.promptPattern) {
      const regex = new RegExp(query.promptPattern, 'i');
      results = results.filter(g => regex.test(g.prompt));
    }

    return results;
  }

  async aggregateMetrics(timeRange: TimeRange): Promise<AggregatedMetrics> {
    const generations = await this.queryGenerations({ timeRange });
    const totalGenerations = generations.length;

    if (totalGenerations === 0) {
      return {
        totalGenerations: 0,
        averageQuality: 0,
        editRate: 0,
        averagePerformance: {
          generationId: '',
          loadTime: 0,
          renderTime: 0,
          bundleSize: 0,
          lighthouseScores: {
            performance: 0,
            accessibility: 0,
            bestPractices: 0,
            seo: 0
          },
          coreWebVitals: {
            lcp: 0,
            fid: 0,
            cls: 0
          }
        },
        topIssues: [],
        successRate: 0
      };
    }

    // Calculate edit rate
    const generationsWithEdits = generations.filter(g =>
      this.edits.has(g.id) && this.edits.get(g.id)!.length > 0
    ).length;
    const editRate = generationsWithEdits / totalGenerations;

    // Calculate average performance (simplified)
    const allMetrics = await Promise.all(
      generations.map(g => this.getMetricsByGeneration(g.id))
    );
    const validMetrics = allMetrics.filter(m => m !== null) as PerformanceMetrics[];

    const avgPerformance = validMetrics.reduce((acc, m) => {
      acc.lighthouseScores.performance += m.lighthouseScores.performance;
      acc.lighthouseScores.accessibility += m.lighthouseScores.accessibility;
      acc.lighthouseScores.bestPractices += m.lighthouseScores.bestPractices;
      acc.lighthouseScores.seo += m.lighthouseScores.seo;
      return acc;
    }, {
      generationId: '',
      loadTime: 0,
      renderTime: 0,
      bundleSize: 0,
      lighthouseScores: {
        performance: 0,
        accessibility: 0,
        bestPractices: 0,
        seo: 0
      },
      coreWebVitals: {
        lcp: 0,
        fid: 0,
        cls: 0
      }
    });

    if (validMetrics.length > 0) {
      avgPerformance.lighthouseScores.performance /= validMetrics.length;
      avgPerformance.lighthouseScores.accessibility /= validMetrics.length;
      avgPerformance.lighthouseScores.bestPractices /= validMetrics.length;
      avgPerformance.lighthouseScores.seo /= validMetrics.length;
    }

    return {
      totalGenerations,
      averageQuality: avgPerformance.lighthouseScores.performance,
      editRate,
      averagePerformance: avgPerformance,
      topIssues: [], // Would be calculated from actual issue tracking
      successRate: 1 - editRate // Simplified: no edits = success
    };
  }
}