"use client";

import { useState } from "react";
import { ExamQuestion } from "@/components/exam/exam-question";
import { QuestionNav } from "@/components/exam/question-nav";
import { ExamTimer } from "@/components/exam/exam-timer";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { mockExam } from "@/lib/data/questions";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function ExamPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const handleAnswer = (value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [mockExam.questions[currentQuestion - 1].id]: value,
    }));
  };

  const handleSubmit = () => {
    // Submit answers to API
    console.log("Submitting answers:", answers);
    router.push(`/tests/${params.id}/result`);
  };

  const handleTimeUp = () => {
    handleSubmit();
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 flex h-14 items-center border-b bg-background px-6">
        <Link
          href="/tests"
          className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Tests
        </Link>
        <div className="ml-auto flex items-center gap-6">
          <ExamTimer
            durationInSeconds={mockExam.duration}
            onTimeUp={handleTimeUp}
          />
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8 border-2 border-border">
              <AvatarFallback className="bg-muted text-foreground">
                TA
              </AvatarFallback>
            </Avatar>
            <div className="text-sm">
              <p className="font-medium">Tanvir Ahossan</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>Attempted: {Object.keys(answers).length}/{mockExam.questions.length}</span>
                <span>•</span>
                <span>Remaining: {mockExam.questions.length - Object.keys(answers).length}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto grid max-w-[1200px] grid-cols-[1fr_300px] gap-6 p-6">
        <div className="space-y-6">
          <div className="rounded-lg border bg-card p-6">
            <h1 className="text-2xl font-semibold text-foreground">
              {mockExam.title}
            </h1>
          </div>

          <ExamQuestion
            questionNumber={currentQuestion}
            question={mockExam.questions[currentQuestion - 1].text}
            options={mockExam.questions[currentQuestion - 1].options}
            selectedOption={answers[mockExam.questions[currentQuestion - 1].id]}
            onOptionSelect={handleAnswer}
          />

          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => setCurrentQuestion((prev) => Math.max(1, prev - 1))}
              disabled={currentQuestion === 1}
              className="w-28"
            >
              Previous
            </Button>
            {currentQuestion === mockExam.questions.length ? (
              <Button onClick={handleSubmit} className="w-28">
                Submit Exam
              </Button>
            ) : (
              <Button
                onClick={() =>
                  setCurrentQuestion((prev) =>
                    Math.min(mockExam.questions.length, prev + 1)
                  )
                }
                className="w-28"
              >
                Next
              </Button>
            )}
          </div>
        </div>

        <div>
          <QuestionNav
            totalQuestions={mockExam.questions.length}
            currentQuestion={currentQuestion}
            answeredQuestions={Object.keys(answers).map((_, i) => i + 1)}
            onQuestionSelect={setCurrentQuestion}
          />
        </div>
      </main>
    </div>
  );
} 