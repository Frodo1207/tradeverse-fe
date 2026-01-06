import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, User, Image as ImageIcon, Loader2, Save, Mail } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { authUserService } from '../../services/requests/auth';
import { useToast } from '../../contexts/ToastContext';

const EditProfileModal = ({ isOpen, onClose, currentUser, onUpdate, variant = 'profile' }) => {
    const { t } = useTranslation();
    const { success: toastSuccess, error: toastError } = useToast();
    const [username, setUsername] = useState('');
    const [avatar, setAvatar] = useState('');
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [codeSent, setCodeSent] = useState(false);
    const [sendingCode, setSendingCode] = useState(false);
    const [loading, setLoading] = useState(false);
    const isBindEmail = variant === 'bindEmail';

    useEffect(() => {
        if (isOpen && currentUser) {
            setUsername(currentUser.username || '');
            setAvatar(currentUser.avatar || '');
            setEmail(currentUser.email || '');
            setCode('');
            setCodeSent(false);
            setSendingCode(false);
        }
    }, [isOpen, currentUser]);

    if (!isOpen) return null;

    const handleSendCode = async () => {
        const trimmed = email.trim();
        if (!trimmed) return;
        setSendingCode(true);
        try {
            console.log(trimmed)
            const resp = await authUserService.sendEmailBindCode(trimmed);
            const ok = resp?.code === 0 || resp?.success === true;
            if (!ok) throw new Error(resp?.msg || 'send failed');
            setCodeSent(true);
            toastSuccess(t('profile.bindEmailModal.toast.sendSuccess'));
        } catch (_err) {
            toastError(t('profile.bindEmailModal.toast.sendFail'));
        } finally {
            setSendingCode(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (isBindEmail) {
                const trimmedEmail = email.trim();
                const trimmedCode = code.trim();
                const resp = await authUserService.verifyEmailBindCode({ email: trimmedEmail, code: trimmedCode });
                const ok = resp?.code === 0 || resp?.success === true;
                if (!ok) throw new Error(resp?.msg || 'verify failed');

                const profileResp = await authUserService.getProfile();
                const profileOk = profileResp?.code === 0 && profileResp?.data;
                const d = profileOk ? profileResp.data : {};
                const userMain = d.user_main || {};
                const updatedUser = {
                    ...(currentUser || {}),
                    email: userMain.email ?? trimmedEmail,
                    status: userMain.status ?? (currentUser?.status ?? undefined),
                };
                await onUpdate(updatedUser);
            } else {
                await onUpdate({ username, avatar });
            }
            onClose();
        } catch (err) {
            console.error('Failed to update profile:', err);
            if (isBindEmail) {
                toastError(t('profile.bindEmailModal.toast.verifyFail'));
            }
        } finally {
            setLoading(false);
        }
    };

    const canSubmit = isBindEmail ? email.trim().length > 0 && code.trim().length > 0 : true;

    return createPortal(
        <div className="fixed inset-0 z-[100001] flex items-center justify-center p-4">
            <div
                onClick={onClose}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <div
                className="relative w-full max-w-md bg-[#111] border border-white/10 rounded-2xl p-6 shadow-2xl overflow-hidden"
            >
                {/* Background Glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-cyan-500/20 blur-[100px] pointer-events-none" />

                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
                    <X size={20} />
                </button>

                <div className="relative z-10">
                    <div className="w-16 h-16 rounded-full bg-cyan-500/10 flex items-center justify-center mx-auto mb-6 border border-cyan-500/20">
                        {isBindEmail ? (
                            <Mail size={32} className="text-cyan-400" />
                        ) : (
                            <User size={32} className="text-cyan-400" />
                        )}
                    </div>

                    <h2 className="text-2xl font-black text-white text-center mb-2">
                        {isBindEmail ? t('profile.bindEmailModal.title') : t('profile.editModal.title')}
                    </h2>
                    <p className="text-gray-400 text-center text-sm mb-8">
                        {isBindEmail ? t('profile.bindEmailModal.subtitle') : t('profile.editModal.subtitle')}
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {isBindEmail ? (
                            <>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                        {t('profile.bindEmailModal.emailLabel')}
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder={t('profile.bindEmailModal.emailPlaceholder')}
                                            required
                                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 pl-10 pr-28 text-white font-mono text-sm focus:outline-none focus:border-cyan-500/50 transition-colors"
                                        />
                                        <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                                        <button
                                            type="button"
                                            onClick={handleSendCode}
                                            disabled={sendingCode || email.trim().length === 0}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors bg-white/10 hover:bg-white/20 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {sendingCode ? t('profile.bindEmailModal.sending') : (codeSent ? t('profile.bindEmailModal.resend') : t('profile.bindEmailModal.sendCode'))}
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                        {t('profile.bindEmailModal.codeLabel')}
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            value={code}
                                            onChange={(e) => setCode(e.target.value)}
                                            placeholder={t('profile.bindEmailModal.codePlaceholder')}
                                            required
                                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 text-white font-mono text-sm focus:outline-none focus:border-cyan-500/50 transition-colors"
                                        />
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="flex justify-center mb-6">
                                    <div className="relative w-24 h-24 rounded-full bg-black border-2 border-cyan-500/30 overflow-hidden group">
                                        {avatar ? (
                                            <img src={avatar} alt="Preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-white/5">
                                                <User size={40} className="text-gray-500" />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                        {t('profile.editModal.usernameLabel')}
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            placeholder={t('profile.editModal.usernamePlaceholder')}
                                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 pl-10 text-white font-mono text-sm focus:outline-none focus:border-cyan-500/50 transition-colors"
                                        />
                                        <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                        {t('profile.editModal.avatarLabel')}
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={avatar}
                                            onChange={(e) => setAvatar(e.target.value)}
                                            placeholder={t('profile.editModal.avatarPlaceholder')}
                                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 pl-10 text-white font-mono text-sm focus:outline-none focus:border-cyan-500/50 transition-colors"
                                        />
                                        <ImageIcon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                                    </div>
                                </div>
                            </>
                        )}

                        <button
                            type="submit"
                            disabled={loading || !canSubmit}
                            className="w-full py-4 rounded-xl font-bold text-black transition-all transform active:scale-95 flex items-center justify-center gap-2 bg-cyan-400 hover:bg-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <Loader2 size={20} className="animate-spin" />
                            ) : (
                                <>
                                    <Save size={20} /> {isBindEmail ? t('profile.bindEmailModal.save') : t('profile.editModal.save')}
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default EditProfileModal;
