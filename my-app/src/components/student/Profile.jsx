import React, { useState, useEffect } from 'react';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5555/profile'); 

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const contentType = response.headers.get('Content-Type');
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          setProfile(data[0]); 
        } else {
          throw new Error('Unexpected content type: ' + contentType);
        }
      } catch (error) {
        setError(error);
        console.error('Error fetching profile:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gradient-to-r from-green-50 via-blue-50 to-purple-50 rounded-lg shadow-lg">
      <h1 className="text-3xl font-extrabold mb-6 text-center text-gray-800">Student Profile</h1>
      {error && <p className="text-red-600 text-center mb-6 text-lg">Error: {error.message}</p>}
      <table className="w-full bg-white rounded-lg shadow-md border border-gray-300">
        <thead>
          <tr className="bg-gray-200 text-gray-700">
            <th className="border-b border-gray-300 px-6 py-3 text-left">Attribute</th>
            <th className="border-b border-gray-300 px-6 py-3 text-left">Details</th>
          </tr>
        </thead>
        <tbody>
          {profile ? (
            <>
              <tr className="hover:bg-gray-50">
                <td className="border-b border-gray-300 px-6 py-4 font-medium">Name</td>
                <td className="border-b border-gray-300 px-6 py-4">{profile.name}</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="border-b border-gray-300 px-6 py-4 font-medium">Gender</td>
                <td className="border-b border-gray-300 px-6 py-4">{profile.gender}</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="border-b border-gray-300 px-6 py-4 font-medium">Date of Birth</td>
                <td className="border-b border-gray-300 px-6 py-4">{profile.date_of_birth}</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="border-b border-gray-300 px-6 py-4 font-medium">Enrollment Date</td>
                <td className="border-b border-gray-300 px-6 py-4">{profile.enrollment_date}</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="border-b border-gray-300 px-6 py-4 font-medium">Phone Number</td>
                <td className="border-b border-gray-300 px-6 py-4">{profile.phone_number}</td>
              </tr>
            </>
          ) : (
            !error && (
              <tr>
                <td colSpan="2" className="border-b border-gray-300 px-6 py-4 text-center text-gray-500">Loading profile...</td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Profile;


