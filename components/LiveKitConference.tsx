"use client";
import { useState, useEffect } from "react";
import { LiveKitRoom, VideoConference } from "@livekit/components-react";
import { CopilotSidebar } from "@/components/copilot/copilot-sidebar";
import { CopilotProvider } from "@/lib/copilot-context";

interface LiveKitConferenceProps {
  token: string;
  room?: any; // Replace with LiveKit Room type if using SDK typings
}

export default function LiveKitConference({ room, token }: LiveKitConferenceProps) {
  const [copilotOpen, setCopilotOpen] = useState(true);

  useEffect(() => {
    const toggleCopilot = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "c") setCopilotOpen((prev) => !prev);
    };
    window.addEventListener("keydown", toggleCopilot);
    return () => window.removeEventListener("keydown", toggleCopilot);
  }, []);

  return (
    <CopilotProvider>
      <LiveKitRoom
        token={token}
        serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
        connect={true}
        data-lk-theme="default"
        style={{ display: "flex", height: "100vh", width: "100vw" }}
      >
        <div style={{ flex: 1 }}>
          <VideoConference />
        </div>
        {copilotOpen && (
          <div style={{ width: "400px", borderLeft: "1px solid #ccc" }}>
            <CopilotSidebar room={room} />
          </div>
        )}
      </LiveKitRoom>
    </CopilotProvider>
  );
}
