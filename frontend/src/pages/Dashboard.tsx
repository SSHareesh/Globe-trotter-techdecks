import { useNavigate } from 'react-router-dom';
import { Plus, Filter, ArrowUpDown } from 'lucide-react';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import TripCard from '../components/TripCard';
import Card from '../components/Card';
import { regions, trips } from '../data/dummyData';

export default function Dashboard() {
  const navigate = useNavigate();

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {regions.map((region) => (
            <Card key={region.id} hover onClick={() => navigate('/search')}>
              <div className="relative h-64 overflow-hidden rounded-t-xl">
                <img
                  src={region.image}
                  alt={region.name}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-2xl font-bold mb-1">{region.name}</h3>
                  <p className="text-green-100">{region.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

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
          {trips.map((trip) => (
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

      <button
        onClick={() => navigate('/create-trip')}
        className="fixed bottom-8 right-8 bg-gradient-to-r from-green-600 to-green-500 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
      >
        <Plus className="h-8 w-8" />
      </button>
    </div>
  );
}
