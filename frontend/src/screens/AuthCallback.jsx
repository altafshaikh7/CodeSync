import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../context/user.context';
import axios from '../config/axios';
import { toast } from 'react-toastify';

const AuthCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { setUser } = useContext(UserContext);
    const [loading, setLoading] = useState(true);
    const [statusMessage, setStatusMessage] = useState('Signing you in...');
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = searchParams.get('token');
        const errorParam = searchParams.get('error');
        const message = searchParams.get('message');

        // Check for error from OAuth provider
        if (errorParam) {
            const errorMessage = message || errorParam;
            toast.error(`Authentication failed: ${errorMessage}`);
            setError(errorMessage);
            setLoading(false);
            setTimeout(() => {
                navigate('/login?error=' + encodeURIComponent(errorParam));
            }, 500);
            return;
        }

        // Check if token exists
        if (!token) {
            toast.error('No authentication token received');
            setError('No authentication token received');
            setLoading(false);
            setTimeout(() => {
                navigate('/login');
            }, 500);
            return;
        }

        // Store token and get user profile
        const authenticateUser = async () => {
            try {
                setStatusMessage('Verifying credentials...');
                
                // Store token in localStorage
                localStorage.setItem('token', token);
                
                // Set token in axios default headers
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                
                setStatusMessage('Loading your profile...');
                
                // Get user profile
                const res = await axios.get('/users/profile');
                
                if (res.data?.user) {
                    setUser(res.data.user);
                    toast.success('Welcome back!');
                    setStatusMessage('Redirecting...');
                    setLoading(false);
                    setTimeout(() => {
                        navigate('/home');
                    }, 300);
                } else {
                    throw new Error('User data not received');
                }
            } catch (err) {
                console.error('Auth callback error:', err);
                localStorage.removeItem('token');
                delete axios.defaults.headers.common['Authorization'];
                
                const errorMsg = err.response?.data?.message || err.message || 'Authentication failed';
                toast.error(errorMsg);
                setError(errorMsg);
                setLoading(false);
                setTimeout(() => {
                    navigate('/login');
                }, 500);
            }
        };

        authenticateUser();

        // Cleanup function
        return () => {
            // Reset any state if needed
        };
    }, [searchParams, navigate, setUser]);

    return (
        <main className='min-h-screen bg-slate-900 flex items-center justify-center'>
            <div className='text-white text-center max-w-sm mx-auto p-6'>
                <div className='flex flex-col items-center gap-6'>
                    {/* Animated spinner */}
                    <div className='relative'>
                        <div className='w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin'></div>
                        <div className='absolute inset-0 flex items-center justify-center'>
                            <div className='w-10 h-10 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin' style={{ animationDuration: '0.8s' }}></div>
                        </div>
                    </div>
                    
                    <div>
                        <p className='text-white font-medium text-lg'>
                            {loading ? statusMessage : 'Almost there...'}
                        </p>
                        <p className='text-slate-400 text-sm mt-2'>
                            {loading ? 'Please wait while we complete the authentication' : 'Redirecting you to your dashboard'}
                        </p>
                    </div>

                    {/* Loading progress bar */}
                    {loading && (
                        <div className='w-full max-w-xs'>
                            <div className='h-1 bg-slate-700 rounded-full overflow-hidden'>
                                <div className='h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-progress'></div>
                            </div>
                        </div>
                    )}

                    {/* Show error if any */}
                    {error && (
                        <div className='mt-4 p-3 bg-red-900/20 border border-red-700/50 rounded-lg w-full'>
                            <p className='text-red-400 text-sm'>{error}</p>
                            <button 
                                onClick={() => navigate('/login')}
                                className='mt-2 text-blue-400 hover:text-blue-300 text-sm transition'
                            >
                                Go back to login
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
};

export default AuthCallback;