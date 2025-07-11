"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Settings, Shield, Database, Bell, Key, Globe, Save, RefreshCw } from "lucide-react"

interface ClinicalSettings {
  general: {
    institutionName: string
    timezone: string
    language: string
    dateFormat: string
  }
  security: {
    twoFactorAuth: boolean
    sessionTimeout: number
    passwordPolicy: string
    auditLogging: boolean
  }
  notifications: {
    emailAlerts: boolean
    smsAlerts: boolean
    criticalFindings: boolean
    systemMaintenance: boolean
  }
  integration: {
    ehrSystem: string
    labSystem: string
    imagingSystem: string
    apiAccess: boolean
  }
  genomics: {
    defaultPipeline: string
    qualityThreshold: number
    annotationSources: string[]
    reportingStandards: string
  }
}

export function ClinicalSettingsPanel() {
  const [settings, setSettings] = useState<ClinicalSettings>({
    general: {
      institutionName: "Memorial Healthcare System",
      timezone: "America/New_York",
      language: "English",
      dateFormat: "MM/DD/YYYY",
    },
    security: {
      twoFactorAuth: true,
      sessionTimeout: 30,
      passwordPolicy: "Strong",
      auditLogging: true,
    },
    notifications: {
      emailAlerts: true,
      smsAlerts: false,
      criticalFindings: true,
      systemMaintenance: true,
    },
    integration: {
      ehrSystem: "Epic",
      labSystem: "Cerner",
      imagingSystem: "PACS",
      apiAccess: true,
    },
    genomics: {
      defaultPipeline: "GATK Best Practices",
      qualityThreshold: 30,
      annotationSources: ["ClinVar", "OMIM", "HGMD"],
      reportingStandards: "ACMG",
    },
  })

  const [hasChanges, setHasChanges] = useState(false)

  const updateSetting = (category: keyof ClinicalSettings, key: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value,
      },
    }))
    setHasChanges(true)
  }

  const saveSettings = () => {
    // Simulate API call
    setTimeout(() => {
      setHasChanges(false)
    }, 1000)
  }

  const resetSettings = () => {
    // Reset to defaults
    setHasChanges(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#4A4A4A] flex items-center gap-2">
            <Settings className="h-6 w-6 text-[#1E90FF]" />
            Clinical Settings
          </h2>
          <p className="text-[#4A4A4A]/70">Configure system preferences and clinical workflows</p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={resetSettings}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Reset
          </Button>
          <Button onClick={saveSettings} disabled={!hasChanges} className="bg-[#1E90FF] hover:bg-[#1E90FF]/90">
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </div>

      {hasChanges && (
        <Card className="border-[#FF8C00] bg-[#FF8C00]/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#FF8C00]" />
              <span className="text-sm font-medium text-[#4A4A4A]">You have unsaved changes</span>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="integration">Integration</TabsTrigger>
          <TabsTrigger value="genomics">Genomics</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-[#2E8B57]" />
                General Settings
              </CardTitle>
              <CardDescription>Basic system configuration and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="institution-name">Institution Name</Label>
                    <Input
                      id="institution-name"
                      value={settings.general.institutionName}
                      onChange={(e) => updateSetting("general", "institutionName", e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select
                      value={settings.general.timezone}
                      onValueChange={(value) => updateSetting("general", "timezone", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="America/New_York">Eastern Time</SelectItem>
                        <SelectItem value="America/Chicago">Central Time</SelectItem>
                        <SelectItem value="America/Denver">Mountain Time</SelectItem>
                        <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                        <SelectItem value="UTC">UTC</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="language">Language</Label>
                    <Select
                      value={settings.general.language}
                      onValueChange={(value) => updateSetting("general", "language", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="English">English</SelectItem>
                        <SelectItem value="Spanish">Spanish</SelectItem>
                        <SelectItem value="French">French</SelectItem>
                        <SelectItem value="German">German</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="date-format">Date Format</Label>
                    <Select
                      value={settings.general.dateFormat}
                      onValueChange={(value) => updateSetting("general", "dateFormat", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                        <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                        <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-[#DC143C]" />
                Security Settings
              </CardTitle>
              <CardDescription>Authentication, authorization, and security policies</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="two-factor">Two-Factor Authentication</Label>
                    <p className="text-sm text-[#4A4A4A]/70">Require 2FA for all user accounts</p>
                  </div>
                  <Switch
                    id="two-factor"
                    checked={settings.security.twoFactorAuth}
                    onCheckedChange={(checked) => updateSetting("security", "twoFactorAuth", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="audit-logging">Audit Logging</Label>
                    <p className="text-sm text-[#4A4A4A]/70">Log all user actions and system events</p>
                  </div>
                  <Switch
                    id="audit-logging"
                    checked={settings.security.auditLogging}
                    onCheckedChange={(checked) => updateSetting("security", "auditLogging", checked)}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                    <Input
                      id="session-timeout"
                      type="number"
                      value={settings.security.sessionTimeout}
                      onChange={(e) => updateSetting("security", "sessionTimeout", Number.parseInt(e.target.value))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="password-policy">Password Policy</Label>
                    <Select
                      value={settings.security.passwordPolicy}
                      onValueChange={(value) => updateSetting("security", "passwordPolicy", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Basic">Basic (8+ characters)</SelectItem>
                        <SelectItem value="Strong">Strong (12+ chars, mixed case, numbers)</SelectItem>
                        <SelectItem value="Complex">Complex (16+ chars, symbols required)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-[#FF8C00]" />
                Notification Settings
              </CardTitle>
              <CardDescription>Configure alerts and notification preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email-alerts">Email Alerts</Label>
                    <p className="text-sm text-[#4A4A4A]/70">Receive notifications via email</p>
                  </div>
                  <Switch
                    id="email-alerts"
                    checked={settings.notifications.emailAlerts}
                    onCheckedChange={(checked) => updateSetting("notifications", "emailAlerts", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="sms-alerts">SMS Alerts</Label>
                    <p className="text-sm text-[#4A4A4A]/70">Receive urgent notifications via SMS</p>
                  </div>
                  <Switch
                    id="sms-alerts"
                    checked={settings.notifications.smsAlerts}
                    onCheckedChange={(checked) => updateSetting("notifications", "smsAlerts", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="critical-findings">Critical Findings</Label>
                    <p className="text-sm text-[#4A4A4A]/70">Immediate alerts for critical results</p>
                  </div>
                  <Switch
                    id="critical-findings"
                    checked={settings.notifications.criticalFindings}
                    onCheckedChange={(checked) => updateSetting("notifications", "criticalFindings", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="system-maintenance">System Maintenance</Label>
                    <p className="text-sm text-[#4A4A4A]/70">Notifications about system updates</p>
                  </div>
                  <Switch
                    id="system-maintenance"
                    checked={settings.notifications.systemMaintenance}
                    onCheckedChange={(checked) => updateSetting("notifications", "systemMaintenance", checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integration" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-[#9370DB]" />
                System Integration
              </CardTitle>
              <CardDescription>Configure connections to external systems</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="ehr-system">EHR System</Label>
                    <Select
                      value={settings.integration.ehrSystem}
                      onValueChange={(value) => updateSetting("integration", "ehrSystem", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Epic">Epic</SelectItem>
                        <SelectItem value="Cerner">Cerner</SelectItem>
                        <SelectItem value="Allscripts">Allscripts</SelectItem>
                        <SelectItem value="Custom">Custom FHIR</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="lab-system">Laboratory System</Label>
                    <Select
                      value={settings.integration.labSystem}
                      onValueChange={(value) => updateSetting("integration", "labSystem", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Cerner">Cerner</SelectItem>
                        <SelectItem value="Sunquest">Sunquest</SelectItem>
                        <SelectItem value="Meditech">Meditech</SelectItem>
                        <SelectItem value="HL7">HL7 Interface</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="imaging-system">Imaging System</Label>
                    <Select
                      value={settings.integration.imagingSystem}
                      onValueChange={(value) => updateSetting("integration", "imagingSystem", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PACS">PACS</SelectItem>
                        <SelectItem value="GE Healthcare">GE Healthcare</SelectItem>
                        <SelectItem value="Philips">Philips</SelectItem>
                        <SelectItem value="DICOM">DICOM Interface</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="api-access">API Access</Label>
                      <p className="text-sm text-[#4A4A4A]/70">Enable external API access</p>
                    </div>
                    <Switch
                      id="api-access"
                      checked={settings.integration.apiAccess}
                      onCheckedChange={(checked) => updateSetting("integration", "apiAccess", checked)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="genomics" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5 text-[#4ECDC4]" />
                Genomics Configuration
              </CardTitle>
              <CardDescription>Configure genomic analysis pipelines and standards</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="default-pipeline">Default Analysis Pipeline</Label>
                    <Select
                      value={settings.genomics.defaultPipeline}
                      onValueChange={(value) => updateSetting("genomics", "defaultPipeline", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="GATK Best Practices">GATK Best Practices</SelectItem>
                        <SelectItem value="BWA-GATK">BWA-GATK</SelectItem>
                        <SelectItem value="Dragen">Dragen</SelectItem>
                        <SelectItem value="Custom">Custom Pipeline</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="quality-threshold">Quality Score Threshold</Label>
                    <Input
                      id="quality-threshold"
                      type="number"
                      value={settings.genomics.qualityThreshold}
                      onChange={(e) => updateSetting("genomics", "qualityThreshold", Number.parseInt(e.target.value))}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="reporting-standards">Reporting Standards</Label>
                    <Select
                      value={settings.genomics.reportingStandards}
                      onValueChange={(value) => updateSetting("genomics", "reportingStandards", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ACMG">ACMG Guidelines</SelectItem>
                        <SelectItem value="AMP">AMP Guidelines</SelectItem>
                        <SelectItem value="CAP">CAP Guidelines</SelectItem>
                        <SelectItem value="Custom">Custom Standards</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Annotation Sources</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {["ClinVar", "OMIM", "HGMD", "gnomAD", "dbSNP"].map((source) => (
                        <Badge
                          key={source}
                          variant={settings.genomics.annotationSources.includes(source) ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => {
                            const sources = settings.genomics.annotationSources.includes(source)
                              ? settings.genomics.annotationSources.filter((s) => s !== source)
                              : [...settings.genomics.annotationSources, source]
                            updateSetting("genomics", "annotationSources", sources)
                          }}
                        >
                          {source}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
