"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Bar, BarChart } from "recharts"
import { TrendingUp, TrendingDown, Clock } from "lucide-react"

interface ResultsChartProps {
  data: {
    question: string
    timeSpent: number
    isCorrect: boolean
  }[]
}

export function ResultsChart({ data }: ResultsChartProps) {
  const chartData = data.map((item, index) => ({
    question: `Q${index + 1}`,
    timeSpent: item.timeSpent,
    average: 40, // Mock average time per question
    status: item.isCorrect ? "Correct" : "Incorrect"
  }))

  // Calculate trend
  const averageTime = Math.round(data.reduce((acc, curr) => acc + curr.timeSpent, 0) / data.length)
  const lastQuestionTime = data[data.length - 1]?.timeSpent || 0
  const timeChange = ((lastQuestionTime - averageTime) / averageTime) * 100
  const isImproving = timeChange <= 0 // Less time is better

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-base font-medium">Time Analysis</CardTitle>
          <p className="text-sm text-muted-foreground">Time spent per question</p>
        </div>
        <div className={`flex items-center gap-2 rounded-lg px-2.5 py-1 text-sm ${
          isImproving 
            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
            : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
        }`}>
          {isImproving ? (
            <TrendingDown className="h-4 w-4" />
          ) : (
            <TrendingUp className="h-4 w-4" />
          )}
          <span className="font-medium">{Math.abs(timeChange).toFixed(1)}%</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-6 flex items-center justify-end gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-blue-500" />
            <span>Time spent</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-slate-300 dark:bg-slate-600" />
            <span>Average time</span>
          </div>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <defs>
                <linearGradient id="timeSpentGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis
                dataKey="question"
                stroke="#94a3b8"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#94a3b8"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}s`}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload || !payload.length) return null;
                  
                  const timeSpent = payload.find(p => p.dataKey === 'timeSpent');
                  const average = payload.find(p => p.dataKey === 'average');
                  const status = timeSpent?.payload?.status;

                  if (!timeSpent || !average) return null;

                  return (
                    <div className="rounded-lg border bg-white p-2 shadow-sm dark:bg-slate-800">
                      <div className="grid gap-2">
                        <div className="flex items-center gap-1">
                          <div className="h-2 w-2 rounded-full bg-blue-500" />
                          <span className="text-sm font-medium">Time:</span>
                          <span className="text-sm">{timeSpent.value}s</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="h-2 w-2 rounded-full bg-slate-300 dark:bg-slate-600" />
                          <span className="text-sm font-medium">Avg:</span>
                          <span className="text-sm">{average.value}s</span>
                        </div>
                        {status && (
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              Status: {status}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                }}
              />
              <Bar
                dataKey="timeSpent"
                fill="url(#timeSpentGradient)"
                stroke="#3B82F6"
                strokeWidth={2}
                radius={[4, 4, 0, 0]}
                barSize={30}
              />
              <Line
                type="monotone"
                dataKey="average"
                stroke="#94a3b8"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                dot={false}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
} 