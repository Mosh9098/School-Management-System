import React, { useState, useEffect } from 'react';
import { FaTrashAlt, FaPlus } from 'react-icons/fa';

const ManageStudents = () => {
  const [students, setStudents] = useState([]);
  const [newStudent, setNewStudent] = useState({
    name: '',
    date_of_birth: '',
    gender: '',
    phone_number: '',
    enrollment_date: '',
    course_id: '',
    user_id: ''
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5555/students');
      const data = await response.json();
      setStudents(data.students);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const handleInputChange = (e) => {
    setNewStudent({
      ...newStudent,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddStudent = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5555/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newStudent),
      });
      if (response.ok) {
        const addedStudent = await response.json();
        setStudents([...students, addedStudent]);
        setNewStudent({
          name: '',
          date_of_birth: '',
          gender: '',
          phone_number: '',
          enrollment_date: '',
          course_id: '',
          user_id: ''
        });
      } else {
        console.error('Error adding student:', response.statusText);
      }
    } catch (error) {
      console.error('Error adding student:', error);
    }
  };

  const handleDeleteStudent = async (id) => {
    try {
      const response = await fetch(`http://127.0.0.1:5555/students/${id}`, { 
        method: 'DELETE',
      });
      if (response.ok) {
        setStudents(students.filter(student => student.id !== id));
      } else {
        console.error('Error deleting student:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting student:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Students</h1>

      <div className="mb-4">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={newStudent.name}
          onChange={handleInputChange}
          className="border p-2 mb-2 mr-2"
        />
        <input
          type="date"
          name="date_of_birth"
          placeholder="Date of Birth"
          value={newStudent.date_of_birth}
          onChange={handleInputChange}
          className="border p-2 mb-2 mr-2"
        />
        <input
          type="text"
          name="gender"
          placeholder="Gender"
          value={newStudent.gender}
          onChange={handleInputChange}
          className="border p-2 mb-2 mr-2"
        />
        <input
          type="text"
          name="phone_number"
          placeholder="Phone Number"
          value={newStudent.phone_number}
          onChange={handleInputChange}
          className="border p-2 mb-2 mr-2"
        />
        <input
          type="date"
          name="enrollment_date"
          placeholder="Enrollment Date"
          value={newStudent.enrollment_date}
          onChange={handleInputChange}
          className="border p-2 mb-2 mr-2"
        />
        <input
          type="number"
          name="course_id"
          placeholder="Course ID"
          value={newStudent.course_id}
          onChange={handleInputChange}
          className="border p-2 mb-2 mr-2"
        />
        <input
          type="text"
          name="user_id"
          placeholder="User ID"
          value={newStudent.user_id}
          onChange={handleInputChange}
          className="border p-2 mb-2 mr-2"
        />
        <button
          onClick={handleAddStudent}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600"
        >
          <FaPlus className="inline-block mr-2" />
          Add Student
        </button>
      </div>

      {students.length === 0 ? (
        <p>No students found.</p>
      ) : (
        <table className="table-auto w-full">
          <thead>
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Date of Birth</th>
              <th className="px-4 py-2">Gender</th>
              <th className="px-4 py-2">Phone Number</th>
              <th className="px-4 py-2">Enrollment Date</th>
              <th className="px-4 py-2">Course ID</th>
              <th className="px-4 py-2">User ID</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map(student => (
              <tr key={student.id}>
                <td className="border px-4 py-2">{student.name}</td>
                <td className="border px-4 py-2">{new Date(student.date_of_birth).toLocaleDateString()}</td>
                <td className="border px-4 py-2">{student.gender}</td>
                <td className="border px-4 py-2">{student.phone_number}</td>
                <td className="border px-4 py-2">{new Date(student.enrollment_date).toLocaleDateString()}</td>
                <td className="border px-4 py-2">{student.course_id}</td>
                <td className="border px-4 py-2">{student.user_id}</td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => handleDeleteStudent(student.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded-lg shadow hover:bg-red-600"
                  >
                    <FaTrashAlt />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ManageStudents;


