import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Filter, ArrowUpDown, Search } from 'lucide-react';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import TripCard from '../components/TripCard';
import Card from '../components/Card';
import { fetchTrendingDestinations, fetchDestinations } from '../api/landingApi';
import { getTrips } from '../api/axiosInstance';

export default function Dashboard() {
  const navigate = useNavigate();
  const [destinations, setDestinations] = useState<any[]>([]);
  const [trips, setTrips] = useState<any[]>([]);
  const [tripsLoading, setTripsLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);
  const [selectedDestination, setSelectedDestination] = useState<string | null>(null);

  useEffect(() => {
    loadTrendingDestinations();
    fetchUserTrips();
  }, []);

  const fetchUserTrips = async () => {
    try {
      const response = await getTrips();
      setTrips(response.data || []);
    } catch (error) {
      console.error('Failed to fetch trips:', error);
    } finally {
      setTripsLoading(false);
    }
  };

  const loadTrendingDestinations = async () => {
    try {
      setLoading(true);
      const data = await fetchTrendingDestinations(8); // Request 8 to ensure we get at least 6
      setDestinations(data.destinations || []);
    } catch (error) {
      console.error('Failed to load destinations:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadRealTrips = async () => {
    try {
      const responseData = await getTrips();
      const data = Array.isArray(responseData) ? responseData : (responseData.results || []);
      setTrips(data.slice(0, 3)); // Just show recent 3
    } catch (error) {
      console.error('Failed to load real trips:', error);
    }
  };

  const handleSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      loadTrendingDestinations();
      return;
    }

    try {
      setLoading(true);
      const data = await fetchDestinations(query, 8);
      setDestinations(data.destinations || []);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const timeout = setTimeout(() => {
      handleSearch(query);
    }, 350);

    setSearchTimeout(timeout);
  };

  const handleDestinationClick = (destination: any) => {
    setSelectedDestination(destination.iata_code);
    setTimeout(() => {
      navigate('/create-trip', { state: { destination } });
    }, 150); 
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="relative h-96 bg-gradient-to-r from-green-600 to-green-500 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://images.pexels.com/photos/346885/pexels-photo-346885.jpeg?auto=compress&cs=tinysrgb&w=1260"
            alt="Travel"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center items-center text-center">
          <h1 className="text-5xl font-bold text-white mb-4">
            Discover Your Next Adventure
          </h1>
          <p className="text-xl text-green-50 mb-8 max-w-2xl">
            Plan, explore, and experience the world's most amazing destinations
          </p>
          <div className="flex gap-4">
            <Button
              size="lg"
              variant="secondary"
              onClick={() => navigate('/create-trip')}
              className="flex items-center gap-2"
            >
              <Plus className="h-5 w-5" />
              Plan a Trip
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('/search')}
              className="bg-white hover:bg-gray-50 text-green-600 border-white"
            >
              Explore Destinations
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-900">Top Regional Selections</h2>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <ArrowUpDown className="h-4 w-4" />
                Sort
              </Button>
            </div>
          </div>

          <div className="relative mb-6">
            <input
              type="text"
              placeholder="Search destinations..."
              value={searchQuery}
              onChange={handleSearchInput}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 mb-16">
            <p className="text-gray-600">Loading destinations...</p>
          </div>
        ) : destinations.length === 0 ? (
          <div className="text-center py-12 mb-16">
            <p className="text-gray-600 mb-2">No destinations found for "{searchQuery}"</p>
            <p className="text-sm text-gray-500">Try: Chennai, Mumbai, London, Paris, New York, Singapore</p>
            <p className="text-xs text-gray-400 mt-2">(Some cities have limited data in test environment)</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {destinations.slice(0, 6).map((destination) => (
              <Card
                key={destination.iata_code}
                hover
                onClick={() => handleDestinationClick(destination)}
                className={`cursor-pointer transform transition-all duration-300 ${selectedDestination === destination.iata_code
                  ? 'ring-4 ring-green-500 scale-105 shadow-2xl shadow-green-500/50'
                  : 'hover:scale-105 hover:shadow-2xl hover:ring-2 hover:ring-green-300'
                  }`}
              >
                <div className="relative h-64 overflow-hidden rounded-t-xl group">
                  <img
                    src={destination.image_url || 'https://images.pexels.com/photos/1008155/pexels-photo-1008155.jpeg?auto=compress&cs=tinysrgb&w=600'}
                    alt={destination.city_name}
                    className={`w-full h-full object-cover transition-all duration-500 ${selectedDestination === destination.iata_code
                      ? 'scale-110 brightness-110'
                      : 'group-hover:scale-110 group-hover:brightness-110'
                      }`}
                  />
                  <div className={`absolute inset-0 transition-all duration-300 ${selectedDestination === destination.iata_code
                    ? 'bg-gradient-to-t from-green-900/70 via-green-600/20 to-transparent'
                    : 'bg-gradient-to-t from-black/60 to-transparent group-hover:from-green-900/60'
                    }`} />

                  {/* Animated overlay on hover */}
                  <div className="absolute inset-0 bg-green-500/0 group-hover:bg-green-500/10 transition-all duration-300" />

                  {/* Selected Badge - shows on hover OR when selected */}
                  <div className={`absolute top-4 right-4 transition-all duration-300 ${selectedDestination === destination.iata_code
                    ? 'animate-bounce opacity-100'
                    : 'opacity-0 group-hover:opacity-100 group-hover:animate-pulse'
                    }`}>
                    <div className={`text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-2 ${selectedDestination === destination.iata_code
                      ? 'bg-gradient-to-r from-green-500 to-green-600'
                      : 'bg-gradient-to-r from-green-400 to-green-500'
                      }`}>
                      {selectedDestination === destination.iata_code && (
                        <>
                          <span className="w-2 h-2 bg-white rounded-full animate-ping absolute"></span>
                          <span className="w-2 h-2 bg-white rounded-full"></span>
                        </>
                      )}
                      <span>{selectedDestination === destination.iata_code ? 'Selected' : 'Select'}</span>
                    </div>
                  </div>

                  {selectedDestination === destination.iata_code && (
                    <>
                      {/* Animated corner accents - only when selected */}
                      <div className="absolute top-0 left-0 w-20 h-20 border-t-4 border-l-4 border-green-400 animate-pulse"></div>
                      <div className="absolute bottom-0 right-0 w-20 h-20 border-b-4 border-r-4 border-green-400 animate-pulse"></div>
                    </>
                  )}

                  <div className={`absolute bottom-4 left-4 text-white transition-all duration-300 ${selectedDestination === destination.iata_code ? 'transform translate-x-2' : ''
                    }`}>
                    <h3 className="text-2xl font-bold mb-1 drop-shadow-lg">{destination.city_name}</h3>
                    <p className={`transition-all duration-300 ${selectedDestination === destination.iata_code
                      ? 'text-green-200 font-semibold'
                      : 'text-green-100'
                      }`}>{destination.country_name}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-900">Your Trips</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/trips')}
          >
            View All
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tripsLoading ? (
            <p className="text-gray-600">Loading your trips...</p>
          ) : trips.length === 0 ? (
            <Card className="p-8 col-span-full text-center">
              <p className="text-gray-600 mb-4">You haven't created any trips yet.</p>
              <Button onClick={() => navigate('/create-trip')}>
                <Plus className="h-5 w-5 mr-2" />
                Create Your First Trip
              </Button>
            </Card>
          ) : (
            trips.slice(0, 3).map((trip) => (
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
    </div>
  );
}
