import { useState, useContext, useRef, useEffect } from 'react';
import { UserContext } from '../context/user.context';
import axios from '../config/axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const { user, setUser } = useContext(UserContext);
    const navigate = useNavigate();

    const [name, setName] = useState(user?.name || '');
    const [avatarPreview, setAvatarPreview] = useState(user?.avatar || '');
    const [avatarFile, setAvatarFile] = useState(null);
    const fileInputRef = useRef(null);

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [newEmail, setNewEmail] = useState('');
    const [emailOtpSent, setEmailOtpSent] = useState(false);
    const [emailOtp, setEmailOtp] = useState('');

    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Hide navbar on mount
    useEffect(() => {
        // Find and hide navbar
        const navbar = document.querySelector('nav') || document.querySelector('.navbar');
        if (navbar) {
            navbar.style.display = 'none';
        }

        // Show navbar on unmount
        return () => {
            const navbar = document.querySelector('nav') || document.querySelector('.navbar');
            if (navbar) {
                navbar.style.display = '';
            }
        };
    }, []);

    function showApiError(err, fallback = 'Something went wrong') {
        const data = err.response?.data;
        if (data?.errors?.length) data.errors.forEach((e) => toast.error(e.msg));
        else toast.error(data?.message || fallback);
    }

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image size must be less than 5MB');
            return;
        }
        setAvatarFile(file);
        setAvatarPreview(URL.createObjectURL(file));
    };

    const handleAvatarUpload = async () => {
        if (!avatarFile) return;
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('avatar', avatarFile);
            const res = await axios.put('/users/update-avatar', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setUser(res.data.user);
            setAvatarFile(null);
            toast.success('Profile picture updated!');
        } catch (err) {
            showApiError(err, 'Failed to upload avatar');
        } finally {
            setUploading(false);
        }
    };

    const handleAvatarRemove = () => {
        setAvatarPreview('');
        setAvatarFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleNameUpdate = async () => {
        if (!name.trim()) {
            toast.error('Name cannot be empty');
            return;
        }
        if (name.trim() === user?.name) return;
        setLoading(true);
        try {
            const res = await axios.put('/users/update-profile', { name: name.trim() });
            setUser(res.data.user);
            toast.success('Name updated!');
        } catch (err) {
            showApiError(err, 'Failed to update name');
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordUpdate = async () => {
        if (!currentPassword || !newPassword) {
            toast.error('Please fill in all password fields');
            return;
        }
        if (newPassword.length < 6) {
            toast.error('New password must be at least 6 characters');
            return;
        }
        if (newPassword !== confirmPassword) {
            toast.error("Passwords don't match");
            return;
        }
        setLoading(true);
        try {
            await axios.put('/users/update-password', { currentPassword, newPassword });
            toast.success('Password updated!');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err) {
            showApiError(err, 'Failed to update password');
        } finally {
            setLoading(false);
        }
    };

    const handleRequestEmailOtp = async () => {
        if (!newEmail) {
            toast.error('Please enter a new email address');
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
            toast.error('Please enter a valid email address');
            return;
        }
        if (newEmail === user?.email) {
            toast.error('New email must be different from current');
            return;
        }
        setLoading(true);
        try {
            await axios.post('/users/request-email-change', { newEmail });
            setEmailOtpSent(true);
            toast.success('OTP sent to new email!');
        } catch (err) {
            showApiError(err, 'Failed to send OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyEmailOtp = async () => {
        if (!emailOtp || emailOtp.length !== 6) {
            toast.error('Please enter a valid 6-digit OTP');
            return;
        }
        setLoading(true);
        try {
            const res = await axios.post('/users/verify-email-change', { otp: emailOtp });
            setUser(res.data.user);
            setEmailOtpSent(false);
            setNewEmail('');
            setEmailOtp('');
            toast.success('Email updated!');
        } catch (err) {
            showApiError(err, 'Failed to verify OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelEmailChange = () => {
        setEmailOtpSent(false);
        setEmailOtp('');
        setNewEmail('');
    };

    const handleBack = () => {
        // Try to go back first
        if (window.history.length > 2) {
            navigate(-1);
        } else {
            // Fallback to home
            navigate('/home');
        }
    };

    const getInitials = (name) => {
        if (!name) return 'U';
        return name.charAt(0).toUpperCase();
    };

    return (
        <main className='min-h-screen bg-slate-900'>
            {/* Sticky Header with Back Button */}
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
                    <span className='text-xs text-slate-600'>Account Settings</span>
                </div>
            </div>

            <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12'>
                {/* Header */}
                <div className='mb-8'>
                    <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 mb-3'>
                        <span className='w-1.5 h-1.5 rounded-full bg-blue-500'></span>
                        <span className='text-[10px] font-medium text-slate-400 tracking-wider uppercase'>Account Settings</span>
                    </div>
                    <h1 className='text-2xl sm:text-3xl font-bold text-white'>Profile & Settings</h1>
                    <p className='text-sm text-slate-400 mt-1'>Manage your profile information, email, and account security</p>
                </div>

                {/* Profile Overview Card */}
                <div className='bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden hover:border-slate-600/70 transition-all duration-200 mb-6'>
                    <div className='p-5 sm:p-6'>
                        <div className='flex flex-col sm:flex-row items-start sm:items-center gap-5'>
                            <div className='relative group'>
                                <div className='w-20 h-20 rounded-full bg-gradient-to-br from-blue-500/30 to-cyan-500/30 flex items-center justify-center text-white text-2xl font-semibold overflow-hidden ring-2 ring-slate-700 group-hover:ring-blue-500/50 transition-all duration-200'>
                                    {avatarPreview ? (
                                        <img src={avatarPreview} alt='avatar' className='w-full h-full object-cover' />
                                    ) : (
                                        getInitials(user?.name)
                                    )}
                                </div>
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className='absolute -bottom-1 -right-1 p-1.5 rounded-full bg-slate-700 border border-slate-600 hover:bg-slate-600 transition-colors duration-200'
                                    title='Change avatar'
                                >
                                    <svg className="w-3.5 h-3.5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                    </svg>
                                </button>
                                <input
                                    ref={fileInputRef}
                                    type='file'
                                    accept='image/*'
                                    onChange={handleAvatarChange}
                                    className='hidden'
                                />
                            </div>
                            <div className='flex-1 min-w-0'>
                                <h2 className='text-lg font-semibold text-white truncate'>{user?.name || 'User'}</h2>
                                <p className='text-sm text-slate-400 truncate'>{user?.email}</p>
                                <div className='flex items-center gap-3 mt-1.5'>
                                    <span className='flex items-center gap-1 text-xs text-green-400'>
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Verified
                                    </span>
                                    <span className='w-px h-3 bg-slate-700'></span>
                                    <span className='text-xs text-slate-500'>Member</span>
                                </div>
                            </div>
                            <div className='flex flex-col sm:flex-row gap-2 w-full sm:w-auto'>
                                {avatarFile ? (
                                    <>
                                        <button 
                                            onClick={handleAvatarUpload} 
                                            disabled={uploading}
                                            className='flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 rounded-lg text-sm font-medium text-white transition-colors duration-200'
                                        >
                                            {uploading ? (
                                                <>
                                                    <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                    </svg>
                                                    Uploading...
                                                </>
                                            ) : (
                                                'Save Picture'
                                            )}
                                        </button>
                                        <button 
                                            onClick={handleAvatarRemove}
                                            className='px-4 py-2 border border-slate-600 hover:bg-slate-700 rounded-lg text-sm text-slate-300 transition-colors duration-200'
                                        >
                                            Cancel
                                        </button>
                                    </>
                                ) : (
                                    <button 
                                        onClick={() => fileInputRef.current?.click()}
                                        className='px-4 py-2 border border-slate-600 hover:bg-slate-700 rounded-lg text-sm text-slate-300 transition-colors duration-200'
                                    >
                                        Change Photo
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Personal Information */}
                <div className='bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden hover:border-slate-600/70 transition-all duration-200 mb-6'>
                    <div className='px-5 sm:px-6 py-4 border-b border-slate-700'>
                        <div className='flex items-center gap-3'>
                            <i className='ri-user-line text-blue-400 text-sm'></i>
                            <h2 className='text-sm font-semibold text-white'>Personal Information</h2>
                        </div>
                    </div>
                    <div className='p-5 sm:p-6'>
                        <div className='space-y-1.5 mb-3'>
                            <label className='text-sm font-medium text-slate-300'>Display Name</label>
                            <p className='text-xs text-slate-500'>This is the name that will be displayed on your profile and in collaboration sessions</p>
                        </div>
                        <div className='flex flex-col sm:flex-row gap-3'>
                            <input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder='Enter your name'
                                className='flex-1 w-full px-4 py-2.5 rounded-lg bg-slate-700 border border-slate-600 text-sm text-white outline-none focus:border-blue-500 placeholder-slate-500 transition-colors duration-200'
                            />
                            <button 
                                onClick={handleNameUpdate} 
                                disabled={loading || !name.trim() || name.trim() === user?.name}
                                className='px-6 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:hover:bg-blue-600 rounded-lg text-sm font-medium text-white transition-colors duration-200 whitespace-nowrap'
                            >
                                {loading ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Email Address */}
                <div className='bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden hover:border-slate-600/70 transition-all duration-200 mb-6'>
                    <div className='px-5 sm:px-6 py-4 border-b border-slate-700'>
                        <div className='flex items-center gap-3'>
                            <i className='ri-mail-line text-blue-400 text-sm'></i>
                            <h2 className='text-sm font-semibold text-white'>Email Address</h2>
                        </div>
                    </div>
                    <div className='p-5 sm:p-6'>
                        <div className='flex items-center gap-2 text-sm mb-4'>
                            <span className='text-slate-400'>Current:</span>
                            <span className='text-white font-medium'>{user?.email}</span>
                            {user?.isVerified && (
                                <span className='flex items-center gap-1 text-xs text-green-400'>
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Verified
                                </span>
                            )}
                        </div>

                        {!emailOtpSent ? (
                            <div className='space-y-2'>
                                <div className='flex flex-col sm:flex-row gap-3'>
                                    <input
                                        type='email'
                                        value={newEmail}
                                        onChange={(e) => setNewEmail(e.target.value)}
                                        placeholder='Enter new email address'
                                        className='flex-1 w-full px-4 py-2.5 rounded-lg bg-slate-700 border border-slate-600 text-sm text-white outline-none focus:border-blue-500 placeholder-slate-500 transition-colors duration-200'
                                    />
                                    <button 
                                        onClick={handleRequestEmailOtp} 
                                        disabled={loading || !newEmail}
                                        className='px-6 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:hover:bg-blue-600 rounded-lg text-sm font-medium text-white transition-colors duration-200 whitespace-nowrap'
                                    >
                                        {loading ? 'Sending...' : 'Send Verification Code'}
                                    </button>
                                </div>
                                <p className='text-xs text-slate-500'>We'll send a verification code to the new email address to confirm the change</p>
                            </div>
                        ) : (
                            <div className='space-y-3'>
                                <div className='flex items-center gap-2 text-sm'>
                                    <span className='text-slate-400'>Verification sent to:</span>
                                    <span className='text-white font-medium'>{newEmail}</span>
                                </div>
                                <div className='flex flex-col sm:flex-row gap-3'>
                                    <input
                                        value={emailOtp}
                                        onChange={(e) => setEmailOtp(e.target.value.replace(/[^0-9]/g, ''))}
                                        placeholder='Enter 6-digit code'
                                        maxLength={6}
                                        className='flex-1 w-full px-4 py-2.5 rounded-lg bg-slate-700 border border-slate-600 text-sm text-white text-center tracking-[8px] font-bold outline-none focus:border-blue-500 placeholder-slate-500 transition-colors duration-200'
                                    />
                                    <div className='flex gap-3'>
                                        <button 
                                            onClick={handleVerifyEmailOtp} 
                                            disabled={loading || emailOtp.length !== 6}
                                            className='flex-1 sm:flex-none px-6 py-2.5 bg-green-600 hover:bg-green-500 disabled:opacity-50 disabled:hover:bg-green-600 rounded-lg text-sm font-medium text-white transition-colors duration-200'
                                        >
                                            {loading ? 'Verifying...' : 'Verify'}
                                        </button>
                                        <button 
                                            onClick={handleCancelEmailChange}
                                            className='flex-1 sm:flex-none px-4 py-2.5 border border-slate-600 hover:bg-slate-700 rounded-lg text-sm text-slate-300 transition-colors duration-200'
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                                <p className='text-xs text-slate-500'>Enter the 6-digit verification code sent to your new email address</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Password */}
                <div className='bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden hover:border-slate-600/70 transition-all duration-200'>
                    <div className='px-5 sm:px-6 py-4 border-b border-slate-700'>
                        <div className='flex items-center gap-3'>
                            <i className='ri-lock-line text-blue-400 text-sm'></i>
                            <h2 className='text-sm font-semibold text-white'>Password & Security</h2>
                        </div>
                    </div>
                    <div className='p-5 sm:p-6'>
                        <div className='space-y-3'>
                            <div className='relative'>
                                <label className='text-xs font-medium text-slate-400 mb-1 block'>Current Password</label>
                                <input
                                    type={showCurrentPassword ? 'text' : 'password'}
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    placeholder='Enter your current password'
                                    className='w-full px-4 py-2.5 rounded-lg bg-slate-700 border border-slate-600 text-sm text-white outline-none focus:border-blue-500 placeholder-slate-500 transition-colors duration-200 pr-10'
                                />
                                <button
                                    type='button'
                                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                    className='absolute right-3 bottom-2.5 text-slate-500 hover:text-slate-300 transition-colors duration-200'
                                >
                                    <i className={showCurrentPassword ? 'ri-eye-off-line' : 'ri-eye-line'}></i>
                                </button>
                            </div>
                            <div className='relative'>
                                <label className='text-xs font-medium text-slate-400 mb-1 block'>New Password</label>
                                <input
                                    type={showNewPassword ? 'text' : 'password'}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder='Enter new password'
                                    className='w-full px-4 py-2.5 rounded-lg bg-slate-700 border border-slate-600 text-sm text-white outline-none focus:border-blue-500 placeholder-slate-500 transition-colors duration-200 pr-10'
                                />
                                <button
                                    type='button'
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    className='absolute right-3 bottom-2.5 text-slate-500 hover:text-slate-300 transition-colors duration-200'
                                >
                                    <i className={showNewPassword ? 'ri-eye-off-line' : 'ri-eye-line'}></i>
                                </button>
                            </div>
                            <div className='relative'>
                                <label className='text-xs font-medium text-slate-400 mb-1 block'>Confirm New Password</label>
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder='Confirm new password'
                                    className='w-full px-4 py-2.5 rounded-lg bg-slate-700 border border-slate-600 text-sm text-white outline-none focus:border-blue-500 placeholder-slate-500 transition-colors duration-200 pr-10'
                                />
                                <button
                                    type='button'
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className='absolute right-3 bottom-2.5 text-slate-500 hover:text-slate-300 transition-colors duration-200'
                                >
                                    <i className={showConfirmPassword ? 'ri-eye-off-line' : 'ri-eye-line'}></i>
                                </button>
                            </div>

                            {newPassword && (
                                <div className='space-y-1'>
                                    <div className='flex gap-1 h-1.5'>
                                        <div className={`flex-1 rounded-full transition-all duration-300 ${
                                            newPassword.length < 4 ? 'bg-red-500' :
                                            newPassword.length < 6 ? 'bg-yellow-500' :
                                            'bg-green-500'
                                        }`}></div>
                                        <div className={`flex-1 rounded-full transition-all duration-300 ${
                                            newPassword.length < 6 ? 'bg-slate-600' :
                                            newPassword.length < 8 ? 'bg-yellow-500' :
                                            'bg-green-500'
                                        }`}></div>
                                        <div className={`flex-1 rounded-full transition-all duration-300 ${
                                            newPassword.length < 8 ? 'bg-slate-600' :
                                            'bg-green-500'
                                        }`}></div>
                                    </div>
                                    <div className='flex justify-between items-center'>
                                        <p className='text-[10px] text-slate-400'>
                                            {newPassword.length < 4 ? 'Weak' :
                                             newPassword.length < 6 ? 'Fair' :
                                             newPassword.length < 8 ? 'Good' :
                                             'Strong'}
                                        </p>
                                        <p className='text-[10px] text-slate-500'>Minimum 6 characters</p>
                                    </div>
                                </div>
                            )}

                            <button 
                                onClick={handlePasswordUpdate} 
                                disabled={loading || !currentPassword || !newPassword || !confirmPassword}
                                className='px-6 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:hover:bg-blue-600 rounded-lg text-sm font-medium text-white transition-colors duration-200'
                            >
                                {loading ? 'Updating...' : 'Update Password'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Profile;