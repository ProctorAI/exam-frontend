"use client"

import { Metadata } from 'next'
import { useQuery } from "@tanstack/react-query"
import { ResultsList } from '@/components/results/results-list'
import useUser from '@/hooks/use-user'

export default function ResultsPage() {
  const { data: user } = useUser()

  const { data: attempts, isLoading } = useQuery({
    queryKey: ['results', user?.id],
    queryFn: async () => {
      const response = await fetch(`/api/results?userId=${user?.id}`)
      if (!response.ok) {
        throw new Error('Failed to fetch results')
      }
      const data = await response.json()
      return data.attempts
    },
    enabled: !!user?.id
  })

  if (isLoading) {
    return (
      <div className="container space-y-8 py-8">
        <div>Loading...</div>
      </div>
    )
  }

  return (
    <div className="container space-y-8 py-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Your Test Results</h1>
        <p className="text-muted-foreground mt-2">
          View your test attempt history and performance across all subjects
        </p>
      </div>

      <ResultsList attempts={attempts || []} />
    </div>
  )
}
