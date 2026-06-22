import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiArrowRight } from 'react-icons/fi';
import Input from '../../commonComponents/inputs/Input';
import Button from '../../commonComponents/buttons/Button';
import { Reveal } from '../../commonComponents/animations/ScrollReveal';
import { loginUser } from '../../redux/slices/authSlice';

const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

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
    <div className="min-h-screen flex bg-background-primary">
      {/* ── Left panel: branding/graphic (hidden on mobile) ── */}
      <div className="hidden lg:flex lg:w-1/2 bg-black-accent flex-col justify-between p-12 relative overflow-hidden">
        {/* Decorative gold orb */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-accent-gold/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-72 h-72 rounded-full bg-accent-gold/8 blur-2xl pointer-events-none" />

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 z-10">
          <span className="text-xl font-extrabold tracking-tight text-text-on-dark font-display">
            ZEELIN <span className="text-accent-gold">OVERSEAS</span>
          </span>
        </Link>

        {/* Centre quote */}
        <div className="z-10 flex flex-col gap-6">
          <div className="w-12 h-1 bg-accent-gold rounded-full" />
          {/* OLD (commented out - do not delete)
          <blockquote className="text-3xl font-display font-bold text-text-on-dark leading-snug">
            Your Gateway to<br />
            <span className="text-accent-gold">Global Trade.</span>
          </blockquote>
          <p className="text-sm text-text-on-dark/60 leading-relaxed max-w-xs">
            Manage import-export shipments, submit RFQs, and track contracts — all from one intelligent B2B platform.
          </p>
          */}
          {/* NEW */}
          <blockquote className="text-3xl font-display font-bold text-text-on-dark leading-snug">
            Your Gateway to<br />
            <span className="text-accent-gold">Custom Packaging.</span>
          </blockquote>
          <p className="text-sm text-text-on-dark/60 leading-relaxed max-w-xs">
            Shop premium boxes and mailers, configure custom print orders, and track your shipments — all in one place.
          </p>

          {/* Stats row */}
          <div className="flex gap-8 mt-2">
            {[
              { value: '500+', label: 'Active Buyers' },
              { value: '12+', label: 'Countries' },
              { value: '24h', label: 'Quote Turnaround' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl font-extrabold text-accent-gold">{stat.value}</p>
                <p className="text-xs text-text-on-dark/50 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer note */}
        <p className="text-xs text-text-on-dark/30 z-10">© 2024 Zeelin Overseas. All rights reserved.</p>
      </div>

      {/* ── Right panel: form ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 sm:px-12">
        {/* Mobile logo */}
        <Link to="/" className="lg:hidden mb-10 text-xl font-extrabold tracking-tight font-display">
          ZEELIN <span className="text-accent-gold">OVERSEAS</span>
        </Link>

        <Reveal className="w-full max-w-md" amount={0.1}>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="flex flex-col gap-6"
          >
            {/* Header */}
            <motion.div variants={fadeUp} className="mb-2">
              <h1 className="text-3xl font-display font-extrabold text-text-primary tracking-tight">
                Welcome back
              </h1>
              <p className="text-sm text-text-secondary mt-1.5">
                Sign in to your Zeelin Overseas account
              </p>
            </motion.div>

            {/* Form */}
            <motion.form variants={fadeUp} onSubmit={handleSubmit} className="flex flex-col gap-4">
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
                  <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Password</span>
                  <Link
                    to="/auth/forgot-password"
                    className="text-xs text-accent-gold hover:text-accent-gold-hover font-semibold transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  type="password"
                  placeholder="Enter your password"
                  icon={FiLock}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {(localError || reduxError) && (
                <div className="flex items-start gap-2 rounded-xl border border-red-300 bg-red-50 px-4 py-3">
                  <p className="text-xs text-red-600 font-medium leading-relaxed">{localError || reduxError}</p>
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full mt-1"
                isLoading={isLoading}
                icon={FiArrowRight}
                iconPosition="right"
              >
                Sign In
              </Button>
            </motion.form>

            {/* Divider */}
            <motion.div variants={fadeUp} className="flex items-center gap-3">
              <div className="flex-1 h-px bg-border-default" />
              <span className="text-xs text-text-secondary font-medium">New here?</span>
              <div className="flex-1 h-px bg-border-default" />
            </motion.div>

            {/* Signup link */}
            <motion.div variants={fadeUp} className="text-center">
              <p className="text-sm text-text-secondary">
                Don&apos;t have an account?{' '}
                <Link
                  to="/auth/signup"
                  className="text-accent-gold hover:text-accent-gold-hover font-bold transition-colors"
                >
                  Create one free →
                </Link>
              </p>
            </motion.div>
          </motion.div>
        </Reveal>
      </div>
    </div>
  );
}
