import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/layout/Navigation";
import { LessonNode } from "@/components/game/LessonNode";
import { QuestionCard, Question } from "@/components/game/QuestionCard";
import { LivesIndicator } from "@/components/game/LivesIndicator";
import { ProgressBar } from "@/components/game/ProgressBar";
import { GameButton } from "@/components/ui/GameButton";
import { useGame } from "@/contexts/GameContext";
import { lessons } from "@/data/lessons";
import { ArrowLeft, Trophy, Star, X } from "lucide-react";
import { toast } from "sonner";

export default function Lessons() {
  const navigate = useNavigate();
  const { currentLesson, completedLessons, updateLessonProgress, incrementStat } = useGame();
  
  const [activeLesson, setActiveLesson] = useState<number | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [lives, setLives] = useState(3);
  const [correctCount, setCorrectCount] = useState(0);
  const [gameState, setGameState] = useState<"idle" | "playing" | "won" | "lost">("idle");

  const activeLessonData = activeLesson ? lessons.find((l) => l.id === activeLesson) : null;
  const currentQuestion = activeLessonData?.questions[currentQuestionIndex];

  const startLesson = (lessonId: number) => {
    const lesson = lessons.find((l) => l.id === lessonId);
    if (!lesson) return;
    
    setActiveLesson(lessonId);
    setCurrentQuestionIndex(0);
    setLives(3);
    setCorrectCount(0);
    setGameState("playing");
  };

  const handleAnswer = (isCorrect: boolean) => {
    incrementStat("totalQuestions");
    
    if (isCorrect) {
      incrementStat("correctAnswers");
      setCorrectCount((prev) => prev + 1);
      toast.success("Correct! 🎉");
    } else {
      const newLives = lives - 1;
      setLives(newLives);
      toast.error("Oops! Try again 💪");
      
      if (newLives === 0) {
        setGameState("lost");
        return;
      }
    }

    // Move to next question or finish
    if (currentQuestionIndex < (activeLessonData?.questions.length || 0) - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      // Lesson complete!
      const stars = lives === 3 ? 3 : lives === 2 ? 2 : 1;
      updateLessonProgress(activeLesson!, stars);
      incrementStat("lessonsCompleted");
      setGameState("won");
    }
  };

  const exitLesson = () => {
    setActiveLesson(null);
    setGameState("idle");
  };

  const retryLesson = () => {
    if (activeLesson) {
      startLesson(activeLesson);
    }
  };

  // Playing state
  if (gameState === "playing" && activeLessonData && currentQuestion) {
    const progress = ((currentQuestionIndex + 1) / activeLessonData.questions.length) * 100;

    return (
      <div className="min-h-screen pb-20 md:pt-24">
        <div className="container mx-auto px-4 py-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={exitLesson}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-semibold">Exit</span>
            </button>
            <LivesIndicator lives={lives} size="lg" />
          </div>

          {/* Progress */}
          <div className="mb-8">
            <div className="flex justify-between text-sm font-semibold mb-2">
              <span>{activeLessonData.title}</span>
              <span>
                Question {currentQuestionIndex + 1} of {activeLessonData.questions.length}
              </span>
            </div>
            <ProgressBar value={progress} variant="primary" size="lg" />
          </div>

          {/* Question */}
          <QuestionCard question={currentQuestion} onAnswer={handleAnswer} />
        </div>
        <Navigation />
      </div>
    );
  }

  // Won state
  if (gameState === "won") {
    const stars = lives === 3 ? 3 : lives === 2 ? 2 : 1;
    
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="game-card p-8 max-w-md text-center bounce-in">
          <div className="w-20 h-20 rounded-full gradient-gold flex items-center justify-center mx-auto mb-6">
            <Trophy className="w-10 h-10 text-foreground" />
          </div>
          <h2 className="text-3xl font-fredoka font-bold mb-4">Lesson Complete!</h2>
          
          <div className="flex justify-center gap-2 mb-6">
            {[1, 2, 3].map((star) => (
              <Star
                key={star}
                className={`w-10 h-10 ${
                  star <= stars ? "fill-gold text-gold" : "fill-muted text-muted"
                }`}
              />
            ))}
          </div>
          
          <p className="text-muted-foreground mb-8">
            You got {correctCount} out of {activeLessonData?.questions.length} correct!
          </p>
          
          <div className="flex flex-col gap-3">
            <GameButton variant="primary" size="lg" onClick={exitLesson}>
              Continue
            </GameButton>
            <GameButton variant="outline" size="lg" onClick={retryLesson}>
              Try Again for 3 Stars
            </GameButton>
          </div>
        </div>
      </div>
    );
  }

  // Lost state
  if (gameState === "lost") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="game-card p-8 max-w-md text-center shake">
          <div className="w-20 h-20 rounded-full bg-destructive/20 flex items-center justify-center mx-auto mb-6">
            <X className="w-10 h-10 text-destructive" />
          </div>
          <h2 className="text-3xl font-fredoka font-bold mb-4">Out of Lives!</h2>
          <p className="text-muted-foreground mb-8">
            Don't worry! Practice makes perfect. Try again!
          </p>
          
          <div className="flex flex-col gap-3">
            <GameButton variant="primary" size="lg" onClick={retryLesson}>
              Try Again
            </GameButton>
            <GameButton variant="outline" size="lg" onClick={exitLesson}>
              Back to Lessons
            </GameButton>
          </div>
        </div>
      </div>
    );
  }

  // Idle state - Lesson map
  return (
    <div className="min-h-screen pb-24 md:pt-24">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-fredoka font-bold mb-2">Adventure Mode</h1>
          <p className="text-muted-foreground">Complete lessons to unlock new challenges!</p>
        </div>

        {/* Lesson Path */}
        <div className="max-w-lg mx-auto">
          <div className="relative">
            {/* Connection Line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-primary/20 -translate-x-1/2 z-0" />
            
            {/* Lesson Nodes */}
            <div className="relative z-10 space-y-8">
              {lessons.map((lesson, index) => {
                const progress = completedLessons.find((l) => l.lessonId === lesson.id);
                const isCompleted = progress?.completed || false;
                const stars = progress?.stars || 0;
                const isLocked = lesson.id > currentLesson;
                const isCurrent = lesson.id === currentLesson;

                return (
                  <div
                    key={lesson.id}
                    className={`flex ${index % 2 === 0 ? "justify-start pl-8" : "justify-end pr-8"}`}
                  >
                    <LessonNode
                      id={lesson.id}
                      title={lesson.title}
                      isLocked={isLocked}
                      isCompleted={isCompleted}
                      isCurrent={isCurrent}
                      stars={stars}
                      onClick={() => !isLocked && startLesson(lesson.id)}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
