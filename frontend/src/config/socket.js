import { io } from 'socket.io-client';

let socketInstance = null;
let isConnecting = false;

export const initializeSocket = (projectId) => {
    // Prevent multiple connection attempts
    if (isConnecting) {
        console.log('Socket connection already in progress');
        return socketInstance;
    }

    // Close existing connection
    if (socketInstance) {
        socketInstance.disconnect();
        socketInstance = null;
    }

    isConnecting = true;

    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const token = localStorage.getItem('token');

    if (!token) {
        console.error('No token found for socket authentication');
        isConnecting = false;
        return null;
    }

    socketInstance = io(apiUrl, {
        auth: {
            token: token
        },
        query: {
            projectId
        },
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        timeout: 10000
    });

    // Connection event handlers
    socketInstance.on('connect', () => {
        console.log('✅ Socket connected successfully');
        isConnecting = false;
    });

    socketInstance.on('connect_error', (error) => {
        console.error('❌ Socket connection error:', error.message);
        isConnecting = false;
    });

    socketInstance.on('disconnect', (reason) => {
        console.log('🔌 Socket disconnected:', reason);
        if (reason === 'io server disconnect') {
            // The server forced the disconnect, reconnect manually
            socketInstance.connect();
        }
    });

    return socketInstance;
};

export const receiveMessage = (eventName, cb) => {
    if (!socketInstance) {
        console.error('Socket not initialized. Call initializeSocket first.');
        return;
    }
    socketInstance.off(eventName); // Remove old listeners
    socketInstance.on(eventName, cb);
};

export const sendMessage = (eventName, data) => {
    if (!socketInstance) {
        console.error('Socket not initialized. Call initializeSocket first.');
        return;
    }
    socketInstance.emit(eventName, data);
};

export const getSocket = () => {
    if (!socketInstance) {
        console.warn('Socket not initialized. Call initializeSocket first.');
        return null;
    }
    return socketInstance;
};

export const disconnectSocket = () => {
    if (socketInstance) {
        socketInstance.disconnect();
        socketInstance = null;
        isConnecting = false;
        console.log('Socket disconnected manually');
    }
};

export const isSocketConnected = () => {
    return socketInstance && socketInstance.connected;
};

// Default export
export default {
    initializeSocket,
    receiveMessage,
    sendMessage,
    getSocket,
    disconnectSocket,
    isSocketConnected
};