import { Link, Routes, Route } from 'react-router-dom';
import ManageStudents from '../components/admin/ManageStudents';
import ManageTeachers from '../components/admin/ManageTeachers';
import ManageCourses from '../components/admin/ManageCourses';
import ManageClasses from '../components/admin/ManageClasses';
import Reports from '../components/admin/Reports';

const AdminDashboard = () => {
  return (
    <div className="flex">
      <aside className="w-1/4 bg-purple-700 text-white h-screen p-4">
        <nav>
          <ul className="space-y-4">
            <li>
              <Link to="manage-students" className="hover:text-gray-300">Manage Students</Link>
            </li>
            <li>
              <Link to="manage-teachers" className="hover:text-gray-300">Manage Teachers</Link>
            </li>
            <li>
              <Link to="manage-courses" className="hover:text-gray-300">Manage Courses</Link>
            </li>
            <li>
              <Link to="manage-classes" className="hover:text-gray-300">Manage Classes</Link>
            </li>
            <li>
              <Link to="reports" className="hover:text-gray-300">Reports</Link>
            </li>
          </ul>
        </nav>
      </aside>
      <main className="w-3/4 p-4">
        <Routes>
          <Route path="manage-students" element={<ManageStudents />} />
          <Route path="manage-teachers" element={<ManageTeachers />} />
          <Route path="manage-courses" element={<ManageCourses />} />
          <Route path="manage-classes" element={<ManageClasses />} />
          <Route path="reports" element={<Reports />} />
        </Routes>
      </main>
    </div>
  );
};

export default AdminDashboard;
