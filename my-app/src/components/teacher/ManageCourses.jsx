import React, { useState, useEffect } from 'react';

const ManageCourses = () => {
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://127.0.0.1:5555/courses')
      .then(response => response.json())
      .then(data => {
        if (data && data.courses && Array.isArray(data.courses)) {
          setCourses(data.courses);
        } else {
          setError(new Error('Invalid response data'));
        }
      })
      .catch(error => {
        setError(error);
      });

    fetch('http://127.0.0.1:5555/enrollments')
      .then(response => response.json())
      .then(data => {
        if (data && data.enrollments && Array.isArray(data.enrollments)) {
          setEnrollments(data.enrollments);
        } else {
          setError(new Error('Invalid response data'));
        }
      })
      .catch(error => {
        setError(error);
      });

    fetch('http://127.0.0.1:5555/students')
      .then(response => response.json())
      .then(data => {
        if (data && data.students && Array.isArray(data.students)) {
          setStudents(data.students);
        } else {
          setError(new Error('Invalid response data'));
        }
        setLoading(false);
      })
      .catch(error => {
        setError(error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-center">Courses Assigned</h1>
      {courses.map(course => (
        <div key={course.id} className="mb-8">
          <h2 className="text-2xl font-semibold mb-2">{course.name}</h2>
          <p className="mb-4 text-gray-700">Schedule: {course.schedule}</p>
          <table className="min-w-full bg-white border border-gray-300 rounded-lg">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Student ID</th>
                <th className="py-2 px-4 border-b">Student Name</th>
              </tr>
            </thead>
            <tbody>
              {enrollments
                .filter(enrollment => enrollment.course_id === course.id)
                .map(enrollment => {
                  const student = students.find(student => student.id === enrollment.student_id);
                  return (
                    <tr key={enrollment.id} className="border-t">
                      <td className="py-2 px-4 border-r">{student.id}</td>
                      <td className="py-2 px-4">{student.name}</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default ManageCourses;