"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Brain,
    Maximize2,
    MessageCircle,
    Minimize2,
    Send,
    Shield,
    Sparkles,
    X,
    Zap
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface Message {
    id: string;
    text: string;
    isUser: boolean;
    timestamp: Date;
    status?: 'sending' | 'sent' | 'error';
}

interface AICapability {
    icon: React.ReactNode;
    title: string;
    description: string;
    action: () => void;
}

export default function ElegantAIAssistant() {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const capabilities: AICapability[] = [
        {
            icon: <Brain className="w-4 h-4" />,
            title: "Platform Guide",
            description: "Get help navigating the platform",
            action: () => sendMessage("Show me around the platform")
        },
        {
            icon: <Shield className="w-4 h-4" />,
            title: "USACE Contracts",
            description: "Learn about contractor solutions",
            action: () => sendMessage("Tell me about USACE contractor features")
        },
        {
            icon: <Zap className="w-4 h-4" />,
            title: "Quantum AI",
            description: "Explore quantum capabilities",
            action: () => sendMessage("What can the quantum AI do?")
        }
    ];

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendMessage = async (text: string) => {
        if (!text.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            text: text.trim(),
            isUser: true,
            timestamp: new Date(),
            status: 'sent'
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsTyping(true);

        // Simulate AI response
        setTimeout(() => {
            const aiResponse: Message = {
                id: (Date.now() + 1).toString(),
                text: generateAIResponse(text),
                isUser: false,
                timestamp: new Date(),
                status: 'sent'
            };
            setMessages(prev => [...prev, aiResponse]);
            setIsTyping(false);
        }, 1000 + Math.random() * 1000);
    };

    const generateAIResponse = (userInput: string): string => {
        const input = userInput.toLowerCase();

        if (input.includes('platform') || input.includes('navigate') || input.includes('help')) {
            return "I can help you navigate the IRIS-AI Enterprise platform. Key areas include:\n\n• USACE Contractor Solutions - Quantum-powered AI for defense contractors\n• Healthcare Platform - AI-driven clinical workflows\n• Quantum Analytics - Advanced data processing\n• Sales Dashboard - Real-time performance tracking\n\nWhat would you like to explore first?";
        }

        if (input.includes('usace') || input.includes('contractor')) {
            return "Our USACE contractor solutions offer:\n\n• CMMC Level 3 compliance automation\n• 12x faster environmental analysis\n• 47% reduction in project delivery time\n• Automated bid optimization\n\nWould you like to start a free 30-day trial or see a demo?";
        }

        if (input.includes('quantum') || input.includes('ai')) {
            return "The quantum AI engine provides:\n\n• Quantum-enhanced pattern recognition\n• Real-time anomaly detection\n• Predictive modeling with 96.8% accuracy\n• Multi-modal data fusion\n\nThis gives you a significant competitive advantage. How can I help you implement it?";
        }

        if (input.includes('hello') || input.includes('hi')) {
            return "Hello! I'm your AI assistant for the IRIS-AI Enterprise platform. I'm here to help you:\n\n• Navigate platform features\n• Understand USACE contractor solutions\n• Explore quantum AI capabilities\n• Get started with your goals\n\nWhat can I help you with today?";
        }

        return "I understand you're interested in that topic. The IRIS-AI platform offers comprehensive solutions for defense contractors, healthcare organizations, and enterprise clients. Let me know specifically what you'd like to learn about:\n\n• USACE contractor tools\n• Healthcare AI automation\n• Quantum analytics\n• Platform setup and training\n\nHow can I best assist you?";
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage(input);
        }
    };

    if (!isOpen) {
        return (
            <div className="fixed bottom-6 right-6 z-50">
                <Button
                    onClick={() => setIsOpen(true)}
                    className="h-14 w-14 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-lg border-0 transition-all duration-300 hover:scale-105 group"
                >
                    <MessageCircle className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
                </Button>
            </div>
        );
    }

    return (
        <div className="fixed bottom-6 right-6 z-50">
            <Card className={`bg-slate-900/95 backdrop-blur-lg border-slate-700/50 shadow-2xl transition-all duration-500 ${isMinimized
                    ? 'w-80 h-16'
                    : 'w-96 h-[600px]'
                }`}>
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 flex items-center justify-center">
                            <Sparkles className="w-4 h-4 text-white" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-white text-sm">IRIS AI Assistant</h3>
                            <p className="text-xs text-slate-400">Always here to help</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsMinimized(!isMinimized)}
                            className="h-8 w-8 p-0 text-slate-400 hover:text-white hover:bg-slate-700/50"
                        >
                            {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsOpen(false)}
                            className="h-8 w-8 p-0 text-slate-400 hover:text-white hover:bg-slate-700/50"
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                {!isMinimized && (
                    <CardContent className="p-0 flex flex-col h-[532px]">
                        {/* Quick Actions */}
                        {messages.length === 0 && (
                            <div className="p-4 space-y-3">
                                <p className="text-sm text-slate-300 mb-4">Welcome! How can I help you today?</p>
                                <div className="space-y-2">
                                    {capabilities.map((capability, index) => (
                                        <Button
                                            key={index}
                                            variant="ghost"
                                            onClick={capability.action}
                                            className="w-full justify-start h-auto p-3 text-left hover:bg-slate-800/50 border border-slate-700/30 hover:border-blue-500/30 transition-all group"
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className="text-blue-400 mt-0.5 group-hover:text-blue-300 transition-colors">
                                                    {capability.icon}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-white text-sm">{capability.title}</div>
                                                    <div className="text-xs text-slate-400 mt-1">{capability.description}</div>
                                                </div>
                                            </div>
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${message.isUser
                                                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white'
                                                : 'bg-slate-800 text-slate-100 border border-slate-700/50'
                                            }`}
                                    >
                                        <div className="whitespace-pre-wrap">{message.text}</div>
                                        <div className={`text-xs mt-1 ${message.isUser ? 'text-blue-100' : 'text-slate-400'
                                            }`}>
                                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="bg-slate-800 border border-slate-700/50 rounded-2xl px-4 py-3">
                                        <div className="flex space-x-1">
                                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="p-4 border-t border-slate-700/50">
                            <div className="flex gap-2">
                                <Input
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Ask me anything..."
                                    className="flex-1 bg-slate-800 border-slate-700/50 text-white placeholder:text-slate-400 focus:border-blue-500/50 focus:ring-blue-500/20"
                                />
                                <Button
                                    onClick={() => sendMessage(input)}
                                    disabled={!input.trim() || isTyping}
                                    className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white border-0 px-3"
                                >
                                    <Send className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                )}
            </Card>
        </div>
    );
} 