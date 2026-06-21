import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { FiCheckCircle, FiTruck } from 'react-icons/fi';
import { fetchMyOrders } from '../../redux/slices/orderSlice';
import { fetchMyRfqs } from '../../redux/slices/rfqSlice';
import Card from '../../commonComponents/cards/Card';
import Table from '../../commonComponents/tables/Table';
import Button from '../../commonComponents/buttons/Button';
import Tabs from '../../commonComponents/layouts/Tabs';
import { motionTransitions } from '../../config/motion';

export default function OrdersScreen() {
  const shouldReduceMotion = useReducedMotion();
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const isSuccessView = location.pathname.includes('order-success');
  const { ordersList } = useSelector((state) => state.orders);
  const { rfqsList } = useSelector((state) => state.rfq);

  useEffect(() => {
    dispatch(fetchMyOrders());
    dispatch(fetchMyRfqs());
  }, [dispatch]);

  // Fallback default list to showcase in prototype if redux has none
  const fallbackOrdersList = [
    { id: 'ZO-2026-981242', date: 'Jun 02, 2026', total: 8850, itemsCount: 2, status: 'In Transit', paymentMethod: 'L/C' },
    { id: 'ZO-2026-972140', date: 'May 28, 2026', total: 680, itemsCount: 1, status: 'Delivered', paymentMethod: 'CARD' },
  ];

  const mappedOrders = ordersList.map((order) => ({
    id: order._id,
    date: new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    total: order.totalPrice,
    itemsCount: order.orderItems?.reduce((acc, curr) => acc + curr.qty, 0) || 0,
    status: order.orderStatus || 'Pending',
    paymentMethod: order.paymentMethod,
  }));

  const activeOrders = [...mappedOrders, ...fallbackOrdersList];
  
  const [activeTab, setActiveTab] = useState('orders');

  const tabOptions = [
    { label: 'E-Commerce Orders', value: 'orders' },
    { label: 'B2B Custom RFQs', value: 'rfqs' },
  ];

  const orderColumns = [
    {
      key: 'id',
      label: 'Order ID',
      render: (val) => <span className="font-mono font-semibold text-slate-800 dark:text-white">{val}</span>
    },
    {
      key: 'date',
      label: 'Date',
      render: (val) => <span className="text-slate-550 dark:text-slate-400">{val}</span>
    },
    {
      key: 'itemsCount',
      label: 'Qty',
      render: (val) => <span className="font-mono text-slate-700 dark:text-slate-300">{val} Items</span>
    },
    {
      key: 'total',
      label: 'Total Value',
      render: (val) => <span className="font-extrabold text-secondary dark:text-accent">${val.toLocaleString()}</span>
    },
    {
      key: 'status',
      label: 'Status',
      render: (val) => {
        const badgeColors = {
          'In Transit': 'bg-[#E0F2FE] text-[#0284C7] border-[#bae6fd]',
          'Delivered': 'bg-[#ECFDF5] text-[#059669] border-[#a7f3d0]',
          'Pending': 'bg-[#FFFBEB] text-[#D97706] border-[#fef3c7]',
          'Cancelled': 'bg-[#FEF2F2] text-[#DC2626] border-[#fecaca]',
        };
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-bold border uppercase tracking-wider ${badgeColors[val] || 'bg-slate-100 text-slate-500'}`}>
            {val}
          </span>
        );
      }
    },
    {
      key: 'actions',
      label: 'Track',
      render: (_, row) => (
        <Link to={`/user/order-tracking/${row.id}`}>
          <Button variant="outline" size="md" icon={FiTruck}>
            Milestones
          </Button>
        </Link>
      )
    }
  ];

  const rfqColumns = [
    {
      key: 'id',
      label: 'RFQ ID',
      render: (val) => <span className="font-mono font-semibold text-slate-800 dark:text-white">{val}</span>
    },
    {
      key: 'date',
      label: 'Submitted',
      render: (val) => <span className="text-slate-550 dark:text-slate-400">{val}</span>
    },
    {
      key: 'qty',
      label: 'Required Volume',
      render: (val) => <span className="font-semibold text-slate-700 dark:text-slate-355">{val}</span>
    },
    {
      key: 'port',
      label: 'Destination Port',
      render: (val) => <span className="text-slate-600 dark:text-slate-400 font-medium">{val}</span>
    },
    {
      key: 'status',
      label: 'Lead Status',
      render: (val) => {
        const colors = {
          'Pending Quote': 'bg-[#FFFBEB] text-[#D97706] border-[#fef3c7]',
          'Approved': 'bg-[#ECFDF5] text-[#059669] border-[#a7f3d0]',
          'Negotiation': 'bg-[#FEF3C7] text-[#8C4A00] border-[#fde68a]',
        };
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-bold border uppercase tracking-wider ${colors[val] || 'bg-slate-100'}`}>
            {val}
          </span>
        );
      }
    },
    {
      key: 'approvedQuote',
      label: 'Approved Quote',
      render: (val, row) => (
        <div className="flex flex-col">
          <span className={`font-extrabold ${val ? 'text-secondary dark:text-accent' : 'text-slate-400'}`}>
            {val || 'Awaiting quote'}
          </span>
          {row.leadTime && (
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">{row.leadTime}</span>
          )}
        </div>
      )
    },
    {
      key: 'trackingId',
      label: 'Track',
      render: (val, row) => (
        row.status === 'Approved' && val ? (
          <Link to={`/user/order-tracking/${val}`}>
            <Button variant="outline" size="sm" icon={FiTruck}>
              Track RFQ
            </Button>
          </Link>
        ) : (
          <span className="text-xs font-semibold text-slate-400">After approval</span>
        )
      )
    }
  ];

  // ORDER SUCCESS STATE RENDER
  if (isSuccessView) {
    const orderDetails = location.state?.order || {
      id: 'ZO-2026-X8341',
      date: new Date().toLocaleDateString(),
      total: 4500,
      shippingAddress: 'Customs Warehouse, Rotterdam, NL',
      paymentMethod: 'LETTER OF CREDIT (L/C)'
    };

    return (
      <div className="flex flex-col items-center justify-center py-10 animate-fade-in-up max-w-xl mx-auto text-center gap-8">
        <Card variant="glass" hover={false} className="p-8 sm:p-10 border-slate-200/40 dark:border-slate-800/40 w-full">
          <div className="h-16 w-16 rounded-full bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500 flex items-center justify-center mx-auto mb-5">
            <FiCheckCircle className="h-8 w-8" />
          </div>

          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
            Payment & Order Confirmed
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 max-w-sm mx-auto leading-relaxed">
            Your transaction has been authorized successfully. Intermodal dispatch coordinates are now locking.
          </p>

          <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-5 border border-slate-200/50 dark:border-slate-800/50 flex flex-col gap-3 text-left text-xs mb-8">
            <div className="flex justify-between font-mono">
              <span className="text-slate-400">Order ID:</span>
              <span className="font-semibold text-slate-800 dark:text-white">{orderDetails.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Created On:</span>
              <span className="font-semibold text-slate-800 dark:text-white">{orderDetails.date}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Payment Mode:</span>
              <span className="font-semibold text-slate-800 dark:text-white">{orderDetails.paymentMethod}</span>
            </div>
            <div className="flex justify-between items-start gap-4">
              <span className="text-slate-400 shrink-0">Destination:</span>
              <span className="font-semibold text-slate-800 dark:text-white text-right truncate max-w-56" title={orderDetails.shippingAddress}>
                {orderDetails.shippingAddress}
              </span>
            </div>
            <div className="h-px bg-slate-200 dark:bg-slate-800 my-1" />
            <div className="flex justify-between text-sm font-extrabold">
              <span className="text-slate-800 dark:text-white">Amount Cleared:</span>
              <span className="text-secondary dark:text-accent">${orderDetails.total.toLocaleString()}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 justify-center">
            <Button
              variant="primary"
              className="flex-1 min-w-[150px]"
              onClick={() => navigate(`/user/order-tracking/${orderDetails.id}`)}
              icon={FiTruck}
            >
              Track Milestone
            </Button>
            <Button
              variant="outline"
              className="flex-1 min-w-[150px]"
              onClick={() => navigate('/user/orders')}
            >
              View Order History
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // STANDARD HISTORY LIST RENDER
  return (
    <div className="flex flex-col gap-8 py-4">
      <div className="border-b border-brand-border/40 dark:border-slate-800/40 pb-5">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-1">
          Transactions & Quotes
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Review placed orders, intermodal shipping tracking status, and B2B RFQ proposals.
        </p>
      </div>

      <div className="flex flex-col gap-5">
        <Tabs tabs={tabOptions} activeTab={activeTab} onTabChange={setActiveTab} />

        <AnimatePresence mode="wait" initial={false}>
        {activeTab === 'orders' ? (
          <motion.div key="orders" initial={{ opacity: 0, x: shouldReduceMotion ? 0 : -12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: shouldReduceMotion ? 0 : 12 }} transition={shouldReduceMotion ? { duration: 0 } : motionTransitions.interface} className="flex flex-col gap-4">
            <Table
              columns={orderColumns}
              data={activeOrders}
              emptyMessage="You have not placed any e-commerce orders yet."
              className="border-border-default/70 bg-background-surface"
            />
          </motion.div>
        ) : (
          <motion.div key="rfqs" initial={{ opacity: 0, x: shouldReduceMotion ? 0 : 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: shouldReduceMotion ? 0 : -12 }} transition={shouldReduceMotion ? { duration: 0 } : motionTransitions.interface} className="flex flex-col gap-4">
            <Table
              columns={rfqColumns}
              data={rfqsList}
              emptyMessage="You have no pending B2B RFQs."
              className="border-border-default/70 bg-background-surface"
            />
          </motion.div>
        )}
        </AnimatePresence>
      </div>
    </div>
  );
}
