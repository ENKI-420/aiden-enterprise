"use client";

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { createAIRequest, unifiedAIOrchestrator } from '@/lib/ai-orchestration/unified-orchestrator';
import { AnimatePresence, motion } from 'framer-motion';
import {
    Activity,
    BarChart3,
    Brain,
    CheckCircle,
    Clock,
    Cpu,
    FlaskConical,
    Layers,
    MonitorCheck,
    Network,
    Play,
    Plus,
    Settings,
    Zap
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface AgentBlueprint {
    id: string;
    name: string;
    type: 'cognitive' | 'reactive' | 'hybrid' | 'swarm' | 'specialist';
    description: string;
    capabilities: string[];
    models: string[];
    parameters: {
        autonomy: number;
        creativity: number;
        precision: number;
        collaboration: number;
        learning: number;
    };
    status: 'draft' | 'testing' | 'deployed' | 'retired';
    performance: {
        successRate: number;
        averageResponseTime: number;
        resourceUsage: number;
        userRating: number;
    };
}

interface TestScenario {
    id: string;
    name: string;
    description: string;
    domain: 'healthcare' | 'defense' | 'legal' | 'research' | 'general';
    difficulty: 'basic' | 'intermediate' | 'advanced' | 'expert';
    inputs: any[];
    expectedOutputs: any[];
    constraints: string[];
    metrics: string[];
}

interface AgentExecution {
    id: string;
    agentId: string;
    scenarioId: string;
    status: 'running' | 'completed' | 'failed' | 'paused';
    startTime: Date;
    endTime?: Date;
    results: any;
    metrics: {
        executionTime: number;
        accuracy: number;
        efficiency: number;
        resourceUsage: number;
    };
    logs: string[];
}

export default function AgentLaboratory() {
    const [activeTab, setActiveTab] = useState('blueprints');
    const [agents, setAgents] = useState<AgentBlueprint[]>([]);
    const [scenarios, setScenarios] = useState<TestScenario[]>([]);
    const [executions, setExecutions] = useState<AgentExecution[]>([]);
    const [selectedAgent, setSelectedAgent] = useState<AgentBlueprint | null>(null);
    const [selectedScenario, setSelectedScenario] = useState<TestScenario | null>(null);
    const [isCreatingAgent, setIsCreatingAgent] = useState(false);
    const [newAgent, setNewAgent] = useState<Partial<AgentBlueprint>>({
        name: '',
        type: 'cognitive',
        description: '',
        capabilities: [],
        models: ['gpt-4-turbo'],
        parameters: {
            autonomy: 50,
            creativity: 50,
            precision: 70,
            collaboration: 60,
            learning: 50
        }
    });

    // Initialize with sample data
    useEffect(() => {
        setAgents([
            {
                id: 'agent-001',
                name: 'IRIS Medical Specialist',
                type: 'specialist',
                description: 'Advanced medical AI agent specialized in diagnostic assistance',
                capabilities: ['diagnosis', 'treatment_planning', 'drug_interaction'],
                models: ['iris-medical', 'gpt-4-turbo'],
                parameters: { autonomy: 70, creativity: 40, precision: 95, collaboration: 80, learning: 75 },
                status: 'deployed',
                performance: { successRate: 94.2, averageResponseTime: 1.8, resourceUsage: 65, userRating: 4.7 }
            }
        ]);

        setScenarios([
            {
                id: 'scenario-001',
                name: 'Emergency Diagnosis',
                description: 'Critical patient diagnosis under time pressure with limited information',
                domain: 'healthcare',
                difficulty: 'expert',
                inputs: [
                    { type: 'symptoms', data: ['chest pain', 'shortness of breath', 'diaphoresis'] },
                    { type: 'vitals', data: { hr: 120, bp: '90/60', temp: 98.6, spo2: 92 } },
                    { type: 'history', data: ['diabetes', 'hypertension', 'smoking'] }
                ],
                expectedOutputs: [
                    { type: 'diagnosis', confidence: 0.85 },
                    { type: 'urgency', level: 'critical' },
                    { type: 'recommendations', actions: ['ECG', 'cardiac enzymes', 'chest x-ray'] }
                ],
                constraints: ['<5min response time', 'confidence >80%', 'HIPAA compliant'],
                metrics: ['accuracy', 'response_time', 'confidence', 'completeness']
            },
            {
                id: 'scenario-002',
                name: 'Threat Pattern Analysis',
                description: 'Identify emerging security threats from multiple intelligence sources',
                domain: 'defense',
                difficulty: 'advanced',
                inputs: [
                    { type: 'signals', data: 'encrypted_communications' },
                    { type: 'movements', data: 'satellite_imagery' },
                    { type: 'chatter', data: 'social_media_analysis' }
                ],
                expectedOutputs: [
                    { type: 'threat_level', assessment: 'medium-high' },
                    { type: 'recommendations', actions: ['increase_surveillance', 'alert_allies'] }
                ],
                constraints: ['classified_handling', 'multi_source_correlation', 'real_time_processing'],
                metrics: ['accuracy', 'correlation_strength', 'false_positive_rate']
            }
        ]);
    }, []);

    const handleCreateAgent = () => {
        if (!newAgent.name || !newAgent.description) return;

        const agent: AgentBlueprint = {
            id: `agent-${Date.now()}`,
            name: newAgent.name,
            type: newAgent.type || 'cognitive',
            description: newAgent.description,
            capabilities: newAgent.capabilities || [],
            models: newAgent.models || ['gpt-4-turbo'],
            parameters: newAgent.parameters || {
                autonomy: 50, creativity: 50, precision: 70, collaboration: 60, learning: 50
            },
            status: 'draft',
            performance: { successRate: 0, averageResponseTime: 0, resourceUsage: 0, userRating: 0 }
        };

        setAgents(prev => [...prev, agent]);
        setIsCreatingAgent(false);
        setNewAgent({
            name: '', type: 'cognitive', description: '', capabilities: [], models: ['gpt-4-turbo'],
            parameters: { autonomy: 50, creativity: 50, precision: 70, collaboration: 60, learning: 50 }
        });
    };

    const handleTestAgent = async (agent: AgentBlueprint, scenario: TestScenario) => {
        const executionId = `exec-${Date.now()}`;

        const execution: AgentExecution = {
            id: executionId,
            agentId: agent.id,
            scenarioId: scenario.id,
            status: 'running',
            startTime: new Date(),
            results: null,
            metrics: { executionTime: 0, accuracy: 0, efficiency: 0, resourceUsage: 0 },
            logs: [`Started execution of ${agent.name} on ${scenario.name}`]
        };

        setExecutions(prev => [...prev, execution]);

        try {
            // Create AI request using the unified orchestrator
            const aiRequest = createAIRequest(
                scenario.domain as any,
                JSON.stringify(scenario.inputs),
                'high',
                {
                    accuracy: agent.parameters.precision / 100,
                    speed: (100 - agent.parameters.precision) / 100,
                    creativity: agent.parameters.creativity / 100
                },
                true
            );

            const startTime = Date.now();
            const response = await unifiedAIOrchestrator.processRequest(aiRequest);
            const executionTime = Date.now() - startTime;

            // Update execution with results
            setExecutions(prev => prev.map(exec =>
                exec.id === executionId ? {
                    ...exec,
                    status: 'completed',
                    endTime: new Date(),
                    results: response,
                    metrics: {
                        executionTime,
                        accuracy: response.confidence * 100,
                        efficiency: (1000 / executionTime) * 100,
                        resourceUsage: Math.random() * 30 + 40 // Simulated
                    },
                    logs: [
                        ...exec.logs,
                        `Model used: ${response.modelUsed}`,
                        `Execution time: ${executionTime}ms`,
                        `Confidence: ${(response.confidence * 100).toFixed(1)}%`,
                        'Execution completed successfully'
                    ]
                } : exec
            ));

        } catch (error) {
            setExecutions(prev => prev.map(exec =>
                exec.id === executionId ? {
                    ...exec,
                    status: 'failed',
                    endTime: new Date(),
                    logs: [...exec.logs, `Error: ${error instanceof Error ? error.message : 'Unknown error'}`]
                } : exec
            ));
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'deployed': return 'bg-green-500/20 text-green-300 border-green-500/50';
            case 'testing': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50';
            case 'draft': return 'bg-gray-500/20 text-gray-300 border-gray-500/50';
            case 'running': return 'bg-blue-500/20 text-blue-300 border-blue-500/50';
            case 'completed': return 'bg-green-500/20 text-green-300 border-green-500/50';
            case 'failed': return 'bg-red-500/20 text-red-300 border-red-500/50';
            default: return 'bg-gray-500/20 text-gray-300 border-gray-500/50';
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'cognitive': return Brain;
            case 'reactive': return Zap;
            case 'hybrid': return Network;
            case 'swarm': return Layers;
            case 'specialist': return MonitorCheck;
            default: return Cpu;
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                        >
                            <FlaskConical className="w-8 h-8 text-purple-400" />
                        </motion.div>
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                Agent Laboratory
                            </h1>
                            <p className="text-gray-400">Advanced AI Agent Development & Testing Environment</p>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Card className="bg-slate-900/50 border-purple-500/30">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-400">Active Agents</p>
                                        <p className="text-2xl font-bold text-purple-300">{agents.filter(a => a.status === 'deployed').length}</p>
                                    </div>
                                    <Activity className="w-8 h-8 text-purple-400" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-slate-900/50 border-blue-500/30">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-400">Test Scenarios</p>
                                        <p className="text-2xl font-bold text-blue-300">{scenarios.length}</p>
                                    </div>
                                    <FlaskConical className="w-8 h-8 text-blue-400" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-slate-900/50 border-green-500/30">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-400">Success Rate</p>
                                        <p className="text-2xl font-bold text-green-300">
                                            {agents.length > 0 ?
                                                (agents.reduce((sum, a) => sum + a.performance.successRate, 0) / agents.length).toFixed(1)
                                                : '0'
                                            }%
                                        </p>
                                    </div>
                                    <CheckCircle className="w-8 h-8 text-green-400" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-slate-900/50 border-orange-500/30">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-400">Running Tests</p>
                                        <p className="text-2xl font-bold text-orange-300">{executions.filter(e => e.status === 'running').length}</p>
                                    </div>
                                    <Clock className="w-8 h-8 text-orange-400" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Main Content */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                    <TabsList className="bg-slate-800/50 border border-slate-700/50">
                        <TabsTrigger value="blueprints">
                            <Brain className="w-4 h-4 mr-2" />
                            Agent Blueprints
                        </TabsTrigger>
                        <TabsTrigger value="scenarios">
                            <FlaskConical className="w-4 h-4 mr-2" />
                            Test Scenarios
                        </TabsTrigger>
                        <TabsTrigger value="executions">
                            <BarChart3 className="w-4 h-4 mr-2" />
                            Test Executions
                        </TabsTrigger>
                        <TabsTrigger value="analytics">
                            <Activity className="w-4 h-4 mr-2" />
                            Performance Analytics
                        </TabsTrigger>
                    </TabsList>

                    {/* Agent Blueprints Tab */}
                    <TabsContent value="blueprints" className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-semibold text-purple-300">Agent Blueprints</h2>
                            <Button
                                onClick={() => setIsCreatingAgent(true)}
                                className="bg-gradient-to-r from-purple-600 to-pink-600"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Create Agent
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                            {agents.map((agent) => {
                                const TypeIcon = getTypeIcon(agent.type);
                                return (
                                    <motion.div
                                        key={agent.id}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <Card className="bg-slate-900/50 border-slate-700/50 hover:border-purple-500/50 transition-all cursor-pointer h-full">
                                            <CardHeader>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <TypeIcon className="w-6 h-6 text-purple-400" />
                                                        <div>
                                                            <CardTitle className="text-lg text-white">{agent.name}</CardTitle>
                                                            <p className="text-sm text-gray-400 capitalize">{agent.type} Agent</p>
                                                        </div>
                                                    </div>
                                                    <Badge className={getStatusColor(agent.status)}>
                                                        {agent.status}
                                                    </Badge>
                                                </div>
                                            </CardHeader>
                                            <CardContent className="space-y-4">
                                                <p className="text-sm text-gray-300">{agent.description}</p>

                                                <div className="space-y-2">
                                                    <h4 className="text-sm font-medium text-purple-300">Capabilities</h4>
                                                    <div className="flex flex-wrap gap-1">
                                                        {agent.capabilities.slice(0, 3).map((cap, index) => (
                                                            <Badge key={index} variant="outline" className="text-xs">
                                                                {cap.replace('_', ' ')}
                                                            </Badge>
                                                        ))}
                                                        {agent.capabilities.length > 3 && (
                                                            <Badge variant="outline" className="text-xs">
                                                                +{agent.capabilities.length - 3} more
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <h4 className="text-sm font-medium text-purple-300">Performance</h4>
                                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                                        <div className="flex justify-between">
                                                            <span className="text-gray-400">Success Rate:</span>
                                                            <span className="text-green-300">{agent.performance.successRate.toFixed(1)}%</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-gray-400">Avg Response:</span>
                                                            <span className="text-blue-300">{agent.performance.averageResponseTime.toFixed(1)}s</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => setSelectedAgent(agent)}
                                                        className="flex-1"
                                                    >
                                                        <Settings className="w-3 h-3 mr-1" />
                                                        Configure
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        className="flex-1 bg-green-600 hover:bg-green-700"
                                                    >
                                                        <Play className="w-3 h-3 mr-1" />
                                                        Test
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                );
                            })}
                        </div>

                        {/* Create Agent Modal */}
                        <AnimatePresence>
                            {isCreatingAgent && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                                >
                                    <motion.div
                                        initial={{ scale: 0.9, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0.9, opacity: 0 }}
                                    >
                                        <Card className="w-full max-w-2xl bg-slate-900 border-purple-500/30">
                                            <CardHeader>
                                                <CardTitle className="text-purple-300">Create New Agent</CardTitle>
                                            </CardHeader>
                                            <CardContent className="space-y-4">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <Label htmlFor="name">Agent Name</Label>
                                                        <Input
                                                            id="name"
                                                            value={newAgent.name}
                                                            onChange={(e) => setNewAgent(prev => ({ ...prev, name: e.target.value }))}
                                                            className="bg-slate-800 border-slate-700"
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label htmlFor="type">Agent Type</Label>
                                                        <select
                                                            id="type"
                                                            value={newAgent.type}
                                                            onChange={(e) => setNewAgent(prev => ({ ...prev, type: e.target.value as any }))}
                                                            className="w-full p-2 bg-slate-800 border border-slate-700 rounded-md text-white"
                                                        >
                                                            <option value="cognitive">Cognitive</option>
                                                            <option value="reactive">Reactive</option>
                                                            <option value="hybrid">Hybrid</option>
                                                            <option value="swarm">Swarm</option>
                                                            <option value="specialist">Specialist</option>
                                                        </select>
                                                    </div>
                                                </div>

                                                <div>
                                                    <Label htmlFor="description">Description</Label>
                                                    <Textarea
                                                        id="description"
                                                        value={newAgent.description}
                                                        onChange={(e) => setNewAgent(prev => ({ ...prev, description: e.target.value }))}
                                                        className="bg-slate-800 border-slate-700 min-h-20"
                                                        placeholder="Describe the agent's purpose and capabilities..."
                                                    />
                                                </div>

                                                <div className="flex gap-2">
                                                    <Button
                                                        variant="outline"
                                                        onClick={() => setIsCreatingAgent(false)}
                                                        className="flex-1"
                                                    >
                                                        Cancel
                                                    </Button>
                                                    <Button
                                                        onClick={handleCreateAgent}
                                                        className="flex-1 bg-gradient-to-r from-blue-600 to-green-500"
                                                        disabled={!newAgent.name || !newAgent.description}
                                                    >
                                                        Create Agent
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </TabsContent>

                    {/* Test Scenarios Tab */}
                    <TabsContent value="scenarios" className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-semibold text-purple-300">Test Scenarios</h2>
                            <Button
                                className="bg-gradient-to-r from-blue-600 to-green-500"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Create Scenario
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {scenarios.map((scenario) => (
                                <motion.div
                                    key={scenario.id}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <Card className="bg-slate-900/50 border-slate-700/50 hover:border-blue-500/50 transition-all cursor-pointer h-full">
                                        <CardHeader>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <FlaskConical className="w-6 h-6 text-blue-400" />
                                                    <div>
                                                        <CardTitle className="text-lg text-white">{scenario.name}</CardTitle>
                                                        <p className="text-sm text-gray-400 capitalize">{scenario.domain} • {scenario.difficulty}</p>
                                                    </div>
                                                </div>
                                                <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/50">
                                                    {scenario.difficulty}
                                                </Badge>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <p className="text-sm text-gray-300">{scenario.description}</p>

                                            <div className="space-y-2">
                                                <h4 className="text-sm font-medium text-blue-300">Constraints</h4>
                                                <div className="flex flex-wrap gap-1">
                                                    {scenario.constraints.slice(0, 2).map((constraint, index) => (
                                                        <Badge key={index} variant="outline" className="text-xs">
                                                            {constraint}
                                                        </Badge>
                                                    ))}
                                                    {scenario.constraints.length > 2 && (
                                                        <Badge variant="outline" className="text-xs">
                                                            +{scenario.constraints.length - 2} more
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <h4 className="text-sm font-medium text-blue-300">Metrics</h4>
                                                <div className="flex flex-wrap gap-1">
                                                    {scenario.metrics.map((metric, index) => (
                                                        <Badge key={index} variant="outline" className="text-xs">
                                                            {metric.replace('_', ' ')}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="flex gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => setSelectedScenario(scenario)}
                                                    className="flex-1"
                                                >
                                                    <Settings className="w-3 h-3 mr-1" />
                                                    Configure
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    className="flex-1 bg-green-600 hover:bg-green-700"
                                                    onClick={() => {
                                                        if (selectedAgent) {
                                                            handleTestAgent(selectedAgent, scenario);
                                                        }
                                                    }}
                                                    disabled={!selectedAgent}
                                                >
                                                    <Play className="w-3 h-3 mr-1" />
                                                    Run Test
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </TabsContent>

                    {/* Test Executions Tab */}
                    <TabsContent value="executions" className="space-y-6">
                        <h2 className="text-xl font-semibold text-purple-300">Test Executions</h2>

                        <div className="space-y-4">
                            {executions.map((execution) => {
                                const agent = agents.find(a => a.id === execution.agentId);
                                const scenario = scenarios.find(s => s.id === execution.scenarioId);

                                return (
                                    <Card key={execution.id} className="bg-slate-900/50 border-slate-700/50">
                                        <CardContent className="p-6">
                                            <div className="flex items-center justify-between mb-4">
                                                <div>
                                                    <h3 className="font-semibold text-white">
                                                        {agent?.name} → {scenario?.name}
                                                    </h3>
                                                    <p className="text-sm text-gray-400">
                                                        Started: {execution.startTime.toLocaleTimeString()}
                                                    </p>
                                                </div>
                                                <Badge className={getStatusColor(execution.status)}>
                                                    {execution.status}
                                                </Badge>
                                            </div>

                                            {execution.status === 'completed' && (
                                                <div className="grid grid-cols-4 gap-4 mb-4">
                                                    <div className="text-center">
                                                        <p className="text-lg font-bold text-green-300">
                                                            {execution.metrics.accuracy.toFixed(1)}%
                                                        </p>
                                                        <p className="text-xs text-gray-400">Accuracy</p>
                                                    </div>
                                                    <div className="text-center">
                                                        <p className="text-lg font-bold text-blue-300">
                                                            {execution.metrics.executionTime}ms
                                                        </p>
                                                        <p className="text-xs text-gray-400">Execution Time</p>
                                                    </div>
                                                    <div className="text-center">
                                                        <p className="text-lg font-bold text-purple-300">
                                                            {execution.metrics.efficiency.toFixed(1)}%
                                                        </p>
                                                        <p className="text-xs text-gray-400">Efficiency</p>
                                                    </div>
                                                    <div className="text-center">
                                                        <p className="text-lg font-bold text-orange-300">
                                                            {execution.metrics.resourceUsage.toFixed(1)}%
                                                        </p>
                                                        <p className="text-xs text-gray-400">Resource Usage</p>
                                                    </div>
                                                </div>
                                            )}

                                            <div>
                                                <h4 className="text-sm font-medium text-purple-300 mb-2">Execution Logs</h4>
                                                <ScrollArea className="h-32 bg-slate-800/50 rounded-lg p-3">
                                                    {execution.logs.map((log, index) => (
                                                        <p key={index} className="text-xs text-gray-300 mb-1">
                                                            {log}
                                                        </p>
                                                    ))}
                                                </ScrollArea>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    </TabsContent>

                    {/* Other tabs */}
                    <TabsContent value="analytics">
                        <div className="text-center py-12">
                            <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-500" />
                            <p className="text-gray-400">Performance Analytics dashboard coming soon...</p>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
} 