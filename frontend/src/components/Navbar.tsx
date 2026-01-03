import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Bell, User, Globe, MapPin, Users, Calendar, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const navLinks = [
    { path: '/dashboard', label: 'Home', icon: Globe },
    { path: '/trips', label: 'My Trips', icon: MapPin },
    { path: '/community', label: 'Community', icon: Users },
    { path: '/calendar', label: 'Calendar', icon: Calendar }
  ];

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/dashboard" className="flex items-center space-x-2">
            <Globe className="h-8 w-8 text-green-600" />
            <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">
              GlobeTrotter
            </span>
          </Link>

          <div className="hidden lg:flex items-center space-x-1 ml-8">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${isActive
                    ? 'text-green-600 bg-green-50'
                    : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                    }`}
                >
                  <Icon className="h-5 w-5" />
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
              <Bell className="h-6 w-6" />
            </button>

            {user ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate('/profile')}
                  className="flex items-center gap-2 p-1 pl-2 pr-3 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-full border border-gray-100 transition-colors"
                >
                  {user.profile_image ? (
                    <img src={user.profile_image.startsWith('http') ? user.profile_image : `http://127.0.0.1:8000${user.profile_image}`} alt={user.name} className="h-8 w-8 rounded-full object-cover" />
                  ) : (
                    <User className="h-5 w-5" />
                  )}
                  <span className="text-sm font-medium">{user.name.split(' ')[0]}</span>
                </button>
                <button
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                  className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <Link to="/" className="bg-green-600 text-white px-5 py-2 rounded-full hover:bg-green-700 transition font-medium">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
