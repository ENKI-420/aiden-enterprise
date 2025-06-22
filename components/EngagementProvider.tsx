"use client";

import AIAssistant from '@/components/AIAssistant';
import GuidedTourComponent from '@/components/GuidedTour';
import { AIRecommendation, EngagementAnalytics, EngagementEngine, GuidedTour } from '@/lib/engagement/core';
import { AnimatePresence, motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { usePathname } from 'next/navigation';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

interface EngagementContextType {
  engine: EngagementEngine;
  analytics: EngagementAnalytics;
  startTour: (tourId?: string) => void;
  trackFeature: (featureId: string) => void;
  getProgress: () => any;
  showAssistant: boolean;
  toggleAssistant: () => void;
}

const EngagementContext = createContext<EngagementContextType | null>(null);

export function useEngagement() {
  const context = useContext(EngagementContext);
  if (!context) {
    throw new Error('useEngagement must be used within EngagementProvider');
  }
  return context;
}

interface EngagementProviderProps {
  children: React.ReactNode;
  userId?: string;
}

export function EngagementProvider({ children, userId = 'default-user' }: EngagementProviderProps) {
  const [engine] = useState(() => new EngagementEngine(userId));
  const [analytics] = useState(() => new EngagementAnalytics());
  const [currentTour, setCurrentTour] = useState<GuidedTour | null>(null);
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [showAssistant, setShowAssistant] = useState(true);
  const [contextualHelp, setContextualHelp] = useState<any>(null);
  const [showWelcome, setShowWelcome] = useState(false);
  const pathname = usePathname();

  // Initialize and check for first visit
  useEffect(() => {
    const isFirstVisit = !localStorage.getItem('aiden_visited');
    if (isFirstVisit) {
      setShowWelcome(true);
      localStorage.setItem('aiden_visited', 'true');
    }

    // Update recommendations periodically
    const updateRecommendations = () => {
      setRecommendations(engine.getRecommendations());
    };

    updateRecommendations();
    const interval = setInterval(updateRecommendations, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, [engine]);

  // Track page views and update context
  useEffect(() => {
    engine.trackAction('page_view', { path: pathname });

    // Determine context based on path
    let context = 'general';
    if (pathname.includes('conference')) context = 'conference';
    else if (pathname.includes('ai-coding-suite')) context = 'coding';
    else if (pathname.includes('medical') || pathname.includes('agent')) context = 'medical';

    const help = engine.getContextualHelp(context);
    setContextualHelp(help);

    // Check if we should show a tour
    if (!currentTour) {
      const recommendedTour = engine.getRecommendedTour();
      if (recommendedTour && shouldShowTour(recommendedTour, pathname)) {
        setTimeout(() => setCurrentTour(recommendedTour), 1000);
      }
    }
  }, [pathname, engine, currentTour]);

  const shouldShowTour = (tour: GuidedTour, path: string): boolean => {
    // Logic to determine if tour should be shown on current page
    if (tour.id === 'welcome-tour' && path === '/') return true;
    if (tour.id === 'developer-tour' && path.includes('ai-coding-suite')) return true;
    if (tour.id === 'healthcare-tour' && path.includes('conference')) return true;
    return false;
  };

  const startTour = useCallback((tourId?: string) => {
    if (tourId) {
      const tour = engine.tours.get(tourId);
      if (tour) setCurrentTour(tour);
    } else {
      const tour = engine.getRecommendedTour();
      if (tour) setCurrentTour(tour);
    }
  }, [engine]);

  const completeTour = useCallback(() => {
    if (currentTour) {
      engine.completeTour(currentTour.id);
      analytics.recordEvent({
        type: 'tutorial_completed',
        feature: currentTour.id,
        timestamp: new Date()
      });
    }
    setCurrentTour(null);
  }, [currentTour, engine, analytics]);

  const trackFeature = useCallback((featureId: string) => {
    engine.discoverFeature(featureId);
    analytics.recordEvent({
      type: 'feature_discovered',
      feature: featureId,
      timestamp: new Date()
    });
  }, [engine, analytics]);

  const getProgress = useCallback(() => {
    return engine.getProgress();
  }, [engine]);

  const toggleAssistant = useCallback(() => {
    setShowAssistant(prev => !prev);
  }, []);

  const handleRecommendationClick = useCallback((recommendation: AIRecommendation) => {
    if (recommendation.action) {
      recommendation.action();
    }

    // Track the interaction
    engine.trackAction('recommendation_clicked', {
      recommendationId: recommendation.id,
      type: recommendation.type
    });

    // Navigate or perform action based on recommendation type
    if (recommendation.type === 'feature') {
      // Could navigate to feature or highlight it
      console.log('Navigate to feature:', recommendation.id);
    }
  }, [engine]);

  // Listen for feature unlocks
  useEffect(() => {
    const handleFeatureUnlock = (event: any) => {
      const { features } = event;
      // Show notification for unlocked features
      console.log('Features unlocked:', features);
    };

    engine.on('features:unlocked', handleFeatureUnlock);
    return () => {
      engine.off('features:unlocked', handleFeatureUnlock);
    };
  }, [engine]);

  return (
    <EngagementContext.Provider value={{
      engine,
      analytics,
      startTour,
      trackFeature,
      getProgress,
      showAssistant,
      toggleAssistant
    }}>
      {children}

      {/* Welcome Animation */}
      <AnimatePresence>
        {showWelcome && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10001] bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center"
            onAnimationComplete={() => {
              setTimeout(() => setShowWelcome(false), 3000);
            }}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-center text-white"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="inline-block mb-8"
              >
                <Sparkles className="w-20 h-20" />
              </motion.div>
              <h1 className="text-5xl font-bold mb-4">Welcome to AIDEN Enterprise</h1>
              <p className="text-xl opacity-90">Your AI-powered collaboration platform</p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="mt-8 text-lg opacity-80"
              >
                Let's explore what you can do...
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Guided Tour */}
      <AnimatePresence>
        {currentTour && (
          <GuidedTourComponent
            tour={currentTour}
            onComplete={completeTour}
            onSkip={() => setCurrentTour(null)}
          />
        )}
      </AnimatePresence>

      {/* AI Assistant */}
      <AIAssistant
        recommendations={recommendations}
        onRecommendationClick={handleRecommendationClick}
        contextualHelp={contextualHelp}
        isMinimized={!showAssistant}
        onToggleMinimize={toggleAssistant}
      />

      {/* Feature Discovery Notifications */}
      <div className="fixed top-4 right-4 z-50 pointer-events-none">
        <AnimatePresence>
          {/* Notifications would appear here */}
        </AnimatePresence>
      </div>
    </EngagementContext.Provider>
  );
}