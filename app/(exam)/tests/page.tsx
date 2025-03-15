"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
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
import { useApiClient } from "@/lib/api/client";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { TestWithAttempts } from "@/lib/api/types";

export default function TestsPage() {
  const router = useRouter();
  const api = useApiClient();
  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");
  const [status, setStatus] = useState("all");
  const debouncedSearch = useDebounce(search, 300);

  const { data: tests, isLoading } = useQuery<TestWithAttempts[]>({
    queryKey: ["tests", { search: debouncedSearch, type, status }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (debouncedSearch) params.set("search", debouncedSearch);
      if (type !== "all") params.set("type", type);
      if (status !== "all") params.set("status", status);
      
      const response = await fetch(`/api/tests?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch tests");
      return response.json();
    }
  });

  const handleStart = (examId: string) => {
    router.push(`/tests/${examId}`);
  };

  const handleViewResult = (examId: string) => {
    router.push(`/results/${examId}`);
  };

  const handleBuy = (examId: string) => {
    console.log('Buying exam:', examId);
  };

  return (
    <div className="container mx-auto space-y-8 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tests</h1>
          <p className="text-muted-foreground">
            {tests?.length ?? 0} tests available
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4 rounded-lg bg-card p-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search tests..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-4">
          <Select value={type} onValueChange={setType}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="pro">Pro Tests</SelectItem>
              <SelectItem value="free">Free Tests</SelectItem>
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-[140px]">
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
      </div>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="h-[250px] animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tests?.map((test) => {
            const testStatus = test.end_date && new Date(test.end_date) < new Date()
              ? "Expired"
              : test.attempts?.some(a => a.status === "completed")
              ? "Completed"
              : "Available"

            return (
              <ExamCard
                key={test.id}
                id={test.id}
                title={test.title}
                type={test.is_pro ? "Pro" : "Free"}
                startDate={test.start_date ?? "TBA"}
                endDate={test.end_date ?? "TBA"}
                duration={`${test.duration_minutes} minutes`}
                questionCount={test.total_questions}
                enrolledCount={test.attempts?.length ?? 0}
                status={testStatus}
                onStart={testStatus === "Available" ? () => handleStart(test.id) : undefined}
                onBuy={test.is_pro && testStatus === "Available" ? () => handleBuy(test.id) : undefined}
                onViewResult={testStatus === "Completed" ? () => handleViewResult(test.id) : undefined}
              />
            )
          })}
        </div>
      )}
    </div>
  );
} 