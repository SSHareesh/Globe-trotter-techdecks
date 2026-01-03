import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Calendar,
  MapPin,
  ArrowLeft,
  Loader2,
  ChevronRight,
  ChevronLeft,
  Navigation,
  Sparkles
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import Card from '../components/Card';
import { getTripById } from '../api/tripApi';
import { enhanceTrip } from '../api/landingApi';

export default function ItineraryView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeDay, setActiveDay] = useState(1);
  const [enhancedSchedule, setEnhancedSchedule] = useState<any[]>([]);
  const [isEnhancing, setIsEnhancing] = useState(false);

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

      // Attempt AI enhancement
      try {
        setIsEnhancing(true);
        const {
          start_date,
          end_date,
          destination_data,
          attractions_data,
          hotel_data
        } = data;
        const start = new Date(start_date);
        const end = new Date(end_date);
        const duration = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

        const enhanced = await enhanceTrip({
          destination: destination_data?.city_name || 'destination',
          duration,
          activities: attractions_data || [],
          hotel: hotel_data?.name
        });
        setEnhancedSchedule(enhanced.days || []);
      } catch (aiErr) {
        console.error('AI Enhancement failed:', aiErr);
      } finally {
        setIsEnhancing(false);
      }

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
    attractions_data
  } = trip;

  const start = new Date(start_date);
  const end = new Date(end_date);
  const duration = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

  // Static Fallback Schedule Logic
  const attractionsPerDay = Math.ceil((attractions_data?.length || 0) / duration);
  const getDayAttractions = (dayIndex: number) => {
    if (!attractions_data) return [];
    const startIdx = (dayIndex - 1) * attractionsPerDay;
    return attractions_data.slice(startIdx, startIdx + attractionsPerDay);
  };

  const getDaySchedule = (dayIndex: number) => {
    // Resilient matching for string or number indices
    const aiDay = enhancedSchedule.find(d => Number(d.day) === dayIndex);
    if (aiDay?.schedule) return aiDay.schedule;

    const schedule: any[] = [];
    const isFirstDay = dayIndex === 1;
    const isLastDay = dayIndex === duration;

    // Day 1: Arrival & Check-in
    if (isFirstDay) {
      schedule.push({
        time: '09:00 AM',
        type: 'TRAVEL',
        title: 'Arrival & Hotel Check-in',
        description: `Touch down at ${destination_data?.city_name || 'destination'}, clear customs and enjoy a comfortable transfer.`,
        image: 'https://images.pexels.com/photos/1008155/pexels-photo-1008155.jpeg'
      });
    } else {
      schedule.push({
        time: '08:30 AM',
        type: 'DINING',
        title: 'Breakfast at Hotel',
        description: 'Start your day with a delicious breakfast spread at the hotel restaurant.',
        image: 'https://images.pexels.com/photos/541227/pexels-photo-541227.jpeg'
      });
    }

    const attractions = getDayAttractions(dayIndex);
    attractions.forEach((attr: any, idx: number) => {
      if (idx === 1 || (attractions.length === 1 && idx === 0)) {
        schedule.push({
          time: '01:30 PM',
          type: 'DINING',
          title: 'Authentic Local Lunch',
          description: `Savor the flavors of ${destination_data?.city_name || 'the city'} at a local eatery.`,
          image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg'
        });
      }

      schedule.push({
        time: idx === 0 ? '10:30 AM' : (idx === 1 ? '03:30 PM' : '05:30 PM'),
        type: attr.type?.toUpperCase() || 'SIGHTSEEING',
        title: attr.name,
        description: attr.description || 'Experience the local culture and history at this iconic spot.',
        image: attr.image_url || attr.image
      });
    });

    if (isLastDay) {
      schedule.push({
        time: '06:00 PM',
        type: 'TRAVEL',
        title: 'Departure & Flight Home',
        description: 'Check out and proceed to the airport for your flight back home.',
        image: 'https://images.pexels.com/photos/46148/aircraft-jet-landing-cloud-46148.jpeg'
      });
    } else {
      schedule.push({
        time: '08:00 PM',
        type: 'DINING',
        title: 'Evening Dinner',
        description: 'Unwind with a delightful dinner experience.',
        image: 'https://images.pexels.com/photos/67468/pexels-photo-67468.jpeg'
      });
    }

    return schedule;
  };

  const daySchedule = getDaySchedule(activeDay);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="relative h-[380px] overflow-hidden">
        <img
          src={destination_data?.image || destination_data?.image_url || 'https://images.pexels.com/photos/2082103/pexels-photo-2082103.jpeg'}
          className="w-full h-full object-cover"
          alt={name}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />
        <div className="absolute bottom-12 left-0 right-0 max-w-7xl mx-auto px-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/trips')}
            className="mb-8 text-white hover:bg-white/20 transition-colors bg-white/10 backdrop-blur-md rounded-full px-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Trips
          </Button>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-5xl font-black text-white mb-4 tracking-tighter">{name}</h1>
              <div className="flex flex-wrap items-center gap-4 text-white/90">
                <div className="flex items-center gap-2 bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-white/10">
                  <MapPin className="w-4 h-4 text-green-400" />
                  <span className="font-bold text-base">{destination_data?.city_name}</span>
                </div>
                <div className="flex items-center gap-2 bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-white/10">
                  <Calendar className="w-4 h-4 text-green-400" />
                  <span className="font-bold text-base">{start_date} — {end_date}</span>
                </div>
              </div>
            </div>
            {flight_data?.price && (
              <div className="bg-white/10 backdrop-blur-xl p-5 rounded-[2rem] border border-white/20 text-white min-w-[180px]">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">Total Budget</p>
                <p className="text-3xl font-black text-green-400">
                  ₹{flight_data.price.total}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          <div className="lg:col-span-3">
            <div className="sticky top-24 space-y-4">
              <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-3">
                <Navigation className="w-5 h-5 text-green-600" /> Itinerary
              </h3>
              <div className="flex flex-col gap-2">
                {Array.from({ length: duration }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveDay(i + 1)}
                    className={`w-full group relative flex items-center gap-4 px-5 py-4 rounded-3xl transition-all duration-300 ${activeDay === i + 1
                      ? 'bg-green-600 text-white shadow-lg shadow-green-100 scale-[1.02]'
                      : 'bg-white text-gray-400 hover:bg-white/80'
                      }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm transition-colors ${activeDay === i + 1 ? 'bg-white text-green-600' : 'bg-gray-100 text-gray-400'
                      }`}>
                      {i + 1}
                    </div>
                    <div className="text-left">
                      <span className="block text-[10px] font-black uppercase tracking-widest opacity-60">Day</span>
                      <span className="block font-black text-base">Plan details</span>
                    </div>
                  </button>
                ))}
              </div>

              {isEnhancing && (
                <div className="mt-8 p-6 bg-green-50 rounded-3xl border border-green-100 flex items-center gap-4 animate-pulse">
                  <Sparkles className="w-6 h-6 text-green-600 animate-bounce" />
                  <p className="text-xs font-black text-green-700">AI is polishing your itinerary...</p>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-9">
            <div className="flex items-center gap-4 mb-10">
              <div className="bg-green-600 text-white w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-black shadow-lg">
                {activeDay}
              </div>
              <div>
                <h2 className="text-3xl font-black text-gray-900">Day {activeDay} Schedule</h2>
                <p className="text-gray-400 font-bold text-sm flex items-center gap-2">
                  <Sparkles className="w-3 h-3 text-green-500" /> AI Enhanced with local gems
                </p>
              </div>
            </div>

            <div className="relative pl-10 space-y-8">
              <div className="absolute left-[19px] top-4 bottom-4 w-[2px] bg-gray-100" />

              {daySchedule.map((item: any, idx: number) => (
                <div key={idx} className="relative group">
                  <div className="absolute -left-[39px] top-6 w-5 h-5 bg-white border-4 border-green-500 rounded-full z-10 transition-transform group-hover:scale-125" />

                  <Card className="p-0 overflow-hidden border-none shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col md:flex-row min-h-[160px] rounded-[2rem] bg-white">
                    <div className="w-full md:w-[240px] h-[160px] overflow-hidden relative">
                      <img
                        src={item.image || `https://images.pexels.com/photos/2082103/pexels-photo-2082103.jpeg?auto=compress&cs=tinysrgb&w=300`}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/5" />
                    </div>

                    <div className="flex-1 p-6 flex flex-col justify-center">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-gray-900 font-black text-sm bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                          {item.time}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-[9px] font-black tracking-widest uppercase ${item.type === 'TRAVEL' ? 'bg-blue-50 text-blue-500' :
                          item.type === 'DINING' ? 'bg-orange-50 text-orange-500' :
                            item.type === 'CULTURE' ? 'bg-purple-50 text-purple-500' :
                              item.type === 'LEISURE' ? 'bg-teal-50 text-teal-500' :
                                'bg-green-50 text-green-500'
                          }`}>
                          {item.type}
                        </span>
                      </div>

                      <h3 className="text-lg font-black text-gray-900 mb-1">{item.title}</h3>
                      <p className="text-gray-400 text-xs font-medium leading-relaxed italic line-clamp-2">
                        {item.description}
                      </p>
                    </div>
                  </Card>
                </div>
              ))}
            </div>

            <div className="mt-16 pt-10 border-t border-gray-100 flex justify-between gap-4">
              <Button
                variant="outline"
                disabled={activeDay === 1}
                onClick={() => {
                  setActiveDay(prev => prev - 1);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="flex-1 max-w-[200px] rounded-2xl py-4 font-black text-sm border-2"
              >
                <ChevronLeft className="w-4 h-4 mr-2" /> Previous
              </Button>
              <Button
                disabled={activeDay === duration}
                onClick={() => {
                  setActiveDay(prev => prev + 1);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="flex-1 max-w-[200px] rounded-2xl py-4 font-black text-sm bg-green-600 hover:bg-green-700 text-white shadow-lg"
              >
                Next Day <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
