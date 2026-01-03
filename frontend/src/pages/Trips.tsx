import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import TripCard from '../components/TripCard';
import { getTrips } from '../api/tripApi';
import { Loader2 } from 'lucide-react';

type TripStatus = 'all' | 'ongoing' | 'upcoming' | 'completed';

export default function Trips() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TripStatus>('all');
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTrips();
  }, []);

  const loadTrips = async () => {
    try {
      setLoading(true);
      const responseData = await getTrips();
      const data = Array.isArray(responseData) ? responseData : (responseData.results || []);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const tripsWithStatus = data.map((trip: any) => {
        const start = new Date(trip.start_date);
        const end = new Date(trip.end_date);
        let status: TripStatus = 'upcoming';

        if (today >= start && today <= end) {
          status = 'ongoing';
        } else if (today > end) {
          status = 'completed';
        }

        return {
          ...trip,
          status,
          image: trip.destination_data?.image || trip.destination_data?.image_url || 'https://images.pexels.com/photos/2082103/pexels-photo-2082103.jpeg'
        };
      });

      setTrips(tripsWithStatus);
    } catch (err: any) {
      setError(err.message || 'Failed to load trips');
    } finally {
      setLoading(false);
    }
  };

  const filteredTrips = activeTab === 'all'
    ? trips
    : trips.filter((trip) => trip.status === activeTab);

  const tabs = [
    { id: 'all' as const, label: 'All Trips', count: trips.length },
    { id: 'ongoing' as const, label: 'Ongoing', count: trips.filter(t => t.status === 'ongoing').length },
    { id: 'upcoming' as const, label: 'Upcoming', count: trips.filter(t => t.status === 'upcoming').length },
    { id: 'completed' as const, label: 'Completed', count: trips.filter(t => t.status === 'completed').length }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100-80px)] mt-20">
          <Loader2 className="w-12 h-12 text-green-600 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Trips</h1>
          <p className="text-gray-600">Manage and view all your travel plans</p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-center">
            {error}
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
          <div className="flex border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${activeTab === tab.id
                  ? 'text-green-600 border-b-2 border-green-600'
                  : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                {tab.label}
                <span className="ml-2 px-2 py-1 rounded-full text-xs bg-gray-100">
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {filteredTrips.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTrips.map((trip) => (
              <TripCard
                key={trip.id}
                title={trip.name}
                destination={trip.destination_data?.city_name || 'Global'}
                startDate={trip.start_date}
                endDate={trip.end_date}
                image={trip.image}
                budget={trip.flight_data?.price?.total ? `₹${trip.flight_data.price.total}` : undefined}
                status={trip.status}
                onClick={() => navigate(`/itinerary/${trip.id}`)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">No trips found in this category</p>
          </div>
        )}
      </div>
    </div>
  );
}
