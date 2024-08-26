import React, { useState, useEffect } from 'react';
import { FaEdit, FaSave, FaTrashAlt } from 'react-icons/fa';
import { TailSpin } from 'react-loader-spinner';

const ManageClasses = () => {
  const [classes, setClasses] = useState([]);
  const [editingClass, setEditingClass] = useState(null);
  const [loading, setLoading] = useState(false);
  const [newClass, setNewClass] = useState({ name: '', description: '', schedule: '', teacher_id: '', count: 0 });

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:5555/classes');
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      setClasses(data.classes || []);
    } catch (error) {
      console.error('Error fetching classes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddClass = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:5555/classes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newClass),
      });
      if (!response.ok) {
        throw new Error('Failed to add class');
      }
      const createdClass = await response.json();
      setClasses([...classes, createdClass]);
      setNewClass({ name: '', description: '', schedule: '', teacher_id: '', count: 0 });
    } catch (error) {
      console.error('Error adding class:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClass = (classItem) => {
    setEditingClass({ ...classItem });
  };

  const handleSaveClass = async (classId, updatedClass) => {
    setLoading(true);
    try {
      const response = await fetch(`http://127.0.0.1:5555/classes/${classId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedClass),
      });
      if (!response.ok) {
        throw new Error('Failed to update class');
      }
      const updatedData = await response.json();
      setClasses(classes.map(classItem => 
        classItem.id === classId ? updatedData : classItem
      ));
      setEditingClass(null);
    } catch (error) {
      console.error('Error updating class:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingClass(null);
  };

  const handleDeleteClass = async (classId) => {
    setLoading(true);
    try {
      const response = await fetch(`http://127.0.0.1:5555/classes/${classId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete class');
      }
      setClasses(classes.filter(classItem => classItem.id !== classId));
    } catch (error) {
      console.error('Error deleting class:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewClass(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <div className="max-w-6xl mx-auto p-4 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-center">Manage Classes</h1>

      <div className="mb-4">
        <h2 className="text-2xl font-bold mb-2">Add Class</h2>
        <input
          type="text"
          name="name"
          value={newClass.name}
          onChange={handleInputChange}
          placeholder="Class Name"
          className="border border-gray-300 p-2 rounded-lg mr-2"
        />
        <input
          type="text"
          name="description"
          value={newClass.description}
          onChange={handleInputChange}
          placeholder="Description"
          className="border border-gray-300 p-2 rounded-lg mr-2"
        />
        <input
          type="text"
          name="schedule"
          value={newClass.schedule}
          onChange={handleInputChange}
          placeholder="Schedule"
          className="border border-gray-300 p-2 rounded-lg mr-2"
        />
        <input
          type="text"
          name="teacher_id"
          value={newClass.teacher_id}
          onChange={handleInputChange}
          placeholder="Teacher ID"
          className="border border-gray-300 p-2 rounded-lg mr-2"
        />
        <input
          type="number"
          name="count"
          value={newClass.count}
          onChange={handleInputChange}
          placeholder="Count"
          className="border border-gray-300 p-2 rounded-lg mr-2"
        />
        <button
          onClick={handleAddClass}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600"
        >
          Add Class
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
              <th className="py-2 px-4 border-b">Count</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {classes.map(classItem => (
              <tr key={classItem.id} className="border-t">
                <td className="py-2 px-4 border-r">{classItem.id}</td>
                <td className="py-2 px-4 border-r">
                  {editingClass?.id === classItem.id ? (
                    <input
                      type="text"
                      value={editingClass.name}
                      onChange={(e) =>
                        setEditingClass({ ...editingClass, name: e.target.value })
                      }
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                  ) : (
                    classItem.name
                  )}
                </td>
                <td className="py-2 px-4 border-r">
                  {editingClass?.id === classItem.id ? (
                    <input
                      type="text"
                      value={editingClass.description}
                      onChange={(e) =>
                        setEditingClass({ ...editingClass, description: e.target.value })
                      }
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                  ) : (
                    classItem.description
                  )}
                </td>
                <td className="py-2 px-4 border-r">
                  {editingClass?.id === classItem.id ? (
                    <input
                      type="text"
                      value={editingClass.schedule}
                      onChange={(e) =>
                        setEditingClass({ ...editingClass, schedule: e.target.value })
                      }
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                  ) : (
                    classItem.schedule
                  )}
                </td>
                <td className="py-2 px-4 border-r">
                  {editingClass?.id === classItem.id ? (
                    <input
                      type="text"
                      value={editingClass.teacher_id}
                      onChange={(e) =>
                        setEditingClass({ ...editingClass, teacher_id: e.target.value })
                      }
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                  ) : (
                    classItem.teacher_id
                  )}
                </td>
                <td className="py-2 px-4 border-r">
                  {editingClass?.id === classItem.id ? (
                    <input
                      type="number"
                      value={editingClass.count}
                      onChange={(e) =>
                        setEditingClass({ ...editingClass, count: parseInt(e.target.value, 10) })
                      }
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                  ) : (
                    classItem.count
                  )}
                </td>
                <td className="py-2 px-4 border-r">
                  {editingClass?.id === classItem.id ? (
                    <>
                      <button
                        onClick={() => handleSaveClass(classItem.id, editingClass)}
                        className="text-green-500 hover:text-green-600 mr-2"
                      >
                        <FaSave />
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="text-gray-500 hover:text-gray-600"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEditClass(classItem)}
                        className="text-blue-500 hover:text-blue-600 mr-2"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteClass(classItem.id)}
                        className="text-red-500 hover:text-red-600"
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

export default ManageClasses;
