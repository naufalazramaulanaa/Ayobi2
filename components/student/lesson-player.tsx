"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Clock, ArrowLeft, CheckCircle2, Play } from "lucide-react";
import { useRouter } from "next/navigation";
import { fetchData } from "@/lib/api";

type Lesson = {
  id: string;
  title: string;
  description?: string;
  content?: string;            // HTML
  duration?: number;           // minutes
  video_id?: string;
  order?: number;
  module_id?: string;
};

const DEMO: Lesson = {
  id: "l1",
  title: "Welcome & What You'll Build",
  content: "<p>Demo lesson content with <b>rich text</b>.</p>",
  duration: 6,
  video_id: "",
  order: 1,
};

export default function LessonPlayer({ lessonId }: { lessonId: string }) {
  const router = useRouter();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);
  const [completed, setCompleted] = useState(false);

  const playerSrc = useMemo(() => {
    // adapt here if you use mux/vimeo/youtube via video_id
    return lesson?.video_id ? `/api/video/${lesson.video_id}` : "";
  }, [lesson?.video_id]);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      try {
        // ganti endpoint ini sesuai backend student-mu
        const res = await fetchData(`/student/lessons/${lessonId}`, { method: "GET" });
        if (!active) return;
        setLesson(res?.data ?? res ?? DEMO);
      } catch {
        setLesson(DEMO);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [lessonId]);

  const markComplete = async () => {
    setMarking(true);
    try {
      // endpoint progress student (opsional)
      await fetchData(`/student/lessons/${lessonId}/complete`, { method: "POST" }).catch(() => {});
      setCompleted(true);
    } finally {
      setMarking(false);
    }
  };

  if (loading) return <div className="p-6">Loading lesson...</div>;
  if (!lesson) return <div className="p-6">Lesson not found.</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
          <Button variant="ghost" onClick={() => router.back()} className="px-2">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-3">
            <Badge variant="outline">Lesson {lesson.order ?? "-"}</Badge>
            <h1 className="text-lg font-semibold">{lesson.title}</h1>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 md:p-6 grid md:grid-cols-[1fr_320px] gap-6">
        {/* Main */}
        <Card className="overflow-hidden">
          <CardHeader className="border-b">
            <CardTitle className="text-base md:text-lg">Lesson Player</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {/* Video (optional) */}
            {playerSrc ? (
              <div className="aspect-video bg-black">
                <video src={playerSrc} controls className="w-full h-full" />
              </div>
            ) : (
              <div className="aspect-video bg-gray-100 flex items-center justify-center">
                <Play className="w-10 h-10 text-gray-400" />
              </div>
            )}

            {/* Content */}
            <div className="p-5 prose max-w-none"
                 dangerouslySetInnerHTML={{ __html: lesson.content || "<p>No content.</p>" }} />
          </CardContent>
        </Card>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>{lesson.duration ?? 10} minutes</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                <span className="text-sm">Module: {lesson.module_id ?? "-"}</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Progress</span><span>{completed ? "100%" : "0%"}</span>
                </div>
                <Progress value={completed ? 100 : 0} />
              </div>
              <Button
                className="w-full"
                onClick={markComplete}
                disabled={marking || completed}
              >
                {completed ? <CheckCircle2 className="w-4 h-4 mr-2" /> : null}
                {completed ? "Completed" : "Mark as Complete"}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 space-y-3">
              <div className="text-sm text-gray-600">Next actions</div>
              <Button className="w-full" variant="outline" onClick={() => router.back()}>
                Back to Modules
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
