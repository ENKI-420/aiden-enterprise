import Link from "next/link"
import { Brain, Twitter, Linkedin, Github, Mail } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-[#4A4A4A] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <Brain className="h-8 w-8 text-[#4A90E2]" />
              <span className="text-xl font-bold">Lovable Twin</span>
            </Link>
            <p className="text-white/70 mb-4 max-w-md">
              Revolutionary Genomic Digital Twin platform that creates AI-powered genetic simulations for personalized
              medicine, precision healthcare, and clinical decision support.
            </p>
            <div className="flex space-x-4">
              <Twitter className="h-5 w-5 text-white/70 hover:text-[#4A90E2] cursor-pointer transition-colors" />
              <Linkedin className="h-5 w-5 text-white/70 hover:text-[#4A90E2] cursor-pointer transition-colors" />
              <Github className="h-5 w-5 text-white/70 hover:text-[#4A90E2] cursor-pointer transition-colors" />
              <Mail className="h-5 w-5 text-white/70 hover:text-[#4A90E2] cursor-pointer transition-colors" />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Clinical Platform</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/clinical-features" className="text-white/70 hover:text-white transition-colors">
                  Clinical Features
                </Link>
              </li>
              <li>
                <Link href="/healthcare-pricing" className="text-white/70 hover:text-white transition-colors">
                  Healthcare Plans
                </Link>
              </li>
              <li>
                <Link href="/demo" className="text-white/70 hover:text-white transition-colors">
                  Clinical Demo
                </Link>
              </li>
              <li>
                <Link href="/api" className="text-white/70 hover:text-white transition-colors">
                  Healthcare API
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-white/70 hover:text-white transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/research" className="text-white/70 hover:text-white transition-colors">
                  Research
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-white/70 hover:text-white transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-white/70 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/70 text-sm">© 2024 Genomic Twin. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/hipaa-privacy" className="text-white/70 hover:text-white text-sm transition-colors">
              HIPAA Privacy
            </Link>
            <Link href="/terms" className="text-white/70 hover:text-white text-sm transition-colors">
              Terms of Service
            </Link>
            <Link href="/clinical-compliance" className="text-white/70 hover:text-white text-sm transition-colors">
              Clinical Compliance
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
