import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface TimerProps {
  seconds: number;
  isRunning: boolean;
  onTimeUp: () => void;
  className?: string;
}

export function Timer({ seconds, isRunning, onTimeUp, className }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(seconds);

  useEffect(() => {
    setTimeLeft(seconds);
  }, [seconds]);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);

  useEffect(() => {
    if (timeLeft === 0 && isRunning) {
      onTimeUp();
    }
  }, [timeLeft, isRunning, onTimeUp]);

  const percentage = (timeLeft / seconds) * 100;
  const isLow = percentage <= 30;

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <Clock className={cn("w-6 h-6", isLow ? "text-destructive" : "text-primary")} />
      <div className="flex-1 h-4 bg-muted rounded-full overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-1000 ease-linear",
            isLow ? "bg-destructive" : "bg-primary"
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span
        className={cn(
          "font-fredoka font-bold text-xl min-w-12 text-right",
          isLow && "text-destructive"
        )}
      >
        {timeLeft}s
      </span>
    </div>
  );
}
