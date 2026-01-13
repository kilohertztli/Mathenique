import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface GameModeCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  variant: "normal" | "mixed" | "challenge" | "apocalypse";
  onClick: () => void;
}

const variantStyles = {
  normal: {
    bg: "bg-primary",
    iconBg: "bg-primary-foreground/20",
    text: "text-primary-foreground",
  },
  mixed: {
    bg: "bg-primary",
    iconBg: "bg-primary-foreground/20",
    text: "text-primary-foreground",
  },
  challenge: {
    bg: "bg-warning",
    iconBg: "bg-warning-foreground/20",
    text: "text-warning-foreground",
  },
  apocalypse: {
    bg: "bg-warning",
    iconBg: "bg-warning-foreground/20",
    text: "text-warning-foreground",
  },
};

export function GameModeCard({ title, description, icon: Icon, variant, onClick }: GameModeCardProps) {
  const styles = variantStyles[variant];

  return (
    <button
      onClick={onClick}
      className={cn(
        "relative w-full p-6 rounded-2xl transition-all duration-300",
        "hover:scale-105 hover:brightness-110 active:scale-100",
        styles.bg,
        styles.text
      )}
    >
      <div className="flex flex-col items-center text-center gap-4">
        <div className={cn("w-16 h-16 rounded-full flex items-center justify-center", styles.iconBg)}>
          <Icon className="w-8 h-8" />
        </div>
        <div>
          <h3 className="text-xl font-fredoka font-bold mb-2">{title}</h3>
          <p className="text-sm opacity-90">{description}</p>
        </div>
      </div>
    </button>
  );
}
