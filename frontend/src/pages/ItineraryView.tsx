import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, DollarSign, Activity, ArrowLeft } from 'lucide-react';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import Card from '../components/Card';

export default function ItineraryView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const itineraryData = { destination: 'Sample Destination', days: [] };

  const totalExpense = itineraryData.days.reduce(
    (total, day) =>
      total + day.activities.reduce((dayTotal, activity) => dayTotal + activity.expense, 0),
    0
  );

  const getActivityColor = (level: string) => {
    switch (level) {
      case 'High':
        return 'bg-red-100 text-red-700';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'Low':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/trips')}
          className="mb-6 flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Trips
        </Button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Itinerary: {itineraryData.tripName}
          </h1>
          <p className="text-gray-600">{itineraryData.destination}</p>
        </div>

        <Card className="p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="h-6 w-6 text-green-600" />
              <span className="text-lg font-semibold text-gray-900">Total Budget:</span>
            </div>
            <span className="text-2xl font-bold text-green-600">${totalExpense}</span>
          </div>
        </Card>

        <div className="space-y-8">
          {itineraryData.days.map((day) => {
            const dayTotal = day.activities.reduce((sum, act) => sum + act.expense, 0);

            return (
              <Card key={day.day} className="overflow-hidden">
                <div className="bg-gradient-to-r from-green-600 to-green-500 px-6 py-4">
                  <div className="flex justify-between items-center text-white">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-6 w-6" />
                      <div>
                        <h2 className="text-xl font-bold">Day {day.day}</h2>
                        <p className="text-green-100 text-sm">{day.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-green-100 text-sm">Day Budget</p>
                      <p className="text-xl font-bold">${dayTotal}</p>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="space-y-4">
                    {day.activities.map((activity, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-sm font-medium text-gray-500">
                              {activity.time}
                            </span>
                            <h3 className="text-lg font-semibold text-gray-900">
                              {activity.name}
                            </h3>
                          </div>
                          <div className="flex items-center gap-2">
                            <Activity className="h-4 w-4 text-green-600" />
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${getActivityColor(
                                activity.physicalActivity
                              )}`}
                            >
                              {activity.physicalActivity} Activity
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Expense</p>
                          <p className="text-xl font-bold text-gray-900">${activity.expense}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
