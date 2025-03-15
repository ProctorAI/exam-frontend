interface TestRecommendation {
  id: number
  title: string
  subject: string
  difficulty: "Easy" | "Medium" | "Hard"
  estimatedTime: string
  topics: string[]
}

export const testRecommendations: TestRecommendation[] = [
  {
    id: 1,
    title: "Data Structures Practice Test",
    subject: "DSA",
    difficulty: "Medium",
    estimatedTime: "45 min",
    topics: ["Binary Trees", "Graphs", "Dynamic Programming"]
  },
  {
    id: 2,
    title: "Network Protocols Quiz",
    subject: "Computer Networks",
    difficulty: "Easy",
    estimatedTime: "30 min",
    topics: ["TCP/IP", "HTTP", "DNS"]
  },
  {
    id: 3,
    title: "Advanced OS Concepts",
    subject: "Operating Systems",
    difficulty: "Hard",
    estimatedTime: "60 min",
    topics: ["Process Scheduling", "Memory Management", "File Systems"]
  }
] 