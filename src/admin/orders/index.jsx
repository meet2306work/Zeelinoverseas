import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FiShoppingCart, FiAnchor, FiSearch, FiSliders, FiEdit2, FiPackage, FiTruck } from 'react-icons/fi';
import { fetchAllOrders, updateOrderLogistics, selectAllOrders } from '../../redux/slices/orderSlice';
import Card from '../../commonComponents/cards/Card';
import Table from '../../commonComponents/tables/Table';
import Button from '../../commonComponents/buttons/Button';
import Input from '../../commonComponents/inputs/Input';
import Drawer from '../../commonComponents/drawers/Drawer';
import Dropdown from '../../commonComponents/dropdowns/Dropdown';

export default function AdminOrdersScreen() {
  const dispatch = useDispatch();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [status, setStatus] = useState('');
  const [shippingLine, setShippingLine] = useState('');
  const [trackingNo, setTrackingNo] = useState('');
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const ordersList = useSelector(selectAllOrders);

  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);

  const fallbackOrdersList = [
    { id: 'ORD-80012', customer: 'Herman Miller Inc', value: '$8,400', date: 'June 09, 2026', shippingLine: 'Maersk Line', tracking: 'MSK902840', status: 'Processing' },
    { id: 'ORD-80011', customer: 'Acme Logistics Co', value: '$22,500', date: 'June 07, 2026', shippingLine: 'MSC Cargo', tracking: 'MSC110293', status: 'Shipped' },
    { id: 'ORD-80010', customer: 'Grains Trade LLC', value: '$35,000', date: 'June 05, 2026', shippingLine: 'COSCO Shipping', tracking: 'COSCO9902', status: 'Customs Hold' },
  ];

  const mappedOrders = ordersList.map((order) => ({
    id: order._id,
    customer: order.user ? `${order.user.firstName || 'B2B'} ${order.user.lastName || 'Client'}` : 'B2B Client',
    value: `$${order.totalPrice?.toLocaleString()}`,
    date: new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    shippingLine: order.shippingLine || 'Not Assigned',
    tracking: order.trackingNo || 'Not Assigned',
    status: order.orderStatus || 'Processing',
  }));

  const activeOrders = [...mappedOrders, ...fallbackOrdersList];

  const handleOpenStatus = (ord) => {
    setSelectedOrder(ord);
    setStatus(ord.status);
    setShippingLine(ord.shippingLine);
    setTrackingNo(ord.tracking);
    setIsDrawerOpen(true);
  };

  const handleUpdateOrder = (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (selectedOrder && selectedOrder.id && !selectedOrder.id.startsWith('ORD-')) {
      dispatch(updateOrderLogistics({
        orderId: selectedOrder.id,
        status,
        shippingLine,
        trackingNo
      }))
        .unwrap()
        .then(() => {
          setIsLoading(false);
          setIsDrawerOpen(false);
          alert(`Order shipment status updated!`);
        })
        .catch((err) => {
          setIsLoading(false);
          alert(err || 'Failed to update order status');
        });
    } else {
      setTimeout(() => {
        setIsLoading(false);
        setIsDrawerOpen(false);
        alert(`Simulated status updated to ${status}!`);
      }, 1200);
    }
  };

  const filteredOrders = activeOrders.filter(o =>
    o.id.toLowerCase().includes(search.toLowerCase()) ||
    o.customer.toLowerCase().includes(search.toLowerCase()) ||
    o.shippingLine.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    { 
      key: 'id', 
      label: 'Order ID',
      render: (val) => <span className="font-mono font-bold text-slate-500 dark:text-slate-400">{val}</span>
    },
    { 
      key: 'customer', 
      label: 'B2B Customer',
      render: (val) => <span className="font-bold text-slate-900 dark:text-white">{val}</span>
    },
    { 
      key: 'value', 
      label: 'Total Value',
      render: (val) => <span className="font-semibold text-cyan-600 dark:text-cyan-400">{val}</span>
    },
    { 
      key: 'date', 
      label: 'Order Date',
      render: (val) => <span className="text-xs text-slate-500 dark:text-slate-400">{val}</span>
    },
    { 
      key: 'shippingLine', 
      label: 'Logistics Courier',
      render: (val, row) => (
        <div className="flex flex-col">
          <span className="font-medium text-slate-750 dark:text-slate-300">{val}</span>
          <span className="text-[10px] font-mono text-slate-500 dark:text-slate-450">Track: {row.tracking}</span>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (val) => {
        const colors = {
          'Processing': 'bg-amber-50 text-amber-700 border-amber-200/60 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/25',
          'Shipped': 'bg-blue-50 text-blue-700 border-blue-200/60 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/25',
          'Customs Hold': 'bg-red-50 text-red-700 border-red-200/60 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/25',
          'Delivered': 'bg-emerald-50 text-emerald-700 border-emerald-200/60 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/25',
        };
        return (
          <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold border uppercase tracking-wider ${colors[val] || 'bg-slate-100'}`}>
            {val}
          </span>
        );
      }
    },
    {
      key: 'action',
      label: 'Action',
      render: (_, row) => (
        <Button 
          variant="outline" 
          onClick={() => handleOpenStatus(row)}
          className="h-9 w-9 rounded-full border-blue-100 hover:border-blue-500 text-blue-600 hover:bg-blue-50/50 hover:text-blue-707 dark:border-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-950/20 p-0 flex items-center justify-center transition-all duration-200 shadow-xs"
          title="Edit Status"
        >
          <FiEdit2 className="h-4 w-4" />
        </Button>
      ),
    }
  ];

  const statusOptions = [
    { label: 'Processing', value: 'Processing' },
    { label: 'Shipped', value: 'Shipped' },
    { label: 'Customs Hold', value: 'Customs Hold' },
    { label: 'Delivered', value: 'Delivered' },
  ];

  return (
    <div className="flex flex-col gap-8 py-2 animate-fade-in-up">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Client Orders Registry
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Track and process maritime intermodal transport shipments, custom clearance statuses, and logistic tracking parameters.
          </p>
        </div>
      </div>

      {/* Filter and search bar */}
      <Card variant="glass" hover={false} className="p-4 flex items-center justify-between gap-4">
        <div className="w-full sm:w-72">
          <Input
            placeholder="Search orders ID/customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={FiSearch}
          />
        </div>
      </Card>

      {/* Database table */}
      <Table
        columns={columns}
        data={filteredOrders}
        emptyMessage="No client orders logs found in records."
        className="text-slate-700 dark:text-slate-350"
      />

      {/* Edit Drawer */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={`Update Shipment details for ${selectedOrder?.id}`}
        size="md"
      >
        {selectedOrder && (
          <form onSubmit={handleUpdateOrder} className="flex flex-col gap-6 text-slate-755 dark:text-slate-300">
            <div className="flex flex-col gap-3.5 bg-slate-50 dark:bg-slate-800/40 p-4.5 rounded-xl border border-slate-200 dark:border-slate-700/35">
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5"><FiPackage className="h-3.5 w-3.5" /> Order Summary</span>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">{selectedOrder.customer}</p>
              <div className="grid grid-cols-2 gap-4 text-xs mt-1 text-slate-600 dark:text-slate-400">
                <div>Total: <span className="font-medium text-slate-900 dark:text-white">{selectedOrder.value}</span></div>
                <div>Placed: <span className="font-medium text-slate-800 dark:text-slate-250">{selectedOrder.date}</span></div>
              </div>
            </div>

            <Dropdown
              label="Logistics Status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              options={statusOptions}
              searchable={false}
            />

            <Input
              label="Shipping Carrier Line"
              placeholder="e.g. Maersk Cargo"
              icon={FiAnchor}
              value={shippingLine}
              onChange={(e) => setShippingLine(e.target.value)}
              required
            />

            <Input
              label="Tracking Identification Number"
              placeholder="e.g. MSK902840"
              icon={FiTruck}
              value={trackingNo}
              onChange={(e) => setTrackingNo(e.target.value)}
              required
            />

            <Button
              type="submit"
              variant="secondary"
              className="w-full mt-4"
              isLoading={isLoading}
            >
              Apply Tracking Modifications
            </Button>
          </form>
        )}
      </Drawer>
    </div>
  );
}
