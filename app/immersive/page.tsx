'use client';

import React from 'react';
import ImmersiveStatement from '@/components/immersive-statement';
import EnergySystem from '@/components/energy-system';
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
            The Future of Technology
          </h1>
          <p className="text-xl text-center text-gray-300 max-w-3xl mx-auto">
            Explore the intersection of ancient wisdom and cutting-edge innovation
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <ImmersiveStatement />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <EnergySystem />
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
