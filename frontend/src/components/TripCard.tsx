import { Calendar, MapPin, DollarSign } from 'lucide-react';
import Card from './Card';
import Button from './Button';

interface TripCardProps {
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  image: string;
  budget?: string;
  status?: 'ongoing' | 'upcoming' | 'completed';
  onClick?: () => void;
}

export default function TripCard({
  title,
  destination,
  startDate,
  endDate,
  image,
  budget,
  status,
  onClick
}: TripCardProps) {
  const statusColors = {
    ongoing: 'bg-blue-100 text-blue-700',
    upcoming: 'bg-green-100 text-green-700',
    completed: 'bg-gray-100 text-gray-700'
  };

  return (
    <Card hover onClick={onClick}>
      <div className="relative h-48 overflow-hidden rounded-t-xl">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
        />
        {status && (
          <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold ${statusColors[status]}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-2 text-green-600" />
            <span>{destination}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-green-600" />
            <span>{startDate} - {endDate}</span>
          </div>
          {budget && (
            <div className="flex items-center">
              <DollarSign className="h-4 w-4 mr-2 text-green-600" />
              <span>{budget}</span>
            </div>
          )}
        </div>
        <Button variant="outline" size="sm" className="w-full mt-4">
          View Details
        </Button>
      </div>
    </Card>
  );
}
