"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Users, BookOpen, DollarSign, TrendingUp, UserCheck, AlertTriangle } from "lucide-react"

const revenueData = [
  { month: "Jan", revenue: 12000, courses: 45 },
  { month: "Feb", revenue: 15000, courses: 52 },
  { month: "Mar", revenue: 18000, courses: 61 },
  { month: "Apr", revenue: 22000, courses: 68 },
  { month: "May", revenue: 25000, courses: 75 },
  { month: "Jun", revenue: 28000, courses: 82 },
]

const userGrowthData = [
  { month: "Jan", students: 1200, instructors: 45 },
  { month: "Feb", students: 1450, instructors: 52 },
  { month: "Mar", students: 1680, instructors: 58 },
  { month: "Apr", students: 1920, instructors: 65 },
  { month: "May", students: 2150, instructors: 71 },
  { month: "Jun", students: 2380, instructors: 78 },
]

const courseDistribution = [
  { name: "Web Development", value: 35, color: "#1e293b" },
  { name: "Mobile Development", value: 25, color: "#3b82f6" },
  { name: "UI/UX Design", value: 20, color: "#10b981" },
  { name: "Data Science", value: 15, color: "#f59e0b" },
  { name: "Others", value: 5, color: "#ef4444" },
]

const recentUsers = [
  { id: 1, name: "John Doe", email: "john@example.com", role: "Student", status: "Active", joinDate: "2024-01-15" },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    role: "Instructor",
    status: "Active",
    joinDate: "2024-01-14",
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike@example.com",
    role: "Student",
    status: "Pending",
    joinDate: "2024-01-13",
  },
  {
    id: 4,
    name: "Sarah Wilson",
    email: "sarah@example.com",
    role: "Student",
    status: "Active",
    joinDate: "2024-01-12",
  },
  {
    id: 5,
    name: "Alex Brown",
    email: "alex@example.com",
    role: "Instructor",
    status: "Active",
    joinDate: "2024-01-11",
  },
]

const pendingCourses = [
  {
    id: 1,
    title: "Advanced React Patterns",
    instructor: "John Doe",
    status: "Pending Review",
    submitted: "2024-01-15",
  },
  {
    id: 2,
    title: "Machine Learning Basics",
    instructor: "Jane Smith",
    status: "Needs Revision",
    submitted: "2024-01-14",
  },
  {
    id: 3,
    title: "Mobile App Security",
    instructor: "Mike Johnson",
    status: "Pending Review",
    submitted: "2024-01-13",
  },
]

export function AdminDashboard() {
  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-midnight-blue-800 to-midnight-blue-900 text-white rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-midnight-blue-100">Manage your LMS platform</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                <p className="text-3xl font-bold">2,458</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +12% from last month
                </p>
              </div>
              <Users className="w-8 h-8 text-midnight-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Courses</p>
                <p className="text-3xl font-bold">342</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +8% from last month
                </p>
              </div>
              <BookOpen className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Monthly Revenue</p>
                <p className="text-3xl font-bold">$28,450</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +15% from last month
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Instructors</p>
                <p className="text-3xl font-bold">78</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +5% from last month
                </p>
              </div>
              <UserCheck className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue & Course Growth</CardTitle>
            <CardDescription>Monthly revenue and course creation trends</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#1e293b" />
                <Bar dataKey="courses" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
            <CardDescription>Student and instructor registration trends</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="students" stroke="#1e293b" strokeWidth={2} />
                <Line type="monotone" dataKey="instructors" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Course Distribution</CardTitle>
            <CardDescription>Courses by category</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={courseDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {courseDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {courseDistribution.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }} />
                    {item.name}
                  </div>
                  <span>{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Users</CardTitle>
            <CardDescription>Latest user registrations</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Join Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={user.role === "Instructor" ? "default" : "secondary"}>{user.role}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.status === "Active" ? "default" : "secondary"}>{user.status}</Badge>
                    </TableCell>
                    <TableCell>{user.joinDate}</TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline">
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Pending Reviews */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            Pending Course Reviews
          </CardTitle>
          <CardDescription>Courses waiting for admin approval</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course Title</TableHead>
                <TableHead>Instructor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingCourses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell className="font-medium">{course.title}</TableCell>
                  <TableCell>{course.instructor}</TableCell>
                  <TableCell>
                    <Badge variant={course.status === "Pending Review" ? "default" : "destructive"}>
                      {course.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{course.submitted}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        Approve
                      </Button>
                      <Button size="sm" variant="outline">
                        Review
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
