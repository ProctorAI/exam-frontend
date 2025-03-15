"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Brain, Heart, Microscope, Activity, Dna } from "lucide-react";

interface Subject {
  name: string;
  progress: number;
  color: string;
}

interface SubjectProgressProps {
  subjects: Subject[];
}


const subjectIcons = {
  "Data Structure and Algorithms": Activity,
  "Operating Systems": Dna,
  "Computer Networks": Brain,
  "Database Management Systems": Heart,
  "Object Oriented Programming": Microscope,
} as const;

export function SubjectProgress({ subjects }: SubjectProgressProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium">
          Subjectwise Strength
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-5">
          {subjects.map((subject) => {
            const Icon = subjectIcons[subject.name as keyof typeof subjectIcons];
            return (
              <div key={subject.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {Icon && (
                      <div 
                        className="p-1.5 rounded-md"
                        style={{ 
                          backgroundColor: `${subject.color}15`,
                          color: subject.color 
                        }}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                    )}
                    <span className="text-sm font-medium">{subject.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div 
                      className="text-sm font-semibold"
                      style={{ color: subject.color }}
                    >
                      {subject.progress}%
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {subject.progress >= 70 ? 'Excellent' : 
                       subject.progress >= 50 ? 'Good' : 
                       subject.progress >= 30 ? 'Fair' : 'Needs Work'}
                    </div>
                  </div>
                </div>
                <div className="relative h-2">
                  <div className="absolute inset-0 rounded-full bg-muted" />
                  <div 
                    className="absolute inset-0 rounded-full transition-all duration-500 ease-out"
                    style={{ 
                      width: `${subject.progress}%`,
                      backgroundColor: subject.color,
                    }} 
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
} 