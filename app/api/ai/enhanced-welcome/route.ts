import { NextRequest, NextResponse } from 'next/server';

interface UserContext {
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  deviceType: 'desktop' | 'tablet' | 'mobile';
  isReturningUser: boolean;
  visitCount: number;
  preferredInteraction: 'visual' | 'audio' | 'mixed' | 'tactile';
  userGoal?: string;
  professionalRole?: string;
  industryFocus?: string;
  urgencyLevel: 'low' | 'medium' | 'high';
  engagementStyle: 'direct' | 'exploratory' | 'guided' | 'autonomous';
  cognitiveLoad: 'low' | 'medium' | 'high';
  attentionSpan: 'short' | 'medium' | 'long';
  techSavviness: 'beginner' | 'intermediate' | 'advanced';
  emotionalState?: 'focused' | 'stressed' | 'curious' | 'neutral';
  sessionDuration: number;
  interactionPattern: 'click-heavy' | 'scroll-heavy' | 'balanced';
}

interface WelcomeStep {
  id: string;
  title: string;
  content: string;
  audioContent?: string;
  interactionType: 'passive' | 'interactive' | 'voice' | 'gesture';
  psychPattern: string;
  duration: number;
  priority: number;
  conditions?: (context: UserContext) => boolean;
  actions?: {
    primary: { label: string; action: () => void; style?: string };
    secondary?: { label: string; action: () => void; style?: string };
    tertiary?: { label: string; action: () => void; style?: string };
  };
  visualElements?: {
    icon?: string;
    animation?: string;
    color?: string;
    background?: string;
  };
  engagementMetrics?: {
    expectedTimeOnStep: number;
    interactionPoints: string[];
    successCriteria: string[];
  };
}

interface AIResponse {
  steps: WelcomeStep[];
  insights: {
    userPersona: string;
    recommendedFeatures: string[];
    engagementStrategy: string;
    conversionOptimization: string[];
    personalizationScore: number;
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userContext, userRole, industry, isFirstVisit, customSteps } = body;

    // AI-powered personalization logic
    const personalizedSteps = await generatePersonalizedSteps(userContext, userRole, industry, isFirstVisit);
    const insights = await generateUserInsights(userContext, userRole, industry);

    const response: AIResponse = {
      steps: customSteps || personalizedSteps,
      insights
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Enhanced welcome API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate personalized welcome experience' },
      { status: 500 }
    );
  }
}

async function generatePersonalizedSteps(
  userContext: UserContext,
  userRole: string,
  industry: string,
  isFirstVisit: boolean
): Promise<WelcomeStep[]> {
  const steps: WelcomeStep[] = [];

  // Industry-specific welcome content
  const industryContent = getIndustryContent(industry, userRole);

  // Time-based personalization
  const timeBasedGreeting = getTimeBasedGreeting(userContext.timeOfDay);

  // Device-specific optimizations
  const deviceOptimizations = getDeviceOptimizations(userContext.deviceType);

  // Welcome step with advanced personalization
  if (userContext.isReturningUser) {
    steps.push({
      id: 'welcome_return',
      title: `Welcome back, ${userRole}! 👋`,
      content: `${timeBasedGreeting} Great to see you again. Based on your ${userContext.visitCount > 1 ? `${userContext.visitCount} previous visits` : 'last visit'}, I've prepared some enhanced features that align with your usage patterns and professional needs.`,
      interactionType: 'interactive',
      psychPattern: 'personalization',
      duration: 6000,
      priority: 10,
      visualElements: {
        icon: '🎯',
        animation: 'pulse',
        color: 'blue',
        background: 'gradient'
      },
      engagementMetrics: {
        expectedTimeOnStep: 6,
        interactionPoints: ['primary_action', 'secondary_action'],
        successCriteria: ['user_engagement', 'feature_discovery']
      }
    });
  } else {
    steps.push({
      id: 'welcome_new',
      title: `Welcome to ${industryContent.title}`,
      content: `${timeBasedGreeting} ${industryContent.welcomeMessage}`,
      interactionType: 'interactive',
      psychPattern: 'social_proof',
      duration: 7000,
      priority: 10,
      visualElements: {
        icon: industryContent.icon,
        animation: 'bounce',
        color: 'purple',
        background: 'gradient'
      },
      engagementMetrics: {
        expectedTimeOnStep: 7,
        interactionPoints: ['primary_action', 'secondary_action'],
        successCriteria: ['user_engagement', 'platform_familiarity']
      }
    });
  }

  // Feature discovery based on role and industry
  const roleFeatures = getRoleFeatures(userRole, industry);
  steps.push({
    id: 'feature_discovery',
    title: 'Discover Powerful Features',
    content: `Based on your role as a ${userRole}, here are the most relevant features for your workflow: ${roleFeatures.join(', ')}`,
    interactionType: 'interactive',
    psychPattern: 'curiosity',
    duration: 8000,
    priority: 9,
    visualElements: {
      icon: '🔍',
      animation: 'fade',
      color: 'green'
    },
    engagementMetrics: {
      expectedTimeOnStep: 8,
      interactionPoints: ['feature_exploration', 'interaction'],
      successCriteria: ['feature_awareness', 'engagement']
    }
  });

  // Social proof with industry-specific testimonials
  const socialProof = getSocialProof(industry);
  steps.push({
    id: 'social_proof',
    title: socialProof.title,
    content: socialProof.content,
    interactionType: 'passive',
    psychPattern: 'social_proof',
    duration: 5000,
    priority: 8,
    visualElements: {
      icon: '🏆',
      animation: 'pulse'
    }
  });

  // Call to action with personalized messaging
  steps.push({
    id: 'call_to_action',
    title: 'Ready to Get Started?',
    content: `Your personalized ${industryContent.dashboardName} is ready. Let's begin your enhanced workflow experience.`,
    interactionType: 'interactive',
    psychPattern: 'commitment',
    duration: 4000,
    priority: 7,
    visualElements: {
      icon: '✨',
      animation: 'sparkle'
    },
    engagementMetrics: {
      expectedTimeOnStep: 4,
      interactionPoints: ['primary_action'],
      successCriteria: ['conversion', 'engagement']
    }
  });

  return steps.sort((a, b) => b.priority - a.priority);
}

async function generateUserInsights(
  userContext: UserContext,
  userRole: string,
  industry: string
) {
  const persona = determineUserPersona(userContext);
  const recommendedFeatures = getRecommendedFeatures(userRole, industry, userContext);
  const engagementStrategy = determineEngagementStrategy(userContext);
  const conversionOptimization = getConversionOptimization(userContext);

  return {
    userPersona: persona,
    recommendedFeatures,
    engagementStrategy,
    conversionOptimization,
    personalizationScore: calculatePersonalizationScore(userContext)
  };
}

function getIndustryContent(industry: string, userRole: string) {
  const content = {
    healthcare: {
      title: 'Advanced Healthcare AI Platform',
      welcomeMessage: 'You\'re joining thousands of healthcare professionals who are transforming patient care with AI-powered insights and automation.',
      icon: '🏥',
      dashboardName: 'clinical dashboard'
    },
    defense: {
      title: 'Mission-Critical Defense Intelligence',
      welcomeMessage: 'Join defense professionals leveraging AI for real-time threat analysis and strategic decision-making.',
      icon: '🛡️',
      dashboardName: 'mission dashboard'
    },
    finance: {
      title: 'Next-Gen Financial AI Suite',
      welcomeMessage: 'Transform your financial operations with AI-driven risk analysis and automated compliance.',
      icon: '💰',
      dashboardName: 'financial dashboard'
    }
  };

  return content[industry as keyof typeof content] || content.healthcare;
}

function getTimeBasedGreeting(timeOfDay: string) {
  const greetings = {
    morning: 'Good morning! Perfect timing to start your day with enhanced productivity.',
    afternoon: 'Good afternoon! Let\'s optimize your workflow with intelligent automation.',
    evening: 'Good evening! Let\'s make your evening workflow more efficient.',
    night: 'Working late? Let\'s streamline your night shift with AI assistance.'
  };

  return greetings[timeOfDay as keyof typeof greetings] || greetings.afternoon;
}

function getDeviceOptimizations(deviceType: string) {
  return {
    mobile: { touchOptimized: true, simplifiedUI: true },
    tablet: { touchOptimized: true, responsiveLayout: true },
    desktop: { fullFeatures: true, keyboardShortcuts: true }
  }[deviceType] || {};
}

function getRoleFeatures(userRole: string, industry: string) {
  const roleFeatures = {
    healthcare: {
      doctor: ['Patient Analytics', 'Clinical Decision Support', 'Automated Documentation'],
      nurse: ['Patient Monitoring', 'Care Coordination', 'Medication Management'],
      admin: ['Workflow Automation', 'Resource Management', 'Compliance Tracking']
    },
    defense: {
      analyst: ['Threat Intelligence', 'Pattern Recognition', 'Real-time Monitoring'],
      commander: ['Strategic Planning', 'Resource Allocation', 'Mission Control'],
      operator: ['Field Operations', 'Communication Tools', 'Situational Awareness']
    },
    finance: {
      analyst: ['Risk Assessment', 'Market Analysis', 'Portfolio Optimization'],
      manager: ['Team Management', 'Performance Tracking', 'Strategic Planning'],
      trader: ['Real-time Trading', 'Market Signals', 'Risk Management']
    }
  };

  const industryFeatures = roleFeatures[industry as keyof typeof roleFeatures];
  return industryFeatures?.[userRole as keyof typeof industryFeatures] || ['Core Features', 'Analytics', 'Automation'];
}

function getSocialProof(industry: string) {
  const socialProof = {
    healthcare: {
      title: 'Trusted by Leading Healthcare Institutions',
      content: 'Join thousands of healthcare professionals from top hospitals and clinics worldwide.'
    },
    defense: {
      title: 'Mission-Critical Defense Operations',
      content: 'Trusted by defense agencies and military organizations for critical operations.'
    },
    finance: {
      title: 'Financial Industry Leaders',
      content: 'Used by major financial institutions for risk management and compliance.'
    }
  };

  return socialProof[industry as keyof typeof socialProof] || socialProof.healthcare;
}

function determineUserPersona(userContext: UserContext) {
  if (userContext.techSavviness === 'advanced' && userContext.engagementStyle === 'autonomous') {
    return 'Power User';
  } else if (userContext.techSavviness === 'beginner' && userContext.attentionSpan === 'short') {
    return 'Quick Learner';
  } else if (userContext.cognitiveLoad === 'high' && userContext.urgencyLevel === 'high') {
    return 'Busy Professional';
  } else {
    return 'Standard User';
  }
}

function getRecommendedFeatures(userRole: string, industry: string, userContext: UserContext) {
  const baseFeatures = ['Dashboard', 'Analytics', 'Automation'];

  if (userContext.techSavviness === 'advanced') {
    baseFeatures.push('Advanced Configuration', 'API Access', 'Custom Workflows');
  }

  if (userContext.deviceType === 'mobile') {
    baseFeatures.push('Mobile Optimization', 'Offline Access');
  }

  return baseFeatures;
}

function determineEngagementStrategy(userContext: UserContext) {
  if (userContext.attentionSpan === 'short') {
    return 'Quick wins and immediate value demonstration';
  } else if (userContext.engagementStyle === 'exploratory') {
    return 'Guided discovery with progressive disclosure';
  } else {
    return 'Comprehensive onboarding with feature highlights';
  }
}

function getConversionOptimization(userContext: UserContext) {
  const optimizations = ['Personalized messaging', 'Contextual timing'];

  if (userContext.urgencyLevel === 'high') {
    optimizations.push('Quick setup', 'Immediate value');
  }

  if (userContext.cognitiveLoad === 'low') {
    optimizations.push('Feature exploration', 'Advanced capabilities');
  }

  return optimizations;
}

function calculatePersonalizationScore(userContext: UserContext) {
  let score = 50; // Base score

  // Add points for available context
  if (userContext.professionalRole) score += 10;
  if (userContext.industryFocus) score += 10;
  if (userContext.deviceType) score += 5;
  if (userContext.timeOfDay) score += 5;
  if (userContext.techSavviness) score += 10;
  if (userContext.engagementStyle) score += 10;

  return Math.min(100, score);
}