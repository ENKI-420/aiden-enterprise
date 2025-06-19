"use client";
import { LiveKitRoom, VideoConference } from '@livekit/components-react';

export default function LiveKitConference({ room, token }) {
  return (
    <LiveKitRoom
      token={token}
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      connect={true}
      data-lk-theme="default"
      style={{ height: '100%', width: '100%' }}
    >
      <VideoConference />
      {/* TODO: Add AI Copilot sidebar here */}
    </LiveKitRoom>
  );
}