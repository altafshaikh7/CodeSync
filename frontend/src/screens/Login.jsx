import { useState, useContext, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../config/axios.js';
import { UserContext } from '../context/user.context.jsx';
import { toast } from 'react-toastify';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState('login');
    const [resendCooldown, setResendCooldown] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const { setUser } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (resendCooldown <= 0) return;
        const timer = setInterval(() => {
            setResendCooldown((prev) => Math.max(prev - 1, 0));
        }, 1000);
        return () => clearInterval(timer);
    }, [resendCooldown]);

    function showApiError(err, fallback = "Something went wrong") {
        const data = err.response?.data;

        if (Array.isArray(data?.errors)) {
            data.errors.forEach((er) => toast.error(er.msg || er));
        } else if (typeof data?.errors === 'string') {
            toast.error(data.errors);
        } else if (data?.message) {
            toast.error(data.message);
        } else {
            toast.error(fallback);
        }
    }

    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    async function submitHandler(e) {
        e.preventDefault();

        const normalizedEmail = email.trim().toLowerCase();
        if (!validateEmail(normalizedEmail)) {
            toast.error('Please enter a valid email address');
            return;
        }

        if (password.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        setIsLoading(true);

        try {
            const res = await axios.post('/users/login', {
                email: normalizedEmail,
                password
            });
            toast.success(res.data.message || "OTP sent to your email");
            setStep('otp');
            setResendCooldown(30);
        } catch (err) {
            console.error('Login error:', err);
            showApiError(err, 'Login failed');
        } finally {
            setIsLoading(false);
        }
    }

    async function verifyOtpHandler(e) {
        e.preventDefault();

        const normalizedOtp = otp.trim();
        if (!/^\d{6}$/.test(normalizedOtp)) {
            toast.error('Please enter a valid 6-digit OTP');
            return;
        }

        setIsLoading(true);

        try {
            const res = await axios.post('/users/verify-login', {
                email: email.trim().toLowerCase(),
                otp: normalizedOtp
            });
            toast.success("Logged in successfully");
            setUser(res.data.user);
            navigate('/home');
        } catch (err) {
            console.error('Verify OTP error:', err);
            showApiError(err, "Invalid OTP");
        } finally {
            setIsLoading(false);
        }
    }

    async function resendOtpHandler() {
        if (resendCooldown > 0 || isResending) return;

        setIsResending(true);

        try {
            const res = await axios.post('/users/login', {
                email: email.trim().toLowerCase(),
                password
            });
            toast.success(res.data.message || "OTP resent to your email");
            setResendCooldown(30);
        } catch (err) {
            console.error('Resend error:', err);
            showApiError(err, "Failed to resend OTP");
        } finally {
            setIsResending(false);
        }
    }

    const handleBackToLogin = useCallback(() => {
        setStep('login');
        setOtp('');
    }, []);

    const apiUrl = import.meta.env.VITE_API_URL || 'https://codesync-ne50.onrender.com';

    return (
        <div className="relative min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4 py-10 overflow-hidden">
            {/* Background effects */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-blue-500/[0.05] blur-[120px]"></div>
                <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-purple-500/[0.03] blur-[100px]"></div>
            </div>

            <div className="relative w-full max-w-xl">
                {/* Logo */}
                <div className="mb-8 text-center">
                    <div className="group mb-4 inline-flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 ring-1 ring-blue-500/30 transition-all duration-500 hover:scale-110 hover:ring-blue-500/60 hover:shadow-xl hover:shadow-blue-500/20">
                        <img
                            src='/terminal_favicon.png'
                            alt='CodeSync logo'
                            className='h-9 w-9 object-contain transition-transform duration-500 group-hover:rotate-6'
                        />
                    </div>
                    <h1 className="text-2xl font-bold text-white">Welcome to CodeSync</h1>
                    <p className="mt-2 text-sm text-slate-500">Sign in to continue to your workspace</p>
                </div>

                <div className="overflow-hidden rounded-3xl border border-slate-700/60 bg-slate-900/80 shadow-2xl shadow-black/40 backdrop-blur-xl transition-all duration-500 hover:border-slate-600/80">
                    <div className="px-8 py-10 sm:px-10">
                        {step === 'login' && (
                            <>
                                <div className="mb-8">
                                    <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-xs font-medium text-blue-400">
                                        <i className="ri-shield-check-line text-sm"></i>
                                        Secure access
                                    </div>
                                    <h2 className="mt-6 text-3xl font-bold text-white">Sign in</h2>
                                    <p className="mt-3 text-sm text-slate-400">Enter your email and password to continue to your dashboard.</p>
                                </div>

                                <form onSubmit={submitHandler} className="space-y-5">
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-slate-300">Email</label>
                                        <div className="group relative rounded-2xl border border-slate-700/80 bg-slate-900/80 transition-all duration-300 focus-within:border-blue-500/50 focus-within:ring-2 focus-within:ring-blue-500/20">
                                            <i className="ri-mail-line absolute left-4 top-1/2 -translate-y-1/2 text-lg text-slate-500 transition-colors duration-300 group-focus-within:text-blue-400"></i>
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="you@example.com"
                                                className="w-full bg-transparent py-3.5 pl-11 pr-4 text-base text-slate-100 placeholder:text-slate-500 outline-none"
                                                required
                                                aria-label="Email address"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-slate-300">Password</label>
                                        <div className="group relative rounded-2xl border border-slate-700/80 bg-slate-900/80 transition-all duration-300 focus-within:border-blue-500/50 focus-within:ring-2 focus-within:ring-blue-500/20">
                                            <i className="ri-lock-line absolute left-4 top-1/2 -translate-y-1/2 text-lg text-slate-500 transition-colors duration-300 group-focus-within:text-blue-400"></i>
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                placeholder="••••••••"
                                                className="w-full bg-transparent py-3.5 pl-11 pr-12 text-base text-slate-100 placeholder:text-slate-500 outline-none"
                                                required
                                                aria-label="Password"
                                                minLength={6}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 transition-colors duration-300 hover:text-slate-300"
                                                aria-label={showPassword ? "Hide password" : "Show password"}
                                            >
                                                <i className={`text-lg ${showPassword ? 'ri-eye-off-line' : 'ri-eye-line'}`}></i>
                                            </button>
                                        </div>
                                        <p className='mt-2 text-right text-sm text-slate-400'>
                                            <span 
                                                onClick={() => navigate('/forgot-password')} 
                                                className='group inline-flex items-center gap-1 text-blue-400 transition-all duration-300 hover:text-blue-300 cursor-pointer'
                                                role="button"
                                                tabIndex={0}
                                                onKeyDown={(e) => e.key === 'Enter' && navigate('/forgot-password')}
                                            >
                                                Forgot password?
                                                <i className="ri-arrow-right-line text-xs transition-transform duration-300 group-hover:translate-x-1"></i>
                                            </span>
                                        </p>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="group relative w-full overflow-hidden rounded-2xl bg-blue-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition-all duration-300 hover:scale-[1.02] hover:bg-blue-500 hover:shadow-xl hover:shadow-blue-500/35 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        <span className="relative z-10 inline-flex items-center gap-2">
                                            {isLoading ? (
                                                <>
                                                    <i className="ri-loader-4-line animate-spin"></i>
                                                    Sending OTP...
                                                </>
                                            ) : (
                                                <>
                                                    Continue
                                                    <i className="ri-arrow-right-line transition-transform duration-300 group-hover:translate-x-1"></i>
                                                </>
                                            )}
                                        </span>
                                        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full"></div>
                                    </button>

                                    {/* Divider */}
                                    <div className='my-6 flex items-center gap-3'>
                                        <div className='h-px flex-1 bg-gradient-to-r from-transparent via-slate-700 to-transparent'></div>
                                        <span className='text-xs text-slate-500'>or continue with</span>
                                        <div className='h-px flex-1 bg-gradient-to-r from-transparent via-slate-700 to-transparent'></div>
                                    </div>

                                    {/* Google Login */}
                                    <a
                                        href={`${apiUrl}/auth/google`}
                                        className='group flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-700/80 bg-slate-900/80 px-4 py-3 text-sm text-slate-300 transition-all duration-300 hover:scale-[1.02] hover:border-slate-500 hover:bg-slate-800 hover:text-white hover:shadow-lg hover:shadow-slate-500/10'
                                    >
                                        <svg width="18" height="18" viewBox="0 0 48 48" className="transition-transform duration-300 group-hover:scale-110">
                                            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                                            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                                            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                                            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                                            <path fill="none" d="M0 0h48v48H0z" />
                                        </svg>
                                        Continue with Google
                                    </a>
                                </form>

                                <div className="mt-8 flex items-center justify-center gap-2 text-sm text-slate-500">
                                    <span>New here?</span>
                                    <button
                                        onClick={() => navigate('/register')}
                                        className="group inline-flex items-center gap-1 font-medium text-blue-400 transition-all duration-300 hover:text-blue-300 cursor-pointer"
                                    >
                                        Create account
                                        <i className="ri-arrow-right-line text-xs transition-transform duration-300 group-hover:translate-x-1"></i>
                                    </button>
                                </div>
                            </>
                        )}

                        {step === 'otp' && (
                            <>
                                <div className="mb-8">
                                    <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-medium text-emerald-400">
                                        <i className="ri-shield-check-line text-sm"></i>
                                        Verify it's you
                                    </div>
                                    <h2 className="mt-6 text-3xl font-bold text-white">Enter OTP</h2>
                                    <p className="mt-3 text-sm text-slate-400">
                                        We've sent a 6-digit code to <span className="font-semibold text-white">{email}</span>. Enter it below to continue.
                                    </p>
                                </div>

                                <form onSubmit={verifyOtpHandler} className="space-y-5">
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-slate-300">OTP Code</label>
                                        <div className="group relative rounded-2xl border border-slate-700/80 bg-slate-900/80 transition-all duration-300 focus-within:border-blue-500/50 focus-within:ring-2 focus-within:ring-blue-500/20">
                                            <i className="ri-key-2-line absolute left-4 top-1/2 -translate-y-1/2 text-lg text-slate-500 transition-colors duration-300 group-focus-within:text-blue-400"></i>
                                            <input
                                                type="text"
                                                inputMode="numeric"
                                                value={otp}
                                                onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                                                placeholder="123456"
                                                maxLength={6}
                                                className="w-full bg-transparent py-3.5 pl-11 pr-4 text-center text-2xl font-bold tracking-[12px] text-slate-100 placeholder:text-slate-600 outline-none"
                                                required
                                                aria-label="OTP code"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isLoading || otp.length !== 6}
                                        className="group relative w-full overflow-hidden rounded-2xl bg-blue-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition-all duration-300 hover:scale-[1.02] hover:bg-blue-500 hover:shadow-xl hover:shadow-blue-500/35 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        <span className="relative z-10 inline-flex items-center gap-2">
                                            {isLoading ? (
                                                <>
                                                    <i className="ri-loader-4-line animate-spin"></i>
                                                    Verifying...
                                                </>
                                            ) : (
                                                <>
                                                    Verify & Continue
                                                    <i className="ri-arrow-right-line transition-transform duration-300 group-hover:translate-x-1"></i>
                                                </>
                                            )}
                                        </span>
                                        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full"></div>
                                    </button>
                                </form>

                                <div className="mt-6 flex items-center justify-between text-sm text-slate-500">
                                    <span>Didn't get the code?</span>
                                    <button
                                        type="button"
                                        onClick={resendOtpHandler}
                                        disabled={resendCooldown > 0 || isResending}
                                        className={`font-medium transition-all duration-300 ${
                                            resendCooldown > 0 || isResending
                                                ? 'text-slate-600 cursor-not-allowed' 
                                                : 'text-blue-400 hover:text-blue-300 hover:cursor-pointer'
                                        }`}
                                    >
                                        {isResending ? (
                                            <>
                                                <i className="ri-loader-4-line animate-spin mr-1"></i>
                                                Resending...
                                            </>
                                        ) : resendCooldown > 0 ? (
                                            `Resend in ${resendCooldown}s`
                                        ) : (
                                            'Resend OTP'
                                        )}
                                    </button>
                                </div>

                                <div className="mt-4 text-center">
                                    <button
                                        type="button"
                                        onClick={handleBackToLogin}
                                        className="group inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-all duration-300 hover:text-slate-300 hover:cursor-pointer"
                                    >
                                        <i className="ri-arrow-left-line text-xs transition-transform duration-300 group-hover:-translate-x-1"></i>
                                        Go back to login
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Bottom text */}
                <p className="mt-6 text-center text-xs text-slate-600">
                    <i className="ri-lock-line mr-1"></i>
                    Protected by enterprise-grade security
                </p>
            </div>
        </div>
    );
};

export default Login;