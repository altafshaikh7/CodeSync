import { io } from 'socket.io-client';

let socketInstance = null;
let isConnecting = false;

export const initializeSocket = (projectId) => {
    if (socketInstance && socketInstance.connected) {
        console.log('✅ Using existing socket connection');
        return socketInstance;
    }
    
    if (isConnecting) {
        console.log('⏳ Socket already connecting...');
        return socketInstance;
    }
    
    if (socketInstance) {
        socketInstance.disconnect();
        socketInstance = null;
    }

    isConnecting = true;
    const apiUrl = import.meta.env.VITE_API_URL || 'https://codesync-ne50.onrender.com';

    if (!projectId) {
        console.error('❌ No projectId found for socket connection');
        isConnecting = false;
        return null;
    }

    try {
        console.log('🔌 Initializing socket with projectId:', projectId);
        
        socketInstance = io(apiUrl, {
            withCredentials: true,
            query: { projectId },
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
            timeout: 10000,
            forceNew: true
        });

        socketInstance.on('connect', () => {
            console.log('✅ Socket connected successfully');
            isConnecting = false;
        });
        
        socketInstance.on('connect_error', (error) => {
            console.error('❌ Socket connection error:', error.message);
            isConnecting = false;
            
            if (error.message === 'Authentication Error' || 
                error.message === 'Project not found' ||
                error.message === 'User not authorized for this project') {
                console.log('🔄 Authentication failed, will retry...');
                setTimeout(() => {
                    if (socketInstance) socketInstance.connect();
                }, 3000);
            }
        });
        
        socketInstance.on('disconnect', (reason) => {
            console.log('🔌 Socket disconnected:', reason);
            if (reason === 'io server disconnect') {
                console.log('🔄 Server disconnected, reconnecting...');
                socketInstance.connect();
            }
        });

        socketInstance.on('reconnect', (attemptNumber) => {
            console.log(`🔄 Socket reconnected after ${attemptNumber} attempts`);
        });

        socketInstance.on('reconnect_failed', () => {
            console.error('❌ Socket reconnection failed');
        });

        socketInstance.on('connection-established', (data) => {
            console.log('✅ Socket connection confirmed:', data);
        });

        socketInstance.on('error', (error) => {
            console.error('❌ Socket error event:', error);
        });

        return socketInstance;
    } catch (error) {
        console.error('❌ Socket init error:', error);
        isConnecting = false;
        return null;
    }
};

export const receiveMessage = (eventName, cb) => {
    if (!socketInstance) {
        console.warn('⚠️ Socket not initialized.');
        return;
    }
    socketInstance.on(eventName, cb);
};

export const sendMessage = (eventName, data) => {
    if (!socketInstance) {
        console.warn('⚠️ Socket not initialized.');
        return;
    }
    if (!socketInstance.connected) {
        console.warn('⚠️ Socket not connected, trying to reconnect...');
        socketInstance.connect();
        setTimeout(() => {
            if (socketInstance.connected) {
                console.log('📤 Sending message after reconnection:', eventName, data);
                socketInstance.emit(eventName, data);
            } else {
                console.error('❌ Failed to send message: socket still disconnected');
            }
        }, 1000);
        return;
    }
    console.log('📤 Sending message:', eventName, data);
    socketInstance.emit(eventName, data);
};

export const getSocket = () => socketInstance;

export const disconnectSocket = () => {
    if (socketInstance) {
        console.log('🔌 Disconnecting socket...');
        socketInstance.disconnect();
        socketInstance = null;
        isConnecting = false;
    }
};

export const isSocketConnected = () => {
    return socketInstance && socketInstance.connected;
};

export const getSocketStatus = () => {
    if (!socketInstance) return 'Not initialized';
    if (socketInstance.connected) return 'Connected';
    if (socketInstance.disconnected) return 'Disconnected';
    return 'Connecting...';
};

export default {
    initializeSocket,
    receiveMessage,
    sendMessage,
    getSocket,
    disconnectSocket,
    isSocketConnected,
    getSocketStatus
};