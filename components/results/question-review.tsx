import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, X } from "lucide-react"

interface QuestionReviewProps {
  questions: {
    id: number
    question: string
    userAnswer: string
    correctAnswer: string
    isCorrect: boolean
    explanation?: string
  }[]
}

export function QuestionReview({ questions }: QuestionReviewProps) {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Question Review</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {questions.map((q) => (
          <div
            key={q.id}
            className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium">Question {q.id}</p>
                <p className="text-base">{q.question}</p>
              </div>
              <div className={`rounded-full p-1.5 ${
                q.isCorrect 
                  ? "bg-emerald-500/20 text-emerald-500"
                  : "bg-destructive/20 text-destructive"
              }`}>
                {q.isCorrect ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <X className="h-4 w-4" />
                )}
              </div>
            </div>
            <div className="mt-4 grid gap-2 text-sm">
              <div className="grid grid-cols-[100px_1fr] items-start">
                <div className="font-medium text-muted-foreground">Your Answer:</div>
                <div className={q.isCorrect ? "text-emerald-500" : "text-destructive"}>
                  {q.userAnswer}
                </div>
              </div>
              {!q.isCorrect && (
                <div className="grid grid-cols-[100px_1fr] items-start">
                  <div className="font-medium text-muted-foreground">Correct Answer:</div>
                  <div className="text-emerald-500">{q.correctAnswer}</div>
                </div>
              )}
              {q.explanation && (
                <div className="mt-2 rounded-md bg-muted p-3">
                  <p className="text-sm text-muted-foreground">{q.explanation}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
} 