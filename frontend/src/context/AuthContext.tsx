import React, { createContext, useState, useContext, useEffect } from 'react';
import { loginUser, registerUser, getProfile } from '../api/axiosInstance';

interface User {
    id: number;
    email: string;
    name: string;
    profile_image: string | null;
    bio: string;
    city: string | null;
    country: string | null;
    phone: string | null;
    language_preference: string;
    created_at: string;
}

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<User>;
    register: (userData: any) => Promise<User>;
    logout: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUser = async () => {
            const tokens = localStorage.getItem('tokens');
            if (tokens) {
                try {
                    const res = await getProfile();
                    setUser(res.data);
                } catch (error) {
                    console.error("Failed to fetch profile", error);
                    localStorage.removeItem('tokens');
                }
            }
            setLoading(false);
        };
        checkUser();
    }, []);

    const login = async (email: string, password: string) => {
        const res = await loginUser({ email, password });
        const { user, tokens } = res.data;
        localStorage.setItem('tokens', JSON.stringify(tokens));
        setUser(user);
        return user;
    };

    const register = async (userData: any) => {
        const res = await registerUser(userData);
        const { user, tokens } = res.data;
        localStorage.setItem('tokens', JSON.stringify(tokens));
        setUser(user);
        return user;
    };

    const logout = () => {
        localStorage.removeItem('tokens');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
