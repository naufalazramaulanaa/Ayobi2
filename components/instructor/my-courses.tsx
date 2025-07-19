"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  Edit,
  Eye,
  Trash2,
  Users,
  DollarSign,
  BookOpen,
  Star,
  TrendingUp,
  Calendar,
} from "lucide-react"

interface Course {
  id: string
  title: string
  description: string
  thumbnail: string
  category: string
  level: string
  price: number
  status: "draft" | "published" | "under-review" | "rejected"
  students: number
  rating: number
  reviews: number
  revenue: number
  createdAt: string
  lastUpdated: string
  modules: number
  duration: string
}

const mockCourses: Course[] = [
  {
    id: "1",
    title: "Complete React Developer Course",
    description: "Learn React from basics to advanced concepts with hands-on projects",
    thumbnail: "/placeholder.svg?height=200&width=300",
    category: "Web Development",
    level: "Intermediate",
    price: 99,
    status: "published",
    students: 1247,
    rating: 4.8,
    reviews: 324,
    revenue: 12453,
    createdAt: "2024-01-15",
    lastUpdated: "2024-01-20",
    modules: 12,
    duration: "24 hours",
  },
  {
    id: "2",
    title: "Advanced JavaScript Concepts",
    description: "Master advanced JavaScript concepts and modern ES6+ features",
    thumbnail: "/placeholder.svg?height=200&width=300",
    category: "Web Development",
    level: "Advanced",
    price: 149,
    status: "published",
    students: 892,
    rating: 4.9,
    reviews: 156,
    revenue: 13308,
    createdAt: "2024-02-01",
    lastUpdated: "2024-02-10",
    modules: 8,
    duration: "18 hours",
  },
  {
    id: "3",
    title: "UI/UX Design Fundamentals",
    description: "Learn the principles of user interface and user experience design",
    thumbnail: "/placeholder.svg?height=200&width=300",
    category: "UI/UX Design",
    level: "Beginner",
    price: 79,
    status: "under-review",
    students: 0,
    rating: 0,
    reviews: 0,
    revenue: 0,
    createdAt: "2024-03-01",
    lastUpdated: "2024-03-05",
    modules: 6,
    duration: "12 hours",
  },
  {
    id: "4",
    title: "Node.js Backend Development",
    description: "Build scalable backend applications with Node.js and Express",
    thumbnail: "/placeholder.svg?height=200&width=300",
    category: "Web Development",
    level: "Intermediate",
    price: 129,
    status: "draft",
    students: 0,
    rating: 0,
    reviews: 0,
    revenue: 0,
    createdAt: "2024-03-10",
    lastUpdated: "2024-03-15",
    modules: 10,
    duration: "20 hours",
  },
]

export function MyCourses() {
  const [courses, setCourses] = useState<Course[]>(mockCourses)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || course.status === statusFilter
    const matchesCategory = categoryFilter === "all" || course.category === categoryFilter

    return matchesSearch && matchesStatus && matchesCategory
  })

  const getStatusBadge = (status: Course["status"]) => {
    const variants = {
      published: "bg-green-100 text-green-800",
      draft: "bg-gray-100 text-gray-800",
      "under-review": "bg-yellow-100 text-yellow-800",
      rejected: "bg-red-100 text-red-800",
    }
    return (
      <Badge className={variants[status]}>
        {status.replace("-", " ").charAt(0).toUpperCase() + status.replace("-", " ").slice(1)}
      </Badge>
    )
  }

  const totalCourses = courses.length
  const publishedCourses = courses.filter((c) => c.status === "published").length
  const totalStudents = courses.reduce((sum, course) => sum + course.students, 0)
  const totalRevenue = courses.reduce((sum, course) => sum + course.revenue, 0)

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-midnight-blue-800">My Courses</h1>
          <p className="text-muted-foreground">Manage and track your course portfolio</p>
        </div>
        <Button className="bg-midnight-blue-800 hover:bg-midnight-blue-900">
          <Plus className="w-4 h-4 mr-2" />
          Create New Course
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Courses</p>
                <p className="text-2xl font-bold text-midnight-blue-800">{totalCourses}</p>
              </div>
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Published</p>
                <p className="text-2xl font-bold text-green-600">{publishedCourses}</p>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Students</p>
                <p className="text-2xl font-bold text-purple-600">{totalStudents}</p>
              </div>
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="w-4 h-4 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold text-orange-600">${totalRevenue}</p>
              </div>
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="under-review">Under Review</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Web Development">Web Development</SelectItem>
                <SelectItem value="Mobile Development">Mobile Development</SelectItem>
                <SelectItem value="UI/UX Design">UI/UX Design</SelectItem>
                <SelectItem value="Data Science">Data Science</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-video relative">
              <img
                src={course.thumbnail || "/placeholder.svg"}
                alt={course.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2">{getStatusBadge(course.status)}</div>
            </div>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-lg line-clamp-1">{course.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{course.description}</p>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <Badge variant="outline">{course.category}</Badge>
                  <Badge variant="outline">{course.level}</Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Price:</span>
                    <span className="font-medium">${course.price}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Students:</span>
                    <span className="font-medium">{course.students}</span>
                  </div>
                  {course.rating > 0 && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Rating:</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{course.rating}</span>
                        <span className="text-muted-foreground">({course.reviews})</span>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Revenue:</span>
                    <span className="font-medium text-green-600">${course.revenue}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{course.modules} modules</span>
                  <span>{course.duration}</span>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Eye className="w-3 h-3 mr-1" />
                    View
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <Edit className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="sm" variant="outline">
                        <MoreHorizontal className="w-3 h-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Users className="w-3 h-3 mr-2" />
                        View Students
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <TrendingUp className="w-3 h-3 mr-2" />
                        Analytics
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Calendar className="w-3 h-3 mr-2" />
                        Schedule
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="w-3 h-3 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium mb-2">No courses found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || statusFilter !== "all" || categoryFilter !== "all"
                ? "Try adjusting your search or filters"
                : "Start by creating your first course"}
            </p>
            <Button className="bg-midnight-blue-800 hover:bg-midnight-blue-900">
              <Plus className="w-4 h-4 mr-2" />
              Create New Course
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
