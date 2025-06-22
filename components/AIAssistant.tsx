"use client";

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AIRecommendation } from '@/lib/engagement/core';
import { AnimatePresence, motion } from 'framer-motion';
import {
    Brain,
    ChevronRight,
    HelpCircle,
    Lightbulb,
    MessageCircle,
    Sparkles,
    TrendingUp,
    X,
    Zap
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface AIAssistantProps {
  recommendations: AIRecommendation[];
  onRecommendationClick?: (recommendation: AIRecommendation) => void;
  contextualHelp?: {
    tips: string[];
    shortcuts: Record<string, string>;
  };
  isMinimized?: boolean;
  onToggleMinimize?: () => void;
}

export default function AIAssistant({
  recommendations,
  onRecommendationClick,
  contextualHelp,
  isMinimized = false,
  onToggleMinimize
}: AIAssistantProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentTip, setCurrentTip] = useState(0);
  const [showNotification, setShowNotification] = useState(false);

  // Rotate through tips
  useEffect(() => {
    if (contextualHelp?.tips && contextualHelp.tips.length > 0) {
      const interval = setInterval(() => {
        setCurrentTip((prev) => (prev + 1) % contextualHelp.tips.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [contextualHelp?.tips]);

  // Show notification for high-priority recommendations
  useEffect(() => {
    const hasHighPriority = recommendations.some(r => r.priority === 'high');
    if (hasHighPriority && !isMinimized) {
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 5000);
    }
  }, [recommendations, isMinimized]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'feature': return <Sparkles className="w-4 h-4" />;
      case 'workflow': return <Zap className="w-4 h-4" />;
      case 'learning': return <TrendingUp className="w-4 h-4" />;
      default: return <Lightbulb className="w-4 h-4" />;
    }
  };

  if (isMinimized) {
    return (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="fixed bottom-4 right-4 z-50"
      >
        <button
          onClick={onToggleMinimize}
          className="relative bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all group"
          aria-label="Open AI Assistant"
        >
          <Brain className="w-6 h-6" />
          {showNotification && (
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
          )}
          <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            AI Assistant - {recommendations.length} suggestions
          </span>
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 100, opacity: 0 }}
      className="fixed right-4 bottom-4 w-96 max-h-[600px] z-50"
    >
      <Card className="shadow-2xl border-2 border-blue-500/20 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5" />
              <CardTitle className="text-lg">AI Assistant</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-white/20 text-white">
                {recommendations.length} tips
              </Badge>
              <button
                onClick={onToggleMinimize}
                className="text-white/80 hover:text-white transition-colors"
                aria-label="Minimize assistant"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          <CardDescription className="text-white/90">
            I'm here to help you discover features and work more efficiently
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0">
          {/* Quick Tips */}
          {contextualHelp && contextualHelp.tips.length > 0 && (
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border-b">
              <div className="flex items-start gap-2">
                <HelpCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    Quick Tip
                  </p>
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={currentTip}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-sm text-blue-700 dark:text-blue-300"
                    >
                      {contextualHelp.tips[currentTip]}
                    </motion.p>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          )}

          {/* Recommendations */}
          <div className="max-h-[400px] overflow-y-auto">
            {recommendations.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Sparkles className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-sm">No recommendations right now.</p>
                <p className="text-xs mt-2">Keep exploring to get personalized tips!</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {recommendations.map((rec) => (
                  <motion.div
                    key={rec.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
                    onClick={() => onRecommendationClick?.(rec)}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`mt-1 ${getPriorityColor(rec.priority)}`}>
                        {getTypeIcon(rec.type)}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm text-gray-900 dark:text-white">
                          {rec.title}
                        </h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          {rec.description}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">
                            {rec.type}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {Math.round(rec.confidence * 100)}% confident
                          </span>
                        </div>
                        <p className="text-xs text-blue-600 dark:text-blue-400 mt-2 italic">
                          {rec.reason}
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Keyboard Shortcuts */}
          {contextualHelp?.shortcuts && Object.keys(contextualHelp.shortcuts).length > 0 && (
            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-t">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center justify-between w-full text-left"
              >
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Keyboard Shortcuts
                </span>
                <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mt-3 space-y-1 overflow-hidden"
                  >
                    {Object.entries(contextualHelp.shortcuts).map(([key, action]) => (
                      <div key={key} className="flex justify-between text-xs">
                        <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">
                          {key}
                        </kbd>
                        <span className="text-gray-600 dark:text-gray-400">{action}</span>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </CardContent>

        {/* Floating action button for questions */}
        <div className="absolute -top-12 right-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="bg-white dark:bg-gray-800 p-3 rounded-full shadow-lg border-2 border-blue-500/20"
            aria-label="Ask a question"
          >
            <MessageCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </motion.button>
        </div>
      </Card>
    </motion.div>
  );
}