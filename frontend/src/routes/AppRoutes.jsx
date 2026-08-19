import React, { Suspense } from 'react'
import { Route, BrowserRouter, Routes, useLocation } from 'react-router-dom'

const Login = React.lazy(() => import('../screens/Login'))
const Register = React.lazy(() => import('../screens/Register'))
const Home = React.lazy(() => import('../screens/Home'))
const Project = React.lazy(() => import('../screens/Project'))
const Landing = React.lazy(() => import('../screens/Landing'))
const Terms = React.lazy(() => import('../screens/Terms'))
const Privacy = React.lazy(() => import('../screens/Privacy'))
const Profile = React.lazy(() => import('../screens/Profile'))
const ForgotPassword = React.lazy(() => import('../screens/ForgotPassword'))
const AuthCallback = React.lazy(() => import('../screens/AuthCallback'))

import UserAuth from '../auth/UserAuth'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ScrollToTop from '../components/ScrollToTop'
import OfflineBanner from '../components/OfflineBanner'
import { NotificationProvider } from '../context/notification.context'

// Premium Loading Component
const LoadingScreen = () => {
    return (
        <div className="fixed inset-0 z-[100] flex min-h-screen flex-col items-center justify-center bg-[#0a0a0f]">
            {/* Animated Logo */}
            <div className="relative mb-8">
                <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 ring-1 ring-blue-500/30">
                    <img
                        src='/terminal_favicon.png'
                        alt='CodeSync logo'
                        className='h-12 w-12 animate-pulse object-contain'
                    />
                </div>
                
                {/* Spinning ring */}
                <div className="absolute -inset-2 animate-spin rounded-3xl border-2 border-transparent border-t-blue-500/50 border-r-cyan-500/50"></div>
            </div>
            
            <div className="text-center">
                <h2 className="mb-2 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-xl font-bold text-transparent">
                    CodeSync
                </h2>
                <p className="text-sm text-slate-500">Loading your workspace...</p>
            </div>
            
            {/* Loading dots */}
            <div className="mt-4 flex gap-1.5">
                <span className="h-2 w-2 animate-bounce rounded-full bg-blue-500" style={{ animationDelay: '0ms' }}></span>
                <span className="h-2 w-2 animate-bounce rounded-full bg-cyan-500" style={{ animationDelay: '150ms' }}></span>
                <span className="h-2 w-2 animate-bounce rounded-full bg-blue-400" style={{ animationDelay: '300ms' }}></span>
            </div>
        </div>
    )
}

const AppLayout = () => {
    const location = useLocation()
    
    // Pages jahan Navbar NAHI dikhana
    const hideNavbar = [
        '/login',
        '/register',
        '/forgot-password',
        '/auth/callback'
    ]
    
    // Pages jahan Footer NAHI dikhana
    const hideFooter = [
        '/login',
        '/register',
        '/forgot-password',
        '/auth/callback',
        '/project'
    ]
    
    const shouldShowNavbar = !hideNavbar.includes(location.pathname)
    const shouldShowFooter = !hideFooter.includes(location.pathname)

    return (
        <>
            <NotificationProvider>
                {shouldShowNavbar && <Navbar />}

                <OfflineBanner />

                <Suspense fallback={<LoadingScreen />}>
                    <ScrollToTop />

                    <Routes>
                        {/* Public Routes */}
                        <Route path="/" element={<Landing />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                        <Route path="/auth/callback" element={<AuthCallback />} />

                        {/* Legal Pages */}
                        <Route path="/terms" element={<Terms />} />
                        <Route path="/privacy" element={<Privacy />} />

                        {/* Protected Routes */}
                        <Route
                            path="/home"
                            element={
                                <UserAuth>
                                    <Home />
                                </UserAuth>
                            }
                        />

                        <Route
                            path="/project"
                            element={
                                <UserAuth>
                                    <Project />
                                </UserAuth>
                            }
                        />

                        <Route
                            path="/profile"
                            element={
                                <UserAuth>
                                    <Profile />
                                </UserAuth>
                            }
                        />

                        {/* 404 Fallback */}
                        <Route
                            path="*"
                            element={
                                <div className="flex min-h-screen items-center justify-center bg-[#0a0a0f]">
                                    <div className="text-center">
                                        <h1 className="mb-4 text-6xl font-bold text-white">404</h1>
                                        <p className="mb-6 text-slate-400">Page not found</p>
                                        <button
                                            onClick={() => window.location.href = '/'}
                                            className="rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500"
                                        >
                                            Go Home
                                        </button>
                                    </div>
                                </div>
                            }
                        />
                    </Routes>
                </Suspense>
            </NotificationProvider>

            {shouldShowFooter && <Footer />}
        </>
    )
}

const AppRoutes = () => {
    return (
        <BrowserRouter>
            <AppLayout />
        </BrowserRouter>
    )
}

export default AppRoutes