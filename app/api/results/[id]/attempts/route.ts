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

    // First get the test details
    const { data: test, error: testError } = await supabase
      .from('tests')
      .select('id, title, description, total_questions, passing_score')
      .eq('id', id)
      .single()

    if (testError || !test) {
      return NextResponse.json(
        { error: 'Test not found' },
        { status: 404 }
      )
    }

    // Then get all attempts for this test by the current user
    const { data: attempts, error: attemptsError } = await supabase
      .from('user_test_attempts')
      .select('id, start_time, end_time, score, status')
      .eq('test_id', id)
      .eq('user_id', session.user.id)
      .order('start_time', { ascending: false })

    if (attemptsError) {
      return NextResponse.json(
        { error: 'Failed to fetch attempts' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      test,
      attempts: attempts || []
    })

  } catch (error) {
    console.error('Error fetching test attempts:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 