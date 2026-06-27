import React, { useState } from 'react';
import { FiBell, FiTrash2, FiClock, FiFileText, FiInfo, FiTruck, FiCheckCircle } from 'react-icons/fi';
import Card from '../../commonComponents/cards/Card';
import Button from '../../commonComponents/buttons/Button';

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState([
    {
      id: 'notif-1',
      title: 'Order Dispatched: FedEx Transit',
      desc: 'Your package (Tracking ID: FDX9842109) has successfully cleared processing checks and is in transit via FedEx Express.',
      date: 'June 09, 2026',
      icon: FiTruck,
      isNew: true
    },
    {
      id: 'notif-2',
      title: 'RFQ Quote Ready: Custom Packaging Boxes',
      desc: 'Sales Desk generated pricing proposal for RFQ-2026-003. Open detail drawer to verify proposal bid.',
      date: 'June 03, 2026',
      icon: FiFileText,
      isNew: false
    },
    {
      id: 'notif-3',
      title: 'Trade Account Activated',
      desc: 'Corporate trade account verified. You have been upgraded to Level 1 Gold Buyer.',
      date: 'June 02, 2026',
      icon: FiCheckCircle,
      isNew: false
    }
  ]);

  const handleClearAll = () => {
    setNotifications([]);
  };

  const handleMarkRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isNew: false } : n));
  };

  return (
    <div className="flex flex-col gap-8 py-4 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-brand-border/40 dark:border-slate-800/40 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-1">
            Notifications Center
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Monitor real-time order alerts, trade quote notifications, and billing transactions status.
          </p>
        </div>

        {notifications.length > 0 && (
          <button
            onClick={handleClearAll}
            className="text-xs text-red-505 hover:text-red-650 font-bold transition-colors uppercase tracking-wider flex items-center gap-1.5"
          >
            <FiTrash2 className="h-4 w-4" /> Clear All Alerts
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <Card variant="glass" className="p-8">
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="h-12 w-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mb-4">
              <FiBell className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              No New Notifications
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
              You are completely caught up! We will alert you when order status updates occur.
            </p>
          </div>
        </Card>
      ) : (
        <div className="flex flex-col gap-4 max-w-4xl">
          {notifications.map((n) => {
            const Icon = n.icon;
            return (
              <Card
                key={n.id}
                variant="default"
                className={`p-5 flex gap-4 items-start transition-all border-slate-200 dark:border-slate-800
                  ${n.isNew ? 'border-l-4 border-l-secondary dark:border-l-accent' : ''}
                `}
              >
                <div className="rounded-xl p-3 bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 shrink-0">
                  <Icon className="h-5.5 w-5.5 text-secondary dark:text-accent" />
                </div>

                <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                    {n.title}
                  </h4>
                  <p className="text-xs text-slate-550 dark:text-slate-400 leading-relaxed">
                    {n.desc}
                  </p>
                  <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1 mt-1">
                    <FiClock className="h-3 w-3" /> {n.date}
                  </span>
                </div>

                {n.isNew && (
                  <button
                    onClick={() => handleMarkRead(n.id)}
                    className="shrink-0 text-[10px] text-secondary hover:underline font-bold transition-all uppercase tracking-wider bg-secondary/10 dark:bg-accent/10 px-2.5 py-1 rounded-md"
                  >
                    Mark Read
                  </button>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
