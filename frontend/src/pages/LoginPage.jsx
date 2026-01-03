import React, { useState } from 'react';
import { UserCircle, Lock, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const LoginPage = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Dummy Login Data for Django:", formData);
    // Here you would call loginUser(formData) from your api folder
  };

  return (
    <div className="min-h-[calc(100-64px)] flex items-center justify-center bg-gray-50 dark:bg-slate-950 p-6">
      <div className="bg-white dark:bg-slate-900 p-10 rounded-3xl shadow-xl w-full max-w-md border dark:border-slate-800">
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 bg-teal-50 dark:bg-slate-800 rounded-full flex items-center justify-center text-teal-600 mb-4">
            <UserCircle size={60} />
          </div>
          <h2 className="text-2xl font-bold dark:text-white">Welcome Back</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <User className="absolute left-4 top-4 text-gray-400" size={20} />
            <input 
              type="text" 
              className="input-field pl-12" 
              placeholder="Username"
              onChange={(e) => setFormData({...formData, username: e.target.value})}
            />
          </div>
          
          <div className="relative">
            <Lock className="absolute left-4 top-4 text-gray-400" size={20} />
            <input 
              type="password" 
              className="input-field pl-12" 
              placeholder="Password"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <button type="submit" className="w-full btn-primary py-4">
            Login Button
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