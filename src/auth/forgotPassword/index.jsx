import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { FiMail, FiArrowLeft, FiCheckCircle } from 'react-icons/fi';
import Input from '../../commonComponents/inputs/Input';
import Button from '../../commonComponents/buttons/Button';
import { forgotPassword } from '../../redux/slices/authSlice';

export default function AuthForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await dispatch(forgotPassword({ email })).unwrap();
      setIsLoading(false);
      setSuccess(true);
    } catch (err) {
      setIsLoading(false);
      setError(err || 'Failed to send reset email');
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
            Recover your<br />
            <span className="text-accent-gold">account access.</span>
          </h2>
          <p className="text-sm text-text-on-dark/60 leading-relaxed max-w-xs">
            We'll send you a secure link to reset your password. It only takes a moment.
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
          {/* Back link */}
          <Link
            to="/auth/login"
            className="inline-flex items-center gap-2 text-xs text-text-secondary hover:text-text-primary uppercase tracking-wider font-semibold transition-colors"
          >
            <FiArrowLeft className="h-4 w-4" />
            Back to Login
          </Link>

          {!success ? (
            <>
              <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-display font-extrabold text-text-primary tracking-tight">
                  Reset your password
                </h1>
                <p className="text-sm text-text-secondary leading-relaxed">
                  Enter the email address linked to your account and we'll send a reset link.
                </p>
              </div>

              {error && (
                <div className="rounded-xl border border-red-300 bg-red-50 px-4 py-3">
                  <p className="text-xs text-red-600 font-medium">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="e.g. john@company.com"
                  icon={FiMail}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full"
                  isLoading={isLoading}
                >
                  Send Reset Link
                </Button>
              </form>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-start gap-5"
            >
              <div className="h-14 w-14 rounded-2xl bg-accent-gold/15 border border-accent-gold/25 flex items-center justify-center">
                <FiCheckCircle className="h-7 w-7 text-accent-gold" />
              </div>
              <div>
                <h2 className="text-2xl font-display font-extrabold text-text-primary tracking-tight">
                  Check your inbox
                </h2>
                <p className="text-sm text-text-secondary mt-2 leading-relaxed max-w-xs">
                  We've sent a password reset link to{' '}
                  <span className="font-semibold text-text-primary">{email}</span>.
                  It expires in 15 minutes.
                </p>
              </div>
              <Button
                variant="primary"
                size="lg"
                className="w-full"
                onClick={() => navigate('/auth/login')}
              >
                Back to Login
              </Button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
