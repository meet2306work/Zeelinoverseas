import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiCheckCircle, FiArrowRight } from 'react-icons/fi';
import Button from '../../commonComponents/buttons/Button';
import Card from '../../commonComponents/cards/Card';

export default function AuthEmailVerificationScreen() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center hero-gradient px-4 sm:px-6 py-12 dark">
      <div className="absolute top-6 left-6">
        <Link to="/" className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-teal-400 to-amber-400 text-transparent bg-clip-text">
          ZEELIN<span className="text-white font-medium">OVERSEAS</span>
        </Link>
      </div>

      <div className="w-full max-w-md animate-fade-in-up">
        <Card variant="glass" hover={false} className="p-8 sm:p-10 border-slate-800/80">
          <div className="text-center py-6">
            <div className="h-16 w-16 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center mx-auto mb-5">
              <FiCheckCircle className="h-8 w-8" />
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
              Email Verified
            </h2>
            
            <p className="text-xs text-slate-400 mb-8 max-w-xs mx-auto leading-relaxed">
              Your email address has been successfully verified. Your trade workspace profile is fully activated.
            </p>

            <Button
              variant="primary"
              className="w-full"
              icon={FiArrowRight}
              iconPosition="right"
              onClick={() => navigate('/auth/login')}
            >
              Go to Dashboard
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
