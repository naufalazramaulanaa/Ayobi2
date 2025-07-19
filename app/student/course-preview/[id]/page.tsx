import { CoursePreview } from "@/components/student/course-preview"

interface CoursePreviewPageProps {
  params: {
    id: string
  }
}

export default function CoursePreviewPage({ params }: CoursePreviewPageProps) {
  return <CoursePreview courseId={params.id} />
}
