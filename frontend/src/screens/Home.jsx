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
                bg: 'bg-blue-900/40',
                iconColor: 'text-blue-400',
                border: 'border-blue-800/30'
            },
            {
                label: 'Collaborators',
                value: totalCollaborators,
                sub: 'across all projects',
                icon: 'ri-team-line',
                bg: 'bg-green-900/40',
                iconColor: 'text-green-400',
                border: 'border-green-800/30'
            },
            {
                label: 'AI Chats',
                value: aiQueriesToday,
                sub: 'Gemini queries today',
                icon: 'ri-robot-line',
                bg: 'bg-amber-900/40',
                iconColor: 'text-amber-400',
                border: 'border-amber-800/30'
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
                bg: 'bg-purple-900/40',
                iconColor: 'text-purple-400',
                border: 'border-purple-800/30'
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
            bg: 'bg-blue-900/50',
            text: 'text-blue-400'
        },
        {
            bg: 'bg-green-900/50',
            text: 'text-green-400'
        },
        {
            bg: 'bg-amber-900/50',
            text: 'text-amber-400'
        },
        {
            bg: 'bg-purple-900/50',
            text: 'text-purple-400'
        }
    ]

    const features = [
        {
            icon: 'ri-robot-2-line',
            color: 'text-blue-400',
            bg: 'bg-blue-900/30 border-blue-800/40',
            title: 'AI-Powered Coding',
            desc: 'Ask Gemini to generate full file trees, write boilerplate, or debug — all from the chat panel.'
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
            desc: 'Full file tree editor — create, rename, and delete files without leaving the browser.'
        },
        {
            icon: 'ri-message-3-line',
            color: 'text-pink-400',
            bg: 'bg-pink-900/30 border-pink-800/40',
            title: 'Persistent Chat',
            desc: 'Project chat history is saved — pick up conversations where you left off.'
        },
        {
            icon: 'ri-shield-keyhole-line',
            color: 'text-cyan-400',
            bg: 'bg-cyan-900/30 border-cyan-800/40',
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
                t: '      Hello, DevRoom! 🚀',
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
        <main className='min-h-screen w-full overflow-x-hidden bg-slate-900 text-white'>
            {/* Pending Invites */}
            {pendingInvites.length > 0 && (
                <div className='border-b border-blue-800/40 bg-blue-950/60'>
                    <div className='mx-auto flex max-w-6xl flex-col gap-3 px-6 py-3 md:px-10'>
                        {pendingInvites.map((inv) => (
                            <div
                                key={inv.projectId}
                                className='flex flex-col justify-between gap-3 rounded-xl border border-blue-800/40 bg-slate-800/60 px-5 py-3 sm:flex-row sm:items-center'
                            >
                                <div className='flex min-w-0 items-center gap-2'>
                                    <i className='ri-mail-unread-line shrink-0 text-blue-400'></i>

                                    <p className='break-words text-sm text-white'>
                                        <span className='font-semibold'>
                                            {inv.invitedBy?.name ||
                                                inv
                                                    .invitedBy
                                                    ?.email}
                                        </span>{' '}
                                        invited you to{' '}
                                        <span className='font-semibold'>
                                            {inv.projectName}
                                        </span>
                                    </p>
                                </div>

                                <div className='flex shrink-0 items-center gap-2'>
                                    <button
                                        onClick={() =>
                                            respondToInvite(
                                                inv.projectId,
                                                'reject'
                                            )
                                        }
                                        className='rounded-lg border border-slate-600 px-3 py-1.5 text-xs text-slate-300 transition hover:bg-slate-700'
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
                                        className='rounded-lg bg-blue-600 px-3 py-1.5 text-xs text-white transition hover:bg-blue-500'
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
            <section className='border-b border-slate-800 bg-gradient-to-br from-blue-950/50 via-slate-900 to-slate-900'>
                <div className='mx-auto max-w-6xl px-6 py-14 md:px-10 md:py-28'>
                    <div className='flex flex-col items-center gap-12 lg:flex-row'>
                        <div className='w-full flex-1'>
                            <div className='mb-6 inline-flex items-center gap-2 rounded-full border border-blue-800/50 bg-blue-900/40 px-3 py-1.5 text-xs font-medium text-blue-400'>
                                <i className='ri-sparkling-line'></i>
                                Powered by Google Gemini AI
                            </div>

                            <h1 className='mb-4 text-3xl font-bold leading-tight tracking-tight md:text-5xl'>
                                Welcome back,{' '}
                                {user?.name?.split(' ')[0] ||
                                    'Developer'}
                                !
                            </h1>

                            <p className='mb-8 max-w-xl text-base text-slate-400 md:text-lg'>
                                {todayString} —{' '}
                                {project.length} active
                                project
                                {project.length !== 1
                                    ? 's'
                                    : ''}
                                . Ready to build something
                                great?
                            </p>

                            <div className='flex flex-wrap gap-3'>
                                <button
                                    onClick={() =>
                                        setIsModalOpen(
                                            true
                                        )
                                    }
                                    className='flex cursor-pointer items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold transition hover:bg-blue-500'
                                >
                                    <i className='ri-add-line'></i>
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
                                    className='flex cursor-pointer items-center gap-2 rounded-xl border border-slate-700 px-5 py-2.5 text-sm text-slate-300 transition hover:border-slate-500 hover:text-white'
                                >
                                    View Projects
                                </button>
                            </div>
                        </div>

                        {/* Animated Editor */}
                        <div className='w-full lg:max-w-md lg:flex-1'>
                            <div className='relative'>
                                <div className='flex h-[260px] flex-col overflow-hidden rounded-xl border border-slate-700 bg-slate-800/80 shadow-2xl backdrop-blur sm:h-[300px]'>
                                    <div className='flex items-center gap-2 border-b border-slate-700 bg-slate-900 px-4 py-2.5'>
                                        <div className='flex gap-1.5'>
                                            <span className='h-2.5 w-2.5 rounded-full bg-red-500'></span>
                                            <span className='h-2.5 w-2.5 rounded-full bg-yellow-500'></span>
                                            <span className='h-2.5 w-2.5 rounded-full bg-green-500'></span>
                                        </div>

                                        <span className='ml-2 text-xs text-slate-500'>
                                            App.jsx
                                        </span>
                                    </div>

                                    <div className='h-[300px] p-5 font-mono text-xs leading-relaxed'>
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
                                                    className={`ml-0.5 inline-block h-3.5 w-[2px] bg-blue-400 align-middle transition-opacity ${
                                                        showCursor
                                                            ? 'opacity-100'
                                                            : 'opacity-0'
                                                    }`}
                                                ></span>
                                            </p>
                                        )}

                                        {lineIndex >=
                                            codeLines.length && (
                                            <p className='mt-2 text-slate-600'>
                                                // AI is
                                                generating
                                                code...
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className='absolute -right-4 -top-4 flex items-center gap-2 rounded-lg border border-green-700/50 bg-green-900/80 px-3 py-1.5 text-xs font-medium text-green-400 shadow-lg backdrop-blur'>
                                    <i className='ri-checkbox-circle-fill'></i>
                                    Build Passing
                                </div>

                                <div className='absolute -bottom-4 -left-4 flex items-center gap-2 rounded-lg border border-blue-700/50 bg-blue-900/80 px-3 py-1.5 text-xs font-medium text-blue-400 shadow-lg backdrop-blur'>
                                    <i className='ri-robot-2-line'></i>
                                    AI Suggestion Ready
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className='mx-auto max-w-6xl px-6 py-10 md:px-10'>
                {/* Stats */}
                <div className='mb-12 grid grid-cols-2 gap-4 md:grid-cols-4'>
                    {stats.map((stat) => (
                        <div
                            key={stat.label}
                            className={`rounded-xl border bg-slate-800 p-5 ${stat.border}`}
                        >
                            <div
                                className={`mb-3 flex h-9 w-9 items-center justify-center rounded-lg ${stat.bg}`}
                            >
                                <i
                                    className={`${stat.icon} text-lg ${stat.iconColor}`}
                                ></i>
                            </div>

                            <p className='mb-1 text-xs text-slate-400'>
                                {stat.label}
                            </p>

                            <p className='text-xl font-semibold md:text-3xl'>
                                {stat.value}
                            </p>

                            <p className='mt-1 text-xs text-slate-500'>
                                {stat.sub}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Projects */}
                <div
                    ref={projectsRef}
                    className='mb-12'
                >
                    <div className='mb-5 flex items-center justify-between'>
                        <div>
                            <p className='mb-1 text-xs font-medium uppercase tracking-widest text-blue-400'>
                                Your Work
                            </p>

                            <h2 className='text-xl font-bold'>
                                Recent Projects
                            </h2>
                        </div>

                        <button
                            onClick={() =>
                                setIsModalOpen(true)
                            }
                            className='flex cursor-pointer items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium transition hover:bg-blue-500'
                        >
                            <i className='ri-add-line'></i>
                            New
                        </button>
                    </div>

                    {project.length === 0 ? (
                        <div className='rounded-xl border border-dashed border-slate-700 bg-slate-800 p-16 text-center'>
                            <i className='ri-folder-add-line mb-4 block text-4xl text-slate-600'></i>

                            <p className='mb-2 font-medium text-slate-400'>
                                No projects yet
                            </p>

                            <p className='mb-5 text-sm text-slate-500'>
                                Create your first project
                                and start coding with AI
                            </p>

                            <button
                                onClick={() =>
                                    setIsModalOpen(true)
                                }
                                className='cursor-pointer rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold transition hover:bg-blue-500'
                            >
                                Create your first
                                project
                            </button>
                        </div>
                    ) : (
                        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
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
                                            className='group cursor-pointer rounded-xl border border-slate-700 bg-slate-800 p-5 transition hover:border-blue-700/50 hover:bg-slate-700'
                                        >
                                            <div className='mb-4 flex items-start justify-between'>
                                                <div
                                                    className={`flex h-10 w-10 items-center justify-center rounded-lg ${style.bg}`}
                                                >
                                                    <i
                                                        className={`ri-code-s-slash-line ${style.text}`}
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
                                                    className='rounded-lg p-1.5 text-slate-500 opacity-100 transition hover:bg-red-500/20 hover:text-red-400 md:opacity-0 md:group-hover:opacity-100'
                                                >
                                                    <i className='ri-delete-bin-6-line text-sm'></i>
                                                </button>
                                            </div>

                                            <h3 className='mb-1 truncate text-sm font-semibold'>
                                                {
                                                    proj.name
                                                }
                                            </h3>

                                            <p className='text-xs text-slate-400'>
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

                                            <div className='mt-4 flex items-center justify-between'>
                                                <span className='rounded-full border border-blue-700/50 bg-blue-900/50 px-2 py-0.5 text-xs text-blue-400'>
                                                    Active
                                                </span>

                                                <i className='ri-arrow-right-line text-slate-600 transition group-hover:text-blue-400'></i>
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
                    className='mb-12 border-t border-slate-800 py-10'
                >
                    <div className='mb-10 text-center'>
                        <p className='mb-3 text-xs font-medium uppercase tracking-widest text-blue-400'>
                            Features
                        </p>

                        <h2 className='mb-3 text-2xl font-bold md:text-3xl'>
                            Everything in one place
                        </h2>

                        <p className='mx-auto max-w-lg text-sm text-slate-400'>
                            Built for developers who
                            move fast and collaborate
                            closely.
                        </p>
                    </div>

                    <div className='grid grid-cols-1 gap-5 md:grid-cols-3'>
                        {features.map((feature) => (
                            <div
                                key={feature.title}
                                className={`rounded-xl border p-6 ${feature.bg}`}
                            >
                                <i
                                    className={`${feature.icon} mb-4 block text-2xl ${feature.color}`}
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

                {/* About */}
                <section
                    ref={aboutRef}
                    className='border-t border-slate-800 py-20'
                >
                    <div className='grid grid-cols-1 items-center gap-10 md:grid-cols-2'>
                        <div>
                            <p className='mb-3 text-xs font-medium uppercase tracking-widest text-blue-400'>
                                About DevRoom
                            </p>

                            <h2 className='mb-4 text-3xl font-bold md:text-4xl'>
                                Code together, ship
                                faster
                            </h2>

                            <p className='mb-4 text-sm leading-relaxed text-slate-400'>
                                DevRoom is a
                                collaborative coding
                                platform where your team
                                and Gemini AI work in
                                the same room —
                                real-time editor,
                                in-browser terminal,
                                and persistent chat.
                            </p>

                            <p className='mb-6 text-sm leading-relaxed text-slate-400'>
                                Built with React,
                                Node.js, Socket.io,
                                Redis, WebContainers
                                API, and Google Gemini
                                — DevRoom is designed
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
                                        className='rounded-full border border-slate-700 bg-slate-800 px-3 py-1 text-xs text-slate-300'
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className='grid grid-cols-2 gap-4'>
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
                                    className='rounded-xl border border-slate-700 bg-slate-800 p-4'
                                >
                                    <span className='text-xs font-bold text-blue-400'>
                                        {
                                            item.number
                                        }
                                    </span>

                                    <h3 className='mb-1 mt-2 text-sm font-semibold'>
                                        {
                                            item.title
                                        }
                                    </h3>

                                    <p className='text-xs text-slate-400'>
                                        {
                                            item.desc
                                        }
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Developer */}
                    <div className='mt-12 border-t border-slate-800 pt-10 text-center'>
                        <p className='mb-2 text-xs font-medium uppercase tracking-widest text-blue-400'>
                            About the Developer
                        </p>

                        <p className='mx-auto mb-5 max-w-xl text-sm leading-relaxed text-slate-400'>
                            DevRoom is created and
                            maintained by{' '}
                            <span className='font-semibold text-white'>
                                Shaikh Altaf
                            </span>
                            , a Computer Science
                            student passionate about
                            building full-stack,
                            AI-powered applications
                            and developer tools.
                        </p>

                        <div className='flex flex-wrap items-center justify-center gap-2 md:gap-3'>
                            <a
                                href='https://github.com/altafshaikh7'
                                target='_blank'
                                rel='noreferrer'
                                className='inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-slate-400 transition hover:bg-slate-800 hover:text-white'
                            >
                                <i className='ri-github-line text-base leading-none'></i>
                                <span>
                                    altafshaikh7
                                </span>
                            </a>

                            <a
                                href='https://www.linkedin.com/'
                                target='_blank'
                                rel='noreferrer'
                                className='inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-slate-400 transition hover:bg-slate-800 hover:text-white'
                            >
                                <i className='ri-linkedin-line text-base leading-none'></i>
                                <span>
                                    LinkedIn
                                </span>
                            </a>

                            <a
                                href='https://shaikhaltaf.netlify.app'
                                target='_blank'
                                rel='noreferrer'
                                className='inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-slate-400 transition hover:bg-slate-800 hover:text-white'
                            >
                                <i className='ri-user-line text-base leading-none'></i>
                                <span>
                                    Portfolio
                                </span>
                            </a>
                        </div>
                    </div>
                </section>
            </div>

            {/* New Project Modal */}
            {isModalOpen && (
                <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4'>
                    <div className='w-full max-w-md rounded-2xl border border-slate-700 bg-slate-800 p-6 shadow-2xl'>
                        <div className='mb-5 flex items-center justify-between'>
                            <h2 className='text-lg font-semibold'>
                                New Project
                            </h2>

                            <button
                                onClick={() =>
                                    setIsModalOpen(
                                        false
                                    )
                                }
                                className='rounded-full p-2 text-slate-400 transition hover:bg-slate-700'
                            >
                                ✕
                            </button>
                        </div>

                        <form
                            onSubmit={
                                createProject
                            }
                            className='space-y-4'
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
                                    className='w-full rounded-lg border border-slate-600 bg-slate-700 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-blue-500'
                                    required
                                />
                            </div>

                            <div className='flex justify-end gap-3 pt-1'>
                                <button
                                    type='button'
                                    onClick={() =>
                                        setIsModalOpen(
                                            false
                                        )
                                    }
                                    className='rounded-lg border border-slate-600 px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-700'
                                >
                                    Cancel
                                </button>

                                <button
                                    type='submit'
                                    className='rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-500'
                                >
                                    Create
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