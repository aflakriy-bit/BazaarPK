import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  KeyRound, 
  ShieldCheck, 
  ArrowRight, 
  Smartphone, 
  AlertCircle, 
  RefreshCw, 
  Eye, 
  EyeOff, 
  CheckCircle2,
  X
} from 'lucide-react';
import { api } from '../../services/api';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  // Step 1: Credentials
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('Pakistan2026!');
  const [showPassword, setShowPassword] = useState(false);
  
  // Step 2: 2FA State
  const [is2FAStep, setIs2FAStep] = useState(false);
  const [tempToken, setTempToken] = useState<string>('');
  const [otpCode, setOtpCode] = useState('');
  const [otpHint, setOtpHint] = useState<string | null>(null);
  const [timer, setTimer] = useState(60);

  // Status
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let interval: any;
    if (is2FAStep && timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [is2FAStep, timer]);

  if (!isOpen) return null;

  // Step 1: Verify Username and Password
  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await api.adminLogin(username, password);
      setLoading(false);

      if (res.success && res.requires2FA) {
        setIs2FAStep(true);
        setTempToken(res.tempToken || '');
        setOtpHint(res.otpHint || '123456');
        setTimer(60);
      } else if (res.success && res.token) {
        onLoginSuccess();
      } else {
        setError(res.message || 'Invalid username or password.');
      }
    } catch {
      setLoading(false);
      setError('Connection error. Please try again.');
    }
  };

  // Step 2: Verify 2FA OTP
  const handle2FASubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!otpCode || otpCode.trim().length !== 6) {
      setError('Please enter the complete 6-digit 2FA OTP code.');
      return;
    }

    setLoading(true);

    try {
      const res = await api.verify2FA(tempToken, otpCode.trim());
      setLoading(false);

      if (res.success) {
        onLoginSuccess();
      } else {
        setError(res.message || 'Invalid 2FA code. Please verify.');
      }
    } catch {
      setLoading(false);
      setError('2FA verification failed.');
    }
  };

  const handleResendOTP = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.adminLogin(username, password);
      setLoading(false);
      if (res.success) {
        setTempToken(res.tempToken || '');
        setOtpHint(res.otpHint || '123456');
        setTimer(60);
      }
    } catch {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 font-sans animate-fadeIn">
      <div className="relative w-full max-w-md bg-white border border-neutral-200 shadow-2xl my-8">
        
        {/* Top Header (Strict Bachpan PK - Premium Kids Wear Branding) */}
        <div className="p-6 border-b border-neutral-100 flex items-center justify-between bg-white shrink-0">
          <div>
            <span className="text-[10px] uppercase tracking-[0.25em] font-light text-neutral-400 block">
              Bachpan PK - Premium Kids Wear
            </span>
            <h3 className="font-serif text-xl sm:text-2xl font-normal text-neutral-900 tracking-wide mt-0.5">
              Admin Portal
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-black transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 stroke-[1.5]" />
          </button>
        </div>

        {/* Stepper Progress */}
        <div className="px-6 pt-4 pb-2 border-b border-neutral-100 flex items-center justify-between text-[11px] uppercase tracking-wider text-neutral-500 font-light">
          <span className={!is2FAStep ? 'text-neutral-900 font-medium' : 'text-neutral-400'}>
            1. Credentials
          </span>
          <div className="h-px flex-1 mx-3 bg-neutral-200" />
          <span className={is2FAStep ? 'text-neutral-900 font-medium' : 'text-neutral-400'}>
            2. Two-Factor (2FA)
          </span>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-5 text-xs text-neutral-800">
          {error && (
            <div className="p-3 bg-neutral-50 border border-neutral-300 text-neutral-900 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-neutral-800" />
              <span>{error}</span>
            </div>
          )}

          {/* STEP 1: USERNAME & PASSWORD */}
          {!is2FAStep ? (
            <form onSubmit={handleCredentialsSubmit} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-700 font-medium mb-1.5">
                  Admin Username
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400">
                    <Lock className="w-3.5 h-3.5 stroke-[1.5]" />
                  </span>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="admin"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-neutral-300 text-neutral-900 text-xs sm:text-sm focus:border-black focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-700 font-medium mb-1.5">
                  Master Password
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400">
                    <KeyRound className="w-3.5 h-3.5 stroke-[1.5]" />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full pl-10 pr-10 py-2.5 bg-white border border-neutral-300 text-neutral-900 text-xs sm:text-sm font-mono focus:border-black focus:outline-none"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Default Hint Box */}
              <div className="p-3 bg-[#FAF9F8] border border-neutral-200 text-[11px] text-neutral-500 font-light space-y-1">
                <p>Default Superadmin Credentials:</p>
                <p className="font-mono text-neutral-800">
                  User: <strong>admin</strong> | Pass: <strong>Pakistan2026!</strong>
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-neutral-900 hover:bg-black text-white text-xs uppercase tracking-widest font-medium transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                {loading ? 'Authenticating...' : 'Continue to 2FA Step'}
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          ) : (
            /* STEP 2: 2FA OTP */
            <form onSubmit={handle2FASubmit} className="space-y-4">
              <div className="text-center space-y-1 pb-1">
                <p className="text-xs text-neutral-500 font-light">
                  A 6-digit verification code has been generated.
                </p>
                {otpHint && (
                  <div className="p-2.5 bg-neutral-100 border border-neutral-200 text-xs text-neutral-900 font-mono">
                    Security Code: <strong className="text-sm font-bold tracking-widest">{otpHint}</strong>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-700 font-medium mb-1.5 text-center">
                  Enter 6-Digit 2FA Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="------"
                  autoFocus
                  className="w-full py-3 text-center tracking-[0.5em] font-mono text-xl sm:text-2xl bg-white border border-neutral-300 text-neutral-900 focus:border-black focus:outline-none"
                  required
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-neutral-500 font-light">
                <button
                  type="button"
                  onClick={() => setIs2FAStep(false)}
                  className="hover:text-black transition-colors cursor-pointer"
                >
                  ← Back to login
                </button>

                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={loading || timer > 0}
                  className="hover:text-black transition-colors cursor-pointer disabled:opacity-40"
                >
                  {timer > 0 ? `Resend code (${timer}s)` : 'Resend Code'}
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-neutral-900 hover:bg-black text-white text-xs uppercase tracking-widest font-medium transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                {loading ? 'Verifying...' : 'Verify & Enter Dashboard'}
                <CheckCircle2 className="w-3.5 h-3.5" />
              </button>
            </form>
          )}

        </div>

      </div>
    </div>
  );
};
