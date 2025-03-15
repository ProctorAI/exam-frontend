import { createSupabaseServer } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const supabase = await createSupabaseServer()
  const { searchParams } = new URL(request.url)
  
  const search = searchParams.get('search')
  const type = searchParams.get('type')
  const status = searchParams.get('status')

  let query = supabase
    .from('tests')
    .select(`
      *,
      subject_area:subject_areas(name),
      attempts:user_test_attempts(status)
    `)

  if (search) {
    query = query.ilike('title', `%${search}%`)
  }

  if (type === 'pro') {
    query = query.eq('is_pro', true)
  } else if (type === 'free') {
    query = query.eq('is_pro', false)
  }

  if (status === 'available') {
    const now = new Date().toISOString()
    query = query.gte('end_date', now)
  } else if (status === 'expired') {
    const now = new Date().toISOString()
    query = query.lt('end_date', now)
  }

  const { data: tests, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(tests)
} 