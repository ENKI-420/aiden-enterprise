"use client";

import { motion } from 'framer-motion';

interface ImmersiveStatementProps {
  title?: string;
  description?: string;
  children?: React.ReactNode;
}

export default function ImmersiveStatement({
  title = "Immersive Experience",
  description = "Enter a new dimension of interaction",
  children
}: ImmersiveStatementProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="relative bg-gradient-to-br from-blue-900/20 to-purple-900/20 rounded-2xl p-8 border border-blue-500/30"
    >
      <div className="text-center">
        <motion.h2
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4"
        >
          {title}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-gray-300 text-lg mb-6"
        >
          {description}
        </motion.p>
        {children}
      </div>
    </motion.div>
  );
}
