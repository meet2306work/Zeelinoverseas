import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FiAnchor, FiBox, FiCheckCircle } from 'react-icons/fi';
import { fetchMyOrders } from '../../redux/slices/orderSlice';
import Card from '../../commonComponents/cards/Card';
import { StaggerGroup, StaggerItem } from '../../commonComponents/animations/ScrollReveal';

export default function OrderTrackingScreen() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { rfqsList } = useSelector((state) => state.rfq);
  const { ordersList } = useSelector((state) => state.orders);
  
  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);

  const rfq = rfqsList.find((item) => item.trackingId === id || item.id === id);
  const dbOrder = ordersList.find((item) => item._id === id);

  const getDbOrderMilestones = (order) => {
    const isShipped = ['Shipped', 'Out for Delivery', 'Delivered'].includes(order.orderStatus);
    const isOut = ['Out for Delivery', 'Delivered'].includes(order.orderStatus);
    const isDelivered = order.orderStatus === 'Delivered';
    
    return [
      { 
        label: 'Contract Signed & Invoice Verified', 
        date: order.isPaid ? new Date(order.paidAt).toLocaleDateString() : 'Verification complete', 
        desc: 'Order initialized and invoice milestone cleared.', 
        done: true 
      },
      { 
        label: 'Container Packed & Cargo Marked', 
        date: new Date(order.createdAt).toLocaleDateString(), 
        desc: 'Export packages tagged and loaded into B2B shipping containers.', 
        done: true,
        active: order.orderStatus === 'Processing'
      },
      { 
        label: 'Customs Export Declaration', 
        date: isShipped ? 'Cleared' : 'In Progress', 
        desc: 'Bill of Lading and HS Code declarations verified by customs desk.', 
        done: isShipped,
        active: order.orderStatus === 'Processing' && order.isPaid
      },
      { 
        label: 'In Ocean Transit (Vessel Departed)', 
        date: isShipped ? 'Active' : 'Pending Route', 
        desc: 'Cargo in transit across maritime routes to destination port.', 
        done: isShipped && !isOut,
        active: order.orderStatus === 'Shipped'
      },
      { 
        label: 'Customs Clearance & Delivery', 
        date: isDelivered ? new Date(order.deliveredAt).toLocaleDateString() : 'Pending ETA', 
        desc: isDelivered ? 'Cargo delivered to destination depot.' : 'Import verification and final drayage.', 
        done: isDelivered,
        active: order.orderStatus === 'Out for Delivery'
      },
    ];
  };

  const shipment = rfq ? {
    orderId: rfq.trackingId || rfq.id,
    vesselName: 'RFQ Sourcing Desk',
    containerId: rfq.id,
    departure: 'Supplier allocation pending',
    destination: rfq.port,
    eta: rfq.leadTime || 'Pending final schedule',
    status: rfq.status === 'Approved' ? 'Approved Quote - Tracking Enabled' : rfq.status,
    milestones: [
      { label: 'RFQ Submitted', date: rfq.date, desc: `Request received for ${rfq.qty}.`, done: true },
      { label: 'Quote Approved', date: 'Approved by admin', desc: `Approved quote ${rfq.approvedQuote || 'pending final quote'} has been attached to this RFQ.`, done: rfq.status === 'Approved', active: rfq.status === 'Approved' },
      { label: 'Supplier Allocation', date: 'Pending', desc: 'Supplier, packaging run, and export documents will be assigned next.', done: false },
      { label: 'Shipment Booking', date: 'Pending', desc: 'Container booking and trade documents will be prepared after confirmation.', done: false },
      { label: 'Dispatch & Delivery', date: 'Pending ETA', desc: 'Final logistics milestones will update after shipment booking.', done: false },
    ],
  } : dbOrder ? {
    orderId: dbOrder._id,
    vesselName: dbOrder.paymentMethod === 'L/C' ? 'B2B Charter Vessel' : 'M.V. Oceanus Trader VII',
    containerId: 'ZLU-' + dbOrder._id.slice(-8).toUpperCase(),
    departure: 'Port of Origin / FOB Desk',
    destination: `${dbOrder.shippingAddress.city}, ${dbOrder.shippingAddress.country}`,
    eta: dbOrder.isDelivered ? 'Delivered' : '14-21 Business Days',
    status: dbOrder.orderStatus,
    milestones: getDbOrderMilestones(dbOrder)
  } : {
    orderId: id || 'ZO-2026-9812',
    vesselName: 'M.V. Oceanus Trader VII',
    containerId: 'ZLU-984210-9',
    departure: 'Port of Mumbai / JNPT (India)',
    destination: 'Port of Rotterdam (Netherlands)',
    eta: 'July 14, 2026',
    status: 'In Ocean Transit',
    milestones: [
      { label: 'Contract Signed & Invoice Verified', date: 'June 02, 2026', desc: 'Order initialized and invoice milestone cleared.', done: true },
      { label: 'Container Packed & Cargo Marked', date: 'June 05, 2026', desc: 'Export packages tagged and loaded into container ZLU-984210-9.', done: true },
      { label: 'Mumbai Export Customs Cleared', date: 'June 08, 2026', desc: 'Bill of Lading and HS Code declarations verified by customs.', done: true },
      { label: 'In Ocean Transit (Vessel Departed)', date: 'June 09, 2026', desc: 'Currently routing across Indian Ocean. Next waypoint: Suez Canal.', done: true, active: true },
      { label: 'Rotterdam Customs Clearance', date: 'Pending ETA', desc: 'SGS quality check and import VAT processing.', done: false },
      { label: 'Delivered to Rotterdam Warehouse', date: 'Pending ETA', desc: 'Final drayage logistics transport to destination depot.', done: false },
    ],
  };

  return (
    <div className="flex flex-col gap-8 py-4">
      {/* Return Link */}
      <div>
        <Link to="/user/orders" className="text-xs text-slate-500 hover:text-teal-600 font-bold uppercase tracking-wider">
          &larr; Back to Orders
        </Link>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200/40 dark:border-slate-800/40 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-950 dark:text-white tracking-tight mb-1">
            {rfq ? 'Tracking B2B RFQ' : 'Tracking Shipment'}: <span className="text-teal-600 dark:text-teal-400">{shipment.orderId}</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {rfq ? 'Approved quote, supplier allocation, and shipment readiness milestones.' : 'Real-time intermodal logistics milestones logs.'}
          </p>
        </div>
      </div>

      {/* Cargo specifications */}
      <StaggerGroup className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
        <StaggerItem><Card variant="glass" hover={false} className="p-4 flex flex-col gap-1 border-slate-200/40 dark:border-slate-800/40">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Vessel Name</span>
          <span className="text-sm font-bold text-slate-800 dark:text-white inline-flex items-center gap-1.5 mt-0.5">
            <FiAnchor className="h-4.5 w-4.5 text-teal-500" /> {shipment.vesselName}
          </span>
        </Card></StaggerItem>
        <StaggerItem><Card variant="glass" hover={false} className="p-4 flex flex-col gap-1 border-slate-200/40 dark:border-slate-800/40">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Container ID</span>
          <span className="text-sm font-bold text-slate-800 dark:text-white inline-flex items-center gap-1.5 mt-0.5">
            <FiBox className="h-4.5 w-4.5 text-teal-500" /> {shipment.containerId}
          </span>
        </Card></StaggerItem>
        <StaggerItem><Card variant="glass" hover={false} className="p-4 flex flex-col gap-1 border-slate-200/40 dark:border-slate-800/40">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Departure Port</span>
          <span className="text-sm font-bold text-slate-800 dark:text-white truncate mt-0.5">
            {shipment.departure}
          </span>
        </Card></StaggerItem>
        <StaggerItem><Card variant="glass" hover={false} className="p-4 flex flex-col gap-1 border-slate-200/40 dark:border-slate-800/40">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Expected Arrival (ETA)</span>
          <span className="text-sm font-bold text-teal-600 dark:text-teal-400 mt-0.5">
            {shipment.eta}
          </span>
        </Card></StaggerItem>
      </StaggerGroup>

      {/* Stepper Timeline */}
      <Card variant="glass" hover={false} className="p-6 sm:p-8 border-slate-200/40 dark:border-slate-800/40">
        <StaggerGroup className="relative border-l border-slate-200 dark:border-slate-800 pl-6 ml-3 flex flex-col gap-8" stagger={0.08}>
          {shipment.milestones.map((m, idx) => {
            const isDone = m.done;
            const isActive = m.active;
            
            return (
              <StaggerItem key={idx} className="relative">
                {/* Stepper Indicator dot */}
                <div className={`absolute -left-[35px] top-1.5 h-[17px] w-[17px] rounded-full border-2 flex items-center justify-center bg-white dark:bg-slate-900 transition-colors
                  ${isActive
                    ? 'border-teal-500 bg-teal-500/10'
                    : isDone
                      ? 'border-teal-600 bg-teal-600'
                      : 'border-slate-350 dark:border-slate-800'
                  }
                `}>
                  {isDone && !isActive && <FiCheckCircle className="h-4 w-4 text-white" />}
                  {isActive && <div className="h-2 w-2 rounded-full bg-teal-500 animate-ping" />}
                </div>

                {/* Milestone Details */}
                <div className="flex flex-col sm:flex-row justify-between items-start gap-1 sm:gap-4">
                  <div>
                    <h3 className={`text-sm font-bold tracking-tight
                      ${isActive
                        ? 'text-teal-600 dark:text-teal-400'
                        : isDone
                          ? 'text-slate-900 dark:text-white'
                          : 'text-slate-400 dark:text-slate-600'
                      }
                    `}>
                      {m.label}
                    </h3>
                    <p className={`text-xs mt-1 max-w-xl
                      ${isDone ? 'text-slate-500 dark:text-slate-400' : 'text-slate-400/80 dark:text-slate-700'}
                    `}>
                      {m.desc}
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-slate-450 dark:text-slate-500 whitespace-nowrap mt-1">
                    {m.date}
                  </span>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerGroup>
      </Card>
    </div>
  );
}
