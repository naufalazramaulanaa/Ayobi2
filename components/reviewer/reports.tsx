"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Calendar,
  Download,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  Star,
  BookOpen,
} from "lucide-react"

export function ReviewerReports() {
  const [selectedPeriod, setSelectedPeriod] = useState("monthly")

  const reportData = {
    reviewStats: {
      totalReviews: 156,
      pendingReviews: 12,
      approvedCourses: 89,
      rejectedCourses: 55,
      averageReviewTime: "2.3 days",
      monthlyGrowth: 15.2,
    },
    reviewBreakdown: [
      { month: "Jan", approved: 12, rejected: 8, pending: 3 },
      { month: "Feb", approved: 15, rejected: 6, pending: 4 },
      { month: "Mar", approved: 18, rejected: 9, pending: 2 },
      { month: "Apr", approved: 14, rejected: 7, pending: 5 },
      { month: "May", approved: 16, rejected: 12, pending: 3 },
      { month: "Jun", approved: 14, rejected: 13, pending: 12 },
    ],
    categoryStats: [
      { category: "Web Development", reviews: 45, approved: 32, rejected: 13, avgRating: 4.2 },
      { category: "Data Science", reviews: 28, approved: 19, rejected: 9, avgRating: 4.0 },
      { category: "Mobile Development", reviews: 22, approved: 15, rejected: 7, avgRating: 4.1 },
      { category: "Design", reviews: 18, approved: 10, rejected: 8, avgRating: 3.8 },
      { category: "Business", reviews: 15, approved: 8, rejected: 7, avgRating: 3.9 },
    ],
    qualityMetrics: {
      averageCourseRating: 4.1,
      studentSatisfaction: 87,
      instructorSatisfaction: 82,
      resubmissionRate: 23,
    },
    topInstructors: [
      { name: "John Smith", courses: 8, avgRating: 4.8, approvalRate: 95 },
      { name: "Sarah Johnson", courses: 6, avgRating: 4.6, approvalRate: 90 },
      { name: "Mike Chen", courses: 5, avgRating: 4.5, approvalRate: 88 },
      { name: "Emma Wilson", courses: 7, avgRating: 4.4, approvalRate: 85 },
    ],
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-midnight-blue-800">Review Reports</h1>
          <p className="text-midnight-blue-600">Analytics and insights on course review performance</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
          <Button className="bg-midnight-blue-800 hover:bg-midnight-blue-700">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportData.reviewStats.totalReviews}</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="w-3 h-3 mr-1" />+{reportData.reviewStats.monthlyGrowth}% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportData.reviewStats.pendingReviews}</div>
            <div className="flex items-center text-xs text-yellow-600">
              <Clock className="w-3 h-3 mr-1" />
              Requires attention
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approval Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(
                (reportData.reviewStats.approvedCourses /
                  (reportData.reviewStats.approvedCourses + reportData.reviewStats.rejectedCourses)) *
                  100,
              )}
              %
            </div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="w-3 h-3 mr-1" />
              +3.2% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Review Time</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportData.reviewStats.averageReviewTime}</div>
            <div className="flex items-center text-xs text-red-600">
              <TrendingDown className="w-3 h-3 mr-1" />
              -0.5 days from last month
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Reports */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="quality">Quality</TabsTrigger>
          <TabsTrigger value="instructors">Instructors</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Review Breakdown</CardTitle>
              <CardDescription>Review activity and outcomes over the last 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reportData.reviewBreakdown.map((month) => (
                  <div key={month.month} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-midnight-blue-100 rounded-lg flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-midnight-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">{month.month} 2024</p>
                        <p className="text-sm text-muted-foreground">
                          {month.approved + month.rejected + month.pending} total reviews
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <p className="text-sm font-medium text-green-600">{month.approved}</p>
                        <p className="text-xs text-muted-foreground">Approved</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium text-red-600">{month.rejected}</p>
                        <p className="text-xs text-muted-foreground">Rejected</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium text-yellow-600">{month.pending}</p>
                        <p className="text-xs text-muted-foreground">Pending</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Review Performance by Category</CardTitle>
              <CardDescription>Course category breakdown and approval rates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reportData.categoryStats.map((category) => (
                  <div key={category.category} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-midnight-blue-100 rounded-lg flex items-center justify-center">
                        <BookOpen className="w-6 h-6 text-midnight-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">{category.category}</p>
                        <p className="text-sm text-muted-foreground">{category.reviews} total reviews</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <p className="text-sm font-medium">
                          {Math.round((category.approved / category.reviews) * 100)}%
                        </p>
                        <p className="text-xs text-muted-foreground">Approval Rate</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium">{category.avgRating}</span>
                      </div>
                      <Badge variant="outline">{category.approved} approved</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quality" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Quality Metrics</CardTitle>
                <CardDescription>Overall platform quality indicators</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Average Course Rating</span>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < Math.floor(reportData.qualityMetrics.averageCourseRating) ? "text-yellow-500 fill-current" : "text-gray-300"}`}
                          />
                        ))}
                      </div>
                      <span className="font-bold">{reportData.qualityMetrics.averageCourseRating}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Student Satisfaction</span>
                      <span className="font-bold">{reportData.qualityMetrics.studentSatisfaction}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: `${reportData.qualityMetrics.studentSatisfaction}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Instructor Satisfaction</span>
                      <span className="font-bold">{reportData.qualityMetrics.instructorSatisfaction}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${reportData.qualityMetrics.instructorSatisfaction}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Resubmission Rate</span>
                      <span className="font-bold text-yellow-600">{reportData.qualityMetrics.resubmissionRate}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-600 h-2 rounded-full"
                        style={{ width: `${reportData.qualityMetrics.resubmissionRate}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quality Insights</CardTitle>
                <CardDescription>Key observations and recommendations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 border-l-4 border-green-500 bg-green-50">
                    <p className="font-medium text-green-800">High Quality Trend</p>
                    <p className="text-sm text-green-700">Course quality has improved by 12% this quarter</p>
                  </div>
                  <div className="p-3 border-l-4 border-blue-500 bg-blue-50">
                    <p className="font-medium text-blue-800">Review Efficiency</p>
                    <p className="text-sm text-blue-700">Average review time decreased by 0.5 days</p>
                  </div>
                  <div className="p-3 border-l-4 border-yellow-500 bg-yellow-50">
                    <p className="font-medium text-yellow-800">Attention Needed</p>
                    <p className="text-sm text-yellow-700">Design category shows higher rejection rate</p>
                  </div>
                  <div className="p-3 border-l-4 border-purple-500 bg-purple-50">
                    <p className="font-medium text-purple-800">Recommendation</p>
                    <p className="text-sm text-purple-700">Consider additional reviewer training for consistency</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="instructors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Instructors</CardTitle>
              <CardDescription>Instructors with highest approval rates and course quality</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reportData.topInstructors.map((instructor, index) => (
                  <div key={instructor.name} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-8 h-8 bg-midnight-blue-800 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{instructor.name}</p>
                        <p className="text-sm text-muted-foreground">{instructor.courses} courses reviewed</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <p className="text-sm font-medium">{instructor.approvalRate}%</p>
                        <p className="text-xs text-muted-foreground">Approval Rate</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium">{instructor.avgRating}</span>
                      </div>
                      <Badge variant={instructor.approvalRate >= 90 ? "default" : "secondary"}>
                        {instructor.approvalRate >= 90 ? "Top Performer" : "Good"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
