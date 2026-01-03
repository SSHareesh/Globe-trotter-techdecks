# GlobalTrotter - Travel Planner App

A modern, feature-rich travel planning application built with React, TypeScript, and Tailwind CSS.

## Features

### 12 Complete Screens

1. **Login** - Clean authentication interface with profile placeholder
2. **Registration** - Comprehensive user registration with profile image upload
3. **Dashboard** - Main landing page with hero banner, regional selections, and trip overview
4. **Create Trip** - Trip planning interface with suggested places and activities
5. **Build Itinerary** - Multi-section itinerary builder with budget tracking
6. **Trip Listing** - Tabbed view of ongoing, upcoming, and completed trips
7. **User Profile** - Personal profile with travel statistics and trip history
8. **Activity Search** - Browse and filter activities with detailed information
9. **Itinerary View** - Detailed day-by-day itinerary with budget breakdown
10. **Community** - Social feed for sharing travel experiences
11. **Calendar** - Monthly calendar view with trip date highlights
12. **Admin Panel** - Dashboard with analytics, charts, and user activity

## Design Theme

- **Primary Colors**: White background with soft green gradients
- **Accent**: Green (#16a34a to #22c55e gradient)
- **Typography**: Clean, modern fonts with proper hierarchy
- **Components**: Rounded cards, smooth transitions, and hover effects
- **Inspiration**: Based on tamilnadu.tech color palette

## Tech Stack

- **React 18** - Modern functional components with hooks
- **TypeScript** - Type-safe development
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Beautiful icon library
- **Vite** - Fast build tool and dev server

## Project Structure

```
src/
├── components/         # Reusable UI components
│   ├── Navbar.tsx     # Global navigation bar
│   ├── Button.tsx     # Styled button component
│   ├── Card.tsx       # Card container component
│   ├── Input.tsx      # Form input component
│   └── TripCard.tsx   # Trip display card
├── pages/             # Screen components
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── Dashboard.tsx
│   ├── CreateTrip.tsx
│   ├── BuildItinerary.tsx
│   ├── Trips.tsx
│   ├── Profile.tsx
│   ├── Search.tsx
│   ├── ItineraryView.tsx
│   ├── Community.tsx
│   ├── Calendar.tsx
│   └── Admin.tsx
├── data/              # Dummy data
│   └── dummyData.ts
├── App.tsx            # Root component with routing
└── main.tsx           # Application entry point
```

## Navigation

### Main Routes

- `/` - Login page
- `/register` - Registration page
- `/dashboard` - Main dashboard (after login)
- `/create-trip` - Create new trip
- `/build-itinerary` - Build trip itinerary
- `/trips` - View all trips
- `/profile` - User profile
- `/search` - Search activities and destinations
- `/itinerary/:id` - View specific itinerary
- `/community` - Community feed
- `/calendar` - Calendar view
- `/admin` - Admin dashboard

### Quick Access via Navbar

The top navigation bar provides quick access to:
- My Trips
- Community
- Calendar
- Search (via search bar)
- Profile (via user icon)
- Notifications (via bell icon)

## Key Features

### Responsive Design
- Desktop-first approach
- Mobile-friendly layouts
- Responsive grid systems
- Adaptive navigation

### Reusable Components
- Consistent button styles with variants (primary, secondary, outline, ghost)
- Flexible card components with hover effects
- Form inputs with validation states
- Trip cards with status indicators

### Interactive Elements
- Smooth hover transitions
- Active state indicators
- Loading states ready
- Form validation ready

### Dummy Data
All screens use realistic dummy data including:
- User profiles
- Trip information
- Activities and destinations
- Community posts
- Calendar events

## Future Enhancements

The app is ready for:
- Backend integration
- Authentication system
- Database connection
- Real-time updates
- Payment processing
- Social features
- Map integration
- Image uploads

## Design Principles

1. **Clean & Modern** - Minimalist design with focus on content
2. **User-Friendly** - Intuitive navigation and clear CTAs
3. **Consistent** - Unified color scheme and component styling
4. **Professional** - Production-ready UI polish
5. **Accessible** - Proper contrast ratios and semantic HTML

## Component Guidelines

### Colors
- Primary Green: `from-green-600 to-green-500`
- Hover States: `hover:from-green-700 hover:to-green-600`
- Light Backgrounds: `bg-green-50`, `bg-green-100`
- Text: `text-green-600`, `text-green-700`

### Spacing
- Card Padding: `p-4`, `p-6`, `p-8`
- Section Margins: `mb-6`, `mb-8`, `mb-12`
- Gap Between Elements: `gap-4`, `gap-6`

### Typography
- Headings: `text-3xl`, `text-4xl` with `font-bold`
- Body: `text-base`, `text-lg`
- Small Text: `text-sm`, `text-xs`
