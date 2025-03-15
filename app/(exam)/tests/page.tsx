"use client";

import { Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ExamCard } from "@/components/exam/exam-card";
import { useRouter } from "next/navigation";

const exams = [
  {
    id: 1,
    title: "Advanced Mathematics Mock Test",
    type: "Pro",
    startDate: "2024-03-20",
    endDate: "2024-03-21",
    duration: "3 hours",
    questionCount: 60,
    enrolledCount: 245,
    status: "Available",
  },
  {
    id: 2,
    title: "Physics Practice Test",
    type: "Free",
    startDate: "2024-03-18",
    endDate: "2024-03-19",
    duration: "2 hours",
    questionCount: 45,
    enrolledCount: 189,
    status: "Completed",
  },
  {
    id: 3,
    title: "Chemistry Final Prep",
    type: "Pro",
    startDate: "2024-03-15",
    endDate: "2024-03-16",
    duration: "2.5 hours",
    questionCount: 50,
    enrolledCount: 156,
    status: "Expired",
  },
] as const;

export default function TestsPage() {
  const router = useRouter();

  const handleStart = (examId: number) => {
    router.push(`/tests/${examId}`);
  };

  const handleViewResult = (examId: number) => {
    router.push(`/tests/${examId}/results`);
  };

  const handleBuy = (examId: number) => {
    console.log('Buying exam:', examId);
  };

  return (
    <div className="flex min-h-screen flex-col gap-8 px-8 py-8">
      <div>
        <h1 className="text-2xl font-semibold">Tests</h1>
        <p className="text-sm text-muted-foreground">
          {exams.length} tests available
        </p>
      </div>

      <div className="flex items-center gap-4 rounded-lg bg-card px-4 py-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search tests..."
            className="pl-9"
          />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="pro">Pro Tests</SelectItem>
            <SelectItem value="free">Free Tests</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="all">
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="available">Available</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {exams.map((exam) => (
          <ExamCard
            key={exam.id}
            {...exam}
            onStart={exam.status === "Available" ? () => handleStart(exam.id) : undefined}
            onBuy={exam.type === "Pro" && exam.status === "Available" ? () => handleBuy(exam.id) : undefined}
            onViewResult={exam.status === "Completed" ? () => handleViewResult(exam.id) : undefined}
          />
        ))}
      </div>
    </div>
  );
} 