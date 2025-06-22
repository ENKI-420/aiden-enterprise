"use client";
import { useCopilot } from "@/components/copilot-context";
import { useEffect, useState } from "react";

interface Room {
  id: string;
  name?: string;
  participants?: string[];
}

interface RawTranscript {
  text?: string;
  timestamp?: string | number | Date;
  speaker?: string;
}

interface Transcript {
  id: string;
  text: string;
  timestamp: Date;
  speaker?: string;
}

interface CopilotSidebarProps {
  room?: Room;
}

export function CopilotSidebar({ room }: CopilotSidebarProps) {
  const { transcripts } = useCopilot();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aiSummary, setAiSummary] = useState<string>("");

  // Enhanced transcript processing with better error handling and timestamp preservation
  const processedTranscripts = transcripts?.map((t: string | RawTranscript, i: number) => ({
    id: `transcript-${i}`,
    text: typeof t === 'string'
      ? t
      : typeof t?.text === 'string'
        ? t.text
        : '[Unrecognized transcript format]',
    timestamp: typeof t !== 'string' && t?.timestamp ? new Date(t.timestamp) : new Date(),
    speaker: typeof t !== 'string' && t?.speaker
      ? t.speaker
      : room?.participants?.[i % (room.participants?.length || 1)] || `Speaker ${(i % 5) + 1}`
  })) || [];

  useEffect(() => {
    if (transcripts?.length) {
      setIsLoading(false);
      setError(null);
    }
  }, [transcripts]);

  // Auto-generate AI summary when transcripts update
  useEffect(() => {
    if (processedTranscripts.length > 3 && typeof window !== 'undefined') {
      const recentTranscripts = processedTranscripts
        .slice(-5)
        .map(t => `${t.speaker}: ${t.text}`)
        .join("\n");

      window.fetch("/api/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: recentTranscripts }),
      })
        .then(res => res.json())
        .then(data => setAiSummary(data.summary || ""))
        .catch(() => setAiSummary("Processing..."));
    }
  }, [processedTranscripts]);

  if (error) {
    return (
      <div className="p-4 h-full overflow-y-auto">
        <div className="text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
          <h3 className="font-semibold mb-1">Error</h3>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 h-full overflow-y-auto bg-white">
      <div className="sticky top-0 bg-white pb-4 border-b border-gray-200">
        <h2 className="text-lg font-bold mb-2 flex items-center gap-2">
          <span className="text-2xl">🧠</span>
          AI Copilot
        </h2>
        <div className="text-sm text-gray-600 mb-2">
          Live meeting analysis, summaries, transcripts, Q&A.
        </div>
        {room && (
          <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
            Room: {room.name || room.id}
            {room.participants && (
              <span className="ml-2">• {room.participants.length} participants</span>
            )}
          </div>
        )}

        {/* AI Summary Placeholder */}
        {aiSummary && processedTranscripts.length > 0 && (
          <div className="mt-3 p-2 bg-blue-50 border border-blue-100 rounded text-xs text-blue-900">
            <div className="font-semibold mb-1">AI Summary:</div>
            <div className="text-blue-800">{aiSummary}</div>
          </div>
        )}
      </div>

      <div className="mt-4 space-y-3">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-sm text-gray-600">Processing...</span>
          </div>
        ) : processedTranscripts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">🎤</div>
            <p className="text-sm">No transcripts available yet</p>
            <p className="text-xs mt-1">Start speaking to see live analysis</p>
          </div>
        ) : (
          processedTranscripts.map((transcript: Transcript) => (
            <div
              key={transcript.id}
              className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-start justify-between mb-1">
                <span className="text-xs font-medium text-gray-600">
                  {transcript.speaker}
                </span>
                <span className="text-xs text-gray-400">
                  {transcript.timestamp.toLocaleTimeString()}
                </span>
              </div>
              <p className="text-sm text-gray-800 leading-relaxed">
                {transcript.text}
              </p>
            </div>
          ))
        )}
      </div>

      {processedTranscripts.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="text-xs text-gray-500 text-center">
            {processedTranscripts.length} transcript{processedTranscripts.length !== 1 ? 's' : ''} processed
          </div>
          <div className="text-[10px] text-gray-400 text-center mt-1">
            Press [C] to toggle Copilot panel
          </div>
        </div>
      )}

      {/* Debug Mode for Development */}
      {process.env.NODE_ENV === 'development' && transcripts?.length > 0 && (
        <details className="mt-4">
          <summary className="text-xs text-gray-500 cursor-pointer">Debug Info</summary>
          <pre className="text-xs text-gray-400 overflow-auto max-h-40 mt-2 bg-gray-50 p-2 rounded">
            {JSON.stringify(transcripts, null, 2)}
          </pre>
        </details>
      )}
    </div>
  );
}
