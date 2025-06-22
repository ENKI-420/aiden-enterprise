import { NextApiRequest, NextApiResponse } from 'next';

interface UserContext {
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  deviceType: 'desktop' | 'tablet' | 'mobile';
  isReturningUser: boolean;
  visitCount: number;
  preferredInteraction: 'visual' | 'audio' | 'mixed';
  userGoal?: string;
  professionalRole?: string;
  industryFocus?: string;
  urgencyLevel: 'low' | 'medium' | 'high';
  engagementStyle: 'direct' | 'exploratory' | 'guided';
}

interface PersonalizationRequest {
  userContext: UserContext;
  patientContext?: any;
  userRole: string;
  sessionGoals: {
    primary: string;
    secondary: string;
    context: {
      hasPatientData: boolean;
      timeConstraints: string;
      deviceOptimization: string;
    };
  };
}

const PSYCHOLOGICAL_TRIGGERS = {
  SOCIAL_PROOF: {
    phrases: [
      "Join thousands of healthcare professionals",
      "Industry leaders trust our platform",
      "95% of users see improved efficiency",
      "Recommended by leading medical institutions"
    ],
    scenarios: ['new_user', 'feature_introduction']
  },
  AUTHORITY: {
    phrases: [
      "Clinically validated AI insights",
      "FDA-compliant platform",
      "Evidence-based recommendations",
      "Peer-reviewed methodologies"
    ],
    scenarios: ['medical_features', 'compliance_focus']
  },
  SCARCITY: {
    phrases: [
      "Limited-time enhanced access",
      "Exclusive early features",
      "Priority clinical support",
      "Advanced capabilities unlocked"
    ],
    scenarios: ['feature_unlock', 'premium_access'],
    subtle: true
  },
  PERSONALIZATION: {
    phrases: [
      "Tailored specifically for your practice",
      "Based on your usage patterns",
      "Customized for your workflow",
      "Adapted to your preferences"
    ],
    scenarios: ['returning_user', 'role_specific']
  },
  ACHIEVEMENT: {
    phrases: [
      "You're making great progress",
      "Milestone unlocked",
      "Skills enhanced",
      "Efficiency improved"
    ],
    scenarios: ['completion', 'progress_tracking']
  },
  CURIOSITY: {
    phrases: [
      "Discover hidden capabilities",
      "Explore advanced features",
      "See what's possible",
      "Unlock new potential"
    ],
    scenarios: ['feature_exploration', 'advanced_tools']
  }
};

const ROLE_SPECIFIC_CONTENT = {
  physician: {
    priorities: ['clinical_decision_support', 'patient_safety', 'efficiency'],
    language: 'clinical',
    features: ['diagnosis_assistance', 'treatment_recommendations', 'drug_interactions']
  },
  nurse: {
    priorities: ['patient_care', 'documentation', 'workflow_optimization'],
    language: 'practical',
    features: ['care_plans', 'medication_management', 'patient_monitoring']
  },
  administrator: {
    priorities: ['efficiency', 'compliance', 'cost_optimization'],
    language: 'business',
    features: ['analytics', 'reporting', 'workflow_management']
  },
  researcher: {
    priorities: ['data_analysis', 'insights', 'evidence_generation'],
    language: 'academic',
    features: ['research_tools', 'data_export', 'statistical_analysis']
  }
};

function generatePersonalizedSteps(request: PersonalizationRequest) {
  const { userContext, patientContext, userRole, sessionGoals } = request;
  const steps = [];

  // Dynamic welcome based on context
  const welcomeStep = generateWelcomeStep(userContext, userRole);
  steps.push(welcomeStep);

  // Voice activation with intelligent timing
  if (shouldOfferVoice(userContext)) {
    const voiceStep = generateVoiceStep(userContext);
    steps.push(voiceStep);
  }

  // Feature introduction based on role and context
  const featureSteps = generateFeatureSteps(userContext, userRole, patientContext, sessionGoals);
  steps.push(...featureSteps);

  // Smart engagement hooks
  const engagementSteps = generateEngagementHooks(userContext, sessionGoals);
  steps.push(...engagementSteps);

  // Personalized completion
  const completionStep = generateCompletionStep(userContext, userRole);
  steps.push(completionStep);

  return steps;
}

function generateWelcomeStep(userContext: UserContext, userRole: string) {
  const timeGreeting = getTimeSpecificGreeting(userContext.timeOfDay);
  const roleContent = ROLE_SPECIFIC_CONTENT[userRole as keyof typeof ROLE_SPECIFIC_CONTENT] || ROLE_SPECIFIC_CONTENT.physician;

  let socialProof = '';
  if (!userContext.isReturningUser) {
    socialProof = PSYCHOLOGICAL_TRIGGERS.SOCIAL_PROOF.phrases[
      Math.floor(Math.random() * PSYCHOLOGICAL_TRIGGERS.SOCIAL_PROOF.phrases.length)
    ];
  }

  const personalizedGreeting = userContext.isReturningUser
    ? `Welcome back! Your efficiency has improved ${Math.floor(Math.random() * 20 + 15)}% since your last visit.`
    : `${timeGreeting} ${socialProof} who are transforming healthcare delivery.`;

  return {
    id: 'personalized_welcome',
    title: userContext.isReturningUser ? `Welcome Back! 👋` : `${timeGreeting} 🌟`,
    content: personalizedGreeting,
    audioContent: generateAudioContent(personalizedGreeting, userContext),
    interactionType: 'interactive',
    psychPattern: userContext.isReturningUser ? 'personalization' : 'social_proof',
    duration: calculateOptimalDuration(userContext, 6000),
    actions: {
      primary: {
        label: userContext.isReturningUser ? "Show me what's new" : "Get started",
        action: 'advance'
      },
      secondary: userContext.isReturningUser ? {
        label: "Skip to dashboard",
        action: 'smart_dismiss'
      } : undefined
    }
  };
}

function generateVoiceStep(userContext: UserContext) {
  const authorityPhrase = PSYCHOLOGICAL_TRIGGERS.AUTHORITY.phrases[
    Math.floor(Math.random() * PSYCHOLOGICAL_TRIGGERS.AUTHORITY.phrases.length)
  ];

  const efficiencyBenefit = userContext.deviceType === 'mobile'
    ? "40% faster mobile navigation"
    : "hands-free operation during consultations";

  return {
    id: 'voice_activation',
    title: 'Unlock Voice-Powered Efficiency 🎙️',
    content: `${authorityPhrase}. Healthcare professionals report ${efficiencyBenefit} with voice commands.`,
    audioContent: `May I enable voice interactions? This ${authorityPhrase.toLowerCase()} feature allows ${efficiencyBenefit}, particularly valuable during patient care.`,
    interactionType: 'voice',
    psychPattern: 'authority',
    duration: calculateOptimalDuration(userContext, 8000),
    actions: {
      primary: {
        label: 'Enable Voice Features',
        action: 'request_voice'
      },
      secondary: {
        label: 'Maybe later',
        action: 'advance'
      }
    }
  };
}

function generateFeatureSteps(userContext: UserContext, userRole: string, patientContext: any, sessionGoals: any) {
  const steps = [];
  const roleContent = ROLE_SPECIFIC_CONTENT[userRole as keyof typeof ROLE_SPECIFIC_CONTENT] || ROLE_SPECIFIC_CONTENT.physician;

  // Patient context step
  if (patientContext) {
    const personalizedContent = `I notice you're working with patient data. Our AI agents can provide contextual ${roleContent.priorities[0]} and ${roleContent.priorities[1]} for enhanced care delivery.`;

    steps.push({
      id: 'patient_context',
      title: 'Smart Patient Context Detected 🏥',
      content: personalizedContent,
      audioContent: `I see you have patient context loaded. Let me show you how our AI can assist with ${roleContent.priorities[0]}.`,
      interactionType: 'interactive',
      psychPattern: 'personalization',
      duration: calculateOptimalDuration(userContext, 7000),
      actions: {
        primary: {
          label: `Show ${roleContent.language} Tools`,
          action: 'demonstrate_clinical'
        },
        secondary: {
          label: 'Continue tour',
          action: 'advance'
        }
      }
    });
  }

  // Role-specific feature introduction
  if (userContext.engagementStyle === 'exploratory') {
    const curiosityPhrase = PSYCHOLOGICAL_TRIGGERS.CURIOSITY.phrases[
      Math.floor(Math.random() * PSYCHOLOGICAL_TRIGGERS.CURIOSITY.phrases.length)
    ];

    steps.push({
      id: 'role_features',
      title: `${curiosityPhrase} 🔍`,
      content: `As a ${userRole}, you have access to specialized ${roleContent.features.join(', ')} features. ${getPersonalizedInsight(userContext, userRole)}`,
      audioContent: `Let me show you the specialized tools designed specifically for your role as a ${userRole}.`,
      interactionType: 'interactive',
      psychPattern: 'curiosity',
      duration: calculateOptimalDuration(userContext, 6000),
      actions: {
        primary: {
          label: 'Explore Features',
          action: 'demonstrate_features'
        },
        secondary: {
          label: 'Quick overview',
          action: 'advance'
        }
      }
    });
  }

  return steps;
}

function generateEngagementHooks(userContext: UserContext, sessionGoals: any) {
  const hooks = [];

  // Subtle achievement trigger for returning users
  if (userContext.isReturningUser && userContext.visitCount > 3) {
    const achievementPhrase = PSYCHOLOGICAL_TRIGGERS.ACHIEVEMENT.phrases[
      Math.floor(Math.random() * PSYCHOLOGICAL_TRIGGERS.ACHIEVEMENT.phrases.length)
    ];

    hooks.push({
      id: 'achievement_hook',
      title: `${achievementPhrase} 🎯`,
      content: `You've mastered the basics! Ready to unlock advanced capabilities that save an additional 30 minutes per day?`,
      audioContent: `Congratulations on your progress! You're ready for our advanced efficiency features.`,
      interactionType: 'interactive',
      psychPattern: 'achievement',
      duration: calculateOptimalDuration(userContext, 5000),
      actions: {
        primary: {
          label: 'Unlock Advanced Features',
          action: 'demonstrate_advanced'
        },
        secondary: {
          label: 'Continue',
          action: 'advance'
        }
      }
    });
  }

  // Subtle scarcity for premium features (if applicable)
  if (sessionGoals.context.hasPatientData && userContext.urgencyLevel === 'low') {
    hooks.push({
      id: 'premium_access',
      title: 'Enhanced Clinical Suite Available 💫',
      content: 'You have temporary access to our premium clinical decision support tools. These advanced AI capabilities are designed for complex case management.',
      audioContent: 'I notice you might benefit from our enhanced clinical tools, which are available for your current session.',
      interactionType: 'interactive',
      psychPattern: 'scarcity',
      duration: calculateOptimalDuration(userContext, 6000),
      actions: {
        primary: {
          label: 'Explore Premium Tools',
          action: 'demonstrate_premium'
        },
        secondary: {
          label: 'Standard features',
          action: 'advance'
        }
      }
    });
  }

  return hooks;
}

function generateCompletionStep(userContext: UserContext, userRole: string) {
  const achievementPhrase = PSYCHOLOGICAL_TRIGGERS.ACHIEVEMENT.phrases[
    Math.floor(Math.random() * PSYCHOLOGICAL_TRIGGERS.ACHIEVEMENT.phrases.length)
  ];

  const personalizedOutcome = userContext.preferredInteraction === 'voice'
    ? 'voice-enhanced workflow'
    : userContext.deviceType === 'mobile'
    ? 'mobile-optimized interface'
    : 'comprehensive desktop experience';

  return {
    id: 'completion',
    title: `${achievementPhrase}! 🚀`,
    content: `Perfect! You're now equipped with a ${personalizedOutcome} tailored for ${userRole}s. Your personalized dashboard is ready.`,
    audioContent: `Excellent! You now have everything you need. I'm always here to assist you throughout your workflow.`,
    interactionType: 'passive',
    psychPattern: 'achievement',
    duration: calculateOptimalDuration(userContext, 4000),
    actions: {
      primary: {
        label: 'Enter Dashboard',
        action: 'complete'
      }
    }
  };
}

function shouldOfferVoice(userContext: UserContext): boolean {
  // Intelligent voice offering based on context
  if (userContext.preferredInteraction === 'visual') return false;
  if (userContext.deviceType === 'mobile' && userContext.urgencyLevel === 'high') return false;
  if (userContext.timeOfDay === 'night') return false; // Considerate timing

  return true;
}

function getTimeSpecificGreeting(timeOfDay: string): string {
  const greetings = {
    morning: 'Good morning!',
    afternoon: 'Good afternoon!',
    evening: 'Good evening!',
    night: 'Welcome!'
  };
  return greetings[timeOfDay as keyof typeof greetings] || 'Welcome!';
}

function generateAudioContent(textContent: string, userContext: UserContext): string {
  // Adapt audio content based on user context
  const baseAudio = textContent.replace(/\d+%/g, (match) => `${match.replace('%', ' percent')}`);

  if (userContext.urgencyLevel === 'high') {
    return `I'll keep this brief. ${baseAudio}`;
  }

  if (userContext.engagementStyle === 'direct') {
    return baseAudio;
  }

  return `${baseAudio} Let me walk you through this step by step.`;
}

function calculateOptimalDuration(userContext: UserContext, baseDuration: number): number {
  let duration = baseDuration;

  if (userContext.urgencyLevel === 'high') duration *= 0.7;
  if (userContext.deviceType === 'mobile') duration *= 0.8;
  if (userContext.engagementStyle === 'direct') duration *= 0.9;
  if (userContext.isReturningUser) duration *= 0.85;

  return Math.max(duration, 2000); // Minimum 2 seconds
}

function getPersonalizedInsight(userContext: UserContext, userRole: string): string {
  const insights = {
    morning: "Perfect timing to set up your daily workflow efficiency.",
    afternoon: "Great for optimizing your afternoon productivity.",
    evening: "Ideal for reviewing and planning tomorrow's cases.",
    night: "Quick setup for when you need it most."
  };

  return insights[userContext.timeOfDay as keyof typeof insights] || insights.afternoon;
}

function generateUserInsights(request: PersonalizationRequest) {
  const { userContext, sessionGoals } = request;

  return {
    engagementProfile: {
      style: userContext.engagementStyle,
      preferredInteraction: userContext.preferredInteraction,
      urgencyAdaptation: userContext.urgencyLevel
    },
    predictedPath: {
      primaryGoal: sessionGoals.primary,
      likelyFeatures: ROLE_SPECIFIC_CONTENT[request.userRole as keyof typeof ROLE_SPECIFIC_CONTENT]?.features || [],
      timeOptimization: calculateOptimalDuration(userContext, 1000)
    },
    personalizationFactors: {
      timeOfDay: userContext.timeOfDay,
      deviceOptimization: userContext.deviceType,
      experienceLevel: userContext.isReturningUser ? 'experienced' : 'new',
      visitHistory: userContext.visitCount
    }
  };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const request: PersonalizationRequest = req.body;

    // Validate request
    if (!request.userContext || !request.userRole) {
      return res.status(400).json({ error: 'Invalid request parameters' });
    }

    // Generate personalized experience
    const steps = generatePersonalizedSteps(request);
    const insights = generateUserInsights(request);

    // Log engagement for future personalization (in production, use proper analytics)
    console.log('Personalization generated:', {
      userRole: request.userRole,
      context: request.userContext,
      stepsGenerated: steps.length,
      timestamp: new Date()
    });

    res.status(200).json({
      steps,
      insights,
      meta: {
        personalizationVersion: '2.0',
        generatedAt: new Date().toISOString(),
        optimizedFor: request.userContext.engagementStyle
      }
    });

  } catch (error) {
    console.error('Personalization error:', error);
    res.status(500).json({
      error: 'Personalization failed',
      fallback: true
    });
  }
}