import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiUser, FiMail, FiLock, FiPhone, FiArrowRight } from 'react-icons/fi';
import Input from '../../commonComponents/inputs/Input';
import Button from '../../commonComponents/buttons/Button';
import Card from '../../commonComponents/cards/Card';
import { Reveal } from '../../commonComponents/animations/ScrollReveal';
import { registerUser } from '../../redux/slices/authSlice';

export default function AuthSignupScreen() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading: isLoading, error: reduxError } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    if (password !== confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }

    // Split name into firstName and lastName for backend
    const nameParts = fullName.trim().split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ') || ' ';

    try {
      await dispatch(registerUser({ firstName, lastName, email, phone, password })).unwrap();
      navigate('/auth/verify-otp', { state: { email } });
    } catch (err) {
      setLocalError(err || 'Failed to register');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center hero-gradient px-4 sm:px-6 py-12 dark">
      <div className="absolute top-6 left-6">
        <Link to="/" className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-teal-400 to-amber-400 text-transparent bg-clip-text">
          ZEELIN<span className="text-white font-medium">OVERSEAS</span>
        </Link>
      </div>

      <Reveal className="w-full max-w-md" amount={0.1}>
        <Card variant="glass" hover={false} className="p-8 sm:p-10 border-slate-800/80">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Create Account
            </h2>
            <p className="text-xs text-slate-400 mt-2">
              Join to request quotes, view 3D products, and track contracts.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <Input
              label="Full Name"
              type="text"
              placeholder="e.g. John Doe"
              icon={FiUser}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="e.g. john@company.com"
              icon={FiMail}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              label="Phone Number"
              type="tel"
              placeholder="e.g. +91 9876543210"
              icon={FiPhone}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="Min 8 characters"
              icon={FiLock}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Input
              label="Confirm Password"
              type="password"
              placeholder="Re-enter password"
              icon={FiLock}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
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
              Sign Up
            </Button>
          </form>

          <div className="mt-8 text-center border-t border-slate-800 pt-6">
            <p className="text-xs text-slate-400">
              Already have an account?{' '}
              <Link
                to="/auth/login"
                className="text-teal-400 hover:text-teal-300 font-bold transition-colors"
              >
                Sign In
              </Link>
            </p>
          </div>
        </Card>
      </Reveal>
    </div>
  );
}
