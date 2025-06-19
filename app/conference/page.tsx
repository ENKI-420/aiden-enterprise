'use client'

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// Temporary placeholder components for upcoming features.
// Replace these with real implementations when available.
const ARPresentationModal = () => null
const ARMarkerModal = () => null

type Role = "Presenter" | "Viewer"

export default function ConferencePage() {
  const [roomName, setRoomName] = useState("")
  const [role, setRole] = useState<Role>("Presenter")
  const [joined, setJoined] = useState(false)
  const [showARPresentation, setShowARPresentation] = useState(false)
  const [showARMarker, setShowARMarker] = useState(false)

  const joinRoom = () => {
    if (roomName.trim()) {
      setJoined(true)
    }
  }

  const leaveRoom = () => {
    setJoined(false)
  }

  return (
    <div className="container mx-auto max-w-5xl py-8">
      <h1 className="text-3xl font-bold mb-6">Secure Conference Room</h1>

      {!joined && (
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="room">Room Name</Label>
            <Input
              id="room"
              placeholder="Enter a room name"
              value={roomName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRoomName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Select Role</Label>
            <select
              id="role"
              value={role}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setRole(e.target.value as Role)}
              className="block w-full rounded-md border bg-background p-2 text-foreground"
            >
              <option value="Presenter">Presenter</option>
              <option value="Viewer">Viewer</option>
            </select>
          </div>

          <Button onClick={joinRoom} disabled={!roomName.trim()}>
            Join Room
          </Button>
        </div>
      )}

      {joined && (
        <>
          <div className="relative w-full aspect-video rounded-md overflow-hidden shadow-lg ring-1 ring-border mb-6">
            <iframe
              title="Jitsi Conference"
              src={`https://meet.jit.si/${encodeURIComponent(roomName)}`}
              allow="camera; microphone; display-capture"
              className="absolute inset-0 h-full w-full"
            />
          </div>

          <div className="flex flex-wrap gap-4">
            <Button variant="destructive" onClick={leaveRoom}>
              Leave Room
            </Button>
            <Button variant="secondary" onClick={() => setShowARPresentation(true)}>
              AR Presentation
            </Button>
            <Button variant="secondary" onClick={() => setShowARMarker(true)}>
              AR Marker
            </Button>
          </div>
        </>
      )}

      {showARPresentation && (
        <ARPresentationModal /* TODO: implement */ />
      )}
      {showARMarker && (
        <ARMarkerModal /* TODO: implement */ />
      )}
    </div>
  )
}