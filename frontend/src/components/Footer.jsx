import { useNavigate, useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'
import Newsletter from './Newsletter'
import { useContext } from 'react'
import { UserContext } from '../context/user.context'

const Footer = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { user } = useContext(UserContext)

    const isHome = location.pathname === '/home'

    const comingSoon = (label) => {
        toast.info(`${label} page coming soon!`)
    }

    const handleFeaturesClick = () => {
        if (isHome) {
            window.__homeRefs?.featuresRef?.current?.scrollIntoView({
                behavior: 'smooth'
            })
        } else {
            navigate('/', {
                state: {
                    scrollTo: 'features-section'
                }
            })
        }
    }

    const handleAboutClick = () => {
        if (isHome) {
            window.__homeRefs?.aboutRef?.current?.scrollIntoView({
                behavior: 'smooth'
            })
        } else {
            navigate('/', {
                state: {
                    scrollTo: 'about-section'
                }
            })
        }
    }

    const handleDashboardClick = () => {
        if (isHome) {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            })
        } else {
            navigate('/home')
        }
    }

    const handleProjectsClick = () => {
        if (isHome) {
            window.__homeRefs?.projectsRef?.current?.scrollIntoView({
                behavior: 'smooth'
            })
        } else {
            navigate('/home')

            setTimeout(() => {
                window.__homeRefs?.projectsRef?.current?.scrollIntoView({
                    behavior: 'smooth'
                })
            }, 300)
        }
    }

    const footerSections = [
        {
            title: 'Product',
            items: user
                ? [
                    {
                        label: 'Dashboard',
                        action: handleDashboardClick
                    },
                    {
                        label: 'Projects',
                        action: handleProjectsClick
                    },
                    {
                        label: 'Features',
                        action: handleFeaturesClick
                    },
                    {
                        label: 'Pricing',
                        action: () => comingSoon('Pricing')
                    }
                ]
                : [
                    {
                        label: 'Home',
                        action: () =>
                            window.scrollTo({
                                top: 0,
                                behavior: 'smooth'
                            })
                    },
                    {
                        label: 'Features',
                        action: handleFeaturesClick
                    },
                    {
                        label: 'Pricing',
                        action: () => comingSoon('Pricing')
                    }
                ]
        },

        {
            title: 'Company',
            items: [
                {
                    label: 'About',
                    action: handleAboutClick
                },
                {
                    label: 'Blog',
                    action: () => comingSoon('Blog')
                },
                {
                    label: 'Careers',
                    action: () => comingSoon('Careers')
                },
                {
                    label: 'Press',
                    action: () => comingSoon('Press')
                }
            ]
        },

        {
            title: 'Support',
            items: [
                {
                    label: 'Documentation',
                    action: () =>
                        window.open(
                            'https://github.com/altafshaikh7',
                            '_blank'
                        )
                },
                {
                    label: 'Contact',
                    action: () => {
                        const email = 'altafshaikh7781@gmail.com'

                        window.open(
                            `https://mail.google.com/mail/?view=cm&fs=1&to=${email}`,
                            '_blank'
                        )

                        navigator.clipboard
                            ?.writeText(email)
                            .then(() => {
                                toast.success(`Email copied: ${email}`)
                            })
                            .catch(() => {})
                    }
                },
                {
                    label: 'FAQ',
                    action: () => comingSoon('FAQ')
                },
                {
                    label: 'Chat',
                    action: () => comingSoon('Chat')
                }
            ]
        },

        {
            title: 'Legal',
            items: [
                {
                    label: 'Terms of Service',
                    action: () => navigate('/terms')
                },
                {
                    label: 'Privacy Policy',
                    action: () => navigate('/privacy')
                },
                {
                    label: 'Cookie Settings',
                    action: () => comingSoon('Cookie Settings')
                }
            ]
        }
    ]

    const socialLinks = [
        {
            icon: 'ri-github-line',
            href: 'https://github.com/altafshaikh7',
            label: 'GitHub'
        },
        {
            icon: 'ri-linkedin-line',
            href: 'https://www.linkedin.com/in/altafshaikh7781/',
            label: 'LinkedIn'
        },
        {
            icon: 'ri-instagram-line',
            href: 'https://www.instagram.com/',
            label: 'Instagram'
        }
    ]

    return (
        <footer className='relative overflow-hidden border-t border-slate-800/80 bg-[#0a0a0f]'>
            {/* Background effects */}
            <div className='pointer-events-none absolute inset-0'>
                <div className='absolute top-0 left-1/2 -translate-x-1/2 h-px w-3/4 bg-gradient-to-r from-transparent via-blue-500/30 to-transparent'></div>
                <div className='absolute -top-40 left-1/2 -translate-x-1/2 h-80 w-[600px] rounded-full bg-blue-500/[0.03] blur-[100px]'></div>
            </div>

            {/* Newsletter */}
            <div className='relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8'>
                <div className='overflow-hidden rounded-3xl border border-slate-700/60 bg-slate-900/50 backdrop-blur-xl transition-all duration-500 hover:border-slate-600/80 hover:shadow-2xl hover:shadow-blue-500/10'>
                    <div className='flex flex-col md:flex-row'>
                        {/* Left Section */}
                        <div className='relative hidden overflow-hidden md:block md:w-2/5'>
                            <div className='absolute inset-0 bg-gradient-to-br from-blue-500/10 via-slate-900/50 to-purple-500/10'></div>
                            
                            {/* Decorative elements */}
                            <div className='absolute -top-16 -left-16 h-48 w-48 rounded-full bg-blue-500/10 blur-3xl'></div>
                            <div className='absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-cyan-500/10 blur-3xl'></div>
                            
                            <div className='relative flex h-full items-center justify-center p-10'>
                                <div className='text-center'>
                                    <div className='group mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-blue-500/30 bg-blue-500/10 transition-all duration-500 hover:scale-110 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/20'>
                                        <i className='ri-code-s-slash-line text-4xl text-blue-400 transition-transform duration-500 group-hover:rotate-6'></i>
                                    </div>

                                    <p className='mb-2 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-lg font-bold text-transparent'>
                                        Build. Collaborate. Ship.
                                    </p>

                                    <p className='text-sm text-slate-500'>
                                        Collaborate and build amazing projects together
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Newsletter */}
                        <div className='flex flex-1 flex-col justify-center p-8 md:p-12'>
                            <Newsletter />
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Links */}
            <div className='relative mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8'>
                <div className='grid grid-cols-2 gap-8 border-b border-slate-800/80 pb-10 md:grid-cols-5 md:gap-6 lg:gap-8'>
                    {/* Brand */}
                    <div className='col-span-2 text-center md:col-span-1 md:text-left'>
                        <div className='mb-5 flex items-center justify-center gap-3 md:justify-start'>
                            <div className='group flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 ring-1 ring-blue-500/30 transition-all duration-500 hover:scale-110 hover:ring-blue-500/60 hover:shadow-lg hover:shadow-blue-500/20'>
                                <img
                                    src='/terminal_favicon.png'
                                    alt='CodeSync logo'
                                    className='h-7 w-7 object-contain transition-transform duration-500 group-hover:rotate-6'
                                />
                            </div>

                            <div className='flex flex-col leading-tight'>
                                <span className='bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-lg font-bold text-transparent'>
                                    CodeSync
                                </span>
                                <span className='text-[10px] text-slate-500'>
                                    Code together. Build together.
                                </span>
                            </div>
                        </div>

                        <p className='mb-6 text-xs leading-relaxed text-slate-500'>
                            A collaborative coding platform where developers can
                            create projects, work together and build faster with
                            AI-powered assistance.
                        </p>

                        {/* Social Links */}
                        <div className='flex justify-center gap-3 md:justify-start'>
                            {socialLinks.map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    target='_blank'
                                    rel='noreferrer'
                                    aria-label={social.label}
                                    className='group relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-slate-700/80 bg-slate-900/80 text-slate-400 transition-all duration-300 hover:scale-110 hover:border-blue-500/50 hover:text-white hover:shadow-lg hover:shadow-blue-500/20'
                                >
                                    <i className={`${social.icon} text-base transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6`}></i>
                                    
                                    {/* Shine effect */}
                                    <div className='absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full'></div>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Footer Sections */}
                    {footerSections.map((section) => (
                        <div key={section.title}>
                            <p className='mb-5 text-xs font-semibold uppercase tracking-widest text-slate-400'>
                                {section.title}
                            </p>

                            <ul className='space-y-3'>
                                {section.items.map((item) => (
                                    <li key={item.label}>
                                        <button
                                            onClick={item.action}
                                            className='group relative cursor-pointer text-sm text-slate-500 transition-all duration-300 hover:text-white'
                                        >
                                            <span className='inline-block transition-transform duration-300 group-hover:translate-x-1'>
                                                {item.label}
                                            </span>
                                            
                                            {/* Animated underline */}
                                            <span className='absolute -bottom-0.5 left-0 h-px w-0 bg-gradient-to-r from-blue-400 to-cyan-400 transition-all duration-300 group-hover:w-full'></span>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom */}
                <div className='flex flex-col items-center justify-center gap-3 pt-8 text-center md:flex-row md:justify-between'>
                    <div className='flex items-center gap-2'>
                        <i className='ri-code-s-slash-line text-blue-400'></i>
                        <p className='text-xs text-slate-500'>
                            © 2026 CodeSync. Built with ❤️ by{' '}
                            <a
                                href='https://shaikhaltaf.netlify.app'
                                target='_blank'
                                rel='noreferrer'
                                className='font-medium text-slate-300 transition-all duration-300 hover:text-blue-400'
                            >
                                Shaikh Altaf Anzar
                            </a>
                        </p>
                    </div>

                    <div className='flex items-center gap-4'>
                        <span className='inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-[10px] font-medium text-emerald-400'>
                            <span className='h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400'></span>
                            All systems operational
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer