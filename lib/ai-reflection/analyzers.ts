/**
 * Advanced Analysis Modules
 * Implements sophisticated code analysis capabilities
 */

import * as ts from 'typescript';
import { AnalysisContext, AnalysisModule, CodeIssue, Suggestion } from './core';

// Enhanced Code Quality Analyzer
export class AdvancedCodeQualityAnalyzer extends AnalysisModule {
  private tsProgram?: ts.Program;

  constructor() {
    super();
  }

  async analyze(context: AnalysisContext): Promise<any> {
    const { generation } = context;
    const issues: CodeIssue[] = [];
    const suggestions: Suggestion[] = [];

    // React-specific analysis
    const reactAnalysis = await this.analyzeReactPatterns(generation.generatedCode);
    issues.push(...reactAnalysis.issues);
    suggestions.push(...reactAnalysis.suggestions);

    // Code complexity analysis
    const complexityAnalysis = this.analyzeComplexity(generation.generatedCode);
    if (complexityAnalysis.complexity > 10) {
      suggestions.push({
        type: 'refactor',
        priority: 'medium',
        description: 'Consider breaking down complex components',
        rationale: `Component complexity score is ${complexityAnalysis.complexity}. Components with complexity > 10 are harder to maintain.`,
        code: this.generateRefactoredCode(generation.generatedCode, complexityAnalysis)
      });
    }

    // Best practices analysis
    const bestPractices = this.analyzeBestPractices(generation.generatedCode);
    issues.push(...bestPractices.issues);
    suggestions.push(...bestPractices.suggestions);

    // Calculate quality scores
    const quality = this.calculateQualityScore(issues, suggestions, complexityAnalysis);

    return {
      issues,
      suggestions,
      quality,
      complexity: complexityAnalysis
    };
  }

  private async analyzeReactPatterns(code: string): Promise<{
    issues: CodeIssue[];
    suggestions: Suggestion[];
  }> {
    const issues: CodeIssue[] = [];
    const suggestions: Suggestion[] = [];

    // Check for missing keys in lists
    if (code.includes('.map(') && !code.includes('key=')) {
      issues.push({
        severity: 'warning',
        type: 'react',
        message: 'List items should have unique "key" props'
      });
    }

    // Check for direct state mutations
    if (code.match(/state\.\w+\s*=/)) {
      issues.push({
        severity: 'error',
        type: 'react',
        message: 'Never mutate state directly. Use setState or state update functions.'
      });
    }

    // Suggest React.memo for pure components
    const componentMatch = code.match(/(?:function|const)\s+([A-Z]\w+)/);
    if (componentMatch && !code.includes('React.memo') && !code.includes('useState') && !code.includes('useEffect')) {
      suggestions.push({
        type: 'optimize',
        priority: 'low',
        description: `Consider wrapping ${componentMatch[1]} with React.memo`,
        rationale: 'Pure components can benefit from memoization to prevent unnecessary re-renders',
        code: `const ${componentMatch[1]} = React.memo(${componentMatch[0]} { /* ... */ });`
      });
    }

    // Check for missing useCallback/useMemo
    const inlineCallbacks = code.match(/onClick=\{(?:async\s*)?\(\)\s*=>/g);
    if (inlineCallbacks && inlineCallbacks.length > 0) {
      suggestions.push({
        type: 'optimize',
        priority: 'medium',
        description: 'Consider using useCallback for event handlers',
        rationale: 'Inline arrow functions create new references on each render, potentially causing unnecessary re-renders of child components'
      });
    }

    return { issues, suggestions };
  }

  private analyzeComplexity(code: string): { complexity: number; details: any } {
    let complexity = 1; // Base complexity

    // Count decision points
    const decisionPatterns = [
      /if\s*\(/g,
      /else\s+if\s*\(/g,
      /else\s*{/g,
      /\?\s*.*\s*:/g, // Ternary
      /case\s+/g,
      /while\s*\(/g,
      /for\s*\(/g,
      /\.forEach\(/g,
      /\.map\(/g,
      /\.filter\(/g,
      /&&/g,
      /\|\|/g
    ];

    decisionPatterns.forEach(pattern => {
      const matches = code.match(pattern);
      complexity += matches ? matches.length : 0;
    });

    // Additional complexity for nested structures
    const nestingLevel = this.calculateMaxNesting(code);
    complexity += Math.floor(nestingLevel / 2);

    return {
      complexity,
      details: {
        decisionPoints: complexity - 1,
        maxNesting: nestingLevel
      }
    };
  }

  private calculateMaxNesting(code: string): number {
    let maxNesting = 0;
    let currentNesting = 0;

    for (const char of code) {
      if (char === '{') {
        currentNesting++;
        maxNesting = Math.max(maxNesting, currentNesting);
      } else if (char === '}') {
        currentNesting = Math.max(0, currentNesting - 1);
      }
    }

    return maxNesting;
  }

  private analyzeBestPractices(code: string): {
    issues: CodeIssue[];
    suggestions: Suggestion[];
  } {
    const issues: CodeIssue[] = [];
    const suggestions: Suggestion[] = [];

    // Check for console.log statements
    if (code.includes('console.log')) {
      issues.push({
        severity: 'warning',
        type: 'best-practice',
        message: 'Remove console.log statements from production code'
      });
    }

    // Check for hardcoded values
    const hardcodedStrings = code.match(/"[^"]{20,}"/g);
    if (hardcodedStrings) {
      suggestions.push({
        type: 'refactor',
        priority: 'low',
        description: 'Consider extracting long strings to constants',
        rationale: 'Long hardcoded strings should be extracted to improve maintainability'
      });
    }

    // Check for missing error boundaries
    if (code.includes('throw') && !code.includes('ErrorBoundary')) {
      suggestions.push({
        type: 'refactor',
        priority: 'high',
        description: 'Consider adding an Error Boundary',
        rationale: 'Components that can throw errors should be wrapped in Error Boundaries'
      });
    }

    return { issues, suggestions };
  }

  private generateRefactoredCode(originalCode: string, complexityAnalysis: any): string {
    // This is a simplified example - in production, use AST manipulation
    return `// Suggested refactoring to reduce complexity from ${complexityAnalysis.complexity} to a lower value\n${originalCode}`;
  }

  private calculateQualityScore(
    issues: CodeIssue[],
    suggestions: Suggestion[],
    complexityAnalysis: any
  ): any {
    const errorCount = issues.filter(i => i.severity === 'error').length;
    const warningCount = issues.filter(i => i.severity === 'warning').length;

    // Base score starts at 100
    let maintainability = 100;
    maintainability -= errorCount * 10;
    maintainability -= warningCount * 5;
    maintainability -= Math.max(0, complexityAnalysis.complexity - 10) * 2;
    maintainability = Math.max(0, maintainability);

    let bestPractices = 100;
    bestPractices -= issues.filter(i => i.type === 'best-practice').length * 10;
    bestPractices -= suggestions.filter(s => s.priority === 'high').length * 5;
    bestPractices = Math.max(0, bestPractices);

    return {
      maintainability,
      bestPractices
    };
  }
}

// Advanced Performance Analyzer
export class AdvancedPerformanceAnalyzer extends AnalysisModule {
  async analyze(context: AnalysisContext): Promise<any> {
    const { generation, metrics } = context;
    const issues: CodeIssue[] = [];
    const suggestions: Suggestion[] = [];

    // Analyze bundle size impact
    const bundleAnalysis = this.analyzeBundleImpact(generation.generatedCode);
    if (bundleAnalysis.estimatedSize > 50000) {
      issues.push({
        severity: 'warning',
        type: 'performance',
        message: `Component may add ~${Math.round(bundleAnalysis.estimatedSize / 1000)}KB to bundle size`
      });
    }

    // Check for performance anti-patterns
    const antiPatterns = this.checkPerformanceAntiPatterns(generation.generatedCode);
    issues.push(...antiPatterns.issues);
    suggestions.push(...antiPatterns.suggestions);

    // Analyze render performance
    const renderAnalysis = this.analyzeRenderPerformance(generation.generatedCode);
    if (renderAnalysis.estimatedRenderCost > 16) {
      suggestions.push({
        type: 'optimize',
        priority: 'high',
        description: 'Component may cause frame drops during render',
        rationale: `Estimated render cost is ${renderAnalysis.estimatedRenderCost}ms, which exceeds the 16ms budget for 60fps`
      });
    }

    // Use actual metrics if available
    let performanceScore = 75; // Default
    if (metrics) {
      performanceScore = metrics.lighthouseScores.performance;

      if (metrics.coreWebVitals.lcp > 2.5) {
        issues.push({
          severity: 'warning',
          type: 'performance',
          message: `LCP is ${metrics.coreWebVitals.lcp}s (should be < 2.5s)`
        });
      }
    }

    return {
      issues,
      suggestions,
      quality: {
        performance: performanceScore
      },
      bundleAnalysis,
      renderAnalysis
    };
  }

  private analyzeBundleImpact(code: string): any {
    // Estimate bundle size based on code characteristics
    let estimatedSize = code.length; // Base size

    // Check for heavy imports
    const imports = code.match(/import\s+.*\s+from\s+['"]([^'"]+)['"]/g) || [];
    imports.forEach(imp => {
      if (imp.includes('moment')) estimatedSize += 250000;
      if (imp.includes('lodash') && !imp.includes('lodash/')) estimatedSize += 70000;
      if (imp.includes('antd') && !imp.includes('antd/')) estimatedSize += 500000;
    });

    return {
      estimatedSize,
      heavyDependencies: imports.filter(imp =>
        imp.includes('moment') ||
        (imp.includes('lodash') && !imp.includes('lodash/'))
      )
    };
  }

  private checkPerformanceAntiPatterns(code: string): {
    issues: CodeIssue[];
    suggestions: Suggestion[];
  } {
    const issues: CodeIssue[] = [];
    const suggestions: Suggestion[] = [];

    // Check for inline styles in loops
    if (code.match(/\.map\([^)]*\)[^{]*{[^}]*style\s*=\s*{/)) {
      issues.push({
        severity: 'warning',
        type: 'performance',
        message: 'Avoid inline styles in loops - they create new objects on each render'
      });
    }

    // Check for missing React.memo on list items
    const listItemPattern = /\.map\([^)]*\)\s*=>\s*(?:<|\()/;
    if (code.match(listItemPattern) && !code.includes('memo')) {
      suggestions.push({
        type: 'optimize',
        priority: 'medium',
        description: 'Consider memoizing list items to prevent unnecessary re-renders',
        rationale: 'List items often re-render unnecessarily when parent state changes'
      });
    }

    // Check for large inline data
    const largeArrays = code.match(/\[[^\]]{500,}\]/g);
    if (largeArrays) {
      suggestions.push({
        type: 'optimize',
        priority: 'high',
        description: 'Move large data arrays outside of component',
        rationale: 'Large inline data is recreated on every render'
      });
    }

    return { issues, suggestions };
  }

  private analyzeRenderPerformance(code: string): any {
    let estimatedRenderCost = 0;

    // Base cost for component
    estimatedRenderCost += 1;

    // Cost for DOM elements
    const domElements = (code.match(/<\w+/g) || []).length;
    estimatedRenderCost += domElements * 0.1;

    // Cost for state updates
    const stateUpdates = (code.match(/setState|useState/g) || []).length;
    estimatedRenderCost += stateUpdates * 2;

    // Cost for effects
    const effects = (code.match(/useEffect|useLayoutEffect/g) || []).length;
    estimatedRenderCost += effects * 3;

    // Cost for complex calculations
    const calculations = (code.match(/\.reduce|\.sort|\.filter.*\.map/g) || []).length;
    estimatedRenderCost += calculations * 5;

    return {
      estimatedRenderCost,
      breakdown: {
        domElements,
        stateUpdates,
        effects,
        calculations
      }
    };
  }
}

// Advanced Accessibility Analyzer
export class AdvancedAccessibilityAnalyzer extends AnalysisModule {
  async analyze(context: AnalysisContext): Promise<any> {
    const { generation, metrics } = context;
    const issues: CodeIssue[] = [];
    const suggestions: Suggestion[] = [];

    // Static accessibility analysis
    const staticAnalysis = this.analyzeStaticAccessibility(generation.generatedCode);
    issues.push(...staticAnalysis.issues);
    suggestions.push(...staticAnalysis.suggestions);

    // ARIA analysis
    const ariaAnalysis = this.analyzeARIA(generation.generatedCode);
    issues.push(...ariaAnalysis.issues);

    // Keyboard navigation analysis
    const keyboardAnalysis = this.analyzeKeyboardNavigation(generation.generatedCode);
    suggestions.push(...keyboardAnalysis.suggestions);

    // Use actual metrics if available
    let accessibilityScore = 80; // Default
    if (metrics) {
      accessibilityScore = metrics.lighthouseScores.accessibility;
    }

    return {
      issues,
      suggestions,
      quality: {
        accessibility: accessibilityScore
      }
    };
  }

  private analyzeStaticAccessibility(code: string): {
    issues: CodeIssue[];
    suggestions: Suggestion[];
  } {
    const issues: CodeIssue[] = [];
    const suggestions: Suggestion[] = [];

    // Check for missing alt text
    const images = code.match(/<img[^>]*>/g) || [];
    images.forEach(img => {
      if (!img.includes('alt=')) {
        issues.push({
          severity: 'error',
          type: 'accessibility',
          message: 'Images must have alt text'
        });
      }
    });

    // Check for missing labels
    const inputs = code.match(/<input[^>]*>/g) || [];
    inputs.forEach(input => {
      if (!code.includes('<label') && !input.includes('aria-label')) {
        issues.push({
          severity: 'error',
          type: 'accessibility',
          message: 'Form inputs must have associated labels'
        });
      }
    });

    // Check for color contrast (simplified)
    if (code.match(/color:\s*#[0-9a-f]{3,6}/i)) {
      suggestions.push({
        type: 'accessibility',
        priority: 'medium',
        description: 'Verify color contrast ratios meet WCAG standards',
        rationale: 'Text should have a contrast ratio of at least 4.5:1 for normal text and 3:1 for large text'
      });
    }

    // Check for heading hierarchy
    const headings = code.match(/<h[1-6]/g) || [];
    if (headings.length > 1) {
      const headingLevels = headings.map(h => parseInt(h.charAt(2))).sort();
      for (let i = 1; i < headingLevels.length; i++) {
        if (headingLevels[i] - headingLevels[i-1] > 1) {
          issues.push({
            severity: 'warning',
            type: 'accessibility',
            message: 'Heading levels should not skip (e.g., h1 to h3)'
          });
          break;
        }
      }
    }

    return { issues, suggestions };
  }

  private analyzeARIA(code: string): { issues: CodeIssue[] } {
    const issues: CodeIssue[] = [];

    // Check for invalid ARIA roles
    const roleMatches = code.match(/role="([^"]*)"/g) || [];
    const validRoles = ['button', 'navigation', 'main', 'banner', 'contentinfo', 'form', 'search'];

    roleMatches.forEach(match => {
      const role = match.match(/role="([^"]*)"/)?.[1];
      if (role && !validRoles.includes(role)) {
        issues.push({
          severity: 'warning',
          type: 'accessibility',
          message: `"${role}" may not be a valid ARIA role`
        });
      }
    });

    // Check for aria-hidden on interactive elements
    if (code.match(/aria-hidden="true"[^>]*(?:button|input|a\s)/)) {
      issues.push({
        severity: 'error',
        type: 'accessibility',
        message: 'Interactive elements should not have aria-hidden="true"'
      });
    }

    return { issues };
  }

  private analyzeKeyboardNavigation(code: string): { suggestions: Suggestion[] } {
    const suggestions: Suggestion[] = [];

    // Check for click handlers without keyboard support
    const clickHandlers = code.match(/onClick/g) || [];
    const keyHandlers = code.match(/onKey/g) || [];

    if (clickHandlers.length > keyHandlers.length) {
      suggestions.push({
        type: 'accessibility',
        priority: 'high',
        description: 'Add keyboard event handlers for interactive elements',
        rationale: 'All functionality should be accessible via keyboard'
      });
    }

    // Check for custom interactive elements without tabIndex
    if (code.match(/<div[^>]*onClick/) && !code.includes('tabIndex')) {
      suggestions.push({
        type: 'accessibility',
        priority: 'high',
        description: 'Add tabIndex to custom interactive elements',
        rationale: 'Elements with onClick should be keyboard accessible'
      });
    }

    return { suggestions };
  }
}

// Advanced User Intent Analyzer
export class AdvancedUserIntentAnalyzer extends AnalysisModule {
  private intentPatterns = {
    'form': /form|input|submit|field|validation/i,
    'list': /list|items|array|map|collection/i,
    'modal': /modal|dialog|popup|overlay/i,
    'navigation': /nav|menu|sidebar|header|breadcrumb/i,
    'dashboard': /dashboard|chart|graph|metrics|analytics/i,
    'auth': /login|signup|auth|password|user/i,
    'data-display': /table|grid|card|display.*data/i,
    'interactive': /drag|drop|sort|resize|animate/i
  };

  async analyze(context: AnalysisContext): Promise<any> {
    const { generation, edits, knowledgeGraph } = context;

    // Analyze prompt intent
    const intentAnalysis = this.analyzePromptIntent(generation.prompt);

    // Analyze how well the generation matched intent
    const alignmentAnalysis = this.analyzeIntentAlignment(
      generation.prompt,
      generation.generatedCode,
      edits
    );

    // Get similar successful prompts
    const similarPrompts = knowledgeGraph.getSimilarSuccessfulPrompts(generation.prompt);

    // Generate prompt enhancements
    const enhancements = this.generatePromptEnhancements(
      generation.prompt,
      intentAnalysis,
      alignmentAnalysis,
      similarPrompts
    );

    return {
      intent: {
        primaryIntent: intentAnalysis.primaryIntent,
        confidence: intentAnalysis.confidence,
        missingContext: alignmentAnalysis.missingContext,
        suggestedPromptEnhancements: enhancements
      }
    };
  }

  private analyzePromptIntent(prompt: string): {
    primaryIntent: string;
    confidence: number;
    intents: Array<{ type: string; score: number }>;
  } {
    const intents: Array<{ type: string; score: number }> = [];

    // Score each intent pattern
    Object.entries(this.intentPatterns).forEach(([intent, pattern]) => {
      const matches = prompt.match(pattern);
      if (matches) {
        intents.push({
          type: intent,
          score: matches.length
        });
      }
    });

    // Sort by score
    intents.sort((a, b) => b.score - a.score);

    const primaryIntent = intents[0]?.type || 'general-ui';
    const confidence = intents[0]?.score ? Math.min(intents[0].score / 3, 1) : 0.5;

    return {
      primaryIntent,
      confidence,
      intents
    };
  }

  private analyzeIntentAlignment(
    prompt: string,
    code: string,
    edits: any[]
  ): {
    alignment: number;
    missingContext: string[];
  } {
    const missingContext: string[] = [];
    let alignment = 1.0;

    // Check if key terms from prompt appear in code
    const promptTerms = prompt.toLowerCase().split(/\s+/);
    const codeTerms = code.toLowerCase();

    promptTerms.forEach(term => {
      if (term.length > 4 && !codeTerms.includes(term)) {
        alignment -= 0.1;
      }
    });

    // Analyze edits to infer missing context
    if (edits.length > 0) {
      alignment -= edits.length * 0.1;

      // Common edit patterns indicate missing context
      const addedImports = edits.some(e =>
        e.diff.some((d: any) => d.type === 'add' && d.content.includes('import'))
      );
      if (addedImports) {
        missingContext.push('Required dependencies or imports');
      }

      const addedState = edits.some(e =>
        e.diff.some((d: any) => d.type === 'add' && d.content.includes('useState'))
      );
      if (addedState) {
        missingContext.push('State management requirements');
      }

      const addedStyles = edits.some(e =>
        e.diff.some((d: any) => d.type === 'add' && d.content.includes('className'))
      );
      if (addedStyles) {
        missingContext.push('Specific styling or layout requirements');
      }
    }

    return {
      alignment: Math.max(0, alignment),
      missingContext
    };
  }

  private generatePromptEnhancements(
    originalPrompt: string,
    intentAnalysis: any,
    alignmentAnalysis: any,
    similarPrompts: string[]
  ): string[] {
    const enhancements: string[] = [];

    // Based on intent type, suggest specific additions
    const intentEnhancements: Record<string, string[]> = {
      'form': [
        'Specify validation requirements',
        'Include field types and labels',
        'Mention submit behavior'
      ],
      'list': [
        'Specify data structure',
        'Include sorting/filtering needs',
        'Mention pagination requirements'
      ],
      'modal': [
        'Specify trigger mechanism',
        'Include close behavior',
        'Mention overlay/backdrop needs'
      ],
      'dashboard': [
        'Specify data sources',
        'Include refresh requirements',
        'Mention responsive layout needs'
      ]
    };

    const specificEnhancements = intentEnhancements[intentAnalysis.primaryIntent] || [];
    enhancements.push(...specificEnhancements);

    // Based on missing context
    if (alignmentAnalysis.missingContext.includes('State management requirements')) {
      enhancements.push('Specify what state needs to be managed and how it should update');
    }

    if (alignmentAnalysis.missingContext.includes('Specific styling or layout requirements')) {
      enhancements.push('Include specific design requirements (colors, spacing, layout)');
    }

    // Learn from similar successful prompts
    if (similarPrompts.length > 0) {
      // Extract common patterns from successful prompts
      const commonTerms = this.extractCommonTerms(similarPrompts);
      if (commonTerms.length > 0) {
        enhancements.push(`Consider including terms like: ${commonTerms.join(', ')}`);
      }
    }

    return enhancements.slice(0, 5); // Limit to top 5 suggestions
  }

  private extractCommonTerms(prompts: string[]): string[] {
    const termFrequency: Record<string, number> = {};

    prompts.forEach(prompt => {
      const terms = prompt.toLowerCase().split(/\s+/);
      terms.forEach(term => {
        if (term.length > 4) {
          termFrequency[term] = (termFrequency[term] || 0) + 1;
        }
      });
    });

    return Object.entries(termFrequency)
      .filter(([_, freq]) => freq >= prompts.length / 2)
      .map(([term]) => term)
      .slice(0, 3);
  }
}