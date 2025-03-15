"use client"
import { ResultsChart } from "@/components/results/results-chart"
import { SummaryCard } from "@/components/results/summary-card"
import { QuestionReview } from "@/components/results/question-review"

const mockResults = {
  score: 8,
  totalQuestions: 10,
  timeSpent: 15,
  accuracy: 80,
  questions: [
    {
      id: 1,
      question: "What is the time complexity of binary search?",
      userAnswer: "O(log n)",
      correctAnswer: "O(log n)",
      isCorrect: true,
      timeSpent: 45,
      explanation: "Binary search has logarithmic time complexity as it divides the search space in half with each iteration."
    },
    {
      id: 2,
      question: "Which data structure uses LIFO principle?",
      userAnswer: "Queue",
      correctAnswer: "Stack",
      isCorrect: false,
      timeSpent: 30,
      explanation: "A stack follows Last In First Out (LIFO) principle, while a queue follows First In First Out (FIFO)."
    },
    // Add more mock questions as needed
  ]
}

export default function ResultsPage() {
  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Test Results</h2>
          <p className="text-muted-foreground">
            Your performance analysis and detailed breakdown
          </p>
        </div>
      </div>

      <SummaryCard 
        score={mockResults.score}
        totalQuestions={mockResults.totalQuestions}
        timeSpent={mockResults.timeSpent}
        accuracy={mockResults.accuracy}
      />

      <div className="grid gap-4 md:grid-cols-1">
        <ResultsChart 
          data={mockResults.questions}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-1">
        <QuestionReview 
          questions={mockResults.questions}
        />
      </div>
    </div>
  )
} 