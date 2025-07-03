import { NextRequest, NextResponse } from 'next/server';

// USACE Contractor Trial Request Interface
interface USACETrialRequest {
    company: string;
    name: string;
    email: string;
    phone: string;
    contractorType: string;
    usaceDistrict: string;
    currentChallenges: string;
    annualRevenue: string;
    timestamp: string;
    source: string;
}

// Mock database for trial requests
let trialRequests: USACETrialRequest[] = [];

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate required fields
        const requiredFields = ['company', 'name', 'email', 'phone', 'contractorType'];
        for (const field of requiredFields) {
            if (!body[field]) {
                return NextResponse.json(
                    { error: `Missing required field: ${field}` },
                    { status: 400 }
                );
            }
        }

        // Create trial request record
        const trialRequest: USACETrialRequest = {
            company: body.company,
            name: body.name,
            email: body.email,
            phone: body.phone,
            contractorType: body.contractorType,
            usaceDistrict: body.usaceDistrict || 'Not specified',
            currentChallenges: body.currentChallenges || '',
            annualRevenue: body.annualRevenue || 'Not specified',
            timestamp: new Date().toISOString(),
            source: 'usace-contractors-landing-page'
        };

        // Store trial request
        trialRequests.push(trialRequest);

        // Determine lead scoring
        const leadScore = calculateLeadScore(trialRequest);

        // Send automated email workflows
        await sendWelcomeEmail(trialRequest);
        await sendInternalNotification(trialRequest, leadScore);

        // Schedule follow-up tasks
        await scheduleFollowUpTasks(trialRequest, leadScore);

        return NextResponse.json({
            success: true,
            message: 'Trial request submitted successfully',
            trialId: `USACE-${Date.now()}`,
            leadScore: leadScore,
            nextSteps: getNextSteps(leadScore)
        });

    } catch (error) {
        console.error('Error processing USACE trial request:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const adminKey = searchParams.get('adminKey');

        // Simple admin authentication (replace with proper auth)
        if (adminKey !== 'iris-admin-2024') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Return trial requests with analytics
        const analytics = generateAnalytics(trialRequests);

        return NextResponse.json({
            totalRequests: trialRequests.length,
            requests: trialRequests,
            analytics: analytics
        });

    } catch (error) {
        console.error('Error fetching trial requests:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// Lead scoring algorithm
function calculateLeadScore(request: USACETrialRequest): number {
    let score = 0;

    // Company size scoring (based on revenue)
    const revenueScores: { [key: string]: number } = {
        'under-1m': 10,
        '1m-5m': 20,
        '5m-25m': 40,
        '25m-100m': 60,
        'over-100m': 80
    };
    score += revenueScores[request.annualRevenue] || 0;

    // Contractor type scoring
    const contractorScores: { [key: string]: number } = {
        'environmental': 30,
        'construction': 25,
        'consulting': 20,
        'other': 15
    };
    score += contractorScores[request.contractorType] || 0;

    // USACE district scoring (high-value districts)
    const districtScores: { [key: string]: number } = {
        'mobile': 15,
        'savannah': 15,
        'jacksonville': 15,
        'charleston': 10,
        'norfolk': 10,
        'baltimore': 10,
        'other': 5
    };
    score += districtScores[request.usaceDistrict] || 0;

    // Challenges indicate pain points (good for conversion)
    if (request.currentChallenges.length > 100) {
        score += 15;
    }

    return Math.min(score, 100);
}

// Automated email workflows
async function sendWelcomeEmail(request: USACETrialRequest) {
    const emailContent = `
    Dear ${request.name},

    Welcome to IRIS-AI Enterprise for USACE Contractors!

    We've received your request for a 30-day free trial and we're excited to help you dominate USACE contracts with quantum-powered AI.

    🚀 What happens next:
    1. Platform access will be provisioned within 24 hours
    2. Your dedicated onboarding specialist will contact you within 4 hours
    3. We'll schedule your personalized demo and training session
    4. CMMC Level 3 compliance setup will be completed automatically

    🎯 Based on your profile (${request.contractorType} contractor), we've pre-configured:
    - Industry-specific AI models for your use case
    - Compliance templates for ${request.usaceDistrict} district requirements
    - Competitive intelligence for your market segment

    📞 Your dedicated specialist: Sarah Johnson
    📧 Email: sarah.johnson@iris-ai.com
    📱 Direct: (555) 123-4567

    Questions? Simply reply to this email.

    Best regards,
    The IRIS-AI Enterprise Team

    P.S. Check your spam folder for our platform access email coming soon!
  `;

    // In production, integrate with your email service (SendGrid, Mailgun, etc.)
    console.log('Welcome email sent to:', request.email);
    console.log('Email content:', emailContent);
}

async function sendInternalNotification(request: USACETrialRequest, leadScore: number) {
    const priority = leadScore >= 70 ? 'HIGH' : leadScore >= 50 ? 'MEDIUM' : 'LOW';

    const notification = `
    🚨 NEW USACE CONTRACTOR TRIAL REQUEST - ${priority} PRIORITY

    Company: ${request.company}
    Contact: ${request.name} (${request.email})
    Phone: ${request.phone}
    Lead Score: ${leadScore}/100
    
    Details:
    - Contractor Type: ${request.contractorType}
    - USACE District: ${request.usaceDistrict}
    - Annual Revenue: ${request.annualRevenue}
    - Challenges: ${request.currentChallenges.substring(0, 200)}...
    
    Next Actions:
    ${priority === 'HIGH' ? '1. Call within 1 hour' : '1. Call within 4 hours'}
    2. Send personalized demo
    3. Schedule platform walkthrough
    4. Configure industry-specific modules
    
    CRM Link: [Update with your CRM integration]
  `;

    // In production, send to sales team via Slack/Teams/Email
    console.log('Internal notification:', notification);
}

async function scheduleFollowUpTasks(request: USACETrialRequest, leadScore: number) {
    const tasks = [
        {
            task: 'Initial outreach call',
            schedule: leadScore >= 70 ? '1 hour' : '4 hours',
            assignee: 'Sarah Johnson'
        },
        {
            task: 'Send personalized demo video',
            schedule: '2 hours',
            assignee: 'Marketing Automation'
        },
        {
            task: 'Platform access provisioning',
            schedule: '24 hours',
            assignee: 'Technical Team'
        },
        {
            task: 'Follow-up if no response',
            schedule: '48 hours',
            assignee: 'Sales Team'
        }
    ];

    // In production, integrate with your task management system
    console.log('Follow-up tasks scheduled:', tasks);
}

function getNextSteps(leadScore: number): string[] {
    const baseSteps = [
        'Check your email for platform access details',
        'Expect a call from your dedicated specialist within 4 hours',
        'Prepare questions about your specific USACE challenges'
    ];

    if (leadScore >= 70) {
        return [
            'Priority onboarding - expect a call within 1 hour',
            'Expedited platform access (within 12 hours)',
            'Executive briefing scheduled automatically',
            ...baseSteps.slice(2)
        ];
    }

    return baseSteps;
}

function generateAnalytics(requests: USACETrialRequest[]) {
    const today = new Date().toISOString().split('T')[0];
    const thisWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    return {
        totalRequests: requests.length,
        todayRequests: requests.filter(r => r.timestamp.startsWith(today)).length,
        weekRequests: requests.filter(r => r.timestamp >= thisWeek).length,

        // Contractor type breakdown
        contractorTypes: requests.reduce((acc, r) => {
            acc[r.contractorType] = (acc[r.contractorType] || 0) + 1;
            return acc;
        }, {} as { [key: string]: number }),

        // USACE district breakdown
        usaceDistricts: requests.reduce((acc, r) => {
            acc[r.usaceDistrict] = (acc[r.usaceDistrict] || 0) + 1;
            return acc;
        }, {} as { [key: string]: number }),

        // Revenue breakdown
        revenueRanges: requests.reduce((acc, r) => {
            acc[r.annualRevenue] = (acc[r.annualRevenue] || 0) + 1;
            return acc;
        }, {} as { [key: string]: number }),

        // Average lead score
        averageLeadScore: requests.length > 0
            ? requests.reduce((sum, r) => sum + calculateLeadScore(r), 0) / requests.length
            : 0
    };
} 