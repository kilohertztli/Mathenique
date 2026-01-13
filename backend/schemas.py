from pydantic import BaseModel

class UserCreate(BaseModel):
    name: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class StatsUpdate(BaseModel):
    total_questions: int = 0
    correct_answers: int = 0
    games_played: int = 0
    lessons_completed: int = 0
    challenge_best_streak: int = 0
    apocalypse_best_streak: int = 0
    challenge_high_score: int = 0
    apocalypse_high_score: int = 0

class QuestionOut(BaseModel):
    id: int
    text: str
    options: list[str]
    correct_index: int
    subject: str | None
    difficulty: int
    is_lesson: int
    is_game: int

    class Config:
        orm_mode = True

class LessonProgressCreate(BaseModel):
    lesson_id: int
    stars: int

class LessonProgressOut(BaseModel):
    lesson_id: int
    stars: int
    completed: int

    class Config:
        orm_mode = True