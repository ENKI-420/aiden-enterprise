"use client";

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { motion } from 'framer-motion';
import {
    Brain,
    Cpu,
    GitMerge,
    Layers,
    Lightbulb,
    Network,
    Sparkles,
    Target,
    Zap
} from 'lucide-react';
import { useState } from 'react';

interface NeuralSynthesisInterfaceProps {
    isOpen?: boolean;
    onClose?: () => void;
}

interface SynthesisParameters {
    creativity: number;
    accuracy: number;
    speed: number;
    coherence: number;
}

interface SynthesisResult {
    synthesisId: string;
    results: {
        primaryOutput: any;
        confidence: number;
        novelty: number;
        coherence: number;
        modelContributions: {
            modelName: string;
            contribution: number;
            specialization: string;
        }[];
    };
    insights: {
        cognitivePatterns: string[];
        emergentProperties: string[];
        synthesis: string;
        reasoning: string[];
    };
    metadata: {
        modelsUsed: string[];
        computationTime: number;
        tokenCount: number;
        energyEfficiency: number;
    };
}

export default function NeuralSynthesisInterface({
    isOpen = true,
    onClose
}: NeuralSynthesisInterfaceProps) {
    const [inputText, setInputText] = useState('');
    const [synthesisType, setSynthesisType] = useState<string>('multi_modal_fusion');
    const [primaryModel, setPrimaryModel] = useState<string>('gpt-4-turbo');
    const [secondaryModels, setSecondaryModels] = useState<string[]>(['claude-3-opus']);
    const [parameters, setParameters] = useState<SynthesisParameters>({
        creativity: 70,
        accuracy: 80,
        speed: 60,
        coherence: 90
    });
    const [isProcessing, setIsProcessing] = useState(false);
    const [results, setResults] = useState<SynthesisResult | null>(null);

    const synthesisTypes = [
        {
            id: 'multi_modal_fusion',
            name: 'Multi-Modal Fusion',
            icon: GitMerge,
            description: 'Combines multiple AI models for synergistic intelligence',
            color: 'from-blue-500 to-cyan-500'
        },
        {
            id: 'cognitive_enhancement',
            name: 'Cognitive Enhancement',
            icon: Brain,
            description: 'Amplifies reasoning capabilities through metacognitive processing',
            color: 'from-purple-500 to-pink-500'
        },
        {
            id: 'creative_synthesis',
            name: 'Creative Synthesis',
            icon: Lightbulb,
            description: 'Generates novel solutions through AI-human creative collaboration',
            color: 'from-yellow-500 to-orange-500'
        },
        {
            id: 'decision_support',
            name: 'Decision Support',
            icon: Target,
            description: 'Leverages multiple AI perspectives for optimal decision-making',
            color: 'from-green-500 to-emerald-500'
        },
        {
            id: 'knowledge_distillation',
            name: 'Knowledge Distillation',
            icon: Layers,
            description: 'Preserves essential information while reducing complexity',
            color: 'from-indigo-500 to-purple-500'
        }
    ];

    const availableModels = [
        { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', specialty: 'General Reasoning', strength: 95 },
        { id: 'claude-3-opus', name: 'Claude 3 Opus', specialty: 'Creative Writing', strength: 92 },
        { id: 'palm-2', name: 'PaLM 2', specialty: 'Mathematical Reasoning', strength: 88 },
        { id: 'llama-2-70b', name: 'LLaMA 2 70B', specialty: 'Efficiency', strength: 85 },
        { id: 'iris-custom', name: 'IRIS Custom', specialty: 'Domain Expertise', strength: 90 }
    ];

    const handleSynthesis = async () => {
        setIsProcessing(true);
        try {
            const response = await fetch('/api/iris/neural-synthesis', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    inputs: {
                        text: inputText,
                        context: 'IRIS-AI Enterprise Platform',
                        constraints: ['enterprise-grade', 'production-ready', 'scalable']
                    },
                    synthesisType,
                    models: {
                        primary: primaryModel,
                        secondary: secondaryModels,
                        ensembleMethod: 'stacking'
                    },
                    parameters: {
                        creativity: parameters.creativity / 100,
                        accuracy: parameters.accuracy / 100,
                        speed: parameters.speed / 100,
                        coherence: parameters.coherence / 100
                    },
                    outputFormat: 'structured'
                })
            });

            if (response.ok) {
                const result = await response.json();
                setResults(result);
            }
        } catch (error) {
            console.error('Neural synthesis failed:', error);
        } finally {
            setIsProcessing(false);
        }
    };

    const updateParameter = (key: keyof SynthesisParameters, value: number[]) => {
        setParameters(prev => ({ ...prev, [key]: value[0] }));
    };

    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed inset-4 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center"
        >
            <Card className="w-full max-w-7xl h-full bg-slate-900/95 border-purple-500/30 text-white overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-b border-purple-500/30">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                            >
                                <Network className="w-8 h-8 text-purple-400" />
                            </motion.div>
                            <div>
                                <CardTitle className="text-2xl text-purple-300">Neural Synthesis Engine</CardTitle>
                                <p className="text-sm text-gray-400">Multi-model AI fusion for enhanced intelligence</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Badge variant="outline" className="border-purple-500/50 text-purple-300">
                                5 Models Available
                            </Badge>
                            {onClose && (
                                <Button variant="ghost" onClick={onClose} className="text-gray-400 hover:text-white">
                                    ×
                                </Button>
                            )}
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="p-6 h-full overflow-hidden">
                    <Tabs defaultValue="configure" className="h-full flex flex-col">
                        <TabsList className="bg-slate-800/50 border border-slate-700/50">
                            <TabsTrigger value="configure">
                                <Cpu className="w-4 h-4 mr-2" />
                                Configure
                            </TabsTrigger>
                            <TabsTrigger value="results">
                                <Sparkles className="w-4 h-4 mr-2" />
                                Results
                            </TabsTrigger>
                            <TabsTrigger value="insights">
                                <Brain className="w-4 h-4 mr-2" />
                                Insights
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="configure" className="flex-1 mt-4">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-lg font-semibold text-purple-300 mb-4">Synthesis Type</h3>
                                        <div className="grid grid-cols-1 gap-3">
                                            {synthesisTypes.map((type) => (
                                                <motion.div
                                                    key={type.id}
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${synthesisType === type.id
                                                        ? 'border-purple-500/50 bg-purple-900/20'
                                                        : 'border-slate-700/50 bg-slate-800/30 hover:border-purple-500/30'
                                                        }`}
                                                    onClick={() => setSynthesisType(type.id)}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className={`p-2 rounded-lg bg-gradient-to-r ${type.color}`}>
                                                            <type.icon className="w-5 h-5 text-white" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <h4 className="font-medium text-white">{type.name}</h4>
                                                            <p className="text-sm text-gray-400">{type.description}</p>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-semibold text-purple-300 mb-4">Input Text</h3>
                                        <Textarea
                                            value={inputText}
                                            onChange={(e) => setInputText(e.target.value)}
                                            placeholder="Enter your text for neural synthesis processing..."
                                            className="min-h-32 bg-slate-800/50 border-slate-700/50 text-white"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-lg font-semibold text-purple-300 mb-4">Model Selection</h3>
                                        <div className="space-y-3">
                                            <div>
                                                <label className="text-sm text-gray-300 mb-2 block">Primary Model</label>
                                                <div className="space-y-2">
                                                    {availableModels.map((model) => (
                                                        <motion.div
                                                            key={model.id}
                                                            whileHover={{ scale: 1.01 }}
                                                            className={`p-3 rounded-lg border cursor-pointer transition-all ${primaryModel === model.id
                                                                ? 'border-purple-500/50 bg-purple-900/20'
                                                                : 'border-slate-700/50 bg-slate-800/30 hover:border-purple-500/30'
                                                                }`}
                                                            onClick={() => setPrimaryModel(model.id)}
                                                        >
                                                            <div className="flex items-center justify-between">
                                                                <div>
                                                                    <div className="font-medium text-white">{model.name}</div>
                                                                    <div className="text-sm text-gray-400">{model.specialty}</div>
                                                                </div>
                                                                <div className="text-right">
                                                                    <div className="text-sm font-medium text-purple-300">
                                                                        {model.strength}%
                                                                    </div>
                                                                    <div className="text-xs text-gray-400">Strength</div>
                                                                </div>
                                                            </div>
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-semibold text-purple-300 mb-4">Synthesis Parameters</h3>
                                        <div className="space-y-4">
                                            {Object.entries(parameters).map(([key, value]) => (
                                                <div key={key} className="space-y-2">
                                                    <div className="flex justify-between items-center">
                                                        <label className="text-sm text-gray-300 capitalize">
                                                            {key.replace(/([A-Z])/g, ' $1').trim()}
                                                        </label>
                                                        <span className="text-sm font-medium text-purple-300">{value}%</span>
                                                    </div>
                                                    <Slider
                                                        value={[value]}
                                                        onValueChange={(val) => updateParameter(key as keyof SynthesisParameters, val)}
                                                        max={100}
                                                        step={5}
                                                        className="w-full"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <Button
                                        onClick={handleSynthesis}
                                        disabled={isProcessing || !inputText.trim()}
                                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                                    >
                                        {isProcessing ? (
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                            >
                                                <Zap className="w-4 h-4 mr-2" />
                                            </motion.div>
                                        ) : (
                                            <Sparkles className="w-4 h-4 mr-2" />
                                        )}
                                        {isProcessing ? 'Processing Neural Synthesis...' : 'Run Neural Synthesis'}
                                    </Button>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="results" className="flex-1 mt-4">
                            {results ? (
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold text-purple-300">Synthesis Results</h3>
                                        <ScrollArea className="h-96">
                                            <div className="space-y-4">
                                                <div className="p-4 bg-purple-900/20 rounded-lg border border-purple-500/30">
                                                    <h4 className="font-medium text-purple-300 mb-2">Primary Output</h4>
                                                    <p className="text-sm text-gray-300">
                                                        {typeof results.results.primaryOutput === 'string'
                                                            ? results.results.primaryOutput
                                                            : JSON.stringify(results.results.primaryOutput, null, 2)}
                                                    </p>
                                                </div>

                                                <div className="grid grid-cols-3 gap-3">
                                                    <div className="p-3 bg-blue-900/20 rounded-lg border border-blue-500/30">
                                                        <div className="text-lg font-bold text-blue-300">
                                                            {(results.results.confidence * 100).toFixed(1)}%
                                                        </div>
                                                        <div className="text-xs text-blue-200">Confidence</div>
                                                    </div>
                                                    <div className="p-3 bg-yellow-900/20 rounded-lg border border-yellow-500/30">
                                                        <div className="text-lg font-bold text-yellow-300">
                                                            {(results.results.novelty * 100).toFixed(1)}%
                                                        </div>
                                                        <div className="text-xs text-yellow-200">Novelty</div>
                                                    </div>
                                                    <div className="p-3 bg-green-900/20 rounded-lg border border-green-500/30">
                                                        <div className="text-lg font-bold text-green-300">
                                                            {(results.results.coherence * 100).toFixed(1)}%
                                                        </div>
                                                        <div className="text-xs text-green-200">Coherence</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </ScrollArea>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold text-purple-300">Model Contributions</h3>
                                        <div className="space-y-3">
                                            {results.results.modelContributions.map((contrib, index) => (
                                                <motion.div
                                                    key={index}
                                                    initial={{ opacity: 0, x: 20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: index * 0.1 }}
                                                    className="p-3 bg-slate-800/30 rounded-lg border border-slate-700/50"
                                                >
                                                    <div className="flex justify-between items-center mb-2">
                                                        <span className="font-medium text-white">{contrib.modelName}</span>
                                                        <span className="text-sm text-purple-300">
                                                            {(contrib.contribution * 100).toFixed(1)}%
                                                        </span>
                                                    </div>
                                                    <div className="text-sm text-gray-400">{contrib.specialization}</div>
                                                    <div className="w-full bg-slate-700/50 rounded-full h-2 mt-2">
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${contrib.contribution * 100}%` }}
                                                            transition={{ duration: 1, delay: index * 0.1 }}
                                                            className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                                                        />
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-500">
                                    <div className="text-center">
                                        <Network className="w-16 h-16 mx-auto mb-4 opacity-50" />
                                        <p>Run neural synthesis to see results</p>
                                    </div>
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="insights" className="flex-1 mt-4">
                            {results ? (
                                <ScrollArea className="h-full">
                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="text-lg font-semibold text-purple-300 mb-3">Synthesis Overview</h3>
                                            <div className="p-4 bg-purple-900/20 rounded-lg border border-purple-500/30">
                                                <p className="text-sm text-purple-100">{results.insights.synthesis}</p>
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-semibold text-purple-300 mb-3">Cognitive Patterns</h3>
                                            <div className="space-y-2">
                                                {results.insights.cognitivePatterns.map((pattern, index) => (
                                                    <div key={index} className="p-3 bg-blue-900/10 rounded-lg border border-blue-500/20">
                                                        <p className="text-sm text-blue-100">{pattern}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-semibold text-purple-300 mb-3">Emergent Properties</h3>
                                            <div className="space-y-2">
                                                {results.insights.emergentProperties.map((property, index) => (
                                                    <div key={index} className="p-3 bg-green-900/10 rounded-lg border border-green-500/20">
                                                        <p className="text-sm text-green-100">{property}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-semibold text-purple-300 mb-3">Reasoning Chain</h3>
                                            <div className="space-y-2">
                                                {results.insights.reasoning.map((step, index) => (
                                                    <div key={index} className="p-3 bg-orange-900/10 rounded-lg border border-orange-500/20">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-xs font-bold text-orange-300">Step {index + 1}:</span>
                                                            <p className="text-sm text-orange-100">{step}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </ScrollArea>
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-500">
                                    <div className="text-center">
                                        <Brain className="w-16 h-16 mx-auto mb-4 opacity-50" />
                                        <p>Synthesis insights will appear here</p>
                                    </div>
                                </div>
                            )}
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </motion.div>
    );
} 