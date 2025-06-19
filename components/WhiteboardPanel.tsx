"use client";
import { useEffect, useRef } from "react";

export default function WhiteboardPanel({ open, onClose }) {
  const wbRef = useRef(null);

  useEffect(() => {
    if (!open || !wbRef.current) return;
    // Load tldraw from CDN
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/@tldraw/tldraw@2.0.0-beta.72/dist/tldraw.umd.js";
    script.onload = () => {
      if (!window.tldraw) {
        wbRef.current.innerHTML = '<div class="text-red-400">tldraw failed to load.</div>';
        return;
      }
      wbRef.current.innerHTML = '';
      window.tldraw.createTldraw({
        container: wbRef.current,
        // Optionally, add more config here
      });
    };
    document.body.appendChild(script);
    return () => {
      if (wbRef.current) wbRef.current.innerHTML = '';
      document.body.removeChild(script);
    };
  }, [open]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-xl p-8 shadow-lg relative w-[900px] h-[600px] flex flex-col">
        <button onClick={onClose} className="absolute top-2 right-2 text-white text-xl">×</button>
        <h2 className="text-xl font-bold mb-4 text-blue-300">Collaborative Whiteboard</h2>
        <div ref={wbRef} className="flex-1 w-full h-full bg-white rounded" />
      </div>
    </div>
  );
}