import { UserCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const RegisterPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-slate-950 p-6">
      <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-2xl w-full max-w-3xl border dark:border-slate-800">
        <div className="flex flex-col items-center mb-8">
          <UserCircle size={80} className="text-teal-600 mb-2" />
          <h2 className="text-3xl font-bold dark:text-white">Registration</h2>
        </div>

        <form className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <input className="input-field" placeholder="First Name" />
          <input className="input-field" placeholder="Last Name" />
          <input className="input-field" placeholder="Email Address" />
          <input className="input-field" placeholder="Phone Number" />
          <input className="input-field" placeholder="City" />
          <input className="input-field" placeholder="Country" />
          <textarea className="input-field md:col-span-2 h-32" placeholder="Additional Information ...." />
          
          <button className="md:col-span-2 bg-teal-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-teal-700 transition shadow-md">
            Register Users
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