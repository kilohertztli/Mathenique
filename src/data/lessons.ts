export interface Lesson {
  id: number;
  title: string;
  description: string;
  topic: string;
  difficulty: number;
}

export const lessonMeta = [
  { 
    id: 1,
    title: "Algebra Training",
    description: "Delve into the dimension of variables",
    topic: "algebra",
    difficulty: 1,
  },
  {
    id: 2,
    title: "Algebra Mastery",
    description: "Become the master of the math alphabet",
    topic: "algebra",
    difficulty: 2,
  },
  {
    id: 3,
    title: "Geometry Training",
    description: "Get into the details with shapes and logic",
    topic: "geometry",
    difficulty: 1,
  },
  {
    id: 4,
    title: "Geometry Mastery",
    description: "Intricate shapes will be no match for you",
    topic: "geometry",
    difficulty: 2,
  },
  {
    id: 5,
    title: "Trigonometry Training",
    description: "Circles and triangles just locked in",
    topic: "trigonometry",
    difficulty: 1,
  },
  {
    id: 6,
    title: "Trigonometry Mastery",
    description: "See the world in sine, cosine, and tangent",
    topic: "trigonometry",
    difficulty: 2,
  },
];

