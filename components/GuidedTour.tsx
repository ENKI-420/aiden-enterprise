"use client";

import { Button } from '@/components/ui/button';
import { GuidedTour } from '@/lib/engagement/core';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Sparkles, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface GuidedTourProps {
  tour: GuidedTour;
  onComplete: () => void;
  onSkip?: () => void;
  onStepChange?: (step: number) => void;
}

export default function GuidedTourComponent({
  tour,
  onComplete,
  onSkip,
  onStepChange
}: GuidedTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);

  const step = tour.steps[currentStep];
  const progress = ((currentStep + 1) / tour.steps.length) * 100;

  useEffect(() => {
    if (step && step.highlight) {
      highlightTarget(step.target);
    } else {
      removeHighlight();
    }

    positionTooltip();

    if (onStepChange) {
      onStepChange(currentStep);
    }
  }, [currentStep, step]);

  const highlightTarget = (selector: string) => {
    const element = document.querySelector(selector);
    if (!element || !highlightRef.current) return;

    const rect = element.getBoundingClientRect();
    const highlight = highlightRef.current;

    highlight.style.position = 'fixed';
    highlight.style.top = `${rect.top - 5}px`;
    highlight.style.left = `${rect.left - 5}px`;
    highlight.style.width = `${rect.width + 10}px`;
    highlight.style.height = `${rect.height + 10}px`;
    highlight.style.display = 'block';

    // Scroll element into view
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const removeHighlight = () => {
    if (highlightRef.current) {
      highlightRef.current.style.display = 'none';
    }
  };

  const positionTooltip = () => {
    if (!step || !tooltipRef.current) return;

    const tooltip = tooltipRef.current;
    const targetElement = document.querySelector(step.target);

    if (!targetElement) {
      // Center tooltip if target not found
      tooltip.style.position = 'fixed';
      tooltip.style.top = '50%';
      tooltip.style.left = '50%';
      tooltip.style.transform = 'translate(-50%, -50%)';
      return;
    }

    const targetRect = targetElement.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();

    let top = 0;
    let left = 0;

    switch (step.position) {
      case 'top':
        top = targetRect.top - tooltipRect.height - 20;
        left = targetRect.left + (targetRect.width - tooltipRect.width) / 2;
        break;
      case 'bottom':
        top = targetRect.bottom + 20;
        left = targetRect.left + (targetRect.width - tooltipRect.width) / 2;
        break;
      case 'left':
        top = targetRect.top + (targetRect.height - tooltipRect.height) / 2;
        left = targetRect.left - tooltipRect.width - 20;
        break;
      case 'right':
        top = targetRect.top + (targetRect.height - tooltipRect.height) / 2;
        left = targetRect.right + 20;
        break;
      default:
        top = targetRect.bottom + 20;
        left = targetRect.left;
    }

    // Keep tooltip within viewport
    const padding = 20;
    top = Math.max(padding, Math.min(window.innerHeight - tooltipRect.height - padding, top));
    left = Math.max(padding, Math.min(window.innerWidth - tooltipRect.width - padding, left));

    tooltip.style.position = 'fixed';
    tooltip.style.top = `${top}px`;
    tooltip.style.left = `${left}px`;
    tooltip.style.transform = 'none';
  };

  const handleNext = () => {
    if (currentStep < tour.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    if (step.skipable !== false && onSkip) {
      onSkip();
    }
  };

  const handleAction = () => {
    if (step.action === 'click') {
      const element = document.querySelector(step.target) as HTMLElement;
      element?.click();
    }
    handleNext();
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-[9998]" />

      {/* Highlight */}
      <div
        ref={highlightRef}
        className="fixed z-[9999] pointer-events-none hidden"
        style={{
          border: '2px solid #3B82F6',
          borderRadius: '8px',
          boxShadow: '0 0 0 4000px rgba(0, 0, 0, 0.5)',
        }}
      />

      {/* Tooltip */}
      <AnimatePresence>
        <motion.div
          ref={tooltipRef}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="fixed z-[10000] max-w-md"
        >
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  <h3 className="font-semibold">{tour.name}</h3>
                </div>
                {step.skipable !== false && (
                  <button
                    onClick={handleSkip}
                    className="text-white/80 hover:text-white transition-colors"
                    aria-label="Skip tour"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
              {/* Progress bar */}
              <div className="w-full bg-white/20 rounded-full h-2">
                <motion.div
                  className="bg-white rounded-full h-2"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <h4 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                {step.title}
              </h4>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                {step.content}
              </p>

              {/* Actions */}
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Step {currentStep + 1} of {tour.steps.length}
                </div>

                <div className="flex gap-2">
                  {currentStep > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePrev}
                    >
                      <ChevronLeft className="w-4 h-4 mr-1" />
                      Back
                    </Button>
                  )}

                  {step.action ? (
                    <Button
                      size="sm"
                      onClick={handleAction}
                      className="bg-gradient-to-r from-blue-500 to-purple-600"
                    >
                      {step.action === 'click' ? 'Click to Continue' : 'Continue'}
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      onClick={handleNext}
                      className="bg-gradient-to-r from-blue-500 to-purple-600"
                    >
                      {currentStep === tour.steps.length - 1 ? 'Finish' : 'Next'}
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Reward notification */}
            {currentStep === tour.steps.length - 1 && tour.completionReward && (
              <div className="bg-green-50 dark:bg-green-900/20 border-t border-green-200 dark:border-green-800 p-4">
                <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    Complete this tour to earn: {tour.completionReward}
                  </span>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </>
  );
}