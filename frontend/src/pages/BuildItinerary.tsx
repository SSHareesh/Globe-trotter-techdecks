import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import Input from '../components/Input';
import Button from '../components/Button';
import Card from '../components/Card';

interface ItinerarySection {
  id: number;
  title: string;
  startDate: string;
  endDate: string;
  budget: string;
}

export default function BuildItinerary() {
  const navigate = useNavigate();
  const [sections, setSections] = useState<ItinerarySection[]>([
    { id: 1, title: '', startDate: '', endDate: '', budget: '' }
  ]);

  const addSection = () => {
    setSections([
      ...sections,
      { id: Date.now(), title: '', startDate: '', endDate: '', budget: '' }
    ]);
  };

  const removeSection = (id: number) => {
    setSections(sections.filter((section) => section.id !== id));
  };

  const updateSection = (id: number, field: string, value: string) => {
    setSections(
      sections.map((section) =>
        section.id === id ? { ...section, [field]: value } : section
      )
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/trips');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Build Your Itinerary</h1>
          <p className="text-gray-600">Organize your trip into sections and activities</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {sections.map((section, index) => (
            <Card key={section.id} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Section {index + 1}
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
                <Input
                  label="Section Title"
                  type="text"
                  placeholder="e.g., Exploring Athens"
                  value={section.title}
                  onChange={(e) => updateSection(section.id, 'title', e.target.value)}
                  required
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Start Date"
                    type="date"
                    value={section.startDate}
                    onChange={(e) => updateSection(section.id, 'startDate', e.target.value)}
                    required
                  />
                  <Input
                    label="End Date"
                    type="date"
                    value={section.endDate}
                    onChange={(e) => updateSection(section.id, 'endDate', e.target.value)}
                    required
                  />
                </div>

                <Input
                  label="Budget for Section"
                  type="number"
                  placeholder="1000"
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
            className="w-full flex items-center justify-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Add Another Section
          </Button>

          <div className="flex gap-4 pt-4">
            <Button type="submit" className="flex-1">
              Save Itinerary
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
      </div>
    </div>
  );
}
