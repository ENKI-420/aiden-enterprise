"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Shield } from "lucide-react"
import { cn } from "@/lib/utils"

const navigationItems = [
  { title: "Platform", href: "/dashboard" },
  { title: "Executive Blog", href: "/executive-blog" },
  { title: "M³C Bootcamp", href: "/m3c-bootcamp" },
  { title: "Digital Assets", href: "/digital-assets" },
  { title: "Investor Dossier", href: "/investor-dossier" },
]

export function MainNav() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-gold-500 flex items-center justify-center font-bold text-navy-900 text-sm">
              ADS
            </div>
            <span className="hidden font-serif font-bold sm:inline-block">Agile Defense Systems</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "transition-colors hover:text-foreground/80",
                  pathname === item.href ? "text-foreground" : "text-foreground/60",
                )}
              >
                {item.title}
              </Link>
            ))}
          </nav>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0">
            <MobileNav />
          </SheetContent>
        </Sheet>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <Link href="/" className="flex items-center space-x-2 md:hidden">
              <div className="h-6 w-6 rounded bg-gold-500 flex items-center justify-center font-bold text-navy-900 text-xs">
                ADS
              </div>
              <span className="font-serif font-bold text-sm">Agile Defense</span>
            </Link>
          </div>
          <nav className="flex items-center">
            <Button asChild size="sm" className="bg-gold-500 hover:bg-gold-600 text-navy-900">
              <Link href="/dashboard">
                <Shield className="mr-2 h-4 w-4" />
                Access Platform
              </Link>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  )
}

function MobileNav() {
  const pathname = usePathname()

  return (
    <div className="flex flex-col space-y-3">
      <Link href="/" className="flex items-center space-x-2">
        <div className="h-6 w-6 rounded bg-gold-500 flex items-center justify-center font-bold text-navy-900 text-xs">
          ADS
        </div>
        <span className="font-serif font-bold">Agile Defense Systems</span>
      </Link>
      <div className="flex flex-col space-y-3 pt-6">
        {navigationItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              pathname === item.href ? "text-foreground" : "text-foreground/70",
            )}
          >
            {item.title}
          </Link>
        ))}
      </div>
    </div>
  )
}
