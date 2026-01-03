import React, { createContext, useState, useContext, useEffect } from 'react';
import { loginUser, registerUser, getProfile } from '../api/axiosInstance';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
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

    const login = async (email, password) => {
        const res = await loginUser({ email, password });
        const { user, tokens } = res.data;
        localStorage.setItem('tokens', JSON.stringify(tokens));
        setUser(user);
        return user;
    };

    const register = async (userData) => {
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

export const useAuth = () => useContext(AuthContext);
