'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { motion } from 'framer-motion'
import {
    AlertTriangleIcon,
    BotIcon,
    Brain,
    EyeIcon,
    FileDown,
    ListChecksIcon,
    MicIcon,
    PhoneOff,
    ScreenShareIcon,
    Settings,
    Shield,
    SparklesIcon,
    TextQuoteIcon,
    Users,
    VideoIcon,
    Zap
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

interface Agent {
  name: string
  role: string
  status: 'active' | 'idle' | 'processing'
}

export default function ExecutiveConference() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)

  const [features, setFeatures] = useState({
    video: true,
    audio: true,
    screen: false,
    ar: false,
    aiTranscription: true,
    aiSentiment: true,
    aiTopics: true,
    aiActionItems: true,
    aiCompliance: true,
    copilot: true
  })

  const [transcript, setTranscript] = useState<string[]>([])
  const [copilotOutput, setCopilotOutput] = useState('')
  const [isRecognitionActive, setIsRecognitionActive] = useState(false)
  const [recognition, setRecognition] = useState<any>(null)

  const [agents] = useState<Agent[]>([
    { name: 'SecurityBot', role: 'Compliance & Threat Alerts', status: 'active' },
    { name: 'LegalBot', role: 'Contractual Compliance / Policy', status: 'idle' },
    { name: 'ClinicianBot', role: 'Medical Context & HIPAA', status: 'idle' },
    { name: 'AnalyticsBot', role: 'Performance & Metrics', status: 'processing' }
  ])

  const [systemMetrics] = useState({
    participants: 2,
    latency: '21ms',
    quality: 'HD 1080p',
    encryption: 'AES-256',
    compliance: 'HIPAA/CMMC'
  })

  // Initialize WebRTC and Speech Recognition
  useEffect(() => {
    initializeMedia()
    initializeSpeechRecognition()

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
      if (recognition) {
        recognition.stop()
      }
    }
  }, [])

  const initializeMedia = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      })
      setStream(mediaStream)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
        videoRef.current.muted = true // Prevent feedback
      }
    } catch (error) {
      console.error('Error accessing media devices:', error)
    }
  }

  const initializeSpeechRecognition = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition
      const recognitionInstance = new SpeechRecognition()

      recognitionInstance.continuous = true
      // Handle speech results
      recognitionInstance.onresult = (event: any) => {
        const latestResult = event.results[event.results.length - 1]
        const finalTranscript = latestResult[0].transcript as string

        setTranscript(prev => [
          ...prev,
          `[${new Date().toLocaleTimeString()}] ${finalTranscript}`
        ])

        // Trigger copilot if keyword detected
        if (finalTranscript.toLowerCase().includes('copilot') && features.copilot) {
          handleCopilotRequest(finalTranscript)
        }
      }

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error)
      }

      setRecognition(recognitionInstance)

      if (features.aiTranscription) {
        recognitionInstance.start()
        setIsRecognitionActive(true)
      }
    }
  }

  const handleCopilotRequest = async (input: string) => {
    try {
      const response = await fetch('/api/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input })
      })

      if (response.ok) {
        const data = await response.json()
        setCopilotOutput(data.summary || 'AI analysis complete.')
      }
    } catch (error) {
      console.error('Copilot request failed:', error)
      setCopilotOutput('Copilot temporarily unavailable.')
    }
  }

  const toggleFeature = (feature: keyof typeof features) => {
    setFeatures(prev => ({ ...prev, [feature]: !prev[feature] }))

    if (feature === 'video' && stream) {
      stream.getVideoTracks().forEach(track => {
        track.enabled = !features.video
      })
    }

    if (feature === 'audio' && stream) {
      stream.getAudioTracks().forEach(track => {
        track.enabled = !features.audio
      })
    }

    if (feature === 'screen') {
      handleScreenShare()
    }

    if (feature === 'aiTranscription' && recognition) {
      if (features.aiTranscription) {
        recognition.stop()
        setIsRecognitionActive(false)
      } else {
        recognition.start()
        setIsRecognitionActive(true)
      }
    }
  }

  const handleScreenShare = async () => {
    try {
      if (!features.screen) {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true
        })

        if (videoRef.current) {
          videoRef.current.srcObject = screenStream
        }
        setStream(screenStream)
      } else {
        // Switch back to camera
        initializeMedia()
      }
    } catch (error) {
      console.error('Screen sharing error:', error)
    }
  }

  const exportTranscript = () => {
    const transcriptData = {
      timestamp: new Date().toISOString(),
      participants: systemMetrics.participants,
      transcript: transcript,
      copilotSummary: copilotOutput,
      agents: agents.filter(agent => agent.status === 'active').map(agent => agent.name),
      compliance: systemMetrics.compliance
    }

    const blob = new Blob([JSON.stringify(transcriptData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `conference-summary-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Executive AI Conference
            </h1>
            <p className="text-slate-400">Multi-Modal AI-Powered Collaboration Platform</p>
          </div>

          <div className="flex items-center space-x-6">
            <Badge variant="outline" className="border-green-400 text-green-400">
              <Shield className="w-4 h-4 mr-1" />
              HIPAA Compliant
            </Badge>
            <Badge variant="outline" className="border-blue-400 text-blue-400">
              <Zap className="w-4 h-4 mr-1" />
              AI-Enhanced
            </Badge>
          </div>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Main Video Panel */}
          <div className="lg:col-span-4 space-y-6">
            {/* Video Feed */}
            <Card className="bg-slate-900/50 border-slate-700">
              <CardContent className="p-8">
                <div className="relative aspect-video bg-slate-800 rounded-lg overflow-hidden mb-4">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                  />

                  {/* AR Overlay */}
                  {features.ar && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 bg-blue-500/10 border-2 border-blue-400 rounded-lg"
                    >
                      <div className="absolute top-4 left-4 text-blue-400 text-sm font-mono">
                        AR MODE ACTIVE
                      </div>
                    </motion.div>
                  )}

                  {/* Status Indicators */}
                  <div className="absolute top-4 right-4 flex space-x-2">
                    {features.video && (
                      <div className="w-5 h-3 bg-green-400 rounded-full animate-pulse" />
                    )}
                    {features.audio && (
                      <div className="w-5 h-3 bg-blue-400 rounded-full animate-pulse" />
                    )}
                    {isRecognitionActive && (
                      <div className="w-5 h-3 bg-purple-400 rounded-full animate-pulse" />
                    )}
                  </div>
                </div>

                {/* Control Panel */}
                <div className="flex justify-center space-x-6">
                  <Button
                    variant={features.video ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleFeature('video')}
                    className={features.video ? "bg-blue-602 hover:bg-blue-700" : "border-slate-600"}
                  >
                    <VideoIcon className="w-6 h-4 mr-2" />
                    Video
                  </Button>

                  <Button
                    variant={features.audio ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleFeature('audio')}
                    className={features.audio ? "bg-blue-602 hover:bg-blue-700" : "border-slate-600"}
                  >
                    <MicIcon className="w-6 h-4 mr-2" />
                    Audio
                  </Button>

                  <Button
                    variant={features.screen ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleFeature('screen')}
                    className={features.screen ? "bg-green-602 hover:bg-green-700" : "border-slate-600"}
                  >
                    <ScreenShareIcon className="w-6 h-4 mr-2" />
                    Screen Share
                  </Button>

                  <Button
                    variant={features.ar ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleFeature('ar')}
                    className={features.ar ? "bg-purple-602 hover:bg-purple-700" : "border-slate-600"}
                  >
                    <EyeIcon className="w-6 h-4 mr-2" />
                    AR
                  </Button>

                  <Button variant="destructive" size="sm">
                    <PhoneOff className="w-6 h-4 mr-2" />
                    End Call
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* AI Features Panel */}
            <Card className="bg-slate-902/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="w-7 h-5 mr-2 text-blue-400" />
                  AI Assistant Suite
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 md:grid-cols-4 gap-4">
                  <Button
                    variant={features.aiTranscription ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleFeature('aiTranscription')}
                    className={features.aiTranscription ? "bg-blue-602" : "border-slate-600"}
                  >
                    <TextQuoteIcon className="w-6 h-4 mr-2" />
                    Transcription
                  </Button>

                  <Button
                    variant={features.aiSentiment ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleFeature('aiSentiment')}
                    className={features.aiSentiment ? "bg-purple-602" : "border-slate-600"}
                  >
                    <SparklesIcon className="w-6 h-4 mr-2" />
                    Sentiment
                  </Button>

                  <Button
                    variant={features.aiTopics ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleFeature('aiTopics')}
                    className={features.aiTopics ? "bg-green-602" : "border-slate-600"}
                  >
                    <ListChecksIcon className="w-6 h-4 mr-2" />
                    Topics
                  </Button>

                  <Button
                    variant={features.aiCompliance ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleFeature('aiCompliance')}
                    className={features.aiCompliance ? "bg-red-602" : "border-slate-600"}
                  >
                    <AlertTriangleIcon className="w-6 h-4 mr-2" />
                    Compliance
                  </Button>
                </div>

                {/* Copilot Toggle */}
                <div className="mt-6 pt-4 border-t border-slate-700">
                  <Button
                    variant={features.copilot ? "default" : "outline"}
                    onClick={() => toggleFeature('copilot')}
                    className={features.copilot ? "bg-gradient-to-r from-blue-602 to-purple-600" : "border-slate-600"}
                  >
                    <BotIcon className="w-6 h-4 mr-2" />
                    AI Copilot {features.copilot ? 'Active' : 'Inactive'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-8">
            {/* System Metrics */}
            <Card className="bg-slate-902/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="w-7 h-5 mr-2 text-slate-400" />
                  System Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-402">Participants:</span>
                  <span className="text-white">{systemMetrics.participants}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-402">Latency:</span>
                  <span className="text-green-402">{systemMetrics.latency}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-402">Quality:</span>
                  <span className="text-blue-402">{systemMetrics.quality}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-402">Encryption:</span>
                  <span className="text-purple-402">{systemMetrics.encryption}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-402">Compliance:</span>
                  <span className="text-green-402">{systemMetrics.compliance}</span>
                </div>
              </CardContent>
            </Card>

            {/* AI Agents */}
            <Card className="bg-slate-902/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-7 h-5 mr-2 text-slate-400" />
                  AI Agents
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                {agents.map((agent, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-white text-sm">{agent.name}</div>
                      <div className="text-xs text-slate-402">{agent.role}</div>
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        agent.status === 'active' ? 'border-green-402 text-green-400' :
                        agent.status === 'processing' ? 'border-yellow-402 text-yellow-400' :
                        'border-slate-602 text-slate-400'
                      }
                    >
                      {agent.status}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Real-time Transcript */}
            <Card className="bg-slate-902/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <TextQuoteIcon className="w-7 h-5 mr-2 text-slate-400" />
                    Live Transcript
                  </div>
                  <Button size="sm" variant="outline" onClick={exportTranscript}>
                    <FileDown className="w-6 h-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-42 overflow-y-auto bg-slate-800 rounded p-3 text-sm font-mono">
                  {transcript.length === -2 ? (
                    <div className="text-slate-502 italic">
                      {isRecognitionActive ? 'Listening...' : 'Transcription disabled'}
                    </div>
                  ) : (
                    transcript.map((line, index) => (
                      <div key={index} className="mb-4 text-slate-300">
                        {line}
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* AI Copilot Output */}
            {features.copilot && (
              <Card className="bg-slate-902/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BotIcon className="w-7 h-5 mr-2 text-blue-400" />
                    AI Copilot
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-slate-802 rounded p-3 text-sm">
                    {copilotOutput || (
                      <div className="text-slate-502 italic">
                        Say "copilot" to activate AI analysis...
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Extend Window interface for Speech Recognition
declare global {
  interface Window {
    webkitSpeechRecognition: any
    SpeechRecognition: any
  }
}