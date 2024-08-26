import React, { useState, useEffect } from 'react';

const ManageAttendance = () => {
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVisible, setToastVisible] = useState(false);

  useEffect(() => {
    fetch('http://127.0.0.1:5555/courses')
      .then(response => {
        console.log('Response status:', response.status);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Fetched courses data:', data);
        if (data && Array.isArray(data)) {
          setCourses(data);
        } else if (data && data.courses && Array.isArray(data.courses)) {
          setCourses(data.courses);
        } else {
          console.error('Unexpected data structure:', data);
        }
      })
      .catch(error => console.error('Error fetching courses:', error));
  }, []);

  const handleCourseSelect = (event) => {
    const courseId = event.target.value;
    setSelectedCourse(courseId);

    fetch(`http://127.0.0.1:5555/students`)
      .then(response => response.json())
      .then(data => {
        console.log('Fetched students data:', data);
        if (data && data.students && Array.isArray(data.students)) {
          setStudents(data.students.filter(student => student.course_id === parseInt(courseId)));
        } else {
          console.error('Invalid response data:', data);
        }
      })
      .catch(error => console.error('Error fetching students:', error));
  };

  const handleAttendanceChange = (studentId, isPresent) => {
    const student = students.find(student => student.id === studentId);
    const attendanceData = {
      student_id: studentId,
      course_id: selectedCourse,
      status: isPresent ? 'Present' : 'Absent',
      date: new Date().toISOString().split('T')[0]
    };

    fetch(`http://127.0.0.1:5555/attendances`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(attendanceData),
    })
      .then(response => {
        if (!response.ok) {
          return response.text().then(text => { throw new Error(text) });
        }
        return response.json();
      })
      .then(updatedAttendance => {
        console.log('Attendance updated:', updatedAttendance);
        setStudents(students.map(student =>
          student.id === studentId ? { ...student, isPresent } : student
        ));
        setToastMessage(`${student.name} is marked as ${isPresent ? 'Present' : 'Absent'}`);
        setToastVisible(true);
        // Hide toast after 1 second
        setTimeout(() => {
          setToastVisible(false);
        }, 1000);
      })
      .catch(error => console.error('Error updating attendance:', error));
  };

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-center">Manage Attendance</h1>
      <div className="mb-4">
        <select
          id="course-select"
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={handleCourseSelect}
        >
          <option value="">Select a course</option>
          {courses.map(course => (
            <option key={course.id} value={course.id}>
              {course.name}
            </option>
          ))}
        </select>
      </div>
      {selectedCourse && (
        <div className="students">
          <h2 className="text-2xl font-semibold mb-4">Students</h2>
          <table className="min-w-full bg-white border border-gray-300 rounded-lg">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Student ID</th>
                <th className="py-2 px-4 border-b">Student Name</th>
                <th className="py-2 px-4 border-b">Attendance</th>
              </tr>
            </thead>
            <tbody>
              {students.map(student => (
                <tr key={student.id} className="border-t">
                  <td className="py-2 px-4 border-r">{student.id}</td>
                  <td className="py-2 px-4 border-r">{student.name}</td>
                  <td className="py-2 px-4 border-r">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleAttendanceChange(student.id, true)}
                        className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        Present
                      </button>
                      <button
                        onClick={() => handleAttendanceChange(student.id, false)}
                        className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                      >
                        Absent
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {toastVisible && (
        <div className="fixed bottom-4 right-4 bg-blue-500 text-white p-3 rounded-lg shadow-lg">
          <p>{toastMessage}</p>
        </div>
      )}
    </div>
  );
};

export default ManageAttendance;
