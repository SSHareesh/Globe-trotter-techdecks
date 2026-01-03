import { Moon, Sun, Globe } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <nav className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 border-b dark:border-slate-800 transition-colors">
      <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-teal-600">
        <Globe /> GlobeTrotter
      </Link>
      <div className="flex items-center gap-6">
        <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition">
          {isDarkMode ? <Sun className="text-yellow-400" /> : <Moon className="text-teal-600" />}
        </button>
        <Link to="/login" className="bg-teal-600 text-white px-5 py-2 rounded-full hover:bg-teal-700 transition font-medium">
          Login
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;