import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Sdashboard = () => {
  const [progressPercentage, setProgressPercentage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5555/progresses'); 
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const progress = data.progresses[0];
        setProgressPercentage(progress.progress_percentage); 
      } catch (error) {
        console.error('Error fetching progress:', error);
      }
    };

    fetchProgress();
  }, []);

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 p-8">
      <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">Dashboard</h1>
      <h2 className="text-xl font-semibold mb-4 text-center text-gray-700">
        <p><b>Welcome to the student's Dashboard!</b></p>
      </h2>
      <div className="flex justify-around flex-wrap gap-4">
        <div
          className="bg-gradient-to-r from-green-400 to-green-600 p-6 rounded-lg shadow-lg text-white hover:from-green-500 hover:to-green-700 transition duration-300 cursor-pointer"
          onClick={() => handleNavigate('/student/profile')}
        >
          <h2 className="text-xl font-semibold mb-2">Profile</h2>
          <p>Profile information.</p>
        </div>
        <div
          className="bg-gradient-to-r from-blue-400 to-blue-600 p-6 rounded-lg shadow-lg text-white hover:from-blue-500 hover:to-blue-700 transition duration-300 cursor-pointer"
          onClick={() => handleNavigate('/student/grades')}
        >
          <h2 className="text-xl font-semibold mb-2">Grades</h2>
          <p>Grades and academic performance.</p>
        </div>
        <div
          className="bg-gradient-to-r from-yellow-400 to-yellow-600 p-6 rounded-lg shadow-lg text-white hover:from-yellow-500 hover:to-yellow-700 transition duration-300 cursor-pointer"
          onClick={() => handleNavigate('/student/attendance')}
        >
          <h2 className="text-xl font-semibold mb-2">Attendance</h2>
          <p>Attendance record.</p>
        </div>
        <div
          className="bg-gradient-to-r from-red-400 to-red-600 p-6 rounded-lg shadow-lg text-white hover:from-red-500 hover:to-red-700 transition duration-300 cursor-pointer"
          onClick={() => handleNavigate('/student/progress')}
        >
          <h2 className="text-xl font-semibold mb-2">Progress</h2>
          <p>Total Progress: <b>{progressPercentage !== null ? `${progressPercentage}%` : 'Loading...'}</b></p>
        </div>
      </div>
    </div>
  );
};

export default Sdashboard;