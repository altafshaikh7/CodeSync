import { useContext, useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { UserContext } from '../context/user.context'
import { NotificationContext } from '../context/notification.context'
import axios from '../config/axios'

const Navbar = () => {
    const { user, setUser } = useContext(UserContext)
    const navigate = useNavigate()
    const location = useLocation()

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isProfileOpen, setIsProfileOpen] = useState(false)
    const [isNotifOpen, setIsNotifOpen] = useState(false)

    const profileRef = useRef(null)
    const notifRef = useRef(null)

    const { pendingInvites, respondInvite } = useContext(NotificationContext)

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (profileRef.current && !profileRef.current.contains(e.target)) {
                setIsProfileOpen(false)
            }

            if (notifRef.current && !notifRef.current.contains(e.target)) {
                setIsNotifOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    // Close mobile menu when route changes
    useEffect(() => {
        setIsMobileMenuOpen(false)
    }, [location.pathname])

    function handleNavClick(section) {
        if (location.pathname !== '/home') {
            navigate('/home')

            setTimeout(() => {
                const refs = window.__homeRefs

                if (refs?.[section + 'Ref']?.current) {
                    refs[section + 'Ref'].current.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    })
                }
            }, 300)
        } else {
            const refs = window.__homeRefs

            if (refs?.[section + 'Ref']?.current) {
                refs[section + 'Ref'].current.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                })
            }
        }
    }

    const handleRespond = (projectId, action) => {
        respondInvite(projectId, action)
    }

    function logout() {
        axios
            .get('/users/logout')
            .finally(() => {
                localStorage.removeItem('token')
                setUser(null)
                navigate('/')
            })
    }

    const loggedInLinks = [
        {
            label: 'Home',
            action: () => {
                if (location.pathname === '/home') {
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    })
                } else {
                    navigate('/home')
                }
            }
        },
        {
            label: 'Projects',
            action: () => handleNavClick('projects')
        },
        {
            label: 'Features',
            action: () => handleNavClick('features')
        },
        {
            label: 'About',
            action: () => handleNavClick('about')
        }
    ]

    const publicLinks = [
        {
            label: 'Home',
            action: () => {
                if (location.pathname === '/') {
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    })
                } else {
                    navigate('/')
                }
            }
        },
        {
            label: 'Features',
            action: () => {
                if (location.pathname === '/') {
                    document
                        .getElementById('features-section')
                        ?.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        })
                } else {
                    navigate('/')
                }
            }
        },
        {
            label: 'About',
            action: () => {
                if (location.pathname === '/') {
                    document
                        .getElementById('about-section')
                        ?.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        })
                } else {
                    navigate('/')
                }
            }
        }
    ]

    const links = user ? loggedInLinks : publicLinks

    const getUserInitial = () => {
        return (
            user?.name?.[0]?.toUpperCase() ||
            user?.email?.[0]?.toUpperCase() ||
            'U'
        )
    }

    return (
        <nav className="sticky top-0 z-50 grid h-14 grid-cols-2 items-center border-b border-slate-800 bg-slate-900/90 px-6 backdrop-blur md:grid-cols-3 md:px-10">

            {/* Logo */}
            <div
                className="flex cursor-pointer items-center gap-2"
                onClick={() => {
                    const target = user ? '/home' : '/'

                    if (location.pathname !== target) {
                        navigate(target)
                    }

                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    })
                }}
            >
                <div className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-lg">
                    <img
                        src="/terminal_favicon.png"
                        alt="CodeSync logo"
                        className="h-full w-full object-contain"
                    />
                </div>

                <div className="flex flex-col leading-tight">
                    <span className="bg-gradient-to-b from-[#ff7a00] to-[#ffd500] bg-clip-text text-sm font-bold text-transparent">
                        CodeSync
                    </span>

                    <span className="hidden text-[9px] text-slate-500 lg:block">
                        by Shaikh Altaf
                    </span>
                </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden items-center justify-center gap-1 md:flex">
                {links.map((link) => (
                    <button
                        key={link.label}
                        onClick={link.action}
                        className="cursor-pointer rounded-lg px-3 py-1.5 text-sm text-slate-400 transition hover:bg-slate-800 hover:text-white"
                    >
                        {link.label}
                    </button>
                ))}
            </div>

            {/* Right Side */}
            <div className="flex items-center justify-end gap-3">

                {/* Notifications */}
                {user && (
                    <div ref={notifRef} className="relative">
                        <button
                            onClick={() => setIsNotifOpen(!isNotifOpen)}
                            className="relative cursor-pointer rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
                        >
                            <i className="ri-notification-3-line text-lg"></i>

                            {pendingInvites.length > 0 && (
                                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                                    {pendingInvites.length > 9
                                        ? '9+'
                                        : pendingInvites.length}
                                </span>
                            )}
                        </button>

                        {isNotifOpen && (
                            <div className="fixed left-2 right-2 top-16 z-50 overflow-hidden rounded-xl border border-slate-700 bg-slate-800 shadow-2xl sm:absolute sm:left-auto sm:right-0 sm:top-full sm:mt-2 sm:w-80">

                                <div className="border-b border-slate-700 px-4 py-3">
                                    <p className="text-sm font-semibold text-white">
                                        Notifications
                                    </p>
                                </div>

                                <div className="custom-scroll max-h-80 overflow-y-auto">
                                    {pendingInvites.length === 0 ? (
                                        <p className="py-6 text-center text-sm text-slate-500">
                                            No new notifications
                                        </p>
                                    ) : (
                                        pendingInvites.map((inv) => (
                                            <div
                                                key={inv.projectId}
                                                className="border-b border-slate-700/50 px-4 py-3 last:border-b-0"
                                            >
                                                <p className="text-sm text-slate-200">
                                                    <span className="font-semibold">
                                                        {inv.invitedBy?.name ||
                                                            inv.invitedBy?.email}
                                                    </span>{' '}
                                                    invited you to{' '}
                                                    <span className="font-semibold">
                                                        {inv.projectName}
                                                    </span>
                                                </p>

                                                <p className="mt-0.5 text-xs text-slate-500">
                                                    {inv.invitedBy?.email}
                                                </p>

                                                <div className="mt-2 flex items-center gap-2">
                                                    <button
                                                        onClick={() =>
                                                            handleRespond(
                                                                inv.projectId,
                                                                'reject'
                                                            )
                                                        }
                                                        className="rounded-lg border border-slate-600 px-3 py-1 text-xs text-slate-300 transition hover:bg-slate-700"
                                                    >
                                                        Decline
                                                    </button>

                                                    <button
                                                        onClick={() =>
                                                            handleRespond(
                                                                inv.projectId,
                                                                'accept'
                                                            )
                                                        }
                                                        className="rounded-lg bg-blue-600 px-3 py-1 text-xs text-white transition hover:bg-blue-500"
                                                    >
                                                        Accept
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Desktop Authentication / Profile */}
                <div className="hidden items-center gap-3 md:flex">

                    {user ? (
                        <div ref={profileRef} className="relative">
                            <button
                                onClick={() =>
                                    setIsProfileOpen(!isProfileOpen)
                                }
                                className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 transition hover:border-slate-600"
                            >
                                <div className="flex h-6 w-6 items-center justify-center overflow-hidden rounded-full bg-blue-600 text-xs font-semibold text-white">
                                    {user?.avatar ? (
                                        <img
                                            src={user.avatar}
                                            alt="User avatar"
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        getUserInitial()
                                    )}
                                </div>

                                <span className="max-w-32 truncate text-sm text-slate-300">
                                    {user?.name || user?.email}
                                </span>

                                <i
                                    className={`ri-arrow-down-s-line text-slate-400 transition ${
                                        isProfileOpen
                                            ? 'rotate-180'
                                            : ''
                                    }`}
                                ></i>
                            </button>

                            {isProfileOpen && (
                                <div className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-xl border border-slate-700 bg-slate-800 shadow-2xl">

                                    <div className="border-b border-slate-700 px-4 py-3">
                                        <p className="truncate text-sm font-medium text-white">
                                            {user?.name || 'User'}
                                        </p>

                                        <p className="truncate text-xs text-slate-400">
                                            {user?.email}
                                        </p>
                                    </div>

                                    <button
                                        onClick={() => {
                                            setIsProfileOpen(false)
                                            navigate('/profile')
                                        }}
                                        className="flex w-full cursor-pointer items-center gap-2 px-4 py-2.5 text-sm text-slate-300 transition hover:bg-slate-700"
                                    >
                                        <i className="ri-user-settings-line"></i>
                                        Edit Profile
                                    </button>

                                    <a
                                        href="https://shaikhaltaf.netlify.app"
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-slate-300 transition hover:bg-slate-700"
                                    >
                                        <i className="ri-user-line"></i>
                                        Developer Portfolio
                                    </a>

                                    <button
                                        onClick={logout}
                                        className="flex w-full cursor-pointer items-center gap-2 px-4 py-2.5 text-sm text-red-400 transition hover:bg-red-900/30"
                                    >
                                        <i className="ri-logout-box-r-line"></i>
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                            <button
                                onClick={() => navigate('/login')}
                                className="cursor-pointer px-3 py-1.5 text-sm text-slate-400 transition hover:text-white"
                            >
                                Sign in
                            </button>

                            <button
                                onClick={() => navigate('/register')}
                                className="cursor-pointer rounded-lg bg-blue-600 px-4 py-1.5 text-sm font-medium text-white transition hover:bg-blue-500"
                            >
                                Get started
                            </button>
                        </>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                    onClick={() =>
                        setIsMobileMenuOpen(!isMobileMenuOpen)
                    }
                    className="cursor-pointer p-2 text-slate-300 transition hover:text-white md:hidden"
                    aria-label="Toggle menu"
                >
                    <i
                        className={`text-xl ${
                            isMobileMenuOpen
                                ? 'ri-close-line'
                                : 'ri-menu-line'
                        }`}
                    ></i>
                </button>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="col-span-2 -mx-6 mt-2 border-t border-slate-800 bg-slate-900 px-6 pb-4 md:hidden">

                    {/* Navigation Links */}
                    <div className="flex flex-col gap-1 pt-3">
                        {links.map((link) => (
                            <button
                                key={link.label}
                                onClick={() => {
                                    link.action()
                                    setIsMobileMenuOpen(false)
                                }}
                                className="rounded-lg px-3 py-2.5 text-left text-sm text-slate-400 transition hover:bg-slate-800 hover:text-white"
                            >
                                {link.label}
                            </button>
                        ))}
                    </div>

                    <div className="mt-3 border-t border-slate-800 pt-3">

                        {user ? (
                            <>
                                <div className="mb-2 flex items-center gap-3 px-3 py-2">

                                    <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-blue-600 text-sm font-semibold text-white">
                                        {user?.avatar ? (
                                            <img
                                                src={user.avatar}
                                                alt="User avatar"
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            getUserInitial()
                                        )}
                                    </div>

                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-medium text-white">
                                            {user?.name || 'User'}
                                        </p>

                                        <p className="truncate text-xs text-slate-400">
                                            {user?.email}
                                        </p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => {
                                        setIsMobileMenuOpen(false)
                                        navigate('/profile')
                                    }}
                                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-slate-300 transition hover:bg-slate-800"
                                >
                                    <i className="ri-user-settings-line"></i>
                                    Edit Profile
                                </button>

                                <a
                                    href="https://shaikhaltaf.netlify.app"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-slate-300 transition hover:bg-slate-800"
                                >
                                    <i className="ri-user-line"></i>
                                    Developer Portfolio
                                </a>

                                <button
                                    onClick={logout}
                                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-red-400 transition hover:bg-red-900/30"
                                >
                                    <i className="ri-logout-box-r-line"></i>
                                    Logout
                                </button>
                            </>
                        ) : (
                            <div className="flex flex-col gap-2">

                                <button
                                    onClick={() => {
                                        setIsMobileMenuOpen(false)
                                        navigate('/login')
                                    }}
                                    className="w-full rounded-lg border border-slate-700 px-4 py-2.5 text-sm text-slate-300 transition hover:bg-slate-800"
                                >
                                    Sign in
                                </button>

                                <button
                                    onClick={() => {
                                        setIsMobileMenuOpen(false)
                                        navigate('/register')
                                    }}
                                    className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-500"
                                >
                                    Get started
                                </button>

                            </div>
                        )}
                    </div>

                    {/* Developer Credit */}
                    <div className="mt-4 border-t border-slate-800 pt-3 text-center">
                        <p className="text-xs text-slate-500">
                            Built by{' '}
                            <a
                                href="https://shaikhaltaf.netlify.app"
                                target="_blank"
                                rel="noreferrer"
                                className="font-medium text-slate-300 hover:text-white"
                            >
                                Altaf Shaikh
                            </a>
                        </p>
                    </div>
                </div>
            )}
        </nav>
    )
}

export default Navbar