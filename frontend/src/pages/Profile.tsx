import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit2, MapPin, Globe, Calendar, User as UserIcon } from 'lucide-react';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import Card from '../components/Card';
import TripCard from '../components/TripCard';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const trips: any[] = [];

  const upcomingTrips = trips.filter(t => t.status === 'upcoming');
  const completedTrips = trips.filter(t => t.status === 'completed');

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

  // Use absolute URLs for images returned by Django
  const getImageUrl = (path: string | null) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `http://127.0.0.1:8000${path}`;
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
                  <p className="text-gray-600 mt-1">{user.bio || 'Traveler exploring the world via GlobalTrotter.'}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center gap-2"
                >
                  <Edit2 className="h-4 w-4" />
                  Edit Profile
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="flex items-center gap-3 text-gray-700">
                  <MapPin className="h-5 w-5 text-green-600" />
                  <span>{user.city && user.country ? `${user.city}, ${user.country}` : user.city || user.country || 'Location not set'}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <Globe className="h-5 w-5 text-green-600" />
                  <span>8 Countries Visited</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <Calendar className="h-5 w-5 text-green-600" />
                  <span>12 Total Trips</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Email:</span>
                  <span className="ml-2 text-gray-600">{user.email}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Phone:</span>
                  <span className="ml-2 text-gray-600">{user.phone || 'Not provided'}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

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
            {upcomingTrips.map((trip) => (
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
      </div>
    </div>
  );
}
