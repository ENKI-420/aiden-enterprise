"use client";

import TourEngine from './TourEngine';
import { useTourState } from './TourProvider';

interface TourEngineWrapperProps {
  onComplete?: (insights: any) => void;
  onDismiss?: () => void;
}

export default function TourEngineWrapper({ onComplete, onDismiss }: TourEngineWrapperProps) {
  const { isActive, currentRole } = useTourState();

  if (!isActive) return null;

  return (
    <TourEngine
      userRole={currentRole}
      onComplete={onComplete}
      onDismiss={onDismiss}
    />
  );
}

// Hook for components that need to check if tour is active
export function useTourActive() {
  const { isActive } = useTourState();
  return isActive;
}

// Hook for components that need to know the current tour role
export function useTourRole() {
  const { currentRole } = useTourState();
  return currentRole;
}