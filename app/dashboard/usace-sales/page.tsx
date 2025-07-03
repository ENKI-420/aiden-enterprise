"use client";

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
    Calendar,
    Clock,
    DollarSign,
    Mail,
    Phone,
    Target,
    TrendingUp,
    Users
} from 'lucide-react';
import { useEffect, useState } from 'react';

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

interface Analytics {
    totalRequests: number;
    todayRequests: number;
    weekRequests: number;
    contractorTypes: { [key: string]: number };
    usaceDistricts: { [key: string]: number };
    revenueRanges: { [key: string]: number };
    averageLeadScore: number;
}

export default function USACESalesDashboard() {
    const [trialRequests, setTrialRequests] = useState<USACETrialRequest[]>([]);
    const [analytics, setAnalytics] = useState<Analytics | null>(null);
    const [loading, setLoading] = useState(true);
    const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

    const fetchData = async () => {
        try {
            const response = await fetch('/api/usace-contractors/trial-request?adminKey=iris-admin-2024');
            const data = await response.json();
            setTrialRequests(data.requests || []);
            setAnalytics(data.analytics);
            setLastRefresh(new Date());
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        // Auto-refresh every 5 minutes
        const interval = setInterval(fetchData, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    // Calculate go-to-market progress
    const gtmProgress = {
        phase1Target: 50,
        phase2Target: 200,
        phase3Target: 500,
        currentRequests: analytics?.totalRequests || 0
    };

    const getCurrentPhase = () => {
        if (gtmProgress.currentRequests >= gtmProgress.phase3Target) return 3;
        if (gtmProgress.currentRequests >= gtmProgress.phase2Target) return 3;
        if (gtmProgress.currentRequests >= gtmProgress.phase1Target) return 2;
        return 1;
    };

    const getPhaseProgress = () => {
        const phase = getCurrentPhase();
        if (phase === 1) {
            return (gtmProgress.currentRequests / gtmProgress.phase1Target) * 100;
        } else if (phase === 2) {
            return ((gtmProgress.currentRequests - gtmProgress.phase1Target) / (gtmProgress.phase2Target - gtmProgress.phase1Target)) * 100;
        } else {
            return ((gtmProgress.currentRequests - gtmProgress.phase2Target) / (gtmProgress.phase3Target - gtmProgress.phase2Target)) * 100;
        }
    };

    const calculateLeadScore = (request: USACETrialRequest): number => {
        let score = 0;

        const revenueScores: { [key: string]: number } = {
            'under-1m': 10, '1m-5m': 20, '5m-25m': 40, '25m-100m': 60, 'over-100m': 80
        };
        score += revenueScores[request.annualRevenue] || 0;

        const contractorScores: { [key: string]: number } = {
            'environmental': 30, 'construction': 25, 'consulting': 20, 'other': 15
        };
        score += contractorScores[request.contractorType] || 0;

        const districtScores: { [key: string]: number } = {
            'mobile': 15, 'savannah': 15, 'jacksonville': 15, 'charleston': 10, 'norfolk': 10, 'baltimore': 10, 'other': 5
        };
        score += districtScores[request.usaceDistrict] || 0;

        if (request.currentChallenges.length > 100) score += 15;

        return Math.min(score, 100);
    };

    const getLeadPriority = (score: number): { label: string; color: string } => {
        if (score >= 70) return { label: 'HIGH', color: 'bg-red-500' };
        if (score >= 50) return { label: 'MEDIUM', color: 'bg-yellow-500' };
        return { label: 'LOW', color: 'bg-green-500' };
    };

    const projectRevenue = (): number => {
        const avgContractValue = 90000; // $90K annually
        return gtmProgress.currentRequests * avgContractValue;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-blue-400">Loading USACE sales dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">USACE Contractors Sales Dashboard</h1>
                        <p className="text-slate-400">Real-time tracking of your go-to-market strategy</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-sm text-slate-400">
                            Last updated: {lastRefresh.toLocaleTimeString()}
                        </div>
                        <Button onClick={fetchData} className="bg-blue-600 hover:bg-blue-700">
                            Refresh Data
                        </Button>
                    </div>
                </div>

                {/* Go-to-Market Progress */}
                <Card className="mb-8 bg-slate-800 border-slate-700">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                            <Target className="w-5 h-5" />
                            Go-to-Market Progress - Phase {getCurrentPhase()}
                        </CardTitle>
                        <CardDescription className="text-slate-300">
                            Tracking progress towards $45M ARR target
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex justify-between text-sm text-slate-300">
                                <span>Phase {getCurrentPhase()} Target</span>
                                <span>
                                    {gtmProgress.currentRequests} / {
                                        getCurrentPhase() === 1 ? gtmProgress.phase1Target :
                                            getCurrentPhase() === 2 ? gtmProgress.phase2Target :
                                                gtmProgress.phase3Target
                                    } contractors
                                </span>
                            </div>
                            <Progress value={getPhaseProgress()} className="h-3" />
                            <div className="grid grid-cols-3 gap-4 pt-4">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-blue-400">{gtmProgress.phase1Target}</div>
                                    <div className="text-sm text-slate-400">Phase 1 Target</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-green-400">{gtmProgress.phase2Target}</div>
                                    <div className="text-sm text-slate-400">Phase 2 Target</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-purple-400">{gtmProgress.phase3Target}</div>
                                    <div className="text-sm text-slate-400">Phase 3 Target</div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card className="bg-slate-800 border-slate-700">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-slate-400">Total Requests</p>
                                    <p className="text-2xl font-bold text-white">{analytics?.totalRequests || 0}</p>
                                </div>
                                <Users className="w-8 h-8 text-blue-400" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-slate-800 border-slate-700">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-slate-400">Today</p>
                                    <p className="text-2xl font-bold text-white">{analytics?.todayRequests || 0}</p>
                                </div>
                                <Clock className="w-8 h-8 text-green-400" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-slate-800 border-slate-700">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-slate-400">This Week</p>
                                    <p className="text-2xl font-bold text-white">{analytics?.weekRequests || 0}</p>
                                </div>
                                <TrendingUp className="w-8 h-8 text-purple-400" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-slate-800 border-slate-700">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-slate-400">Projected Revenue</p>
                                    <p className="text-2xl font-bold text-white">${(projectRevenue() / 1000000).toFixed(1)}M</p>
                                </div>
                                <DollarSign className="w-8 h-8 text-yellow-400" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Analytics Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Contractor Types */}
                    <Card className="bg-slate-800 border-slate-700">
                        <CardHeader>
                            <CardTitle className="text-white">Contractor Types</CardTitle>
                            <CardDescription className="text-slate-300">Distribution by specialization</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {analytics?.contractorTypes && Object.entries(analytics.contractorTypes).map(([type, count]) => (
                                    <div key={type} className="flex items-center justify-between">
                                        <span className="text-slate-300 capitalize">{type}</span>
                                        <div className="flex items-center gap-2">
                                            <div className="w-20 bg-slate-700 rounded-full h-2">
                                                <div
                                                    className="bg-blue-500 h-2 rounded-full"
                                                    style={{ width: `${(count / (analytics?.totalRequests || 1)) * 100}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-white text-sm w-8">{count}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* USACE Districts */}
                    <Card className="bg-slate-800 border-slate-700">
                        <CardHeader>
                            <CardTitle className="text-white">USACE Districts</CardTitle>
                            <CardDescription className="text-slate-300">Geographic distribution</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {analytics?.usaceDistricts && Object.entries(analytics.usaceDistricts).map(([district, count]) => (
                                    <div key={district} className="flex items-center justify-between">
                                        <span className="text-slate-300 capitalize">{district}</span>
                                        <div className="flex items-center gap-2">
                                            <div className="w-20 bg-slate-700 rounded-full h-2">
                                                <div
                                                    className="bg-green-500 h-2 rounded-full"
                                                    style={{ width: `${(count / (analytics?.totalRequests || 1)) * 100}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-white text-sm w-8">{count}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Leads */}
                <Card className="bg-slate-800 border-slate-700">
                    <CardHeader>
                        <CardTitle className="text-white">Recent Trial Requests</CardTitle>
                        <CardDescription className="text-slate-300">Latest prospects requiring follow-up</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {trialRequests.slice(-10).reverse().map((request, index) => {
                                const leadScore = calculateLeadScore(request);
                                const priority = getLeadPriority(leadScore);

                                return (
                                    <div key={index} className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
                                        <div className="flex items-center gap-4">
                                            <div className="flex flex-col">
                                                <div className="font-semibold text-white">{request.company}</div>
                                                <div className="text-sm text-slate-400">{request.name} • {request.email}</div>
                                            </div>
                                            <Badge className={`${priority.color} text-white`}>
                                                {priority.label}
                                            </Badge>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <div className="text-sm text-slate-300">
                                                Score: {leadScore}/100
                                            </div>
                                            <div className="flex gap-1">
                                                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                                                    <Phone className="w-4 h-4" />
                                                </Button>
                                                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                                    <Mail className="w-4 h-4" />
                                                </Button>
                                                <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                                                    <Calendar className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
} 