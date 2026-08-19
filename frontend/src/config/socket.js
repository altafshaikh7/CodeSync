import { io } from 'socket.io-client';

let socketInstance = null;
let isConnecting = false;

export const initializeSocket = (projectId) => {
    if (socketInstance && socketInstance.connected) return socketInstance;
    if (isConnecting) return socketInstance;
    if (socketInstance) {
        socketInstance.disconnect();
        socketInstance = null;
    }

    isConnecting = true;
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const token = localStorage.getItem('token');
    if (!token) {
        isConnecting = false;
        return null;
    }

    try {
        socketInstance = io(apiUrl, {
            auth: { token },
            query: { projectId },
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
            timeout: 10000
        });

        socketInstance.on('connect', () => {
            console.log('✅ Socket connected');
            isConnecting = false;
        });
        socketInstance.on('connect_error', (error) => {
            console.error('❌ Socket error:', error.message);
            isConnecting = false;
        });
        socketInstance.on('disconnect', () => {
            console.log('🔌 Socket disconnected');
        });

        return socketInstance;
    } catch (error) {
        console.error('Socket init error:', error);
        isConnecting = false;
        return null;
    }
};

// Safe listener registration – does NOT remove existing listeners
export const receiveMessage = (eventName, cb) => {
    if (!socketInstance) {
        console.warn('Socket not initialized.');
        return;
    }
    socketInstance.on(eventName, cb);
};

export const sendMessage = (eventName, data) => {
    if (!socketInstance) {
        console.warn('Socket not initialized.');
        return;
    }
    socketInstance.emit(eventName, data);
};

export const getSocket = () => socketInstance;

export const disconnectSocket = () => {
    if (socketInstance) {
        socketInstance.disconnect();
        socketInstance = null;
        isConnecting = false;
    }
};

export default {
    initializeSocket,
    receiveMessage,
    sendMessage,
    getSocket,
    disconnectSocket
};