"use client";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface ExamQuestionProps {
  questionNumber: number;
  question: string;
  options: {
    id: string;
    text: string;
  }[];
  selectedOption?: string;
  onOptionSelect: (value: string) => void;
}

export function ExamQuestion({
  questionNumber,
  question,
  options,
  selectedOption,
  onOptionSelect,
}: ExamQuestionProps) {
  return (
    <div className="space-y-6 rounded-lg border bg-card p-6">
      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <span className="flex h-6 w-6 items-center justify-center rounded bg-primary/10 text-sm font-medium text-primary">
            {questionNumber}
          </span>
          <h2 className="text-base font-medium leading-6">{question}</h2>
        </div>
      </div>

      <RadioGroup
        value={selectedOption}
        onValueChange={onOptionSelect}
        className="space-y-3"
      >
        {options.map((option) => (
          <div
            key={option.id}
            className={cn(
              "flex items-center space-x-3 rounded-lg border p-4 transition-all hover:bg-accent",
              selectedOption === option.id && "border-primary bg-accent"
            )}
          >
            <RadioGroupItem value={option.id} id={option.id} />
            <Label
              htmlFor={option.id}
              className="flex-1 cursor-pointer text-sm font-normal"
            >
              {option.text}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
} 