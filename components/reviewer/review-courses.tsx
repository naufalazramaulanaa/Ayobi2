"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Star,
  User,
  Calendar,
  BookOpen,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
} from "lucide-react"

export function ReviewCourses() {
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [reviewData, setReviewData] = useState({
    rating: "",
    feedback: "",
    recommendation: "",
    issues: [],
  })

  const pendingCourses = [
    {
      id: 1,
      title: "Advanced React Patterns and Best Practices",
      instructor: "John Smith",
      category: "Web Development",
      submittedDate: "2024-06-10",
      duration: "8 hours",
      modules: 12,
      status: "pending",
      priority: "high",
      description:
        "Comprehensive course covering advanced React patterns, hooks, and performance optimization techniques.",
    },
    {
      id: 2,
      title: "Python Data Analysis Masterclass",
      instructor: "Sarah Johnson",
      category: "Data Science",
      submittedDate: "2024-06-12",
      duration: "15 hours",
      modules: 20,
      status: "pending",
      priority: "medium",
      description: "Complete guide to data analysis using Python, pandas, and visualization libraries.",
    },
    {
      id: 3,
      title: "Mobile App Development with Flutter",
      instructor: "Mike Chen",
      category: "Mobile Development",
      submittedDate: "2024-06-14",
      duration: "12 hours",
      modules: 16,
      status: "pending",
      priority: "low",
      description: "Build cross-platform mobile applications using Flutter and Dart programming language.",
    },
  ]

  const completedReviews = [
    {
      id: 4,
      title: "JavaScript Fundamentals for Beginners",
      instructor: "Emma Wilson",
      category: "Web Development",
      reviewedDate: "2024-06-08",
      status: "approved",
      rating: 4.5,
      feedback: "Excellent course structure and clear explanations. Recommended for publication.",
    },
    {
      id: 5,
      title: "UI/UX Design Principles",
      instructor: "David Brown",
      category: "Design",
      reviewedDate: "2024-06-05",
      status: "rejected",
      rating: 2.5,
      feedback: "Course content needs significant improvement. Missing practical examples.",
    },
    {
      id: 6,
      title: "Database Design and SQL Mastery",
      instructor: "Lisa Garcia",
      category: "Backend Development",
      reviewedDate: "2024-06-03",
      status: "approved",
      rating: 4.8,
      feedback: "Outstanding course with comprehensive coverage of database concepts.",
    },
  ]

  const handleReviewSubmit = (courseId, action) => {
    console.log(`Review submitted for course ${courseId}:`, action, reviewData)
    // Handle review submission logic here
    setSelectedCourse(null)
    setReviewData({ rating: "", feedback: "", recommendation: "", issues: [] })
  }

  const ReviewDialog = ({ course, onSubmit }) => (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-midnight-blue-800 hover:bg-midnight-blue-700">
          <Eye className="w-4 h-4 mr-2" />
          Review
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Review Course: {course?.title}</DialogTitle>
          <DialogDescription>Evaluate the course content, structure, and quality before approval</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Course Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Course Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="font-semibold">Instructor</Label>
                  <p className="text-sm text-muted-foreground">{course?.instructor}</p>
                </div>
                <div>
                  <Label className="font-semibold">Category</Label>
                  <p className="text-sm text-muted-foreground">{course?.category}</p>
                </div>
                <div>
                  <Label className="font-semibold">Duration</Label>
                  <p className="text-sm text-muted-foreground">{course?.duration}</p>
                </div>
                <div>
                  <Label className="font-semibold">Modules</Label>
                  <p className="text-sm text-muted-foreground">{course?.modules} modules</p>
                </div>
              </div>
              <div>
                <Label className="font-semibold">Description</Label>
                <p className="text-sm text-muted-foreground mt-1">{course?.description}</p>
              </div>
            </CardContent>
          </Card>

          {/* Review Form */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Review Assessment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Content Quality Rating */}
              <div className="space-y-3">
                <Label className="font-semibold">Content Quality Rating</Label>
                <Select
                  value={reviewData.rating}
                  onValueChange={(value) => setReviewData({ ...reviewData, rating: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">⭐⭐⭐⭐⭐ Excellent (5/5)</SelectItem>
                    <SelectItem value="4">⭐⭐⭐⭐ Good (4/5)</SelectItem>
                    <SelectItem value="3">⭐⭐⭐ Average (3/5)</SelectItem>
                    <SelectItem value="2">⭐⭐ Below Average (2/5)</SelectItem>
                    <SelectItem value="1">⭐ Poor (1/5)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Review Checklist */}
              <div className="space-y-3">
                <Label className="font-semibold">Review Checklist</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    "Content accuracy and relevance",
                    "Clear learning objectives",
                    "Proper course structure",
                    "Quality of video/audio",
                    "Practical examples included",
                    "Appropriate difficulty level",
                    "Complete course materials",
                    "Professional presentation",
                  ].map((item, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input type="checkbox" id={`check-${index}`} className="rounded" />
                      <Label htmlFor={`check-${index}`} className="text-sm">
                        {item}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Detailed Feedback */}
              <div className="space-y-3">
                <Label htmlFor="feedback" className="font-semibold">
                  Detailed Feedback
                </Label>
                <Textarea
                  id="feedback"
                  placeholder="Provide detailed feedback about the course content, structure, and quality..."
                  value={reviewData.feedback}
                  onChange={(e) => setReviewData({ ...reviewData, feedback: e.target.value })}
                  rows={4}
                />
              </div>

              {/* Recommendation */}
              <div className="space-y-3">
                <Label className="font-semibold">Recommendation</Label>
                <Select
                  value={reviewData.recommendation}
                  onValueChange={(value) => setReviewData({ ...reviewData, recommendation: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select recommendation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="approve">✅ Approve for Publication</SelectItem>
                    <SelectItem value="approve-minor">✅ Approve with Minor Changes</SelectItem>
                    <SelectItem value="revision">⚠️ Requires Major Revision</SelectItem>
                    <SelectItem value="reject">❌ Reject</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Issues Found */}
              <div className="space-y-3">
                <Label htmlFor="issues" className="font-semibold">
                  Issues Found (if any)
                </Label>
                <Textarea id="issues" placeholder="List any specific issues that need to be addressed..." rows={3} />
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              onClick={() => handleReviewSubmit(course?.id, "approve")}
              className="bg-green-600 hover:bg-green-700 flex-1"
            >
              <ThumbsUp className="w-4 h-4 mr-2" />
              Approve Course
            </Button>
            <Button onClick={() => handleReviewSubmit(course?.id, "revision")} variant="outline" className="flex-1">
              <MessageSquare className="w-4 h-4 mr-2" />
              Request Revision
            </Button>
            <Button onClick={() => handleReviewSubmit(course?.id, "reject")} variant="destructive" className="flex-1">
              <ThumbsDown className="w-4 h-4 mr-2" />
              Reject Course
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-midnight-blue-800">Course Reviews</h1>
          <p className="text-midnight-blue-600">Review and approve courses submitted by instructors</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-200">
            <Clock className="w-3 h-3 mr-1" />
            {pendingCourses.length} Pending
          </Badge>
          <Badge variant="outline" className="bg-green-50 text-green-800 border-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            {completedReviews.filter((c) => c.status === "approved").length} Approved
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="pending">Pending Reviews ({pendingCourses.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed Reviews ({completedReviews.length})</TabsTrigger>
        </TabsList>

        {/* Pending Reviews */}
        <TabsContent value="pending" className="space-y-4">
          <div className="grid gap-4">
            {pendingCourses.map((course) => (
              <Card key={course.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-midnight-blue-800">{course.title}</h3>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                            <span className="flex items-center gap-1">
                              <User className="w-4 h-4" />
                              {course.instructor}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {course.submittedDate}
                            </span>
                            <span className="flex items-center gap-1">
                              <BookOpen className="w-4 h-4" />
                              {course.modules} modules
                            </span>
                          </div>
                        </div>
                        <Badge
                          variant={
                            course.priority === "high"
                              ? "destructive"
                              : course.priority === "medium"
                                ? "default"
                                : "secondary"
                          }
                        >
                          {course.priority} priority
                        </Badge>
                      </div>

                      <p className="text-sm text-muted-foreground">{course.description}</p>

                      <div className="flex items-center gap-4 text-sm">
                        <Badge variant="outline">{course.category}</Badge>
                        <span className="text-muted-foreground">{course.duration}</span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        Preview
                      </Button>
                      <ReviewDialog course={course} onSubmit={handleReviewSubmit} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Completed Reviews */}
        <TabsContent value="completed" className="space-y-4">
          <div className="grid gap-4">
            {completedReviews.map((course) => (
              <Card key={course.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-midnight-blue-800">{course.title}</h3>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                            <span className="flex items-center gap-1">
                              <User className="w-4 h-4" />
                              {course.instructor}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              Reviewed: {course.reviewedDate}
                            </span>
                          </div>
                        </div>
                        <Badge
                          variant={course.status === "approved" ? "default" : "destructive"}
                          className={course.status === "approved" ? "bg-green-100 text-green-800" : ""}
                        >
                          {course.status === "approved" ? (
                            <>
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Approved
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3 h-3 mr-1" />
                              Rejected
                            </>
                          )}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-medium">{course.rating}/5</span>
                        </div>
                        <Badge variant="outline">{course.category}</Badge>
                      </div>

                      <p className="text-sm text-muted-foreground">{course.feedback}</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
