"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Timer, HelpCircle, ArrowLeft, Check, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { fetchData } from "@/lib/api";

type Question = {
  id: string;
  title: string;
  description?: string;
  explanation?: string;
  type: "multiple_choice" | "true_false";
  options?: string[];       // for MCQ
  correct?: number | boolean; // for auto grading (optional, hidden if show_correct_answers=false)
  points?: number;
};

type Quiz = {
  id: string;
  title: string;
  module_id?: string;
  description?: string;
  settings?: {
    timeLimit: number;          // minutes
    passingScore: number;       // percent
    attemptsAllowed: number;
    showAnswers: boolean;
    autoGrading: boolean;
  };
  questions: Question[];
};

const DEMO: Quiz = {
  id: "q1",
  title: "Kickoff Check",
  settings: { timeLimit: 10, passingScore: 80, attemptsAllowed: 3, showAnswers: true, autoGrading: true },
  questions: [
    { id: "q-1", title: "React adalah library untuk...", type: "multiple_choice", options: ["Server", "UI", "Database", "OS"], correct: 1, points: 10 },
    { id: "q-2", title: "useEffect termasuk React Hook.", type: "true_false", correct: true, points: 10 },
  ],
};

export default function QuizTaker({ quizId }: { quizId: string }) {
  const router = useRouter();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);

  // State pengerjaan
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  // Timer
  const [remaining, setRemaining] = useState<number>(0); // detik
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // load quiz
  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      try {
        // Ambil dari backend student
        const res = await fetchData(`/student/quizzes/${quizId}`, { method: "GET" });
        const q = (res?.data ?? res) as any;

        // Normalisasi sesuai struktur Course Creator (lihat settings di file itu).  
        const norm: Quiz = {
          id: q.id,
          title: q.title,
          module_id: q.module_id,
          description: q.description,
          settings: {
            timeLimit: Number(q.time_limit ?? q.settings?.timeLimit ?? 10),
            passingScore: Number(q.passing_grade ?? q.settings?.passingScore ?? 80),
            attemptsAllowed: Number(q.max_attempts ?? q.settings?.attemptsAllowed ?? 1),
            showAnswers: !!(q.show_correct_answers ?? q.settings?.showAnswers ?? true),
            autoGrading: !!(q.automatically_graded ?? q.settings?.autoGrading ?? true),
          },
          questions: (q.questions ?? []).map((it: any) => ({
            id: String(it.id ?? it.qid),
            title: it.title,
            description: it.description,
            explanation: it.explanation,
            type: it.type === "true_false" ? "true_false" : "multiple_choice",
            options: Array.isArray(it.options)
              ? it.options
              : (typeof it.options === "string" ? (() => { try { return JSON.parse(it.options); } catch { return []; } })() : []),
            correct: it.correct ?? it.answer_index ?? it.answer ?? null,
            points: Number(it.points ?? 1),
          })),
        };

        if (active) setQuiz(norm);
      } catch {
        if (active) setQuiz(DEMO);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [quizId]);

  // init timer
  useEffect(() => {
    if (!quiz) return;
    setRemaining((quiz.settings?.timeLimit ?? 10) * 60);
  }, [quiz]);

  useEffect(() => {
    if (submitted) return;
    if (!remaining) return;
    timerRef.current && clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setRemaining((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => { timerRef.current && clearInterval(timerRef.current); };
  }, [remaining, submitted]);

  useEffect(() => {
    if (!submitted && remaining === 0 && quiz) {
      handleSubmit();
    }
  }, [remaining, submitted, quiz]);

  const fmt = (sec: number) => {
    const m = Math.floor(sec / 60).toString().padStart(2, "0");
    const s = (sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const setAnswer = (qid: string, val: string) => {
    setAnswers((prev) => ({ ...prev, [qid]: val }));
  };

  const handleSubmit = async () => {
    if (!quiz) return;
    const auto = quiz.settings?.autoGrading ?? true;

    let total = 0;
    let earned = 0;

    quiz.questions.forEach((q) => {
      const p = q.points ?? 1;
      total += p;
      if (auto) {
        if (q.type === "multiple_choice" && typeof q.correct === "number") {
          if (String(q.correct) === answers[q.id]) earned += p;
        } else if (q.type === "true_false" && typeof q.correct === "boolean") {
          if ((q.correct ? "true" : "false") === answers[q.id]) earned += p;
        }
      }
    });

    const percent = total ? Math.round((earned / total) * 100) : 0;
    setScore(auto ? percent : null);
    setSubmitted(true);

    // Kirim jawaban (opsional)
    try {
      await fetchData(`/student/quizzes/${quizId}/submit`, {
        method: "POST",
        body: JSON.stringify({ answers }),
        headers: { "Content-Type": "application/json" },
      }).catch(() => {});
    } catch {}
  };

  if (loading) return <div className="p-6">Loading quiz...</div>;
  if (!quiz) return <div className="p-6">Quiz not found.</div>;

  const showAnswers = quiz.settings?.showAnswers ?? true;
  const pass = score !== null && score >= (quiz.settings?.passingScore ?? 80);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
          <Button variant="ghost" onClick={() => router.back()} className="px-2">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-2">
            <Badge>Quiz</Badge>
            <h1 className="text-lg font-semibold">{quiz.title}</h1>
          </div>
          <div className="ml-auto flex items-center gap-2 text-sm">
            <Timer className="w-4 h-4" />
            <span>{fmt(remaining)}</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 md:p-6 grid md:grid-cols-[1fr_320px] gap-6">
        {/* Questions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base md:text-lg">Questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {quiz.questions.map((q, idx) => {
              const selected = answers[q.id];
              const correctIndex = typeof q.correct === "number" ? String(q.correct) : undefined;
              const correctBool = typeof q.correct === "boolean" ? (q.correct ? "true" : "false") : undefined;

              return (
                <div key={q.id} className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">Q{idx + 1}</Badge>
                    <span className="font-medium">{q.title}</span>
                    <span className="ml-auto text-xs text-gray-500">{q.points ?? 1} pts</span>
                  </div>
                  {q.description && (
                    <p className="text-sm text-gray-600 mb-3">{q.description}</p>
                  )}

                  {q.type === "multiple_choice" ? (
                    <RadioGroup value={selected} onValueChange={(v) => setAnswer(q.id, v)} disabled={submitted}>
                      {(q.options ?? []).map((opt, i) => {
                        const val = String(i);
                        const isCorrect = submitted && showAnswers && correctIndex === val;
                        const isWrong = submitted && showAnswers && selected === val && correctIndex !== val;
                        return (
                          <Label
                            key={val}
                            className={`flex items-center gap-2 p-2 rounded-md border cursor-pointer mb-2 ${
                              isCorrect ? "border-green-500 bg-green-50" : isWrong ? "border-red-500 bg-red-50" : ""
                            }`}
                          >
                            <RadioGroupItem value={val} />
                            <span className="flex-1">{opt}</span>
                            {isCorrect && <Check className="w-4 h-4 text-green-600" />}
                            {isWrong && <X className="w-4 h-4 text-red-600" />}
                          </Label>
                        );
                      })}
                    </RadioGroup>
                  ) : (
                    <RadioGroup value={selected} onValueChange={(v) => setAnswer(q.id, v)} disabled={submitted}>
                      {["true", "false"].map((val) => {
                        const isCorrect = submitted && showAnswers && correctBool === val;
                        const isWrong = submitted && showAnswers && selected === val && correctBool !== val;
                        return (
                          <Label
                            key={val}
                            className={`flex items-center gap-2 p-2 rounded-md border cursor-pointer mb-2 ${
                              isCorrect ? "border-green-500 bg-green-50" : isWrong ? "border-red-500 bg-red-50" : ""
                            }`}
                          >
                            <RadioGroupItem value={val} />
                            <span className="flex-1">{val === "true" ? "True" : "False"}</span>
                            {isCorrect && <Check className="w-4 h-4 text-green-600" />}
                            {isWrong && <X className="w-4 h-4 text-red-600" />}
                          </Label>
                        );
                      })}
                    </RadioGroup>
                  )}

                  {submitted && showAnswers && q.explanation && (
                    <div className="mt-2 text-xs text-gray-600 flex items-start gap-2">
                      <HelpCircle className="w-3 h-3 mt-0.5" />
                      <span>{q.explanation}</span>
                    </div>
                  )}
                </div>
              );
            })}

            {!submitted ? (
              <Button className="w-full" onClick={handleSubmit}>Submit Quiz</Button>
            ) : (
              <Button className="w-full" variant="outline" onClick={() => router.back()}>
                Back to Modules
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardContent className="p-4 space-y-3">
              <div className="text-sm text-gray-600">Time Limit</div>
              <div className="flex items-center gap-2">
                <Timer className="w-4 h-4" />
                <span>{quiz.settings?.timeLimit ?? 10} minutes</span>
              </div>

              <div className="text-sm text-gray-600 mt-3">Passing Score</div>
              <Progress value={(quiz.settings?.passingScore ?? 80)} />
              <div className="text-xs text-gray-500">{quiz.settings?.passingScore ?? 80}%</div>

              {submitted && score !== null && (
                <div className="mt-3">
                  <div className="text-sm font-medium">Your Score</div>
                  <div className={`text-xl font-bold ${pass ? "text-green-600" : "text-red-600"}`}>{score}%</div>
                  <Badge className={`mt-2 ${pass ? "bg-green-600" : "bg-red-600"}`}>{pass ? "Passed" : "Failed"}</Badge>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
