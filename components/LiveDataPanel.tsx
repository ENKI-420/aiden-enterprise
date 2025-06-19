"use client";
import { useEffect, useRef, useState } from "react";

export default function LiveDataPanel() {
  const [messages, setMessages] = useState([]);
  const [status, setStatus] = useState("disconnected");
  const wsRef = useRef(null);

  useEffect(() => {
    const ws = new window.WebSocket("ws://localhost:4000");
    wsRef.current = ws;
    ws.onopen = () => setStatus("connected");
    ws.onclose = () => setStatus("disconnected");
    ws.onerror = () => setStatus("error");
    ws.onmessage = (e) => {
      setMessages(msgs => [...msgs.slice(-49), e.data]);
    };
    return () => ws.close();
  }, []);

  return (
    <div className="bg-gray-900 rounded-xl p-4 shadow-lg mb-4 max-w-md w-full">
      <div className="flex items-center gap-2 mb-2">
        <span className={`w-3 h-3 rounded-full ${status === "connected" ? "bg-green-400" : status === "error" ? "bg-red-500" : "bg-gray-500"}`} />
        <span className="text-xs text-gray-400">Live Data: {status}</span>
      </div>
      <div className="h-32 overflow-y-auto bg-gray-800 rounded p-2 text-xs text-gray-200">
        {messages.length === 0 ? <span className="text-gray-500">No data yet.</span> : messages.map((msg, i) => <div key={i}>{msg}</div>)}
      </div>
    </div>
  );
}