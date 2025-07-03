"use client";
recursivel iterate and enhance
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { AnimatePresence, motion } from 'framer-motion';
import { Activity, Bot, Brain, Code, Eye, FileText, Mic, MicOff, Monitor, Send, Settings, Shield, Zap } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

interface Message {
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: Date;
    type: 'text' | 'code' | 'analysis' | 'command' | 'file';
    metadata?: {
        confidence?: number;
        source?: string;
        classification?: string;
        tokens?: number;
        model?: string;
        reasoning?: string[];
    };
}

interface AICapability {
    id: string;
    name: string;
    description: string;
    icon: React.ReactNode;
    status: 'active' | 'inactive' | 'processing';
    accuracy: number;
    responseTime: number;
    color: string;
}

interface SystemMetrics {
    cpuUsage: number;
    memoryUsage: number;
    gpuUsage: number;
    networkLatency: number;
    activeConnections: number;
    processingQueue: number;
    uptime: number;
}

export default function AdvancedQuantumAI() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [currentMode, setCurrentMode] = useState<'chat' | 'analysis' | 'command' | 'code'>('chat');
    const [systemMetrics, setSystemMetrics] = useState<SystemMetrics>({
        cpuUsage: 0,
        memoryUsage: 0,
        gpuUsage: 0,
        networkLatency: 0,
        activeConnections: 0,
        processingQueue: 0,
        uptime: 0
    });
    const [capabilities, setCapabilities] = useState<AICapability[]>([
        {
            id: 'nlp',
            name: 'Natural Language Processing',
            description: 'Advanced text understanding and generation',
            icon: <Brain className="w-5 h-5" />,
            status: 'active',
            accuracy: 97.8,
            responseTime: 0.23,
            color: 'text-blue-400'
        },
        {
            id: 'vision',
            name: 'Computer Vision',
            description: 'Image analysis and object recognition',
            icon: <Eye className="w-5 h-5" />,
            status: 'active',
            accuracy: 94.2,
            responseTime: 0.45,
            color: 'text-cyan-400'
        },
        {
            id: 'code',
            name: 'Code Generation',
            description: 'Software development and debugging',
            icon: <Code className="w-5 h-5" />,
            status: 'active',
            accuracy: 91.5,
            responseTime: 0.67,
            color: 'text-green-400'
        },
        {
            id: 'security',
            name: 'Security Analysis',
            description: 'Threat detection and vulnerability assessment',
            icon: <Shield className="w-5 h-5" />,
            status: 'active',
            accuracy: 98.9,
            responseTime: 0.12,
            color: 'text-red-400'
        }
    ]);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [voiceTranscript, setVoiceTranscript] = useState('');
    const [isRecording, setIsRecording] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const recognitionRef = useRef<SpeechRecognition | null>(null);

    // Initialize speech recognition
    useEffect(() => {
        if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
            const recognition = new (window as any).webkitSpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = 'en-US';

            recognition.onresult = (event: any) => {
                const transcript = Array.from(event.results)
                    .map((result: any) => result[0].transcript)
                    .join('');
                setVoiceTranscript(transcript);
            };

            recognition.onend = () => {
                setIsListening(false);
                setIsRecording(false);
            };

            recognitionRef.current = recognition;
        }
    }, []);

    // Update system metrics
    useEffect(() => {
        const updateMetrics = () => {
            setSystemMetrics(prev => ({
                cpuUsage: Math.random() * 30 + 15,
                memoryUsage: Math.random() * 20 + 40,
                gpuUsage: Math.random() * 40 + 30,
                networkLatency: Math.random() * 5 + 8,
                activeConnections: Math.floor(Math.random() * 50) + 100,
                processingQueue: Math.floor(Math.random() * 10),
                uptime: prev.uptime + 1
            }));
        };

        const interval = setInterval(updateMetrics, 2000);
        return () => clearInterval(interval);
    }, []);

    // Scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const toggleVoiceRecording = useCallback(() => {
        if (!recognitionRef.current) return;

        if (isListening) {
            recognitionRef.current.stop();
            if (voiceTranscript.trim()) {
                setInput(voiceTranscript);
                setVoiceTranscript('');
            }
        } else {
            recognitionRef.current.start();
            setIsListening(true);
            setIsRecording(true);
        }
    }, [isListening, voiceTranscript]);

    const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);
        setSelectedFiles(prev => [...prev, ...files]);
    }, []);

    const processMessage = useCallback(async (message: string, files?: File[]) => {
        if (!message.trim() && !files?.length) return;

        const userMessage: Message = {
            id: `user-${Date.now()}`,
            role: 'user',
            content: message,
            timestamp: new Date(),
            type: files?.length ? 'file' : 'text'
        };

        setMessages(prev => [...prev, userMessage]);
        setIsProcessing(true);

        // Simulate AI processing
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

        const aiResponse = await generateAIResponse(message, files, currentMode);

        const assistantMessage: Message = {
            id: `assistant-${Date.now()}`,
            role: 'assistant',
            content: aiResponse.content,
            timestamp: new Date(),
            type: aiResponse.type,
            metadata: aiResponse.metadata
        };

        setMessages(prev => [...prev, assistantMessage]);
        setIsProcessing(false);
    }, [currentMode]);

    const generateAIResponse = async (input: string, files?: File[], mode = 'chat') => {
        const responses = {
            chat: [
                "I understand your request. Based on my analysis of current operational parameters, I recommend implementing a multi-layered approach that prioritizes security and efficiency.",
                "Analyzing the context of your query, I've identified several optimization opportunities that could enhance your current workflow by approximately 34%.",
                "I've processed your request through my quantum neural networks. The recommended solution incorporates best practices from military, healthcare, and legal domains.",
                "Based on real-time intelligence gathering, I've synthesized a comprehensive response that addresses both immediate needs and long-term strategic objectives."
            ],
            analysis: [
                "Analysis complete. I've identified 7 key patterns in your data with 97.8% confidence. The primary trend indicates a significant opportunity for operational enhancement.",
                "Deep analysis reveals multiple optimization vectors. Current performance metrics suggest implementing the following strategic adjustments.",
                "Comprehensive assessment shows strong correlation between input parameters and desired outcomes. Recommendations are based on advanced predictive modeling."
            ],
            command: [
                "Command executed successfully. System resources allocated optimally. Current operation queue: 3 pending tasks.",
                "Processing command through secure channels. All security protocols confirmed. Execution status: COMPLETE.",
                "Command received and processed. System integrity maintained. Performance metrics within acceptable parameters."
            ],
            code: [
                "Code analysis complete. I've identified several optimization opportunities and potential security vulnerabilities. Here's the enhanced implementation:",
                "Generated code follows enterprise-grade security standards and incorporates best practices for scalability and maintainability.",
                "Code review complete. The implementation demonstrates robust error handling and optimal performance characteristics."
            ]
        };

        const responseList = responses[mode as keyof typeof responses] || responses.chat;
        const content = responseList[Math.floor(Math.random() * responseList.length)];

        return {
            content,
            type: mode === 'code' ? 'code' : 'text',
            metadata: {
                confidence: Math.random() * 20 + 80,
                source: 'IRIS-AI Quantum Engine',
                classification: 'UNCLASSIFIED',
                tokens: Math.floor(Math.random() * 500) + 100,
                model: 'IRIS-Quantum-7B',
                reasoning: [
                    'Multi-domain pattern recognition applied',
                    'Security constraints validated',
                    'Performance optimization considered',
                    'Compliance requirements verified'
                ]
            }
        };
    };

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        const message = input.trim();
        const files = selectedFiles.length > 0 ? selectedFiles : undefined;

        if (message || files) {
            await processMessage(message, files);
            setInput('');
            setSelectedFiles([]);
        }
    }, [input, selectedFiles, processMessage]);

    const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    }, [handleSubmit]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white">
            <div className="flex h-screen">
                {/* Sidebar - System Metrics & Capabilities */}
                <motion.div
                    initial={{ x: -300, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="w-80 bg-slate-900/50 backdrop-blur-lg border-r border-slate-700/50 p-6 overflow-y-auto"
                >
                    <div className="space-y-6">
                        {/* Header */}
                        <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                                <Bot className="w-8 h-8 text-white" />
                            </div>
                            <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                                IRIS Quantum AI
                            </h2>
                            <p className="text-sm text-slate-400">Enterprise AI Assistant</p>
                        </div>

                        {/* System Status */}
                        <Card className="bg-slate-800/50 border-slate-700/50">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm flex items-center gap-2">
                                    <Activity className="w-4 h-4 text-green-400" />
                                    System Status
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-400">CPU Usage</span>
                                    <span className="text-blue-400">{systemMetrics.cpuUsage.toFixed(1)}%</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-400">Memory</span>
                                    <span className="text-cyan-400">{systemMetrics.memoryUsage.toFixed(1)}%</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-400">GPU</span>
                                    <span className="text-green-400">{systemMetrics.gpuUsage.toFixed(1)}%</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-400">Latency</span>
                                    <span className="text-yellow-400">{systemMetrics.networkLatency.toFixed(1)}ms</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-400">Queue</span>
                                    <span className="text-orange-400">{systemMetrics.processingQueue}</span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* AI Capabilities */}
                        <Card className="bg-slate-800/50 border-slate-700/50">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm flex items-center gap-2">
                                    <Brain className="w-4 h-4 text-blue-400" />
                                    AI Capabilities
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {capabilities.map((capability) => (
                                    <div key={capability.id} className="space-y-1">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <span className={capability.color}>{capability.icon}</span>
                                                <span className="text-xs font-medium">{capability.name}</span>
                                            </div>
                                            <Badge variant="secondary" className="text-xs">
                                                {capability.status}
                                            </Badge>
                                        </div>
                                        <div className="flex justify-between text-xs text-slate-400">
                                            <span>Accuracy: {capability.accuracy}%</span>
                                            <span>{capability.responseTime}s</span>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Mode Selection */}
                        <Card className="bg-slate-800/50 border-slate-700/50">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm flex items-center gap-2">
                                    <Settings className="w-4 h-4 text-slate-400" />
                                    Operation Mode
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {[
                                    { id: 'chat', name: 'Chat', icon: <Bot className="w-4 h-4" /> },
                                    { id: 'analysis', name: 'Analysis', icon: <Brain className="w-4 h-4" /> },
                                    { id: 'command', name: 'Command', icon: <Monitor className="w-4 h-4" /> },
                                    { id: 'code', name: 'Code', icon: <Code className="w-4 h-4" /> }
                                ].map((mode) => (
                                    <Button
                                        key={mode.id}
                                        variant={currentMode === mode.id ? "default" : "ghost"}
                                        size="sm"
                                        onClick={() => setCurrentMode(mode.id as any)}
                                        className="w-full justify-start"
                                    >
                                        {mode.icon}
                                        <span className="ml-2">{mode.name}</span>
                                    </Button>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </motion.div>

                {/* Main Chat Area */}
                <div className="flex-1 flex flex-col">
                    {/* Header */}
                    <motion.div
                        initial={{ y: -50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="bg-slate-900/50 backdrop-blur-lg border-b border-slate-700/50 p-4"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-xl font-bold text-white">IRIS Quantum AI Assistant</h1>
                                <p className="text-sm text-slate-400">
                                    Mode: {currentMode.charAt(0).toUpperCase() + currentMode.slice(1)} •
                                    {isProcessing ? " Processing..." : " Ready"}
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                                    Online
                                </Badge>
                                <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">
                                    Quantum Enhanced
                                </Badge>
                            </div>
                        </div>
                    </motion.div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        <AnimatePresence>
                            {messages.map((message) => (
                                <motion.div
                                    key={message.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.3 }}
                                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-2xl p-4 rounded-lg ${message.role === 'user'
                                            ? 'bg-blue-600/20 border border-blue-500/30 text-blue-100'
                                            : 'bg-slate-800/50 border border-slate-700/50 text-slate-100'
                                            }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${message.role === 'user' ? 'bg-blue-500' : 'bg-slate-700'
                                                }`}>
                                                {message.role === 'user' ? (
                                                    <div className="w-4 h-4 bg-white rounded-full"></div>
                                                ) : (
                                                    <Bot className="w-4 h-4 text-slate-300" />
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-sm font-medium">
                                                        {message.role === 'user' ? 'You' : 'IRIS AI'}
                                                    </span>
                                                    <span className="text-xs text-slate-500">
                                                        {message.timestamp.toLocaleTimeString()}
                                                    </span>
                                                    {message.metadata?.confidence && (
                                                        <Badge variant="secondary" className="text-xs">
                                                            {message.metadata.confidence.toFixed(1)}% confidence
                                                        </Badge>
                                                    )}
                                                </div>
                                                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                                                {message.metadata?.reasoning && (
                                                    <div className="mt-2 text-xs text-slate-400">
                                                        <details>
                                                            <summary className="cursor-pointer hover:text-slate-300">
                                                                View reasoning
                                                            </summary>
                                                            <ul className="mt-1 space-y-1">
                                                                {message.metadata.reasoning.map((reason, index) => (
                                                                    <li key={index} className="flex items-center gap-1">
                                                                        <Zap className="w-3 h-3 text-yellow-400" />
                                                                        {reason}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </details>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {isProcessing && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex justify-start"
                            >
                                <div className="bg-slate-800/50 border border-slate-700/50 p-4 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center">
                                            <Bot className="w-4 h-4 text-slate-300" />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="flex space-x-1">
                                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                            </div>
                                            <span className="text-sm text-slate-400">Processing your request...</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <motion.div
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="bg-slate-900/50 backdrop-blur-lg border-t border-slate-700/50 p-4"
                    >
                        <form onSubmit={handleSubmit} className="space-y-3">
                            {/* File Upload Area */}
                            {selectedFiles.length > 0 && (
                                <div className="flex flex-wrap gap-2 p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
                                    {selectedFiles.map((file, index) => (
                                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                                            <FileText className="w-3 h-3" />
                                            {file.name}
                                            <button
                                                type="button"
                                                onClick={() => setSelectedFiles(prev => prev.filter((_, i) => i !== index))}
                                                className="ml-1 text-red-400 hover:text-red-300"
                                            >
                                                ×
                                            </button>
                                        </Badge>
                                    ))}
                                </div>
                            )}

                            {/* Voice Transcript */}
                            {isListening && voiceTranscript && (
                                <div className="p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Mic className="w-4 h-4 text-blue-400 animate-pulse" />
                                        <span className="text-sm text-blue-400">Voice input detected:</span>
                                    </div>
                                    <p className="text-sm text-blue-100">{voiceTranscript}</p>
                                </div>
                            )}

                            {/* Input Field */}
                            <div className="flex items-end gap-3">
                                <div className="flex-1 space-y-2">
                                    <Textarea
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        placeholder="Enter your message... (Shift+Enter for new line)"
                                        className="min-h-[60px] bg-slate-800/50 border-slate-700/50 text-white placeholder-slate-400 resize-none"
                                        disabled={isProcessing}
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="text-slate-400 hover:text-white"
                                    >
                                        <FileText className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={toggleVoiceRecording}
                                        className={`${isListening ? 'text-red-400' : 'text-slate-400'} hover:text-white`}
                                    >
                                        {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                                    </Button>
                                    <Button
                                        type="submit"
                                        size="sm"
                                        disabled={isProcessing || (!input.trim() && !selectedFiles.length)}
                                        className="bg-blue-600 hover:bg-blue-700"
                                    >
                                        <Send className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </form>

                        <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            onChange={handleFileUpload}
                            className="hidden"
                            accept=".txt,.pdf,.doc,.docx,.json,.csv,.md"
                        />
                    </motion.div>
                </div>
            </div>
        </div>
    );
} 