import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateTrip from './pages/CreateTrip';
import BuildItinerary from './pages/BuildItinerary';
import Trips from './pages/Trips';
import Profile from './pages/Profile';
import Search from './pages/Search';
import ItineraryView from './pages/ItineraryView';
import Community from './pages/Community';
import Calendar from './pages/Calendar';
import Admin from './pages/Admin';
import { AuthProvider } from './context/AuthContext';
import Chatbot from './components/Chatbot';

function App() {
  // Layout to show Chatbot on all authenticated pages
  function WithChatbot({ children }: { children: React.ReactNode }) {
    return (
      <>
        {children}
        <Chatbot />
      </>
    );
  }

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <WithChatbot>
                <Dashboard />
              </WithChatbot>
            }
          />
          <Route
            path="/create-trip"
            element={
              <WithChatbot>
                <CreateTrip />
              </WithChatbot>
            }
          />
          <Route
            path="/build-itinerary"
            element={
              <WithChatbot>
                <BuildItinerary />
              </WithChatbot>
            }
          />
          <Route
            path="/trips"
            element={
              <WithChatbot>
                <Trips />
              </WithChatbot>
            }
          />
          <Route
            path="/profile"
            element={
              <WithChatbot>
                <Profile />
              </WithChatbot>
            }
          />
          <Route
            path="/search"
            element={
              <WithChatbot>
                <Search />
              </WithChatbot>
            }
          />
          <Route
            path="/itinerary/:id"
            element={
              <WithChatbot>
                <ItineraryView />
              </WithChatbot>
            }
          />
          <Route
            path="/community"
            element={
              <WithChatbot>
                <Community />
              </WithChatbot>
            }
          />
          <Route
            path="/calendar"
            element={
              <WithChatbot>
                <Calendar />
              </WithChatbot>
            }
          />
          <Route
            path="/admin"
            element={
              <WithChatbot>
                <Admin />
              </WithChatbot>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
