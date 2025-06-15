import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, FileText, Video, LinkIcon, Filter, Search, UploadCloud } from "lucide-react"
import { Input } from "@/components/ui/input"

// Mock data
const resources = [
  {
    id: "1",
    title: "Strategic Thinking Workbook",
    type: "Document",
    format: "PDF",
    dateAdded: "2025-06-01",
    category: "Strategy",
  },
  {
    id: "2",
    title: "Effective Delegation Techniques",
    type: "Article",
    format: "Web Link",
    dateAdded: "2025-05-20",
    category: "Leadership",
  },
  {
    id: "3",
    title: "Mindfulness for Executives",
    type: "Video",
    format: "MP4",
    dateAdded: "2025-05-10",
    category: "Wellbeing",
  },
  {
    id: "4",
    title: "Q2 Market Analysis Report",
    type: "Document",
    format: "PDF",
    dateAdded: "2025-04-25",
    category: "Analytics",
  },
]

const getIconForType = (type: string) => {
  switch (type) {
    case "Document":
      return <FileText className="h-5 w-5 text-blue-500" />
    case "Article":
      return <LinkIcon className="h-5 w-5 text-green-500" />
    case "Video":
      return <Video className="h-5 w-5 text-red-500" />
    default:
      return <FileText className="h-5 w-5 text-gray-500" />
  }
}

export default function ResourcesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-serif font-bold flex items-center gap-2">
          <BookOpen className="h-7 w-7 text-purple-600" /> Resources
        </h1>
        <Button className="bg-purple-600 hover:bg-purple-700 text-white">
          <UploadCloud className="mr-2 h-4 w-4" /> Upload New Resource
        </Button>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input placeholder="Search resources..." className="pl-10" />
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" /> Filter by Category
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {resources.map((resource) => (
              <Card key={resource.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {getIconForType(resource.type)}
                    <div>
                      <h3 className="font-medium">{resource.title}</h3>
                      <p className="text-xs text-muted-foreground">
                        {resource.type} ({resource.format}) - Added: {new Date(resource.dateAdded).toLocaleDateString()}{" "}
                        - Category: {resource.category}
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          {resources.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Resources Available</h3>
              <p className="text-muted-foreground">
                Your coach will add relevant resources here, or you can upload your own.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
