"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Award, Download, Share2, Search, Calendar, CheckCircle } from "lucide-react"

const certificates = [
  {
    id: 1,
    courseName: "Complete React Developer Course",
    instructor: "John Doe",
    completedDate: "2024-01-15",
    certificateId: "CERT-2024-001",
    grade: "A+",
    credentialUrl: "https://example.com/cert/001",
    skills: ["React", "JavaScript", "Redux", "Node.js"],
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    id: 2,
    courseName: "Advanced JavaScript Patterns",
    instructor: "Jane Smith",
    completedDate: "2024-01-10",
    certificateId: "CERT-2024-002",
    grade: "A",
    credentialUrl: "https://example.com/cert/002",
    skills: ["JavaScript", "Design Patterns", "ES6+", "Async Programming"],
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    id: 3,
    courseName: "Python for Data Science",
    instructor: "Robert Lee",
    completedDate: "2024-01-05",
    certificateId: "CERT-2024-003",
    grade: "A-",
    credentialUrl: "https://example.com/cert/003",
    skills: ["Python", "Pandas", "NumPy", "Data Analysis"],
    image: "/placeholder.svg?height=300&width=400",
  },
]

export function Certificates() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-midnight-blue-800">My Certificates</h1>
          <p className="text-muted-foreground">View and download your earned certificates</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input placeholder="Search certificates..." className="pl-10 w-64" />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Certificates</p>
                <p className="text-2xl font-bold">{certificates.length}</p>
              </div>
              <Award className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">This Month</p>
                <p className="text-2xl font-bold">2</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Average Grade</p>
                <p className="text-2xl font-bold">A</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Certificates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certificates.map((cert) => (
          <Card key={cert.id} className="group hover:shadow-lg transition-shadow">
            <div className="relative">
              <img
                src={cert.image || "/placeholder.svg"}
                alt={`Certificate for ${cert.courseName}`}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <Badge className="absolute top-2 right-2 bg-yellow-500 text-white">Grade: {cert.grade}</Badge>
            </div>
            <CardHeader>
              <CardTitle className="text-lg">{cert.courseName}</CardTitle>
              <CardDescription>
                <div className="space-y-2">
                  <span className="block">Instructor: {cert.instructor}</span>
                  <span className="block">Completed: {new Date(cert.completedDate).toLocaleDateString()}</span>
                  <span className="block text-xs">Certificate ID: {cert.certificateId}</span>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-2">Skills Earned:</p>
                  <div className="flex flex-wrap gap-1">
                    {cert.skills.map((skill, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1 bg-midnight-blue-800 hover:bg-midnight-blue-900">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                  <Button size="sm" variant="outline">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
