import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CalendarDays, PlusCircle, Video, FileText, MessageSquare } from "lucide-react"

// Mock data
const sessions = [
  {
    id: "1",
    date: "2025-06-15",
    time: "2:00 PM PST",
    topic: "Strategic Planning Q3",
    status: "Upcoming",
    type: "Video Call",
    summaryLink: "#",
    notesLink: "#",
  },
  {
    id: "2",
    date: "2025-06-01",
    time: "10:00 AM PST",
    topic: "Q2 Review & Goal Setting",
    status: "Completed",
    type: "Video Call",
    summaryLink: "#",
    notesLink: "#",
  },
  {
    id: "3",
    date: "2025-05-15",
    time: "3:00 PM PST",
    topic: "Leadership Style Assessment",
    status: "Completed",
    type: "In-Person",
    summaryLink: "#",
    notesLink: "#",
  },
]

export default function SessionsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-serif font-bold flex items-center gap-2">
          <MessageSquare className="h-7 w-7 text-purple-600" /> Coaching Sessions
        </h1>
        <Button className="bg-purple-600 hover:bg-purple-700 text-white">
          <PlusCircle className="mr-2 h-4 w-4" /> Schedule New Session
        </Button>
      </div>

      <div className="grid gap-6">
        {sessions.map((session) => (
          <Card key={session.id} className="shadow-sm">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">{session.topic}</CardTitle>
                  <CardDescription className="mt-1">
                    {new Date(session.date).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}{" "}
                    at {session.time}
                  </CardDescription>
                </div>
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    session.status === "Upcoming"
                      ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                      : "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                  }`}
                >
                  {session.status}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-muted-foreground mb-4">
                <Video className="h-4 w-4 mr-2" /> {session.type}
              </div>
              <div className="flex gap-2">
                {session.status === "Upcoming" && <Button variant="outline">Reschedule</Button>}
                {session.status === "Completed" && (
                  <>
                    <Button variant="outline" size="sm">
                      <FileText className="mr-2 h-3 w-3" /> View Summary
                    </Button>
                    <Button variant="outline" size="sm">
                      <MessageSquare className="mr-2 h-3 w-3" /> View Notes
                    </Button>
                  </>
                )}
                <Button variant="default" size="sm" className="bg-purple-500 hover:bg-purple-600 text-white">
                  {session.status === "Upcoming" ? "Join Meeting" : "Review Session"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {sessions.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <CalendarDays className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Sessions Scheduled</h3>
            <p className="text-muted-foreground mb-4">Coordinate with your coach to schedule your first session.</p>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white">
              <PlusCircle className="mr-2 h-4 w-4" /> Schedule a Session
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
