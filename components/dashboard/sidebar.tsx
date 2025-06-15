"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Brain, LayoutDashboard, Target, MessageCircle, BookOpen, Settings, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const sidebarNavItems = [
  { title: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { title: "My Goals", href: "/dashboard/goals", icon: Target },
  { title: "Sessions", href: "/dashboard/sessions", icon: MessageCircle },
  { title: "Resources", href: "/dashboard/resources", icon: BookOpen },
  // Coach specific items (conditionally render based on role)
  // { title: "Clients", href: "/dashboard/clients", icon: Users },
  { title: "Settings", href: "/dashboard/settings", icon: Settings },
]

export function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden md:flex md:flex-col md:w-64 border-r bg-background">
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Brain className="h-6 w-6 text-purple-600" />
          <span className="font-serif">LBC Platform</span>
        </Link>
      </div>
      <nav className="flex-1 overflow-y-auto py-4 px-4">
        <ul className="space-y-1">
          {sidebarNavItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted",
                  pathname === item.href && "bg-muted text-primary font-medium",
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="mt-auto p-4 border-t">
        <Button variant="ghost" className="w-full justify-start gap-3">
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </aside>
  )
}
