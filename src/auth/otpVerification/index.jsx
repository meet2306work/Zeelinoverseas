import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiShield, FiArrowRight } from 'react-icons/fi';
import { toast } from 'react-toastify';
import Input from '../../commonComponents/inputs/Input';
import Button from '../../commonComponents/buttons/Button';
import Card from '../../commonComponents/cards/Card';
import { verifyEmailOtp, resendEmailOtp } from '../../redux/slices/authSlice';

export default function AuthOtpVerificationScreen() {
  const [otp, setOtp] = useState('');
  const [localError, setLocalError] = useState('');
  const [expiryTime, setExpiryTime] = useState(600); // 10 minutes = 600s
  const [resendCooldown, setResendCooldown] = useState(60); // 60 seconds cooldown

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  // Retrieve email from signup page navigation state, or search params as fallback
  const email = location.state?.email || new URLSearchParams(location.search).get('email') || '';

  const { loading: isLoading, error: reduxError } = useSelector((state) => state.auth);

  // Expiry Timer (10 minutes)
  useEffect(() => {
    if (expiryTime <= 0) return;
    const timer = setInterval(() => {
      setExpiryTime((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [expiryTime]);

  // Resend Cooldown Timer (60 seconds)
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setLocalError('');

    try {
      await dispatch(resendEmailOtp({ email })).unwrap();
      toast.success('A new OTP has been sent.');
      setResendCooldown(60); // Restart 60s timer
      setExpiryTime(600); // Reset 10m expiry timer
      setOtp(''); // Clear current input
    } catch (err) {
      toast.error(err || 'Failed to resend OTP');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    if (otp.length < 6) {
      setLocalError('Please enter a valid 6-digit code');
      return;
    }

    if (expiryTime <= 0) {
      setLocalError('OTP has expired. Please request a new one.');
      return;
    }

    try {
      await dispatch(verifyEmailOtp({ email, otp })).unwrap();
      toast.success('Email verified successfully.');
      navigate('/auth/verify-email');
    } catch (err) {
      toast.error(err || 'Failed to verify OTP');
      setLocalError(err || 'Failed to verify OTP');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center hero-gradient px-4 sm:px-6 py-12 dark">
      <div className="absolute top-6 left-6">
        <Link to="/" className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-teal-400 to-amber-400 text-transparent bg-clip-text">
          ZEELIN<span className="text-white font-medium">OVERSEAS</span>
        </Link>
      </div>

      <div className="w-full max-w-md animate-fade-in-up">
        <Card variant="glass" hover={false} className="p-8 sm:p-10 border-slate-800/80">
          <div className="text-center mb-8">
            <div className="h-12 w-12 rounded-2xl bg-teal-950/40 text-teal-400 border border-teal-500/20 flex items-center justify-center mx-auto mb-4">
              <FiShield className="h-6 w-6" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              OTP Verification
            </h2>
            <p className="text-xs text-slate-400 mt-2">
              We have sent a verification code to {email || 'your email'}. Enter it below.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <Input
                label="Verification Code"
                type="text"
                placeholder="e.g. 123456"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                required
                className="text-center tracking-widest text-lg font-bold"
              />
              
              <div className="flex justify-between items-center text-xs mt-2 px-1">
                <span className="text-slate-400">
                  Code expires in:{' '}
                  <span className={`font-bold ${expiryTime < 60 ? 'text-amber-500 animate-pulse' : 'text-teal-400'}`}>
                    {formatTime(expiryTime)}
                  </span>
                </span>
                {expiryTime === 0 && (
                  <span className="text-red-400 font-bold animate-pulse">Code Expired</span>
                )}
              </div>
            </div>

            {(localError || reduxError) && (
              <p className="text-xs text-red-400 font-medium">
                {localError || reduxError}
              </p>
            )}

            <Button
              type="submit"
              variant="primary"
              className="w-full mt-2"
              isLoading={isLoading}
              icon={FiArrowRight}
              iconPosition="right"
              disabled={expiryTime <= 0}
            >
              Verify Code
            </Button>
          </form>

          <div className="mt-8 text-center border-t border-slate-800 pt-6">
            <p className="text-xs text-slate-400">
              Didn't receive the code?{' '}
              <button
                type="button"
                className={`font-bold transition-colors ${
                  resendCooldown > 0
                    ? 'text-slate-500 cursor-not-allowed'
                    : 'text-teal-400 hover:text-teal-300'
                }`}
                disabled={resendCooldown > 0}
                onClick={handleResend}
              >
                {resendCooldown > 0 ? `Resend Code (${resendCooldown}s)` : 'Resend Code'}
              </button>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
