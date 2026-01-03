import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { getTrips } from '../api/tripApi';

interface TripEvent {
  date: string; // YYYY-MM-DD format
  tripName: string;
  destination: string;
}

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 1));
  const [tripEvents, setTripEvents] = useState<TripEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  useEffect(() => {
    loadTrips();
  }, []);

  const loadTrips = async () => {
    try {
      setLoading(true);
      const responseData = await getTrips();
      const data = Array.isArray(responseData) ? responseData : (responseData.results || []);

      // Convert trips to calendar events
      const events: TripEvent[] = [];
      data.forEach((trip: any) => {
        const startDate = new Date(trip.start_date);
        const endDate = new Date(trip.end_date);
        const destination = trip.destination_data?.city_name || trip.name;

        // Create an event for each day of the trip
        const currentDay = new Date(startDate);
        while (currentDay <= endDate) {
          events.push({
            date: currentDay.toISOString().split('T')[0],
            tripName: trip.name,
            destination: destination
          });
          currentDay.setDate(currentDay.getDate() + 1);
        }
      });

      setTripEvents(events);
    } catch (err) {
      console.error('Failed to load trips:', err);
    } finally {
      setLoading(false);
    }
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const previousMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const getEventsForDate = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return tripEvents.filter(e => e.date === dateStr);
  };

  const calendarGrid = [];
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    calendarGrid.push({ day: daysInPrevMonth - i, isCurrent: false });
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarGrid.push({ day: i, isCurrent: true });
  }
  const remaining = 42 - calendarGrid.length;
  for (let i = 1; i <= remaining; i++) {
    calendarGrid.push({ day: i, isCurrent: false });
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <Navbar />
      <div className="min-h-screen bg-white py-12 px-4">
        <div className="max-w-3xl mx-auto">

          {/* Page Title */}
          <div className="mb-6">
            <h1 className="text-xl font-medium text-gray-600">View your trip schedule</h1>
          </div>

          {/* Calendar Card */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">

            {/* Header with Navigation */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <button onClick={previousMonth} className="p-2 hover:bg-gray-50 rounded-lg transition">
                <ChevronLeft className="w-5 h-5 text-gray-400" />
              </button>
              <h2 className="text-xl font-bold text-gray-800">
                {monthNames[month]} {year}
              </h2>
              <button onClick={nextMonth} className="p-2 hover:bg-gray-50 rounded-lg transition">
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Weekday Names */}
            <div className="grid grid-cols-7 border-b border-gray-100">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="py-4 text-center text-sm font-semibold text-gray-500 uppercase tracking-wider">
                  {day}
                </div>
              ))}
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
              </div>
            )}

            {/* Date Grid */}
            {!loading && (
              <div className="grid grid-cols-7 bg-gray-100 gap-[1px]">
                {calendarGrid.map((cell, index) => {
                  const events = cell.isCurrent ? getEventsForDate(cell.day) : [];

                  return (
                    <div
                      key={index}
                      className={`min-h-[120px] bg-white p-3 transition-colors ${!cell.isCurrent ? 'text-gray-300' : 'text-gray-700'
                        }`}
                    >
                      <span className="text-sm font-semibold">{cell.day}</span>

                      {/* Trip Badges */}
                      {events.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {events.slice(0, 2).map((event, idx) => (
                            <div key={idx} className="bg-green-600 text-white text-[10px] md:text-xs py-1 px-2 rounded-md font-medium truncate shadow-sm">
                              {event.destination}
                            </div>
                          ))}
                          {events.length > 2 && (
                            <div className="text-[10px] text-gray-500 font-medium">
                              +{events.length - 2} more
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
