"use client";
import { createContext, useContext, useState, ReactNode, useCallback, useMemo } from "react";

// Define the context interface for better type safety
interface CopilotContextType {
  transcripts: string[];
  addTranscript: (text: string) => void;
  clearTranscripts: () => void;
  removeTranscript: (index: number) => void;
  updateTranscript: (index: number, text: string) => void;
  getTranscriptCount: () => number;
  getLatestTranscript: () => string | null;
  searchTranscripts: (query: string) => string[];
}

// Create context with proper typing
const CopilotContext = createContext<CopilotContextType | null>(null);

// Provider component with enhanced functionality
export function CopilotProvider({ children }: { children: ReactNode }) {
  const [transcripts, setTranscripts] = useState<string[]>([]);

  // Add a new transcript
  const addTranscript = useCallback((text: string) => {
    if (text && text.trim()) {
      setTranscripts((prev) => [...prev, text.trim()]);
    }
  }, []);

  // Clear all transcripts
  const clearTranscripts = useCallback(() => {
    setTranscripts([]);
  }, []);

  // Remove a specific transcript by index
  const removeTranscript = useCallback((index: number) => {
    setTranscripts((prev) => prev.filter((_, i) => i !== index));
  }, []);

  // Update a specific transcript by index
  const updateTranscript = useCallback((index: number, text: string) => {
    if (text && text.trim()) {
      setTranscripts((prev) =>
        prev.map((transcript, i) => i === index ? text.trim() : transcript)
      );
    }
  }, []);

  // Get the total count of transcripts
  const getTranscriptCount = useCallback(() => {
    return transcripts.length;
  }, [transcripts]);

  // Get the latest transcript
  const getLatestTranscript = useCallback(() => {
    return transcripts.length > 0 ? transcripts[transcripts.length - 1] : null;
  }, [transcripts]);

  // Search transcripts for a specific query
  const searchTranscripts = useCallback((query: string) => {
    if (!query.trim()) return transcripts;
    return transcripts.filter(transcript =>
      transcript.toLowerCase().includes(query.toLowerCase())
    );
  }, [transcripts]);

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    transcripts,
    addTranscript,
    clearTranscripts,
    removeTranscript,
    updateTranscript,
    getTranscriptCount,
    getLatestTranscript,
    searchTranscripts,
  }), [
    transcripts,
    addTranscript,
    clearTranscripts,
    removeTranscript,
    updateTranscript,
    getTranscriptCount,
    getLatestTranscript,
    searchTranscripts,
  ]);

  return (
    <CopilotContext.Provider value={contextValue}>
      {children}
    </CopilotContext.Provider>
  );
}

// Custom hook with proper error handling
export const useCopilot = (): CopilotContextType => {
  const context = useContext(CopilotContext);

  if (!context) {
    throw new Error("useCopilot must be used within a CopilotProvider");
  }

  return context;
};

// Additional utility hooks for specific use cases
export const useTranscripts = () => {
  const { transcripts, addTranscript, clearTranscripts } = useCopilot();
  return { transcripts, addTranscript, clearTranscripts };
};

export const useTranscriptManagement = () => {
  const { removeTranscript, updateTranscript, getTranscriptCount } = useCopilot();
  return { removeTranscript, updateTranscript, getTranscriptCount };
};

export const useTranscriptSearch = () => {
  const { searchTranscripts, getLatestTranscript } = useCopilot();
  return { searchTranscripts, getLatestTranscript };
};


