import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { FiMail, FiArrowLeft } from 'react-icons/fi';
import Input from '../../commonComponents/inputs/Input';
import Button from '../../commonComponents/buttons/Button';
import Card from '../../commonComponents/cards/Card';
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
    <div className="min-h-screen flex items-center justify-center hero-gradient px-4 sm:px-6 py-12 dark">
      <div className="absolute top-6 left-6">
        <Link to="/" className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-teal-400 to-amber-400 text-transparent bg-clip-text">
          ZEELIN<span className="text-white font-medium">OVERSEAS</span>
        </Link>
      </div>

      <div className="w-full max-w-md animate-fade-in-up">
        <Card variant="glass" hover={false} className="p-8 sm:p-10 border-slate-800/80">
          <div className="mb-6">
            <Link to="/auth/login" className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-teal-400 transition-colors uppercase tracking-wider font-semibold">
              <FiArrowLeft className="h-4 w-4" />
              Back to Login
            </Link>
          </div>

          {!success ? (
            <>
              <div className="text-center mb-8">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Reset Password
                </h2>
                <p className="text-xs text-slate-400 mt-2">
                  Enter your email address and we'll send you a password reset link.
                </p>
              </div>

              {error && <div className="text-red-500 text-sm mb-4 text-center">{error}</div>}

              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
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
                  className="w-full mt-2"
                  isLoading={isLoading}
                >
                  Send Reset Link
                </Button>
              </form>
            </>
          ) : (
            <div className="text-center py-6">
              <div className="h-12 w-12 rounded-2xl bg-teal-950/40 text-teal-400 border border-teal-500/20 flex items-center justify-center mx-auto mb-4">
                <FiMail className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                Check Your Inbox
              </h3>
              <p className="text-xs text-slate-400 mb-6 max-w-xs mx-auto">
                We have sent a password reset link to <span className="font-semibold text-slate-200">{email}</span>.
              </p>
              <Button
                variant="primary"
                className="w-full"
                onClick={() => navigate('/auth/login')}
              >
                Back to Login
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
