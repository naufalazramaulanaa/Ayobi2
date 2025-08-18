import QuizTaker from "@/components/student/quiz-taker";

export default function QuizPage({ params }: { params: { quizId: string } }) {
  return <QuizTaker quizId={params.quizId} />;
}
