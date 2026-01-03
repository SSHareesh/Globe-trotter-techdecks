import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MapPin, Star, Camera, Heart, Church, Building2, Landmark, Mountain } from 'lucide-react';
import Navbar from '../components/Navbar';
import Input from '../components/Input';
import Button from '../components/Button';
import Card from '../components/Card';
import { fetchAttractions } from '../api/landingApi.ts';

// Tourist attractions data for different cities with images
const TOURIST_PLACES: Record<string, any[]> = {
  'Chennai': [
    { name: 'Marina Beach', type: 'Beach', rating: 4.5, description: 'Second longest urban beach in the world', icon: 'Mountain', image: 'https://images.pexels.com/photos/2166559/pexels-photo-2166559.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { name: 'Kapaleeshwarar Temple', type: 'Temple', rating: 4.7, description: 'Ancient Dravidian architecture temple', icon: 'Church', image: 'https://images.pexels.com/photos/2846217/pexels-photo-2846217.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { name: 'Fort St. George', type: 'Historical', rating: 4.3, description: 'First English fortress in India', icon: 'Landmark', image: 'https://images.pexels.com/photos/3243090/pexels-photo-3243090.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { name: 'Guindy National Park', type: 'Nature', rating: 4.2, description: 'Urban national park with wildlife', icon: 'Mountain', image: 'https://images.pexels.com/photos/1670732/pexels-photo-1670732.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { name: 'Government Museum', type: 'Museum', rating: 4.4, description: 'One of the oldest museums in India', icon: 'Building2', image: 'https://images.pexels.com/photos/2166711/pexels-photo-2166711.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { name: 'San Thome Basilica', type: 'Church', rating: 4.6, description: 'Historic Roman Catholic church', icon: 'Church', image: 'https://images.pexels.com/photos/2325446/pexels-photo-2325446.jpeg?auto=compress&cs=tinysrgb&w=400' },
  ],
  'Mumbai': [
    { name: 'Gateway of India', type: 'Monument', rating: 4.6, description: 'Iconic arch monument on Mumbai Harbor', icon: 'Landmark', image: 'https://images.pexels.com/photos/1007426/pexels-photo-1007426.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { name: 'Marine Drive', type: 'Scenic', rating: 4.5, description: 'Beautiful seafront promenade', icon: 'Mountain', image: 'https://images.pexels.com/photos/2404843/pexels-photo-2404843.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { name: 'Elephanta Caves', type: 'Historical', rating: 4.7, description: 'UNESCO World Heritage rock-cut temples', icon: 'Landmark', image: 'https://images.pexels.com/photos/3581368/pexels-photo-3581368.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { name: 'Chhatrapati Shivaji Terminus', type: 'Architecture', rating: 4.8, description: 'Historic railway station, UNESCO site', icon: 'Building2', image: 'https://images.pexels.com/photos/3581368/pexels-photo-3581368.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { name: 'Juhu Beach', type: 'Beach', rating: 4.3, description: 'Popular beach with street food', icon: 'Mountain', image: 'https://images.pexels.com/photos/2166559/pexels-photo-2166559.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { name: 'Haji Ali Dargah', type: 'Religious', rating: 4.6, description: 'Mosque on an islet off the coast', icon: 'Church', image: 'https://images.pexels.com/photos/2325446/pexels-photo-2325446.jpeg?auto=compress&cs=tinysrgb&w=400' },
  ],
  'Delhi': [
    { name: 'Red Fort', type: 'Historical', rating: 4.7, description: 'UNESCO World Heritage Mughal fort', icon: 'Landmark', image: 'https://images.pexels.com/photos/789750/pexels-photo-789750.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { name: 'India Gate', type: 'Monument', rating: 4.6, description: 'War memorial and popular landmark', icon: 'Landmark', image: 'https://images.pexels.com/photos/1007426/pexels-photo-1007426.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { name: 'Qutub Minar', type: 'Monument', rating: 4.8, description: 'UNESCO World Heritage minaret', icon: 'Landmark', image: 'https://images.pexels.com/photos/3581368/pexels-photo-3581368.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { name: 'Lotus Temple', type: 'Temple', rating: 4.7, description: 'Bahá\'í House of Worship', icon: 'Church', image: 'https://images.pexels.com/photos/2846217/pexels-photo-2846217.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { name: 'Humayun\'s Tomb', type: 'Historical', rating: 4.6, description: 'Mughal Emperor\'s tomb, UNESCO site', icon: 'Building2', image: 'https://images.pexels.com/photos/3243090/pexels-photo-3243090.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { name: 'Akshardham Temple', type: 'Temple', rating: 4.9, description: 'Modern Hindu temple complex', icon: 'Church', image: 'https://images.pexels.com/photos/2325446/pexels-photo-2325446.jpeg?auto=compress&cs=tinysrgb&w=400' },
  ],
  'London': [
    { name: 'Big Ben', type: 'Monument', rating: 4.8, description: 'Iconic clock tower and bell', icon: 'Landmark', image: 'https://images.pexels.com/photos/460672/pexels-photo-460672.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { name: 'Tower Bridge', type: 'Bridge', rating: 4.7, description: 'Victorian bascule bridge', icon: 'Landmark', image: 'https://images.pexels.com/photos/726484/pexels-photo-726484.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { name: 'British Museum', type: 'Museum', rating: 4.9, description: 'World-famous museum', icon: 'Building2', image: 'https://images.pexels.com/photos/2166711/pexels-photo-2166711.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { name: 'London Eye', type: 'Attraction', rating: 4.6, description: 'Giant observation wheel', icon: 'Mountain', image: 'https://images.pexels.com/photos/672532/pexels-photo-672532.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { name: 'Buckingham Palace', type: 'Palace', rating: 4.7, description: 'Official residence of the monarch', icon: 'Building2', image: 'https://images.pexels.com/photos/220887/pexels-photo-220887.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { name: 'Tower of London', type: 'Historical', rating: 4.8, description: 'Historic castle and UNESCO site', icon: 'Landmark', image: 'https://images.pexels.com/photos/3243090/pexels-photo-3243090.jpeg?auto=compress&cs=tinysrgb&w=400' },
  ],
  'Paris': [
    { name: 'Eiffel Tower', type: 'Monument', rating: 4.9, description: 'Iconic iron lattice tower', icon: 'Landmark', image: 'https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { name: 'Louvre Museum', type: 'Museum', rating: 4.9, description: 'World\'s largest art museum', icon: 'Building2', image: 'https://images.pexels.com/photos/2166711/pexels-photo-2166711.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { name: 'Notre-Dame', type: 'Cathedral', rating: 4.8, description: 'Medieval Catholic cathedral', icon: 'Church', image: 'https://images.pexels.com/photos/1850619/pexels-photo-1850619.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { name: 'Arc de Triomphe', type: 'Monument', rating: 4.7, description: 'Famous war memorial', icon: 'Landmark', image: 'https://images.pexels.com/photos/1461974/pexels-photo-1461974.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { name: 'Sacré-Cœur', type: 'Church', rating: 4.7, description: 'Basilica on Montmartre hill', icon: 'Church', image: 'https://images.pexels.com/photos/2325446/pexels-photo-2325446.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { name: 'Versailles Palace', type: 'Palace', rating: 4.8, description: 'Royal château, UNESCO site', icon: 'Building2', image: 'https://images.pexels.com/photos/220887/pexels-photo-220887.jpeg?auto=compress&cs=tinysrgb&w=400' },
  ],
};

const FALLBACK_IMAGE =
  'https://images.pexels.com/photos/1008155/pexels-photo-1008155.jpeg?auto=compress&cs=tinysrgb&w=800';

export default function CreateTrip() {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedDestination = location.state?.destination;

  const [tripData, setTripData] = useState({
    name: selectedDestination ? `My ${selectedDestination.city_name} Adventure` : '',
    destination: selectedDestination?.city_name || '',
    startDate: '',
    endDate: ''
  });
  const [selectedAttractions, setSelectedAttractions] = useState<number[]>([]);

  const [touristPlaces, setTouristPlaces] = useState<any[]>([]);
  const [loadingAttractions, setLoadingAttractions] = useState(false);
  const [attractionsError, setAttractionsError] = useState<string | null>(null);

  const cityNameRaw = (selectedDestination?.city_name || '').trim();
  const cityKey = cityNameRaw.toLowerCase();

  const localFallbackPlaces = (() => {
    if (!cityKey) return [];
    const matchKey = Object.keys(TOURIST_PLACES).find((k) => k.toLowerCase() === cityKey);
    return matchKey ? TOURIST_PLACES[matchKey] : [];
  })();

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setSelectedAttractions([]);
      setAttractionsError(null);

      if (!cityNameRaw) {
        setTouristPlaces([]);
        return;
      }

      setLoadingAttractions(true);
      try {
        const data = await fetchAttractions(cityNameRaw, 24);
        const attractions = data.attractions || [];
        if (!cancelled) {
          // If backend returns nothing, fall back to local list.
          setTouristPlaces(attractions.length ? attractions : localFallbackPlaces);
        }
      } catch (e: any) {
        if (!cancelled) {
          setAttractionsError(e?.message || 'Failed to load tourist places');
          setTouristPlaces(localFallbackPlaces);
        }
      } finally {
        if (!cancelled) setLoadingAttractions(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cityKey]);

  const toggleAttraction = (index: number) => {
    setSelectedAttractions(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const getIconComponent = (iconName: string) => {
    const icons: Record<string, any> = {
      Mountain, Church, Landmark, Building2, Camera, Heart
    };
    return icons[iconName] || MapPin;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTripData({ ...tripData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mustSelect = touristPlaces.length > 0;
    if (mustSelect && selectedAttractions.length === 0) {
      return;
    }

    // Pass everything to build-itinerary
    const fullSelectedAttractions = selectedAttractions.map(idx => touristPlaces[idx]);

    navigate('/build-itinerary', {
      state: {
        tripData,
        destination: selectedDestination,
        attractions: fullSelectedAttractions
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Create New Trip</h1>
          <p className="text-gray-600">
            {selectedDestination
              ? `Planning your trip to ${selectedDestination.city_name}, ${selectedDestination.country_name}`
              : 'Start planning your next adventure'}
          </p>
        </div>

        {selectedDestination && (
          <Card className="p-6 mb-6 bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-200">
            <div className="flex items-center gap-4">
              {selectedDestination.image_url && (
                <img
                  src={selectedDestination.image_url}
                  alt={selectedDestination.city_name}
                  className="w-24 h-24 rounded-xl object-cover"
                />
              )}
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  {selectedDestination.city_name}
                </h3>
                <p className="text-gray-600">{selectedDestination.country_name}</p>
                <span className="inline-block mt-2 px-3 py-1 bg-green-600 text-white text-xs font-semibold rounded-full">
                  Selected Destination
                </span>
              </div>
            </div>
          </Card>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <Card className="p-8">
            <Input
              label="Trip Name"
              name="name"
              type="text"
              placeholder="e.g., Summer in Santorini"
              value={tripData.name}
              onChange={handleChange}
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Start Date"
                name="startDate"
                type="date"
                value={tripData.startDate}
                onChange={handleChange}
                required
              />
              <Input
                label="End Date"
                name="endDate"
                type="date"
                value={tripData.endDate}
                onChange={handleChange}
                required
              />
            </div>
          </Card>

          {selectedDestination && (
            <div className="mb-8">
              <div className="mb-4">
                <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <MapPin className="w-6 h-6 text-green-600" />
                  Suggested Places & Activities
                </h2>
                <p className="text-gray-600">
                  Top tourist attractions in {selectedDestination?.city_name}. Select the places you want in your trip.
                </p>
              </div>

              {attractionsError && (
                <div className="mb-4 p-4 rounded-lg border border-yellow-200 bg-yellow-50 text-yellow-800">
                  {attractionsError}
                </div>
              )}

              {loadingAttractions && (
                <div className="text-center py-10">
                  <p className="text-gray-600">Loading tourist places...</p>
                </div>
              )}

              {!loadingAttractions && touristPlaces.length === 0 && (
                <div className="text-center py-12 bg-gray-100 rounded-lg">
                  <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-700 font-medium">No tourist places found for this destination.</p>
                  <p className="text-gray-600 text-sm mt-1">Try another destination.</p>
                </div>
              )}

              {!loadingAttractions && touristPlaces.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {touristPlaces.map((place, index) => {
                    const isSelected = selectedAttractions.includes(index);
                    const IconComponent = getIconComponent(place.icon || 'MapPin');

                    return (
                      <Card
                        key={index}
                        className={`cursor-pointer transition-all duration-300 overflow-hidden ${isSelected
                            ? 'border-3 border-green-500 shadow-2xl ring-4 ring-green-200 scale-105'
                            : 'border border-gray-200 hover:border-green-400 hover:shadow-xl hover:scale-102'
                          }`}
                        onClick={() => toggleAttraction(index)}
                      >
                        <div className="relative">
                          <img
                            src={place.image_url || place.image || FALLBACK_IMAGE}
                            alt={place.name}
                            className={`w-full h-48 object-cover transition-all duration-300 ${isSelected ? 'brightness-90' : 'hover:brightness-110'
                              }`}
                          />
                          {isSelected && (
                            <div className="absolute top-3 right-3 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 animate-bounce shadow-lg">
                              <Camera className="w-4 h-4" />
                              Selected
                            </div>
                          )}
                          <div className={`absolute top-3 left-3 p-2 rounded-lg backdrop-blur-sm ${isSelected ? 'bg-green-500/90' : 'bg-white/90'
                            }`}>
                            <IconComponent className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-gray-700'
                              }`} />
                          </div>
                        </div>

                        <div className="p-5">
                          <h3 className="font-bold text-gray-900 text-xl mb-2">{place.name}</h3>
                          <p className="text-sm text-gray-600 mb-4 h-10 line-clamp-2">
                            {place.description || 'Popular attraction'}
                          </p>

                          <div className="flex items-center justify-between mb-3">
                            <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                              {place.type || 'Attraction'}
                            </span>
                            <div className="flex items-center gap-1.5 bg-yellow-50 px-3 py-1.5 rounded-full">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm font-bold text-gray-900">{place.rating ?? '—'}</span>
                            </div>
                          </div>

                          {!isSelected ? (
                            <div className="text-center pt-2 border-t border-gray-200">
                              <span className="text-sm text-green-600 font-medium hover:text-green-700 transition-colors">
                                ✓ Click to add to your itinerary
                              </span>
                            </div>
                          ) : (
                            <div className="text-center pt-2 border-t border-green-200 bg-green-50 -mx-5 -mb-5 py-3">
                              <span className="text-sm text-green-700 font-bold">
                                ✓ Added to your trip!
                              </span>
                            </div>
                          )}
                        </div>
                      </Card>
                    );
                  })}
                </div>
              )}

              {selectedAttractions.length > 0 && (
                <div className="mt-6 p-5 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl shadow-md">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-green-500 p-2 rounded-full">
                        <Camera className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-green-900 font-bold text-lg">
                          {selectedAttractions.length} Tourist Place{selectedAttractions.length !== 1 ? 's' : ''} Selected
                        </p>
                        <p className="text-green-700 text-sm">
                          Ready to add these to your itinerary
                        </p>
                      </div>
                    </div>
                    <div className="text-green-600">
                      <Heart className="w-8 h-8 fill-current" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex gap-4">
            <Button
              type="submit"
              className="flex-1"
              disabled={selectedDestination && touristPlaces.length > 0 && selectedAttractions.length === 0}
              title={
                selectedDestination && touristPlaces.length > 0 && selectedAttractions.length === 0
                  ? 'Select at least one tourist place to continue'
                  : undefined
              }
            >
              Continue to Itinerary
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/dashboard')}
            >
              Cancel
            </Button>
          </div>
        </form>

        {!selectedDestination && (
          <div className="text-center py-12 bg-gray-100 rounded-lg">
            <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">Select a destination to see tourist attractions</p>
            <Button className="mt-4" onClick={() => navigate('/dashboard')}>
              Browse Destinations
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
