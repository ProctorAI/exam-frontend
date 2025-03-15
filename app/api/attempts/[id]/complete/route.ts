import { createSupabaseServer } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createSupabaseServer()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: answers, error: answersError } = await supabase
    .from('user_answers')
    .select('marks_obtained')
    .eq('attempt_id', id)

  if (answersError) {
    return NextResponse.json({ error: answersError.message }, { status: 500 })
  }

  const totalScore = answers.reduce((sum: number, answer: { marks_obtained: number }) => 
    sum + answer.marks_obtained, 0)

  const { data: attempt, error } = await supabase
    .from('user_test_attempts')
    .update({
      status: 'completed',
      score: totalScore,
      end_time: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(attempt)
} 