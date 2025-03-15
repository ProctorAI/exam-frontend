import { format } from 'date-fns'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface Test {
  id: string
  title: string
  description: string | null
  total_questions: number
  passing_score: number
  duration_minutes: number
}

interface TestAttempt {
  id: string
  start_time: string
  end_time: string | null
  score: number | null
  status: 'in_progress' | 'completed' | 'abandoned'
  test: Test
}

interface ResultsListProps {
  attempts: TestAttempt[]
}

export function ResultsList({ attempts }: ResultsListProps) {
  if (attempts.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-2">No test attempts yet</h2>
        <p className="text-muted-foreground">
          Start taking tests to see your results here
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-4">
      {attempts.map((attempt) => (
        <Card key={attempt.id} className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold">{attempt.test.title}</h3>
              {attempt.test.description && (
                <p className="text-sm text-muted-foreground mt-1">
                  {attempt.test.description}
                </p>
              )}
            </div>
            <Badge
              variant={
                attempt.status === 'completed'
                  ? 'default'
                  : attempt.status === 'in_progress'
                  ? 'secondary'
                  : 'destructive'
              }
            >
              {attempt.status.replace('_', ' ')}
            </Badge>
          </div>

          <div className="grid gap-2 text-sm mb-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Started:</span>
              <span>{format(new Date(attempt.start_time), 'PPp')}</span>
            </div>
            {attempt.end_time && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Completed:</span>
                <span>{format(new Date(attempt.end_time), 'PPp')}</span>
              </div>
            )}
            {attempt.score !== null && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Score:</span>
                <Badge variant={attempt.score >= attempt.test.passing_score ? 'default' : 'destructive'}>
                  {attempt.score}/{attempt.test.total_questions}
                </Badge>
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <Button
              variant="outline"
              asChild
              disabled={attempt.status === 'in_progress'}
            >
              <Link href={`/results/${attempt.test.id}/${attempt.id}`}>
                View Details
              </Link>
            </Button>
          </div>
        </Card>
      ))}
    </div>
  )
} 