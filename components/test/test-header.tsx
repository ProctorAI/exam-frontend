"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft } from "lucide-react"
import { Timer } from "./timer"

interface TestHeaderProps {
  studentName: string
  studentId: string
  duration: number
  onTimeUp: () => void
}

export function TestHeader({ studentName, studentId, duration, onTimeUp }: TestHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between px-6 py-3 border-b bg-white dark:bg-gray-950"
    >
      <div className="flex items-center space-x-4">
        <Link 
          href="/tests" 
          className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Tests
        </Link>
      </div>

      <div className="flex items-center space-x-6">
        <Timer
          duration={duration}
          onTimeUp={onTimeUp}
          className="text-base font-medium"
        />
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">{studentName}</span>
          <span className="text-xs text-muted-foreground">
            {studentId}
          </span>
        </div>
      </div>
    </motion.div>
  )
} 