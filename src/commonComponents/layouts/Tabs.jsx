import React from 'react';

export default function Tabs({
  tabs = [], // [{ label: 'General', value: 'general' }]
  activeTab,
  onTabChange,
  className = '',
}) {
  return (
    <div className={`border-b border-slate-200 dark:border-slate-800 ${className}`}>
      <nav className="-mb-px flex space-x-6 sm:space-x-8" aria-label="Tabs">
        {tabs.map((tab) => {
          const isActive = tab.value === activeTab;
          return (
            <button
              key={tab.value}
              onClick={() => onTabChange(tab.value)}
              className={`whitespace-nowrap border-b-2 py-4 px-1 text-sm font-semibold transition-all duration-200
                ${isActive
                  ? 'border-teal-500 text-teal-600 dark:text-teal-400'
                  : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 dark:text-slate-400 dark:hover:border-slate-700 dark:hover:text-slate-200'
                }
              `}
            >
              {tab.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
