"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, Users, HelpCircle, Crown, CalendarClock } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface ExamCardProps {
  id: string;
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
  id,
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

  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), "MMM d, yyyy");
    } catch {
      return "N/A";
    }
  };

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg dark:hover:shadow-primary/5">
      <CardContent className="p-6">
        <div className="relative space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h3 className="text-lg font-medium transition-colors group-hover:text-primary">
                {title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {formatDate(startDate)} - {formatDate(endDate)}
              </p>
            </div>
            {type === "Pro" && (
              <div className="flex items-center gap-1 rounded-full bg-gradient-to-r from-yellow-100 to-amber-100 px-2.5 py-1 text-xs font-medium text-amber-700 dark:from-yellow-900/30 dark:to-amber-900/30 dark:text-amber-400">
                <Crown className="h-3 w-3" />
                Pro
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <div className="rounded-full bg-primary/10 p-1">
                  <Clock className="h-4 w-4 text-primary" />
                </div>
                <span className="text-muted-foreground">{duration}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="rounded-full bg-primary/10 p-1">
                  <HelpCircle className="h-4 w-4 text-primary" />
                </div>
                <span className="text-muted-foreground">{questionCount} Questions</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <div className="rounded-full bg-primary/10 p-1">
                  <Users className="h-4 w-4 text-primary" />
                </div>
                <span className="text-muted-foreground">{enrolledCount} Enrolled</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="rounded-full bg-primary/10 p-1">
                  <CalendarClock className="h-4 w-4 text-primary" />
                </div>
                <div className={cn(
                  "rounded-full px-2 py-0.5 text-xs font-medium",
                  statusColors[status]
                )}>
                  {status}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            {onViewResult && (
              <Button
                variant="outline"
                size="sm"
                onClick={onViewResult}
                className="transition-all hover:bg-primary hover:text-primary-foreground"
              >
                View Result
              </Button>
            )}
            {onBuy && (
              <Button
                variant="outline"
                size="sm"
                onClick={onBuy}
                className="transition-all hover:bg-primary hover:text-primary-foreground"
              >
                Buy Now
              </Button>
            )}
            {onStart && (
              <Button
                size="sm"
                onClick={onStart}
                className="bg-primary text-primary-foreground shadow-lg shadow-primary/30 transition-all hover:bg-primary/90"
              >
                Start Test
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 