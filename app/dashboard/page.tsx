"use client";

import { EnhancedPageLayout } from '@/components/ai/AIEnhancedLayout';
import { badgeVariants } from '@/components/ui/design-system';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { CardContent, CardFooter, CardHeader, EnhancedCard } from '@/components/ui/enhanced-card';
import { cn } from '@/lib/utils';
import {
    ArrowRightIcon,
    ArrowTrendingUpIcon,
    BeakerIcon,
    ClockIcon,
    CommandLineIcon,
    CpuChipIcon,
    HeartIcon,
    PlusIcon,
    ShieldCheckIcon,
    SparklesIcon
} from '@heroicons/react/24/outline';
import { useState } from 'react';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [aiStatus, setAiStatus] = useState('ready');
  const [notifications, setNotifications] = useState(5);
  const [recentActivity, setRecentActivity] = useState([
    { id: 1, type: 'ai', message: 'AI model optimization completed', time: '2 min ago', status: 'success' },
    { id: 2, type: 'healthcare', message: 'Patient data sync successful', time: '5 min ago', status: 'success' },
    { id: 3, type: 'defense', message: 'Threat detection alert', time: '10 min ago', status: 'warning' },
    { id: 4, type: 'research', message: 'Project Spectra analysis running', time: '15 min ago', status: 'info' },
  ]);

  const quickActions = [
    {
      title: 'AI Coding Suite',
      description: 'Launch development environment',
      icon: CommandLineIcon,
      href: '/ai-coding-suite',
      category: 'ai',
      badge: 'AI',
    },
    {
      title: 'Project Spectra',
      description: 'Research & physics simulation',
      icon: BeakerIcon,
      href: '/project-spectra',
      category: 'research',
      badge: 'Research',
    },
    {
      title: 'Healthcare Platform',
      description: 'Clinical workflow automation',
      icon: HeartIcon,
      href: '/healthcare-platform',
      category: 'healthcare',
      badge: 'Healthcare',
    },
    {
      title: 'Defense Systems',
      description: 'Cybersecurity & threat detection',
      icon: ShieldCheckIcon,
      href: '/defense-systems',
      category: 'defense',
      badge: 'Defense',
    },
  ];

  const systemMetrics = [
    { label: 'AI Models Active', value: '12', change: '+2', trend: 'up' },
    { label: 'Processing Speed', value: '99.9%', change: '+0.1%', trend: 'up' },
    { label: 'Security Status', value: 'Secure', change: 'Active', trend: 'stable' },
    { label: 'Active Users', value: '1,247', change: '+23', trend: 'up' },
  ];

  const aiInsights = [
    {
      title: 'Performance Optimization',
      description: 'AI models are running at peak efficiency with 99.9% uptime',
      icon: ArrowTrendingUpIcon,
      category: 'success',
    },
    {
      title: 'Security Alert',
      description: 'Enhanced threat detection protocols activated',
      icon: ShieldCheckIcon,
      category: 'warning',
    },
    {
      title: 'Research Progress',
      description: 'Project Spectra analysis 75% complete',
      icon: BeakerIcon,
      category: 'info',
    },
  ];

  return (
    <EnhancedPageLayout
      title="Dashboard"
      description="AI-powered enterprise dashboard with real-time insights and controls"
      userRole="admin"
      variant="gradient"
      actions={
        <div className="flex items-center space-x-2">
          <EnhancedButton variant="outline" size="sm">
            <PlusIcon className="h-4 w-4 mr-2" />
            New Project
          </EnhancedButton>
          <EnhancedButton ai size="sm">
            <SparklesIcon className="h-4 w-4 mr-2" />
            AI Assistant
          </EnhancedButton>
        </div>
      }
    >
      {/* System Status Overview */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {systemMetrics.map((metric, index) => (
          <EnhancedCard
            key={index}
            variant="glass"
            padding="lg"
            className="text-center hover:scale-105 transition-transform duration-300"
          >
            <div className="flex items-center justify-center mb-2">
              <div className={cn(
                "w-2 h-2 rounded-full mr-2",
                {
                  "bg-green-400": metric.trend === 'up',
                  "bg-yellow-400": metric.trend === 'stable',
                  "bg-red-400": metric.trend === 'down',
                }
              )} />
              <span className="text-xs text-muted-foreground">{metric.change}</span>
            </div>
            <div className="text-2xl font-bold text-foreground mb-1">{metric.value}</div>
            <div className="text-sm text-muted-foreground">{metric.label}</div>
          </EnhancedCard>
        ))}
      </section>

      {/* Quick Actions */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Quick Actions</h2>
          <EnhancedButton variant="ghost" size="sm">
            View All
            <ArrowRightIcon className="h-4 w-4 ml-2" />
          </EnhancedButton>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => (
            <EnhancedCard
              key={index}
              variant={action.category === 'ai' ? 'ai' :
                      action.category === 'healthcare' ? 'healthcare' :
                      action.category === 'defense' ? 'defense' : 'interactive'}
              interactive
              glow={action.category === 'ai'}
              className="hover:scale-105 transition-transform duration-300"
              asChild
            >
              <a href={action.href}>
                <CardHeader
                  icon={<action.icon className="h-6 w-6" />}
                  badge={
                    <span className={cn(
                      badgeVariants({
                        variant: action.category === 'ai' ? 'ai' :
                                 action.category === 'healthcare' ? 'healthcare' :
                                 action.category === 'defense' ? 'defense' : 'default'
                      })
                    )}>
                      {action.badge}
                    </span>
                  }
                >
                  {action.title}
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{action.description}</p>
                </CardContent>
              </a>
            </EnhancedCard>
          ))}
        </div>
      </section>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* AI Insights */}
        <div className="lg:col-span-2">
          <EnhancedCard variant="elevated" padding="lg">
            <CardHeader
              icon={<SparklesIcon className="h-6 w-6" />}
              badge={
                <span className={cn(badgeVariants({ variant: 'ai' }))}>
                  AI INSIGHTS
                </span>
              }
            >
              Real-time AI Analysis
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {aiInsights.map((insight, index) => (
                  <div
                    key={index}
                    className={cn(
                      "flex items-start space-x-3 p-3 rounded-lg border",
                      {
                        "border-green-500/20 bg-green-500/5": insight.category === 'success',
                        "border-yellow-500/20 bg-yellow-500/5": insight.category === 'warning',
                        "border-blue-500/20 bg-blue-500/5": insight.category === 'info',
                      }
                    )}
                  >
                    <div className={cn(
                      "p-2 rounded-lg",
                      {
                        "bg-green-500/20 text-green-400": insight.category === 'success',
                        "bg-yellow-500/20 text-yellow-400": insight.category === 'warning',
                        "bg-blue-500/20 text-blue-400": insight.category === 'info',
                      }
                    )}>
                      <insight.icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{insight.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{insight.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </EnhancedCard>
        </div>

        {/* Recent Activity */}
        <div>
          <EnhancedCard variant="elevated" padding="lg">
            <CardHeader
              icon={<ClockIcon className="h-6 w-6" />}
              badge={
                <span className={cn(badgeVariants({ variant: 'default' }))}>
                  LIVE
                </span>
              }
            >
              Recent Activity
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className={cn(
                      "w-2 h-2 rounded-full mt-2",
                      {
                        "bg-green-400": activity.status === 'success',
                        "bg-yellow-400": activity.status === 'warning',
                        "bg-blue-400": activity.status === 'info',
                      }
                    )} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground truncate">{activity.message}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <EnhancedButton variant="ghost" size="sm" className="w-full">
                View All Activity
              </EnhancedButton>
            </CardFooter>
          </EnhancedCard>
        </div>
      </div>

      {/* AI Status Panel */}
      <section className="mt-8">
        <EnhancedCard
          variant="ai"
          padding="lg"
          glow
          className="bg-gradient-to-r from-purple-900/20 to-indigo-900/20"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-500/20 rounded-lg">
                <CpuChipIcon className="h-6 w-6 text-purple-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">AGENT-M3c Status</h3>
                <p className="text-sm text-muted-foreground">
                  Multi-modal AI orchestration system
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Status</div>
                <div className="text-lg font-semibold text-green-400">Operational</div>
              </div>
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">12</div>
              <div className="text-sm text-muted-foreground">Active Models</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">99.9%</div>
              <div className="text-sm text-muted-foreground">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">1.2ms</div>
              <div className="text-sm text-muted-foreground">Avg Response</div>
            </div>
          </div>
        </EnhancedCard>
      </section>
    </EnhancedPageLayout>
  );
}