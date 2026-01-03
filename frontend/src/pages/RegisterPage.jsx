import React, { useState } from 'react';
import { UserCircle, Mail, Lock, User, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
    language_preference: 'en'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.password2) {
      setError("Passwords don't match");
      return;
    }

    setLoading(true);
    try {
      await register(formData);
      navigate('/'); // Redirect to home after registration
    } catch (err) {
      const errorData = err.response?.data;
      let errorMessage = 'Registration failed.';
      if (errorData) {
        // Handle Django Rest Framework error structure
        errorMessage = Object.values(errorData).flat().join(' ') || errorMessage;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-slate-950 p-6">
      <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-2xl w-full max-w-2xl border dark:border-slate-800">
        <div className="flex flex-col items-center mb-8">
          <UserCircle size={80} className="text-teal-600 mb-2" />
          <h2 className="text-3xl font-bold dark:text-white">Create Account</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Join GlobeTrotter today</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="relative md:col-span-2">
            <User className="absolute left-4 top-4 text-gray-400" size={20} />
            <input
              required
              className="input-field pl-12"
              placeholder="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="relative md:col-span-2">
            <Mail className="absolute left-4 top-4 text-gray-400" size={20} />
            <input
              required
              type="email"
              className="input-field pl-12"
              placeholder="Email Address"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-4 text-gray-400" size={20} />
            <input
              required
              type="password"
              className="input-field pl-12"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-4 text-gray-400" size={20} />
            <input
              required
              type="password"
              className="input-field pl-12"
              placeholder="Confirm Password"
              value={formData.password2}
              onChange={(e) => setFormData({ ...formData, password2: e.target.value })}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="md:col-span-2 bg-teal-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-teal-700 transition shadow-md flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Creating account...
              </>
            ) : (
              'Register'
            )}
          </button>
        </form>
        <p className="mt-6 text-center dark:text-gray-400">
          Already have an account? <Link to="/login" className="text-teal-600 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;