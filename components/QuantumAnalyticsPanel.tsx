"use client";

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import {
    Activity,
    Atom,
    BarChart3,
    Brain,
    Cpu,
    Database,
    GitBranch,
    Layers,
    Network,
    Search,
    Sparkles,
    Target,
    TrendingUp,
    Zap
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface QuantumResult {
    analysisId: string;
    results: {
        primaryInsights: string[];
        quantumAdvantage: number;
        confidence: number;
        patterns?: any[];
        anomalies?: any[];
        predictions?: any[];
        optimizations?: any[];
        clusters?: any[];
    };
    metadata: {
        processingTime: number;
        quantumCircuitDepth: number;
        classicalEquivalentTime: number;
        energyEfficiency: number;
    };
    recommendations: string[];
    nextSteps: string[];
}

interface QuantumAnalyticsPanelProps {
    data?: any[];
    isOpen?: boolean;
    onClose?: () => void;
}

export default function QuantumAnalyticsPanel({
    data = [],
    isOpen = true,
    onClose
}: QuantumAnalyticsPanelProps) {
    const [analysisType, setAnalysisType] = useState<string>('pattern_recognition');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [results, setResults] = useState<QuantumResult | null>(null);
    const [quantumState, setQuantumState] = useState<'coherent' | 'superposition' | 'entangled' | 'decoherent'>('coherent');

    const analysisTypes = [
        {
            value: 'pattern_recognition',
            label: 'Pattern Recognition',
            icon: Network,
            description: 'Quantum interference patterns reveal hidden data relationships'
        },
        {
            value: 'anomaly_detection',
            label: 'Anomaly Detection',
            icon: Search,
            description: 'Quantum uncertainty principles improve detection accuracy'
        },
        {
            value: 'predictive_modeling',
            label: 'Predictive Modeling',
            icon: TrendingUp,
            description: 'Superposition enables parallel timeline analysis'
        },
        {
            value: 'optimization',
            label: 'Optimization',
            icon: Target,
            description: 'Quantum annealing identifies global optimization opportunities'
        },
        {
            value: 'clustering',
            label: 'Clustering',
            icon: GitBranch,
            description: 'Entanglement-based similarity metrics discover connections'
        }
    ];

    // Simulate quantum state evolution
    useEffect(() => {
        const interval = setInterval(() => {
            const states: Array<'coherent' | 'superposition' | 'entangled' | 'decoherent'> =
                ['coherent', 'superposition', 'entangled'];
            setQuantumState(states[Math.floor(Math.random() * states.length)]);
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    const handleAnalysis = async () => {
        setIsAnalyzing(true);
        setQuantumState('superposition');

        try {
            // Simulate quantum analysis with sample data if none provided
            const sampleData = data.length > 0 ? data : [
                { value: 10, timestamp: '2024-01-01' },
                { value: 15, timestamp: '2024-01-02' },
                { value: 12, timestamp: '2024-01-03' },
                { value: 18, timestamp: '2024-01-04' },
                { value: 25, timestamp: '2024-01-05' }
            ];

            const response = await fetch('/api/iris/quantum-analytics', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    dataSet: sampleData,
                    analysisType,
                    quantumParameters: {
                        superposition: true,
                        entanglement: true,
                        interferencePattern: 'constructive',
                        qubitDepth: 20
                    },
                    confidenceLevel: 0.85
                })
            });

            if (response.ok) {
                const result = await response.json();
                setResults(result);
                setQuantumState('entangled');
            } else {
                setQuantumState('decoherent');
            }
        } catch (error) {
            console.error('Quantum analysis failed:', error);
            setQuantumState('decoherent');
        } finally {
            setIsAnalyzing(false);
        }
    };

    const getQuantumStateColor = () => {
        switch (quantumState) {
            case 'coherent': return 'text-blue-400';
            case 'superposition': return 'text-purple-400';
            case 'entangled': return 'text-green-400';
            case 'decoherent': return 'text-red-400';
            default: return 'text-gray-400';
        }
    };

    const getQuantumStateIcon = () => {
        switch (quantumState) {
            case 'coherent': return <Atom className="w-4 h-4" />;
            case 'superposition': return <Layers className="w-4 h-4" />;
            case 'entangled': return <Network className="w-4 h-4" />;
            case 'decoherent': return <Zap className="w-4 h-4" />;
            default: return <Cpu className="w-4 h-4" />;
        }
    };

    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed inset-4 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center"
        >
            <Card className="w-full max-w-6xl h-full bg-slate-900/95 border-blue-500/30 text-white overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-b border-blue-500/30">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <Atom className="w-8 h-8 text-blue-400" />
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-0"
                                >
                                    <Sparkles className="w-8 h-8 text-purple-400 opacity-50" />
                                </motion.div>
                            </div>
                            <div>
                                <CardTitle className="text-2xl text-blue-300">Quantum Analytics Engine</CardTitle>
                                <div className="flex items-center gap-2 text-sm text-gray-400">
                                    <span>Status:</span>
                                    <div className={`flex items-center gap-1 ${getQuantumStateColor()}`}>
                                        {getQuantumStateIcon()}
                                        <span className="capitalize">{quantumState}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Badge variant="outline" className="border-blue-500/50 text-blue-300">
                                50 Qubits Available
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
                    <Tabs defaultValue="analysis" className="h-full flex flex-col">
                        <TabsList className="bg-slate-800/50 border border-slate-700/50">
                            <TabsTrigger value="analysis" className="data-[state=active]:bg-blue-600/20">
                                <BarChart3 className="w-4 h-4 mr-2" />
                                Analysis
                            </TabsTrigger>
                            <TabsTrigger value="results" className="data-[state=active]:bg-blue-600/20">
                                <Activity className="w-4 h-4 mr-2" />
                                Results
                            </TabsTrigger>
                            <TabsTrigger value="insights" className="data-[state=active]:bg-blue-600/20">
                                <Brain className="w-4 h-4 mr-2" />
                                Insights
                            </TabsTrigger>
                            <TabsTrigger value="quantum" className="data-[state=active]:bg-blue-600/20">
                                <Cpu className="w-4 h-4 mr-2" />
                                Quantum Metrics
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="analysis" className="flex-1 mt-4">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-blue-300">Analysis Configuration</h3>

                                    <div className="space-y-3">
                                        <label className="text-sm text-gray-300">Analysis Type</label>
                                        <Select value={analysisType} onValueChange={setAnalysisType}>
                                            <SelectTrigger className="bg-slate-800/50 border-slate-700/50">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="bg-slate-800 border-slate-700">
                                                {analysisTypes.map((type) => (
                                                    <SelectItem key={type.value} value={type.value}>
                                                        <div className="flex items-center gap-2">
                                                            <type.icon className="w-4 h-4" />
                                                            {type.label}
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
                                        <h4 className="font-medium text-blue-300 mb-2">Analysis Description</h4>
                                        <p className="text-sm text-gray-300">
                                            {analysisTypes.find(t => t.value === analysisType)?.description}
                                        </p>
                                    </div>

                                    <Button
                                        onClick={handleAnalysis}
                                        disabled={isAnalyzing}
                                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                                    >
                                        {isAnalyzing ? (
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                            >
                                                <Atom className="w-4 h-4 mr-2" />
                                            </motion.div>
                                        ) : (
                                            <Sparkles className="w-4 h-4 mr-2" />
                                        )}
                                        {isAnalyzing ? 'Processing Quantum Analysis...' : 'Run Quantum Analysis'}
                                    </Button>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-blue-300">Data Preview</h3>
                                    <div className="bg-slate-800/30 rounded-lg border border-slate-700/50 p-4 h-64">
                                        <ScrollArea className="h-full">
                                            {data.length > 0 ? (
                                                <pre className="text-xs text-gray-300">
                                                    {JSON.stringify(data.slice(0, 10), null, 2)}
                                                </pre>
                                            ) : (
                                                <div className="text-center text-gray-500 py-8">
                                                    <Database className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                                    <p>No data provided. Using sample dataset for demonstration.</p>
                                                </div>
                                            )}
                                        </ScrollArea>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="results" className="flex-1 mt-4">
                            {results ? (
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold text-blue-300">Primary Results</h3>
                                        <div className="space-y-3">
                                            {results.results.primaryInsights.map((insight, index) => (
                                                <motion.div
                                                    key={index}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: index * 0.1 }}
                                                    className="p-3 bg-blue-900/20 rounded-lg border border-blue-500/30"
                                                >
                                                    <p className="text-sm text-blue-100">{insight}</p>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold text-blue-300">Quantum Metrics</h3>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="p-3 bg-green-900/20 rounded-lg border border-green-500/30">
                                                <div className="text-lg font-bold text-green-300">
                                                    {results.results.quantumAdvantage.toFixed(1)}x
                                                </div>
                                                <div className="text-xs text-green-200">Quantum Advantage</div>
                                            </div>
                                            <div className="p-3 bg-purple-900/20 rounded-lg border border-purple-500/30">
                                                <div className="text-lg font-bold text-purple-300">
                                                    {(results.results.confidence * 100).toFixed(1)}%
                                                </div>
                                                <div className="text-xs text-purple-200">Confidence</div>
                                            </div>
                                            <div className="p-3 bg-orange-900/20 rounded-lg border border-orange-500/30">
                                                <div className="text-lg font-bold text-orange-300">
                                                    {results.metadata.processingTime}ms
                                                </div>
                                                <div className="text-xs text-orange-200">Processing Time</div>
                                            </div>
                                            <div className="p-3 bg-cyan-900/20 rounded-lg border border-cyan-500/30">
                                                <div className="text-lg font-bold text-cyan-300">
                                                    {results.metadata.quantumCircuitDepth}
                                                </div>
                                                <div className="text-xs text-cyan-200">Circuit Depth</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-500">
                                    <div className="text-center">
                                        <Atom className="w-16 h-16 mx-auto mb-4 opacity-50" />
                                        <p>Run a quantum analysis to see results</p>
                                    </div>
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="insights" className="flex-1 mt-4">
                            {results ? (
                                <ScrollArea className="h-full">
                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="text-lg font-semibold text-blue-300 mb-3">Recommendations</h3>
                                            <div className="space-y-2">
                                                {results.recommendations.map((rec, index) => (
                                                    <div key={index} className="p-3 bg-blue-900/10 rounded-lg border border-blue-500/20">
                                                        <p className="text-sm text-blue-100">{rec}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-semibold text-blue-300 mb-3">Next Steps</h3>
                                            <div className="space-y-2">
                                                {results.nextSteps.map((step, index) => (
                                                    <div key={index} className="p-3 bg-green-900/10 rounded-lg border border-green-500/20">
                                                        <p className="text-sm text-green-100">{step}</p>
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
                                        <p>Analysis insights will appear here</p>
                                    </div>
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="quantum" className="flex-1 mt-4">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-blue-300">Quantum State</h3>
                                    <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
                                        <div className="flex items-center gap-3 mb-4">
                                            <motion.div
                                                animate={{
                                                    scale: quantumState === 'superposition' ? [1, 1.2, 1] : 1,
                                                    rotate: quantumState === 'entangled' ? 360 : 0
                                                }}
                                                transition={{ duration: 1, repeat: Infinity }}
                                                className={getQuantumStateColor()}
                                            >
                                                {getQuantumStateIcon()}
                                            </motion.div>
                                            <span className={`font-medium ${getQuantumStateColor()}`}>
                                                {quantumState.charAt(0).toUpperCase() + quantumState.slice(1)}
                                            </span>
                                        </div>
                                        <div className="space-y-2 text-sm text-gray-300">
                                            <div className="flex justify-between">
                                                <span>Coherence Time:</span>
                                                <span className="text-blue-300">100μs</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Gate Error:</span>
                                                <span className="text-green-300">0.1%</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Readout Error:</span>
                                                <span className="text-yellow-300">0.5%</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-blue-300">Performance</h3>
                                    <div className="space-y-3">
                                        {results && (
                                            <>
                                                <div className="p-3 bg-slate-800/30 rounded border border-slate-700/50">
                                                    <div className="text-sm text-gray-300">Energy Efficiency</div>
                                                    <div className="text-lg font-bold text-green-300">
                                                        {(results.metadata.energyEfficiency * 100).toFixed(1)}%
                                                    </div>
                                                </div>
                                                <div className="p-3 bg-slate-800/30 rounded border border-slate-700/50">
                                                    <div className="text-sm text-gray-300">Classical Equivalent</div>
                                                    <div className="text-lg font-bold text-purple-300">
                                                        {results.metadata.classicalEquivalentTime.toFixed(0)}ms
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-blue-300">Resources</h3>
                                    <div className="space-y-3">
                                        <div className="p-3 bg-slate-800/30 rounded border border-slate-700/50">
                                            <div className="text-sm text-gray-300">Available Qubits</div>
                                            <div className="text-lg font-bold text-blue-300">50</div>
                                        </div>
                                        <div className="p-3 bg-slate-800/30 rounded border border-slate-700/50">
                                            <div className="text-sm text-gray-300">Queue Position</div>
                                            <div className="text-lg font-bold text-cyan-300">1st</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </motion.div>
    );
} 