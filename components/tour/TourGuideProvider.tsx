"use client";

import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Role, TourFlow, TourStep as TourStepType, getFlowForRole, getStepById, getStepsForFlow } from './tourConfig';
import TourStep from './TourStep';

interface TourContextType {
  // State
  isActive: boolean;
  currentStep: TourStepType | null;
  currentStepIndex: number;
  totalSteps: number;
  currentFlow: TourFlow | null;
  userRole: Role;

  // Actions
  startTour: (flowId?: string, role?: Role) => void;
  stopTour: () => void;
  nextStep: () => void;
  previousStep: () => void;
  skipStep: () => void;
  skipToStep: (stepId: string) => void;
  restartTour: () => void;

  // Utilities
  getProgress: () => number;
  isStepRequired: (stepId: string) => boolean;
  canSkipCurrentStep: () => boolean;
  canGoBack: () => boolean;
}

const TourContext = createContext<TourContextType | undefined>(undefined);

interface TourGuideProviderProps {
  children: React.ReactNode;
  defaultRole?: Role;
  autoStart?: boolean;
  persistProgress?: boolean;
  enableHotkeys?: boolean;
  enableSelfHealing?: boolean;
}

export function TourGuideProvider({
  children,
  defaultRole = 'guest',
  autoStart = true,
  persistProgress = true,
  enableHotkeys = true,
  enableSelfHealing = true
}: TourGuideProviderProps) {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState<TourStepType | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [currentFlow, setCurrentFlow] = useState<TourFlow | null>(null);
  const [userRole, setUserRole] = useState<Role>(defaultRole);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [skippedSteps, setSkippedSteps] = useState<Set<string>>(new Set());
  const [tourSteps, setTourSteps] = useState<TourStepType[]>([]);

  const selfHealingTimeoutRef = useRef<NodeJS.Timeout>();
  const lastActivityRef = useRef<number>(Date.now());

  // SSR-safe localStorage access
  const getStoredValue = useCallback((key: string, defaultValue: any) => {
    if (typeof window === 'undefined') return defaultValue;
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : defaultValue;
    } catch {
      return defaultValue;
    }
  }, []);

  const setStoredValue = useCallback((key: string, value: any) => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  // Load persistent state
  useEffect(() => {
    if (!persistProgress) return;

    const storedRole = getStoredValue('tour_user_role', defaultRole);
    const storedCompleted = getStoredValue('tour_completed_steps', []);
    const storedSkipped = getStoredValue('tour_skipped_steps', []);
    const storedFlow = getStoredValue('tour_current_flow', null);
    const storedStepIndex = getStoredValue('tour_step_index', 0);

    setUserRole(storedRole);
    setCompletedSteps(new Set(storedCompleted));
    setSkippedSteps(new Set(storedSkipped));

    if (storedFlow) {
      setCurrentFlow(storedFlow);
      setCurrentStepIndex(storedStepIndex);
    }
  }, [persistProgress, defaultRole, getStoredValue]);

  // Save persistent state
  useEffect(() => {
    if (!persistProgress) return;

    setStoredValue('tour_user_role', userRole);
    setStoredValue('tour_completed_steps', Array.from(completedSteps));
    setStoredValue('tour_skipped_steps', Array.from(skippedSteps));
    setStoredValue('tour_current_flow', currentFlow);
    setStoredValue('tour_step_index', currentStepIndex);
  }, [persistProgress, userRole, completedSteps, skippedSteps, currentFlow, currentStepIndex, setStoredValue]);

  // Auto-detect user role based on context
  const detectUserRole = useCallback((): Role => {
    if (typeof window === 'undefined') return defaultRole;

    // Check URL patterns
    const pathname = window.location.pathname;
    if (pathname.includes('/admin')) return 'admin';
    if (pathname.includes('/developer') || pathname.includes('/api')) return 'developer';
    if (pathname.includes('/clinical') || pathname.includes('/patient')) return 'clinician';
    if (pathname.includes('/research') || pathname.includes('/analytics')) return 'researcher';
    if (pathname.includes('/executive') || pathname.includes('/dashboard')) return 'executive';

    // Check for role-specific elements
    if (document.querySelector('[data-role="admin"]')) return 'admin';
    if (document.querySelector('[data-role="developer"]')) return 'developer';
    if (document.querySelector('[data-role="clinician"]')) return 'clinician';
    if (document.querySelector('[data-role="researcher"]')) return 'researcher';
    if (document.querySelector('[data-role="executive"]')) return 'executive';

    return defaultRole;
  }, [defaultRole]);

  // Self-healing: Check if current step target exists
  const checkStepValidity = useCallback((step: TourStepType): boolean => {
    if (!step.selector) return true; // Center-positioned steps are always valid

    const element = document.querySelector(step.selector);
    if (!element) return false;

    // Check if element is visible
    const rect = element.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  }, []);

  // Self-healing: Find alternative step if current is invalid
  const findAlternativeStep = useCallback((currentStep: TourStepType, steps: TourStepType[]): TourStepType | null => {
    // Try to find a similar step for the same role
    const alternatives = steps.filter(step =>
      step.role === currentStep.role &&
      step.id !== currentStep.id &&
      checkStepValidity(step)
    );

    return alternatives.length > 0 ? alternatives[0] : null;
  }, [checkStepValidity]);

  // Initialize tour steps
  const initializeTourSteps = useCallback((flow: TourFlow, role: Role) => {
    const steps = getStepsForFlow(flow.id);

    // Filter out completed and skipped steps
    const availableSteps = steps.filter(step =>
      !completedSteps.has(step.id) &&
      !skippedSteps.has(step.id)
    );

    // Self-healing: Remove invalid steps
    const validSteps = availableSteps.filter(step => {
      if (enableSelfHealing && !checkStepValidity(step)) {
        console.warn(`Tour step "${step.id}" target not found, skipping`);
        return false;
      }
      return true;
    });

    setTourSteps(validSteps);
    return validSteps;
  }, [completedSteps, skippedSteps, enableSelfHealing, checkStepValidity]);

  // Start tour
  const startTour = useCallback((flowId?: string, role?: Role) => {
    const detectedRole = role || detectUserRole();
    setUserRole(detectedRole);

    const flow = flowId ?
      getStepsForFlow(flowId).length > 0 ? { id: flowId, steps: getStepsForFlow(flowId).map(s => s.id) } as TourFlow : null :
      getFlowForRole(detectedRole);

    if (!flow) {
      console.warn('No tour flow found for role:', detectedRole);
      return;
    }

    setCurrentFlow(flow);
    const steps = initializeTourSteps(flow, detectedRole);

    if (steps.length === 0) {
      console.warn('No valid tour steps found');
      return;
    }

    setCurrentStepIndex(0);
    setCurrentStep(steps[0]);
    setIsActive(true);
    lastActivityRef.current = Date.now();
  }, [detectUserRole, initializeTourSteps, enableSelfHealing]);

  // Stop tour
  const stopTour = useCallback(() => {
    setIsActive(false);
    setCurrentStep(null);
    setCurrentStepIndex(0);
    setCurrentFlow(null);

    if (selfHealingTimeoutRef.current) {
      clearTimeout(selfHealingTimeoutRef.current);
    }
  }, []);

  // Navigate to next step
  const nextStep = useCallback(() => {
    if (!currentStep || !currentFlow) return;

    // Mark current step as completed
    setCompletedSteps(prev => new Set([...prev, currentStep.id]));
    lastActivityRef.current = Date.now();

    const nextIndex = currentStepIndex + 1;

    if (nextIndex >= tourSteps.length) {
      // Tour completed
      setStoredValue('tour_completed', true);
      setStoredValue('tour_completed_date', new Date().toISOString());
      stopTour();
      return;
    }

    const nextStep = tourSteps[nextIndex];

    // Self-healing: Check if next step is valid
    if (enableSelfHealing && !checkStepValidity(nextStep)) {
      const alternative = findAlternativeStep(nextStep, tourSteps);
      if (alternative) {
        console.warn(`Tour step "${nextStep.id}" invalid, using alternative "${alternative.id}"`);
        setCurrentStep(alternative);
        setCurrentStepIndex(tourSteps.findIndex(s => s.id === alternative.id));
      } else {
        // Skip invalid step
        setSkippedSteps(prev => new Set([...prev, nextStep.id]));
        nextStep(); // Recursive call to try next step
        return;
      }
    } else {
      setCurrentStep(nextStep);
      setCurrentStepIndex(nextIndex);
    }
  }, [currentStep, currentFlow, currentStepIndex, tourSteps, enableSelfHealing, checkStepValidity, findAlternativeStep, stopTour, setStoredValue]);

  // Navigate to previous step
  const previousStep = useCallback(() => {
    if (currentStepIndex <= 0) return;

    const prevIndex = currentStepIndex - 1;
    const prevStep = tourSteps[prevIndex];

    setCurrentStep(prevStep);
    setCurrentStepIndex(prevIndex);
    lastActivityRef.current = Date.now();
  }, [currentStepIndex, tourSteps]);

  // Skip current step
  const skipStep = useCallback(() => {
    if (!currentStep) return;

    setSkippedSteps(prev => new Set([...prev, currentStep.id]));
    nextStep();
  }, [currentStep, nextStep]);

  // Skip to specific step
  const skipToStep = useCallback((stepId: string) => {
    const stepIndex = tourSteps.findIndex(step => step.id === stepId);
    if (stepIndex === -1) return;

    setCurrentStep(tourSteps[stepIndex]);
    setCurrentStepIndex(stepIndex);
    lastActivityRef.current = Date.now();
  }, [tourSteps]);

  // Restart tour
  const restartTour = useCallback(() => {
    setCompletedSteps(new Set());
    setSkippedSteps(new Set());
    setStoredValue('tour_completed', false);
    setStoredValue('tour_completed_date', null);

    if (currentFlow) {
      startTour(currentFlow.id, userRole);
    }
  }, [currentFlow, userRole, startTour, setStoredValue]);

  // Self-healing: Monitor for DOM changes
  useEffect(() => {
    if (!enableSelfHealing || !isActive || !currentStep) return;

    const checkValidity = () => {
      if (!checkStepValidity(currentStep)) {
        console.warn(`Current tour step "${currentStep.id}" became invalid, attempting recovery`);

        const alternative = findAlternativeStep(currentStep, tourSteps);
        if (alternative) {
          setCurrentStep(alternative);
          setCurrentStepIndex(tourSteps.findIndex(s => s.id === alternative.id));
        } else {
          // No alternative found, skip to next
          nextStep();
        }
      }
    };

    // Check validity periodically
    selfHealingTimeoutRef.current = setInterval(checkValidity, 2000);

    return () => {
      if (selfHealingTimeoutRef.current) {
        clearTimeout(selfHealingTimeoutRef.current);
      }
    };
  }, [enableSelfHealing, isActive, currentStep, tourSteps, checkStepValidity, findAlternativeStep, nextStep]);

  // Auto-start tour
  useEffect(() => {
    if (!autoStart) return;

    const hasCompletedTour = getStoredValue('tour_completed', false);
    const shouldAutoStart = !hasCompletedTour && !isActive;

    if (shouldAutoStart) {
      // Delay to allow page to load
      const timer = setTimeout(() => {
        startTour();
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [autoStart, isActive, startTour, getStoredValue]);

  // Global hotkeys
  useEffect(() => {
    if (!enableHotkeys || !isActive) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        stopTour();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [enableHotkeys, isActive, stopTour]);

  // Utility functions
  const getProgress = useCallback(() => {
    if (!currentFlow) return 0;
    const totalSteps = getStepsForFlow(currentFlow.id).length;
    return totalSteps > 0 ? (currentStepIndex / totalSteps) * 100 : 0;
  }, [currentFlow, currentStepIndex]);

  const isStepRequired = useCallback((stepId: string) => {
    const step = getStepById(stepId);
    return step?.required || false;
  }, []);

  const canSkipCurrentStep = useCallback(() => {
    if (!currentStep) return false;
    return !isStepRequired(currentStep.id);
  }, [currentStep, isStepRequired]);

  const canGoBack = useCallback(() => {
    return currentStepIndex > 0;
  }, [currentStepIndex]);

  const contextValue: TourContextType = {
    // State
    isActive,
    currentStep,
    currentStepIndex,
    totalSteps: tourSteps.length,
    currentFlow,
    userRole,

    // Actions
    startTour,
    stopTour,
    nextStep,
    previousStep,
    skipStep,
    skipToStep,
    restartTour,

    // Utilities
    getProgress,
    isStepRequired,
    canSkipCurrentStep,
    canGoBack,
  };

  return (
    <TourContext.Provider value={contextValue}>
      {children}

      {/* Render current tour step */}
      {isActive && currentStep && (
        <TourStep
          step={currentStep}
          isActive={isActive}
          onNext={nextStep}
          onPrevious={previousStep}
          onSkip={skipStep}
          onClose={stopTour}
          currentStepIndex={currentStepIndex}
          totalSteps={tourSteps.length}
          canGoBack={canGoBack()}
          canSkip={canSkipCurrentStep()}
        />
      )}
    </TourContext.Provider>
  );
}

// Hook to use tour context
export function useTour() {
  const context = useContext(TourContext);
  if (context === undefined) {
    throw new Error('useTour must be used within a TourGuideProvider');
  }
  return context;
}

// Hook to get tour progress
export function useTourProgress() {
  const { getProgress, isActive, currentStep, totalSteps, currentStepIndex } = useTour();
  return {
    progress: getProgress(),
    isActive,
    currentStep,
    totalSteps,
    currentStepIndex
  };
}