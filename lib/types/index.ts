export type UserRole =
  | "coach"
  | "investor/vcs"
  | "prospective client"
  | "applicant"
  | "alumni"
  | "mentor"
  | "phase 1 client"
  | "phase 2 client"
  | "phase 3 client"
  | "phase 4 client"
  | "phase 5 client"
  | "phase 6 client"
  | "admin" // Added for administrative purposes

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  // other user properties
}

export interface Goal {
  id: string
  userId: string
  title: string
  description?: string
  status: "Not Started" | "In Progress" | "Completed" | "On Hold"
  progress: number // 0-100
  dueDate?: string
  createdAt: string
  updatedAt: string
}

export interface CoachingSession {
  id: string
  clientId: string
  coachId: string
  date: string
  time: string
  topic: string
  status: "Upcoming" | "Completed" | "Cancelled"
  type: "Video Call" | "In-Person" | "Phone Call"
  summaryUrl?: string
  notesUrl?: string
}

export interface Resource {
  id: string
  title: string
  type: "Document" | "Article" | "Video" | "Tool"
  format: string
  url?: string
  filePath?: string
  category: string
  dateAdded: string
}

// Hypothetical Workbook type
export interface Workbook {
  id: string
  title: string
  content: string // Could be Markdown, JSON, etc.
  phases: UserRole[] // Roles that can access this workbook, e.g., ['phase 1 client', 'phase 2 client']
  requiredRole?: UserRole // A specific role required, e.g., 'coach'
}
