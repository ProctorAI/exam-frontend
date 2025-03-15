"use client"

import { useQuery } from '@tanstack/react-query'
import { useParams, useRouter } from 'next/navigation'
import { format } from 'date-fns'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { use } from 'react'

interface TestAttempt {
  id: string
  start_time: string
  end_time: string | null
  score: number | null
  status: 'in_progress' | 'completed' | 'abandoned'
}

interface Test {
  id: string
  title: string
  description: string | null
  total_questions: number
  passing_score: number
}

export default function TestResultsPage({ params }: { params: Promise<{ testId: string }> }) {
  const { testId } = use(params)
  const router = useRouter()


  const { data, isLoading, error } = useQuery({
    queryKey: ['test-attempts', testId],
    queryFn: async () => {
      try {
        const response = await fetch(`/api/results/${testId}/attempts`)
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to fetch attempts")
        }
        
        const data = await response.json()
        if (!data.test || !data.attempts) {
          throw new Error("Invalid response format")
        }
        
        return data as { test: Test, attempts: TestAttempt[] }
      } catch (err) {
        console.error('Fetch error:', err)
        throw err
      }
    },
    enabled: !!testId,
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
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="flex-1 space-y-8 p-8 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Error Loading Results</h2>
            <p className="text-muted-foreground">
              {error instanceof Error ? error.message : "Failed to load test attempts"}
            </p>
          </div>
        </div>
      </div>
    )
  }

  const { test, attempts } = data

  if (!attempts || attempts.length === 0) {
    return (
      <div className="flex-1 space-y-8 p-8 pt-6">
        <Card>
          <CardHeader>
            <CardTitle>{test.title}</CardTitle>
            <CardDescription>{test.description}</CardDescription>
          </CardHeader>
          <div className="p-6">
            <p className="text-muted-foreground">No attempts found for this test.</p>
          </div>
        </Card>
      </div>
    )
  }

  const handleViewAttempt = (attemptId: string) => {
    router.push(`/results/${testId}/${attemptId}`)
  }

  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <Card>
        <CardHeader>
          <CardTitle>{test.title}</CardTitle>
          <CardDescription>{test.description}</CardDescription>
        </CardHeader>
        <div className="p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Attempt Date</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attempts.map((attempt) => {
                const duration = attempt.end_time
                  ? Math.round((new Date(attempt.end_time).getTime() - new Date(attempt.start_time).getTime()) / 60000)
                  : 0

                return (
                  <TableRow key={attempt.id}>
                    <TableCell>
                      {format(new Date(attempt.start_time), 'PPp')}
                    </TableCell>
                    <TableCell>
                      {duration} minutes
                    </TableCell>
                    <TableCell>
                      {attempt.score !== null ? `${attempt.score}/${test.total_questions}` : '-'}
                    </TableCell>
                    <TableCell className="capitalize">
                      {attempt.status.replace('_', ' ')}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        onClick={() => handleViewAttempt(attempt.id)}
                        disabled={attempt.status === 'in_progress'}
                      >
                        View Results
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  )
} 