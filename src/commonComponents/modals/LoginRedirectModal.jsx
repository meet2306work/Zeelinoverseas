import React from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from './Modal';
import Button from '../buttons/Button';
import { FiUser, FiInfo } from 'react-icons/fi';

export default function LoginRedirectModal({ isOpen, onClose, actionName = 'perform this action' }) {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    onClose();
    navigate('/auth/login');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Login Required" size="sm">
      <div className="flex flex-col items-center gap-4 text-center p-2 text-slate-800 dark:text-slate-200">
        <div className="h-12 w-12 rounded-2xl bg-accent-gold/10 text-accent-gold flex items-center justify-center border border-accent-gold/15 mb-1 shrink-0">
          <FiUser className="h-6 w-6" />
        </div>
        
        <div>
          <p className="text-sm font-bold text-slate-900 dark:text-white">
            Authentication Required
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
            You must be logged in to {actionName}. Sign in or create a wholesale account to shop products, request custom print quotes, and track orders.
          </p>
        </div>

        <div className="flex w-full gap-3 justify-center mt-3">
          <Button variant="outline" className="flex-1" size="md" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" className="flex-1" size="md" icon={FiUser} onClick={handleLoginClick}>
            Sign In
          </Button>
        </div>
      </div>
    </Modal>
  );
}
