import { Link, Routes, Route } from 'react-router-dom';
import { HomeIcon, UserIcon, AcademicCapIcon, CalendarIcon, ChartBarIcon, UsersIcon } from '@heroicons/react/24/outline';
import Profile from '../components/student/Profile';
import Grades from '../components/student/Grades';
import Attendance from '../components/student/Attendance';
import Progress from '../components/student/Progress';
import AssignedTeachers from '../components/student/AssignedTeachers';
import Sdashboard from '../components/student/Sdashboard';

const StudentDashboard = () => {
  return (
    <div className="flex">
      <aside className="w-1/4 bg-purple-700 text-white h-screen p-4">
        <nav>
          <ul className="space-y-6">
            <li>
              <Link to="dashboard" className="flex items-center space-x-4 hover:text-gray-300">
                <HomeIcon className="h-6 w-6" />
                <span className="text-lg">Dashboard</span>
              </Link>
            </li>
            <li>
              <Link to="profile" className="flex items-center space-x-4 hover:text-gray-300">
                <UserIcon className="h-6 w-6" />
                <span className="text-lg">Profile</span>
              </Link>
            </li>
            <li>
              <Link to="grades" className="flex items-center space-x-4 hover:text-gray-300">
                <AcademicCapIcon className="h-6 w-6" />
                <span className="text-lg">Grades</span>
              </Link>
            </li>
            <li>
              <Link to="attendance" className="flex items-center space-x-4 hover:text-gray-300">
                <CalendarIcon className="h-6 w-6" />
                <span className="text-lg">Attendance</span>
              </Link>
            </li>
            <li>
              <Link to="progress" className="flex items-center space-x-4 hover:text-gray-300">
                <ChartBarIcon className="h-6 w-6" />
                <span className="text-lg">Progress</span>
              </Link>
            </li>
            <li>
              <Link to="assigned-teachers" className="flex items-center space-x-4 hover:text-gray-300">
                <UsersIcon className="h-6 w-6" />
                <span className="text-lg">Assigned Teachers</span>
              </Link>
            </li>
          </ul>
        </nav>
      </aside>
      <main className="w-3/4 p-4">
        <Routes>
          <Route path="dashboard" element={<Sdashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="grades" element={<Grades />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="progress" element={<Progress />} />
          <Route path="assigned-teachers" element={<AssignedTeachers />} />
        </Routes>
      </main>
    </div>
  );
};

export default StudentDashboard;