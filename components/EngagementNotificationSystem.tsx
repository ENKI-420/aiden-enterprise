/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useState } from 'react';

interface NotificationHook {
  id: string;
  type: 'hint' | 'achievement' | 'suggestion' | 'opportunity' | 'reminder';
  title: string;
  message: string;
  audioMessage?: string;
  priority: 'low' | 'medium' | 'high';
  trigger: {
    condition: string;
    delay: number;
    context?: any;
  };
  actions?: {
    primary?: { label: string; action: () => void };
    dismiss?: { label: string; action: () => void };
  };
  psychPattern: 'curiosity' | 'achievement' | 'social_proof' | 'personalization' | 'authority' | 'subtle_scarcity';
  duration: number;
  positioning: 'top-right' | 'bottom-right' | 'center-bottom' | 'inline';
  animation: 'slide-in' | 'fade-in' | 'pulse' | 'gentle-bounce';
}

interface EngagementContext {
  userActivity: {
    idleTime: number;
    interactionCount: number;
    lastInteraction: Date;
    currentFocus: string;
  };
  sessionData: {
    duration: number;
    pagesVisited: string[];
    featuresUsed: string[];
    voiceEnabled: boolean;
  };
  userProfile: {
    role: string;
    experienceLevel: 'new' | 'intermediate' | 'advanced';
    preferences: any;
  };
}

interface EngagementNotificationProps {
  userContext?: any;
  patientContext?: any;
  onInteraction?: (hookId: string, action: string) => void;
  voiceEnabled?: boolean;
}

export default function EngagementNotificationSystem({
  userContext,
  patientContext,
  onInteraction,
  voiceEnabled = false
}: EngagementNotificationProps) {
  const [activeNotifications, setActiveNotifications] = useState<NotificationHook[]>([]);
  const [engagementContext, setEngagementContext] = useState<EngagementContext>({
    userActivity: {
      idleTime: 0,
      interactionCount: 0,
      lastInteraction: new Date(),
      currentFocus: 'dashboard'
    },
    sessionData: {
      duration: 0,
      pagesVisited: [],
      featuresUsed: [],
      voiceEnabled: voiceEnabled
    },
    userProfile: {
      role: userContext?.professionalRole || 'healthcare_professional',
      experienceLevel: userContext?.isReturningUser ? 'intermediate' : 'new',
      preferences: userContext || {}
    }
  });

  const [dismissedHooks, setDismissedHooks] = useState<Set<string>>(new Set());
  const idleTimeRef = useRef<number>(0);
  const sessionStartRef = useRef<Date>(new Date());
  const interactionTimeoutRef = useRef<NodeJS.Timeout>();
  const speechSynthesis = useRef<SpeechSynthesis | null>(null);

  // Initialize speech synthesis if voice is enabled
  useEffect(() => {
    if (voiceEnabled && 'speechSynthesis' in window) {
      speechSynthesis.current = window.speechSynthesis;
    }
  }, [voiceEnabled]);

  // Track user activity and context
  useEffect(() => {
    const trackActivity = () => {
      setEngagementContext(prev => ({
        ...prev,
        userActivity: {
          ...prev.userActivity,
          lastInteraction: new Date(),
          interactionCount: prev.userActivity.interactionCount + 1,
          idleTime: 0
        }
      }));

      idleTimeRef.current = 0;

      // Reset idle timer
      if (interactionTimeoutRef.current) {
        clearTimeout(interactionTimeoutRef.current);
      }

      interactionTimeoutRef.current = setTimeout(() => {
        checkForIdleEngagement();
      }, 30000); // Check after 30 seconds of inactivity
    };

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, trackActivity, { passive: true });
    });

    // Track session duration
    const sessionTimer = setInterval(() => {
      setEngagementContext(prev => ({
        ...prev,
        sessionData: {
          ...prev.sessionData,
          duration: Date.now() - sessionStartRef.current.getTime()
        },
        userActivity: {
          ...prev.userActivity,
          idleTime: prev.userActivity.idleTime + 1000
        }
      }));
    }, 1000);

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, trackActivity);
      });
      clearInterval(sessionTimer);
      if (interactionTimeoutRef.current) {
        clearTimeout(interactionTimeoutRef.current);
      }
    };
  }, []);

  // Generate contextual engagement hooks
  useEffect(() => {
    const timer = setTimeout(() => {
      generateEngagementHooks();
    }, 5000); // Wait 5 seconds before starting hooks

    return () => clearTimeout(timer);
  }, [engagementContext, patientContext]);

  const generateEngagementHooks = () => {
    const hooks: NotificationHook[] = [];
    const context = engagementContext;

    // Idle engagement hook
    if (context.userActivity.idleTime > 45000 && context.userActivity.interactionCount > 0) {
      hooks.push({
        id: 'idle_suggestion',
        type: 'suggestion',
        title: 'Quick Productivity Tip',
        message: 'While you\'re here, would you like to discover a time-saving feature?',
        audioMessage: 'I noticed you might have a moment. Would you like me to show you a helpful feature?',
        priority: 'low',
        trigger: {
          condition: 'idle_time',
          delay: 2000,
          context: { idleTime: context.userActivity.idleTime }
        },
        actions: {
          primary: { label: 'Show me', action: () => handleHookInteraction('idle_suggestion', 'explore') },
          dismiss: { label: 'Not now', action: () => dismissHook('idle_suggestion') }
        },
        psychPattern: 'curiosity',
        duration: 8000,
        positioning: 'bottom-right',
        animation: 'slide-in'
      });
    }

    // Achievement recognition
    if (context.userActivity.interactionCount > 10 && !dismissedHooks.has('achievement_recognition')) {
      hooks.push({
        id: 'achievement_recognition',
        type: 'achievement',
        title: 'Great Progress! 🎯',
        message: `You've made ${context.userActivity.interactionCount} interactions. You're becoming quite efficient!`,
        audioMessage: 'Excellent! You\'re really getting the hang of the platform.',
        priority: 'medium',
        trigger: {
          condition: 'interaction_milestone',
          delay: 1000
        },
        actions: {
          primary: { label: 'Unlock more features', action: () => handleHookInteraction('achievement_recognition', 'unlock') },
          dismiss: { label: 'Continue', action: () => dismissHook('achievement_recognition') }
        },
        psychPattern: 'achievement',
        duration: 6000,
        positioning: 'top-right',
        animation: 'gentle-bounce'
      });
    }

    // Voice engagement hint (only if not already enabled)
    if (!voiceEnabled && context.sessionData.duration > 60000 && !dismissedHooks.has('voice_hint')) {
      hooks.push({
        id: 'voice_hint',
        type: 'hint',
        title: 'Pro Tip: Voice Commands Available 🎙️',
        message: 'Healthcare professionals save 25% more time with voice navigation.',
        audioMessage: 'Did you know you can control this platform with voice commands?',
        priority: 'low',
        trigger: {
          condition: 'session_duration',
          delay: 3000
        },
        actions: {
          primary: { label: 'Enable voice', action: () => handleHookInteraction('voice_hint', 'enable_voice') },
          dismiss: { label: 'Maybe later', action: () => dismissHook('voice_hint') }
        },
        psychPattern: 'authority',
        duration: 10000,
        positioning: 'center-bottom',
        animation: 'fade-in'
      });
    }

    // Patient context enhancement
    if (patientContext && context.sessionData.duration > 30000 && !dismissedHooks.has('patient_enhancement')) {
      hooks.push({
        id: 'patient_enhancement',
        type: 'opportunity',
        title: 'Enhanced Patient Insights Available',
        message: 'Our AI can provide additional clinical context for this patient case.',
        audioMessage: 'I can provide additional insights about this patient case if you\'d like.',
        priority: 'medium',
        trigger: {
          condition: 'patient_context',
          delay: 2000
        },
        actions: {
          primary: { label: 'Show insights', action: () => handleHookInteraction('patient_enhancement', 'show_insights') },
          dismiss: { label: 'Not needed', action: () => dismissHook('patient_enhancement') }
        },
        psychPattern: 'personalization',
        duration: 8000,
        positioning: 'top-right',
        animation: 'pulse'
      });
    }

    // Role-specific suggestions
    if (context.userProfile.role && context.sessionData.duration > 90000 && !dismissedHooks.has('role_specific')) {
      const roleSpecificMessage = getRoleSpecificMessage(context.userProfile.role);

      hooks.push({
        id: 'role_specific',
        type: 'suggestion',
        title: roleSpecificMessage.title,
        message: roleSpecificMessage.message,
        audioMessage: roleSpecificMessage.audioMessage,
        priority: 'medium',
        trigger: {
          condition: 'role_optimization',
          delay: 1500
        },
        actions: {
          primary: { label: 'Explore', action: () => handleHookInteraction('role_specific', 'explore_role_features') },
          dismiss: { label: 'Skip', action: () => dismissHook('role_specific') }
        },
        psychPattern: 'personalization',
        duration: 9000,
        positioning: 'bottom-right',
        animation: 'slide-in'
      });
    }

    // Session completion nudge (subtle)
    if (context.sessionData.duration > 300000 && context.userActivity.idleTime > 60000 && !dismissedHooks.has('session_completion')) {
      hooks.push({
        id: 'session_completion',
        type: 'reminder',
        title: 'Session Summary Available',
        message: 'You\'ve accomplished quite a bit! Would you like a summary of your session?',
        audioMessage: 'You\'ve been productive today. Would you like me to summarize what you\'ve accomplished?',
        priority: 'low',
        trigger: {
          condition: 'session_length',
          delay: 5000
        },
        actions: {
          primary: { label: 'Show summary', action: () => handleHookInteraction('session_completion', 'show_summary') },
          dismiss: { label: 'Continue working', action: () => dismissHook('session_completion') }
        },
        psychPattern: 'achievement',
        duration: 12000,
        positioning: 'center-bottom',
        animation: 'fade-in'
      });
    }

    // Filter out dismissed hooks and add new ones
    const newHooks = hooks.filter(hook =>
      !dismissedHooks.has(hook.id) &&
      !activeNotifications.some(active => active.id === hook.id)
    );

    if (newHooks.length > 0) {
      // Limit to 1 active notification at a time to avoid overwhelming
      const priorityHook = newHooks.sort((a, b) =>
        getPriorityWeight(b.priority) - getPriorityWeight(a.priority)
      )[0];

      setTimeout(() => {
        setActiveNotifications(prev => [priorityHook]);

        // Auto-dismiss after duration
        setTimeout(() => {
          dismissHook(priorityHook.id);
        }, priorityHook.duration);

        // Speak notification if voice enabled
        if (voiceEnabled && priorityHook.audioMessage) {
          speakNotification(priorityHook.audioMessage);
        }
      }, priorityHook.trigger.delay);
    }
  };

  const checkForIdleEngagement = () => {
    if (engagementContext.userActivity.idleTime > 45000) {
      generateEngagementHooks();
    }
  };

  const handleHookInteraction = (hookId: string, action: string) => {
    onInteraction?.(hookId, action);
    dismissHook(hookId);

    // Log interaction for personalization
    setEngagementContext(prev => ({
      ...prev,
      userActivity: {
        ...prev.userActivity,
        interactionCount: prev.userActivity.interactionCount + 1,
        lastInteraction: new Date()
      }
    }));
  };

  const dismissHook = (hookId: string) => {
    setActiveNotifications(prev => prev.filter(hook => hook.id !== hookId));
    setDismissedHooks(prev => new Set([...prev, hookId]));
  };

  const speakNotification = (message: string) => {
    if (speechSynthesis.current && voiceEnabled) {
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.rate = 0.8;
      utterance.pitch = 1.0;
      utterance.volume = 0.6; // Subtle volume
      speechSynthesis.current.speak(utterance);
    }
  };

  const getPriorityWeight = (priority: string): number => {
    switch (priority) {
      case 'high': return 3;
      case 'medium': return 2;
      case 'low': return 1;
      default: return 1;
    }
  };

  const getRoleSpecificMessage = (role: string) => {
    const roleMessages = {
      physician: {
        title: 'Clinical Decision Support Ready',
        message: 'Advanced diagnostic tools and treatment recommendations are available for your cases.',
        audioMessage: 'I have clinical decision support tools ready that might help with your cases.'
      },
      nurse: {
        title: 'Care Plan Optimization Available',
        message: 'Smart care plan suggestions and medication management tools are ready for your review.',
        audioMessage: 'I can help optimize your care plans and medication management workflows.'
      },
      administrator: {
        title: 'Analytics Dashboard Updated',
        message: 'New efficiency metrics and workflow insights are available in your dashboard.',
        audioMessage: 'Updated analytics and workflow insights are ready for your review.'
      },
      researcher: {
        title: 'Data Analysis Tools Ready',
        message: 'Advanced research tools and statistical analysis features are available for your studies.',
        audioMessage: 'I have research and analysis tools ready that might support your current work.'
      }
    };

    return roleMessages[role as keyof typeof roleMessages] || roleMessages.physician;
  };

  const getPositionClasses = (positioning: string): string => {
    switch (positioning) {
      case 'top-right':
        return 'fixed top-4 right-4 z-40';
      case 'bottom-right':
        return 'fixed bottom-4 right-4 z-40';
      case 'center-bottom':
        return 'fixed bottom-4 left-1/2 transform -translate-x-1/2 z-40';
      case 'inline':
        return 'relative z-30';
      default:
        return 'fixed bottom-4 right-4 z-40';
    }
  };

  const getAnimationClasses = (animation: string): string => {
    switch (animation) {
      case 'slide-in':
        return 'animate-in slide-in-from-right-4 duration-300';
      case 'fade-in':
        return 'animate-in fade-in duration-500';
      case 'pulse':
        return 'animate-pulse';
      case 'gentle-bounce':
        return 'animate-bounce';
      default:
        return 'animate-in fade-in duration-300';
    }
  };

  if (activeNotifications.length === 0) {
    return null;
  }

  return (
    <>
      {activeNotifications.map((notification) => (
        <div
          key={notification.id}
          className={`${getPositionClasses(notification.positioning)} ${getAnimationClasses(notification.animation)} max-w-sm`}
        >
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 backdrop-blur-sm bg-opacity-95">
            {/* Notification header */}
            <div className="flex items-start justify-between mb-2">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                {notification.title}
              </h4>
              <button
                onClick={() => dismissHook(notification.id)}
                className="text-gray-400 hover:text-gray-600 ml-2 text-xs"
                aria-label="Dismiss notification"
              >
                ✕
              </button>
            </div>

            {/* Notification content */}
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
              {notification.message}
            </p>

            {/* Actions */}
            {notification.actions && (
              <div className="flex gap-2">
                {notification.actions.primary && (
                  <button
                    onClick={notification.actions.primary.action}
                    className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    {notification.actions.primary.label}
                  </button>
                )}
                {notification.actions.dismiss && (
                  <button
                    onClick={notification.actions.dismiss.action}
                    className="px-3 py-1 text-xs bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                  >
                    {notification.actions.dismiss.label}
                  </button>
                )}
              </div>
            )}

            {/* Subtle priority indicator */}
            <div className="mt-2 flex justify-between items-center">
              <div className="flex items-center gap-1">
                <div className={`w-2 h-2 rounded-full ${
                  notification.priority === 'high' ? 'bg-red-400' :
                  notification.priority === 'medium' ? 'bg-yellow-400' :
                  'bg-green-400'
                }`} />
                <span className="text-xs text-gray-400">
                  {notification.type}
                </span>
              </div>
              {voiceEnabled && notification.audioMessage && (
                <button
                  onClick={() => speakNotification(notification.audioMessage!)}
                  className="text-xs text-blue-500 hover:text-blue-700"
                  title="Replay audio"
                >
                  🔊
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </>
  );
}