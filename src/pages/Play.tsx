import { useState, useCallback, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/layout/Navigation";
import { GameModeCard } from "@/components/game/GameModeCard";
import { QuestionCard, Question } from "@/components/game/QuestionCard";
import { LivesIndicator } from "@/components/game/LivesIndicator";
import { ProgressBar } from "@/components/game/ProgressBar";
import { Timer } from "@/components/game/Timer";
import { lessonMeta } from "@/data/lessons"
import { GameButton } from "@/components/ui/GameButton";
import { useGame } from "@/contexts/GameContext";
import api from "@/api/axios";
import { Zap, Skull, Shuffle, Trophy, ArrowLeft, HeartCrack, Target, Lock } from "lucide-react";
import { toast } from "sonner";

type GameMode = "normal" | "mixed" | "challenge" | "apocalypse";
type GameState = "menu" | "playing" | "won" | "lost" | "ended";

const QUESTIONS_PER_GAME = 10;
const QUESTIONS_PER_APO = 30;
const CHALLENGE_TIME = 10; // seconds per question
const APOCALYPSE_TIME = 60; // seconds per game

async function fetchQuestions(
  mode: string,
  count: number,
  subject?: string
): Promise<Question[]> {
  const res = await api.get("/questions", {
    params: { mode, count, subject },
  });

  return res.data.map((q: any): Question => ({
    id: q.id,
    question: q.text,
    options: q.options,
    correctAnswer: q.correct_index
  }));
}


export default function Play() {
  const streakRef = useRef(0);
  const bestStreakRef = useRef(0);
  const scoreRef = useRef(0);
  const navigate = useNavigate();
  const { incrementStat, updateStats, stats, completedLessons } = useGame();
  
  const [gameMode, setGameMode] = useState<GameMode>(null);
  const [gameState, setGameState] = useState<GameState>("menu");
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [showTopics, setShowTopics] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timerKey, setTimerKey] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  
  useEffect(() => {
    streakRef.current = streak;
  }, [streak]);

  useEffect(() => {
    scoreRef.current = score;
  }, [score]);


  const topics = Array.from(new Set(lessonMeta.map(l => l.topic)));
  const unlockedTopics = Array.from(new Set(
    completedLessons.map(progress => {
      const lesson = lessonMeta.find(l => l.id === progress.lessonId);
      return lesson?.topic;
    }).filter(Boolean) as string[]
  ));
  const allLessonsCompleted = completedLessons.length === lessonMeta.length;

  const currentQuestion = questions[currentQuestionIndex];

  const startNormalGame = async (topic: string) => {
    setSelectedTopic(topic);
    setShowTopics(false);

    const gameQuestions = await fetchQuestions(
      "normal",
      QUESTIONS_PER_GAME,
      topic
    )

    setQuestions(gameQuestions);
    setCurrentQuestionIndex(0);
    setLives(3);
    setScore(0);
    setStreak(0);
    streakRef.current = 0;
    scoreRef.current = 0;
    bestStreakRef.current = 0
    setTimerKey((prev) => prev + 1);
    setGameState("playing");
    incrementStat("gamesPlayed");
  };

  const selectGameMode = async (mode: GameMode) => {
    setGameMode(mode);
    setShowTopics(false);

    if (mode === "normal") {
      setShowTopics(true);
      return;
    }

    let count = mode === "apocalypse" ? QUESTIONS_PER_APO : QUESTIONS_PER_GAME;

    const gameQuestions = await fetchQuestions(mode, count);
    
    setQuestions(gameQuestions);
    setCurrentQuestionIndex(0);
    setLives(3);
    setScore(0);
    setStreak(0);
    streakRef.current = 0;
    scoreRef.current = 0;
    bestStreakRef.current = 0;
    setTimerKey(prev => prev + 1);
    setIsTimerRunning(true);
    setGameState("playing");
    incrementStat("gamesPlayed");
  };

  const handleTimeUp = useCallback(() => {
    toast.error("Time's up!");

    if (gameMode === "apocalypse") {
      endGame("timeout");
      return;
    }

    const newLives = lives - 1;
    setLives(newLives);
    setStreak(0);
    streakRef.current = 0;

    if (newLives === 0) {
      endGame("lose");
    } else {
      nextQuestion();
    }
  }, [lives, gameMode]);


  const nextQuestion = () => {
    if (gameMode === "apocalypse") {
      setCurrentQuestionIndex((prev) => (prev + 1) % questions.length);
      return;
    }

    if (currentQuestionIndex === questions.length - 1) {
      endGame("win");
    } else {
      setCurrentQuestionIndex((prev) => prev + 1);
    }

    if (gameMode === "challenge") {
      setTimerKey((prev) => prev + 1);
      setIsTimerRunning(true);
    }
  };


  const handleAnswer = (isCorrect: boolean) => {
    incrementStat("totalQuestions");

    if (isCorrect) {
      incrementStat("correctAnswers");

      const points = gameMode === "normal" ? 10 : 20;
      setScore((s) => {
        const next = s + points;
        scoreRef.current = next;
        return next;
      });

      setStreak((s) => {
        const next = s + 1;
        bestStreakRef.current = Math.max(bestStreakRef.current, next);
        return next;
      });

      toast.success(`+${points}`);
    } else {
      const newLives = lives - 1;
      setLives(newLives);
      setStreak(0);
      streakRef.current = 0;

      if (newLives === 0) {
        endGame("lose");
        return;
      }
    }

    if (gameMode === "challenge") {
      setIsTimerRunning(false);
    }

    nextQuestion();
  };

  const exitGame = () => {
    setGameMode(null);
    setSelectedTopic(null);
    setShowTopics(false);
    setGameState("menu");
  };

  const endGame = (reason: "win" | "lose" | "timeout") => {
    if (gameMode === "challenge") {
      updateStats({
        challengeHighScore: Math.max(stats.challengeHighScore, scoreRef.current),
        challengeBestStreak: Math.max(stats.challengeBestStreak, bestStreakRef.current),
      });
    }

    if (gameMode === "apocalypse") {
      updateStats({
        apocalypseHighScore: Math.max(stats.apocalypseHighScore, scoreRef.current),
        apocalypseBestStreak: Math.max(stats.apocalypseBestStreak, bestStreakRef.current),
      });
    }

    setGameState(reason === "win" ? "won" : (reason === "lose" ? "lost" : "ended"));
  };


  // Playing state
  if (gameState === "playing") {
    if (!currentQuestion) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="text-center">
            <h2 className="text-2xl font-fredoka font-bold mb-4">No Questions Available</h2>
            <p className="text-muted-foreground mb-6">Sorry, there are no questions for this topic/mode right now.</p>
            <GameButton variant="primary" onClick={exitGame}>
              Back to Menu
            </GameButton>
          </div>
        </div>
      );
    }
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
              isRunning={gameState === "playing" && isTimerRunning}
              onTimeUp={handleTimeUp}
              className="mb-4"
            />
          )}

          {/* Timer for Apocalypse Mode */}
          {gameMode === "apocalypse" && (
            <Timer
              key={timerKey}
              seconds={APOCALYPSE_TIME}
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
                Question {currentQuestionIndex + 1} of {gameMode === "apocalypse" ? "?": questions.length}
              </span>
            </div>
            <ProgressBar 
              value={gameMode === "apocalypse" ? 100 : progress} 
              variant={"primary"} 
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
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="game-card p-8 max-w-md text-center bounce-in">
          <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center mx-auto mb-6">
            <Trophy className="w-10 h-10 text-foreground" />
          </div>
          <h2 className="text-3xl font-fredoka font-bold mb-2">Great Job!</h2>
          
          <div className="text-5xl font-fredoka font-bold text-primary mb-2">{score}</div>
          <p className="text-muted-foreground mb-6">points earned</p>
          
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="p-4 rounded-xl bg-muted">
              <div className="text-2xl font-bold">
                {gameMode === "challenge" && stats.challengeBestStreak}
                {gameMode === "normal" && bestStreakRef.current}
                {gameMode === "mixed" && bestStreakRef.current}
              </div>
              <div className="text-sm text-muted-foreground">Best Streak</div>
              {gameMode === "challenge" && <div className="text-sm text-muted-foreground">of All Time!</div>}
            </div>
            <div className="p-4 rounded-xl bg-muted">
              <div className="text-2xl font-bold">{lives}/3</div>
              <div className="text-sm text-muted-foreground">Lives Left</div>
            </div>
          </div>
          
          <div className="flex flex-col gap-3">
            <GameButton 
              variant="primary" 
              size="lg" 
              onClick={() => gameMode === "normal" && selectedTopic ? startNormalGame(selectedTopic) : selectGameMode(gameMode)}
            >
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

  // Apocalypse ending state
  if (gameState === "ended") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="game-card p-8 max-w-md text-center bounce-in">
          <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center mx-auto mb-6">
            <Trophy className="w-10 h-10 text-foreground" />
          </div>
          <h2 className="text-3xl font-fredoka font-bold mb-2">Apocalypse Over!</h2>
          
          <div className="text-5xl font-fredoka font-bold text-primary mb-2">{score}</div>
          <p className="text-muted-foreground mb-6">points earned</p>
          
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="p-4 rounded-xl bg-muted">
              <div className="text-2xl font-bold">{stats.apocalypseBestStreak}</div>
              <div className="text-sm text-muted-foreground">Best Streak</div>
              <div className="text-sm text-muted-foreground">of All Time!</div>
            </div>
            <div className="p-4 rounded-xl bg-muted">
              <div className="text-2xl font-bold">{lives}/3</div>
              <div className="text-sm text-muted-foreground">Lives Left</div>
            </div>
          </div>
          
          <div className="flex flex-col gap-3">
            <GameButton 
              variant="primary" 
              size="lg" 
              onClick={() => selectedTopic ? startNormalGame(selectedTopic) : selectGameMode(gameMode)}
            >
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
    // Update challenge high score if applicable
    if (gameMode === "challenge" && score > stats.challengeHighScore) {
      updateStats({ challengeHighScore: score });
    }
    
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="game-card p-8 max-w-md text-center shake">
          <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
            <HeartCrack className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-3xl font-fredoka font-bold mb-2">A Battle is Never Over...</h2>
          
          <div className="text-4xl font-fredoka font-bold text-primary mb-2">{score}</div>
          <p className="text-muted-foreground mb-8">points earned</p>
          
          <div className="flex flex-col gap-3">
            <GameButton 
              variant="primary" 
              size="lg" 
              onClick={() => gameMode === "normal" && selectedTopic ? startNormalGame(selectedTopic) : selectGameMode(gameMode)}
            >
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

  // Locked state - no lessons completed
  if (completedLessons.length === 0) {
    return (
      <div className="min-h-screen pb-24 md:pt-24">
        <Navigation />
        
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-fredoka font-bold mb-2">Arena</h1>
            <p className="text-muted-foreground">Train your skills in different math battles</p>
          </div>

          <div className="max-w-md mx-auto text-center">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
              <Lock className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-fredoka font-bold mb-4">Arena Locked</h2>
            <p className="text-muted-foreground mb-6">
              Complete at least one journey to unlock the Play Arena and start testing your skills, soldier!
            </p>
            <GameButton variant="primary" onClick={() => navigate("/lessons")}>
              Go to Lessons
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
          <h1 className="text-3xl md:text-4xl font-fredoka font-bold mb-2">Play Arena</h1>
          <p className="text-muted-foreground">A real Mathenique Master trains...</p>
        </div>

        <div className="max-w-lg mx-auto grid gap-6">
          {unlockedTopics.length > 0 && (
            <GameModeCard
              title="Focused"
              description="A single path is the way to go. Test one of your skills."
              icon={Target}
              variant="normal"
              onClick={() => selectGameMode("normal")}
            />
          )}
          
          {showTopics && unlockedTopics.length > 0 && (
            <div className="flex gap-4 justify-center animate-in slide-in-from-top-2 duration-300">
              {unlockedTopics.map((topic) => (
                <GameButton
                  key={topic}
                  variant="secondary"
                  size="md"
                  onClick={() => startNormalGame(topic)}
                  className="flex-1 max-w-32"
                >
                  {topic}
                </GameButton>
              ))}
            </div>
          )}
          
          {allLessonsCompleted && (
            <GameModeCard
              title="Mayhem"
              description="Battles from all corners. Test your whole Mathenique self."
              icon={Shuffle}
              variant="mixed"
              onClick={() => selectGameMode("mixed")}
            />
          )}
          
          {allLessonsCompleted && (
            <div className="relative">
              {/* High Score Badge */}
              {stats.challengeHighScore > 0 && (
                <div className="absolute -top-3 right-3 z-10 rounded-full border-gold bg-warning-foreground/90 px-3 py-1 text-xs font-fredoka font-bold text-warning/80 shadow">
                  High Score 🏆 : {stats.challengeHighScore}
                </div>
              )}
              <GameModeCard
                title="Challenge"
                description="Clock is ticking. Race against time in this battle."
                icon={Zap}
                variant="challenge"
                onClick={() => selectGameMode("challenge")}
              />
            </div>
          )}

          {allLessonsCompleted && (
            <div className="relative">
              {/* High Score Badge */}
              {stats.apocalypseHighScore > 0 && (
                <div className="absolute -top-3 right-3 z-10 rounded-full border-gold bg-warning-foreground/90 px-3 py-1 text-xs font-fredoka font-bold text-warning/80 shadow">
                  High Score 🏆 : {stats.apocalypseHighScore}
                </div>
              )}
              <GameModeCard
                title="Apocalypse"
                description="An endless battle..."
                icon={Skull}
                variant="apocalypse"
                onClick={() => selectGameMode("apocalypse")}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
