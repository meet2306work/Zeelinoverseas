import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, useReducedMotion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiMapPin, FiCreditCard, FiCheckCircle, FiShield, FiFileText } from 'react-icons/fi';
import { createOrder } from '../../redux/slices/orderSlice';
import { clearCart } from '../../redux/slices/cartSlice';
import Card from '../../commonComponents/cards/Card';
import Input from '../../commonComponents/inputs/Input';
import Button from '../../commonComponents/buttons/Button';
import { Reveal } from '../../commonComponents/animations/ScrollReveal';
import { motionSprings } from '../../config/motion';

export default function CheckoutScreen() {
  const shouldReduceMotion = useReducedMotion();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, totalPrice } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  // Address Form State
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [postal, setPostal] = useState('');

  /* Profile data arrives asynchronously and intentionally hydrates untouched checkout fields. */
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (user) {
      const defaultAddr = user.addresses?.find(a => a.isDefault) || user.addresses?.[0];
      if (defaultAddr) {
        setAddress(defaultAddr.street || '');
        setCity(defaultAddr.city || '');
        setCountry(defaultAddr.country || '');
        setPostal(defaultAddr.zipCode || '');
      } else {
        if (user.address) setAddress(user.address);
        if (user.city) setCity(user.city);
        if (user.country) setCountry(user.country);
        if (user.postalCode) setPostal(user.postalCode);
      }
    }
  }, [user]);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Payment Selection State
  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card' | 'paypal' | 'wire' | 'lc'
  const [isLoading, setIsLoading] = useState(false);

  // Math totals
  const shippingCost = totalPrice > 0 ? (totalPrice > 10000 ? 450 : 250) : 0;
  const taxCost = Math.round(totalPrice * 0.05);
  const grandTotal = totalPrice + shippingCost + taxCost;

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (items.length === 0) return;
    
    setIsLoading(true);
    const orderData = {
      orderItems: items.map(item => ({
        product: item.id,
        name: item.name,
        qty: item.qty,
        price: item.price,
        image: item.image || 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=400&q=80'
      })),
      shippingAddress: {
        street: address,
        city: city,
        state: 'N/A',
        country: country,
        zipCode: postal
      },
      paymentMethod: paymentMethod.toUpperCase(),
      itemsPrice: totalPrice,
      shippingPrice: shippingCost,
      taxPrice: taxCost,
      totalPrice: grandTotal
    };

    dispatch(createOrder(orderData))
      .unwrap()
      .then((createdOrder) => {
        setIsLoading(false);
        dispatch(clearCart());
        navigate('/user/payment', { state: { order: createdOrder } });
      })
      .catch((err) => {
        setIsLoading(false);
        alert(err || 'Failed to place order');
      });
  };

  return (
    <div className="flex flex-col gap-8 py-4">
      {/* Header */}
      <div className="border-b border-brand-border/40 dark:border-slate-800/40 pb-5">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-1">
          Secure Checkout
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Enter shipping logistics destinations and select payment methods to create contract orders.
        </p>
      </div>

      <ol className="grid grid-cols-3 overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900" aria-label="Checkout progress">
        {['Shipping details', 'Payment method', 'Review order'].map((label, index) => (
          <li key={label} className={`flex items-center justify-center gap-2 px-2 py-3 text-center text-[10px] font-bold uppercase tracking-wider sm:text-xs ${index === 2 ? 'text-brand-accent-hover dark:text-amber-300' : 'text-secondary dark:text-cyan-300'}`}>
            <span className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] text-white ${index === 2 ? 'bg-brand-accent' : 'bg-secondary'}`}>{index + 1}</span>
            <span className="hidden sm:inline">{label}</span>
          </li>
        ))}
      </ol>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Columns: Forms */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Shipping Details */}
          <Reveal><Card variant="default" className="p-6 border-slate-200 dark:border-slate-800 flex flex-col gap-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-850">
              <FiMapPin className="h-4.5 w-4.5 text-secondary dark:text-accent" /> Shipping Destination Address
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Street Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
              <Input
                label="City / Town"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                required
              />
              <Input
                label="ZIP / Postal Code"
                value={postal}
                onChange={(e) => setPostal(e.target.value)}
                required
              />
            </div>
          </Card></Reveal>

          {/* Payment Methods */}
          <Reveal delay={0.06}><Card variant="default" className="p-6 border-slate-200 dark:border-slate-800 flex flex-col gap-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-850">
              <FiCreditCard className="h-4.5 w-4.5 text-secondary dark:text-accent" /> Payment Option Integration
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Card option */}
              <motion.button
                type="button"
                onClick={() => setPaymentMethod('card')}
                whileTap={!shouldReduceMotion ? { scale: 0.985 } : undefined}
                transition={motionSprings.responsive}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col gap-2
                  ${paymentMethod === 'card'
                    ? 'border-secondary bg-blue-50/20 dark:border-accent dark:bg-cyan-950/10'
                    : 'border-slate-200 dark:border-slate-800 bg-transparent hover:bg-slate-50 dark:hover:bg-slate-900/40'
                  }
                `}
              >
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-850 dark:text-white">Credit / Debit Card</span>
                  <FiCreditCard className="h-4.5 w-4.5 text-slate-400" />
                </div>
                <p className="text-[11px] text-slate-500">Stripe and Razorpay gateway gateways supported.</p>
              </motion.button>

              {/* LC Option */}
              <motion.button
                type="button"
                onClick={() => setPaymentMethod('lc')}
                whileTap={!shouldReduceMotion ? { scale: 0.985 } : undefined}
                transition={motionSprings.responsive}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col gap-2
                  ${paymentMethod === 'lc'
                    ? 'border-secondary bg-blue-50/20 dark:border-accent dark:bg-cyan-950/10'
                    : 'border-slate-200 dark:border-slate-800 bg-transparent hover:bg-slate-50 dark:hover:bg-slate-900/40'
                  }
                `}
              >
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-850 dark:text-white">Letter of Credit (L/C)</span>
                  <FiFileText className="h-4.5 w-4.5 text-slate-400" />
                </div>
                <p className="text-[11px] text-slate-500">Standard inter-bank documentation verification required.</p>
              </motion.button>
            </div>
          </Card></Reveal>
        </div>

        {/* Right Column: Review */}
        <div className="lg:col-span-4">
          <Card variant="glass" hover={false} className="p-6 border-slate-200/40 dark:border-slate-800/40 flex flex-col gap-5">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider pb-3 border-b border-brand-border/40 dark:border-slate-800/40">
              Review & Place Order
            </h3>

            {items.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-4">No items inside cart to checkout.</p>
            ) : (
              <div className="flex flex-col gap-4 max-h-60 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center text-xs gap-3">
                    <div className="min-w-0">
                      <p className="font-bold text-slate-800 dark:text-white truncate">{item.name}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">Qty: {item.qty} × ${item.price.toLocaleString()}</p>
                    </div>
                    <span className="font-bold text-slate-900 dark:text-white">${(item.price * item.qty).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="h-px bg-slate-200 dark:bg-slate-800 my-1" />

            <div className="flex flex-col gap-2.5 text-xs font-medium text-slate-655 dark:text-slate-400">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-slate-800 dark:text-white">${totalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Est. Logistics Duty</span>
                <span className="font-bold text-slate-800 dark:text-white">${shippingCost > 0 ? `$${shippingCost}` : 'Free'}</span>
              </div>
              <div className="flex justify-between">
                <span>Customs Duties (5%)</span>
                <span className="font-bold text-slate-800 dark:text-white">${taxCost.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-slate-900 dark:text-white pt-2 border-t border-dashed border-slate-200 dark:border-slate-800">
                <span>Total Due</span>
                <span className="text-secondary dark:text-accent font-display text-base">${grandTotal.toLocaleString()}</span>
              </div>
            </div>

            <Button
              type="submit"
              variant="gold"
              className="w-full mt-2"
              size="lg"
              isLoading={isLoading}
              icon={FiCheckCircle}
              disabled={items.length === 0}
            >
              Authorize Contract Order
            </Button>
            
            <span className="text-[10px] text-slate-400 flex items-center justify-center gap-1.5 mt-1">
              <FiShield className="h-3.5 w-3.5 text-emerald-500" /> Insured Secure Trade Payment
            </span>
          </Card>
        </div>

      </form>
    </div>
  );
}
