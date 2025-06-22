"use client";

import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useRef, useState } from "react";

interface TourStep {
  id: string;
  title: string;
  description: string;
  selector?: string;
}

interface TourGuideContextType {
  startTour: () => void;
  skipTour: () => void;
  currentStep: TourStep | null;
  completeTour: () => void;
}

const TourGuideContext = createContext<TourGuideContextType | null>(null);
export const useTourGuide = () => {
  const ctx = useContext(TourGuideContext);
  if (!ctx) throw new Error("useTourGuide must be in provider");
  return ctx;
};

const TOUR_STEPS: TourStep[] = [
  {
    id: "hero",
    title: "Multi-Model AI Platform",
    description: "Explore how our generative agents orchestrate industry-specific workflows. Scroll to continue.",
    selector: "#hero"
  },
  {
    id: "industry-demo",
    title: "Industry-Tailored Capabilities",
    description: "We detect your sector and showcase relevant AI demos, from healthcare to defense.",
    selector: "#industry-section"
  },
  {
    id: "investor",
    title: "Investor Spotlight",
    description: "Discover the HealthLink AI opportunity revolutionizing healthcare data.",
    selector: "#investor-spotlight"
  }
];

export default function TourGuideProvider({ children }: { children: React.ReactNode }) {
  const [active, setActive] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const recognitionRef = useRef<any>(null);
  const router = useRouter();

  useEffect(() => {
    const tourSeen = localStorage.getItem("landingTourSeen");
    if (!tourSeen) {
      setActive(true);
      speakStep(0);
    }
  }, []);

  const speak = (text: string) => {
    if (!voiceEnabled) return;
    if (!synthRef.current && typeof window !== "undefined" && "speechSynthesis" in window) {
      synthRef.current = window.speechSynthesis;
    }
    const utt = new SpeechSynthesisUtterance(text);
    synthRef.current?.speak(utt);
  };

  const enableVoice = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SR) {
        recognitionRef.current = new SR();
        recognitionRef.current.onresult = (e: any) => {
          const cmd = e.results[0][0].transcript.toLowerCase();
          if (cmd.includes("next")) next();
          if (cmd.includes("skip")) skipTour();
        };
        recognitionRef.current.start();
        setVoiceEnabled(true);
      }
    } catch {}
  };

  const speakStep = (index: number) => {
    if (!voiceEnabled) return;
    const step = TOUR_STEPS[index];
    speak(step.title + ". " + step.description);
  };

  const next = () => {
    if (currentIndex < TOUR_STEPS.length - 1) {
      setCurrentIndex(i => i + 1);
      speakStep(currentIndex + 1);
    } else {
      completeTour();
    }
  };

  const skipTour = () => {
    setActive(false);
    localStorage.setItem("landingTourSeen", "1");
    localStorage.setItem("tourCompletedAt", new Date().toISOString());
  };

  const completeTour = () => {
    skipTour();
    router.push("/login");
  };

  useEffect(() => {
    const onScroll = () => {
      if (!active) return;
      const step = TOUR_STEPS[currentIndex];
      if (step.selector) {
        const el = document.querySelector(step.selector);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top < window.innerHeight * 0.6) {
            next();
          }
        }
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [active, currentIndex]);

  return (
    <TourGuideContext.Provider value={{ startTour: () => setActive(true), skipTour, currentStep: active ? TOUR_STEPS[currentIndex] : null, completeTour }}>
      {children}
      {active && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
          <div className="bg-gray-900/90 backdrop-blur-lg rounded-xl px-6 py-4 text-center text-white shadow-lg max-w-md mx-auto">
            <h4 className="text-lg font-bold mb-2">{TOUR_STEPS[currentIndex].title}</h4>
            <p className="text-sm mb-4">{TOUR_STEPS[currentIndex].description}</p>
            <div className="flex justify-center gap-3">
              <button className="px-4 py-1 rounded bg-blue-600 hover:bg-blue-700" aria-label="Next step" onClick={next}>Next</button>
              <button className="px-4 py-1 rounded bg-gray-700 hover:bg-gray-600" aria-label="Skip tour" onClick={skipTour}>Skip</button>
              {!voiceEnabled && <button className="px-4 py-1 rounded bg-purple-600" onClick={enableVoice} aria-label="Enable voice">🎙️ Voice</button>}
            </div>
          </div>
        </div>
      )}
    </TourGuideContext.Provider>
  );
}