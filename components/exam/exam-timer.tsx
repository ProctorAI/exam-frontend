"use client";

import { useEffect, useState } from "react";
import { Timer } from "lucide-react";

interface ExamTimerProps {
  durationInSeconds: number;
  onTimeUp?: () => void;
}

export function ExamTimer({ durationInSeconds, onTimeUp }: ExamTimerProps) {
  const [timeLeft, setTimeLeft] = useState(durationInSeconds);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp?.();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onTimeUp]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex items-center gap-2 text-sm font-medium">
      <Timer className="h-4 w-4" />
      <span>{formatTime(timeLeft)}</span>
    </div>
  );
} 