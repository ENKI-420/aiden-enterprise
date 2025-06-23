"use client";

import { Button } from '@/components/ui/button';
import { TourStep as TourStepType } from '@/lib/tourConfig';
import { ChevronLeftIcon, ChevronRightIcon, PauseIcon, PlayIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

interface TourStepProps {
  step: TourStepType;
  isActive: boolean;
  onNext: () => void;
  onPrevious: () => void;
  onSkip: () => void;
  onPause: () => void;
  onResume: () => void;
  isPaused: boolean;
  isFirst: boolean;
  isLast: boolean;
  progress: number;
  totalSteps: number;
}

export function TourStep({
  step,
  isActive,
  onNext,
  onPrevious,
  onSkip,
  onPause,
  onResume,
  isPaused,
  isFirst,
  isLast,
  progress,
  totalSteps,
}: TourStepProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
  const stepRef = useRef<HTMLDivElement>(null);

  // Find and position the target element
  useEffect(() => {
    if (typeof window === 'undefined' || !step.target) {
      setTargetElement(null);
      return;
    }

    const element = document.querySelector(step.target) as HTMLElement;
    if (element) {
      setTargetElement(element);
      updatePosition(element);
    }

    // Update position on window resize
    const handleResize = () => {
      if (element) {
        updatePosition(element);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [step.target]);

  const updatePosition = (element: HTMLElement) => {
    if (typeof window === 'undefined') return;

    const rect = element.getBoundingClientRect();
    const stepRect = stepRef.current?.getBoundingClientRect();

    if (!stepRect) return;

    let x = 0;
    let y = 0;

    switch (step.position) {
      case 'top':
        x = rect.left + rect.width / 2 - stepRect.width / 2;
        y = rect.top - stepRect.height - 20;
        break;
      case 'bottom':
        x = rect.left + rect.width / 2 - stepRect.width / 2;
        y = rect.bottom + 20;
        break;
      case 'left':
        x = rect.left - stepRect.width - 20;
        y = rect.top + rect.height / 2 - stepRect.height / 2;
        break;
      case 'right':
        x = rect.right + 20;
        y = rect.top + rect.height / 2 - stepRect.height / 2;
        break;
      case 'center':
      default:
        x = window.innerWidth / 2 - stepRect.width / 2;
        y = window.innerHeight / 2 - stepRect.height / 2;
        break;
    }

    // Ensure the step stays within viewport bounds
    x = Math.max(20, Math.min(x, window.innerWidth - stepRect.width - 20));
    y = Math.max(20, Math.min(y, window.innerHeight - stepRect.height - 20));

    setPosition({ x, y });
  };

  // Highlight target element
  useEffect(() => {
    if (targetElement) {
      targetElement.style.outline = '2px solid #3b82f6';
      targetElement.style.outlineOffset = '2px';
      targetElement.style.zIndex = '1000';
    }

    return () => {
      if (targetElement) {
        targetElement.style.outline = '';
        targetElement.style.outlineOffset = '';
        targetElement.style.zIndex = '';
      }
    };
  }, [targetElement]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onSkip();
    } else if (e.key === 'ArrowRight' || e.key === 'l') {
      onNext();
    } else if (e.key === 'ArrowLeft' || e.key === 'h') {
      onPrevious();
    } else if (e.key === ' ') {
      e.preventDefault();
      if (isPaused) {
        onResume();
      } else {
        onPause();
      }
    }
  };

  if (!isActive) return null;

  return (
    <AnimatePresence>
      <motion.div
        ref={stepRef}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.2 }}
        className="fixed z-[9999] bg-white dark:bg-gray-900 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 max-w-sm"
        style={{
          left: position.x,
          top: position.y,
        }}
        onKeyDown={handleKeyDown}
        tabIndex={0}
      >
        {/* Progress bar */}
        <div className="w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-t-lg overflow-hidden">
          <motion.div
            className="h-full bg-blue-500"
            initial={{ width: 0 }}
            animate={{ width: `${(progress / totalSteps) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {step.title}
            </h3>
            <button
              onClick={onSkip}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              aria-label="Skip tour"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
            {step.content}
          </p>

          {/* Hotkeys info */}
          {step.hotkeys && step.hotkeys.length > 0 && (
            <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Keyboard shortcuts:</p>
              <div className="flex flex-wrap gap-2">
                {step.hotkeys.map((hotkey, index) => (
                  <kbd
                    key={index}
                    className="px-2 py-1 text-xs font-mono bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded border"
                  >
                    {hotkey}
                  </kbd>
                ))}
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onPrevious}
                disabled={isFirst}
                className="flex items-center space-x-1"
              >
                <ChevronLeftIcon className="h-4 w-4" />
                <span>Previous</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={isPaused ? onResume : onPause}
                className="flex items-center space-x-1"
              >
                {isPaused ? (
                  <>
                    <PlayIcon className="h-4 w-4" />
                    <span>Resume</span>
                  </>
                ) : (
                  <>
                    <PauseIcon className="h-4 w-4" />
                    <span>Pause</span>
                  </>
                )}
              </Button>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onSkip}
                className="text-gray-600 dark:text-gray-400"
              >
                Skip
              </Button>
              <Button
                onClick={onNext}
                disabled={isLast}
                className="flex items-center space-x-1"
              >
                <span>{isLast ? 'Finish' : 'Next'}</span>
                {!isLast && <ChevronRightIcon className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Step indicator */}
          <div className="mt-4 text-center">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Step {progress} of {totalSteps}
            </span>
          </div>
        </div>

        {/* Arrow pointer */}
        {step.position && step.position !== 'center' && targetElement && (
          <div
            className={`absolute w-0 h-0 border-8 border-transparent ${
              step.position === 'top' ? 'border-t-white dark:border-t-gray-900 -bottom-2 left-1/2 -translate-x-1/2' :
              step.position === 'bottom' ? 'border-b-white dark:border-b-gray-900 -top-2 left-1/2 -translate-x-1/2' :
              step.position === 'left' ? 'border-l-white dark:border-l-gray-900 -right-2 top-1/2 -translate-y-1/2' :
              'border-r-white dark:border-r-gray-900 -left-2 top-1/2 -translate-y-1/2'
            }`}
          />
        )}
      </motion.div>
    </AnimatePresence>
  );
}