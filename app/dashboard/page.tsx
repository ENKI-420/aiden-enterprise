"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Brain, Search, Bell, Settings, BarChart3, MessageSquare, FileText, Upload, Users, Clock } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { NotificationPanel } from "@/components/notification-panel"

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showNotifications, setShowNotifications] = useState(false)

  // Update the stats to be genomic-focused
  const stats = [
    {
      title: "Genomic Analysis Accuracy",
      value: "98.7%",
      change: "+2.3%",
      icon: Brain,
      color: "text-[#1E90FF]",
    },
    {
      title: "Health Simulations Run",
      value: "2,847",
      change: "+34%",
      icon: FileText,
      color: "text-[#2E8B57]",
    },
    {
      title: "Active Patients",
      value: "156",
      change: "+18%",
      icon: Users,
      color: "text-[#DC143C]",
    },
    {
      title: "Prediction Accuracy",
      value: "94.2%",
      change: "+5.1%",
      icon: Clock,
      color: "text-[#F8E71C]",
    },
  ]

  // Update recent activity to be healthcare-focused
  const recentActivity = [
    {
      type: "analysis",
      title: "Genomic analysis completed",
      description: "Processed whole genome sequencing for Patient #12847",
      time: "15 minutes ago",
      status: "completed",
    },
    {
      type: "simulation",
      title: "Drug response simulation",
      description: "Analyzed pharmacogenomic interactions for warfarin dosing",
      time: "2 hours ago",
      status: "completed",
    },
    {
      type: "risk",
      title: "Risk assessment updated",
      description: "Cardiovascular risk score recalculated with new data",
      time: "4 hours ago",
      status: "active",
    },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          {/* Update the header */}
          <div>
            <h1 className="text-3xl font-bold text-[#4A4A4A]">Clinical Dashboard</h1>
            <p className="text-[#4A4A4A]/70">Welcome back! Here's your genomic twin platform overview.</p>
          </div>

          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-[#4A4A4A]/50" />
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64"
              />
            </div>

            {/* Notifications */}
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative"
              >
                <Bell className="h-4 w-4" />
                <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 bg-[#FF6F61] text-white text-xs">3</Badge>
              </Button>
              {showNotifications && <NotificationPanel onClose={() => setShowNotifications(false)} />}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#4A4A4A]/70">{stat.title}</p>
                    <p className="text-2xl font-bold text-[#4A4A4A]">{stat.value}</p>
                    <p className={`text-sm ${stat.change.startsWith("+") ? "text-[#3EB489]" : "text-[#FF6F61]"}`}>
                      {stat.change} from last month
                    </p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* AI Twin Status */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  {/* Update the AI Twin Status card */}
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-[#1E90FF]" />
                    Genomic Twin Status
                  </CardTitle>
                  <CardDescription>
                    Your genomic analysis engine's current performance and processing status
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {/* Update the progress labels */}
                    <div className="flex justify-between text-sm">
                      <span>Genomic Processing</span>
                      <span>96%</span>
                    </div>
                    <Progress value={96} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Prediction Accuracy</span>
                      <span>94%</span>
                    </div>
                    <Progress value={94} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Patients Analyzed</span>
                      <span>156 profiles</span>
                    </div>
                    <Progress value={78} className="h-2" />
                  </div>

                  {/* Update the button */}
                  <Button className="w-full bg-[#1E90FF] hover:bg-[#1E90FF]/90">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Genomic Data
                  </Button>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  {/* Update Recent Activity card */}
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-[#2E8B57]" />
                    Recent Clinical Activity
                  </CardTitle>
                  <CardDescription>Latest genomic analyses and health simulations from your platform</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-[#F5F7FA]">
                        <div
                          className={`w-2 h-2 rounded-full mt-2 ${
                            activity.status === "completed" ? "bg-[#3EB489]" : "bg-[#FF6F61]"
                          }`}
                        />
                        <div className="flex-1">
                          <p className="font-medium text-[#4A4A4A]">{activity.title}</p>
                          <p className="text-sm text-[#4A4A4A]/70">{activity.description}</p>
                          <p className="text-xs text-[#4A4A4A]/50 mt-1">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-[#4A90E2]" />
                  Performance Analytics
                </CardTitle>
                <CardDescription>Detailed insights into your AI twin's performance and usage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-[#4A4A4A]/50">
                  Analytics charts would be displayed here
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-[#3EB489]" />
                  Generated Content
                </CardTitle>
                <CardDescription>Content created by your AI twin</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-[#4A4A4A]/50">
                  Content management interface would be displayed here
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-[#FF6F61]" />
                  AI Twin Settings
                </CardTitle>
                <CardDescription>Configure your digital twin's behavior and preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-[#4A4A4A]/50">
                  Settings configuration would be displayed here
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
