'use client';

import { useState } from 'react';
import StoryTimeline from '@/components/StoryTimeline';
import { projectSpectraChapters } from '@/components/project-spectra-chapters';

export default function ImmersivePage() {
  const [currentChapter, setCurrentChapter] = useState(0);

  return (
    <div className='w-full h-screen flex items-center justify-center bg-black'>
      <div className='w-full h-full'>
        <StoryTimeline
          chapters={projectSpectraChapters}
          currentChapter={currentChapter}
          onNavigate={setCurrentChapter}
        />
      </div>
    </div>
  );
}
