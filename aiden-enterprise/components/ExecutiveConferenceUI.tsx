/* eslint-disable no-undef, @typescript-eslint/no-explicit-any */
"use client";

import LiveKitConference from "@/components/LiveKitConference";
import { Button } from "@/components/ui/button";
import { exportPDF } from "@/lib/exportPdf";
import { useEffect, useRef, useState } from 'react';
import useSWR from 'swr';
import * as THREE from 'three';

const LAYOUTS = [
  { key: 'gallery', label: 'Gallery View' },
  { key: 'speaker', label: 'Speaker View' },
  { key: 'content', label: 'Content View' },
];

const ONBOARDING_STEPS = [
  {
    title: 'Welcome to Executive AI Conference',
    content: 'This platform delivers secure, AI-powered video collaboration for defense, healthcare, and legal teams.'
  },
  {
    title: 'Multi-Modal Conferencing',
    content: 'Enjoy video, audio, screen sharing, and AR overlays. Switch layouts for gallery, speaker, or content focus.'
  },
  {
    title: 'AI Copilot & Action Items',
    content: 'Get real-time transcription, Q&A, action item extraction, and compliance flagging from our AI copilot.'
  },
  {
    title: 'Enterprise-Grade Security',
    content: 'All sessions are encrypted and compliant. Easily export transcripts and summaries for audit or review.'
  },
  {
    title: 'Get Started',
    content: 'Join a conference, try AR, and explore the executive features. Need help? Hover any control for tips.'
  }
];

export default function ExecutiveConferenceUI() {
  const [arEnabled, setArEnabled] = useState(false);
  const arRef = useRef<HTMLDivElement>(null);
  const [translated, setTranslated] = useState('');
  const [qaInput, setQaInput] = useState('');
  const [qaAnswer, setQaAnswer] = useState('');
  const [onboardingOpen, setOnboardingOpen] = useState(true);
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [theme, setTheme] = useState('dark');
  const [layout, setLayout] = useState('gallery');
  const [videoEnabled, setVideoEnabled] = useState(false);
  const [screenEnabled, setScreenEnabled] = useState(false);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const screenVideoRef = useRef<HTMLVideoElement>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
  const mockRemoteVideoRef = useRef<HTMLVideoElement>(null);
  // LiveKit connection & token handling
  const [shouldJoin, setShouldJoin] = useState(false);
  const fetcher = (url: string) => fetch(url).then(res => res.json());
  const { data: lk } = useSWR(
    shouldJoin ? `/api/livekit-token?identity=DemoUser&room=osborn-demo` : null,
    fetcher
  );
  const token = lk?.token ?? '';
  const isConnected = Boolean(token);
  const connect = () => setShouldJoin(true);

  // Automatically join once the page loads (useful for demos / automation)
  useEffect(() => {
    setShouldJoin(true);
  }, []);

  // Mock remote participant list to keep UI functional
  const remoteParticipants = [
    { id: 1, name: "Alice", isSpeaking: true },
    { id: 2, name: "Bob", isSpeaking: false },
    { id: 3, name: "Carol", isSpeaking: false },
    { id: 4, name: "David", isSpeaking: false },
  ];

  // Live transcript captured from the local microphone (fallback to empty string).
  const [transcript, setTranscript] = useState('');

  // Speech-to-text pipeline (Web Speech API as a stand-in for server STT)
  useEffect(() => {
    if (typeof window === 'undefined' || !isConnected) return;

    // Prefer native SpeechRecognition where available.

    const SpeechRecognition: any =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
        }
      }
      if (finalTranscript) {
        setTranscript((prev) => `${prev} ${finalTranscript}`.trim());
      }
    };

    recognition.start();
    return () => {
      recognition.stop();
    };
  }, [isConnected]);

  useEffect(() => {
    if (!arEnabled || !arRef.current) return;
    // Basic Three.js scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(400, 300);
    arRef.current.appendChild(renderer.domElement);
    camera.position.z = 5;
    // Example: Add a cube as a marker
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    function animate() {
      requestAnimationFrame(animate);
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      renderer.render(scene, camera);
    }
    animate();
    return () => {
      renderer.dispose();
      if (arRef.current) arRef.current.innerHTML = '';
    };
  }, [arEnabled]);

  // Onboarding modal logic (multi-step)
  useEffect(() => {
    if (window && window.localStorage) {
      const seen = localStorage.getItem('onboardingSeen');
      if (seen) setOnboardingOpen(false);
    }
  }, []);
  const handleOnboardingClose = () => {
    setOnboardingOpen(false);
    if (window && window.localStorage) {
      localStorage.setItem('onboardingSeen', '1');
    }
  };
  const nextStep = () => setOnboardingStep(s => Math.min(s + 1, ONBOARDING_STEPS.length - 1));
  const prevStep = () => setOnboardingStep(s => Math.max(s - 1, 0));

  // Theme switcher
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.classList.toggle('light', theme === 'light');
  }, [theme]);

  const handleTranslate = async () => {
    // Placeholder: Replace with real Google Translate API call
    const response = await fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: transcript, target: 'es' }),
    });
    const data = await response.json();
    setTranslated(data.translated || 'Translation unavailable');
  };

  const handleQa = async () => {
    const response = await fetch('/api/copilot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input: `Transcript: ${transcript}\nQuestion: ${qaInput}` }),
    });
    const data = await response.json();
    setQaAnswer(data.summary || 'No answer returned.');
  };

  // Start/stop local video
  const handleStartVideo = async () => {
    if (!videoEnabled) {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setLocalStream(stream);
      setVideoEnabled(true);
    } else {
      localStream?.getTracks().forEach(track => track.stop());
      setLocalStream(null);
      setVideoEnabled(false);
    }
  };

  // Start/stop screen share
  const handleShareScreen = async () => {
    if (!screenEnabled) {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      setScreenStream(stream);
      setScreenEnabled(true);
      stream.getVideoTracks()[0].onended = () => {
        setScreenStream(null);
        setScreenEnabled(false);
      };
    } else {
      screenStream?.getTracks().forEach(track => track.stop());
      setScreenStream(null);
      setScreenEnabled(false);
    }
  };

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);
  useEffect(() => {
    if (screenVideoRef.current && screenStream) {
      screenVideoRef.current.srcObject = screenStream;
    }
  }, [screenStream]);

  useEffect(() => {
    // TODO: Replace with real remote stream from WebRTC signaling
    if (mockRemoteVideoRef.current) {
      // For demo, use a sample video or leave blank
      // mockRemoteVideoRef.current.srcObject = remoteStream;
    }
  }, []);

  // Placeholder shared content element (used in content layout)
  const sharedContent = (
    <div className="w-full h-64 bg-gray-800 flex items-center justify-center text-white text-xl rounded-xl">
      Shared Content (Screen Share or Doc)
    </div>
  );

  return (
    <div className={theme === 'dark' ? 'bg-gray-950 text-white min-h-screen' : 'bg-white text-gray-900 min-h-screen'}>
      {/* Onboarding Modal (multi-step) */}
      {onboardingOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-white text-black rounded-xl p-8 max-w-md shadow-xl">
            <h2 className="text-2xl font-bold mb-4">{ONBOARDING_STEPS[onboardingStep].title}</h2>
            <div className="mb-4 text-sm">{ONBOARDING_STEPS[onboardingStep].content}</div>
            <div className="flex gap-2 justify-between">
              <button onClick={prevStep} disabled={onboardingStep === 0} className="px-4 py-2 rounded bg-gray-200 text-gray-700 font-bold disabled:opacity-50">Back</button>
              {onboardingStep < ONBOARDING_STEPS.length - 1 ? (
                <button onClick={nextStep} className="px-4 py-2 rounded bg-blue-600 text-white font-bold">Next</button>
              ) : (
                <button onClick={handleOnboardingClose} className="px-4 py-2 rounded bg-blue-600 text-white font-bold">Finish</button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Theme Switcher */}
      <div className="fixed top-4 right-4 z-40">
        <button
          aria-label="Switch theme"
          className="px-3 py-2 rounded bg-gray-800 text-white font-bold shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          {theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
        </button>
      </div>

      {/* Layout Switcher */}
      <div className="fixed top-4 left-4 z-40">
        {LAYOUTS.map(l => (
          <button
            key={l.key}
            onClick={() => setLayout(l.key)}
            className={`px-4 py-2 rounded ${layout === l.key ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-200'} font-semibold`}
            aria-label={l.label}
            tabIndex={0}
          >
            {l.label}
          </button>
        ))}
      </div>

      {/* Main Controls with Tooltips and accessibility */}
      <div className="flex gap-4 mb-4 flex-wrap">
        <div className="relative group">
          <Button onClick={() => setArEnabled(v => !v)} aria-label="Toggle AR overlay" tabIndex={0}>{arEnabled ? 'Disable AR Overlay' : 'Enable AR Overlay'}</Button>
          <span className="absolute left-1/2 -translate-x-1/2 mt-2 w-max bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition">Toggle AR overlay</span>
        </div>
        <div className="relative group">
          <Button onClick={handleTranslate} aria-label="Translate transcript" tabIndex={0}>Translate</Button>
          <span className="absolute left-1/2 -translate-x-1/2 mt-2 w-max bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition">Translate transcript</span>
        </div>
        <div className="relative group">
          <Button onClick={() => exportPDF()} aria-label="Export as PDF" tabIndex={0}>Export Summary</Button>
          <span className="absolute left-1/2 -translate-x-1/2 mt-2 w-max bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition">Export as PDF</span>
        </div>
        <div className="relative group">
          <Button onClick={handleQa} aria-label="Ask AI about meeting" tabIndex={0}>Q&amp;A</Button>
          <span className="absolute left-1/2 -translate-x-1/2 mt-2 w-max bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition">Ask AI about meeting</span>
        </div>
        <div className="relative group">
          <Button onClick={handleStartVideo} aria-label="Toggle camera" tabIndex={0}>{videoEnabled ? 'Stop Video' : 'Start Video'}</Button>
          <span className="absolute left-1/2 -translate-x-1/2 mt-2 w-max bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition">Toggle camera</span>
        </div>
        <div className="relative group">
          <Button onClick={handleShareScreen} aria-label="Share your screen" tabIndex={0}>{screenEnabled ? 'Stop Sharing' : 'Share Screen'}</Button>
          <span className="absolute left-1/2 -translate-x-1/2 mt-2 w-max bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition">Share your screen</span>
        </div>
        <div className="relative group">
          <Button onClick={() => connect()} disabled={isConnected} aria-label="Join Conference" tabIndex={0}>{isConnected ? 'Connected' : 'Join Conference'}</Button>
          <span className="absolute left-1/2 -translate-x-1/2 mt-2 w-max bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition">Join the LiveKit conference</span>
        </div>
      </div>

      {/* AR Overlay */}
      {arEnabled && <div ref={arRef} style={{ position: 'absolute', top: 0, left: 0, width: 400, height: 300, pointerEvents: 'none', zIndex: 10 }} />}
      {translated && <div className="mt-2 text-blue-400">{translated}</div>}
      <div className="mt-4 p-4 bg-gray-900 rounded-xl">
        <div className="font-bold mb-2">AI Q&amp;A</div>
        <input value={qaInput} onChange={e => setQaInput(e.target.value)} placeholder="Ask a question about this meeting..." className="px-2 py-1 rounded bg-gray-800 text-white w-2/3" />
        <Button onClick={handleQa} className="ml-2">Ask</Button>
        {qaAnswer && <div className="mt-2 text-green-400">{qaAnswer}</div>}
      </div>

      {/* Layout-specific content */}
      {layout === 'gallery' && isConnected && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {/* Local self-view */}
          <div className={`bg-gray-900 rounded-xl p-4 flex flex-col items-center shadow-lg border-2 border-blue-400`}>
            <div className="w-20 h-20 bg-gray-700 rounded-full mb-2 flex items-center justify-center text-2xl font-bold text-white overflow-hidden">
              {videoEnabled ? <video ref={localVideoRef} autoPlay muted playsInline className="w-20 h-20 object-cover rounded-full" /> : 'A'}
            </div>
            <div className="text-white font-semibold">You</div>
            {videoEnabled && <div className="text-xs text-blue-400 mt-1">Camera On</div>}
          </div>
          {/* Remote participants (mock until LiveKit is integrated) */}
          {remoteParticipants.map((p) => (
            <div
              key={p.id}
              className="bg-gray-900 rounded-xl p-4 flex flex-col items-center shadow-lg border-2 border-gray-800"
            >
              <div className="w-20 h-20 bg-gray-700 rounded-full mb-2 flex items-center justify-center text-2xl font-bold text-white">
                {p.name.charAt(0)}
              </div>
              <div className="text-white font-semibold">{p.name}</div>
            </div>
          ))}
        </div>
      )}
      {layout === 'speaker' && (
        <div className="flex gap-4 mb-6">
          <div className="flex-1 bg-gray-900 rounded-xl p-6 flex flex-col items-center shadow-lg border-2 border-blue-400">
            <div className="w-32 h-32 bg-gray-700 rounded-full mb-4 flex items-center justify-center text-5xl font-bold text-white overflow-hidden">
              {videoEnabled ? <video ref={localVideoRef} autoPlay muted playsInline className="w-32 h-32 object-cover rounded-full" /> : 'A'}
            </div>
            <div className="text-white font-semibold text-xl mb-2">You</div>
            {videoEnabled && <div className="text-xs text-blue-400">Camera On</div>}
          </div>
          <div className="flex flex-col gap-2">
            {remoteParticipants.slice(1).map((p, i) => (
              <div key={p.id} className="bg-gray-800 rounded-xl p-2 flex items-center gap-2 w-32">
                <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-lg font-bold text-white overflow-hidden">
                  {/* TODO: Replace with remote video stream */}
                  <video ref={i === 0 ? mockRemoteVideoRef : undefined} autoPlay playsInline muted className="w-8 h-8 object-cover rounded-full bg-gray-800" />
                </div>
                <div className="text-white text-sm">{p.name}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      {layout === 'content' && (
        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            {screenEnabled ? (
              <video ref={screenVideoRef} autoPlay playsInline className="w-full h-64 object-contain rounded-xl bg-black" />
            ) : (
              sharedContent
            )}
          </div>
          <div className="flex flex-col gap-2">
            <div className="bg-gray-900 rounded-xl p-2 flex items-center gap-2 w-32">
              <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-lg font-bold text-white overflow-hidden">
                {videoEnabled ? <video ref={localVideoRef} autoPlay muted playsInline className="w-8 h-8 object-cover rounded-full" /> : 'A'}
              </div>
              <div className="text-white text-sm">You</div>
            </div>
            {remoteParticipants.slice(1).map((p, i) => (
              <div key={p.id} className="bg-gray-800 rounded-xl p-2 flex items-center gap-2 w-32">
                <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-lg font-bold text-white overflow-hidden">
                  {/* TODO: Replace with remote video stream */}
                  <video ref={i === 0 ? mockRemoteVideoRef : undefined} autoPlay playsInline muted className="w-8 h-8 object-cover rounded-full bg-gray-800" />
                </div>
                <div className="text-white text-sm">{p.name}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mount LiveKit in the background once the user connects */}
      {token && (
        <div className="hidden">
          <LiveKitConference token={token} />
        </div>
      )}
    </div>
  );
}