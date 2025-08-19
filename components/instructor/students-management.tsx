"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { fetchData } from "@/lib/api"
import { Mail, Award, BookOpen, Clock } from "lucide-react"

export function StudentsManagement() {
  const [students, setStudents] = useState<any[]>([])
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [stats, setStats] = useState({
    total_students: 0,
    total_active_students: 0,
    total_revenue: 0,
    average_progress: 0,
  })

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null
        if (!token || token.split(".").length !== 3) return

        const res = await fetchData("/instructor/students", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const data = res.data?.students || []
        const mapped = data.map((s: any) => ({
          id: s.id,
          name: s.user?.fullname,
          email: s.user?.email,
          avatar: s.user?.profile?.image,
          enrolledCourses: s.course_summary?.total_course ?? 0,
          completedCourses: s.course_summary?.completed_courses ?? 0,
          totalProgress: s.course_summary?.average_progress ?? 0,
          certificates: s.course_summary?.number_of_certificates ?? 0,
          totalSpent: s.course_summary?.earnings ?? 0,
          joinDate: "-",
          lastActive: "-",
          status: "active",
        }))

        setStudents(mapped)
        setStats(res.data?.stats || stats)
      } catch (err) {
        console.error("Failed to fetch students", err)
      }
    }

    fetchStudents()
  }, [])

  const filteredStudents = students.filter(
    (s) =>
      s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Dialog open={!!selectedStudent} onOpenChange={() => setSelectedStudent(null)}>
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Total Students</p>
              <p className="text-2xl font-bold text-midnight-blue-800">{stats.total_students}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Active Students</p>
              <p className="text-2xl font-bold text-green-600">{stats.total_active_students}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <p className="text-2xl font-bold text-purple-600">Rp {stats.total_revenue.toLocaleString()}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Average Progress</p>
              <p className="text-2xl font-bold text-orange-600">{stats.average_progress}%</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle className="text-xl">Student Management</CardTitle>
            <Input
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Courses</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={student.avatar || undefined} />
                        <AvatarFallback>{student.name?.charAt(0)}</AvatarFallback>
                      </Avatar>
                      {student.name}
                    </TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell>{student.enrolledCourses}</TableCell>
                    <TableCell>{student.totalProgress}%</TableCell>
                    <TableCell>
                      <Badge>{student.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <DialogTrigger asChild>
                        <button
                          className="text-blue-600 hover:underline text-sm"
                          onClick={() => setSelectedStudent(student)}
                        >
                          View
                        </button>
                      </DialogTrigger>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Student Details</DialogTitle>
          </DialogHeader>
          {selectedStudent && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={selectedStudent.avatar || undefined} />
                  <AvatarFallback>{selectedStudent.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">{selectedStudent.name}</h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    {selectedStudent.email}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-blue-500" />
                  Total Courses: {selectedStudent.enrolledCourses}
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-green-600" />
                  Certificates: {selectedStudent.certificates}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-yellow-600" />
                  Completed: {selectedStudent.completedCourses}
                </div>
                <div className="flex items-center gap-2">
                  💸 Earnings: Rp {selectedStudent.totalSpent.toLocaleString()}
                </div>
                <div className="flex items-center gap-2">
                  📊 Average Progress: {selectedStudent.totalProgress}%
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </div>
    </Dialog>
  )
}
export default StudentsManagement