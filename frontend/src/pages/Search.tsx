import { useState } from 'react';
import { Search as SearchIcon, Filter, ArrowUpDown, Star, Clock, DollarSign } from 'lucide-react';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import Card from '../components/Card';
import { activities } from '../data/dummyData';

export default function Search() {
  const [searchQuery, setSearchQuery] = useState('');
  const [groupBy, setGroupBy] = useState('all');

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar showSearch={false} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Discover Activities</h1>

          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search activities, cities, experiences..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <SearchIcon className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div className="flex gap-4 flex-wrap">
            <select
              value={groupBy}
              onChange={(e) => setGroupBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="all">All Categories</option>
              <option value="adventure">Adventure</option>
              <option value="culture">Culture</option>
              <option value="food">Food & Dining</option>
              <option value="relaxation">Relaxation</option>
            </select>

            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>

            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <ArrowUpDown className="h-4 w-4" />
              Sort by Price
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {activities.map((activity) => (
            <Card key={activity.id} hover>
              <div className="flex gap-6 p-6">
                <img
                  src={activity.image}
                  alt={activity.title}
                  className="w-48 h-32 object-cover rounded-lg flex-shrink-0"
                />

                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-1">
                        {activity.title}
                      </h3>
                      <p className="text-sm text-gray-600">{activity.destination}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-5 w-5 text-yellow-500 fill-current" />
                      <span className="font-semibold text-gray-900">{activity.rating}</span>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-4">{activity.description}</p>

                  <div className="flex items-center gap-6 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-green-600" />
                      <span>{activity.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      <span className="font-semibold text-gray-900">{activity.price}</span>
                    </div>
                  </div>

                  <Button size="sm">View Details</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
