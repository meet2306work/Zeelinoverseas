import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiArrowRight } from 'react-icons/fi';
import Button from '../../commonComponents/buttons/Button';

export default function AuthEmailVerificationScreen() {
  const navigate = useNavigate();

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
            You're in the<br />
            <span className="text-accent-gold">Zeelin Network.</span>
          </h2>
          <p className="text-sm text-text-on-dark/60 leading-relaxed max-w-xs">
            Your account is now fully activated. Start submitting RFQs, browsing the catalog, and managing your B2B orders.
          </p>
        </div>

        <p className="text-xs text-text-on-dark/30 z-10">© 2024 Zeelin Overseas. All rights reserved.</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 sm:px-12">
        <Link to="/" className="lg:hidden mb-10 text-xl font-extrabold tracking-tight font-display">
          ZEELIN <span className="text-accent-gold">OVERSEAS</span>
        </Link>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md flex flex-col items-start gap-6"
        >
          {/* Success icon */}
          <div className="h-20 w-20 rounded-2xl bg-accent-gold/15 border border-accent-gold/25 flex items-center justify-center">
            <FiCheckCircle className="h-10 w-10 text-accent-gold" />
          </div>

          <div>
            <h1 className="text-3xl font-display font-extrabold text-text-primary tracking-tight">
              Email Verified!
            </h1>
            <p className="text-sm text-text-secondary mt-2 leading-relaxed max-w-xs">
              Your email address has been successfully verified. Your trade workspace profile is fully activated and ready to use.
            </p>
          </div>

          <Button
            variant="primary"
            size="lg"
            className="w-full"
            icon={FiArrowRight}
            iconPosition="right"
            onClick={() => navigate('/auth/login')}
          >
            Go to Dashboard
          </Button>

          <div className="w-full pt-2 border-t border-border-default">
            <Link to="/" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
              ← Back to Home
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
