import AppRoutes from "./routes/AppRoutes";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useState } from 'react';

// Toast configuration
const toastConfig = {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    newestOnTop: true,
    closeOnClick: true,
    pauseOnHover: true,
    pauseOnFocusLoss: true,
    draggable: true,
    draggablePercent: 60,
    theme: "dark",
    limit: 5,
    style: {
        marginTop: '70px',
    },
    toastStyle: {
        borderRadius: '12px',
        background: '#1e293b',
        color: '#f1f5f9',
        border: '1px solid #334155',
        boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
    },
};

// Simple Error Boundary
const ErrorBoundary = ({ children }) => {
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        const handleError = (error) => {
            console.error('App Error:', error);
            setHasError(true);
        };

        window.addEventListener('error', handleError);
        return () => window.removeEventListener('error', handleError);
    }, []);

    if (hasError) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
                <div className="text-center max-w-md">
                    <div className="text-6xl mb-4">⚠️</div>
                    <h1 className="text-2xl font-bold text-white mb-2">Something went wrong</h1>
                    <p className="text-slate-400 text-sm mb-6">Please refresh the page or try again later</p>
                    <button 
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition"
                    >
                        Refresh Page
                    </button>
                </div>
            </div>
        );
    }

    return children;
};

// Main App Component - NO useLocation() here
const App = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    // Check network status
    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    // Initial loading
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    return (
        <ErrorBoundary>
            {/* Loading Overlay */}
            {isLoading && (
                <div className="fixed inset-0 z-50 bg-slate-900 flex items-center justify-center">
                    <div className="text-center">
                        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-slate-400 text-sm">Loading CodeSync...</p>
                    </div>
                </div>
            )}

            {/* Offline Status Bar */}
            {!isOnline && (
                <div className="fixed top-0 left-0 right-0 z-50 bg-red-600/90 backdrop-blur-sm text-white text-center py-2 text-sm font-medium">
                    <span className="flex items-center justify-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a5 5 0 01-7.071 0m0 0L5.636 15.536m0 0l-2.829 2.829M10.607 10.607a5 5 0 010 7.071" />
                        </svg>
                        You are offline. Some features may be unavailable.
                    </span>
                </div>
            )}

            <AppRoutes />
            <ToastContainer {...toastConfig} />
        </ErrorBoundary>
    );
};

export default App;