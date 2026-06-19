import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiCreditCard, FiDollarSign, FiGlobe, FiFileText, FiCheckCircle, FiShield } from 'react-icons/fi';
import Card from '../../commonComponents/cards/Card';
import Button from '../../commonComponents/buttons/Button';
import Input from '../../commonComponents/inputs/Input';
import FileUpload from '../../commonComponents/fileUploads/FileUpload';
import { payOrder } from '../../redux/slices/orderSlice';

export default function PaymentScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  // Retrieve order from route state, or use a default mock for visualization if none
  const order = location.state?.order || {
    _id: 'ZO-MOCK-' + Math.floor(100000 + Math.random() * 900000),
    itemsPrice: 8400,
    shippingPrice: 250,
    taxPrice: 420,
    totalPrice: 9070,
    paymentMethod: 'CARD',
    orderItems: [{ qty: 2 }],
    shippingAddress: { street: '142 Marine Trade Way', city: 'Rotterdam', country: 'Netherlands' }
  };

  const { user } = useSelector((state) => state.auth);

  const [method, setMethod] = useState(
    order.paymentMethod ? order.paymentMethod.toLowerCase() : 'stripe'
  );
  
  const [isLoading, setIsLoading] = useState(false);
  const [wireReceipt, setWireReceipt] = useState(null);
  const [transactionId, setTransactionId] = useState('');

  // Handle case where method from order doesn't map directly to the list
  useEffect(() => {
    if (order.paymentMethod) {
      const pm = order.paymentMethod.toLowerCase();
      if (pm === 'card' || pm === 'stripe') {
        setMethod('stripe');
      } else if (pm === 'lc') {
        setMethod('lc');
      } else if (pm === 'wire') {
        setMethod('wire');
      } else if (pm === 'paypal') {
        setMethod('paypal');
      }
    }
  }, [order.paymentMethod]);

  const handleProcessPayment = (e) => {
    e.preventDefault();
    setIsLoading(true);

    const paymentDetails = {
      id: transactionId || 'pay_' + Math.floor(1000000 + Math.random() * 9000000),
      status: 'COMPLETED',
      update_time: new Date().toISOString(),
      payer: {
        email_address: user?.email || 'trade-desk@zeelinoverseas.com'
      }
    };

    // If it's a real order created in the database, update it to PAID
    if (order._id && !order._id.startsWith('ZO-MOCK-')) {
      dispatch(payOrder({ orderId: order._id, paymentResult: paymentDetails }))
        .unwrap()
        .then((updatedOrder) => {
          setIsLoading(false);
          const mappedOrder = {
            id: updatedOrder._id,
            date: new Date(updatedOrder.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            status: updatedOrder.orderStatus || 'Pending',
            total: updatedOrder.totalPrice,
            itemsCount: updatedOrder.orderItems?.reduce((acc, curr) => acc + curr.qty, 0) || 0,
            shippingAddress: `${updatedOrder.shippingAddress.street}, ${updatedOrder.shippingAddress.city}, ${updatedOrder.shippingAddress.country}`,
            paymentMethod: updatedOrder.paymentMethod,
          };
          navigate('/user/order-success', { state: { order: mappedOrder } });
        })
        .catch((err) => {
          setIsLoading(false);
          alert(err || 'Payment verification failed');
        });
    } else {
      // Prototype simulated transaction gateway loading
      setTimeout(() => {
        setIsLoading(false);
        const mappedOrder = {
          id: order._id,
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          status: 'In Transit',
          total: order.totalPrice,
          itemsCount: order.orderItems?.reduce((acc, curr) => acc + curr.qty, 0) || 1,
          shippingAddress: `${order.shippingAddress.street || '142 Marine Trade Way'}, ${order.shippingAddress.city || 'Rotterdam'}, ${order.shippingAddress.country || 'NL'}`,
          paymentMethod: order.paymentMethod,
        };
        navigate('/user/order-success', { state: { order: mappedOrder } });
      }, 1500);
    }
  };

  const methodsList = [
    { id: 'stripe', name: 'Credit / Debit Cards', desc: 'Secure payment powered by Stripe', icon: FiCreditCard },
    { id: 'paypal', name: 'PayPal Express', desc: 'Pay via credit card or PayPal wallet', icon: FiGlobe },
    { id: 'lc', name: 'Letter of Credit (L/C)', desc: 'Inter-bank verification system', icon: FiFileText },
    { id: 'wire', name: 'Bank Wire Transfer', desc: 'For transactions above $10k', icon: FiDollarSign },
  ];

  return (
    <div className="flex flex-col gap-8 py-4 max-w-4xl mx-auto animate-fade-in-up">
      <div className="text-center md:text-left border-b border-slate-200/40 dark:border-slate-800/40 pb-5">
        <h1 className="text-2xl font-extrabold text-slate-950 dark:text-white tracking-tight mb-1">
          Secure Payment Terminal
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Select your gateway transaction channel. All connections are SSL-encrypted.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Methods Selection */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <h3 className="text-xs font-bold text-slate-455 uppercase tracking-wider mb-1">
            Choose Payment Method
          </h3>
          <div className="flex flex-col gap-3">
            {methodsList.map((m) => {
              const Icon = m.icon;
              const isActive = m.id === method;
              return (
                <div
                  key={m.id}
                  onClick={() => setMethod(m.id)}
                  className={`flex items-center gap-4.5 p-4.5 rounded-2xl border cursor-pointer transition-all duration-200
                    ${isActive
                      ? 'border-teal-500 bg-teal-50/10 dark:bg-teal-950/10 shadow-sm'
                      : 'border-slate-200 hover:border-slate-350 dark:border-slate-800 bg-white dark:bg-slate-900/40'
                    }
                  `}
                >
                  <div className={`p-3 rounded-xl border ${isActive ? 'border-teal-500/25 text-teal-600 dark:text-teal-400 bg-white dark:bg-slate-900' : 'border-slate-200 dark:border-slate-800 text-slate-400'}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">{m.name}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{m.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Checkout details & payment fields */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <Card variant="glass" hover={false} className="p-6 border-slate-200/40 dark:border-slate-800/40">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
              Invoice Summary
            </h3>
            
            <div className="flex justify-between items-center text-xs text-slate-500 mb-2">
              <span>Subtotal:</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                ${order.itemsPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs text-slate-500 mb-2">
              <span>Port Logistics / Duty:</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                ${order.shippingPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs text-slate-500 mb-4 pb-4 border-b border-slate-200/40 dark:border-slate-800/40">
              <span>Customs VAT/Duties (5%):</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                ${order.taxPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between items-center mb-6">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Total Invoice Amount:</span>
              <span className="text-lg font-extrabold text-teal-650 dark:text-teal-400">
                ${order.totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>

            {/* Dynamic inputs based on chosen method */}
            <form onSubmit={handleProcessPayment} className="flex flex-col gap-4">
              {method === 'stripe' && (
                <div className="flex flex-col gap-3">
                  <Input label="Cardholder Name" placeholder="e.g. John Doe" required />
                  <Input label="Card Number" placeholder="•••• •••• •••• ••••" maxLength={19} required />
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="Expiration Date" placeholder="MM/YY" maxLength={5} required />
                    <Input label="CVC" placeholder="•••" maxLength={4} required />
                  </div>
                </div>
              )}

              {method === 'paypal' && (
                <div className="bg-slate-50 dark:bg-slate-900/45 p-4 rounded-xl border border-slate-200/40 dark:border-slate-800/40 text-center text-xs text-slate-500">
                  Clicking "Pay Now" will redirect you to PayPal checkout portal to sign in and complete the transaction.
                </div>
              )}

              {method === 'lc' && (
                <div className="bg-slate-50 dark:bg-slate-900/45 p-4 rounded-xl border border-slate-200/40 dark:border-slate-800/40 text-center text-xs text-slate-500">
                  Letter of Credit bank authorization flow will prompt for secure verification.
                </div>
              )}

              {method === 'wire' && (
                <div className="flex flex-col gap-4 text-xs text-slate-500">
                  <div className="bg-slate-50 dark:bg-slate-900/45 p-4 rounded-xl border border-slate-200/40 dark:border-slate-800/40 flex flex-col gap-2">
                    <span className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[10px]">Bank Wire Account Details</span>
                    <div>Bank: Chase Manhattan Bank N.A.</div>
                    <div>Account: 9812-401-209-1</div>
                    <div>Routing / SWIFT Code: CHASEUS33XXX</div>
                  </div>

                  <Input
                    label="Transaction Reference ID"
                    placeholder="e.g. TXN9812049"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    required
                  />

                  <FileUpload
                    label="Upload Wire Transfer PDF Receipt"
                    selectedFile={wireReceipt}
                    onFileSelect={setWireReceipt}
                    onClear={() => setWireReceipt(null)}
                    accept=".pdf,.jpg,.jpeg"
                    required
                  />
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full mt-2"
                isLoading={isLoading}
              >
                {method === 'wire' ? 'Submit Receipt Logs' : `Pay $${order.totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })} Now`}
              </Button>
            </form>
          </Card>
          
          <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400">
            <FiShield className="h-4.5 w-4.5 text-slate-500" /> AES-256 PCI DSS Secured Terminal
          </div>
        </div>
      </div>
    </div>
  );
}
