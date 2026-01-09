import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const gameButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl font-fredoka font-semibold tracking-wide transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-primary-foreground button-shadow hover:brightness-110 active:translate-y-1 active:shadow-none",
        secondary:
          "bg-secondary text-secondary-foreground button-shadow hover:brightness-110 active:translate-y-1 active:shadow-none",
        success:
          "bg-success text-success-foreground button-shadow hover:brightness-110 active:translate-y-1 active:shadow-none",
        warning:
          "bg-warning text-warning-foreground button-shadow hover:brightness-110 active:translate-y-1 active:shadow-none",
        destructive:
          "bg-destructive text-destructive-foreground button-shadow hover:brightness-110 active:translate-y-1 active:shadow-none",
        outline:
          "border-2 border-primary bg-transparent text-primary hover:bg-primary hover:text-primary-foreground",
        ghost:
          "hover:bg-primary/10 text-primary",
        gold:
          "gradient-gold text-foreground button-shadow hover:brightness-110 active:translate-y-1 active:shadow-none",
      },
      size: {
        sm: "h-9 px-4 text-sm",
        md: "h-11 px-6 text-base",
        lg: "h-14 px-8 text-lg",
        xl: "h-16 px-10 text-xl",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface GameButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof gameButtonVariants> {}

const GameButton = React.forwardRef<HTMLButtonElement, GameButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(gameButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
GameButton.displayName = "GameButton";

export { GameButton, gameButtonVariants };
