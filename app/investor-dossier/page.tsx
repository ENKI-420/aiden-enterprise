import { MainNav } from "@/components/shared/main-nav"
import { SiteFooter } from "@/components/shared/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShieldCheck, FileText, Lock } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function InvestorDossierPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <MainNav />
      <main className="flex-1 py-12 md:py-16 lg:py-20 bg-gray-100 dark:bg-gray-900">
        <div className="container px-4 md:px-6 max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <ShieldCheck className="h-16 w-16 text-purple-600 mx-auto mb-4" />
            <h1 className="text-4xl font-serif font-bold tracking-tighter sm:text-5xl">Investor & Alumni Dossier</h1>
            <p className="mt-3 text-gray-600 md:text-xl dark:text-gray-400">
              Secure access to confidential information and program archives.
            </p>
          </div>

          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" /> Secure Login
              </CardTitle>
              <CardDescription>Please enter your credentials to access the dossier.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="access-key">Access Key</Label>
                <Input id="access-key" type="password" placeholder="Enter your secure access key" />
              </div>
              <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">Access Dossier</Button>
            </CardContent>
          </Card>

          <div className="mt-12 text-center">
            <FileText className="h-10 w-10 text-gray-400 dark:text-gray-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">What's Inside?</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Business performance data, testimonials, program outcomes, and AI-powered glossaries.
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-4">
              Access is restricted. If you believe you should have access, please contact support.
            </p>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
