from fastapi import FastAPI, Depends, HTTPException, status, Query
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from random import shuffle

from backend.database import SessionLocal, Base, engine
from backend.models import User, Progress, LessonProgress, Question
from backend.schemas import UserCreate, Token, StatsUpdate, QuestionOut, LessonProgressCreate, LessonProgressOut
from backend.auth import verify_password, create_access_token, hash_password, get_current_user


Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8000",
        "http://127.0.0.1:8000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/me")
def get_me(user_id: int = Depends(get_current_user), db: Session = Depends(get_db)):
    user = db.query(User).get(user_id)
    return {
        "id": user.id,
        "email": user.email,
        "name": user.name
    }

@app.get("/profile")
def profile(user_id: int = Depends(get_current_user)):
    return {"id": user_id}

@app.get("/lessons/progress")
def get_lesson_progress(
    user_id: int = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return db.query(LessonProgress).filter(
        LessonProgress.user_id == user_id
    ).all()

@app.get("/questions", response_model=list[QuestionOut])
def get_questions(
    mode: str | None = None,  # normal | mixed | challenge | apocalypse
    count: int = 10,
    subject: str | None = None,
    is_lesson: bool = Query(False),
    db: Session = Depends(get_db),
):
    query = db.query(Question)

    if is_lesson:
        query = query.filter(Question.is_lesson == 1)

    if subject:
        query = query.filter(Question.subject == subject)

    if mode == "challenge":
        query = query.filter(Question.difficulty <= 2)
    elif mode == "apocalypse":
        query = query.filter(Question.difficulty <= 3)

    questions = query.all()
    shuffle(questions)

    return questions[:count]

@app.post("/register", status_code=201)
def register(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered"
        )

    new_user = User(
        name=user.name,
        email=user.email,
        password_hash=hash_password(user.password)
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "id": new_user.id,
        "email": new_user.email,
        "name": new_user.name,
        "message": "User registered successfully"
    }

@app.post("/login", response_model=Token)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    db_user = db.query(User).filter(User.email == form_data.username).first()

    if not db_user or not verify_password(form_data.password, db_user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    access_token = create_access_token(
        data={"sub": str(db_user.id),"email": db_user.email}
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }

# Save lesson progress
@app.post("/lessons/progress", response_model=LessonProgressOut)
def save_lesson_progress(
    data: LessonProgressCreate,
    user: int = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    progress = (
        db.query(LessonProgress)
        .filter_by(user_id=user, lesson_id=data.lesson_id)
        .first()
    )

    if progress:
        progress.stars = max(progress.stars, data.stars)
        progress.completed = True
    else:
        progress = LessonProgress(
            user_id=user,
            lesson_id=data.lesson_id,
            stars=data.stars,
            completed=True,
        )
        db.add(progress)

    db.commit()
    db.refresh(progress)

    return progress


@app.get("/stats")
def get_stats(
    user_id: int = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    user = db.query(User).get(user_id)
    progress = db.query(Progress).filter(Progress.user_id == user.id).first()
    
    if not progress:
        return {
            "total_questions": 0,
            "correct_answers": 0,
            "games_played": 0,
            "challenge_best_streak": 0,
            "apocalypse_best_streak": 0,
            "lessons_completed": 0,
            "challenge_high_score": 0,
            "apocalypse_high_score": 0
        }
    
    return {
        "total_questions": progress.total_questions,
        "correct_answers": progress.correct_answers,
        "games_played": progress.games_played,
        "challenge_best_streak": progress.challenge_best_streak,
        "apocalypse_best_streak": progress.apocalypse_best_streak,
        "lessons_completed": progress.lessons_completed,
        "challenge_high_score": progress.challenge_high_score,
        "apocalypse_high_score": progress.apocalypse_high_score
    }

@app.put("/stats")
def update_stats(
    data: StatsUpdate,
    user_id: int = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    user = db.query(User).get(user_id)
    progress = db.query(Progress).filter(Progress.user_id == user.id).first()
    
    if not progress:
        progress = Progress(
            user_id=user.id,
            total_questions=0,
            correct_answers=0,
            games_played=0,
            lessons_completed=0,
            challenge_best_streak=0,
            apocalypse_best_streak=0,
            challenge_high_score=0,
            apocalypse_high_score=0,
        )
        db.add(progress)
    
    progress.total_questions = data.total_questions
    progress.correct_answers = data.correct_answers
    progress.games_played = data.games_played
    progress.challenge_best_streak = data.challenge_best_streak
    progress.apocalypse_best_streak = data.apocalypse_best_streak
    progress.lessons_completed = data.lessons_completed
    progress.challenge_high_score = data.challenge_high_score
    progress.apocalypse_high_score = data.apocalypse_high_score
    
    db.commit()
    
    return {"message": "Stats updated"}
