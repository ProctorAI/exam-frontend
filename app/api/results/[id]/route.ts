import { NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const supabase = await createSupabaseServer()

    // Get the current user's session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    if (sessionError || !session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get the attempt details and verify ownership
    const { data: attempt, error: attemptError } = await supabase
      .from('user_test_attempts')
      .select('id, test_id, start_time, end_time, score, status')
      .eq('id', id)
      .eq('user_id', session.user.id)
      .single()

    if (attemptError || !attempt) {
      return NextResponse.json(
        { error: 'Attempt not found or unauthorized' },
        { status: 404 }
      )
    }

    // Get all answers for this attempt with their corresponding questions
    const { data: answers, error: answersError } = await supabase
      .from('user_answers')
      .select(`
        id,
        selected_answer,
        is_correct,
        marks_obtained,
        question:questions (
          id,
          question_text,
          correct_answer,
          explanation,
          marks
        )
      `)
      .eq('attempt_id', id)
      .order('created_at', { ascending: true })

    if (answersError) {
      return NextResponse.json(
        { error: 'Failed to fetch answers' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      attempt,
      answers: answers || []
    })

  } catch (error) {
    console.error('Error fetching test results:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 