import { useState } from "react";
import { cn } from "@/lib/utils";
import { GameButton } from "@/components/ui/GameButton";
import { Check, X } from "lucide-react";

export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface QuestionCardProps {
  question: Question;
  onAnswer: (isCorrect: boolean) => void;
  disabled?: boolean;
}

export function QuestionCard({ question, onAnswer, disabled }: QuestionCardProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleSelect = (index: number) => {
    if (showResult || disabled) return;
    setSelectedAnswer(index);
  };

  const handleSubmit = () => {
    if (selectedAnswer === null || disabled) return;
    setShowResult(true);
    const isCorrect = selectedAnswer === question.correctAnswer;
    
    setTimeout(() => {
      onAnswer(isCorrect);
      setSelectedAnswer(null);
      setShowResult(false);
    }, 1500);
  };

  return (
    <div className="game-card p-6 md:p-8 max-w-2xl mx-auto">
      {/* Question */}
      <h2 className="text-2xl md:text-3xl font-fredoka font-bold text-center mb-8">
        {question.question}
      </h2>

      {/* Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {question.options.map((option, index) => {
          const isSelected = selectedAnswer === index;
          const isCorrect = index === question.correctAnswer;
          const showCorrect = showResult && isCorrect;
          const showWrong = showResult && isSelected && !isCorrect;

          return (
            <button
              key={index}
              onClick={() => handleSelect(index)}
              disabled={showResult || disabled}
              className={cn(
                "relative p-4 md:p-5 rounded-xl border-2 text-lg font-semibold transition-all duration-300",
                "hover:scale-102 active:scale-98",
                !showResult && !isSelected && "bg-card border-primary/20 hover:border-primary/50",
                !showResult && isSelected && "bg-primary/10 border-primary",
                showCorrect && "bg-success/20 border-success",
                showWrong && "bg-destructive/20 border-destructive shake"
              )}
            >
              <span className="flex items-center justify-center gap-2">
                {option}
                {showCorrect && (
                  <Check className="w-6 h-6 text-success bounce-in" strokeWidth={3} />
                )}
                {showWrong && (
                  <X className="w-6 h-6 text-destructive bounce-in" strokeWidth={3} />
                )}
              </span>
            </button>
          );
        })}
      </div>

      {/* Submit Button */}
      <div className="flex justify-center">
        <GameButton
          variant="primary"
          size="lg"
          onClick={handleSubmit}
          disabled={selectedAnswer === null || showResult || disabled}
        >
          Check Answer
        </GameButton>
      </div>
    </div>
  );
}
