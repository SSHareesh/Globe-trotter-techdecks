# 🌍 GlobeTrotter Frontend

React + TypeScript frontend for the GlobeTrotter travel planning platform.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Pages & Components](#pages--components)
- [API Integration](#api-integration)
- [Styling Guide](#styling-guide)
- [Building for Production](#building-for-production)

---

## 🎯 Overview

The frontend provides a modern, responsive UI for:
- User authentication and profile management
- Destination discovery with real-time search
- Multi-step trip creation wizard
- AI-enhanced itinerary viewing
- Community social features
- AI chatbot assistant

---

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.x | UI Framework |
| TypeScript | 5.x | Type Safety |
| Vite | 5.x | Build Tool & Dev Server |
| TailwindCSS | 3.x | Utility-First Styling |
| React Router | 6.x | Client-Side Routing |
| Axios | 1.x | HTTP Client |
| Lucide React | Latest | Icon Library |

---

## 📁 Project Structure

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

---

## 🚀 Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/yourusername/globetrotter-frontend.git
   cd globetrotter-frontend
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

---

## ▶️ Running the Application

- **Development Mode**
  ```bash
  npm run dev
  ```
  Access the app at `http://localhost:5173`

- **Production Build**
  ```bash
  npm run build
  ```
  The production-ready files will be in the `dist` folder.

---

## 📄 Pages & Components

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

### Component Guidelines

#### Colors
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
