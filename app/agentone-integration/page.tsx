"use client";

// Temporarily disabled for deployment
// import AgentLaboratory from '@/components/agent-laboratory/AgentLaboratory';

export default function AgentOneIntegrationPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950 text-white">
            {/* Hero Section */}
            <section className="py-20 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                        AGENTone Integration
                    </h1>
                    <p className="text-xl md:text-2xl mb-8 text-gray-300">
                        Next-Generation AI Agent Orchestration Platform
                    </p>
                    <div className="mb-12">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-lg">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <span className="text-green-300 font-medium">System Online</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Feature Cards */}
            <section className="py-16 px-4">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-12 text-blue-300">
                        AGENTone Capabilities
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Agent Laboratory */}
                        <div className="bg-gray-900/50 rounded-lg p-8 border border-purple-500/30 hover:border-purple-400/50 transition-all">
                            <div className="text-center mb-6">
                                <div className="w-16 h-16 mx-auto mb-4 bg-purple-500/20 rounded-full flex items-center justify-center">
                                    <span className="text-2xl">🧪</span>
                                </div>
                                <h3 className="text-xl font-bold text-purple-300 mb-2">Agent Laboratory</h3>
                                <p className="text-gray-400">Advanced AI Agent Development & Testing Environment</p>
                            </div>
                            <div className="space-y-2 text-sm text-gray-300">
                                <div className="flex justify-between">
                                    <span>Active Agents:</span>
                                    <span className="text-purple-400">12</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Success Rate:</span>
                                    <span className="text-green-400">94.2%</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Avg Response:</span>
                                    <span className="text-blue-400">1.8s</span>
                                </div>
                            </div>
                        </div>

                        {/* Task Management */}
                        <div className="bg-gray-900/50 rounded-lg p-8 border border-blue-500/30 hover:border-blue-400/50 transition-all">
                            <div className="text-center mb-6">
                                <div className="w-16 h-16 mx-auto mb-4 bg-blue-500/20 rounded-full flex items-center justify-center">
                                    <span className="text-2xl">⚡</span>
                                </div>
                                <h3 className="text-xl font-bold text-blue-300 mb-2">Task Management</h3>
                                <p className="text-gray-400">Intelligent task orchestration and automation</p>
                            </div>
                            <div className="space-y-2 text-sm text-gray-300">
                                <div className="flex justify-between">
                                    <span>Tasks Processed:</span>
                                    <span className="text-blue-400">1,247</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Queue Length:</span>
                                    <span className="text-yellow-400">3</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Throughput:</span>
                                    <span className="text-green-400">89/min</span>
                                </div>
                            </div>
                        </div>

                        {/* Real-time Analytics */}
                        <div className="bg-gray-900/50 rounded-lg p-8 border border-green-500/30 hover:border-green-400/50 transition-all">
                            <div className="text-center mb-6">
                                <div className="w-16 h-16 mx-auto mb-4 bg-green-500/20 rounded-full flex items-center justify-center">
                                    <span className="text-2xl">📊</span>
                                </div>
                                <h3 className="text-xl font-bold text-green-300 mb-2">Real-time Analytics</h3>
                                <p className="text-gray-400">Advanced performance monitoring and insights</p>
                            </div>
                            <div className="space-y-2 text-sm text-gray-300">
                                <div className="flex justify-between">
                                    <span>Uptime:</span>
                                    <span className="text-green-400">99.97%</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>CPU Usage:</span>
                                    <span className="text-orange-400">67%</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Memory:</span>
                                    <span className="text-blue-400">4.2GB</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Status Section */}
            <section className="py-16 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-gray-900/50 rounded-lg p-8 border border-gray-700/50">
                        <h3 className="text-2xl font-bold text-center mb-8 text-white">
                            Platform Status
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <h4 className="text-lg font-semibold text-blue-300">System Health</h4>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-300">API Gateway</span>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                            <span className="text-green-400 text-sm">Operational</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-300">Agent Network</span>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                            <span className="text-green-400 text-sm">Operational</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-300">Database</span>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                            <span className="text-green-400 text-sm">Operational</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <h4 className="text-lg font-semibold text-purple-300">Active Services</h4>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-gray-300">IRIS Medical AI</span>
                                        <span className="text-purple-400">Running</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-300">Defense Analytics</span>
                                        <span className="text-purple-400">Running</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-300">Legal Assistant</span>
                                        <span className="text-purple-400">Running</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-8 px-4 border-t border-gray-800">
                <div className="max-w-4xl mx-auto text-center">
                    <p className="text-gray-400">
                        AGENTone Integration Platform - Powered by IRIS-AI Enterprise
                    </p>
                </div>
            </footer>
        </div>
    );
} 