import api from "@/api/axios.ts";
import { useState, useRef, useEffect } from "react"; 
import { useNavigate } from "react-router-dom"; 
import { Navigation } from "@/components/layout/Navigation"; 
import { LessonNode } from "@/components/game/LessonNode"; 
import { QuestionCard, Question } from "@/components/game/QuestionCard"; 
import { LivesIndicator } from "@/components/game/LivesIndicator"; 
import { ProgressBar } from "@/components/game/ProgressBar"; 
import { GameButton } from "@/components/ui/GameButton"; 
import { useGame } from "@/contexts/GameContext"; 
import { lessonMeta } from "@/data/lessons"; 
import { ArrowLeft, HeartCrack, Trophy, Star } from "lucide-react"; 
import { toast } from "sonner"; 

export default function Lessons() {
  const navigate = useNavigate(); 
  const { currentLesson, completedLessons, updateLessonProgress, incrementStat } = useGame(); 
  const [lessonQuestions, setLessonQuestions] = useState<Question[]>([]); 
  const [loadingQuestions, setLoadingQuestions] = useState(false); 
  const [activeLesson, setActiveLesson] = useState<number | null>(null); 
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); 
  const [lives, setLives] = useState(3); 
  const correctCountRef = useRef(0); 
  const [gameState, setGameState] = useState<"idle" | "playing" | "won" | "lost">("idle"); 
  const activeLessonData = activeLesson ? lessonMeta.find((l) => l.id === activeLesson) : null; 
  const currentQuestion = lessonQuestions[currentQuestionIndex]; 
  
  const startLesson = async (lessonId: number) => { 
    const lesson = lessonMeta.find((l) => l.id === lessonId); 
    if (!lesson) return; 
    
    try { 
      setLoadingQuestions(true); 
      const res = await api.get("/questions", { 
        params: { 
          count: 5, 
          subject: lesson.topic, 
          difficulty: lesson.difficulty, 
          is_lesson: true, 
        }, 
      }); 
      
      const normalizedQuestions: Question[] = res.data.map((q: any) => ({ 
        id: q.id, 
        question: q.text, 
        options: q.options, 
        correctAnswer: q.correct_index, 
      })); 
      
      setLessonQuestions(normalizedQuestions); 
      setActiveLesson(lessonId); 
      setCurrentQuestionIndex(0); 
      setLives(3); 
      correctCountRef.current = 0; 
      setGameState("playing"); 
    } catch { 
      toast.error("Failed to load lesson questions"); 
    } finally { 
      setLoadingQuestions(false); 
    } }; 
    
    const handleAnswer = (isCorrect: boolean) => { 
      incrementStat("totalQuestions"); 
      if (isCorrect) { 
        incrementStat("correctAnswers"); 
        correctCountRef.current += 1; 
        toast.success("Great!"); 
      } else { 
        const newLives = lives - 1; 
        setLives(newLives); 
        if (newLives === 2) { 
          toast.error("Try again, soldier."); 
        } else if (newLives === 1){ 
          toast.error("Careful, it's your last life!"); 
        } if (newLives === 0) { 
          setGameState("lost"); 
          return; 
        } } 
        
        // Move to next question or finish
        if (currentQuestionIndex < (lessonQuestions.length || 0) - 1) { 
          setCurrentQuestionIndex((prev) => prev + 1); 
        } else {
          // Lesson complete!
          const stars = correctCountRef.current >= 5 ? 3 : correctCountRef.current >= 4 ? 2 : 1; 
          
          updateLessonProgress(activeLesson!, stars); 
          incrementStat("lessonsCompleted"); 
          setGameState("won"); } }; 

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
    const progress = ((currentQuestionIndex + 1) / lessonQuestions.length) * 100;

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
                Question {currentQuestionIndex + 1} of {lessonQuestions.length}
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
    const finalCorrect = correctCountRef.current;
    const stars = finalCorrect >= 5 ? 3 : finalCorrect >= 4 ? 2 : 1;
    
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="game-card p-8 max-w-md text-center bounce-in">
          <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
            <Trophy className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-3xl font-fredoka font-bold mb-4">A Fantastic Victory!</h2>
          
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
            You got {finalCorrect} out of {lessonQuestions.length} correct!
          </p>
          
          <div className="flex flex-col gap-3">
            <GameButton variant="primary" size="lg" onClick={exitLesson}>
              Continue
            </GameButton>
            <GameButton 
              variant="outline" 
              size="lg" 
              onClick={retryLesson}
              disabled={stars === 3}
            >
              {stars === 3 ? "Perfect Score!" : "Try Again for 3 Stars"}
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
          <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
            <HeartCrack className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-3xl font-fredoka font-bold mb-4">A Minor Setback</h2>
          <p className="text-muted-foreground mb-8">
            Don't worry about losing! Stand back up and try again!
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
          <h1 className="text-3xl md:text-4xl font-fredoka font-bold mb-2">Adventure</h1>
          <p className="text-muted-foreground">Complete journeys to unlock new challenges</p>
        </div>

        {/* Lesson Path */}
        <div className="max-w-lg mx-auto">
          <div className="relative">
            {/* Connection Line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-primary/20 -translate-x-1/2 z-0" />
            
            {/* Lesson Nodes */}
            <div className="relative z-10 space-y-8">
              {lessonMeta.map((lesson, index) => {
                const progress = completedLessons.find((l) => l.lessonId === lesson.id);
                const stars = progress?.stars || 0;
                const isCompleted = progress?.completed || false;
                const isLocked = lesson.id > currentLesson;
                const isCurrent = lesson.id === currentLesson;
                const isPerfect = stars === 3;

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
                      isPerfect={isPerfect}
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
