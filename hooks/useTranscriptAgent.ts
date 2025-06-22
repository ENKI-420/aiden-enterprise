import { useEffect, useState } from 'react';

interface Transcript {
  id: string;
  text: string;
  timestamp: Date;
  speaker?: string;
}

interface TranscriptAgentOptions {
  summaryThreshold?: number;
  debounceMs?: number;
  maxTranscripts?: number;
}

export function useTranscriptAgent(
  transcripts: Transcript[],
  options: TranscriptAgentOptions = {}
) {
  const {
    summaryThreshold = 3,
    debounceMs = 2000,
    maxTranscripts = 5
  } = options;

  const [summary, setSummary] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (transcripts.length < summaryThreshold) {
      setSummary("");
      return;
    }

    const timeoutId = setTimeout(() => {
      const recent = transcripts
        .slice(-maxTranscripts)
        .map(t => `${t.speaker || 'Speaker'}: ${t.text}`)
        .join("\n");

      setIsProcessing(true);
      setError(null);

      // Only run on client side
      if (typeof window !== 'undefined') {
        window.fetch("/api/copilot", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            input: recent,
            type: 'summary',
            maxLength: 150
          }),
        })
          .then(res => {
            if (!res.ok) throw new Error('Failed to generate summary');
            return res.json();
          })
          .then(data => {
            setSummary(data.summary || "");
            setIsProcessing(false);
          })
          .catch((err) => {
            setError(err.message);
            setSummary("");
            setIsProcessing(false);
          });
      }
    }, debounceMs);

    return () => clearTimeout(timeoutId);
  }, [transcripts, summaryThreshold, debounceMs, maxTranscripts]);

  return {
    summary,
    isProcessing,
    error,
    hasEnoughData: transcripts.length >= summaryThreshold
  };
}

// Additional hook for action item extraction
export function useTranscriptActions(transcripts: Transcript[]) {
  const [actionItems, setActionItems] = useState<string[]>([]);
  const [isExtracting, setIsExtracting] = useState(false);

  useEffect(() => {
    if (transcripts.length === 0) return;

    const timeoutId = setTimeout(() => {
      const allText = transcripts
        .map(t => t.text)
        .join(" ");

      // Simple regex-based action item extraction
      const patterns = [
        /(?:we need to|I'll|we'll|will|should|must|have to|action:)\s+([^.!?]+)/gi,
        /(?:todo|task|follow up|next step)[:\s]+([^.!?]+)/gi,
        /(?:by|before|deadline|due)\s+([^.!?]+)/gi
      ];

      const items = new Set<string>();
      patterns.forEach(pattern => {
        const matches = allText.matchAll(pattern);
        for (const match of matches) {
          if (match[1] && match[1].length > 10) {
            items.add(match[1].trim());
          }
        }
      });

      setActionItems(Array.from(items).slice(0, 5));
      setIsExtracting(false);
    }, 3000);

    setIsExtracting(true);
    return () => clearTimeout(timeoutId);
  }, [transcripts]);

  return { actionItems, isExtracting };
}

// Hook for speaker analytics
export function useSpeakerAnalytics(transcripts: Transcript[]) {
  const [speakerStats, setSpeakerStats] = useState<Map<string, number>>(new Map());

  useEffect(() => {
    const stats = new Map<string, number>();

    transcripts.forEach(t => {
      const speaker = t.speaker || 'Unknown';
      const wordCount = t.text.split(/\s+/).length;
      stats.set(speaker, (stats.get(speaker) || 0) + wordCount);
    });

    setSpeakerStats(stats);
  }, [transcripts]);

  const totalWords = Array.from(speakerStats.values()).reduce((a, b) => a + b, 0);

  const speakerPercentages = new Map<string, number>();
  speakerStats.forEach((count, speaker) => {
    speakerPercentages.set(speaker, totalWords > 0 ? (count / totalWords) * 100 : 0);
  });

  return {
    speakerStats,
    speakerPercentages,
    totalWords,
    activeSpeakers: speakerStats.size
  };
}