import React, { useState, useEffect } from 'react';

const Attendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://127.0.0.1:5555/attendances')  
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setAttendance(data.attendances);
      })
      .catch(error => {
        setError(error);
        console.error('Error fetching attendance:', error);
      });
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-4 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4 text-center">Attendance Records</h1>
      {error && <p className="text-red-500 text-center mb-4">Error: {error.message}</p>}
      <table className="table-auto w-full border-collapse border border-gray-200">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2 text-left">Course ID</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Class ID</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Date</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {attendance.length > 0 ? (
            attendance.map(record => (
              <tr key={record.id}>
                <td className="border border-gray-300 px-4 py-2">{record.course_id}</td>
                <td className="border border-gray-300 px-4 py-2">{record.class_id}</td>
                <td className="border border-gray-300 px-4 py-2">{new Date(record.date).toLocaleDateString()}</td>
                <td className="border border-gray-300 px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded-full text-white ${
                      record.status === 'Present' ? 'bg-green-500' : 'bg-red-500'
                    }`}
                  >
                    {record.status}
                  </span>
                </td>
              </tr>
            ))
          ) : (
            !error && (
              <tr>
                <td colSpan="4" className="border border-gray-300 px-4 py-2 text-center">
                  Loading attendance records...
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Attendance;

