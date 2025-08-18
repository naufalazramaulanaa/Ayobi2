
import StudentMyLearningCourse from "@/components/student/my-learning-course";

export default function MyLearningCoursePage(
  { params }: { params: { courseId: string } }
) {
  return <StudentMyLearningCourse courseId={params.courseId} />;
}
