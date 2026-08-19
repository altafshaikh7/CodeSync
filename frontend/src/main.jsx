import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import './index.css';
import App from './App.jsx';
import { UserProvider } from './context/user.context.jsx';
import { NotificationProvider } from './context/notification.context.jsx';
import { BrowserRouter } from 'react-router-dom';
import 'remixicon/fonts/remixicon.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
    console.error('Root element not found');
    document.body.innerHTML = `
        <div style="display:flex;align-items:center;justify-content:center;height:100vh;background:#0f172a;color:#f1f5f9;font-family:system-ui;text-align:center;padding:20px;">
            <div>
                <h1 style="font-size:24px;margin-bottom:8px;">⚠️ Application Error</h1>
                <p style="color:#94a3b8;font-size:14px;">Failed to load application. Please refresh the page.</p>
            </div>
        </div>
    `;
    throw new Error('Root element not found');
}

const root = createRoot(rootElement);

root.render(
    <StrictMode>
        {/* Remove BrowserRouter from here if it's already in AppRoutes */}
        <UserProvider>
            <NotificationProvider>
                <App />
            </NotificationProvider>
        </UserProvider>
    </StrictMode>
);

console.log('✅ CodeSync application mounted successfully');