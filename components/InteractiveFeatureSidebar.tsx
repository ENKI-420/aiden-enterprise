/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useUIEnhancement } from '@/components/EnhancedUIProvider';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Book,
  ChevronLeft,
  ChevronRight,
  Compass,
  HelpCircle,
  Lightbulb,
  MessageCircle,
  Play,
  Search,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Zap
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface FeatureGuide {
  id: string;
  title: string;
  description: string;
  category: 'ai' | 'collaboration' | 'healthcare' | 'productivity' | 'advanced';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  prerequisites?: string[];
  steps: GuideStep[];
  videoUrl?: string;
  relatedFeatures?: string[];
}

interface GuideStep {
  id: string;
  title: string;
  description: string;
  targetElement?: string;
  action?: 'click' | 'hover' | 'type' | 'navigate';
  actionData?: any;
  tip?: string;
}

interface ContextualSuggestion {
  id: string;
  type: 'feature' | 'tip' | 'shortcut' | 'tutorial';
  title: string;
  description: string;
  priority: number;
  context: string[];
  action: () => void;
  dismissible: boolean;
}

interface InteractiveFeatureSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  currentContext?: string;
  userRole?: string;
}

export default function InteractiveFeatureSidebar({
  isOpen,
  onToggle,
  currentContext = 'general',
  userRole = 'healthcare_professional'
}: InteractiveFeatureSidebarProps) {
  const [activeTab, setActiveTab] = useState<'discover' | 'guides' | 'help' | 'suggestions'>('discover');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGuide, setSelectedGuide] = useState<FeatureGuide | null>(null);
  const [contextualSuggestions, setContextualSuggestions] = useState<ContextualSuggestion[]>([]);
  const [userActivity, setUserActivity] = useState({
    featuresUsed: new Set<string>(),
    timeSpent: 0,
    lastInteraction: new Date()
  });

  const { userProgress, trackInteraction, addContextualHelp, showFeatureSpotlight } = useUIEnhancement();

  // Feature guides database
  const featureGuides: FeatureGuide[] = [
    {
      id: 'voice-commands',
      title: 'Voice Commands & Control',
      description: 'Learn to use hands-free voice commands for faster navigation and accessibility.',
      category: 'productivity',
      difficulty: 'beginner',
      estimatedTime: '3 min',
      steps: [
        {
          id: 'enable-voice',
          title: 'Enable Voice Features',
          description: 'Click the voice activation button to enable speech recognition.',
          targetElement: '[data-voice-button]',
          action: 'click',
          tip: 'Voice commands work best in quiet environments.'
        },
        {
          id: 'basic-commands',
          title: 'Try Basic Commands',
          description: 'Say "Next", "Back", or "Help" to navigate.',
          tip: 'Speak clearly and at normal volume for best results.'
        }
      ],
      relatedFeatures: ['accessibility-features', 'keyboard-shortcuts']
    },
    {
      id: 'ai-assistant',
      title: 'AI-Powered Clinical Assistant',
      description: 'Leverage AI for clinical decision support, documentation, and patient insights.',
      category: 'ai',
      difficulty: 'intermediate',
      estimatedTime: '8 min',
      prerequisites: ['basic-navigation'],
      steps: [
        {
          id: 'open-assistant',
          title: 'Access AI Assistant',
          description: 'Open the AI assistant panel from the sidebar.',
          targetElement: '[data-ai-panel]',
          action: 'click'
        },
        {
          id: 'ask-question',
          title: 'Ask Clinical Questions',
          description: 'Type or speak clinical questions for instant insights.',
          tip: 'Be specific with patient details for more accurate responses.'
        }
      ],
      relatedFeatures: ['patient-context', 'medical-agents']
    },
    {
      id: 'collaborative-conference',
      title: 'Enhanced Video Conferencing',
      description: 'Master advanced conferencing features including AR overlays and real-time AI.',
      category: 'collaboration',
      difficulty: 'intermediate',
      estimatedTime: '10 min',
      steps: [
        {
          id: 'join-conference',
          title: 'Join Conference',
          description: 'Click join to enter the secure conference room.',
          targetElement: '[data-join-button]',
          action: 'click'
        },
        {
          id: 'enable-ar',
          title: 'Enable AR Overlay',
          description: 'Activate AR features for enhanced visualization.',
          tip: 'AR works best with good lighting conditions.'
        }
      ],
      relatedFeatures: ['screen-sharing', 'ar-features']
    },
    {
      id: 'patient-workflow',
      title: 'Patient-Centered Workflows',
      description: 'Optimize patient care with integrated EHR data and AI insights.',
      category: 'healthcare',
      difficulty: 'advanced',
      estimatedTime: '15 min',
      prerequisites: ['ai-assistant', 'basic-navigation'],
      steps: [
        {
          id: 'load-patient',
          title: 'Load Patient Context',
          description: 'Enter patient ID or MRN to load contextual data.',
          targetElement: '[data-patient-bar]',
          action: 'type'
        },
        {
          id: 'review-insights',
          title: 'Review AI Insights',
          description: 'Examine AI-generated clinical insights and recommendations.',
          tip: 'Always validate AI recommendations with clinical judgment.'
        }
      ],
      relatedFeatures: ['medical-agents', 'documentation-assist']
    }
  ];

  // Generate contextual suggestions based on current context
  useEffect(() => {
    const suggestions = generateContextualSuggestions(currentContext, userRole, userActivity);
    setContextualSuggestions(suggestions);
  }, [currentContext, userRole, userActivity]);

  // Track user activity
  useEffect(() => {
    const interval = setInterval(() => {
      setUserActivity(prev => ({
        ...prev,
        timeSpent: prev.timeSpent + 1
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const generateContextualSuggestions = (
    context: string,
    role: string,
    activity: any
  ): ContextualSuggestion[] => {
    const suggestions: ContextualSuggestion[] = [];

    // Context-based suggestions
    if (context === 'conference' && !activity.featuresUsed.has('voice-commands')) {
      suggestions.push({
        id: 'voice-in-conference',
        type: 'tip',
        title: 'Try Voice Commands',
        description: 'Use hands-free voice commands during your conference for better multitasking.',
        priority: 3,
        context: ['conference'],
        action: () => showVoiceCommandsGuide(),
        dismissible: true
      });
    }

    if (context === 'patient-care' && !activity.featuresUsed.has('ai-assistant')) {
      suggestions.push({
        id: 'ai-clinical-support',
        type: 'feature',
        title: 'AI Clinical Support',
        description: 'Get instant clinical insights and decision support for this patient.',
        priority: 5,
        context: ['patient-care', 'clinical'],
        action: () => showAIAssistantGuide(),
        dismissible: true
      });
    }

    // Role-based suggestions
    if (role === 'physician' && activity.timeSpent > 300) {
      suggestions.push({
        id: 'efficiency-shortcuts',
        type: 'shortcut',
        title: 'Keyboard Shortcuts',
        description: 'Learn time-saving keyboard shortcuts for faster navigation.',
        priority: 2,
        context: ['productivity'],
        action: () => showShortcutsGuide(),
        dismissible: true
      });
    }

    // Usage pattern suggestions
    if (activity.featuresUsed.size >= 3 && !userProgress.completedTutorials.includes('advanced-features')) {
      suggestions.push({
        id: 'advanced-features',
        type: 'tutorial',
        title: 'Advanced Features Tour',
        description: 'You\'re ready for advanced features! Take the comprehensive tour.',
        priority: 4,
        context: ['advanced'],
        action: () => startAdvancedTour(),
        dismissible: false
      });
    }

    return suggestions.sort((a, b) => b.priority - a.priority);
  };

  const showVoiceCommandsGuide = () => {
    setSelectedGuide(featureGuides.find(g => g.id === 'voice-commands') || null);
    setActiveTab('guides');
  };

  const showAIAssistantGuide = () => {
    setSelectedGuide(featureGuides.find(g => g.id === 'ai-assistant') || null);
    setActiveTab('guides');
  };

  const showShortcutsGuide = () => {
    addContextualHelp({
      id: 'shortcuts-help',
      type: 'tip',
      title: 'Keyboard Shortcuts',
      content: 'Press Ctrl+/ to see all available shortcuts, or Ctrl+K for quick commands.',
      position: { x: window.innerWidth / 2, y: 100 },
      priority: 'medium',
      dismissible: true,
      autoHide: 8000
    });
  };

  const startAdvancedTour = () => {
    showFeatureSpotlight({
      id: 'advanced-tour-start',
      title: 'Advanced Features Unlocked!',
      description: 'You\'ve mastered the basics. Ready to explore advanced AI capabilities?',
      targetSelector: '[data-ai-panel]',
      placement: 'left',
      highlightColor: '#8b5cf6',
      onComplete: () => {
        // Start comprehensive advanced tour
        trackInteraction({
          id: 'advanced-tour-started',
          type: 'click',
          element: 'advanced-tour',
          timestamp: new Date(),
          context: { fromSidebar: true }
        });
      }
    });
  };

  const startGuide = (guide: FeatureGuide) => {
    setSelectedGuide(guide);
    trackInteraction({
      id: `guide-started-${guide.id}`,
      type: 'click',
      element: 'feature-guide',
      timestamp: new Date(),
      context: { guideId: guide.id, category: guide.category }
    });

    // Add feature to used set
    setUserActivity(prev => ({
      ...prev,
      featuresUsed: new Set([...prev.featuresUsed, guide.id])
    }));
  };

  const filteredGuides = featureGuides.filter(guide =>
    guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    guide.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    guide.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const tabs = [
    { id: 'discover', label: 'Discover', icon: Compass },
    { id: 'guides', label: 'Guides', icon: Book },
    { id: 'help', label: 'Help', icon: HelpCircle },
    { id: 'suggestions', label: 'Smart Tips', icon: Lightbulb }
  ];

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={onToggle}
        aria-label={isOpen ? 'Close feature sidebar' : 'Open feature sidebar'}
        className={`fixed left-4 top-1/2 -translate-y-1/2 z-30 bg-white dark:bg-gray-800 shadow-lg rounded-r-lg p-2 border-r border-t border-b border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 ${
          isOpen ? 'translate-x-80' : 'translate-x-0'
        }`}
      >
        {isOpen ? (
          <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        ) : (
          <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        )}
      </button>

      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: -320, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -320, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed left-0 top-0 bottom-0 w-80 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 shadow-xl z-20 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-blue-500" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Feature Assistant
                </h2>
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search features..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 dark:border-gray-700">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 flex items-center justify-center gap-1 py-3 px-2 text-xs font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 border-b-2 border-blue-600'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {activeTab === 'discover' && (
                <DiscoverTab
                  guides={filteredGuides}
                  onStartGuide={startGuide}
                  userProgress={userProgress}
                />
              )}

              {activeTab === 'guides' && (
                <GuidesTab
                  guides={filteredGuides}
                  selectedGuide={selectedGuide}
                  onSelectGuide={setSelectedGuide}
                  onStartGuide={startGuide}
                />
              )}

              {activeTab === 'help' && (
                <HelpTab
                  userRole={userRole}
                  context={currentContext}
                />
              )}

              {activeTab === 'suggestions' && (
                <SuggestionsTab
                  suggestions={contextualSuggestions}
                  onDismiss={(id) => {
                    setContextualSuggestions(prev => prev.filter(s => s.id !== id));
                  }}
                />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function DiscoverTab({
  guides,
  onStartGuide,
  userProgress
}: {
  guides: FeatureGuide[];
  onStartGuide: (guide: FeatureGuide) => void;
  userProgress: any;
}) {
  const categories = [
    { id: 'ai', label: 'AI Features', icon: Zap, color: 'text-purple-500' },
    { id: 'collaboration', label: 'Collaboration', icon: Users, color: 'text-blue-500' },
    { id: 'healthcare', label: 'Healthcare', icon: Target, color: 'text-green-500' },
    { id: 'productivity', label: 'Productivity', icon: TrendingUp, color: 'text-orange-500' }
  ];

  return (
    <div className="p-4 space-y-4">
      <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Discover features tailored to your role and usage patterns.
      </div>

      {categories.map((category) => {
        const categoryGuides = guides.filter(g => g.category === category.id);
        if (categoryGuides.length === 0) return null;

        return (
          <div key={category.id} className="space-y-2">
            <div className="flex items-center gap-2">
              <category.icon className={`w-4 h-4 ${category.color}`} />
              <h3 className="font-medium text-gray-900 dark:text-white">
                {category.label}
              </h3>
            </div>

            <div className="space-y-2">
              {categoryGuides.slice(0, 3).map((guide) => (
                <div
                  key={guide.id}
                  className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                  onClick={() => onStartGuide(guide)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                        {guide.title}
                      </h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        {guide.description}
                      </p>
                      <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                        <span>{guide.estimatedTime}</span>
                        <span>•</span>
                        <span className={`capitalize ${
                          guide.difficulty === 'beginner' ? 'text-green-600' :
                          guide.difficulty === 'intermediate' ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {guide.difficulty}
                        </span>
                      </div>
                    </div>
                    <Play className="w-4 h-4 text-gray-400 flex-shrink-0 ml-2" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function GuidesTab({
  guides,
  selectedGuide,
  onSelectGuide,
  onStartGuide
}: {
  guides: FeatureGuide[];
  selectedGuide: FeatureGuide | null;
  onSelectGuide: (guide: FeatureGuide | null) => void;
  onStartGuide: (guide: FeatureGuide) => void;
}) {
  if (selectedGuide) {
    return (
      <div className="p-4">
        <button
          onClick={() => onSelectGuide(null)}
          className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 mb-4"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to guides
        </button>

        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {selectedGuide.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {selectedGuide.description}
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span>{selectedGuide.estimatedTime}</span>
            <span className={`capitalize px-2 py-1 rounded ${
              selectedGuide.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
              selectedGuide.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {selectedGuide.difficulty}
            </span>
          </div>

          <button
            onClick={() => onStartGuide(selectedGuide)}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4" />
            Start Guide
          </button>

          <div className="space-y-3">
            <h4 className="font-medium text-gray-900 dark:text-white">Steps:</h4>
            {selectedGuide.steps.map((step, index) => (
              <div key={step.id} className="flex gap-3">
                <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                  {index + 1}
                </div>
                <div>
                  <h5 className="text-sm font-medium text-gray-900 dark:text-white">
                    {step.title}
                  </h5>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {step.description}
                  </p>
                  {step.tip && (
                    <p className="text-xs text-blue-600 mt-1 flex items-center gap-1">
                      <Lightbulb className="w-3 h-3" />
                      {step.tip}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-3">
      {guides.map((guide) => (
        <div
          key={guide.id}
          className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
          onClick={() => onSelectGuide(guide)}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                {guide.title}
              </h4>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                {guide.description}
              </p>
              <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                <span>{guide.estimatedTime}</span>
                <span>•</span>
                <span className="capitalize">{guide.difficulty}</span>
                <span>•</span>
                <span>{guide.steps.length} steps</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0 ml-2" />
          </div>
        </div>
      ))}
    </div>
  );
}

function HelpTab({ userRole, context }: { userRole: string; context: string }) {
  const helpResources = [
    {
      title: 'Quick Start Guide',
      description: 'Essential features for new users',
      icon: Play,
      action: () => console.log('Open quick start')
    },
    {
      title: 'Keyboard Shortcuts',
      description: 'Speed up your workflow',
      icon: Zap,
      action: () => console.log('Show shortcuts')
    },
    {
      title: 'Video Tutorials',
      description: 'Step-by-step video guides',
      icon: Play,
      action: () => console.log('Open video library')
    },
    {
      title: 'Live Support',
      description: 'Chat with our support team',
      icon: MessageCircle,
      action: () => console.log('Open live chat')
    }
  ];

  return (
    <div className="p-4 space-y-4">
      <div className="text-sm text-gray-600 dark:text-gray-400">
        Get help and support tailored to your role as a {userRole.replace('_', ' ')}.
      </div>

      <div className="space-y-3">
        {helpResources.map((resource) => (
          <button
            key={resource.title}
            onClick={resource.action}
            className="w-full p-3 text-left bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="flex items-center gap-3">
              <resource.icon className="w-5 h-5 text-blue-500" />
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  {resource.title}
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {resource.description}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-6 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
          Need immediate help?
        </h4>
        <p className="text-xs text-blue-700 dark:text-blue-200 mb-3">
          Press Ctrl+? for instant help, or Ctrl+K for the command palette.
        </p>
        <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">
          Contact Support →
        </button>
      </div>
    </div>
  );
}

function SuggestionsTab({
  suggestions,
  onDismiss
}: {
  suggestions: ContextualSuggestion[];
  onDismiss: (id: string) => void;
}) {
  if (suggestions.length === 0) {
    return (
      <div className="p-4 text-center">
        <Lightbulb className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-sm text-gray-600 dark:text-gray-400">
          No suggestions right now. Keep exploring to unlock personalized tips!
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-3">
      {suggestions.map((suggestion) => (
        <div
          key={suggestion.id}
          className={`p-3 rounded-lg border-l-4 ${
            suggestion.type === 'feature' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' :
            suggestion.type === 'tip' ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' :
            suggestion.type === 'shortcut' ? 'border-green-500 bg-green-50 dark:bg-green-900/20' :
            'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                {suggestion.title}
              </h4>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                {suggestion.description}
              </p>
              <button
                onClick={suggestion.action}
                className="mt-2 text-xs font-medium text-blue-600 hover:text-blue-700"
              >
                Try it now →
              </button>
            </div>
            {suggestion.dismissible && (
              <button
                onClick={() => onDismiss(suggestion.id)}
                className="text-gray-400 hover:text-gray-600 ml-2"
              >
                ×
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}