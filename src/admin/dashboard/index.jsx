import { 
  FiActivity, FiAnchor, FiTruck, FiCheck, FiClock, FiAlertTriangle, FiX 
} from 'react-icons/fi';
import Card from '../../commonComponents/cards/Card';
import Table from '../../commonComponents/tables/Table';
import Button from '../../commonComponents/buttons/Button';

export default function AdminDashboardScreen() {
  const metrics = [
    { 
      label: 'Active Shipments', 
      value: '142', 
      change: '↑ 12% vs last month', 
      changeColor: 'text-emerald-400' 
    },
    { 
      label: 'Revenue (USD)', 
      value: '$2.4M', 
      change: '↑ 8.3%', 
      changeColor: 'text-emerald-400' 
    },
    { 
      label: 'Pending Orders', 
      value: '38', 
      change: '↓ needs action', 
      changeColor: 'text-rose-450' 
    },
    { 
      label: 'Open Leads', 
      value: '67', 
      change: '— steady', 
      changeColor: 'text-slate-400' 
    },
  ];

  const recentShipments = [
    { id: 'SHP-2024-00134', customer: 'Acme Global Ltd', route: 'SHA → LAX', status: 'In Transit', eta: 'Nov 28' },
    { id: 'SHP-2024-00133', customer: 'TechBridge Inc', route: 'HKG → LHR', status: 'Customs Hold', eta: 'Dec 4' },
    { id: 'SHP-2024-00132', customer: 'OceanTrade Co', route: 'DXB → JFK', status: 'Delivered', eta: 'Nov 22' },
  ];

  const columns = [
    { 
      key: 'id', 
      label: 'Shipment ID',
      render: (val) => <span className="font-mono font-bold text-slate-500 dark:text-slate-400">{val}</span>
    },
    { 
      key: 'customer', 
      label: 'Customer',
      render: (val) => <span className="font-bold text-slate-900 dark:text-white">{val}</span>
    },
    { 
      key: 'route', 
      label: 'Route',
      render: (val) => <span className="font-semibold text-slate-600 dark:text-slate-300">{val}</span>
    },
    {
      key: 'status',
      label: 'Status',
      render: (val) => {
        const badgeColors = {
          'In Transit': 'bg-sky-50 text-sky-700 border-sky-200/60 dark:bg-sky-500/10 dark:text-sky-450 dark:border-sky-500/25',
          'Delivered': 'bg-emerald-50 text-emerald-700 border-emerald-200/60 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/25',
          'Pending': 'bg-amber-50 text-amber-700 border-amber-200/60 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/25',
          'Customs Hold': 'bg-rose-50 text-rose-700 border-rose-200/60 dark:bg-rose-500/10 dark:text-rose-450 dark:border-rose-500/25',
          'Cancelled': 'bg-slate-100 text-slate-600 border-slate-200/60 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700',
        };
        const icons = {
          'In Transit': FiTruck,
          'Delivered': FiCheck,
          'Pending': FiClock,
          'Customs Hold': FiAlertTriangle,
          'Cancelled': FiX,
        };
        const Icon = icons[val];
        return (
          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold border uppercase tracking-wider ${badgeColors[val] || 'bg-slate-100 text-slate-600 border-slate-200'}`}>
            {Icon && <Icon className="h-3 w-3 shrink-0" />} {val}
          </span>
        );
      }
    },
    { 
      key: 'eta', 
      label: 'ETA',
      render: (val) => <span className="font-semibold text-slate-500 dark:text-slate-400">{val}</span>
    },
  ];

  return (
    <div className="flex flex-col gap-8 py-2 animate-fade-in-up">
      {/* Welcome header */}
      <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time analytics monitor for Zeelinoverseas leads pipelines and logistics milestones.
          </p>
        </div>
        
        <Button variant="outline" size="sm" icon={FiActivity} className="border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white">
          Generate System Report
        </Button>
      </div>

      {/* Analytics widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((m, idx) => (
          <Card 
            key={idx} 
            variant="glass"
            className="p-5 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300"
          >
            <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">
              {m.label}
            </span>
            <div className="flex items-baseline gap-2 mt-3 mb-1">
              <span className="text-3xl font-black text-slate-900 dark:text-white">
                {m.value}
              </span>
            </div>
            <span className={`text-xs font-semibold ${m.changeColor}`}>
              {m.change}
            </span>
          </Card>
        ))}
      </div>

      {/* Shipment Board */}
      <div className="flex flex-col gap-4 mt-4">
        <div>
          <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
            Recent B2B Cargo Shipments
          </h3>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
            Active shipments tracking log in our freight logistics pipeline.
          </p>
        </div>

        <Table
          columns={columns}
          data={recentShipments}
          emptyMessage="No pending shipments logs inside database."
          className="text-slate-700 dark:text-slate-350"
        />
      </div>
    </div>
  );
}
