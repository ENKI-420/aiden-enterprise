"use client";

import {
  ArrowRightIcon,
  BeakerIcon,
  CommandLineIcon,
  CpuChipIcon,
  HeartIcon,
  PlusIcon,
  ShieldCheckIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { useState } from 'react';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';

export default function DashboardPage() {
  const [notifications, setNotifications] = useState(5);

  const quickActions = [
    {
      title: 'AI Coding Suite',
      description: 'Launch development environment',
      icon: CommandLineIcon,
      href: '/ai-coding-suite',
      badge: 'AI',
    },
    {
      title: 'Project Spectra',
      description: 'Research & physics simulation',
      icon: BeakerIcon,
      href: '/project-spectra',
      badge: 'Research',
    },
    {
      title: 'Healthcare Platform',
      description: 'Clinical workflow automation',
      icon: HeartIcon,
      href: '/healthcare-platform',
      badge: 'Healthcare',
    },
    {
      title: 'Defense Systems',
      description: 'Cybersecurity & threat detection',
      icon: ShieldCheckIcon,
      href: '/defense-systems',
      badge: 'Defense',
    },
  ];

  const systemMetrics = [
    { label: 'AI Models Active', value: '12', change: '+2' },
    { label: 'Processing Speed', value: '99.9%', change: '+0.1%' },
    { label: 'Security Status', value: 'Secure', change: 'Active' },
    { label: 'Active Users', value: '1,247', change: '+23' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Dashboard</h1>
            <p className="text-slate-400">AI-powered enterprise dashboard with real-time insights and controls</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <PlusIcon className="h-4 w-4 mr-2" />
              New Project
            </Button>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
              <SparklesIcon className="h-4 w-4 mr-2" />
              AI Assistant
            </Button>
          </div>
        </div>

        {/* System Status Overview */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {systemMetrics.map((metric, index) => (
            <Card key={index} className="bg-slate-800 border-slate-700 text-white">
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-white mb-1">{metric.value}</div>
                <div className="text-sm text-slate-300 mb-2">{metric.label}</div>
                <div className="text-xs text-green-400">{metric.change}</div>
              </CardContent>
            </Card>
          ))}
        </section>

        {/* Quick Actions */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Quick Actions</h2>
            <Button variant="ghost" size="sm" className="text-slate-300">
              View All
              <ArrowRightIcon className="h-4 w-4 ml-2" />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <Card key={index} className="bg-slate-800 border-slate-700 hover:bg-slate-700 transition-colors">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <action.icon className="h-6 w-6 text-blue-400" />
                    <Badge className="bg-blue-600">{action.badge}</Badge>
                  </div>
                  <CardTitle className="text-white">{action.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-300">{action.description}</p>
                  <Button asChild className="w-full mt-4 bg-blue-600 hover:bg-blue-700">
                    <a href={action.href}>Launch</a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* AI Status Panel */}
        <section className="mt-8">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-blue-600/20 rounded-lg">
                    <CpuChipIcon className="h-6 w-6 text-blue-400" />
                  </div>
                  <div>
                    <CardTitle className="text-white">IRIS-AI Enterprise Status</CardTitle>
                    <p className="text-sm text-slate-300">
                      Multi-modal AI orchestration system
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-sm text-slate-400">Status</div>
                    <div className="text-lg font-semibold text-green-400">Operational</div>
                  </div>
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">12</div>
                  <div className="text-sm text-slate-400">Active Models</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">99.9%</div>
                  <div className="text-sm text-slate-400">Uptime</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">1.2ms</div>
                  <div className="text-sm text-slate-400">Avg Response</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}