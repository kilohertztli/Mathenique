import { useState, useCallback } from "react";
import { Navigation } from "@/components/layout/Navigation";
import { GameModeCard } from "@/components/game/GameModeCard";
import { QuestionCard, Question } from "@/components/game/QuestionCard";
import { LivesIndicator } from "@/components/game/LivesIndicator";
import { ProgressBar } from "@/components/game/ProgressBar";
import { Timer } from "@/components/game/Timer";
import { GameButton } from "@/components/ui/GameButton";
import { useGame } from "@/contexts/GameContext";
import { getRandomQuestions } from "@/data/lessons";
import { Zap, Shuffle, Trophy, ArrowLeft, X, Target } from "lucide-react";
import { toast } from "sonner";

type GameMode = "normal" | "mixed" | "challenge" | null;
type GameState = "menu" | "playing" | "won" | "lost";

const QUESTIONS_PER_GAME = 10;
const CHALLENGE_TIME = 15; // seconds per question

export default function Play() {
  const { incrementStat, updateStats, stats } = useGame();
  
  const [gameMode, setGameMode] = useState<GameMode>(null);
  const [gameState, setGameState] = useState<GameState>("menu");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timerKey, setTimerKey] = useState(0);

  const currentQuestion = questions[currentQuestionIndex];

  const startGame = (mode: GameMode) => {
    let gameQuestions: Question[];
    
    if (mode === "normal") {
      // Single topic - Addition for demo
      gameQuestions = getRandomQuestions(QUESTIONS_PER_GAME, ["Addition"]);
    } else {
      // Mixed and Challenge - all topics
      gameQuestions = getRandomQuestions(QUESTIONS_PER_GAME);
    }

    setGameMode(mode);
    setQuestions(gameQuestions);
    setCurrentQuestionIndex(0);
    setLives(3);
    setScore(0);
    setStreak(0);
    setTimerKey((prev) => prev + 1);
    setGameState("playing");
    incrementStat("gamesPlayed");
  };

  const handleTimeUp = useCallback(() => {
    toast.error("Time's up! ⏰");
    const newLives = lives - 1;
    setLives(newLives);
    setStreak(0);
    
    if (newLives === 0) {
      setGameState("lost");
    } else {
      moveToNextQuestion();
    }
  }, [lives]);

  const moveToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setTimerKey((prev) => prev + 1);
    } else {
      // Game complete!
      if (gameMode === "challenge" && score > stats.challengeHighScore) {
        updateStats({ challengeHighScore: score });
      }
      if (streak > stats.bestStreak) {
        updateStats({ bestStreak: streak });
      }
      setGameState("won");
    }
  };

  const handleAnswer = (isCorrect: boolean) => {
    incrementStat("totalQuestions");
    
    if (isCorrect) {
      incrementStat("correctAnswers");
      const pointsEarned = gameMode === "challenge" ? 20 : 10;
      setScore((prev) => prev + pointsEarned);
      setStreak((prev) => prev + 1);
      toast.success(`+${pointsEarned} points! 🎯`);
    } else {
      const newLives = lives - 1;
      setLives(newLives);
      setStreak(0);
      toast.error("Wrong answer! 💪");
      
      if (newLives === 0) {
        setGameState("lost");
        return;
      }
    }

    moveToNextQuestion();
  };

  const exitGame = () => {
    setGameMode(null);
    setGameState("menu");
  };

  // Playing state
  if (gameState === "playing" && currentQuestion) {
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

    return (
      <div className="min-h-screen pb-20 md:pt-24">
        <div className="container mx-auto px-4 py-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={exitGame}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-semibold">Exit</span>
            </button>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Score</div>
                <div className="font-fredoka font-bold text-xl">{score}</div>
              </div>
              <LivesIndicator lives={lives} size="md" />
            </div>
          </div>

          {/* Timer for Challenge Mode */}
          {gameMode === "challenge" && (
            <Timer
              key={timerKey}
              seconds={CHALLENGE_TIME}
              isRunning={gameState === "playing"}
              onTimeUp={handleTimeUp}
              className="mb-4"
            />
          )}

          {/* Progress */}
          <div className="mb-8">
            <div className="flex justify-between text-sm font-semibold mb-2">
              <span className="capitalize">{gameMode} Mode</span>
              <span>
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
            </div>
            <ProgressBar 
              value={progress} 
              variant={gameMode === "challenge" ? "warning" : gameMode === "mixed" ? "success" : "primary"} 
              size="lg" 
            />
          </div>

          {/* Streak indicator */}
          {streak > 1 && (
            <div className="text-center mb-4">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/20 text-gold font-fredoka font-bold">
                🔥 {streak} Streak!
              </span>
            </div>
          )}

          {/* Question */}
          <QuestionCard 
            question={currentQuestion} 
            onAnswer={handleAnswer}
            disabled={gameState !== "playing"} 
          />
        </div>
        <Navigation />
      </div>
    );
  }

  // Won state
  if (gameState === "won") {
    const isHighScore = gameMode === "challenge" && score >= stats.challengeHighScore;
    
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="game-card p-8 max-w-md text-center bounce-in">
          <div className="w-20 h-20 rounded-full gradient-gold flex items-center justify-center mx-auto mb-6">
            <Trophy className="w-10 h-10 text-foreground" />
          </div>
          <h2 className="text-3xl font-fredoka font-bold mb-2">Game Complete!</h2>
          
          {isHighScore && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/20 text-gold font-semibold mb-4">
              🏆 New High Score!
            </div>
          )}
          
          <div className="text-5xl font-fredoka font-bold text-primary mb-2">{score}</div>
          <p className="text-muted-foreground mb-6">points earned</p>
          
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="p-4 rounded-xl bg-muted">
              <div className="text-2xl font-bold">{streak}</div>
              <div className="text-sm text-muted-foreground">Best Streak</div>
            </div>
            <div className="p-4 rounded-xl bg-muted">
              <div className="text-2xl font-bold">{lives}/3</div>
              <div className="text-sm text-muted-foreground">Lives Left</div>
            </div>
          </div>
          
          <div className="flex flex-col gap-3">
            <GameButton variant="primary" size="lg" onClick={() => startGame(gameMode)}>
              Play Again
            </GameButton>
            <GameButton variant="outline" size="lg" onClick={exitGame}>
              Back to Menu
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
          <h2 className="text-3xl font-fredoka font-bold mb-2">Game Over!</h2>
          
          <div className="text-4xl font-fredoka font-bold text-primary mb-2">{score}</div>
          <p className="text-muted-foreground mb-8">points earned</p>
          
          <div className="flex flex-col gap-3">
            <GameButton variant="primary" size="lg" onClick={() => startGame(gameMode)}>
              Try Again
            </GameButton>
            <GameButton variant="outline" size="lg" onClick={exitGame}>
              Back to Menu
            </GameButton>
          </div>
        </div>
      </div>
    );
  }

  // Menu state
  return (
    <div className="min-h-screen pb-24 md:pt-24">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-fredoka font-bold mb-2">Choose Your Game</h1>
          <p className="text-muted-foreground">Select a mode and test your math skills!</p>
        </div>

        <div className="max-w-lg mx-auto grid gap-6">
          <GameModeCard
            title="Normal Mode"
            description="Focus on one topic at a time. Perfect for practicing specific skills."
            icon={Target}
            variant="normal"
            onClick={() => startGame("normal")}
          />
          
          <GameModeCard
            title="Mixed Mode"
            description="Questions from all topics. Test your overall math knowledge!"
            icon={Shuffle}
            variant="mixed"
            onClick={() => startGame("mixed")}
          />
          
          <GameModeCard
            title="Challenge Mode"
            description="Beat the clock! Answer quickly to earn more points."
            icon={Zap}
            variant="challenge"
            onClick={() => startGame("challenge")}
          />
        </div>

        {/* High Score Display */}
        {stats.challengeHighScore > 0 && (
          <div className="text-center mt-8">
            <p className="text-muted-foreground">
              Challenge High Score:{" "}
              <span className="font-fredoka font-bold text-gold">{stats.challengeHighScore}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
