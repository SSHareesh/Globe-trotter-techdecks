import { Moon, Sun, Globe, LogOut, User } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { user, logout } = useAuth();

  return (
    <nav className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 border-b dark:border-slate-800 transition-colors sticky top-0 z-50">
      <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-teal-600">
        <Globe /> GlobeTrotter
      </Link>

      <div className="flex items-center gap-4">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition mr-2"
          aria-label="Toggle theme"
        >
          {isDarkMode ? <Sun className="text-yellow-400" /> : <Moon className="text-teal-600" />}
        </button>

        {user ? (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 dark:bg-slate-800 rounded-full border dark:border-slate-700">
              {user.profile_image ? (
                <img src={user.profile_image} alt={user.name} className="w-6 h-6 rounded-full object-cover" />
              ) : (
                <User size={18} className="text-gray-500" />
              )}
              <span className="text-sm font-medium dark:text-gray-200">{user.name}</span>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition text-sm font-medium"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        ) : (
          <Link to="/login" className="bg-teal-600 text-white px-6 py-2 rounded-full hover:bg-teal-700 transition font-medium shadow-sm">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;