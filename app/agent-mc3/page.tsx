'use client';
// Temporarily disabled for deployment
// import AICopilotSidebar from '@/components/AICopilotSidebar';
// import LiveDataPanel from '@/components/LiveDataPanel';
// import WhiteboardPanel from '@/components/WhiteboardPanel';
import { useState } from 'react';

export default function AgentMC3Page() {
  const [whiteboardOpen, setWhiteboardOpen] = useState(false);
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-blue-950 text-white flex flex-col">
      {/* Hero Section */}
      <section className="w-full py-16 px-4 bg-gradient-to-r from-blue-900 via-gray-900 to-indigo-900 text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-4 bg-gradient-to-r from-yellow-400 via-blue-400 to-pink-400 bg-clip-text text-transparent">AGENT mc3: Multi-Modal, Multi-Model AI Collaboration</h1>
        <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-blue-200">Enterprise-Grade AI Conferencing & Decision Support</h2>
        <p className="max-w-2xl mx-auto text-lg md:text-xl mb-8 text-gray-200">Seamlessly orchestrate real-time collaboration, dynamic decision-making, and advanced problem-solving with AI agents, multi-modal input, and live data streaming.</p>
        <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-4">
          <a href="#demo" className="px-8 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 font-bold text-lg shadow-lg transition">Try Live AI Demo</a>
          <a href="#use-cases" className="px-8 py-3 rounded-lg bg-gradient-to-r from-yellow-400 to-pink-500 font-bold text-lg shadow-lg transition">Explore Use Cases</a>
        </div>
        <span className="text-xs text-gray-400">HIPAA, FISMA, GDPR Compliant | Quantum Fractal Core Engine | Groq AI Integration</span>
      </section>

      {/* Use Cases */}
      <section id="use-cases" className="py-16 px-4 max-w-6xl mx-auto">
        <h3 className="text-3xl font-bold mb-8 text-center">Enterprise Use Cases</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <UseCaseCard title="Healthcare" desc="AI-assisted clinical decision-making, genomics, and medical research." icon="🧬" />
          <UseCaseCard title="Engineering" desc="Product development, design analysis, and automated prototyping." icon="🛠️" />
          <UseCaseCard title="Cybersecurity" desc="Real-time incident response, penetration testing, and threat mitigation." icon="🛡️" />
          <UseCaseCard title="Legal" desc="Contract review, dispute resolution, and document generation." icon="⚖️" />
        </div>
      </section>

      {/* Live AI Demo Panel */}
      <section id="demo" className="py-16 px-4 max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
        {/* <WhiteboardPanel open={whiteboardOpen} onClose={() => setWhiteboardOpen(false)} /> */}
        <div className="flex-1 bg-gray-900 rounded-xl p-8 shadow-lg flex flex-col">
          <h3 className="text-2xl font-bold mb-4 text-blue-200">Live AI Demo</h3>
          <p className="mb-4 text-gray-300">Try multi-modal input, model switching, and see real-time AI responses below.</p>
          {/* Multi-modal input and model switcher (reuse AICopilotSidebar) */}
          <div className="mb-4 bg-gray-800/50 rounded-lg p-4 border border-gray-700">
            <h3 className="text-lg font-semibold text-blue-300 mb-3">AI Assistant</h3>
            <div className="text-gray-400">AI assistant interface will be available soon.</div>
          </div>
          <div className="flex gap-4 mt-4">
            <button onClick={() => setWhiteboardOpen(true)} className="px-4 py-2 rounded bg-yellow-400 hover:bg-yellow-500 text-black font-bold">Open Whiteboard</button>
            <button className="px-4 py-2 rounded bg-green-400 hover:bg-green-500 text-black font-bold">AR/3D Mode (Coming Soon)</button>
            <button className="px-4 py-2 rounded bg-blue-400 hover:bg-blue-500 text-black font-bold">Conference (Coming Soon)</button>
          </div>
        </div>
        {/* Sidebar: Live Data & Agent Actions */}
        <aside className="w-full lg:w-96 bg-gray-900/80 p-6 flex flex-col border-l border-blue-900 rounded-xl shadow-lg min-h-[400px]">
          <h4 className="text-lg font-bold mb-4">Live Data & Agent Actions</h4>
          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
            <h4 className="text-lg font-semibold text-green-300 mb-3">Live Data Stream</h4>
            <div className="text-gray-400">Live data monitoring will be available soon.</div>
          </div>
          <div className="mt-4 text-xs text-gray-400">Context-aware agent actions and alerts will appear here.</div>
        </aside>
      </section>

      {/* Value Proposition */}
      <section className="py-16 px-4 max-w-4xl mx-auto text-center">
        <h3 className="text-3xl font-bold mb-8">Why AGENT mc3?</h3>
        <div className="grid md:grid-cols-2 gap-8">
          <ValuePropCard title="Multi-Modal Input" desc="Integrate audio, video, text, telemetry, and sensor data for rich, collaborative problem-solving." />
          <ValuePropCard title="Multi-Model AI Orchestration" desc="Switch between GPT-4, Claude, BioMed, and custom models in real time for optimal task resolution." />
          <ValuePropCard title="Collaborative Conferencing" desc="Host AI-powered virtual meetings with dynamic insights, whiteboards, and timeline projections." />
          <ValuePropCard title="Automated Problem Resolution" desc="Recursive reasoning, feedback loops, and real-time adaptation for evolving challenges." />
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-8 px-4 bg-gray-950 text-gray-400 text-center mt-8">
        <div className="text-xs">© AGENT mc3 by Agile Defense Systems. All rights reserved.</div>
      </footer>
    </main>
  );
}

function UseCaseCard({ title, desc, icon }: { title: string; desc: string; icon: string }) {
  return (
    <div className="bg-gray-900 rounded-xl p-6 shadow-lg border border-blue-800 flex flex-col items-center fade-in">
      <div className="w-12 h-12 mb-3 rounded-full bg-gradient-to-br from-blue-500 to-yellow-400 flex items-center justify-center text-3xl">{icon}</div>
      <div className="font-bold text-lg mb-1 text-blue-200">{title}</div>
      <div className="text-gray-300 text-sm text-center">{desc}</div>
    </div>
  );
}

function ValuePropCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="bg-gray-900 rounded-xl p-6 shadow-lg border border-blue-800 flex flex-col items-center fade-in">
      <div className="font-bold text-lg mb-1 text-blue-200">{title}</div>
      <div className="text-gray-300 text-sm text-center">{desc}</div>
    </div>
  );
}