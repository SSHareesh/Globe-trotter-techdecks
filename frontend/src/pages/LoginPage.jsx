import React, { useState } from 'react';
import { UserCircle, Lock, Mail, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(formData.email, formData.password);
      navigate('/'); // Redirect to home after login
    } catch (err) {
      setError(err.response?.data?.detail || err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50 dark:bg-slate-950 p-6">
      <div className="bg-white dark:bg-slate-900 p-10 rounded-3xl shadow-xl w-full max-w-md border dark:border-slate-800">
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 bg-teal-50 dark:bg-slate-800 rounded-full flex items-center justify-center text-teal-600 mb-4">
            <UserCircle size={60} />
          </div>
          <h2 className="text-2xl font-bold dark:text-white">Welcome Back</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-center">Login to your GlobeTrotter account</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <Mail className="absolute left-4 top-4 text-gray-400" size={20} />
            <input
              type="email"
              className="input-field pl-12"
              placeholder="Email Address"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-4 text-gray-400" size={20} />
            <input
              type="password"
              className="input-field pl-12"
              placeholder="Password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-4 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Logging in...
              </>
            ) : (
              'Login'
            )}
          </button>
        </form>

        <p className="mt-8 text-center dark:text-gray-400">
          New to GlobeTrotter? <Link to="/register" className="text-teal-600 font-semibold hover:underline">Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;