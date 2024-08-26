import React, { useState, useEffect } from 'react';
import { TailSpin } from 'react-loader-spinner';
import { FaEdit, FaSave, FaTrashAlt } from 'react-icons/fa';

const ManageCourses = () => {
  const [courses, setCourses] = useState([]);
  const [editingCourse, setEditingCourse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [newCourse, setNewCourse] = useState({
    name: '',
    description: '',
    schedule: '',
    teacher_id: '',
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:5555/courses');
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      setCourses(data.courses || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddCourse = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:5555/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCourse),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const addedCourse = await response.json();
      setCourses([...courses, addedCourse]);
      setNewCourse({
        name: '',
        description: '',
        schedule: '',
        teacher_id: '',
      });
    } catch (error) {
      console.error('Error adding course:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditCourse = (course) => {
    setEditingCourse(course);
  };

  const handleSaveCourse = async (courseId, updatedCourse) => {
    setLoading(true);
    try {
      const response = await fetch(`http://127.0.0.1:5555/courses/${courseId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedCourse),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const savedCourse = await response.json();
      setCourses(
        courses.map((course) =>
          course.id === courseId ? savedCourse : course
        )
      );
      setEditingCourse(null);
    } catch (error) {
      console.error('Error saving course:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    setLoading(true);
    try {
      const response = await fetch(`http://127.0.0.1:5555/courses/${courseId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      setCourses(courses.filter((course) => course.id !== courseId));
    } catch (error) {
      console.error('Error deleting course:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewCourseChange = (e) => {
    const { name, value } = e.target;
    setNewCourse({
      ...newCourse,
      [name]: value,
    });
  };

  const handleEditCourseChange = (e) => {
    const { name, value } = e.target;
    setEditingCourse({
      ...editingCourse,
      [name]: value,
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-4 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-center">Manage Courses</h1>
      
      {/* Add New Course Form */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Add New Course</h2>
        <input
          type="text"
          name="name"
          value={newCourse.name}
          onChange={handleNewCourseChange}
          placeholder="Course Name"
          className="w-full p-2 border border-gray-300 rounded-lg mb-2"
        />
        <input
          type="text"
          name="description"
          value={newCourse.description}
          onChange={handleNewCourseChange}
          placeholder="Course Description"
          className="w-full p-2 border border-gray-300 rounded-lg mb-2"
        />
        <input
          type="text"
          name="schedule"
          value={newCourse.schedule}
          onChange={handleNewCourseChange}
          placeholder="Course Schedule"
          className="w-full p-2 border border-gray-300 rounded-lg mb-2"
        />
        <input
          type="number"
          name="teacher_id"
          value={newCourse.teacher_id}
          onChange={handleNewCourseChange}
          placeholder="Teacher ID"
          className="w-full p-2 border border-gray-300 rounded-lg mb-4"
        />
        <button
          onClick={handleAddCourse}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600"
        >
          Add Course
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <TailSpin color="blue" radius="8px" width={50} height={50} />
        </div>
      ) : (
        <table className="min-w-full bg-white border border-gray-300 rounded-lg">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">ID</th>
              <th className="py-2 px-4 border-b">Name</th>
              <th className="py-2 px-4 border-b">Description</th>
              <th className="py-2 px-4 border-b">Schedule</th>
              <th className="py-2 px-4 border-b">Teacher ID</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.id} className="border-t">
                <td className="py-2 px-4 border-r">{course.id}</td>
                <td className="py-2 px-4 border-r">
                  {editingCourse?.id === course.id ? (
                    <input
                      type="text"
                      name="name"
                      value={editingCourse.name}
                      onChange={handleEditCourseChange}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                  ) : (
                    course.name
                  )}
                </td>
                <td className="py-2 px-4 border-r">
                  {editingCourse?.id === course.id ? (
                    <input
                      type="text"
                      name="description"
                      value={editingCourse.description}
                      onChange={handleEditCourseChange}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                  ) : (
                    course.description
                  )}
                </td>
                <td className="py-2 px-4 border-r">
                  {editingCourse?.id === course.id ? (
                    <input
                      type="text"
                      name="schedule"
                      value={editingCourse.schedule}
                      onChange={handleEditCourseChange}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                  ) : (
                    course.schedule
                  )}
                </td>
                <td className="py-2 px-4 border-r">
                  {editingCourse?.id === course.id ? (
                    <input
                      type="number"
                      name="teacher_id"
                      value={editingCourse.teacher_id}
                      onChange={handleEditCourseChange}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                  ) : (
                    course.teacher_id
                  )}
                </td>
                <td className="py-2 px-4">
                  {editingCourse?.id === course.id ? (
                    <>
                      <button
                        onClick={() => handleSaveCourse(course.id, editingCourse)}
                        className="bg-green-500 text-white px-2 py-1 rounded-lg shadow mr-2 hover:bg-green-600"
                      >
                        <FaSave />
                      </button>
                      <button
                        onClick={() => setEditingCourse(null)}
                        className="bg-red-500 text-white px-2 py-1 rounded-lg shadow hover:bg-red-600"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEditCourse(course)}
                        className="bg-yellow-500 text-white px-2 py-1 rounded-lg shadow mr-2 hover:bg-yellow-600"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteCourse(course.id)}
                        className="bg-red-500 text-white px-2 py-1 rounded-lg shadow hover:bg-red-600"
                      >
                        <FaTrashAlt />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ManageCourses;
