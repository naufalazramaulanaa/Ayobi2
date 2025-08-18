"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BookOpen, Clock, Award, Menu, Play } from "lucide-react"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { useRouter } from "next/navigation"


const myLearningCourses = [
  {
    id: "1",
    title: "Complete React Developer Course",
    progress: 65,
    totalLessons: 120,
    completedLessons: 78,
    nextLesson: "React Hooks Advanced Patterns",
    image: "/placeholder.svg?height=100&width=150",
    instructor: "John Doe",
    category: "Web Development",
  },
  {
    id: "2",
    title: "Python for Data Science",
    progress: 30,
    totalLessons: 95,
    completedLessons: 28,
    nextLesson: "Pandas DataFrames",
    image: "/placeholder.svg?height=100&width=150",
    instructor: "Dr. Emily Davis",
    category: "Data Science",
  },
  {
    id: "3",
    title: "UI/UX Design Masterclass",
    progress: 85,
    totalLessons: 75,
    completedLessons: 64,
    nextLesson: "Advanced Prototyping",
    image: "/placeholder.svg?height=100&width=150",
    instructor: "Mike Chen",
    category: "Design",
  },
  {
    id: "4",
    title: "Digital Marketing Strategy",
    progress: 45,
    totalLessons: 60,
    completedLessons: 27,
    nextLesson: "Social Media Analytics",
    image: "/placeholder.svg?height=100&width=150",
    instructor: "Alex Rodriguez",
    category: "Marketing",
  },
]

interface StudentDashboardProps {
  initialTab?: string
}

export function StudentDashboard({ initialTab = "learning" }: StudentDashboardProps) {
   const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const router = useRouter() // <-- dan ini

const goToCourseModules = (id: string) => {
  router.push(`/student/my-learning/${id}`)
}


  

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b border-gray-200 p-3 sm:p-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex-1 min-w-0">
          <h1 className="text-base sm:text-lg font-bold text-midnight-blue-800 truncate">Student Dashboard</h1>
          <p className="text-xs sm:text-sm text-midnight-blue-600 truncate">Continue your learning journey</p>
        </div>
        <Button variant="ghost" size="sm" onClick={() => setIsMobileSidebarOpen(true)} className="ml-2">
          <Menu className="w-5 h-5" />
        </Button>
      </div>

      {/* Mobile Sidebar */}
      <AppSidebar
        userRole="student"
        userEmail="student@example.com"
        darkMode={false}
        onToggleDarkMode={() => {}}
        onLogout={() => {}}
        onNavigate={() => {}}
        isMobile={true}
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />

      <div className="p-3 sm:p-4 lg:p-6 space-y-4 lg:space-y-6">
        {/* Welcome Section - Hidden on mobile, responsive on tablet+ */}
        <div className="hidden lg:block bg-gradient-to-r from-midnight-blue-800 to-midnight-blue-900 text-white rounded-lg p-4 lg:p-6">
          <h1 className="text-xl lg:text-2xl font-bold mb-2">Welcome back, Student!</h1>
          <p className="text-midnight-blue-100 text-sm lg:text-base">Continue your learning journey</p>
        </div>

        {/* Quick Stats - Responsive Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-3 sm:p-4">
              <div className="flex flex-col items-center text-center space-y-1 sm:space-y-2">
                <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-midnight-blue-600" />
                <p className="text-xs text-muted-foreground">Enrolled</p>
                <p className="text-lg sm:text-xl font-bold">12</p>
              </div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-3 sm:p-4">
              <div className="flex flex-col items-center text-center space-y-1 sm:space-y-2">
                <Award className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                <p className="text-xs text-muted-foreground">Completed</p>
                <p className="text-lg sm:text-xl font-bold">8</p>
              </div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-3 sm:p-4">
              <div className="flex flex-col items-center text-center space-y-1 sm:space-y-2">
                <Award className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                <p className="text-xs text-muted-foreground">Certificates</p>
                <p className="text-lg sm:text-xl font-bold">5</p>
              </div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-3 sm:p-4">
              <div className="flex flex-col items-center text-center space-y-1 sm:space-y-2">
                <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                <p className="text-xs text-muted-foreground">Study Hours</p>
                <p className="text-lg sm:text-xl font-bold">156</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* My Learning Section */}
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">My Learning</h2>
            <Badge variant="secondary" className="bg-midnight-blue-100 text-midnight-blue-800 text-xs sm:text-sm">
              {myLearningCourses.length} Courses
            </Badge>
          </div>

          {/* Course Cards - Responsive Layout */}
          <div className="space-y-3 sm:space-y-4">
            {myLearningCourses.map((course) => (
              <Card key={course.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-3 sm:p-4">
                  {/* Mobile Layout (< sm) */}
                  <div className="sm:hidden space-y-3">
                    <div className="flex items-start space-x-3">
                      <img
                        src={course.image || "/placeholder.svg"}
                        alt={course.title}
                        className="w-16 h-12 object-cover rounded-lg flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm mb-1 line-clamp-2">{course.title}</h3>
                        <p className="text-xs text-gray-600 mb-1">by {course.instructor}</p>
                        <Badge variant="outline" className="text-xs">
                          {course.category}
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-medium">{course.progress}%</span>
                      </div>
                      <Progress value={course.progress} className="h-2" />
                      <div className="flex items-center justify-between text-xs text-gray-600">
                        <span>
                          {course.completedLessons}/{course.totalLessons} lessons
                        </span>
                       <Button
    size="sm"
    className="bg-midnight-blue-800 hover:bg-midnight-blue-900 text-xs px-2 py-1 h-auto"
    onClick={() => goToCourseModules(course.id)}
  >
    <Play className="w-3 h-3 mr-1" />
    Continue
  </Button>
                      </div>
                      <p className="text-xs text-midnight-blue-600 font-medium truncate">Next: {course.nextLesson}</p>
                    </div>
                  </div>

                  {/* Desktop/Tablet Layout (sm+) */}
                  <div className="hidden sm:flex gap-4">
                    <img
                      src={course.image || "/placeholder.svg"}
                      alt={course.title}
                      className="w-20 sm:w-24 lg:w-28 h-14 sm:h-16 lg:h-20 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2 sm:mb-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-base sm:text-lg lg:text-xl mb-1 line-clamp-2">
                            {course.title}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2">by {course.instructor}</p>
                          <Badge variant="outline" className="text-xs">
                            {course.category}
                          </Badge>
                        </div>
                         <Button
    size="sm"
    className="bg-midnight-blue-800 hover:bg-midnight-blue-900 ml-4 shrink-0"
    onClick={() => goToCourseModules(course.id)}
  >
    <Play className="w-4 h-4 mr-2" />
    Continue
  </Button>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Progress</span>
                          <span className="font-medium">{course.progress}%</span>
                        </div>
                        <Progress value={course.progress} className="h-2" />
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <span>
                            {course.completedLessons}/{course.totalLessons} lessons completed
                          </span>
                          <span className="text-midnight-blue-600 font-medium truncate max-w-xs">
                            Next: {course.nextLesson}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {myLearningCourses.length === 0 && (
            <div className="text-center py-8 sm:py-12">
              <BookOpen className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No courses enrolled yet</h3>
              <p className="text-gray-600 mb-4 text-sm sm:text-base px-4">
                Start your learning journey by browsing our courses
              </p>
              <Button className="bg-midnight-blue-800 hover:bg-midnight-blue-900">Browse Courses</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Default export for compatibility
export default StudentDashboard
