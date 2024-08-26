import os
from flask import Flask, request, jsonify, make_response, url_for
from flask_bcrypt import Bcrypt
from flask_migrate import Migrate
from flask_restful import Api, Resource
from flask_cors import CORS
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, create_refresh_token, get_jwt_identity
from itsdangerous import URLSafeTimedSerializer, SignatureExpired, BadSignature
from models import db, User, Student, Teacher, Course, Class, Grade, Enrollment, Attendance, StudentProfile, Progress
from datetime import datetime
from config import Config
from utils.email import send_email
from utils.image import process_and_upload_image
from utils.error_handling import handle_bad_request, handle_unauthorized, handle_forbidden, handle_not_found, handle_internal_error
from cloudinary.uploader import upload
from cloudinary.utils import cloudinary_url


# Initialize the Flask application
app = Flask(__name__)
app.config.from_object(Config)

# Initialize CORS, Bcrypt, and Migrate
CORS(app, resources={r"/*": {"origins": "*"}})
bcrypt = Bcrypt(app)
db.init_app(app)
migrate = Migrate(app, db)
api = Api(app)

# Initialize JWT Manager
jwt = JWTManager(app)

# URLSafeTimedSerializer for generating and verifying tokens
serializer = URLSafeTimedSerializer(app.config['SECRET_KEY'])

# Error Handling for JWT
@jwt.unauthorized_loader
def unauthorized_callback(error):
    return handle_unauthorized("Missing or invalid token")

@jwt.expired_token_loader
def expired_token_callback(jwt_header, jwt_payload):
    return handle_unauthorized("Token has expired")

@jwt.needs_fresh_token_loader
def needs_fresh_token_callback(jwt_header, jwt_payload):
    return handle_unauthorized("Fresh token required")

# Index route
class Index(Resource):
    def get(self):
        return {"message": "Welcome to Study Sphere App"}

api.add_resource(Index, '/')

# CRUD operations for Users
class Users(Resource):
    # @jwt_required()
    def get(self):
        users = User.query.all()
        users_list = [user.to_dict() for user in users]
        return make_response(jsonify({"count": len(users_list), "users": users_list}), 200)

    def post(self):
        hashed_password = bcrypt.generate_password_hash(request.json.get("password")).decode('utf-8')
        new_user = User(
            email=request.json.get("email"),
            password=hashed_password,
            role=request.json.get("role")
        )
        db.session.add(new_user)
        db.session.commit()

        # Generate email verification token
        token = serializer.dumps(new_user.email, salt='email-confirm')

        # Build the verification URL
        verify_url = url_for('verifyemail', token=token, _external=True)

        # Send verification email
        subject = "Please verify your email address"
        content = f"Click the link to verify your email: {verify_url}"
        send_email(new_user.email, subject, content, from_email=app.config['DEFAULT_FROM_EMAIL'])

        return make_response(jsonify(new_user.to_dict()), 201)

class VerifyEmail(Resource):
    def get(self, token):
        try:
            email = serializer.loads(token, salt='email-confirm', max_age=3600)
        except SignatureExpired:
            return handle_bad_request("The token has expired")
        except BadSignature:
            return handle_bad_request("Invalid token")

        user = User.query.filter_by(email=email).first_or_404()
        return make_response(jsonify({"msg": "Email verified successfully"}), 200)

class UserResource(Resource):
    # @jwt_required()
    def get(self, user_id):
        user = User.query.get_or_404(user_id)
        return make_response(jsonify(user.to_dict()), 200)

    # @jwt_required()
    def put(self, user_id):
        user = User.query.get_or_404(user_id)
        if request.json.get("email"):
            user.email = request.json.get("email")
        if request.json.get("password"):
            user.password = bcrypt.generate_password_hash(request.json.get("password")).decode('utf-8')
        if request.json.get("role"):
            user.role = request.json.get("role")
        db.session.commit()
        return make_response(jsonify(user.to_dict()), 200)

    # @jwt_required()
    def delete(self, user_id):
        user = User.query.get_or_404(user_id)
        db.session.delete(user)
        db.session.commit()
        return make_response("", 204)

# Route for user login and JWT generation
class Login(Resource):
    def post(self):
        email = request.json.get('email')
        password = request.json.get('password')

        user = User.query.filter_by(email=email).first()
        if user and bcrypt.check_password_hash(user.password, password):
            access_token = create_access_token(identity=user.id)
            return jsonify(access_token=access_token)
        return handle_unauthorized("Invalid credentials")

api.add_resource(Users, '/users')
api.add_resource(UserResource, '/users/<int:user_id>')
api.add_resource(Login, '/login')
api.add_resource(VerifyEmail, '/verify/<token>')

# CRUD operations for Students
class Students(Resource):
    # @jwt_required()
    def get(self):
        students = Student.query.all()
        students_list = [student.to_dict() for student in students]
        return make_response(jsonify({"count": len(students_list), "students": students_list}), 200)

    # @jwt_required()
    def post(self):
        new_student = Student(
            user_id=request.json.get("user_id"),
            name=request.json.get("name"),
            enrollment_date=datetime.strptime(request.json.get("enrollment_date"), '%Y-%m-%d'),
            date_of_birth=datetime.strptime(request.json.get("date_of_birth"), '%Y-%m-%d'),
            gender=request.json.get("gender"),
            phone_number=request.json.get("phone_number"),
            course_id=request.json.get("course_id"),
        )
        db.session.add(new_student)
        db.session.commit()
        return make_response(jsonify(new_student.to_dict()), 201)

class StudentResource(Resource):
    # @jwt_required()
    def get(self, student_id):
        student = Student.query.get_or_404(student_id)
        return make_response(jsonify(student.to_dict()), 200)

    # @jwt_required()
    def put(self, student_id):
        student = Student.query.get_or_404(student_id)
        if request.json.get("name"):
            student.name = request.json.get("name")
        if request.json.get("enrollment_date"):
            student.enrollment_date = datetime.strptime(request.json.get("enrollment_date"), '%Y-%m-%d')
        if request.json.get("date_of_birth"):
            student.date_of_birth = datetime.strptime(request.json.get("date_of_birth"), '%Y-%m-%d')
        if request.json.get("gender"):
            student.gender = request.json.get("gender")
        if request.json.get("phone_number"):
            student.phone_number = request.json.get("phone_number")
        if request.json.get("course_id"):
            student.course_id = request.json.get("course_id")    
        db.session.commit()
        return make_response(jsonify(student.to_dict()), 200)

    # @jwt_required()
    def delete(self, student_id):
        student = Student.query.get_or_404(student_id)
        db.session.delete(student)
        db.session.commit()
        return make_response("", 204)

api.add_resource(Students, '/students')
api.add_resource(StudentResource, '/students/<int:student_id>')

# CRUD operations for Student Profile
class StudentProfile(Resource):
    # @jwt_required()
    def get(self):
        students = Student.query.all()
        students_list = [student.to_dict() for student in students]
        return make_response(jsonify(students_list), 200)

    # @jwt_required()
    def put(self):
        user_id = get_jwt_identity()
        student = Student.query.filter_by(user_id=user_id).first_or_404()

        if request.json.get("name"):
            student.name = request.json.get("name")
        if request.json.get("enrollment_date"):
            try:
                student.enrollment_date = datetime.strptime(request.json.get("enrollment_date"), '%Y-%m-%d')
            except ValueError:
                return make_response(jsonify({"error": "Invalid date format"}), 400)
        if request.json.get("date_of_birth"):
            try:
                student.date_of_birth = datetime.strptime(request.json.get("date_of_birth"), '%Y-%m-%d')
            except ValueError:
                return make_response(jsonify({"error": "Invalid date format"}), 400)
        if request.json.get("gender"):
            student.gender = request.json.get("gender")
        if request.json.get("phone_number"):
            student.phone_number = request.json.get("phone_number")

        db.session.commit()
        return make_response(jsonify(student.to_dict()), 200)

    # @jwt_required()
    def delete(self):
        user_id = get_jwt_identity()
        student = Student.query.filter_by(user_id=user_id).first_or_404()

        db.session.delete(student)
        db.session.commit()
        return make_response("", 204)

api.add_resource(StudentProfile, '/profiles')

# CRUD operations for Teachers
class Teachers(Resource):
    # @jwt_required()
    def get(self):
        teachers = Teacher.query.all()
        teachers_list = [teacher.to_dict() for teacher in teachers]
        return make_response(jsonify({"count": len(teachers_list), "teachers": teachers_list}), 200)

    # @jwt_required()
    def post(self):
        new_teacher = Teacher(
            user_id=request.json.get("user_id"),
            name=request.json.get("name")
        )
        db.session.add(new_teacher)
        db.session.commit()
        return make_response(jsonify(new_teacher.to_dict()), 201)

class TeacherResource(Resource):
    # @jwt_required()
    def get(self, teacher_id):
        teacher = Teacher.query.get_or_404(teacher_id)
        return make_response(jsonify(teacher.to_dict()), 200)

    # @jwt_required()
    def put(self, teacher_id):
        teacher = Teacher.query.get_or_404(teacher_id)
        if request.json.get("name"):
            teacher.name = request.json.get("name")
        db.session.commit()
        return make_response(jsonify(teacher.to_dict()), 200)

    # @jwt_required()
    def delete(self, teacher_id):
        teacher = Teacher.query.get_or_404(teacher_id)
        db.session.delete(teacher)
        db.session.commit()
        return make_response("", 204)

api.add_resource(Teachers, '/teachers')
api.add_resource(TeacherResource, '/teachers/<int:teacher_id>')

# CRUD operations for Courses
class Courses(Resource):
    # @jwt_required()
    def get(self):
        courses = Course.query.all()
        courses_list = [course.to_dict() for course in courses]
        return make_response(jsonify({"count": len(courses_list), "courses": courses_list}), 200)

    # @jwt_required()
    def post(self):
        new_course = Course(
            name=request.json.get("name"),
            description=request.json.get("description"),
            schedule=request.json.get("schedule"),
            teacher_id=request.json.get("teacher_id")
        )
        db.session.add(new_course)
        db.session.commit()
        return make_response(jsonify(new_course.to_dict()), 201)

class CourseResource(Resource):
    # @jwt_required()
    def get(self, course_id):
        course = Course.query.get_or_404(course_id)
        return make_response(jsonify(course.to_dict()), 200)

    # @jwt_required()
    def put(self, course_id):
        course = Course.query.get_or_404(course_id)
        if request.json.get("name"):
            course.name = request.json.get("name")
        if request.json.get("description"):
            course.description = request.json.get("description")
        if request.json.get("schedule"):
            course.schedule = request.json.get("schedule")
        if request.json.get("teacher_id"):
            course.teacher_id = request.json.get("teacher_id")
        db.session.commit()
        return make_response(jsonify(course.to_dict()), 200)

    # @jwt_required()
    def delete(self, course_id):
        course = Course.query.get_or_404(course_id)
        db.session.delete(course)
        db.session.commit()
        return make_response("", 204)

api.add_resource(Courses, '/courses')
api.add_resource(CourseResource, '/courses/<int:course_id>')

# CRUD operations for Classes
class Classes(Resource):
    # @jwt_required()
    def get(self):
        classes = Class.query.all()
        classes_list = [class_.to_dict() for class_ in classes]
        return make_response(jsonify({"count": len(classes_list), "classes": classes_list}), 200)

    # @jwt_required()
    def post(self):
        new_class = Class(
            name=request.json.get("name"),
            teacher_id=request.json.get("teacher_id")
        )
        db.session.add(new_class)
        db.session.commit()
        return make_response(jsonify(new_class.to_dict()), 201)

class ClassResource(Resource):
    # @jwt_required()
    def get(self, class_id):
        class_ = Class.query.get_or_404(class_id)
        return make_response(jsonify(class_.to_dict()), 200)

    # @jwt_required()
    def put(self, class_id):
        class_ = Class.query.get_or_404(class_id)
        if request.json.get("name"):
            class_.name = request.json.get("name")
        if request.json.get("teacher_id"):
            class_.teacher_id = request.json.get("teacher_id")
        db.session.commit()
        return make_response(jsonify(class_.to_dict()), 200)

    # @jwt_required()
    def delete(self, class_id):
        class_ = Class.query.get_or_404(class_id)
        db.session.delete(class_)
        db.session.commit()
        return make_response("", 204)

api.add_resource(Classes, '/classes')
api.add_resource(ClassResource, '/classes/<int:class_id>')

# CRUD operations for Grades
class Grades(Resource):
    # @jwt_required()
    def get(self):
        grades = Grade.query.all()
        grades_list = [grade.to_dict() for grade in grades]
        return make_response(jsonify({"count": len(grades_list), "grades": grades_list}), 200)

    # @jwt_required()
    def post(self):
        new_grade = Grade(
            student_id=request.json.get("student_id"),
            course_name=request.json.get("course_name"),
            grade=request.json.get("grade")
        )
        db.session.add(new_grade)
        db.session.commit()
        return make_response(jsonify(new_grade.to_dict()), 201)

class GradeResource(Resource):
    # @jwt_required()
    def get(self, grade_id):
        grade = Grade.query.get_or_404(grade_id)
        return make_response(jsonify(grade.to_dict()), 200)

    # @jwt_required()
    def put(self, grade_id):
        grade = Grade.query.get_or_404(grade_id)
        if request.json.get("grade"):
            grade.grade = request.json.get("grade")
        db.session.commit()
        return make_response(jsonify(grade.to_dict()), 200)

    # @jwt_required()
    def delete(self, grade_id):
        grade = Grade.query.get_or_404(grade_id)
        db.session.delete(grade)
        db.session.commit()
        return make_response("", 204)

api.add_resource(Grades, '/grades')
api.add_resource(GradeResource, '/grades/<int:grade_id>')

# CRUD operations for Enrollments
class Enrollments(Resource):
    # @jwt_required()
    def get(self):
        enrollments = Enrollment.query.all()
        enrollments_list = [enrollment.to_dict() for enrollment in enrollments]
        return make_response(jsonify({"count": len(enrollments_list), "enrollments": enrollments_list}), 200)

    # @jwt_required()
    def post(self):
        new_enrollment = Enrollment(
            student_id=request.json.get("student_id"),
            course_name=request.json.get("course_name"),
            enrollment_date=datetime.strptime(request.json.get("enrollment_date"), '%Y-%m-%d')
        )
        db.session.add(new_enrollment)
        db.session.commit()
        return make_response(jsonify(new_enrollment.to_dict()), 201)

class EnrollmentResource(Resource):
    # @jwt_required()
    def get(self, enrollment_id):
        enrollment = Enrollment.query.get_or_404(enrollment_id)
        return make_response(jsonify(enrollment.to_dict()), 200)

    # @jwt_required()
    def put(self, enrollment_id):
        enrollment = Enrollment.query.get_or_404(enrollment_id)
        if request.json.get("enrollment_date"):
            enrollment.enrollment_date = datetime.strptime(request.json.get("enrollment_date"), '%Y-%m-%d')
        db.session.commit()
        return make_response(jsonify(enrollment.to_dict()), 200)

    # @jwt_required()
    def delete(self, enrollment_id):
        enrollment = Enrollment.query.get_or_404(enrollment_id)
        db.session.delete(enrollment)
        db.session.commit()
        return make_response("", 204)

api.add_resource(Enrollments, '/enrollments')
api.add_resource(EnrollmentResource, '/enrollments/<int:enrollment_id>')

# CRUD operations for Attendances
class Attendances(Resource):
    # @jwt_required()
    def get(self):
        attendances = Attendance.query.all()
        attendances_list = [attendance.to_dict() for attendance in attendances]
        return make_response(jsonify({"count": len(attendances_list), "attendances": attendances_list}), 200)

    # @jwt_required()
    def post(self):
        new_attendance = Attendance(
            student_id=request.json.get("student_id"),
            class_id=request.json.get("class_id"),
            date=datetime.strptime(request.json.get("date"), '%Y-%m-%d'),
            status=request.json.get("status")
        )
        db.session.add(new_attendance)
        db.session.commit()
        return make_response(jsonify(new_attendance.to_dict()), 201)

class AttendanceResource(Resource):
    # @jwt_required()
    def get(self, attendance_id):
        attendance = Attendance.query.get_or_404(attendance_id)
        return make_response(jsonify(attendance.to_dict()), 200)

    # @jwt_required()
    def put(self, attendance_id):
        attendance = Attendance.query.get_or_404(attendance_id)
        if request.json.get("status"):
            attendance.status = request.json.get("status")
        db.session.commit()
        return make_response(jsonify(attendance.to_dict()), 200)

    # @jwt_required()
    def delete(self, attendance_id):
        attendance = Attendance.query.get_or_404(attendance_id)
        db.session.delete(attendance)
        db.session.commit()
        return make_response("", 204)

api.add_resource(Attendances, '/attendances')
api.add_resource(AttendanceResource, '/attendances/<int:attendance_id>')

# CRUD operations for Progress
class Progresses(Resource):
    # @jwt_required()
    def get(self):
        progresses = Progress.query.all()
        progresses_list = [progress.to_dict() for progress in progresses]
        return make_response(jsonify({"count": len(progresses_list), "progresses": progresses_list}), 200)

    # @jwt_required()
    def post(self):
        data = request.get_json()
        new_progress = Progress(
            student_id=data.get("student_id"),
            course_id=data.get("course_id"),
            class_id=data.get("class_id"),
            progress=data.get("progress")
        )
        db.session.add(new_progress)
        db.session.commit()
        return make_response(jsonify(new_progress.to_dict()), 201)

class ProgressResource(Resource):
    # @jwt_required()
    def get(self, progress_id):
        progress = Progress.query.get_or_404(progress_id)
        return make_response(jsonify(progress.to_dict()), 200)

    # @jwt_required()
    def put(self, progress_id):
        data = request.get_json()
        progress = Progress.query.get_or_404(progress_id)
        
        if data.get("student_id"):
            progress.student_id = data.get("student_id")
        if data.get("course_id"):
            progress.course_id = data.get("course_id")
        if data.get("class_id"):
            progress.class_id = data.get("class_id")
        if data.get("progress"):
            progress.progress = data.get("progress")
        
        db.session.commit()
        return make_response(jsonify(progress.to_dict()), 200)

    # @jwt_required()
    def delete(self, progress_id):
        progress = Progress.query.get_or_404(progress_id)
        db.session.delete(progress)
        db.session.commit()
        return make_response("", 204)

api.add_resource(Progresses, '/progresses')
api.add_resource(ProgressResource, '/progresses/<int:progress_id>')

class ImageUpload(Resource):
    # @jwt_required()
    def post(self):
        if 'file' not in request.files:
            return handle_bad_request("No file part in the request")

        file = request.files['file']

        if file.filename == '':
            return handle_bad_request("No selected file")

        try:
            # Upload the file to Cloudinary
            result = upload(file, folder="uploads/students")
            url = result.get("url")
            return jsonify({"message": "Image uploaded successfully", "url": url}), 201

        except Exception as e:
            return handle_internal_error(f"Failed to upload image: {str(e)}")

api.add_resource(ImageUpload, '/upload')


# Global error handling
@app.errorhandler(400)
def bad_request_error(error):
    return handle_bad_request(str(error))

@app.errorhandler(401)
def unauthorized_error(error):
    return handle_unauthorized(str(error))

@app.errorhandler(403)
def forbidden_error(error):
    return handle_forbidden(str(error))

@app.errorhandler(404)
def not_found_error(error):
    return handle_not_found(str(error))

@app.errorhandler(500)
def internal_error(error):
    return handle_internal_error("An unexpected error occurred.")

if __name__ == '__main__':
    app.run(port=5555, debug=True)
