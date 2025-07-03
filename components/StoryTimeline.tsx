"use client";

import { motion } from 'framer-motion';
import { CheckCircle, Circle } from 'lucide-react';

interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  date?: string;
}

interface StoryTimelineProps {
  events?: TimelineEvent[];
  title?: string;
}

export default function StoryTimeline({
  events = [
    { id: '1', title: 'Beginning', description: 'The story starts here', completed: true },
    { id: '2', title: 'Development', description: 'Plot unfolds', completed: true },
    { id: '3', title: 'Climax', description: 'Peak moment', completed: false },
    { id: '4', title: 'Resolution', description: 'Story concludes', completed: false },
  ],
  title = "Story Timeline"
}: StoryTimelineProps) {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-center mb-8 text-blue-300">{title}</h2>
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 to-purple-500"></div>

        {/* Timeline events */}
        <div className="space-y-8">
          {events.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2, duration: 0.5 }}
              className="relative flex items-start gap-4"
            >
              {/* Timeline marker */}
              <div className="relative z-10 flex-shrink-0">
                {event.completed ? (
                  <CheckCircle className="w-6 h-6 text-green-400 bg-slate-900 rounded-full" />
                ) : (
                  <Circle className="w-6 h-6 text-gray-400 bg-slate-900 rounded-full" />
                )}
              </div>

              {/* Event content */}
              <div className="flex-1 pb-8">
                <div className={`p-4 rounded-lg border ${event.completed
                  ? 'bg-green-900/20 border-green-500/30'
                  : 'bg-slate-800/50 border-slate-700/50'
                  }`}>
                  <h3 className="font-semibold text-white mb-2">{event.title}</h3>
                  <p className="text-gray-300 text-sm">{event.description}</p>
                  {event.date && (
                    <p className="text-xs text-gray-500 mt-2">{event.date}</p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}