import React from 'react';
import Card from '../../commonComponents/cards/Card';

export default function AdminTestimonialsScreen() {
  return (
    <div className="animate-fade-in-up">
      <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">
        Admin Testimonials Screen
      </h1>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
        Zeelinoverseas Admin Portal - Admin Testimonials Screen screen.
      </p>

      <Card variant="glass" className="p-8">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="h-12 w-12 rounded-2xl bg-teal-50 dark:bg-teal-950/20 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold text-lg mb-4">
            ZO
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
            Section under Development
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
            This workspace module is mapped and ready for integration during Phase 2 build steps.
          </p>
        </div>
      </Card>
    </div>
  );
}
