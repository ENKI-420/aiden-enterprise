"use client";

import { UserRole } from '@/lib/tourConfig';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface TourContextType {
  // State
  isActive: boolean;
  currentRole: UserRole;
  isPaused: boolean;

  // Actions
  startTour: (role?: UserRole, flow?: string) => void;
  pauseTour: () => void;
  resumeTour: () => void;
  stopTour: () => void;
  restartTour: () => void;

  // Configuration
  setUserRole: (role: UserRole) => void;
  setAutoStart: (enabled: boolean) => void;

  // Insights and progress
  getProgress: () => Record<string, any>;
  getInsights: () => any;
  clearProgress: () => void;
}

const TourContext = createContext<TourContextType | undefined>(undefined);

interface TourProviderProps {
  children: ReactNode;
  initialRole?: UserRole;
  autoStart?: boolean;
  onTourComplete?: (insights: any) => void;
  onTourDismiss?: () => void;
}

export function TourProvider({
  children,
  initialRole = 'guest',
  autoStart = false,
  onTourComplete,
  onTourDismiss
}: TourProviderProps) {
  const [isActive, setIsActive] = useState(false);
  const [currentRole, setCurrentRole] = useState<UserRole>(initialRole);
  const [isPaused, setIsPaused] = useState(false);
  const [autoStartEnabled, setAutoStartEnabled] = useState(autoStart);
  const [progress, setProgress] = useState<Record<string, any>>({});
  const [insights, setInsights] = useState<any>({});

  // Initialize tour state
  useEffect(() => {
    // eslint-disable-next-line no-undef
    if (typeof window === 'undefined') return;

    const detectUserRole = (): UserRole => {
      // Check URL parameters first
      const urlParams = new URLSearchParams(window.location.search);
      const roleParam = urlParams.get('role');
      if (roleParam && ['guest', 'developer', 'admin', 'clinician', 'researcher', 'executive'].includes(roleParam)) {
        return roleParam;
      }

      // Check localStorage for saved role
      // eslint-disable-next-line no-undef
      const savedRole = localStorage.getItem('userRole') as UserRole;
      if (savedRole && ['guest', 'developer', 'admin', 'clinician', 'researcher', 'executive'].includes(savedRole)) {
        return savedRole;
      }

      // Check user agent for hints
      const userAgent = navigator.userAgent.toLowerCase();
      if (userAgent.includes('admin') || userAgent.includes('administrator')) {
        return 'admin';
      }
      if (userAgent.includes('developer') || userAgent.includes('dev')) {
        return 'developer';
      }
      if (userAgent.includes('medical') || userAgent.includes('healthcare')) {
        return 'clinician';
      }

      // Check current page/route for role hints
      const pathname = window.location.pathname;
      if (pathname.includes('/admin')) return 'admin';
      if (pathname.includes('/developer') || pathname.includes('/dev')) return 'developer';
      if (pathname.includes('/medical') || pathname.includes('/healthcare')) return 'clinician';
      if (pathname.includes('/research')) return 'researcher';
      if (pathname.includes('/executive') || pathname.includes('/dashboard')) return 'executive';

      return 'guest';
    };

    const detectedRole = detectUserRole();
    setCurrentRole(detectedRole);
    // eslint-disable-next-line no-undef
    localStorage.setItem('userRole', detectedRole);

    // Load saved progress and insights
    // eslint-disable-next-line no-undef
    const savedProgress = localStorage.getItem('tourProgress');
    // eslint-disable-next-line no-undef
    const savedInsights = localStorage.getItem('tourInsights');

    if (savedProgress) {
      setProgress(JSON.parse(savedProgress));
    }
    if (savedInsights) {
      setInsights(JSON.parse(savedInsights));
    }
  }, []);

  // Auto-start logic
  useEffect(() => {
    // eslint-disable-next-line no-undef
    if (typeof window === 'undefined' || !autoStartEnabled) return;

    const shouldStart = () => {
      // eslint-disable-next-line no-undef
      const visitCount = parseInt(localStorage.getItem('visitCount') || '0');
      // eslint-disable-next-line no-undef
      const lastVisit = localStorage.getItem('lastVisit');
      // eslint-disable-next-line no-undef
      const tourCompleted = localStorage.getItem('tourCompleted');
      // eslint-disable-next-line no-undef
      const tourDismissed = localStorage.getItem('tourDismissed');

      // First visit
      if (visitCount === 0) return true;

      // Never completed tour
      if (!tourCompleted && !tourDismissed) return true;

      // Return visit after 7 days
      if (lastVisit) {
        const lastVisitDate = new Date(lastVisit);
        const now = new Date();
        const daysSinceLastVisit = (now.getTime() - lastVisitDate.getTime()) / (1000 * 60 * 60 * 24);
        if (daysSinceLastVisit > 7) return true;
      }

      return false;
    };

    if (shouldStart()) {
      // Delay start to allow page to load
      const timer = setTimeout(() => {
        startTour();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [autoStartEnabled]);

  const startTour = (role?: UserRole, flow?: string) => {
    if (role) {
      setCurrentRole(role);
      // eslint-disable-next-line no-undef
      if (typeof window !== 'undefined') {
        // eslint-disable-next-line no-undef
        localStorage.setItem('userRole', role);
      }
    }

    if (flow && typeof window !== 'undefined') {
      // eslint-disable-next-line no-undef
      localStorage.setItem('lastTourFlow', flow);
    }

    setIsActive(true);
    setIsPaused(false);
  };

  const pauseTour = () => {
    setIsPaused(true);
  };

  const resumeTour = () => {
    setIsPaused(false);
  };

  const stopTour = () => {
    setIsActive(false);
    setIsPaused(false);
  };

  const restartTour = () => {
    setProgress({});
    setInsights({});
    // eslint-disable-next-line no-undef
    if (typeof window !== 'undefined') {
      // eslint-disable-next-line no-undef
      localStorage.removeItem('tourProgress');
      // eslint-disable-next-line no-undef
      localStorage.removeItem('tourInsights');
      // eslint-disable-next-line no-undef
      localStorage.removeItem('tourCompleted');
      // eslint-disable-next-line no-undef
      localStorage.removeItem('tourDismissed');
    }
    setIsActive(false);
    setIsPaused(false);

    // Restart after a brief delay
    setTimeout(() => {
      startTour();
    }, 100);
  };

  const setUserRole = (role: UserRole) => {
    setCurrentRole(role);
    // eslint-disable-next-line no-undef
    if (typeof window !== 'undefined') {
      // eslint-disable-next-line no-undef
      localStorage.setItem('userRole', role);
    }
  };

  const setAutoStart = (enabled: boolean) => {
    setAutoStartEnabled(enabled);
  };

  const getProgress = () => progress;

  const getInsights = () => insights;

  const clearProgress = () => {
    setProgress({});
    setInsights({});
    // eslint-disable-next-line no-undef
    if (typeof window !== 'undefined') {
      // eslint-disable-next-line no-undef
      localStorage.removeItem('tourProgress');
      // eslint-disable-next-line no-undef
      localStorage.removeItem('tourInsights');
    }
  };

  const handleTourComplete = (tourInsights: any) => {
    setInsights(tourInsights);
    setIsActive(false);
    setIsPaused(false);
    onTourComplete?.(tourInsights);
  };

  const handleTourDismiss = () => {
    setIsActive(false);
    setIsPaused(false);
    onTourDismiss?.();
  };

  const contextValue: TourContextType = {
    isActive,
    currentRole,
    isPaused,
    startTour,
    pauseTour,
    resumeTour,
    stopTour,
    restartTour,
    setUserRole,
    setAutoStart,
    getProgress,
    getInsights,
    clearProgress,
  };

  return (
    <TourContext.Provider value={contextValue}>
      {children}
    </TourContext.Provider>
  );
}

export function useTour() {
  const context = useContext(TourContext);
  if (context === undefined) {
    throw new Error('useTour must be used within a TourProvider');
  }
  return context;
}

// Hook for components that need to trigger tour actions
export function useTourActions() {
  const { startTour, pauseTour, resumeTour, stopTour, restartTour } = useTour();
  return { startTour, pauseTour, resumeTour, stopTour, restartTour };
}

// Hook for components that need tour state
export function useTourState() {
  const { isActive, currentRole, isPaused } = useTour();
  return { isActive, currentRole, isPaused };
}