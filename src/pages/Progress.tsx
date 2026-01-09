import { Navigation } from "@/components/layout/Navigation";
import { StatCard } from "@/components/game/StatCard";
import { ProgressBar } from "@/components/game/ProgressBar";
import { useGame } from "@/contexts/GameContext";
import { useAuth } from "@/contexts/AuthContext";
import { lessons } from "@/data/lessons";
import { 
  Trophy, 
  Target, 
  Zap, 
  Star, 
  BookOpen, 
  Gamepad2,
  TrendingUp,
  Award
} from "lucide-react";

export default function Progress() {
  const { user } = useAuth();
  const { stats, completedLessons, currentLesson } = useGame();

  const accuracy = stats.totalQuestions > 0 
    ? Math.round((stats.correctAnswers / stats.totalQuestions) * 100) 
    : 0;

  const totalStars = completedLessons.reduce((sum, l) => sum + l.stars, 0);
  const maxStars = lessons.length * 3;
  const lessonsProgress = ((currentLesson - 1) / lessons.length) * 100;

  return (
    <div className="min-h-screen pb-24 md:pt-24">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-fredoka font-bold mb-2">Your Progress</h1>
          <p className="text-muted-foreground">Keep up the great work, {user?.name}!</p>
        </div>

        {/* Overall Progress */}
        <div className="game-card p-6 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-xl gradient-gold flex items-center justify-center">
              <Trophy className="w-7 h-7 text-foreground" />
            </div>
            <div className="flex-1">
              <h2 className="font-fredoka font-bold text-xl">Adventure Progress</h2>
              <p className="text-muted-foreground">
                {currentLesson - 1} of {lessons.length} lessons completed
              </p>
            </div>
          </div>
          <ProgressBar value={lessonsProgress} variant="gold" size="lg" showLabel />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Total Stars"
            value={`${totalStars}/${maxStars}`}
            icon={Star}
            trend={totalStars > 0 ? "up" : "neutral"}
          />
          <StatCard
            title="Accuracy"
            value={`${accuracy}%`}
            icon={Target}
            trend={accuracy >= 70 ? "up" : accuracy >= 50 ? "neutral" : "down"}
          />
          <StatCard
            title="Best Streak"
            value={stats.bestStreak}
            icon={Zap}
          />
          <StatCard
            title="Games Played"
            value={stats.gamesPlayed}
            icon={Gamepad2}
          />
        </div>

        {/* Detailed Stats */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Questions Stats */}
          <div className="game-card p-6">
            <div className="flex items-center gap-3 mb-6">
              <BookOpen className="w-6 h-6 text-primary" />
              <h3 className="font-fredoka font-bold text-lg">Question Stats</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Total Answered</span>
                <span className="font-bold">{stats.totalQuestions}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Correct Answers</span>
                <span className="font-bold text-success">{stats.correctAnswers}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Wrong Answers</span>
                <span className="font-bold text-destructive">
                  {stats.totalQuestions - stats.correctAnswers}
                </span>
              </div>
              
              {/* Accuracy bar */}
              <div className="pt-4">
                <div className="flex justify-between text-sm mb-2">
                  <span>Accuracy Rate</span>
                  <span className="font-bold">{accuracy}%</span>
                </div>
                <ProgressBar 
                  value={accuracy} 
                  variant={accuracy >= 70 ? "success" : accuracy >= 50 ? "warning" : "primary"}
                />
              </div>
            </div>
          </div>

          {/* Achievements Preview */}
          <div className="game-card p-6">
            <div className="flex items-center gap-3 mb-6">
              <Award className="w-6 h-6 text-gold" />
              <h3 className="font-fredoka font-bold text-lg">Achievements</h3>
            </div>
            
            <div className="space-y-4">
              {/* First Steps */}
              <div className={`flex items-center gap-4 p-3 rounded-xl ${
                stats.lessonsCompleted >= 1 ? "bg-success/10" : "bg-muted"
              }`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  stats.lessonsCompleted >= 1 ? "bg-success" : "bg-muted-foreground/20"
                }`}>
                  <BookOpen className="w-5 h-5 text-success-foreground" />
                </div>
                <div>
                  <div className="font-semibold">First Steps</div>
                  <div className="text-sm text-muted-foreground">Complete your first lesson</div>
                </div>
              </div>

              {/* Streak Master */}
              <div className={`flex items-center gap-4 p-3 rounded-xl ${
                stats.bestStreak >= 5 ? "bg-gold/10" : "bg-muted"
              }`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  stats.bestStreak >= 5 ? "gradient-gold" : "bg-muted-foreground/20"
                }`}>
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-semibold">Streak Master</div>
                  <div className="text-sm text-muted-foreground">Get a 5 answer streak</div>
                </div>
              </div>

              {/* Sharp Shooter */}
              <div className={`flex items-center gap-4 p-3 rounded-xl ${
                accuracy >= 80 && stats.totalQuestions >= 20 ? "bg-primary/10" : "bg-muted"
              }`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  accuracy >= 80 && stats.totalQuestions >= 20 ? "gradient-primary" : "bg-muted-foreground/20"
                }`}>
                  <Target className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <div className="font-semibold">Sharp Shooter</div>
                  <div className="text-sm text-muted-foreground">80% accuracy (20+ questions)</div>
                </div>
              </div>

              {/* Rising Star */}
              <div className={`flex items-center gap-4 p-3 rounded-xl ${
                totalStars >= 9 ? "bg-gold/10" : "bg-muted"
              }`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  totalStars >= 9 ? "gradient-gold" : "bg-muted-foreground/20"
                }`}>
                  <Star className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-semibold">Rising Star</div>
                  <div className="text-sm text-muted-foreground">Earn 9 stars in lessons</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Challenge Mode Stats */}
        {stats.challengeHighScore > 0 && (
          <div className="game-card p-6 mt-6">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-6 h-6 text-warning" />
              <h3 className="font-fredoka font-bold text-lg">Challenge Mode</h3>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">High Score</span>
              <span className="text-3xl font-fredoka font-bold text-warning">
                {stats.challengeHighScore}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
