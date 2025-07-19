"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Clock, CheckCircle, XCircle, AlertTriangle, Star, MessageSquare } from "lucide-react"

const pendingReviews = [
  {
    id: 1,
    courseTitle: "Advanced React Patterns",
    instructor: "John Doe",
    submittedDate: "2024-01-15",
    priority: "High",
    category: "Web Development",
    status: "Pending",
    modules: 8,
    chapters: 32,
  },
  {
    id: 2,
    courseTitle: "Machine Learning Fundamentals",
    instructor: "Jane Smith",
    submittedDate: "2024-01-14",
    priority: "Medium",
    category: "Data Science",
    status: "In Review",
    modules: 10,
    chapters: 40,
  },
  {
    id: 3,
    courseTitle: "Mobile App Security",
    instructor: "Mike Johnson",
    submittedDate: "2024-01-13",
    priority: "Low",
    category: "Mobile Development",
    status: "Needs Revision",
    modules: 6,
    chapters: 24,
  },
]

const completedReviews = [
  {
    id: 1,
    courseTitle: "Complete React Developer Course",
    instructor: "John Doe",
    reviewedDate: "2024-01-12",
    status: "Approved",
    rating: 4.8,
    feedback: "Excellent course content with comprehensive examples.",
  },
  {
    id: 2,
    courseTitle: "Python for Beginners",
    instructor: "Sarah Wilson",
    reviewedDate: "2024-01-10",
    status: "Rejected",
    rating: 2.5,
    feedback: "Course needs more practical examples and better structure.",
  },
]

export function ReviewerDashboard() {
  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-midnight-blue-800 to-midnight-blue-900 text-white rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-2">Reviewer Dashboard</h1>
        <p className="text-midnight-blue-100">Review and evaluate course content</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Reviews</p>
                <p className="text-3xl font-bold">{pendingReviews.length}</p>
              </div>
              <Clock className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completed This Month</p>
                <p className="text-3xl font-bold">12</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Average Rating Given</p>
                <p className="text-3xl font-bold">4.2</p>
              </div>
              <Star className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Feedback Provided</p>
                <p className="text-3xl font-bold">45</p>
              </div>
              <MessageSquare className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending">Pending Reviews</TabsTrigger>
          <TabsTrigger value="completed">Completed Reviews</TabsTrigger>
          <TabsTrigger value="feedback">Feedback Management</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Courses Awaiting Review</CardTitle>
              <CardDescription>Review and approve course content</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Course Title</TableHead>
                    <TableHead>Instructor</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Structure</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingReviews.map((course) => (
                    <TableRow key={course.id}>
                      <TableCell className="font-medium">{course.courseTitle}</TableCell>
                      <TableCell>{course.instructor}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{course.category}</Badge>
                      </TableCell>
                      <TableCell>{course.submittedDate}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            course.priority === "High"
                              ? "destructive"
                              : course.priority === "Medium"
                                ? "default"
                                : "secondary"
                          }
                        >
                          {course.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{course.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-muted-foreground">
                          {course.modules} modules, {course.chapters} chapters
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" className="bg-midnight-blue-800 hover:bg-midnight-blue-900">
                            Review
                          </Button>
                          <Button size="sm" variant="outline">
                            Preview
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

        <TabsContent value="completed" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Completed Reviews</CardTitle>
              <CardDescription>Previously reviewed courses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {completedReviews.map((review) => (
                  <Card key={review.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <h3 className="font-semibold text-lg">{review.courseTitle}</h3>
                          <p className="text-sm text-muted-foreground">Instructor: {review.instructor}</p>
                          <p className="text-sm text-muted-foreground">Reviewed: {review.reviewedDate}</p>
                          <div className="flex items-center gap-2">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm">{review.rating}/5</span>
                          </div>
                        </div>
                        <Badge variant={review.status === "Approved" ? "default" : "destructive"}>
                          {review.status}
                        </Badge>
                      </div>
                      <div className="mt-4">
                        <p className="text-sm font-medium mb-2">Feedback:</p>
                        <p className="text-sm text-muted-foreground">{review.feedback}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="feedback" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Provide Course Feedback</CardTitle>
              <CardDescription>Submit detailed feedback for course improvements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Course</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select course to review" />
                    </SelectTrigger>
                    <SelectContent>
                      {pendingReviews.map((course) => (
                        <SelectItem key={course.id} value={course.courseTitle}>
                          {course.courseTitle}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Rating</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select rating" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 - Excellent</SelectItem>
                      <SelectItem value="4">4 - Good</SelectItem>
                      <SelectItem value="3">3 - Average</SelectItem>
                      <SelectItem value="2">2 - Poor</SelectItem>
                      <SelectItem value="1">1 - Very Poor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Detailed Feedback</label>
                <Textarea
                  placeholder="Provide detailed feedback about the course content, structure, and quality..."
                  rows={6}
                />
              </div>
              <div className="flex gap-2">
                <Button className="bg-green-600 hover:bg-green-700">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve Course
                </Button>
                <Button variant="destructive">
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject Course
                </Button>
                <Button variant="outline">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Request Revision
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
