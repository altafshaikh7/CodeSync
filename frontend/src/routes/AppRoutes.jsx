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

const AppLayout = () => {
    const location = useLocation()
    const hideFooter = location.pathname.startsWith('/project')

    return (
        <>
            <NotificationProvider>
                <Navbar />

                <OfflineBanner />

                <Suspense
                    fallback={
                        <div className="min-h-screen bg-slate-900 flex items-center justify-center text-slate-400">
                            Loading...
                        </div>
                    }
                >
                    <ScrollToTop />

                    <Routes>
                        <Route path="/" element={<Landing />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />

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

                        <Route path="/terms" element={<Terms />} />
                        <Route path="/privacy" element={<Privacy />} />

                        <Route
                            path="/profile"
                            element={
                                <UserAuth>
                                    <Profile />
                                </UserAuth>
                            }
                        />

                        <Route path="/forgot-password" element={<ForgotPassword />} />
                        <Route path="/auth/callback" element={<AuthCallback />} />
                    </Routes>
                </Suspense>
            </NotificationProvider>

            {!hideFooter && <Footer />}
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