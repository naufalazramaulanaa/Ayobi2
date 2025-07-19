"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { User, GraduationCap, FileText, CheckCircle, Upload, Star, Users, DollarSign, BookOpen } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export function BecomeInstructor() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    // Personal Info
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    country: "",
    city: "",

    // Professional Info
    profession: "",
    experience: "",
    expertise: [],
    bio: "",
    linkedinUrl: "",
    websiteUrl: "",

    // Teaching Info
    teachingExperience: "",
    courseTopics: [],
    targetAudience: "",
    teachingStyle: "",

    // Documents
    resume: null,
    portfolio: null,
    certificates: [],

    // Agreement
    termsAccepted: false,
    marketingConsent: false,
  })

  const totalSteps = 4
  const progress = (currentStep / totalSteps) * 100

  const expertiseOptions = [
    "Web Development",
    "Mobile Development",
    "UI/UX Design",
    "Data Science",
    "Digital Marketing",
    "Business & Management",
    "Graphic Design",
    "Photography",
    "Music Production",
    "Language Learning",
    "Finance",
    "Health & Fitness",
  ]

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleArrayToggle = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field as keyof typeof prev].includes(value)
        ? (prev[field as keyof typeof prev] as string[]).filter((item) => item !== value)
        : [...(prev[field as keyof typeof prev] as string[]), value],
    }))
  }

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = () => {
    toast({
      title: "Application Submitted!",
      description: "We'll review your application and get back to you within 3-5 business days.",
    })
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <User className="w-12 h-12 text-midnight-blue-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold">Personal Information</h2>
              <p className="text-gray-600">Tell us about yourself</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  placeholder="Enter your first name"
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  placeholder="Enter your last name"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="your.email@example.com"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="country">Country *</Label>
                <Select value={formData.country} onValueChange={(value) => handleInputChange("country", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="us">United States</SelectItem>
                    <SelectItem value="id">Indonesia</SelectItem>
                    <SelectItem value="uk">United Kingdom</SelectItem>
                    <SelectItem value="ca">Canada</SelectItem>
                    <SelectItem value="au">Australia</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  placeholder="Enter your city"
                />
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <GraduationCap className="w-12 h-12 text-midnight-blue-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold">Professional Background</h2>
              <p className="text-gray-600">Share your professional experience</p>
            </div>

            <div>
              <Label htmlFor="profession">Current Profession *</Label>
              <Input
                id="profession"
                value={formData.profession}
                onChange={(e) => handleInputChange("profession", e.target.value)}
                placeholder="e.g., Software Engineer, Marketing Manager"
              />
            </div>

            <div>
              <Label htmlFor="experience">Years of Experience *</Label>
              <Select value={formData.experience} onValueChange={(value) => handleInputChange("experience", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your experience level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-2">1-2 years</SelectItem>
                  <SelectItem value="3-5">3-5 years</SelectItem>
                  <SelectItem value="6-10">6-10 years</SelectItem>
                  <SelectItem value="10+">10+ years</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Areas of Expertise *</Label>
              <p className="text-sm text-gray-600 mb-3">Select all that apply</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {expertiseOptions.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox
                      id={option}
                      checked={formData.expertise.includes(option)}
                      onCheckedChange={() => handleArrayToggle("expertise", option)}
                    />
                    <Label htmlFor={option} className="text-sm">
                      {option}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="bio">Professional Bio *</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => handleInputChange("bio", e.target.value)}
                placeholder="Tell us about your professional background, achievements, and what makes you unique..."
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="linkedinUrl">LinkedIn Profile</Label>
                <Input
                  id="linkedinUrl"
                  value={formData.linkedinUrl}
                  onChange={(e) => handleInputChange("linkedinUrl", e.target.value)}
                  placeholder="https://linkedin.com/in/yourprofile"
                />
              </div>
              <div>
                <Label htmlFor="websiteUrl">Personal Website</Label>
                <Input
                  id="websiteUrl"
                  value={formData.websiteUrl}
                  onChange={(e) => handleInputChange("websiteUrl", e.target.value)}
                  placeholder="https://yourwebsite.com"
                />
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <BookOpen className="w-12 h-12 text-midnight-blue-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold">Teaching Information</h2>
              <p className="text-gray-600">Tell us about your teaching goals</p>
            </div>

            <div>
              <Label htmlFor="teachingExperience">Teaching Experience</Label>
              <Select
                value={formData.teachingExperience}
                onValueChange={(value) => handleInputChange("teachingExperience", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your teaching experience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No formal teaching experience</SelectItem>
                  <SelectItem value="informal">Informal teaching (mentoring, workshops)</SelectItem>
                  <SelectItem value="1-2">1-2 years</SelectItem>
                  <SelectItem value="3-5">3-5 years</SelectItem>
                  <SelectItem value="5+">5+ years</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Course Topics You'd Like to Teach *</Label>
              <p className="text-sm text-gray-600 mb-3">Select all that apply</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {expertiseOptions.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox
                      id={`teach-${option}`}
                      checked={formData.courseTopics.includes(option)}
                      onCheckedChange={() => handleArrayToggle("courseTopics", option)}
                    />
                    <Label htmlFor={`teach-${option}`} className="text-sm">
                      {option}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="targetAudience">Target Audience *</Label>
              <Select
                value={formData.targetAudience}
                onValueChange={(value) => handleInputChange("targetAudience", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Who do you want to teach?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginners">Complete Beginners</SelectItem>
                  <SelectItem value="intermediate">Intermediate Learners</SelectItem>
                  <SelectItem value="advanced">Advanced Students</SelectItem>
                  <SelectItem value="professionals">Working Professionals</SelectItem>
                  <SelectItem value="all">All Levels</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="teachingStyle">Teaching Philosophy & Style *</Label>
              <Textarea
                id="teachingStyle"
                value={formData.teachingStyle}
                onChange={(e) => handleInputChange("teachingStyle", e.target.value)}
                placeholder="Describe your teaching approach, methodology, and what makes your teaching unique..."
                rows={4}
              />
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <FileText className="w-12 h-12 text-midnight-blue-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold">Documents & Agreement</h2>
              <p className="text-gray-600">Upload required documents and review terms</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label>Resume/CV *</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                  <p className="text-xs text-gray-500">PDF, DOC, DOCX (max 5MB)</p>
                </div>
              </div>

              <div>
                <Label>Portfolio (Optional)</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Upload your portfolio or work samples</p>
                  <p className="text-xs text-gray-500">PDF, ZIP (max 10MB)</p>
                </div>
              </div>

              <div>
                <Label>Certificates (Optional)</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Upload relevant certificates or credentials</p>
                  <p className="text-xs text-gray-500">PDF, JPG, PNG (max 5MB each)</p>
                </div>
              </div>
            </div>

            <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="terms"
                  checked={formData.termsAccepted}
                  onCheckedChange={(checked) => handleInputChange("termsAccepted", checked)}
                />
                <Label htmlFor="terms" className="text-sm">
                  I agree to the{" "}
                  <a href="#" className="text-midnight-blue-600 hover:underline">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-midnight-blue-600 hover:underline">
                    Instructor Agreement
                  </a>{" "}
                  *
                </Label>
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="marketing"
                  checked={formData.marketingConsent}
                  onCheckedChange={(checked) => handleInputChange("marketingConsent", checked)}
                />
                <Label htmlFor="marketing" className="text-sm">
                  I consent to receive marketing communications and updates about the instructor program
                </Label>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Become an Instructor</h1>
          <p className="text-xl text-gray-600 mb-6">Join thousands of instructors teaching millions of students</p>

          {/* Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold mb-1">Earn Money</h3>
              <p className="text-sm text-gray-600">Earn up to 70% revenue share</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-1">Reach Students</h3>
              <p className="text-sm text-gray-600">Teach millions of students worldwide</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Star className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-1">Build Reputation</h3>
              <p className="text-sm text-gray-600">Establish yourself as an expert</p>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium">Application Progress</span>
              <span className="text-sm text-gray-500">
                Step {currentStep} of {totalSteps}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between mt-2 text-xs text-gray-500">
              <span>Personal Info</span>
              <span>Professional</span>
              <span>Teaching</span>
              <span>Documents</span>
            </div>
          </CardContent>
        </Card>

        {/* Form Content */}
        <Card>
          <CardContent className="p-8">
            {renderStepContent()}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 1}>
                Previous
              </Button>

              {currentStep < totalSteps ? (
                <Button onClick={handleNext} className="bg-midnight-blue-600 hover:bg-midnight-blue-700">
                  Next Step
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={!formData.termsAccepted}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Submit Application
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* What Happens Next */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>What Happens Next?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-blue-600 font-bold">1</span>
                </div>
                <h3 className="font-semibold mb-2">Application Review</h3>
                <p className="text-sm text-gray-600">We'll review your application within 3-5 business days</p>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-blue-600 font-bold">2</span>
                </div>
                <h3 className="font-semibold mb-2">Interview Process</h3>
                <p className="text-sm text-gray-600">If approved, we'll schedule a brief interview call</p>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-blue-600 font-bold">3</span>
                </div>
                <h3 className="font-semibold mb-2">Start Teaching</h3>
                <p className="text-sm text-gray-600">Get access to instructor tools and start creating courses</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
