"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { Timer as TimerIcon } from "lucide-react"

interface TimerProps extends React.HTMLAttributes<HTMLDivElement> {
  duration: number // in seconds
  onTimeUp: () => void
}

export function Timer({ duration, onTimeUp, className, ...props }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration)

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp()
      return
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft, onTimeUp])

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60

  const formattedTime = `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`

  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2",
        className
      )}
      {...props}
    >
      <TimerIcon className="h-4 w-4 text-primary" />
      <span className="font-medium text-primary">{formattedTime}</span>
    </div>
  )
} 