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
  Calendar,
  Edit,
  Save,
  Camera,
  Award,
  BookOpen,
  Clock,
  Star,
  Shield,
  Bell,
  Eye,
  EyeOff,
} from "lucide-react"
import { toast } from "@/hooks/use-toast"

const studentData = {
  id: "student-001",
  firstName: "Alice",
  lastName: "Johnson",
  email: "alice.johnson@example.com",
  phone: "+1 (555) 987-6543",
  dateOfBirth: "1995-03-15",
  gender: "Female",
  country: "United States",
  city: "San Francisco",
  address: "123 Learning St, San Francisco, CA 94105",
  bio: "Passionate learner interested in web development and data science. Currently pursuing a career transition into tech.",
  avatar: "/placeholder.svg?height=150&width=150",
  joinDate: "2023-06-15",

  // Learning Stats
  stats: {
    coursesEnrolled: 12,
    coursesCompleted: 8,
    certificatesEarned: 5,
    totalStudyHours: 156,
    currentStreak: 7,
    longestStreak: 21,
  },

  // Preferences
  preferences: {
    emailNotifications: true,
    pushNotifications: false,
    marketingEmails: false,
    courseRecommendations: true,
    profileVisibility: "public",
    showProgress: true,
    language: "English",
    timezone: "America/Los_Angeles",
  },

  // Recent Activity
  recentActivity: [
    { type: "course_completed", title: "JavaScript Fundamentals", date: "2024-01-15" },
    { type: "certificate_earned", title: "React Developer Certificate", date: "2024-01-10" },
    { type: "course_enrolled", title: "Advanced Python", date: "2024-01-08" },
  ],
}

export function StudentProfile() {
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState(studentData)
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

  const completionPercentage = Math.round(
    (profileData.stats.coursesCompleted / profileData.stats.coursesEnrolled) * 100,
  )

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-midnight-blue-800">My Profile</h1>
          <p className="text-muted-foreground">Manage your account settings and preferences</p>
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
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
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
                <p className="text-muted-foreground mb-4">{profileData.email}</p>
                <Badge className="mb-4">Member since {new Date(profileData.joinDate).toLocaleDateString()}</Badge>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-center space-x-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span>
                      {profileData.city}, {profileData.country}
                    </span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>Born {new Date(profileData.dateOfBirth).toLocaleDateString()}</span>
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

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="dateOfBirth">Date of Birth</Label>
                      <Input
                        id="dateOfBirth"
                        type="date"
                        value={profileData.dateOfBirth}
                        onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="gender">Gender</Label>
                      <Select
                        value={profileData.gender}
                        onValueChange={(value) => handleInputChange("gender", value)}
                        disabled={!isEditing}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                          <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="country">Country</Label>
                      <Select
                        value={profileData.country}
                        onValueChange={(value) => handleInputChange("country", value)}
                        disabled={!isEditing}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="United States">United States</SelectItem>
                          <SelectItem value="Canada">Canada</SelectItem>
                          <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                          <SelectItem value="Australia">Australia</SelectItem>
                          <SelectItem value="Indonesia">Indonesia</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={profileData.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>

                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={profileData.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>

                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={profileData.bio}
                      onChange={(e) => handleInputChange("bio", e.target.value)}
                      disabled={!isEditing}
                      rows={4}
                      placeholder="Tell us about yourself..."
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="stats" className="space-y-6">
          {/* Learning Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Course Progress</p>
                    <p className="text-2xl font-bold">{completionPercentage}%</p>
                  </div>
                  <BookOpen className="w-8 h-8 text-midnight-blue-600" />
                </div>
                <Progress value={completionPercentage} className="h-2" />
                <p className="text-xs text-muted-foreground mt-2">
                  {profileData.stats.coursesCompleted} of {profileData.stats.coursesEnrolled} courses completed
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Study Hours</p>
                    <p className="text-2xl font-bold">{profileData.stats.totalStudyHours}</p>
                  </div>
                  <Clock className="w-8 h-8 text-blue-600" />
                </div>
                <p className="text-xs text-muted-foreground">Total time spent learning</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Certificates</p>
                    <p className="text-2xl font-bold">{profileData.stats.certificatesEarned}</p>
                  </div>
                  <Award className="w-8 h-8 text-yellow-500" />
                </div>
                <p className="text-xs text-muted-foreground">Certificates earned</p>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Learning Streak</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Current Streak</span>
                    <Badge className="bg-green-500">{profileData.stats.currentStreak} days</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Longest Streak</span>
                    <Badge variant="outline">{profileData.stats.longestStreak} days</Badge>
                  </div>
                  <Progress
                    value={(profileData.stats.currentStreak / profileData.stats.longestStreak) * 100}
                    className="h-2"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Course Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Enrolled</span>
                    <span className="font-semibold">{profileData.stats.coursesEnrolled}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Completed</span>
                    <span className="font-semibold text-green-600">{profileData.stats.coursesCompleted}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">In Progress</span>
                    <span className="font-semibold text-blue-600">
                      {profileData.stats.coursesEnrolled - profileData.stats.coursesCompleted}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
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
                    <p className="text-sm text-muted-foreground">Receive course updates via email</p>
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
                    <Label>Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive mobile push notifications</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={profileData.preferences.pushNotifications}
                    onChange={(e) => handlePreferenceChange("pushNotifications", e.target.checked)}
                    className="toggle"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Marketing Emails</Label>
                    <p className="text-sm text-muted-foreground">Receive promotional content</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={profileData.preferences.marketingEmails}
                    onChange={(e) => handlePreferenceChange("marketingEmails", e.target.checked)}
                    className="toggle"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Course Recommendations</Label>
                    <p className="text-sm text-muted-foreground">Get personalized course suggestions</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={profileData.preferences.courseRecommendations}
                    onChange={(e) => handlePreferenceChange("courseRecommendations", e.target.checked)}
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
                    <Label>Show Learning Progress</Label>
                    <p className="text-sm text-muted-foreground">Display your progress to others</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={profileData.preferences.showProgress}
                    onChange={(e) => handlePreferenceChange("showProgress", e.target.checked)}
                    className="toggle"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Language & Region */}
            <Card>
              <CardHeader>
                <CardTitle>Language & Region</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Language</Label>
                  <Select
                    value={profileData.preferences.language}
                    onValueChange={(value) => handlePreferenceChange("language", value)}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="English">English</SelectItem>
                      <SelectItem value="Spanish">Spanish</SelectItem>
                      <SelectItem value="French">French</SelectItem>
                      <SelectItem value="German">German</SelectItem>
                      <SelectItem value="Indonesian">Indonesian</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Timezone</Label>
                  <Select
                    value={profileData.preferences.timezone}
                    onValueChange={(value) => handlePreferenceChange("timezone", value)}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                      <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                      <SelectItem value="Europe/London">Greenwich Mean Time (GMT)</SelectItem>
                      <SelectItem value="Asia/Jakarta">Western Indonesia Time (WIB)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {profileData.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-4 p-3 border rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-midnight-blue-100 flex items-center justify-center">
                      {activity.type === "course_completed" && <BookOpen className="w-5 h-5 text-midnight-blue-600" />}
                      {activity.type === "certificate_earned" && <Award className="w-5 h-5 text-yellow-500" />}
                      {activity.type === "course_enrolled" && <Star className="w-5 h-5 text-blue-500" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">
                        {activity.type === "course_completed" && "Completed course"}
                        {activity.type === "certificate_earned" && "Earned certificate"}
                        {activity.type === "course_enrolled" && "Enrolled in course"}
                      </p>
                      <p className="text-sm text-muted-foreground">{activity.title}</p>
                    </div>
                    <div className="text-sm text-muted-foreground">{new Date(activity.date).toLocaleDateString()}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
