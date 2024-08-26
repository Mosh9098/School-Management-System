import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';

const ManageGrades = () => {
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);

  useEffect(() => {
    fetch('http://127.0.0.1:5555/courses')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch courses');
        }
        return response.json();
      })
      .then(data => {
        if (data && data.courses && Array.isArray(data.courses)) {
          setCourses(data.courses);
        } else {
          console.error('Invalid response data for courses:', data);
        }
      })
      .catch(error => console.error('Error fetching courses:', error));
  }, []);

  const handleCourseSelect = (event) => {
    const courseId = event.target.value;
    setSelectedCourse(courseId);

    if (courseId) {
      fetch(`http://127.0.0.1:5555/students/${courseId}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to fetch students');
          }
          return response.json();
        })
        .then(data => {
          if (data && data.students && Array.isArray(data.students)) {
            setStudents(data.students);
            const initialGrades = data.students.reduce((acc, student) => {
              acc[student.id] = student.grade || '';
              return acc;
            }, {});
            formik.setValues({ grades: initialGrades });
          } else if (data && !Array.isArray(data.students)) {
            setStudents([data]);
            formik.setValues({ grades: { [data.id]: data.grade || '' } });
          } else {
            console.error('Invalid response data for students:', data);
          }
        })
        .catch(error => console.error('Error fetching students:', error));
    } else {
      setStudents([]);
      formik.setValues({ grades: {} });
    }
  };

  const formik = useFormik({
    initialValues: {
      grades: {},
    },
    onSubmit: (values) => {
      const missingFields = Object.entries(values.grades).some(([studentId, grade]) => !grade);

      if (missingFields) {
        alert('Cannot update grades. Please ensure all fields are filled.');
        return;
      }

      Promise.all(
        Object.entries(values.grades).map(([studentId, grade]) =>
          fetch(`http://127.0.0.1:5555/grades/${studentId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ grade }),
          })
        )
      )
      .then(() => {
        alert('Grades updated successfully');
      })
      .catch(error => console.error('Error updating grades:', error));
    },
  });

  const printGrades = () => {
    const printWindow = window.open('', '', 'height=600,width=800');
    printWindow.document.write('<html><head><title>Print Grades</title>');
    printWindow.document.write('</head><body >');
    printWindow.document.write('<h1>Students Grades</h1>');
    printWindow.document.write('<table border="1" style="width:100%; border-collapse:collapse;">');
    printWindow.document.write('<tr><th>Student ID</th><th>Student Name</th><th>Grade</th></tr>');

    students.forEach(student => {
      printWindow.document.write(
        `<tr>
          <td>${student.id}</td>
          <td>${student.name}</td>
          <td>${formik.values.grades[student.id] || ''}</td>
        </tr>`
      );
    });

    printWindow.document.write('</table>');
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-center">Manage Grades</h1>
      <div className="mb-4">
        <select
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={handleCourseSelect}
          value={selectedCourse || ''}
        >
          <option value="">Select a Course</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.name}
            </option>
          ))}
        </select>
      </div>
      {selectedCourse && (
        <form onSubmit={formik.handleSubmit}>
          <h2 className="text-2xl font-semibold mb-4">Students</h2>
          <table className="min-w-full bg-white border border-gray-300 rounded-lg mb-4">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Student ID</th>
                <th className="py-2 px-4 border-b">Student Name</th>
                <th className="py-2 px-4 border-b">Grade</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id} className="border-t">
                  <td className="py-2 px-4 border-r">{student.id}</td>
                  <td className="py-2 px-4 border-r">{student.name}</td>
                  <td className="py-2 px-4 border-r">
                    <input
                      type="text"
                      name={`grades.${student.id}`}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={formik.values.grades[student.id] || ''}
                      onChange={formik.handleChange}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Update
          </button>
          <button
            type="button"
            onClick={printGrades}
            className="ml-4 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Print Grades
          </button>
        </form>
      )}
    </div>
  );
};

export default ManageGrades;
