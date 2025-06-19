import VideoPlayer from './VideoPlayer';
import TimelineProgress from './TimelineProgress';
import MapPanel from './MapPanel';
import DiagramPanel from './DiagramPanel';
import InfoOverlay from './InfoOverlay';
import ParticleBackground from './ParticleBackground';
import HotkeyHints from './HotkeyHints';
import HypothesisModules from './HypothesisModules';

export default function StoryTimeline({ chapters, currentChapter, onNavigate }) {
  return (
    <div className="relative w-full h-full min-h-screen overflow-hidden bg-gradient-to-br from-amber-900 via-black to-amber-700">
      <ParticleBackground theme="amber" />
      <div className="absolute inset-0 z-10 flex flex-col">
        {/* Timeline Progress Bar */}
        <TimelineProgress
          chapters={chapters}
          current={currentChapter}
          onNavigate={onNavigate}
        />
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col md:flex-row gap-4 p-4 md:p-8">
          <div className="flex-1 flex flex-col items-center justify-center">
            <VideoPlayer chapter={currentChapter} />
          </div>
          <div className="flex flex-col gap-4 w-full md:w-1/3">
            <MapPanel chapter={currentChapter} />
            <DiagramPanel chapter={currentChapter} />
          </div>
        </div>
        {/* Contextual Overlays and Hotkeys */}
        <InfoOverlay chapter={currentChapter} />
        <HotkeyHints />
        <HypothesisModules chapter={currentChapter} />
      </div>
    </div>
  );
}