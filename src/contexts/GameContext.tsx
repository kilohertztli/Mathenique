import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "./AuthContext";

interface LessonProgress {
  lessonId: number;
  stars: number;
  completed: boolean;
}

interface GameStats {
  totalQuestions: number;
  correctAnswers: number;
  gamesPlayed: number;
  bestStreak: number;
  lessonsCompleted: number;
  challengeHighScore: number;
}

interface GameContextType {
  currentLesson: number;
  completedLessons: LessonProgress[];
  stats: GameStats;
  updateLessonProgress: (lessonId: number, stars: number) => void;
  updateStats: (update: Partial<GameStats>) => void;
  incrementStat: (key: keyof GameStats, amount?: number) => void;
}

const defaultStats: GameStats = {
  totalQuestions: 0,
  correctAnswers: 0,
  gamesPlayed: 0,
  bestStreak: 0,
  lessonsCompleted: 0,
  challengeHighScore: 0,
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [currentLesson, setCurrentLesson] = useState(1);
  const [completedLessons, setCompletedLessons] = useState<LessonProgress[]>([]);
  const [stats, setStats] = useState<GameStats>(defaultStats);

  // Load progress when user changes
  useEffect(() => {
    if (user) {
      const savedProgress = localStorage.getItem(`mathquest_progress_${user.id}`);
      if (savedProgress) {
        const progress = JSON.parse(savedProgress);
        setCompletedLessons(progress.completedLessons || []);
        setCurrentLesson(progress.currentLesson || 1);
        setStats({ ...defaultStats, ...progress.stats });
      } else {
        setCompletedLessons([]);
        setCurrentLesson(1);
        setStats(defaultStats);
      }
    }
  }, [user]);

  // Save progress when it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem(`mathquest_progress_${user.id}`, JSON.stringify({
        completedLessons,
        currentLesson,
        stats,
      }));
    }
  }, [user, completedLessons, currentLesson, stats]);

  const updateLessonProgress = (lessonId: number, stars: number) => {
    setCompletedLessons((prev) => {
      const existing = prev.find((l) => l.lessonId === lessonId);
      if (existing) {
        return prev.map((l) =>
          l.lessonId === lessonId
            ? { ...l, stars: Math.max(l.stars, stars), completed: true }
            : l
        );
      }
      return [...prev, { lessonId, stars, completed: true }];
    });

    // Unlock next lesson
    if (lessonId >= currentLesson) {
      setCurrentLesson(lessonId + 1);
    }
  };

  const updateStats = (update: Partial<GameStats>) => {
    setStats((prev) => ({ ...prev, ...update }));
  };

  const incrementStat = (key: keyof GameStats, amount = 1) => {
    setStats((prev) => ({ ...prev, [key]: prev[key] + amount }));
  };

  return (
    <GameContext.Provider
      value={{
        currentLesson,
        completedLessons,
        stats,
        updateLessonProgress,
        updateStats,
        incrementStat,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
}
