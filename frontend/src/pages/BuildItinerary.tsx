import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Plus, Trash2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import Card from '../components/Card';
import Input from '../components/Input';
import { createTrip } from '../api/axiosInstance';

interface ItinerarySection {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  budget: string;
}

interface TripData {
  name: string;
  destination: string;
  startDate: string;
  endDate: string;
}

export default function BuildItinerary() {
  const navigate = useNavigate();
  const location = useLocation();
  const { tripData, selectedDestination, selectedAttractions } =
    (location.state as {
      tripData?: TripData;
      selectedDestination?: any;
      selectedAttractions?: any[];
    }) || {};
  
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
  };

  const updateSection = (sectionId: number, field: keyof Omit<ItinerarySection, 'id'>, value: string) => {
    setSections((prev) => prev.map((s) => (s.id === sectionId ? { ...s, [field]: value } : s)));
  };

  const removeSection = (sectionId: number) => {
    setSections((prev) => prev.filter((s) => s.id !== sectionId));
  };

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

  if (!tripData) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Build Your Itinerary</h1>
            <p className="text-gray-600 mb-6">No trip data found. Start from Create Trip to continue.</p>
            <Button onClick={() => navigate('/create-trip')}>Go to Create Trip</Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Build Your Itinerary</h1>
          <p className="text-gray-600">Organize your trip into sections with dates and budget</p>
          
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <h2 className="font-semibold text-gray-900">{tripData.name}</h2>
            <p className="text-sm text-gray-600">
              {selectedDestination?.label || tripData.destination} • {tripData.startDate} to {tripData.endDate}
            </p>
            {Array.isArray(selectedAttractions) && selectedAttractions.length > 0 && (
              <p className="text-sm text-gray-600 mt-1">
                {selectedAttractions.length} activities selected
              </p>
            )}
          </div>
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
          </div>
        </form>
      </div>
    </div>
  );
}
