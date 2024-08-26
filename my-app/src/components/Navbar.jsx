import { Link } from 'react-router-dom';
import { HomeIcon, InformationCircleIcon, PhoneIcon, ArrowRightOnRectangleIcon, ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline';

const Navbar = ({ isAuthenticated, userRole, logout }) => {
  return (
    <nav className="bg-purple-700 text-white p-4 sticky top-0 z-10">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-lg font-bold flex items-center">
          <img src="/logo.png" alt="Student Sphere Logo" className="h-10 w-10 mr-2 rounded-full shadow-lg" />
          Student Sphere
        </Link>
        <div className="flex space-x-4 items-center">
          <Link to="/" className="flex items-center hover:text-gray-300">
            <HomeIcon className="h-5 w-5 mr-1 text-white" />
            Home
          </Link>
          <Link to="/about" className="flex items-center hover:text-gray-300">
            <InformationCircleIcon className="h-5 w-5 mr-1 text-white" />
            About
          </Link>
          <Link to="/contact" className="flex items-center hover:text-gray-300">
            <PhoneIcon className="h-5 w-5 mr-1 text-white" />
            Contact
          </Link>

          {!isAuthenticated ? (
            <Link to="/login" className="flex items-center hover:text-gray-300">
              <ArrowRightOnRectangleIcon className="h-5 w-5 mr-1 text-white" />
              Login
            </Link>
          ) : (
            <>
              {userRole === 'admin' && (
                <Link to="/admin" className="flex items-center hover:text-gray-300">
                  <InformationCircleIcon className="h-5 w-5 mr-1 text-white" />
                  Admin Page
                </Link>
              )}
              {userRole === 'teacher' && (
                <Link to="/teacher" className="flex items-center hover:text-gray-300">
                  <InformationCircleIcon className="h-5 w-5 mr-1 text-white" />
                  Teacher Page
                </Link>
              )}
              {userRole === 'student' && (
                <Link to="/student" className="flex items-center hover:text-gray-300">
                  <InformationCircleIcon className="h-5 w-5 mr-1 text-white" />
                  Student Page
                </Link>
              )}
              <button onClick={logout} className="flex items-center hover:text-gray-300">
                <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-1 text-white" />
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

