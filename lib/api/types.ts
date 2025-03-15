export type SubjectArea = {
  id: string
  name: string
  description: string | null
  created_at: string
  updated_at: string
}

export type Test = {
  id: string
  title: string
  description: string | null
  subject_area_id: string
  duration_minutes: number
  passing_score: number
  is_pro: boolean
  total_questions: number
  status: 'draft' | 'published' | 'archived'
  start_date: string | null
  end_date: string | null
  created_at: string
  updated_at: string
}

export type Question = {
  id: string
  test_id: string
  question_text: string
  question_type: 'multiple_choice' | 'true_false'
  correct_answer: string
  explanation: string | null
  marks: number
  order_number: number
  created_at: string
  updated_at: string
}

export type QuestionOption = {
  id: string
  question_id: string
  option_text: string
  is_correct: boolean
  order_number: number
  created_at: string
}

export type UserTestAttempt = {
  id: string
  user_id: string
  test_id: string
  start_time: string
  end_time: string | null
  score: number | null
  status: 'in_progress' | 'completed' | 'abandoned'
  created_at: string
  updated_at: string
}

export type UserAnswer = {
  id: string
  attempt_id: string
  question_id: string
  selected_answer: string
  is_correct: boolean | null
  marks_obtained: number
  created_at: string
  updated_at: string
}

export type TestWithAttempts = Test & {
  attempts?: { status: string }[]
} 