import { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Globe, Upload, Loader2, User } from 'lucide-react';
import Input from '../components/Input';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    password2: '',
    phone: '',
    city: '',
    country: '',
    additionalInfo: ''
  });

  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.password2) {
      setError("Passwords don't match");
      return;
    }

    setLoading(true);

    // Use FormData for file upload
    const data = new FormData();
    data.append('email', formData.email);
    data.append('password', formData.password);
    data.append('password2', formData.password2);
    data.append('name', `${formData.firstName} ${formData.lastName}`.trim());
    data.append('city', formData.city);
    data.append('country', formData.country);
    data.append('phone', formData.phone);
    data.append('bio', formData.additionalInfo);
    if (profileImage) {
      data.append('profile_image', profileImage);
    }

    try {
      await register(data);
      navigate('/dashboard');
    } catch (err: any) {
      const errorData = err.response?.data;
      let errorMessage = 'Registration failed.';
      if (errorData) {
        errorMessage = Object.values(errorData).flat().join(' ') || errorMessage;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-green-600 to-green-500 p-3 rounded-full">
              <Globe className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">
            Join GlobalTrotter
          </h1>
          <p className="text-gray-600 mt-2">Create your account and start exploring</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="bg-gray-100 w-32 h-32 rounded-full flex items-center justify-center overflow-hidden border-2 border-gray-100">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Profile preview" className="w-full h-full object-cover" />
                  ) : (
                    <User className="h-16 w-16 text-gray-400" />
                  )}
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  className="hidden"
                  accept="image/*"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 bg-green-600 text-white p-2 rounded-full hover:bg-green-700 transition-colors shadow-lg"
                >
                  <Upload className="h-4 w-4" />
                </button>
              </div>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm text-center">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="First Name"
                name="firstName"
                type="text"
                placeholder="John"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
              <Input
                label="Last Name"
                name="lastName"
                type="text"
                placeholder="Doe"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>

            <Input
              label="Email"
              name="email"
              type="email"
              placeholder="john.doe@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Password"
                name="password"
                type="password"
                placeholder="********"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <Input
                label="Confirm Password"
                name="password2"
                type="password"
                placeholder="********"
                value={formData.password2}
                onChange={handleChange}
                required
              />
            </div>

            <Input
              label="Phone Number"
              name="phone"
              type="tel"
              placeholder="+1 234 567 8900"
              value={formData.phone}
              onChange={handleChange}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="City"
                name="city"
                type="text"
                placeholder="San Francisco"
                value={formData.city}
                onChange={handleChange}
              />
              <Input
                label="Country"
                name="country"
                type="text"
                placeholder="USA"
                value={formData.country}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Additional Information
              </label>
              <textarea
                name="additionalInfo"
                rows={4}
                placeholder="Tell us about your travel interests..."
                value={formData.additionalInfo}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors resize-none"
              />
            </div>

            <Button type="submit" className="w-full flex items-center justify-center gap-2" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5" />
                  Creating account...
                </>
              ) : (
                'Register'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/" className="text-green-600 hover:text-green-700 font-medium">
              Login here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
