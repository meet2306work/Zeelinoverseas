import { useState } from 'react';
import { FiDollarSign, FiSearch, FiCalendar, FiCheckCircle, FiClock, FiFileText } from 'react-icons/fi';
import Card from '../../commonComponents/cards/Card';
import Table from '../../commonComponents/tables/Table';
import Input from '../../commonComponents/inputs/Input';

export default function AdminPaymentsScreen() {
  const [search, setSearch] = useState('');

  const payments = [
    { id: 'TXN-90284', client: 'Jürgen Klopp', company: 'Westside Logistics', amount: '$4,200.00', method: 'Telegraphic Transfer (T/T)', date: 'June 10, 2026', status: 'Cleared' },
    { id: 'TXN-90283', client: 'Ramesh Patel', company: 'Gujarat Cotton Mills', amount: '$5,500.00', method: 'Letter of Credit (L/C)', date: 'June 09, 2026', status: 'Cleared' },
    { id: 'TXN-90282', client: 'Jane Smith', company: 'Apex Structural Steel', amount: '$7,200.00', method: 'Credit Card', date: 'June 08, 2026', status: 'Cleared' },
    { id: 'TXN-90281', client: 'Herman Miller Inc', amount: '$8,400.00', company: 'Herman Miller Inc', method: 'Escrow Account Wire', date: 'June 07, 2026', status: 'Pending Verification' },
  ];

  const filteredPayments = payments.filter(p =>
    p.id.toLowerCase().includes(search.toLowerCase()) ||
    p.company.toLowerCase().includes(search.toLowerCase()) ||
    p.method.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    { 
      key: 'id', 
      label: 'Transaction ID',
      render: (val) => <span className="font-mono font-bold text-slate-500 dark:text-slate-400">{val}</span>
    },
    { 
      key: 'company', 
      label: 'Client Company',
      render: (val, row) => (
        <div className="flex flex-col">
          <span className="font-bold text-slate-900 dark:text-white">{val}</span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">Payer: {row.client}</span>
        </div>
      )
    },
    { 
      key: 'amount', 
      label: 'Receipt Amount',
      render: (val) => <span className="font-extrabold text-cyan-600 dark:text-cyan-400">{val}</span>
    },
    { 
      key: 'method', 
      label: 'Payment Mode',
      render: (val) => <span className="text-xs text-slate-700 dark:text-slate-300 font-semibold">{val}</span>
    },
    { 
      key: 'date', 
      label: 'Date Settled',
      render: (val) => <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5"><FiCalendar className="h-3.5 w-3.5" /> {val}</span>
    },
    {
      key: 'status',
      label: 'Status',
      render: (val) => {
        const colors = {
          'Cleared': 'bg-emerald-50 text-emerald-700 border-emerald-200/60 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/25',
          'Pending Verification': 'bg-amber-50 text-amber-700 border-amber-200/60 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/25',
        };
        return (
          <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold border uppercase tracking-wider ${colors[val] || 'bg-slate-100'}`}>
            {val}
          </span>
        );
      }
    }
  ];

  return (
    <div className="flex flex-col gap-8 py-2 animate-fade-in-up">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Payments & Commercial Ledger
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Review wire transactions, letter of credit clearances, and verify client deposit accounts to unlock supply chain logistics.
          </p>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card variant="glass" className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Received (Gross)</p>
              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">$25,300.00</h3>
            </div>
            <div className="h-10 w-10 bg-cyan-50 text-cyan-600 dark:bg-cyan-500/10 dark:text-cyan-400 rounded-xl flex items-center justify-center">
              <FiDollarSign className="h-5.5 w-5.5" />
            </div>
          </div>
        </Card>

        <Card variant="glass" className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Cleared Receipts</p>
              <h3 className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-450 mt-1">$16,900.00</h3>
            </div>
            <div className="h-10 w-10 bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-450 rounded-xl flex items-center justify-center">
              <FiCheckCircle className="h-5.5 w-5.5" />
            </div>
          </div>
        </Card>

        <Card variant="glass" className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Awaiting Verification</p>
              <h3 className="text-2xl font-extrabold text-amber-600 dark:text-amber-450 mt-1">$8,400.00</h3>
            </div>
            <div className="h-10 w-10 bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-450 rounded-xl flex items-center justify-center">
              <FiClock className="h-5.5 w-5.5" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filter and search bar */}
      <Card variant="glass" hover={false} className="p-4 flex items-center justify-between gap-4">
        <div className="w-full sm:w-72">
          <Input
            placeholder="Search transactions company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={FiSearch}
          />
        </div>
      </Card>

      {/* Ledger Table */}
      <Table
        columns={columns}
        data={filteredPayments}
        emptyMessage="No payments invoices logs match filter."
        className="text-slate-700 dark:text-slate-350"
      />
    </div>
  );
}
