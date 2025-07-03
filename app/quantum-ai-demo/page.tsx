"use client";

import QuantumAIAssistant from '@/components/QuantumAIAssistant';
import { Bot } from 'lucide-react';
import { useState } from 'react';

export default function QuantumAIDemoPage() {
    const [showAI, setShowAI] = useState(false);

    if (showAI) {
        return <QuantumAIAssistant />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white">
            <section className="py-20 px-4">
                <div className="max-w-6xl mx-auto text-center">
                    <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                        <Bot className="w-16 h-16 text-white" />
                    </div>
                    <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
                        IRIS Quantum AI
                    </h1>
                    <p className="text-2xl mb-8 text-slate-300">
                        Revolutionary AI Assistant for Enterprise
                    </p>
                    <div className="flex justify-center mb-8">
                        <div className="flex items-center gap-3 px-6 py-3 bg-green-500/20 border border-green-500/30 rounded-lg">
                            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                            <span className="text-green-300 font-medium">Quantum Systems Online</span>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowAI(true)}
                        className="px-12 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 rounded-xl text-xl font-bold shadow-2xl transform hover:scale-105 transition-all duration-300"
                    >
                        Launch Quantum AI Assistant
                    </button>
                    <p className="text-slate-400 mt-4">
                        Experience advanced AI with quantum-enhanced processing
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
                        <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-lg p-6">
                            <div className="text-3xl font-bold text-blue-400 mb-2">0.23s</div>
                            <div className="text-slate-400 text-sm">Response Time</div>
                        </div>
                        <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-lg p-6">
                            <div className="text-3xl font-bold text-green-400 mb-2">97.8%</div>
                            <div className="text-slate-400 text-sm">Accuracy Rate</div>
                        </div>
                        <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-lg p-6">
                            <div className="text-3xl font-bold text-red-400 mb-2">99.97%</div>
                            <div className="text-slate-400 text-sm">Security Level</div>
                        </div>
                        <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-lg p-6">
                            <div className="text-3xl font-bold text-cyan-400 mb-2">99.99%</div>
                            <div className="text-slate-400 text-sm">Uptime</div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
} 