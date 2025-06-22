/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from 'react';

// Psychological engagement patterns
const ENGAGEMENT_PATTERNS = {
  SOCIAL_PROOF: 'social_proof',
  SCARCITY: 'scarcity',
  PERSONALIZATION: 'personalization',
  ACHIEVEMENT: 'achievement',
  CURIOSITY: 'curiosity',
  AUTHORITY: 'authority'
};

// User context types for personalization
interface UserContext {
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  deviceType: 'desktop' | 'tablet' | 'mobile';
  isReturningUser: boolean;
  visitCount: number;
  preferredInteraction: 'visual' | 'audio' | 'mixed';
  userGoal?: string;
  professionalRole?: string;
  industryFocus?: string;
  urgencyLevel: 'low' | 'medium' | 'high';
  engagementStyle: 'direct' | 'exploratory' | 'guided';
}

interface PersonalizedStep {
  id: string;
  title: string;
  content: string;
  audioContent?: string;
  interactionType: 'passive' | 'interactive' | 'voice';
  psychPattern: string;
  duration: number;
  conditions?: (context: UserContext) => boolean;
  actions?: {
    primary: { label: string; action: () => void };
    secondary?: { label: string; action: () => void };
  };
}

interface PersonalizedWelcomeProps {
  onComplete: (insights: any) => void;
  onDismiss: () => void;
  patientContext?: any;
  userRole?: string;
}

export default function PersonalizedWelcomeSystem({
  onComplete,
  onDismiss,
  patientContext,
  userRole = 'healthcare_professional'
}: PersonalizedWelcomeProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [userContext, setUserContext] = useState<UserContext | null>(null);
  const [personalizedSteps, setPersonalizedSteps] = useState<PersonalizedStep[]>([]);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [audioPermissionRequested, setAudioPermissionRequested] = useState(false);
  const [userInsights, setUserInsights] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const [engagementMetrics, setEngagementMetrics] = useState({
    startTime: Date.now(),
    interactions: 0,
    stepsCompleted: 0,
    voiceInteractions: 0,
    dismissalAttempts: 0
  });

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
  }, [userContext, patientContext, userRole]);

  // Auto-show with intelligent timing
  useEffect(() => {
    if (personalizedSteps.length > 0) {
      const shouldShow = determineShowTiming();
      if (shouldShow) {
        setTimeout(() => setIsVisible(true), shouldShow.delay);
      }
    }
  }, [personalizedSteps]);

  const initializeUserContext = async () => {
    try {
      // Gather contextual data
      const context: UserContext = {
        timeOfDay: getTimeOfDay(),
        deviceType: getDeviceType(),
        isReturningUser: checkReturningUser(),
        visitCount: getVisitCount(),
        preferredInteraction: await detectPreferredInteraction(),
        urgencyLevel: detectUrgencyLevel(),
        engagementStyle: detectEngagementStyle(),
        userGoal: inferUserGoal(),
        professionalRole: userRole,
        industryFocus: patientContext ? 'healthcare' : undefined
      };

      setUserContext(context);
    } catch (error) {
      console.error('Context initialization failed:', error);
      // Fallback to basic context
      setUserContext({
        timeOfDay: 'afternoon',
        deviceType: 'desktop',
        isReturningUser: false,
        visitCount: 1,
        preferredInteraction: 'visual',
        urgencyLevel: 'medium',
        engagementStyle: 'guided'
      });
    }
  };

  const generatePersonalizedExperience = async () => {
    if (!userContext) return;

    try {
      setIsLoading(true);

      // Call AI personalization API
      const response = await fetch('/api/ai/personalize-welcome', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userContext,
          patientContext,
          userRole,
          sessionGoals: inferSessionGoals()
        })
      });

      const { steps, insights } = await response.json();

      setPersonalizedSteps(steps || getDefaultSteps(userContext));
      setUserInsights(insights || {});

    } catch (error) {
      console.error('Personalization failed:', error);
      setPersonalizedSteps(getDefaultSteps(userContext));
    } finally {
      setIsLoading(false);
    }
  };

  const getDefaultSteps = (context: UserContext): PersonalizedStep[] => {
    const baseSteps: PersonalizedStep[] = [];

    // Welcome step with psychological personalization
    if (context.isReturningUser) {
      baseSteps.push({
        id: 'welcome_return',
        title: `Welcome back! 👋`,
        content: `Great to see you again. Based on your ${context.visitCount > 1 ? `${context.visitCount} previous visits` : 'last visit'}, we've prepared some enhanced features you might find valuable.`,
        audioContent: `Welcome back! I've noticed you're becoming quite familiar with our platform. Let me show you some powerful features that align with your usage patterns.`,
        interactionType: 'interactive',
        psychPattern: ENGAGEMENT_PATTERNS.PERSONALIZATION,
        duration: 5000,
        actions: {
          primary: {
            label: 'Show me what\'s new',
            action: () => advanceStep()
          },
          secondary: {
            label: 'Skip to dashboard',
            action: () => handleSmartDismiss()
          }
        }
      });
    } else {
      baseSteps.push({
        id: 'welcome_new',
        title: `Welcome to Advanced AI Healthcare Platform`,
        content: context.timeOfDay === 'morning'
          ? 'Good morning! Perfect timing to start your day with enhanced productivity.'
          : context.timeOfDay === 'evening'
          ? 'Good evening! Let\'s make your evening workflow more efficient.'
          : 'Welcome! You\'re joining thousands of healthcare professionals who are transforming their practice with AI.',
        audioContent: 'Welcome to the future of healthcare technology. I\'m your AI assistant, and I\'m excited to help you discover how this platform can transform your daily workflow.',
        interactionType: 'interactive',
        psychPattern: ENGAGEMENT_PATTERNS.SOCIAL_PROOF,
        duration: 6000,
        actions: {
          primary: {
            label: 'Get started',
            action: () => advanceStep()
          }
        }
      });
    }

    // Voice activation step (psychological: authority + scarcity)
    if (!audioPermissionRequested && context.preferredInteraction !== 'visual') {
      baseSteps.push({
        id: 'voice_activation',
        title: 'Unlock Voice-Powered Efficiency 🎙️',
        content: 'Healthcare professionals using voice commands report 40% faster navigation and reduced cognitive load during critical tasks.',
        audioContent: 'May I have permission to enable voice interactions? This will allow hands-free operation, which is particularly valuable during patient consultations or when your hands are occupied.',
        interactionType: 'voice',
        psychPattern: ENGAGEMENT_PATTERNS.AUTHORITY,
        duration: 8000,
        actions: {
          primary: {
            label: 'Enable Voice Features',
            action: () => requestVoicePermission()
          },
          secondary: {
            label: 'Maybe later',
            action: () => advanceStep()
          }
        }
      });
    }

    // Contextual feature introduction
    if (patientContext) {
      baseSteps.push({
        id: 'patient_context',
        title: 'Smart Patient Context Detected',
        content: `I notice you're working with patient data. Our AI can provide contextual insights, treatment recommendations, and seamless EHR integration for enhanced care delivery.`,
        audioContent: 'I see you have patient context loaded. Let me show you how our AI agents can assist with clinical decision-making and documentation.',
        interactionType: 'interactive',
        psychPattern: ENGAGEMENT_PATTERNS.PERSONALIZATION,
        duration: 7000,
        actions: {
          primary: {
            label: 'Show AI Clinical Tools',
            action: () => demonstrateFeature('clinical_ai')
          },
          secondary: {
            label: 'Continue tour',
            action: () => advanceStep()
          }
        }
      });
    }

    // Goal-oriented completion
    baseSteps.push({
      id: 'completion',
      title: 'You\'re All Set! 🚀',
      content: `Perfect! You're now equipped with ${voiceEnabled ? 'voice-enhanced' : 'visual'} AI tools. Your personalized dashboard awaits.`,
      audioContent: 'Excellent! You now have access to all the tools you need. Remember, I\'m always here to assist you.',
      interactionType: 'passive',
      psychPattern: ENGAGEMENT_PATTERNS.ACHIEVEMENT,
      duration: 4000,
      actions: {
        primary: {
          label: 'Enter Dashboard',
          action: () => handleCompletion()
        }
      }
    });

    return baseSteps;
  };

  const determineShowTiming = () => {
    if (!userContext) return null;

    // Don't show if user is clearly focused on urgent task
    if (userContext.urgencyLevel === 'high') {
      return null;
    }

    // Intelligent timing based on context
    let delay = 1500; // Base delay

    if (userContext.isReturningUser) {
      delay = 800; // Faster for returning users
    }

    if (userContext.timeOfDay === 'morning') {
      delay += 500; // Slightly longer in morning (less rushed)
    }

    if (userContext.deviceType === 'mobile') {
      delay += 300; // Account for mobile interaction patterns
    }

    return { delay };
  };

  const requestVoicePermission = async () => {
    setAudioPermissionRequested(true);

    try {
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop()); // Clean up

      // Initialize speech recognition
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognition.current = new SpeechRecognition();
        recognition.current.continuous = false;
        recognition.current.interimResults = false;

        recognition.current.onresult = (event: any) => {
          const command = event.results[0][0].transcript;
          handleVoiceCommand(command);
        };
      }

      // Initialize speech synthesis
      if ('speechSynthesis' in window) {
        speechSynthesis.current = window.speechSynthesis;
      }

      setVoiceEnabled(true);
      updateEngagementMetrics({ voiceInteractions: engagementMetrics.voiceInteractions + 1 });

      // Confirm with voice feedback
      speakText('Voice features activated! You can now use voice commands.');

      advanceStep();
    } catch (error) {
      console.error('Voice permission denied:', error);
      speakText('No problem! You can always enable voice features later in settings.');
      advanceStep();
    }
  };

  const handleVoiceCommand = (command: string) => {
    const lowerCommand = command.toLowerCase();

    if (lowerCommand.includes('next') || lowerCommand.includes('continue')) {
      advanceStep();
    } else if (lowerCommand.includes('skip') || lowerCommand.includes('dismiss')) {
      handleSmartDismiss();
    } else if (lowerCommand.includes('repeat')) {
      speakCurrentStep();
    }
  };

  const speakText = (text: string) => {
    if (voiceEnabled && speechSynthesis.current) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      utterance.volume = 0.8;
      speechSynthesis.current.speak(utterance);
    }
  };

  const speakCurrentStep = () => {
    const currentStepData = personalizedSteps[currentStep];
    if (currentStepData?.audioContent) {
      speakText(currentStepData.audioContent);
    }
  };

  const advanceStep = () => {
    updateEngagementMetrics({
      interactions: engagementMetrics.interactions + 1,
      stepsCompleted: currentStep + 1
    });

    if (currentStep < personalizedSteps.length - 1) {
      setCurrentStep(prev => prev + 1);

      // Auto-speak if voice enabled
      setTimeout(() => {
        if (voiceEnabled) {
          speakCurrentStep();
        }
      }, 500);
    } else {
      handleCompletion();
    }
  };

  const handleSmartDismiss = () => {
    updateEngagementMetrics({ dismissalAttempts: engagementMetrics.dismissalAttempts + 1 });

    // Record partial completion for future personalization
    const completionData = {
      ...engagementMetrics,
      stepsViewed: currentStep + 1,
      totalSteps: personalizedSteps.length,
      completionRate: (currentStep + 1) / personalizedSteps.length,
      userContext,
      dismissalReason: 'user_initiated'
    };

    localStorage.setItem('welcomeCompletion', JSON.stringify(completionData));
    setIsVisible(false);
    onDismiss();
  };

  const handleCompletion = () => {
    const completionData = {
      ...engagementMetrics,
      completedAt: Date.now(),
      duration: Date.now() - engagementMetrics.startTime,
      completionRate: 1.0,
      userContext,
      insights: userInsights,
      voiceEnabled
    };

    localStorage.setItem('welcomeCompletion', JSON.stringify(completionData));
    setIsVisible(false);
    onComplete(completionData);
  };

  const demonstrateFeature = (feature: string) => {
    // Placeholder for feature demonstration
    console.log(`Demonstrating feature: ${feature}`);
    advanceStep();
  };

  const updateEngagementMetrics = (updates: Partial<typeof engagementMetrics>) => {
    setEngagementMetrics(prev => ({ ...prev, ...updates }));
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
    return Boolean(localStorage.getItem('welcomeCompletion'));
  };

  const getVisitCount = (): number => {
    const count = localStorage.getItem('visitCount');
    const newCount = count ? parseInt(count) + 1 : 1;
    localStorage.setItem('visitCount', newCount.toString());
    return newCount;
  };

  const detectPreferredInteraction = async (): Promise<UserContext['preferredInteraction']> => {
    // Check for previous preferences or media capabilities
    const hasAudioSupport = 'speechSynthesis' in window && 'webkitSpeechRecognition' in window;
    const previousPref = localStorage.getItem('interactionPreference');

    if (previousPref) return previousPref as UserContext['preferredInteraction'];
    return hasAudioSupport ? 'mixed' : 'visual';
  };

  const detectUrgencyLevel = (): UserContext['urgencyLevel'] => {
    // Analyze URL parameters, time patterns, etc.
    const urlParams = new URLSearchParams(window.location.search);
    const hasUrgentParams = urlParams.get('urgent') || urlParams.get('emergency');

    if (hasUrgentParams) return 'high';

    const timeOfDay = getTimeOfDay();
    if (timeOfDay === 'night' || timeOfDay === 'evening') return 'medium';

    return 'low';
  };

  const detectEngagementStyle = (): UserContext['engagementStyle'] => {
    const userAgent = navigator.userAgent;
    const isMobile = /Mobile|Android|iPhone|iPad/.test(userAgent);

    return isMobile ? 'direct' : 'guided';
  };

  const inferUserGoal = (): string | undefined => {
    const path = window.location.pathname;
    const search = window.location.search;

    if (path.includes('patient') || search.includes('patient')) return 'patient_care';
    if (path.includes('conference') || search.includes('meeting')) return 'collaboration';
    if (path.includes('dashboard')) return 'overview';

    return undefined;
  };

  const inferSessionGoals = () => {
    return {
      primary: userContext?.userGoal || 'platform_exploration',
      secondary: patientContext ? 'patient_focused' : 'general_productivity',
      context: {
        hasPatientData: Boolean(patientContext),
        timeConstraints: userContext?.urgencyLevel,
        deviceOptimization: userContext?.deviceType
      }
    };
  };

  if (!isVisible || isLoading || personalizedSteps.length === 0) {
    return null;
  }

  const currentStepData = personalizedSteps[currentStep];
  const progress = ((currentStep + 1) / personalizedSteps.length) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-2xl p-8 max-w-lg mx-4 shadow-2xl border border-gray-200 dark:border-gray-700 animate-in fade-in slide-in-from-bottom-4 duration-500">

        {/* Progress indicator */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Step {currentStep + 1} of {personalizedSteps.length}
            </span>
            {voiceEnabled && (
              <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
                🎙️ Voice Active
              </div>
            )}
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Step content */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {currentStepData.title}
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {currentStepData.content}
          </p>
        </div>

        {/* Voice controls */}
        {voiceEnabled && (
          <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="text-sm text-blue-700 dark:text-blue-300 mb-2">
              💡 Try voice commands: "Next", "Skip", or "Repeat"
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={speakCurrentStep}
              className="text-blue-600 border-blue-300 hover:bg-blue-100"
            >
              🔊 Replay Audio
            </Button>
          </div>
        )}

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

            {currentStepData.actions && (
              <Button
                onClick={currentStepData.actions.primary.action}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {currentStepData.actions.primary.label}
              </Button>
            )}
          </div>
        </div>

        {/* Subtle engagement indicators */}
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
            <span>Personalized for {userContext?.professionalRole || 'you'}</span>
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              AI Enhanced
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}