'use client';

import { projectSpectraChapters } from '@/components/project-spectra-chapters';
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
    <div className="relative group overflow-hidden rounded-xl bg-black/50 backdrop-blur-sm border border-amber-500/20">
      <video
        ref={videoRef}
        className="w-full h-[400px] object-cover"
        onTimeUpdate={(e) => onTimeUpdate(e.currentTarget.currentTime)}
        controls
        poster="/pyramid-poster.jpg"
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
        <h3 className="text-xl font-bold text-amber-100 drop-shadow-lg">
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
    <div className="w-full bg-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-amber-500/20">
      <h2 className="text-lg font-semibold text-amber-200 mb-4 flex items-center gap-2">
        <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></span>
        Documentary Timeline
      </h2>

      <div className="relative">
        {/* Progress Line */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-amber-500/30"></div>
        <div
          className="absolute left-4 top-0 w-0.5 bg-gradient-to-b from-amber-400 to-amber-600 transition-all duration-1000 ease-out"
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
                  ? 'bg-amber-500/20 border border-amber-400/50 shadow-lg shadow-amber-500/20'
                  : index < currentChapter
                  ? 'bg-slate-800/50 border border-slate-600/50'
                  : 'bg-slate-900/30 border border-slate-700/30 hover:bg-slate-800/40'
              }`}
              aria-pressed={index === currentChapter}
              tabIndex={0}
            >
              {/* Chapter Indicator */}
              <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                index === currentChapter
                  ? 'bg-amber-400 text-black animate-pulse'
                  : index < currentChapter
                  ? 'bg-amber-600 text-white'
                  : 'bg-slate-700 text-slate-400'
              }`}>
                {index + 1}
              </div>

              {/* Chapter Info */}
              <div className="flex-1 min-w-0">
                <h3 className={`font-semibold transition-colors duration-300 ${
                  index === currentChapter ? 'text-amber-100' : 'text-slate-300'
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
    <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-amber-500/20">
      <h2 className="text-lg font-semibold text-amber-200 mb-4 flex items-center gap-2">
        <span className="w-2 h-2 bg-amber-400 rounded-full"></span>
        Location: {location}
      </h2>

      <div className="relative h-64 bg-slate-800/50 rounded-lg overflow-hidden border border-slate-700/50">
        {/* Placeholder for interactive map */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-900/20 to-slate-900/50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-amber-500/20 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <p className="text-amber-200 font-medium">{location}</p>
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
    <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-amber-500/20">
      <h2 className="text-lg font-semibold text-amber-200 mb-4 flex items-center gap-2">
        <span className="w-2 h-2 bg-amber-400 rounded-full"></span>
        Technical Diagram
      </h2>

      <div className="relative h-64 bg-slate-800/50 rounded-lg overflow-hidden border border-slate-700/50">
        {/* Placeholder for 3D diagram */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-slate-900/50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-blue-500/20 rounded-full flex items-center justify-center animate-spin-slow">
              <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 7.172V5L8 4z" />
              </svg>
            </div>
            <p className="text-blue-200 font-medium">{diagram}</p>
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
    <div className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-sm rounded-xl p-6 border border-amber-500/30 shadow-2xl shadow-amber-500/10">
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-amber-200 mb-2 flex items-center gap-2">
            <span className="w-3 h-3 bg-amber-400 rounded-full animate-pulse"></span>
            Current Insight
          </h2>
          <p className="text-slate-200 leading-relaxed">
            {chapter.insight}
          </p>
        </div>

        <div className="border-t border-amber-500/20 pt-4">
          <h3 className="text-lg font-semibold text-amber-300 mb-2 flex items-center gap-2">
            <span className="text-amber-400">?</span>
            Research Hypothesis
          </h3>
          <p className="text-slate-300 leading-relaxed italic">
            {chapter.hypothesis}
          </p>
        </div>
      </div>
    </div>
  );
};

// Particle Background Effect
const ParticleBackground = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950/20"></div>
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-amber-400/30 rounded-full animate-float"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 10}s`,
            animationDuration: `${15 + Math.random() * 10}s`,
          }}
        />
      ))}
    </div>
  );
};

// Hotkey Hints
const HotkeyHints = () => {
  return (
    <div className="fixed bottom-6 right-6 bg-slate-900/80 backdrop-blur-sm rounded-lg p-4 border border-amber-500/20">
      <div className="text-xs text-slate-400 space-y-1">
        <div className="flex items-center gap-2">
          <kbd className="px-2 py-1 bg-slate-800 rounded text-amber-300">←</kbd>
          <span>Previous Chapter</span>
        </div>
        <div className="flex items-center gap-2">
          <kbd className="px-2 py-1 bg-slate-800 rounded text-amber-300">→</kbd>
          <span>Next Chapter</span>
        </div>
        <div className="flex items-center gap-2">
          <kbd className="px-2 py-1 bg-slate-800 rounded text-amber-300">Space</kbd>
          <span>Play/Pause</span>
        </div>
      </div>
    </div>
  );
};

// Main Project Spectra Documentary Component
export default function ProjectSpectraDocumentary() {
  const [currentChapter, setCurrentChapter] = useState(0);
  const [videoTime, setVideoTime] = useState(0);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          if (currentChapter > 0) {
            setCurrentChapter(currentChapter - 1);
          }
          break;
        case 'ArrowRight':
          if (currentChapter < projectSpectraChapters.length - 1) {
            setCurrentChapter(currentChapter + 1);
          }
          break;
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', handleKeyPress);
      return () => window.removeEventListener('keydown', handleKeyPress);
    }
  }, [currentChapter]);

  const currentChapterData = projectSpectraChapters[currentChapter];

  return (
    <div className="min-h-screen bg-slate-950 text-white relative overflow-hidden">
      <ParticleBackground />

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 bg-clip-text text-transparent mb-4">
            Project Spectra
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            An immersive exploration of the weapons hypothesis and advanced ancient technologies
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Video and Info */}
          <div className="lg:col-span-2 space-y-6">
            <VideoPlayer
              src={currentChapterData.video}
              title={currentChapterData.title}
              onTimeUpdate={setVideoTime}
              currentTime={videoTime}
            />

            <InfoOverlay chapter={currentChapterData} />
          </div>

          {/* Right Column - Controls and Data */}
          <div className="space-y-6">
            <TimelineProgress
              chapters={projectSpectraChapters}
              currentChapter={currentChapter}
              onChapterSelect={setCurrentChapter}
            />
          </div>
        </div>

        {/* Bottom Row - Map and Diagram */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <MapPanel location={currentChapterData.location} />
          <DiagramPanel diagram={currentChapterData.diagram} />
        </div>
      </div>

      {/* Hotkey Hints */}
      <HotkeyHints />
    </div>
  );
}
