import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit2, MapPin, Globe, Calendar, User as UserIcon, X, Upload, Save } from 'lucide-react';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import Card from '../components/Card';
import TripCard from '../components/TripCard';
import Input from '../components/Input';
import { getTrips } from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const navigate = useNavigate();
  const { user, updateUserProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    city: user?.city || '',
    country: user?.country || '',
    bio: user?.bio || ''
  });

  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await getTrips();
        setTrips(response.data || []);
      } catch (error) {
        console.error('Failed to fetch trips:', error);
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      fetchTrips();
    }
  }, [user]);

  const upcomingTrips = trips.filter(t => t.status === 'upcoming');
  const completedTrips = trips.filter(t => t.status === 'completed');
  const totalTrips = trips.length;
  const uniqueCountries = new Set(trips.map(t => {
    const desc = t.description || '';
    const match = desc.match(/Destination:\s*([^|]+)/);
    return match ? match[1].trim().split(',')[1]?.trim() : '';
  }).filter(Boolean)).size;

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">You need to be logged in to view your profile.</p>
          <Button onClick={() => navigate('/')}>Login</Button>
        </div>
      </div>
    );
  }

  const getImageUrl = (path: string | null) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `http://127.0.0.1:8000${path}`;
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditClick = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      city: user?.city || '',
      country: user?.country || '',
      bio: user?.bio || ''
    });
    setPreviewImage(null);
    setSelectedFile(null);
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const data = new FormData();
      data.append('name', formData.name);
      data.append('email', formData.email);
      data.append('phone', formData.phone || '');
      data.append('city', formData.city || '');
      data.append('country', formData.country || '');
      data.append('bio', formData.bio || '');
      
      if (selectedFile) {
        data.append('profile_image', selectedFile);
      }
      
      await updateUserProfile(data);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-shrink-0">
              {user.profile_image ? (
                <img
                  src={getImageUrl(user.profile_image)!}
                  alt={user.name}
                  className="w-32 h-32 rounded-full object-cover border-4 border-green-100"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center border-4 border-green-50">
                  <UserIcon className="h-16 w-16 text-gray-400" />
                </div>
              )}
            </div>

            <div className="flex-1">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    {user.name}
                  </h1>
                  <p className="text-gray-600 mt-1">{user.bio || 'Traveler exploring the world via GlobeTrotter.'}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleEditClick}
                  className="flex items-center gap-2"
                >
                  <Edit2 className="h-4 w-4" />
                  Edit Profile
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="flex items-center gap-3 text-gray-700">
                  <Globe className="h-5 w-5 text-green-600" />
                  <span>{uniqueCountries} {uniqueCountries === 1 ? 'Country' : 'Countries'} Visited</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <Calendar className="h-5 w-5 text-green-600" />
                  <span>{totalTrips} Total {totalTrips === 1 ? 'Trip' : 'Trips'}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Email:</span>
                  <span className="ml-2 text-gray-600">{user.email}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Trips sections remain the same */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Upcoming Trips</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/trips')}
            >
              View All
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <p className="text-gray-600">Loading trips...</p>
            ) : upcomingTrips.length === 0 ? (
              <p className="text-gray-600">No upcoming trips yet.</p>
            ) : (
              upcomingTrips.map((trip) => (
                <TripCard
                  key={trip.id}
                  title={trip.name}
                  destination={trip.description.match(/Destination:\s*([^|]+)/)?.[1] || trip.description}
                  startDate={trip.start_date}
                  endDate={trip.end_date}
                  image={trip.cover_image || 'https://images.pexels.com/photos/1008155/pexels-photo-1008155.jpeg'}
                  budget={trip.description.match(/Budget:\s*([^|]+)/)?.[1] || 'N/A'}
                  status={trip.status}
                  onClick={() => navigate(`/itinerary/${trip.id}`)}
                />
              ))
            )}
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Previous Trips</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/trips')}
            >
              View All
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {completedTrips.map((trip) => (
              <TripCard
                key={trip.id}
                title={trip.title}
                destination={trip.destination}
                startDate={trip.startDate}
                endDate={trip.endDate}
                image={trip.image}
                budget={trip.budget}
                status={trip.status}
                onClick={() => navigate(`/itinerary/${trip.id}`)}
              />
            ))}
          </div>
        </div>

        {/* Edit Profile Modal */}
        {isEditing && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Edit Profile</h2>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-6">
                  {/* Profile Image Upload */}
                  <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                      {previewImage ? (
                        <img
                          src={previewImage}
                          alt="Preview"
                          className="w-32 h-32 rounded-full object-cover border-4 border-green-100"
                        />
                      ) : user?.profile_image ? (
                        <img
                          src={getImageUrl(user.profile_image)!}
                          alt={user.name}
                          className="w-32 h-32 rounded-full object-cover border-4 border-green-100"
                        />
                      ) : (
                        <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center border-4 border-green-50">
                          <UserIcon className="h-16 w-16 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-2"
                    >
                      <Upload className="h-4 w-4" />
                      Upload Photo
                    </Button>
                  </div>

                  {/* Form Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Full Name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                    <Input
                      label="Email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Phone"
                      type="tel"
                      placeholder="+1 234 567 8900"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                    <Input
                      label="City"
                      type="text"
                      placeholder="San Francisco"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    />
                  </div>

                  <Input
                    label="Country"
                    type="text"
                    placeholder="USA"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bio
                    </label>
                    <textarea
                      placeholder="Tell us about yourself..."
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4 pt-4">
                    <Button
                      type="submit"
                      disabled={saving}
                      className="flex-1 flex items-center justify-center gap-2"
                    >
                      <Save className="h-4 w-4" />
                      {saving ? 'Saving...' : 'Save Changes'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                      disabled={saving}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
