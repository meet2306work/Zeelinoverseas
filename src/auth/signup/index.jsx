import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiLock, FiPhone, FiArrowRight, FiCheckCircle } from 'react-icons/fi';
import Input from '../../commonComponents/inputs/Input';
import Button from '../../commonComponents/buttons/Button';
import { Reveal } from '../../commonComponents/animations/ScrollReveal';
import { registerUser } from '../../redux/slices/authSlice';

const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
};

const PERKS = [
  'Submit B2B RFQs and get quotes in 24h',
  'Track orders and shipment status live',
  'Access exclusive wholesale pricing tiers',
  'Dedicated trade desk support',
];

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
    <div className="min-h-screen flex bg-background-primary">
      {/* ── Left panel: branding/perks ── */}
      <div className="hidden lg:flex lg:w-5/12 bg-black-accent flex-col justify-between p-12 relative overflow-hidden">
        {/* Decorative orbs */}
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-accent-gold/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 left-8 w-60 h-60 rounded-full bg-accent-gold/8 blur-2xl pointer-events-none" />

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 z-10">
          <span className="text-xl font-extrabold tracking-tight text-text-on-dark font-display">
            ZEELIN <span className="text-accent-gold">OVERSEAS</span>
          </span>
        </Link>

        {/* Value proposition */}
        <div className="z-10 flex flex-col gap-6">
          <div className="w-12 h-1 bg-accent-gold rounded-full" />
          <h2 className="text-3xl font-display font-bold text-text-on-dark leading-snug">
            Join the<br />
            <span className="text-accent-gold">Zeelin Network.</span>
          </h2>
          <p className="text-sm text-text-on-dark/60 leading-relaxed max-w-xs">
            Get access to verified commodities, real-time shipment tracking, and B2B tools built for serious importers.
          </p>

          {/* Perks list */}
          <ul className="flex flex-col gap-3 mt-1">
            {PERKS.map((perk) => (
              <li key={perk} className="flex items-start gap-3">
                <FiCheckCircle className="h-4 w-4 text-accent-gold mt-0.5 shrink-0" />
                <span className="text-sm text-text-on-dark/70">{perk}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-xs text-text-on-dark/30 z-10">© 2024 Zeelin Overseas. All rights reserved.</p>
      </div>

      {/* ── Right panel: form ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 sm:px-12 overflow-y-auto">
        {/* Mobile logo */}
        <Link to="/" className="lg:hidden mb-8 text-xl font-extrabold tracking-tight font-display">
          ZEELIN <span className="text-accent-gold">OVERSEAS</span>
        </Link>

        <Reveal className="w-full max-w-md" amount={0.05}>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="flex flex-col gap-5"
          >
            {/* Header */}
            <motion.div variants={fadeUp} className="mb-1">
              <h1 className="text-3xl font-display font-extrabold text-text-primary tracking-tight">
                Create your account
              </h1>
              <p className="text-sm text-text-secondary mt-1.5">
                Takes less than 2 minutes. No credit card required.
              </p>
            </motion.div>

            {/* Form */}
            <motion.form variants={fadeUp} onSubmit={handleSubmit} className="flex flex-col gap-4">
              <Input
                label="Full Name"
                type="text"
                placeholder="e.g. John Doe"
                icon={FiUser}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="john@company.com"
                  icon={FiMail}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Input
                  label="Phone Number"
                  type="tel"
                  placeholder="+91 98765 43210"
                  icon={FiPhone}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                Create Account
              </Button>

              <p className="text-center text-xs text-text-secondary leading-relaxed">
                By signing up, you agree to our{' '}
                <Link to="/terms" className="text-accent-gold hover:underline font-semibold">Terms of Service</Link>
                {' '}and{' '}
                <Link to="/privacy" className="text-accent-gold hover:underline font-semibold">Privacy Policy</Link>.
              </p>
            </motion.form>

            {/* Divider */}
            <motion.div variants={fadeUp} className="flex items-center gap-3">
              <div className="flex-1 h-px bg-border-default" />
              <span className="text-xs text-text-secondary font-medium">Already a member?</span>
              <div className="flex-1 h-px bg-border-default" />
            </motion.div>

            {/* Login link */}
            <motion.div variants={fadeUp} className="text-center">
              <p className="text-sm text-text-secondary">
                Already have an account?{' '}
                <Link
                  to="/auth/login"
                  className="text-accent-gold hover:text-accent-gold-hover font-bold transition-colors"
                >
                  Sign In →
                </Link>
              </p>
            </motion.div>
          </motion.div>
        </Reveal>
      </div>
    </div>
  );
}
