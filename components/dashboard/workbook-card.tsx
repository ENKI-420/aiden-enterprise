"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookText, Lock } from "lucide-react"
import type { User, Workbook, UserRole } from "@/lib/types" // Assuming User and Workbook types are defined

interface WorkbookCardProps {
  workbook: Workbook
  currentUser: User | null // Pass the current user object
}

// This is a simplified check. Real RBAC would be more complex.
function canAccessWorkbook(workbook: Workbook, userRole: UserRole | undefined): boolean {
  if (!userRole) return false
  if (userRole === "admin" || userRole === "coach") return true // Admins/Coaches can access all

  // Check if workbook is for specific phases and user is in one of them
  if (workbook.phases && workbook.phases.length > 0) {
    return workbook.phases.includes(userRole)
  }

  // Check if workbook requires a specific role
  if (workbook.requiredRole) {
    return userRole === workbook.requiredRole
  }

  return false // Default to no access
}

export function WorkbookCard({ workbook, currentUser }: WorkbookCardProps) {
  const hasAccess = canAccessWorkbook(workbook, currentUser?.role)

  return (
    <Card className={`shadow-sm ${!hasAccess ? "opacity-60 bg-gray-50 dark:bg-gray-800/50" : ""}`}>
      <CardHeader>
        <div className="flex items-center gap-2">
          <BookText className={`h-5 w-5 ${hasAccess ? "text-purple-600" : "text-gray-400"}`} />
          <CardTitle>{workbook.title}</CardTitle>
        </div>
        {workbook.phases && workbook.phases.length > 0 && (
          <CardDescription>Available for: {workbook.phases.join(", ").replace(/client/g, "")}</CardDescription>
        )}
        {workbook.requiredRole && <CardDescription>Requires role: {workbook.requiredRole}</CardDescription>}
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {hasAccess
            ? `Access the content for ${workbook.title}.`
            : "You do not have access to this workbook with your current role."}
        </p>
      </CardContent>
      <CardFooter>
        {hasAccess ? (
          <Button className="bg-purple-600 hover:bg-purple-700 text-white">Open Workbook</Button>
        ) : (
          <Button variant="outline" disabled className="cursor-not-allowed">
            <Lock className="mr-2 h-4 w-4" /> Locked
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
