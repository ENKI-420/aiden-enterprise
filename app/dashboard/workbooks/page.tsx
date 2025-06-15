// Example page demonstrating RBAC for workbooks
import { WorkbookCard } from "@/components/dashboard/workbook-card"
import type { User, Workbook } from "@/lib/types"
import { BookCopy } from "lucide-react"

// Mock current user - in a real app, this would come from auth state
const mockCurrentUser: User = {
  id: "user-123",
  name: "Phase 1 User",
  email: "phase1@example.com",
  role: "phase 1 client",
}
// const mockCurrentUserCoach: User = { id: "coach-123", name: "Coach Luke", email: "connect@lukebonney.com", role: "coach" };
// const mockCurrentUserInvestor: User = { id: "investor-123", name: "VC Partner", email: "vc@example.com", role: "investor/vcs" };

// Mock workbook data
const workbooks: Workbook[] = [
  {
    id: "wb1",
    title: "Phase 1: Foundations of Leadership",
    content: "Workbook content for phase 1...",
    phases: ["phase 1 client"],
  },
  {
    id: "wb2",
    title: "Phase 2: Strategic Execution",
    content: "Workbook content for phase 2...",
    phases: ["phase 2 client"],
  },
  {
    id: "wb3",
    title: "Advanced Coaching Techniques",
    content: "Workbook for coaches...",
    requiredRole: "coach",
  },
  {
    id: "wb4",
    title: "Investment Thesis Development",
    content: "Workbook for investors...",
    requiredRole: "investor/vcs",
  },
  {
    id: "wb5",
    title: "Alumni Network Guide",
    content: "Guide for program alumni...",
    requiredRole: "alumni",
  },
  {
    id: "wb6",
    title: "All Phases Foundational Workbook",
    content: "Content for all client phases...",
    phases: [
      "phase 1 client",
      "phase 2 client",
      "phase 3 client",
      "phase 4 client",
      "phase 5 client",
      "phase 6 client",
    ],
  },
]

export default function WorkbooksPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-serif font-bold flex items-center gap-2">
        <BookCopy className="h-7 w-7 text-purple-600" /> Coaching Workbooks
      </h1>
      <p className="text-muted-foreground">
        Access workbooks relevant to your role and coaching phase. Currently logged in as:{" "}
        <strong>{mockCurrentUser.role}</strong>.
      </p>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {workbooks.map((wb) => (
          <WorkbookCard key={wb.id} workbook={wb} currentUser={mockCurrentUser} />
        ))}
      </div>
      <p className="text-sm text-muted-foreground mt-8">
        Note: This page demonstrates Role-Based Access Control. Workbook visibility and access depend on the logged-in
        user's role. Try changing `mockCurrentUser` in `app/dashboard/workbooks/page.tsx` to see different views (e.g.,
        `coach`, `investor/vcs`, `phase 2 client`).
      </p>
    </div>
  )
}
