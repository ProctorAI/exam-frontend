import { NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    const supabase = await createSupabaseServer()

    // Get all attempts for the user with test details
    const { data: attempts, error: attemptsError } = await supabase
      .from('user_test_attempts')
      .select(`
        id,
        start_time,
        end_time,
        score,
        status,
        test:tests (
          id,
          title,
          description,
          total_questions,
          passing_score,
          duration_minutes
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (attemptsError) {
      return NextResponse.json(
        { error: 'Failed to fetch attempts' },
        { status: 500 }
      )
    }

    return NextResponse.json({ attempts: attempts || [] })

  } catch (error) {
    console.error('Error fetching test results:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
