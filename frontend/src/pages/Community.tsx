import { useState } from 'react';
import { Heart, MessageCircle, Share2, MapPin, Filter } from 'lucide-react';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import Card from '../components/Card';

export default function Community() {
  const [filter, setFilter] = useState('all');
  const communityPosts: any[] = [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Community Feed</h1>
          <p className="text-gray-600">Share and discover travel experiences</p>
        </div>

        <div className="flex gap-4 mb-8">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="all">All Posts</option>
            <option value="popular">Most Popular</option>
            <option value="recent">Most Recent</option>
            <option value="following">Following</option>
          </select>

          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>

          <Button className="ml-auto">
            Create Post
          </Button>
        </div>

        <div className="space-y-6">
          {communityPosts.map((post) => (
            <Card key={post.id} className="overflow-hidden">
              <div className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <img
                    src={post.user.avatar}
                    alt={post.user.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{post.user.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>{post.user.location}</span>
                      <span>•</span>
                      <span>{post.timestamp}</span>
                    </div>
                  </div>
                </div>

                <p className="text-gray-700 mb-4">{post.content}</p>

                {post.image && (
                  <img
                    src={post.image}
                    alt="Post"
                    className="w-full h-64 object-cover rounded-lg mb-4"
                  />
                )}

                <div className="flex items-center gap-2 mb-4">
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                    {post.destination}
                  </span>
                </div>

                <div className="flex items-center gap-6 pt-4 border-t border-gray-100">
                  <button className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors">
                    <Heart className="h-5 w-5" />
                    <span className="font-medium">{post.likes}</span>
                  </button>
                  <button className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors">
                    <MessageCircle className="h-5 w-5" />
                    <span className="font-medium">{post.comments}</span>
                  </button>
                  <button className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors ml-auto">
                    <Share2 className="h-5 w-5" />
                    <span className="font-medium">Share</span>
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
