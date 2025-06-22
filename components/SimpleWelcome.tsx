'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AnimatePresence, motion } from 'framer-motion';
import {
    ArrowRight,
    Brain,
    CheckCircle,
    Cpu,
    Lock,
    Shield,
    Sparkles,
    Zap
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface SimpleWelcomeProps {
  onComplete: () => void;
  userRole?: string;
}

export default function SimpleWelcome({ onComplete, userRole = 'professional' }: SimpleWelcomeProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // Show welcome after a short delay
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const steps = [
    {
      title: "Welcome to Agile Defense Systems",
      subtitle: "Powered by the Aiden Engine",
      content: "Advanced AI-driven defense and healthcare automation platform with enterprise-grade security and multi-modal AI orchestration.",
      icon: <Brain className="w-8 h-8" />,
      features: [
        "Multi-modal AI processing",
        "Enterprise-grade security",
        "Real-time analytics",
        "HIPAA & CMMC compliant"
      ]
    },
    {
      title: "Aiden Engine Capabilities",
      subtitle: "Next-Generation AI Orchestration",
      content: "Experience the power of advanced AI with voice commands, document scanning, screen sharing, and intelligent automation.",
      icon: <Cpu className="w-8 h-8" />,
      features: [
        "Voice-powered interactions",
        "Document intelligence",
        "Screen capture & analysis",
        "Multi-agent workflows"
      ]
    },
    {
      title: "Ready to Get Started?",
      subtitle: "Your AI Assistant Awaits",
      content: "Your personalized AI assistant is ready to help you work more efficiently with advanced capabilities and intelligent insights.",
      icon: <Sparkles className="w-8 h-8" />,
      features: [
        "Personalized experience",
        "Context-aware assistance",
        "Real-time collaboration",
        "Advanced analytics"
      ]
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    setIsVisible(false);
    // Mark as completed in localStorage
    localStorage.setItem('simpleWelcomeCompleted', 'true');
    onComplete();
  };

  const handleSkip = () => {
    handleComplete();
  };

  if (!isVisible) return null;

  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      >
        <motion.div
          initial={{ scale: 0.8, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.8, y: 20 }}
          className="w-full max-w-2xl"
        >
          <Card className="bg-slate-900/95 backdrop-blur-sm border-2 border-primary/20 shadow-2xl">
            <CardHeader className="text-center pb-6">
              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-slate-400">
                    Step {currentStep + 1} of {steps.length}
                  </span>
                  <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30">
                    Aiden Engine v2.1
                  </Badge>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <motion.div
                    className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>

              {/* Icon and Title */}
              <div className="flex justify-center mb-4">
                <div className="p-4 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30">
                  {currentStepData.icon}
                </div>
              </div>

              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {currentStepData.title}
              </CardTitle>

              <p className="text-lg text-secondary font-medium">
                {currentStepData.subtitle}
              </p>
            </CardHeader>

            <CardContent className="text-center space-y-6">
              <p className="text-slate-300 leading-relaxed">
                {currentStepData.content}
              </p>

              {/* Features List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {currentStepData.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-slate-300">
                    <CheckCircle className="w-4 h-4 text-secondary flex-shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              {/* Security Badges */}
              <div className="flex justify-center gap-2 flex-wrap">
                <Badge variant="outline" className="border-green-500/30 text-green-400">
                  <Shield className="w-3 h-3 mr-1" />
                  HIPAA Compliant
                </Badge>
                <Badge variant="outline" className="border-blue-500/30 text-blue-400">
                  <Lock className="w-3 h-3 mr-1" />
                  CMMC Ready
                </Badge>
                <Badge variant="outline" className="border-purple-500/30 text-purple-400">
                  <Zap className="w-3 h-3 mr-1" />
                  Enterprise Grade
                </Badge>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 justify-center pt-4">
                <Button
                  variant="outline"
                  onClick={handleSkip}
                  className="border-slate-600 text-slate-400 hover:border-slate-500 hover:text-slate-300"
                >
                  Skip Tour
                </Button>

                <Button
                  onClick={handleNext}
                  className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                >
                  {currentStep === steps.length - 1 ? (
                    <>
                      Get Started
                      <CheckCircle className="w-4 h-4 ml-2" />
                    </>
                  ) : (
                    <>
                      Continue
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>

              {/* Footer */}
              <div className="pt-4 border-t border-slate-700/50">
                <div className="flex justify-between items-center text-xs text-slate-500">
                  <span>Powered by Aiden Engine</span>
                  <span className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
                    AI Enhanced
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}