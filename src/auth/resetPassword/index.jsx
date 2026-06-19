import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { FiLock, FiArrowLeft, FiCheck } from 'react-icons/fi';
import Input from '../../commonComponents/inputs/Input';
import Button from '../../commonComponents/buttons/Button';
import Card from '../../commonComponents/cards/Card';
import { resetPassword } from '../../redux/slices/authSlice';

export default function AuthResetPasswordScreen() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!token) {
      setError('Invalid or missing password reset token');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      await dispatch(resetPassword({ token, password })).unwrap();
      setIsLoading(false);
      setSuccess(true);
    } catch (err) {
      setIsLoading(false);
      setError(err || 'Failed to reset password');
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
          {!success ? (
            <>
              <div className="text-center mb-8">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  New Password
                </h2>
                <p className="text-xs text-slate-400 mt-2">
                  Please enter and confirm your new account password.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <Input
                  label="New Password"
                  type="password"
                  placeholder="Min 8 characters"
                  icon={FiLock}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <Input
                  label="Confirm New Password"
                  type="password"
                  placeholder="Re-enter new password"
                  icon={FiLock}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />

                {error && (
                  <p className="text-xs text-red-400 font-medium">{error}</p>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full mt-2"
                  isLoading={isLoading}
                >
                  Reset Password
                </Button>
              </form>
            </>
          ) : (
            <div className="text-center py-6">
              <div className="h-12 w-12 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center mx-auto mb-4">
                <FiCheck className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                Password Reset Successful
              </h3>
              <p className="text-xs text-slate-400 mb-6 max-w-xs mx-auto">
                Your credentials have been securely updated. You can now proceed to login.
              </p>
              <Button
                variant="primary"
                className="w-full"
                onClick={() => navigate('/auth/login')}
              >
                Sign In
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
