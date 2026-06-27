import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FiTruck, FiBox, FiCheckCircle, FiMapPin, FiCompass } from 'react-icons/fi';
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
        label: 'Order Confirmed', 
        date: order.isPaid ? new Date(order.paidAt).toLocaleDateString() : 'Verification complete', 
        desc: 'Payment received and order initialization cleared.', 
        done: true 
      },
      { 
        label: 'Order Processed & Packed', 
        date: new Date(order.createdAt).toLocaleDateString(), 
        desc: 'Fulfillment packaging finalized and barcode labeled.', 
        done: true,
        active: order.orderStatus === 'Processing'
      },
      { 
        label: 'Handed to Courier Partner', 
        date: isShipped ? 'Completed' : 'In Progress', 
        desc: 'Package picked up by courier and sorting at local dispatch hub.', 
        done: isShipped,
        active: order.orderStatus === 'Processing' && order.isPaid
      },
      { 
        label: 'Dispatched & In Transit', 
        date: isShipped ? 'Active' : 'Pending Transit', 
        desc: 'Package in transit via courier logistics routes.', 
        done: isShipped && !isOut,
        active: order.orderStatus === 'Shipped'
      },
      { 
        label: 'Out for Delivery & Delivered', 
        date: isDelivered ? new Date(order.deliveredAt).toLocaleDateString() : 'Pending ETA', 
        desc: isDelivered ? 'Parcel successfully delivered to destination address.' : 'Out for local courier delivery run.', 
        done: isDelivered,
        active: order.orderStatus === 'Out for Delivery'
      },
    ];
  };

  const shipment = rfq ? {
    orderId: rfq.trackingId || rfq.id,
    vesselName: 'RFQ Sourcing Desk',
    containerId: rfq.id,
    departure: 'Fulfillment allocation pending',
    destination: rfq.port,
    eta: rfq.leadTime || 'Pending final schedule',
    status: rfq.status === 'Approved' ? 'Approved Quote - Tracking Enabled' : rfq.status,
    milestones: [
      { label: 'RFQ Submitted', date: rfq.date, desc: `Request received for ${rfq.qty}.`, done: true },
      { label: 'Quote Approved', date: 'Approved by admin', desc: `Approved quote ${rfq.approvedQuote || 'pending final quote'} has been attached to this RFQ.`, done: rfq.status === 'Approved', active: rfq.status === 'Approved' },
      { label: 'Supplier Allocation', date: 'Pending', desc: 'Supplier and packaging run will be assigned next.', done: false },
      { label: 'Shipment Booking', date: 'Pending', desc: 'Logistics booking will be prepared after confirmation.', done: false },
      { label: 'Dispatch & Delivery', date: 'Pending ETA', desc: 'Fulfillment milestones will update after booking.', done: false },
    ],
  } : dbOrder ? {
    orderId: dbOrder._id,
    vesselName: dbOrder.shippingLine || 'Standard Courier',
    containerId: dbOrder.trackingNo || 'Pending Sourcing',
    departure: 'Fulfillment Center',
    destination: `${dbOrder.shippingAddress.city}, ${dbOrder.shippingAddress.country}`,
    eta: dbOrder.isDelivered ? 'Delivered' : '5-7 Business Days',
    status: dbOrder.orderStatus,
    milestones: getDbOrderMilestones(dbOrder)
  } : {
    orderId: id || 'ZO-2026-9812',
    vesselName: 'FedEx Express',
    containerId: 'FDX9842109',
    departure: 'Fulfillment Center (India)',
    destination: 'Rotterdam, Netherlands',
    eta: 'July 14, 2026',
    status: 'Shipped',
    milestones: [
      { label: 'Order Confirmed', date: 'June 02, 2026', desc: 'Order has been placed and payment is verified.', done: true },
      { label: 'Packed & Ready', date: 'June 05, 2026', desc: 'Items have been packed and labeled at our warehouse.', done: true },
      { label: 'Handed to Courier Partner', date: 'June 08, 2026', desc: 'Package picked up by courier and sorting at local dispatch hub.', done: true },
      { label: 'Dispatched (In Transit)', date: 'June 09, 2026', desc: 'Handed over to FedEx Express. Package in transit to destination.', done: true, active: true },
      { label: 'Out for Delivery', date: 'Pending ETA', desc: 'Package arrived at local delivery hub.', done: false },
      { label: 'Delivered', date: 'Pending ETA', desc: 'Package delivered to the destination address.', done: false },
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
            {rfq ? 'Approved quote, supplier allocation, and shipment readiness milestones.' : 'Real-time order delivery milestones logs.'}
          </p>
        </div>
      </div>

      {/* Cargo specifications */}
      <StaggerGroup className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
        <StaggerItem><Card variant="glass" hover={false} className="p-4 flex flex-col gap-1 border-slate-200/40 dark:border-slate-800/40">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Courier Partner</span>
          <span className="text-sm font-bold text-slate-800 dark:text-white inline-flex items-center gap-1.5 mt-0.5">
            <FiTruck className="h-4.5 w-4.5 text-teal-500" /> {shipment.vesselName}
          </span>
        </Card></StaggerItem>
        <StaggerItem><Card variant="glass" hover={false} className="p-4 flex flex-col gap-1 border-slate-200/40 dark:border-slate-800/40">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tracking ID</span>
          <span className="text-sm font-bold text-slate-800 dark:text-white inline-flex items-center gap-1.5 mt-0.5">
            <FiBox className="h-4.5 w-4.5 text-teal-500" /> {shipment.containerId}
          </span>
        </Card></StaggerItem>
        <StaggerItem><Card variant="glass" hover={false} className="p-4 flex flex-col gap-1 border-slate-200/40 dark:border-slate-800/40">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Dispatch Origin</span>
          <span className="text-sm font-bold text-slate-800 dark:text-white truncate mt-0.5">
            {shipment.departure}
          </span>
        </Card></StaggerItem>
        <StaggerItem><Card variant="glass" hover={false} className="p-4 flex flex-col gap-1 border-slate-200/40 dark:border-slate-800/40">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Expected Delivery (ETA)</span>
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
