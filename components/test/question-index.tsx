"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface QuestionIndexProps {
  totalQuestions: number
  currentQuestion: number
  answeredQuestions: string[]
  onQuestionSelect: (index: number) => void
}

export function QuestionIndex({
  totalQuestions,
  currentQuestion,
  answeredQuestions,
  onQuestionSelect,
}: QuestionIndexProps) {
  return (
    <div className="w-[280px] p-6 sticky top-0">
      <motion.div 
        className="space-y-6"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h3 className="text-lg font-semibold mb-3">Index of Questions</h3>
          <div className="flex items-center gap-4 text-sm bg-muted/50 rounded-lg p-2">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-primary/20" />
              <span className="text-xs text-muted-foreground">Answered</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-primary" />
              <span className="text-xs text-muted-foreground">Current</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-1.5">
          {Array.from({ length: totalQuestions }).map((_, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onQuestionSelect(index)}
              className={cn(
                "w-8 h-8 flex items-center justify-center rounded-md border text-xs font-medium transition-all",
                currentQuestion === index && "bg-primary text-primary-foreground border-primary shadow-md",
                answeredQuestions.includes(index.toString()) && currentQuestion !== index && "bg-primary/10 border-primary/20 text-primary",
                !answeredQuestions.includes(index.toString()) && currentQuestion !== index && "hover:border-primary/50 hover:bg-muted/50"
              )}
            >
              {index + 1}
            </motion.button>
          ))}
        </div>

        <div className="space-y-2 bg-muted/50 rounded-lg p-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Attempted</span>
            <motion.span 
              key={answeredQuestions.length}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="font-medium"
            >
              {answeredQuestions.length}/{totalQuestions}
            </motion.span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Remaining</span>
            <motion.span
              key={totalQuestions - answeredQuestions.length}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="font-medium"
            >
              {totalQuestions - answeredQuestions.length}
            </motion.span>
          </div>
        </div>
      </motion.div>
    </div>
  )
} 