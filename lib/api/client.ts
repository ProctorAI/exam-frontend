import axios from 'axios'
import { Test, Question, UserTestAttempt, UserAnswer } from './types'

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

export const testsApi = {
  getTest: async (id: string) => {
    const { data } = await api.get<Test>(`/tests/${id}`)
    return data
  },

  getTestQuestions: async (testId: string) => {
    const { data } = await api.get<Question[]>(`/tests/${testId}/questions`)
    return data
  },

  startTest: async (testId: string) => {
    const { data } = await api.post<UserTestAttempt>(`/tests/${testId}/start`)
    return data
  },

  submitAnswer: async (attemptId: string, answer: Omit<UserAnswer, 'id' | 'created_at'>) => {
    const { data } = await api.post<UserAnswer>(`/attempts/${attemptId}/answers`, answer)
    return data
  },

  completeTest: async (attemptId: string) => {
    const { data } = await api.post<UserTestAttempt>(`/attempts/${attemptId}/complete`)
    return data
  },

  getTestResults: async (attemptId: string) => {
    const { data } = await api.get<{
      attempt: UserTestAttempt
      answers: (UserAnswer & { question: Question })[]
    }>(`/attempts/${attemptId}/results`)
    return data
  }
}

export const useApiClient = () => {
  return {
    tests: testsApi
  }
} 