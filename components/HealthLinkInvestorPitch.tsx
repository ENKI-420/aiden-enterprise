"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useState } from "react";

export default function HealthLinkInvestorPitch() {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative bg-gradient-to-br from-purple-600/20 to-blue-600/10 rounded-3xl p-8 backdrop-blur-lg border border-purple-500/30 shadow-2xl overflow-hidden"
    >
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
          Project HealthLink AI
        </h2>
        <p className="mt-4 text-lg text-gray-200">
          Transforming fragmented patient data silos into a viral, AI-powered health platform.
        </p>

        <motion.div
          initial={false}
          animate={{ height: expanded ? "auto" : 0 }}
          className="overflow-hidden mt-6 text-left"
        >
          <ul className="space-y-4 text-sm text-gray-100">
            <li>
              <strong>Market Void:</strong> Interoperability crisis locking critical health data in silos.
            </li>
            <li>
              <strong>Solution:</strong> Secure personal health cloud + AI assistant + automation bots.
            </li>
            <li>
              <strong>Why Now:</strong> Regulatory tailwinds (Cures Act) + matured AI models + unmet demand.
            </li>
            <li>
              <strong>Monetization:</strong> Freemium SaaS, B2B API, marketplace revenue share, data exchange.
            </li>
            <li>
              <strong>Go-to-Market:</strong> Partner with employer plans & provider networks; viral patient adoption via AI insights.
            </li>
          </ul>
        </motion.div>

        <Button
          onClick={() => setExpanded(!expanded)}
          className="mt-6 bg-purple-600 hover:bg-purple-700"
          aria-expanded={expanded}
        >
          {expanded ? "Hide Details" : "See Details"}
        </Button>
      </div>

      {/* Decorative blobs */}
      <div className="absolute -top-16 -left-16 w-80 h-80 bg-purple-700 rounded-full opacity-20 blur-3xl" />
      <div className="absolute -bottom-16 -right-16 w-80 h-80 bg-blue-700 rounded-full opacity-20 blur-3xl" />
    </motion.section>
  );
}