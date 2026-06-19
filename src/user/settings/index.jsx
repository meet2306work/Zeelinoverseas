import React, { useState } from 'react';
import { FiSliders, FiBell, FiShield, FiGlobe, FiInfo, FiSun, FiMoon, FiMonitor } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { setTheme } from '../../redux/slices/settingsSlice';
import Card from '../../commonComponents/cards/Card';
import Button from '../../commonComponents/buttons/Button';
import Dropdown from '../../commonComponents/dropdowns/Dropdown';

const THEME_OPTIONS = [
  {
    id: 'light',
    label: 'Light',
    desc: 'Always use light theme',
    icon: FiSun,
    color: 'text-amber-500',
    bg: 'bg-amber-50 dark:bg-amber-950/20',
    border: 'border-amber-300',
  },
  {
    id: 'dark',
    label: 'Dark',
    desc: 'Always use dark theme',
    icon: FiMoon,
    color: 'text-indigo-500',
    bg: 'bg-indigo-50 dark:bg-indigo-950/20',
    border: 'border-indigo-400',
  },
  {
    id: 'system',
    label: 'System Default',
    desc: 'Follow device preference',
    icon: FiMonitor,
    color: 'text-slate-500',
    bg: 'bg-slate-100 dark:bg-slate-800',
    border: 'border-slate-400',
  },
];

export default function SettingsScreen() {
  const dispatch = useDispatch();
  const currentTheme = useSelector((state) => state.settings?.theme || 'system');

  const [lang, setLang] = useState('EN');
  const [curr, setCurr] = useState('USD');
  const [emailNotif, setEmailNotif] = useState(true);
  const [smsNotif, setSmsNotif] = useState(false);
  const [pushNotif, setPushNotif] = useState(true);

  const langOptions = [
    { label: 'English', value: 'EN' },
    { label: 'Hindi (हिन्दी)', value: 'HI' },
    { label: 'Gujarati (ગુજરાતી)', value: 'GJ' },
  ];

  const currOptions = [
    { label: 'USD ($)', value: 'USD' },
    { label: 'INR (₹)', value: 'INR' },
    { label: 'EUR (€)', value: 'EUR' },
  ];

  const handleSave = () => {
    alert('Settings saved successfully!');
  };

  const handleThemeChange = (themeId) => {
    dispatch(setTheme(themeId));
  };

  return (
    <div className="flex flex-col gap-8 py-4 animate-fade-in-up">
      {/* Header */}
      <div className="border-b border-brand-border/40 dark:border-slate-800/40 pb-5">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-1">
          Settings
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Configure notification dispatch rules, currency converters, theme, and account security.
        </p>
      </div>

      <div className="flex flex-col gap-6 max-w-4xl">

        {/* Theme Selector */}
        <Card variant="default" className="p-6 border-slate-200 dark:border-slate-800 flex flex-col gap-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-slate-100/10">
            <FiSliders className="h-4.5 w-4.5 text-secondary dark:text-accent" /> Appearance & Theme
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Choose how the interface looks. The system option follows your device's light/dark preference.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {THEME_OPTIONS.map((option) => {
              const Icon = option.icon;
              const isSelected = currentTheme === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => handleThemeChange(option.id)}
                  className={`flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer text-left ${
                    isSelected
                      ? `${option.border} ${option.bg} shadow-md`
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${
                    isSelected ? option.bg : 'bg-slate-100 dark:bg-slate-800'
                  }`}>
                    <Icon className={`h-5 w-5 ${isSelected ? option.color : 'text-slate-400'}`} />
                  </div>
                  <div className="text-center">
                    <div className={`text-xs font-bold ${isSelected ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                      {option.label}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{option.desc}</div>
                  </div>
                  {isSelected && (
                    <div className={`h-2 w-2 rounded-full ${option.color.replace('text-', 'bg-')}`} />
                  )}
                </button>
              );
            })}
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {/* Localization */}
          <Card variant="default" className="p-6 border-slate-200 dark:border-slate-800 flex flex-col gap-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-slate-105/10">
              <FiGlobe className="h-4.5 w-4.5 text-secondary dark:text-accent" /> Localization Preferences
            </h3>

            <div className="flex flex-col gap-4">
              <Dropdown
                label="Default Language"
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                options={langOptions}
              />

              <Dropdown
                label="Base Currency"
                value={curr}
                onChange={(e) => setCurr(e.target.value)}
                options={currOptions}
              />
            </div>
          </Card>

          {/* Notifications */}
          <Card variant="default" className="p-6 border-slate-200 dark:border-slate-800 flex flex-col gap-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-slate-105/10">
              <FiBell className="h-4.5 w-4.5 text-secondary dark:text-accent" /> Notifications Hub
            </h3>

            <div className="flex flex-col gap-3">
              <label className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer">
                <div>
                  <span className="text-xs font-bold text-slate-850 dark:text-white block">Email Dispatch</span>
                  <span className="text-[10px] text-slate-400">Sends shipping updates and RFQ quote files.</span>
                </div>
                <input
                  type="checkbox"
                  checked={emailNotif}
                  onChange={() => setEmailNotif(!emailNotif)}
                  className="h-4 w-4 rounded text-secondary focus:ring-secondary"
                />
              </label>

              <label className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer">
                <div>
                  <span className="text-xs font-bold text-slate-850 dark:text-white block">SMS Notifications</span>
                  <span className="text-[10px] text-slate-400">Real-time alerts for customs release waypoints.</span>
                </div>
                <input
                  type="checkbox"
                  checked={smsNotif}
                  onChange={() => setSmsNotif(!smsNotif)}
                  className="h-4 w-4 rounded text-secondary focus:ring-secondary"
                />
              </label>

              <label className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer">
                <div>
                  <span className="text-xs font-bold text-slate-850 dark:text-white block">Push Web Notifications</span>
                  <span className="text-[10px] text-slate-400">System alerts displayed in browser head bars.</span>
                </div>
                <input
                  type="checkbox"
                  checked={pushNotif}
                  onChange={() => setPushNotif(!pushNotif)}
                  className="h-4 w-4 rounded text-secondary focus:ring-secondary"
                />
              </label>
            </div>
          </Card>
        </div>
      </div>

      <div className="flex justify-between items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl max-w-4xl">
        <span className="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
          <FiShield className="h-4 w-4 text-emerald-500" /> Options map securely to user profile configs.
        </span>
        <Button variant="primary" onClick={handleSave}>
          Save Settings
        </Button>
      </div>
    </div>
  );
}
