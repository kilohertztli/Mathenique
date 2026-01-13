import { Lock, Star, Check, Play } from "lucide-react";
import { cn } from "@/lib/utils";

export interface LessonNodeProps {
  id: number;
  title: string;
  isLocked: boolean;
  isCompleted: boolean;
  isCurrent: boolean;
  isPerfect: boolean;
  stars?: number;
  onClick?: () => void;
}

export function LessonNode({
  title,
  isLocked,
  isCompleted,
  isCurrent,
  isPerfect,
  stars = 0,
  onClick,
}: LessonNodeProps) {
  return (
    <button
      onClick={onClick}
      disabled={isLocked}
      className={cn(
        "relative flex flex-col items-center transition-all duration-300",
        isCurrent && "scale-110"
      )}
    >

      {/* Node Circle */}
      <div
        className={cn(
          "w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center border-4 transition-all duration-300",
          isLocked && "bg-locked border-muted",
          isCompleted && "bg-primary border-primary/50",
          isPerfect && "bg-warning border-warning/50",
          isCurrent && !isCompleted && "bg-primary border-primary/50 pulse-glow",
          !isLocked && !isCompleted && !isCurrent && "bg-card border-primary/30"
        )}
      >
        {isLocked ? (
          <Lock className="w-6 h-6 md:w-8 md:h-8 text-muted-foreground" />
        ) : isCompleted ? (
          <Check className="w-6 h-6 md:w-8 md:h-8 text-success-foreground" strokeWidth={3} />
        ) : (
          <Play className="w-6 h-6 md:w-8 md:h-8 text-primary-foreground fill-primary-foreground" />
        )}
      </div>

      {/* Stars for completed lessons */}
      {isCompleted && (
        <div className="flex gap-0.5 mt-2">
          {[1, 2, 3].map((star) => (
            <Star
              key={star}
              className={cn(
                "w-4 h-4",
                star <= stars
                  ? "fill-gold text-gold"
                  : "fill-muted text-muted"
              )}
            />
          ))}
        </div>
      )}

      {/* Title */}
      <span
        className={cn(
          "mt-2 text-sm md:text-base font-semibold text-center max-w-24",
          isLocked && "text-muted-foreground"
        )}
      >
        {title}
      </span>
    </button>
  );
}
