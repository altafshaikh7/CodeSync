import { WebContainer } from '@webcontainer/api';

let webContainerInstance = null;
let isBooting = false;
let bootPromise = null;

export const getWebContainer = async () => {
    // If already booted, return existing instance
    if (webContainerInstance) {
        return webContainerInstance;
    }

    // If currently booting, wait for it
    if (isBooting && bootPromise) {
        return bootPromise;
    }

    isBooting = true;

    bootPromise = (async () => {
        try {
            console.log('🔄 Booting WebContainer...');
            webContainerInstance = await WebContainer.boot();
            console.log('✅ WebContainer booted successfully');
            
            // Only add valid event listeners
            // Note: 'error' is valid, 'exit' is NOT valid for WebContainer
            webContainerInstance.on('error', (error) => {
                console.error('WebContainer runtime error:', error);
            });

            return webContainerInstance;
        } catch (error) {
            console.error('❌ Failed to boot WebContainer:', error);
            webContainerInstance = null;
            throw error;
        } finally {
            isBooting = false;
            bootPromise = null;
        }
    })();

    return bootPromise;
};

export const resetWebContainer = async () => {
    if (webContainerInstance) {
        try {
            await webContainerInstance.teardown();
            webContainerInstance = null;
            console.log('🔄 WebContainer reset successfully');
        } catch (error) {
            console.error('Error resetting WebContainer:', error);
            webContainerInstance = null;
        }
    }
    isBooting = false;
    bootPromise = null;
};

export const getWebContainerInstance = () => webContainerInstance;

export const isWebContainerReady = () => !!webContainerInstance;

export default {
    getWebContainer,
    resetWebContainer,
    getWebContainerInstance,
    isWebContainerReady
};