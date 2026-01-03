import { Users, MapPin, TrendingUp, DollarSign } from 'lucide-react';
import Navbar from '../components/Navbar';
import Card from '../components/Card';

export default function Admin() {
  const stats = [
    { label: 'Total Users', value: '2,543', change: '+12%', icon: Users, color: 'text-blue-600' },
    { label: 'Active Trips', value: '1,234', change: '+8%', icon: MapPin, color: 'text-green-600' },
    { label: 'Destinations', value: '156', change: '+5%', icon: TrendingUp, color: 'text-purple-600' },
    { label: 'Revenue', value: '$48.5K', change: '+23%', icon: DollarSign, color: 'text-yellow-600' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar showSearch={false} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Monitor platform performance and user activity</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <Card key={stat.label} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 bg-gray-50 rounded-lg ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <span className="text-green-600 text-sm font-semibold">{stat.change}</span>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</h3>
              <p className="text-gray-600 text-sm">{stat.label}</p>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">User Growth</h2>
            <div className="h-64 flex items-end justify-between gap-2">
              {[45, 52, 48, 65, 72, 68, 85, 92, 88, 95, 100, 96].map((height, index) => (
                <div
                  key={index}
                  className="flex-1 bg-gradient-to-t from-green-600 to-green-400 rounded-t-lg transition-all hover:opacity-80"
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>
            <div className="flex justify-between mt-4 text-sm text-gray-600">
              <span>Jan</span>
              <span>Dec</span>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Popular Destinations</h2>
            <div className="space-y-4">
              {[
                { name: 'Paris, France', count: 456, percentage: 92 },
                { name: 'Tokyo, Japan', count: 389, percentage: 78 },
                { name: 'Bali, Indonesia', count: 312, percentage: 63 },
                { name: 'New York, USA', count: 287, percentage: 58 },
                { name: 'Dubai, UAE', count: 245, percentage: 49 }
              ].map((destination) => (
                <div key={destination.name}>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">{destination.name}</span>
                    <span className="text-sm text-gray-600">{destination.count} trips</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-green-600 to-green-400 h-2 rounded-full"
                      style={{ width: `${destination.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <Card className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">User</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Action</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Destination</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Time</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { user: 'John Doe', action: 'Created trip', destination: 'Paris', time: '2 min ago', status: 'Active' },
                  { user: 'Sarah Smith', action: 'Completed booking', destination: 'Tokyo', time: '15 min ago', status: 'Completed' },
                  { user: 'Mike Johnson', action: 'Updated itinerary', destination: 'Bali', time: '1 hour ago', status: 'Active' },
                  { user: 'Emma Wilson', action: 'Created trip', destination: 'Rome', time: '2 hours ago', status: 'Active' },
                  { user: 'Chris Brown', action: 'Canceled trip', destination: 'Dubai', time: '3 hours ago', status: 'Canceled' }
                ].map((activity, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-900">{activity.user}</td>
                    <td className="py-3 px-4 text-gray-600">{activity.action}</td>
                    <td className="py-3 px-4 text-gray-900">{activity.destination}</td>
                    <td className="py-3 px-4 text-gray-600">{activity.time}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          activity.status === 'Active'
                            ? 'bg-green-100 text-green-700'
                            : activity.status === 'Completed'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {activity.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
