"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  FileText,
  Download,
  Eye,
  Sparkles,
  Plus,
  Trash2,
  Upload,
  User,
  Briefcase,
  GraduationCap,
  Code,
  Globe,
} from "lucide-react"

interface PersonalInfo {
  fullName: string
  email: string
  phone: string
  location: string
  website: string
  linkedin: string
  github: string
  summary: string
}

interface Experience {
  id: string
  company: string
  position: string
  startDate: string
  endDate: string
  current: boolean
  description: string
}

interface Education {
  id: string
  institution: string
  degree: string
  field: string
  startDate: string
  endDate: string
  gpa: string
}

interface Skill {
  id: string
  name: string
  level: "Beginner" | "Intermediate" | "Advanced" | "Expert"
}

export function StudentCVMaker() {
  const [activeTab, setActiveTab] = useState("personal")
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    website: "",
    linkedin: "",
    github: "",
    summary: "",
  })

  const [experiences, setExperiences] = useState<Experience[]>([])
  const [education, setEducation] = useState<Education[]>([])
  const [skills, setSkills] = useState<Skill[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState("modern")

  const addExperience = () => {
    const newExp: Experience = {
      id: Date.now().toString(),
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
    }
    setExperiences([...experiences, newExp])
  }

  const removeExperience = (id: string) => {
    setExperiences(experiences.filter((exp) => exp.id !== id))
  }

  const addEducation = () => {
    const newEdu: Education = {
      id: Date.now().toString(),
      institution: "",
      degree: "",
      field: "",
      startDate: "",
      endDate: "",
      gpa: "",
    }
    setEducation([...education, newEdu])
  }

  const removeEducation = (id: string) => {
    setEducation(education.filter((edu) => edu.id !== id))
  }

  const addSkill = () => {
    const newSkill: Skill = {
      id: Date.now().toString(),
      name: "",
      level: "Beginner",
    }
    setSkills([...skills, newSkill])
  }

  const removeSkill = (id: string) => {
    setSkills(skills.filter((skill) => skill.id !== id))
  }

  const updateExperience = (id: string, field: keyof Experience, value: string | boolean) => {
    setExperiences(experiences.map((exp) => (exp.id === id ? { ...exp, [field]: value } : exp)))
  }

  const updateEducation = (id: string, field: keyof Education, value: string) => {
    setEducation(education.map((edu) => (edu.id === id ? { ...edu, [field]: value } : edu)))
  }

  const updateSkill = (id: string, field: keyof Skill, value: string) => {
    setSkills(skills.map((skill) => (skill.id === id ? { ...skill, [field]: value } : skill)))
  }

  const templates = [
    { id: "modern", name: "Modern", description: "Clean and professional" },
    { id: "creative", name: "Creative", description: "Colorful and unique" },
    { id: "minimal", name: "Minimal", description: "Simple and elegant" },
    { id: "corporate", name: "Corporate", description: "Traditional business style" },
  ]

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">CV Maker</h1>
            <p className="text-gray-600">Create a professional CV with our AI-powered builder</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Preview
            </Button>
            <Button className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Download PDF
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* CV Builder Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Build Your CV
              </CardTitle>
              <CardDescription>Fill in your information to create a professional CV</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="personal" className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    Personal
                  </TabsTrigger>
                  <TabsTrigger value="experience" className="flex items-center gap-1">
                    <Briefcase className="w-4 h-4" />
                    Experience
                  </TabsTrigger>
                  <TabsTrigger value="education" className="flex items-center gap-1">
                    <GraduationCap className="w-4 h-4" />
                    Education
                  </TabsTrigger>
                  <TabsTrigger value="skills" className="flex items-center gap-1">
                    <Code className="w-4 h-4" />
                    Skills
                  </TabsTrigger>
                  <TabsTrigger value="template" className="flex items-center gap-1">
                    <Globe className="w-4 h-4" />
                    Template
                  </TabsTrigger>
                </TabsList>

                {/* Personal Information Tab */}
                <TabsContent value="personal" className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Personal Information</h3>
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      AI Assist
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input
                        id="fullName"
                        value={personalInfo.fullName}
                        onChange={(e) => setPersonalInfo({ ...personalInfo, fullName: e.target.value })}
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={personalInfo.email}
                        onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
                        placeholder="john@example.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={personalInfo.phone}
                        onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={personalInfo.location}
                        onChange={(e) => setPersonalInfo({ ...personalInfo, location: e.target.value })}
                        placeholder="New York, NY"
                      />
                    </div>
                    <div>
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        value={personalInfo.website}
                        onChange={(e) => setPersonalInfo({ ...personalInfo, website: e.target.value })}
                        placeholder="https://johndoe.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="linkedin">LinkedIn</Label>
                      <Input
                        id="linkedin"
                        value={personalInfo.linkedin}
                        onChange={(e) => setPersonalInfo({ ...personalInfo, linkedin: e.target.value })}
                        placeholder="linkedin.com/in/johndoe"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="summary">Professional Summary</Label>
                    <Textarea
                      id="summary"
                      value={personalInfo.summary}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, summary: e.target.value })}
                      placeholder="Write a brief summary of your professional background and goals..."
                      rows={4}
                    />
                  </div>
                </TabsContent>

                {/* Experience Tab */}
                <TabsContent value="experience" className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Work Experience</h3>
                    <Button onClick={addExperience} className="flex items-center gap-2">
                      <Plus className="w-4 h-4" />
                      Add Experience
                    </Button>
                  </div>

                  {experiences.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No work experience added yet</p>
                      <p className="text-sm">Click "Add Experience" to get started</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {experiences.map((exp, index) => (
                        <Card key={exp.id} className="p-4">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-medium">Experience {index + 1}</h4>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeExperience(exp.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label>Company *</Label>
                              <Input
                                placeholder="Company Name"
                                value={exp.company}
                                onChange={(e) => updateExperience(exp.id, "company", e.target.value)}
                              />
                            </div>
                            <div>
                              <Label>Position *</Label>
                              <Input
                                placeholder="Job Title"
                                value={exp.position}
                                onChange={(e) => updateExperience(exp.id, "position", e.target.value)}
                              />
                            </div>
                            <div>
                              <Label>Start Date *</Label>
                              <Input
                                type="month"
                                value={exp.startDate}
                                onChange={(e) => updateExperience(exp.id, "startDate", e.target.value)}
                              />
                            </div>
                            <div>
                              <Label>End Date</Label>
                              <Input
                                type="month"
                                placeholder="Present"
                                value={exp.endDate}
                                onChange={(e) => updateExperience(exp.id, "endDate", e.target.value)}
                                disabled={exp.current}
                              />
                            </div>
                          </div>
                          <div className="mt-4">
                            <Label>Description</Label>
                            <Textarea
                              placeholder="Describe your responsibilities and achievements..."
                              rows={3}
                              value={exp.description}
                              onChange={(e) => updateExperience(exp.id, "description", e.target.value)}
                            />
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>

                {/* Education Tab */}
                <TabsContent value="education" className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Education</h3>
                    <Button onClick={addEducation} className="flex items-center gap-2">
                      <Plus className="w-4 h-4" />
                      Add Education
                    </Button>
                  </div>

                  {education.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <GraduationCap className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No education added yet</p>
                      <p className="text-sm">Click "Add Education" to get started</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {education.map((edu, index) => (
                        <Card key={edu.id} className="p-4">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-medium">Education {index + 1}</h4>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeEducation(edu.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label>Institution *</Label>
                              <Input
                                placeholder="University Name"
                                value={edu.institution}
                                onChange={(e) => updateEducation(edu.id, "institution", e.target.value)}
                              />
                            </div>
                            <div>
                              <Label>Degree *</Label>
                              <Input
                                placeholder="Bachelor's, Master's, etc."
                                value={edu.degree}
                                onChange={(e) => updateEducation(edu.id, "degree", e.target.value)}
                              />
                            </div>
                            <div>
                              <Label>Field of Study</Label>
                              <Input
                                placeholder="Computer Science"
                                value={edu.field}
                                onChange={(e) => updateEducation(edu.id, "field", e.target.value)}
                              />
                            </div>
                            <div>
                              <Label>GPA</Label>
                              <Input
                                placeholder="3.8/4.0"
                                value={edu.gpa}
                                onChange={(e) => updateEducation(edu.id, "gpa", e.target.value)}
                              />
                            </div>
                            <div>
                              <Label>Start Date</Label>
                              <Input
                                type="month"
                                value={edu.startDate}
                                onChange={(e) => updateEducation(edu.id, "startDate", e.target.value)}
                              />
                            </div>
                            <div>
                              <Label>End Date</Label>
                              <Input
                                type="month"
                                value={edu.endDate}
                                onChange={(e) => updateEducation(edu.id, "endDate", e.target.value)}
                              />
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>

                {/* Skills Tab */}
                <TabsContent value="skills" className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Skills</h3>
                    <Button onClick={addSkill} className="flex items-center gap-2">
                      <Plus className="w-4 h-4" />
                      Add Skill
                    </Button>
                  </div>

                  {skills.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Code className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No skills added yet</p>
                      <p className="text-sm">Click "Add Skill" to get started</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {skills.map((skill, index) => (
                        <Card key={skill.id} className="p-4">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-medium">Skill {index + 1}</h4>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeSkill(skill.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label>Skill Name *</Label>
                              <Input
                                placeholder="JavaScript, Python, etc."
                                value={skill.name}
                                onChange={(e) => updateSkill(skill.id, "name", e.target.value)}
                              />
                            </div>
                            <div>
                              <Label>Proficiency Level</Label>
                              <Select
                                value={skill.level}
                                onValueChange={(value) => updateSkill(skill.id, "level", value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select level" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Beginner">Beginner</SelectItem>
                                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                                  <SelectItem value="Advanced">Advanced</SelectItem>
                                  <SelectItem value="Expert">Expert</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>

                {/* Template Tab */}
                <TabsContent value="template" className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Choose Template</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {templates.map((template) => (
                        <Card
                          key={template.id}
                          className={`cursor-pointer transition-all ${
                            selectedTemplate === template.id ? "ring-2 ring-blue-500 bg-blue-50" : "hover:shadow-md"
                          }`}
                          onClick={() => setSelectedTemplate(template.id)}
                        >
                          <CardContent className="p-4">
                            <div className="aspect-[3/4] bg-gray-100 rounded mb-3 flex items-center justify-center">
                              <FileText className="w-8 h-8 text-gray-400" />
                            </div>
                            <h4 className="font-medium">{template.name}</h4>
                            <p className="text-sm text-gray-600">{template.description}</p>
                            {selectedTemplate === template.id && <Badge className="mt-2">Selected</Badge>}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* CV Preview */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Live Preview
              </CardTitle>
              <CardDescription>See how your CV looks in real-time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-[3/4] bg-white border rounded-lg p-4 text-xs overflow-hidden shadow-sm">
                {/* CV Preview Content */}
                <div className="space-y-3">
                  <div className="text-center border-b pb-2">
                    <h2 className="font-bold text-sm">{personalInfo.fullName || "Your Name"}</h2>
                    <p className="text-gray-600">{personalInfo.email || "your.email@example.com"}</p>
                    {personalInfo.phone && <p className="text-gray-600">{personalInfo.phone}</p>}
                    {personalInfo.location && <p className="text-gray-600">{personalInfo.location}</p>}
                  </div>

                  {personalInfo.summary && (
                    <div>
                      <h3 className="font-semibold text-xs mb-1 uppercase">Summary</h3>
                      <p className="text-gray-700 text-xs leading-tight">
                        {personalInfo.summary.substring(0, 150)}
                        {personalInfo.summary.length > 150 ? "..." : ""}
                      </p>
                    </div>
                  )}

                  {experiences.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-xs mb-1 uppercase">Experience</h3>
                      <div className="space-y-2">
                        {experiences.slice(0, 2).map((exp, index) => (
                          <div key={index} className="text-xs">
                            <p className="font-medium">
                              {exp.position || "Position"} • {exp.company || "Company"}
                            </p>
                            <p className="text-gray-600">
                              {exp.startDate || "Start"} - {exp.endDate || "Present"}
                            </p>
                            {exp.description && (
                              <p className="text-gray-700 mt-1 leading-tight">{exp.description.substring(0, 80)}...</p>
                            )}
                          </div>
                        ))}
                        {experiences.length > 2 && (
                          <p className="text-xs text-gray-500 italic">+{experiences.length - 2} more...</p>
                        )}
                      </div>
                    </div>
                  )}

                  {education.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-xs mb-1 uppercase">Education</h3>
                      <div className="space-y-1">
                        {education.slice(0, 2).map((edu, index) => (
                          <div key={index} className="text-xs">
                            <p className="font-medium">
                              {edu.degree || "Degree"} • {edu.institution || "Institution"}
                            </p>
                            <p className="text-gray-600">
                              {edu.field && `${edu.field} • `}
                              {edu.startDate || "Start"} - {edu.endDate || "End"}
                            </p>
                            {edu.gpa && <p className="text-gray-600">GPA: {edu.gpa}</p>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {skills.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-xs mb-1 uppercase">Skills</h3>
                      <div className="flex flex-wrap gap-1">
                        {skills.slice(0, 8).map((skill, index) => (
                          <Badge key={index} variant="secondary" className="text-xs px-1 py-0">
                            {skill.name || "Skill"}
                          </Badge>
                        ))}
                        {skills.length > 8 && (
                          <Badge variant="outline" className="text-xs px-1 py-0">
                            +{skills.length - 8}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <Button className="w-full flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Download PDF
                </Button>
                <Button variant="outline" className="w-full flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  Save to Cloud
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
