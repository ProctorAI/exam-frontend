"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { CheckCircle, XCircle } from "lucide-react"

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

interface TestQuestionProps {
  question: Question
  onAnswer: (answer: string) => void
  selectedAnswer?: string
  isSubmitted?: boolean
}

export function TestQuestion({
  question,
  onAnswer,
  selectedAnswer,
  isSubmitted,
}: TestQuestionProps) {
  return (
    <Card className="border-none shadow-none bg-card/50 backdrop-blur-sm">
      <CardContent className="space-y-6 p-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-lg font-medium leading-relaxed"
        >
          {question.question_text}
        </motion.div>

        <RadioGroup
          value={selectedAnswer}
          onValueChange={onAnswer}
          disabled={isSubmitted}
          className="space-y-3"
        >
          {question.question_options.map((option, index) => (
            <motion.div
              key={option.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <motion.div
                whileHover={!isSubmitted ? { scale: 1.01 } : {}}
                whileTap={!isSubmitted ? { scale: 0.99 } : {}}
                className={cn(
                  "relative flex items-center space-x-3 rounded-lg border p-4 transition-all cursor-pointer",
                  selectedAnswer === option.option_text && !isSubmitted && "border-primary bg-primary/5",
                  isSubmitted && option.is_correct && "border-green-500 bg-green-50 dark:bg-green-900/10",
                  isSubmitted && !option.is_correct && selectedAnswer === option.option_text && "border-red-500 bg-red-50 dark:bg-red-900/10",
                  !isSubmitted && "hover:border-primary/50 hover:bg-accent/50"
                )}
              >
                <RadioGroupItem
                  value={option.option_text}
                  id={option.id}
                  className={cn(
                    "h-4 w-4",
                    isSubmitted && option.is_correct && "text-green-500 border-green-500",
                    isSubmitted && !option.is_correct && selectedAnswer === option.option_text && "text-red-500 border-red-500"
                  )}
                />
                <Label
                  htmlFor={option.id}
                  className={cn(
                    "flex-grow cursor-pointer text-sm",
                    isSubmitted && option.is_correct && "text-green-500 font-medium",
                    isSubmitted && !option.is_correct && selectedAnswer === option.option_text && "text-red-500"
                  )}
                >
                  {option.option_text}
                </Label>
                {isSubmitted && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-4"
                  >
                    {option.is_correct ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      selectedAnswer === option.option_text && (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )
                    )}
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          ))}
        </RadioGroup>

        {isSubmitted && question.explanation && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.3 }}
            className="rounded-lg bg-muted/50 p-4 mt-4 backdrop-blur-sm"
          >
            <p className="text-sm text-muted-foreground leading-relaxed">
              {question.explanation}
            </p>
          </motion.div>
        )}
      </CardContent>
    </Card>
  )
} 