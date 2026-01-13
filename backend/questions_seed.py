from backend.database import SessionLocal
from backend.models import Question

db = SessionLocal()

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
db.close()

print("Success")
