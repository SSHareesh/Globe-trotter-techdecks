import { X, MapPin, Calendar, Users } from 'lucide-react';
import { useState } from 'react';

const CreateTripModal = ({ isOpen, onClose, destination }) => {
  const [tripName, setTripName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [travelers, setTravelers] = useState(1);

  if (!isOpen || !destination) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Call API to create trip with destination details
    console.log('Creating trip:', {
      tripName,
      destination: destination.name,
      country: destination.country,
      lat: destination.lat,
      lon: destination.lon,
      startDate,
      endDate,
      travelers,
    });
    // For now, just close the modal
    alert(`Trip to ${destination.name} created! (API integration pending)`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-slate-800 border-b dark:border-slate-700 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold dark:text-white">Create New Trip</h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
              Plan your adventure to {destination.name}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full transition"
            aria-label="Close"
          >
            <X size={24} className="text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Destination Info */}
        <div className="p-6 border-b dark:border-slate-700">
          <div className="flex items-start gap-4">
            {destination.image_url && (
              <img
                src={destination.image_url}
                alt={destination.name}
                className="w-24 h-24 rounded-2xl object-cover flex-shrink-0"
              />
            )}
            <div className="flex-1">
              <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400 mb-1">
                <MapPin size={18} />
                <span className="text-sm font-semibold">Destination</span>
              </div>
              <h3 className="text-xl font-bold dark:text-white">{destination.name}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {destination.country}
                {destination.lat && destination.lon && (
                  <span className="ml-2 text-xs">
                    ({destination.lat.toFixed(4)}, {destination.lon.toFixed(4)})
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Trip Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Trip Name *
            </label>
            <input
              type="text"
              value={tripName}
              onChange={(e) => setTripName(e.target.value)}
              placeholder={`My ${destination.name} Adventure`}
              required
              className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none dark:bg-slate-700 dark:text-white"
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                <Calendar size={16} />
                Start Date *
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none dark:bg-slate-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                <Calendar size={16} />
                End Date *
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
                min={startDate || new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none dark:bg-slate-700 dark:text-white"
              />
            </div>
          </div>

          {/* Number of Travelers */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
              <Users size={16} />
              Number of Travelers *
            </label>
            <input
              type="number"
              value={travelers}
              onChange={(e) => setTravelers(Math.max(1, parseInt(e.target.value) || 1))}
              min="1"
              max="20"
              required
              className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none dark:bg-slate-700 dark:text-white"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 dark:border-slate-600 rounded-xl font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl active:scale-95 transition-all"
            >
              Create Trip
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTripModal;
