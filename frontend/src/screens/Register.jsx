import { useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../context/user.context'
import axios from '../config/axios'
import { toast } from 'react-toastify'

const Register = () => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [otp, setOtp] = useState('')
    const [step, setStep] = useState('register')
    const [resendCooldown, setResendCooldown] = useState(0)
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const { setUser } = useContext(UserContext)
    const navigate = useNavigate()

    function showApiError(err, fallback = 'Something went wrong') {
        const data = err.response?.data
        console.log('Error:', data)

        if (data?.errors?.length) {
            data.errors.forEach((er) => toast.error(er.msg || er))
        } else if (typeof data?.errors === 'string') {
            toast.error(data.errors)
        } else if (data?.message) {
            toast.error(data.message)
        } else {
            toast.error(fallback)
        }
    }

    useEffect(() => {
        if (resendCooldown <= 0) return
        const timer = setInterval(() => {
            setResendCooldown((prev) => Math.max(prev - 1, 0))
        }, 1000)
        return () => clearInterval(timer)
    }, [resendCooldown])

    async function submitHandler(e) {
        e.preventDefault()

        if (name.trim().length < 3) {
            toast.error('Name must be at least 3 characters long')
            return
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            toast.error('Please enter a valid email address')
            return
        }

        if (password.length < 6) {
            toast.error('Password must be at least 6 characters long')
            return
        }

        if (password !== confirmPassword) {
            toast.error('Passwords do not match')
            return
        }

        try {
            setIsLoading(true)

            const res = await axios.post('/users/register', {
                name: name.trim(),
                email: email.toLowerCase().trim(),
                password: password
            })

            console.log('Response:', res.data)

            toast.success(res.data.message || 'OTP sent to your email')
            
            setStep('otp')
            setResendCooldown(60)
        } catch (err) {
            showApiError(err, 'Registration failed')
        } finally {
            setIsLoading(false)
        }
    }

    async function verifyOtpHandler(e) {
        e.preventDefault()

        if (otp.length !== 6) {
            toast.error('Please enter a valid 6-digit OTP')
            return
        }

        try {
            setIsLoading(true)

            const res = await axios.post('/users/verify-signup', {
                email: email.toLowerCase().trim(),
                otp
            })

            toast.success('Email verified! Welcome 🎉')

            setUser(res.data.user)
            navigate('/home')
        } catch (err) {
            showApiError(err, 'Invalid OTP')
        } finally {
            setIsLoading(false)
        }
    }

    async function resendOtpHandler() {
        if (resendCooldown > 0) return

        try {
            setIsLoading(true)

            const res = await axios.post('/users/register', {
                name: name.trim(),
                email: email.toLowerCase().trim(),
                password: password
            })

            toast.success(res.data.message || 'OTP resent to your email')
            
            setResendCooldown(60)
        } catch (err) {
            showApiError(err, 'Failed to resend OTP')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0a0a0f] px-4 py-10">
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
                <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-blue-500/[0.05] blur-[120px]"></div>
            </div>

            <div className="relative w-full max-w-xl">
                <div className="mb-8 text-center">
                    <div className="group mb-4 inline-flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 ring-1 ring-blue-500/30 transition-all duration-500 hover:scale-110 hover:ring-blue-500/60 hover:shadow-xl hover:shadow-blue-500/20">
                        <img src='/terminal_favicon.png' alt='CodeSync logo' className='h-10 w-10 object-contain transition-transform duration-500 group-hover:rotate-6' />
                    </div>
                    <h1 className="text-3xl font-bold text-white">Join CodeSync</h1>
                    <p className="mt-2 text-sm text-slate-400">Create your account and start building together</p>
                </div>

                <div className="overflow-hidden rounded-3xl border border-slate-700/60 bg-slate-900/80 shadow-2xl shadow-black/40 backdrop-blur-xl">
                    <div className="px-8 py-10 sm:px-10">
                        {step === 'register' && (
                            <>
                                <div className="mb-8">
                                    <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-medium text-emerald-400">
                                        <i className="ri-shield-check-line text-sm"></i>
                                        New account
                                    </div>
                                    <h2 className="mt-6 text-3xl font-bold text-white">Create your account</h2>
                                    <p className="mt-3 text-sm text-slate-400">Join CodeSync and start building with your team and AI.</p>
                                </div>

                                <form onSubmit={submitHandler} className="space-y-5">
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-slate-300">Name (min 3 characters)</label>
                                        <div className="group relative rounded-2xl border border-slate-700/80 bg-slate-900/80 transition-all duration-300 focus-within:border-emerald-500/50 focus-within:ring-2 focus-within:ring-emerald-500/20">
                                            <i className="ri-user-line absolute left-4 top-1/2 -translate-y-1/2 text-lg text-slate-500 transition-colors duration-300 group-focus-within:text-emerald-400"></i>
                                            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" className="w-full bg-transparent py-3.5 pl-11 pr-4 text-base text-slate-100 placeholder:text-slate-500 outline-none" required />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-slate-300">Email</label>
                                        <div className="group relative rounded-2xl border border-slate-700/80 bg-slate-900/80 transition-all duration-300 focus-within:border-emerald-500/50 focus-within:ring-2 focus-within:ring-emerald-500/20">
                                            <i className="ri-mail-line absolute left-4 top-1/2 -translate-y-1/2 text-lg text-slate-500 transition-colors duration-300 group-focus-within:text-emerald-400"></i>
                                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="john@example.com" className="w-full bg-transparent py-3.5 pl-11 pr-4 text-base text-slate-100 placeholder:text-slate-500 outline-none" required />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-slate-300">Password (min 6 characters)</label>
                                        <div className="group relative rounded-2xl border border-slate-700/80 bg-slate-900/80 transition-all duration-300 focus-within:border-emerald-500/50 focus-within:ring-2 focus-within:ring-emerald-500/20">
                                            <i className="ri-lock-line absolute left-4 top-1/2 -translate-y-1/2 text-lg text-slate-500 transition-colors duration-300 group-focus-within:text-emerald-400"></i>
                                            <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="password123" className="w-full bg-transparent py-3.5 pl-11 pr-12 text-base text-slate-100 placeholder:text-slate-500 outline-none" required />
                                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 transition-colors duration-300 hover:text-slate-300">
                                                <i className={`text-lg ${showPassword ? 'ri-eye-off-line' : 'ri-eye-line'}`}></i>
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-slate-300">Confirm password</label>
                                        <div className="group relative rounded-2xl border border-slate-700/80 bg-slate-900/80 transition-all duration-300 focus-within:border-emerald-500/50 focus-within:ring-2 focus-within:ring-emerald-500/20">
                                            <i className="ri-lock-line absolute left-4 top-1/2 -translate-y-1/2 text-lg text-slate-500 transition-colors duration-300 group-focus-within:text-emerald-400"></i>
                                            <input type={showConfirmPassword ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="password123" className="w-full bg-transparent py-3.5 pl-11 pr-12 text-base text-slate-100 placeholder:text-slate-500 outline-none" required />
                                            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 transition-colors duration-300 hover:text-slate-300">
                                                <i className={`text-lg ${showConfirmPassword ? 'ri-eye-off-line' : 'ri-eye-line'}`}></i>
                                            </button>
                                        </div>
                                    </div>

                                    <button type="submit" disabled={isLoading} className="group relative w-full overflow-hidden rounded-2xl bg-blue-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition-all duration-300 hover:scale-[1.02] hover:bg-blue-500 hover:shadow-xl hover:shadow-blue-500/35 disabled:cursor-not-allowed disabled:opacity-60">
                                        <span className="relative z-10 inline-flex items-center gap-2">
                                            {isLoading ? (
                                                <>
                                                    <i className="ri-loader-4-line animate-spin"></i>
                                                    Creating account...
                                                </>
                                            ) : (
                                                <>
                                                    Create account
                                                    <i className="ri-arrow-right-line transition-transform duration-300 group-hover:translate-x-1"></i>
                                                </>
                                            )}
                                        </span>
                                    </button>
                                </form>

                                <div className="mt-8 flex items-center justify-center gap-2 text-sm text-slate-500">
                                    <span>Already have an account?</span>
                                    <button onClick={() => navigate('/login')} className="font-medium text-blue-400 transition-all duration-300 hover:text-blue-300 cursor-pointer">Sign in</button>
                                </div>
                            </>
                        )}

                        {step === 'otp' && (
                            <>
                                <div className="mb-8">
                                    <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-medium text-emerald-400">
                                        <i className="ri-shield-check-line text-sm"></i>
                                        Verify email
                                    </div>
                                    <h2 className="mt-6 text-3xl font-bold text-white">Enter OTP</h2>
                                    <p className="mt-3 text-sm text-slate-400">
                                        We've sent a 6-digit code to <span className="font-semibold text-white">{email}</span>
                                    </p>
                                </div>

                                <form onSubmit={verifyOtpHandler} className="space-y-5">
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-slate-300">OTP Code</label>
                                        <div className="group relative rounded-2xl border border-slate-700/80 bg-slate-900/80 transition-all duration-300 focus-within:border-emerald-500/50 focus-within:ring-2 focus-within:ring-emerald-500/20">
                                            <i className="ri-key-2-line absolute left-4 top-1/2 -translate-y-1/2 text-lg text-slate-500 transition-colors duration-300 group-focus-within:text-emerald-400"></i>
                                            <input type="text" inputMode="numeric" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="123456" maxLength={6} className="w-full bg-transparent py-3.5 pl-11 pr-4 text-center text-2xl font-bold tracking-[12px] text-slate-100 placeholder:text-slate-600 outline-none" required />
                                        </div>
                                    </div>

                                    <button type="submit" disabled={isLoading || otp.length !== 6} className="group relative w-full overflow-hidden rounded-2xl bg-blue-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition-all duration-300 hover:scale-[1.02] hover:bg-blue-500 hover:shadow-xl hover:shadow-blue-500/35 disabled:cursor-not-allowed disabled:opacity-60">
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
                                    </button>
                                </form>

                                <div className="mt-6 flex items-center justify-between text-sm text-slate-500">
                                    <span>Didn't get the code?</span>
                                    <button type="button" onClick={resendOtpHandler} disabled={resendCooldown > 0 || isLoading} className={`font-medium transition-all duration-300 ${resendCooldown > 0 || isLoading ? 'cursor-not-allowed text-slate-600' : 'text-emerald-400 hover:text-emerald-300'}`}>
                                        {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend OTP'}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Register