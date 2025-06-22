"use client";

import { Button } from '@/components/ui/button';
import { Pause, RotateCcw, SkipForward } from 'lucide-react';
import { useTour, useTourProgress } from './TourGuideProvider';

interface TourProgressBarProps {
  showControls?: boolean;
  showPercentage?: boolean;
  className?: string;
}

export default function TourProgressBar({
  showControls = true,
  showPercentage = true,
  className = ''
}: TourProgressBarProps) {
  const { isActive, currentStep, totalSteps, currentStepIndex } = useTourProgress();
  const { startTour, stopTour, restartTour, skipStep, canSkipCurrentStep } = useTour();

  if (!isActive) return null;

  const progress = totalSteps > 0 ? ((currentStepIndex + 1) / totalSteps) * 100 : 0;

  return (
    <div className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-3 ${className}`}>
      <div className="flex items-center space-x-3">
        {/* Progress bar */}
        <div className="flex-1 min-w-48">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-600 dark:text-gray-400">
              {currentStep?.title || 'Tour'}
            </span>
            {showPercentage && (
              <span className="text-xs text-gray-600 dark:text-gray-400">
                {Math.round(progress)}%
              </span>
            )}
          </div>

          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
            <span>Step {currentStepIndex + 1} of {totalSteps}</span>
            <span>{Math.round(progress)}% complete</span>
          </div>
        </div>

        {/* Controls */}
        {showControls && (
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={stopTour}
              className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
              title="Pause tour"
            >
              <Pause size={14} />
            </Button>

            {canSkipCurrentStep() && (
              <Button
                variant="ghost"
                size="sm"
                onClick={skipStep}
                className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                title="Skip step"
              >
                <SkipForward size={14} />
              </Button>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={restartTour}
              className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
              title="Restart tour"
            >
              <RotateCcw size={14} />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

// Compact version for minimal UI
export function TourProgressCompact() {
  const { progress, isActive } = useTourProgress();
  const { stopTour } = useTour();

  if (!isActive) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white dark:bg-gray-900 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 p-2">
        <div className="w-8 h-8 relative">
          <svg className="w-8 h-8 transform -rotate-90" viewBox="0 0 32 32">
            <circle
              cx="16"
              cy="16"
              r="14"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              className="text-gray-200 dark:text-gray-700"
            />
            <circle
              cx="16"
              cy="16"
              r="14"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 14}`}
              strokeDashoffset={`${2 * Math.PI * 14 * (1 - progress / 100)}`}
              className="text-blue-600 transition-all duration-300"
            />
          </svg>
          <button
            onClick={stopTour}
            className="absolute inset-0 flex items-center justify-center text-xs text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
}