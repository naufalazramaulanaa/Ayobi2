"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
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
  MessageSquare,
  Reply,
  Clock,
  CheckCircle,
  AlertTriangle,
  User,
  Calendar,
  Star,
  Filter,
  Search,
  Send,
} from "lucide-react"

export function FeedbackManagement() {
  const [selectedFeedback, setSelectedFeedback] = useState(null)
  const [replyText, setReplyText] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  const feedbackData = [
    {
      id: 1,
      type: "course_feedback",
      title: "React Course - Excellent Content",
      course: "Complete React Developer Course",
      student: "Alice Johnson",
      instructor: "John Smith",
      rating: 5,
      message:
        "This course exceeded my expectations! The explanations are clear and the projects are very practical. I especially loved the Redux section.",
      date: "2024-06-15",
      status: "pending",
      priority: "low",
      category: "positive",
    },
    {
      id: 2,
      type: "instructor_feedback",
      title: "Course Review Process Too Slow",
      instructor: "Sarah Wilson",
      message:
        "I submitted my Python course for review 3 weeks ago and haven't heard back. The review process needs to be faster to maintain instructor satisfaction.",
      date: "2024-06-14",
      status: "pending",
      priority: "high",
      category: "complaint",
    },
    {
      id: 3,
      type: "technical_issue",
      title: "Video Player Not Working",
      course: "JavaScript Fundamentals",
      student: "Mike Chen",
      message:
        "The video player keeps freezing at 15:30 in Module 3. I've tried different browsers but the issue persists.",
      date: "2024-06-13",
      status: "in_progress",
      priority: "medium",
      category: "technical",
    },
    {
      id: 4,
      type: "course_feedback",
      title: "UI/UX Course Needs More Examples",
      course: "UI/UX Design Principles",
      student: "Emma Davis",
      instructor: "David Brown",
      rating: 3,
      message:
        "The course content is good but lacks practical examples. More real-world case studies would be helpful.",
      date: "2024-06-12",
      status: "resolved",
      priority: "medium",
      category: "suggestion",
    },
    {
      id: 5,
      type: "platform_feedback",
      title: "Great Platform Experience",
      student: "Robert Taylor",
      message:
        "I love the new dashboard design! The progress tracking feature is very motivating. Keep up the great work!",
      date: "2024-06-11",
      status: "resolved",
      priority: "low",
      category: "positive",
    },
  ]

  const filteredFeedback = feedbackData.filter((feedback) => {
    const matchesStatus = filterStatus === "all" || feedback.status === filterStatus
    const matchesSearch =
      feedback.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.message.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const handleReply = (feedbackId) => {
    console.log(`Reply sent to feedback ${feedbackId}:`, replyText)
    setReplyText("")
    setSelectedFeedback(null)
  }

  const handleStatusChange = (feedbackId, newStatus) => {
    console.log(`Status changed for feedback ${feedbackId}:`, newStatus)
  }

  const FeedbackDialog = ({ feedback }) => (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <MessageSquare className="w-4 h-4 mr-2" />
          View Details
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{feedback?.title}</DialogTitle>
          <DialogDescription>
            {feedback?.type.replace("_", " ").toUpperCase()} • {feedback?.date}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Feedback Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Feedback Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {feedback?.student && (
                  <div>
                    <Label className="font-semibold">Student</Label>
                    <p className="text-sm text-muted-foreground">{feedback.student}</p>
                  </div>
                )}
                {feedback?.instructor && (
                  <div>
                    <Label className="font-semibold">Instructor</Label>
                    <p className="text-sm text-muted-foreground">{feedback.instructor}</p>
                  </div>
                )}
                {feedback?.course && (
                  <div>
                    <Label className="font-semibold">Course</Label>
                    <p className="text-sm text-muted-foreground">{feedback.course}</p>
                  </div>
                )}
                {feedback?.rating && (
                  <div>
                    <Label className="font-semibold">Rating</Label>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < feedback.rating ? "text-yellow-500 fill-current" : "text-gray-300"}`}
                        />
                      ))}
                      <span className="text-sm ml-2">{feedback.rating}/5</span>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <Label className="font-semibold">Message</Label>
                <p className="text-sm text-muted-foreground mt-1 p-3 bg-gray-50 rounded-lg">{feedback?.message}</p>
              </div>

              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    feedback?.status === "resolved"
                      ? "default"
                      : feedback?.status === "in_progress"
                        ? "secondary"
                        : "outline"
                  }
                >
                  {feedback?.status.replace("_", " ")}
                </Badge>
                <Badge
                  variant={
                    feedback?.priority === "high"
                      ? "destructive"
                      : feedback?.priority === "medium"
                        ? "default"
                        : "secondary"
                  }
                >
                  {feedback?.priority} priority
                </Badge>
                <Badge variant="outline">{feedback?.category}</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Reply Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Send Reply</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reply">Your Response</Label>
                <Textarea
                  id="reply"
                  placeholder="Type your response to this feedback..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label>Update Status</Label>
                <Select defaultValue={feedback?.status}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={() => handleReply(feedback?.id)}
                  className="bg-midnight-blue-800 hover:bg-midnight-blue-700 flex-1"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send Reply
                </Button>
                <Button variant="outline" onClick={() => handleStatusChange(feedback?.id, "resolved")}>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Mark Resolved
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-midnight-blue-800">Feedback Management</h1>
          <p className="text-midnight-blue-600">Manage and respond to user feedback and suggestions</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-200">
            <Clock className="w-3 h-3 mr-1" />
            {feedbackData.filter((f) => f.status === "pending").length} Pending
          </Badge>
          <Badge variant="outline" className="bg-green-50 text-green-800 border-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            {feedbackData.filter((f) => f.status === "resolved").length} Resolved
          </Badge>
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search feedback..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-[200px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Feedback List */}
      <div className="grid gap-4">
        {filteredFeedback.map((feedback) => (
          <Card key={feedback.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-midnight-blue-800">{feedback.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {feedback.student || feedback.instructor}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {feedback.date}
                        </span>
                        {feedback.course && (
                          <span className="text-midnight-blue-600 font-medium">{feedback.course}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          feedback.priority === "high"
                            ? "destructive"
                            : feedback.priority === "medium"
                              ? "default"
                              : "secondary"
                        }
                      >
                        {feedback.priority}
                      </Badge>
                      <Badge
                        variant={
                          feedback.status === "resolved"
                            ? "default"
                            : feedback.status === "in_progress"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {feedback.status === "resolved" && <CheckCircle className="w-3 h-3 mr-1" />}
                        {feedback.status === "in_progress" && <Clock className="w-3 h-3 mr-1" />}
                        {feedback.status === "pending" && <AlertTriangle className="w-3 h-3 mr-1" />}
                        {feedback.status.replace("_", " ")}
                      </Badge>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-2">{feedback.message}</p>

                  <div className="flex items-center gap-4">
                    <Badge
                      variant="outline"
                      className={
                        feedback.category === "positive"
                          ? "bg-green-50 text-green-700 border-green-200"
                          : feedback.category === "complaint"
                            ? "bg-red-50 text-red-700 border-red-200"
                            : feedback.category === "technical"
                              ? "bg-blue-50 text-blue-700 border-blue-200"
                              : "bg-gray-50 text-gray-700 border-gray-200"
                      }
                    >
                      {feedback.category}
                    </Badge>
                    {feedback.rating && (
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium">{feedback.rating}/5</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <FeedbackDialog feedback={feedback} />
                  <Button size="sm" variant="outline" onClick={() => handleStatusChange(feedback.id, "in_progress")}>
                    <Reply className="w-4 h-4 mr-2" />
                    Quick Reply
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredFeedback.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No feedback found</h3>
            <p className="text-gray-500">No feedback matches your current filters.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
