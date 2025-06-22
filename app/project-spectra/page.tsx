'use client';

import AdvancedAIAssistant from '@/components/AdvancedAIAssistant';
import { projectSpectraChapters } from '@/components/project-spectra-chapters';
import Pyramid3DVisualization from '@/components/Pyramid3DVisualization';
import PyramidMaterialsAnalysis from '@/components/PyramidMaterialsAnalysis';
import PyramidPhysicsSimulation from '@/components/PyramidPhysicsSimulation';
import SimpleWelcome from '@/components/SimpleWelcome';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

// Enhanced Video Player Component
const VideoPlayer = ({ src, title, onTimeUpdate, currentTime }: {
  src: string;
  title: string;
  onTimeUpdate: (time: number) => void;
  currentTime: number;
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && Math.abs(videoRef.current.currentTime - currentTime) > 1) {
      videoRef.current.currentTime = currentTime;
    }
  }, [currentTime]);

  return (
    <div className="relative group overflow-hidden rounded-xl bg-black/50 backdrop-blur-sm border border-primary/20">
      <video
        ref={videoRef}
        className="w-full h-[400px] object-cover"
        onTimeUpdate={(e) => onTimeUpdate(e.currentTarget.currentTime)}
        controls
        poster="/pyramid-poster.svg"
        aria-label={`Video: ${title}`}
      >
        <source src={src} type="video/mp4" />
        <track kind="captions" src="/captions/en.vtt" srcLang="en" label="English" />
        Your browser does not support the video tag.
      </video>

      {/* Cinematic Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />

      {/* Title Overlay */}
      <div className="absolute bottom-4 left-4 right-4">
        <h3 className="text-xl font-bold text-primary-100 drop-shadow-lg">
          {title}
        </h3>
      </div>
    </div>
  );
};

// Timeline Progress Component
const TimelineProgress = ({ chapters, currentChapter, onChapterSelect }: {
  chapters: typeof projectSpectraChapters;
  currentChapter: number;
  onChapterSelect: (index: number) => void;
}) => {
  return (
    <div className="w-full bg-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-primary/20">
      <h2 className="text-lg font-semibold text-primary-200 mb-4 flex items-center gap-2">
        <span className="w-2 h-2 bg-primary-400 rounded-full animate-pulse"></span>
        Documentary Timeline
      </h2>

      <div className="relative">
        {/* Progress Line */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-primary-500/30"></div>
        <div
          className="absolute left-4 top-0 w-0.5 bg-gradient-to-b from-primary-400 to-secondary-600 transition-all duration-1000 ease-out"
          style={{ height: `${((currentChapter + 1) / chapters.length) * 100}%` }}
        ></div>

        {/* Chapter Points */}
        <div className="space-y-4">
          {chapters.map((chapter, index) => (
            <button
              key={chapter.id}
              onClick={() => onChapterSelect(index)}
              className={`flex items-start gap-4 w-full text-left p-3 rounded-lg transition-all duration-300 ${
                index === currentChapter
                  ? 'bg-primary-500/20 border border-primary-400/50 shadow-lg shadow-primary-500/20'
                  : index < currentChapter
                  ? 'bg-slate-800/50 border border-slate-600/50'
                  : 'bg-slate-900/30 border border-slate-700/30 hover:bg-slate-800/40'
              }`}
              aria-current={index === currentChapter ? 'true' : 'false'}
              tabIndex={0}
            >
              {/* Chapter Indicator */}
              <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                index === currentChapter
                  ? 'bg-primary-400 text-black animate-pulse'
                  : index < currentChapter
                  ? 'bg-secondary-600 text-white'
                  : 'bg-slate-700 text-slate-400'
              }`}>
                {index + 1}
              </div>

              {/* Chapter Info */}
              <div className="flex-1 min-w-0">
                <h3 className={`font-semibold transition-colors duration-300 ${
                  index === currentChapter ? 'text-primary-100' : 'text-slate-300'
                }`}>
                  {chapter.title}
                </h3>
                <p className="text-sm text-slate-400 mt-1 line-clamp-2">
                  {chapter.insight}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// Interactive Map Panel
const MapPanel = ({ location }: { location: string }) => {
  return (
    <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-primary/20">
      <h2 className="text-lg font-semibold text-primary-200 mb-4 flex items-center gap-2">
        <span className="w-2 h-2 bg-primary-400 rounded-full"></span>
        Location: {location}
      </h2>

      <div className="relative h-64 bg-slate-800/50 rounded-lg overflow-hidden border border-slate-700/50">
        {/* Placeholder for interactive map */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/20 to-slate-900/50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-primary-500/20 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <p className="text-primary-200 font-medium">{location}</p>
            <p className="text-slate-400 text-sm mt-1">Interactive map loading...</p>
          </div>
        </div>

        {/* Map overlay effects */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none"></div>
      </div>
    </div>
  );
};

// Technical Diagram Panel
const DiagramPanel = ({ diagram }: { diagram: string }) => {
  return (
    <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-primary/20">
      <h2 className="text-lg font-semibold text-primary-200 mb-4 flex items-center gap-2">
        <span className="w-2 h-2 bg-primary-400 rounded-full"></span>
        Technical Diagram
      </h2>

      <div className="relative h-64 bg-slate-800/50 rounded-lg overflow-hidden border border-slate-700/50">
        {/* Placeholder for 3D diagram */}
        <div className="absolute inset-0 bg-gradient-to-br from-secondary-900/20 to-slate-900/50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-secondary-500/20 rounded-full flex items-center justify-center animate-spin-slow">
              <svg className="w-8 h-8 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 7.172V5L8 4z" />
              </svg>
            </div>
            <p className="text-secondary-200 font-medium">{diagram}</p>
            <p className="text-slate-400 text-sm mt-1">3D visualization loading...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Hypothesis Information Overlay
const InfoOverlay = ({ chapter }: { chapter: typeof projectSpectraChapters[0] }) => {
  return (
    <div className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-sm rounded-xl p-6 border border-primary/30 shadow-2xl shadow-primary/10">
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-primary-200 mb-2 flex items-center gap-2">
            <span className="w-3 h-3 bg-primary-400 rounded-full animate-pulse"></span>
            Current Insight
          </h2>
          <p className="text-slate-200 leading-relaxed">
            {chapter.insight}
          </p>
        </div>

        <div className="border-t border-primary/20 pt-4">
          <h3 className="text-lg font-semibold text-primary-300 mb-2 flex items-center gap-2">
            <span className="text-primary-400">?</span>
            Research Hypothesis
          </h3>
          <p className="text-slate-300 leading-relaxed italic">
            {chapter.hypothesis}
          </p>
        </div>

        <div className="border-t border-primary/20 pt-4">
          <h3 className="text-lg font-semibold text-secondary-300 mb-2 flex items-center gap-2">
            <span className="text-secondary-400">🔬</span>
            Scientific Evidence
          </h3>
          <p className="text-slate-300 leading-relaxed">
            {chapter.evidence}
          </p>
        </div>
      </div>
    </div>
  );
};

// Particle Background Component
const ParticleBackground = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />

      {/* Animated particles */}
      <div className="absolute inset-0">
        {Array.from({ length: 50 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary/30 rounded-full"
            animate={{
              x: [0, Math.random() * window.innerWidth],
              y: [0, Math.random() * window.innerHeight],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              left: Math.random() * 100 + "%",
              top: Math.random() * 100 + "%",
            }}
          />
        ))}
      </div>

      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(14,165,233,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(14,165,233,0.1)_1px,transparent_1px)] bg-[size:20px_20px] opacity-20" />
    </div>
  );
};

// Hotkey Hints Component
const HotkeyHints = () => {
  return (
    <div className="fixed bottom-4 left-4 z-40">
      <div className="bg-slate-900/80 backdrop-blur-sm rounded-lg p-3 border border-primary/20">
        <div className="text-xs text-slate-400 space-y-1">
          <div className="flex items-center gap-2">
            <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-xs">←</kbd>
            <span>Previous Chapter</span>
          </div>
          <div className="flex items-center gap-2">
            <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-xs">→</kbd>
            <span>Next Chapter</span>
          </div>
          <div className="flex items-center gap-2">
            <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-xs">Space</kbd>
            <span>Play/Pause</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function ProjectSpectraDocumentary() {
  const [currentTab, setCurrentTab] = useState('documentary');
  const [currentChapter, setCurrentChapter] = useState(0);
  const [videoTime, setVideoTime] = useState(0);
  const [showWelcome, setShowWelcome] = useState(false);
  const [welcomeCompleted, setWelcomeCompleted] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);

  // Check if welcome has been completed
  useEffect(() => {
    const hasCompleted = localStorage.getItem('simpleWelcomeCompleted');
    if (!hasCompleted) {
      setShowWelcome(true);
    } else {
      setWelcomeCompleted(true);
    }
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          setCurrentChapter(prev => Math.max(0, prev - 1));
          break;
        case 'ArrowRight':
          e.preventDefault();
          setCurrentChapter(prev => Math.min(projectSpectraChapters.length - 1, prev + 1));
          break;
        case ' ':
          e.preventDefault();
          // Toggle video play/pause
          const video = document.querySelector('video');
          if (video) {
            if (video.paused) video.play();
            else video.pause();
          }
          break;
        case 'a':
        case 'A':
          e.preventDefault();
          setShowAIAssistant(prev => !prev);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const handleWelcomeComplete = () => {
    setShowWelcome(false);
    setWelcomeCompleted(true);
  };

  const handleWelcomeDismiss = () => {
    setShowWelcome(false);
    setWelcomeCompleted(true);
  };

  const currentChapterData = projectSpectraChapters[currentChapter];

  return (
    <div className="min-h-screen bg-slate-950 text-white relative overflow-x-hidden">
      <ParticleBackground />

      {/* Header */}
      <header className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Project Spectra
              </h1>
              <p className="text-slate-400 mt-1">
                Ancient Technology Research - Powered by Aiden Engine
              </p>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowAIAssistant(prev => !prev)}
                className="px-4 py-2 bg-gradient-to-r from-primary to-secondary rounded-lg hover:from-primary/90 hover:to-secondary/90 transition-all duration-300 flex items-center gap-2"
              >
                <span className="text-lg">🤖</span>
                AI Assistant
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Tab Navigation */}
          <div className="flex flex-wrap gap-2 mb-8">
            {[
              { id: 'documentary', label: 'Documentary', icon: '🎬' },
              { id: 'visualization', label: '3D Visualization', icon: '🔮' },
              { id: 'physics', label: 'Physics Simulation', icon: '⚡' },
              { id: 'materials', label: 'Materials Analysis', icon: '🔬' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id)}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
                  currentTab === tab.id
                    ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg'
                    : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50'
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            {currentTab === 'documentary' && (
              <motion.div
                key="documentary"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-8"
              >
                {/* Video Player */}
                <div className="lg:col-span-2">
                  <VideoPlayer
                    src={currentChapterData.videoUrl}
                    title={currentChapterData.title}
                    onTimeUpdate={setVideoTime}
                    currentTime={videoTime}
                  />
                </div>

                {/* Timeline */}
                <div>
                  <TimelineProgress
                    chapters={projectSpectraChapters}
                    currentChapter={currentChapter}
                    onChapterSelect={setCurrentChapter}
                  />
                </div>

                {/* Info Overlay */}
                <div className="lg:col-span-2">
                  <InfoOverlay chapter={currentChapterData} />
                </div>

                {/* Map Panel */}
                <div>
                  <MapPanel location={currentChapterData.location} />
                </div>

                {/* Diagram Panel */}
                <div>
                  <DiagramPanel diagram={currentChapterData.diagram} />
                </div>
              </motion.div>
            )}

            {currentTab === 'visualization' && (
              <motion.div
                key="visualization"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Pyramid3DVisualization />
              </motion.div>
            )}

            {currentTab === 'physics' && (
              <motion.div
                key="physics"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <PyramidPhysicsSimulation />
              </motion.div>
            )}

            {currentTab === 'materials' && (
              <motion.div
                key="materials"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <PyramidMaterialsAnalysis />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* AI Assistant */}
      <AdvancedAIAssistant
        isOpen={showAIAssistant}
        onToggle={() => setShowAIAssistant(prev => !prev)}
        userRole="researcher"
        context={{
          currentTab,
          currentChapter,
          chapterData: currentChapterData
        }}
      />

      {/* Welcome System */}
      {showWelcome && (
        <SimpleWelcome
          onComplete={handleWelcomeComplete}
          userRole="researcher"
        />
      )}

      {/* Hotkey Hints */}
      <HotkeyHints />
    </div>
  );
}
