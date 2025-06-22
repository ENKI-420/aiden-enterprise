"use client";

import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, SkipForward, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { TourStep as TourStepType } from './tourConfig';

interface TourStepProps {
  step: TourStepType;
  isActive: boolean;
  onNext: () => void;
  onPrevious: () => void;
  onSkip: () => void;
  onClose: () => void;
  currentStepIndex: number;
  totalSteps: number;
  canGoBack: boolean;
  canSkip: boolean;
}

export default function TourStep({
  step,
  isActive,
  onNext,
  onPrevious,
  onSkip,
  onClose,
  currentStepIndex,
  totalSteps,
  canGoBack,
  canSkip
}: TourStepProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const stepRef = useRef<HTMLDivElement>(null);
  const targetElement = useRef<HTMLElement | null>(null);

  // Calculate position based on target element
  useEffect(() => {
    if (!isActive || !step.selector) return;

    const updatePosition = () => {
      const element = document.querySelector(step.selector) as HTMLElement;
      if (!element) return;

      targetElement.current = element;
      const rect = element.getBoundingClientRect();
      const stepElement = stepRef.current;
      if (!stepElement) return;

      const stepRect = stepElement.getBoundingClientRect();
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

      // Ensure step stays within viewport
      x = Math.max(20, Math.min(x, window.innerWidth - stepRect.width - 20));
      y = Math.max(20, Math.min(y, window.innerHeight - stepRect.height - 20));

      setPosition({ x, y });
    };

    // Initial position calculation
    updatePosition();

    // Update position on scroll and resize
    const handleScroll = () => updatePosition();
    const handleResize = () => updatePosition();

    window.addEventListener('scroll', handleScroll, true);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', handleResize);
    };
  }, [isActive, step.selector, step.position]);

  // Show step with delay
  useEffect(() => {
    if (isActive) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, step.delay || 0);

      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [isActive, step.delay]);

  // Handle hotkeys
  useEffect(() => {
    if (!isActive) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Global hotkeys
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        onNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        if (canGoBack) onPrevious();
      } else if (e.key === 's' || e.key === 'S') {
        e.preventDefault();
        if (canSkip) onSkip();
      }

      // Step-specific hotkeys
      if (step.hotkeys) {
        const keyCombo = [
          e.ctrlKey && 'ctrl',
          e.metaKey && 'cmd',
          e.altKey && 'alt',
          e.shiftKey && 'shift',
          e.key.toLowerCase()
        ].filter(Boolean).join('+');

        if (step.hotkeys.includes(keyCombo)) {
          e.preventDefault();
          onNext();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isActive, step.hotkeys, onNext, onPrevious, onClose, onSkip, canGoBack, canSkip]);

  // Handle step actions
  const handleStepAction = () => {
    if (step.action === 'click' && targetElement.current) {
      targetElement.current.click();
    } else if (step.action === 'hover' && targetElement.current) {
      // Trigger hover event
      targetElement.current.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    } else if (step.action === 'scroll' && targetElement.current) {
      targetElement.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    if (step.autoAdvance) {
      setTimeout(onNext, 500);
    }
  };

  if (!isActive) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
        style={{ opacity: isVisible ? 1 : 0 }}
        onClick={step.action === 'click' ? handleStepAction : undefined}
      />

      {/* Highlight target element */}
      {targetElement.current && (
        <div
          className="fixed z-41 pointer-events-none transition-all duration-300"
          style={{
            left: targetElement.current.offsetLeft - 4,
            top: targetElement.current.offsetTop - 4,
            width: targetElement.current.offsetWidth + 8,
            height: targetElement.current.offsetHeight + 8,
            border: '2px solid #3b82f6',
            borderRadius: '8px',
            boxShadow: '0 0 0 4px rgba(59, 130, 246, 0.2)',
            opacity: isVisible ? 1 : 0
          }}
        />
      )}

      {/* Tour step content */}
      <div
        ref={stepRef}
        className="fixed z-50 bg-white dark:bg-gray-900 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 max-w-sm transition-all duration-300"
        style={{
          left: position.x,
          top: position.y,
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'scale(1)' : 'scale(0.95)'
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {step.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            aria-label="Close tour"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
            {step.content}
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-gray-200 dark:border-gray-700">
          {/* Progress indicator */}
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {currentStepIndex + 1} of {totalSteps}
          </div>

          {/* Action buttons */}
          <div className="flex items-center space-x-2">
            {canSkip && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onSkip}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <SkipForward size={14} className="mr-1" />
                Skip
              </Button>
            )}

            {canGoBack && (
              <Button
                variant="outline"
                size="sm"
                onClick={onPrevious}
                className="border-gray-300 dark:border-gray-600"
              >
                <ChevronLeft size={14} className="mr-1" />
                Previous
              </Button>
            )}

            <Button
              size="sm"
              onClick={step.action && step.action !== 'none' ? handleStepAction : onNext}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {step.action && step.action !== 'none' ? 'Continue' : 'Next'}
              <ChevronRight size={14} className="ml-1" />
            </Button>
          </div>
        </div>

        {/* Arrow pointer */}
        {step.position && step.position !== 'center' && targetElement.current && (
          <div
            className="absolute w-0 h-0 border-8 border-transparent"
            style={{
              [step.position === 'top' ? 'bottom' : 'top']: '-8px',
              [step.position === 'left' ? 'right' : 'left']: '50%',
              transform: `translateX(${step.position === 'left' ? '50%' : '-50%'})`,
              borderColor: step.position === 'top'
                ? 'transparent transparent #3b82f6 transparent'
                : step.position === 'bottom'
                ? '#3b82f6 transparent transparent transparent'
                : step.position === 'left'
                ? 'transparent #3b82f6 transparent transparent'
                : 'transparent transparent transparent #3b82f6'
            }}
          />
        )}
      </div>
    </>
  );
}