import { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { FiTrash2, FiShoppingCart, FiMinus, FiPlus, FiArrowRight, FiInfo } from 'react-icons/fi';
import { addToCart, updateItemQty, updateCartPrices, removeFromCart, clearCart } from '../../redux/slices/cartSlice';
import Card from '../../commonComponents/cards/Card';
import Button from '../../commonComponents/buttons/Button';
import { Reveal } from '../../commonComponents/animations/ScrollReveal';
import { motionTransitions } from '../../config/motion';
import productService from '../../services/productService';

export default function CartScreen() {
  const dispatch = useDispatch();
  const { items, totalPrice, totalQuantity } = useSelector((state) => state.cart);
  const shouldReduceMotion = useReducedMotion();
  const cartProductIdsKey = useMemo(() => items.map(item => item.id).join('|'), [items]);

  useEffect(() => {
    let isActive = true;

    const cartProductIds = cartProductIdsKey ? cartProductIdsKey.split('|') : [];

    if (cartProductIds.length === 0) {
      return () => {
        isActive = false;
      };
    }

    Promise.allSettled(cartProductIds.map(id => productService.getProductById(id)))
      .then((results) => {
        if (!isActive) return;

        const latestProducts = results
          .filter(result => result.status === 'fulfilled')
          .map(result => result.value.data)
          .filter(Boolean)
          .map(product => ({
            id: product._id,
            price: product.price,
            availabilityStatus: product.availabilityStatus,
          }));

        dispatch(updateCartPrices(latestProducts));
      });

    return () => {
      isActive = false;
    };
  }, [cartProductIdsKey, dispatch]);

  const handleIncrement = (item) => {
    dispatch(addToCart({ id: item.id, name: item.name, price: item.price, qty: 1 }));
  };

  const handleDecrement = (item) => {
    if (item.qty > 1) {
      dispatch(updateItemQty({ id: item.id, qty: item.qty - 1 }));
    } else {
      dispatch(removeFromCart(item.id));
    }
  };

  const handleRemoveItem = (id) => {
    dispatch(removeFromCart(id));
  };

  const handleClear = () => {
    dispatch(clearCart());
  };

  // Estimate shipment freight logistics rates
  const shippingCost = totalPrice > 0 ? (totalPrice > 10000 ? 450 : 250) : 0;
  const taxCost = Math.round(totalPrice * 0.05); // 5% trade tax estimate
  const grandTotal = totalPrice + shippingCost + taxCost;

  return (
    <div className="flex flex-col gap-8 py-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-brand-border/40 dark:border-slate-800/40 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-1">
            Shopping Cart
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Verify custom cargo procurement configurations before initiating contract invoice codes.
          </p>
        </div>

        {items.length > 0 && (
          <button
            onClick={handleClear}
            className="text-xs text-red-500 hover:text-red-650 font-bold transition-colors uppercase tracking-wider flex items-center gap-1.5"
          >
            <FiTrash2 className="h-4 w-4" /> Clear All Items
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <Reveal><Card variant="glass" className="p-8">
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="h-12 w-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mb-4">
              <FiShoppingCart className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              Your E-Commerce Cart is Empty
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mb-6">
              Browse our machinery, spare parts, and industrial products to add items to your cart.
            </p>
            <Link to="/user/products">
              <Button variant="primary" icon={FiArrowRight} iconPosition="right">
                Browse Products
              </Button>
            </Link>
          </div>
        </Card></Reveal>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Side: Items list */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            <AnimatePresence initial={false}>
            {items.map((item) => (
              <motion.div
                key={item.id}
                layout={!shouldReduceMotion}
                initial={{ opacity: 0, x: shouldReduceMotion ? 0 : -16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: shouldReduceMotion ? 0 : 24, scale: shouldReduceMotion ? 1 : 0.98 }}
                transition={shouldReduceMotion ? { duration: 0 } : motionTransitions.interface}
              ><Card variant="default" className="p-4 flex gap-4 items-center">
                {/* Product image or fallback */}
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-16 w-16 shrink-0 rounded-lg object-cover border border-brand-border/20"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = '';
                    }}
                  />
                ) : (
                  <div className="h-16 w-16 shrink-0 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-400 uppercase tracking-widest border border-brand-border/20">
                    ZO
                  </div>
                )}

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                    {item.name}
                  </h3>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                    <span>Price per Unit:</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-355">${item.price.toLocaleString()}</span>
                  </div>
                </div>

                {/* Quantity adjustments */}
                <div className="flex items-center border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-950">
                  <button
                    onClick={() => handleDecrement(item)}
                    className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <FiMinus className="h-3.5 w-3.5" />
                  </button>
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span key={item.qty} initial={{ opacity: 0, y: shouldReduceMotion ? 0 : -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: shouldReduceMotion ? 0 : 5 }} className="px-3 text-xs font-bold text-slate-800 dark:text-white font-mono min-w-8 text-center">
                      {item.qty}
                    </motion.span>
                  </AnimatePresence>
                  <button
                    onClick={() => handleIncrement(item)}
                    className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <FiPlus className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Subtotal & Delete */}
                <div className="text-right">
                  <div className="text-sm font-extrabold text-slate-900 dark:text-white">
                    ${(item.price * item.qty).toLocaleString()}
                  </div>
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="text-xs text-red-500 hover:text-red-650 mt-1 font-semibold transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </Card></motion.div>
            ))}
            </AnimatePresence>
          </div>

          {/* Right Side: Order summary breakdown */}
          <div className="lg:col-span-4">
            <Card variant="glass" hover={false} className="p-6 border-slate-200/40 dark:border-slate-800/40 flex flex-col gap-5">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider pb-3 border-b border-brand-border/40 dark:border-slate-800/40">
                Order Summary
              </h3>

              <div className="flex flex-col gap-3 text-xs font-medium text-slate-600 dark:text-slate-400">
                <div className="flex justify-between">
                  <span>Cart Items ({totalQuantity})</span>
                  <span className="font-bold text-slate-900 dark:text-white">${totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1">
                    Est. Shipping & Handling <FiInfo className="h-3.5 w-3.5 text-slate-400" title="Based on port logistics carrier variables." />
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {shippingCost > 0 ? `$${shippingCost}` : 'Calculated next'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Customs VAT/Duties (5%)</span>
                  <span className="font-bold text-slate-900 dark:text-white">${taxCost.toLocaleString()}</span>
                </div>
                
                <div className="h-px bg-slate-200 dark:bg-slate-800 my-2" />

                <div className="flex justify-between text-sm font-extrabold text-slate-900 dark:text-white">
                  <span>Estimated Total</span>
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span key={grandTotal} initial={{ opacity: 0, y: shouldReduceMotion ? 0 : -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: shouldReduceMotion ? 0 : 6 }} className="text-secondary dark:text-accent font-display text-lg">${grandTotal.toLocaleString()}</motion.span>
                  </AnimatePresence>
                </div>
              </div>

              <Link to="/user/checkout">
                <Button variant="primary" className="w-full justify-between" size="lg" icon={FiArrowRight} iconPosition="right">
                  Proceed to Checkout
                </Button>
              </Link>
            </Card>
          </div>

        </div>
      )}
    </div>
  );
}
