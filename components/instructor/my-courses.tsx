"use client"

import { useEffect, useState } from "react"
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
import { fetchData } from "@/lib/api"

interface Module {
  id: number
  title: string
  description?: string
  order: number
  lessons?: any[]
  quizzes?: any[]
}

interface Course {
  id: number
  title: string
  description?: string
  thumbnail: string
  category: { name: string }
  level: { name: string }
  price?: number
  status: "draft" | "published" | "under-review" | "rejected"
  students: number
  rating: number
  reviews: number
  revenue: number
  created_at: string
  updated_at: string
  modules?: number
  duration: string
}

export function MyCourses() {
  const [courses, setCourses] = useState<Course[]>([]) // sudah array dari awal
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all");
const [categoryFilter, setCategoryFilter] = useState("all");

//   const [courseData, setCourseData] = useState<{ courses: Course[]; stats: any }>({
//   courses: [],
//   stats: {},
// })


useEffect(() => {
  const fetchCourses = async () => {
    try {
      const response = await fetchData("/instructor/my-courses?per_page=7", { method: "GET" })
      console.log("✅ Response:", response)
      setCourses(response.data.courses || []) // <== ini fix-nya
    } catch (err) {
      console.error("❌ Fetch Error:", err)
    } finally {
      setLoading(false)
    }
  }

  fetchCourses()
}, [])


  const filteredCourses = (courses || []).filter((course) => {
    const matchesSearch =
      !searchTerm ||
      course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || course.status === statusFilter
    const matchesCategory = categoryFilter === "all" || course.category?.name === categoryFilter

    return matchesSearch && matchesStatus && matchesCategory
  })



  const getStatusBadge = (status?: Course["status"]) => {
  if (!status) return null;

  const variants = {
    published: "bg-green-100 text-green-800",
    draft: "bg-gray-100 text-gray-800",
    "under-review": "bg-yellow-100 text-yellow-800",
    rejected: "bg-red-100 text-red-800",
  };

  const label = status.replace("-", " ");
  const badgeStyle = variants[status] || "bg-gray-100 text-gray-800";

  return (
    <Badge className={badgeStyle}>
      {label.charAt(0).toUpperCase() + label.slice(1)}
    </Badge>
  );
};


  const totalCourses = courses.length
  const publishedCourses = courses.filter((c) => c.status === "published").length
  const totalStudents = courses.reduce((sum, course) => sum + course.students, 0)
const totalRevenue = Array.isArray(courses)
  ? courses.reduce((sum, course) => sum + Number(course.revenue ?? 0), 0)
  : 0;



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
                <p className="text-2xl font-bold text-purple-600">${Number(totalStudents ?? 0).toFixed(2)}</p>
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
                <p className="text-2xl font-bold text-orange-600">
  ${Number(totalRevenue ?? 0).toFixed(2)}

</p>

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
                   <Badge variant="outline">{course.category?.name || "No category"}</Badge>
                    <Badge variant="outline">{course.level?.name || "No level"}</Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Price:</span>
                    <span className="font-medium">${Number(course.price ?? 0).toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Students:</span>
                    <span className="font-medium">{course.students ?? 0}</span>
                  </div>
                  {course.rating > 0 && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Rating:</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{typeof course.rating === "number" ? `$${course.rating}` : "$0"}</span>
                        <span className="text-muted-foreground">({course.reviews ?? 0})</span>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Revenue:</span>
                    <span>{typeof course.revenue === "number" ? `$${course.revenue}` : "$0"}</span>

                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{Array.isArray(course.modules) ? course.modules.length : 0} modules</span>

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