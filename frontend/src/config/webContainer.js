import { WebContainer } from '@webcontainer/api';

let webContainerInstance = null;

export const getWebContainer = async () => {
    if (webContainerInstance === null) {
        try {
            webContainerInstance = await WebContainer.boot();
            console.log('✅ WebContainer booted successfully');
        } catch (error) {
            console.error('❌ Failed to boot WebContainer:', error);
            throw error;
        }
    }
    return webContainerInstance;
};

// Optional: Add a reset function
export const resetWebContainer = async () => {
    if (webContainerInstance) {
        await webContainerInstance.teardown();
        webContainerInstance = null;
    }
};

// Default export for convenience
export default {
    getWebContainer,
    resetWebContainer
};