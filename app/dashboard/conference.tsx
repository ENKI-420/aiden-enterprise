"use client";
import { useState } from "react";
import ARPresentationModal from "@/components/ARPresentationModal";
import AICopilotSidebar from "@/components/AICopilotSidebar";
import LiveDataPanel from "@/components/LiveDataPanel";

const roles = ["Clinician", "Legal", "Admin", "Patient", "Developer", "Investor"];

function getJitsiRoomName(role, room) {
  // Simple, deterministic room name for demo
  return `AIDEN_${role}_${room || "default"}`.replace(/\W+/g, "");
}

export default function ConferenceDashboard() {
  const [role, setRole] = useState(roles[0]);
  const [room, setRoom] = useState("");
  const [joined, setJoined] = useState(false);
  const [arOpen, setArOpen] = useState(false);

  const jitsiRoom = getJitsiRoomName(role, room);
  const jitsiUrl = `https://meet.jit.si/${jitsiRoom}`;

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-gray-950 via-gray-900 to-blue-950">
      <ARPresentationModal open={arOpen} onClose={() => setArOpen(false)} />
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <h1 className="text-3xl font-bold mb-4">Secure Video Conference</h1>
        <button onClick={() => setArOpen(true)} className="mb-4 px-6 py-2 rounded bg-yellow-400 hover:bg-yellow-500 font-bold text-lg shadow-lg transition text-black">AR Presentation Mode</button>
        <div className="mb-4">
          <label htmlFor="role-select" className="block mb-1 font-semibold">Select Role:</label>
          <select id="role-select" value={role} onChange={e => setRole(e.target.value)} className="px-4 py-2 rounded bg-gray-800 text-white">
            {roles.map(r => <option key={r}>{r}</option>)}
          </select>
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Room Name:</label>
          <input value={room} onChange={e => setRoom(e.target.value)} placeholder="Enter room name" className="px-4 py-2 rounded bg-gray-800 text-white" />
        </div>
        <button onClick={() => setJoined(true)} className="px-6 py-2 rounded bg-blue-600 hover:bg-blue-700 font-bold text-lg shadow-lg transition">Join Room</button>
        {joined && (
          <div className="mt-8 w-full max-w-2xl h-[480px] bg-black/80 rounded-xl flex items-center justify-center text-gray-400 overflow-hidden">
            <iframe
              src={jitsiUrl}
              title="Jitsi Video Conference"
              allow="camera; microphone; fullscreen; display-capture"
              className="w-full h-full border-0 rounded-xl"
              style={{ minHeight: 400 }}
            />
          </div>
        )}
        <div className="mt-8 w-full flex justify-center">
          <LiveDataPanel />
        </div>
      </div>
      <aside className="w-full md:w-96 bg-gray-900/80 p-6 flex flex-col border-l border-blue-900 min-h-screen">
        <h2 className="text-xl font-bold mb-4">AI Copilot</h2>
        <AICopilotSidebar />
        <div className="text-xs text-gray-500">HIPAA-compliant. All activity is logged and encrypted.</div>
      </aside>
    </div>
  );
}