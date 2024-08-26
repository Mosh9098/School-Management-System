import React, { useState, useEffect } from 'react';

const Progress = () => {
  const [progress, setProgress] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5555/progresses');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const contentType = response.headers.get('Content-Type');
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();

          const filteredProgresses = data.progresses.map(({ id, class_id, student_id, ...rest }) => rest);
          setProgress(filteredProgresses[0]); 
        } else {
          throw new Error('Unexpected content type: ' + contentType);
        }
      } catch (error) {
        setError(error);
        console.error('Error fetching progress:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-lg shadow-lg">
      <h1 className="text-3xl font-extrabold mb-6 text-center text-gray-800">Student Progress</h1>
      {error && <p className="text-red-600 text-center mb-6 text-lg">Error: {error.message}</p>}
      <table className="w-full bg-white rounded-lg shadow-md border border-gray-300">
        <thead>
          <tr className="bg-gray-100 text-gray-700">
            <th className="border-b border-gray-300 px-6 py-3 text-left">Attribute</th>
            <th className="border-b border-gray-300 px-6 py-3 text-left">Details</th>
          </tr>
        </thead>
        <tbody>
          {progress ? (
            <>
              <tr className="hover:bg-gray-50">
                <td className="border-b border-gray-300 px-6 py-4 font-medium">Course Name</td>
                <td className="border-b border-gray-300 px-6 py-4">{progress.course_name}</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="border-b border-gray-300 px-6 py-4 font-medium">Progress Percentage</td>
                <td className="border-b border-gray-300 px-6 py-4">{progress.progress_percentage}%</td>
              </tr>
            </>
          ) : (
            !error && (
              <tr>
                <td colSpan="2" className="border-b border-gray-300 px-6 py-4 text-center text-gray-500">Loading progress...</td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Progress;
