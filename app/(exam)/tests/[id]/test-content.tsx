"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useMutation } from "@tanstack/react-query"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { TestQuestion } from "@/components/test/test-question"
import { useToast } from "@/components/ui/use-toast"
import { Timer } from "@/components/test/timer"

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

interface Test {
  id: string
  title: string
  description: string | null
  duration_minutes: number
  questions: Question[]
  start_date: string | null
  end_date: string | null
  subject_area: {
    id: string
    name: string
  }
}

interface TestContentProps {
  test: Test
}

export function TestContent({ test }: TestContentProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [attemptId, setAttemptId] = useState<string | null>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const startTestMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/tests/${test.id}/start`, {
        method: "POST",
      })
      if (!response.ok) throw new Error("Failed to start test")
      const data = await response.json()
      return data.id
    },
    onSuccess: (attemptId) => {
      setAttemptId(attemptId)
      toast({
        title: "Test started",
        description: "Good luck!",
      })
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to start test. Please try again.",
        variant: "destructive",
      })
    },
  })

  const submitAnswerMutation = useMutation({
    mutationFn: async (answer: { questionId: string; answer: string }) => {
      if (!attemptId) throw new Error("No attempt ID")
      const response = await fetch(`/api/attempts/${attemptId}/answers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question_id: answer.questionId,
          selected_answer: answer.answer,
        }),
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to submit answer")
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit answer",
        variant: "destructive",
      })
    },
  })

  const completeTestMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/attempts/${attemptId}/complete`, {
        method: 'POST',
      })
      if (!response.ok) {
        throw new Error('Failed to complete test')
      }
      return response.json()
    },
    onSuccess: () => {
      // Redirect to the new results route with both test ID and attempt ID
      router.push(`/results/${test.id}/${attemptId}`)
    },
  })

  const handleAnswer = async (answer: string) => {
    const currentQuestion = test.questions[currentQuestionIndex]
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: answer }))
    await submitAnswerMutation.mutateAsync({
      questionId: currentQuestion.id,
      answer,
    })
  }

  const handleNext = () => {
    if (currentQuestionIndex < test.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1)
    }
  }

  const handleComplete = async () => {
    await completeTestMutation.mutateAsync()
  }

  const handleTimeUp = () => {
    completeTestMutation.mutate()
  }

  if (!attemptId) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Ready to start?</CardTitle>
          <CardDescription>
            This test has {test.questions.length} questions and a duration of{" "}
            {test.duration_minutes} minutes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={() => startTestMutation.mutate()}
            disabled={startTestMutation.isPending}
          >
            {startTestMutation.isPending ? "Starting..." : "Start Test"}
          </Button>
        </CardContent>
      </Card>
    )
  }

  const currentQuestion = test.questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / test.questions.length) * 100

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">
            Question {currentQuestionIndex + 1} of {test.questions.length}
          </h2>
          <Progress value={progress} className="w-[60%]" />
        </div>
        <Timer
          duration={test.duration_minutes * 60}
          onTimeUp={handleTimeUp}
          className="text-lg font-medium"
        />
      </div>

      <TestQuestion
        question={currentQuestion}
        onAnswer={handleAnswer}
        selectedAnswer={answers[currentQuestion.id]}
        isSubmitted={isSubmitted}
      />

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
        >
          Previous
        </Button>

        <div className="space-x-2">
          {currentQuestionIndex === test.questions.length - 1 ? (
            <Button
              onClick={handleComplete}
              disabled={
                Object.keys(answers).length !== test.questions.length ||
                isSubmitted
              }
            >
              Complete Test
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              disabled={!answers[currentQuestion.id]}
            >
              Next
            </Button>
          )}
        </div>
      </div>
    </div>
  )
} 