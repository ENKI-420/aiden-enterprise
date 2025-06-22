/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { AnimatePresence, motion } from 'framer-motion';
import {
    ChevronDown,
    HelpCircle,
    Lightbulb,
    Settings,
    Star,
    Target,
    TrendingUp,
    Users,
    Zap
} from 'lucide-react';
import { createContext, useContext, useEffect, useState } from 'react';

interface UIEnhancementContext {
  theme: 'light' | 'dark' | 'auto';
  setTheme: (theme: 'light' | 'dark' | 'auto') => void;
  density: 'compact' | 'comfortable' | 'spacious';
  setDensity: (density: 'compact' | 'comfortable' | 'spacious') => void;
  showTooltips: boolean;
  setShowTooltips: (show: boolean) => void;
  userProgress: UserProgress;
  setUserProgress: (progress: UserProgress) => void;
  contextualHelp: ContextualHelp[];
  addContextualHelp: (help: ContextualHelp) => void;
  dismissContextualHelp: (id: string) => void;
  showFeatureSpotlight: (feature: FeatureSpotlight) => void;
  interactionHistory: InteractionEvent[];
  trackInteraction: (event: InteractionEvent) => void;
}

interface UserProgress {
  level: number;
  experiencePoints: number;
  featuresUnlocked: string[];
  completedTutorials: string[];
  streakDays: number;
  lastLogin: Date;
}

interface ContextualHelp {
  id: string;
  type: 'tip' | 'warning' | 'info' | 'success';
  title: string;
  content: string;
  position: { x: number; y: number };
  targetElement?: string;
  priority: 'low' | 'medium' | 'high';
  dismissible: boolean;
  autoHide?: number;
}

interface FeatureSpotlight {
  id: string;
  title: string;
  description: string;
  targetSelector: string;
  placement: 'top' | 'bottom' | 'left' | 'right';
  highlightColor: string;
  onComplete?: () => void;
}

interface InteractionEvent {
  id: string;
  type: 'click' | 'hover' | 'focus' | 'scroll' | 'gesture';
  element: string;
  timestamp: Date;
  context: any;
}

const UIContext = createContext<UIEnhancementContext | null>(null);

export const useUIEnhancement = () => {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useUIEnhancement must be used within EnhancedUIProvider');
  }
  return context;
};

interface EnhancedUIProviderProps {
  children: React.ReactNode;
}

export default function EnhancedUIProvider({ children }: EnhancedUIProviderProps) {
  const [theme, setTheme] = useState<'light' | 'dark' | 'auto'>('dark');
  const [density, setDensity] = useState<'compact' | 'comfortable' | 'spacious'>('comfortable');
  const [showTooltips, setShowTooltips] = useState(true);
  const [contextualHelp, setContextualHelp] = useState<ContextualHelp[]>([]);
  const [interactionHistory, setInteractionHistory] = useState<InteractionEvent[]>([]);
  const [activeSpotlight, setActiveSpotlight] = useState<FeatureSpotlight | null>(null);
  const [userProgress, setUserProgress] = useState<UserProgress>({
    level: 1,
    experiencePoints: 0,
    featuresUnlocked: [],
    completedTutorials: [],
    streakDays: 1,
    lastLogin: new Date()
  });

  // Initialize from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('ui-theme') as 'light' | 'dark' | 'auto' | null;
    const savedDensity = localStorage.getItem('ui-density') as 'compact' | 'comfortable' | 'spacious' | null;
    const savedTooltips = localStorage.getItem('ui-tooltips');
    const savedProgress = localStorage.getItem('user-progress');

    if (savedTheme) setTheme(savedTheme);
    if (savedDensity) setDensity(savedDensity);
    if (savedTooltips) setShowTooltips(JSON.parse(savedTooltips));
    if (savedProgress) setUserProgress(JSON.parse(savedProgress));
  }, []);

  // Apply theme changes
  useEffect(() => {
    localStorage.setItem('ui-theme', theme);

    if (theme === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.classList.toggle('dark', prefersDark);
    } else {
      document.documentElement.classList.toggle('dark', theme === 'dark');
    }
  }, [theme]);

  // Apply density changes
  useEffect(() => {
    localStorage.setItem('ui-density', density);
    document.documentElement.setAttribute('data-density', density);
  }, [density]);

  // Save user progress
  useEffect(() => {
    localStorage.setItem('user-progress', JSON.stringify(userProgress));
  }, [userProgress]);

  const addContextualHelp = (help: ContextualHelp) => {
    setContextualHelp(prev => [...prev.filter(h => h.id !== help.id), help]);

    if (help.autoHide) {
      setTimeout(() => {
        dismissContextualHelp(help.id);
      }, help.autoHide);
    }
  };

  const dismissContextualHelp = (id: string) => {
    setContextualHelp(prev => prev.filter(h => h.id !== id));
  };

  const showFeatureSpotlight = (feature: FeatureSpotlight) => {
    setActiveSpotlight(feature);
  };

  const trackInteraction = (event: InteractionEvent) => {
    setInteractionHistory(prev => [...prev.slice(-100), event]); // Keep last 100 interactions

    // Award experience points for interactions
    setUserProgress(prev => ({
      ...prev,
      experiencePoints: prev.experiencePoints + getInteractionPoints(event.type)
    }));
  };

  const getInteractionPoints = (type: string): number => {
    const points = {
      click: 1,
      hover: 0.5,
      focus: 0.5,
      scroll: 0.1,
      gesture: 2
    };
    return points[type as keyof typeof points] || 0;
  };

  const contextValue: UIEnhancementContext = {
    theme,
    setTheme,
    density,
    setDensity,
    showTooltips,
    setShowTooltips,
    userProgress,
    setUserProgress,
    contextualHelp,
    addContextualHelp,
    dismissContextualHelp,
    showFeatureSpotlight,
    interactionHistory,
    trackInteraction
  };

  return (
    <UIContext.Provider value={contextValue}>
      <div className={`ui-enhanced ui-density-${density}`}>
        {children}

        {/* Contextual Help Overlay */}
        <AnimatePresence>
          {contextualHelp.map((help) => (
            <ContextualHelpTooltip
              key={help.id}
              help={help}
              onDismiss={() => dismissContextualHelp(help.id)}
            />
          ))}
        </AnimatePresence>

        {/* Feature Spotlight */}
        <AnimatePresence>
          {activeSpotlight && (
            <FeatureSpotlightOverlay
              spotlight={activeSpotlight}
              onComplete={() => {
                activeSpotlight.onComplete?.();
                setActiveSpotlight(null);
              }}
              onSkip={() => setActiveSpotlight(null)}
            />
          )}
        </AnimatePresence>

        {/* UI Enhancement Controls */}
        <UIControlPanel />

        {/* Progress Indicator */}
        <UserProgressIndicator progress={userProgress} />
      </div>
    </UIContext.Provider>
  );
}

function ContextualHelpTooltip({
  help,
  onDismiss
}: {
  help: ContextualHelp;
  onDismiss: () => void;
}) {
  const getIcon = () => {
    switch (help.type) {
      case 'tip': return <Lightbulb className="w-4 h-4" />;
      case 'warning': return <HelpCircle className="w-4 h-4" />;
      case 'info': return <HelpCircle className="w-4 h-4" />;
      case 'success': return <Star className="w-4 h-4" />;
      default: return <HelpCircle className="w-4 h-4" />;
    }
  };

  const getColorClasses = () => {
    switch (help.type) {
      case 'tip': return 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-200';
      case 'warning': return 'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-200';
      case 'info': return 'bg-gray-50 border-gray-200 text-gray-800 dark:bg-gray-900/20 dark:border-gray-800 dark:text-gray-200';
      case 'success': return 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200';
      default: return 'bg-gray-50 border-gray-200 text-gray-800 dark:bg-gray-900/20 dark:border-gray-800 dark:text-gray-200';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: -10 }}
      className="fixed z-50 pointer-events-none"
      style={{
        left: help.position.x,
        top: help.position.y,
        transform: 'translate(-50%, -100%)'
      }}
    >
      <div className={`max-w-xs p-3 rounded-lg border shadow-lg pointer-events-auto ${getColorClasses()}`}>
        <div className="flex items-start gap-2">
          <div className="flex-shrink-0 mt-0.5">
            {getIcon()}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-sm">{help.title}</h4>
            <p className="text-xs mt-1 opacity-90">{help.content}</p>
          </div>
          {help.dismissible && (
            <button
              onClick={onDismiss}
              className="flex-shrink-0 ml-2 opacity-60 hover:opacity-100 transition-opacity"
            >
              ×
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function FeatureSpotlightOverlay({
  spotlight,
  onComplete,
  onSkip
}: {
  spotlight: FeatureSpotlight;
  onComplete: () => void;
  onSkip: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
    >
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white dark:bg-gray-900 rounded-xl p-6 max-w-md shadow-xl"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: spotlight.highlightColor }} />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {spotlight.title}
            </h3>
          </div>

          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {spotlight.description}
          </p>

          <div className="flex gap-3">
            <button
              onClick={onComplete}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Got it!
            </button>
            <button
              onClick={onSkip}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            >
              Skip
            </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

function UIControlPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme, density, setDensity, showTooltips, setShowTooltips } = useUIEnhancement();

  return (
    <div className="fixed bottom-4 right-4 z-40">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="absolute bottom-16 right-0 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-4 w-64"
          >
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">UI Settings</h3>

            <div className="space-y-3">
                             <div>
                 <label htmlFor="theme-select" className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">
                   Theme
                 </label>
                 <select
                   id="theme-select"
                   value={theme}
                   onChange={(e) => setTheme(e.target.value as any)}
                   className="w-full px-3 py-1.5 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500"
                 >
                   <option value="light">Light</option>
                   <option value="dark">Dark</option>
                   <option value="auto">Auto</option>
                 </select>
               </div>

               <div>
                 <label htmlFor="density-select" className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">
                   Density
                 </label>
                 <select
                   id="density-select"
                   value={density}
                   onChange={(e) => setDensity(e.target.value as any)}
                   className="w-full px-3 py-1.5 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500"
                 >
                   <option value="compact">Compact</option>
                   <option value="comfortable">Comfortable</option>
                   <option value="spacious">Spacious</option>
                 </select>
               </div>

               <div className="flex items-center justify-between">
                 <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                   Show Tooltips
                 </label>
                 <button
                   onClick={() => setShowTooltips(!showTooltips)}
                   aria-label="Toggle tooltips"
                   className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                     showTooltips ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                   }`}
                 >
                  <span
                    className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                      showTooltips ? 'translate-x-5' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

             <button
         onClick={() => setIsOpen(!isOpen)}
         aria-label="Open UI settings"
         className="bg-white dark:bg-gray-800 shadow-lg rounded-full p-3 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow"
       >
         <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
       </button>
    </div>
  );
}

function UserProgressIndicator({ progress }: { progress: UserProgress }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const progressToNextLevel = (progress.experiencePoints % 100) / 100;

  return (
    <div className="fixed top-4 left-4 z-40">
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
        animate={{ width: isExpanded ? 280 : 60 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full p-3 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
        >
          <div className="relative">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">{progress.level}</span>
            </div>
            <div className="absolute -inset-1 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full opacity-20 animate-pulse" />
          </div>

          {isExpanded && (
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  Level {progress.level}
                </span>
                <ChevronDown className={`w-4 h-4 text-gray-500 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
              </div>
              <div className="mt-1 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${progressToNextLevel * 100}%` }}
                />
              </div>
            </div>
          )}
        </button>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="px-3 pb-3"
            >
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-1">
                  <Zap className="w-3 h-3 text-yellow-500" />
                  <span className="text-gray-600 dark:text-gray-400">{progress.experiencePoints} XP</span>
                </div>
                <div className="flex items-center gap-1">
                  <Target className="w-3 h-3 text-green-500" />
                  <span className="text-gray-600 dark:text-gray-400">{progress.featuresUnlocked.length} Features</span>
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-blue-500" />
                  <span className="text-gray-600 dark:text-gray-400">{progress.streakDays} Day Streak</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3 text-purple-500" />
                  <span className="text-gray-600 dark:text-gray-400">{progress.completedTutorials.length} Tutorials</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

// CSS for density classes
const densityStyles = `
.ui-density-compact {
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 0.75rem;
  --spacing-lg: 1rem;
  --spacing-xl: 1.5rem;
}

.ui-density-comfortable {
  --spacing-xs: 0.5rem;
  --spacing-sm: 0.75rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
}

.ui-density-spacious {
  --spacing-xs: 0.75rem;
  --spacing-sm: 1rem;
  --spacing-md: 1.5rem;
  --spacing-lg: 2rem;
  --spacing-xl: 3rem;
}
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = densityStyles;
  document.head.appendChild(styleSheet);
}