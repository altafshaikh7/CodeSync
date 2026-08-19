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
    const [isScrolled, setIsScrolled] = useState(false)
    const [activeLink, setActiveLink] = useState('')
    const [hoveredLink, setHoveredLink] = useState('')

    const profileRef = useRef(null)
    const notifRef = useRef(null)
    const navRef = useRef(null)

    const { pendingInvites, respondInvite } = useContext(NotificationContext)

    // Scroll effect for navbar background
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20)
        }

        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

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
        setIsProfileOpen(false)
        setIsNotifOpen(false)
    }, [location.pathname])

    // Set active link based on current path
    useEffect(() => {
        const path = location.pathname
        if (path === '/home' || path === '/') {
            setActiveLink('Home')
        } else if (path.includes('project')) {
            setActiveLink('Projects')
        } else if (path.includes('profile')) {
            setActiveLink('Profile')
        } else {
            setActiveLink('')
        }
    }, [location.pathname])

    function handleNavClick(section) {
        if (location.pathname !== '/home') {
            navigate('/home')

            setTimeout(() => {
                const refs = window.__homeRefs

                if (refs?.[section + 'Ref']?.current) {
                    refs[section + 'Ref'].current.scrollIntoView({
                        behavior: 'smooth'
                    })
                }
            }, 300)
        } else {
            const refs = window.__homeRefs

            if (refs?.[section + 'Ref']?.current) {
                refs[section + 'Ref'].current.scrollIntoView({
                    behavior: 'smooth'
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
                            behavior: 'smooth'
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
                            behavior: 'smooth'
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
        <>
            <nav
                ref={navRef}
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
                    isScrolled
                        ? 'bg-[#0a0a0f]/95 shadow-lg shadow-black/20 backdrop-blur-xl border-b border-slate-800/80'
                        : 'bg-transparent border-b border-transparent'
                }`}
            >
                <div className='mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8'>
                    
                    {/* Logo with premium hover animations */}
                    <div
                        className='group flex cursor-pointer items-center gap-2.5'
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
                        <div className='relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 ring-1 ring-blue-500/30 transition-all duration-500 ease-out group-hover:scale-110 group-hover:rotate-3 group-hover:ring-blue-500/60 group-hover:shadow-xl group-hover:shadow-blue-500/30'>
                            <img
                                src='/terminal_favicon.png'
                                alt='CodeSync logo'
                                className='h-7 w-7 object-contain transition-all duration-500 ease-out group-hover:scale-110 group-hover:-rotate-3'
                            />
                            
                            {/* Multi-layer shine effects */}
                            <div className='absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-1000 ease-out group-hover:translate-x-full'></div>
                            
                            {/* Glow pulse */}
                            <div className='absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500'>
                                <div className='absolute inset-0 rounded-xl bg-blue-500/20 blur-xl animate-pulse'></div>
                            </div>
                        </div>

                        <div className='flex flex-col leading-tight'>
                            <span className='relative bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-lg font-bold text-transparent transition-all duration-500 ease-out group-hover:tracking-wider group-hover:from-blue-300 group-hover:via-cyan-300 group-hover:to-blue-300'>
                                CodeSync
                                
                                {/* Animated underline */}
                                <span className='absolute -bottom-1 left-0 h-0.5 w-0 bg-gradient-to-r from-blue-400 to-cyan-400 transition-all duration-500 ease-out group-hover:w-full'></span>
                            </span>
                        </div>
                    </div>

                    {/* Desktop Navigation with premium hover effects */}
                    <div className='hidden items-center gap-1 md:flex'>
                        {links.map((link) => (
                            <button
                                key={link.label}
                                onClick={link.action}
                                onMouseEnter={() => setHoveredLink(link.label)}
                                onMouseLeave={() => setHoveredLink('')}
                                className={`group relative cursor-pointer rounded-lg px-4 py-2 text-sm font-medium transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${
                                    activeLink === link.label
                                        ? 'text-white'
                                        : 'text-slate-400 hover:text-white'
                                }`}
                            >
                                <span className={`relative z-10 transition-transform duration-300 ease-out group-hover:-translate-y-0.5 inline-block`}>
                                    {link.label}
                                </span>
                                
                                {/* Multi-layer hover effects */}
                                <span className={`absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/0 via-blue-500/10 to-cyan-500/0 opacity-0 transition-all duration-500 ease-out group-hover:opacity-100 group-hover:scale-105 ${
                                    activeLink === link.label ? 'opacity-100 scale-105' : ''
                                }`}></span>
                                
                                {/* Animated underline with gradient */}
                                <span className={`absolute bottom-0 left-1/2 h-[2px] -translate-x-1/2 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 transition-all duration-500 ease-out ${
                                    activeLink === link.label || hoveredLink === link.label
                                        ? 'w-full shadow-lg shadow-blue-500/50'
                                        : 'w-0 group-hover:w-full'
                                }`}></span>
                                
                                {/* Glow effect on hover */}
                                <span className={`absolute -bottom-1 left-1/2 h-4 w-4 -translate-x-1/2 rounded-full bg-blue-500/0 blur-md transition-all duration-500 ease-out group-hover:bg-blue-500/30 ${
                                    activeLink === link.label ? 'bg-blue-500/30' : ''
                                }`}></span>
                            </button>
                        ))}
                    </div>

                    {/* Right Side */}
                    <div className='flex items-center gap-2 sm:gap-3'>
                        {/* Notifications */}
                        {user && (
                            <div
                                ref={notifRef}
                                className='relative'
                            >
                                <button
                                    onClick={() =>
                                        setIsNotifOpen(!isNotifOpen)
                                    }
                                    className={`group relative cursor-pointer rounded-lg p-2.5 transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-blue-500/50 hover:scale-110 ${
                                        isNotifOpen
                                            ? 'bg-slate-800 text-white scale-110'
                                            : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
                                    }`}
                                    aria-label="Notifications"
                                >
                                    <i className={`ri-notification-3-line text-lg transition-transform duration-300 ease-out group-hover:rotate-12 group-hover:scale-110`}></i>

                                    {pendingInvites.length > 0 && (
                                        <span className='absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-lg shadow-red-500/30 ring-2 ring-[#0a0a0f] animate-bounce'>
                                            {pendingInvites.length > 9
                                                ? '9+'
                                                : pendingInvites.length}
                                        </span>
                                    )}
                                </button>

                                {isNotifOpen && (
                                    <div className='fixed left-4 right-4 top-20 z-50 overflow-hidden rounded-2xl border border-slate-700/80 bg-slate-900/95 shadow-2xl shadow-black/50 backdrop-blur-xl animate-slide-down sm:absolute sm:left-auto sm:right-0 sm:top-full sm:mt-2 sm:w-96'>
                                        <div className='flex items-center justify-between border-b border-slate-800 px-5 py-4'>
                                            <div>
                                                <p className='text-sm font-semibold text-white'>
                                                    Notifications
                                                </p>
                                                {pendingInvites.length > 0 && (
                                                    <p className='mt-0.5 text-xs text-slate-500'>
                                                        {pendingInvites.length} pending invite{pendingInvites.length !== 1 ? 's' : ''}
                                                    </p>
                                                )}
                                            </div>
                                            
                                            {pendingInvites.length > 0 && (
                                                <span className='rounded-full bg-blue-500/10 px-2.5 py-1 text-[10px] font-medium text-blue-400 animate-pulse'>
                                                    New
                                                </span>
                                            )}
                                        </div>

                                        <div className='custom-scroll max-h-96 overflow-y-auto'>
                                            {pendingInvites.length === 0 ? (
                                                <div className='py-12 text-center animate-fade-in'>
                                                    <div className='mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-800'>
                                                        <i className='ri-checkbox-circle-line text-xl text-slate-500'></i>
                                                    </div>
                                                    <p className='text-sm font-medium text-slate-400'>
                                                        All caught up!
                                                    </p>
                                                    <p className='mt-1 text-xs text-slate-500'>
                                                        No new notifications
                                                    </p>
                                                </div>
                                            ) : (
                                                pendingInvites.map((inv, index) => (
                                                    <div
                                                        key={inv.projectId}
                                                        className='group border-b border-slate-800/50 px-5 py-4 transition-all duration-500 ease-out hover:bg-slate-800/50 hover:translate-x-1 last:border-b-0 animate-slide-in'
                                                        style={{ animationDelay: `${index * 50}ms` }}
                                                    >
                                                        <div className='flex items-start gap-3'>
                                                            <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-500/10 transition-all duration-500 ease-out group-hover:scale-110 group-hover:rotate-6 group-hover:bg-blue-500/20'>
                                                                <i className='ri-mail-line text-blue-400'></i>
                                                            </div>
                                                            
                                                            <div className='min-w-0 flex-1'>
                                                                <p className='text-sm text-slate-200'>
                                                                    <span className='font-semibold text-white'>
                                                                        {inv.invitedBy?.name ||
                                                                            inv.invitedBy?.email}
                                                                    </span>{' '}
                                                                    invited you to{' '}
                                                                    <span className='font-semibold text-white'>
                                                                        {inv.projectName}
                                                                    </span>
                                                                </p>

                                                                <p className='mt-1 text-xs text-slate-500'>
                                                                    {inv.invitedBy?.email}
                                                                </p>

                                                                <div className='mt-3 flex items-center gap-2'>
                                                                    <button
                                                                        onClick={() =>
                                                                            handleRespond(
                                                                                inv.projectId,
                                                                                'reject'
                                                                            )
                                                                        }
                                                                        className='group/btn relative overflow-hidden rounded-lg border border-slate-700 px-3.5 py-1.5 text-xs font-medium text-slate-400 transition-all duration-300 ease-out hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-400 hover:scale-105 hover:shadow-lg hover:shadow-red-500/20 focus:outline-none focus:ring-2 focus:ring-red-500/50'
                                                                    >
                                                                        <span className='relative z-10'>Decline</span>
                                                                        <div className='absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-red-500/20 to-transparent transition-transform duration-700 ease-out group-hover/btn:translate-x-full'></div>
                                                                    </button>

                                                                    <button
                                                                        onClick={() =>
                                                                            handleRespond(
                                                                                inv.projectId,
                                                                                'accept'
                                                                            )
                                                                        }
                                                                        className='group/btn relative overflow-hidden rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-lg shadow-blue-600/20 transition-all duration-300 ease-out hover:scale-105 hover:bg-blue-500 hover:shadow-xl hover:shadow-blue-500/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50'
                                                                    >
                                                                        <span className='relative z-10'>Accept</span>
                                                                        <div className='absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 ease-out group-hover/btn:translate-x-full'></div>
                                                                    </button>
                                                                </div>
                                                            </div>
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
                        <div className='hidden items-center gap-2 md:flex'>
                            {user ? (
                                <div
                                    ref={profileRef}
                                    className='relative'
                                >
                                    <button
                                        onClick={() =>
                                            setIsProfileOpen(!isProfileOpen)
                                        }
                                        className={`group flex cursor-pointer items-center gap-2.5 rounded-xl border px-3 py-2 transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-blue-500/50 hover:scale-105 ${
                                            isProfileOpen
                                                ? 'border-slate-600 bg-slate-800 scale-105'
                                                : 'border-slate-700/80 bg-slate-900/80 hover:border-slate-600 hover:bg-slate-800 hover:shadow-lg hover:shadow-blue-500/10'
                                        }`}
                                    >
                                        <div className='relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 text-xs font-semibold text-white shadow-lg shadow-blue-500/20 transition-all duration-500 ease-out group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-xl group-hover:shadow-blue-500/40'>
                                            {user?.avatar ? (
                                                <img
                                                    src={user.avatar}
                                                    alt='User avatar'
                                                    className='h-full w-full object-cover'
                                                />
                                            ) : (
                                                getUserInitial()
                                            )}
                                            
                                            {/* Online dot with ping */}
                                            <span className='absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-slate-900'>
                                                <span className='absolute inset-0 rounded-full bg-emerald-400 animate-ping'></span>
                                            </span>
                                        </div>

                                        <span className='max-w-28 truncate text-sm font-medium text-slate-300 transition-all duration-300 ease-out group-hover:text-white group-hover:tracking-wide'>
                                            {user?.name || user?.email}
                                        </span>

                                        <i
                                            className={`ri-arrow-down-s-line text-sm text-slate-400 transition-all duration-500 ease-out group-hover:text-white ${
                                                isProfileOpen
                                                    ? 'rotate-180 scale-110'
                                                    : 'group-hover:translate-y-0.5'
                                            }`}
                                        ></i>
                                    </button>

                                    {isProfileOpen && (
                                        <div className='absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-2xl border border-slate-700/80 bg-slate-900/95 shadow-2xl shadow-black/50 backdrop-blur-xl animate-slide-down'>
                                            <div className='border-b border-slate-800 px-5 py-4'>
                                                <div className='mb-3 flex items-center gap-3'>
                                                    <div className='relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 text-sm font-semibold text-white shadow-lg shadow-blue-500/20'>
                                                        {user?.avatar ? (
                                                            <img
                                                                src={user.avatar}
                                                                alt='User avatar'
                                                                className='h-full w-full object-cover'
                                                            />
                                                        ) : (
                                                            getUserInitial()
                                                        )}
                                                        
                                                        <span className='absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-400 ring-2 ring-slate-900'>
                                                            <span className='absolute inset-0 rounded-full bg-emerald-400 animate-ping'></span>
                                                        </span>
                                                    </div>
                                                    
                                                    <div className='min-w-0'>
                                                        <p className='truncate text-sm font-semibold text-white'>
                                                            {user?.name || 'User'}
                                                        </p>
                                                        <p className='truncate text-xs text-slate-400'>
                                                            {user?.email}
                                                        </p>
                                                    </div>
                                                </div>
                                                
                                                <span className='inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-medium text-emerald-400'>
                                                    <span className='h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400'></span>
                                                    Online
                                                </span>
                                            </div>

                                            <div className='py-2'>
                                                <button
                                                    onClick={() => {
                                                        setIsProfileOpen(false)
                                                        navigate('/profile')
                                                    }}
                                                    className='group flex w-full cursor-pointer items-center gap-3 px-5 py-2.5 text-sm text-slate-300 transition-all duration-300 ease-out hover:bg-slate-800/80 hover:text-white hover:translate-x-2 hover:shadow-lg hover:shadow-blue-500/10'
                                                >
                                                    <i className='ri-user-settings-line text-base transition-all duration-300 ease-out group-hover:scale-110 group-hover:rotate-12'></i>
                                                    Edit Profile
                                                </button>

                                                <a
                                                    href='https://shaikhaltaf.netlify.app'
                                                    target='_blank'
                                                    rel='noreferrer'
                                                    className='group flex w-full items-center gap-3 px-5 py-2.5 text-sm text-slate-300 transition-all duration-300 ease-out hover:bg-slate-800/80 hover:text-white hover:translate-x-2 hover:shadow-lg hover:shadow-blue-500/10'
                                                >
                                                    <i className='ri-external-link-line text-base transition-all duration-300 ease-out group-hover:scale-110 group-hover:rotate-12'></i>
                                                    Developer Portfolio
                                                </a>

                                                <div className='my-2 border-t border-slate-800'></div>

                                                <button
                                                    onClick={logout}
                                                    className='group flex w-full cursor-pointer items-center gap-3 px-5 py-2.5 text-sm text-red-400 transition-all duration-300 ease-out hover:bg-red-500/10 hover:translate-x-2 hover:shadow-lg hover:shadow-red-500/20'
                                                >
                                                    <i className='ri-logout-box-r-line text-base transition-all duration-300 ease-out group-hover:scale-110 group-hover:rotate-12'></i>
                                                    Logout
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <>
                                    <button
                                        onClick={() => navigate('/login')}
                                        className="group relative cursor-pointer rounded-lg px-4 py-2 text-sm font-medium text-slate-400 transition-all duration-300 ease-out hover:text-white focus:outline-none focus:ring-2 focus:ring-slate-500/50"
                                    >
                                        <span className="relative z-10 inline-block transition-transform duration-300 ease-out group-hover:-translate-y-0.5">Sign in</span>
                                        <span className="absolute bottom-0 left-1/2 h-0.5 w-0 -translate-x-1/2 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 transition-all duration-500 ease-out group-hover:w-full group-hover:shadow-lg group-hover:shadow-blue-500/50"></span>
                                    </button>

                                    <button
                                        onClick={() => navigate('/register')}
                                        className="group relative cursor-pointer overflow-hidden rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition-all duration-300 ease-out hover:scale-105 hover:bg-blue-500 hover:shadow-xl hover:shadow-blue-500/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                    >
                                        <span className="relative z-10 inline-flex items-center gap-1.5">
                                            Get started
                                            <i className="ri-arrow-right-line text-sm transition-transform duration-300 ease-out group-hover:translate-x-1"></i>
                                        </span>
                                        
                                        {/* Multi-layer shine effects */}
                                        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-1000 ease-out group-hover:translate-x-full"></div>
                                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                            <div className="absolute inset-0 rounded-xl bg-blue-400/20 blur-lg"></div>
                                        </div>
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() =>
                                setIsMobileMenuOpen(!isMobileMenuOpen)
                            }
                            className="group cursor-pointer rounded-lg p-2.5 text-slate-400 transition-all duration-300 ease-out hover:bg-slate-800/80 hover:text-white hover:scale-110 hover:rotate-180 focus:outline-none focus:ring-2 focus:ring-blue-500/50 md:hidden"
                            aria-label='Toggle menu'
                        >
                            <i
                                className={`text-xl transition-all duration-500 ease-out ${
                                    isMobileMenuOpen
                                        ? 'ri-close-line rotate-180 scale-110'
                                        : 'ri-menu-line group-hover:scale-110'
                                }`}
                            ></i>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu with slide animation */}
                {isMobileMenuOpen && (
                    <div className='border-t border-slate-800 bg-[#0a0a0f] px-4 pb-6 pt-2 animate-slide-down md:hidden'>
                        {/* Navigation Links */}
                        <div className='flex flex-col gap-1'>
                            {links.map((link, index) => (
                                <button
                                    key={link.label}
                                    onClick={() => {
                                        link.action()
                                        setIsMobileMenuOpen(false)
                                    }}
                                    className={`group relative overflow-hidden rounded-xl px-4 py-3 text-left text-sm font-medium text-slate-400 transition-all duration-500 ease-out hover:bg-slate-800/80 hover:text-white hover:translate-x-3 hover:shadow-lg hover:shadow-blue-500/10 animate-slide-in ${
                                        activeLink === link.label ? 'text-white bg-slate-800/50' : ''
                                    }`}
                                    style={{ animationDelay: `${index * 50}ms` }}
                                >
                                    <span className='relative z-10 inline-block transition-all duration-300 ease-out group-hover:scale-105'>
                                        {link.label}
                                    </span>
                                    
                                    {/* Hover gradient */}
                                    <div className='absolute inset-0 bg-gradient-to-r from-blue-500/10 via-transparent to-transparent opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100'></div>
                                    
                                    {/* Shine effect */}
                                    <div className='absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 ease-out group-hover:translate-x-full'></div>
                                </button>
                            ))}
                        </div>

                        <div className='mt-4 border-t border-slate-800 pt-4'>
                            {user ? (
                                <>
                                    <div className='mb-3 flex items-center gap-3 rounded-xl bg-slate-900/80 px-4 py-3 animate-fade-in'>
                                        <div className='relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 text-sm font-semibold text-white shadow-lg shadow-blue-500/20'>
                                            {user?.avatar ? (
                                                <img
                                                    src={user.avatar}
                                                    alt='User avatar'
                                                    className='h-full w-full object-cover'
                                                />
                                            ) : (
                                                getUserInitial()
                                            )}
                                            
                                            <span className='absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-400 ring-2 ring-slate-900'>
                                                <span className='absolute inset-0 rounded-full bg-emerald-400 animate-ping'></span>
                                            </span>
                                        </div>

                                        <div className='min-w-0'>
                                            <p className='truncate text-sm font-semibold text-white'>
                                                {user?.name || 'User'}
                                            </p>
                                            <p className='truncate text-xs text-slate-400'>
                                                {user?.email}
                                            </p>
                                        </div>
                                        
                                        <span className='ml-auto inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2 py-1 text-[10px] font-medium text-emerald-400'>
                                            <span className='h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400'></span>
                                            Online
                                        </span>
                                    </div>

                                    <button
                                        onClick={() => {
                                            setIsMobileMenuOpen(false)
                                            navigate('/profile')
                                        }}
                                        className='group flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-300 transition-all duration-500 ease-out hover:bg-slate-800/80 hover:translate-x-3 hover:shadow-lg hover:shadow-blue-500/10'
                                    >
                                        <i className='ri-user-settings-line text-base transition-all duration-300 ease-out group-hover:scale-110 group-hover:rotate-12'></i>
                                        Edit Profile
                                    </button>

                                    <a
                                        href='https://shaikhaltaf.netlify.app'
                                        target='_blank'
                                        rel='noreferrer'
                                        className='group flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-300 transition-all duration-500 ease-out hover:bg-slate-800/80 hover:translate-x-3 hover:shadow-lg hover:shadow-blue-500/10'
                                    >
                                        <i className='ri-external-link-line text-base transition-all duration-300 ease-out group-hover:scale-110 group-hover:rotate-12'></i>
                                        Developer Portfolio
                                    </a>

                                    <button
                                        onClick={logout}
                                        className='group mt-1 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-red-400 transition-all duration-500 ease-out hover:bg-red-500/10 hover:translate-x-3 hover:shadow-lg hover:shadow-red-500/20'
                                    >
                                        <i className='ri-logout-box-r-line text-base transition-all duration-300 ease-out group-hover:scale-110 group-hover:rotate-12'></i>
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <div className='flex flex-col gap-2'>
                                    <button
                                        onClick={() => {
                                            setIsMobileMenuOpen(false)
                                            navigate('/login')
                                        }}
                                        className='w-full rounded-xl border border-slate-700 px-4 py-3 text-sm font-medium text-slate-300 transition-all duration-500 ease-out hover:bg-slate-800 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/10 animate-fade-in'
                                    >
                                        Sign in
                                    </button>

                                    <button
                                        onClick={() => {
                                            setIsMobileMenuOpen(false)
                                            navigate('/register')
                                        }}
                                        className='group relative w-full overflow-hidden rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition-all duration-500 ease-out hover:bg-blue-500 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/40 animate-fade-in'
                                        style={{ animationDelay: '100ms' }}
                                    >
                                        <span className='relative z-10'>Get started</span>
                                        
                                        {/* Shine effect */}
                                        <div className='absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-1000 ease-out group-hover:translate-x-full'></div>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </nav>

            {/* Add keyframe animations */}
            <style jsx>{`
                @keyframes slideDown {
                    from {
                        opacity: 0;
                        transform: translateY(-15px) scale(0.98);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }
                
                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateX(-30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
                
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
                
                .animate-slide-down {
                    animation: slideDown 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                }
                
                .animate-slide-in {
                    animation: slideIn 0.5s cubic-bezier(0.16, 1, 0.3, 1);
                }
                
                .animate-fade-in {
                    animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                }
            `}</style>
        </>
    )
}

export default Navbar