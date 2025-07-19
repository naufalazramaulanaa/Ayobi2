"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Settings, Globe, Shield, Mail, Database, Palette, Users, Save, AlertTriangle, CheckCircle } from "lucide-react"

export function SystemSettings() {
  const [settings, setSettings] = useState({
    siteName: "EduLMS",
    siteDescription: "Professional Learning Management System",
    maintenanceMode: false,
    userRegistration: true,
    emailNotifications: true,
    courseApproval: true,
    maxFileSize: "100",
    sessionTimeout: "30",
    defaultLanguage: "en",
    timezone: "UTC",
    theme: "light",
  })

  const handleSave = () => {
    // Save settings logic here
    console.log("Settings saved:", settings)
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-midnight-blue-800">System Settings</h1>
          <p className="text-midnight-blue-600">Configure platform settings and preferences</p>
        </div>
        <Button onClick={handleSave} className="bg-midnight-blue-800 hover:bg-midnight-blue-700">
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                General Settings
              </CardTitle>
              <CardDescription>Basic platform configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input
                    id="siteName"
                    value={settings.siteName}
                    onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="defaultLanguage">Default Language</Label>
                  <Select
                    value={settings.defaultLanguage}
                    onValueChange={(value) => setSettings({ ...settings, defaultLanguage: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="id">Indonesian</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="siteDescription">Site Description</Label>
                <Textarea
                  id="siteDescription"
                  value={settings.siteDescription}
                  onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select
                    value={settings.timezone}
                    onValueChange={(value) => setSettings({ ...settings, timezone: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="Asia/Jakarta">Asia/Jakarta</SelectItem>
                      <SelectItem value="America/New_York">America/New_York</SelectItem>
                      <SelectItem value="Europe/London">Europe/London</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={settings.sessionTimeout}
                    onChange={(e) => setSettings({ ...settings, sessionTimeout: e.target.value })}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-semibold">Platform Controls</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Maintenance Mode</Label>
                      <p className="text-sm text-muted-foreground">Temporarily disable site access</p>
                    </div>
                    <Switch
                      checked={settings.maintenanceMode}
                      onCheckedChange={(checked) => setSettings({ ...settings, maintenanceMode: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>User Registration</Label>
                      <p className="text-sm text-muted-foreground">Allow new user registrations</p>
                    </div>
                    <Switch
                      checked={settings.userRegistration}
                      onCheckedChange={(checked) => setSettings({ ...settings, userRegistration: checked })}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Security Settings
              </CardTitle>
              <CardDescription>Configure security and access controls</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="maxFileSize">Max File Upload Size (MB)</Label>
                  <Input
                    id="maxFileSize"
                    type="number"
                    value={settings.maxFileSize}
                    onChange={(e) => setSettings({ ...settings, maxFileSize: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Password Requirements</Label>
                  <Select defaultValue="medium">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low (6+ characters)</SelectItem>
                      <SelectItem value="medium">Medium (8+ chars, mixed case)</SelectItem>
                      <SelectItem value="high">High (12+ chars, symbols)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Access Controls</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="font-medium">Two-Factor Authentication</h5>
                        <p className="text-sm text-muted-foreground">Require 2FA for admin accounts</p>
                      </div>
                      <Badge variant="outline">Recommended</Badge>
                    </div>
                  </Card>
                  <Card className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="font-medium">IP Whitelist</h5>
                        <p className="text-sm text-muted-foreground">Restrict admin access by IP</p>
                      </div>
                      <Badge variant="secondary">Optional</Badge>
                    </div>
                  </Card>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Security Status</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-green-800">SSL Certificate Active</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-green-800">Database Backups Enabled</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-yellow-600" />
                    <span className="text-yellow-800">Security Scan: 2 days ago</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email Settings */}
        <TabsContent value="email" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Email Configuration
              </CardTitle>
              <CardDescription>Configure email delivery and notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="smtpHost">SMTP Host</Label>
                  <Input id="smtpHost" placeholder="smtp.gmail.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpPort">SMTP Port</Label>
                  <Input id="smtpPort" placeholder="587" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="smtpUser">SMTP Username</Label>
                  <Input id="smtpUser" placeholder="your-email@gmail.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpPass">SMTP Password</Label>
                  <Input id="smtpPass" type="password" placeholder="••••••••" />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-semibold">Email Notifications</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Course Enrollment Notifications</Label>
                      <p className="text-sm text-muted-foreground">Send emails when students enroll</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Course Completion Certificates</Label>
                      <p className="text-sm text-muted-foreground">Auto-send certificates via email</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Weekly Progress Reports</Label>
                      <p className="text-sm text-muted-foreground">Send weekly reports to instructors</p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Course Settings */}
        <TabsContent value="courses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Course Management
              </CardTitle>
              <CardDescription>Configure course creation and management settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Course Approval Required</Label>
                    <p className="text-sm text-muted-foreground">Require admin approval for new courses</p>
                  </div>
                  <Switch
                    checked={settings.courseApproval}
                    onCheckedChange={(checked) => setSettings({ ...settings, courseApproval: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-Generate Certificates</Label>
                    <p className="text-sm text-muted-foreground">Automatically create certificates on completion</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Course Rating System</Label>
                    <p className="text-sm text-muted-foreground">Allow students to rate courses</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Default Course Duration</Label>
                  <Select defaultValue="flexible">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="flexible">Flexible</SelectItem>
                      <SelectItem value="30">30 days</SelectItem>
                      <SelectItem value="60">60 days</SelectItem>
                      <SelectItem value="90">90 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Maximum Students per Course</Label>
                  <Input placeholder="Unlimited" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Settings */}
        <TabsContent value="appearance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Appearance & Branding
              </CardTitle>
              <CardDescription>Customize the look and feel of your platform</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Theme</Label>
                  <Select value={settings.theme} onValueChange={(value) => setSettings({ ...settings, theme: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="auto">Auto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Primary Color</Label>
                  <div className="flex gap-2">
                    <div className="w-8 h-8 bg-midnight-blue-800 rounded border-2 border-gray-300"></div>
                    <div className="w-8 h-8 bg-blue-600 rounded"></div>
                    <div className="w-8 h-8 bg-green-600 rounded"></div>
                    <div className="w-8 h-8 bg-purple-600 rounded"></div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="logo">Platform Logo</Label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-midnight-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-midnight-blue-800 font-bold">LOGO</span>
                  </div>
                  <Button variant="outline">Upload New Logo</Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="favicon">Favicon</Label>
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-midnight-blue-800 rounded"></div>
                  <Button variant="outline">Upload Favicon</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Advanced Settings */}
        <TabsContent value="advanced" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                Advanced Configuration
              </CardTitle>
              <CardDescription>Advanced system settings and maintenance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-semibold">Database Management</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="outline">
                    <Database className="w-4 h-4 mr-2" />
                    Backup Database
                  </Button>
                  <Button variant="outline">
                    <Settings className="w-4 h-4 mr-2" />
                    Optimize Tables
                  </Button>
                  <Button variant="outline">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Clear Cache
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-semibold">System Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h5 className="font-medium">Platform Version</h5>
                    <p className="text-sm text-muted-foreground">v2.1.0</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h5 className="font-medium">Database Size</h5>
                    <p className="text-sm text-muted-foreground">245 MB</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h5 className="font-medium">Total Users</h5>
                    <p className="text-sm text-muted-foreground">1,247 active</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h5 className="font-medium">Server Uptime</h5>
                    <p className="text-sm text-muted-foreground">15 days, 4 hours</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <h4 className="font-semibold text-red-800 mb-2">Danger Zone</h4>
                <p className="text-sm text-red-700 mb-4">
                  These actions cannot be undone. Please proceed with caution.
                </p>
                <div className="flex gap-2">
                  <Button variant="destructive" size="sm">
                    Reset All Settings
                  </Button>
                  <Button variant="destructive" size="sm">
                    Factory Reset
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
