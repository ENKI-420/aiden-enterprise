"use client";

import { useSpeakerAnalytics, useTranscriptActions, useTranscriptAgent } from '@/hooks/useTranscriptAgent';

interface Transcript {
  id: string;
  text: string;
  timestamp: Date;
  speaker?: string;
}

interface TranscriptInsightsProps {
  transcripts: Transcript[];
}

export default function TranscriptInsights({ transcripts }: TranscriptInsightsProps) {
  const { summary, isProcessing, hasEnoughData } = useTranscriptAgent(transcripts);
  const { actionItems, isExtracting } = useTranscriptActions(transcripts);
  const { speakerPercentages, totalWords, activeSpeakers } = useSpeakerAnalytics(transcripts);

  return (
    <div className="space-y-4">
      {/* AI Summary Section */}
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
        <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
          <span>🧠</span> AI Summary
        </h3>
        {!hasEnoughData ? (
          <p className="text-sm text-blue-700 dark:text-blue-300">
            Need at least 3 transcripts for summary...
          </p>
        ) : isProcessing ? (
          <div className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            Generating summary...
          </div>
        ) : summary ? (
          <p className="text-sm text-blue-800 dark:text-blue-200">{summary}</p>
        ) : (
          <p className="text-sm text-blue-600 dark:text-blue-400 italic">
            Summary will appear here...
          </p>
        )}
      </div>

      {/* Action Items Section */}
      {actionItems.length > 0 && (
        <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
          <h3 className="font-semibold text-amber-900 dark:text-amber-100 mb-2 flex items-center gap-2">
            <span>✅</span> Action Items
            {isExtracting && (
              <span className="text-xs text-amber-600 dark:text-amber-400">(extracting...)</span>
            )}
          </h3>
          <ul className="space-y-1">
            {actionItems.map((item, i) => (
              <li key={i} className="text-sm text-amber-800 dark:text-amber-200 flex items-start gap-2">
                <span className="text-amber-600 dark:text-amber-400">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Speaker Analytics Section */}
      {activeSpeakers > 0 && (
        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
          <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-2 flex items-center gap-2">
            <span>📊</span> Speaker Analytics
          </h3>
          <div className="space-y-2">
            <div className="text-xs text-purple-700 dark:text-purple-300">
              {activeSpeakers} speakers • {totalWords} total words
            </div>
            {Array.from(speakerPercentages.entries()).map(([speaker, percentage]) => (
              <div key={speaker} className="flex items-center gap-2">
                <span className="text-sm text-purple-800 dark:text-purple-200 w-20 truncate">
                  {speaker}:
                </span>
                <div className="flex-1 bg-purple-200 dark:bg-purple-700 rounded-full h-2">
                  <div
                    className="bg-purple-600 dark:bg-purple-400 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-xs text-purple-600 dark:text-purple-400 w-12 text-right">
                  {percentage.toFixed(0)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}