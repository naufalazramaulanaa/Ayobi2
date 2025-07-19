"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { User, Briefcase, GraduationCap, Award, Download, Eye, Sparkles, Plus, Trash2 } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export function InstructorCVMaker() {
  const [cvData, setCvData] = useState({
    personalInfo: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      country: "",
      linkedinUrl: "",
      websiteUrl: "",
      summary: "",
    },
    experience: [
      {
        id: 1,
        jobTitle: "",
        company: "",
        location: "",
        startDate: "",
        endDate: "",
        current: false,
        description: "",
      },
    ],
    education: [
      {
        id: 1,
        degree: "",
        institution: "",
        location: "",
        graduationDate: "",
        gpa: "",
        description: "",
      },
    ],
    skills: [],
    certifications: [
      {
        id: 1,
        name: "",
        issuer: "",
        date: "",
        credentialId: "",
        url: "",
      },
    ],
    projects: [
      {
        id: 1,
        name: "",
        description: "",
        technologies: "",
        url: "",
        startDate: "",
        endDate: "",
      },
    ],
    languages: [
      {
        id: 1,
        language: "",
        proficiency: "",
      },
    ],
  })

  const [selectedTemplate, setSelectedTemplate] = useState("modern")
  const [newSkill, setNewSkill] = useState("")

  const templates = [
    { id: "modern", name: "Modern", description: "Clean and professional" },
    { id: "creative", name: "Creative", description: "Colorful and unique" },
    { id: "minimal", name: "Minimal", description: "Simple and elegant" },
    { id: "executive", name: "Executive", description: "Traditional and formal" },
  ]

  const skillSuggestions = [
    "JavaScript",
    "Python",
    "React",
    "Node.js",
    "HTML/CSS",
    "SQL",
    "Git",
    "Project Management",
    "Leadership",
    "Communication",
    "Problem Solving",
    "Data Analysis",
    "Machine Learning",
    "UI/UX Design",
    "Digital Marketing",
  ]

  const handlePersonalInfoChange = (field: string, value: string) => {
    setCvData((prev) => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value,
      },
    }))
  }

  const handleArrayItemChange = (section: string, id: number, field: string, value: any) => {
    setCvData((prev) => ({
      ...prev,
      [section]: prev[section as keyof typeof prev].map((item: any) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    }))
  }

  const addArrayItem = (section: string) => {
    const newId = Date.now()
    const newItem = { id: newId }

    setCvData((prev) => ({
      ...prev,
      [section]: [...prev[section as keyof typeof prev], newItem],
    }))
  }

  const removeArrayItem = (section: string, id: number) => {
    setCvData((prev) => ({
      ...prev,
      [section]: prev[section as keyof typeof prev].filter((item: any) => item.id !== id),
    }))
  }

  const addSkill = () => {
    if (newSkill.trim() && !cvData.skills.includes(newSkill.trim())) {
      setCvData((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }))
      setNewSkill("")
    }
  }

  const removeSkill = (skill: string) => {
    setCvData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }))
  }

  const generateWithAI = (section: string) => {
    toast({
      title: "AI Generation",
      description: `AI content generation for ${section} is coming soon!`,
    })
  }

  const handlePreview = () => {
    toast({
      title: "Preview",
      description: "CV preview will open in a new window",
    })
  }

  const handleDownload = (format: string) => {
    toast({
      title: "Download",
      description: `CV will be downloaded as ${format.toUpperCase()}`,
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">CV Maker</h1>
            <p className="text-gray-600">Create a professional CV with AI assistance</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" onClick={handlePreview}>
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button onClick={() => handleDownload("pdf")} className="bg-midnight-blue-600 hover:bg-midnight-blue-700">
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="personal" className="space-y-6">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="personal">Personal</TabsTrigger>
               <TabsTrigger value="experience" disabled>
  Experience <Badge className="ml-2 text-[0.4rem]" variant="destructive">Coming Soon</Badge>
</TabsTrigger>
<TabsTrigger value="education" disabled>
  Education <Badge className="ml-2 text-[0.4rem]" variant="destructive">Coming Soon</Badge>
</TabsTrigger>
<TabsTrigger value="skills" disabled>
  Skills <Badge className="ml-2 text-[0.4rem]" variant="destructive">Coming Soon</Badge>
</TabsTrigger>
<TabsTrigger value="certifications" disabled>
  Certifications <Badge className="ml-2 text-[0.4rem]" variant="destructive">Coming Soon</Badge>
</TabsTrigger>
<TabsTrigger value="projects" disabled>
  Projects <Badge className="ml-2 text-[0.4rem]" variant="destructive">Coming Soon</Badge>
</TabsTrigger>

              </TabsList>

              <TabsContent value="personal" className="space-y-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center">
                      <User className="w-5 h-5 mr-2" />
                      Personal Information
                    </CardTitle>
                    <Button size="sm" variant="outline" onClick={() => generateWithAI("personal")}>
                      <Sparkles className="w-4 h-4 mr-2" />
                      AI Assist
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          value={cvData.personalInfo.firstName}
                          onChange={(e) => handlePersonalInfoChange("firstName", e.target.value)}
                          placeholder="John"
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          value={cvData.personalInfo.lastName}
                          onChange={(e) => handlePersonalInfoChange("lastName", e.target.value)}
                          placeholder="Doe"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          value={cvData.personalInfo.email}
                          onChange={(e) => handlePersonalInfoChange("email", e.target.value)}
                          placeholder="email@example.com"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          value={cvData.personalInfo.phone}
                          onChange={(e) => handlePersonalInfoChange("phone", e.target.value)}
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        value={cvData.personalInfo.address}
                        onChange={(e) => handlePersonalInfoChange("address", e.target.value)}
                        placeholder="123 Main Street"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          value={cvData.personalInfo.city}
                          onChange={(e) => handlePersonalInfoChange("city", e.target.value)}
                          placeholder="New York"
                        />
                      </div>
                      <div>
                        <Label htmlFor="country">Country</Label>
                        <Input
                          id="country"
                          value={cvData.personalInfo.country}
                          onChange={(e) => handlePersonalInfoChange("country", e.target.value)}
                          placeholder="United States"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
                        <Input
                          id="linkedinUrl"
                          value={cvData.personalInfo.linkedinUrl}
                          onChange={(e) => handlePersonalInfoChange("linkedinUrl", e.target.value)}
                          placeholder="https://linkedin.com/in/johndoe"
                        />
                      </div>
                      <div>
                        <Label htmlFor="websiteUrl">Website URL</Label>
                        <Input
                          id="websiteUrl"
                          value={cvData.personalInfo.websiteUrl}
                          onChange={(e) => handlePersonalInfoChange("websiteUrl", e.target.value)}
                          placeholder="https://johndoe.com"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="summary">Professional Summary</Label>
                      <Textarea
                        id="summary"
                        value={cvData.personalInfo.summary}
                        onChange={(e) => handlePersonalInfoChange("summary", e.target.value)}
                        placeholder="Write a brief summary of your professional background and career objectives..."
                        rows={4}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Template Selection */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Template</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedTemplate === template.id
                        ? "border-midnight-blue-600 bg-midnight-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => setSelectedTemplate(template.id)}
                  >
                    <h3 className="font-medium">{template.name}</h3>
                    <p className="text-sm text-gray-600">{template.description}</p>
                  </div>
                ))}

                <Separator />

                <div className="space-y-2">
                  <Button variant="outline" className="w-full" onClick={handlePreview}>
                    <Eye className="w-4 h-4 mr-2" />
                    Preview CV
                  </Button>

                  <Button
                    className="w-full bg-midnight-blue-600 hover:bg-midnight-blue-700"
                    onClick={() => handleDownload("pdf")}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </Button>

                  <Button variant="outline" className="w-full" onClick={() => handleDownload("docx")}>
                    <Download className="w-4 h-4 mr-2" />
                    Download Word
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
