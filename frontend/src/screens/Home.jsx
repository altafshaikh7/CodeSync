import {
    useContext,
    useState,
    useEffect,
    useMemo,
    useCallback,
    useRef
} from 'react'
import { UserContext } from '../context/user.context'
import { NotificationContext } from '../context/notification.context'
import axios from '../config/axios.js'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const Home = () => {
    const { user } = useContext(UserContext)
    const { pendingInvites, respondInvite } =
        useContext(NotificationContext)

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [projectName, setProjectName] = useState('')
    const [project, setProject] = useState([])
    const [aiQueriesToday, setAiQueriesToday] = useState(0)

    const navigate = useNavigate()

    const projectsRef = useRef(null)
    const featuresRef = useRef(null)
    const aboutRef = useRef(null)

    const showApiError = (
        err,
        fallback = 'Something went wrong'
    ) => {
        if (err.code === 'ERR_NETWORK' || !navigator.onLine) return

        const data = err.response?.data

        if (data?.errors?.length) {
            data.errors.forEach((error) =>
                toast.error(error.msg)
            )
        } else {
            toast.error(data?.message || fallback)
        }
    }

    const respondToInvite = (projectId, action) => {
        respondInvite(projectId, action)
            .then(() => {
                if (action === 'accept') {
                    toast.success('Invite accepted!')

                    axios
                        .get('/projects/all')
                        .then((res) =>
                            setProject(res.data.projects)
                        )
                        .catch(() => {})
                } else {
                    toast.info('Invite declined')
                }
            })
            .catch((err) =>
                showApiError(
                    err,
                    'Failed to respond to invite'
                )
            )
    }

    // Expose refs so Navbar can scroll to these sections
    useEffect(() => {
        window.__homeRefs = {
            projectsRef,
            featuresRef,
            aboutRef
        }

        return () => {
            window.__homeRefs = null
        }
    }, [])

    const now = useMemo(() => Date.now(), [])

    const timeAgo = useCallback(
        (dateString) => {
            if (!dateString) return '—'

            const diff =
                now - new Date(dateString).getTime()

            if (isNaN(diff)) return '—'

            const mins = Math.floor(diff / 60000)
            const hours = Math.floor(diff / 3600000)
            const days = Math.floor(diff / 86400000)

            if (mins < 1) return 'Just now'
            if (mins < 60) return `${mins}m ago`
            if (hours < 24) return `${hours}h ago`

            return `${days}d ago`
        },
        [now]
    )

    const todayString = useMemo(
        () =>
            new Date(now).toLocaleDateString('en-US', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            }),
        [now]
    )

    const totalCollaborators = useMemo(
        () =>
            project.reduce(
                (sum, item) =>
                    sum + (item.users?.length || 0),
                0
            ),
        [project]
    )

    const lastActiveProject = useMemo(() => {
        if (project.length === 0) return null

        return project.reduce((latest, item) =>
            new Date(item.updatedAt) >
            new Date(latest.updatedAt)
                ? item
                : latest
        )
    }, [project])

    useEffect(() => {
        axios
            .get('/projects/ai-queries-today')
            .then((res) =>
                setAiQueriesToday(res.data.count)
            )
            .catch((err) =>
                showApiError(
                    err,
                    'Failed to load AI stats'
                )
            )
    }, [])

    const stats = useMemo(
        () => [
            {
                label: 'Total Projects',
                value: project.length,
                sub: 'all time',
                icon: 'ri-folder-line',
                bg: 'bg-blue-500/10',
                iconColor: 'text-blue-400',
                border: 'border-blue-500/20',
                hoverBorder: 'hover:border-blue-500/40'
            },
            {
                label: 'Collaborators',
                value: totalCollaborators,
                sub: 'across all projects',
                icon: 'ri-team-line',
                bg: 'bg-emerald-500/10',
                iconColor: 'text-emerald-400',
                border: 'border-emerald-500/20',
                hoverBorder: 'hover:border-emerald-500/40'
            },
            {
                label: 'AI Chats',
                value: aiQueriesToday,
                sub: 'Gemini queries today',
                icon: 'ri-robot-line',
                bg: 'bg-amber-500/10',
                iconColor: 'text-amber-400',
                border: 'border-amber-500/20',
                hoverBorder: 'hover:border-amber-500/40'
            },
            {
                label: 'Last Active',
                value: lastActiveProject
                    ? timeAgo(lastActiveProject.updatedAt)
                    : '—',
                sub: lastActiveProject
                    ? `in "${lastActiveProject.name}"`
                    : 'no projects yet',
                icon: 'ri-time-line',
                bg: 'bg-purple-500/10',
                iconColor: 'text-purple-400',
                border: 'border-purple-500/20',
                hoverBorder: 'hover:border-purple-500/40'
            }
        ],
        [
            project,
            totalCollaborators,
            aiQueriesToday,
            lastActiveProject,
            timeAgo
        ]
    )

    const activityStyles = [
        {
            bg: 'bg-blue-500/10',
            text: 'text-blue-400',
            border: 'border-blue-500/20'
        },
        {
            bg: 'bg-emerald-500/10',
            text: 'text-emerald-400',
            border: 'border-emerald-500/20'
        },
        {
            bg: 'bg-amber-500/10',
            text: 'text-amber-400',
            border: 'border-amber-500/20'
        },
        {
            bg: 'bg-purple-500/10',
            text: 'text-purple-400',
            border: 'border-purple-500/20'
        }
    ]

    const features = [
        {
            icon: 'ri-robot-2-line',
            color: 'text-blue-400',
            bg: 'bg-blue-500/5 border-blue-500/20 hover:border-blue-500/40',
            title: 'AI-Powered Coding',
            desc: 'Ask Gemini to generate full file trees, write boilerplate, or debug — all from the chat panel.'
        },
        {
            icon: 'ri-team-line',
            color: 'text-emerald-400',
            bg: 'bg-emerald-500/5 border-emerald-500/20 hover:border-emerald-500/40',
            title: 'Real-time Collaboration',
            desc: 'Invite teammates, edit code together, and see changes live with Socket.io-powered sync.'
        },
        {
            icon: 'ri-terminal-box-line',
            color: 'text-amber-400',
            bg: 'bg-amber-500/5 border-amber-500/20 hover:border-amber-500/40',
            title: 'In-Browser Terminal',
            desc: 'Run Node.js projects right in your browser with WebContainers — no setup, no installs.'
        },
        {
            icon: 'ri-folders-line',
            color: 'text-purple-400',
            bg: 'bg-purple-500/5 border-purple-500/20 hover:border-purple-500/40',
            title: 'Smart File Management',
            desc: 'Full file tree editor — create, rename, and delete files without leaving the browser.'
        },
        {
            icon: 'ri-message-3-line',
            color: 'text-pink-400',
            bg: 'bg-pink-500/5 border-pink-500/20 hover:border-pink-500/40',
            title: 'Persistent Chat',
            desc: 'Project chat history is saved — pick up conversations where you left off.'
        },
        {
            icon: 'ri-shield-keyhole-line',
            color: 'text-cyan-400',
            bg: 'bg-cyan-500/5 border-cyan-500/20 hover:border-cyan-500/40',
            title: 'Secure OTP Auth',
            desc: 'Email-based OTP verification keeps your account safe on every login.'
        }
    ]

    const createProject = (event) => {
        event.preventDefault()

        axios
            .post('/projects/create', {
                name: projectName
            })
            .then((res) => {
                setProjectName('')
                setIsModalOpen(false)

                setProject((prev) => [
                    ...prev,
                    res.data
                ])

                toast.success('Project created! 🎉')
            })
            .catch((err) =>
                showApiError(
                    err,
                    'Failed to create project'
                )
            )
    }

    const deleteProject = async (projectId) => {
        if (!window.confirm('Delete this project?')) return

        axios
            .delete(`/projects/${projectId}`)
            .then(() => {
                setProject((prev) =>
                    prev.filter(
                        (item) =>
                            item._id !== projectId
                    )
                )

                const bc = new BroadcastChannel(
                    'devroom'
                )

                bc.postMessage({
                    type: 'project-deleted',
                    projectId
                })

                bc.close()

                toast.success('Project deleted!')
            })
            .catch((err) =>
                showApiError(
                    err,
                    'Failed to delete project'
                )
            )
    }

    useEffect(() => {
        const bc = new BroadcastChannel('devroom')

        bc.onmessage = (event) => {
            if (
                event.data?.type ===
                'project-deleted'
            ) {
                setProject((prev) => {
                    const exists = prev.some(
                        (item) =>
                            item._id ===
                            event.data.projectId
                    )

                    if (exists) {
                        toast.info(
                            'A project was deleted'
                        )
                    }

                    return prev.filter(
                        (item) =>
                            item._id !==
                            event.data.projectId
                    )
                })
            }
        }

        return () => bc.close()
    }, [])

    const openProject = async (proj) => {
        try {
            const res = await axios.get(
                `/projects/get-project/${proj._id}`
            )

            if (!res.data?.project) {
                throw new Error('Project not found')
            }

            navigate('/project', {
                state: {
                    project: res.data.project
                }
            })
        } catch {
            toast.error(
                'This project no longer exists'
            )

            setProject((prev) =>
                prev.filter(
                    (item) =>
                        item._id !== proj._id
                )
            )
        }
    }

    useEffect(() => {
        const fetchProjects = () => {
            if (!navigator.onLine) return

            axios
                .get('/projects/all')
                .then((res) =>
                    setProject(res.data.projects)
                )
                .catch((err) =>
                    showApiError(
                        err,
                        'Failed to load projects'
                    )
                )
        }

        fetchProjects()

        const interval = setInterval(
            fetchProjects,
            2000
        )

        return () =>
            clearInterval(interval)
    }, [])

    // Animated code editor
    const codeLines = [
        [
            {
                t: 'import ',
                c: 'text-purple-400'
            },
            {
                t: 'React',
                c: 'text-blue-300'
            },
            {
                t: ' from ',
                c: 'text-purple-400'
            },
            {
                t: "'react'",
                c: 'text-green-400'
            }
        ],
        [],
        [
            {
                t: 'function ',
                c: 'text-purple-400'
            },
            {
                t: 'App',
                c: 'text-yellow-300'
            },
            {
                t: '() {',
                c: 'text-slate-300'
            }
        ],
        [
            {
                t: '  return (',
                c: 'text-purple-400'
            }
        ],
        [
            {
                t: '    <',
                c: 'text-slate-400'
            },
            {
                t: 'div',
                c: 'text-cyan-400'
            },
            {
                t: ' ',
                c: 'text-slate-400'
            },
            {
                t: 'className',
                c: 'text-amber-300'
            },
            {
                t: '=',
                c: 'text-slate-400'
            },
            {
                t: '"app"',
                c: 'text-green-400'
            },
            {
                t: '>',
                c: 'text-slate-400'
            }
        ],
        [
            {
                t: '      Hello, CodeSync! 🚀',
                c: 'text-slate-300'
            }
        ],
        [
            {
                t: '    </',
                c: 'text-slate-400'
            },
            {
                t: 'div',
                c: 'text-cyan-400'
            },
            {
                t: '>',
                c: 'text-slate-400'
            }
        ],
        [
            {
                t: '  )',
                c: 'text-slate-300'
            }
        ],
        [
            {
                t: '}',
                c: 'text-slate-300'
            }
        ]
    ]

    const lineLength = (line) =>
        line.reduce(
            (sum, part) =>
                sum + part.t.length,
            0
        )

    const [typedLines, setTypedLines] = useState([])
    const [lineIndex, setLineIndex] = useState(0)
    const [charIndex, setCharIndex] = useState(0)
    const [showCursor, setShowCursor] =
        useState(true)

    useEffect(() => {
        if (lineIndex >= codeLines.length) {
            const timer = setTimeout(() => {
                setTypedLines([])
                setLineIndex(0)
                setCharIndex(0)
            }, 2000)

            return () => clearTimeout(timer)
        }

        const total =
            lineLength(codeLines[lineIndex])

        if (charIndex < total) {
            const timer = setTimeout(
                () =>
                    setCharIndex(
                        (current) =>
                            current + 1
                    ),
                18 + Math.random() * 30
            )

            return () => clearTimeout(timer)
        }

        const timer = setTimeout(() => {
            setTypedLines((prev) => [
                ...prev,
                lineIndex
            ])

            setLineIndex((current) => current + 1)
            setCharIndex(0)
        }, total === 0 ? 80 : 250)

        return () => clearTimeout(timer)
    }, [lineIndex, charIndex])

    useEffect(() => {
        const interval = setInterval(
            () =>
                setShowCursor(
                    (current) => !current
                ),
            500
        )

        return () =>
            clearInterval(interval)
    }, [])

    const renderTypedLine = (
        parts,
        typedCount
    ) => {
        if (parts.length === 0) return '\u00A0'

        let remaining = typedCount
        const output = []

        for (
            let i = 0;
            i < parts.length;
            i++
        ) {
            if (remaining <= 0) break

            const part = parts[i]

            const take = Math.min(
                part.t.length,
                remaining
            )

            output.push(
                <span
                    key={i}
                    className={part.c}
                >
                    {part.t.slice(0, take)}
                </span>
            )

            remaining -= take
        }

        return output.length
            ? output
            : '\u00A0'
    }

    return (
        <main className='min-h-screen w-full overflow-x-hidden bg-slate-950 text-slate-100'>
            {/* Pending Invites */}
            {pendingInvites.length > 0 && (
                <div className='sticky top-0 z-40 border-b border-blue-500/20 bg-slate-900/95 backdrop-blur supports-[backdrop-filter]:bg-slate-900/80'>
                    <div className='mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:px-6 lg:px-8'>
                        {pendingInvites.map((inv) => (
                            <div
                                key={inv.projectId}
                                className='flex flex-col justify-between gap-4 rounded-xl border border-blue-500/20 bg-blue-500/5 px-5 py-4 backdrop-blur transition-all duration-200 hover:border-blue-500/40 sm:flex-row sm:items-center'
                            >
                                <div className='flex min-w-0 items-start gap-3 sm:items-center'>
                                    <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-500/10'>
                                        <i className='ri-mail-unread-line text-lg text-blue-400'></i>
                                    </div>

                                    <div className='min-w-0'>
                                        <p className='text-sm text-slate-200'>
                                            <span className='font-semibold text-white'>
                                                {inv.invitedBy?.name ||
                                                    inv
                                                        .invitedBy
                                                        ?.email}
                                            </span>{' '}
                                            invited you to{' '}
                                            <span className='font-semibold text-white'>
                                                {inv.projectName}
                                            </span>
                                        </p>
                                        <p className='mt-0.5 text-xs text-slate-400'>
                                            You have been invited to collaborate
                                        </p>
                                    </div>
                                </div>

                                <div className='flex shrink-0 items-center gap-2 sm:pl-4'>
                                    <button
                                        onClick={() =>
                                            respondToInvite(
                                                inv.projectId,
                                                'reject'
                                            )
                                        }
                                        className='rounded-lg border border-slate-600 px-4 py-2 text-xs font-medium text-slate-300 transition-all duration-200 hover:border-slate-500 hover:bg-slate-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-slate-900'
                                    >
                                        Decline
                                    </button>

                                    <button
                                        onClick={() =>
                                            respondToInvite(
                                                inv.projectId,
                                                'accept'
                                            )
                                        }
                                        className='rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-blue-600/20 transition-all duration-200 hover:bg-blue-500 hover:shadow-blue-500/30 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900'
                                    >
                                        Accept
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Hero */}
            <section className='relative border-b border-slate-800/80 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950'>
                {/* Subtle grid pattern overlay */}
                <div className='pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem]'></div>
                
                <div className='relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24'>
                    <div className='flex flex-col items-center gap-12 lg:flex-row lg:gap-16'>
                        <div className='w-full flex-1 text-center lg:text-left'>
                            <div className='mb-6 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-xs font-medium text-blue-400 backdrop-blur'>
                                <span className='relative flex h-2 w-2'>
                                    <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75'></span>
                                    <span className='relative inline-flex h-2 w-2 rounded-full bg-blue-500'></span>
                                </span>
                                Powered by Google Gemini AI
                            </div>

                            <h1 className='mb-4 text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl'>
                                Welcome back,{' '}
                                <span className='bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent'>
                                    {user?.name?.split(' ')[0] ||
                                        'Developer'}
                                </span>
                                !
                            </h1>

                            <p className='mb-8 max-w-xl text-base text-slate-400 sm:text-lg lg:mx-0 mx-auto'>
                                {todayString} —{' '}
                                <span className='font-medium text-slate-300'>
                                    {project.length} active
                                    project
                                    {project.length !== 1
                                        ? 's'
                                        : ''}
                                </span>
                                . Ready to build something
                                great?
                            </p>

                            <div className='flex flex-wrap justify-center gap-3 lg:justify-start'>
                                <button
                                    onClick={() =>
                                        setIsModalOpen(
                                            true
                                        )
                                    }
                                    className='inline-flex cursor-pointer items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition-all duration-200 hover:scale-[1.02] hover:bg-blue-500 hover:shadow-blue-500/35 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-950'
                                >
                                    <i className='ri-add-line text-base'></i>
                                    New Project
                                </button>

                                <button
                                    onClick={() =>
                                        projectsRef.current?.scrollIntoView(
                                            {
                                                behavior:
                                                    'smooth'
                                            }
                                        )
                                    }
                                    className='inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/50 px-6 py-3 text-sm font-medium text-slate-300 backdrop-blur transition-all duration-200 hover:scale-[1.02] hover:border-slate-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-slate-950'
                                >
                                    View Projects
                                    <i className='ri-arrow-down-line text-base'></i>
                                </button>
                            </div>
                        </div>

                        {/* Animated Editor */}
                        <div className='w-full lg:max-w-lg lg:flex-1'>
                            <div className='relative'>
                                <div className='flex h-[280px] flex-col overflow-hidden rounded-2xl border border-slate-700/80 bg-slate-900/80 shadow-2xl shadow-blue-500/5 backdrop-blur sm:h-[320px] transition-all duration-300 hover:border-slate-600'>
                                    <div className='flex items-center gap-2 border-b border-slate-800 bg-slate-900/90 px-5 py-3'>
                                        <div className='flex gap-2'>
                                            <span className='h-3 w-3 rounded-full bg-red-500/90'></span>
                                            <span className='h-3 w-3 rounded-full bg-yellow-500/90'></span>
                                            <span className='h-3 w-3 rounded-full bg-green-500/90'></span>
                                        </div>

                                        <span className='ml-3 font-mono text-xs text-slate-500'>
                                            App.jsx
                                        </span>

                                        <div className='ml-auto flex items-center gap-1.5'>
                                            <span className='h-1.5 w-1.5 rounded-full bg-emerald-500'></span>
                                            <span className='text-xs text-slate-500'>Live</span>
                                        </div>
                                    </div>

                                    <div className='flex-1 overflow-hidden p-5 font-mono text-xs leading-relaxed sm:text-sm'>
                                        {typedLines.map(
                                            (index) => (
                                                <p
                                                    key={
                                                        index
                                                    }
                                                    className='whitespace-pre'
                                                >
                                                    {renderTypedLine(
                                                        codeLines[
                                                            index
                                                        ],
                                                        lineLength(
                                                            codeLines[
                                                                index
                                                            ]
                                                        )
                                                    )}
                                                </p>
                                            )
                                        )}

                                        {lineIndex <
                                            codeLines.length && (
                                            <p className='whitespace-pre'>
                                                {renderTypedLine(
                                                    codeLines[
                                                        lineIndex
                                                    ],
                                                    charIndex
                                                )}

                                                <span
                                                    className={`ml-0.5 inline-block h-4 w-[2px] bg-blue-400 align-middle transition-opacity duration-100 ${
                                                        showCursor
                                                            ? 'opacity-100'
                                                            : 'opacity-0'
                                                    }`}
                                                ></span>
                                            </p>
                                        )}

                                        {lineIndex >=
                                            codeLines.length && (
                                            <p className='mt-2 animate-pulse text-slate-600'>
                                                // AI is
                                                generating
                                                code...
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className='absolute -right-3 -top-3 flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-xs font-medium text-emerald-400 shadow-xl backdrop-blur transition-all duration-200 hover:scale-105 sm:-right-4 sm:-top-4'>
                                    <i className='ri-checkbox-circle-fill text-base'></i>
                                    Build Passing
                                </div>

                                <div className='absolute -bottom-3 -left-3 flex items-center gap-2 rounded-xl border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-xs font-medium text-blue-400 shadow-xl backdrop-blur transition-all duration-200 hover:scale-105 sm:-bottom-4 sm:-left-4'>
                                    <i className='ri-robot-2-line text-base'></i>
                                    AI Suggestion Ready
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className='mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16'>
                {/* Stats */}
                <div className='mb-16 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6'>
                    {stats.map((stat) => (
                        <div
                            key={stat.label}
                            className={`group rounded-2xl border bg-slate-900/80 p-6 backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/5 ${stat.border} ${stat.hoverBorder}`}
                        >
                            <div className='mb-4 flex items-center justify-between'>
                                <div
                                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.bg}`}
                                >
                                    <i
                                        className={`${stat.icon} text-xl ${stat.iconColor}`}
                                    ></i>
                                </div>
                                
                                <div className='opacity-0 transition-opacity duration-200 group-hover:opacity-100'>
                                    <i className='ri-arrow-up-line text-slate-600'></i>
                                </div>
                            </div>

                            <p className='mb-1 text-xs font-medium uppercase tracking-wider text-slate-500'>
                                {stat.label}
                            </p>

                            <p className='text-2xl font-bold text-white sm:text-3xl'>
                                {stat.value}
                            </p>

                            <p className='mt-1.5 text-xs text-slate-500'>
                                {stat.sub}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Projects */}
                <div
                    ref={projectsRef}
                    className='mb-16 scroll-mt-20'
                >
                    <div className='mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
                        <div>
                            <p className='mb-2 text-xs font-semibold uppercase tracking-widest text-blue-400'>
                                Your Workspace
                            </p>

                            <h2 className='text-2xl font-bold text-white sm:text-3xl'>
                                Recent Projects
                            </h2>
                            
                            <p className='mt-2 text-sm text-slate-500'>
                                {project.length} project{project.length !== 1 ? 's' : ''} in your workspace
                            </p>
                        </div>

                        <button
                            onClick={() =>
                                setIsModalOpen(true)
                            }
                            className='inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-all duration-200 hover:scale-[1.02] hover:bg-blue-500 hover:shadow-blue-500/30 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-950'
                        >
                            <i className='ri-add-line text-base'></i>
                            New Project
                        </button>
                    </div>

                    {project.length === 0 ? (
                        <div className='relative overflow-hidden rounded-2xl border-2 border-dashed border-slate-700 bg-slate-900/50 px-6 py-20 text-center backdrop-blur transition-all duration-300 hover:border-slate-600 sm:py-24'>
                            <div className='pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.05)_0%,transparent_70%)]'></div>
                            
                            <div className='relative'>
                                <div className='mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-500/10'>
                                    <i className='ri-folder-add-line text-4xl text-blue-400'></i>
                                </div>

                                <h3 className='mb-2 text-xl font-semibold text-white'>
                                    No projects yet
                                </h3>

                                <p className='mx-auto mb-8 max-w-md text-sm text-slate-400'>
                                    Create your first project and start coding with AI-powered assistance in seconds
                                </p>

                                <button
                                    onClick={() =>
                                        setIsModalOpen(true)
                                    }
                                    className='inline-flex cursor-pointer items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition-all duration-200 hover:scale-[1.02] hover:bg-blue-500 hover:shadow-blue-500/35 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-950'
                                >
                                    <i className='ri-rocket-line'></i>
                                    Create your first
                                    project
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className='grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6'>
                            {project.map(
                                (proj, index) => {
                                    const style =
                                        activityStyles[
                                            index %
                                                activityStyles.length
                                        ]

                                    return (
                                        <div
                                            key={
                                                proj._id
                                            }
                                            onClick={() =>
                                                openProject(
                                                    proj
                                                )
                                            }
                                            className='group relative cursor-pointer overflow-hidden rounded-2xl border border-slate-700/80 bg-slate-900/80 p-6 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/50 hover:bg-slate-900 hover:shadow-xl hover:shadow-blue-500/10'
                                        >
                                            {/* Subtle gradient overlay on hover */}
                                            <div className='pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-500/0 opacity-0 transition-opacity duration-300 group-hover:from-blue-500/5 group-hover:to-purple-500/5 group-hover:opacity-100'></div>
                                            
                                            <div className='relative'>
                                                <div className='mb-5 flex items-start justify-between'>
                                                    <div
                                                        className={`flex h-11 w-11 items-center justify-center rounded-xl ${style.bg} ${style.border}`}
                                                    >
                                                        <i
                                                            className={`ri-code-s-slash-line text-lg ${style.text}`}
                                                        ></i>
                                                    </div>

                                                    <button
                                                        onClick={(
                                                            e
                                                        ) => {
                                                            e.stopPropagation()

                                                            deleteProject(
                                                                proj._id
                                                            )
                                                        }}
                                                        className='rounded-lg p-2 text-slate-600 transition-all duration-200 hover:bg-red-500/10 hover:text-red-400 focus:outline-none focus:ring-2 focus:ring-red-500/50 md:opacity-0 md:group-hover:opacity-100'
                                                        aria-label="Delete project"
                                                    >
                                                        <i className='ri-delete-bin-6-line'></i>
                                                    </button>
                                                </div>

                                                <h3 className='mb-2 truncate text-base font-semibold text-white transition-colors duration-200 group-hover:text-blue-400'>
                                                    {
                                                        proj.name
                                                    }
                                                </h3>

                                                <p className='mb-4 text-sm text-slate-400'>
                                                    {
                                                        proj
                                                            .users
                                                            ?.length
                                                    }{' '}
                                                    member
                                                    {proj.users
                                                        ?.length !==
                                                    1
                                                        ? 's'
                                                        : ''}{' '}
                                                    ·{' '}
                                                    {timeAgo(
                                                        proj.updatedAt
                                                    )}
                                                </p>

                                                <div className='flex items-center justify-between border-t border-slate-800 pt-4'>
                                                    <span className='inline-flex items-center gap-1.5 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-400'>
                                                        <span className='h-1.5 w-1.5 rounded-full bg-blue-400'></span>
                                                        Active
                                                    </span>

                                                    <div className='flex items-center gap-1 text-slate-600 transition-all duration-200 group-hover:gap-2 group-hover:text-blue-400'>
                                                        <span className='text-xs font-medium'>Open</span>
                                                        <i className='ri-arrow-right-line text-sm'></i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }
                            )}
                        </div>
                    )}
                </div>

                {/* Features */}
                <div
                    ref={featuresRef}
                    className='mb-16 scroll-mt-20 border-t border-slate-800 pt-16'
                >
                    <div className='mb-12 text-center'>
                        <p className='mb-3 text-xs font-semibold uppercase tracking-widest text-blue-400'>
                            Features
                        </p>

                        <h2 className='mb-4 text-3xl font-bold text-white sm:text-4xl'>
                            Everything in one place
                        </h2>

                        <p className='mx-auto max-w-lg text-base text-slate-400'>
                            Built for developers who
                            move fast and collaborate
                            closely.
                        </p>
                    </div>

                    <div className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6'>
                        {features.map((feature) => (
                            <div
                                key={feature.title}
                                className={`group rounded-2xl border p-6 backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/5 ${feature.bg}`}
                            >
                                <div className='mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900/50 transition-all duration-300 group-hover:scale-110'>
                                    <i
                                        className={`${feature.icon} text-2xl ${feature.color}`}
                                    ></i>
                                </div>

                                <h3 className='mb-2 text-base font-semibold text-white'>
                                    {feature.title}
                                </h3>

                                <p className='text-sm leading-relaxed text-slate-400'>
                                    {feature.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* About */}
                <section
                    ref={aboutRef}
                    className='scroll-mt-20 border-t border-slate-800 pt-16'
                >
                    <div className='grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16'>
                        <div>
                            <p className='mb-3 text-xs font-semibold uppercase tracking-widest text-blue-400'>
                                About CodeSync
                            </p>

                            <h2 className='mb-5 text-3xl font-bold text-white sm:text-4xl'>
                                Code together, ship
                                faster
                            </h2>

                            <p className='mb-4 text-base leading-relaxed text-slate-400'>
                                CodeSync is a real-time collaborative coding platform where developers can
                                create projects, work together, communicate, and manage their code in one
                                shared workspace with AI-powered assistance.
                            </p>

                            <p className='mb-8 text-base leading-relaxed text-slate-400'>
                                Built with React,
                                Node.js, Socket.io,
                                Redis, WebContainers
                                API, and Google Gemini
                                — CodeSync is designed
                                for speed,
                                collaboration, and
                                developer joy.
                            </p>

                            <div className='flex flex-wrap gap-2'>
                                {[
                                    'React',
                                    'Node.js',
                                    'Socket.io',
                                    'Redis',
                                    'MongoDB',
                                    'Gemini AI',
                                    'WebContainers'
                                ].map((tag) => (
                                    <span
                                        key={tag}
                                        className='rounded-full border border-slate-700 bg-slate-900 px-4 py-1.5 text-xs font-medium text-slate-300 transition-all duration-200 hover:border-blue-500/50 hover:text-blue-400'
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-5'>
                            {[
                                {
                                    number: '01',
                                    title: 'AI Pair Programming',
                                    desc: 'Gemini reviews, writes, and debugs code with you in real time.'
                                },
                                {
                                    number: '02',
                                    title: 'Live Collaboration',
                                    desc: 'Multiple devs, one room — see edits and chat instantly.'
                                },
                                {
                                    number: '03',
                                    title: 'Zero Setup',
                                    desc: 'Run full Node.js projects in-browser via WebContainers.'
                                },
                                {
                                    number: '04',
                                    title: 'Persistent History',
                                    desc: 'Files and chats are saved — pick up anytime.'
                                }
                            ].map((item) => (
                                <div
                                    key={
                                        item.number
                                    }
                                    className='group rounded-2xl border border-slate-700/80 bg-slate-900/80 p-5 backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/5'
                                >
                                    <div className='mb-3 flex items-center justify-between'>
                                        <span className='text-xs font-bold text-blue-400'>
                                            {
                                                item.number
                                            }
                                        </span>
                                        <i className='ri-arrow-right-up-line text-slate-600 opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:text-blue-400'></i>
                                    </div>

                                    <h3 className='mb-2 text-sm font-semibold text-white'>
                                        {
                                            item.title
                                        }
                                    </h3>

                                    <p className='text-xs leading-relaxed text-slate-400'>
                                        {
                                            item.desc
                                        }
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </div>

            {/* New Project Modal */}
            {isModalOpen && (
                <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm'>
                    <div className='w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl shadow-black/50 sm:p-8'>
                        <div className='mb-6 flex items-center justify-between'>
                            <div>
                                <h2 className='text-lg font-semibold text-white'>
                                    New Project
                                </h2>
                                <p className='mt-1 text-xs text-slate-400'>
                                    Create a new collaborative workspace
                                </p>
                            </div>

                            <button
                                onClick={() =>
                                    setIsModalOpen(
                                        false
                                    )
                                }
                                className='rounded-full p-2 text-slate-400 transition-all duration-200 hover:bg-slate-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-slate-500'
                                aria-label="Close modal"
                            >
                                <i className='ri-close-line text-lg'></i>
                            </button>
                        </div>

                        <form
                            onSubmit={
                                createProject
                            }
                            className='space-y-5'
                        >
                            <div>
                                <label className='mb-2 block text-sm font-medium text-slate-300'>
                                    Project Name
                                </label>

                                <input
                                    type='text'
                                    value={
                                        projectName
                                    }
                                    onChange={(e) =>
                                        setProjectName(
                                            e.target
                                                .value
                                        )
                                    }
                                    placeholder='e.g. auth-service, landing-page'
                                    className='w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none transition-all duration-200 placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                                    required
                                    autoFocus
                                />
                            </div>

                            <div className='flex justify-end gap-3 pt-2'>
                                <button
                                    type='button'
                                    onClick={() =>
                                        setIsModalOpen(
                                            false
                                        )
                                    }
                                    className='rounded-xl border border-slate-700 px-5 py-2.5 text-sm font-medium text-slate-300 transition-all duration-200 hover:border-slate-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-slate-500'
                                >
                                    Cancel
                                </button>

                                <button
                                    type='submit'
                                    className='rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition-all duration-200 hover:scale-[1.02] hover:bg-blue-500 hover:shadow-blue-500/35 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900'
                                >
                                    Create Project
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </main>
    )
}

export default Home