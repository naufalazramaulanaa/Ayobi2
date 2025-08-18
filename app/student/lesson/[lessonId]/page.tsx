// Server component: aman akses params langsung
import LessonPlayer from "@/components/student/lesson-player";

export default function LessonPage({ params }: { params: { lessonId: string } }) {
  return <LessonPlayer lessonId={params.lessonId} />;
}
