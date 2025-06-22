"use client";

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { AnimatePresence, motion } from 'framer-motion';
import {
    Brain,
    Camera,
    FileAudio,
    FileImage,
    FileText,
    FileVideo,
    Mic,
    MicOff,
    Minimize2,
    Monitor,
    Send,
    User,
    X
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  type: 'text' | 'image' | 'document' | 'voice' | 'screen';
  attachments?: {
    type: 'image' | 'document' | 'video' | 'audio';
    url: string;
    name: string;
    size?: number;
  }[];
  metadata?: {
    model?: string;
    confidence?: number;
    processingTime?: number;
    tokens?: number;
  };
}

interface AIAssistantProps {
  isOpen?: boolean;
  onToggle?: () => void;
  userRole?: string;
  context?: any;
}

export default function AdvancedAIAssistant({
  isOpen = false,
  onToggle,
  userRole = 'professional',
  context
}: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  const [isRecording, setIsRecording] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [settings, setSettings] = useState({
    autoTranscribe: true,
    voiceCommands: true,
    screenCapture: true,
    documentScanning: true,
    realTimeAnalysis: true,
    privacyMode: false
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recognitionRef = useRef<any>(null);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize voice recognition
  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          }
        }
        if (finalTranscript) {
          setInput(prev => prev + finalTranscript);
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
      };
    }
  }, []);

  const handleSendMessage = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: generateAIResponse(input),
        timestamp: new Date(),
        type: 'text',
        metadata: {
          model: 'Aiden Engine v2.1',
          confidence: 0.95,
          processingTime: 1200,
          tokens: 150
        }
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (userInput: string): string => {
    const responses = [
      `I've analyzed your query about "${userInput.substring(0, 30)}${userInput.length > 30 ? '...' : ''}". Based on the Aiden Engine's multi-modal analysis, here are the key insights and recommendations.`,
      `Excellent question! The Aiden Engine has processed your request and identified several relevant patterns. Let me provide you with actionable insights.`,
      `Based on your input, I've leveraged the Aiden Engine's advanced AI capabilities to generate a comprehensive response tailored to your needs.`
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const toggleVoiceRecording = () => {
    if (isRecording) {
      stopVoiceRecording();
    } else {
      startVoiceRecording();
    }
  };

  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);

        const voiceMessage: Message = {
          id: Date.now().toString(),
          role: 'user',
          content: '[Voice Message]',
          timestamp: new Date(),
          type: 'voice',
          attachments: [{
            type: 'audio',
            url,
            name: 'voice-message.webm',
            size: blob.size
          }]
        };

        setMessages(prev => [...prev, voiceMessage]);
        setIsRecording(false);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting voice recording:', error);
    }
  };

  const stopVoiceRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      streamRef.current?.getTracks().forEach(track => track.stop());
    }
  };

  const toggleScreenShare = async () => {
    if (isScreenSharing) {
      stopScreenShare();
    } else {
      startScreenShare();
    }
  };

  const startScreenShare = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      const videoTrack = stream.getVideoTracks()[0];

      videoTrack.onended = () => {
        setIsScreenSharing(false);
      };

      setIsScreenSharing(true);

      // Add screen share message
      const screenMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: '[Screen Share Started]',
        timestamp: new Date(),
        type: 'screen'
      };

      setMessages(prev => [...prev, screenMessage]);
    } catch (error) {
      console.error('Error starting screen share:', error);
    }
  };

  const stopScreenShare = () => {
    setIsScreenSharing(false);
  };

  const handleDocumentScan = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*,.pdf,.doc,.docx';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const url = URL.createObjectURL(file);
        const documentMessage: Message = {
          id: Date.now().toString(),
          role: 'user',
          content: `[Document: ${file.name}]`,
          timestamp: new Date(),
          type: 'document',
          attachments: [{
            type: file.type.startsWith('image/') ? 'image' : 'document',
            url,
            name: file.name,
            size: file.size
          }]
        };

        setMessages(prev => [...prev, documentMessage]);
      }
    };
    input.click();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (isMinimized) {
    return (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="fixed bottom-4 right-4 z-50"
      >
        <button
          onClick={() => setIsMinimized(false)}
          className="relative bg-gradient-to-r from-primary to-secondary text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all group"
          aria-label="Open AI Assistant"
        >
          <Brain className="w-6 h-6" />
          <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Aiden Engine AI Assistant
          </span>
        </button>
      </motion.div>
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          className="fixed bottom-4 right-4 w-96 h-[600px] z-50"
        >
          <Card className="h-full shadow-2xl border-2 border-primary/20 overflow-hidden bg-slate-900/95 backdrop-blur-sm">
            {/* Header */}
            <CardHeader className="bg-gradient-to-r from-primary to-secondary text-white p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  <CardTitle className="text-lg">Aiden Engine AI</CardTitle>
                  <Badge variant="secondary" className="bg-white/20 text-white text-xs">
                    v2.1
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsMinimized(true)}
                    className="text-white/80 hover:text-white hover:bg-white/10"
                  >
                    <Minimize2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onToggle}
                    className="text-white/80 hover:text-white hover:bg-white/10"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
              <TabsList className="grid w-full grid-cols-3 bg-slate-800/50">
                <TabsTrigger value="chat" className="text-xs">Chat</TabsTrigger>
                <TabsTrigger value="tools" className="text-xs">Tools</TabsTrigger>
                <TabsTrigger value="settings" className="text-xs">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="chat" className="flex-1 p-0">
                {/* Messages */}
                <ScrollArea className="h-[400px] p-4">
                  <div className="space-y-4">
                    {messages.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-64 text-center">
                        <Brain className="h-12 w-12 text-primary mb-4" />
                        <h3 className="text-lg font-medium text-slate-400">Aiden Engine AI Assistant</h3>
                        <p className="text-sm text-slate-500 max-w-md mt-2">
                          I'm here to help with advanced AI analysis, document processing, and multi-modal interactions.
                        </p>
                      </div>
                    ) : (
                      messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex items-start space-x-3 ${
                            message.role === 'user' ? 'justify-end' : 'justify-start'
                          }`}
                        >
                          {message.role === 'assistant' && (
                            <Avatar className="h-8 w-8 mt-1">
                              <AvatarFallback className="bg-primary text-white">
                                <Brain className="w-4 h-4" />
                              </AvatarFallback>
                            </Avatar>
                          )}

                          <div
                            className={`max-w-[80%] rounded-lg px-4 py-2 text-sm ${
                              message.role === 'user'
                                ? 'bg-primary/20 border border-primary/30 text-slate-200'
                                : 'bg-slate-800/70 border border-slate-700/50 text-slate-300'
                            }`}
                          >
                            <div className="whitespace-pre-wrap">{message.content}</div>

                            {message.attachments && message.attachments.length > 0 && (
                              <div className="mt-2 space-y-2">
                                {message.attachments.map((attachment, index) => (
                                  <div key={index} className="flex items-center gap-2 text-xs text-slate-400">
                                    {attachment.type === 'image' && <FileImage className="w-4 h-4" />}
                                    {attachment.type === 'document' && <FileText className="w-4 h-4" />}
                                    {attachment.type === 'video' && <FileVideo className="w-4 h-4" />}
                                    {attachment.type === 'audio' && <FileAudio className="w-4 h-4" />}
                                    <span>{attachment.name}</span>
                                    {attachment.size && (
                                      <span>({(attachment.size / 1024).toFixed(1)}KB)</span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}

                            {message.metadata && (
                              <div className="mt-2 pt-2 border-t border-slate-700/30">
                                <div className="flex items-center justify-between text-xs text-slate-500">
                                  <span>{message.metadata.model}</span>
                                  <span>{message.timestamp.toLocaleTimeString()}</span>
                                </div>
                              </div>
                            )}
                          </div>

                          {message.role === 'user' && (
                            <Avatar className="h-8 w-8 mt-1">
                              <AvatarFallback className="bg-secondary text-white">
                                <User className="w-4 h-4" />
                              </AvatarFallback>
                            </Avatar>
                          )}
                        </div>
                      ))
                    )}

                    {isTyping && (
                      <div className="flex items-start space-x-3">
                        <Avatar className="h-8 w-8 mt-1">
                          <AvatarFallback className="bg-primary text-white">
                            <Brain className="w-4 h-4" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="bg-slate-800/70 border border-slate-700/50 rounded-lg px-4 py-2">
                          <div className="flex items-center space-x-2">
                            <div className="h-2 w-2 rounded-full bg-primary animate-pulse"></div>
                            <div className="h-2 w-2 rounded-full bg-primary animate-pulse delay-150"></div>
                            <div className="h-2 w-2 rounded-full bg-primary animate-pulse delay-300"></div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                {/* Input Area */}
                <div className="p-4 border-t border-slate-700/50">
                  <div className="flex items-end space-x-2">
                    <div className="flex-1 relative">
                      <Textarea
                        ref={inputRef}
                        placeholder="Ask me anything..."
                        className="min-h-[60px] resize-none bg-slate-800/50 border-slate-700/50 focus:border-primary/50 focus:ring-primary/20 text-slate-200"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                      />

                      {/* Quick Actions */}
                      <div className="absolute bottom-2 right-2 flex space-x-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 rounded-full bg-slate-700/50 text-slate-400 hover:text-slate-200"
                          onClick={handleDocumentScan}
                        >
                          <FileText className="h-3 w-3" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 rounded-full bg-slate-700/50 text-slate-400 hover:text-slate-200"
                          onClick={toggleVoiceRecording}
                        >
                          {isRecording ? <MicOff className="h-3 w-3" /> : <Mic className="h-3 w-3" />}
                        </Button>
                      </div>
                    </div>

                    <Button
                      onClick={handleSendMessage}
                      disabled={!input.trim() || isTyping}
                      className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="tools" className="flex-1 p-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-200">AI Tools & Capabilities</h3>

                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      className="h-20 flex flex-col items-center justify-center space-y-2 border-slate-700 hover:border-primary"
                      onClick={toggleScreenShare}
                    >
                      <Monitor className="w-6 h-6 text-primary" />
                      <span className="text-xs">Screen Share</span>
                    </Button>

                    <Button
                      variant="outline"
                      className="h-20 flex flex-col items-center justify-center space-y-2 border-slate-700 hover:border-primary"
                      onClick={handleDocumentScan}
                    >
                      <FileText className="w-6 h-6 text-primary" />
                      <span className="text-xs">Document Scan</span>
                    </Button>

                    <Button
                      variant="outline"
                      className="h-20 flex flex-col items-center justify-center space-y-2 border-slate-700 hover:border-primary"
                      onClick={toggleVoiceRecording}
                    >
                      <Mic className="w-6 h-6 text-primary" />
                      <span className="text-xs">Voice Input</span>
                    </Button>

                    <Button
                      variant="outline"
                      className="h-20 flex flex-col items-center justify-center space-y-2 border-slate-700 hover:border-primary"
                    >
                      <Camera className="w-6 h-6 text-primary" />
                      <span className="text-xs">Image Analysis</span>
                    </Button>
                  </div>

                  <div className="mt-6 p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
                    <h4 className="text-sm font-medium text-slate-200 mb-2">Active Features</h4>
                    <div className="space-y-2 text-xs text-slate-400">
                      <div className="flex items-center justify-between">
                        <span>Real-time Analysis</span>
                        <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                          Active
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Multi-modal Processing</span>
                        <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                          Active
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Voice Commands</span>
                        <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                          Active
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="settings" className="flex-1 p-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-200">AI Assistant Settings</h3>

                  <div className="space-y-4">
                    {Object.entries(settings).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <Label htmlFor={key} className="text-sm text-slate-300">
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </Label>
                        <Switch
                          id={key}
                          checked={value}
                          onCheckedChange={(checked) =>
                            setSettings(prev => ({ ...prev, [key]: checked }))
                          }
                        />
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-slate-700/50">
                    <h4 className="text-sm font-medium text-slate-200 mb-2">Voice Sensitivity</h4>
                    <Slider
                      defaultValue={[50]}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                  </div>

                  <div className="pt-4 border-t border-slate-700/50">
                    <h4 className="text-sm font-medium text-slate-200 mb-2">Response Speed</h4>
                    <Slider
                      defaultValue={[75]}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}