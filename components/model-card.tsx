"use client"

import type { LucideIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

interface ModelCardProps {
  id: string
  name: string
  description: string
  category: string
  icon: LucideIcon
  color: string
  performance: number
  usage: number
  isSelected?: boolean
  onSelect?: () => void
}

export function ModelCard({
  id,
  name,
  description,
  category,
  icon: Icon,
  color,
  performance,
  usage,
  isSelected,
  onSelect,
}: ModelCardProps) {
  const getGradient = () => {
    switch (color) {
      case "cyan":
        return "from-cyan-500 to-blue-500"
      case "green":
        return "from-green-500 to-emerald-500"
      case "blue":
        return "from-blue-500 to-indigo-500"
      case "purple":
        return "from-purple-500 to-pink-500"
      default:
        return "from-cyan-500 to-blue-500"
    }
  }

  const getBorderColor = () => {
    switch (color) {
      case "cyan":
        return "border-cyan-500/50"
      case "green":
        return "border-green-500/50"
      case "blue":
        return "border-blue-500/50"
      case "purple":
        return "border-purple-500/50"
      default:
        return "border-cyan-500/50"
    }
  }

  const getIconColor = () => {
    switch (color) {
      case "cyan":
        return "text-cyan-500"
      case "green":
        return "text-green-500"
      case "blue":
        return "text-blue-500"
      case "purple":
        return "text-purple-500"
      default:
        return "text-cyan-500"
    }
  }

  const getBadgeColor = () => {
    switch (color) {
      case "cyan":
        return "bg-cyan-500/20 text-cyan-400 border-cyan-500/30"
      case "green":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "blue":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "purple":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30"
      default:
        return "bg-cyan-500/20 text-cyan-400 border-cyan-500/30"
    }
  }

  return (
    <div
      className={`bg-slate-800/50 rounded-lg border ${
        isSelected ? getBorderColor() : "border-slate-700/50"
      } p-4 relative overflow-hidden cursor-pointer transition-all duration-200 hover:bg-slate-800/70`}
      onClick={onSelect}
    >
      <div className="flex items-center justify-between mb-2">
        <Badge className={getBadgeColor()}>{category}</Badge>
        <Icon className={getIconColor()} />
      </div>
      <div className="text-lg font-medium text-slate-200 mb-1">{name}</div>
      <div className="text-sm text-slate-400 mb-3">{description}</div>
      <div className="space-y-2">
        <div>
          <div className="flex items-center justify-between mb-1">
            <div className="text-xs text-slate-500">Performance</div>
            <div className="text-xs text-cyan-400">{performance}%</div>
          </div>
          <Progress value={performance} className="h-1.5 bg-slate-700">
            <div
              className={`h-full bg-gradient-to-r ${getGradient()} rounded-full`}
              style={{ width: `${performance}%` }}
            />
          </Progress>
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <div className="text-xs text-slate-500">Usage</div>
            <div className="text-xs text-purple-400">{usage}%</div>
          </div>
          <Progress value={usage} className="h-1.5 bg-slate-700">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
              style={{ width: `${usage}%` }}
            />
          </Progress>
        </div>
      </div>
      {isSelected && (
        <div className="absolute -bottom-2 -right-2 h-16 w-16 rounded-full bg-gradient-to-r opacity-20 blur-xl from-cyan-500 to-blue-500"></div>
      )}
    </div>
  )
}
