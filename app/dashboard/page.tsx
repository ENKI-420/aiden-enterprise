import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Activity, Target, MessageSquare, CalendarDays, FileText, Zap, BookOpen } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  // Mock data - replace with actual data fetching
  const user = { name: "Alex Chen", role: "Executive Client" }
  const upcomingSession = { date: "June 15, 2025", time: "2:00 PM PST", topic: "Strategic Planning Q3" }
  const activeGoals = [
    { id: "1", title: "Improve team leadership skills", progress: 60 },
    { id: "2", title: "Develop Q3 strategic plan", progress: 30 },
    { id: "3", title: "Enhance public speaking confidence", progress: 75 },
  ]
  const recentActivity = [
    { id: "1", type: "Session Summary", title: "Completed: Q2 Review & Goal Setting", date: "June 1, 2025" },
    { id: "2", type: "Resource Added", title: "New: 'Effective Delegation' Workbook", date: "June 3, 2025" },
    { id: "3", type: "Goal Update", title: "Progress on 'Team Leadership'", date: "June 5, 2025" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold">Welcome back, {user.name.split(" ")[0]}!</h1>
          <p className="text-gray-500">Here’s your executive coaching overview.</p>
        </div>
        <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
          <Link href="/dashboard/sessions/new">
            <CalendarDays className="mr-2 h-4 w-4" /> Schedule Session
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Upcoming Session */}
        <Card className="shadow-md border border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium uppercase tracking-wide">Upcoming Session</CardTitle>
            <CalendarDays className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-semibold">{upcomingSession.date}</div>
            <p className="text-xs text-gray-500 mt-1">
              {upcomingSession.time} — {upcomingSession.topic}
            </p>
            <Button variant="outline" size="sm" className="mt-3 border-gray-300">
              View Details
            </Button>
          </CardContent>
        </Card>

        {/* Active Goals */}
        <Card className="shadow-md border border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium uppercase tracking-wide">Active Goals</CardTitle>
            <Target className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-semibold">{activeGoals.length}</div>
            <p className="text-xs text-gray-500 mt-1">
              {activeGoals.filter((g) => g.progress < 100).length} ongoing,{" "}
              {activeGoals.filter((g) => g.progress === 100).length} completed
            </p>
            <Button variant="outline" size="sm" className="mt-3 border-gray-300" asChild>
              <Link href="/dashboard/goals">Manage Goals</Link>
            </Button>
          </CardContent>
        </Card>

        {/* AI Insights (AIDEN) */}
        <Card className="shadow-md border border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium uppercase tracking-wide">AI Insights</CardTitle>
            <Zap className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 line-clamp-2">
              AIDEN recommends prioritizing delegation techniques this week based on recent journal insights.
            </p>
            <Button variant="link" size="sm" className="px-0 mt-2 text-blue-600 hover:text-blue-800">
              Explore Insights
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Activity */}
        <Card className="shadow-md border border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 uppercase tracking-wide text-sm font-medium">
              <Activity className="h-5 w-5" /> Recent Activity
            </CardTitle>
            <CardDescription>Latest updates from your coaching journey.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-2">
                <div className="flex-shrink-0 pt-1">
                  {activity.type === "Session Summary" && <MessageSquare className="h-4 w-4 text-blue-500" />}
                  {activity.type === "Resource Added" && <FileText className="h-4 w-4 text-green-500" />}
                  {activity.type === "Goal Update" && <Target className="h-4 w-4 text-yellow-500" />}
                </div>
                <div>
                  <p className="text-sm font-medium">{activity.title}</p>
                  <p className="text-xs text-gray-500">
                    {activity.date} — {activity.type}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Key Resources */}
        <Card className="shadow-md border border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 uppercase tracking-wide text-sm font-medium">
              <BookOpen className="h-5 w-5" /> Key Resources
            </CardTitle>
            <CardDescription>Access important coaching tools.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="#" className="flex items-center gap-2 text-sm text-blue-600 hover:underline">
              <FileText className="h-4 w-4" /> Leadership Self-Assessment Q2.pdf
            </Link>
            <Link href="#" className="flex items-center gap-2 text-sm text-blue-600 hover:underline">
              <FileText className="h-4 w-4" /> Strategic Thinking Workbook.docx
            </Link>
            <Link href="#" className="flex items-center gap-2 text-sm text-blue-600 hover:underline">
              <Zap className="h-4 w-4" /> AIDEN Goal Prioritization Tool
            </Link>
            <Button variant="outline" size="sm" className="mt-2 border-gray-300" asChild>
              <Link href="/dashboard/resources">View All Resources</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
