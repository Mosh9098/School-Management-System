from flask import Flask
from flask_bcrypt import Bcrypt
from models import db, User, Student, Teacher, Course, Class, Enrollment, Grade, Attendance, StudentProfile, Progress
import datetime

app = Flask(__name__)
bcrypt = Bcrypt(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///your_database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

with app.app_context():
    # Drop all tables and create them again
    db.drop_all()
    db.create_all()

    # Create Users
    user1 = User(
        email='admin@example.com',
        password=bcrypt.generate_password_hash('adminpass').decode('utf-8'),
        role='Admin'
    )
    user2 = User(
        email='teacher@example.com',
        password=bcrypt.generate_password_hash('teacherpass').decode('utf-8'),
        role='Teacher'
    )
    user3 = User(
        email='student@example.com',
        password=bcrypt.generate_password_hash('studentpass').decode('utf-8'),
        role='Student'
    )
    db.session.add_all([user1, user2, user3])
    db.session.commit()

    # Create Teachers
    teacher1 = Teacher(
        user_id=user2.id,
        name='Dennis Kiboi'
    )
    db.session.add(teacher1)
    db.session.commit()

    # Create Students
    student1 = Student(
        user_id=user3.id,
        name='Molly Nzembi',
        enrollment_date=datetime.datetime.utcnow().date(),
        date_of_birth=datetime.date(2000, 1, 1),
        gender='Female',
        phone_number='123-456-7890',
        course_id=1
    )
    db.session.add(student1)
    db.session.commit()

    # Create Student Profiles
    student_profile1 = StudentProfile(
        student_id=student1.id,
        enrollment_number='S123456789',
        course='Software Development',
        year_of_study=1
    )
    db.session.add(student_profile1)
    db.session.commit()

    # Create Courses
    course1 = Course(
        name='Software development',
        description='Programming class',
        schedule='MWF 9-10 AM',
        teacher_id=teacher1.id
    )
    db.session.add(course1)
    db.session.commit()

    # Create Classes
    class1 = Class(
        name='Class 1',
        description='Classroom 1',
        schedule='MWF 11-12 AM',
        teacher_id=teacher1.id
    )
    db.session.add(class1)
    db.session.commit()

    # Enrollments
    enrollment1 = Enrollment(
        student_id=student1.id,
        course_id=course1.id,
        class_id=class1.id
    )
    db.session.add(enrollment1)
    db.session.commit()

    # Grades
    grade1 = Grade(
        student_id=student1.id,
        course_id=course1.id,
        class_id=class1.id,
        grade='A'
    )
    db.session.add(grade1)
    db.session.commit()

    # Attendance
    attendance1 = Attendance(
        student_id=student1.id,
        course_id=course1.id,
        class_id=class1.id,
        date=datetime.datetime.utcnow().date(),
        status='Present'
    )
    db.session.add(attendance1)
    db.session.commit()

    # Create Progress
    progress = Progress(
        student_id=student1.id,
        course_id=course1.id,
        class_id=class1.id,
        progress_percentage= 50
    )
    db.session.add(progress)
    db.session.commit()


    print("Database seeded successfully!")
