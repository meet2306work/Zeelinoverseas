import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { FiShield, FiArrowRight, FiMail } from 'react-icons/fi';
import { notify } from '../../commonComponents/toasts/notify';
import Input from '../../commonComponents/inputs/Input';
import Button from '../../commonComponents/buttons/Button';
import { verifyEmailOtp, resendEmailOtp } from '../../redux/slices/authSlice';

export default function AuthOtpVerificationScreen() {
  const [otp, setOtp] = useState('');
  const [localError, setLocalError] = useState('');
  const [expiryTime, setExpiryTime] = useState(600);
  const [resendCooldown, setResendCooldown] = useState(60);

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const email = location.state?.email || new URLSearchParams(location.search).get('email') || '';
  const { loading: isLoading, error: reduxError } = useSelector((state) => state.auth);

  useEffect(() => {
    if (expiryTime <= 0) return;
    const timer = setInterval(() => setExpiryTime((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [expiryTime]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => setResendCooldown((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setLocalError('');
    try {
      await dispatch(resendEmailOtp({ email })).unwrap();
      notify.success('A new OTP has been sent.');
      setResendCooldown(60);
      setExpiryTime(600);
      setOtp('');
    } catch (err) {
      notify.error(err || 'Failed to resend OTP');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    if (otp.length < 6) { setLocalError('Please enter a valid 6-digit code'); return; }
    if (expiryTime <= 0) { setLocalError('OTP has expired. Please request a new one.'); return; }
    try {
      await dispatch(verifyEmailOtp({ email, otp })).unwrap();
      notify.success('Email verified successfully.');
      navigate('/auth/verify-email');
    } catch (err) {
      notify.error(err || 'Failed to verify OTP');
      setLocalError(err || 'Failed to verify OTP');
    }
  };

  return (
    <div className="min-h-screen flex bg-background-primary">
      {/* Left branding panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-black-accent flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-accent-gold/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-72 h-72 rounded-full bg-accent-gold/8 blur-2xl pointer-events-none" />

        <Link to="/" className="flex items-center gap-2 z-10">
          <span className="text-xl font-extrabold tracking-tight text-text-on-dark font-display">
            ZEELIN <span className="text-accent-gold">OVERSEAS</span>
          </span>
        </Link>

        <div className="z-10 flex flex-col gap-6">
          <div className="w-12 h-1 bg-accent-gold rounded-full" />
          <h2 className="text-3xl font-display font-bold text-text-on-dark leading-snug">
            One step away<br />
            <span className="text-accent-gold">from the network.</span>
          </h2>
          <p className="text-sm text-text-on-dark/60 leading-relaxed max-w-xs">
            Verify your email to activate your account and start accessing B2B sourcing tools.
          </p>
        </div>

        <p className="text-xs text-text-on-dark/30 z-10">© 2024 Zeelin Overseas. All rights reserved.</p>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 sm:px-12">
        <Link to="/" className="lg:hidden mb-10 text-xl font-extrabold tracking-tight font-display">
          ZEELIN <span className="text-accent-gold">OVERSEAS</span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md flex flex-col gap-6"
        >
          {/* Icon badge */}
          <div className="flex flex-col items-start gap-4">
            <div className="h-14 w-14 rounded-2xl bg-accent-gold/15 border border-accent-gold/25 flex items-center justify-center">
              <FiShield className="h-7 w-7 text-accent-gold" />
            </div>
            <div>
              <h1 className="text-3xl font-display font-extrabold text-text-primary tracking-tight">
                Verify your email
              </h1>
              <p className="text-sm text-text-secondary mt-1.5 leading-relaxed">
                We've sent a 6-digit code to{' '}
                <span className="font-semibold text-text-primary">{email || 'your email'}</span>.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <Input
                label="Verification Code"
                type="text"
                placeholder="• • • • • •"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                required
                className="text-center tracking-[0.5em] text-xl font-bold"
              />
              {/* Timer */}
              <div className="flex justify-between items-center mt-2 px-1">
                <span className="text-xs text-text-secondary">
                  Expires in:{' '}
                  <span className={`font-bold ${expiryTime < 60 ? 'text-red-500 animate-pulse' : 'text-accent-gold'}`}>
                    {formatTime(expiryTime)}
                  </span>
                </span>
                {expiryTime === 0 && (
                  <span className="text-xs text-red-500 font-bold animate-pulse">Expired</span>
                )}
              </div>
            </div>

            {(localError || reduxError) && (
              <div className="rounded-xl border border-red-300 bg-red-50 px-4 py-3">
                <p className="text-xs text-red-600 font-medium">{localError || reduxError}</p>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              isLoading={isLoading}
              icon={FiArrowRight}
              iconPosition="right"
              disabled={expiryTime <= 0}
            >
              Verify Code
            </Button>
          </form>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-border-default" />
            <span className="text-xs text-text-secondary">didn't get it?</span>
            <div className="flex-1 h-px bg-border-default" />
          </div>

          <div className="text-center">
            <button
              type="button"
              className={`text-sm font-bold transition-colors ${
                resendCooldown > 0
                  ? 'text-text-secondary cursor-not-allowed'
                  : 'text-accent-gold hover:text-accent-gold-hover'
              }`}
              disabled={resendCooldown > 0}
              onClick={handleResend}
            >
              {resendCooldown > 0 ? `Resend Code in ${resendCooldown}s` : 'Resend Code →'}
            </button>
          </div>

          <div className="text-center pt-2">
            <Link to="/auth/signup" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
              ← Back to Sign Up
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
