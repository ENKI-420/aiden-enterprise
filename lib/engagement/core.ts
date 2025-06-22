/**
 * AI-Enhanced User Engagement System
 * Provides personalized onboarding, feature discovery, and proactive assistance
 */

import { EventEmitter } from 'events';

// User engagement types
export interface UserProfile {
  id: string;
  firstVisit: Date;
  lastVisit: Date;
  visitCount: number;
  role?: 'executive' | 'developer' | 'healthcare' | 'researcher';
  interests: string[];
  completedFeatures: string[];
  engagementScore: number;
  preferences: UserPreferences;
  behaviorPatterns: BehaviorPattern[];
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  notificationLevel: 'all' | 'important' | 'none';
  guidanceLevel: 'beginner' | 'intermediate' | 'expert';
  aiAssistanceEnabled: boolean;
}

export interface BehaviorPattern {
  action: string;
  frequency: number;
  lastOccurred: Date;
  context: Record<string, any>;
}

export interface EngagementEvent {
  type: 'feature_discovered' | 'tutorial_completed' | 'milestone_reached' | 'assistance_requested';
  feature?: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface Feature {
  id: string;
  name: string;
  description: string;
  category: 'core' | 'advanced' | 'experimental';
  prerequisites?: string[];
  estimatedTime?: number; // minutes
  value: 'high' | 'medium' | 'low';
  aiEnhanced?: boolean;
}

export interface GuidedTour {
  id: string;
  name: string;
  description: string;
  steps: TourStep[];
  targetRole?: string;
  estimatedDuration: number;
  completionReward?: string;
}

export interface TourStep {
  id: string;
  target: string; // CSS selector or element ID
  title: string;
  content: string;
  action?: 'click' | 'hover' | 'input' | 'observe';
  position?: 'top' | 'bottom' | 'left' | 'right';
  highlight?: boolean;
  skipable?: boolean;
}

export interface AIRecommendation {
  id: string;
  type: 'feature' | 'content' | 'workflow' | 'learning';
  title: string;
  description: string;
  reason: string;
  confidence: number;
  priority: 'high' | 'medium' | 'low';
  action?: () => void;
}

// Main Engagement Engine
export class EngagementEngine extends EventEmitter {
  private userProfile: UserProfile;
  private features: Map<string, Feature> = new Map();
  private tours: Map<string, GuidedTour> = new Map();
  private activeRecommendations: AIRecommendation[] = [];
  private engagementHistory: EngagementEvent[] = [];

  constructor(userId: string) {
    super();
    this.userProfile = this.loadOrCreateProfile(userId);
    this.initializeFeatures();
    this.initializeTours();
  }

  // Initialize available features
  private initializeFeatures() {
    const features: Feature[] = [
      {
        id: 'video-conference',
        name: 'Executive Video Conference',
        description: 'AI-powered video conferencing with real-time transcription',
        category: 'core',
        estimatedTime: 5,
        value: 'high',
        aiEnhanced: true
      },
      {
        id: 'medical-agents',
        name: 'Medical AI Agents',
        description: 'Specialized AI assistants for healthcare workflows',
        category: 'advanced',
        prerequisites: ['video-conference'],
        estimatedTime: 10,
        value: 'high',
        aiEnhanced: true
      },
      {
        id: 'ai-coding-suite',
        name: 'Agile Defense AI Coding Suite',
        description: 'Self-improving AI for code generation and optimization',
        category: 'advanced',
        estimatedTime: 15,
        value: 'high',
        aiEnhanced: true
      },
      {
        id: 'ar-overlay',
        name: 'AR Conference Overlay',
        description: '3D augmented reality features for immersive meetings',
        category: 'experimental',
        prerequisites: ['video-conference'],
        estimatedTime: 8,
        value: 'medium'
      },
      {
        id: 'patient-context',
        name: 'EPIC Patient Context',
        description: 'Real-time patient data integration',
        category: 'core',
        estimatedTime: 3,
        value: 'high',
        aiEnhanced: true
      },
      {
        id: 'workflow-automation',
        name: 'AI Workflow Automation',
        description: 'Automated medical analysis workflows',
        category: 'advanced',
        prerequisites: ['medical-agents'],
        estimatedTime: 12,
        value: 'high',
        aiEnhanced: true
      }
    ];

    features.forEach(f => this.features.set(f.id, f));
  }

  // Initialize guided tours
  private initializeTours() {
    const tours: GuidedTour[] = [
      {
        id: 'welcome-tour',
        name: 'Welcome to AIDEN Enterprise',
        description: 'Get started with the basics',
        estimatedDuration: 5,
        steps: [
          {
            id: 'welcome',
            target: 'body',
            title: 'Welcome to AIDEN Enterprise! 🚀',
            content: 'Your AI-powered platform for defense, healthcare, and enterprise collaboration. Let me show you around!',
            position: 'bottom',
            skipable: false
          },
          {
            id: 'conference',
            target: '[aria-label="Join Conference"]',
            title: 'Start a Video Conference',
            content: 'Click here to join an AI-enhanced video conference with real-time transcription and analysis.',
            action: 'click',
            position: 'bottom',
            highlight: true
          },
          {
            id: 'ai-agents',
            target: '.medical-agent-panel',
            title: 'Meet Your AI Assistants',
            content: 'These specialized AI agents can help with medical analysis, clinical trials, and patient education.',
            position: 'left',
            highlight: true
          },
          {
            id: 'patient-data',
            target: '.patient-context-bar',
            title: 'Patient Context Integration',
            content: 'View real-time patient data from EPIC EHR systems right in your conference.',
            position: 'bottom',
            highlight: true
          }
        ],
        completionReward: 'Basic Explorer Badge'
      },
      {
        id: 'developer-tour',
        name: 'AI Coding Suite Tour',
        description: 'Explore the self-improving AI coding assistant',
        targetRole: 'developer',
        estimatedDuration: 10,
        steps: [
          {
            id: 'coding-suite',
            target: '[aria-label="AI Coding Suite"]',
            title: 'Launch AI Coding Suite',
            content: 'Access the most advanced AI coding assistant that learns and improves from every interaction.',
            action: 'click',
            position: 'bottom',
            highlight: true
          },
          {
            id: 'quality-prediction',
            target: '.quality-prediction',
            title: 'Predictive Code Quality',
            content: 'The AI predicts code quality before generation, saving you time and iterations.',
            position: 'right'
          },
          {
            id: 'real-time-analysis',
            target: '.real-time-analysis',
            title: 'Live Code Analysis',
            content: 'Get instant feedback on code quality, performance, and accessibility.',
            position: 'left'
          },
          {
            id: 'auto-refactor',
            target: '.refactoring-suggestions',
            title: 'One-Click Optimization',
            content: 'Apply AI-suggested refactorings with a single click.',
            position: 'top'
          }
        ],
        completionReward: 'Code Wizard Badge'
      },
      {
        id: 'healthcare-tour',
        name: 'Healthcare AI Workflow',
        description: 'Master the medical AI features',
        targetRole: 'healthcare',
        estimatedDuration: 8,
        steps: [
          {
            id: 'medical-agents',
            target: '.medical-agent-panel',
            title: 'Medical AI Agents',
            content: 'Five specialized agents for oncology, trials, drug safety, imaging, and patient education.',
            position: 'left',
            highlight: true
          },
          {
            id: 'workflow-button',
            target: '.agent-workflow-button',
            title: 'Automated Workflows',
            content: 'Run complex medical analysis workflows with one click - perfect for tumor boards!',
            action: 'hover',
            position: 'bottom'
          },
          {
            id: 'epic-integration',
            target: '.patient-context-bar',
            title: 'EPIC EHR Integration',
            content: 'Real-time patient data with labs, medications, and treatment history.',
            position: 'bottom'
          }
        ],
        completionReward: 'Healthcare Hero Badge'
      }
    ];

    tours.forEach(t => this.tours.set(t.id, t));
  }

  // Load or create user profile
  private loadOrCreateProfile(userId: string): UserProfile {
    // In production, load from database
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem(`user_profile_${userId}`);
      if (stored) {
        return JSON.parse(stored);
      }
    }

    return {
      id: userId,
      firstVisit: new Date(),
      lastVisit: new Date(),
      visitCount: 1,
      interests: [],
      completedFeatures: [],
      engagementScore: 0,
      preferences: {
        theme: 'dark',
        language: 'en',
        notificationLevel: 'important',
        guidanceLevel: 'beginner',
        aiAssistanceEnabled: true
      },
      behaviorPatterns: []
    };
  }

  // Save user profile
  private saveProfile() {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      localStorage.setItem(`user_profile_${this.userProfile.id}`, JSON.stringify(this.userProfile));
    }
  }

  // Track user action
  public trackAction(action: string, metadata?: Record<string, any>) {
    const pattern = this.userProfile.behaviorPatterns.find(p => p.action === action);

    if (pattern) {
      pattern.frequency++;
      pattern.lastOccurred = new Date();
      pattern.context = { ...pattern.context, ...metadata };
    } else {
      this.userProfile.behaviorPatterns.push({
        action,
        frequency: 1,
        lastOccurred: new Date(),
        context: metadata || {}
      });
    }

    this.analyzeAndRecommend();
    this.saveProfile();
    this.emit('action:tracked', { action, metadata });
  }

  // Mark feature as discovered
  public discoverFeature(featureId: string) {
    if (!this.userProfile.completedFeatures.includes(featureId)) {
      this.userProfile.completedFeatures.push(featureId);
      this.userProfile.engagementScore += 10;

      const event: EngagementEvent = {
        type: 'feature_discovered',
        feature: featureId,
        timestamp: new Date()
      };

      this.engagementHistory.push(event);
      this.emit('feature:discovered', { featureId, feature: this.features.get(featureId) });

      // Check for unlocked features
      this.checkUnlockedFeatures();

      this.saveProfile();
    }
  }

  // Complete a guided tour
  public completeTour(tourId: string) {
    const tour = this.tours.get(tourId);
    if (tour) {
      this.userProfile.engagementScore += 20;

      const event: EngagementEvent = {
        type: 'tutorial_completed',
        feature: tourId,
        timestamp: new Date(),
        metadata: { tourName: tour.name, reward: tour.completionReward }
      };

      this.engagementHistory.push(event);
      this.emit('tour:completed', { tourId, tour });

      this.saveProfile();
    }
  }

  // Get personalized recommendations
  public getRecommendations(): AIRecommendation[] {
    this.analyzeAndRecommend();
    return this.activeRecommendations;
  }

  // Analyze user behavior and generate recommendations
  private analyzeAndRecommend() {
    const recommendations: AIRecommendation[] = [];

    // Recommend based on role
    if (this.userProfile.role === 'healthcare' && !this.userProfile.completedFeatures.includes('medical-agents')) {
      recommendations.push({
        id: 'try-medical-agents',
        type: 'feature',
        title: 'Try Medical AI Agents',
        description: 'Based on your healthcare role, our AI agents can significantly streamline your workflow.',
        reason: 'Tailored for healthcare professionals',
        confidence: 0.95,
        priority: 'high'
      });
    }

    // Recommend based on usage patterns
    const conferenceActions = this.userProfile.behaviorPatterns.filter(p =>
      p.action.includes('conference') || p.action.includes('video')
    );

    if (conferenceActions.length > 3 && !this.userProfile.completedFeatures.includes('ar-overlay')) {
      recommendations.push({
        id: 'try-ar',
        type: 'feature',
        title: 'Enhance Meetings with AR',
        description: 'You use video conferences frequently. Try AR overlays for more engaging presentations!',
        reason: 'Based on your conference usage',
        confidence: 0.8,
        priority: 'medium'
      });
    }

    // Recommend advanced features for experienced users
    if (this.userProfile.completedFeatures.length > 3 && this.userProfile.preferences.guidanceLevel !== 'expert') {
      recommendations.push({
        id: 'level-up',
        type: 'learning',
        title: 'Ready for Advanced Features?',
        description: 'You\'ve mastered the basics. Switch to expert mode for advanced capabilities!',
        reason: 'High feature adoption rate',
        confidence: 0.85,
        priority: 'medium',
        action: () => this.updatePreferences({ guidanceLevel: 'expert' })
      });
    }

    // Time-based recommendations
    const hoursSinceLastVisit = (Date.now() - new Date(this.userProfile.lastVisit).getTime()) / (1000 * 60 * 60);

    if (hoursSinceLastVisit > 168) { // 1 week
      recommendations.push({
        id: 'welcome-back',
        type: 'content',
        title: 'Welcome Back! See What\'s New',
        description: 'Check out the latest features and improvements since your last visit.',
        reason: 'Returning user engagement',
        confidence: 0.9,
        priority: 'high'
      });
    }

    // Workflow recommendations based on incomplete tasks
    const startedWorkflows = this.userProfile.behaviorPatterns.filter(p =>
      p.action.includes('workflow_started') && !p.action.includes('workflow_completed')
    );

    if (startedWorkflows.length > 0) {
      recommendations.push({
        id: 'complete-workflow',
        type: 'workflow',
        title: 'Complete Your Analysis',
        description: 'You have unfinished medical analysis workflows. Would you like to continue?',
        reason: 'Incomplete workflow detected',
        confidence: 0.9,
        priority: 'high'
      });
    }

    this.activeRecommendations = recommendations.sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  }

  // Check for newly unlocked features
  private checkUnlockedFeatures() {
    const unlocked: Feature[] = [];

    this.features.forEach(feature => {
      if (!this.userProfile.completedFeatures.includes(feature.id)) {
        const prerequisitesMet = !feature.prerequisites ||
          feature.prerequisites.every(p => this.userProfile.completedFeatures.includes(p));

        if (prerequisitesMet) {
          unlocked.push(feature);
        }
      }
    });

    if (unlocked.length > 0) {
      this.emit('features:unlocked', { features: unlocked });
    }
  }

  // Update user preferences
  public updatePreferences(updates: Partial<UserPreferences>) {
    this.userProfile.preferences = { ...this.userProfile.preferences, ...updates };
    this.saveProfile();
    this.emit('preferences:updated', { preferences: this.userProfile.preferences });
  }

  // Get user's progress
  public getProgress(): {
    featuresCompleted: number;
    totalFeatures: number;
    engagementScore: number;
    nextMilestone: number;
    recommendedNext: Feature | null;
  } {
    const totalFeatures = this.features.size;
    const featuresCompleted = this.userProfile.completedFeatures.length;

    // Find next recommended feature
    let recommendedNext: Feature | null = null;
    for (const [id, feature] of this.features) {
      if (!this.userProfile.completedFeatures.includes(id)) {
        const prerequisitesMet = !feature.prerequisites ||
          feature.prerequisites.every(p => this.userProfile.completedFeatures.includes(p));

        if (prerequisitesMet) {
          recommendedNext = feature;
          break;
        }
      }
    }

    const milestones = [10, 25, 50, 100, 200, 500, 1000];
    const nextMilestone = milestones.find(m => m > this.userProfile.engagementScore) || 1000;

    return {
      featuresCompleted,
      totalFeatures,
      engagementScore: this.userProfile.engagementScore,
      nextMilestone,
      recommendedNext
    };
  }

  // Get appropriate tour for user
  public getRecommendedTour(): GuidedTour | null {
    // First-time users get welcome tour
    if (this.userProfile.visitCount === 1) {
      return this.tours.get('welcome-tour') || null;
    }

    // Role-specific tours
    if (this.userProfile.role) {
      const roleTours = Array.from(this.tours.values()).filter(t =>
        t.targetRole === this.userProfile.role
      );

      if (roleTours.length > 0) {
        return roleTours[0];
      }
    }

    // Feature-specific tours based on interests
    const interestTours = Array.from(this.tours.values()).filter(t =>
      this.userProfile.interests.some(interest => t.id.includes(interest))
    );

    return interestTours[0] || null;
  }

  // Generate contextual help
  public getContextualHelp(context: string): {
    tips: string[];
    shortcuts: Record<string, string>;
    relatedFeatures: Feature[];
  } {
    const tips: string[] = [];
    const shortcuts: Record<string, string> = {};
    const relatedFeatures: Feature[] = [];

    // Context-specific help
    switch (context) {
      case 'conference':
        tips.push('Press Space to mute/unmute quickly');
        tips.push('Use Ctrl+D to toggle screen sharing');
        tips.push('AI transcription is automatic - check the sidebar');
        shortcuts['Space'] = 'Mute/Unmute';
        shortcuts['Ctrl+D'] = 'Share Screen';
        shortcuts['Ctrl+E'] = 'Export Transcript';
        relatedFeatures.push(
          this.features.get('ar-overlay')!,
          this.features.get('medical-agents')!
        );
        break;

      case 'coding':
        tips.push('The AI learns from your edits to improve suggestions');
        tips.push('Check quality predictions before generating');
        tips.push('One-click refactoring can save hours');
        shortcuts['Ctrl+Enter'] = 'Generate Code';
        shortcuts['Ctrl+R'] = 'Refactor';
        shortcuts['Ctrl+Q'] = 'Quality Check';
        break;

      case 'medical':
        tips.push('Run complete workflows with one click');
        tips.push('Patient context updates in real-time');
        tips.push('AI agents can work in parallel');
        shortcuts['Ctrl+W'] = 'Run Workflow';
        shortcuts['Ctrl+P'] = 'Patient Search';
        relatedFeatures.push(
          this.features.get('workflow-automation')!,
          this.features.get('patient-context')!
        );
        break;
    }

    return { tips, shortcuts, relatedFeatures };
  }
}

// Engagement Analytics
export class EngagementAnalytics {
  private events: EngagementEvent[] = [];

  public recordEvent(event: EngagementEvent) {
    this.events.push(event);
    this.analyze();
  }

  private analyze() {
    // Calculate engagement metrics
    const last24h = this.events.filter(e =>
      e.timestamp > new Date(Date.now() - 24 * 60 * 60 * 1000)
    );

    const metrics = {
      dailyActiveFeatures: new Set(last24h.map(e => e.feature)).size,
      totalEvents: last24h.length,
      mostUsedFeature: this.getMostUsedFeature(last24h),
      engagementTrend: this.calculateTrend()
    };

    // Emit analytics event
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('engagement:analytics', { detail: metrics }));
    }
  }

  private getMostUsedFeature(events: EngagementEvent[]): string | null {
    const counts: Record<string, number> = {};
    events.forEach(e => {
      if (e.feature) {
        counts[e.feature] = (counts[e.feature] || 0) + 1;
      }
    });

    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    return sorted[0]?.[0] || null;
  }

  private calculateTrend(): 'increasing' | 'stable' | 'decreasing' {
    const now = Date.now();
    const week1 = this.events.filter(e =>
      e.timestamp > new Date(now - 7 * 24 * 60 * 60 * 1000) &&
      e.timestamp < new Date(now)
    ).length;

    const week2 = this.events.filter(e =>
      e.timestamp > new Date(now - 14 * 24 * 60 * 60 * 1000) &&
      e.timestamp < new Date(now - 7 * 24 * 60 * 60 * 1000)
    ).length;

    if (week1 > week2 * 1.2) return 'increasing';
    if (week1 < week2 * 0.8) return 'decreasing';
    return 'stable';
  }

  public getInsights(): string[] {
    const insights: string[] = [];

    // Feature discovery insights
    const discoveries = this.events.filter(e => e.type === 'feature_discovered');
    if (discoveries.length > 5) {
      insights.push('Great exploration! You\'ve discovered multiple features.');
    }

    // Tutorial completion insights
    const tutorials = this.events.filter(e => e.type === 'tutorial_completed');
    if (tutorials.length === 0 && this.events.length > 10) {
      insights.push('Try a guided tour to learn faster!');
    }

    // Assistance patterns
    const assistanceRequests = this.events.filter(e => e.type === 'assistance_requested');
    if (assistanceRequests.length > 3) {
      const topics = assistanceRequests.map(e => e.metadata?.topic).filter(Boolean);
      insights.push(`You often ask about ${topics[0]}. Check our advanced guide!`);
    }

    return insights;
  }
}