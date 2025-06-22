'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';

interface Tip {
  id: string;
  title: string;
  description: string;
  category: 'navigation' | 'features' | 'tips' | 'keyboard';
  icon: string;
  priority: number;
  showOnce?: boolean; // If true, only show once per session
  autoDismiss?: boolean; // If true, auto-dismiss after viewing
}

interface AIAssistantProps {
  currentTab?: string;
  currentChapter?: number;
  totalChapters?: number;
  isFirstVisit?: boolean;
  onWelcomeComplete?: () => void;
}

export default function EnhancedAIAssistant({
  currentTab = 'documentary',
  currentChapter = 0,
  totalChapters = 7,
  isFirstVisit = false,
  onWelcomeComplete
}: AIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [hasSeenWelcome, setHasSeenWelcome] = useState(false);
  const [dismissedTips, setDismissedTips] = useState<string[]>([]);
  const [sessionViewedTips, setSessionViewedTips] = useState<string[]>([]);
  const [hasCompletedWelcome, setHasCompletedWelcome] = useState(false);

  // Load user preferences from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const seen = localStorage.getItem('projectSpectraWelcomeSeen');
      const dismissed = localStorage.getItem('projectSpectraDismissedTips');
      const completed = localStorage.getItem('projectSpectraWelcomeCompleted');

      if (seen) {
        setHasSeenWelcome(true);
      }

      if (dismissed) {
        setDismissedTips(JSON.parse(dismissed));
      }

      if (completed) {
        setHasCompletedWelcome(true);
      }
    }
  }, []);

  // Contextual tips based on current state
  const getContextualTips = useCallback((): Tip[] => {
    const tips: Tip[] = [];

    // First-time user tips - only show if not completed
    if (!hasCompletedWelcome && isFirstVisit) {
      tips.push({
        id: 'welcome',
        title: 'Welcome to Project Spectra',
        description: 'Explore the weapons hypothesis through interactive 3D visualization, physics simulation, and materials analysis.',
        category: 'tips',
        icon: '🌟',
        priority: 10,
        showOnce: true
      });
    }

    // Tab-specific tips - only show if not dismissed and not viewed this session
    const tabTips: Tip[] = [];

    switch (currentTab) {
      case 'documentary':
        tabTips.push(
          {
            id: 'documentary-nav',
            title: 'Documentary Navigation',
            description: 'Use arrow keys (← →) to navigate between chapters, or click on the timeline to jump to specific sections.',
            category: 'navigation',
            icon: '🎬',
            priority: 8,
            showOnce: true
          },
          {
            id: 'keyboard-shortcuts',
            title: 'Keyboard Shortcuts',
            description: 'Space: Play/Pause video • Arrow keys: Navigate chapters • Tab: Switch between tabs',
            category: 'keyboard',
            icon: '⌨️',
            priority: 7,
            showOnce: true
          }
        );
        break;

      case 'visualization':
        tabTips.push(
          {
            id: '3d-controls',
            title: '3D Visualization Controls',
            description: 'Click and drag to rotate • Scroll to zoom • Use the control panel to toggle internal structure and energy systems.',
            category: 'features',
            icon: '🔮',
            priority: 8,
            showOnce: true
          },
          {
            id: 'camera-views',
            title: 'Camera Views',
            description: 'Switch between Overview, Internal, and Energy views to explore different aspects of the pyramid.',
            category: 'features',
            icon: '📷',
            priority: 6,
            showOnce: true
          }
        );
        break;

      case 'physics':
        tabTips.push(
          {
            id: 'physics-simulation',
            title: 'Physics Simulation',
            description: 'Activate the energy beam to see realistic physics calculations and celestial targeting in action.',
            category: 'features',
            icon: '⚡',
            priority: 8,
            showOnce: true
          },
          {
            id: 'calculations',
            title: 'Real-time Calculations',
            description: 'View live energy density, frequency, and efficiency calculations as the simulation runs.',
            category: 'features',
            icon: '🧮',
            priority: 6,
            showOnce: true
          }
        );
        break;

      case 'materials':
        tabTips.push(
          {
            id: 'materials-exploration',
            title: 'Materials Analysis',
            description: 'Click on different materials to explore their properties and role in the weapons hypothesis.',
            category: 'features',
            icon: '🔬',
            priority: 8,
            showOnce: true
          },
          {
            id: 'advanced-analysis',
            title: 'Advanced Analysis',
            description: 'Toggle "Advanced Analysis" to see detailed engineering insights and physics calculations.',
            category: 'features',
            icon: '📊',
            priority: 6,
            showOnce: true
          }
        );
        break;
    }

    // Progress-based tips - only show once per chapter
    if (currentChapter > 0 && currentChapter < totalChapters - 1) {
      tips.push({
        id: `progress-${currentChapter}`,
        title: 'Making Progress',
        description: `You're on chapter ${currentChapter + 1} of ${totalChapters}. Each chapter reveals new aspects of the weapons hypothesis.`,
        category: 'tips',
        icon: '📈',
        priority: 5,
        showOnce: true
      });
    }

    // Filter out dismissed tips, session-viewed tips, and sort by priority
    return [...tips, ...tabTips]
      .filter(tip => {
        // Don't show if dismissed permanently
        if (dismissedTips.includes(tip.id)) return false;

        // Don't show if viewed this session and marked as showOnce
        if (tip.showOnce && sessionViewedTips.includes(tip.id)) return false;

        return true;
      })
      .sort((a, b) => b.priority - a.priority);
  }, [currentTab, currentChapter, totalChapters, hasSeenWelcome, hasCompletedWelcome, isFirstVisit, dismissedTips, sessionViewedTips]);

  const contextualTips = getContextualTips();
  const currentTip = contextualTips[currentTipIndex];

  const handleNextTip = () => {
    if (currentTipIndex < contextualTips.length - 1) {
      setCurrentTipIndex(currentTipIndex + 1);
    } else {
      setCurrentTipIndex(0);
    }
  };

  const handlePreviousTip = () => {
    if (currentTipIndex > 0) {
      setCurrentTipIndex(currentTipIndex - 1);
    } else {
      setCurrentTipIndex(contextualTips.length - 1);
    }
  };

  const handleDismissTip = () => {
    if (currentTip) {
      // Mark as viewed this session if it's a showOnce tip
      if (currentTip.showOnce) {
        setSessionViewedTips(prev => [...prev, currentTip.id]);
      }

      // Mark as permanently dismissed
      const newDismissed = [...dismissedTips, currentTip.id];
      setDismissedTips(newDismissed);
      localStorage.setItem('projectSpectraDismissedTips', JSON.stringify(newDismissed));

      // Move to next tip if available
      if (contextualTips.length > 1) {
        handleNextTip();
      } else {
        setIsOpen(false);
      }
    }
  };

  const handleCompleteWelcome = () => {
    setHasSeenWelcome(true);
    setHasCompletedWelcome(true);
    localStorage.setItem('projectSpectraWelcomeSeen', 'true');
    localStorage.setItem('projectSpectraWelcomeCompleted', 'true');
    setIsOpen(false);

    // Call parent callback if provided
    if (onWelcomeComplete) {
      onWelcomeComplete();
    }
  };

  const handleOpenAssistant = () => {
    setIsOpen(true);
    setCurrentTipIndex(0);
  };

  // Auto-dismiss tips after viewing if they have autoDismiss flag
  useEffect(() => {
    if (currentTip?.autoDismiss && isOpen && typeof window !== 'undefined') {
      // Auto-dismiss functionality can be added later if needed
      // For now, we'll rely on manual dismissal to avoid setTimeout issues
    }
  }, [currentTip, isOpen]);

  // Don't show assistant if no tips available
  if (contextualTips.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-6 left-6 z-50">
      <AnimatePresence>
        {isOpen ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="bg-slate-900/95 backdrop-blur-sm rounded-xl border border-amber-500/30 shadow-2xl w-80 max-h-96 overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-slate-700/50">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-amber-200 flex items-center gap-2">
                    <span className="text-xl">🤖</span>
                    AI Assistant
                  </h3>
                  <p className="text-sm text-slate-400 mt-1">
                    {contextualTips.length} helpful tip{contextualTips.length !== 1 ? 's' : ''} available
                  </p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-slate-400 hover:text-white transition-colors p-1 rounded"
                  aria-label="Close AI Assistant"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              {currentTip && (
                <motion.div
                  key={currentTip.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-3"
                >
                  {/* Tip Header */}
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{currentTip.icon}</span>
                    <div>
                      <h4 className="font-semibold text-amber-300">{currentTip.title}</h4>
                      <span className="text-xs text-slate-500 uppercase tracking-wide">
                        {currentTip.category}
                      </span>
                    </div>
                  </div>

                  {/* Tip Description */}
                  <p className="text-slate-300 text-sm leading-relaxed">
                    {currentTip.description}
                  </p>

                  {/* Tip Actions */}
                  <div className="flex justify-between items-center pt-2">
                    <div className="flex gap-2">
                      {contextualTips.length > 1 && (
                        <>
                          <button
                            onClick={handlePreviousTip}
                            className="p-2 text-slate-400 hover:text-amber-300 transition-colors rounded"
                            aria-label="Previous tip"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                          </button>
                          <button
                            onClick={handleNextTip}
                            className="p-2 text-slate-400 hover:text-amber-300 transition-colors rounded"
                            aria-label="Next tip"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        </>
                      )}
                    </div>

                    <div className="flex gap-2">
                      {!hasCompletedWelcome && currentTip.id === 'welcome' ? (
                        <button
                          onClick={handleCompleteWelcome}
                          className="px-3 py-1 bg-amber-500/20 text-amber-300 rounded text-sm hover:bg-amber-500/30 transition-colors"
                        >
                          Got it!
                        </button>
                      ) : (
                        <button
                          onClick={handleDismissTip}
                          className="px-3 py-1 bg-slate-800/50 text-slate-300 rounded text-sm hover:bg-slate-700/50 transition-colors"
                        >
                          {currentTip.showOnce ? 'Got it!' : 'Dismiss'}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Progress indicator */}
                  {contextualTips.length > 1 && (
                    <div className="flex justify-center gap-1 pt-2">
                      {contextualTips.map((_, index) => (
                        <div
                          key={index}
                          className={`w-2 h-2 rounded-full transition-colors ${
                            index === currentTipIndex
                              ? 'bg-amber-400'
                              : 'bg-slate-600'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleOpenAssistant}
            className="bg-amber-500/20 hover:bg-amber-500/30 backdrop-blur-sm rounded-full p-4 border border-amber-500/30 shadow-lg transition-all duration-300"
            aria-label="Open AI Assistant"
          >
            <div className="relative">
              <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>

              {/* Notification badge - only show if there are tips and welcome not completed */}
              {contextualTips.length > 0 && !hasCompletedWelcome && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              )}
            </div>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}