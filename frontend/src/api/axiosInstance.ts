import axios from 'axios';

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/',
});

// Request interceptor to add JWT token
api.interceptors.request.use(
    (config) => {
        // Allow both JSON requests and multipart FormData (e.g. registration with profile_image).
        const isFormData = typeof FormData !== 'undefined' && config.data instanceof FormData;
        if (!isFormData) {
            config.headers = config.headers ?? {};
            // Only set JSON content-type when we are actually sending JSON.
            if (!('Content-Type' in config.headers) && !('content-type' in config.headers)) {
                (config.headers as any)['Content-Type'] = 'application/json';
            }
        } else if (config.headers) {
            // Let the browser set the multipart boundary.
            delete (config.headers as any)['Content-Type'];
            delete (config.headers as any)['content-type'];
        }

        const tokensStr = localStorage.getItem('tokens');
        if (tokensStr) {
            const tokens = JSON.parse(tokensStr);
            if (tokens && tokens.access) {
                config.headers.Authorization = `Bearer ${tokens.access}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
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

export default api;
