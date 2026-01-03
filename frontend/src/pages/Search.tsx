import { useState, useEffect, useCallback } from 'react';
import { Search as SearchIcon, Filter, ArrowUpDown, Star, Clock, DollarSign, MapPin } from 'lucide-react';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import Card from '../components/Card';
import { fetchTrendingDestinations, fetchDestinations } from '../api/landingApi';

export default function Search() {
  const [searchQuery, setSearchQuery] = useState('');
  const [groupBy, setGroupBy] = useState('all');
  const [destinations, setDestinations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    loadTrendingDestinations();
  }, []);

  const loadTrendingDestinations = async () => {
    try {
      setLoading(true);
      const data = await fetchTrendingDestinations(8);
      setDestinations(data.destinations || []);
    } catch (error) {
      console.error('Failed to load destinations:', error);
    } finally {
      setLoading(false);
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

    // Clear existing timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    // Debounce search
    const timeout = setTimeout(() => {
      handleSearch(query);
    }, 350);

    setSearchTimeout(timeout);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar showSearch={false} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Discover Activities</h1>

          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search cities, destinations..."
                value={searchQuery}
                onChange={handleSearchInput}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <SearchIcon className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div className="flex gap-4 flex-wrap">
            <select
              value={groupBy}
              onChange={(e) => setGroupBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="all">All Destinations</option>
              <option value="asia">Asia</option>
              <option value="europe">Europe</option>
              <option value="americas">Americas</option>
            </select>

            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Searching destinations...</p>
          </div>
        ) : destinations.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No destinations found. Try a different search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinations.map((destination) => (
              <Card key={destination.iata_code} hover>
                <div className="overflow-hidden">
                  <img
                    src={destination.image_url || 'https://images.pexels.com/photos/1008155/pexels-photo-1008155.jpeg?auto=compress&cs=tinysrgb&w=600'}
                    alt={destination.city_name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {destination.city_name}
                    </h3>
                    <div className="flex items-center text-sm text-gray-600 mb-3">
                      <MapPin className="h-4 w-4 mr-1" />
                      {destination.country_name}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">{destination.iata_code}</span>
                      <Button size="sm">View Details</Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
