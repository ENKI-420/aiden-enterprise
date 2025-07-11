"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Brain,
  LayoutDashboard,
  FileText,
  Settings,
  User,
  LogOut,
  Menu,
  X,
  BarChart3,
  MessageSquare,
  Upload,
} from "lucide-react"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const navigation = [
    { name: "Clinical Dashboard", href: "/dashboard", icon: LayoutDashboard, current: true },
    { name: "Genomic Analytics", href: "/dashboard/analytics", icon: BarChart3, current: false },
    { name: "Patient Profiles", href: "/dashboard/patients", icon: FileText, current: false },
    { name: "Health Simulations", href: "/dashboard/simulations", icon: MessageSquare, current: false },
    { name: "Data Upload", href: "/dashboard/upload", icon: Upload, current: false },
    { name: "Clinical Settings", href: "/dashboard/settings", icon: Settings, current: false },
  ]

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? "block" : "hidden"}`}>
        <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
        <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-xl">
          <div className="flex items-center justify-between p-4 border-b">
            <Link href="/" className="flex items-center space-x-2">
              <Brain className="h-8 w-8 text-[#4A90E2]" />
              <span className="text-xl font-bold text-[#4A4A4A]">Lovable Twin</span>
            </Link>
            <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          <nav className="p-4 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                  item.current ? "bg-[#4A90E2] text-white" : "text-[#4A4A4A] hover:bg-[#F5F7FA]"
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:block lg:w-64 lg:bg-white lg:shadow-lg">
        <div className="flex items-center space-x-2 p-6 border-b">
          <Brain className="h-8 w-8 text-[#1E90FF]" />
          <span className="text-xl font-bold text-[#4A4A4A]">Genomic Twin</span>
        </div>
        <nav className="p-4 space-y-2">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                item.current ? "bg-[#4A90E2] text-white" : "text-[#4A4A4A] hover:bg-[#F5F7FA]"
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* User menu */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-8 h-8 bg-[#4A90E2] rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-[#4A4A4A]">Dr. Sarah Johnson</p>
              <p className="text-xs text-[#4A4A4A]/70">sarah.johnson@hospital.com</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="w-full justify-start text-[#4A4A4A]">
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b">
          <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
          <Link href="/" className="flex items-center space-x-2">
            <Brain className="h-6 w-6 text-[#1E90FF]" />
            <span className="font-bold text-[#4A4A4A]">Genomic Twin</span>
          </Link>
          <div className="w-8" /> {/* Spacer */}
        </div>

        {/* Page content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
