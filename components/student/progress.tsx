"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import {
  BookOpen,
  Clock,
  Award,
  TrendingUp,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
  Play,
  FileText,
  HelpCircle,
  RotateCcw,
} from "lucide-react"

const courseProgress = [
  {
    id: 1,
    courseName: "Complete React Developer Course",
    progress: 75,
    totalLessons: 120,
    completedLessons: 90,
    timeSpent: 45,
    estimatedTimeLeft: 15,
    lastActivity: "2024-01-15",
    nextMilestone: "React Testing",
    modules: [
      {
        id: 1,
        title: "React Fundamentals",
        progress: 100,
        chapters: [
          {
            id: 1,
            title: "Introduction to React",
            progress: 100,
            contents: [
              {
                id: 1,
                title: "What is React?",
                type: "lesson",
                status: "completed",
                completedAt: "2024-01-10T10:00:00Z",
                duration: 15,
              },
              {
                id: 2,
                title: "React Basics Quiz",
                type: "quiz",
                status: "completed",
                completedAt: "2024-01-10T10:30:00Z",
                score: 85,
                passingScore: 70,
                attempts: 1,
                maxAttempts: 3,
                duration: 10,
              },
            ],
          },
          {
            id: 2,
            title: "JSX and Components",
            progress: 100,
            contents: [
              {
                id: 3,
                title: "Understanding JSX",
                type: "lesson",
                status: "completed",
                completedAt: "2024-01-11T14:00:00Z",
                duration: 20,
              },
              {
                id: 4,
                title: "JSX Quiz",
                type: "quiz",
                status: "completed",
                completedAt: "2024-01-11T14:30:00Z",
                score: 90,
                passingScore: 75,
                attempts: 1,
                maxAttempts: 2,
                duration: 8,
              },
            ],
          },
        ],
      },
      {
        id: 2,
        title: "React Hooks",
        progress: 60,
        chapters: [
          {
            id: 3,
            title: "useState Hook",
            progress: 100,
            contents: [
              {
                id: 5,
                title: "Introduction to useState",
                type: "lesson",
                status: "completed",
                completedAt: "2024-01-12T09:00:00Z",
                duration: 25,
              },
              {
                id: 6,
                title: "useState Practice Quiz",
                type: "quiz",
                status: "failed",
                completedAt: "2024-01-12T09:45:00Z",
                score: 60,
                passingScore: 70,
                attempts: 2,
                maxAttempts: 3,
                duration: 12,
                canRetake: true,
              },
            ],
          },
          {
            id: 4,
            title: "useEffect Hook",
            progress: 50,
            contents: [
              {
                id: 7,
                title: "Understanding useEffect",
                type: "lesson",
                status: "completed",
                completedAt: "2024-01-13T11:00:00Z",
                duration: 30,
              },
              {
                id: 8,
                title: "useEffect Quiz",
                type: "quiz",
                status: "pending",
                score: null,
                passingScore: 75,
                attempts: 0,
                maxAttempts: 2,
                duration: 15,
              },
            ],
          },
        ],
      },
      {
        id: 3,
        title: "Advanced React",
        progress: 0,
        chapters: [
          {
            id: 5,
            title: "Context API",
            progress: 0,
            contents: [
              {
                id: 9,
                title: "React Context Basics",
                type: "lesson",
                status: "pending",
                duration: 35,
              },
              {
                id: 10,
                title: "Context API Quiz",
                type: "quiz",
                status: "locked",
                passingScore: 80,
                maxAttempts: 2,
                duration: 20,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 2,
    courseName: "Python for Data Science",
    progress: 40,
    totalLessons: 95,
    completedLessons: 38,
    timeSpent: 28,
    estimatedTimeLeft: 42,
    lastActivity: "2024-01-14",
    nextMilestone: "Machine Learning Basics",
    modules: [
      {
        id: 1,
        title: "Python Basics",
        progress: 100,
        chapters: [
          {
            id: 1,
            title: "Variables and Data Types",
            progress: 100,
            contents: [
              {
                id: 1,
                title: "Python Variables",
                type: "lesson",
                status: "completed",
                completedAt: "2024-01-08T10:00:00Z",
                duration: 20,
              },
              {
                id: 2,
                title: "Data Types Quiz",
                type: "quiz",
                status: "completed",
                completedAt: "2024-01-08T10:30:00Z",
                score: 95,
                passingScore: 70,
                attempts: 1,
                maxAttempts: 3,
                duration: 10,
              },
            ],
          },
        ],
      },
    ],
  },
]

const weeklyProgress = [
  { week: "Week 1", hours: 8, courses: 2 },
  { week: "Week 2", hours: 12, courses: 3 },
  { week: "Week 3", hours: 6, courses: 1 },
  { week: "Week 4", hours: 15, courses: 4 },
]

const skillProgress = [
  { skill: "JavaScript", level: 85, color: "#f59e0b" },
  { skill: "React", level: 75, color: "#3b82f6" },
  { skill: "Python", level: 60, color: "#10b981" },
  { skill: "UI/UX", level: 70, color: "#8b5cf6" },
  { skill: "Data Science", level: 45, color: "#ef4444" },
]

const learningGoals = [
  { id: 1, goal: "Complete 5 courses this month", progress: 60, target: 5, current: 3 },
  { id: 2, goal: "Study 40 hours this month", progress: 75, target: 40, current: 30 },
  { id: 3, goal: "Earn 3 certificates", progress: 33, target: 3, current: 1 },
]

interface CourseDetailProps {
  course: any
  onRetakeQuiz: (contentId: number) => void
}

function CourseDetailDialog({ course, onRetakeQuiz }: CourseDetailProps) {
  const getStatusIcon = (status: string, type: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "failed":
        return <XCircle className="w-4 h-4 text-red-500" />
      case "pending":
        return <AlertCircle className="w-4 h-4 text-yellow-500" />
      case "locked":
        return <Clock className="w-4 h-4 text-gray-400" />
      default:
        return type === "lesson" ? (
          <Play className="w-4 h-4 text-blue-500" />
        ) : (
          <HelpCircle className="w-4 h-4 text-purple-500" />
        )
    }
  }

  const getStatusBadge = (status: string, score?: number, passingScore?: number) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>
      case "failed":
        return (
          <Badge className="bg-red-100 text-red-800">
            Failed ({score}/{passingScore})
          </Badge>
        )
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">In Progress</Badge>
      case "locked":
        return <Badge className="bg-gray-100 text-gray-800">Locked</Badge>
      default:
        return <Badge className="bg-blue-100 text-blue-800">Available</Badge>
    }
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Eye className="w-4 h-4 mr-2" />
          View Details
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>{course.courseName} - Detailed Progress</DialogTitle>
          <DialogDescription>Track your progress through modules, chapters, lessons, and quizzes</DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-6">
            {course.modules.map((module: any) => (
              <Card key={module.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{module.title}</CardTitle>
                    <Badge variant="outline">{module.progress}% Complete</Badge>
                  </div>
                  <Progress value={module.progress} className="h-2" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {module.chapters.map((chapter: any) => (
                      <div key={chapter.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold">{chapter.title}</h4>
                          <Badge variant="secondary">{chapter.progress}%</Badge>
                        </div>
                        <Progress value={chapter.progress} className="h-1 mb-4" />

                        <div className="space-y-3">
                          {chapter.contents.map((content: any) => (
                            <div
                              key={content.id}
                              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                            >
                              <div className="flex items-center space-x-3">
                                {getStatusIcon(content.status, content.type)}
                                <div>
                                  <div className="flex items-center space-x-2">
                                    <span className="font-medium">{content.title}</span>
                                    {content.type === "lesson" && <FileText className="w-3 h-3 text-gray-400" />}
                                    {content.type === "quiz" && <HelpCircle className="w-3 h-3 text-gray-400" />}
                                  </div>
                                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                                    <span>Duration: {formatDuration(content.duration)}</span>
                                    {content.completedAt && (
                                      <span>Completed: {new Date(content.completedAt).toLocaleDateString()}</span>
                                    )}
                                    {content.type === "quiz" && content.score !== null && (
                                      <span>
                                        Score: {content.score}% (Pass: {content.passingScore}%)
                                      </span>
                                    )}
                                    {content.type === "quiz" && (
                                      <span>
                                        Attempts: {content.attempts}/{content.maxAttempts}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                {getStatusBadge(content.status, content.score, content.passingScore)}
                                {content.type === "quiz" && content.status === "failed" && content.canRetake && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => onRetakeQuiz(content.id)}
                                    className="text-xs"
                                  >
                                    <RotateCcw className="w-3 h-3 mr-1" />
                                    Retake ({content.maxAttempts - content.attempts} left)
                                  </Button>
                                )}
                                {content.status === "pending" && content.type === "quiz" && (
                                  <Button size="sm" className="text-xs">
                                    Start Quiz
                                  </Button>
                                )}
                                {content.status === "pending" && content.type === "lesson" && (
                                  <Button size="sm" className="text-xs">
                                    Continue
                                  </Button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

export function StudentProgress() {
  const handleRetakeQuiz = (contentId: number) => {
    console.log("Retaking quiz:", contentId)
    // Implement quiz retake logic
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-midnight-blue-800">Learning Progress</h1>
        <p className="text-muted-foreground">Track your learning journey and achievements</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Courses in Progress</p>
                <p className="text-2xl font-bold">{courseProgress.length}</p>
              </div>
              <BookOpen className="w-8 h-8 text-midnight-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Study Hours</p>
                <p className="text-2xl font-bold">108</p>
              </div>
              <Clock className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Certificates Earned</p>
                <p className="text-2xl font-bold">5</p>
              </div>
              <Award className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Average Progress</p>
                <p className="text-2xl font-bold">68%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="courses" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="courses">Course Progress</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="courses" className="space-y-6">
          <div className="grid gap-4">
            {courseProgress.map((course) => (
              <Card key={course.id}>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{course.courseName}</h3>
                        <span className="text-sm text-muted-foreground">
                          Last activity: {new Date(course.lastActivity).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{course.progress}% Complete</Badge>
                        <CourseDetailDialog course={course} onRetakeQuiz={handleRetakeQuiz} />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Progress</span>
                        <span>{course.progress}%</span>
                      </div>
                      <Progress value={course.progress} className="h-3" />
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground block">Lessons</span>
                        <span className="font-medium">
                          {course.completedLessons}/{course.totalLessons}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block">Time Spent</span>
                        <span className="font-medium">{course.timeSpent}h</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block">Est. Time Left</span>
                        <span className="font-medium">{course.estimatedTimeLeft}h</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block">Next Milestone</span>
                        <span className="font-medium">{course.nextMilestone}</span>
                      </div>
                    </div>

                    {/* Quick Status Overview */}
                    <div className="flex items-center space-x-4 pt-2 border-t">
                      <div className="flex items-center space-x-1 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>
                          {course.modules.reduce(
                            (acc: number, module: any) =>
                              acc +
                              module.chapters.reduce(
                                (chapterAcc: number, chapter: any) =>
                                  chapterAcc +
                                  chapter.contents.filter((content: any) => content.status === "completed").length,
                                0,
                              ),
                            0,
                          )}{" "}
                          Completed
                        </span>
                      </div>
                      <div className="flex items-center space-x-1 text-sm">
                        <XCircle className="w-4 h-4 text-red-500" />
                        <span>
                          {course.modules.reduce(
                            (acc: number, module: any) =>
                              acc +
                              module.chapters.reduce(
                                (chapterAcc: number, chapter: any) =>
                                  chapterAcc +
                                  chapter.contents.filter((content: any) => content.status === "failed").length,
                                0,
                              ),
                            0,
                          )}{" "}
                          Failed (Need Retake)
                        </span>
                      </div>
                      <div className="flex items-center space-x-1 text-sm">
                        <AlertCircle className="w-4 h-4 text-yellow-500" />
                        <span>
                          {course.modules.reduce(
                            (acc: number, module: any) =>
                              acc +
                              module.chapters.reduce(
                                (chapterAcc: number, chapter: any) =>
                                  chapterAcc +
                                  chapter.contents.filter((content: any) => content.status === "pending").length,
                                0,
                              ),
                            0,
                          )}{" "}
                          In Progress
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Learning Activity</CardTitle>
              <CardDescription>Your study hours and course engagement over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={weeklyProgress}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="hours" fill="#1e293b" />
                  <Bar dataKey="courses" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
