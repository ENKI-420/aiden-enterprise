"use client"

import Link from "next/link"
import { Shield, Mail, Phone, MapPin, Linkedin, Twitter } from "lucide-react"

export function SiteFooter() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="h-8 w-8 rounded-lg bg-gold-500 flex items-center justify-center font-bold text-navy-900 text-sm">
                ADS
              </div>
              <span className="font-serif font-bold text-lg">Agile Defense Systems</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-md mb-4">
              Empowering defense industry executives with AI-driven strategic leadership tools and comprehensive
              performance optimization platforms designed for mission-critical operations.
            </p>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-2">
              <MapPin className="h-4 w-4" />
              <span>Defense Industry Solutions Worldwide</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-2">
              <Mail className="h-4 w-4" />
              <Link href="mailto:contact@agiledefensesystems.com" className="hover:text-primary">
                contact@agiledefensesystems.com
              </Link>
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Phone className="h-4 w-4" />
              <span>+1 (555) 123-DEFENSE</span>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="font-semibold mb-4">Platform</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/dashboard" className="text-muted-foreground hover:text-primary transition-colors">
                  Executive Dashboard
                </Link>
              </li>
              <li>
                <Link href="/dashboard/goals" className="text-muted-foreground hover:text-primary transition-colors">
                  Strategic Goals
                </Link>
              </li>
              <li>
                <Link href="/dashboard/sessions" className="text-muted-foreground hover:text-primary transition-colors">
                  Coaching Sessions
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/resources"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Resources
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/workbooks"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Executive Workbooks
                </Link>
              </li>
            </ul>
          </div>

          {/* Programs & Services */}
          <div>
            <h3 className="font-semibold mb-4">Programs</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/m3c-bootcamp" className="text-muted-foreground hover:text-primary transition-colors">
                  M³C Bootcamp
                </Link>
              </li>
              <li>
                <Link href="/executive-blog" className="text-muted-foreground hover:text-primary transition-colors">
                  Thought Leadership
                </Link>
              </li>
              <li>
                <Link href="/digital-assets" className="text-muted-foreground hover:text-primary transition-colors">
                  Digital Assets
                </Link>
              </li>
              <li>
                <Link href="/investor-dossier" className="text-muted-foreground hover:text-primary transition-colors">
                  Investor Relations
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <p className="text-sm text-muted-foreground">© 2025 Agile Defense Systems, LLC. All rights reserved.</p>
            </div>

            <div className="flex items-center space-x-6">
              {/* Social Links */}
              <div className="flex items-center space-x-4">
                <Link
                  href="https://www.linkedin.com/in/%CE%BE-devin-phillip-davis-88379b174"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Linkedin className="h-4 w-4" />
                  <span className="sr-only">LinkedIn</span>
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <Twitter className="h-4 w-4" />
                  <span className="sr-only">Twitter</span>
                </Link>
              </div>

              {/* Legal Links */}
              <div className="flex items-center space-x-4 text-sm">
                <Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors">
                  Terms of Service
                </Link>
                <Link href="/security" className="text-muted-foreground hover:text-primary transition-colors">
                  Security
                </Link>
              </div>
            </div>
          </div>

          {/* Founder Attribution */}
          <div className="mt-6 pt-6 border-t">
            <div className="flex items-center justify-center space-x-3 text-sm text-muted-foreground">
              <Shield className="h-4 w-4 text-gold-500" />
              <span>Founded by</span>
              <Link
                href="https://www.linkedin.com/in/%CE%BE-devin-phillip-davis-88379b174"
                className="font-semibold text-foreground hover:text-primary transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                Devin Phillip Davis
              </Link>
              <span>•</span>
              <span>Defense Industry Leadership Excellence</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
