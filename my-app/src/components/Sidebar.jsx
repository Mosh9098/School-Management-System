import { NavLink } from 'react-router-dom';

const Sidebar = ({ links }) => {
  return (
    <div className="w-64 bg-purple-700 min-h-screen text-white">
      <div className="p-4 text-lg font-semibold">Portal</div>
      <nav className="flex flex-col p-4 space-y-2">
        {links.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            className={({ isActive }) =>
              `p-2 rounded hover:bg-purple-500 ${
                isActive ? 'bg-purple-600' : ''
              }`
            }
          >
            {link.name}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
