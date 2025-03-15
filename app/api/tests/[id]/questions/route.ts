import { createSupabaseServer } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createSupabaseServer()
  
  const { data: questions, error } = await supabase
    .from('questions')
    .select(`
      *,
      question_options(*)
    `)
    .eq('test_id', id)
    .order('order_number')

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(questions)
} 