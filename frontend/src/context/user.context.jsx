import { createContext, useState, useEffect, useCallback } from 'react';
import axios from '../config/axios';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Load user from token
    const loadUser = useCallback(async () => {
        const token = localStorage.getItem('token');

        if (!token) {
            setLoading(false);
            setUser(null);
            return;
        }

        try {
            // Set token in axios headers
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            
            const res = await axios.get('/users/profile');
            
            if (res.data?.user) {
                setUser(res.data.user);
                setError(null);
            } else {
                throw new Error('No user data received');
            }
        } catch (error) {
            console.error('Failed to load user:', error);
            
            // Clear invalid token
            localStorage.removeItem('token');
            delete axios.defaults.headers.common['Authorization'];
            
            setUser(null);
            setError(error.response?.data?.message || error.message || 'Failed to load user');
        } finally {
            setLoading(false);
        }
    }, []);

    // Logout user
    const logout = useCallback(async () => {
        try {
            // Optional: Call logout API
            await axios.post('/users/logout');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            // Clear local storage and state
            localStorage.removeItem('token');
            delete axios.defaults.headers.common['Authorization'];
            setUser(null);
            setError(null);
        }
    }, []);

    // Update user
    const updateUser = useCallback((updatedUser) => {
        setUser(prev => ({
            ...prev,
            ...updatedUser
        }));
    }, []);

    // Check if user is authenticated
    const isAuthenticated = useCallback(() => {
        return !!user && !!localStorage.getItem('token');
    }, [user]);

    // Load user on mount
    useEffect(() => {
        loadUser();
    }, [loadUser]);

    // Refresh user data
    const refreshUser = useCallback(async () => {
        setLoading(true);
        await loadUser();
    }, [loadUser]);

    const value = {
        user,
        setUser,
        loading,
        setLoading,
        error,
        setError,
        logout,
        updateUser,
        isAuthenticated,
        refreshUser,
        loadUser
    };

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
};

// Custom hook for using user context
export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};