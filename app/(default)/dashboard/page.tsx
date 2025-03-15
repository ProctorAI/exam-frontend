"use client";

import { WelcomeCard } from "@/components/dashboard/welcome-card";
import { StatsCard } from "@/components/dashboard/stats-card";
import { PerformanceChart } from "@/components/dashboard/performance-chart";
import { SubjectProgress } from "@/components/dashboard/subject-progress";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  Bell, 
  Target, 
  Percent, 
  CheckCircle2, 
  Trophy 
} from "lucide-react";

// Mock data - replace with real API data
const performanceData = [
  { day: "Sun", score: 35, average: 40 },
  { day: "Mon", score: 28, average: 35 },
  { day: "Tue", score: 45, average: 42 },
  { day: "Wed", score: 68, average: 45 },
  { day: "Thu", score: 55, average: 48 },
  { day: "Fri", score: 65, average: 52 },
  { day: "Sat", score: 58, average: 50 },
];

const subjects = [
  { name: "Data Structure and Algorithms", progress: 29, color: "#FFB800" },
  { name: "Operating Systems", progress: 46, color: "#FF4800" },
  { name: "Computer Networks", progress: 68, color: "#FF4800" },
  { name: "Database Management Systems", progress: 87, color: "#00E096" },
  { name: "Object Oriented Programming", progress: 95, color: "#00E096" },
];

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-background/50 p-6 md:p-8 lg:p-10 space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back to your exam preparation hub.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notifications</span>
          </Button>
          <Button size="sm" className="gap-2">
            <span>Take Test</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <WelcomeCard
        userName="Avinash Anish"
        testsToComplete={4}
        progressPercentage={80}
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard 
          label="Overall Score" 
          value={49} 
          unit="points"
          trend={12}
          variant="blue"
          icon={Target}
        />
        <StatsCard 
          label="Accuracy" 
          value={12} 
          unit="%"
          trend={-5}
          variant="green"
          icon={Percent}
        />
        <StatsCard 
          label="Attempted" 
          value={25} 
          unit="tests"
          trend={8}
          variant="purple"
          icon={CheckCircle2}
        />
        <StatsCard 
          label="Percentile" 
          value={16} 
          unit="%"
          trend={3}
          variant="pink"
          icon={Trophy}
        />
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="rounded-xl border bg-card p-6">
          <PerformanceChart data={performanceData} currentScore={68} />
        </div>
        <div className="rounded-xl border bg-card p-6">
          <h3 className="text-lg font-semibold mb-6">Subject Progress</h3>
          <SubjectProgress subjects={subjects} />
        </div>
      </div>
    </div>
  );
} 