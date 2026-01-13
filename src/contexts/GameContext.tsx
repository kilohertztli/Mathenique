import { createContext, useContext, useState, useEffect, useRef, ReactNode } from "react";
import { useAuth } from "./AuthContext";
import api from "@/api/axios";

interface LessonProgress {
  lessonId: number;
  stars: number;
  completed: boolean;
}

interface GameStats {
  totalQuestions: number;
  correctAnswers: number;
  gamesPlayed: number;
  challengeBestStreak: number;
  apocalypseBestStreak: number;
  lessonsCompleted: number;
  challengeHighScore: number;
  apocalypseHighScore: number;
}

interface GameContextType {
  currentLesson: number;
  completedLessons: LessonProgress[];
  stats: GameStats;
  updateLessonProgress: (lessonId: number, stars: number) => void;
  updateStats: (update: Partial<GameStats>) => void;
  incrementStat: (key: keyof GameStats, amount?: number) => void;
  refreshStats: () => void;
}

const defaultStats: GameStats = {
  totalQuestions: 0,
  correctAnswers: 0,
  gamesPlayed: 0,
  lessonsCompleted: 0,
  challengeBestStreak: 0,
  apocalypseBestStreak: 0,
  challengeHighScore: 0,
  apocalypseHighScore: 0,
};

const mapStats = (backend: any): GameStats => ({
  totalQuestions: backend.total_questions ?? 0,
  correctAnswers: backend.correct_answers ?? 0,
  gamesPlayed: backend.games_played ?? 0,
  lessonsCompleted: backend.lessons_completed ?? 0,
  challengeBestStreak: backend.challenge_best_streak ?? 0,
  apocalypseBestStreak: backend.apocalypse_best_streak ?? 0,
  challengeHighScore: backend.challenge_high_score ?? 0,
  apocalypseHighScore: backend.apocalypse_high_score ?? 0,
});

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [currentLesson, setCurrentLesson] = useState(1);
  const [completedLessons, setCompletedLessons] = useState<LessonProgress[]>([]);
  const [stats, setStats] = useState<GameStats>(defaultStats);

  useEffect(() => {
  if (!user) return;

  Promise.all([
    api.get("/stats"),
    api.get("/lessons/progress"),
  ]).then(([statsRes, lessonsRes]) => {
    setStats(mapStats(statsRes.data));

    const lessons = lessonsRes.data.map((l: any) => ({
      lessonId: l.lesson_id,
      stars: l.stars,
      completed: l.completed,
    }));

    setCompletedLessons(lessons);

    const highestCompleted = lessons
      .filter(l => l.completed)
      .map(l => l.lessonId)
      .sort((a, b) => b - a)[0] ?? 0;

    setCurrentLesson(highestCompleted + 1);
  });
}, [user]);

  // Save stats to backend when they change
  const hasLoadedInitialStats = useRef(false);
  const statsRef = useRef(stats);
  statsRef.current = stats;

  useEffect(() => {
    if (!user) return;
    
    if (!hasLoadedInitialStats.current) {
      hasLoadedInitialStats.current = true;
      return;
    }

    const currentStats = statsRef.current;
    api.put("/stats", {
      total_questions: currentStats.totalQuestions,
      correct_answers: currentStats.correctAnswers,
      games_played: currentStats.gamesPlayed,
      lessons_completed: currentStats.lessonsCompleted,
      challenge_best_streak: currentStats.challengeBestStreak,
      apocalypse_best_streak: currentStats.apocalypseBestStreak,
      challenge_high_score: currentStats.challengeHighScore,
      apocalypse_high_score: currentStats.apocalypseHighScore,
    }).catch((err) => {
      console.error("Failed to save stats to backend:", err);
    });
  }, [stats]);

  const updateLessonProgress = async (lessonId: number, stars: number) => {
    await api.post("/lessons/progress", {
      lesson_id: lessonId,
      stars,
    });

    setCompletedLessons((prev) => {
      const existing = prev.find(l => l.lessonId === lessonId);
      if (existing) {
        return prev.map(l =>
          l.lessonId === lessonId
            ? { ...l, stars: Math.max(l.stars, stars), completed: true }
            : l
        );
      }
      return [...prev, { lessonId, stars, completed: true }];
    });

    setCurrentLesson((prev) => Math.max(prev, lessonId + 1));
  };


  const updateStats = (update: Partial<GameStats>) => {
    setStats((prev) => ({ ...prev, ...update }));
  };

  const incrementStat = (key: keyof GameStats, amount = 1) => {
    setStats((prev) => ({ ...prev, [key]: prev[key] + amount }));
  };

  const refreshStats = () => {
    if (user) {
      api.get("/stats").then((res) => {
        const backendStats = res.data;
        setStats({
          totalQuestions: backendStats.total_questions || 0,
          correctAnswers: backendStats.correct_answers || 0,
          gamesPlayed: backendStats.games_played || 0,
          lessonsCompleted: backendStats.lessons_completed || 0,
          challengeBestStreak: backendStats.challenge_best_streak || 0,
          apocalypseBestStreak: backendStats.apocalypse_best_streak || 0,
          challengeHighScore: backendStats.challenge_high_score || 0,
          apocalypseHighScore: backendStats.apocalypse_high_score || 0,
        });
      }).catch((err) => {
        console.error("Failed to refresh stats from backend:", err);
      });
    }
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
        refreshStats,
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
