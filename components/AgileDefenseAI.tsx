"use client";

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
    AlertCircle,
    Brain,
    CheckCircle,
    Code,
    Lightbulb,
    RefreshCw,
    Shield,
    Sparkles,
    TrendingUp,
    Zap
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

// Import our AI reflection system
import {
    AdvancedAccessibilityAnalyzer,
    AdvancedCodeQualityAnalyzer,
    AdvancedPerformanceAnalyzer,
    AdvancedUserIntentAnalyzer
} from '@/lib/ai-reflection/analyzers';
import { ReflectionEngine } from '@/lib/ai-reflection/core';
import { DataIngestionPipeline, InMemoryDataStore } from '@/lib/ai-reflection/data-ingestion';
import { ModelManager } from '@/lib/ai-reflection/ml-models';

interface GenerationResult {
  id: string;
  prompt: string;
  code: string;
  quality: number;
  issues: any[];
  suggestions: any[];
  predictions: {
    quality: any;
    edits: any;
    refactorings: any;
  };
}

export default function AgileDefenseAI() {
  const [prompt, setPrompt] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentGeneration, setCurrentGeneration] = useState<GenerationResult | null>(null);
  const [history, setHistory] = useState<GenerationResult[]>([]);

  // Initialize AI systems
  const [reflectionEngine] = useState(() => new ReflectionEngine());
  const [dataStore] = useState(() => new InMemoryDataStore());
  const [dataPipeline] = useState(() => new DataIngestionPipeline(dataStore));
  const [modelManager] = useState(() => new ModelManager());

  // Register advanced analyzers
  useEffect(() => {
    reflectionEngine.registerModule('advanced-quality', new AdvancedCodeQualityAnalyzer());
    reflectionEngine.registerModule('advanced-performance', new AdvancedPerformanceAnalyzer());
    reflectionEngine.registerModule('advanced-accessibility', new AdvancedAccessibilityAnalyzer());
    reflectionEngine.registerModule('advanced-intent', new AdvancedUserIntentAnalyzer());
  }, [reflectionEngine]);

  const generateCode = useCallback(async () => {
    if (!prompt.trim()) return;

    setIsAnalyzing(true);

    try {
      // Step 1: Predict quality before generation
      const qualityPrediction = await modelManager.predictQuality(prompt);

      // Step 2: Generate code (mock for demo)
      const mockGeneratedCode = generateMockCode(prompt);
      setGeneratedCode(mockGeneratedCode);

      // Step 3: Log generation
      const generation = await dataPipeline.logGeneration(
        prompt,
        mockGeneratedCode,
        'v1.0.0',
        'demo-session',
        'demo-user'
      );

      // Step 4: Run reflection analysis
      const reflectionResult = await reflectionEngine.analyze(generation);

      // Step 5: Predict likely edits
      const editPrediction = await modelManager.predictEdits(generation);

      // Step 6: Get refactoring suggestions
      const refactorings = await modelManager.suggestRefactorings(
        mockGeneratedCode,
        reflectionResult.issues,
        reflectionResult.quality.score
      );

      // Create result
      const result: GenerationResult = {
        id: generation.id,
        prompt,
        code: mockGeneratedCode,
        quality: reflectionResult.quality.score,
        issues: reflectionResult.issues,
        suggestions: reflectionResult.suggestions,
        predictions: {
          quality: qualityPrediction,
          edits: editPrediction,
          refactorings
        }
      };

      setCurrentGeneration(result);
      setHistory(prev => [result, ...prev.slice(0, 9)]);

    } catch (error) {
      console.error('Generation failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  }, [prompt, dataPipeline, reflectionEngine, modelManager]);

  const applyRefactoring = useCallback((refactoringCode: string) => {
    setGeneratedCode(refactoringCode);
    // Log the edit
    if (currentGeneration) {
      dataPipeline.logUserEdit(
        currentGeneration.id,
        currentGeneration.code,
        refactoringCode,
        Date.now() - new Date(currentGeneration.id.split('_')[1]).getTime()
      );
    }
  }, [currentGeneration, dataPipeline]);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-6 h-6" />
            Agile Defense Systems AI Coding Suite
          </CardTitle>
          <CardDescription>
            Self-correcting AI with real-time code analysis, quality prediction, and automated optimization
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5" />
              Code Generation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Describe the component you want to create..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[150px]"
            />

            {/* Quality Prediction */}
            {prompt && currentGeneration?.predictions.quality && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Quality Prediction</AlertTitle>
                <AlertDescription>
                  <div className="space-y-2 mt-2">
                    <div className="flex justify-between items-center">
                      <span>Predicted Quality:</span>
                      <Badge variant={
                        currentGeneration.predictions.quality.predictedQuality > 70 ? 'default' : 'destructive'
                      }>
                        {currentGeneration.predictions.quality.predictedQuality}%
                      </Badge>
                    </div>
                    <Progress value={currentGeneration.predictions.quality.predictedQuality} />
                    {currentGeneration.predictions.quality.riskFactors.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm font-medium">Risk Factors:</p>
                        <ul className="text-sm list-disc list-inside">
                          {currentGeneration.predictions.quality.riskFactors.map((risk, i) => (
                            <li key={i}>{risk}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </AlertDescription>
              </Alert>
            )}

            <Button
              onClick={generateCode}
              disabled={isAnalyzing || !prompt.trim()}
              className="w-full"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate & Analyze
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Analysis Results */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Real-time Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            {currentGeneration ? (
              <Tabs defaultValue="quality" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="quality">Quality</TabsTrigger>
                  <TabsTrigger value="issues">Issues</TabsTrigger>
                  <TabsTrigger value="predictions">Predictions</TabsTrigger>
                  <TabsTrigger value="optimize">Optimize</TabsTrigger>
                </TabsList>

                <TabsContent value="quality" className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Overall Quality Score</span>
                      <Badge variant={currentGeneration.quality > 80 ? 'default' :
                                     currentGeneration.quality > 60 ? 'secondary' : 'destructive'}>
                        {currentGeneration.quality}%
                      </Badge>
                    </div>
                    <Progress value={currentGeneration.quality} />
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium">Quality Factors:</p>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm">Maintainability</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm">Performance</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm">Accessibility</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm">Best Practices</span>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="issues" className="space-y-2">
                  <ScrollArea className="h-[300px]">
                    {currentGeneration.issues.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No issues detected!</p>
                    ) : (
                      <div className="space-y-2">
                        {currentGeneration.issues.map((issue, i) => (
                          <Alert key={i} variant={issue.severity === 'error' ? 'destructive' : 'default'}>
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>{issue.type}</AlertTitle>
                            <AlertDescription>{issue.message}</AlertDescription>
                          </Alert>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="predictions" className="space-y-4">
                  <div>
                    <p className="text-sm font-medium mb-2">Likely User Edits:</p>
                    <div className="space-y-2">
                      {currentGeneration.predictions.edits.likelyEdits.map((edit, i) => (
                        <div key={i} className="flex items-center justify-between p-2 bg-muted rounded">
                          <span className="text-sm">{edit.description}</span>
                          <Badge variant="outline">{Math.round(edit.probability * 100)}%</Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium">Edit Probability:</p>
                    <Progress value={currentGeneration.predictions.edits.editProbability * 100} />
                  </div>
                </TabsContent>

                <TabsContent value="optimize" className="space-y-4">
                  <div className="space-y-2">
                    {currentGeneration.predictions.refactorings.refactorings.map((ref, i) => (
                      <Card key={i}>
                        <CardHeader>
                          <CardTitle className="text-sm flex items-center gap-2">
                            <Zap className="w-4 h-4" />
                            {ref.description}
                          </CardTitle>
                          <CardDescription>
                            Impact: <Badge variant={ref.impact === 'high' ? 'destructive' :
                                                  ref.impact === 'medium' ? 'secondary' : 'outline'}>
                              {ref.impact}
                            </Badge>
                            <span className="ml-2">+{ref.estimatedQualityGain}% quality</span>
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Button
                            size="sm"
                            onClick={() => applyRefactoring(ref.code)}
                            className="w-full"
                          >
                            Apply Refactoring
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                Generate code to see analysis results
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Generated Code */}
      {generatedCode && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="w-5 h-5" />
              Generated Code
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px]">
              <pre className="text-sm">
                <code>{generatedCode}</code>
              </pre>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {/* Suggestions */}
      {currentGeneration && currentGeneration.suggestions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5" />
              AI Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {currentGeneration.suggestions.slice(0, 5).map((suggestion, i) => (
                <Alert key={i}>
                  <Lightbulb className="h-4 w-4" />
                  <AlertTitle>
                    {suggestion.description}
                    <Badge className="ml-2" variant={
                      suggestion.priority === 'high' ? 'destructive' :
                      suggestion.priority === 'medium' ? 'secondary' : 'outline'
                    }>
                      {suggestion.priority}
                    </Badge>
                  </AlertTitle>
                  <AlertDescription>{suggestion.rationale}</AlertDescription>
                </Alert>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Mock code generation function
function generateMockCode(prompt: string): string {
  // Simple mock implementation
  const isForm = /form|input|submit/i.test(prompt);
  const isList = /list|items|map/i.test(prompt);
  const isModal = /modal|dialog|popup/i.test(prompt);

  if (isForm) {
    return `import React, { useState } from 'react';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          className="w-full px-3 py-2 border rounded"
        />
      </div>
      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          className="w-full px-3 py-2 border rounded"
        />
      </div>
      <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
        Submit
      </button>
    </form>
  );
}`;
  }

  if (isList) {
    return `import React from 'react';

export default function ItemList({ items }) {
  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div key={index} className="p-4 border rounded">
          <h3 className="font-bold">{item.title}</h3>
          <p>{item.description}</p>
        </div>
      ))}
    </div>
  );
}`;
  }

  if (isModal) {
    return `import React from 'react';

export default function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <button onClick={onClose} className="float-right text-gray-500">×</button>
        {children}
      </div>
    </div>
  );
}`;
  }

  // Default component
  return `import React from 'react';

export default function Component() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Generated Component</h1>
      <p>This component was generated based on your prompt.</p>
    </div>
  );
}`;
}