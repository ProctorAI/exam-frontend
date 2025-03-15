import { createSupabaseServer } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createSupabaseServer()
  const body = await request.json()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: question, error: questionError } = await supabase
    .from('questions')
    .select('*')
    .eq('id', body.question_id)
    .single()

  if (questionError) {
    return NextResponse.json({ error: questionError.message }, { status: 500 })
  }

  const isCorrect = body.selected_answer === question.correct_answer
  const marksObtained = isCorrect ? question.marks : 0

  const { data: answer, error } = await supabase
    .from('user_answers')
    .insert({
      attempt_id: id,
      question_id: body.question_id,
      selected_answer: body.selected_answer,
      is_correct: isCorrect,
      marks_obtained: marksObtained
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(answer)
} 