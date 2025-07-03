// Project Spectra Chapters Data

export interface Chapter {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  duration?: string;
  category: 'theory' | 'experiment' | 'analysis' | 'conclusion';
}

export const projectSpectraChapters: Chapter[] = [
  {
    id: 'chapter-1',
    title: 'Introduction to Paleo-Physics',
    description: 'Exploring the fundamental principles of ancient energy systems and their modern applications',
    completed: true,
    duration: '15 min',
    category: 'theory'
  },
  {
    id: 'chapter-2',
    title: 'Pyramid Energy Research',
    description: 'Investigating the unique properties of pyramid structures and their interaction with electromagnetic fields',
    completed: true,
    duration: '25 min',
    category: 'experiment'
  },
  {
    id: 'chapter-3',
    title: 'Acoustic Resonance Analysis',
    description: 'Analysis of sound wave patterns and resonance frequencies within geometric structures',
    completed: false,
    duration: '20 min',
    category: 'analysis'
  },
  {
    id: 'chapter-4',
    title: 'Quantum Field Interactions',
    description: 'Understanding the quantum mechanical aspects of geometric energy systems',
    completed: false,
    duration: '30 min',
    category: 'theory'
  },
  {
    id: 'chapter-5',
    title: 'Materials Science Applications',
    description: 'Practical applications in modern materials science and engineering',
    completed: false,
    duration: '22 min',
    category: 'experiment'
  },
  {
    id: 'chapter-6',
    title: 'Conclusions and Future Research',
    description: 'Summary of findings and directions for future investigation',
    completed: false,
    duration: '18 min',
    category: 'conclusion'
  }
];

export const getChaptersByCategory = (category: Chapter['category']): Chapter[] => {
  return projectSpectraChapters.filter(chapter => chapter.category === category);
};

export const getCompletedChapters = (): Chapter[] => {
  return projectSpectraChapters.filter(chapter => chapter.completed);
};

export const getChapterProgress = (): number => {
  const completed = getCompletedChapters().length;
  const total = projectSpectraChapters.length;
  return Math.round((completed / total) * 100);
};