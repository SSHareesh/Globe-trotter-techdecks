import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/', // Your Django API URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Dummy API calls
export const loginUser = (data) => api.post('token/', data);
export const registerUser = (data) => api.post('register/', data);
export const getTrips = () => api.get('trips/');

export default api;