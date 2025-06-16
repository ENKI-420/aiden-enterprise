"use client"

import React from "react"

import { Code, MessageSquare, Music, Video, ImageIcon } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

const models = [
  {
    id: "luuna-70b",
    name: "Luuna-70B",
    description: "Our flagship large language model with 70B parameters",
    category: "Text",
    icon: MessageSquare,
    color: "cyan",
    performance: 92,
    usage: 78,
  },
  {
    id: "luuna-vision",
    name: "Luuna Vision",
    description: "Multimodal model for image understanding and generation",
    category: "Vision",
    icon: ImageIcon,
    color: "purple",
    performance: 88,
    usage: 65,
  },
  {
    id: "luuna-code",
    name: "Luuna Code",
    description: "Specialized model for code generation and completion",
    category: "Code",
    icon: Code,
    color: "green",
    performance: 85,
    usage: 72,
  },
  {
    id: "luuna-7b",
    name: "Luuna-7B",
    description: "Lightweight model optimized for edge devices",
    category: "Text",
    icon: MessageSquare,
    color: "blue",
    performance: 82,
    usage: 58,
  },
  {
    id: "luuna-audio",
    name: "Luuna Audio",
    description: "Speech recognition and audio processing model",
    category: "Audio",
    icon: Music,
    color: "amber",
    performance: 79,
    usage: 45,
  },
  {
    id: "luuna-video",
    name: "Luuna Video",
    description: "Video understanding and generation model",
    category: "Video",
    icon: Video,
    color: "red",
    performance: 76,
    usage: 38,
  },
]

export function AIModels() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {models.map((model) => (
        <Card key={model.id} className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <Badge className={`bg-${model.color}-500/20 text-${model.color}-400 border-${model.color}-500/30`}>
                {model.category}
              </Badge>
              {React.createElement(model.icon, { className: `h-5 w-5 text-${model.color}-500` })}
            </div>
            <CardTitle className="text-slate-100 mt-2">{model.name}</CardTitle>
            <CardDescription className="text-slate-400">{model.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="text-xs text-slate-500">Performance</div>
                  <div className="text-xs text-cyan-400">{model.performance}%</div>
                </div>
                <Progress value={model.performance} className="h-1.5 bg-slate-800">
                  <div
                    className={`h-full bg-gradient-to-r from-${model.color}-500 to-${model.color}-400 rounded-full`}
                    style={{ width: `${model.performance}%` }}
                  />
                </Progress>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="text-xs text-slate-500">Usage</div>
                  <div className="text-xs text-purple-400">{model.usage}%</div>
                </div>
                <Progress value={model.usage} className="h-1.5 bg-slate-800">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                    style={{ width: `${model.usage}%` }}
                  />
                </Progress>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-slate-800 hover:bg-slate-700 text-slate-100">Try Model</Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
