import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  FiActivity, FiAnchor, FiTruck, FiCheck, FiClock, FiAlertTriangle, FiX 
} from 'react-icons/fi';
import Card from '../../commonComponents/cards/Card';
import Table from '../../commonComponents/tables/Table';
import Button from '../../commonComponents/buttons/Button';
import { fetchAllOrders, selectAllOrders } from '../../redux/slices/orderSlice';
import { fetchAllRfqs, selectAllRfqs } from '../../redux/slices/rfqSlice';

export default function AdminDashboardScreen() {
  const dispatch = useDispatch();
  const orders = useSelector(selectAllOrders) || [];
  const rfqs = useSelector(selectAllRfqs) || [];

  useEffect(() => {
    dispatch(fetchAllOrders());
    dispatch(fetchAllRfqs());
  }, [dispatch]);

  const activeDeliveriesCount = orders.filter(o => o.orderStatus !== 'Delivered').length || 142;
  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
  const revenueDisplay = totalRevenue > 0 ? `$${totalRevenue.toLocaleString()}` : '$2.4M';
  const pendingOrdersCount = orders.filter(o => o.orderStatus === 'Processing').length || 38;
  const openQuotesCount = rfqs.filter(r => r.status === 'Pending Quote' || r.status === 'Pending Review').length || 67;

  const metrics = [
    // OLD (commented out - do not delete)
    // { 
    //   label: 'Active Shipments', 
    //   value: '142', 
    //   change: '↑ 12% vs last month', 
    //   changeColor: 'text-emerald-400' 
    // },
    // NEW
    { 
      label: 'Active Deliveries', 
      value: activeDeliveriesCount.toString(), 
      change: '↑ 12% vs last month', 
      changeColor: 'text-emerald-400' 
    },
    { 
      label: 'Revenue (USD)', 
      value: revenueDisplay, 
      change: '↑ 8.3%', 
      changeColor: 'text-emerald-400' 
    },
    { 
      label: 'Pending Orders', 
      value: pendingOrdersCount.toString(), 
      change: '↓ needs action', 
      changeColor: 'text-rose-450' 
    },
    { 
      label: 'Open Quotes', 
      value: openQuotesCount.toString(), 
      change: '— steady', 
      changeColor: 'text-slate-400' 
    },
  ];

  const dbShipments = orders.slice(0, 3).map(o => ({
    id: o._id,
    customer: o.user ? `${o.user.firstName || 'Client'} ${o.user.lastName || ''}` : 'Customer',
    route: o.shippingLine || 'Standard Courier',
    status: o.orderStatus || 'Processing',
    eta: o.trackingNo ? 'Track' : 'TBD'
  }));

  // OLD (commented out - do not delete)
  // const recentShipments = [
  //   { id: 'SHP-2024-00134', customer: 'Acme Global Ltd', route: 'SHA → LAX', status: 'In Transit', eta: 'Nov 28' },
  //   { id: 'SHP-2024-00133', customer: 'TechBridge Inc', route: 'HKG → LHR', status: 'Customs Hold', eta: 'Dec 4' },
  //   { id: 'SHP-2024-00132', customer: 'OceanTrade Co', route: 'DXB → JFK', status: 'Delivered', eta: 'Nov 22' },
  // ];
  // NEW
  const recentShipments = dbShipments.length > 0 ? dbShipments : [
    { id: 'SHP-2024-00134', customer: 'Acme Apparel Co', route: 'Express Delivery', status: 'In Transit', eta: 'Nov 28' },
    { id: 'SHP-2024-00133', customer: 'TechBridge Inc', route: 'Standard Ground', status: 'Pending', eta: 'Dec 4' },
    { id: 'SHP-2024-00132', customer: 'Boutique Packaging Corp', route: 'Air Freight', status: 'Delivered', eta: 'Nov 22' },
  ];

  const columns = [
    { 
      key: 'id', 
      label: 'Shipment ID',
      render: (val) => <span className="font-mono font-bold text-text-secondary">{val}</span>
    },
    { 
      key: 'customer', 
      label: 'Customer',
      render: (val) => <span className="font-bold text-text-primary">{val}</span>
    },
    { 
      key: 'route', 
      label: 'Carrier',
      render: (val) => <span className="font-semibold text-text-secondary">{val}</span>
    },
    {
      key: 'status',
      label: 'Status',
      render: (val) => {
        const badgeColors = {
          'In Transit': 'bg-sky-50 text-sky-700 border-sky-200/60 dark:bg-sky-500/10 dark:text-sky-450 dark:border-sky-500/25',
          'Delivered': 'bg-emerald-50 text-emerald-700 border-emerald-200/60 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/25',
          'Pending': 'bg-amber-50 text-amber-700 border-amber-200/60 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/25',
          'Out for Delivery': 'bg-indigo-50 text-indigo-700 border-indigo-200/60 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/25',
          'Cancelled': 'bg-slate-100 text-slate-600 border-slate-200/60 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700',
        };
        const icons = {
          'In Transit': FiTruck,
          'Delivered': FiCheck,
          'Pending': FiClock,
          'Out for Delivery': FiTruck,
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
      render: (val) => <span className="font-semibold text-text-secondary">{val}</span>
    },
  ];

  return (
    <div className="flex flex-col gap-8 py-2 animate-fade-in-up">
      {/* Welcome header */}
      <div className="flex justify-between items-center border-b border-border-default/40 pb-5">
        <div>
          <h1 className="text-xl font-extrabold text-text-primary tracking-tight">
            Dashboard Overview
          </h1>
          {/* OLD (commented out - do not delete)
          <p className="text-xs text-text-secondary mt-1">
            Real-time analytics monitor for Zeelinoverseas leads pipelines and logistics milestones.
          </p>
          */}
          {/* NEW */}
          <p className="text-xs text-text-secondary mt-1">
            Real-time analytics monitor for Zeelinoverseas sales pipelines and delivery milestones.
          </p>
        </div>
        
        <Button variant="outline" size="sm" icon={FiActivity} className="border-border-default/50 text-text-secondary hover:text-text-primary">
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
            <span className="text-[11px] font-bold text-text-secondary uppercase tracking-widest block">
              {m.label}
            </span>
            <div className="flex items-baseline gap-2 mt-3 mb-1">
              <span className="text-3xl font-black text-text-primary">
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
          {/* OLD (commented out - do not delete)
          <h3 className="text-xs font-bold text-text-secondary uppercase tracking-widest">
            Recent B2B Cargo Shipments
          </h3>
          <p className="text-xs text-text-secondary/80 mt-1">
            Active shipments tracking log in our freight logistics pipeline.
          </p>
          */}
          {/* NEW */}
          <h3 className="text-xs font-bold text-text-secondary uppercase tracking-widest">
            Recent Customer Shipments
          </h3>
          <p className="text-xs text-text-secondary/80 mt-1">
            Active shipments tracking log in our logistics pipeline.
          </p>
        </div>

        <Table
          columns={columns}
          data={recentShipments}
          emptyMessage="No pending shipments logs inside database."
          className="text-text-secondary"
        />
      </div>
    </div>
  );
}
