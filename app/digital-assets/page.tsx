import { MainNav } from "@/components/shared/main-nav"
import { SiteFooter } from "@/components/shared/footer"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ShoppingCart, Zap, BookOpen, Edit3, FileText } from "lucide-react"

// Mock digital assets
const assets = [
  {
    id: "1",
    title: "Strategic Leadership Workbook",
    price: "$49.99",
    category: "Workbooks",
    icon: <BookOpen className="h-6 w-6 text-purple-500" />,
  },
  {
    id: "2",
    title: "AI for Executives Micro-Course",
    price: "$199.99",
    category: "Courses",
    icon: <Zap className="h-6 w-6 text-blue-500" />,
  },
  {
    id: "3",
    title: "Team Performance Assessment Toolkit",
    price: "$79.99",
    category: "Toolkits",
    icon: <Edit3 className="h-6 w-6 text-green-500" />,
  },
  {
    id: "4",
    title: "Annual Business Planning Templates",
    price: "$29.99",
    category: "Templates",
    icon: <FileText className="h-6 w-6 text-yellow-500" />,
  },
]

export default function DigitalAssetsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <MainNav />
      <main className="flex-1 py-12 md:py-16 lg:py-20 bg-gray-50 dark:bg-gray-950">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <ShoppingCart className="h-12 w-12 text-purple-600 mx-auto mb-4" />
            <h1 className="text-4xl font-serif font-bold tracking-tighter sm:text-5xl">Digital Asset Shop</h1>
            <p className="mt-3 max-w-2xl mx-auto text-gray-600 md:text-xl dark:text-gray-400">
              Premium resources to complement your executive coaching journey.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {assets.map((asset) => (
              <Card key={asset.id} className="flex flex-col shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">
                      {asset.category}
                    </span>
                    {asset.icon}
                  </div>
                  <CardTitle className="text-lg font-serif">{asset.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-1">{/* Placeholder for a short description if needed */}</CardContent>
                <CardFooter className="flex justify-between items-center">
                  <span className="text-xl font-semibold text-purple-600 dark:text-purple-400">{asset.price}</span>
                  <Button
                    variant="outline"
                    asChild
                    className="border-purple-600 text-purple-600 hover:bg-purple-50 dark:border-purple-400 dark:text-purple-400 dark:hover:bg-purple-900/30"
                  >
                    <Link href={`/digital-assets/${asset.id}`}>View Details</Link>
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
