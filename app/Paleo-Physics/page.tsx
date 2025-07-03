'use client';

import { motion } from 'framer-motion';

export default function ImmersivePage() {
  return (
    <div className='w-full h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-black'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-4xl mx-auto px-6"
      >
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Paleo-Physics Research
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          Exploring the intersection of ancient knowledge and modern physics
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-blue-900/20 rounded-lg border border-blue-500/30">
            <h3 className="text-lg font-semibold text-blue-300 mb-3">Quantum Archaeology</h3>
            <p className="text-sm text-gray-300">
              Investigating ancient structures through the lens of quantum mechanics
            </p>
          </div>
          <div className="p-6 bg-purple-900/20 rounded-lg border border-purple-500/30">
            <h3 className="text-lg font-semibold text-purple-300 mb-3">Energy Systems</h3>
            <p className="text-sm text-gray-300">
              Understanding energy patterns in historical civilizations
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
