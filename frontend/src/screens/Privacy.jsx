import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Privacy = () => {
    const navigate = useNavigate();
    const [isScrolled, setIsScrolled] = useState(false);
    const [copiedSection, setCopiedSection] = useState(null);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 300);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleCopyLink = async (sectionId) => {
        const url = `${window.location.origin}${window.location.pathname}#${sectionId}`;
        try {
            await navigator.clipboard.writeText(url);
            setCopiedSection(sectionId);
            setTimeout(() => setCopiedSection(null), 2000);
        } catch {
            const textArea = document.createElement('textarea');
            textArea.value = url;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            setCopiedSection(sectionId);
            setTimeout(() => setCopiedSection(null), 2000);
        }
    };

    const handleBack = () => {
        if (window.history.length > 1) {
            navigate(-1);
        } else {
            navigate('/');
        }
    };

    const sections = [
        { 
            id: 'information', 
            number: '01',
            title: 'Information We Collect', 
            icon: 'ri-database-2-line' 
        },
        { 
            id: 'usage', 
            number: '02',
            title: 'How We Use Your Information', 
            icon: 'ri-bar-chart-2-line' 
        },
        { 
            id: 'ai', 
            number: '03',
            title: 'AI Processing', 
            icon: 'ri-robot-line' 
        },
        { 
            id: 'storage', 
            number: '04',
            title: 'Data Storage', 
            icon: 'ri-server-line' 
        },
        { 
            id: 'cookies', 
            number: '05',
            title: 'Cookies & Sessions', 
            icon: 'ri-cookie-line' 
        },
        { 
            id: 'third-party', 
            number: '06',
            title: 'Third-Party Services', 
            icon: 'ri-share-box-line' 
        },
        { 
            id: 'sharing', 
            number: '07',
            title: 'Data Sharing', 
            icon: 'ri-share-forward-line' 
        },
        { 
            id: 'newsletter', 
            number: '08',
            title: 'Newsletter', 
            icon: 'ri-mail-send-line' 
        },
        { 
            id: 'rights', 
            number: '09',
            title: 'Your Rights', 
            icon: 'ri-user-settings-line' 
        },
        { 
            id: 'changes', 
            number: '10',
            title: 'Changes to This Policy', 
            icon: 'ri-file-edit-line' 
        }
    ];

    useEffect(() => {
        if (window.location.hash) {
            const id = window.location.hash.replace('#', '');
            setTimeout(() => {
                const element = document.getElementById(id);
                if (element) {
                    const offset = 80;
                    const elementPosition = element.offsetTop - offset;
                    window.scrollTo({
                        top: elementPosition,
                        behavior: 'smooth'
                    });
                }
            }, 100);
        }
    }, []);

    return (
        <main className='min-h-screen bg-slate-900'>
            {/* Sticky Back Button */}
            <div className='sticky top-0 z-40 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800 px-4 sm:px-6 lg:px-8 py-3'>
                <div className='max-w-4xl mx-auto flex items-center justify-between'>
                    <button 
                        onClick={handleBack} 
                        className='group flex items-center gap-2 text-slate-400 hover:text-white transition-colors duration-200 text-sm'
                    >
                        <svg className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        <span className='hidden sm:inline'>Back</span>
                    </button>
                    <span className='text-xs text-slate-600'>Privacy Policy</span>
                </div>
            </div>

            <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12'>
                {/* Hero Section */}
                <div className='mb-12 sm:mb-16'>
                    <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 mb-4'>
                        <span className='w-1.5 h-1.5 rounded-full bg-blue-500'></span>
                        <span className='text-[10px] font-medium text-slate-400 tracking-wider uppercase'>Legal & Privacy</span>
                    </div>
                    
                    <h1 className='text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 tracking-tight'>
                        Privacy Policy
                    </h1>
                    <p className='text-sm text-slate-400 max-w-2xl leading-relaxed'>
                        At CodeSync, we are committed to protecting your privacy. This policy outlines how we collect, use, and safeguard your information when you use our collaborative development platform.
                    </p>
                    <div className='flex items-center gap-4 mt-4 text-xs text-slate-500'>
                        <span className='flex items-center gap-1.5'>
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Last updated: June 13, 2026
                        </span>
                        <span className='w-px h-3 bg-slate-700'></span>
                        <span className='flex items-center gap-1.5'>
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            Version 2.0
                        </span>
                    </div>
                </div>

                {/* Content */}
                <div className='space-y-8'>
                    {sections.map((section, index) => (
                        <section 
                            key={section.id} 
                            id={section.id} 
                            className='scroll-mt-24 rounded-xl border border-slate-800 bg-slate-900/50 hover:border-slate-700/70 transition-all duration-200'
                        >
                            <div className='p-5 sm:p-6 lg:p-8'>
                                <div className='flex items-start gap-4'>
                                    <div className='flex-shrink-0'>
                                        <div className='w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center'>
                                            <span className='text-xs font-mono text-slate-500'>{section.number}</span>
                                        </div>
                                    </div>
                                    <div className='flex-1 min-w-0'>
                                        <div className='flex items-start justify-between gap-4'>
                                            <div className='flex items-center gap-3'>
                                                <i className={`${section.icon} text-blue-400 text-base flex-shrink-0`}></i>
                                                <h2 className='text-base sm:text-lg font-semibold text-white'>
                                                    {section.title}
                                                </h2>
                                            </div>
                                            <button 
                                                onClick={() => handleCopyLink(section.id)}
                                                className={`flex-shrink-0 p-1.5 rounded-md transition-all duration-200 ${
                                                    copiedSection === section.id 
                                                        ? 'text-green-400 bg-green-500/20' 
                                                        : 'text-slate-600 hover:text-slate-300 hover:bg-slate-800'
                                                }`}
                                                title="Copy link to section"
                                            >
                                                {copiedSection === section.id ? (
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                ) : (
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                                    </svg>
                                                )}
                                            </button>
                                        </div>
                                        <div className='mt-3 text-sm text-slate-400 leading-relaxed'>
                                            {section.id === 'ai' && (
                                                <div className='bg-amber-500/5 border border-amber-500/20 rounded-lg p-4 mb-3'>
                                                    <div className='flex items-start gap-2'>
                                                        <svg className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        <div>
                                                            <p className='text-amber-400 text-xs font-medium mb-0.5'>AI Privacy Note</p>
                                                            <p className='text-xs text-slate-400'>When you interact with CodeSync's AI assistant, your messages and relevant project context may be processed to generate responses. Please avoid sharing sensitive personal information in AI chats.</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            
                                            {section.id === 'information' && (
                                                <p>CodeSync collects information you provide directly, including your name and email address during account registration, as well as content you create within projects such as code, chat messages, and file structures.</p>
                                            )}

                                            {section.id === 'usage' && (
                                                <p>We use your information to deliver and improve CodeSync's services, authenticate your account via OTP, enable real-time collaboration features, and send updates if you subscribe to our newsletter.</p>
                                            )}

                                            {section.id === 'storage' && (
                                                <p>Your account information and project data are stored securely in our database. We implement reasonable measures to protect your data from unauthorized access.</p>
                                            )}

                                            {section.id === 'cookies' && (
                                                <p>CodeSync uses cookies and local storage to maintain your login session and preferences. These are essential for the platform to function and are not used for advertising or tracking purposes.</p>
                                            )}

                                            {section.id === 'third-party' && (
                                                <p>CodeSync integrates with third-party services including Google Gemini for AI-powered assistance and Redis for session management. These services operate under their own privacy policies.</p>
                                            )}

                                            {section.id === 'sharing' && (
                                                <p>CodeSync does not sell your personal data. Project data is shared only with collaborators you explicitly invite to your projects through the platform's collaboration features.</p>
                                            )}

                                            {section.id === 'newsletter' && (
                                                <p>If you subscribe to CodeSync's newsletter, your email address is used solely for sending product updates and announcements. You can unsubscribe at any time through the link in each email.</p>
                                            )}

                                            {section.id === 'rights' && (
                                                <p>You have the right to access, update, or delete your account information. You can manage your profile settings directly through the platform. For any privacy-related inquiries, contact support through the platform.</p>
                                            )}

                                            {section.id === 'changes' && (
                                                <p>CodeSync may update this Privacy Policy periodically. Significant changes will be communicated through the platform or via email notifications.</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    ))}
                </div>

                {/* Bottom Section */}
                <div className='mt-12 pt-8 border-t border-slate-800'>
                    <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
                        <p className='text-xs text-slate-500 flex items-center gap-2'>
                            <svg className="w-3.5 h-3.5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            Your privacy matters to us.
                        </p>
                        <div className='flex items-center gap-4 text-xs'>
                            <button 
                                onClick={() => navigate('/terms')} 
                                className='text-slate-500 hover:text-slate-300 transition-colors duration-200'
                            >
                                Terms of Service
                            </button>
                            <span className='text-slate-700'>|</span>
                            <button 
                                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
                                className='text-slate-500 hover:text-slate-300 transition-colors duration-200 flex items-center gap-1'
                            >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                                </svg>
                                Back to top
                            </button>
                        </div>
                    </div>
                    
                    <div className='mt-6 text-center'>
                        <p className='text-[10px] text-slate-600'>
                            Built and maintained by Shaikh Altaf Anzar
                        </p>
                        <p className='text-[10px] text-slate-700 mt-1'>
                            © {new Date().getFullYear()} CodeSync. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>

            {/* Floating Back to Top Button */}
            {isScrolled && (
                <button
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className='fixed bottom-6 right-6 w-11 h-11 bg-slate-800 hover:bg-slate-700 text-white rounded-full shadow-lg shadow-black/30 border border-slate-700 transition-all duration-300 hover:scale-105 flex items-center justify-center z-50 group'
                    aria-label='Back to top'
                >
                    <svg className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                </button>
            )}
        </main>
    );
};

export default Privacy;