import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiMail, FiLock, FiArrowRight } from 'react-icons/fi';
import Input from '../../commonComponents/inputs/Input';
import Button from '../../commonComponents/buttons/Button';
import Card from '../../commonComponents/cards/Card';
import { loginUser } from '../../redux/slices/authSlice';

export default function AuthLoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading: isLoading, error: reduxError } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    try {
      const resultAction = await dispatch(loginUser({ email, password })).unwrap();
      
      const role = resultAction.data.user.role;
      if (role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/user/home');
      }
    } catch (err) {
      setLocalError(err || 'Failed to login');
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
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome Back
            </h2>
            <p className="text-xs text-slate-400 mt-2">
              Sign in to manage import-export shipments, RFQs, and CRM leads.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <Input
              label="Email Address"
              type="email"
              placeholder="e.g. agent@zeelin.com"
              icon={FiMail}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Password
                </label>
                <Link
                  to="/auth/forgot-password"
                  className="text-xs text-teal-400 hover:text-teal-300 font-medium transition-colors"
                >
                  Forgot Password?
                </Link>
              </div>
              <Input
                type="password"
                placeholder="Enter password"
                icon={FiLock}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {(localError || reduxError) && (
              <p className="text-xs text-red-400 font-medium">{localError || reduxError}</p>
            )}

            <Button
              type="submit"
              variant="primary" // Changed from teal to primary
              className="w-full mt-2"
              isLoading={isLoading}
              icon={FiArrowRight}
              iconPosition="right"
            >
              Sign In
            </Button>
          </form>

          <div className="mt-8 text-center border-t border-slate-800 pt-6">
            <p className="text-xs text-slate-400">
              New to Zeelinoverseas?{' '}
              <Link
                to="/auth/signup"
                className="text-teal-400 hover:text-teal-300 font-bold transition-colors"
              >
                Create Account
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
// Add wrapper to support animations if framer-motion is used, but we imported React. 
// Wait, we didn't import motion from 'framer-motion'. Let's replace the `motion-div` tag with a normal div with the animate-fade-in-up class, which is safe and uses Tailwind v4 animations.
