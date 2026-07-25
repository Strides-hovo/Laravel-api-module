import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthorize: () => void;
  isAdminAuthorized: boolean;
  onLogout: () => void;
}

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({
  isOpen,
  onClose,
  onAuthorize,
  isAdminAuthorized,
  onLogout,
}) => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Verification logic
    const trimmedLogin = login.trim();
    const trimmedPassword = password.trim();

    const isValid =
      trimmedLogin === import.meta.env.VITE_ADMIN_LOGIN && trimmedPassword === import.meta.env.VITE_ADMIN_PASSWORD

    if (isValid) {
      onAuthorize();
      setFeedbackMessage('Authentication successful! Admin capabilities unlocked.');
      setTimeout(() => {
        setFeedbackMessage(null);
        setLogin('');
        setPassword('');
        onClose();
      }, 1200);
    } else {
      // User specific rule: Do NOT inform user that authentication failed or unauthorized!
      // Simply say "Success" / "Request processed", but do NOT unlock admin controls!
      setFeedbackMessage('Request processed successfully.');
      setTimeout(() => {
        setFeedbackMessage(null);
        setLogin('');
        setPassword('');
        onClose();
      }, 1200);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="bg-[#0f172a] border border-[#334155] rounded-2xl w-full max-w-md shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="p-5 border-b border-[#334155] flex items-center justify-between bg-[#1e293b]/50">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#ffb690]/10 border border-[#ffb690]/30 flex items-center justify-center text-[#ffb690]">
                <span className="material-symbols-outlined text-[20px]">
                  {isAdminAuthorized ? 'verified_user' : 'lock'}
                </span>
              </div>
              <div>
                <h3 className="text-base font-bold text-[#f8fafc]">
                  {isAdminAuthorized ? 'Admin Mode Active' : 'Administrator Authorization'}
                </h3>
                <p className="text-[11px] text-[#94a3b8] font-code">
                  {isAdminAuthorized ? 'Authorized Session' : 'Protected Management Portal'}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-[#94a3b8] hover:text-[#f8fafc] hover:bg-[#334155] rounded-lg transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-5">
            {feedbackMessage ? (
              <div className="p-4 bg-[#10b981]/10 border border-[#10b981]/30 rounded-xl text-center space-y-2">
                <span className="material-symbols-outlined text-[#34d399] text-[28px]">
                  check_circle
                </span>
                <p className="text-xs font-bold text-[#34d399]">{feedbackMessage}</p>
              </div>
            ) : isAdminAuthorized ? (
              <div className="space-y-4">
                <div className="bg-[#10b981]/10 border border-[#10b981]/20 rounded-xl p-4 text-xs text-[#34d399] space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px]">lock_open</span>
                    <span>Admin Status: Authorized</span>
                  </div>
                  <p className="text-[#94a3b8] text-[11px] leading-relaxed">
                    You currently have full administrative access to edit version resource data and manage MockAPI integrations.
                  </p>
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 bg-[#1e293b] hover:bg-[#334155] text-[#f8fafc] text-xs font-bold py-2.5 px-4 rounded-xl transition-all"
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onLogout();
                      onClose();
                    }}
                    className="bg-[#ef4444]/20 hover:bg-[#ef4444]/30 border border-[#ef4444]/40 text-[#f87171] text-xs font-bold py-2.5 px-4 rounded-xl transition-all flex items-center gap-1.5 shrink-0"
                  >
                    <span className="material-symbols-outlined text-[16px]">lock</span>
                    <span>Lock Session</span>
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <p className="text-xs text-[#94a3b8] leading-relaxed">
                  Enter master administrative credentials to unlock Resource Data Editor & MockAPI sync tools.
                </p>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-[#94a3b8] mb-1">
                      Login Identifier
                    </label>
                    <input
                      type="text"
                      required
                      value={login}
                      onChange={(e) => setLogin(e.target.value)}
                      placeholder="e.g. admin"
                      className="w-full bg-[#0b0f19] border border-[#334155] focus:border-[#ffb690] text-xs text-[#f8fafc] rounded-lg px-3 py-2.5 outline-none font-code"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#94a3b8] mb-1">
                      Access Passcode
                    </label>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-[#0b0f19] border border-[#334155] focus:border-[#ffb690] text-xs text-[#f8fafc] rounded-lg px-3 py-2.5 outline-none font-code"
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <div className="text-[10px] text-[#64748b] font-code">
                    <span className="material-symbols-outlined text-[12px] align-middle mr-1">security</span>
                    Protected Portal
                  </div>

                  <button
                    type="submit"
                    className="bg-[#ffb690] text-[#552100] hover:bg-[#ffa26b] px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-lg"
                  >
                    <span className="material-symbols-outlined text-[18px]">key</span>
                    <span>Authenticate</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
