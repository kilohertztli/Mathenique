import { Navigation } from "@/components/layout/Navigation";
import { StatCard } from "@/components/game/StatCard";
import { ProgressBar } from "@/components/game/ProgressBar";
import { useGame } from "@/contexts/GameContext";
import { useAuth } from "@/contexts/AuthContext";
import { lessonMeta } from "@/data/lessons";
import { useEffect } from "react";
import { 
  Target, 
  Zap, 
  Star, 
  BookOpen,
  Swords,
  Award,
  Skull,
  Flame,
  Flag,
  Footprints,
  Sparkle,
  PartyPopper,
  WandSparkles,
  MoonStar,
  Crown,
  Sun,
} from "lucide-react";

export default function Progress() {
  const { user } = useAuth();
  const { stats, completedLessons, currentLesson, refreshStats } = useGame();

  // Refresh stats when page loads to ensure latest data
  useEffect(() => {
    if (user) {
      // Small delay to allow any pending saves to complete
      const timeoutId = setTimeout(() => {
        refreshStats();
      }, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [user, refreshStats]);

  const accuracy = stats.totalQuestions > 0 
    ? Math.round((stats.correctAnswers / stats.totalQuestions) * 100) 
    : 0;

  const totalStars = completedLessons.reduce((sum, l) => sum + l.stars, 0);
  const maxStars = lessonMeta.length * 3;
  const lessonsProgress = ((currentLesson - 1) / lessonMeta.length) * 100;

  // Calculate topic performance
  const topicStats = lessonMeta.reduce((acc, lesson) => {
    if (!acc[lesson.topic]) {
      acc[lesson.topic] = { completed: 0, total: 0, stars: 0 };
    }
    acc[lesson.topic].total += 1;
    const completedLesson = completedLessons.find(l => l.lessonId === lesson.id);
    if (completedLesson) {
      acc[lesson.topic].completed += 1;
      acc[lesson.topic].stars += completedLesson.stars;
    }
    return acc;
  }, {} as Record<string, { completed: number; total: number; stars: number }>);

  const bestTopic = Object.entries(topicStats).reduce((best, [topic, stats]) => {
    const completionRate = stats.total > 0 ? stats.completed / stats.total : 0;
    const avgStars = stats.completed > 0 ? stats.stars / stats.completed : 0;
    const score = completionRate * avgStars;
    return score > best.score ? { topic, score } : best;
  }, { topic: '', score: 0 });

  return (
    <div className="min-h-screen pb-24 md:pt-24">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-fredoka font-bold mb-2">Progress</h1>
          <p className="text-muted-foreground">Keep up the great work, {user?.name}!</p>
        </div>

        {/* Overall Progress */}
        <div className="game-card border border-warning p-6 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-xl gradient-gold bg- flex items-center justify-center">
              <Star className="w-7 h-7 text-foreground" />
            </div>
            <div className="flex-1">
              <h2 className="font-fredoka font-bold text-xl">Adventure Progress</h2>
              <p className="text-muted-foreground">
                {currentLesson - 1} of {lessonMeta.length} journeys completed • {totalStars} of {lessonMeta.length * 3} stars earned
              </p>
            </div>
          </div>
          <ProgressBar value={lessonsProgress} variant="gold" size="lg" showLabel />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Accuracy"
            value={`${accuracy}%`}
            icon={Target}
            trend={accuracy >= 70 ? "up" : accuracy >= 50 ? "neutral" : "down"}
          />
          <StatCard
            title="Arena Battles"
            value={stats.gamesPlayed}
            icon={Swords}
          />
          <div className="game-card bg-primary p-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-primary-foreground" />
              <span className="text-lg text-primary-foreground font-semibold">Challenge</span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-primary-foreground/70">High Score</span>
                <span className="font-bold text-warning">{stats.challengeHighScore || 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-primary-foreground/70">Best Streak</span>
                <span className="font-bold text-primary-foreground/70">{stats.challengeBestStreak}</span>
              </div>
            </div>
          </div>
          <div className="game-card bg-primary p-4">
            <div className="flex items-center gap-2 mb-2">
              <Skull className="w-4 h-4 text-primary-foreground" />
              <span className="text-lg text-primary-foreground font-semibold">Apocalypse</span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-primary-foreground/70">High Score</span>
                <span className="font-bold text-warning">{stats.apocalypseHighScore || 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-primary-foreground/70">Best Streak</span>
                <span className="font-bold text-primary-foreground/70">{stats.apocalypseBestStreak}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Stats */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
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
                <span className="font-bold text-warning">{stats.correctAnswers}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Wrong Answers</span>
                <span className="font-bold">
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
                  variant={accuracy >= 70 ? "warning" : "primary"}
                />
              </div>
            </div>
          </div>

          {/* Topic Performance */}
          <div className="game-card p-6">
            <div className="flex items-center gap-3 mb-6">
              <Target className="w-6 h-6 text-primary" />
              <h3 className="font-fredoka font-bold text-lg">Topic Performance</h3>
              <span className="text-xs text-muted-foreground">(Based on journeys completed)</span>
            </div>
            
            <div className="space-y-3">
              {Object.entries(topicStats).map(([topic, stats]) => {
                const completionRate = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;
                const avgStars = stats.completed > 0 ? stats.stars / stats.completed : 0;
                const performanceScore = completionRate * (avgStars / 3); // Normalized 0-100
                const isBest = topic === bestTopic.topic && bestTopic.score > 0;
                
                return (
                  <div key={topic} className={`p-3 rounded-lg ${isBest ? 'bg-warning/10 border border-warning' : 'bg-muted/50'}`}>
                    <div className="flex justify-between items-center mb-2">
                      <span className={`font-semibold ${isBest ? 'text-warning' : ''}`}>
                        {topic} {isBest && "★★★"}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {stats.completed}/{stats.total} Journeys
                      </span>
                    </div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Completion</span>
                      <span className="font-bold">{Math.round(completionRate)}%</span>
                    </div>
                    <ProgressBar 
                      value={completionRate} 
                      variant={isBest ? "warning" : "primary"}
                      size="sm"
                    />
                    <div className="flex justify-between text-sm mt-2">
                      <span>Mastery Level</span>
                      <span className="font-bold">{Math.round(performanceScore)}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Achievements - Full Width */}
        <div className="game-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <Award className="w-6 h-6 text-primary" />
            <h3 className="font-fredoka font-bold text-lg">Achievements</h3>
          </div>
            
          <div className="grid md:grid-cols-2 gap-4">
            {/* Novice Steps */}
            <div className={`flex items-center gap-4 p-3 rounded-xl ${
              stats.lessonsCompleted >= 1 ? "bg-gold/10" : "bg-muted"
            }`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                stats.lessonsCompleted >= 1 ? "gradient-gold" : "bg-muted-foreground/20"
              }`}>
                <Footprints className="w-5 h-5" />
              </div>
              <div>
                <div className="font-semibold">Novice Steps</div>
                <div className="text-sm text-muted-foreground">Complete your first journey</div>
              </div>
            </div>

            {/* Firebringer */}
            <div className={`flex items-center gap-4 p-3 rounded-xl ${
              Math.max(stats.challengeBestStreak, stats.apocalypseBestStreak) >= 5 ? "bg-gold/10" : "bg-muted"
            }`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                Math.max(stats.challengeBestStreak, stats.apocalypseBestStreak) >= 5 ? "gradient-gold" : "bg-muted-foreground/20"
              }`}>
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <div className="font-semibold">Firebringer</div>
                <div className="text-sm text-muted-foreground">Get a 5 answer streak</div>
              </div>
            </div>

            {/* Sharpshooter */}
            <div className={`flex items-center gap-4 p-3 rounded-xl ${
              accuracy >= 80 && stats.totalQuestions >= 20 ? "bg-gold/10" : "bg-muted"
            }`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                accuracy >= 80 && stats.totalQuestions >= 20 ? "gradient-gold" : "bg-muted-foreground/20"
              }`}>
                <Target className="w-5 h-5" />
              </div>
              <div>
                <div className="font-semibold">Sharpshooter</div>
                <div className="text-sm text-muted-foreground">80% accuracy (20+ questions)</div>
              </div>
            </div>

            {/* Star Gazer */}
            <div className={`flex items-center gap-4 p-3 rounded-xl ${
              totalStars >= 18 ? "bg-gold/10" : "bg-muted"
            }`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                totalStars >= 18 ? "gradient-gold" : "bg-muted-foreground/20"
              }`}>
                <Star className="w-5 h-5" />
              </div>
              <div>
                <div className="font-semibold">Star Gazer</div>
                <div className="text-sm text-muted-foreground">Earn 18 stars in journeys</div>
              </div>
            </div>

            {/* Master of the Streak */}
            <div className={`flex items-center gap-4 p-3 rounded-xl ${
              Math.max(stats.challengeBestStreak, stats.apocalypseBestStreak) >= 10 ? "bg-gold/10" : "bg-muted"
            }`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                Math.max(stats.challengeBestStreak, stats.apocalypseBestStreak) >= 10 ? "gradient-gold" : "bg-muted-foreground/20"
              }`}>
                <Sun className="w-5 h-5" />
              </div>
              <div>
                <div className="font-semibold">Master of the Streak</div>
                <div className="text-sm text-muted-foreground">Get a 10 answer streak</div>
              </div>
            </div>

            {/* The Math Gladiator */}
            <div className={`flex items-center gap-4 p-3 rounded-xl ${
              stats.gamesPlayed >= 20 ? "bg-gold/10" : "bg-muted"
            }`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                stats.gamesPlayed >= 20 ? "gradient-gold" : "bg-muted-foreground/20"
              }`}>
                <Flag className="w-5 h-5" />
              </div>
              <div>
                <div className="font-semibold">The Math Gladiator</div>
                <div className="text-sm text-muted-foreground">Play 20 arena battles</div>
              </div>
            </div>

            {/* Mathenique's 'The' Challenger */}
            <div className={`flex items-center gap-4 p-3 rounded-xl ${
              stats.challengeHighScore >= 200 ? "bg-gold/10" : "bg-muted"
            }`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                stats.challengeHighScore >= 200 ? "gradient-gold" : "bg-muted-foreground/20"
              }`}>
                <Swords className="w-5 h-5" />
              </div>
              <div>
                <div className="font-semibold">Mathenique's 'The' Challenger</div>
                <div className="text-sm text-muted-foreground">Score 200 in Challenge</div>
              </div>
            </div>

            {/* Survivor of the Apocalypse */}
            <div className={`flex items-center gap-4 p-3 rounded-xl ${
              stats.apocalypseHighScore >= 200 ? "bg-gold/10" : "bg-muted"
            }`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                stats.apocalypseHighScore >= 200 ? "gradient-gold" : "bg-muted-foreground/20"
              }`}>
                <Skull className="w-5 h-5" />
              </div>
              <div>
                <div className="font-semibold">Survivor of the Apocalypse</div>
                <div className="text-sm text-muted-foreground">Score atleast 200 in Apocalypse</div>
              </div>
            </div>

            {/* The Wizard of Mathenique */}
            <div className={`flex items-center gap-4 p-3 rounded-xl ${
              stats.correctAnswers >= 100 ? "bg-gold/10" : "bg-muted"
            }`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                stats.correctAnswers >= 100 ? "gradient-gold" : "bg-muted-foreground/20"
              }`}>
                <WandSparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="font-semibold">The Wizard of Mathenique</div>
                <div className="text-sm text-muted-foreground">Answer 100 questions correctly</div>
              </div>
            </div>

            {/* Shoot for the Stars */}
            <div className={`flex items-center gap-4 p-3 rounded-xl ${
              totalStars >= 18 ? "bg-gold/10" : "bg-muted"
            }`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                totalStars >= 18 ? "gradient-gold" : "bg-muted-foreground/20"
              }`}>
                <Sparkle className="w-5 h-5" />
              </div>
              <div>
                <div className="font-semibold">Shoot for the Stars</div>
                <div className="text-sm text-muted-foreground">Earn 18 stars in journeys</div>
              </div>
            </div>

            {/* A Mathenique Odyssey */}
            <div className={`flex items-center gap-4 p-3 rounded-xl ${
              stats.lessonsCompleted >= 6 ? "bg-gold/10" : "bg-muted"
            }`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                stats.lessonsCompleted >= 6 ? "gradient-gold" : "bg-muted-foreground/20"
              }`}>
                <MoonStar className="w-5 h-5" />
              </div>
              <div>
                <div className="font-semibold">A Mathenique Odyssey</div>
                <div className="text-sm text-muted-foreground">Finish 6 journeys</div>
              </div>
            </div>

            {/* The Chosen */}
            <div className={`flex items-center gap-4 p-3 rounded-xl ${
              accuracy >= 90 ? "bg-gold/10" : "bg-muted"
            }`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                accuracy >= 90 ? "gradient-gold" : "bg-muted-foreground/20"
              }`}>
                <Crown className="w-5 h-5" />
              </div>
              <div>
                <div className="font-semibold">The Chosen</div>
                <div className="text-sm text-muted-foreground">Have atleast 90% accuracy</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
