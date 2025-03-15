"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, Users, HelpCircle, Crown } from "lucide-react";
import { cn } from "@/lib/utils";

interface ExamCardProps {
  title: string;
  type: "Pro" | "Free";
  startDate: string;
  endDate: string;
  duration: string;
  questionCount: number;
  enrolledCount: number;
  status: "Available" | "Expired" | "Completed";
  onStart?: () => void;
  onBuy?: () => void;
  onViewResult?: () => void;
}

export function ExamCard({
  title,
  type,
  startDate,
  endDate,
  duration,
  questionCount,
  enrolledCount,
  status,
  onStart,
  onBuy,
  onViewResult,
}: ExamCardProps) {
  const statusColors = {
    Available: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    Expired: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    Completed: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <CardContent className="p-6">
        <div className="relative space-y-4">
          <div className="flex items-start justify-between">
            <h3 className="text-lg font-medium">{title}</h3>
            {type === "Pro" && (
              <div className="flex items-center gap-1 rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
                <Crown className="h-3 w-3" />
                Pro
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{startDate}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{duration}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <HelpCircle className="h-4 w-4" />
              <span>{questionCount} Questions</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>{enrolledCount} Enrolled</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4">
            <div className={cn(
              "rounded-full px-2.5 py-0.5 text-xs font-medium",
              statusColors[status]
            )}>
              {status}
            </div>
            <div className="flex items-center gap-2">
              {onViewResult && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onViewResult}
                >
                  View Result
                </Button>
              )}
              {onBuy && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onBuy}
                >
                  Buy Now
                </Button>
              )}
              {onStart && (
                <Button
                  size="sm"
                  onClick={onStart}
                >
                  Start Test
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 