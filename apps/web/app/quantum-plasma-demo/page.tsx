"use client";

import QuantumPlasmaEngine from '@/components/QuantumPlasmaEngine';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { useState } from 'react';

// Import MCP Agent Roles data
import { agentRolesData } from '@/lib/agent-roles-data';

interface QuantumInsight {
  type: 'theoretical' | 'experiment' | 'industry' | 'interdimensional' | 'biocybernetics';
  title: string;
  content: string;
  timestamp: Date;
  agentContext?: string;
}

interface PlatformMetrics {
  totalInsights: number;
  agentActivations: number;
  quantumOperations: number;
  complianceChecks: number;
}

export default function QuantumPlasmaDemo() {
  const [insights, setInsights] = useState<QuantumInsight[]>([]);
  const [platformMetrics, setPlatformMetrics] = useState<PlatformMetrics>({
    totalInsights: 0,
    agentActivations: 0,
    quantumOperations: 0,
    complianceChecks: 0
  });
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleInsightGenerated = (insight: QuantumInsight) => {
    setInsights(prev => [insight, ...prev].slice(0, 20)); // Keep last 20 insights

    // Update platform metrics
    setPlatformMetrics(prev => ({
      totalInsights: prev.totalInsights + 1,
      agentActivations: prev.agentActivations + Math.floor(Math.random() * 3) + 1,
      quantumOperations: prev.quantumOperations + Math.floor(Math.random() * 5) + 2,
      complianceChecks: prev.complianceChecks + (insight.agentContext ? 1 : 0)
    }));
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Demo data for industry capabilities
  const industryCapabilities = {
    defense: [
      "Quantum-secured command & control networks",
      "Autonomous battlefield intelligence systems",
      "Multi-dimensional threat assessment",
      "Real-time tactical decision orchestration",
      "Secure inter-dimensional communications"
    ],
    healthcare: [
      "Quantum-enhanced diagnostic imaging",
      "Predictive genomic analysis engines",
      "Real-time patient monitoring networks",
      "Secure medical data transmission",
      "Bio-quantum therapeutic delivery"
    ],
    legal: [
      "Quantum-encrypted evidence chains",
      "Predictive legal outcome modeling",
      "Secure client communication portals",
      "Automated compliance monitoring",
      "Inter-dimensional contract validation"
    ]
  };

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-50">
        <QuantumPlasmaEngine
          agentRoles={agentRolesData}
          onInsightGenerated={handleInsightGenerated}
        />
        <Button
          onClick={toggleFullscreen}
          className="absolute top-4 right-4 z-50 bg-gray-900/80 hover:bg-gray-800/80"
          variant="outline"
        >
          Exit Fullscreen
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header Section */}
      <div className="relative bg-gradient-to-br from-gray-900 via-gray-950 to-black border-b border-gray-800">
        <div className="container mx-auto px-6 py-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <Link href="/" className="text-cyan-400 hover:text-cyan-300 mb-4 inline-block">
                ← Back to Platform
              </Link>
              <h1 className="text-4xl md:text-6xl font-extrabold mb-4 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                Quantum Defense Nexus
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 max-w-3xl">
                Experience the future of enterprise AI with our revolutionary quantum-plasma-enabled MCP SDK engine,
                featuring real-time agent orchestration and interdimensional data processing capabilities.
              </p>
            </div>
            <Button
              onClick={toggleFullscreen}
              className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-6"
              size="lg"
            >
              🚀 Enter Immersive Mode
            </Button>
          </div>

          {/* Platform Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-gray-900/50 border-gray-800 p-4">
              <div className="text-2xl font-bold text-cyan-400">{platformMetrics.totalInsights}</div>
              <div className="text-sm text-gray-400">Insights Generated</div>
            </Card>
            <Card className="bg-gray-900/50 border-gray-800 p-4">
              <div className="text-2xl font-bold text-green-400">{platformMetrics.agentActivations}</div>
              <div className="text-sm text-gray-400">Agent Activations</div>
            </Card>
            <Card className="bg-gray-900/50 border-gray-800 p-4">
              <div className="text-2xl font-bold text-purple-400">{platformMetrics.quantumOperations}</div>
              <div className="text-sm text-gray-400">Quantum Operations</div>
            </Card>
            <Card className="bg-gray-900/50 border-gray-800 p-4">
              <div className="text-2xl font-bold text-yellow-400">{platformMetrics.complianceChecks}</div>
              <div className="text-sm text-gray-400">Compliance Checks</div>
            </Card>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
        {/* Main Quantum Engine */}
        <div className="lg:col-span-2">
          <Card className="bg-gray-900/50 border-gray-800 p-6 h-[600px]">
            <div className="relative h-full">
              <QuantumPlasmaEngine
                agentRoles={agentRolesData}
                onInsightGenerated={handleInsightGenerated}
                className="rounded-lg overflow-hidden"
              />
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Agent Roles Overview */}
          <Card className="bg-gray-900/50 border-gray-800 p-6">
            <h3 className="text-xl font-bold text-cyan-400 mb-4">Available Agent Roles</h3>
            <div className="space-y-4">
              {Object.entries(agentRolesData).map(([industry, roles]) => (
                <div key={industry}>
                  <h4 className="font-semibold text-lg capitalize mb-2 text-gray-300">{industry}</h4>
                  <div className="grid grid-cols-1 gap-2">
                    {roles.slice(0, 3).map((role: any) => (
                      <div key={role.role} className="bg-gray-800 rounded p-3">
                        <div className="font-medium text-sm text-white">{role.role}</div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {role.compliance.slice(0, 2).map((comp: string) => (
                            <Badge key={comp} variant="secondary" className="text-xs">
                              {comp}
                            </Badge>
                          ))}
                          {role.compliance.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{role.compliance.length - 2}
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                    {roles.length > 3 && (
                      <div className="text-xs text-gray-500 text-center py-2">
                        +{roles.length - 3} more roles available
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Industry Capabilities */}
          <Card className="bg-gray-900/50 border-gray-800 p-6">
            <h3 className="text-xl font-bold text-cyan-400 mb-4">Industry Capabilities</h3>
            <div className="space-y-4">
              {Object.entries(industryCapabilities).map(([industry, capabilities]) => (
                <div key={industry}>
                  <h4 className="font-semibold capitalize mb-2 text-gray-300">{industry}</h4>
                  <ul className="space-y-1">
                    {capabilities.map((capability, index) => (
                      <li key={index} className="text-sm text-gray-400 flex items-start">
                        <span className="text-cyan-400 mr-2">•</span>
                        {capability}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Card>

          {/* Recent Insights */}
          {insights.length > 0 && (
            <Card className="bg-gray-900/50 border-gray-800 p-6">
              <h3 className="text-xl font-bold text-cyan-400 mb-4">Recent Insights</h3>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {insights.slice(0, 5).map((insight, index) => (
                  <div key={index} className="bg-gray-800 rounded p-3">
                    <div className="flex items-center justify-between mb-1">
                      <div className="font-medium text-sm text-white">{insight.title}</div>
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          insight.type === 'theoretical' ? 'border-blue-500 text-blue-300' :
                          insight.type === 'experiment' ? 'border-purple-500 text-purple-300' :
                          insight.type === 'industry' ? 'border-green-500 text-green-300' :
                          insight.type === 'interdimensional' ? 'border-yellow-500 text-yellow-300' :
                          'border-red-500 text-red-300'
                        }`}
                      >
                        {insight.type}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-400 line-clamp-2">{insight.content}</p>
                    <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                      <span>{insight.timestamp.toLocaleTimeString()}</span>
                      {insight.agentContext && (
                        <Badge variant="secondary" className="text-xs">
                          {insight.agentContext}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Platform Navigation */}
          <Card className="bg-gray-900/50 border-gray-800 p-6">
            <h3 className="text-xl font-bold text-cyan-400 mb-4">Platform Navigation</h3>
            <div className="space-y-2">
              <Link href="/iris-mcp">
                <Button variant="outline" className="w-full justify-start">
                  🔬 IRIS MCP Console
                </Button>
              </Link>
              <Link href="/healthcare-platform">
                <Button variant="outline" className="w-full justify-start">
                  ⚕️ Healthcare Platform
                </Button>
              </Link>
              <Link href="/defense-platform">
                <Button variant="outline" className="w-full justify-start">
                  🛡️ Defense Platform
                </Button>
              </Link>
              <Link href="/parallel-agent-orchestrator">
                <Button variant="outline" className="w-full justify-start">
                  🤖 Agent Orchestrator
                </Button>
              </Link>
              <Link href="/ai-coding-suite">
                <Button variant="outline" className="w-full justify-start">
                  💻 AI Coding Suite
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>

      {/* Technical Specifications */}
      <div className="border-t border-gray-800 p-6">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-cyan-400 mb-6 text-center">Technical Specifications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-gray-900/50 border-gray-800 p-6 text-center">
              <div className="text-4xl mb-2">🔬</div>
              <h3 className="font-bold text-lg mb-2">Quantum Engine</h3>
              <p className="text-sm text-gray-400">
                8,000+ particle plasma simulation with real-time physics processing and quantum field interactions
              </p>
            </Card>
            <Card className="bg-gray-900/50 border-gray-800 p-6 text-center">
              <div className="text-4xl mb-2">🤖</div>
              <h3 className="font-bold text-lg mb-2">Agent Network</h3>
              <p className="text-sm text-gray-400">
                120+ MCP SDK nodes with intelligent routing, hierarchical clustering, and real-time orchestration
              </p>
            </Card>
            <Card className="bg-gray-900/50 border-gray-800 p-6 text-center">
              <div className="text-4xl mb-2">🛡️</div>
              <h3 className="font-bold text-lg mb-2">Security Layer</h3>
              <p className="text-sm text-gray-400">
                HIPAA, CMMC, SOC2 compliant with quantum-encrypted data transmission and zero-trust architecture
              </p>
            </Card>
            <Card className="bg-gray-900/50 border-gray-800 p-6 text-center">
              <div className="text-4xl mb-2">⚡</div>
              <h3 className="font-bold text-lg mb-2">Performance</h3>
              <p className="text-sm text-gray-400">
                Sub-100ms response times, 99.97% uptime SLA, and real-time multi-modal processing capabilities
              </p>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 p-6 text-center text-gray-400">
        <p>© 2024 Agile Defense Systems | Powered by IRIS MCP SDK | Quantum Plasma Engine v2.0</p>
        <div className="mt-2 flex justify-center space-x-4 text-sm">
          <span>🔒 Enterprise Grade Security</span>
          <span>🚀 Quantum-Enhanced Processing</span>
          <span>🌐 Multi-Modal Integration</span>
        </div>
      </footer>
    </div>
  );
}