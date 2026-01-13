import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { GameButton } from "@/components/ui/GameButton";
import { DraftingCompass, Swords, BookOpen, Flag } from "lucide-react";

export default function Index() {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && user) {
      navigate("/lessons");
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">
          <DraftingCompass className="w-16 h-16 text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <div className="flex-1 flex items-center justify-center p-4">
        {/* Background decorations */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 text-8xl font-fredoka opacity-10 text-primary">+</div>
          <div className="absolute top-32 right-16 text-7xl font-fredoka opacity-10 text-primary">×</div>
          <div className="absolute bottom-32 left-16 text-7xl font-fredoka opacity-10 text-primary">÷</div>
          <div className="absolute bottom-20 right-10 text-8xl font-fredoka opacity-10 text-primary">−</div>
          <div className="absolute top-1/2 left-8 text-5xl font-fredoka opacity-10 text-primary">π</div>
          <div className="absolute top-1/4 right-1/4 text-5xl font-fredoka opacity-10 text-primary">∑</div>
        </div>

        <div className="max-w-2xl mx-auto text-center relative z-10">
          {/* Animated Logo */}
          <div className="inline-flex items-center justify-center w-24 h-24 md:w-32 md:h-32 rounded-3xl gradient-primary mb-8 float elevated-shadow">
            <DraftingCompass className="w-12 h-12 md:w-16 md:h-16 text-primary-foreground" />
          </div>

          {/* Title */}
          <h1 className="text-5xl md:text-7xl font-fredoka font-bold text-foreground mb-4">
            Mathenique
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 flex items-center justify-center gap-2">
            Be skillful. Be Mathenique.
          </p>

          {/* Features */}
          <div className="grid grid-cols-3 gap-4 mb-10 max-w-md mx-auto">
            <div className="game-card p-4 text-center">
              <Flag className="w-8 h-8 text-primary mx-auto mb-2" />
              <span className="text-sm font-semibold">Adventure</span>
            </div>
            <div className="game-card p-4 text-center">
              <Swords className="w-8 h-8 text-primary mx-auto mb-2" />
              <span className="text-sm font-semibold">Arena</span>
            </div>
            <div className="game-card p-4 text-center">
              <BookOpen className="w-8 h-8 text-primary mx-auto mb-2" />
              <span className="text-sm font-semibold">Progress</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <GameButton
              variant="primary"
              size="xl"
              onClick={() => navigate("/auth")}
              className="min-w-48"
            >
              Start Your Adventure!
            </GameButton>
          </div>

          {/* Sub text */}
          <p className="mt-6 text-muted-foreground">
            
          </p>
        </div>
      </div>
    </div>
  );
}
