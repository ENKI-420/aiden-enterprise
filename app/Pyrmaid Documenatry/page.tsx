'use client';

import { motion } from 'framer-motion';

export default function ImmersivePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white">
      <div className="container mx-auto px-4 py-12 space-y-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
            Pyramid Documentary
          </h1>
          <p className="text-xl text-center text-gray-300 max-w-3xl mx-auto">
            Explore the intersection of ancient wisdom and cutting-edge innovation
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="relative bg-gradient-to-br from-blue-900/20 to-purple-900/20 rounded-2xl p-8 border border-blue-500/30"
        >
          <div className="text-center">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
              Ancient Technology
            </h2>
            <p className="text-gray-300 text-lg mb-6">
              Discovering the advanced engineering of ancient civilizations
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="p-6 bg-green-900/20 rounded-lg border border-green-500/30">
            <h3 className="text-lg font-semibold text-green-300 mb-3">Engineering Marvels</h3>
            <p className="text-sm text-gray-300">
              Precision construction techniques that challenge modern understanding
            </p>
          </div>
          <div className="p-6 bg-orange-900/20 rounded-lg border border-orange-500/30">
            <h3 className="text-lg font-semibold text-orange-300 mb-3">Energy Patterns</h3>
            <p className="text-sm text-gray-300">
              Electromagnetic and acoustic properties of pyramid structures
            </p>
          </div>
          <div className="p-6 bg-purple-900/20 rounded-lg border border-purple-500/30">
            <h3 className="text-lg font-semibold text-purple-300 mb-3">Modern Applications</h3>
            <p className="text-sm text-gray-300">
              How ancient knowledge informs contemporary technology
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="text-center mt-12"
        >
          <button
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg
                     text-lg font-semibold hover:from-blue-700 hover:to-purple-700
                     transition-all duration-300 transform hover:scale-105"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            Return to Top
          </button>
        </motion.div>
      </div>
    </div>
  );
}
