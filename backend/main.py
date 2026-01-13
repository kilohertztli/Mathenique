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
    allow_origins=["https://mathenique-frontend.onrender.com"], 
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

def seed_questions():
    db = SessionLocal()
    try:
        QUESTIONS = [
            {
                "text" : "Solve: x + 5 = 12",
                "options" : ["6", "7", "8", "9"],
                "correct_index" : 1,
                "subject" : "algebra",
                "difficulty" : 1,
                "is_lesson" : 1,
                "is_game" : 1
            },
            {
                "text" : "Solve: 3x = 18",
                "options" : ["3", "6", "9", "12"],
                "correct_index" : 1,
                "subject" : "algebra",
                "difficulty" : 1,
                "is_lesson" : 1,
                "is_game" : 1
            },
            {
                "text" : "Solve: x - 7 = 10",
                "options" : ["17", "3", "9", "21"],
                "correct_index" : 0,
                "subject" : "algebra",
                "difficulty" : 1,
                "is_lesson" : 1,
                "is_game" : 1 
            },
            {
                "text" : "Solve: 2x + 4 = 10",
                "options" : ["6", "3", "14", "12"],
                "correct_index" : 1,
                "subject" : "algebra",
                "difficulty" : 1, 
                "is_lesson" : 1, 
                "is_game" : 1 
            },
            {
                "text" : "Simplify: 5x + 3x", 
                "options" : ["8", "8x", "2x", "2"], 
                "correct_index" : 1, 
                "subject" : "algebra", 
                "difficulty" : 1, 
                "is_lesson" : 1, 
                "is_game" : 1 
            },
            {
                "text" : "Solve: 2x + 5 = 3x - 7", 
                "options" : ["10", "12", "14", "16"],
                "correct_index" : 1, 
                "subject" : "algebra", 
                "difficulty" : 2, 
                "is_lesson" : 1, 
                "is_game" : 1
            },
            {
                "text" : "Solve: x (x - 4) = 0", 
                "options" : ["4, 0", "0, 4", "3, 2", "5, 4"], 
                "correct_index" : 1, 
                "subject" : "algebra",
                "difficulty" : 2,
                "is_lesson" : 1, 
                "is_game" : 1 
            },
            {
                "text" : "Simplify: (2x - 3) (x + 1)", 
                "options" : ["2x^2 - x - 3", "3x - 2", "3x + 2", "2x^2 - x + 3"], 
                "correct_index" : 0, 
                "subject" : "algebra", 
                "difficulty" : 2, 
                "is_lesson" : 1, 
                "is_game" : 1 
            },
            { 
                "text" : "Solve: 3 (x + 2) = 2x + 11", 
                "options" : ["7", "4", "6", "5"], 
                "correct_index" : 3, 
                "subject" : "algebra", 
                "difficulty" : 2, 
                "is_lesson" : 1, 
                "is_game" : 1 
            },
            {
                "text" : "Solve: 4x - 7 = 2 (2x - 5)", 
                "options" : ["16", "21", "No Solution", "29"], 
                "correct_index" : 2, 
                "subject" : "algebra", 
                "difficulty" : 2, 
                "is_lesson" : 1, 
                "is_game" : 1 
            },
            {
                "text" : "Find the perimeter of a square with side 4", 
                "options" : ["10", "11", "16", "13"], 
                "correct_index" : 2, 
                "subject" : "geometry", 
                "difficulty" : 1, 
                "is_lesson" : 1, 
                "is_game" : 1 
            },
            {
                "text" : "Find the area of a rectangle: length 6, width 3", 
                "options" : ["36", "40", "18", "48"], 
                "correct_index" : 2, 
                "subject" : "geometry", 
                "difficulty" : 1, 
                "is_lesson" : 1, 
                "is_game" : 1 
            },
            {
                "text" : "How many degrees are in a triangle?", 
                "options" : ["360°", "180°", "90°", "60°"], 
                "correct_index" : 1, 
                "subject" : "geometry", 
                "difficulty" : 1, 
                "is_lesson" : 1, 
                "is_game" : 1 
            },
            {
                "text" : "Find the circumference of a circle with radius 7", 
                "options" : ["8π", "14π", "12π", "10π"], 
                "correct_index" : 1, 
                "subject" : "geometry", 
                "difficulty" : 1, 
                "is_lesson" : 1, 
                "is_game" : 1 
            },
            {
                "text" : "Find the area of a square with side 5", 
                "options" : ["10", "15", "25", "20"], 
                "correct_index" : 2, 
                "subject" : "geometry", 
                "difficulty" : 1, 
                "is_lesson" : 1, 
                "is_game" : 1 
            },
            {
                "text" : "Find the hypotenuse if legs are 6 and 8", 
                "options" : ["9", "10", "11", "12"], 
                "correct_index" : 1, 
                "subject" : "geometry", 
                "difficulty" : 2, 
                "is_lesson" : 1, 
                "is_game" : 1 
            },
            {
                "text" : "Find the area of a trapezoid with bases 6 and 10, height 4", 
                "options" : ["40", "32", "20", "46"], 
                "correct_index" : 1, 
                "subject" : "geometry", 
                "difficulty" : 2, 
                "is_lesson" : 1, 
                "is_game" : 1 
            },
            {
                "text" : "Find the circumference if diameter is 14", 
                "options" : ["7π", "28π", "14π", "15π"], 
                "correct_index" : 2, 
                "subject" : "geometry", 
                "difficulty" : 2, 
                "is_lesson" : 1, 
                "is_game" : 1 
            },
            {
                "text" : "Find the area of a circle with diameter 10", 
                "options" : ["20π", "25π", "5π", "10π"], 
                "correct_index" : 1, 
                "subject" : "geometry", 
                "difficulty" : 2, 
                "is_lesson" : 1, 
                "is_game" : 1 
            },
            {
                "text" : "Find the missing angle in a triangle with angles 35° and 65°", 
                "options" : ["15°", "70°", "80°", "45°"], 
                "correct_index" : 2, 
                "subject" : "geometry", 
                "difficulty" : 2, 
                "is_lesson" : 1, 
                "is_game" : 1 
            },
            {
                "text" : "Find sin 0°", 
                "options" : ["-1", "1/2", "0", "1"], 
                "correct_index" : 2, 
                "subject" : "trigonometry", 
                "difficulty" : 1, 
                "is_lesson" : 1, 
                "is_game" : 1 
            },
            {
                "text" : "Find cos 0°", 
                "options" : ["0", "1", "1/2", "-1"], 
                "correct_index" : 1, 
                "subject" : "trigonometry",
                "difficulty" : 1, 
                "is_lesson" : 1, 
                "is_game" : 1 
            },
            {
                "text" : "Find sin 90°", 
                "options" : ["1/3", "2/3", "1", "3/3"], 
                "correct_index" : 2, 
                "subject" : "trigonometry", 
                "difficulty" : 1, 
                "is_lesson" : 1, 
                "is_game" : 1 
            },
            {
                "text" : "Find tan 45°", 
                "options" : ["0", "-1", "1/2", "1"], 
                "correct_index" : 3, 
                "subject" : "trigonometry", 
                "difficulty" : 1, 
                "is_lesson" : 1, 
                "is_game" : 1 
            },
            {
                "text" : "Find sin 150°", 
                "options" : ["0", "1", "1/2", "-1"], 
                "correct_index" : 2, 
                "subject" : "trigonometry", 
                "difficulty" : 2, 
                "is_lesson" : 1, 
                "is_game" : 1 
            },
            {
                "text" : "Find cos 120°", 
                "options" : ["1/4", "-1/2", "-1/4", "1"], 
                "correct_index" : 1, 
                "subject" : "trigonometry", 
                "difficulty" : 2, 
                "is_lesson" : 1, 
                "is_game" : 1 
            },
            {
                "text" : "Find tan 225°", 
                "options" : ["1/2", "-1/2", "1", "-1"], 
                "correct_index" : 2, 
                "subject" : "trigonometry", 
                "difficulty" : 2, 
                "is_lesson" : 1, 
                "is_game" : 1 
            },
            {
                "text" : "Find the angle if sin θ = 1/2", 
                "options" : ["45°, 75°", "20°, 160°", "30°, 150°", "60°, 90°"], 
                "correct_index" : 2, 
                "subject" : "trigonometry", 
                "difficulty" : 2, 
                "is_lesson" : 1, 
                "is_game" : 1 
            },
            {
                "text" : "Simplify: sin^2x + cos^2x", 
                "options" : ["0", "-1", "-1/2", "1"], 
                "correct_index" : 3, 
                "subject" : "trigonometry", 
                "difficulty" : 2, 
                "is_lesson" : 1, 
                "is_game" : 1 
            },
            {
                "text" : "Solve: 7x - 3 = 11", 
                "options" : ["0", "3", "2", "1"], 
                "correct_index" : 2, 
                "subject" : "algebra", 
                "difficulty" : 1, 
                "is_lesson" : 0, 
                "is_game" : 1 
            },
            {
                "text" : "Solve: x/4 = 6", 
                "options" : ["24", "23", "22", "21"], 
                "correct_index" : 0,
                "subject" : "algebra", 
                "difficulty" : 1, 
                "is_lesson" : 0, 
                "is_game" : 1 
            },
            {
                "text" : "Simplify: 7(x + 2)", 
                "options" : ["7x + 9", "7x + 14", "7x - 14", "7x - 9"], 
                "correct_index" : 1, 
                "subject" : "algebra", 
                "difficulty" : 1, 
                "is_lesson" : 0, 
                "is_game" : 1 
            },
            { 
                "text" : "Solve: x + x = 14", 
                "options" : ["5", "4", "7", "8"], 
                "correct_index" : 2, 
                "subject" : "algebra", 
                "difficulty" : 1, 
                "is_lesson" : 0, 
                "is_game" : 1 
            },
            {
                "text" : "Solve: 2(x - 3) = 8", 
                "options" : ["4", "5", "6", "7"], 
                "correct_index" : 3, 
                "subject" : "algebra", 
                "difficulty" : 1, 
                "is_lesson" : 0, 
                "is_game" : 1 
            },
            {
                "text" : "Solve: x^2 = 16", 
                "options" : ["1", "3", "2", "4"], 
                "correct_index" : 3, 
                "subject" : "algebra", 
                "difficulty" : 2, 
                "is_lesson" : 0, 
                "is_game" : 1 
            },
            {
                "text" : "Solve: x^2 + 2x = 8", 
                "options" : ["0", "3", "2", "1"], 
                "correct_index" : 2, 
                "subject" : "algebra", 
                "difficulty" : 2, 
                "is_lesson" : 0, 
                "is_game" : 1 
            },
            {
                "text" : "Simplify: 6x/3", 
                "options" : ["16x", "2x", "25x", "6x"], 
                "correct_index" : 1, 
                "subject" : "algebra", 
                "difficulty" : 2, 
                "is_lesson" : 0, 
                "is_game" : 1 
            },
            {
                "text" : "Simplify (x + 3)^2", 
                "options" : ["2x^2 + 6x + 9", "2x^2 + 6x - 9", "2x^2 - 6x + 9", "2x^2 - 6x - 9"], 
                "correct_index" : 0, 
                "subject" : "algebra", 
                "difficulty" : 3, 
                "is_lesson" : 0, 
                "is_game" : 1 
            },
            {
                "text" : "Solve: x/3 + x/6 = 3", 
                "options" : ["9", "18", "6", "3"], 
                "correct_index" : 1, 
                "subject" : "algebra", 
                "difficulty" : 3, 
                "is_lesson" : 0, 
                "is_game" : 1 
            },
            { 
                "text" : "Find the height of a rectangle with an area of 28 and and length of 4", 
                "options" : ["5", "7", "9", "11"], 
                "correct_index" : 1, 
                "subject" : "geometry", 
                "difficulty" : 1, 
                "is_lesson" : 0, 
                "is_game" : 1
            },
            { 
                "text" : "Find the missing angle in a triangle with angles 35° and 95°",
                "options" : ["20°", "65°", "45°", "50°"], 
                "correct_index" : 3, 
                "subject" : "geometry", 
                "difficulty" : 1, 
                "is_lesson" : 0, 
                "is_game" : 1 
            },
            { 
                "text" : "Find the area of a square with a side length of 6", 
                "options" : ["24", "30", "36", "42"], 
                "correct_index" : 2, 
                "subject" : "geometry", 
                "difficulty" : 1, 
                "is_lesson" : 0, 
                "is_game" : 1 
            },
            { 
                "text" : "A right angle has how many degrees?", 
                "options" : ["180°", "0°", "45°", "90°"], 
                "correct_index" : 3, 
                "subject" : "geometry", 
                "difficulty" : 1, 
                "is_lesson" : 0, 
                "is_game" : 1 
            },
            { 
                "text" : "How many degrees does an obtuse angle have?", 
                "options" : [">90°", "<90°", ">180°", "<180°"], 
                "correct_index" : 0, 
                "subject" : "geometry", 
                "difficulty" : 1, 
                "is_lesson" : 0, 
                "is_game" : 1
            },
            { 
                "text" : "Find the volume of a cube with an edge length of 7", 
                "options" : ["343", "56", "49", "21"], 
                "correct_index" : 0, 
                "subject" : "geometry", 
                "difficulty" : 2, 
                "is_lesson" : 0, 
                "is_game" : 1 
            },
            { 
                "text" : "If the two angles of a triangle are 50° and 70° , respectively, then the third angle will be _______.", 
                "options" : ["10°", "20°", "45°", "60°"], 
                "correct_index" : 3, 
                "subject" : "geometry", 
                "difficulty" : 2, 
                "is_lesson" : 0, 
                "is_game" : 1 
            },
            { 
                "text" : "3 angles of a triangle add up to ______ degree.", 
                "options" : ["120°", "90°", "175°", "180°"], 
                "correct_index" : 3, 
                "subject" : "geometry", 
                "difficulty" : 2, 
                "is_lesson" : 0, 
                "is_game" : 1 
            },
            { 
                "text" : "Semicircle features ________ dimensions.", 
                "options" : ["2", "3", "4", "5"], 
                "correct_index" : 0, 
                "subject" : "geometry", 
                "difficulty" : 3, 
                "is_lesson" : 0, 
                "is_game" : 1 
            },
            { 
                "text" : "In a 30-60-90 triangle, the length of the hypotenuse is 6. What is the length of the shortest side?", 
                "options" : ["2", "3", "6", "5"], 
                "correct_index" : 1, 
                "subject" : "geometry", 
                "difficulty" : 3, 
                "is_lesson" : 0, 
                "is_game" : 1 
            },
            { 
                "text" : "In ∆ ABC, right-angled at B, AB = 24 cm, BC = 7 cm. The value of tan C is:", 
                "options" : ["12/7", " 24/7", " 20/7", "7/24"], 
                "correct_index" : 1, 
                "subject" : "trigonometry", 
                "difficulty" : 1, 
                "is_lesson" : 0, 
                "is_game" : 1 
            },
            { 
                "text" : "The value of tan 60°/cot 30° is equal to:", 
                "options" : ["0", "1", "4", "5"], 
                "correct_index" : 1, 
                "subject" : "trigonometry", 
                "difficulty" : 1, 
                "is_lesson" : 0, 
                "is_game" : 1 
            },
            { 
                "text" : "sin (90° - A) and cos A are:", 
                "options" : ["not related", "different", "same", "none of the above"], 
                "correct_index" : 2, 
                "subject" : "trigonometry", 
                "difficulty" : 1, 
                "is_lesson" : 0, 
                "is_game" : 1 
            },
            { 
                "text" : "If cos X = ⅔ then tan X is equal to:", 
                "options" : ["5/2", "√(5/2)", "√5/2", "2/√5"], 
                "correct_index" : 2, 
                "subject" : "trigonometry", 
                "difficulty" : 1, 
                "is_lesson" : 0, 
                "is_game" : 1 
            },
            { 
                "text" : "The value of (sin 45° + cos 45°) is ", 
                "options" : [" 1/√2", "√3/2", "1", "√2"], 
                "correct_index" : 3, 
                "subject" : "trigonometry", 
                "difficulty" : 1, 
                "is_lesson" : 0, 
                "is_game" : 1 
            },
            { 
                "text" : "If ∆ABC is right angled at C, then the value of cos(A+B) is", 
                "options" : ["0", "1", "1/2", "√3/2"], 
                "correct_index" : 0, 
                "subject" : "trigonometry", 
                "difficulty" : 2, 
                "is_lesson" : 0, 
                "is_game" : 1 
            },
            { 
                "text" : "The value of (tan 1° tan 2° tan 3° … tan 89°) is", 
                "options" : ["0", "1", "2", " 1/2"], 
                "correct_index" : 1, 
                "subject" : "trigonometry", 
                "difficulty" : 2, 
                "is_lesson" : 0, 
                "is_game" : 1 
            },
            { 
                "text" : "If cos X = a/b, then sin X is equal to:", 
                "options" : ["(b2-a2)/b", "(b-a)/b", "√(b2-a2)/b", "√(b-a)/b"], 
                "correct_index" : 2, 
                "subject" : "trigonometry", 
                "difficulty" : 2, 
                "is_lesson" : 0,
                "is_game" : 1 
            },
            { 
                "text" : "sin 2A = 2 sin A is true when A =", 
                "options" : ["30°", "45°", "0°", "50°"], 
                "correct_index" : 2, 
                "subject" : "trigonometry", 
                "difficulty" : 3, 
                "is_lesson" : 0, 
                "is_game" : 1 
            },
            { 
                "text" : "The value of sin 60° cos 30° + sin 30° cos 60° is:", 
                "options" : ["1", "0", "2", "3"], 
                "correct_index" : 0, 
                "subject" : "trigonometry", 
                "difficulty" : 3, 
                "is_lesson" : 0, 
                "is_game" : 1 
            },
        ]

        for q in QUESTIONS:
            exists = db.query(Question).filter(
                Question.text == q["text"]
            ).first()

            if not exists:
                db.add(Question(**q))

        db.commit()
    finally:
        db.close()

db = SessionLocal()
try:
    if db.query(Question).count() == 0:
        seed_questions()
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
