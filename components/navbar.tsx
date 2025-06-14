"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Zap } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { label: "Capabilities", href: "#capabilities" },
    { label: "Use Cases", href: "#use-cases" },
    { label: "Testimonials", href: "#testimonials" },
    { label: "Contact", href: "#contact" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-md">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="flex items-center space-x-2"
            aria-label="Agile Defense Systems Homepage"
          >
            <span className="text-2xl font-bold tracking-tight text-primary">Agile Defense</span>
            <span className="text-sm font-medium text-muted-foreground">AIDEN Enterprise</span>
          </Link>
        </div>

        <nav className="hidden md:flex gap-6" aria-label="Main Navigation">
          {navItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <ThemeToggle />

          <Button
            asChild
            className="hidden md:flex items-center gap-3 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-xl border-0 h-auto shadow-[0_0_10px_rgba(36,101,237,0.4)]"
          >
            <Link href="#contact">
              <Zap className="h-4 w-4 text-white" />
              <div className="flex flex-col items-start">
                <span className="text-sm font-semibold">Request Demo</span>
                <span className="text-xs text-gray-300 -mt-0.5">AIDEN v1.0.0</span>
              </div>
            </Link>
          </Button>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="outline" size="icon" aria-label="Open Menu">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col gap-4 mt-8" aria-label="Mobile Navigation">
                {navItems.map((item, index) => (
                  <Link
                    key={index}
                    href={item.href}
                    className="text-lg font-medium transition-colors hover:text-primary"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="flex items-center gap-4 mt-4">
                  <ThemeToggle />
                  <Button
                    asChild
                    className="w-full flex items-center gap-3 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-xl border-0 h-auto shadow-[0_0_10px_rgba(36,101,237,0.4)]"
                  >
                    <Link href="#contact" onClick={() => setIsOpen(false)}>
                      <Zap className="h-4 w-4 text-white" />
                      <div className="flex flex-col items-start">
                        <span className="text-sm font-semibold">Request Demo</span>
                        <span className="text-xs text-gray-300 -mt-0.5">AIDEN v1.0.0</span>
                      </div>
                    </Link>
                  </Button>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
