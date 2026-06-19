import React, { useState } from 'react';
import { 
  FiBox, FiCopy, FiCheck, FiTruck, FiClock, FiAlertTriangle, FiX, 
  FiArrowRight, FiTrendingUp, FiAnchor, FiBriefcase, FiDollarSign,
  FiEdit3, FiTrash2, FiPlus, FiGrid, FiLayers, FiUsers, FiSettings,
  FiTerminal, FiLock, FiChevronRight, FiChevronDown, FiGlobe
} from 'react-icons/fi';
import CakePricingModal from '../../commonComponents/modals/CakePricingModal';

export default function AdminDesignSystemScreen() {
  const [activeTab, setActiveTab] = useState('colors');
  const [isCakeModalOpen, setIsCakeModalOpen] = useState(false);
  const [copiedText, setCopiedText] = useState('');
  const [copiedTimer, setCopiedTimer] = useState(null);

  const tabs = [
    { id: 'colors', label: 'Colors' },
    { id: 'typography', label: 'Typography' },
    { id: 'spacing', label: 'Spacing & Grid' },
    { id: 'components', label: 'Components' },
    { id: 'navigation', label: 'Navigation' },
    { id: 'icons', label: 'Icons' },
    { id: 'responsive', label: 'Responsive' }
  ];

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    if (copiedTimer) clearTimeout(copiedTimer);
    const timer = setTimeout(() => setCopiedText(''), 2000);
    setCopiedTimer(timer);
  };

  const palettes = {
    navy: {
      name: 'Navy (Primary)',
      swatches: [
        { hex: '#0F1729', isDark: true },
        { hex: '#1A2540', isDark: true },
        { hex: '#243358', isDark: true },
        { hex: '#3D5A96', isDark: true },
        { hex: '#8FA3C8', isDark: false },
        { hex: '#E0E6F0', isDark: false },
        { hex: '#F0F4F9', isDark: false }
      ]
    },
    amber: {
      name: 'Amber (Accent)',
      swatches: [
        { hex: '#3D1F00', isDark: true },
        { hex: '#8C4A00', isDark: true },
        { hex: '#D97706', isDark: true },
        { hex: '#F59E0B', isDark: false },
        { hex: '#FCD34D', isDark: false },
        { hex: '#FEF3C7', isDark: false },
        { hex: '#FFFBEB', isDark: false }
      ]
    },
    success: {
      name: 'Success',
      swatches: [
        { hex: '#022C22', isDark: true },
        { hex: '#059669', isDark: true },
        { hex: '#ECFDF5', isDark: false }
      ]
    },
    danger: {
      name: 'Danger',
      swatches: [
        { hex: '#DC2626', isDark: true },
        { hex: '#FEF2F2', isDark: false }
      ]
    },
    info: {
      name: 'Info',
      swatches: [
        { hex: '#0EA5E9', isDark: false },
        { hex: '#F0F9FF', isDark: false }
      ]
    }
  };

  return (
    <div className="flex flex-col gap-6 py-2 animate-fade-in-up">
      {/* Toast Notification */}
      {copiedText && (
        <div className="fixed bottom-6 right-6 bg-[#0F1729] dark:bg-white text-white dark:text-[#0F1729] px-4 py-3 rounded-xl shadow-xl z-50 flex items-center gap-2 border border-slate-800/20 text-xs font-semibold animate-pulse-slow">
          <FiCheck className="h-4 w-4 text-emerald-500" />
          <span>Copied value: <span className="font-mono">{copiedText}</span></span>
        </div>
      )}

      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="flex items-center gap-3.5">
          <div className="h-10 w-10 rounded-xl bg-[#0F1729] dark:bg-[#1A2540] flex items-center justify-center text-amber-500 border border-slate-800 shadow-md">
            <FiBox className="h-5.5 w-5.5 text-amber-500" />
          </div>
          <div>
            <h1 className="text-display-md font-extrabold text-[#0F1729] dark:text-white tracking-tight">BoxPrototype</h1>
            <p className="text-body-sm text-slate-500 dark:text-slate-400 font-medium">Design System · v1.0 · Import Export + E-Commerce + CRM</p>
          </div>
        </div>
      </div>

      {/* Horizontal Tabs Navigation */}
      <div className="flex gap-2 overflow-x-auto pb-3 border-b border-slate-200 dark:border-slate-800 scrollbar-thin">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-2 text-[11px] font-bold rounded-xl border uppercase tracking-wider transition-all select-none whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-[#0F1729] border-[#0F1729] text-white dark:bg-white dark:border-white dark:text-[#0F1729] shadow-md'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      <div className="bg-transparent rounded-2xl">
        
        {/* Colors Tab */}
        {activeTab === 'colors' && (
          <div className="flex flex-col gap-8">
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-4">Brand Palette</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6">
                {Object.entries(palettes).map(([key, group]) => (
                  <div key={key} className="flex flex-col gap-2">
                    <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">{group.name}</h4>
                    <div className="flex flex-col gap-1.5">
                      {group.swatches.map((swatch, idx) => (
                        <div
                          key={idx}
                          onClick={() => handleCopy(swatch.hex)}
                          className="group relative h-10 rounded-lg flex items-center justify-between px-3 cursor-pointer shadow-xs border border-black/5 dark:border-white/5 transition-transform active:scale-98"
                          style={{ backgroundColor: swatch.hex }}
                        >
                          <span 
                            className={`font-mono text-xs font-semibold tracking-tight ${
                              swatch.isDark ? 'text-white' : 'text-slate-900'
                            }`}
                          >
                            {swatch.hex}
                          </span>
                          <FiCopy className={`h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity ${
                            swatch.isDark ? 'text-white/60' : 'text-slate-500'
                          }`} />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-slate-200 dark:border-slate-800 pt-8">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-4">Status Badge Preview</span>
              <div className="flex flex-wrap gap-3.5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-semibold bg-[#E0F2FE] text-[#0284C7] border border-[#bae6fd]">
                  <FiTruck className="h-3.5 w-3.5 shrink-0" /> In Transit
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-semibold bg-[#ECFDF5] text-[#059669] border border-[#a7f3d0]">
                  <FiCheck className="h-3.5 w-3.5 shrink-0" /> Delivered
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-semibold bg-[#FFFBEB] text-[#D97706] border border-[#fef3c7]">
                  <FiClock className="h-3.5 w-3.5 shrink-0" /> Pending
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-semibold bg-[#FEF3C7] text-[#8C4A00] border border-[#fde68a]">
                  <FiAlertTriangle className="h-3.5 w-3.5 shrink-0" /> Customs Hold
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-semibold bg-[#FEF2F2] text-[#DC2626] border border-[#fecaca]">
                  <FiX className="h-3.5 w-3.5 shrink-0" /> Cancelled
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-semibold bg-[#F0F4F9] text-[#4B5563] border border-[#E0E6F0]">
                  Draft
                </span>
              </div>
            </div>

            <div className="border-t border-slate-200 dark:border-slate-800 pt-8">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-4">KPI Cards Preview</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* Active Shipments */}
                <div className="rounded-xl p-5 bg-[#F5F5F3] dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Active Shipments</span>
                  <div className="flex items-baseline gap-2 mt-3 mb-1">
                    <span className="text-3xl font-extrabold text-[#0F1729] dark:text-white">142</span>
                  </div>
                  <span className="text-xs font-semibold text-[#059669] flex items-center gap-1">
                    ↑ 12% vs last month
                  </span>
                </div>

                {/* Revenue */}
                <div className="rounded-xl p-5 bg-[#F5F5F3] dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Revenue (USD)</span>
                  <div className="flex items-baseline gap-2 mt-3 mb-1">
                    <span className="text-3xl font-extrabold text-[#0F1729] dark:text-white">$2.4M</span>
                  </div>
                  <span className="text-xs font-semibold text-[#059669] flex items-center gap-1">
                    ↑ 8.3%
                  </span>
                </div>

                {/* Pending Orders */}
                <div className="rounded-xl p-5 bg-[#F5F5F3] dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Pending Orders</span>
                  <div className="flex items-baseline gap-2 mt-3 mb-1">
                    <span className="text-3xl font-extrabold text-[#0F1729] dark:text-white">38</span>
                  </div>
                  <span className="text-xs font-semibold text-[#DC2626] flex items-center gap-1">
                    ↓ needs action
                  </span>
                </div>

                {/* Open Leads */}
                <div className="rounded-xl p-5 bg-[#F5F5F3] dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Open Leads</span>
                  <div className="flex items-baseline gap-2 mt-3 mb-1">
                    <span className="text-3xl font-extrabold text-[#0F1729] dark:text-white">67</span>
                  </div>
                  <span className="text-xs font-semibold text-slate-400">
                    — steady
                  </span>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* Typography Tab */}
        {activeTab === 'typography' && (
          <div className="flex flex-col gap-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
              
              {/* Font families */}
              <div className="md:col-span-1 rounded-xl p-5 bg-[#F5F5F3] dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col gap-4">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Font Families</span>
                <div className="divide-y divide-slate-200 dark:divide-slate-800">
                  <div className="py-2.5 flex justify-between items-center text-xs">
                    <span className="text-slate-400">Display</span>
                    <span className="font-bold font-display text-slate-800 dark:text-white">Plus Jakarta Sans</span>
                  </div>
                  <div className="py-2.5 flex justify-between items-center text-xs">
                    <span className="text-slate-400">Body / UI</span>
                    <span className="font-semibold font-sans text-slate-800 dark:text-white">DM Sans</span>
                  </div>
                  <div className="py-2.5 flex justify-between items-center text-xs">
                    <span className="text-slate-400">Monospace</span>
                    <span className="font-mono text-slate-800 dark:text-white">JetBrains Mono</span>
                  </div>
                </div>
              </div>

              {/* Type Scale Table */}
              <div className="md:col-span-2 flex flex-col gap-4">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Type Scale</span>
                <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-850">
                  
                  {/* Row Display XL */}
                  <div className="p-4 grid grid-cols-1 sm:grid-cols-4 gap-2 items-center bg-white dark:bg-slate-950">
                    <div className="text-xs font-mono text-slate-400">display-xl / 40px</div>
                    <div className="sm:col-span-3 text-display-xl text-[#0F1729] dark:text-white">BoxPrototype</div>
                  </div>

                  {/* Row Display LG */}
                  <div className="p-4 grid grid-cols-1 sm:grid-cols-4 gap-2 items-center bg-white dark:bg-slate-950">
                    <div className="text-xs font-mono text-slate-400">display-lg / 32px</div>
                    <div className="sm:col-span-3 text-display-lg text-[#0F1729] dark:text-white">All Shipments</div>
                  </div>

                  {/* Row Display MD */}
                  <div className="p-4 grid grid-cols-1 sm:grid-cols-4 gap-2 items-center bg-white dark:bg-slate-950">
                    <div className="text-xs font-mono text-slate-400">display-md / 26px</div>
                    <div className="sm:col-span-3 text-display-md text-[#0F1729] dark:text-white">Trade Summary</div>
                  </div>

                  {/* Row Heading XL */}
                  <div className="p-4 grid grid-cols-1 sm:grid-cols-4 gap-2 items-center bg-white dark:bg-slate-950">
                    <div className="text-xs font-mono text-slate-400">heading-xl / 22px</div>
                    <div className="sm:col-span-3 text-heading-xl text-[#0F1729] dark:text-white">Create New Shipment</div>
                  </div>

                  {/* Row Heading LG */}
                  <div className="p-4 grid grid-cols-1 sm:grid-cols-4 gap-2 items-center bg-white dark:bg-slate-950">
                    <div className="text-xs font-mono text-slate-400">heading-lg / 18px</div>
                    <div className="sm:col-span-3 text-heading-lg text-[#0F1729] dark:text-white">Shipment Details</div>
                  </div>

                  {/* Row Heading MD */}
                  <div className="p-4 grid grid-cols-1 sm:grid-cols-4 gap-2 items-center bg-white dark:bg-slate-950">
                    <div className="text-xs font-mono text-slate-400">heading-md / 16px</div>
                    <div className="sm:col-span-3 text-heading-md text-[#0F1729] dark:text-white">Cargo Items</div>
                  </div>

                  {/* Row Body LG */}
                  <div className="p-4 grid grid-cols-1 sm:grid-cols-4 gap-2 items-center bg-white dark:bg-slate-950">
                    <div className="text-xs font-mono text-slate-400">body-lg / 16px</div>
                    <div className="sm:col-span-3 text-body-lg text-slate-600 dark:text-slate-300">
                      Standard body text for descriptions, instructions, and content areas across the platform.
                    </div>
                  </div>

                  {/* Row Body MD */}
                  <div className="p-4 grid grid-cols-1 sm:grid-cols-4 gap-2 items-center bg-white dark:bg-slate-950">
                    <div className="text-xs font-mono text-slate-400">body-md / 14px</div>
                    <div className="sm:col-span-3 text-body-md text-slate-600 dark:text-slate-300">
                      Default UI text for labels, metadata, and table content.
                    </div>
                  </div>

                  {/* Row Body SM */}
                  <div className="p-4 grid grid-cols-1 sm:grid-cols-4 gap-2 items-center bg-white dark:bg-slate-950">
                    <div className="text-xs font-mono text-slate-400">body-sm / 13px</div>
                    <div className="sm:col-span-3 text-body-sm text-slate-500 dark:text-slate-400">
                      Secondary text, captions, and helper content.
                    </div>
                  </div>

                  {/* Row Label SM */}
                  <div className="p-4 grid grid-cols-1 sm:grid-cols-4 gap-2 items-center bg-white dark:bg-slate-950">
                    <div className="text-xs font-mono text-slate-400">label-sm / 11px</div>
                    <div className="sm:col-span-3 text-label-sm text-slate-400 dark:text-slate-500">
                      SECTION OVERLINE · STATUS · CATEGORY
                    </div>
                  </div>

                  {/* Row Data LG */}
                  <div className="p-4 grid grid-cols-1 sm:grid-cols-4 gap-2 items-center bg-white dark:bg-slate-950">
                    <div className="text-xs font-mono text-slate-400">data-lg / 24px</div>
                    <div className="sm:col-span-3 text-data-lg text-[#0F1729] dark:text-white">$1,248,300</div>
                  </div>

                  {/* Row Code */}
                  <div className="p-4 grid grid-cols-1 sm:grid-cols-4 gap-2 items-center bg-white dark:bg-slate-950">
                    <div className="text-xs font-mono text-slate-400">code / 13px mono</div>
                    <div className="sm:col-span-3">
                      <span className="text-code">SHP-2024-00134 · HS 8471.30</span>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </div>
        )}

        {/* Spacing & Grid Tab */}
        {activeTab === 'spacing' && (
          <div className="flex flex-col gap-8">
            
            {/* Spacing Scale */}
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-4">Spacing Scale (8px Base)</span>
              <div className="flex flex-wrap items-end gap-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-xl">
                {[
                  { name: '4px', size: 4 },
                  { name: '8px', size: 8 },
                  { name: '12px', size: 12 },
                  { name: '16px', size: 16 },
                  { name: '24px', size: 24 },
                  { name: '32px', size: 32 },
                  { name: '48px', size: 48 },
                  { name: '64px', size: 64 },
                ].map((sp) => (
                  <div key={sp.name} className="flex flex-col items-center gap-2">
                    <div 
                      className="bg-primary-slate/70 dark:bg-primary-blue/50 rounded-xs"
                      style={{ width: sp.size, height: sp.size }}
                    />
                    <span className="text-[11px] font-semibold text-slate-500 font-mono">{sp.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Border Radius Scale */}
            <div className="border-t border-slate-200 dark:border-slate-800 pt-8">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-4">Border Radius Scale</span>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-6">
                {[
                  { name: '4px sm', radiusClass: 'rounded-sm' },
                  { name: '8px md', radiusClass: 'rounded-md' },
                  { name: '12px lg', radiusClass: 'rounded-lg' },
                  { name: '16px xl', radiusClass: 'rounded-xl' },
                  { name: 'full', radiusClass: 'rounded-full h-16 w-16' },
                ].map((rad) => (
                  <div key={rad.name} className="flex flex-col items-center gap-2">
                    <div className={`bg-primary-slate/50 border border-primary-slate h-16 w-16 flex items-center justify-center ${rad.radiusClass}`} />
                    <span className="text-xs font-semibold text-slate-500">{rad.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Grid System specs */}
            <div className="border-t border-slate-200 dark:border-slate-800 pt-8">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-4">Grid System</span>
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900 text-sm">
                {[
                  { param: 'Columns', val: '12-column fluid' },
                  { param: 'Max width', val: '1440px' },
                  { param: 'Gutter desktop', val: '24px' },
                  { param: 'Gutter tablet', val: '16px' },
                  { param: 'Gutter mobile', val: '12px' },
                  { param: 'Sidebar width', val: '240px expanded / 68px collapsed' },
                  { param: 'Header height', val: '64px desktop / 56px mobile' },
                ].map((spec, idx) => (
                  <div 
                    key={spec.param} 
                    className={`px-5 py-3.5 flex justify-between items-center ${
                      idx % 2 === 0 ? 'bg-slate-50/50 dark:bg-slate-900/40' : 'bg-white dark:bg-slate-950'
                    }`}
                  >
                    <span className="text-slate-500 font-medium">{spec.param}</span>
                    <span className="font-semibold text-slate-900 dark:text-white font-mono text-xs">{spec.val}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* Components Tab */}
        {activeTab === 'components' && (
          <div className="flex flex-col gap-8">
            
            {/* Buttons Row */}
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-4">Buttons</span>
              <div className="flex flex-wrap gap-4 items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-xl">
                
                <button className="inline-flex items-center gap-1.5 px-4 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-800 dark:text-white rounded-lg text-xs font-bold hover:bg-slate-55 transition-all shadow-xs active:scale-98">
                  <FiPlus className="h-4 w-4 shrink-0 text-slate-500" /> New Shipment
                </button>

                <button className="inline-flex items-center px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-bold hover:bg-slate-200/80 transition-all active:scale-98">
                  Export Data
                </button>

                <button className="inline-flex items-center px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-bold hover:bg-slate-200/80 transition-all active:scale-98">
                  View Details
                </button>

                <button className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-bold hover:bg-slate-200/80 transition-all active:scale-98">
                  <FiEdit3 className="h-3.5 w-3.5 shrink-0 text-slate-500" /> Edit
                </button>

                <button className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-bold hover:bg-slate-200/80 transition-all active:scale-98" onClick={() => setIsCakeModalOpen(true)}>
                  Launch Cake Pricing Form
                </button>

              </div>
            </div>

            {/* Form Inputs Row */}
            <div className="border-t border-slate-200 dark:border-slate-800 pt-8">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-4">Form Inputs</span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                
                {/* Destination Port Input */}
                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Destination Port</label>
                  <input
                    type="text"
                    defaultValue="Los Angeles, USA"
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-[#F0F4F9]/60 dark:bg-slate-900 text-sm text-slate-800 dark:text-white px-3.5 py-2.5 outline-none"
                    placeholder="Enter Port"
                  />
                </div>

                {/* HS Code Input */}
                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">HS Code (focused)</label>
                  <input
                    type="text"
                    defaultValue="8471.30.00"
                    className="w-full rounded-lg border border-amber-500 ring-2 ring-amber-500/20 bg-white dark:bg-slate-900 text-sm text-slate-800 dark:text-white px-3.5 py-2.5 outline-none transition-all"
                  />
                </div>

              </div>
            </div>

            {/* Data Table Preview Row */}
            <div className="border-t border-slate-200 dark:border-slate-800 pt-8">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-4">Data Table Preview</span>
              <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900">
                <div className="w-full overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60">
                        {['Shipment ID', 'Customer', 'Route', 'Status', 'ETA'].map((col) => (
                          <th key={col} className="px-5 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-xs">
                      
                      {/* Row 1 */}
                      <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                        <td className="px-5 py-4 font-mono font-medium text-slate-700 dark:text-slate-300">SHP-2024-00134</td>
                        <td className="px-5 py-4 font-semibold text-slate-800 dark:text-white">Acme Global Ltd</td>
                        <td className="px-5 py-4 font-semibold text-slate-600 dark:text-slate-400">SHA → LAX</td>
                        <td className="px-5 py-4">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-[#E0F2FE] text-[#0284C7]">
                            In Transit
                          </span>
                        </td>
                        <td className="px-5 py-4 font-semibold text-slate-600 dark:text-slate-400">Nov 28</td>
                      </tr>

                      {/* Row 2 */}
                      <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                        <td className="px-5 py-4 font-mono font-medium text-slate-700 dark:text-slate-300">SHP-2024-00133</td>
                        <td className="px-5 py-4 font-semibold text-slate-800 dark:text-white">TechBridge Inc</td>
                        <td className="px-5 py-4 font-semibold text-slate-600 dark:text-slate-400">HKG → LHR</td>
                        <td className="px-5 py-4">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-[#FEF3C7] text-[#8C4A00]">
                            Customs Hold
                          </span>
                        </td>
                        <td className="px-5 py-4 font-semibold text-slate-600 dark:text-slate-400">Dec 4</td>
                      </tr>

                      {/* Row 3 */}
                      <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                        <td className="px-5 py-4 font-mono font-medium text-slate-700 dark:text-slate-300">SHP-2024-00132</td>
                        <td className="px-5 py-4 font-semibold text-slate-800 dark:text-white">OceanTrade Co</td>
                        <td className="px-5 py-4 font-semibold text-slate-600 dark:text-slate-400">DXB → JFK</td>
                        <td className="px-5 py-4">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-[#ECFDF5] text-[#059669]">
                            Delivered
                          </span>
                        </td>
                        <td className="px-5 py-4 font-semibold text-slate-600 dark:text-slate-400">Nov 22</td>
                      </tr>

                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Shipment Card (Mobile/Compact) */}
            <div className="border-t border-slate-200 dark:border-slate-800 pt-8">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-4">Shipment Card (Mobile/Compact)</span>
              <div className="max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl relative overflow-hidden pl-3 py-4 pr-5 shadow-xs transition-shadow hover:shadow-md">
                
                {/* Thick Left Amber accent border */}
                <div className="absolute top-0 left-0 bottom-0 w-1 bg-amber-500" />
                
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <span className="text-xs font-mono font-semibold text-slate-500 tracking-tight block">SHP-2024-00134</span>
                    <div className="flex items-center gap-1.5 mt-2 mb-1.5">
                      <FiAnchor className="h-4 w-4 text-slate-400" />
                      <span className="text-sm font-bold text-slate-800 dark:text-white">Shanghai</span>
                      <FiArrowRight className="h-3.5 w-3.5 text-slate-400" />
                      <span className="text-sm font-bold text-slate-800 dark:text-white">Los Angeles</span>
                    </div>
                    <span className="text-xs text-slate-500 font-semibold">
                      ETA: Nov 28 · Maersk Line
                    </span>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-[#E0F2FE] text-[#0284C7]">
                    In Transit
                  </span>
                </div>

              </div>
            </div>

          </div>
        )}

        {/* Navigation Tab */}
        {activeTab === 'navigation' && (
          <div className="flex flex-col gap-8">
            
            {/* Breadcrumbs Preview */}
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-4">Breadcrumbs</span>
              <div className="flex items-center gap-2 text-xs font-semibold bg-white dark:bg-slate-900 p-4 border border-slate-200 dark:border-slate-800 rounded-xl">
                <span className="text-slate-400 hover:text-slate-600 cursor-pointer">Admin</span>
                <FiChevronRight className="h-3.5 w-3.5 text-slate-300" />
                <span className="text-slate-400 hover:text-slate-600 cursor-pointer">Cargo Logistics</span>
                <FiChevronRight className="h-3.5 w-3.5 text-slate-300" />
                <span className="text-slate-800 dark:text-white">Shipment Tracking</span>
              </div>
            </div>

            {/* Sidebar Preview */}
            <div className="border-t border-slate-200 dark:border-slate-800 pt-8">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-4">Sidebar Layout</span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                
                {/* Expanded Sidebar Mock */}
                <div className="bg-[#0F1729] rounded-xl border border-slate-800 p-4 w-60">
                  <div className="flex items-center gap-2 pb-4 border-b border-slate-800 mb-4">
                    <FiBox className="h-4.5 w-4.5 text-amber-500" />
                    <span className="text-xs font-extrabold text-white tracking-wider">ZEELIN<span className="text-amber-500">CRM</span></span>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-3 px-3 py-2 text-xs font-bold text-white bg-amber-600 rounded-lg shadow-sm">
                      <FiGrid className="h-4 w-4" />
                      <span>Dashboard</span>
                    </div>
                    <div className="flex items-center gap-3 px-3 py-2 text-xs font-bold text-slate-400 hover:text-white rounded-lg cursor-pointer transition-colors">
                      <FiLayers className="h-4 w-4" />
                      <span>Products</span>
                    </div>
                    <div className="flex items-center gap-3 px-3 py-2 text-xs font-bold text-slate-400 hover:text-white rounded-lg cursor-pointer transition-colors">
                      <FiUsers className="h-4 w-4" />
                      <span>CRM Leads</span>
                    </div>
                  </div>
                </div>

                {/* Collapsed Sidebar Mock */}
                <div className="bg-[#0F1729] rounded-xl border border-slate-800 p-4 w-18 flex flex-col items-center">
                  <div className="pb-4 border-b border-slate-800 mb-4">
                    <FiBox className="h-4.5 w-4.5 text-amber-500" />
                  </div>
                  <div className="flex flex-col gap-3">
                    <div className="p-2 text-white bg-amber-600 rounded-lg shadow-sm">
                      <FiGrid className="h-4 w-4" />
                    </div>
                    <div className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg cursor-pointer transition-all">
                      <FiLayers className="h-4 w-4" />
                    </div>
                    <div className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg cursor-pointer transition-all">
                      <FiUsers className="h-4 w-4" />
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        )}

        {/* Icons Tab */}
        {activeTab === 'icons' && (
          <div className="flex flex-col gap-6">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">System Icon Library</span>
            <p className="text-body-sm text-slate-500 dark:text-slate-400 -mt-2">These are the default icons used in the CRM sidebar navigation and actions. Click an icon to copy its component name.</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4 mt-2">
              {[
                { name: 'FiGrid', icon: FiGrid },
                { name: 'FiBox', icon: FiBox },
                { name: 'FiLayers', icon: FiLayers },
                { name: 'FiUsers', icon: FiUsers },
                { name: 'FiTrendingUp', icon: FiTrendingUp },
                { name: 'FiAnchor', icon: FiAnchor },
                { name: 'FiBriefcase', icon: FiBriefcase },
                { name: 'FiDollarSign', icon: FiDollarSign },
                { name: 'FiTerminal', icon: FiTerminal },
                { name: 'FiLock', icon: FiLock },
                { name: 'FiSettings', icon: FiSettings },
                { name: 'FiGlobe', icon: FiGlobe }
              ].map((ic) => {
                const IconComp = ic.icon;
                return (
                  <div 
                    key={ic.name} 
                    onClick={() => handleCopy(ic.name)}
                    className="flex flex-col items-center gap-3 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-amber-500/50 cursor-pointer transition-all active:scale-98"
                  >
                    <IconComp className="h-6 w-6 text-slate-500 dark:text-slate-400 group-hover:text-amber-500" />
                    <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 font-mono">{ic.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Responsive Tab */}
        {activeTab === 'responsive' && (
          <div className="flex flex-col gap-6">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Layout Breakpoint Guidelines</span>
            <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900">
              <div className="w-full overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60">
                      {['Breakpoint', 'Min Width', 'Use Case', 'Layout Behavior'].map((col) => (
                        <th key={col} className="px-5 py-3.5 font-bold text-slate-400 uppercase tracking-wider">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                    
                    <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                      <td className="px-5 py-4 font-bold text-[#0F1729] dark:text-white font-mono">sm:</td>
                      <td className="px-5 py-4 font-mono text-slate-500">640px</td>
                      <td className="px-5 py-4 font-medium text-slate-600 dark:text-slate-400">Mobile Landscape / Small Tablets</td>
                      <td className="px-5 py-4 font-medium text-slate-600 dark:text-slate-400">Cards stack vertically; gutters decrease to 12px.</td>
                    </tr>

                    <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                      <td className="px-5 py-4 font-bold text-[#0F1729] dark:text-white font-mono">md:</td>
                      <td className="px-5 py-4 font-mono text-slate-500">768px</td>
                      <td className="px-5 py-4 font-medium text-slate-600 dark:text-slate-400">Tablets (Portraits)</td>
                      <td className="px-5 py-4 font-medium text-slate-600 dark:text-slate-400">Sidebar collapses to 68px icon drawer. Gutters transition to 16px.</td>
                    </tr>

                    <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                      <td className="px-5 py-4 font-bold text-[#0F1729] dark:text-white font-mono">lg:</td>
                      <td className="px-5 py-4 font-mono text-slate-500">1024px</td>
                      <td className="px-5 py-4 font-medium text-slate-600 dark:text-slate-400">Desktop / Large Tablets</td>
                      <td className="px-5 py-4 font-medium text-slate-600 dark:text-slate-400">Expanded 240px sidebar is locked left. Grid expands.</td>
                    </tr>

                    <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                      <td className="px-5 py-4 font-bold text-[#0F1729] dark:text-white font-mono">xl:</td>
                      <td className="px-5 py-4 font-mono text-slate-500">1280px</td>
                      <td className="px-5 py-4 font-medium text-slate-600 dark:text-slate-400">Widescreen Displays</td>
                      <td className="px-5 py-4 font-medium text-slate-600 dark:text-slate-400">Max page width clamps at 1440px. 24px margins.</td>
                    </tr>

                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </div>

      <CakePricingModal
        isOpen={isCakeModalOpen}
        onClose={() => setIsCakeModalOpen(false)}
      />
    </div>
  );
}
