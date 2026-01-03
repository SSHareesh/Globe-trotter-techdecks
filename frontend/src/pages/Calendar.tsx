import { useState } from 'react';
import Navbar from '../components/Navbar';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 1));

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const previousMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const trips = [
    { day: 15, title: 'Summer in Ooty' },
    { day: 16, title: 'Summer in Ooty' },
    { day: 17, title: 'Summer in Ooty' },
  ];

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
      <Navbar/>
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

          {/* Date Grid */}
          <div className="grid grid-cols-7 bg-gray-100 gap-[1px]">
            {calendarGrid.map((cell, index) => {
              const tripToday = cell.isCurrent && trips.find(t => t.day === cell.day);
              
              return (
                <div 
                  key={index} 
                  className={`min-h-[120px] bg-white p-3 transition-colors ${
                    !cell.isCurrent ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  <span className="text-sm font-semibold">{cell.day}</span>
                  
                  {/* Trip Badge - Exactly like the image */}
                  {tripToday && (
                    <div className="mt-4">
                      <div className="bg-green-600 text-white text-[11px] md:text-xs py-1.5 px-3 rounded-md font-medium truncate shadow-sm">
                        {tripToday.title}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}