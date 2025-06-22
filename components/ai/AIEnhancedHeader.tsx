"use client";

import { animationVariants, badgeVariants, typography } from '@/components/ui/design-system';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { cn } from '@/lib/utils';
import {
  AcademicCapIcon,
  BeakerIcon,
  BellIcon,
  ChartBarIcon,
  CogIcon,
  CommandLineIcon,
  ComputerDesktopIcon,
  HeartIcon,
  HomeIcon,
  MoonIcon,
  RocketLaunchIcon,
  ShieldCheckIcon,
  SparklesIcon,
  SunIcon,
  UserCircleIcon,
  VideoCameraIcon,
} from '@heroicons/react/24/outline';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';

interface AIEnhancedHeaderProps {
  userRole?: string;
  showThemeToggle?: boolean;
  showNotifications?: boolean;
  showUserMenu?: boolean;
  className?: string;
  variant?: 'default' | 'glass' | 'gradient';
}

interface PageInfo {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  category: 'ai' | 'healthcare' | 'defense' | 'research' | 'general';
  features: string[];
  aiCapabilities: string[];
}

const pageInfoMap: Record<string, PageInfo> = {
  '/': {
    title: 'AIDEN Enterprise',
    description: 'AI-Driven Defense & Healthcare Automation Platform',
    icon: RocketLaunchIcon,
    category: 'general',
    features: ['Multi-modal AI', 'Healthcare Automation', 'Defense Systems'],
    aiCapabilities: ['AGENT-M3c Orchestration', 'Real-time Analytics', 'Predictive Modeling'],
  },
  '/ai-coding-suite': {
    title: 'AI Coding Suite',
    description: 'Advanced AI-powered development environment',
    icon: CommandLineIcon,
    category: 'ai',
    features: ['Code Generation', 'Debugging', 'Refactoring'],
    aiCapabilities: ['GPT-4 Integration', 'Code Analysis', 'Auto-completion'],
  },
  '/project-spectra': {
    title: 'Project Spectra',
    description: 'Pyramid research and physics simulation',
    icon: BeakerIcon,
    category: 'research',
    features: ['3D Visualization', 'Physics Simulation', 'Materials Analysis'],
    aiCapabilities: ['Energy Flow Modeling', 'Scalar Wave Analysis', 'Crystal Resonance'],
  },
  '/healthcare-platform': {
    title: 'Healthcare Platform',
    description: 'Clinical workflow automation',
    icon: HeartIcon,
    category: 'healthcare',
    features: ['Patient Management', 'Clinical Decision Support', 'Workflow Automation'],
    aiCapabilities: ['Diagnostic Assistance', 'Treatment Planning', 'Risk Assessment'],
  },
  '/defense-systems': {
    title: 'Defense Systems',
    description: 'Cybersecurity and defense solutions',
    icon: ShieldCheckIcon,
    category: 'defense',
    features: ['Threat Detection', 'Vulnerability Assessment', 'Incident Response'],
    aiCapabilities: ['Anomaly Detection', 'Predictive Threat Analysis', 'Automated Response'],
  },
  '/dashboard': {
    title: 'Dashboard',
    description: 'Main application dashboard',
    icon: HomeIcon,
    category: 'general',
    features: ['Overview', 'Analytics', 'Quick Actions'],
    aiCapabilities: ['Smart Insights', 'Predictive Analytics', 'Automated Reporting'],
  },
  '/conference': {
    title: 'Conference',
    description: 'Virtual conference and collaboration',
    icon: VideoCameraIcon,
    category: 'general',
    features: ['Video Conferencing', 'Screen Sharing', 'Recording'],
    aiCapabilities: ['Transcription', 'Translation', 'Meeting Summaries'],
  },
  '/analytics': {
    title: 'Analytics',
    description: 'Data analytics and insights',
    icon: ChartBarIcon,
    category: 'general',
    features: ['Data Visualization', 'Reporting', 'Trends'],
    aiCapabilities: ['Predictive Analytics', 'Anomaly Detection', 'Automated Insights'],
  },
  '/experiments': {
    title: 'Experiments',
    description: 'Research experiments and trials',
    icon: AcademicCapIcon,
    category: 'research',
    features: ['Experimental Design', 'Data Collection', 'Analysis'],
    aiCapabilities: ['Hypothesis Generation', 'Statistical Analysis', 'Result Interpretation'],
  },
};

export default function AIEnhancedHeader({
  userRole = 'guest',
  showThemeToggle = true,
  showNotifications = true,
  showUserMenu = true,
  className,
  variant = 'default',
}: AIEnhancedHeaderProps) {
  const pathname = usePathname();
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('dark');
  const [notifications, setNotifications] = useState(3);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [aiInsights, setAiInsights] = useState<string[]>([]);

  const currentPage = pageInfoMap[pathname] || pageInfoMap['/'];

  useEffect(() => {
    // Simulate AI insights based on current page and user role
    const insights = generateAIInsights(currentPage, userRole);
    setAiInsights(insights);
  }, [pathname, userRole, currentPage]);

  const generateAIInsights = (page: PageInfo, role: string): string[] => {
    const insights = [];

    if (page.category === 'ai') {
      insights.push('AI models optimized for your workflow');
      insights.push('Real-time code analysis active');
    }

    if (page.category === 'healthcare') {
      insights.push('HIPAA compliance monitoring active');
      insights.push('Clinical decision support enabled');
    }

    if (page.category === 'defense') {
      insights.push('Threat detection systems online');
      insights.push('Security protocols enforced');
    }

    if (role === 'admin') {
      insights.push('Administrative privileges active');
    }

    if (role === 'researcher') {
      insights.push('Research tools and datasets available');
    }

    return insights.slice(0, 2);
  };

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    // Apply theme change logic here
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (newTheme === 'light') {
      document.documentElement.classList.remove('dark');
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'ai': return 'purple';
      case 'healthcare': return 'teal';
      case 'defense': return 'orange';
      case 'research': return 'blue';
      default: return 'gray';
    }
  };

  return (
    <header className={cn(
      "sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
      className
    )}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Left side - Page info */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className={cn(
                "p-2 rounded-lg",
                {
                  "bg-purple-500/20 text-purple-400": currentPage.category === 'ai',
                  "bg-teal-500/20 text-teal-400": currentPage.category === 'healthcare',
                  "bg-orange-500/20 text-orange-400": currentPage.category === 'defense',
                  "bg-blue-500/20 text-blue-400": currentPage.category === 'research',
                  "bg-gray-500/20 text-gray-400": currentPage.category === 'general',
                }
              )}>
                <currentPage.icon className="h-6 w-6" />
              </div>
              <div>
                <h1 className={cn(typography.h4, "text-foreground")}>
                  {currentPage.title}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {currentPage.description}
                </p>
              </div>
            </div>
          </div>

          {/* Center - AI Insights */}
          <div className="hidden lg:flex items-center space-x-4">
            {aiInsights.map((insight, index) => (
              <div
                key={index}
                className={cn(
                  "flex items-center space-x-2 px-3 py-1 rounded-full text-xs",
                  badgeVariants({
                    variant: currentPage.category === 'ai' ? 'ai' :
                             currentPage.category === 'healthcare' ? 'healthcare' :
                             currentPage.category === 'defense' ? 'defense' : 'info'
                  })
                )}
              >
                <SparklesIcon className="h-3 w-3" />
                <span>{insight}</span>
              </div>
            ))}
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center space-x-2">
            {/* Theme Toggle */}
            {showThemeToggle && (
              <div className="flex items-center space-x-1 bg-muted rounded-lg p-1">
                <EnhancedButton
                  variant="ghost"
                  size="sm"
                  onClick={() => handleThemeChange('light')}
                  className={cn(
                    "h-8 px-2",
                    theme === 'light' && "bg-background text-foreground shadow-sm"
                  )}
                >
                  <SunIcon className="h-4 w-4" />
                </EnhancedButton>
                <EnhancedButton
                  variant="ghost"
                  size="sm"
                  onClick={() => handleThemeChange('dark')}
                  className={cn(
                    "h-8 px-2",
                    theme === 'dark' && "bg-background text-foreground shadow-sm"
                  )}
                >
                  <MoonIcon className="h-4 w-4" />
                </EnhancedButton>
                <EnhancedButton
                  variant="ghost"
                  size="sm"
                  onClick={() => handleThemeChange('system')}
                  className={cn(
                    "h-8 px-2",
                    theme === 'system' && "bg-background text-foreground shadow-sm"
                  )}
                >
                  <ComputerDesktopIcon className="h-4 w-4" />
                </EnhancedButton>
              </div>
            )}

            {/* Notifications */}
            {showNotifications && (
              <EnhancedButton
                variant="ghost"
                size="icon"
                className="relative"
                ai
              >
                <BellIcon className="h-5 w-5" />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {notifications}
                  </span>
                )}
              </EnhancedButton>
            )}

            {/* User Menu */}
            {showUserMenu && (
              <div className="relative">
                <EnhancedButton
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="relative"
                >
                  <UserCircleIcon className="h-5 w-5" />
                </EnhancedButton>

                {isUserMenuOpen && (
                  <div className={cn(
                    "absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-background border border-border",
                    animationVariants.slideInFromTop
                  )}>
                    <div className="py-1">
                      <div className="px-4 py-2 text-sm text-muted-foreground border-b border-border">
                        Signed in as <span className="font-medium text-foreground">{userRole}</span>
                      </div>
                      <EnhancedButton
                        variant="ghost"
                        className="w-full justify-start px-4 py-2 text-sm"
                      >
                        <CogIcon className="h-4 w-4 mr-2" />
                        Settings
                      </EnhancedButton>
                      <EnhancedButton
                        variant="ghost"
                        className="w-full justify-start px-4 py-2 text-sm"
                      >
                        Profile
                      </EnhancedButton>
                      <div className="border-t border-border mt-1 pt-1">
                        <EnhancedButton
                          variant="ghost"
                          className="w-full justify-start px-4 py-2 text-sm text-red-600 hover:text-red-700"
                        >
                          Sign out
                        </EnhancedButton>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Mobile AI Insights */}
        <div className="lg:hidden mt-4">
          <div className="flex flex-wrap gap-2">
            {aiInsights.map((insight, index) => (
              <div
                key={index}
                className={cn(
                  "flex items-center space-x-2 px-2 py-1 rounded-full text-xs",
                  badgeVariants({
                    variant: currentPage.category === 'ai' ? 'ai' :
                             currentPage.category === 'healthcare' ? 'healthcare' :
                             currentPage.category === 'defense' ? 'defense' : 'info'
                  })
                )}
              >
                <SparklesIcon className="h-3 w-3" />
                <span>{insight}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}