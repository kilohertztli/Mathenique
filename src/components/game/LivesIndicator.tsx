import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface LivesIndicatorProps {
  lives: number;
  maxLives?: number;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "w-5 h-5",
  md: "w-7 h-7",
  lg: "w-9 h-9",
};

export function LivesIndicator({ lives, maxLives = 3, size = "md" }: LivesIndicatorProps) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: maxLives }).map((_, index) => (
        <Heart
          key={index}
          className={cn(
            sizeClasses[size],
            "transition-all duration-300",
            index < lives
              ? "fill-life-full text-life-full scale-100"
              : "fill-life-empty text-life-empty scale-90"
          )}
        />
      ))}
    </div>
  );
}
