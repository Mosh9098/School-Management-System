from marshmallow import Schema, fields, validate

class UserSchema(Schema):
    name = fields.Str(required=True, validate=validate.Length(min=1))
    email_address = fields.Email(required=True)
    password = fields.Str(required=True, validate=validate.Length(min=6))

class StudentSchema(Schema):
    name = fields.Str(required=True, validate=validate.Length(min=1))
    email_address = fields.Email(required=True)
    password = fields.Str(required=True, validate=validate.Length(min=6))
    student_number = fields.Str()

class TeacherSchema(Schema):
    name = fields.Str(required=True, validate=validate.Length(min=1))
    email_address = fields.Email(required=True)
    password = fields.Str(required=True, validate=validate.Length(min=6))
    staff_number = fields.Str()

class ClassSchema(Schema):
    name = fields.Str(required=True, validate=validate.Length(min=1))
    description = fields.Str()
    schedule = fields.Str(required=True)
    teacher_id = fields.Int(required=True)

class CourseSchema(Schema):
    course_code = fields.Str(required=True)
    name = fields.Str(required=True, validate=validate.Length(min=1))

class GradeSchema(Schema):
    student_id = fields.Int(required=True)
    course_id = fields.Int(required=True)
    grade = fields.Float(required=True, validate=validate.Range(min=0, max=100))

class EnrollmentSchema(Schema):
    student_id = fields.Int(required=True)
    class_id = fields.Int(required=True)

class AttendanceSchema(Schema):
    student_id = fields.Int(required=True)
    class_id = fields.Int(required=True)
    date = fields.Date(required=True)
    status = fields.Str(required=True, validate=validate.OneOf(["present", "absent", "excused"]))
