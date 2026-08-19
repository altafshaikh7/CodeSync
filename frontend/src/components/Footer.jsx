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
        <footer className='bg-slate-900 border-t border-slate-800'>

            {/* Newsletter */}
            <div className='max-w-6xl mx-auto px-6 md:px-10 py-12'>
                <div className='rounded-2xl bg-slate-800 border border-slate-700 overflow-hidden flex flex-col md:flex-row'>

                    {/* Left Section */}
                    <div className='hidden md:block md:w-2/5 bg-gradient-to-br from-blue-900 via-slate-800 to-slate-900 relative overflow-hidden'>

                        <div className='absolute inset-0 flex items-center justify-center'>
                            <div className='text-center px-8'>

                                <div className='w-16 h-16 bg-blue-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-600/30'>
                                    <i className='ri-code-s-slash-line text-blue-400 text-3xl'></i>
                                </div>

                                <p className='text-blue-300 text-sm font-medium'>
                                    Build. Collaborate. Ship.
                                </p>

                                <p className='text-slate-500 text-xs mt-1'>
                                    Collaborate and build amazing projects together
                                </p>

                            </div>
                        </div>

                        <div className='absolute -top-10 -left-10 w-40 h-40 rounded-full bg-blue-600/10'></div>
                        <div className='absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-purple-600/10'></div>

                    </div>

                    {/* Newsletter */}
                    <div className='flex-1 p-8 md:p-10 flex flex-col justify-center'>
                        <Newsletter />
                    </div>

                </div>
            </div>

            {/* Footer Links */}
            <div className='max-w-6xl mx-auto px-5 sm:px-6 md:px-10 pb-10'>

                <div className='grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-8 pb-8 md:pb-10 border-b border-slate-800'>

                    {/* Brand */}
                    <div className='col-span-2 md:col-span-1 text-center md:text-left'>

                        <div className='flex items-center justify-center md:justify-start gap-2 mb-4'>

                            <div className='w-8 h-8 rounded-lg flex items-center justify-center'>
                                <img
                                    src='/terminal_favicon.png'
                                    alt='DevRoom logo'
                                    className='w-full h-full object-contain'
                                />
                            </div>

                            <span className='font-bold bg-gradient-to-b from-[#ff7a00] to-[#ffd500] bg-clip-text text-transparent'>
                                DevRoom
                            </span>

                        </div>

                        <p className='text-xs text-slate-500 leading-relaxed mb-4'>
                            A collaborative coding platform where developers can
                            create projects, work together and build faster with
                            AI-powered assistance.
                        </p>

                        {/* Developer */}
                        <p className='text-xs text-slate-400 mb-4'>
                            Developed by{' '}
                            <span className='text-blue-400 font-medium'>
                                Shaikh Altaf Anzar
                            </span>
                        </p>

                        {/* Social Links */}
                        <div className='flex justify-center md:justify-start gap-3'>

                            {socialLinks.map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    target='_blank'
                                    rel='noreferrer'
                                    aria-label={social.label}
                                    className='w-9 h-9 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 flex items-center justify-center text-slate-300 hover:text-white transition-all duration-300 hover:scale-110'
                                >
                                    <i className={`${social.icon} text-base`}></i>
                                </a>
                            ))}

                        </div>

                    </div>

                    {/* Footer Sections */}
                    {footerSections.map((section) => (

                        <div key={section.title}>

                            <p className='text-xs text-slate-400 uppercase tracking-widest font-medium mb-4'>
                                {section.title}
                            </p>

                            <ul className='space-y-2 md:space-y-2.5'>

                                {section.items.map((item) => (

                                    <li key={item.label}>

                                        <button
                                            onClick={item.action}
                                            className='sm:text-sm text-xs text-slate-500 hover:text-white transition cursor-pointer'
                                        >
                                            {item.label}
                                        </button>

                                    </li>

                                ))}

                            </ul>

                        </div>

                    ))}

                </div>

                {/* Bottom */}
                <div className='pt-6 flex flex-col md:flex-row items-center justify-center md:justify-between gap-3 text-center'>

                    <p className='text-xs text-slate-500'>
                        © 2026 DevRoom. All rights reserved.
                    </p>

                    <p className='text-xs text-slate-600'>
                        Built with ❤️ by{' '}
                        <span className='text-slate-300 font-medium'>
                            Shaikh Altaf Anzar
                        </span>
                    </p>

                </div>

            </div>

        </footer>
    )
}

export default Footer