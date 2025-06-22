'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

// Advanced psychological engagement patterns
const ENGAGEMENT_PATTERNS = {
  SOCIAL_PROOF: 'social_proof',
  SCARCITY: 'scarcity',
  PERSONALIZATION: 'personalization',
  ACHIEVEMENT: 'achievement',
  CURIOSITY: 'curiosity',
  AUTHORITY: 'authority',
  RECIPROCITY: 'reciprocity',
  COMMITMENT: 'commitment',
  LIKING: 'liking',
  CONSENSUS: 'consensus'
};

// User context types for advanced personalization
interface UserContext {
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  deviceType: 'desktop' | 'tablet' | 'mobile';
  isReturningUser: boolean;
  visitCount: number;
  preferredInteraction: 'visual' | 'audio' | 'mixed' | 'tactile';
  userGoal?: string;
  professionalRole?: string;
  industryFocus?: string;
  urgencyLevel: 'low' | 'medium' | 'high';
  engagementStyle: 'direct' | 'exploratory' | 'guided' | 'autonomous';
  cognitiveLoad: 'low' | 'medium' | 'high';
  attentionSpan: 'short' | 'medium' | 'long';
  techSavviness: 'beginner' | 'intermediate' | 'advanced';
  emotionalState?: 'focused' | 'stressed' | 'curious' | 'neutral';
  sessionDuration: number;
  interactionPattern: 'click-heavy' | 'scroll-heavy' | 'balanced';
}

interface WelcomeStep {
  id: string;
  title: string;
  content: string;
  audioContent?: string;
  interactionType: 'passive' | 'interactive' | 'voice' | 'gesture';
  psychPattern: string;
  duration: number;
  priority: number;
  conditions?: (context: UserContext) => boolean;
  actions?: {
    primary: { label: string; action: () => void; style?: string };
    secondary?: { label: string; action: () => void; style?: string };
    tertiary?: { label: string; action: () => void; style?: string };
  };
  visualElements?: {
    icon?: string;
    animation?: string;
    color?: string;
    background?: string;
  };
  engagementMetrics?: {
    expectedTimeOnStep: number;
    interactionPoints: string[];
    successCriteria: string[];
  };
}

interface EngagementMetrics {
  startTime: Date;
  interactions: number;
  stepsCompleted: number;
  voiceInteractions: number;
  dismissalAttempts: number;
  timeOnEachStep: Record<string, number>;
  userResponses: Record<string, any>;
  emotionalIndicators: string[];
  completionRate: number;
  satisfactionScore?: number;
  featureDiscovery: string[];
  conversionEvents: string[];
}

interface EnhancedWelcomeProps {
  onComplete: (insights: EngagementMetrics) => void;
  onDismiss: () => void;
  userRole?: string;
  industry?: string;
  isFirstVisit?: boolean;
  customSteps?: WelcomeStep[];
  analyticsEnabled?: boolean;
}

export default function EnhancedWelcomeSystem({
  onComplete,
  onDismiss,
  userRole = 'professional',
  industry = 'healthcare',
  isFirstVisit = true,
  customSteps,
  analyticsEnabled = true
}: EnhancedWelcomeProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [userContext, setUserContext] = useState<UserContext | null>(null);
  const [welcomeSteps, setWelcomeSteps] = useState<WelcomeStep[]>([]);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [engagementMetrics, setEngagementMetrics] = useState<EngagementMetrics>({
    startTime: new Date(),
    interactions: 0,
    stepsCompleted: 0,
    voiceInteractions: 0,
    dismissalAttempts: 0,
    timeOnEachStep: {},
    userResponses: {},
    emotionalIndicators: [],
    completionRate: 0,
    featureDiscovery: [],
    conversionEvents: []
  });
  const [stepStartTime, setStepStartTime] = useState<Date>(new Date());
  const [userPreferences, setUserPreferences] = useState<any>({});
  const [hasInteracted, setHasInteracted] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const speechSynthesis = useRef<SpeechSynthesis | null>(null);
  const recognition = useRef<any>(null);

  // Initialize user context and AI personalization
  useEffect(() => {
    initializeUserContext();
  }, []);

  // Generate personalized content when context is ready
  useEffect(() => {
    if (userContext) {
      generatePersonalizedExperience();
    }
  }, [userContext, userRole, industry]);

  // Auto-show with intelligent timing
  useEffect(() => {
    if (welcomeSteps.length > 0) {
      const shouldShow = determineShowTiming();
      if (shouldShow) {
        setTimeout(() => setIsVisible(true), shouldShow.delay);
      }
    }
  }, [welcomeSteps]);

  // Track time on each step
  useEffect(() => {
    if (isVisible && currentStep < welcomeSteps.length) {
      setStepStartTime(new Date());
    }
  }, [currentStep, isVisible]);

  const initializeUserContext = async () => {
    try {
      const context: UserContext = {
        timeOfDay: getTimeOfDay(),
        deviceType: getDeviceType(),
        isReturningUser: checkReturningUser(),
        visitCount: getVisitCount(),
        preferredInteraction: await detectPreferredInteraction(),
        urgencyLevel: detectUrgencyLevel(),
        engagementStyle: detectEngagementStyle(),
        cognitiveLoad: detectCognitiveLoad(),
        attentionSpan: detectAttentionSpan(),
        techSavviness: detectTechSavviness(),
        emotionalState: detectEmotionalState(),
        sessionDuration: getSessionDuration(),
        interactionPattern: detectInteractionPattern(),
        userGoal: inferUserGoal(),
        professionalRole: userRole,
        industryFocus: industry
      };

      setUserContext(context);
    } catch (error) {
      console.error('Context initialization failed:', error);
      setUserContext(getDefaultContext());
    }
  };

  const generatePersonalizedExperience = async () => {
    if (!userContext) return;

    try {
      setIsLoading(true);

      // Call AI personalization API
      const response = await fetch('/api/ai/enhanced-welcome', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userContext,
          userRole,
          industry,
          isFirstVisit,
          customSteps
        })
      });

      if (response.ok) {
        const { steps, insights } = await response.json();
        setWelcomeSteps(steps || getDefaultSteps(userContext));
        setUserPreferences(insights || {});
      } else {
        setWelcomeSteps(getDefaultSteps(userContext));
      }
    } catch (error) {
      console.error('Personalization failed:', error);
      setWelcomeSteps(getDefaultSteps(userContext));
    } finally {
      setIsLoading(false);
    }
  };

  const getDefaultSteps = (context: UserContext): WelcomeStep[] => {
    const steps: WelcomeStep[] = [];

    // Welcome step with advanced personalization
    if (context.isReturningUser) {
      steps.push({
        id: 'welcome_return',
        title: `Welcome back, ${context.professionalRole}! 👋`,
        content: `Great to see you again. Based on your ${context.visitCount > 1 ? `${context.visitCount} previous visits` : 'last visit'}, I've prepared some enhanced features that align with your usage patterns and professional needs.`,
        audioContent: `Welcome back! I've analyzed your previous interactions and prepared personalized insights to enhance your workflow.`,
        interactionType: 'interactive',
        psychPattern: ENGAGEMENT_PATTERNS.PERSONALIZATION,
        duration: 6000,
        priority: 10,
        visualElements: {
          icon: '🎯',
          animation: 'pulse',
          color: 'blue',
          background: 'gradient'
        },
        actions: {
          primary: {
            label: 'Show me what\'s new',
            action: () => advanceStep(),
            style: 'gradient'
          },
          secondary: {
            label: 'Skip to dashboard',
            action: () => handleSmartDismiss(),
            style: 'outline'
          }
        },
        engagementMetrics: {
          expectedTimeOnStep: 6,
          interactionPoints: ['primary_action', 'secondary_action'],
          successCriteria: ['user_engagement', 'feature_discovery']
        }
      });
    } else {
      steps.push({
        id: 'welcome_new',
        title: `Welcome to Advanced AI Platform`,
        content: context.timeOfDay === 'morning'
          ? 'Good morning! Perfect timing to start your day with enhanced productivity and AI-powered insights.'
          : context.timeOfDay === 'evening'
          ? 'Good evening! Let\'s make your evening workflow more efficient with intelligent automation.'
          : 'Welcome! You\'re joining thousands of professionals who are transforming their practice with cutting-edge AI technology.',
        audioContent: 'Welcome to the future of professional technology. I\'m your AI assistant, and I\'m excited to help you discover how this platform can transform your daily workflow.',
        interactionType: 'interactive',
        psychPattern: ENGAGEMENT_PATTERNS.SOCIAL_PROOF,
        duration: 7000,
        priority: 10,
        visualElements: {
          icon: '🚀',
          animation: 'bounce',
          color: 'purple',
          background: 'gradient'
        },
        actions: {
          primary: {
            label: 'Start exploring',
            action: () => advanceStep(),
            style: 'gradient'
          },
          secondary: {
            label: 'Learn more',
            action: () => advanceStep(),
            style: 'outline'
          }
        }
      });
    }

    // Feature discovery step
    steps.push({
      id: 'feature_discovery',
      title: 'Discover Powerful Features',
      content: `Based on your role as a ${context.professionalRole}, here are the most relevant features for your workflow:`,
      interactionType: 'interactive',
      psychPattern: ENGAGEMENT_PATTERNS.CURIOSITY,
      duration: 8000,
      priority: 9,
      visualElements: {
        icon: '🔍',
        animation: 'fade',
        color: 'green'
      },
      actions: {
        primary: {
          label: 'Explore features',
          action: () => advanceStep()
        },
        secondary: {
          label: 'Skip for now',
          action: () => advanceStep()
        }
      }
    });

    // Social proof step
    steps.push({
      id: 'social_proof',
      title: 'Trusted by Industry Leaders',
      content: 'Join thousands of professionals who have already transformed their workflow with our AI platform.',
      interactionType: 'passive',
      psychPattern: ENGAGEMENT_PATTERNS.SOCIAL_PROOF,
      duration: 5000,
      priority: 8,
      visualElements: {
        icon: '🏆',
        animation: 'pulse'
      }
    });

    // Call to action step
    steps.push({
      id: 'call_to_action',
      title: 'Ready to Get Started?',
      content: 'Your personalized dashboard is ready. Let\'s begin your enhanced workflow experience.',
      interactionType: 'interactive',
      psychPattern: ENGAGEMENT_PATTERNS.COMMITMENT,
      duration: 4000,
      priority: 7,
      visualElements: {
        icon: '✨',
        animation: 'sparkle'
      },
      actions: {
        primary: {
          label: 'Get Started',
          action: () => handleCompletion()
        }
      }
    });

    return steps.sort((a, b) => b.priority - a.priority);
  };

  const determineShowTiming = () => {
    if (!userContext) return null;

    // Don't show if user is in high urgency mode
    if (userContext.urgencyLevel === 'high') return null;

    // Don't show if cognitive load is high
    if (userContext.cognitiveLoad === 'high') return null;

    // Show immediately for first-time users
    if (isFirstVisit) return { delay: 1000 };

    // Show after a delay for returning users
    return { delay: 3000 };
  };

  const advanceStep = () => {
    if (currentStep < welcomeSteps.length - 1) {
      // Track time on current step
      const timeSpent = Date.now() - stepStartTime.getTime();
      setEngagementMetrics(prev => ({
        ...prev,
        timeOnEachStep: {
          ...prev.timeOnEachStep,
          [welcomeSteps[currentStep].id]: timeSpent
        },
        stepsCompleted: prev.stepsCompleted + 1,
        interactions: prev.interactions + 1
      }));

      setCurrentStep(currentStep + 1);
      setHasInteracted(true);
    } else {
      handleCompletion();
    }
  };

  const handleSmartDismiss = () => {
    setEngagementMetrics(prev => ({
      ...prev,
      dismissalAttempts: prev.dismissalAttempts + 1,
      interactions: prev.interactions + 1
    }));

    // If user has interacted, complete the welcome
    if (hasInteracted) {
      handleCompletion();
    } else {
      // If no interaction, just dismiss
      setIsVisible(false);
      onDismiss();
    }
  };

  const handleCompletion = () => {
    const completionData = {
      ...engagementMetrics,
      completionRate: ((currentStep + 1) / welcomeSteps.length) * 100,
      satisfactionScore: calculateSatisfactionScore(),
      featureDiscovery: extractFeatureDiscovery(),
      conversionEvents: ['welcome_completed']
    };

    localStorage.setItem('enhancedWelcomeCompleted', JSON.stringify(completionData));
    setIsVisible(false);
    onComplete(completionData);
  };

  const calculateSatisfactionScore = () => {
    const baseScore = 85;
    const interactionBonus = engagementMetrics.interactions * 5;
    const completionBonus = engagementMetrics.stepsCompleted * 10;
    return Math.min(100, baseScore + interactionBonus + completionBonus);
  };

  const extractFeatureDiscovery = () => {
    return welcomeSteps
      .filter(step => step.id.includes('feature'))
      .map(step => step.id);
  };

  // Utility functions
  const getTimeOfDay = (): UserContext['timeOfDay'] => {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    if (hour < 21) return 'evening';
    return 'night';
  };

  const getDeviceType = (): UserContext['deviceType'] => {
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  };

  const checkReturningUser = (): boolean => {
    return Boolean(localStorage.getItem('enhancedWelcomeCompleted'));
  };

  const getVisitCount = (): number => {
    const count = localStorage.getItem('visitCount');
    const newCount = count ? parseInt(count) + 1 : 1;
    localStorage.setItem('visitCount', newCount.toString());
    return newCount;
  };

  const detectPreferredInteraction = async (): Promise<UserContext['preferredInteraction']> => {
    const hasAudioSupport = 'speechSynthesis' in window && 'webkitSpeechRecognition' in window;
    const previousPref = localStorage.getItem('interactionPreference');
    return previousPref as UserContext['preferredInteraction'] || (hasAudioSupport ? 'mixed' : 'visual');
  };

  const detectUrgencyLevel = (): UserContext['urgencyLevel'] => {
    const urlParams = new URLSearchParams(window.location.search);
    const hasUrgentParams = urlParams.get('urgent') || urlParams.get('emergency');
    return hasUrgentParams ? 'high' : 'medium';
  };

  const detectEngagementStyle = (): UserContext['engagementStyle'] => {
    const userAgent = navigator.userAgent;
    const isMobile = /Mobile|Android|iPhone|iPad/.test(userAgent);
    return isMobile ? 'direct' : 'guided';
  };

  const detectCognitiveLoad = (): UserContext['cognitiveLoad'] => {
    const timeOfDay = getTimeOfDay();
    if (timeOfDay === 'night' || timeOfDay === 'evening') return 'medium';
    return 'low';
  };

  const detectAttentionSpan = (): UserContext['attentionSpan'] => {
    const deviceType = getDeviceType();
    return deviceType === 'mobile' ? 'short' : 'medium';
  };

  const detectTechSavviness = (): UserContext['techSavviness'] => {
    const visitCount = getVisitCount();
    if (visitCount > 5) return 'advanced';
    if (visitCount > 2) return 'intermediate';
    return 'beginner';
  };

  const detectEmotionalState = (): UserContext['emotionalState'] => {
    return 'focused';
  };

  const getSessionDuration = (): number => {
    return 0; // Will be calculated during session
  };

  const detectInteractionPattern = (): UserContext['interactionPattern'] => {
    return 'balanced';
  };

  const inferUserGoal = (): string | undefined => {
    const path = window.location.pathname;
    if (path.includes('dashboard')) return 'overview';
    if (path.includes('patient')) return 'patient_care';
    return 'platform_exploration';
  };

  const getDefaultContext = (): UserContext => ({
    timeOfDay: 'afternoon',
    deviceType: 'desktop',
    isReturningUser: false,
    visitCount: 1,
    preferredInteraction: 'visual',
    urgencyLevel: 'medium',
    engagementStyle: 'guided',
    cognitiveLoad: 'low',
    attentionSpan: 'medium',
    techSavviness: 'intermediate',
    emotionalState: 'focused',
    sessionDuration: 0,
    interactionPattern: 'balanced'
  });

  if (!isVisible || isLoading || welcomeSteps.length === 0) {
    return null;
  }

  const currentStepData = welcomeSteps[currentStep];
  const progress = ((currentStep + 1) / welcomeSteps.length) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-2xl p-8 max-w-lg mx-4 shadow-2xl border border-gray-200 dark:border-gray-700"
      >
        {/* Progress indicator */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Step {currentStep + 1} of {welcomeSteps.length}
            </span>
            <Badge variant="secondary" className="text-xs">
              {currentStepData.psychPattern.replace('_', ' ')}
            </Badge>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step content */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">{currentStepData.visualElements?.icon || '✨'}</span>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {currentStepData.title}
            </h2>
          </div>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {currentStepData.content}
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-between">
          <Button
            variant="outline"
            onClick={handleSmartDismiss}
            className="text-gray-600 hover:text-gray-800"
          >
            Skip Tour
          </Button>

          <div className="flex gap-2">
            {currentStepData.actions?.secondary && (
              <Button
                variant="outline"
                onClick={currentStepData.actions.secondary.action}
              >
                {currentStepData.actions.secondary.label}
              </Button>
            )}

            {currentStepData.actions?.primary && (
              <Button
                onClick={currentStepData.actions.primary.action}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {currentStepData.actions.primary.label}
              </Button>
            )}
          </div>
        </div>

        {/* Engagement indicators */}
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
            <span>Personalized for {userContext?.professionalRole || 'you'}</span>
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              AI Enhanced
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}