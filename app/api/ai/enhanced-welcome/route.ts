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

const ENGAGEMENT_PATTERNS = {
  SOCIAL_PROOF: 'social_proof',
  SCARCITY: 'scarcity',
  PERSONALIZATION: 'personalization',
  ACHIEVEMENT: 'achievement',
  CURIOSITY: 'curiosity',
  AUTHORITY: 'authority',
  RECIPROCITY: 'reciprocity',
  COMMITMENT: 'commitment',
  LIKING: 'liking',
  CONSENSUS: 'consensus'
};

// Industry-specific content templates
const INDUSTRY_CONTENT = {
  healthcare: {
    welcome: {
      title: "Welcome to AI-Powered Healthcare",
      content: "Transform patient care with intelligent automation, predictive analytics, and seamless FHIR integration.",
      features: ["Patient Data Management", "Clinical Decision Support", "Workflow Automation"]
    },
    features: [
      {
        id: "patient_analytics",
        title: "Patient Analytics",
        description: "AI-driven insights for personalized care plans and predictive health outcomes."
      },
      {
        id: "clinical_automation",
        title: "Clinical Automation",
        description: "Streamline routine tasks and focus on what matters most - patient care."
      },
      {
        id: "interoperability",
        title: "FHIR Integration",
        description: "Seamless data exchange across healthcare systems and providers."
      }
    ]
  },
  defense: {
    welcome: {
      title: "Mission-Critical Intelligence Platform",
      content: "Advanced AI solutions for defense operations, threat detection, and strategic decision-making.",
      features: ["Threat Analysis", "Strategic Planning", "Real-time Intelligence"]
    },
    features: [
      {
        id: "threat_detection",
        title: "Threat Detection",
        description: "Real-time analysis and automated threat identification across multiple data sources."
      },
      {
        id: "strategic_planning",
        title: "Strategic Planning",
        description: "AI-powered scenario modeling and decision support for complex operations."
      },
      {
        id: "intelligence_fusion",
        title: "Intelligence Fusion",
        description: "Multi-domain data integration and analysis for comprehensive situational awareness."
      }
    ]
  },
  finance: {
    welcome: {
      title: "Next-Generation Financial AI",
      content: "Revolutionize risk management, compliance, and customer engagement with intelligent automation.",
      features: ["Risk Analysis", "Compliance Automation", "Customer Intelligence"]
    },
    features: [
      {
        id: "risk_management",
        title: "Risk Management",
        description: "Advanced risk modeling and real-time monitoring for proactive decision-making."
      },
      {
        id: "compliance_automation",
        title: "Compliance Automation",
        description: "Automated regulatory compliance checks and reporting to reduce operational risk."
      },
      {
        id: "customer_intelligence",
        title: "Customer Intelligence",
        description: "AI-driven customer insights and personalized engagement strategies."
      }
    ]
  }
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userContext, userRole, industry, isFirstVisit, customSteps } = body;

    // Generate personalized steps based on user context and industry
    const personalizedSteps = generatePersonalizedSteps(userContext, userRole, industry, isFirstVisit);

    // Generate user insights and recommendations
    const insights = generateUserInsights(userContext, industry);

    // Track analytics
    await trackWelcomeAnalytics(userContext, industry, isFirstVisit);

    return NextResponse.json({
      steps: personalizedSteps,
      insights,
      success: true
    });

  } catch (error) {
    console.error('Enhanced welcome API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate personalized welcome experience' },
      { status: 500 }
    );
  }
}

function generatePersonalizedSteps(
  userContext: UserContext,
  userRole: string,
  industry: string,
  isFirstVisit: boolean
): WelcomeStep[] {
  const steps: WelcomeStep[] = [];
  const industryContent = INDUSTRY_CONTENT[industry as keyof typeof INDUSTRY_CONTENT] || INDUSTRY_CONTENT.healthcare;

  // Welcome step with industry-specific content
  if (userContext.isReturningUser) {
    steps.push({
      id: 'welcome_return',
      title: `Welcome back, ${userRole}! 👋`,
      content: `Great to see you again. Based on your ${userContext.visitCount > 1 ? `${userContext.visitCount} previous visits` : 'last visit'}, I've prepared enhanced ${industry} features that align with your workflow patterns.`,
      audioContent: `Welcome back! I've analyzed your previous interactions and prepared personalized insights to enhance your ${industry} workflow.`,
      interactionType: 'interactive',
      psychPattern: ENGAGEMENT_PATTERNS.PERSONALIZATION,
      duration: 6000,
      priority: 10,
      visualElements: {
        icon: '🎯',
        animation: 'pulse',
        color: 'blue',
        background: 'gradient'
      },
      actions: {
        primary: {
          label: 'Show me what\'s new',
          action: () => {},
          style: 'gradient'
        },
        secondary: {
          label: 'Skip to dashboard',
          action: () => {},
          style: 'outline'
        }
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
      title: industryContent.welcome.title,
      content: `${industryContent.welcome.content} ${getTimeBasedGreeting(userContext.timeOfDay)}`,
      audioContent: `Welcome to the future of ${industry} technology. I'm your AI assistant, and I'm excited to help you discover how this platform can transform your daily workflow.`,
      interactionType: 'interactive',
      psychPattern: ENGAGEMENT_PATTERNS.SOCIAL_PROOF,
      duration: 7000,
      priority: 10,
      visualElements: {
        icon: '🚀',
        animation: 'bounce',
        color: 'purple',
        background: 'gradient'
      },
      actions: {
        primary: {
          label: 'Start exploring',
          action: () => {},
          style: 'gradient'
        },
        secondary: {
          label: 'Learn more',
          action: () => {},
          style: 'outline'
        }
      }
    });
  }

  // Industry-specific feature discovery
  steps.push({
    id: 'feature_discovery',
    title: `Discover ${industry} Features`,
    content: `Based on your role as a ${userRole}, here are the most relevant ${industry} features for your workflow:`,
    interactionType: 'interactive',
    psychPattern: ENGAGEMENT_PATTERNS.CURIOSITY,
    duration: 8000,
    priority: 9,
    visualElements: {
      icon: '🔍',
      animation: 'fade',
      color: 'green'
    },
    actions: {
      primary: {
        label: 'Explore features',
        action: () => {}
      },
      secondary: {
        label: 'Skip for now',
        action: () => {}
      }
    }
  });

  // Feature showcase based on industry
  industryContent.features.forEach((feature, index) => {
    steps.push({
      id: `feature_${feature.id}`,
      title: feature.title,
      content: feature.description,
      interactionType: 'passive',
      psychPattern: ENGAGEMENT_PATTERNS.AUTHORITY,
      duration: 5000,
      priority: 8 - index,
      visualElements: {
        icon: getFeatureIcon(feature.id),
        animation: 'fade'
      }
    });
  });

  // Social proof step
  steps.push({
    id: 'social_proof',
    title: 'Trusted by Industry Leaders',
    content: `Join thousands of ${industry} professionals who have already transformed their workflow with our AI platform.`,
    interactionType: 'passive',
    psychPattern: ENGAGEMENT_PATTERNS.SOCIAL_PROOF,
    duration: 5000,
    priority: 7,
    visualElements: {
      icon: '🏆',
      animation: 'pulse'
    }
  });

  // Call to action step
  steps.push({
    id: 'call_to_action',
    title: 'Ready to Get Started?',
    content: `Your personalized ${industry} dashboard is ready. Let's begin your enhanced workflow experience.`,
    interactionType: 'interactive',
    psychPattern: ENGAGEMENT_PATTERNS.COMMITMENT,
    duration: 4000,
    priority: 6,
    visualElements: {
      icon: '✨',
      animation: 'sparkle'
    },
    actions: {
      primary: {
        label: 'Get Started',
        action: () => {}
      }
    }
  });

  return steps.sort((a, b) => b.priority - a.priority);
}

function generateUserInsights(userContext: UserContext, industry: string) {
  return {
    recommendedFeatures: getRecommendedFeatures(userContext, industry),
    engagementStrategy: getEngagementStrategy(userContext),
    personalizationLevel: calculatePersonalizationLevel(userContext),
    predictedEngagement: predictEngagement(userContext),
    optimizationSuggestions: getOptimizationSuggestions(userContext)
  };
}

function getRecommendedFeatures(userContext: UserContext, industry: string) {
  const features = [];

  if (userContext.techSavviness === 'advanced') {
    features.push('Advanced Analytics', 'API Integration', 'Custom Workflows');
  } else if (userContext.techSavviness === 'intermediate') {
    features.push('Dashboard Customization', 'Automated Reports', 'Team Collaboration');
  } else {
    features.push('Guided Tours', 'Templates', 'Help Documentation');
  }

  return features;
}

function getEngagementStrategy(userContext: UserContext) {
  if (userContext.engagementStyle === 'direct') {
    return 'minimal_interaction';
  } else if (userContext.engagementStyle === 'exploratory') {
    return 'feature_discovery';
  } else {
    return 'guided_experience';
  }
}

function calculatePersonalizationLevel(userContext: UserContext) {
  let level = 50; // Base level

  if (userContext.isReturningUser) level += 20;
  if (userContext.visitCount > 3) level += 15;
  if (userContext.preferredInteraction === 'mixed') level += 10;

  return Math.min(100, level);
}

function predictEngagement(userContext: UserContext) {
  let score = 70; // Base score

  if (userContext.attentionSpan === 'long') score += 15;
  if (userContext.cognitiveLoad === 'low') score += 10;
  if (userContext.urgencyLevel === 'low') score += 5;

  return Math.min(100, score);
}

function getOptimizationSuggestions(userContext: UserContext) {
  const suggestions = [];

  if (userContext.deviceType === 'mobile') {
    suggestions.push('Optimize for mobile interaction patterns');
  }

  if (userContext.attentionSpan === 'short') {
    suggestions.push('Use concise, scannable content');
  }

  if (userContext.cognitiveLoad === 'high') {
    suggestions.push('Reduce complexity and provide clear navigation');
  }

  return suggestions;
}

function getTimeBasedGreeting(timeOfDay: string) {
  switch (timeOfDay) {
    case 'morning':
      return 'Perfect timing to start your day with enhanced productivity.';
    case 'afternoon':
      return 'Great time to optimize your workflow and boost efficiency.';
    case 'evening':
      return 'Let\'s make your evening workflow more efficient and productive.';
    default:
      return 'Welcome to the future of professional technology.';
  }
}

function getFeatureIcon(featureId: string) {
  const icons: Record<string, string> = {
    patient_analytics: '📊',
    clinical_automation: '⚡',
    interoperability: '🔗',
    threat_detection: '🛡️',
    strategic_planning: '🎯',
    intelligence_fusion: '🧠',
    risk_management: '📈',
    compliance_automation: '✅',
    customer_intelligence: '👥'
  };

  return icons[featureId] || '✨';
}

async function trackWelcomeAnalytics(userContext: UserContext, industry: string, isFirstVisit: boolean) {
  try {
    // In a real implementation, this would send data to your analytics service
    const analyticsData = {
      timestamp: new Date().toISOString(),
      userContext,
      industry,
      isFirstVisit,
      event: 'welcome_generated'
    };

    // Example: Send to analytics service
    // await fetch('/api/analytics/track', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(analyticsData)
    // });

    console.log('Welcome analytics tracked:', analyticsData);
  } catch (error) {
    console.error('Failed to track welcome analytics:', error);
  }
}