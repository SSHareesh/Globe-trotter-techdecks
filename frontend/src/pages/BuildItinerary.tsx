<<<<<<< Updated upstream
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Plane,
  Hotel,
  MapPin,
  Calendar,
  ChevronRight,
  Loader2,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Star,
  Globe
} from 'lucide-react';
=======
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Plus, Trash2 } from 'lucide-react';
>>>>>>> Stashed changes
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import Card from '../components/Card';
<<<<<<< Updated upstream
import { fetchFlights, fetchHotels } from '../api/landingApi';
import { createTrip } from '../api/tripApi';

type Step = 'summary' | 'flights' | 'hotels' | 'complete';
=======
import { createTrip } from '../api/axiosInstance';

interface ItinerarySection {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  budget: string;
}
>>>>>>> Stashed changes

interface TripData {
  name: string;
  destination: string;
  startDate: string;
  endDate: string;
}

export default function BuildItinerary() {
  const navigate = useNavigate();
  const location = useLocation();
<<<<<<< Updated upstream
  const { tripData, destination, attractions } = location.state || {};

  const [currentStep, setCurrentStep] = useState<Step>('summary');
  const [loading, setLoading] = useState(false);
  const [flights, setFlights] = useState<any[]>([]);
  const [hotels, setHotels] = useState<any[]>([]);
  const [selectedFlight, setSelectedFlight] = useState<any>(null);
  const [selectedHotel, setSelectedHotel] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!destination) {
      navigate('/dashboard');
    }
  }, [destination, navigate]);

  const loadFlights = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchFlights({
        origin: 'MAA',
        destination: destination?.iata_code || 'DEL',
        departure_date: tripData?.startDate || '2026-06-01',
        return_date: tripData?.endDate || '2026-06-10'
      });
      setFlights(data.results || []);
      setCurrentStep('flights');
    } catch (err: any) {
      setError(err.message || 'Failed to load flights');
    } finally {
      setLoading(false);
    }
=======
  const { tripData, selectedDestination, selectedAttractions } = location.state as {
    tripData?: TripData;
    selectedDestination?: any;
    selectedAttractions?: any[];
  } || {};
  
  const [sections, setSections] = useState<ItinerarySection[]>([
    { 
      id: 1, 
      title: 'Section 1', 
      description: '',
      startDate: tripData?.startDate || '', 
      endDate: tripData?.endDate || '', 
      budget: '' 
    }
  ]);
  const [saving, setSaving] = useState(false);

  const addSection = () => {
    const nextSectionNumber = sections.length + 1;
    setSections([
      ...sections,
      { 
        id: Date.now(), 
        title: `Section ${nextSectionNumber}`,
        description: '',
        startDate: '', 
        endDate: '', 
        budget: '' 
      }
    ]);
>>>>>>> Stashed changes
  };

  const loadHotels = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchHotels({
        city: destination?.city_name || 'Paris',
        check_in: tripData?.startDate || '2026-06-01',
        check_out: tripData?.endDate || '2026-06-10'
      });
      setHotels(data.results || []);
      setCurrentStep('hotels');
    } catch (err: any) {
      setError(err.message || 'Failed to load hotels');
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async () => {
    setLoading(true);
    setError(null);
    try {
      await createTrip({
        name: tripData?.name || `Trip to ${destination.city_name}`,
        start_date: tripData?.startDate,
        end_date: tripData?.endDate,
        destination_data: destination,
        attractions_data: attractions,
        flight_data: selectedFlight,
        hotel_data: selectedHotel
      });
      setCurrentStep('complete');
    } catch (err: any) {
      setError(err.message || 'Failed to save itinerary');
    } finally {
      setLoading(false);
    }
  };

  const renderStepIcon = (step: Step) => {
    switch (step) {
      case 'summary': return <Globe className="w-5 h-5" />;
      case 'flights': return <Plane className="w-5 h-5" />;
      case 'hotels': return <Hotel className="w-5 h-5" />;
      case 'complete': return <CheckCircle2 className="w-5 h-5" />;
    }
  };

  const renderStepProgressBar = () => {
    const steps: Step[] = ['summary', 'flights', 'hotels', 'complete'];
    const currentIndex = steps.indexOf(currentStep);

    return (
      <div className="flex items-center justify-center mb-12">
        {steps.map((step, index) => (
          <div key={step} className="flex items-center">
            <div className={`flex flex-col items-center relative`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${index <= currentIndex ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                {renderStepIcon(step)}
              </div>
              <span className={`absolute -bottom-7 text-xs font-bold uppercase tracking-wider ${index <= currentIndex ? 'text-green-700' : 'text-gray-400'
                }`}>
                {step}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className={`w-16 h-1 mt-[-1rem] mx-2 ${index < currentIndex ? 'bg-green-600' : 'bg-gray-200'
                }`} />
            )}
          </div>
        ))}
      </div>
    );
  };

<<<<<<< Updated upstream
  if (!destination) return null;
=======
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!tripData) {
      alert('No trip data found. Please start from Create Trip page.');
      navigate('/create-trip');
      return;
    }
    
    try {
      setSaving(true);
      
      // Calculate total budget
      const totalBudget = sections.reduce((sum, section) => sum + (parseFloat(section.budget) || 0), 0);
      
      // Prepare trip data for backend
      const tripPayload = {
        name: tripData.name,
        description: tripData.destination,
        start_date: tripData.startDate,
        end_date: tripData.endDate,
        destination: selectedDestination?.label || tripData.destination,
        budget: `$${totalBudget.toLocaleString()}`,
        sections: sections.map(s => ({
          title: s.title,
          description: s.description,
          start_date: s.startDate,
          end_date: s.endDate,
          budget: s.budget
        }))
      };
      
      const response = await createTrip(tripPayload);
      
      // Navigate to trips page after successful creation
      navigate('/trips', { 
        state: { message: 'Trip created successfully!', tripId: response.data.id } 
      });
    } catch (error) {
      console.error('Failed to create trip:', error);
      alert('Failed to save trip. Please try again.');
    } finally {
      setSaving(false);
    }
  };
>>>>>>> Stashed changes

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Navbar />

<<<<<<< Updated upstream
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {renderStepProgressBar()}

        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-center">
            {error}
=======
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Build Your Itinerary</h1>
          <p className="text-gray-600">Organize your trip into sections with dates and budget</p>
          
          {tripData && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <h2 className="font-semibold text-gray-900">{tripData.name}</h2>
              <p className="text-sm text-gray-600">
                {selectedDestination?.label || tripData.destination} • {tripData.startDate} to {tripData.endDate}
              </p>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {sections.map((section, index) => (
            <Card key={section.id} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-900">
                  Section {index + 1}:
                </h3>
                {sections.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSection(section.id)}
                    className="text-red-600 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Section Description
                  </label>
                  <textarea
                    placeholder="Describe what you'll do in this section..."
                    value={section.description}
                    onChange={(e) => updateSection(section.id, 'description', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date Range
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="date"
                      value={section.startDate}
                      onChange={(e) => updateSection(section.id, 'startDate', e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                    <span className="text-gray-500">to</span>
                    <input
                      type="date"
                      value={section.endDate}
                      onChange={(e) => updateSection(section.id, 'endDate', e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <Input
                  label="Budget for Section"
                  type="number"
                  placeholder="Enter budget amount"
                  value={section.budget}
                  onChange={(e) => updateSection(section.id, 'budget', e.target.value)}
                  required
                />
              </div>
            </Card>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={addSection}
            className="w-full flex items-center justify-center gap-2 py-3 text-blue-600 border-blue-300 hover:bg-blue-50"
          >
            <Plus className="h-5 w-5" />
            Add another Section
          </Button>

          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={saving} className="flex-1 bg-blue-600 hover:bg-blue-700 py-3">
              {saving ? 'Saving Trip...' : 'Continue to Itinerary'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/create-trip')}
              disabled={saving}
              className="px-8"
            >
              Back
            </Button>
>>>>>>> Stashed changes
          </div>
        )}

        {currentStep === 'summary' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center">
              <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Trip Summary</h1>
              <p className="text-gray-600 max-w-2xl mx-auto">Review your selection before we find the best travel options for you.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="p-8 md:col-span-1 bg-white shadow-xl border-t-4 border-green-600">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-gray-400 text-xs font-bold uppercase mb-2">Destination</h3>
                    <div className="flex items-center gap-3">
                      <div className="bg-green-100 p-2 rounded-lg">
                        <MapPin className="w-5 h-5 text-green-700" />
                      </div>
                      <span className="text-xl font-bold text-gray-900">{destination.city_name}</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-gray-400 text-xs font-bold uppercase mb-2">Duration</h3>
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <Calendar className="w-5 h-5 text-blue-700" />
                      </div>
                      <span className="text-gray-700 font-medium">
                        {tripData?.startDate} to {tripData?.endDate}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>

              <div className="md:col-span-2 space-y-4">
                <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  Planned Activities ({attractions?.length || 0})
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {attractions?.map((attr: any, i: number) => (
                    <div key={i} className="flex gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                      <img src={attr.image_url || attr.image} className="w-16 h-16 rounded-lg object-cover" alt="" />
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm">{attr.name}</h4>
                        <p className="text-xs text-gray-500 line-clamp-1">{attr.type || 'Attraction'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-center mt-12">
              <Button size="lg" onClick={loadFlights} disabled={loading} className="px-12 py-4 rounded-2xl shadow-xl hover:scale-105 transition-transform flex items-center gap-3">
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Plane className="w-6 h-6 text-green-200" />}
                Find Flights to {destination.city_name}
              </Button>
            </div>
          </div>
        )}

        {currentStep === 'flights' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="text-center">
              <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Round-trip Flights</h1>
              <p className="text-gray-600">We've found the best connections for your dates.</p>
            </div>

            <div className="space-y-6">
              {flights.map((flight: any) => {
                const outbound = flight.itineraries[0];
                const inbound = flight.itineraries[1];
                const isSelected = selectedFlight?.id === flight.id;

                return (
                  <Card
                    key={flight.id}
                    className={`p-1 overflow-hidden cursor-pointer transition-all ${isSelected ? 'ring-4 ring-green-600 shadow-2xl scale-[1.01]' : 'hover:shadow-lg'
                      }`}
                    onClick={() => setSelectedFlight(flight)}
                  >
                    <div className="flex flex-col md:flex-row bg-white">
                      <div className="flex-1 p-6 border-b md:border-b-0 md:border-r border-gray-100">
                        <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase mb-4">
                          <ArrowRight className="w-3 h-3" /> Outbound Flight
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="text-center">
                            <p className="text-2xl font-black text-gray-900">{outbound.segments[0].departure.iataCode}</p>
                            <p className="text-xs text-gray-400 font-bold">{new Date(outbound.segments[0].departure.at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                          </div>
                          <div className="flex flex-col items-center flex-1 px-8">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{outbound.duration.replace('PT', '').toLowerCase()}</p>
                            <div className="w-full relative h-[2px] bg-gray-100">
                              <div className="absolute top-1/2 left-0 w-2 h-2 rounded-full bg-blue-500 -translate-y-1/2" />
                              <div className="absolute top-1/2 right-0 w-2 h-2 rounded-full bg-blue-500 -translate-y-1/2" />
                              <Plane className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 text-blue-500 bg-white p-0.5" />
                            </div>
                            <p className="text-[10px] font-bold text-blue-600 mt-1 uppercase">Direct</p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-black text-gray-900">{outbound.segments[outbound.segments.length - 1].arrival.iataCode}</p>
                            <p className="text-xs text-gray-400 font-bold">{new Date(outbound.segments[outbound.segments.length - 1].arrival.at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                          </div>
                        </div>
                      </div>

                      {inbound && (
                        <div className="flex-1 p-6 bg-gray-50/50">
                          <div className="flex items-center gap-2 text-xs font-bold text-green-600 uppercase mb-4">
                            <ArrowRight className="w-3 h-3 rotate-180" /> Return Flight
                          </div>
                          <div className="flex justify-between items-center">
                            <div className="text-center">
                              <p className="text-2xl font-black text-gray-800">{inbound.segments[0].departure.iataCode}</p>
                              <p className="text-xs text-gray-400 font-bold">{new Date(inbound.segments[0].departure.at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                            </div>
                            <div className="flex flex-col items-center flex-1 px-8">
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{inbound.duration.replace('PT', '').toLowerCase()}</p>
                              <div className="w-full relative h-[2px] bg-gray-200">
                                <div className="absolute top-1/2 left-0 w-2 h-2 rounded-full bg-green-500 -translate-y-1/2" />
                                <div className="absolute top-1/2 right-0 w-2 h-2 rounded-full bg-green-500 -translate-y-1/2" />
                                <Plane className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 text-green-500 rotate-180 bg-gray-50 p-0.5" />
                              </div>
                              <p className="text-[10px] font-bold text-green-600 mt-1 uppercase">Direct</p>
                            </div>
                            <div className="text-center">
                              <p className="text-2xl font-black text-gray-800">{inbound.segments[inbound.segments.length - 1].arrival.iataCode}</p>
                              <p className="text-xs text-gray-400 font-bold">{new Date(inbound.segments[inbound.segments.length - 1].arrival.at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="p-6 md:w-48 flex flex-col items-center justify-center bg-green-600 text-white gap-2">
                        <p className="text-sm font-bold opacity-80 uppercase tracking-tighter">Total Price</p>
                        <p className="text-3xl font-black">{flight.price.currency === 'INR' ? '₹' : (flight.price.currency || '$')}{flight.price.total}</p>
                        <div className={`mt-2 p-1 rounded-full bg-white transition-opacity ${isSelected ? 'opacity-100' : 'opacity-20'}`}>
                          <CheckCircle2 className="w-6 h-6 text-green-600" />
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}

              {!loading && flights.length === 0 && (
                <div className="text-center py-20 bg-white rounded-2xl shadow-inner border border-dashed border-gray-300">
                  <Plane className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 font-bold text-xl">No flights found for these dates.</p>
                  <Button variant="outline" className="mt-4" onClick={() => setCurrentStep('summary')}>Go Back</Button>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center mt-12 bg-white p-6 rounded-2xl shadow-lg">
              <Button variant="outline" onClick={() => setCurrentStep('summary')} className="flex items-center gap-2">
                Modify Summary
              </Button>
              <div className="flex items-center gap-6">
                {selectedFlight && (
                  <div className="text-right">
                    <p className="text-xs font-bold text-gray-400 uppercase">Selected Flight</p>
                    <p className="text-xl font-bold text-gray-900">{selectedFlight.price.currency === 'INR' ? '₹' : (selectedFlight.price.currency || '$')}{selectedFlight.price.total}</p>
                  </div>
                )}
                <Button size="lg" onClick={loadHotels} disabled={!selectedFlight || loading} className="px-12 flex items-center gap-2 shadow-xl shadow-green-200">
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ChevronRight className="w-5 h-5" />}
                  Choose Accommodation
                </Button>
              </div>
            </div>
          </div>
        )}

        {currentStep === 'hotels' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="text-center">
              <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Select Hotel</h1>
              <p className="text-gray-600">Top-rated hotels in {destination.city_name} for your stay.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {hotels.map((hotel: any, idx) => {
                const isSelected = selectedHotel?.name === hotel.name;
                return (
                  <Card
                    key={idx}
                    className={`group cursor-pointer overflow-hidden transition-all duration-300 ${isSelected ? 'ring-4 ring-green-600 shadow-2xl scale-[1.03]' : 'hover:shadow-xl hover:-translate-y-1'
                      }`}
                    onClick={() => setSelectedHotel(hotel)}
                  >
                    <div className="relative h-64">
                      <img src={hotel.images?.[0]?.thumbnail || 'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=400'} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-bold text-gray-900">{hotel.rate_per_night?.lowest || '—'}</span>
                      </div>
                      {isSelected && (
                        <div className="absolute inset-0 bg-green-600/20 backdrop-blur-[2px] flex items-center justify-center">
                          <div className="bg-white p-3 rounded-full shadow-2xl">
                            <CheckCircle2 className="w-10 h-10 text-green-600" />
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-black text-gray-900 mb-2 truncate">{hotel.name}</h3>
                      <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="truncate">{hotel.description || 'Verified Hotel'}</span>
                      </div>
                      <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                        <div>
                          <p className="text-[10px] text-gray-400 font-bold uppercase">Price per night</p>
                          <p className="text-2xl font-black text-green-700">{hotel.rate_per_night?.lowest?.includes('$') ? hotel.rate_per_night?.lowest.replace('$', '₹') : (hotel.rate_per_night?.lowest || '₹10,000')}</p>
                        </div>
                        <Button variant={isSelected ? 'outline' : 'primary'} size="sm" className="rounded-xl px-6">
                          {isSelected ? 'Selected' : 'Select'}
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            <div className="flex justify-between items-center mt-12 bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
              <Button variant="outline" onClick={() => setCurrentStep('flights')} className="flex items-center gap-2">
                Back to Flights
              </Button>
              <Button size="lg" onClick={handleComplete} disabled={!selectedHotel} className="px-16 py-4 rounded-2xl shadow-xl shadow-green-100 flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6" />
                Complete My Itinerary
              </Button>
            </div>
          </div>
        )}

        {currentStep === 'complete' && (
          <div className="text-center py-20 animate-in zoom-in duration-500">
            <div className="mb-8 relative inline-block">
              <div className="absolute inset-0 bg-green-600 blur-3xl opacity-20 animate-pulse" />
              <div className="bg-white p-10 rounded-[40px] shadow-2xl relative border-4 border-green-50">
                <CheckCircle2 className="w-24 h-24 text-green-600 mx-auto" />
              </div>
            </div>
            <h1 className="text-5xl font-black text-gray-900 mb-6">Itinerary Complete!</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-12">
              Your trip to <span className="text-green-700 font-bold">{destination.city_name}</span> is all set. We've compiled your flights, hotels, and activities into a single master plan.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button size="lg" className="px-12 py-5 rounded-3xl shadow-2xl text-lg font-bold" onClick={() => navigate('/trips')}>
                View My Trips
              </Button>
              <Button size="lg" variant="outline" className="px-12 py-5 rounded-3xl text-lg font-bold" onClick={() => navigate('/dashboard')}>
                Back to Home
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
