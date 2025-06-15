import { MainNav } from "@/components/shared/main-nav"
import { SiteFooter } from "@/components/shared/footer"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

// Mock blog posts
const posts = [
  {
    id: "1",
    title: "The Art of Strategic Delegation for Executives",
    date: "June 5, 2025",
    excerpt: "Learn how effective delegation can free up your time, empower your team, and drive better results...",
    category: "Leadership",
  },
  {
    id: "2",
    title: "Navigating Q3 with AI-Driven Market Insights",
    date: "May 28, 2025",
    excerpt:
      "Discover how AI can help you understand market trends and make data-backed decisions for the upcoming quarter...",
    category: "AI & Strategy",
  },
  {
    id: "3",
    title: "Building High-Performance Teams in a Hybrid World",
    date: "May 15, 2025",
    excerpt:
      "Strategies for fostering collaboration, communication, and productivity in remote and hybrid team environments...",
    category: "Team Building",
  },
]

export default function ExecutiveBlogPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <MainNav />
      <main className="flex-1 py-12 md:py-16 lg:py-20 bg-gray-50 dark:bg-gray-950">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-serif font-bold tracking-tighter sm:text-5xl">Thought Leadership Salon</h1>
            <p className="mt-3 max-w-2xl mx-auto text-gray-600 md:text-xl dark:text-gray-400">
              Insights, strategies, and playbooks for executive excellence.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Card key={post.id} className="flex flex-col shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <span className="text-xs text-purple-600 dark:text-purple-400 font-semibold uppercase tracking-wider">
                    {post.category}
                  </span>
                  <CardTitle className="mt-1 text-xl font-serif">{post.title}</CardTitle>
                  <CardDescription className="text-sm text-gray-500 dark:text-gray-400">{post.date}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-gray-700 dark:text-gray-300 line-clamp-3">{post.excerpt}</p>
                </CardContent>
                <CardFooter>
                  <Button variant="link" asChild className="text-purple-600 dark:text-purple-400 px-0">
                    <Link href={`/executive-blog/${post.id}`}>
                      Read More <ArrowRight className="ml-1 h-4 w-4" />
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
