"use client";

import { tourConfig, UserRole } from '@/lib/tourConfig';
import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import { TourStep } from './TourStep';

interface TourEngineProps {
  userRole?: UserRole;
  onComplete?: (insights: any) => void;
  onDismiss?: () => void;
  autoStart?: boolean;
  forceShow?: boolean;
}

export default function TourEngine({
  userRole = 'guest',
  onComplete,
  onDismiss,
  autoStart = false,
  forceShow = false
}: TourEngineProps) {
  const [isActive, setIsActive] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [currentFlow, setCurrentFlow] = useState<string>('');
  const [progress, setProgress] = useState<Record<string, any>>({});
  const [insights, setInsights] = useState<any>({});
  const [isPaused, setIsPaused] = useState(false);
  const [showHotkeys, setShowHotkeys] = useState(false);

  const autoAdvanceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const hotkeyTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Get role-specific configuration
  const roleConfig = tourConfig.roles[userRole] || tourConfig.roles.guest;
  const currentSteps = currentFlow ? roleConfig.flows[currentFlow]?.steps : roleConfig.steps;

  // Initialize tour state
  useEffect(() => {
    // eslint-disable-next-line no-undef
    if (typeof window === 'undefined') return;

    // eslint-disable-next-line no-undef
    const savedProgress = localStorage.getItem('tourProgress');
    // eslint-disable-next-line no-undef
    const savedInsights = localStorage.getItem('tourInsights');
    // eslint-disable-next-line no-undef
    const lastRole = localStorage.getItem('lastTourRole');
    // eslint-disable-next-line no-undef
    const lastFlow = localStorage.getItem('lastTourFlow');

    if (savedProgress) {
      setProgress(JSON.parse(savedProgress));
    }
    if (savedInsights) {
      setInsights(JSON.parse(savedInsights));
    }

    // Auto-start logic
    if (autoStart || forceShow || shouldAutoStart(userRole, lastRole, lastFlow)) {
      setIsActive(true);
      if (lastFlow && roleConfig.flows[lastFlow]) {
        setCurrentFlow(lastFlow);
      }
    }
  }, [userRole, autoStart, forceShow]);

  // Save progress to localStorage
  useEffect(() => {
    // eslint-disable-next-line no-undef
    if (typeof window === 'undefined' || Object.keys(progress).length === 0) return;

    // eslint-disable-next-line no-undef
    localStorage.setItem('tourProgress', JSON.stringify(progress));
    // eslint-disable-next-line no-undef
    localStorage.setItem('lastTourRole', userRole);
    if (currentFlow) {
      // eslint-disable-next-line no-undef
      localStorage.setItem('lastTourFlow', currentFlow);
    }
  }, [progress, userRole, currentFlow]);

  // Auto-advance timer
  useEffect(() => {
    if (!isActive || isPaused || !currentSteps) return;

    const currentStep = currentSteps[currentStepIndex];
    if (!currentStep || !currentStep.autoAdvance) return;

    autoAdvanceTimerRef.current = setTimeout(() => {
      advanceStep();
    }, currentStep.autoAdvance);

    return () => {
      if (autoAdvanceTimerRef.current) {
        clearTimeout(autoAdvanceTimerRef.current);
      }
    };
  }, [currentStepIndex, isActive, isPaused, currentSteps]);

  // Global hotkey handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isActive) return;

      // Show hotkeys on Alt key press
      if (e.key === 'Alt') {
        setShowHotkeys(true);
        if (hotkeyTimeoutRef.current) {
          clearTimeout(hotkeyTimeoutRef.current);
        }
        hotkeyTimeoutRef.current = setTimeout(() => setShowHotkeys(false), 3000);
        return;
      }

      // Tour navigation hotkeys
      if (e.altKey) {
        switch (e.key) {
          case 'ArrowRight':
          case 'l':
            e.preventDefault();
            advanceStep();
            break;
          case 'ArrowLeft':
          case 'h':
            e.preventDefault();
            previousStep();
            break;
          case 'Escape':
            e.preventDefault();
            pauseTour();
            break;
          case ' ':
            e.preventDefault();
            togglePause();
            break;
          case 's':
            e.preventDefault();
            skipStep();
            break;
          case 'r':
            e.preventDefault();
            restartTour();
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isActive, currentStepIndex, currentSteps]);

  const shouldAutoStart = (currentRole: string, lastRole: string | null, lastFlow: string | null): boolean => {
    // eslint-disable-next-line no-undef
    if (typeof window === 'undefined') return false;

    // eslint-disable-next-line no-undef
    const visitCount = parseInt(localStorage.getItem('visitCount') || '0');
    // eslint-disable-next-line no-undef
    const lastVisit = localStorage.getItem('lastVisit');
    const now = new Date();

    // First visit
    if (visitCount === 0) return true;

    // Role change
    if (lastRole && lastRole !== currentRole) return true;

    // New features available
    if (lastFlow && !roleConfig.flows[lastFlow]) return true;

    // Return visit after 7 days
    if (lastVisit) {
      const lastVisitDate = new Date(lastVisit);
      const daysSinceLastVisit = (now.getTime() - lastVisitDate.getTime()) / (1000 * 60 * 60 * 24);
      if (daysSinceLastVisit > 7) return true;
    }

    return false;
  };

  const advanceStep = useCallback(() => {
    if (!currentSteps) return;

    const currentStep = currentSteps[currentStepIndex];

    // Execute step completion action
    if (currentStep.onComplete) {
      const stepInsights = currentStep.onComplete();
      setInsights(prev => ({ ...prev, [currentStep.id]: stepInsights }));
    }

    // Check if this step unlocks a new flow
    if (currentStep.unlocksFlow) {
      const newFlow = roleConfig.flows[currentStep.unlocksFlow];
      if (newFlow) {
        setCurrentFlow(currentStep.unlocksFlow);
        setCurrentStepIndex(0);
        return;
      }
    }

    // Check for conditional next step
    if (currentStep.conditionalNext) {
      const nextStep = currentStep.conditionalNext(progress, insights);
      if (nextStep) {
        const nextIndex = currentSteps.findIndex(step => step.id === nextStep);
        if (nextIndex !== -1) {
          setCurrentStepIndex(nextIndex);
          return;
        }
      }
    }

    // Regular advancement
    if (currentStepIndex < currentSteps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      // Tour complete
      completeTour();
    }
  }, [currentStepIndex, currentSteps, progress, insights, roleConfig.flows]);

  const previousStep = useCallback(() => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  }, [currentStepIndex]);

  const skipStep = useCallback(() => {
    const currentStep = currentSteps?.[currentStepIndex];
    if (currentStep?.skipCondition && currentStep.skipCondition(progress, insights)) {
      advanceStep();
    }
  }, [currentStepIndex, currentSteps, progress, insights]);

  const pauseTour = useCallback(() => {
    setIsPaused(true);
    if (autoAdvanceTimerRef.current) {
      clearTimeout(autoAdvanceTimerRef.current);
    }
  }, []);

  const resumeTour = useCallback(() => {
    setIsPaused(false);
  }, []);

  const togglePause = useCallback(() => {
    setIsPaused(prev => !prev);
  }, []);

  const restartTour = useCallback(() => {
    setCurrentStepIndex(0);
    setCurrentFlow('');
    setIsPaused(false);
    setProgress({});
    setInsights({});
  }, []);

  const completeTour = useCallback(() => {
    setIsActive(false);

    // Update visit tracking
    // eslint-disable-next-line no-undef
    if (typeof window !== 'undefined') {
      // eslint-disable-next-line no-undef
      const visitCount = parseInt(localStorage.getItem('visitCount') || '0');
      // eslint-disable-next-line no-undef
      localStorage.setItem('visitCount', (visitCount + 1).toString());
      // eslint-disable-next-line no-undef
      localStorage.setItem('lastVisit', new Date().toISOString());
      // eslint-disable-next-line no-undef
      localStorage.setItem('tourCompleted', 'true');
      // eslint-disable-next-line no-undef
      localStorage.setItem('tourInsights', JSON.stringify(insights));
    }

    onComplete?.(insights);
  }, [insights, onComplete]);

  const dismissTour = useCallback(() => {
    setIsActive(false);
    // eslint-disable-next-line no-undef
    if (typeof window !== 'undefined') {
      // eslint-disable-next-line no-undef
      localStorage.setItem('tourDismissed', new Date().toISOString());
    }
    onDismiss?.();
  }, [onDismiss]);

  const updateProgress = useCallback((stepId: string, data: any) => {
    setProgress(prev => ({ ...prev, [stepId]: data }));
  }, []);

  if (!isActive || !currentSteps) return null;

  const currentStep = currentSteps[currentStepIndex];
  if (!currentStep) return null;

  return (
    <>
      {/* Hotkey overlay */}
      <AnimatePresence>
        {showHotkeys && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-4 right-4 bg-black/90 text-white p-4 rounded-lg z-50 text-sm"
          >
            <div className="font-semibold mb-2">Tour Hotkeys:</div>
            <div className="space-y-1 text-xs">
              <div>Alt + → or l: Next step</div>
              <div>Alt + ← or h: Previous step</div>
              <div>Alt + Space: Pause/Resume</div>
              <div>Alt + s: Skip step</div>
              <div>Alt + r: Restart tour</div>
              <div>Alt + Esc: Pause tour</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tour step */}
      <TourStep
        step={currentStep}
        stepIndex={currentStepIndex}
        totalSteps={currentSteps.length}
        isPaused={isPaused}
        progress={progress}
        insights={insights}
        onNext={advanceStep}
        onPrevious={previousStep}
        onSkip={skipStep}
        onPause={pauseTour}
        onResume={resumeTour}
        onDismiss={dismissTour}
        onComplete={completeTour}
        onUpdateProgress={updateProgress}
        userRole={userRole}
        currentFlow={currentFlow}
      />

      {/* Tour progress indicator */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-40">
        <div className="bg-black/80 text-white px-4 py-2 rounded-full text-sm">
          Step {currentStepIndex + 1} of {currentSteps.length}
          {currentFlow && ` • ${currentFlow}`}
        </div>
      </div>

      {/* Tour controls */}
      <div className="fixed bottom-4 left-4 z-40 flex gap-2">
        <button
          onClick={previousStep}
          disabled={currentStepIndex === 0}
          className="px-3 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ← Previous
        </button>
        <button
          onClick={togglePause}
          className="px-3 py-2 bg-yellow-600 text-white rounded-lg"
        >
          {isPaused ? '▶ Resume' : '⏸ Pause'}
        </button>
        <button
          onClick={advanceStep}
          className="px-3 py-2 bg-green-600 text-white rounded-lg"
        >
          Next →
        </button>
        <button
          onClick={dismissTour}
          className="px-3 py-2 bg-red-600 text-white rounded-lg"
        >
          ✕ Dismiss
        </button>
      </div>
    </>
  );
}