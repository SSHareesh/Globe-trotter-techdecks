export const regions = [
  {
    id: 1,
    name: 'Paris, France',
    image: 'https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg?auto=compress&cs=tinysrgb&w=1260',
    description: 'The City of Light awaits'
  },
  {
    id: 2,
    name: 'Tokyo, Japan',
    image: 'https://images.pexels.com/photos/2614818/pexels-photo-2614818.jpeg?auto=compress&cs=tinysrgb&w=1260',
    description: 'Experience ancient meets modern'
  },
  {
    id: 3,
    name: 'Bali, Indonesia',
    image: 'https://images.pexels.com/photos/2166559/pexels-photo-2166559.jpeg?auto=compress&cs=tinysrgb&w=1260',
    description: 'Tropical paradise awaits'
  },
  {
    id: 4,
    name: 'New York, USA',
    image: 'https://images.pexels.com/photos/466685/pexels-photo-466685.jpeg?auto=compress&cs=tinysrgb&w=1260',
    description: 'The city that never sleeps'
  },
  {
    id: 5,
    name: 'Dubai, UAE',
    image: 'https://images.pexels.com/photos/1470502/pexels-photo-1470502.jpeg?auto=compress&cs=tinysrgb&w=1260',
    description: 'Luxury in the desert'
  },
  {
    id: 6,
    name: 'Rome, Italy',
    image: 'https://images.pexels.com/photos/2064827/pexels-photo-2064827.jpeg?auto=compress&cs=tinysrgb&w=1260',
    description: 'Walk through history'
  }
];

export const trips = [
  {
    id: 1,
    title: 'Summer in Santorini',
    destination: 'Santorini, Greece',
    startDate: '2026-06-15',
    endDate: '2026-06-25',
    image: 'https://images.pexels.com/photos/1010657/pexels-photo-1010657.jpeg?auto=compress&cs=tinysrgb&w=1260',
    budget: '$2,500',
    status: 'upcoming' as const
  },
  {
    id: 2,
    title: 'Swiss Alps Adventure',
    destination: 'Interlaken, Switzerland',
    startDate: '2026-01-10',
    endDate: '2026-01-15',
    image: 'https://images.pexels.com/photos/2397414/pexels-photo-2397414.jpeg?auto=compress&cs=tinysrgb&w=1260',
    budget: '$3,200',
    status: 'ongoing' as const
  },
  {
    id: 3,
    title: 'Thai Island Hopping',
    destination: 'Phuket, Thailand',
    startDate: '2025-11-20',
    endDate: '2025-11-30',
    image: 'https://images.pexels.com/photos/1287460/pexels-photo-1287460.jpeg?auto=compress&cs=tinysrgb&w=1260',
    budget: '$1,800',
    status: 'completed' as const
  }
];

export const activities = [
  {
    id: 1,
    title: 'Eiffel Tower Guided Tour',
    destination: 'Paris, France',
    description: 'Skip-the-line access with expert guide',
    duration: '2 hours',
    price: '$45',
    rating: 4.8,
    image: 'https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: 2,
    title: 'Sushi Making Class',
    destination: 'Tokyo, Japan',
    description: 'Learn from master chefs in authentic setting',
    duration: '3 hours',
    price: '$85',
    rating: 4.9,
    image: 'https://images.pexels.com/photos/357756/pexels-photo-357756.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: 3,
    title: 'Sunrise Yoga Retreat',
    destination: 'Bali, Indonesia',
    description: 'Peaceful morning practice overlooking rice terraces',
    duration: '1.5 hours',
    price: '$25',
    rating: 4.7,
    image: 'https://images.pexels.com/photos/1051838/pexels-photo-1051838.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: 4,
    title: 'Broadway Show Experience',
    destination: 'New York, USA',
    description: 'Premium seats to top-rated shows',
    duration: '3 hours',
    price: '$150',
    rating: 4.9,
    image: 'https://images.pexels.com/photos/109669/pexels-photo-109669.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: 5,
    title: 'Desert Safari Adventure',
    destination: 'Dubai, UAE',
    description: 'Thrilling dune bashing and camel riding',
    duration: '6 hours',
    price: '$95',
    rating: 4.6,
    image: 'https://images.pexels.com/photos/2422259/pexels-photo-2422259.jpeg?auto=compress&cs=tinysrgb&w=400'
  }
];

export const itineraryData = {
  tripId: 1,
  tripName: 'Summer in Santorini',
  destination: 'Santorini, Greece',
  days: [
    {
      day: 1,
      date: '2026-06-15',
      activities: [
        { name: 'Arrival and Hotel Check-in', time: '10:00 AM', expense: 150, physicalActivity: 'Low' },
        { name: 'Explore Fira Town', time: '2:00 PM', expense: 30, physicalActivity: 'Medium' },
        { name: 'Sunset at Oia', time: '7:00 PM', expense: 50, physicalActivity: 'Low' },
        { name: 'Dinner at Local Taverna', time: '9:00 PM', expense: 60, physicalActivity: 'Low' }
      ]
    },
    {
      day: 2,
      date: '2026-06-16',
      activities: [
        { name: 'Breakfast at Hotel', time: '8:00 AM', expense: 25, physicalActivity: 'Low' },
        { name: 'Boat Tour to Volcanic Islands', time: '10:00 AM', expense: 120, physicalActivity: 'Medium' },
        { name: 'Swimming at Hot Springs', time: '2:00 PM', expense: 0, physicalActivity: 'High' },
        { name: 'Wine Tasting Tour', time: '6:00 PM', expense: 80, physicalActivity: 'Low' }
      ]
    },
    {
      day: 3,
      date: '2026-06-17',
      activities: [
        { name: 'Beach Day at Perissa', time: '9:00 AM', expense: 40, physicalActivity: 'Medium' },
        { name: 'Water Sports Activities', time: '11:00 AM', expense: 100, physicalActivity: 'High' },
        { name: 'Lunch by the Beach', time: '1:00 PM', expense: 45, physicalActivity: 'Low' },
        { name: 'Shopping in Fira', time: '5:00 PM', expense: 150, physicalActivity: 'Medium' }
      ]
    }
  ]
};

export const communityPosts = [
  {
    id: 1,
    user: {
      name: 'Sarah Johnson',
      avatar: 'https://i.pravatar.cc/150?img=1',
      location: 'New York, USA'
    },
    content: 'Just had the most amazing experience in Santorini! The sunsets are absolutely breathtaking. If you\'re planning a trip, make sure to visit Oia for the best views.',
    image: 'https://images.pexels.com/photos/1010657/pexels-photo-1010657.jpeg?auto=compress&cs=tinysrgb&w=600',
    likes: 124,
    comments: 18,
    timestamp: '2 hours ago',
    destination: 'Santorini, Greece'
  },
  {
    id: 2,
    user: {
      name: 'Michael Chen',
      avatar: 'https://i.pravatar.cc/150?img=2',
      location: 'San Francisco, USA'
    },
    content: 'Tokyo never disappoints! From the bustling streets of Shibuya to the peaceful temples, this city has it all. Already planning my next visit!',
    image: 'https://images.pexels.com/photos/2614818/pexels-photo-2614818.jpeg?auto=compress&cs=tinysrgb&w=600',
    likes: 89,
    comments: 12,
    timestamp: '5 hours ago',
    destination: 'Tokyo, Japan'
  },
  {
    id: 3,
    user: {
      name: 'Emma Rodriguez',
      avatar: 'https://i.pravatar.cc/150?img=3',
      location: 'Barcelona, Spain'
    },
    content: 'Pro tip: Book your desert safari in Dubai during sunset hours. The views are incredible and it\'s less crowded than morning tours!',
    likes: 156,
    comments: 24,
    timestamp: '1 day ago',
    destination: 'Dubai, UAE'
  }
];

export const suggestedPlaces = [
  {
    id: 1,
    name: 'Acropolis Museum',
    location: 'Athens, Greece',
    image: 'https://images.pexels.com/photos/1285625/pexels-photo-1285625.jpeg?auto=compress&cs=tinysrgb&w=400',
    type: 'Museum'
  },
  {
    id: 2,
    name: 'Red Beach',
    location: 'Santorini, Greece',
    image: 'https://images.pexels.com/photos/1878293/pexels-photo-1878293.jpeg?auto=compress&cs=tinysrgb&w=400',
    type: 'Beach'
  },
  {
    id: 3,
    name: 'Ancient Thera',
    location: 'Santorini, Greece',
    image: 'https://images.pexels.com/photos/2422259/pexels-photo-2422259.jpeg?auto=compress&cs=tinysrgb&w=400',
    type: 'Historical Site'
  },
  {
    id: 4,
    name: 'Santo Winery',
    location: 'Santorini, Greece',
    image: 'https://images.pexels.com/photos/1407846/pexels-photo-1407846.jpeg?auto=compress&cs=tinysrgb&w=400',
    type: 'Winery'
  }
];

export const userData = {
  id: 1,
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  phone: '+1 234 567 8900',
  city: 'San Francisco',
  country: 'USA',
  avatar: 'https://i.pravatar.cc/150?img=4',
  bio: 'Travel enthusiast exploring the world one destination at a time.',
  totalTrips: 12,
  countries: 8
};