import { useState } from 'react';
import { FiPlus, FiFilter, FiUserCheck, FiSearch } from 'react-icons/fi';
import Card from '../../commonComponents/cards/Card';
import Table from '../../commonComponents/tables/Table';
import Button from '../../commonComponents/buttons/Button';
import Input from '../../commonComponents/inputs/Input';

export default function AdminLeadsScreen() {
  const [search, setSearch] = useState('');

  const leads = [
    { id: 'L-101', name: 'Albert Hofman', company: 'Sandoz Chemicals Ltd', value: '$85,000', stage: 'Proposal Sent', assigned: 'Sarah Jenkins', date: 'June 08, 2026' },
    { id: 'L-102', name: 'Marcus Aurelius', company: 'Rome Logistics', value: '$22,500', stage: 'Contacted', assigned: 'Dave Miller', date: 'June 07, 2026' },
    { id: 'L-103', name: 'Linus Torvalds', company: 'OpenSource Grains Co', value: '$120,000', stage: 'Qualified', assigned: 'Sarah Jenkins', date: 'June 05, 2026' },
    { id: 'L-104', name: 'Ada Lovelace', company: 'Babbage Spares', value: '$45,000', stage: 'Closed Won', assigned: 'Dave Miller', date: 'June 02, 2026' },
  ];

  const columns = [
    { 
      key: 'id', 
      label: 'Lead ID',
      render: (val) => <span className="font-mono font-bold text-slate-500 dark:text-slate-400">{val}</span>
    },
    { 
      key: 'name', 
      label: 'Contact Person',
      render: (val) => <span className="font-bold text-slate-900 dark:text-white">{val}</span>
    },
    { 
      key: 'company', 
      label: 'Enterprise client',
      render: (val) => <span className="font-medium text-slate-750 dark:text-slate-300">{val}</span>
    },
    { 
      key: 'value', 
      label: 'Est. Deal Value',
      render: (val) => <span className="font-semibold text-cyan-600 dark:text-cyan-400">{val}</span>
    },
    {
      key: 'stage',
      label: 'CRM Stage',
      render: (val) => {
        const colors = {
          'Contacted': 'bg-slate-100 text-slate-650 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-705',
          'Qualified': 'bg-sky-50 text-sky-700 border-sky-200/60 dark:bg-sky-500/10 dark:text-sky-400 dark:border-sky-500/20',
          'Proposal Sent': 'bg-amber-50 text-amber-700 border-amber-200/60 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20',
          'Closed Won': 'bg-emerald-50 text-emerald-700 border-emerald-200/60 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20',
        };
        return (
          <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold border uppercase tracking-wider ${colors[val] || 'bg-slate-100 text-slate-500 border-slate-200'}`}>
            {val}
          </span>
        );
      }
    },
    { 
      key: 'assigned', 
      label: 'Sales Exec',
      render: (val) => <span className="text-xs text-slate-600 dark:text-slate-300">{val}</span>
    },
    { 
      key: 'date', 
      label: 'Captured',
      render: (val) => <span className="text-xs text-slate-500 dark:text-slate-400">{val}</span>
    },
  ];

  const filteredLeads = leads.filter(l =>
    l.company.toLowerCase().includes(search.toLowerCase()) ||
    l.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-8 py-2 animate-fade-in-up">
      {/* Header toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            CRM Leads Workspace
          </h1>
          <p className="text-xs text-slate-505 dark:text-slate-400 mt-1">
            Qualify incoming buyer leads, assign account executives, and log negotiation status.
          </p>
        </div>
        
        <Button variant="primary" size="sm" icon={FiPlus}>
          Add New Lead Account
        </Button>
      </div>

      {/* CRM Actions bar */}
      <Card variant="glass" hover={false} className="p-4 flex flex-wrap gap-4 items-center justify-between shadow-premium">
        <div className="w-full sm:w-72">
          <Input
            placeholder="Search leads company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={FiSearch}
          />
        </div>
        
        <div className="flex items-center gap-2.5">
          <Button variant="outline" size="sm" icon={FiFilter} className="border-slate-200 dark:border-slate-800 text-slate-550 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white">Filters</Button>
          <Button variant="outline" size="sm" icon={FiUserCheck} className="border-slate-200 dark:border-slate-800 text-slate-550 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white">Assign Agent</Button>
        </div>
      </Card>

      {/* Leads table */}
      <Table
        columns={columns}
        data={filteredLeads}
        emptyMessage="No leads records match filters."
        className="text-slate-700 dark:text-slate-350"
      />
    </div>
  );
}
