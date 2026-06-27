import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { FiHeart, FiTrash2, FiArrowRight, FiInfo, FiShoppingCart } from 'react-icons/fi';
import { removeProductFromWishlist, fetchWishlist, selectWishlistItems } from '../../redux/slices/wishlistSlice';
import { addToCart } from '../../redux/slices/cartSlice';
import Card from '../../commonComponents/cards/Card';
import Button from '../../commonComponents/buttons/Button';
import { Reveal } from '../../commonComponents/animations/ScrollReveal';
import { motionTransitions } from '../../config/motion';

export default function WishlistScreen() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const wishlistItems = useSelector(selectWishlistItems);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  const handleRemove = (id) => {
    dispatch(removeProductFromWishlist(id));
  };

  const handleMoveToCart = (item) => {
    dispatch(addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      qty: 1,
      image: item.image,
      availabilityStatus: item.availabilityStatus,
    }));
    dispatch(removeProductFromWishlist(item.id));
    navigate('/user/cart');
  };

  return (
    <div className="flex flex-col gap-8 py-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-brand-border/40 dark:border-slate-800/40 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-1">
            My Wishlist
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Saved items from our trade catalog for quick procurement planning.
          </p>
        </div>
        {wishlistItems.length > 0 && (
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full">
            {wishlistItems.length} item{wishlistItems.length !== 1 ? 's' : ''} saved
          </span>
        )}
      </div>

      {wishlistItems.length === 0 ? (
        <Reveal><Card variant="glass" className="p-8">
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="h-12 w-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mb-4">
              <FiHeart className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              Your Wishlist is Empty
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mb-6">
              Browse our products catalog and tap the heart icon or "Add to Wishlist" on any product to save items here for later review.
            </p>
            <Link to="/user/products">
              <Button variant="primary" icon={FiArrowRight} iconPosition="right">
                Browse Trade Catalog
              </Button>
            </Link>
          </div>
        </Card></Reveal>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <AnimatePresence initial={false}>
          {wishlistItems.map((item) => (
            <motion.div key={item.id} layout={!shouldReduceMotion} initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.94 }} transition={shouldReduceMotion ? { duration: 0 } : motionTransitions.interface}>
            <Card variant="default" className="flex h-full flex-col p-4 group">
              {/* Product Thumbnail */}
              <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-850 mb-4 border border-brand-border/20">
                <img
                  src={item.image || 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=400&q=80'}
                  alt={item.name}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=400&q=80';
                  }}
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                />
                <button
                  onClick={() => handleRemove(item.id)}
                  className="absolute top-2.5 right-2.5 p-2 rounded-xl bg-white/90 dark:bg-slate-900/90 text-red-500 border border-slate-200/40 dark:border-slate-800/40 hover:bg-red-50 hover:text-red-650 transition-colors shadow-xs"
                  title="Remove from Wishlist"
                >
                  <FiTrash2 className="h-4 w-4" />
                </button>
              </div>

              {/* Title & Info */}
              <div className="flex-1 flex flex-col justify-between gap-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug line-clamp-2">
                    {item.name}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-2">
                    <FiInfo className="h-3.5 w-3.5 text-slate-400" />
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      MOQ: <span className="font-semibold text-slate-700 dark:text-slate-200">{item.moq}</span>
                    </span>
                  </div>
                </div>

                {/* Price & Primary CTA */}
                <div>
                  <div className="text-sm font-extrabold text-secondary dark:text-accent mb-3">
                    {item.priceFormatted}
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <Button
                      variant="primary"
                      className="w-full"
                      size="md"
                      icon={FiShoppingCart}
                      onClick={() => handleMoveToCart(item)}
                    >
                      Move to Cart
                    </Button>
                    <Link to={`/user/products/${item.id}`} className="w-full">
                      <Button variant="outline" className="w-full" size="md">
                        View Item
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </Card></motion.div>
          ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
