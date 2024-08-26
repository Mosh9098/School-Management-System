import React, { useState, useEffect } from 'react';
import emailjs from 'emailjs-com';
import { FaEdit, FaSave, FaTrashAlt } from 'react-icons/fa';
import { TailSpin } from 'react-loader-spinner';

const ManageTeachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [loading, setLoading] = useState(false);
  const [newTeacher, setNewTeacher] = useState({ name: '', user_id: '' });

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:5555/teachers');
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      setTeachers(data.teachers || []);
    } catch (error) {
      console.error('Error fetching teachers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddTeacher = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:5555/teachers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTeacher),
      });
      if (!response.ok) {
        throw new Error('Failed to add teacher');
      }
      const createdTeacher = await response.json();
      setTeachers([...teachers, createdTeacher]);
      setNewTeacher({ name: '', user_id: '' });
    } catch (error) {
      console.error('Error adding teacher:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditTeacher = (teacher) => {
    setEditingTeacher({ ...teacher });
  };

  const handleSaveTeacher = async (teacherId, updatedTeacher) => {
    setLoading(true);
    try {
      const response = await fetch(`http://127.0.0.1:5555/teachers/${teacherId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTeacher),
      });
      if (!response.ok) {
        throw new Error('Failed to update teacher');
      }
      const updatedData = await response.json();
      setTeachers(teachers.map(teacher => 
        teacher.id === teacherId ? updatedData : teacher
      ));
      setEditingTeacher(null);

      if (updatedTeacher.email) {
        sendEmailNotification(updatedTeacher.email, updatedTeacher.name);
      }
    } catch (error) {
      console.error('Error updating teacher:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingTeacher(null);
  };

  const handleDeleteTeacher = async (teacherId) => {
    setLoading(true);
    try {
      const response = await fetch(`http://127.0.0.1:5555/teachers/${teacherId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete teacher');
      }
      setTeachers(teachers.filter(teacher => teacher.id !== teacherId));
    } catch (error) {
      console.error('Error deleting teacher:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle input changes for new teacher
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTeacher(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const sendEmailNotification = (email, name) => {
    const serviceId = 'your_service_id';
    const templateId = 'your_template_id';
    const userId = 'your_user_id';
    const templateParams = {
      to_name: name,
      to_email: email,
      message: `Dear ${name}, you have been successfully added to the Study Sphere platform as a teacher. Welcome aboard!`,
    };

    emailjs.send(serviceId, templateId, templateParams, userId)
      .then((response) => {
        console.log('Email sent successfully!', response.status, response.text);
      })
      .catch((error) => {
        console.error('Failed to send email...', error);
      });
  };

  return (
    <div className="max-w-6xl mx-auto p-4 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-center">Manage Teachers</h1>

      <div className="mb-4">
        <h2 className="text-2xl font-bold mb-2">Add Teacher</h2>
        <input
          type="text"
          name="name"
          value={newTeacher.name}
          onChange={handleInputChange}
          placeholder="Name"
          className="border border-gray-300 p-2 rounded-lg mr-2"
        />
        <input
          type="text"
          name="user_id"
          value={newTeacher.user_id}
          onChange={handleInputChange}
          placeholder="User ID"
          className="border border-gray-300 p-2 rounded-lg mr-2"
        />
        <button
          onClick={handleAddTeacher}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600"
        >
          Add Teacher
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
              <th className="py-2 px-4 border-b">User ID</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {teachers.map(teacher => (
              <tr key={teacher.id} className="border-t">
                <td className="py-2 px-4 border-r">{teacher.id}</td>
                <td className="py-2 px-4 border-r">
                  {editingTeacher?.id === teacher.id ? (
                    <input
                      type="text"
                      value={editingTeacher.name}
                      onChange={(e) =>
                        setEditingTeacher({ ...editingTeacher, name: e.target.value })
                      }
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                  ) : (
                    teacher.name
                  )}
                </td>
                <td className="py-2 px-4 border-r">
                  {editingTeacher?.id === teacher.id ? (
                    <input
                      type="text"
                      value={editingTeacher.user_id || ''}
                      onChange={(e) =>
                        setEditingTeacher({ ...editingTeacher, user_id: e.target.value })
                      }
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                  ) : (
                    teacher.user_id
                  )}
                </td>
                <td className="py-2 px-4">
                  {editingTeacher?.id === teacher.id ? (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleSaveTeacher(teacher.id, editingTeacher)}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg shadow hover:bg-green-600"
                      >
                        <FaSave />
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="bg-gray-500 text-white px-4 py-2 rounded-lg shadow hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditTeacher(teacher)}
                        className="bg-yellow-500 text-white px-4 py-2 rounded-lg shadow hover:bg-yellow-600"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteTeacher(teacher.id)}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600"
                      >
                        <FaTrashAlt />
                      </button>
                    </div>
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

export default ManageTeachers;

