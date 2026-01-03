import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Calendar,
  MapPin,
  ArrowLeft,
  Plane,
  Hotel,
  Clock,
  Ticket,
  Loader2,
  ChevronRight,
  ChevronLeft,
  Navigation
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import Card from '../components/Card';
import { getTripById } from '../api/tripApi';

export default function ItineraryView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeDay, setActiveDay] = useState(1);

  useEffect(() => {
    if (id) {
      loadTripDetails();
    }
  }, [id]);

  const loadTripDetails = async () => {
    try {
      setLoading(true);
      const data = await getTripById(id!);
      setTrip(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load trip details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-green-600 animate-spin" />
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="min-h-screen bg-gray-50 p-12 text-center">
        <Card className="max-w-md mx-auto p-12">
          <p className="text-red-600 font-bold mb-4">{error || 'Trip not found'}</p>
          <Button onClick={() => navigate('/trips')}>Back to My Trips</Button>
        </Card>
      </div>
    );
  }

  const {
    name,
    start_date,
    end_date,
    destination_data,
    flight_data,
    hotel_data,
    attractions_data
  } = trip;

  // Calculate duration
  const start = new Date(start_date);
  const end = new Date(end_date);
  const duration = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

  // Distribute attractions across days
  const attractionsPerDay = Math.ceil((attractions_data?.length || 0) / duration);
  const getDayAttractions = (dayIndex: number) => {
    if (!attractions_data) return [];
    const startIdx = (dayIndex - 1) * attractionsPerDay;
    return attractions_data.slice(startIdx, startIdx + attractionsPerDay);
  };

  const dayAttractions = getDayAttractions(activeDay);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Header */}
      <div className="relative h-[400px] overflow-hidden">
        <img
          src={destination_data?.image || 'https://images.pexels.com/photos/2082103/pexels-photo-2082103.jpeg'}
          className="w-full h-full object-cover"
          alt={name}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute bottom-12 left-0 right-0 max-w-6xl mx-auto px-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/trips')}
            className="mb-6 text-white hover:bg-white/20 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Trips
          </Button>
          <h1 className="text-5xl font-black text-white mb-2">{name}</h1>
          <div className="flex items-center gap-6 text-white/90">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-green-400" />
              <span className="font-bold text-lg">{destination_data?.city_name}, {destination_data?.country_name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-green-400" />
              <span className="font-bold text-lg">{start_date} to {end_date}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* Left Sidebar: Logistics */}
          <div className="lg:col-span-1 space-y-8">
            {/* Flight Details */}
            {flight_data && (
              <Card className="p-6 border-l-4 border-blue-500 shadow-lg">
                <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Plane className="w-4 h-4 text-blue-500" /> Confirmed Flight
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-2xl font-black text-gray-900">{flight_data.itineraries[0].segments[0].departure.iataCode}</p>
                      <p className="text-xs text-gray-500 font-bold">Departure</p>
                    </div>
                    <div className="flex-1 flex flex-col items-center px-4">
                      <Plane className="w-4 h-4 text-blue-500 mb-1" />
                      <div className="w-full h-[1px] bg-gray-200" />
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-black text-gray-900">
                        {flight_data.itineraries[0].segments[flight_data.itineraries[0].segments.length - 1].arrival.iataCode}
                      </p>
                      <p className="text-xs text-gray-500 font-bold">Arrival</p>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-sm font-bold text-gray-600">Total Price:</span>
                    <span className="text-xl font-black text-blue-600">${flight_data.price.total}</span>
                  </div>
                </div>
              </Card>
            )}

            {/* Hotel Details */}
            {hotel_data && (
              <Card className="p-0 overflow-hidden border-l-4 border-green-500 shadow-lg group">
                <div className="h-32 overflow-hidden">
                  <img src={hotel_data.images?.[0]?.thumbnail || 'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg'} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                </div>
                <div className="p-6">
                  <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Hotel className="w-4 h-4 text-green-500" /> Accommodation
                  </h3>
                  <h4 className="text-lg font-black text-gray-900 mb-1">{hotel_data.name}</h4>
                  <p className="text-xs text-gray-500 line-clamp-2 mb-4 italic">{hotel_data.description}</p>
                  <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <span className="text-sm font-bold text-gray-600">Per Night:</span>
                    <span className="text-xl font-black text-green-600">{hotel_data.rate_per_night?.lowest || '$120'}</span>
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Right Column: Day-wise Itinerary */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center justify-between mb-8 overflow-x-auto pb-4 gap-4 no-scrollbar">
              {Array.from({ length: duration }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveDay(i + 1)}
                  className={`flex-shrink-0 px-6 py-4 rounded-2xl transition-all duration-300 flex flex-col items-center gap-1 ${activeDay === i + 1
                    ? 'bg-green-600 text-white shadow-xl shadow-green-100 scale-105'
                    : 'bg-white text-gray-500 hover:bg-gray-100'
                    }`}
                >
                  <span className="text-[10px] font-black uppercase tracking-tighter opacity-70">Day</span>
                  <span className="text-2xl font-black">{i + 1}</span>
                </button>
              ))}
            </div>

            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-4 mb-8">
                <div className="bg-green-100 p-3 rounded-2xl">
                  <Ticket className="w-8 h-8 text-green-600" />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-gray-900">Planned Activities</h2>
                  <p className="text-gray-500 font-medium">Discovering {destination_data?.city_name}'s finest spots</p>
                </div>
              </div>

              {dayAttractions.length > 0 ? (
                dayAttractions.map((attr: any, idx: number) => (
                  <Card key={idx} className="p-0 overflow-hidden flex flex-col md:flex-row shadow-md hover:shadow-xl transition-shadow border-none outline-none group">
                    <div className="w-full md:w-64 h-48 overflow-hidden relative">
                      <img src={attr.image_url || attr.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black text-green-700 uppercase tracking-widest">
                        {attr.type || 'Attraction'}
                      </div>
                    </div>
                    <div className="flex-1 p-8 flex flex-col justify-center">
                      <div className="flex items-center gap-2 text-xs font-bold text-gray-400 mb-2">
                        <Clock className="w-3 h-3" /> {idx === 0 ? 'Morning' : idx === 1 ? 'Afternoon' : 'Evening'} Session
                      </div>
                      <h3 className="text-2xl font-black text-gray-900 mb-3">{attr.name}</h3>
                      <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-6">{attr.description}</p>
                      <div className="flex items-center justify-between">
                        <Button variant="ghost" size="sm" className="px-0 hover:bg-transparent text-green-600 hover:text-green-700 font-black flex items-center gap-1 group/btn">
                          Explore Details <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                        </Button>
                        <div className="bg-gray-50 p-2 rounded-xl group-hover:bg-green-50 transition-colors">
                          <Navigation className="w-5 h-5 text-gray-300 group-hover:text-green-500" />
                        </div>
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="text-center py-20 bg-white rounded-[40px] border-2 border-dashed border-gray-200">
                  <p className="text-gray-400 font-bold">No activities scheduled for this day.</p>
                  <p className="text-sm text-gray-400">Relax and explore the city at your own pace!</p>
                </div>
              )}
            </div>

            {/* Footer Navigation */}
            <div className="pt-12 flex justify-between">
              <Button
                variant="outline"
                disabled={activeDay === 1}
                onClick={() => setActiveDay(prev => prev - 1)}
                className="rounded-2xl px-8 flex items-center gap-2"
              >
                <ChevronLeft className="w-5 h-5" /> Previous Day
              </Button>
              <Button
                variant="outline"
                disabled={activeDay === duration}
                onClick={() => setActiveDay(prev => prev + 1)}
                className="rounded-2xl px-8 flex items-center gap-2"
              >
                Next Day <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
