import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Clock, Target, Brain, Trophy } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"

const cardVariants = cva(
  "relative overflow-hidden transition-all hover:shadow-md",
  {
    variants: {
      variant: {
        default: "bg-card",
        purple: "bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-900/20 dark:to-purple-900/10 border-purple-100 dark:border-purple-900/20",
        blue: "bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-900/10 border-blue-100 dark:border-blue-900/20",
        green: "bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-900/20 dark:to-green-900/10 border-green-100 dark:border-green-900/20",
        pink: "bg-gradient-to-br from-pink-50 to-pink-100/50 dark:from-pink-900/20 dark:to-pink-900/10 border-pink-100 dark:border-pink-900/20",
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
)

interface SummaryCardProps {
  score: number
  totalQuestions: number
  timeSpent: number
  accuracy: number
}

export function SummaryCard({ score, totalQuestions, timeSpent, accuracy }: SummaryCardProps) {
  const stats = [
    {
      title: "Score",
      value: `${score}/${totalQuestions}`,
      icon: Trophy,
      description: "Questions correct",
      variant: "purple" as const,
      trend: ((score / totalQuestions) * 100) - 70, // Assuming 70% as baseline
    },
    {
      title: "Time Spent",
      value: `${timeSpent}m`,
      icon: Clock,
      description: "Total duration",
      variant: "blue" as const,
      trend: timeSpent > 30 ? -((timeSpent - 30) / 30) * 100 : ((30 - timeSpent) / 30) * 100, // Assuming 30min as baseline
    },
    {
      title: "Accuracy",
      value: `${accuracy}%`,
      icon: Target,
      description: "Success rate",
      variant: "green" as const,
      trend: accuracy - 75, // Assuming 75% as baseline
    },
    {
      title: "Knowledge",
      value: accuracy >= 80 ? "Excellent" : accuracy >= 70 ? "Good" : accuracy >= 60 ? "Fair" : "Needs Work",
      icon: Brain,
      description: "Understanding level",
      variant: "pink" as const,
      trend: accuracy >= 70 ? 5 : -5,
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title} className={cardVariants({ variant: stat.variant })}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <p className="text-2xl font-bold tracking-tight">{stat.value}</p>
              <span className="text-sm text-muted-foreground">{stat.description}</span>
            </div>
            {stat.trend !== undefined && (
              <div className="mt-4 flex items-center gap-1">
                <div className={`flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                  stat.trend > 0 
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                }`}>
                  {stat.trend > 0 ? '↑' : '↓'} {Math.abs(Math.round(stat.trend))}%
                </div>
                <span className="text-xs text-muted-foreground">vs average</span>
              </div>
            )}
            <div className="absolute right-0 top-0 h-24 w-24 translate-x-8 translate-y-[-8px] opacity-[0.05]">
              <stat.icon className="h-full w-full" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
} 