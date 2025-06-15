import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch" // Assuming you have a Switch component
import { UserCircle, Bell, ShieldCheck, Key } from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div>
        <h1 className="text-3xl font-serif font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCircle className="h-5 w-5 text-purple-600" /> Profile Information
          </CardTitle>
          <CardDescription>Update your personal details.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" defaultValue="Alex" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" defaultValue="Chen" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" type="email" defaultValue="alex.chen@example.com" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="jobTitle">Job Title</Label>
            <Input id="jobTitle" defaultValue="VP of Engineering" />
          </div>
          <Button className="bg-purple-600 hover:bg-purple-700 text-white">Save Profile</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-purple-600" /> Notification Preferences
          </CardTitle>
          <CardDescription>Choose how you receive updates.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="sessionReminders" className="font-medium">
                Session Reminders
              </Label>
              <p className="text-sm text-muted-foreground">Get notified before your coaching sessions.</p>
            </div>
            <Switch id="sessionReminders" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="newResources" className="font-medium">
                New Resources
              </Label>
              <p className="text-sm text-muted-foreground">Alerts when new documents or tools are added.</p>
            </div>
            <Switch id="newResources" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="progressUpdates" className="font-medium">
                Progress Updates
              </Label>
              <p className="text-sm text-muted-foreground">Weekly summaries of your goal progress.</p>
            </div>
            <Switch id="progressUpdates" />
          </div>
          <Button className="bg-purple-600 hover:bg-purple-700 text-white">Save Preferences</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5 text-purple-600" /> API Key Management
          </CardTitle>
          <CardDescription>Manage your OpenAI API key for AI-powered features.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="apiKey">OpenAI API Key</Label>
            <Input id="apiKey" type="password" placeholder="sk-********************************" />
            <p className="text-xs text-muted-foreground">
              Your API key is stored securely and used for features like AI-generated insights and summaries.
            </p>
          </div>
          <Button className="bg-purple-600 hover:bg-purple-700 text-white">Save API Key</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-purple-600" /> Security
          </CardTitle>
          <CardDescription>Manage your account security settings.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline">Change Password</Button>
          <Button variant="outline">Enable Two-Factor Authentication</Button>
        </CardContent>
      </Card>
    </div>
  )
}
