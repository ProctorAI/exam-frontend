"use client";

import { cn } from "@/lib/utils";

interface QuestionNavProps {
  totalQuestions: number;
  currentQuestion: number;
  answeredQuestions: number[];
  onQuestionSelect: (questionNumber: number) => void;
}

export function QuestionNav({
  totalQuestions,
  currentQuestion,
  answeredQuestions,
  onQuestionSelect,
}: QuestionNavProps) {
  return (
    <div className="sticky top-6 space-y-4 rounded-lg border bg-card p-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Index of Questions</h3>
        <div className="flex flex-wrap gap-3 text-sm">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-sm bg-primary/20" />
            <span className="text-muted-foreground">Answered</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-sm bg-primary" />
            <span className="text-muted-foreground">Current</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-sm border border-muted-foreground/20" />
            <span className="text-muted-foreground">Unanswered</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-2">
        {Array.from({ length: totalQuestions }, (_, i) => i + 1).map((num) => (
          <button
            key={num}
            onClick={() => onQuestionSelect(num)}
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-md text-sm font-medium transition-all hover:bg-accent",
              currentQuestion === num && "bg-primary text-primary-foreground",
              answeredQuestions.includes(num) && currentQuestion !== num && "bg-primary/20 text-primary",
              !answeredQuestions.includes(num) && currentQuestion !== num && "border border-muted-foreground/20 hover:border-muted-foreground/30"
            )}
          >
            {num}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-2 rounded-md bg-muted p-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Attempted</span>
          <span className="font-medium text-foreground">
            {answeredQuestions.length}/{totalQuestions}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Remaining</span>
          <span className="font-medium text-foreground">
            {totalQuestions - answeredQuestions.length}
          </span>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted-foreground/20">
          <div
            className="h-full bg-primary transition-all"
            style={{
              width: `${(answeredQuestions.length / totalQuestions) * 100}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
} 