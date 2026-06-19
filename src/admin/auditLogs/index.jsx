import { useState } from 'react';
import { FiTerminal, FiSearch, FiCalendar, FiUser, FiInfo } from 'react-icons/fi';
import Card from '../../commonComponents/cards/Card';
import Table from '../../commonComponents/tables/Table';
import Input from '../../commonComponents/inputs/Input';

export default function AdminAuditLogsScreen() {
  const [search, setSearch] = useState('');

  const logs = [
    { id: 'LOG-9920', timestamp: '2026-06-12 00:45:12', action: 'Modified product price ($4,200)', module: 'Catalog Manager', actor: 'admin@zeelin.com', ip: '192.168.1.42' },
    { id: 'LOG-9919', timestamp: '2026-06-12 00:32:04', action: 'Approved custom shipping route', module: 'Logistics Desk', actor: 'logistics.agent@zeelin.com', ip: '192.168.1.105' },
    { id: 'LOG-9918', timestamp: '2026-06-11 23:55:40', action: 'Dispatched custom RFQ bid proposal', module: 'CRM RFQ Pipeline', actor: 'admin@zeelin.com', ip: '192.168.1.42' },
    { id: 'LOG-9917', timestamp: '2026-06-11 23:42:18', action: 'Customer logged in session', module: 'Auth Service', actor: 'client.acme@gmail.com', ip: '203.0.113.195' },
  ];

  const filteredLogs = logs.filter(log =>
    log.action.toLowerCase().includes(search.toLowerCase()) ||
    log.actor.toLowerCase().includes(search.toLowerCase()) ||
    log.module.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    { 
      key: 'timestamp', 
      label: 'Date & Time',
      render: (val) => <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">{val}</span>
    },
    { 
      key: 'actor', 
      label: 'User / Actor',
      render: (val) => (
        <span className="text-xs font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
          <FiUser className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400" />
          {val}
        </span>
      )
    },
    { 
      key: 'action', 
      label: 'Event Details',
      render: (val) => <span className="font-semibold text-slate-705 dark:text-slate-200">{val}</span>
    },
    { 
      key: 'module', 
      label: 'Control Module',
      render: (val) => <span className="text-xs font-semibold text-cyan-700 bg-cyan-50 border border-cyan-200/60 dark:text-cyan-400 dark:bg-cyan-950/20 dark:border-cyan-500/10 px-2.5 py-0.5 rounded-md">{val}</span>
    },
    { 
      key: 'ip', 
      label: 'IP Address',
      render: (val) => <span className="text-xs font-mono text-slate-500 dark:text-slate-400">{val}</span>
    }
  ];

  return (
    <div className="flex flex-col gap-8 py-2 animate-fade-in-up">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Security & Audit System Logs
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Audit modifications, login entries, catalog updates, and shipment proposal dispatches to maintain operational safety.
          </p>
        </div>
      </div>

      {/* Filter and search bar */}
      <Card variant="glass" hover={false} className="p-4 flex items-center justify-between gap-4">
        <div className="w-full sm:w-72">
          <Input
            placeholder="Search action logs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={FiSearch}
          />
        </div>
      </Card>

      {/* Database table */}
      <Table
        columns={columns}
        data={filteredLogs}
        emptyMessage="No security event logs found in system database."
        className="text-slate-700 dark:text-slate-350"
      />
    </div>
  );
}
