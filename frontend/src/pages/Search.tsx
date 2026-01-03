import { useState, useEffect, useCallback } from 'react';
import { Search as SearchIcon, Filter, MapPin } from 'lucide-react';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import Card from '../components/Card';
import { fetchTrendingDestinations, fetchDestinations } from '../api/landingApi.ts';
import { useNavigate } from 'react-router-dom';

export default function Search() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [groupBy, setGroupBy] = useState('all');
  const [destinations, setDestinations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);
  const [selectedDestination, setSelectedDestination] = useState<string | null>(null);

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

  const handleDestinationClick = (destination: any) => {
    setSelectedDestination(destination.iata_code);
    // Navigate to create-trip page with destination data
    setTimeout(() => {
      navigate('/create-trip', { state: { destination } });
    }, 150);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

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
              <Card 
                key={destination.iata_code} 
                hover
                onClick={() => handleDestinationClick(destination)}
                className={`cursor-pointer transform transition-all duration-300 ${
                  selectedDestination === destination.iata_code 
                    ? 'ring-4 ring-green-500 scale-105 shadow-2xl shadow-green-500/50' 
                    : 'hover:scale-105 hover:shadow-2xl hover:ring-2 hover:ring-green-300'
                }`}
              >
                <div className="overflow-hidden relative group">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={destination.image_url || 'https://images.pexels.com/photos/1008155/pexels-photo-1008155.jpeg?auto=compress&cs=tinysrgb&w=600'}
                      alt={destination.city_name}
                      className={`w-full h-full object-cover transition-all duration-500 ${
                        selectedDestination === destination.iata_code
                          ? 'scale-110 brightness-110'
                          : 'group-hover:scale-110 group-hover:brightness-110'
                      }`}
                    />
                    
                    {/* Animated overlay */}
                    <div className={`absolute inset-0 transition-all duration-300 ${
                      selectedDestination === destination.iata_code
                        ? 'bg-gradient-to-t from-green-900/70 via-green-600/20 to-transparent'
                        : 'bg-gradient-to-t from-black/40 to-transparent group-hover:from-green-900/60'
                    }`} />
                    
                    <div className="absolute inset-0 bg-green-500/0 group-hover:bg-green-500/10 transition-all duration-300" />
                    
                    {/* Select/Selected Badge */}
                    <div className={`absolute top-3 right-3 transition-all duration-300 ${
                      selectedDestination === destination.iata_code 
                        ? 'animate-bounce opacity-100' 
                        : 'opacity-0 group-hover:opacity-100 group-hover:animate-pulse'
                    }`}>
                      <div className={`text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-2 ${
                        selectedDestination === destination.iata_code
                          ? 'bg-gradient-to-r from-green-500 to-green-600'
                          : 'bg-gradient-to-r from-green-400 to-green-500'
                      }`}>
                        {selectedDestination === destination.iata_code && (
                          <>
                            <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping absolute"></span>
                            <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                          </>
                        )}
                        <span>{selectedDestination === destination.iata_code ? 'Selected' : 'Select'}</span>
                      </div>
                    </div>
                    
                    {/* Corner accents when selected */}
                    {selectedDestination === destination.iata_code && (
                      <>
                        <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-green-400 animate-pulse"></div>
                        <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-green-400 animate-pulse"></div>
                      </>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <h3 className={`text-lg font-semibold mb-2 transition-all duration-300 ${
                      selectedDestination === destination.iata_code 
                        ? 'text-green-600' 
                        : 'text-gray-900'
                    }`}>
                      {destination.city_name}
                    </h3>
                    <div className="flex items-center text-sm text-gray-600 mb-3">
                      <MapPin className="h-4 w-4 mr-1" />
                      {destination.country_name}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">{destination.iata_code}</span>
                      <Button 
                        size="sm" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDestinationClick(destination);
                        }}
                        className={selectedDestination === destination.iata_code ? 'bg-green-600' : ''}
                      >
                        {selectedDestination === destination.iata_code ? 'Selected ✓' : 'Plan Trip'}
                      </Button>
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
