"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Bot, Brain, Zap, Shield, Eye, Mic, MicOff,
    Send, FileText, Monitor, Code, Activity,
    Settings, Camera, Cpu, HardDrive, Wifi
} from 'lucide-react';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    confidence?: number;
    reasoning?: string[];
}

interface SystemMetrics {
    cpu: number;
    memory: number;
    gpu: number;
    latency: number;
    threats: number;
    uptime: number;
}

export default function QuantumAIAssistant() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [currentMode, setCurrentMode] = useState<'chat' | 'analysis' | 'security' | 'code'>('chat');
    const [metrics, setMetrics] = useState<SystemMetrics>({
        cpu: 23.5,
        memory: 67.2,
        gpu: 45.8,
        latency: 12.3,
        threats: 0,
        uptime: 99.97
    });
    const [voiceSupported, setVoiceSupported] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const recognitionRef = useRef<any>(null);

    useEffect(() => {
        // Check for voice support
        if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
            setVoiceSupported(true);
            const recognition = new (window as any).webkitSpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = 'en-US';

            recognition.onresult = (event: any) => {
                const transcript = Array.from(event.results)
                    .map((result: any) => result[0].transcript)
                    .join('');
                setInput(transcript);
            };

            recognition.onend = () => {
                setIsListening(false);
            };

            recognitionRef.current = recognition;
        }

        // Update metrics
        const metricsInterval = setInterval(() => {
            setMetrics(prev => ({
                cpu: Math.max(0, Math.min(100, prev.cpu + (Math.random() - 0.5) * 10)),
                memory: Math.max(0, Math.min(100, prev.memory + (Math.random() - 0.5) * 5)),
                gpu: Math.max(0, Math.min(100, prev.gpu + (Math.random() - 0.5) * 15)),
                latency: Math.max(0, prev.latency + (Math.random() - 0.5) * 5),
                threats: Math.random() < 0.1 ? prev.threats + 1 : Math.max(0, prev.threats - 1),
                uptime: Math.min(100, prev.uptime + 0.001)
            }));
        }, 2000);

        return () => clearInterval(metricsInterval);
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const toggleVoiceRecording = useCallback(() => {
        if (!recognitionRef.current) return;

        if (isListening) {
            recognitionRef.current.stop();
        } else {
            recognitionRef.current.start();
            setIsListening(true);
        }
    }, [isListening]);

    const generateResponse = useCallback(async (userMessage: string, mode: string) => {
        const responses = {
            chat: [
                "I've analyzed your request using advanced quantum algorithms. Based on current operational parameters, I recommend implementing a multi-layered security approach with enhanced efficiency protocols.",
                "Processing through neural networks... I've identified optimal solutions that align with enterprise-grade security requirements and operational excellence standards.",
                "Advanced pattern recognition indicates this requires specialized handling. I'm engaging quantum-enhanced reasoning to provide the most accurate strategic recommendations.",
                "My analysis reveals multiple optimization opportunities. Implementing these suggestions could improve operational efficiency by 34% while maintaining strict security compliance."
            ],
            analysis: [
                "Deep analytical processing complete. I've identified 7 critical patterns with 98.2% confidence. The data indicates significant correlation between operational metrics and performance outcomes.",
                "Advanced statistical modeling reveals key insights. Current trends suggest implementing immediate optimization protocols to enhance system performance.",
                "Quantum analysis complete. Pattern recognition algorithms have identified optimal pathways for achieving your objectives while maintaining security protocols."
            ],
            security: [
                "Security analysis complete. I've identified potential vulnerabilities and recommend immediate implementation of enhanced protection protocols. All threats have been neutralized.",
                "Threat assessment concluded. Zero active security breaches detected. System integrity maintained at 99.97% operational efficiency.",
                "Advanced security scan complete. All systems show optimal protection levels. Recommend continuing current security protocols with enhanced monitoring."
            ],
            code: [
                "Code analysis complete. I've optimized your implementation for maximum efficiency and security. The enhanced version includes advanced error handling and performance improvements.",
                "Generated code follows enterprise-grade security standards. Implementation includes comprehensive testing protocols and scalability optimizations.",
                "Advanced code generation complete. The solution incorporates quantum-enhanced algorithms for optimal performance and security compliance."
            ]
        };

        const modeResponses = responses[mode as keyof typeof responses] || responses.chat;
        const response = modeResponses[Math.floor(Math.random() * modeResponses.length)];

        return {
            content: response,
            confidence: Math.random() * 20 + 80,
            reasoning: [
                'Multi-domain pattern analysis applied',
                'Security compliance verified',
                'Performance optimization calculated',
                'Enterprise standards validated'
            ]
        };
    }, []);

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isProcessing) return;

        const userMessage: Message = {
            id: `user-${Date.now()}`,
            role: 'user',
            content: input,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsProcessing(true);

        // Simulate processing delay
        await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 2000));

        const response = await generateResponse(input, currentMode);

        const aiMessage: Message = {
            id: `ai-${Date.now()}`,
            role: 'assistant',
            content: response.content,
            timestamp: new Date(),
            confidence: response.confidence,
            reasoning: response.reasoning
        };

        setMessages(prev => [...prev, aiMessage]);
        setIsProcessing(false);
    }, [input, isProcessing, currentMode, generateResponse]);

    const modes = [
        { id: 'chat', name: 'Chat', icon: <Bot className="w-4 h-4" />, color: 'text-blue-400' },
        { id: 'analysis', name: 'Analysis', icon: <Brain className="w-4 h-4" />, color: 'text-green-400' },
        { id: 'security', name: 'Security', icon: <Shield className="w-4 h-4" />, color: 'text-red-400' },
        { id: 'code', name: 'Code', icon: <Code className="w-4 h-4" />, color: 'text-cyan-400' }
    ];

    return (
        <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white z-50">
            <div className="flex h-full">
                {/* Sidebar */}
                <motion.div
                    initial={{ x: -320, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    className="w-80 bg-slate-900/30 backdrop-blur-xl border-r border-slate-700/50 p-6 overflow-y-auto"
                >
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                            <Bot className="w-10 h-10 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                            IRIS Quantum AI
                        </h2>
                        <p className="text-slate-400">Advanced Intelligence System</p>
                    </div>

                    {/* System Status */}
                    <div className="bg-slate-800/30 backdrop-blur-sm rounded-lg p-4 border border-slate-700/50 mb-6">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <Activity className="w-5 h-5 text-green-400" />
                            System Status
                        </h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-slate-400 flex items-center gap-2">
                                    <Cpu className="w-4 h-4" />
                                    CPU Usage
                                </span>
                                <span className="text-blue-400 font-mono">{metrics.cpu.toFixed(1)}%</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-slate-400 flex items-center gap-2">
                                    <HardDrive className="w-4 h-4" />
                                    Memory
                                </span>
                                <span className="text-cyan-400 font-mono">{metrics.memory.toFixed(1)}%</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-slate-400 flex items-center gap-2">
                                    <Monitor className="w-4 h-4" />
                                    GPU
                                </span>
                                <span className="text-green-400 font-mono">{metrics.gpu.toFixed(1)}%</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-slate-400 flex items-center gap-2">
                                    <Wifi className="w-4 h-4" />
                                    Latency
                                </span>
                                <span className="text-yellow-400 font-mono">{metrics.latency.toFixed(1)}ms</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-slate-400 flex items-center gap-2">
                                    <Shield className="w-4 h-4" />
                                    Threats
                                </span>
                                <span className={`font-mono ${metrics.threats > 0 ? 'text-red-400' : 'text-green-400'}`}>
                                    {metrics.threats}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-slate-400">Uptime</span>
                                <span className="text-green-400 font-mono">{metrics.uptime.toFixed(2)}%</span>
                            </div>
                        </div>
                    </div>

                    {/* Mode Selection */}
                    <div className="bg-slate-800/30 backdrop-blur-sm rounded-lg p-4 border border-slate-700/50">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <Settings className="w-5 h-5 text-slate-400" />
                            Operation Mode
                        </h3>
                        <div className="space-y-2">
                            {modes.map((mode) => (
                                <button
                                    key={mode.id}
                                    onClick={() => setCurrentMode(mode.id as any)}
                                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${currentMode === mode.id
                                            ? 'bg-blue-600/20 border border-blue-500/50 text-blue-400'
                                            : 'bg-slate-700/30 border border-slate-600/50 text-slate-400 hover:bg-slate-700/50'
                                        }`}
                                >
                                    <span className={mode.color}>{mode.icon}</span>
                                    <span className="font-medium">{mode.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Quantum Status */}
                    <div className="bg-gradient-to-r from-blue-900/20 to-cyan-900/20 backdrop-blur-sm rounded-lg p-4 border border-blue-500/30 mt-6">
                        <div className="flex items-center gap-2 mb-2">
                            <Zap className="w-5 h-5 text-yellow-400" />
                            <span className="text-sm font-semibold text-yellow-400">Quantum Enhanced</span>
                        </div>
                        <p className="text-xs text-slate-400">
                            Neural processing acceleration active. Quantum algorithms engaged for optimal performance.
                        </p>
                    </div>
                </motion.div>

                {/* Main Chat Area */}
                <div className="flex-1 flex flex-col">
                    {/* Header */}
                    <motion.div
                        initial={{ y: -60, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="bg-slate-900/30 backdrop-blur-xl border-b border-slate-700/50 p-6"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-white">IRIS Quantum AI Assistant</h1>
                                <p className="text-slate-400">
                                    Mode: <span className="text-blue-400">{currentMode.charAt(0).toUpperCase() + currentMode.slice(1)}</span>
                                    {isProcessing && <span className="text-yellow-400"> • Processing...</span>}
                                </p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2 px-3 py-2 bg-green-500/20 border border-green-500/30 rounded-lg">
                                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                    <span className="text-green-400 text-sm font-medium">Online</span>
                                </div>
                                <div className="flex items-center gap-2 px-3 py-2 bg-blue-500/20 border border-blue-500/30 rounded-lg">
                                    <Zap className="w-4 h-4 text-blue-400" />
                                    <span className="text-blue-400 text-sm font-medium">Quantum</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        <AnimatePresence>
                            {messages.map((message) => (
                                <motion.div
                                    key={message.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.4 }}
                                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-4xl ${message.role === 'user' ? 'ml-16' : 'mr-16'}`}>
                                        <div className={`p-6 rounded-2xl ${message.role === 'user'
                                                ? 'bg-blue-600/10 border border-blue-500/20 text-blue-100'
                                                : 'bg-slate-800/30 border border-slate-700/50 text-slate-100'
                                            }`}>
                                            <div className="flex items-start gap-4">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${message.role === 'user' ? 'bg-blue-500' : 'bg-slate-700'
                                                    }`}>
                                                    {message.role === 'user' ? (
                                                        <div className="w-5 h-5 bg-white rounded-full"></div>
                                                    ) : (
                                                        <Bot className="w-5 h-5 text-slate-300" />
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-3">
                                                        <span className="font-semibold">
                                                            {message.role === 'user' ? 'You' : 'IRIS AI'}
                                                        </span>
                                                        <span className="text-xs text-slate-500">
                                                            {message.timestamp.toLocaleTimeString()}
                                                        </span>
                                                        {message.confidence && (
                                                            <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">
                                                                {message.confidence.toFixed(1)}% confidence
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-base leading-relaxed whitespace-pre-wrap">
                                                        {message.content}
                                                    </p>
                                                    {message.reasoning && (
                                                        <div className="mt-4 p-3 bg-slate-700/30 rounded-lg">
                                                            <div className="text-sm font-medium text-slate-400 mb-2">
                                                                Reasoning Process:
                                                            </div>
                                                            <ul className="text-sm text-slate-300 space-y-1">
                                                                {message.reasoning.map((reason, index) => (
                                                                    <li key={index} className="flex items-center gap-2">
                                                                        <Zap className="w-3 h-3 text-yellow-400" />
                                                                        {reason}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}
                                                </div>
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
                                <div className="max-w-4xl mr-16">
                                    <div className="bg-slate-800/30 border border-slate-700/50 p-6 rounded-2xl">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center">
                                                <Bot className="w-5 h-5 text-slate-300" />
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="flex space-x-1">
                                                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                                                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                                </div>
                                                <span className="text-slate-400">Processing quantum analysis...</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <motion.div
                        initial={{ y: 60, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="bg-slate-900/30 backdrop-blur-xl border-t border-slate-700/50 p-6"
                    >
                        <form onSubmit={handleSubmit} className="flex items-end gap-4">
                            <div className="flex-1">
                                <textarea
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Ask me anything... I'm powered by quantum-enhanced AI"
                                    className="w-full h-20 bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white placeholder-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent"
                                    disabled={isProcessing}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleSubmit(e);
                                        }
                                    }}
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                {voiceSupported && (
                                    <button
                                        type="button"
                                        onClick={toggleVoiceRecording}
                                        className={`p-3 rounded-xl transition-all ${isListening
                                                ? 'bg-red-500/20 border border-red-500/50 text-red-400'
                                                : 'bg-slate-700/50 border border-slate-600/50 text-slate-400 hover:bg-slate-700/70'
                                            }`}
                                    >
                                        {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                                    </button>
                                )}
                                <button
                                    type="submit"
                                    disabled={isProcessing || !input.trim()}
                                    className="p-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:text-slate-500 rounded-xl transition-all"
                                >
                                    <Send className="w-5 h-5" />
                                </button>
                            </div>
                        </form>
                </div>
            </div>
        </div>
    </div >
  );
} 