import React, { useState, useEffect } from 'react';

const AssignedTeachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://127.0.0.1:5555/teachers')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setTeachers(data.teachers);
        setLoading(false); 
      })
      .catch(error => {
        setError(error);
        setLoading(false); 
        console.error('Error fetching teachers:', error);
      });
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-4 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4 text-center">Assigned Teachers</h1>
      {error && <p className="text-red-500 text-center mb-4">Error: {error.message}</p>}
      {loading ? (
        <p className="text-center">Loading teachers...</p>
      ) : (
        <table className="table-auto w-full border-collapse border border-gray-200">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-left">Teacher ID</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Name</th>
            </tr>
          </thead>
          <tbody>
            {teachers.length > 0 ? (
              teachers.map(teacher => (
                <tr key={teacher.id}>
                  <td className="border border-gray-300 px-4 py-2">{teacher.id}</td>
                  <td className="border border-gray-300 px-4 py-2">{teacher.name}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2" className="border border-gray-300 px-4 py-2 text-center">
                  No teachers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AssignedTeachers;
