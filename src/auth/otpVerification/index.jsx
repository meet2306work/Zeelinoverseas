import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiShield, FiArrowRight } from 'react-icons/fi';
import Input from '../../commonComponents/inputs/Input';
import Button from '../../commonComponents/buttons/Button';
import Card from '../../commonComponents/cards/Card';
import { verifyEmailOtp } from '../../redux/slices/authSlice';

export default function AuthOtpVerificationScreen() {
  const [otp, setOtp] = useState('');
  const [localError, setLocalError] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading: isLoading, error: reduxError, user } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    if (otp.length < 4) {
      setLocalError('Please enter a valid code');
      return;
    }

    try {
      await dispatch(verifyEmailOtp({ otp })).unwrap();
      // On success, redirect to home or dashboard
      if (user?.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/user/home');
      }
    } catch (err) {
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
              We have sent a verification code to your device/email. Enter it below.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
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

            {(localError || reduxError) && (
              <p className="text-xs text-red-400 font-medium">{localError || reduxError}</p>
            )}

            <Button
              type="submit"
              variant="primary"
              className="w-full mt-2"
              isLoading={isLoading}
              icon={FiArrowRight}
              iconPosition="right"
            >
              Verify Code
            </Button>
          </form>

          <div className="mt-8 text-center border-t border-slate-800 pt-6">
            <p className="text-xs text-slate-400">
              Didn't receive the code?{' '}
              <button
                type="button"
                className="text-teal-400 hover:text-teal-300 font-bold transition-colors"
                onClick={() => alert('Code resent!')}
              >
                Resend Code
              </button>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
