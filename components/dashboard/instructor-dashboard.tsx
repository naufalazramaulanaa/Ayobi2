"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Menu, Calendar, Users, DollarSign, Star, BookOpen, Info, FileText, Clock, CheckCircle, Tag } from "lucide-react"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { fetchData } from "@/lib/api"
import { useRouter } from "next/navigation"

export function InstructorDashboard() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [selectedCourse, setSelectedCourse] = useState<any>(null)
  const [openDetailDialog, setOpenDetailDialog] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null
        if (!token || token.split(".").length !== 3) return
        const res = await fetchData("/instructor/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        setDashboardData(res.data)
      } catch (error) {
        console.error("Failed to load dashboard data", error)
      }
    }
    fetchDashboard()
  }, [])

  if (!dashboardData) return <div className="p-6">Loading dashboard...</div>

  const stats = dashboardData.statistics

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="md:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-midnight-blue-800">Instructor Dashboard</h1>
          <p className="text-sm text-midnight-blue-600">Manage your courses</p>
        </div>
        <Button variant="ghost" size="sm" onClick={() => setIsMobileSidebarOpen(true)}>
          <Menu className="w-5 h-5" />
        </Button>
      </div>

      <AppSidebar
        userRole="instructor"
        userEmail="instructor@example.com"
        darkMode={false}
        onToggleDarkMode={() => {}}
        onLogout={() => {}}
        onNavigate={() => {}}
        isMobile={true}
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />

      <div className="p-3 md:p-6 space-y-4 md:space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <Card><CardContent className="p-3 md:p-6 text-center"><Users className="mx-auto text-midnight-blue-600" /><p>Total Students</p><p className="text-xl font-bold">{stats?.student?.total ?? 0}</p></CardContent></Card>
          <Card><CardContent className="p-3 md:p-6 text-center"><BookOpen className="mx-auto text-blue-600" /><p>Published Courses</p><p className="text-xl font-bold">{stats?.course?.total ?? 0}</p></CardContent></Card>
          <Card><CardContent className="p-3 md:p-6 text-center"><DollarSign className="mx-auto text-green-600" /><p>Revenue</p><p className="text-xl font-bold">Rp {stats?.revenue?.this_month?.toLocaleString("id-ID") ?? 0}</p></CardContent></Card>
          <Card><CardContent className="p-3 md:p-6 text-center"><Star className="mx-auto text-yellow-500" /><p>Avg Rating</p><p className="text-xl font-bold">{(stats?.rating?.average ?? 0).toFixed(2)}</p></CardContent></Card>
        </div>

        <Tabs defaultValue="courses" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-2">
            <TabsTrigger value="courses">My Courses</TabsTrigger>
            <TabsTrigger value="live-classes">Live Classes</TabsTrigger>
          </TabsList>

          <TabsContent value="courses" className="space-y-4 md:space-y-6">
            <div className="grid gap-3 md:gap-4">
              {(dashboardData?.my_courses ?? []).map((course: any) => (
                <Card key={course.id}>
                  <CardContent className="p-4 md:p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                      <div>
                        <h4 className="font-semibold text-base md:text-lg">{course.title}</h4>
                        <div className="text-sm text-muted-foreground">Max Students: {course.max_students ?? "-"} · {course.reviews?.rating ?? 0}★</div>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant={course.status === "Published" ? "default" : "secondary"} className="text-xs">{course.status}</Badge>
                        <Button size="sm" variant="outline" className="text-xs" onClick={() => router.push(`/instructor/courses/${course.id}/edit`)}>Edit</Button>
                        <Button size="sm" className="bg-midnight-blue-800 hover:bg-midnight-blue-900 text-xs" onClick={() => { setSelectedCourse(course); setOpenDetailDialog(true); }}>Preview</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="live-classes" className="space-y-4 md:space-y-6">
            <h3 className="text-base md:text-lg font-semibold">Upcoming Live Classes</h3>
            <div className="grid gap-3 md:gap-4">
              {(dashboardData?.live_classes ?? []).map((liveClass: any) => (
                <Card key={liveClass.id}>
                  <CardContent className="p-4 md:p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                      <div>
                        <h4 className="font-semibold text-base md:text-lg">{liveClass.name}</h4>
                        <div className="flex flex-wrap items-center gap-2 mt-2 text-sm text-muted-foreground">
                          <div className="flex items-center"><Calendar className="w-4 h-4 mr-1" />{liveClass.date} ({liveClass.start_time} - {liveClass.end_time})</div>
                          <div className="flex items-center"><Users className="w-4 h-4 mr-1" />{liveClass.participants_count} participants</div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="text-xs">Edit</Button>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700 text-xs">Start Class</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <Dialog open={openDetailDialog} onOpenChange={setOpenDetailDialog}>
          <DialogContent className="w-full max-w-2xl">
            <DialogHeader>
              <DialogTitle>Course Preview</DialogTitle>
              <DialogDescription>{selectedCourse?.title}</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mt-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2"><Users className="w-4 h-4 text-muted-foreground" /><span><strong>Max Students:</strong> {selectedCourse?.max_students ?? "-"}</span></div>
                <div className="flex items-center gap-2"><Star className="w-4 h-4 text-yellow-500" /><span><strong>Rating:</strong> {selectedCourse?.reviews?.rating ?? 0}</span></div>
                <div className="flex items-center gap-2"><Badge className="text-xs" variant={selectedCourse?.status === "Published" ? "default" : "secondary"}>{selectedCourse?.status}</Badge></div>
                <div className="flex items-center gap-2"><DollarSign className="w-4 h-4 text-muted-foreground" /><span><strong>Price:</strong> Rp {parseFloat(selectedCourse?.price || 0).toLocaleString("id-ID")}</span></div>
                <div className="flex items-center gap-2"><Tag className="w-4 h-4 text-muted-foreground" /><span><strong>Pricing Type:</strong> {selectedCourse?.pricing_type}</span></div>
                <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-muted-foreground" /><span><strong>Approval Status:</strong> {selectedCourse?.approval_status}</span></div>
                <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-muted-foreground" /><span><strong>Release Date:</strong> {selectedCourse?.release_date}</span></div>
                <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-muted-foreground" /><span><strong>Created At:</strong> {selectedCourse?.created_at}</span></div>
                <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-muted-foreground" /><span><strong>Updated At:</strong> {selectedCourse?.updated_at}</span></div>
              </div>
              {selectedCourse?.description && (
                <div className="flex items-start gap-2"><Info className="w-4 h-4 text-muted-foreground mt-1" /><span><strong>Description:</strong><br /> {selectedCourse.description}</span></div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
