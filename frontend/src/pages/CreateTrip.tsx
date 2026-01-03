import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Input from '../components/Input';
import Button from '../components/Button';
import Card from '../components/Card';
import { suggestedPlaces } from '../data/dummyData';

export default function CreateTrip() {
  const navigate = useNavigate();
  const [tripData, setTripData] = useState({
    name: '',
    startDate: '',
    endDate: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTripData({ ...tripData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/build-itinerary');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Create New Trip</h1>
          <p className="text-gray-600">Start planning your next adventure</p>
        </div>

        <Card className="p-8 mb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
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

            <div className="flex gap-4">
              <Button type="submit" className="flex-1">
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
        </Card>

        <div className="mb-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Suggested Places & Activities
          </h2>
          <p className="text-gray-600">Popular destinations and experiences for your trip</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {suggestedPlaces.map((place) => (
            <Card key={place.id} hover>
              <div className="flex gap-4 p-4">
                <img
                  src={place.image}
                  alt={place.name}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{place.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{place.location}</p>
                  <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                    {place.type}
                  </span>
                </div>
                <Button size="sm" variant="outline">
                  Add
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
