"use client";

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Feature } from '@/lib/engagement/core';
import { motion } from 'framer-motion';
import {
    Award,
    CheckCircle,
    Lock,
    Star,
    Target,
    TrendingUp,
    Trophy,
    Zap
} from 'lucide-react';
import React from 'react';

interface ProgressDashboardProps {
  featuresCompleted: number;
  totalFeatures: number;
  engagementScore: number;
  nextMilestone: number;
  recommendedNext: Feature | null;
  badges?: string[];
  recentAchievements?: Achievement[];
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  unlockedAt: Date;
}

export default function ProgressDashboard({
  featuresCompleted,
  totalFeatures,
  engagementScore,
  nextMilestone,
  recommendedNext,
  badges = [],
  recentAchievements = []
}: ProgressDashboardProps) {
  const completionPercentage = (featuresCompleted / totalFeatures) * 100;
  const milestoneProgress = (engagementScore / nextMilestone) * 100;

  const defaultAchievements: Achievement[] = [
    {
      id: 'first-steps',
      title: 'First Steps',
      description: 'Completed your first feature',
      icon: <Star className="w-4 h-4" />,
      unlockedAt: new Date()
    },
    {
      id: 'explorer',
      title: 'Explorer',
      description: 'Discovered 5 features',
      icon: <Trophy className="w-4 h-4" />,
      unlockedAt: new Date()
    }
  ];

  const achievements = recentAchievements.length > 0 ? recentAchievements : defaultAchievements;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-4xl mx-auto p-6 space-y-6"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Your Progress
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Track your journey and unlock new features
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Feature Completion */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-500" />
              Feature Discovery
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Progress</span>
                <span className="font-medium">{featuresCompleted}/{totalFeatures}</span>
              </div>
              <Progress value={completionPercentage} className="h-2" />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {Math.round(completionPercentage)}% complete
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Engagement Score */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              Engagement Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {engagementScore}
              </div>
              <div className="flex items-center gap-2">
                <Progress value={milestoneProgress} className="h-2 flex-1" />
                <span className="text-xs text-gray-500">{nextMilestone}</span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Next milestone in {nextMilestone - engagementScore} points
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Next Recommendation */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Zap className="w-5 h-5 text-purple-500" />
              Recommended Next
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recommendedNext ? (
              <div className="space-y-2">
                <h4 className="font-medium text-sm">{recommendedNext.name}</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {recommendedNext.description}
                </p>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {recommendedNext.category}
                  </Badge>
                  {recommendedNext.estimatedTime && (
                    <span className="text-xs text-gray-500">
                      ~{recommendedNext.estimatedTime} min
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                All features unlocked! 🎉
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-500" />
            Recent Achievements
          </CardTitle>
          <CardDescription>
            Your latest accomplishments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
              >
                <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-full text-yellow-600 dark:text-yellow-400">
                  {achievement.icon}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{achievement.title}</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {achievement.description}
                  </p>
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(achievement.unlockedAt).toLocaleDateString()}
                </span>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Badges Collection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-blue-500" />
            Badge Collection
          </CardTitle>
          <CardDescription>
            Earn badges by completing tours and discovering features
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 md:grid-cols-6 gap-4">
            {/* Earned Badges */}
            {badges.map((badge) => (
              <motion.div
                key={badge}
                whileHover={{ scale: 1.1 }}
                className="flex flex-col items-center gap-2"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                  <Trophy className="w-8 h-8 text-white" />
                </div>
                <span className="text-xs text-center font-medium">{badge}</span>
              </motion.div>
            ))}

            {/* Locked Badges */}
            {Array.from({ length: Math.max(0, 6 - badges.length) }).map((_, i) => (
              <div
                key={`locked-${i}`}
                className="flex flex-col items-center gap-2 opacity-50"
              >
                <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <Lock className="w-8 h-8 text-gray-400" />
                </div>
                <span className="text-xs text-center text-gray-500">???</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Feature Map */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            Feature Map
          </CardTitle>
          <CardDescription>
            Your journey through AIDEN Enterprise
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            {/* Connection lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <defs>
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.2" />
                </linearGradient>
              </defs>
            </svg>

            {/* Feature nodes */}
            <div className="grid grid-cols-3 gap-8 relative">
              {['Video Conference', 'Medical AI', 'Coding Suite', 'AR Overlay', 'Patient Context', 'Workflows'].map((feature, i) => {
                const isCompleted = i < featuresCompleted;
                const isNext = i === featuresCompleted;

                return (
                  <motion.div
                    key={feature}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className={`relative flex flex-col items-center gap-2 ${
                      isCompleted ? 'opacity-100' : 'opacity-50'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                      isCompleted
                        ? 'bg-green-500 text-white'
                        : isNext
                        ? 'bg-blue-500 text-white animate-pulse'
                        : 'bg-gray-300 dark:bg-gray-600 text-gray-500'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : (
                        <span className="text-sm font-bold">{i + 1}</span>
                      )}
                    </div>
                    <span className="text-xs text-center">{feature}</span>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}