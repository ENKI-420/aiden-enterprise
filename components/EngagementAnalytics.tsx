'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useEffect, useState } from 'react';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Line,
    LineChart,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts';

interface EngagementMetrics {
  startTime: Date;
  interactions: number;
  stepsCompleted: number;
  voiceInteractions: number;
  dismissalAttempts: number;
  timeOnEachStep: Record<string, number>;
  userResponses: Record<string, any>;
  emotionalIndicators: string[];
  completionRate: number;
  satisfactionScore?: number;
  featureDiscovery: string[];
  conversionEvents: string[];
}

interface AnalyticsData {
  totalUsers: number;
  averageCompletionRate: number;
  averageSatisfactionScore: number;
  mostEngagingSteps: Array<{ step: string; engagement: number }>;
  psychologicalPatterns: Array<{ pattern: string; effectiveness: number }>;
  industryBreakdown: Array<{ industry: string; users: number }>;
  timeOfDayAnalysis: Array<{ hour: string; engagement: number }>;
  deviceTypeAnalysis: Array<{ device: string; users: number }>;
}

interface EngagementAnalyticsProps {
  metrics?: EngagementMetrics;
  showRealTime?: boolean;
  refreshInterval?: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function EngagementAnalytics({
  metrics,
  showRealTime = false,
  refreshInterval = 30000
}: EngagementAnalyticsProps) {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAnalyticsData();

    if (showRealTime) {
      const interval = setInterval(fetchAnalyticsData, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [showRealTime, refreshInterval]);

  const fetchAnalyticsData = async () => {
    try {
      setIsLoading(true);

      // In a real implementation, this would fetch from your analytics API
      // const response = await fetch('/api/analytics/dashboard');
      // const data = await response.json();

      // Mock data for demonstration
      const mockData: AnalyticsData = {
        totalUsers: 1247,
        averageCompletionRate: 78.5,
        averageSatisfactionScore: 4.2,
        mostEngagingSteps: [
          { step: 'Welcome', engagement: 95 },
          { step: 'Feature Discovery', engagement: 87 },
          { step: 'Social Proof', engagement: 82 },
          { step: 'Call to Action', engagement: 76 }
        ],
        psychologicalPatterns: [
          { pattern: 'Personalization', effectiveness: 92 },
          { pattern: 'Social Proof', effectiveness: 88 },
          { pattern: 'Curiosity', effectiveness: 85 },
          { pattern: 'Authority', effectiveness: 79 },
          { pattern: 'Commitment', effectiveness: 76 }
        ],
        industryBreakdown: [
          { industry: 'Healthcare', users: 45 },
          { industry: 'Defense', users: 32 },
          { industry: 'Finance', users: 23 }
        ],
        timeOfDayAnalysis: [
          { hour: '9AM', engagement: 85 },
          { hour: '12PM', engagement: 92 },
          { hour: '3PM', engagement: 88 },
          { hour: '6PM', engagement: 76 },
          { hour: '9PM', engagement: 68 }
        ],
        deviceTypeAnalysis: [
          { device: 'Desktop', users: 65 },
          { device: 'Mobile', users: 28 },
          { device: 'Tablet', users: 7 }
        ]
      };

      setAnalyticsData(mockData);
    } catch (error) {
      console.error('Failed to fetch analytics data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-gray-500">No analytics data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Engagement Analytics</h2>
          <p className="text-gray-600">Real-time insights into user engagement and psychological patterns</p>
        </div>
        {showRealTime && (
          <Badge variant="secondary" className="animate-pulse">
            Live Data
          </Badge>
        )}
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{analyticsData.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-gray-500 mt-1">Active in last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">
              Completion Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{analyticsData.averageCompletionRate}%</div>
            <Progress value={analyticsData.averageCompletionRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">
              Satisfaction Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{analyticsData.averageSatisfactionScore}/5</div>
            <div className="flex gap-1 mt-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-4 h-4 rounded ${
                    i < Math.floor(analyticsData.averageSatisfactionScore)
                      ? 'bg-yellow-400'
                      : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Most Engaging Steps */}
        <Card>
          <CardHeader>
            <CardTitle>Step Engagement</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analyticsData.mostEngagingSteps}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="step" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="engagement" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Psychological Patterns */}
        <Card>
          <CardHeader>
            <CardTitle>Psychological Pattern Effectiveness</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analyticsData.psychologicalPatterns}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="pattern" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="effectiveness" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Industry Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Industry Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analyticsData.industryBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ industry, percent }) => `${industry} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="users"
                >
                  {analyticsData.industryBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Time of Day Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Engagement by Time of Day</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analyticsData.timeOfDayAnalysis}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="engagement" stroke="#F59E0B" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Device Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Device Type Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {analyticsData.deviceTypeAnalysis.map((device, index) => (
              <div key={device.device} className="text-center">
                <div className="text-2xl font-bold text-blue-600">{device.users}%</div>
                <div className="text-sm text-gray-600">{device.device}</div>
                <div className="mt-2">
                  <Progress value={device.users} className="h-2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Key Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <p className="font-medium">Personalization is most effective</p>
                <p className="text-sm text-gray-600">
                  92% effectiveness rate shows users respond best to personalized content
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <p className="font-medium">Peak engagement at noon</p>
                <p className="text-sm text-gray-600">
                  Users are most engaged during lunch hours (12PM-1PM)
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
              <div>
                <p className="font-medium">Desktop users complete more steps</p>
                <p className="text-sm text-gray-600">
                  65% of users on desktop complete the full welcome flow
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}