import { MainNav } from "@/components/shared/main-nav"
import { SiteFooter } from "@/components/shared/footer"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Users, Zap, BarChart, ArrowRight } from "lucide-react"

// Mock bootcamps
const bootcamps = [
  {
    id: "1",
    title: "M³C Executive Accelerator",
    duration: "12 Weeks",
    focus: "Strategic Leadership & AI Integration",
    nextCohort: "September 2025",
    icon: <Zap className="h-8 w-8 text-white" />,
  },
  {
    id: "2",
    title: "High-Performance Team Mastery",
    duration: "8 Weeks",
    focus: "Team Dynamics & Productivity",
    nextCohort: "October 2025",
    icon: <Users className="h-8 w-8 text-white" />,
  },
  {
    id: "3",
    title: "Data-Driven Decision Making for Leaders",
    duration: "6 Weeks",
    focus: "Analytics & Business Intelligence",
    nextCohort: "November 2025",
    icon: <BarChart className="h-8 w-8 text-white" />,
  },
]

export default function M3CBootcampPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <MainNav />
      <main className="flex-1 py-12 md:py-16 lg:py-20 bg-gray-50 dark:bg-gray-950">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-serif font-bold tracking-tighter sm:text-5xl">M³C Bootcamp Portal</h1>
            <p className="mt-3 max-w-2xl mx-auto text-gray-600 md:text-xl dark:text-gray-400">
              Cohort-based executive coaching programs for accelerated growth.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {bootcamps.map((bootcamp) => (
              <Card
                key={bootcamp.id}
                className="flex flex-col shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-purple-600 to-blue-600 text-white"
              >
                <CardHeader>
                  <div className="flex items-center justify-center h-16 w-16 rounded-full bg-white/20 mb-4">
                    {bootcamp.icon}
                  </div>
                  <CardTitle className="mt-1 text-2xl font-serif">{bootcamp.title}</CardTitle>
                  <CardDescription className="text-sm text-purple-200">{bootcamp.duration} Program</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="font-semibold">
                    Focus: <span className="font-normal">{bootcamp.focus}</span>
                  </p>
                  <p className="mt-1 font-semibold">
                    Next Cohort: <span className="font-normal">{bootcamp.nextCohort}</span>
                  </p>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="outline"
                    asChild
                    className="w-full bg-white text-purple-700 hover:bg-gray-100 border-transparent"
                  >
                    <Link href={`/m3c-bootcamp/${bootcamp.id}`}>
                      Learn More & Enroll <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
