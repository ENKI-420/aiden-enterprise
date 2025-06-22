/**
 * Machine Learning Models for AI Reflection System
 * Implements predictive models for code quality and optimization
 */

import { CodeGeneration, MLModel, UserEdit } from './core';

// Base class for TensorFlow.js models (using mock implementation for demo)
export abstract class TFModel implements MLModel {
  protected model: any;
  protected isLoaded: boolean = false;

  abstract predict(input: any): Promise<any>;
  abstract train(data: any[]): Promise<void>;

  protected async loadModel(modelPath: string): Promise<void> {
    // In production, would load actual TensorFlow.js model
    console.log(`Loading model from ${modelPath}`);
    this.isLoaded = true;
  }

  protected preprocessInput(input: any): number[] {
    // Convert input to tensor-friendly format
    return [];
  }
}

// Model to predict code quality from prompts
export class CodeQualityPredictor extends TFModel {
  constructor() {
    super();
    this.loadModel('/models/code-quality-predictor');
  }

  async predict(input: { prompt: string; features?: any }): Promise<{
    predictedQuality: number;
    confidence: number;
    riskFactors: string[];
  }> {
    // Extract features from prompt
    const features = this.extractPromptFeatures(input.prompt);

    // Mock prediction logic
    let predictedQuality = 75;
    let confidence = 0.8;
    const riskFactors: string[] = [];

    // Simple heuristics for demo
    if (features.length < 10) {
      predictedQuality -= 10;
      riskFactors.push('Prompt too short - may lack necessary context');
    }

    if (!features.hasSpecificity) {
      predictedQuality -= 15;
      riskFactors.push('Prompt lacks specific requirements');
    }

    if (features.complexity > 8) {
      predictedQuality -= 20;
      riskFactors.push('Highly complex requirements may lead to errors');
      confidence -= 0.2;
    }

    if (features.hasAmbiguity) {
      predictedQuality -= 10;
      riskFactors.push('Ambiguous terms detected in prompt');
      confidence -= 0.1;
    }

    return {
      predictedQuality: Math.max(0, Math.min(100, predictedQuality)),
      confidence: Math.max(0.1, Math.min(1, confidence)),
      riskFactors
    };
  }

  async train(data: Array<{ prompt: string; actualQuality: number }>): Promise<void> {
    // In production, would train the model with actual data
    console.log(`Training with ${data.length} samples`);

    // Extract features and labels
    const features = data.map(d => this.extractPromptFeatures(d.prompt));
    const labels = data.map(d => d.actualQuality);

    // Mock training process
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Training complete');
  }

  private extractPromptFeatures(prompt: string): any {
    const words = prompt.split(/\s+/);
    const chars = prompt.length;

    return {
      length: words.length,
      charCount: chars,
      avgWordLength: chars / words.length,
      hasSpecificity: /specific|exactly|must|should|need/i.test(prompt),
      hasAmbiguity: /maybe|possibly|something|somehow/i.test(prompt),
      complexity: this.calculateComplexity(prompt),
      technicalTerms: this.countTechnicalTerms(prompt),
      structureIndicators: this.countStructureIndicators(prompt)
    };
  }

  private calculateComplexity(prompt: string): number {
    let complexity = 0;

    // Nested requirements
    complexity += (prompt.match(/with|and|also|including/gi) || []).length;

    // Multiple components
    complexity += (prompt.match(/component|section|part|module/gi) || []).length;

    // Conditional requirements
    complexity += (prompt.match(/if|when|unless|except/gi) || []).length * 2;

    return complexity;
  }

  private countTechnicalTerms(prompt: string): number {
    const technicalTerms = [
      'api', 'async', 'state', 'props', 'hook', 'context',
      'redux', 'graphql', 'rest', 'websocket', 'animation',
      'responsive', 'accessible', 'optimized', 'performance'
    ];

    return technicalTerms.filter(term =>
      new RegExp(`\\b${term}\\b`, 'i').test(prompt)
    ).length;
  }

  private countStructureIndicators(prompt: string): number {
    const structureTerms = [
      'layout', 'grid', 'flex', 'table', 'list',
      'header', 'footer', 'sidebar', 'navigation', 'menu'
    ];

    return structureTerms.filter(term =>
      new RegExp(`\\b${term}\\b`, 'i').test(prompt)
    ).length;
  }
}

// Model to predict likely user edits
export class EditPredictor extends TFModel {
  constructor() {
    super();
    this.loadModel('/models/edit-predictor');
  }

  async predict(input: {
    generation: CodeGeneration;
    userHistory?: UserEdit[];
  }): Promise<{
    likelyEdits: PredictedEdit[];
    editProbability: number;
  }> {
    const codeFeatures = this.extractCodeFeatures(input.generation.generatedCode);
    const promptFeatures = this.extractPromptFeatures(input.generation.prompt);

    const likelyEdits: PredictedEdit[] = [];
    let editProbability = 0.3; // Base probability

    // Predict based on code patterns
    if (codeFeatures.missingImports) {
      likelyEdits.push({
        type: 'add-imports',
        description: 'User likely to add missing imports',
        probability: 0.8
      });
      editProbability += 0.2;
    }

    if (codeFeatures.noErrorHandling) {
      likelyEdits.push({
        type: 'add-error-handling',
        description: 'User likely to add try-catch or error boundaries',
        probability: 0.6
      });
      editProbability += 0.1;
    }

    if (codeFeatures.inlineStyles && promptFeatures.mentionsDesign) {
      likelyEdits.push({
        type: 'refactor-styles',
        description: 'User likely to extract or modify styles',
        probability: 0.7
      });
      editProbability += 0.15;
    }

    if (codeFeatures.noState && promptFeatures.mentionsInteractivity) {
      likelyEdits.push({
        type: 'add-state',
        description: 'User likely to add state management',
        probability: 0.85
      });
      editProbability += 0.25;
    }

    // Learn from user history
    if (input.userHistory && input.userHistory.length > 0) {
      const commonEditPatterns = this.analyzeUserPatterns(input.userHistory);
      editProbability = Math.min(0.9, editProbability + commonEditPatterns.consistencyScore * 0.3);
    }

    return {
      likelyEdits: likelyEdits.sort((a, b) => b.probability - a.probability),
      editProbability: Math.min(1, editProbability)
    };
  }

  async train(data: Array<{
    generation: CodeGeneration;
    actualEdits: UserEdit[];
  }>): Promise<void> {
    console.log(`Training edit predictor with ${data.length} samples`);

    // Extract patterns from actual edits
    const patterns = data.map(d => ({
      codeFeatures: this.extractCodeFeatures(d.generation.generatedCode),
      promptFeatures: this.extractPromptFeatures(d.generation.prompt),
      editTypes: this.categorizeEdits(d.actualEdits)
    }));

    // Mock training
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log('Edit predictor training complete');
  }

  private extractCodeFeatures(code: string): any {
    return {
      missingImports: !code.includes('import React'),
      noErrorHandling: !code.includes('try') && !code.includes('catch'),
      inlineStyles: code.includes('style={{') || code.includes('style={ {'),
      noState: !code.includes('useState') && !code.includes('useReducer'),
      hasHardcodedData: /["'][^"']{50,}["']/.test(code),
      componentCount: (code.match(/function\s+[A-Z]|const\s+[A-Z]\w*\s*=/g) || []).length
    };
  }

  private extractPromptFeatures(prompt: string): any {
    return {
      mentionsDesign: /design|style|look|appearance|ui|ux/i.test(prompt),
      mentionsInteractivity: /click|interact|dynamic|update|change/i.test(prompt),
      mentionsData: /data|fetch|api|load|display/i.test(prompt),
      specificity: prompt.split(/\s+/).length > 20 ? 'high' : 'low'
    };
  }

  private analyzeUserPatterns(history: UserEdit[]): any {
    const editTypes = history.map(e => this.categorizeEdits([e]));
    const consistency = this.calculateConsistency(editTypes);

    return {
      commonPatterns: this.findCommonPatterns(editTypes),
      consistencyScore: consistency
    };
  }

  private categorizeEdits(edits: UserEdit[]): string[] {
    const categories: string[] = [];

    edits.forEach(edit => {
      edit.diff.forEach(diff => {
        if (diff.type === 'add' && diff.content.includes('import')) {
          categories.push('add-imports');
        }
        if (diff.type === 'add' && diff.content.includes('useState')) {
          categories.push('add-state');
        }
        if (diff.type === 'modify' && diff.content.includes('className')) {
          categories.push('modify-styles');
        }
      });
    });

    return [...new Set(categories)];
  }

  private calculateConsistency(editTypes: string[][]): number {
    if (editTypes.length < 2) return 0;

    let consistentPatterns = 0;
    const firstPattern = editTypes[0].sort().join(',');

    editTypes.slice(1).forEach(pattern => {
      if (pattern.sort().join(',') === firstPattern) {
        consistentPatterns++;
      }
    });

    return consistentPatterns / (editTypes.length - 1);
  }

  private findCommonPatterns(editTypes: string[][]): string[] {
    const patternCounts: Record<string, number> = {};

    editTypes.forEach(types => {
      types.forEach(type => {
        patternCounts[type] = (patternCounts[type] || 0) + 1;
      });
    });

    return Object.entries(patternCounts)
      .filter(([_, count]) => count > editTypes.length / 2)
      .map(([pattern]) => pattern);
  }
}

// Model for automated code refactoring suggestions
export class RefactoringModel extends TFModel {
  constructor() {
    super();
    this.loadModel('/models/refactoring-model');
  }

  async predict(input: {
    code: string;
    issues: any[];
    quality: number;
  }): Promise<{
    refactorings: Refactoring[];
    estimatedImprovement: number;
  }> {
    const refactorings: Refactoring[] = [];
    let estimatedImprovement = 0;

    // Analyze code for refactoring opportunities
    const analysis = this.analyzeCode(input.code);

    // Component extraction
    if (analysis.componentComplexity > 15) {
      refactorings.push({
        type: 'extract-component',
        description: 'Extract complex logic into separate components',
        code: this.generateComponentExtraction(input.code, analysis),
        impact: 'high',
        estimatedQualityGain: 15
      });
      estimatedImprovement += 15;
    }

    // Hook extraction
    if (analysis.duplicateLogic.length > 0) {
      refactorings.push({
        type: 'extract-hook',
        description: 'Extract repeated logic into custom hooks',
        code: this.generateHookExtraction(input.code, analysis.duplicateLogic),
        impact: 'medium',
        estimatedQualityGain: 10
      });
      estimatedImprovement += 10;
    }

    // Performance optimizations
    if (analysis.performanceIssues.length > 0) {
      analysis.performanceIssues.forEach(issue => {
        const optimization = this.generateOptimization(input.code, issue);
        if (optimization) {
          refactorings.push(optimization);
          estimatedImprovement += optimization.estimatedQualityGain;
        }
      });
    }

    return {
      refactorings: refactorings.sort((a, b) =>
        b.estimatedQualityGain - a.estimatedQualityGain
      ),
      estimatedImprovement: Math.min(100 - input.quality, estimatedImprovement)
    };
  }

  async train(data: Array<{
    originalCode: string;
    refactoredCode: string;
    qualityImprovement: number;
  }>): Promise<void> {
    console.log(`Training refactoring model with ${data.length} samples`);

    // Learn refactoring patterns
    const patterns = data.map(d => ({
      before: this.extractPatterns(d.originalCode),
      after: this.extractPatterns(d.refactoredCode),
      improvement: d.qualityImprovement
    }));

    // Mock training
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('Refactoring model training complete');
  }

  private analyzeCode(code: string): any {
    return {
      componentComplexity: this.calculateComplexity(code),
      duplicateLogic: this.findDuplicateLogic(code),
      performanceIssues: this.findPerformanceIssues(code),
      codeSmells: this.detectCodeSmells(code)
    };
  }

  private calculateComplexity(code: string): number {
    let complexity = 0;

    // Count decision points
    complexity += (code.match(/if\s*\(/g) || []).length * 2;
    complexity += (code.match(/\?.*:/g) || []).length;
    complexity += (code.match(/&&|\|\|/g) || []).length;

    // Count loops
    complexity += (code.match(/\.map\(|\.forEach\(|for\s*\(/g) || []).length * 3;

    // Count state management
    complexity += (code.match(/useState|useReducer/g) || []).length * 2;

    return complexity;
  }

  private findDuplicateLogic(code: string): string[] {
    const duplicates: string[] = [];

    // Simple pattern matching for duplicate code blocks
    const lines = code.split('\n');
    const seen: Record<string, number> = {};

    lines.forEach(line => {
      const trimmed = line.trim();
      if (trimmed.length > 20) {
        seen[trimmed] = (seen[trimmed] || 0) + 1;
      }
    });

    Object.entries(seen).forEach(([line, count]) => {
      if (count > 2) {
        duplicates.push(line);
      }
    });

    return duplicates;
  }

  private findPerformanceIssues(code: string): any[] {
    const issues: any[] = [];

    // Check for missing memoization
    if (code.includes('.map(') && !code.includes('memo')) {
      issues.push({
        type: 'missing-memoization',
        description: 'List items should be memoized'
      });
    }

    // Check for inline functions in render
    if (code.match(/onClick=\{(?:async\s*)?\(\)\s*=>/)) {
      issues.push({
        type: 'inline-handlers',
        description: 'Event handlers should use useCallback'
      });
    }

    // Check for expensive calculations in render
    if (code.match(/\.sort\(|\.reduce\(/) && !code.includes('useMemo')) {
      issues.push({
        type: 'expensive-calculations',
        description: 'Expensive calculations should be memoized'
      });
    }

    return issues;
  }

  private detectCodeSmells(code: string): string[] {
    const smells: string[] = [];

    if (code.includes('any>') || code.includes(': any')) {
      smells.push('any-type-usage');
    }

    if (code.includes('console.log')) {
      smells.push('console-statements');
    }

    if (code.match(/catch\s*\(\s*\)\s*{[\s\S]*?}/)) {
      smells.push('empty-catch-block');
    }

    return smells;
  }

  private generateComponentExtraction(code: string, analysis: any): string {
    // Simplified example - in production would use AST manipulation
    return `
// Extract complex component logic
const ExtractedComponent = ({ data }) => {
  // Extracted logic here
  return <div>...</div>;
};

// Simplified main component
${code.replace(/return\s*\(/, 'return (\n    <ExtractedComponent data={data} />\n    // Original JSX simplified...')}
`;
  }

  private generateHookExtraction(code: string, duplicateLogic: string[]): string {
    return `
// Custom hook for repeated logic
const useCustomLogic = () => {
  // Extract repeated patterns
  ${duplicateLogic.slice(0, 3).join('\n  ')}

  return { /* hook return values */ };
};

// Use in component
${code}
`;
  }

  private generateOptimization(code: string, issue: any): Refactoring | null {
    switch (issue.type) {
      case 'missing-memoization':
        return {
          type: 'add-memoization',
          description: 'Add React.memo to prevent unnecessary re-renders',
          code: code.replace(/const\s+(\w+)\s*=/, 'const $1 = React.memo('),
          impact: 'medium',
          estimatedQualityGain: 5
        };

      case 'inline-handlers':
        return {
          type: 'use-callback',
          description: 'Replace inline handlers with useCallback',
          code: this.replaceInlineHandlers(code),
          impact: 'medium',
          estimatedQualityGain: 7
        };

      default:
        return null;
    }
  }

  private replaceInlineHandlers(code: string): string {
    // Simplified - would use proper AST transformation
    return code.replace(
      /onClick=\{(?:async\s*)?\(\)\s*=>\s*{([^}]+)}\}/g,
      'onClick={handleClick}'
    );
  }

  private extractPatterns(code: string): any {
    return {
      structure: code.match(/<\w+/g) || [],
      hooks: code.match(/use\w+/g) || [],
      complexity: this.calculateComplexity(code)
    };
  }
}

// Interfaces for predictions
interface PredictedEdit {
  type: string;
  description: string;
  probability: number;
}

interface Refactoring {
  type: string;
  description: string;
  code: string;
  impact: 'high' | 'medium' | 'low';
  estimatedQualityGain: number;
}

// Model manager for coordinating all ML models
export class ModelManager {
  private models: Map<string, MLModel> = new Map();

  constructor() {
    this.initializeModels();
  }

  private initializeModels() {
    this.models.set('quality-predictor', new CodeQualityPredictor());
    this.models.set('edit-predictor', new EditPredictor());
    this.models.set('refactoring', new RefactoringModel());
  }

  getModel(name: string): MLModel | undefined {
    return this.models.get(name);
  }

  async predictQuality(prompt: string): Promise<any> {
    const model = this.models.get('quality-predictor') as CodeQualityPredictor;
    return model.predict({ prompt });
  }

  async predictEdits(generation: CodeGeneration): Promise<any> {
    const model = this.models.get('edit-predictor') as EditPredictor;
    return model.predict({ generation });
  }

  async suggestRefactorings(code: string, issues: any[], quality: number): Promise<any> {
    const model = this.models.get('refactoring') as RefactoringModel;
    return model.predict({ code, issues, quality });
  }

  async trainAllModels(trainingData: any): Promise<void> {
    const trainingPromises = Array.from(this.models.entries()).map(
      async ([name, model]) => {
        console.log(`Training ${name}...`);
        await model.train(trainingData[name] || []);
      }
    );

    await Promise.all(trainingPromises);
    console.log('All models trained successfully');
  }
}