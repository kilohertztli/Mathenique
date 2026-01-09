import { Question } from "@/components/game/QuestionCard";

export interface Lesson {
  id: number;
  title: string;
  description: string;
  topic: string;
  questions: Question[];
}

export const lessons: Lesson[] = [
  {
    id: 1,
    title: "Addition Basics",
    description: "Learn the fundamentals of adding numbers",
    topic: "Addition",
    questions: [
      { id: 1, question: "5 + 3 = ?", options: ["6", "7", "8", "9"], correctAnswer: 2 },
      { id: 2, question: "12 + 7 = ?", options: ["17", "18", "19", "20"], correctAnswer: 2 },
      { id: 3, question: "25 + 15 = ?", options: ["35", "40", "45", "50"], correctAnswer: 1 },
      { id: 4, question: "8 + 9 = ?", options: ["15", "16", "17", "18"], correctAnswer: 2 },
      { id: 5, question: "33 + 27 = ?", options: ["50", "55", "60", "65"], correctAnswer: 2 },
    ],
  },
  {
    id: 2,
    title: "Subtraction Fun",
    description: "Master the art of taking away",
    topic: "Subtraction",
    questions: [
      { id: 1, question: "10 - 4 = ?", options: ["4", "5", "6", "7"], correctAnswer: 2 },
      { id: 2, question: "18 - 9 = ?", options: ["7", "8", "9", "10"], correctAnswer: 2 },
      { id: 3, question: "50 - 25 = ?", options: ["20", "25", "30", "35"], correctAnswer: 1 },
      { id: 4, question: "100 - 37 = ?", options: ["57", "63", "67", "73"], correctAnswer: 1 },
      { id: 5, question: "45 - 18 = ?", options: ["23", "25", "27", "29"], correctAnswer: 2 },
    ],
  },
  {
    id: 3,
    title: "Multiplication Magic",
    description: "Discover the power of multiplication",
    topic: "Multiplication",
    questions: [
      { id: 1, question: "4 × 3 = ?", options: ["10", "11", "12", "13"], correctAnswer: 2 },
      { id: 2, question: "7 × 6 = ?", options: ["36", "40", "42", "48"], correctAnswer: 2 },
      { id: 3, question: "9 × 8 = ?", options: ["64", "72", "80", "81"], correctAnswer: 1 },
      { id: 4, question: "5 × 5 = ?", options: ["20", "25", "30", "35"], correctAnswer: 1 },
      { id: 5, question: "12 × 4 = ?", options: ["44", "46", "48", "52"], correctAnswer: 2 },
    ],
  },
  {
    id: 4,
    title: "Division Discovery",
    description: "Learn to divide and conquer",
    topic: "Division",
    questions: [
      { id: 1, question: "20 ÷ 4 = ?", options: ["4", "5", "6", "7"], correctAnswer: 1 },
      { id: 2, question: "36 ÷ 6 = ?", options: ["5", "6", "7", "8"], correctAnswer: 1 },
      { id: 3, question: "81 ÷ 9 = ?", options: ["7", "8", "9", "10"], correctAnswer: 2 },
      { id: 4, question: "48 ÷ 8 = ?", options: ["5", "6", "7", "8"], correctAnswer: 1 },
      { id: 5, question: "100 ÷ 5 = ?", options: ["15", "18", "20", "25"], correctAnswer: 2 },
    ],
  },
  {
    id: 5,
    title: "Mixed Operations",
    description: "Combine all your skills",
    topic: "Mixed",
    questions: [
      { id: 1, question: "10 + 5 × 2 = ?", options: ["20", "25", "30", "15"], correctAnswer: 0 },
      { id: 2, question: "(8 + 4) × 3 = ?", options: ["20", "36", "24", "32"], correctAnswer: 1 },
      { id: 3, question: "50 - 20 ÷ 4 = ?", options: ["45", "7.5", "40", "30"], correctAnswer: 0 },
      { id: 4, question: "6 × 7 - 12 = ?", options: ["24", "30", "36", "42"], correctAnswer: 1 },
      { id: 5, question: "100 ÷ 4 + 15 = ?", options: ["35", "40", "45", "50"], correctAnswer: 1 },
    ],
  },
  {
    id: 6,
    title: "Fractions Intro",
    description: "Understanding parts of a whole",
    topic: "Fractions",
    questions: [
      { id: 1, question: "1/2 + 1/2 = ?", options: ["1/4", "1/2", "1", "2"], correctAnswer: 2 },
      { id: 2, question: "3/4 - 1/4 = ?", options: ["1/4", "1/2", "2/4", "1"], correctAnswer: 1 },
      { id: 3, question: "2/3 + 1/3 = ?", options: ["1/3", "2/3", "1", "3/3"], correctAnswer: 2 },
      { id: 4, question: "1/2 of 10 = ?", options: ["2", "4", "5", "10"], correctAnswer: 2 },
      { id: 5, question: "3/5 + 2/5 = ?", options: ["5/5", "1", "5/10", "Both A and B"], correctAnswer: 3 },
    ],
  },
];

// Generate questions for different game modes
export function getRandomQuestions(count: number, topics?: string[]): Question[] {
  let allQuestions: Question[] = [];
  
  const filteredLessons = topics
    ? lessons.filter((l) => topics.includes(l.topic))
    : lessons;

  filteredLessons.forEach((lesson) => {
    allQuestions = [...allQuestions, ...lesson.questions.map(q => ({
      ...q,
      id: q.id + lesson.id * 100, // Make IDs unique across lessons
    }))];
  });

  // Shuffle and return requested count
  return allQuestions
    .sort(() => Math.random() - 0.5)
    .slice(0, count);
}
