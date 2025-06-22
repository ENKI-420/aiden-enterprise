'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Activity,
    BarChart3,
    Brain,
    CheckCircle2,
    Database,
    FileText,
    Lock,
    RefreshCw,
    Search,
    Send,
    Shield,
    Users,
    Zap
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface PlatformStatus {
  initialized: boolean;
  deployment: {
    model: string;
    highAvailability: boolean;
  };
  modules: {
    agents: { count: number; active: number };
    compliance: { frameworks: number; violations: number };
    rag: { sources: number };
    ehr: { connections: number };
    analytics: { metrics: number };
  };
}

interface ROIMetrics {
  timeSaved: number;
  errorReduction: number;
  patientSatisfaction: number;
  clinicianSatisfaction: number;
  costSavings: number;
  efficiencyGain: number;
  complianceScore: number;
}

interface Agent {
  id: string;
  role: string;
  name: string;
  status: 'idle' | 'processing' | 'error' | 'offline';
  metrics: {
    requestsHandled: number;
    averageResponseTime: number;
    successRate: number;
  };
}

export default function HealthcarePlatformDashboard() {
  const [status, setStatus] = useState<PlatformStatus | null>(null);
  const [roiMetrics, setRoiMetrics] = useState<ROIMetrics | null>(null);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading platform data
    setTimeout(() => {
      setStatus({
        initialized: true,
        deployment: {
          model: 'hybrid',
          highAvailability: true
        },
        modules: {
          agents: { count: 4, active: 4 },
          compliance: { frameworks: 3, violations: 0 },
          rag: { sources: 5 },
          ehr: { connections: 2 },
          analytics: { metrics: 1247 }
        }
      });

      setRoiMetrics({
        timeSaved: 156.5,
        errorReduction: 4.2,
        patientSatisfaction: 8.7,
        clinicianSatisfaction: 8.3,
        costSavings: 23450,
        efficiencyGain: 34.5,
        complianceScore: 98
      });

      setAgents([
        {
          id: 'rad-001',
          role: 'radiology',
          name: 'Radiology Assistant',
          status: 'idle',
          metrics: {
            requestsHandled: 342,
            averageResponseTime: 1250,
            successRate: 98.5
          }
        },
        {
          id: 'onc-001',
          role: 'oncology',
          name: 'Oncology Specialist',
          status: 'processing',
          metrics: {
            requestsHandled: 156,
            averageResponseTime: 2100,
            successRate: 99.2
          }
        },
        {
          id: 'trial-001',
          role: 'clinical-trial',
          name: 'Clinical Trial Coordinator',
          status: 'idle',
          metrics: {
            requestsHandled: 89,
            averageResponseTime: 1800,
            successRate: 97.8
          }
        },
        {
          id: 'admin-001',
          role: 'admin',
          name: 'Administrative Assistant',
          status: 'idle',
          metrics: {
            requestsHandled: 523,
            averageResponseTime: 850,
            successRate: 99.6
          }
        }
      ]);

      setLoading(false);
    }, 1500);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'idle': return 'bg-green-500';
      case 'processing': return 'bg-blue-500';
      case 'error': return 'bg-red-500';
      case 'offline': return 'bg-gray-500';
      default: return 'bg-gray-400';
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(value);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-lg">Initializing Healthcare Platform...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Healthcare AI Platform
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Enterprise-grade federated multi-agent AI system for healthcare
          </p>
        </div>

        {/* Status Bar */}
        <div className="mb-6">
          <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800 dark:text-green-200">
              Platform is operational • {status?.deployment.model} deployment •
              {status?.deployment.highAvailability ? ' High Availability Enabled' : ''}
            </AlertDescription>
          </Alert>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="agents">AI Agents</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="operations">Operations</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Time Saved</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{roiMetrics?.timeSaved.toFixed(1)} hrs</div>
                  <p className="text-xs text-gray-500 mt-1">This month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Cost Savings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(roiMetrics?.costSavings || 0)}</div>
                  <p className="text-xs text-gray-500 mt-1">Monthly estimate</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Compliance Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{roiMetrics?.complianceScore}%</div>
                  <Progress value={roiMetrics?.complianceScore} className="mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Efficiency Gain</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+{roiMetrics?.efficiencyGain.toFixed(1)}%</div>
                  <p className="text-xs text-gray-500 mt-1">vs manual processes</p>
                </CardContent>
              </Card>
            </div>

            {/* Module Status */}
            <Card>
              <CardHeader>
                <CardTitle>System Modules</CardTitle>
                <CardDescription>Core platform components and their status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-900">
                    <Users className="w-8 h-8 text-blue-500" />
                    <div>
                      <p className="text-sm font-medium">AI Agents</p>
                      <p className="text-xs text-gray-500">{status?.modules.agents.active}/{status?.modules.agents.count} active</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-900">
                    <Shield className="w-8 h-8 text-green-500" />
                    <div>
                      <p className="text-sm font-medium">Compliance</p>
                      <p className="text-xs text-gray-500">{status?.modules.compliance.frameworks} frameworks</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-900">
                    <Brain className="w-8 h-8 text-purple-500" />
                    <div>
                      <p className="text-sm font-medium">RAG Sources</p>
                      <p className="text-xs text-gray-500">{status?.modules.rag.sources} active</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-900">
                    <Database className="w-8 h-8 text-orange-500" />
                    <div>
                      <p className="text-sm font-medium">EHR Systems</p>
                      <p className="text-xs text-gray-500">{status?.modules.ehr.connections} connected</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-900">
                    <BarChart3 className="w-8 h-8 text-cyan-500" />
                    <div>
                      <p className="text-sm font-medium">Analytics</p>
                      <p className="text-xs text-gray-500">{status?.modules.analytics.metrics} metrics</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-900">
                    <Lock className="w-8 h-8 text-red-500" />
                    <div>
                      <p className="text-sm font-medium">Security</p>
                      <p className="text-xs text-gray-500">AES-256 encryption</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common platform operations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <Button variant="outline" className="justify-start">
                    <Search className="w-4 h-4 mr-2" />
                    RAG Query
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <Send className="w-4 h-4 mr-2" />
                    Agent Message
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <FileText className="w-4 h-4 mr-2" />
                    Compliance Report
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <Zap className="w-4 h-4 mr-2" />
                    Run Workflow
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Agents Tab */}
          <TabsContent value="agents" className="space-y-6">
            <div className="grid gap-4">
              {agents.map((agent) => (
                <Card key={agent.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(agent.status)}`} />
                        <div>
                          <CardTitle className="text-lg">{agent.name}</CardTitle>
                          <CardDescription>Role: {agent.role}</CardDescription>
                        </div>
                      </div>
                      <Badge variant={agent.status === 'processing' ? 'default' : 'secondary'}>
                        {agent.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Requests Handled</p>
                        <p className="text-xl font-semibold">{agent.metrics.requestsHandled}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Avg Response Time</p>
                        <p className="text-xl font-semibold">{agent.metrics.averageResponseTime}ms</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Success Rate</p>
                        <p className="text-xl font-semibold">{agent.metrics.successRate}%</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Compliance Tab */}
          <TabsContent value="compliance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Compliance Frameworks</CardTitle>
                <CardDescription>Active regulatory compliance monitoring</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-900">
                    <div className="flex items-center space-x-3">
                      <Shield className="w-6 h-6 text-blue-500" />
                      <div>
                        <p className="font-medium">HIPAA</p>
                        <p className="text-sm text-gray-500">Healthcare privacy and security</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                      <span className="text-sm font-medium text-green-600">Compliant</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-900">
                    <div className="flex items-center space-x-3">
                      <Shield className="w-6 h-6 text-purple-500" />
                      <div>
                        <p className="font-medium">GDPR</p>
                        <p className="text-sm text-gray-500">EU data protection regulation</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                      <span className="text-sm font-medium text-green-600">Compliant</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-900">
                    <div className="flex items-center space-x-3">
                      <Shield className="w-6 h-6 text-orange-500" />
                      <div>
                        <p className="font-medium">CMMC Level 3</p>
                        <p className="text-sm text-gray-500">Defense contractor requirements</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                      <span className="text-sm font-medium text-green-600">Compliant</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Audit Summary</CardTitle>
                <CardDescription>Recent compliance activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Total Access Logs</span>
                    <span className="font-medium">12,847</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">PHI Access Events</span>
                    <span className="font-medium">3,421</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Encryption Operations</span>
                    <span className="font-medium">8,923</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Active Violations</span>
                    <span className="font-medium text-green-600">0</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>ROI Metrics</CardTitle>
                  <CardDescription>Return on investment indicators</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm">Time Saved</span>
                        <span className="text-sm font-medium">{roiMetrics?.timeSaved.toFixed(1)} hrs</span>
                      </div>
                      <Progress value={75} />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm">Error Reduction</span>
                        <span className="text-sm font-medium">{roiMetrics?.errorReduction}%</span>
                      </div>
                      <Progress value={roiMetrics?.errorReduction ? roiMetrics.errorReduction * 10 : 0} />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm">Efficiency Gain</span>
                        <span className="text-sm font-medium">{roiMetrics?.efficiencyGain.toFixed(1)}%</span>
                      </div>
                      <Progress value={roiMetrics?.efficiencyGain} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Satisfaction Scores</CardTitle>
                  <CardDescription>User satisfaction metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm">Patient Satisfaction</span>
                        <span className="text-sm font-medium">{roiMetrics?.patientSatisfaction}/10</span>
                      </div>
                      <Progress value={roiMetrics?.patientSatisfaction ? roiMetrics.patientSatisfaction * 10 : 0} />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm">Clinician Satisfaction</span>
                        <span className="text-sm font-medium">{roiMetrics?.clinicianSatisfaction}/10</span>
                      </div>
                      <Progress value={roiMetrics?.clinicianSatisfaction ? roiMetrics.clinicianSatisfaction * 10 : 0} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Platform Usage</CardTitle>
                <CardDescription>Feature utilization statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Activity className="w-4 h-4 text-blue-500" />
                      <span className="text-sm">Agent Queries</span>
                    </div>
                    <span className="text-sm font-medium">1,247</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Search className="w-4 h-4 text-purple-500" />
                      <span className="text-sm">RAG Searches</span>
                    </div>
                    <span className="text-sm font-medium">523</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Shield className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Compliance Checks</span>
                    </div>
                    <span className="text-sm font-medium">189</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Lock className="w-4 h-4 text-orange-500" />
                      <span className="text-sm">Data Encryptions</span>
                    </div>
                    <span className="text-sm font-medium">1,523</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Operations Tab */}
          <TabsContent value="operations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>System Operations</CardTitle>
                <CardDescription>Platform management and maintenance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button className="w-full justify-start" variant="outline">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Update Knowledge Sources
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Lock className="w-4 h-4 mr-2" />
                    Rotate Encryption Keys
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Database className="w-4 h-4 mr-2" />
                    Backup Platform Data
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <FileText className="w-4 h-4 mr-2" />
                    Export Analytics Report
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Integration Status</CardTitle>
                <CardDescription>External system connections</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-900">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <span className="text-sm font-medium">Epic EHR</span>
                    </div>
                    <span className="text-xs text-gray-500">Connected</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-900">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <span className="text-sm font-medium">Cerner EHR</span>
                    </div>
                    <span className="text-xs text-gray-500">Connected</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-900">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <span className="text-sm font-medium">AWS Cloud</span>
                    </div>
                    <span className="text-xs text-gray-500">Active</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}