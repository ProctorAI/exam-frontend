"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useMutation } from "@tanstack/react-query"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react"
import useUser from "@/hooks/use-user"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { TestHeader } from "@/components/test/test-header"
import { TestQuestion } from "@/components/test/test-question"
import { QuestionIndex } from "@/components/test/question-index"

interface QuestionOption {
  id: string
  option_text: string
  is_correct: boolean
}

interface Question {
  id: string
  question_text: string
  explanation: string | null
  question_options: QuestionOption[]
}

interface Test {
  id: string
  title: string
  description: string | null
  duration_minutes: number
  questions: Question[]
  start_date: string | null
  end_date: string | null
  subject_area: {
    id: string
    name: string
  }
}

interface TestContentProps {
  test: Test
}

export function TestContent({ test }: TestContentProps) {
  const router = useRouter()
  const { toast } = useToast()
  const { data: user } = useUser()
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [attemptId, setAttemptId] = useState<string | null>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const startTestMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/tests/${test.id}/start`, {
        method: "POST",
      })
      if (!response.ok) throw new Error("Failed to start test")
      const data = await response.json()
      return data.id
    },
    onSuccess: (attemptId) => {
      setAttemptId(attemptId)
      toast({
        title: "Test started",
        description: "Good luck!",
      })
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to start test. Please try again.",
        variant: "destructive",
      })
    },
  })

  const submitAnswerMutation = useMutation({
    mutationFn: async (answer: { questionId: string; answer: string }) => {
      if (!attemptId) throw new Error("No attempt ID")
      const response = await fetch(`/api/attempts/${attemptId}/answers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question_id: answer.questionId,
          selected_answer: answer.answer,
        }),
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to submit answer")
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit answer",
        variant: "destructive",
      })
    },
  })

  const completeTestMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/attempts/${attemptId}/complete`, {
        method: 'POST',
      })
      if (!response.ok) {
        throw new Error('Failed to complete test')
      }
      return response.json()
    },
    onSuccess: () => {
      // Redirect to the new results route with both test ID and attempt ID
      router.push(`/results/${test.id}/${attemptId}`)
    },
  })

  const handleAnswer = async (answer: string) => {
    const currentQuestion = test.questions[currentQuestionIndex]
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: answer }))
    await submitAnswerMutation.mutateAsync({
      questionId: currentQuestion.id,
      answer,
    })
  }

  const handleNext = () => {
    if (currentQuestionIndex < test.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1)
    }
  }

  const handleComplete = async () => {
    await completeTestMutation.mutateAsync()
  }

  const handleTimeUp = () => {
    completeTestMutation.mutate()
  }

  if (!attemptId) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="min-h-[80vh] flex items-center justify-center"
      >
        <Card className="w-full max-w-xl p-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold tracking-tight">{test.title}</h1>
              {test.description && (
                <p className="text-muted-foreground text-lg">{test.description}</p>
              )}
            </div>
            
            <div className="bg-muted/50 rounded-lg p-6 space-y-4">
              <div className="flex items-center justify-between text-sm border-b pb-3">
                <span className="text-muted-foreground font-medium">Total Questions</span>
                <motion.span 
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="font-semibold text-lg"
                >
                  {test.questions.length}
                </motion.span>
              </div>
              <div className="flex items-center justify-between text-sm border-b pb-3">
                <span className="text-muted-foreground font-medium">Duration</span>
                <motion.span 
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4 }}
                  className="font-semibold text-lg"
                >
                  {test.duration_minutes} minutes
                </motion.span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground font-medium">Subject Area</span>
                <motion.span 
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5 }}
                  className="font-semibold text-lg"
                >
                  {test.subject_area.name}
                </motion.span>
              </div>
            </div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="pt-4"
            >
              <Button 
                onClick={() => startTestMutation.mutate()}
                disabled={startTestMutation.isPending}
                className="w-full py-5 text-base font-medium bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg"
              >
                {startTestMutation.isPending ? (
                  <span className="flex items-center gap-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                    />
                    Starting...
                  </span>
                ) : (
                  "Start Test"
                )}
              </Button>
            </motion.div>
          </motion.div>
        </Card>
      </motion.div>
    )
  }

  return (
    <div className="flex flex-col h-[calc(100vh-1px)]">
      <TestHeader
        studentName={user?.user_metadata?.full_name || "Student"}
        studentId={`Attempted: ${Object.keys(answers).length}/${test.questions.length}`}
        duration={test.duration_minutes * 60}
        onTimeUp={handleTimeUp}
      />

      <div className="flex flex-1 overflow-hidden">
        <motion.main 
          className="flex-1 px-8 py-6 overflow-y-auto bg-gradient-to-b from-background to-muted/20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
              <motion.h2 
                className="text-xl font-semibold tracking-tight"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Question {currentQuestionIndex + 1} of {test.questions.length}
              </motion.h2>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium"
              >
                {test.subject_area.name}
              </motion.div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestionIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <TestQuestion
                  question={test.questions[currentQuestionIndex]}
                  onAnswer={handleAnswer}
                  selectedAnswer={answers[test.questions[currentQuestionIndex].id]}
                  isSubmitted={isSubmitted}
                />
              </motion.div>
            </AnimatePresence>

            <motion.div 
              className="flex justify-between items-center pt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentQuestionIndex === 0}
                  className="px-4 py-2 text-sm"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                {currentQuestionIndex === test.questions.length - 1 ? (
                  <Button
                    onClick={handleComplete}
                    disabled={Object.keys(answers).length !== test.questions.length || isSubmitted}
                    className="px-4 py-2 text-sm bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Complete Test
                  </Button>
                ) : (
                  <Button
                    onClick={handleNext}
                    disabled={!answers[test.questions[currentQuestionIndex].id]}
                    className="px-4 py-2 text-sm"
                  >
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </motion.div>
            </motion.div>
          </div>
        </motion.main>

        <div className="border-l w-[280px] bg-muted/10">
          <QuestionIndex
            totalQuestions={test.questions.length}
            currentQuestion={currentQuestionIndex}
            answeredQuestions={Object.keys(answers)}
            onQuestionSelect={setCurrentQuestionIndex}
          />
        </div>
      </div>
    </div>
  )
} 