type IconName = "brain" | "clock" | "target" | "trophy"

interface StatItem {
  title: string
  value: string | number
  description: string
  icon: IconName
  trend?: {
    value: number
    isPositive: boolean
  }
}

export const testStats: StatItem[] = [
  {
    title: "Average Score",
    value: "82%",
    description: "Across all subjects",
    icon: "trophy",
    trend: {
      value: 12,
      isPositive: true
    }
  },
  {
    title: "Tests Completed",
    value: 24,
    description: "In the last 30 days",
    icon: "target",
    trend: {
      value: 8,
      isPositive: true
    }
  },
  {
    title: "Study Time",
    value: "45h",
    description: "Total time spent",
    icon: "clock",
    trend: {
      value: 5,
      isPositive: true
    }
  },
  {
    title: "Topics Mastered",
    value: 18,
    description: "Out of 25 topics",
    icon: "brain",
    trend: {
      value: 3,
      isPositive: true
    }
  }
] 