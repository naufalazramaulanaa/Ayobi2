"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Edit, Trash2, BookOpen } from "lucide-react"

const courseCategories = [
  { id: 1, name: "Web Development", description: "Frontend and backend web technologies", courses: 45 },
  { id: 2, name: "Mobile Development", description: "iOS, Android, and cross-platform development", courses: 32 },
  { id: 3, name: "UI/UX Design", description: "User interface and user experience design", courses: 28 },
  { id: 4, name: "Data Science", description: "Data analysis, machine learning, and AI", courses: 21 },
  { id: 5, name: "DevOps", description: "Development operations and cloud technologies", courses: 15 },
]

const courseLevels = [
  { id: 1, name: "Beginner", description: "For those new to the subject", color: "green" },
  { id: 2, name: "Intermediate", description: "For those with some experience", color: "yellow" },
  { id: 3, name: "Advanced", description: "For experienced practitioners", color: "red" },
  { id: 4, name: "Expert", description: "For industry professionals", color: "purple" },
]

const courses = [
  {
    id: 1,
    title: "Complete React Developer Course",
    category: "Web Development",
    level: "Intermediate",
    instructor: "John Doe",
    students: 1542,
    price: 89.99,
    status: "Published",
    modules: 12,
    chapters: 48,
    createdAt: "2024-01-15",
  },
  {
    id: 2,
    title: "Advanced JavaScript Patterns",
    category: "Web Development",
    level: "Advanced",
    instructor: "Jane Smith",
    students: 893,
    price: 79.99,
    status: "Published",
    modules: 8,
    chapters: 32,
    createdAt: "2024-01-10",
  },
  {
    id: 3,
    title: "Mobile App Security",
    category: "Mobile Development",
    level: "Expert",
    instructor: "Mike Johnson",
    students: 0,
    price: 129.99,
    status: "Draft",
    modules: 6,
    chapters: 24,
    createdAt: "2024-01-12",
  },
]

export function CourseManagement() {
  const [selectedTab, setSelectedTab] = useState("courses")
  const [isCreateCategoryOpen, setIsCreateCategoryOpen] = useState(false)
  const [isCreateLevelOpen, setIsCreateLevelOpen] = useState(false)
  const [isCreateCourseOpen, setIsCreateCourseOpen] = useState(false)

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-midnight-blue-800">Course Management</h1>
          <p className="text-muted-foreground">Manage courses, categories, and levels</p>
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="levels">Levels</TabsTrigger>
        </TabsList>

        <TabsContent value="courses" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">All Courses</h3>
            <Dialog open={isCreateCourseOpen} onOpenChange={setIsCreateCourseOpen}>
              <DialogTrigger asChild>
                <Button className="bg-midnight-blue-800 hover:bg-midnight-blue-900">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Course
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Course</DialogTitle>
                  <DialogDescription>Set up a new course with basic information</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Course Title</Label>
                      <Input id="title" placeholder="Enter course title" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="price">Price ($)</Label>
                      <Input id="price" type="number" placeholder="0.00" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {courseCategories.map((category) => (
                            <SelectItem key={category.id} value={category.name}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="level">Level</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent>
                          {courseLevels.map((level) => (
                            <SelectItem key={level.id} value={level.name}>
                              {level.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" placeholder="Enter course description" rows={4} />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateCourseOpen(false)}>
                    Cancel
                  </Button>
                  <Button className="bg-midnight-blue-800 hover:bg-midnight-blue-900">Create Course</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Course Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Level</TableHead>
                    <TableHead>Instructor</TableHead>
                    <TableHead>Students</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Structure</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {courses.map((course) => (
                    <TableRow key={course.id}>
                      <TableCell className="font-medium">{course.title}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{course.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{course.level}</Badge>
                      </TableCell>
                      <TableCell>{course.instructor}</TableCell>
                      <TableCell>{course.students}</TableCell>
                      <TableCell>${course.price}</TableCell>
                      <TableCell>
                        <Badge variant={course.status === "Published" ? "default" : "secondary"}>{course.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-muted-foreground">
                          {course.modules} modules, {course.chapters} chapters
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline">
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <BookOpen className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="outline" className="text-red-600">
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Course Categories</h3>
            <Dialog open={isCreateCategoryOpen} onOpenChange={setIsCreateCategoryOpen}>
              <DialogTrigger asChild>
                <Button className="bg-midnight-blue-800 hover:bg-midnight-blue-900">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Category
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Category</DialogTitle>
                  <DialogDescription>Add a new course category to organize your courses</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="categoryName">Category Name</Label>
                    <Input id="categoryName" placeholder="Enter category name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="categoryDescription">Description</Label>
                    <Textarea id="categoryDescription" placeholder="Enter category description" />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateCategoryOpen(false)}>
                    Cancel
                  </Button>
                  <Button className="bg-midnight-blue-800 hover:bg-midnight-blue-900">Create Category</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courseCategories.map((category) => (
              <Card key={category.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{category.name}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline">
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-600">
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <BookOpen className="w-4 h-4 mr-1" />
                      {category.courses} courses
                    </div>
                    <Badge variant="outline">{category.courses}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="levels" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Course Levels</h3>
            <Dialog open={isCreateLevelOpen} onOpenChange={setIsCreateLevelOpen}>
              <DialogTrigger asChild>
                <Button className="bg-midnight-blue-800 hover:bg-midnight-blue-900">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Level
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Level</DialogTitle>
                  <DialogDescription>Add a new course difficulty level</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="levelName">Level Name</Label>
                    <Input id="levelName" placeholder="Enter level name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="levelDescription">Description</Label>
                    <Textarea id="levelDescription" placeholder="Enter level description" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="levelColor">Color</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select color" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="green">Green</SelectItem>
                        <SelectItem value="yellow">Yellow</SelectItem>
                        <SelectItem value="red">Red</SelectItem>
                        <SelectItem value="purple">Purple</SelectItem>
                        <SelectItem value="blue">Blue</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateLevelOpen(false)}>
                    Cancel
                  </Button>
                  <Button className="bg-midnight-blue-800 hover:bg-midnight-blue-900">Create Level</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {courseLevels.map((level) => (
              <Card key={level.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full bg-${level.color}-500`} />
                      {level.name}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline">
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-600">
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  <CardDescription>{level.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
