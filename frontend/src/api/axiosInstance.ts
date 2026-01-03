import axios from 'axios';

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/',
});

api.interceptors.request.use(
    (config) => {
        const url = (config.url ?? '').toString();
        const isAuthEndpoint =
            url.includes('auth/login/') ||
            url.includes('auth/register/') ||
            url.includes('auth/token/refresh/') ||
            url.includes('auth/password-reset/');

        // Ensure headers object exists
        // Axios may provide AxiosHeaders; fall back to plain object.
        config.headers = config.headers || {};

        // Allow both JSON requests and multipart FormData (e.g. registration with profile_image).
        const isFormData = typeof FormData !== 'undefined' && config.data instanceof FormData;
        if (!isFormData) {
            if (!config.headers['Content-Type'] && !config.headers['content-type']) {
                config.headers['Content-Type'] = 'application/json';
            }
        }

        if (!isAuthEndpoint) {
            const tokensStr = localStorage.getItem('tokens');
            if (tokensStr) {
                try {
                    const tokens = JSON.parse(tokensStr);
                    if (tokens && tokens.access) {
                        const headersAny: any = config.headers;
                        if (typeof headersAny.set === 'function') {
                            headersAny.set('Authorization', `Bearer ${tokens.access}`);
                        } else {
                            headersAny['Authorization'] = `Bearer ${tokens.access}`;
                        }
                    }
                } catch (e) {
                    console.error('Error parsing tokens from localStorage', e);
                }
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const url = (originalRequest?.url ?? '').toString();
        const isAuthEndpoint =
            url.includes('auth/login/') ||
            url.includes('auth/register/') ||
            url.includes('auth/token/refresh/') ||
            url.includes('auth/password-reset/');

        if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
            originalRequest._retry = true;
            try {
                const tokensStr = localStorage.getItem('tokens');
                if (tokensStr) {
                    const tokens = JSON.parse(tokensStr);
                    const response = await axios.post('http://127.0.0.1:8000/api/auth/token/refresh/', {
                        refresh: tokens.refresh,
                    });
                    const newTokens = { ...tokens, access: response.data.access };
                    localStorage.setItem('tokens', JSON.stringify(newTokens));
                    api.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
                    return api(originalRequest);
                }
            } catch (refreshError) {
                localStorage.removeItem('tokens');
                window.location.href = '/';
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export const loginUser = (data: any) => api.post('auth/login/', data);
export const registerUser = (data: any) => api.post('auth/register/', data);
export const getProfile = () => api.get('auth/profile/');
export const updateProfile = (data: FormData) => api.put('auth/profile/', data);

export const getCommunityPosts = (filter?: string) => {
    const params = filter ? { filter } : {};
    return api.get('community/posts/', { params });
};

export const createCommunityPost = (data: FormData) => {
    return api.post('community/posts/', data);
};

export const likePost = (postId: number) => {
    return api.post(`community/posts/${postId}/like/`);
};

export const commentOnPost = (postId: number, content: string) => {
    return api.post(`community/posts/${postId}/comments/`, { content });
};

export const getPostComments = (postId: number) => {
    return api.get(`community/posts/${postId}/comments/`);
};

// Trips API
export const getTrips = () => api.get('trips/');
export const getTrip = (tripId: number) => api.get(`trips/${tripId}/`);
export const createTrip = (data: any) => api.post('trips/', data);
export const updateTrip = (tripId: number, data: any) => api.put(`trips/${tripId}/`, data);
export const deleteTrip = (tripId: number) => api.delete(`trips/${tripId}/`);
export const getUpcomingTrips = () => api.get('trips/upcoming/');
export const getOngoingTrips = () => api.get('trips/ongoing/');
export const getCompletedTrips = () => api.get('trips/completed/');

// Activities (Screen 8)
export type ActivitySort = 'rating' | 'price-low' | 'price-high' | 'duration';

export const getActivities = (params?: {
    q?: string;
    city_id?: number;
    category?: string;
    min_cost?: number;
    max_cost?: number;
    min_rating?: number;
    sort?: ActivitySort;
}) => api.get('activities/', { params });

export const getCities = (params?: { q?: string }) => api.get('cities/', { params });

export default api;
