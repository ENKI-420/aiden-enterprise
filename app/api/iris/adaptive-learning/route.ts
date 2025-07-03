import { NextRequest, NextResponse } from 'next/server';

// Adaptive Learning Engine for IRIS-AI Enterprise
interface LearningRequest {
    userId: string;
    sessionId: string;
    interactionType: 'feedback' | 'completion' | 'error' | 'preference' | 'behavior';
    data: {
        feature?: string;
        outcome?: 'success' | 'failure' | 'partial';
        satisfaction?: number; // 1-10
        timeSpent?: number;
        context?: any;
        userAction?: string;
        expectedResult?: string;
        actualResult?: string;
    };
    timestamp: string;
    metadata?: {
        userRole?: string;
        industry?: string;
        experienceLevel?: 'beginner' | 'intermediate' | 'advanced';
        deviceType?: string;
    };
}

interface LearningResponse {
    learningId: string;
    adaptations: {
        immediate: AdaptationAction[];
        scheduled: AdaptationAction[];
        experimental: AdaptationAction[];
    };
    insights: {
        userProfile: UserProfile;
        patterns: Pattern[];
        recommendations: Recommendation[];
    };
    metrics: {
        learningEffectiveness: number;
        adaptationConfidence: number;
        personalización: number;
        systemImprovement: number;
    };
    nextActions: string[];
}

interface AdaptationAction {
    type: 'ui_adjustment' | 'feature_recommendation' | 'workflow_optimization' | 'content_personalization';
    target: string;
    modification: any;
    confidence: number;
    priority: 'low' | 'medium' | 'high' | 'critical';
    estimatedImpact: number;
}

interface UserProfile {
    id: string;
    learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'mixed';
    preferredComplexity: 'simple' | 'moderate' | 'complex';
    interactionPatterns: string[];
    strengths: string[];
    challengeAreas: string[];
    progressMetrics: {
        tasksCompleted: number;
        averageTime: number;
        successRate: number;
        learningVelocity: number;
    };
}

interface Pattern {
    id: string;
    type: 'behavioral' | 'temporal' | 'contextual' | 'performance';
    description: string;
    frequency: number;
    significance: number;
    trend: 'increasing' | 'decreasing' | 'stable';
}

interface Recommendation {
    id: string;
    category: 'feature' | 'workflow' | 'training' | 'optimization';
    title: string;
    description: string;
    expectedBenefit: string;
    implementation: 'immediate' | 'next_session' | 'long_term';
    confidence: number;
}

// In-memory learning database (in production, use persistent storage)
const learningDatabase = new Map<string, UserProfile>();
const interactionHistory = new Map<string, LearningRequest[]>();

// Learning algorithms
function analyzeUserBehavior(userId: string, interactions: LearningRequest[]): UserProfile {
    const existingProfile = learningDatabase.get(userId) || {
        id: userId,
        learningStyle: 'mixed',
        preferredComplexity: 'moderate',
        interactionPatterns: [],
        strengths: [],
        challengeAreas: [],
        progressMetrics: {
            tasksCompleted: 0,
            averageTime: 0,
            successRate: 0,
            learningVelocity: 0
        }
    };

    // Analyze interaction patterns
    const recentInteractions = interactions.slice(-20); // Last 20 interactions
    const successfulInteractions = recentInteractions.filter(i => i.data.outcome === 'success');
    const failedInteractions = recentInteractions.filter(i => i.data.outcome === 'failure');

    // Update metrics
    existingProfile.progressMetrics.tasksCompleted = interactions.length;
    existingProfile.progressMetrics.successRate = successfulInteractions.length / recentInteractions.length;
    existingProfile.progressMetrics.averageTime = recentInteractions.reduce((sum, i) => sum + (i.data.timeSpent || 0), 0) / recentInteractions.length;

    // Determine learning style based on interaction patterns
    const visualInteractions = recentInteractions.filter(i =>
        i.data.feature?.includes('visual') || i.data.feature?.includes('chart') || i.data.feature?.includes('diagram')
    );
    const auditoryInteractions = recentInteractions.filter(i =>
        i.data.feature?.includes('voice') || i.data.feature?.includes('audio') || i.data.feature?.includes('speech')
    );
    const kinestheticInteractions = recentInteractions.filter(i =>
        i.data.feature?.includes('drag') || i.data.feature?.includes('gesture') || i.data.feature?.includes('touch')
    );

    if (visualInteractions.length > auditoryInteractions.length && visualInteractions.length > kinestheticInteractions.length) {
        existingProfile.learningStyle = 'visual';
    } else if (auditoryInteractions.length > kinestheticInteractions.length) {
        existingProfile.learningStyle = 'auditory';
    } else if (kinestheticInteractions.length > 0) {
        existingProfile.learningStyle = 'kinesthetic';
    }

    // Identify strengths and challenge areas
    const featureSuccessRates = new Map<string, { success: number; total: number }>();
    recentInteractions.forEach(interaction => {
        const feature = interaction.data.feature || 'unknown';
        const current = featureSuccessRates.get(feature) || { success: 0, total: 0 };
        current.total++;
        if (interaction.data.outcome === 'success') {
            current.success++;
        }
        featureSuccessRates.set(feature, current);
    });

    existingProfile.strengths = Array.from(featureSuccessRates.entries())
        .filter(([_, stats]) => stats.success / stats.total > 0.8 && stats.total >= 3)
        .map(([feature, _]) => feature);

    existingProfile.challengeAreas = Array.from(featureSuccessRates.entries())
        .filter(([_, stats]) => stats.success / stats.total < 0.5 && stats.total >= 3)
        .map(([feature, _]) => feature);

    // Calculate learning velocity
    const timeBasedSuccess = recentInteractions
        .filter(i => i.data.outcome === 'success')
        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    if (timeBasedSuccess.length >= 5) {
        const early = timeBasedSuccess.slice(0, Math.floor(timeBasedSuccess.length / 2));
        const recent = timeBasedSuccess.slice(Math.floor(timeBasedSuccess.length / 2));
        const earlyAvgTime = early.reduce((sum, i) => sum + (i.data.timeSpent || 0), 0) / early.length;
        const recentAvgTime = recent.reduce((sum, i) => sum + (i.data.timeSpent || 0), 0) / recent.length;

        existingProfile.progressMetrics.learningVelocity = earlyAvgTime > 0 ? (earlyAvgTime - recentAvgTime) / earlyAvgTime : 0;
    }

    return existingProfile;
}

function generateAdaptations(profile: UserProfile, currentInteraction: LearningRequest): AdaptationAction[] {
    const adaptations: AdaptationAction[] = [];

    // UI adaptations based on learning style
    if (profile.learningStyle === 'visual') {
        adaptations.push({
            type: 'ui_adjustment',
            target: 'interface',
            modification: {
                enableVisualHints: true,
                increaseIconSize: true,
                enableCharts: true,
                preferGraphicalRepresentation: true
            },
            confidence: 0.8,
            priority: 'medium',
            estimatedImpact: 0.7
        });
    } else if (profile.learningStyle === 'auditory') {
        adaptations.push({
            type: 'ui_adjustment',
            target: 'interface',
            modification: {
                enableVoiceGuidance: true,
                enableAudioFeedback: true,
                preferTextToSpeech: true,
                enableSoundNotifications: true
            },
            confidence: 0.8,
            priority: 'medium',
            estimatedImpact: 0.7
        });
    }

    // Feature recommendations based on strengths
    profile.strengths.forEach(strength => {
        adaptations.push({
            type: 'feature_recommendation',
            target: 'feature_discovery',
            modification: {
                highlightFeature: strength,
                suggestAdvancedUsage: true,
                enableProFeatures: true
            },
            confidence: 0.9,
            priority: 'low',
            estimatedImpact: 0.6
        });
    });

    // Workflow optimizations for challenge areas
    profile.challengeAreas.forEach(challenge => {
        adaptations.push({
            type: 'workflow_optimization',
            target: challenge,
            modification: {
                enableGuidedMode: true,
                addHelpTooltips: true,
                simplifyInterface: true,
                enableStepByStepGuidance: true
            },
            confidence: 0.7,
            priority: 'high',
            estimatedImpact: 0.8
        });
    });

    // Content personalization based on success rate
    if (profile.progressMetrics.successRate < 0.6) {
        adaptations.push({
            type: 'content_personalization',
            target: 'onboarding',
            modification: {
                extendOnboarding: true,
                addPracticeExercises: true,
                enableMentorMode: true,
                reduceComplexity: true
            },
            confidence: 0.85,
            priority: 'high',
            estimatedImpact: 0.9
        });
    } else if (profile.progressMetrics.successRate > 0.9) {
        adaptations.push({
            type: 'content_personalization',
            target: 'advanced_features',
            modification: {
                enableAdvancedMode: true,
                suggestProFeatures: true,
                reduceGuidance: true,
                enableExpertTools: true
            },
            confidence: 0.8,
            priority: 'medium',
            estimatedImpact: 0.7
        });
    }

    return adaptations;
}

function identifyPatterns(interactions: LearningRequest[]): Pattern[] {
    const patterns: Pattern[] = [];

    // Temporal patterns
    const hourlyActivity = new Map<number, number>();
    interactions.forEach(interaction => {
        const hour = new Date(interaction.timestamp).getHours();
        hourlyActivity.set(hour, (hourlyActivity.get(hour) || 0) + 1);
    });

    const peakHour = Array.from(hourlyActivity.entries())
        .sort(([, a], [, b]) => b - a)[0];

    if (peakHour && peakHour[1] > 3) {
        patterns.push({
            id: `temporal_peak_${peakHour[0]}`,
            type: 'temporal',
            description: `Peak activity at ${peakHour[0]}:00`,
            frequency: peakHour[1],
            significance: 0.7,
            trend: 'stable'
        });
    }

    // Behavioral patterns
    const featureUsage = new Map<string, number>();
    interactions.forEach(interaction => {
        const feature = interaction.data.feature || 'unknown';
        featureUsage.set(feature, (featureUsage.get(feature) || 0) + 1);
    });

    Array.from(featureUsage.entries())
        .filter(([_, count]) => count > 5)
        .forEach(([feature, count]) => {
            patterns.push({
                id: `behavioral_${feature}`,
                type: 'behavioral',
                description: `Frequent use of ${feature}`,
                frequency: count,
                significance: Math.min(count / interactions.length, 1),
                trend: 'increasing'
            });
        });

    return patterns;
}

function generateRecommendations(profile: UserProfile, patterns: Pattern[]): Recommendation[] {
    const recommendations: Recommendation[] = [];

    // Learning velocity recommendations
    if (profile.progressMetrics.learningVelocity < 0) {
        recommendations.push({
            id: 'slow_learning_support',
            category: 'training',
            title: 'Enhanced Learning Support',
            description: 'Enable additional guidance and practice exercises to improve learning speed',
            expectedBenefit: 'Faster skill acquisition and improved confidence',
            implementation: 'immediate',
            confidence: 0.8
        });
    }

    // Success rate recommendations
    if (profile.progressMetrics.successRate < 0.7) {
        recommendations.push({
            id: 'success_optimization',
            category: 'workflow',
            title: 'Workflow Simplification',
            description: 'Streamline complex processes and add guided assistance',
            expectedBenefit: 'Higher success rates and reduced frustration',
            implementation: 'next_session',
            confidence: 0.9
        });
    }

    // Feature recommendations based on patterns
    patterns.filter(p => p.type === 'behavioral' && p.significance > 0.5)
        .forEach(pattern => {
            recommendations.push({
                id: `feature_enhancement_${pattern.id}`,
                category: 'feature',
                title: `Enhanced ${pattern.description.split(' ').pop()} Features`,
                description: `Unlock advanced capabilities for frequently used features`,
                expectedBenefit: 'Improved productivity and efficiency',
                implementation: 'immediate',
                confidence: 0.7
            });
        });

    return recommendations;
}

export async function POST(request: NextRequest) {
    try {
        const body: LearningRequest = await request.json();

        // Validate request
        if (!body.userId || !body.interactionType || !body.data) {
            return NextResponse.json(
                { error: 'Missing required fields: userId, interactionType, data' },
                { status: 400 }
            );
        }

        // Store interaction
        const userInteractions = interactionHistory.get(body.userId) || [];
        userInteractions.push(body);
        interactionHistory.set(body.userId, userInteractions);

        // Analyze and update user profile
        const userProfile = analyzeUserBehavior(body.userId, userInteractions);
        learningDatabase.set(body.userId, userProfile);

        // Generate adaptations
        const immediateAdaptations = generateAdaptations(userProfile, body);
        const scheduledAdaptations = immediateAdaptations.filter(a => a.priority === 'low');
        const experimentalAdaptations = immediateAdaptations.filter(a => a.confidence < 0.7);

        // Identify patterns
        const patterns = identifyPatterns(userInteractions);

        // Generate recommendations
        const recommendations = generateRecommendations(userProfile, patterns);

        const response: LearningResponse = {
            learningId: `learning-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            adaptations: {
                immediate: immediateAdaptations.filter(a => a.priority !== 'low' && a.confidence >= 0.7),
                scheduled: scheduledAdaptations,
                experimental: experimentalAdaptations
            },
            insights: {
                userProfile,
                patterns,
                recommendations
            },
            metrics: {
                learningEffectiveness: userProfile.progressMetrics.learningVelocity * 100,
                adaptationConfidence: immediateAdaptations.reduce((sum, a) => sum + a.confidence, 0) / immediateAdaptations.length,
                personalización: Math.min(userInteractions.length / 50, 1) * 100, // More interactions = better personalization
                systemImprovement: userProfile.progressMetrics.successRate * 100
            },
            nextActions: [
                'Apply immediate UI adaptations',
                'Schedule workflow optimizations',
                'Monitor adaptation effectiveness',
                'Collect additional feedback',
                'Update machine learning models'
            ]
        };

        return NextResponse.json(response);

    } catch (error) {
        console.error('Adaptive Learning API Error:', error);
        return NextResponse.json(
            {
                error: 'Adaptive learning processing failed',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}

// Analytics endpoint
export async function GET(request: NextRequest) {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');

    if (userId) {
        // Return specific user profile
        const profile = learningDatabase.get(userId);
        const interactions = interactionHistory.get(userId) || [];

        return NextResponse.json({
            profile,
            interactionCount: interactions.length,
            patterns: identifyPatterns(interactions),
            lastActivity: interactions[interactions.length - 1]?.timestamp
        });
    } else {
        // Return system-wide analytics
        const totalUsers = learningDatabase.size;
        const totalInteractions = Array.from(interactionHistory.values())
            .reduce((sum, interactions) => sum + interactions.length, 0);

        const avgSuccessRate = Array.from(learningDatabase.values())
            .reduce((sum, profile) => sum + profile.progressMetrics.successRate, 0) / totalUsers;

        return NextResponse.json({
            status: 'operational',
            statistics: {
                totalUsers,
                totalInteractions,
                averageSuccessRate: (avgSuccessRate * 100).toFixed(1) + '%',
                adaptiveCapabilities: [
                    'UI Personalization',
                    'Workflow Optimization',
                    'Content Adaptation',
                    'Feature Recommendations'
                ]
            },
            timestamp: new Date().toISOString()
        });
    }
} 