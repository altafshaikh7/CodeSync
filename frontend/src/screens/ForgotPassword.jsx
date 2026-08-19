import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../config/axios';
import { toast } from 'react-toastify';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1: email, 2: otp + new password
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(0);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Resend cooldown timer
    useEffect(() => {
        if (resendCooldown <= 0) return;
        const timer = setInterval(() => {
            setResendCooldown((prev) => Math.max(prev - 1, 0));
        }, 1000);
        return () => clearInterval(timer);
    }, [resendCooldown]);

    function showApiError(err, fallback = 'Something went wrong') {
        const data = err.response?.data;
        if (data?.errors?.length) {
            data.errors.forEach((e) => toast.error(e.msg || e));
        } else if (typeof data?.errors === 'string') {
            toast.error(data.errors);
        } else {
            toast.error(data?.message || fallback);
        }
    }

    // Validate email format
    const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const handleSendOtp = async () => {
        if (!email) {
            toast.error('Please enter your email address');
            return;
        }
        if (!isValidEmail(email)) {
            toast.error('Please enter a valid email address');
            return;
        }

        setLoading(true);
        try {
            await axios.post('/users/forgot-password', { email });
            toast.success('OTP sent to your email');
            setStep(2);
            setResendCooldown(60);
        } catch (err) {
            showApiError(err, 'Failed to send OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        if (resendCooldown > 0) return;
        
        setLoading(true);
        try {
            await axios.post('/users/forgot-password', { email });
            toast.success('OTP resent to your email');
            setResendCooldown(60);
        } catch (err) {
            showApiError(err, 'Failed to resend OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async () => {
        // Validate OTP
        if (!otp || otp.length !== 6) {
            toast.error('Please enter a valid 6-digit OTP');
            return;
        }

        // Validate password
        if (!newPassword || newPassword.length < 6) {
            toast.error('Password must be at least 6 characters long');
            return;
        }

        // Check password match
        if (newPassword !== confirmPassword) {
            toast.error("Passwords don't match");
            return;
        }

        setLoading(true);
        try {
            await axios.post('/users/reset-password', { email, otp, newPassword });
            toast.success('Password reset successfully! Please login.');
            setTimeout(() => {
                navigate('/login');
            }, 1500);
        } catch (err) {
            showApiError(err, 'Failed to reset password');
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e, action) => {
        if (e.key === 'Enter') {
            action();
        }
    };

    return (
        <main className='min-h-screen bg-slate-900 text-white flex items-center justify-center px-4 py-10'>
            <div className='w-full max-w-md bg-slate-800 border border-slate-700 rounded-2xl p-6 sm:p-8'>
                {/* Logo/Icon */}
                <div className='flex justify-center mb-6'>
                    <div className='w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center'>
                        <i className='ri-lock-line text-2xl text-blue-400'></i>
                    </div>
                </div>

                <h1 className='text-2xl font-bold text-center mb-2'>Reset Password</h1>
                <p className='text-sm text-slate-400 text-center mb-6'>
                    {step === 1
                        ? "Enter your email to receive a reset OTP."
                        : `Enter the OTP sent to your email and your new password.`}
                </p>

                {step === 1 ? (
                    <div className='space-y-4'>
                        <div className='relative'>
                            <i className='ri-mail-line absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm'></i>
                            <input
                                type='email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onKeyDown={(e) => handleKeyPress(e, handleSendOtp)}
                                placeholder='Enter your email'
                                className='w-full pl-9 pr-4 py-2.5 rounded-lg bg-slate-700 border border-slate-600 text-sm outline-none focus:border-blue-500 placeholder-slate-500 transition'
                            />
                        </div>
                        <button
                            onClick={handleSendOtp}
                            disabled={loading || !email}
                            className='w-full px-5 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 rounded-lg text-sm font-semibold transition flex items-center justify-center gap-2'
                        >
                            {loading ? (
                                <>
                                    <i className='ri-loader-4-line animate-spin'></i>
                                    Sending...
                                </>
                            ) : (
                                <>
                                    <i className='ri-mail-send-line'></i>
                                    Send OTP
                                </>
                            )}
                        </button>
                    </div>
                ) : (
                    <div className='space-y-4'>
                        <div className='relative'>
                            <i className='ri-key-2-line absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm'></i>
                            <input
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                                onKeyDown={(e) => handleKeyPress(e, handleResetPassword)}
                                placeholder='Enter 6-digit OTP'
                                maxLength={6}
                                inputMode='numeric'
                                className='w-full pl-9 pr-4 py-2.5 rounded-lg bg-slate-700 border border-slate-600 text-sm outline-none focus:border-blue-500 placeholder-slate-500 transition tracking-[8px] font-bold'
                            />
                        </div>

                        <div className='relative'>
                            <i className='ri-lock-line absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm'></i>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                onKeyDown={(e) => handleKeyPress(e, handleResetPassword)}
                                placeholder='New password (min 6 characters)'
                                className='w-full pl-9 pr-10 py-2.5 rounded-lg bg-slate-700 border border-slate-600 text-sm outline-none focus:border-blue-500 placeholder-slate-500 transition'
                            />
                            <button
                                type='button'
                                onClick={() => setShowPassword(!showPassword)}
                                className='absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition'
                            >
                                <i className={showPassword ? 'ri-eye-off-line' : 'ri-eye-line'}></i>
                            </button>
                        </div>

                        <div className='relative'>
                            <i className='ri-lock-line absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm'></i>
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                onKeyDown={(e) => handleKeyPress(e, handleResetPassword)}
                                placeholder='Confirm new password'
                                className='w-full pl-9 pr-10 py-2.5 rounded-lg bg-slate-700 border border-slate-600 text-sm outline-none focus:border-blue-500 placeholder-slate-500 transition'
                            />
                            <button
                                type='button'
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className='absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition'
                            >
                                <i className={showConfirmPassword ? 'ri-eye-off-line' : 'ri-eye-line'}></i>
                            </button>
                        </div>

                        {/* Password strength indicator */}
                        {newPassword && newPassword.length > 0 && (
                            <div className='space-y-1'>
                                <div className='flex gap-1 h-1'>
                                    <div className={`flex-1 rounded-full ${
                                        newPassword.length < 4 ? 'bg-red-500' :
                                        newPassword.length < 6 ? 'bg-yellow-500' :
                                        'bg-green-500'
                                    }`}></div>
                                    <div className={`flex-1 rounded-full ${
                                        newPassword.length < 6 ? 'bg-slate-600' :
                                        newPassword.length < 8 ? 'bg-yellow-500' :
                                        'bg-green-500'
                                    }`}></div>
                                    <div className={`flex-1 rounded-full ${
                                        newPassword.length < 8 ? 'bg-slate-600' :
                                        'bg-green-500'
                                    }`}></div>
                                </div>
                                <p className='text-[10px] text-slate-400'>
                                    {newPassword.length < 4 ? 'Weak' :
                                     newPassword.length < 6 ? 'Fair' :
                                     newPassword.length < 8 ? 'Good' :
                                     'Strong'}
                                </p>
                            </div>
                        )}

                        <button
                            onClick={handleResetPassword}
                            disabled={loading || !otp || !newPassword || !confirmPassword}
                            className='w-full px-5 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 rounded-lg text-sm font-semibold transition flex items-center justify-center gap-2'
                        >
                            {loading ? (
                                <>
                                    <i className='ri-loader-4-line animate-spin'></i>
                                    Resetting...
                                </>
                            ) : (
                                <>
                                    <i className='ri-check-line'></i>
                                    Reset Password
                                </>
                            )}
                        </button>

                        {/* Resend OTP */}
                        <div className='flex items-center justify-between text-sm'>
                            <span className='text-slate-400'>Didn't get the code?</span>
                            <button
                                onClick={handleResendOtp}
                                disabled={resendCooldown > 0 || loading}
                                className={`font-medium transition ${
                                    resendCooldown > 0 
                                        ? 'text-slate-500 cursor-not-allowed' 
                                        : 'text-blue-400 hover:text-blue-300'
                                }`}
                            >
                                {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend OTP'}
                            </button>
                        </div>

                        <button
                            onClick={() => {
                                setStep(1);
                                setOtp('');
                                setNewPassword('');
                                setConfirmPassword('');
                            }}
                            className='w-full px-5 py-2.5 border border-slate-600 hover:bg-slate-700 rounded-lg text-sm transition flex items-center justify-center gap-2'
                        >
                            <i className='ri-arrow-left-line'></i>
                            Back to Email
                        </button>
                    </div>
                )}

                <p className='text-sm text-slate-400 mt-6 text-center'>
                    Remember your password?{' '}
                    <span 
                        onClick={() => navigate('/login')} 
                        className='text-blue-400 hover:text-blue-300 hover:underline cursor-pointer transition'
                    >
                        Login
                    </span>
                </p>
            </div>
        </main>
    );
};

export default ForgotPassword;