"use client";

import { useEngagement } from '@/components/EngagementProvider';
import ProgressDashboard from '@/components/ProgressDashboard';

export default function ProgressPage() {
  const { getProgress } = useEngagement();
  const progress = getProgress();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      <ProgressDashboard
        featuresCompleted={progress.featuresCompleted}
        totalFeatures={progress.totalFeatures}
        engagementScore={progress.engagementScore}
        nextMilestone={progress.nextMilestone}
        recommendedNext={progress.recommendedNext}
        badges={['Basic Explorer', 'First Steps']}
      />
    </div>
  );
}