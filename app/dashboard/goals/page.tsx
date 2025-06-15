import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Target, PlusCircle, Edit, Trash2 } from "lucide-react"
import { Progress } from "@/components/ui/progress" // Assuming you have a Progress component

// Mock data
const goals = [
  {
    id: "1",
    title: "Improve team leadership skills",
    description: "Focus on delegation, motivation, and conflict resolution.",
    status: "In Progress",
    progress: 60,
    dueDate: "2025-08-31",
  },
  {
    id: "2",
    title: "Develop Q3 strategic plan",
    description: "Finalize market analysis, define key objectives, and allocate resources.",
    status: "In Progress",
    progress: 30,
    dueDate: "2025-07-15",
  },
  {
    id: "3",
    title: "Enhance public speaking confidence",
    description: "Deliver 3 internal presentations and seek feedback.",
    status: "Completed",
    progress: 100,
    dueDate: "2025-05-30",
  },
  {
    id: "4",
    title: "Expand professional network in new industry",
    description: "Attend 2 industry events and connect with 10 new contacts.",
    status: "Not Started",
    progress: 0,
    dueDate: "2025-09-30",
  },
]

export default function GoalsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-serif font-bold flex items-center gap-2">
          <Target className="h-7 w-7 text-purple-600" /> My Goals
        </h1>
        <Button className="bg-purple-600 hover:bg-purple-700 text-white">
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Goal
        </Button>
      </div>

      <div className="grid gap-6">
        {goals.map((goal) => (
          <Card key={goal.id} className="shadow-sm">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">{goal.title}</CardTitle>
                  <CardDescription className="mt-1">{goal.description}</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    goal.status === "Completed"
                      ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                      : goal.status === "In Progress"
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                        : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                  }`}
                >
                  {goal.status}
                </span>
                <span className="text-xs text-muted-foreground">
                  Due: {new Date(goal.dueDate).toLocaleDateString()}
                </span>
              </div>
              <Progress
                value={goal.progress}
                className="w-full h-2"
                indicatorClassName={goal.status === "Completed" ? "bg-green-500" : "bg-purple-500"}
              />
              <p className="text-xs text-muted-foreground mt-1 text-right">{goal.progress}% complete</p>
            </CardContent>
          </Card>
        ))}
      </div>
      {goals.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Goals Yet</h3>
            <p className="text-muted-foreground mb-4">Start defining your objectives to track your progress.</p>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white">
              <PlusCircle className="mr-2 h-4 w-4" /> Add Your First Goal
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
