import { useNavigate, useLocation } from 'react-router-dom'
import { useContext, useRef, useEffect, useMemo } from 'react'
import { UserContext } from '../context/user.context'

const Landing = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const featuresRef = useRef(null)
    const { user } = useContext(UserContext)

    // Redirect logged-in users to home
    useEffect(() => {
        if (user) {
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

    // Feature data - memoized to prevent unnecessary re-renders
    const features = useMemo(() => [
        {
            icon: 'ri-robot-2-line',
            color: 'text-blue-400',
            bg: 'bg-blue-500/[0.08] border-blue-500/20 hover:border-blue-500/40 hover:shadow-blue-500/10',
            iconBg: 'bg-blue-500/10',
            title: 'AI-Powered Coding',
            desc: 'Ask CodeSync to generate full file trees, write boilerplate, or debug your code — all from the chat panel.'
        },
        {
            icon: 'ri-team-line',
            color: 'text-emerald-400',
            bg: 'bg-emerald-500/[0.08] border-emerald-500/20 hover:border-emerald-500/40 hover:shadow-emerald-500/10',
            iconBg: 'bg-emerald-500/10',
            title: 'Real-time Collaboration',
            desc: 'Invite teammates, edit code together, and see changes live with Socket.io-powered sync.'
        },
        {
            icon: 'ri-terminal-box-line',
            color: 'text-amber-400',
            bg: 'bg-amber-500/[0.08] border-amber-500/20 hover:border-amber-500/40 hover:shadow-amber-500/10',
            iconBg: 'bg-amber-500/10',
            title: 'In-Browser Terminal',
            desc: 'Run Node.js projects right in your browser with WebContainers — no setup, no installs.'
        },
        {
            icon: 'ri-folders-line',
            color: 'text-purple-400',
            bg: 'bg-purple-500/[0.08] border-purple-500/20 hover:border-purple-500/40 hover:shadow-purple-500/10',
            iconBg: 'bg-purple-500/10',
            title: 'Smart File Management',
            desc: 'Organize your project with a full file tree. Create, rename, and delete files without leaving the editor.'
        },
        {
            icon: 'ri-message-3-line',
            color: 'text-pink-400',
            bg: 'bg-pink-500/[0.08] border-pink-500/20 hover:border-pink-500/40 hover:shadow-pink-500/10',
            iconBg: 'bg-pink-500/10',
            title: 'Persistent Chat',
            desc: 'Project chat history is saved — pick up conversations where you left off, even days later.'
        },
        {
            icon: 'ri-shield-keyhole-line',
            color: 'text-cyan-400',
            bg: 'bg-cyan-500/[0.08] border-cyan-500/20 hover:border-cyan-500/40 hover:shadow-cyan-500/10',
            iconBg: 'bg-cyan-500/10',
            title: 'Secure Authentication',
            desc: 'Secure authentication and account protection help keep your projects and collaboration safe.'
        }
    ], [])

    const steps = useMemo(() => [
        {
            number: '01',
            title: 'Create an account',
            desc: 'Sign up with your email and get started with CodeSync.'
        },
        {
            number: '02',
            title: 'Start a project',
            desc: 'Create a new project and invite your collaborators.'
        },
        {
            number: '03',
            title: 'Code with AI',
            desc: 'Use CodeSync AI to scaffold, debug, and ship faster.'
        }
    ], [])

    const dashboardStats = useMemo(() => [
        {
            label: 'Total Projects',
            value: '6',
            color: 'text-blue-400',
            icon: 'ri-folder-line'
        },
        {
            label: 'Collaborators',
            value: '12',
            color: 'text-emerald-400',
            icon: 'ri-team-line'
        },
        {
            label: 'AI Chats',
            value: '34',
            color: 'text-amber-400',
            icon: 'ri-robot-line'
        },
        {
            label: 'Last Active',
            value: '2h ago',
            color: 'text-purple-400',
            icon: 'ri-time-line'
        }
    ], [])

    const recentProjects = useMemo(() => [
        { name: 'auth-service', time: '2h ago' },
        { name: 'landing-page', time: '5h ago' },
        { name: 'api-gateway', time: '1d ago' }
    ], [])

    const techStack = useMemo(() => [
        'React',
        'Node.js',
        'Express.js',
        'Socket.io',
        'MongoDB',
        'Gemini AI',
        'WebContainers'
    ], [])

    const benefits = useMemo(() => [
        {
            number: '01',
            title: 'AI Pair Programming',
            desc: 'CodeSync AI helps write, explain, and debug code with you in real time.'
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
    ], [])

    return (
        <div className="min-h-screen bg-[#0a0a0f] font-sans text-slate-100 antialiased selection:bg-blue-500/20 selection:text-blue-300">
            
            {/* ================= HERO SECTION ================= */}
            <section id="home" className="relative overflow-hidden">
                {/* Background layers */}
                <div className="pointer-events-none absolute inset-0">
                    {/* Grid pattern */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(59,130,246,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(59,130,246,0.04)_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
                    
                    {/* Radial glows */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[600px] w-[800px] rounded-full bg-blue-500/[0.07] blur-[120px]"></div>
                    <div className="absolute top-1/3 right-0 h-[400px] w-[400px] rounded-full bg-purple-500/[0.05] blur-[100px]"></div>
                    <div className="absolute top-1/3 left-0 h-[400px] w-[400px] rounded-full bg-cyan-500/[0.05] blur-[100px]"></div>
                </div>

                <div className="relative mx-auto max-w-5xl px-6 pb-20 pt-24 text-center md:px-10 lg:pb-28 lg:pt-32">
                    {/* Badge */}
                    <div className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-blue-500/25 bg-blue-500/[0.08] px-4 py-2 text-xs font-medium text-blue-400 backdrop-blur-sm transition-all duration-300 hover:border-blue-500/40 hover:bg-blue-500/[0.12]">
                        <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500"></span>
                        </span>
                        <span>Powered by CodeSync</span>
                    </div>

                    {/* Headline */}
                    <h1 className="mb-6 text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-7xl">
                        Code together,{' '}
                        <span className="relative inline-block bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                            ship faster
                            <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 9" fill="none">
                                <path d="M1 8C50 2 150 2 199 8" stroke="url(#gradient)" strokeWidth="2" strokeLinecap="round"/>
                                <defs>
                                    <linearGradient id="gradient" x1="1" y1="8" x2="199" y2="8" gradientUnits="userSpaceOnUse">
                                        <stop stopColor="#60A5FA"/>
                                        <stop offset="1" stopColor="#22D3EE"/>
                                    </linearGradient>
                                </defs>
                            </svg>
                        </span>
                        <br />
                        with AI by your side
                    </h1>

                    {/* Description */}
                    <p className="mx-auto mb-10 max-w-2xl text-base leading-relaxed text-slate-400 sm:text-lg lg:text-xl">
                        CodeSync is a collaborative coding platform where your
                        team and CodeSync AI work in the same room — with a
                        real-time editor, in-browser terminal, and persistent
                        project chat.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                        <button
                            onClick={() => navigate('/register')}
                            className="group relative inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 py-4 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition-all duration-300 hover:scale-[1.02] hover:bg-blue-500 hover:shadow-blue-500/35 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[#0a0a0f] sm:w-auto"
                        >
                            <span>Start for free</span>
                            <i className="ri-arrow-right-line transition-transform duration-300 group-hover:translate-x-1"></i>
                        </button>

                        <button
                            onClick={() =>
                                featuresRef.current?.scrollIntoView({
                                    behavior: 'smooth'
                                })
                            }
                            className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-700/80 bg-slate-900/50 px-8 py-4 text-sm font-medium text-slate-300 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:border-slate-500 hover:bg-slate-900 hover:text-white focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-[#0a0a0f] sm:w-auto"
                        >
                            See features
                        </button>
                    </div>

                    {/* Trust indicator */}
                    <div className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-500">
                        <i className="ri-shield-check-line text-emerald-400"></i>
                        <span>No credit card required</span>
                        <span className="mx-2">•</span>
                        <i className="ri-github-fill text-slate-400"></i>
                        <span>Free forever for individuals</span>
                    </div>
                </div>
            </section>

            {/* ================= DASHBOARD PREVIEW ================= */}
            <section className="relative px-6 pb-24 md:px-10 lg:pb-32">
                {/* Glow behind dashboard */}
                <div className="pointer-events-none absolute inset-x-0 top-0 mx-auto h-[400px] max-w-5xl bg-blue-500/[0.03] blur-[80px]"></div>

                <div className="relative mx-auto max-w-5xl">
                    {/* Browser Window */}
                    <div className="overflow-hidden rounded-2xl border border-slate-700/60 bg-slate-900/90 shadow-2xl shadow-black/40 backdrop-blur-xl transition-all duration-300 hover:border-slate-600/80">
                        
                        {/* Browser Header */}
                        <div className="flex items-center gap-3 border-b border-slate-800 bg-[#0d0d13] px-5 py-3.5">
                            <div className="flex gap-2">
                                <div className="h-3 w-3 rounded-full bg-red-500/80 transition-all duration-200 hover:bg-red-500"></div>
                                <div className="h-3 w-3 rounded-full bg-yellow-500/80 transition-all duration-200 hover:bg-yellow-500"></div>
                                <div className="h-3 w-3 rounded-full bg-green-500/80 transition-all duration-200 hover:bg-green-500"></div>
                            </div>

                            <div className="mx-4 flex-1">
                                <div className="flex items-center gap-2 rounded-lg bg-slate-800/80 px-4 py-1.5 text-xs text-slate-400">
                                    <i className="ri-lock-line text-slate-500"></i>
                                    <span>app.codesync.dev</span>
                                </div>
                            </div>

                            <div className="hidden sm:flex items-center gap-2">
                                <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-500/10 px-2.5 py-1 text-[10px] font-medium text-emerald-400">
                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                                    Live Preview
                                </span>
                            </div>
                        </div>

                        {/* Dashboard Content */}
                        <div className="bg-slate-900/60 p-6 lg:p-8">
                            {/* Stats Grid */}
                            <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-5">
                                {dashboardStats.map((stat) => (
                                    <div
                                        key={stat.label}
                                        className="group rounded-xl border border-slate-700/60 bg-slate-900/80 p-4 backdrop-blur transition-all duration-300 hover:border-slate-600 hover:bg-slate-900 lg:p-5"
                                    >
                                        <div className="mb-3 flex items-center justify-between">
                                            <p className="text-xs font-medium text-slate-500">
                                                {stat.label}
                                            </p>
                                            <i className={`${stat.icon} ${stat.color} text-sm opacity-0 transition-opacity duration-300 group-hover:opacity-100`}></i>
                                        </div>

                                        <p className={`text-2xl font-bold ${stat.color} lg:text-3xl`}>
                                            {stat.value}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            {/* Content Grid */}
                            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-5">
                                {/* Recent Projects */}
                                <div className="rounded-xl border border-slate-700/60 bg-slate-900/80 p-5 backdrop-blur lg:p-6">
                                    <div className="mb-4 flex items-center justify-between">
                                        <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                                            Recent Projects
                                        </p>
                                        <span className="text-[10px] text-slate-600">Updated live</span>
                                    </div>

                                    <div className="space-y-1">
                                        {recentProjects.map((project) => (
                                            <div
                                                key={project.name}
                                                className="group flex items-center gap-3 rounded-lg px-2 py-2.5 transition-all duration-200 hover:bg-slate-800/50"
                                            >
                                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 transition-all duration-200 group-hover:scale-110">
                                                    <i className="ri-code-s-slash-line text-sm text-blue-400"></i>
                                                </div>

                                                <div className="min-w-0 flex-1">
                                                    <p className="truncate text-sm font-medium text-slate-200">
                                                        {project.name}
                                                    </p>
                                                    <p className="text-[10px] text-slate-500">Active project</p>
                                                </div>

                                                <span className="text-xs text-slate-500">
                                                    {project.time}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* AI Chat Preview */}
                                <div className="rounded-xl border border-slate-700/60 bg-slate-900/80 p-5 backdrop-blur lg:p-6">
                                    <div className="mb-4 flex items-center justify-between">
                                        <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                                            AI Chat Preview
                                        </p>
                                        <span className="inline-flex items-center gap-1 text-[10px] text-blue-400">
                                            <i className="ri-sparkling-line"></i>
                                            CodeSync 
                                        </span>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex gap-2">
                                            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-800">
                                                <i className="ri-user-line text-xs text-slate-400"></i>
                                            </div>
                                            <div className="rounded-lg bg-slate-800 px-4 py-2.5 text-xs text-slate-300">
                                                @ai scaffold a REST API with Express and MongoDB
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-500/10">
                                                <i className="ri-robot-line text-xs text-blue-400"></i>
                                            </div>
                                            <div className="flex-1 rounded-lg border border-blue-500/20 bg-blue-500/[0.08] px-4 py-2.5 text-xs text-blue-300">
                                                <p className="mb-1.5">✓ Generated 8 files — routes, models, controllers, middleware</p>
                                                <div className="flex gap-1.5">
                                                    {['routes/', 'models/', 'controllers/'].map((folder) => (
                                                        <span key={folder} className="rounded bg-blue-500/10 px-1.5 py-0.5 text-[10px] text-blue-400">
                                                            {folder}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 pl-9 text-xs text-slate-500">
                                            <span className="inline-flex h-1.5 w-1.5 animate-pulse rounded-full bg-blue-400"></span>
                                            CodeSync is ready to help
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ================= FEATURES ================= */}
            <section
                id="features-section"
                ref={featuresRef}
                className="scroll-mt-20 border-t border-slate-800/60 px-6 py-20 md:px-10 lg:py-28"
            >
                <div className="mx-auto max-w-6xl">
                    {/* Section Header */}
                    <div className="mb-16 text-center">
                        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-blue-400">
                            Features
                        </p>
                        <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl lg:text-5xl">
                            Everything your team needs
                        </h2>
                        <p className="mx-auto max-w-xl text-base text-slate-400">
                            Built for developers who move fast and collaborate closely.
                        </p>
                    </div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
                        {features.map((feature, index) => (
                            <div
                                key={feature.title}
                                className={`group relative overflow-hidden rounded-2xl border p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl lg:p-7 ${feature.bg}`}
                                style={{
                                    animationDelay: `${index * 50}ms`
                                }}
                            >
                                {/* Hover gradient overlay */}
                                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>

                                <div className="relative">
                                    <div className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl ${feature.iconBg} transition-all duration-300 group-hover:scale-110`}>
                                        <i className={`${feature.icon} ${feature.color} text-2xl`}></i>
                                    </div>

                                    <h3 className="mb-2.5 text-base font-semibold text-white lg:text-lg">
                                        {feature.title}
                                    </h3>

                                    <p className="text-sm leading-relaxed text-slate-400">
                                        {feature.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ================= ABOUT ================= */}
            <section
                id="about-section"
                className="scroll-mt-20 border-t border-slate-800/60 px-6 py-20 md:px-10 lg:py-28"
            >
                <div className="mx-auto max-w-6xl">
                    <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
                        {/* About Text */}
                        <div>
                            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-blue-400">
                                About CodeSync
                            </p>

                            <h2 className="mb-5 text-3xl font-bold text-white md:text-4xl lg:text-5xl">
                                Code together,{' '}
                                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                                    ship faster
                                </span>
                            </h2>

                            <p className="mb-5 text-base leading-relaxed text-slate-400">
                                CodeSync is an AI-powered collaborative coding platform where developers can build projects together in real time. Your team, code editor, project chat, and AI assistant all work in one workspace.
                            </p>

                            <p className="mb-8 text-base leading-relaxed text-slate-400">
                                Built with modern web technologies, CodeSync is designed to make collaboration easier and help developers move from idea to implementation faster.
                            </p>

                            {/* Tech Stack */}
                            <div className="flex flex-wrap gap-2.5">
                                {techStack.map((tech) => (
                                    <span
                                        key={tech}
                                        className="group inline-flex items-center gap-1.5 rounded-full border border-slate-700/80 bg-slate-900/80 px-4 py-1.5 text-xs font-medium text-slate-300 backdrop-blur-sm transition-all duration-300 hover:border-blue-500/50 hover:text-blue-400 hover:shadow-lg hover:shadow-blue-500/10"
                                    >
                                        <i className="ri-checkbox-circle-fill text-[10px] text-slate-600 transition-colors duration-300 group-hover:text-blue-400"></i>
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Benefits Grid */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-5">
                            {benefits.map((item, index) => (
                                <div
                                    key={item.number}
                                    className="group relative overflow-hidden rounded-2xl border border-slate-700/80 bg-slate-900/80 p-5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/10 lg:p-6"
                                >
                                    {/* Hover gradient */}
                                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-500/[0.03] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>

                                    <div className="relative">
                                        <div className="mb-4 flex items-center justify-between">
                                            <span className="text-xs font-bold text-blue-400">
                                                {item.number}
                                            </span>
                                            <i className="ri-arrow-right-up-line text-slate-600 opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100 group-hover:text-blue-400"></i>
                                        </div>

                                        <h3 className="mb-2 text-sm font-semibold text-white lg:text-base">
                                            {item.title}
                                        </h3>

                                        <p className="text-xs leading-relaxed text-slate-400 lg:text-sm">
                                            {item.desc}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ================= HOW IT WORKS ================= */}
            <section className="border-t border-slate-800/60 px-6 py-20 md:px-10 lg:py-28">
                <div className="mx-auto max-w-5xl">
                    {/* Section Header */}
                    <div className="mb-16 text-center">
                        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-blue-400">
                            How it works
                        </p>
                        <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl lg:text-5xl">
                            Up and running in minutes
                        </h2>
                    </div>

                    {/* Steps */}
                    <div className="relative grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-8">
                        {/* Connecting line */}
                        <div className="pointer-events-none absolute left-0 right-0 top-7 hidden border-t border-dashed border-slate-700/60 md:block"></div>

                        {steps.map((step, index) => (
                            <div key={step.number} className="group relative text-center">
                                <div className="relative mb-5 inline-flex">
                                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-500/10 backdrop-blur-sm transition-all duration-300 group-hover:scale-110 group-hover:border-blue-500/40 group-hover:shadow-lg group-hover:shadow-blue-500/20">
                                        <span className="text-sm font-bold text-blue-400">
                                            {step.number}
                                        </span>
                                    </div>
                                    
                                    {/* Step indicator */}
                                    <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-[#0a0a0f] bg-emerald-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>
                                </div>

                                <h3 className="mb-2.5 text-base font-semibold text-white lg:text-lg">
                                    {step.title}
                                </h3>

                                <p className="mx-auto max-w-xs text-sm leading-relaxed text-slate-400">
                                    {step.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ================= CTA ================= */}
            <section className="relative overflow-hidden border-t border-slate-800/60 px-6 py-24 md:px-10 lg:py-32">
                {/* Background effects */}
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.08)_0%,transparent_60%)]"></div>
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:3rem_3rem]"></div>
                </div>

                <div className="relative mx-auto max-w-2xl text-center">
                    <div className="mb-8 inline-flex h-20 w-20 items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-500/10 backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:border-blue-500/40 hover:shadow-xl hover:shadow-blue-500/20">
                        <i className="ri-code-s-slash-line text-3xl text-blue-400"></i>
                    </div>

                    <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl lg:text-5xl">
                        Ready to build together?
                    </h2>

                    <p className="mb-10 text-base text-slate-400 lg:text-lg">
                        Create your workspace, invite your team, and start building with AI by your side.
                    </p>

                    <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                        <button
                            onClick={() => navigate('/register')}
                            className="group inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-blue-600 px-10 py-4 text-base font-semibold text-white shadow-lg shadow-blue-600/25 transition-all duration-300 hover:scale-[1.02] hover:bg-blue-500 hover:shadow-blue-500/35 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[#0a0a0f]"
                        >
                            Create your account
                            <i className="ri-arrow-right-line transition-transform duration-300 group-hover:translate-x-1"></i>
                        </button>
                    </div>

                    <p className="mt-6 text-xs text-slate-500">
                        Join thousands of developers already building with CodeSync
                    </p>
                </div>
            </section>
        </div>
    )
}

export default Landing