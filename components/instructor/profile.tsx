"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  User,
  MapPin,
  Edit,
  Save,
  Camera,
  Award,
  BookOpen,
  Users,
  Star,
  DollarSign,
  TrendingUp,
  Shield,
  Bell,
  Eye,
  EyeOff,
  CreditCard,
} from "lucide-react"
import { toast } from "@/hooks/use-toast"

const instructorData = {
  id: "instructor-001",
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  phone: "+1 (555) 123-4567",
  dateOfBirth: "1985-08-20",
  gender: "Male",
  country: "United States",
  city: "San Francisco",
  address: "456 Teaching Ave, San Francisco, CA 94105",
  bio: "Experienced software engineer and educator with 10+ years in the industry. Passionate about sharing knowledge and helping students achieve their goals.",
  avatar: "/placeholder.svg?height=150&width=150",
  joinDate: "2022-03-10",
  status: "Active",

  // Professional Info
  title: "Senior Software Engineer & Instructor",
  company: "Tech Solutions Inc.",
  experience: "10+ years",
  expertise: ["JavaScript", "React", "Node.js", "Python", "Web Development"],
  education: "Master's in Computer Science",
  certifications: ["AWS Certified", "Google Cloud Professional", "Certified Scrum Master"],

  // Teaching Stats
  stats: {
    totalStudents: 15420,
    coursesCreated: 12,
    totalEarnings: 45680.5,
    averageRating: 4.8,
    totalReviews: 2340,
    thisMonthEarnings: 3240.75,
    completionRate: 87,
  },

  // Payment Info
  paymentInfo: {
    method: "Bank Transfer",
    bankName: "Chase Bank",
    accountNumber: "****1234",
    routingNumber: "****5678",
    paypalEmail: "john.doe@paypal.com",
  },

  // Preferences
  preferences: {
    emailNotifications: true,
    studentMessages: true,
    courseUpdates: true,
    marketingEmails: false,
    profileVisibility: "public",
    showEarnings: false,
    language: "English",
    timezone: "America/Los_Angeles",
  },
}

export function InstructorProfile() {
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState(instructorData)
  const [activeTab, setActiveTab] = useState("profile")

  const handleInputChange = (field: string, value: any) => {
    setProfileData((prev) => ({ ...prev, [field]: value }))
  }

  const handlePreferenceChange = (field: string, value: any) => {
    setProfileData((prev) => ({
      ...prev,
      preferences: { ...prev.preferences, [field]: value },
    }))
  }

  const handlePaymentInfoChange = (field: string, value: any) => {
    setProfileData((prev) => ({
      ...prev,
      paymentInfo: { ...prev.paymentInfo, [field]: value },
    }))
  }

  const handleSave = () => {
    setIsEditing(false)
    toast({
      title: "Profile updated!",
      description: "Your profile has been saved successfully",
    })
  }

  const handleAvatarUpload = () => {
    toast({
      title: "Avatar upload",
      description: "Avatar upload functionality would be implemented here",
    })
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-midnight-blue-800">Instructor Profile</h1>
          <p className="text-muted-foreground">Manage your instructor account and settings</p>
        </div>
        <Button
          onClick={isEditing ? handleSave : () => setIsEditing(true)}
          className={isEditing ? "bg-green-600 hover:bg-green-700" : ""}
        >
          {isEditing ? (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </>
          ) : (
            <>
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </>
          )}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="professional">Professional</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Picture & Basic Info */}
            <Card>
              <CardContent className="p-6 text-center">
                <div className="relative inline-block mb-4">
                  <Avatar className="w-32 h-32">
                    <AvatarImage src={profileData.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="text-2xl">
                      {profileData.firstName[0]}
                      {profileData.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <Button
                      size="sm"
                      className="absolute bottom-0 right-0 rounded-full w-8 h-8 p-0"
                      onClick={handleAvatarUpload}
                    >
                      <Camera className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                <h3 className="text-xl font-bold mb-2">
                  {profileData.firstName} {profileData.lastName}
                </h3>
                <p className="text-muted-foreground mb-2">{profileData.title}</p>
                <p className="text-sm text-muted-foreground mb-4">{profileData.email}</p>

                <div className="flex justify-center space-x-2 mb-4">
                  <Badge className={profileData.status === "Active" ? "bg-green-500" : "bg-red-500"}>
                    {profileData.status}
                  </Badge>
                  <Badge variant="outline">Instructor since {new Date(profileData.joinDate).getFullYear()}</Badge>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-center space-x-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span>
                      {profileData.city}, {profileData.country}
                    </span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span>{profileData.stats.averageRating} rating</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span>{profileData.stats.totalStudents.toLocaleString()} students</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Personal Information Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={profileData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={profileData.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={profileData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="title">Professional Title</Label>
                    <Input
                      id="title"
                      value={profileData.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      disabled={!isEditing}
                      placeholder="e.g., Senior Software Engineer & Instructor"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="company">Company</Label>
                      <Input
                        id="company"
                        value={profileData.company}
                        onChange={(e) => handleInputChange("company", e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="experience">Years of Experience</Label>
                      <Select
                        value={profileData.experience}
                        onValueChange={(value) => handleInputChange("experience", value)}
                        disabled={!isEditing}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1-2 years">1-2 years</SelectItem>
                          <SelectItem value="3-5 years">3-5 years</SelectItem>
                          <SelectItem value="6-10 years">6-10 years</SelectItem>
                          <SelectItem value="10+ years">10+ years</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="bio">Professional Bio</Label>
                    <Textarea
                      id="bio"
                      value={profileData.bio}
                      onChange={(e) => handleInputChange("bio", e.target.value)}
                      disabled={!isEditing}
                      rows={4}
                      placeholder="Tell students about your background and expertise..."
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="stats" className="space-y-6">
          {/* Teaching Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Students</p>
                    <p className="text-2xl font-bold">{profileData.stats.totalStudents.toLocaleString()}</p>
                  </div>
                  <Users className="w-8 h-8 text-midnight-blue-600" />
                </div>
                <p className="text-xs text-muted-foreground">Across all courses</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Earnings</p>
                    <p className="text-2xl font-bold">${profileData.stats.totalEarnings.toLocaleString()}</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-green-600" />
                </div>
                <p className="text-xs text-green-600 flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +${profileData.stats.thisMonthEarnings} this month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Average Rating</p>
                    <p className="text-2xl font-bold">{profileData.stats.averageRating}</p>
                  </div>
                  <Star className="w-8 h-8 text-yellow-500" />
                </div>
                <p className="text-xs text-muted-foreground">
                  From {profileData.stats.totalReviews.toLocaleString()} reviews
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Courses Created</p>
                    <p className="text-2xl font-bold">{profileData.stats.coursesCreated}</p>
                  </div>
                  <BookOpen className="w-8 h-8 text-blue-600" />
                </div>
                <p className="text-xs text-muted-foreground">{profileData.stats.completionRate}% completion rate</p>
              </CardContent>
            </Card>
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Course Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Completion Rate</span>
                    <span className="font-semibold">{profileData.stats.completionRate}%</span>
                  </div>
                  <Progress value={profileData.stats.completionRate} className="h-2" />

                  <div className="flex items-center justify-between">
                    <span className="text-sm">Student Satisfaction</span>
                    <span className="font-semibold">{profileData.stats.averageRating}/5.0</span>
                  </div>
                  <Progress value={(profileData.stats.averageRating / 5) * 100} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Monthly Earnings Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">This Month</span>
                    <span className="font-semibold text-green-600">
                      ${profileData.stats.thisMonthEarnings.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Total Earnings</span>
                    <span className="font-semibold">${profileData.stats.totalEarnings.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Average per Course</span>
                    <span className="font-semibold">
                      ${Math.round(profileData.stats.totalEarnings / profileData.stats.coursesCreated).toLocaleString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="payment" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                Payment Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Preferred Payment Method</Label>
                <Select
                  value={profileData.paymentInfo.method}
                  onValueChange={(value) => handlePaymentInfoChange("method", value)}
                  disabled={!isEditing}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                    <SelectItem value="PayPal">PayPal</SelectItem>
                    <SelectItem value="Wire Transfer">Wire Transfer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {profileData.paymentInfo.method === "Bank Transfer" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="bankName">Bank Name</Label>
                    <Input
                      id="bankName"
                      value={profileData.paymentInfo.bankName}
                      onChange={(e) => handlePaymentInfoChange("bankName", e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="accountNumber">Account Number</Label>
                    <Input
                      id="accountNumber"
                      value={profileData.paymentInfo.accountNumber}
                      onChange={(e) => handlePaymentInfoChange("accountNumber", e.target.value)}
                      disabled={!isEditing}
                      type="password"
                    />
                  </div>
                  <div>
                    <Label htmlFor="routingNumber">Routing Number</Label>
                    <Input
                      id="routingNumber"
                      value={profileData.paymentInfo.routingNumber}
                      onChange={(e) => handlePaymentInfoChange("routingNumber", e.target.value)}
                      disabled={!isEditing}
                      type="password"
                    />
                  </div>
                </div>
              )}

              {profileData.paymentInfo.method === "PayPal" && (
                <div>
                  <Label htmlFor="paypalEmail">PayPal Email</Label>
                  <Input
                    id="paypalEmail"
                    type="email"
                    value={profileData.paymentInfo.paypalEmail}
                    onChange={(e) => handlePaymentInfoChange("paypalEmail", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
              )}

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-blue-800 font-medium">
                    Your payment information is encrypted and secure
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Notification Preferences */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="w-5 h-5 mr-2" />
                  Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Course updates and announcements</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={profileData.preferences.emailNotifications}
                    onChange={(e) => handlePreferenceChange("emailNotifications", e.target.checked)}
                    className="toggle"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Student Messages</Label>
                    <p className="text-sm text-muted-foreground">Messages from students</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={profileData.preferences.studentMessages}
                    onChange={(e) => handlePreferenceChange("studentMessages", e.target.checked)}
                    className="toggle"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Course Updates</Label>
                    <p className="text-sm text-muted-foreground">Platform updates and new features</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={profileData.preferences.courseUpdates}
                    onChange={(e) => handlePreferenceChange("courseUpdates", e.target.checked)}
                    className="toggle"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Marketing Emails</Label>
                    <p className="text-sm text-muted-foreground">Promotional content and tips</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={profileData.preferences.marketingEmails}
                    onChange={(e) => handlePreferenceChange("marketingEmails", e.target.checked)}
                    className="toggle"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Privacy Preferences */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Privacy
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Profile Visibility</Label>
                  <Select
                    value={profileData.preferences.profileVisibility}
                    onValueChange={(value) => handlePreferenceChange("profileVisibility", value)}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">
                        <div className="flex items-center">
                          <Eye className="w-4 h-4 mr-2" />
                          Public
                        </div>
                      </SelectItem>
                      <SelectItem value="private">
                        <div className="flex items-center">
                          <EyeOff className="w-4 h-4 mr-2" />
                          Private
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Show Earnings</Label>
                    <p className="text-sm text-muted-foreground">Display earnings on public profile</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={profileData.preferences.showEarnings}
                    onChange={(e) => handlePreferenceChange("showEarnings", e.target.checked)}
                    className="toggle"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="professional" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Expertise */}
            <Card>
              <CardHeader>
                <CardTitle>Areas of Expertise</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {profileData.expertise.map((skill, index) => (
                    <Badge key={index} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
                {isEditing && (
                  <Button variant="outline" size="sm" className="mt-3">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Skills
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Education */}
            <Card>
              <CardHeader>
                <CardTitle>Education</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="font-medium">{profileData.education}</p>
                  <p className="text-sm text-muted-foreground">Computer Science</p>
                </div>
                {isEditing && (
                  <Button variant="outline" size="sm" className="mt-3">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Education
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Certifications */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Certifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {profileData.certifications.map((cert, index) => (
                    <div key={index} className="flex items-center space-x-2 p-3 border rounded-lg">
                      <Award className="w-5 h-5 text-yellow-500" />
                      <span className="text-sm font-medium">{cert}</span>
                    </div>
                  ))}
                </div>
                {isEditing && (
                  <Button variant="outline" size="sm" className="mt-3">
                    <Edit className="w-4 h-4 mr-2" />
                    Manage Certifications
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
