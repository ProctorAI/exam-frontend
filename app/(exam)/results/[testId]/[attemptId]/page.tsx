"use client"

import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import { SummaryCard } from '@/components/results/summary-card'
import { ResultsChart } from '@/components/results/results-chart'
import { QuestionReview } from '@/components/results/question-review'
import { Skeleton } from "@/components/ui/skeleton"
import { use } from 'react'

interface FormattedQuestion {
  id: number
  question: string
  userAnswer: string
  correctAnswer: string
  isCorrect: boolean
  timeSpent: number
  explanation?: string
}

export default function AttemptResultsPage({ params }: { params: Promise<{ testId: string, attemptId: string }> }) {
  const { testId, attemptId } = use(params)

  const { data: results, isLoading, error } = useQuery({
    queryKey: ['test-results', attemptId],
    queryFn: async () => {
      try {
        const response = await fetch(`/api/results/${attemptId}`)
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to fetch results")
        }
        
        const data = await response.json()
        if (!data.attempt || !data.answers) {
          throw new Error("Invalid response format")
        }
        
        return data
      } catch (err) {
        console.error('Fetch error:', err)
        throw err
      }
    },
    enabled: !!attemptId,
    retry: 3,
    retryDelay: 1000,
  })

  if (isLoading) {
    return (
      <div className="flex-1 space-y-8 p-8 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-64" />
            <Skeleton className="mt-2 h-4 w-96" />
          </div>
        </div>
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    )
  }

  if (error || !results) {
    return (
      <div className="flex-1 space-y-8 p-8 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Error Loading Results</h2>
            <p className="text-muted-foreground">
              {error instanceof Error ? error.message : "Failed to load test results"}
            </p>
          </div>
        </div>
      </div>
    )
  }

  const { attempt, answers } = results
  
  if (!attempt || !answers || answers.length === 0) {
    return (
      <div className="flex-1 space-y-8 p-8 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">No Results Available</h2>
            <p className="text-muted-foreground">
              No answers were recorded for this test attempt.
            </p>
          </div>
        </div>
      </div>
    )
  }

  const totalQuestions = answers.length
  const correctAnswers = answers.filter((a: any) => a.is_correct ?? false).length
  const accuracy = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0
  
  // Calculate time spent in minutes, defaulting to 0 if dates are invalid
  const timeSpent = (() => {
    try {
      if (!attempt.end_time || !attempt.start_time) return 0
      const end = new Date(attempt.end_time)
      const start = new Date(attempt.start_time)
      if (isNaN(end.getTime()) || isNaN(start.getTime())) return 0
      return Math.max(0, Math.round((end.getTime() - start.getTime()) / 60000))
    } catch {
      return 0
    }
  })()

  const formattedQuestions: FormattedQuestion[] = answers.map((answer: any, index: number) => {
    let correctAnswer = ""
    
    if (answer.question && answer.question.correct_answer) {
      correctAnswer = answer.question.correct_answer
    }

    // Ensure we have a valid numeric ID
    const questionId = (() => {
      if (typeof answer.question.id === 'number') return answer.question.id
      if (typeof answer.question.id === 'string') {
        const parsed = parseInt(answer.question.id)
        return isNaN(parsed) ? index + 1 : parsed
      }
      return index + 1
    })()

    return {
      id: questionId,
      question: answer.question.question_text || `Question ${index + 1}`,
      userAnswer: answer.selected_answer || "No answer",
      correctAnswer: correctAnswer || "No correct answer provided",
      isCorrect: answer.is_correct ?? false,
      timeSpent: 0, // We'll calculate individual question time if available
      explanation: answer.question.explanation || undefined
    }
  })

  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Test Results</h2>
          <p className="text-muted-foreground">
            Your performance analysis and detailed breakdown
          </p>
        </div>
      </div>

      <SummaryCard
        score={attempt.score || 0}
        totalQuestions={totalQuestions}
        timeSpent={timeSpent}
        accuracy={accuracy}
      />

      <div className="grid gap-4 md:grid-cols-1">
        <ResultsChart
          data={formattedQuestions}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-1">
        <QuestionReview
          questions={formattedQuestions}
        />
      </div>
    </div>
  )
} 