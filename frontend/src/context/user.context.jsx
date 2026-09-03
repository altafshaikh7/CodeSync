import { createContext, useState, useEffect, useCallback } from 'react';
import axios from '../config/axios';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Load user profile via cookie-based session
    const loadUser = useCallback(async () => {
        try {
            const res = await axios.get('/users/profile');
            
            if (res.data?.user) {
                setUser(res.data.user);
                setError(null);
            } else {
                throw new Error('No user data received');
            }
        } catch (error) {
            console.error('Failed to load user session:', error);
            setUser(null);
            setError(error.response?.data?.message || error.message || 'Failed to load user');
        } finally {
            setLoading(false);
        }
    }, []);

    // Logout user
    const logout = useCallback(async () => {
        try {
            await axios.post('/users/logout');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setUser(null);
            setError(null);
            window.location.href = '/login';
        }
    }, []);

    // Update user state locally
    const updateUser = useCallback((updatedUser) => {
        setUser(prev => ({
            ...prev,
            ...updatedUser
        }));
    }, []);

    // Check if user is authenticated
    const isAuthenticated = useCallback(() => {
        return !!user;
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