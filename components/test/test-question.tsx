"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface QuestionOption {
  id: string
  option_text: string
  is_correct: boolean
}

interface Question {
  id: string
  question_text: string
  explanation: string | null
  question_options: QuestionOption[]
}

interface TestQuestionProps {
  question: Question
  onAnswer: (answer: string) => void
  selectedAnswer?: string
  isSubmitted?: boolean
}

export function TestQuestion({
  question,
  onAnswer,
  selectedAnswer,
  isSubmitted,
}: TestQuestionProps) {
  return (
    <Card className="transition-all hover:shadow-md">
      <CardHeader>
        <CardTitle className="text-lg font-medium leading-normal">
          {question.question_text}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <RadioGroup
          value={selectedAnswer}
          onValueChange={onAnswer}
          disabled={isSubmitted}
          className="space-y-3"
        >
          {question.question_options.map((option) => (
            <div
              key={option.id}
              className={cn(
                "flex items-center space-x-2 rounded-lg border p-4 transition-all",
                selectedAnswer === option.option_text && !isSubmitted && "border-primary bg-primary/5",
                isSubmitted && option.is_correct && "border-green-500 bg-green-50 dark:bg-green-900/10",
                isSubmitted && !option.is_correct && selectedAnswer === option.option_text && "border-red-500 bg-red-50 dark:bg-red-900/10"
              )}
            >
              <RadioGroupItem
                value={option.option_text}
                id={option.id}
                className={cn(
                  isSubmitted && option.is_correct && "text-green-500 border-green-500",
                  isSubmitted && !option.is_correct && selectedAnswer === option.option_text && "text-red-500 border-red-500"
                )}
              />
              <Label
                htmlFor={option.id}
                className={cn(
                  "flex-grow cursor-pointer",
                  isSubmitted && option.is_correct && "text-green-500",
                  isSubmitted && !option.is_correct && selectedAnswer === option.option_text && "text-red-500"
                )}
              >
                {option.option_text}
              </Label>
            </div>
          ))}
        </RadioGroup>

        {isSubmitted && question.explanation && (
          <div className="rounded-lg bg-muted p-4">
            <p className="text-sm text-muted-foreground">
              {question.explanation}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 