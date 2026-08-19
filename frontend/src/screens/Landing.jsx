import { useNavigate, useLocation } from 'react-router-dom'
import { useContext, useRef, useEffect } from 'react'
import { UserContext } from '../context/user.context'

const Landing = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const featuresRef = useRef(null)
    const { user } = useContext(UserContext)

    // Redirect logged-in users to home
    useEffect(() => {
        const token = localStorage.getItem('token')

        if (token && user) {
            navigate('/home', { replace: true })
        }
    }, [user, navigate])

    // Scroll to section when navigating from Navbar
    useEffect(() => {
        if (location.state?.scrollTo) {
            const element = document.getElementById(location.state.scrollTo)

            setTimeout(() => {
                element?.scrollIntoView({
                    behavior: 'smooth'
                })
            }, 100)
        }
    }, [location.state])

    const features = [
        {
            icon: 'ri-robot-2-line',
            color: 'text-blue-400',
            bg: 'bg-blue-900/30 border-blue-800/40',
            title: 'AI-Powered Coding',
            desc: 'Ask Gemini to generate full file trees, write boilerplate, or debug your code — all from the chat panel.'
        },
        {
            icon: 'ri-team-line',
            color: 'text-green-400',
            bg: 'bg-green-900/30 border-green-800/40',
            title: 'Real-time Collaboration',
            desc: 'Invite teammates, edit code together, and see changes live with Socket.io-powered sync.'
        },
        {
            icon: 'ri-terminal-box-line',
            color: 'text-amber-400',
            bg: 'bg-amber-900/30 border-amber-800/40',
            title: 'In-Browser Terminal',
            desc: 'Run Node.js projects right in your browser with WebContainers — no setup, no installs.'
        },
        {
            icon: 'ri-folders-line',
            color: 'text-purple-400',
            bg: 'bg-purple-900/30 border-purple-800/40',
            title: 'Smart File Management',
            desc: 'Organize your project with a full file tree. Create, rename, and delete files without leaving the editor.'
        },
        {
            icon: 'ri-message-3-line',
            color: 'text-pink-400',
            bg: 'bg-pink-900/30 border-pink-800/40',
            title: 'Persistent Chat',
            desc: 'Project chat history is saved — pick up conversations where you left off, even days later.'
        },
        {
            icon: 'ri-shield-keyhole-line',
            color: 'text-cyan-400',
            bg: 'bg-cyan-900/30 border-cyan-800/40',
            title: 'Secure Authentication',
            desc: 'Secure authentication and account protection help keep your projects and collaboration safe.'
        }
    ]

    const steps = [
        {
            number: '01',
            title: 'Create an account',
            desc: 'Sign up with your email and get started with DevRoom.'
        },
        {
            number: '02',
            title: 'Start a project',
            desc: 'Create a new project and invite your collaborators.'
        },
        {
            number: '03',
            title: 'Code with AI',
            desc: 'Use Gemini AI to scaffold, debug, and ship faster.'
        }
    ]

    const dashboardStats = [
        {
            label: 'Total Projects',
            value: '6',
            color: 'text-blue-400'
        },
        {
            label: 'Collaborators',
            value: '12',
            color: 'text-green-400'
        },
        {
            label: 'AI Chats',
            value: '34',
            color: 'text-amber-400'
        },
        {
            label: 'Last Active',
            value: '2h ago',
            color: 'text-purple-400'
        }
    ]

    const recentProjects = [
        'auth-service',
        'landing-page',
        'api-gateway'
    ]

    const techStack = [
        'React',
        'Node.js',
        'Express.js',
        'Socket.io',
        'MongoDB',
        'Gemini AI',
        'WebContainers'
    ]

    const benefits = [
        {
            number: '01',
            title: 'AI Pair Programming',
            desc: 'Gemini helps write, explain, and debug code with you in real time.'
        },
        {
            number: '02',
            title: 'Live Collaboration',
            desc: 'Multiple developers can work together and communicate instantly.'
        },
        {
            number: '03',
            title: 'Zero Setup',
            desc: 'Run supported Node.js projects directly in your browser.'
        },
        {
            number: '04',
            title: 'Persistent History',
            desc: 'Files and project conversations are saved so you can continue anytime.'
        }
    ]

    return (
        <div className='min-h-screen bg-slate-900 font-sans text-white'>

            {/* ================= HERO SECTION ================= */}
            <section
                id='home'
                className='mx-auto max-w-4xl px-6 pb-20 pt-24 text-center md:px-16'
            >
                <div className='mb-8 inline-flex items-center gap-2 rounded-full border border-blue-800/50 bg-blue-900/40 px-3 py-1.5 text-xs font-medium text-blue-400'>
                    <i className='ri-sparkling-line'></i>
                    Powered by Google Gemini AI
                </div>

                <h1 className='mb-6 text-4xl font-bold leading-tight tracking-tight md:text-6xl'>
                    Code together,{' '}
                    <span className='text-blue-400'>
                        ship faster
                    </span>
                    <br />
                    with AI by your side
                </h1>

                <p className='mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-slate-400 md:text-xl'>
                    DevRoom is a collaborative coding platform where your
                    team and Gemini AI work in the same room — with a
                    real-time editor, in-browser terminal, and persistent
                    project chat.
                </p>

                <div className='flex flex-col items-center justify-center gap-4 sm:flex-row'>
                    <button
                        onClick={() => navigate('/register')}
                        className='flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 py-3.5 text-sm font-semibold transition hover:bg-blue-500 sm:w-auto'
                    >
                        Start for free
                        <i className='ri-arrow-right-line'></i>
                    </button>

                    <button
                        onClick={() =>
                            featuresRef.current?.scrollIntoView({
                                behavior: 'smooth'
                            })
                        }
                        className='w-full cursor-pointer rounded-xl border border-slate-700 px-8 py-3.5 text-sm text-slate-300 transition hover:border-slate-500 hover:text-white sm:w-auto'
                    >
                        See features
                    </button>
                </div>

                <p className='mt-5 text-xs text-slate-500'>
                    No credit card required
                </p>
            </section>

            {/* ================= DASHBOARD PREVIEW ================= */}
            <section className='px-6 pb-24 md:px-16'>
                <div className='mx-auto max-w-5xl overflow-hidden rounded-2xl border border-slate-700 bg-slate-800 shadow-2xl'>

                    {/* Browser Header */}
                    <div className='flex items-center gap-2 border-b border-slate-700 bg-slate-900 px-4 py-3'>
                        <div className='h-3 w-3 rounded-full bg-red-500/70'></div>
                        <div className='h-3 w-3 rounded-full bg-yellow-500/70'></div>
                        <div className='h-3 w-3 rounded-full bg-green-500/70'></div>

                        <div className='mx-4 flex-1 rounded-md bg-slate-800 px-3 py-1 text-center text-xs text-slate-500'>
                            devroom.app
                        </div>
                    </div>

                    {/* Preview Content */}
                    <div className='bg-slate-800 p-6'>

                        {/* Stats */}
                        <div className='mb-4 grid grid-cols-2 gap-3 md:grid-cols-4'>
                            {dashboardStats.map((stat) => (
                                <div
                                    key={stat.label}
                                    className='rounded-xl border border-slate-600 bg-slate-700 p-4'
                                >
                                    <p className='mb-2 text-xs text-slate-400'>
                                        {stat.label}
                                    </p>

                                    <p
                                        className={`text-2xl font-semibold ${stat.color}`}
                                    >
                                        {stat.value}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className='grid grid-cols-1 gap-3 md:grid-cols-2'>

                            {/* Recent Projects */}
                            <div className='rounded-xl border border-slate-600 bg-slate-700 p-4'>
                                <p className='mb-3 text-xs uppercase tracking-widest text-slate-400'>
                                    Recent Projects
                                </p>

                                {recentProjects.map((name, index) => (
                                    <div
                                        key={name}
                                        className='flex items-center gap-3 border-b border-slate-600 py-2 last:border-0'
                                    >
                                        <div className='flex h-7 w-7 items-center justify-center rounded bg-blue-900/50'>
                                            <i className='ri-code-s-slash-line text-xs text-blue-400'></i>
                                        </div>

                                        <span className='text-sm text-slate-300'>
                                            {name}
                                        </span>

                                        <span className='ml-auto text-xs text-slate-500'>
                                            {index + 1}h ago
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* AI Chat */}
                            <div className='rounded-xl border border-slate-600 bg-slate-700 p-4'>
                                <p className='mb-3 text-xs uppercase tracking-widest text-slate-400'>
                                    AI Chat Preview
                                </p>

                                <div className='space-y-2'>
                                    <div className='rounded-lg bg-slate-600 px-3 py-2 text-xs text-slate-300'>
                                        @ai scaffold a REST API with Express
                                        and MongoDB
                                    </div>

                                    <div className='rounded-lg border border-blue-800/40 bg-blue-900/40 px-3 py-2 text-xs text-blue-300'>
                                        ✓ Generated 8 files — routes, models,
                                        controllers, middleware
                                    </div>

                                    <div className='flex items-center gap-2 pt-2 text-xs text-slate-500'>
                                        <i className='ri-sparkling-line text-blue-400'></i>
                                        Gemini AI is ready to help
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ================= FEATURES ================= */}
            <section
                id='features-section'
                ref={featuresRef}
                className='border-t border-slate-800 px-6 py-20 md:px-16'
            >
                <div className='mx-auto max-w-5xl'>

                    <p className='mb-3 text-center text-xs font-medium uppercase tracking-widest text-blue-400'>
                        Features
                    </p>

                    <h2 className='mb-4 text-center text-3xl font-bold md:text-4xl'>
                        Everything your team needs
                    </h2>

                    <p className='mx-auto mb-14 max-w-xl text-center text-slate-400'>
                        Built for developers who move fast and collaborate
                        closely.
                    </p>

                    <div className='grid grid-cols-1 gap-5 md:grid-cols-3'>
                        {features.map((feature) => (
                            <div
                                key={feature.title}
                                className={`rounded-xl border p-6 ${feature.bg}`}
                            >
                                <i
                                    className={`${feature.icon} ${feature.color} mb-4 block text-2xl`}
                                ></i>

                                <h3 className='mb-2 font-semibold'>
                                    {feature.title}
                                </h3>

                                <p className='text-sm leading-relaxed text-slate-400'>
                                    {feature.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ================= ABOUT ================= */}
            <section
                id='about-section'
                className='border-t border-slate-800 px-6 py-20 md:px-16'
            >
                <div className='mx-auto max-w-5xl'>

                    <div className='grid grid-cols-1 items-center gap-10 md:grid-cols-2'>

                        {/* About Text */}
                        <div>
                            <p className='mb-3 text-xs font-medium uppercase tracking-widest text-blue-400'>
                                About DevRoom
                            </p>

                            <h2 className='mb-4 text-3xl font-bold md:text-4xl'>
                                Code together, ship faster
                            </h2>

                            <p className='mb-4 text-sm leading-relaxed text-slate-400'>
                                DevRoom is an AI-powered collaborative coding
                                platform where developers can build projects
                                together in real time. Your team, code editor,
                                project chat, and AI assistant all work in one
                                workspace.
                            </p>

                            <p className='mb-6 text-sm leading-relaxed text-slate-400'>
                                Built with modern web technologies, DevRoom is
                                designed to make collaboration easier and help
                                developers move from idea to implementation
                                faster.
                            </p>

                            <div className='flex flex-wrap gap-2'>
                                {techStack.map((tag) => (
                                    <span
                                        key={tag}
                                        className='rounded-full border border-slate-700 bg-slate-800 px-3 py-1 text-xs text-slate-300'
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Benefits Grid */}
                        <div className='grid grid-cols-2 gap-4'>
                            {benefits.map((item) => (
                                <div
                                    key={item.number}
                                    className='rounded-xl border border-slate-700 bg-slate-800 p-4'
                                >
                                    <span className='text-xs font-bold text-blue-400'>
                                        {item.number}
                                    </span>

                                    <h3 className='mb-1 mt-2 text-sm font-semibold'>
                                        {item.title}
                                    </h3>

                                    <p className='text-xs text-slate-400'>
                                        {item.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ================= FOUNDER ================= */}
                    <div className='mt-12 border-t border-slate-800 pt-10 text-center'>

                        <p className='mb-2 text-xs font-medium uppercase tracking-widest text-blue-400'>
                            About the Developer
                        </p>

                        <h3 className='mb-3 text-2xl font-bold'>
                            Shaikh Altaf Anzar
                        </h3>

                        <p className='mx-auto mb-5 max-w-2xl text-sm leading-relaxed text-slate-400'>
                            DevRoom was created and is maintained by{' '}
                            <span className='font-semibold text-white'>
                                Shaikh Altaf Anzar
                            </span>
                            , a B.Tech Computer Science & Engineering student
                            passionate about full-stack development,
                            artificial intelligence, and building practical
                            developer tools.
                        </p>

                        <div className='flex flex-wrap items-center justify-center gap-2 md:gap-3'>

                            <a
                                href='https://github.com/altafshaikh7'
                                target='_blank'
                                rel='noreferrer'
                                className='inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-slate-400 transition hover:bg-slate-800 hover:text-white'
                            >
                                <i className='ri-github-line text-base leading-none'></i>
                                <span>altafshaikh7</span>
                            </a>

                            <a
                                href='https://www.linkedin.com/in/altafshaikh7781'
                                target='_blank'
                                rel='noreferrer'
                                className='inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-slate-400 transition hover:bg-slate-800 hover:text-white'
                            >
                                <i className='ri-linkedin-line text-base leading-none'></i>
                                <span>LinkedIn</span>
                            </a>

                            <a
                                href='https://shaikhaltaf.netlify.app'
                                target='_blank'
                                rel='noreferrer'
                                className='inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-slate-400 transition hover:bg-slate-800 hover:text-white'
                            >
                                <i className='ri-user-line text-base leading-none'></i>
                                <span>Portfolio</span>
                            </a>

                            <a
                                href='mailto:altafshaikh7781@gmail.com'
                                className='inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-slate-400 transition hover:bg-slate-800 hover:text-white'
                            >
                                <i className='ri-mail-line text-base leading-none'></i>
                                <span>Email</span>
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* ================= HOW IT WORKS ================= */}
            <section className='border-t border-slate-800 px-6 py-20 md:px-16'>
                <div className='mx-auto max-w-4xl'>

                    <p className='mb-3 text-center text-xs font-medium uppercase tracking-widest text-blue-400'>
                        How it works
                    </p>

                    <h2 className='mb-14 text-center text-3xl font-bold md:text-4xl'>
                        Up and running in minutes
                    </h2>

                    <div className='grid grid-cols-1 gap-8 md:grid-cols-3'>
                        {steps.map((step) => (
                            <div
                                key={step.number}
                                className='text-center'
                            >
                                <div className='mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-blue-800/50 bg-blue-900/40'>
                                    <span className='text-sm font-bold text-blue-400'>
                                        {step.number}
                                    </span>
                                </div>

                                <h3 className='mb-2 font-semibold'>
                                    {step.title}
                                </h3>

                                <p className='text-sm text-slate-400'>
                                    {step.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ================= CTA ================= */}
            <section className='border-t border-slate-800 px-6 py-24 md:px-16'>
                <div className='mx-auto max-w-2xl text-center'>

                    <div className='mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-blue-800/50 bg-blue-900/40'>
                        <i className='ri-code-s-slash-line text-xl text-blue-400'></i>
                    </div>

                    <h2 className='mb-4 text-3xl font-bold md:text-4xl'>
                        Ready to build together?
                    </h2>

                    <p className='mb-8 text-slate-400'>
                        Create your workspace, invite your team, and start
                        building with AI by your side.
                    </p>

                    <button
                        onClick={() => navigate('/register')}
                        className='cursor-pointer rounded-xl bg-blue-600 px-10 py-4 text-base font-semibold transition hover:bg-blue-500'
                    >
                        Create your account
                        <i className='ri-arrow-right-line ml-2'></i>
                    </button>
                </div>
            </section>

            {/* ================= FOOTER ================= */}
            <footer className='border-t border-slate-800 px-6 py-8 md:px-16'>
                <div className='mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 md:flex-row'>

                    <div className='flex items-center gap-2'>
                        <img
                            src='/terminal_favicon.png'
                            alt='DevRoom logo'
                            className='h-7 w-7 object-contain'
                        />

                        <div>
                            <p className='bg-gradient-to-b from-[#ff7a00] to-[#ffd500] bg-clip-text text-sm font-bold text-transparent'>
                                DevRoom
                            </p>

                            <p className='text-[10px] text-slate-500'>
                                Code together. Build together.
                            </p>
                        </div>
                    </div>

                    <p className='text-center text-xs text-slate-500'>
                        © {new Date().getFullYear()} DevRoom. Built with ❤️ by{' '}
                        <a
                            href='https://shaikhaltaf.netlify.app'
                            target='_blank'
                            rel='noreferrer'
                            className='text-slate-300 transition hover:text-white'
                        >
                            Shaikh Altaf Anzar
                        </a>
                    </p>
                </div>
            </footer>
        </div>
    )
}

