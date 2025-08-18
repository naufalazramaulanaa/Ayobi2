// components/student/my-learning-course.tsx
"use client";

import { useMemo } from "react";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Play, BookOpen, HelpCircle, ChevronRight, ArrowLeft, Clock } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

type Lesson = { id: string; title: string; duration: string; completed?: boolean };
type Quiz   = { id: string; title: string; questionCount: number; timeLimit: number; passed?: boolean };
type Module = { id: string; title: string; order: number; description?: string; lessons: Lesson[]; quizzes: Quiz[] };
type Course = { id: string; title: string; thumbnail?: string; progress: number; modules: Module[] };

// --- DEMO DATA (dummy)
const DEMO: Course = {
  id: "1",
  title: "Complete React Developer Course",
  thumbnail: "/placeholder.svg?height=180&width=320",
  progress: 65,
  modules: [
    {
      id: "m1",
      title: "Introduction & Setup",
      order: 1,
      description: "Get your environment ready and learn the course structure.",
      lessons: [
        { id: "l1", title: "Welcome & What You'll Build", duration: "6m", completed: true },
        { id: "l2", title: "Installing Node.js & pnpm", duration: "12m", completed: true },
        { id: "l3", title: "Project Structure Overview", duration: "10m" },
      ],
      quizzes: [{ id: "q1", title: "Kickoff Check", questionCount: 5, timeLimit: 10, passed: true }],
    },
    {
      id: "m2",
      title: "Core React Concepts",
      order: 2,
      description: "JSX, components, props, and state management basics.",
      lessons: [
        { id: "l4", title: "JSX Deep Dive", duration: "15m" },
        { id: "l5", title: "Component Composition", duration: "14m" },
        { id: "l6", title: "Managing State", duration: "18m" },
      ],
      quizzes: [{ id: "q2", title: "React Basics Quiz", questionCount: 10, timeLimit: 20 }],
    },
    {
      id: "m3",
      title: "Hooks & Advanced Patterns",
      order: 3,
      description: "useEffect, custom hooks, and performance patterns.",
      lessons: [
        { id: "l7", title: "useEffect in Practice", duration: "16m" },
        { id: "l8", title: "Building Custom Hooks", duration: "22m" },
      ],
      quizzes: [{ id: "q3", title: "Hooks Mastery", questionCount: 8, timeLimit: 15 }],
    },
  ],
};

export function StudentMyLearningCourse({
  course: injectedCourse,
  courseId,
  onBack,
}: {
  course?: Course;
  courseId?: string;
  onBack?: () => void;
}) {
  const router = useRouter();
  const course = useMemo(
    () => ({ ...(injectedCourse ?? DEMO), id: courseId ?? (injectedCourse?.id ?? DEMO.id) }),
    [injectedCourse, courseId]
  );

const startLesson = (moduleId: string, lessonId: string) => {
  router.push(`/student/lesson/${lessonId}`);
};
const startQuiz = (moduleId: string, quizId: string) => {
  router.push(`/student/quiz/${quizId}`);
};

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-midnight-blue-600 to-midnight-blue-800 text-white py-8">
        <div className="max-w-6xl mx-auto px-4">
          <button
            onClick={onBack ?? (() => router.back())}
            className="mb-4 inline-flex items-center text-blue-100 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </button>
          <div className="flex items-center gap-4">
            <img
              src={course.thumbnail || "/placeholder.svg"}
              alt={course.title}
              className="w-28 h-20 object-cover rounded-lg border border-white/20"
            />
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold">{course.title}</h1>
              <div className="mt-2 flex items-center gap-3">
                <span className="text-sm text-blue-100">Overall Progress</span>
                <div className="w-56 max-w-[60vw]">
                  <Progress value={course.progress} className="h-2 bg-white/20" />
                </div>
                <span className="text-sm font-semibold">{course.progress}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modules */}
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900">Modules</h2>

        {course.modules.map((mod) => (
          <Card key={mod.id} className="border-2 hover:border-midnight-blue-200 transition-colors">
            <CardHeader className="flex flex-row items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">Module {mod.order}</Badge>
                  <Badge className="bg-midnight-blue-600">In Progress</Badge>
                </div>
                <CardTitle className="text-lg md:text-xl">{mod.title}</CardTitle>
                {mod.description && <p className="text-sm text-gray-600">{mod.description}</p>}
              </div>
              <Button
                variant="outline"
                className="bg-transparent"
                onClick={() => document.getElementById(`module-${mod.id}`)?.scrollIntoView({ behavior: "smooth" })}
              >
                View Details <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </CardHeader>

            <CardContent>
              <Accordion type="single" collapsible defaultValue={`acc-${mod.id}`} id={`module-${mod.id}`}>
                <AccordionItem value={`acc-${mod.id}`}>
                  <AccordionTrigger className="hover:no-underline">Contents</AccordionTrigger>
                  <AccordionContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      {/* Lessons */}
                      <Card className="border">
                        <CardHeader>
                          <div className="flex items-center gap-2">
                            <BookOpen className="w-4 h-4" />
                            <CardTitle className="text-base">Lessons ({mod.lessons.length})</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {mod.lessons.map((ls, idx) => (
                            <div key={ls.id} className="flex items-center justify-between p-3 border rounded-lg">
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline" className="text-xs">{idx + 1}</Badge>
                                  <span className="font-medium truncate">{ls.title}</span>
                                </div>
                                <div className="mt-1 flex items-center gap-2 text-xs text-gray-600">
                                  <Clock className="w-3 h-3" /> {ls.duration}
                                  {ls.completed && <Badge variant="secondary" className="ml-2">Completed</Badge>}
                                </div>
                              </div>
                              <Button size="sm" className="bg-midnight-blue-800 hover:bg-midnight-blue-900" onClick={() => startLesson(mod.id, ls.id)}>
                                <Play className="w-4 h-4 mr-1" /> Start
                              </Button>
                            </div>
                          ))}
                        </CardContent>
                      </Card>

                      {/* Quizzes */}
                      <Card className="border">
                        <CardHeader>
                          <div className="flex items-center gap-2">
                            <HelpCircle className="w-4 h-4" />
                            <CardTitle className="text-base">Quizzes ({mod.quizzes.length})</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {mod.quizzes.map((qz, idx) => (
                            <div key={qz.id} className="flex items-center justify-between p-3 border rounded-lg">
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline" className="text-xs">Q{idx + 1}</Badge>
                                  <span className="font-medium truncate">{qz.title}</span>
                                </div>
                                <div className="mt-1 flex items-center gap-2 text-xs text-gray-600">
                                  <span>{qz.questionCount} questions</span>
                                  <span>•</span>
                                  <Clock className="w-3 h-3" /> {qz.timeLimit}m
                                  {qz.passed && <Badge variant="secondary" className="ml-2">Passed</Badge>}
                                </div>
                              </div>
                              <Button size="sm" variant="outline" className="bg-transparent" onClick={() => startQuiz(mod.id, qz.id)}>
                                Take Quiz
                              </Button>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>

            <CardFooter className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                {mod.lessons.filter(l => l.completed).length}/{mod.lessons.length} lessons completed
              </div>
              <Button
                size="sm"
                onClick={() => {
                  const next = mod.lessons.find(l => !l.completed) || mod.lessons[0];
                  startLesson(mod.id, next.id);
                }}
                className="bg-midnight-blue-800 hover:bg-midnight-blue-900"
              >
                <Play className="w-4 h-4 mr-2" /> Continue Module
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default StudentMyLearningCourse;
