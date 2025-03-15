import { Suspense } from "react"
import { createSupabaseServer } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { TestContent } from "./test-content"
import { Card } from "@/components/ui/card"
import { use } from 'react'


export default async function TestPage({
  params,
}: {
  params: Promise<{ id: string }> 
}) {
  const { id } = await params
  const supabase = await createSupabaseServer()
  
  const { data: test, error } = await supabase
    .from("tests")
    .select(`
      *,
      subject_area:subject_areas(name),
      questions(
        *,
        question_options(*)
      )
    `)
    .eq("id", id)
    .single()

  if (error || !test) {
    notFound()
  }

  return (
    <div className="container mx-auto space-y-8 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{test.title}</h1>
          <p className="text-muted-foreground">
            {test.subject_area.name} • {test.duration_minutes} minutes
          </p>
        </div>
      </div>

      <Suspense
        fallback={
          <div className="grid gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="h-[200px] animate-pulse" />
            ))}
          </div>
        }
      >
        <TestContent test={test} />
      </Suspense>
    </div>
  )
} 