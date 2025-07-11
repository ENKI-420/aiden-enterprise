"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, Bell, CheckCircle, AlertCircle, Info } from "lucide-react"

interface NotificationPanelProps {
  onClose: () => void
}

export function NotificationPanel({ onClose }: NotificationPanelProps) {
  const notifications = [
    {
      id: 1,
      type: "success",
      title: "AI Twin Training Complete",
      message: "Your digital twin has finished processing 150 new data points.",
      time: "2 minutes ago",
      unread: true,
    },
    {
      id: 2,
      type: "info",
      title: "New Feature Available",
      message: "Advanced personality tuning is now available in your settings.",
      time: "1 hour ago",
      unread: true,
    },
    {
      id: 3,
      type: "warning",
      title: "Data Sync Needed",
      message: "Connect more data sources to improve your AI twin's accuracy.",
      time: "3 hours ago",
      unread: false,
    },
  ]

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-[#3EB489]" />
      case "warning":
        return <AlertCircle className="h-4 w-4 text-[#F8E71C]" />
      case "info":
        return <Info className="h-4 w-4 text-[#4A90E2]" />
      default:
        return <Bell className="h-4 w-4 text-[#4A4A4A]" />
    }
  }

  return (
    <div className="absolute right-0 top-12 w-80 z-50">
      <Card className="border-0 shadow-xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg">Notifications</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-3 rounded-lg border ${
                notification.unread ? "bg-[#F5F7FA] border-[#4A90E2]/20" : "bg-white border-gray-200"
              }`}
            >
              <div className="flex items-start gap-3">
                {getIcon(notification.type)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-[#4A4A4A]">{notification.title}</p>
                    {notification.unread && <Badge className="h-2 w-2 p-0 bg-[#FF6F61]" />}
                  </div>
                  <p className="text-sm text-[#4A4A4A]/70 mt-1">{notification.message}</p>
                  <p className="text-xs text-[#4A4A4A]/50 mt-2">{notification.time}</p>
                </div>
              </div>
            </div>
          ))}

          <div className="pt-2 border-t">
            <Button variant="ghost" className="w-full text-[#4A90E2] hover:text-[#4A90E2]/80">
              View All Notifications
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
