import { Link, Routes, Route } from 'react-router-dom';
import ManageGrades from '../components/teacher/ManageGrades';
import ManageAttendance from '../components/teacher/ManageAttendance';
import ManageCourses from '../components/teacher/ManageCourses';
import ManageStudents from '../components/teacher/ManageStudents'

const TeacherDashboard = () => {
  return (
    <div className="flex">
      <aside className="w-1/4 bg-purple-700 text-white h-screen p-4">
        <nav>
          <ul className="space-y-4">
            <li>
              <Link to="manage-grades" className="hover:text-gray-300">Manage Grades</Link>
            </li>
            <li>
              <Link to="manage-attendance" className="hover:text-gray-300">Manage Attendance</Link>
            </li>
            <li>
              <Link to="manage-courses" className="hover:text-gray-300">Courses Assigned</Link>
            </li>
            <li>
              <Link to="manage-students" className="hover:text-gray-300">Student Details</Link>
            </li>
          </ul>
        </nav>
      </aside>
      <main className="w-3/4 p-4">
        <Routes>
          <Route path="manage-grades" element={<ManageGrades />} />
          <Route path="manage-attendance" element={<ManageAttendance />} />
          <Route path="manage-courses" element={<ManageCourses />} />
          <Route path="manage-students" element={<ManageStudents />} />
        </Routes>
      </main>
    </div>
  );
};

export default TeacherDashboard;
