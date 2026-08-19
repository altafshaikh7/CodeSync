import { createContext, useState, useEffect, useContext, useCallback, useRef } from 'react';
import axios from '../config/axios';
import { UserContext } from './user.context';
import { toast } from 'react-toastify';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const { user } = useContext(UserContext);
    const [pendingInvites, setPendingInvites] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [notificationCount, setNotificationCount] = useState(0);
    const intervalRef = useRef(null);
    const isMounted = useRef(true);

    // Clear pending invites
    const clearPendingInvites = useCallback(() => {
        if (isMounted.current) {
            setPendingInvites([]);
            setNotificationCount(0);
        }
    }, []);

    // Fetch pending invites
    const fetchInvites = useCallback(async () => {
        if (!user) {
            clearPendingInvites();
            return;
        }

        // Check network connectivity
        if (!navigator.onLine) {
            setError('No internet connection');
            return;
        }

        try {
            setLoading(true);
            const res = await axios.get('/projects/invites/pending');
            
            if (isMounted.current) {
                const invites = res.data.invites || [];
                setPendingInvites(invites);
                setNotificationCount(invites.length);
                setError(null);
            }
        } catch (err) {
            console.error('Failed to fetch invites:', err);
            if (isMounted.current) {
                // Don't show toast for 401/403 errors (user might be logged out)
                if (err.response?.status !== 401 && err.response?.status !== 403) {
                    setError('Failed to load notifications');
                }
                // Keep existing invites if fetch fails
            }
        } finally {
            if (isMounted.current) {
                setLoading(false);
            }
        }
    }, [user, clearPendingInvites]);

    // Respond to invite
    const respondInvite = useCallback(async (projectId, action) => {
        if (!projectId || !action) {
            toast.error('Invalid request');
            return;
        }

        try {
            const res = await axios.put('/projects/invites/respond', { projectId, action });
            
            // Remove invite from list
            setPendingInvites(prev => {
                const updated = prev.filter(inv => inv.projectId !== projectId);
                setNotificationCount(updated.length);
                return updated;
            });

            // Show success message
            const message = action === 'accept' 
                ? 'Invite accepted successfully!' 
                : 'Invite declined';
            toast.success(message);

            return res.data;
        } catch (err) {
            console.error('Failed to respond to invite:', err);
            const errorMsg = err.response?.data?.message || 'Failed to respond to invite';
            toast.error(errorMsg);
            throw err;
        }
    }, []);

    // Accept invite
    const acceptInvite = useCallback((projectId) => {
        return respondInvite(projectId, 'accept');
    }, [respondInvite]);

    // Decline invite
    const declineInvite = useCallback((projectId) => {
        return respondInvite(projectId, 'decline');
    }, [respondInvite]);

    // Mark all as read
    const markAllAsRead = useCallback(() => {
        setNotificationCount(0);
        // Optional: API call to mark all as read
        // await axios.put('/projects/invites/mark-read');
    }, []);

    // Get pending invite count
    const getInviteCount = useCallback(() => {
        return pendingInvites.length;
    }, [pendingInvites]);

    // Check if user has pending invites
    const hasPendingInvites = useCallback(() => {
        return pendingInvites.length > 0;
    }, [pendingInvites]);

    // Setup auto-refresh interval
    useEffect(() => {
        if (!user) {
            clearPendingInvites();
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
            return;
        }

        // Initial fetch
        fetchInvites();

        // Set up interval for auto-refresh (every 30 seconds)
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
        intervalRef.current = setInterval(fetchInvites, 30000);

        // Cleanup on unmount or user change
        return () => {
            isMounted.current = false;
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [user, fetchInvites, clearPendingInvites]);

    // Handle network status changes
    useEffect(() => {
        const handleOnline = () => {
            if (user) {
                fetchInvites();
                toast.info('Connected to network. Refreshing notifications...');
            }
        };

        const handleOffline = () => {
            setError('You are offline. Notifications will refresh when you reconnect.');
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, [user, fetchInvites]);

    // Update notification count when pending invites change
    useEffect(() => {
        setNotificationCount(pendingInvites.length);
    }, [pendingInvites]);

    const value = {
        // State
        pendingInvites,
        setPendingInvites,
        loading,
        error,
        notificationCount,
        
        // Actions
        respondInvite,
        acceptInvite,
        declineInvite,
        fetchInvites,
        clearPendingInvites,
        markAllAsRead,
        getInviteCount,
        hasPendingInvites,
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
};

// Custom hook for using notification context
export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
};