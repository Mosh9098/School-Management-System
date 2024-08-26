import React, { useState, useEffect } from 'react';

const ManageStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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
      <h1 className="text-3xl font-bold mb-6 text-center">Manage Students</h1>
      <table className="min-w-full bg-white border border-gray-300 rounded-lg">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Student ID</th>
            <th className="py-2 px-4 border-b">Student Name</th>
            <th className="py-2 px-4 border-b">Enrollment Date</th>
            <th className="py-2 px-4 border-b">Phone No</th>
          </tr>
        </thead>
        <tbody>
          {students.length > 0 ? (
            students.map(student => (
              <tr key={student.id} className="border-t">
                <td className="py-2 px-4 border-r">{student.id}</td>
                <td className="py-2 px-4 border-r">{student.name}</td>
                <td className="py-2 px-4 border-r">{student.enrollment_date}</td>
                <td className="py-2 px-4">{student.phone_number}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center py-4">
                No students found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ManageStudents;