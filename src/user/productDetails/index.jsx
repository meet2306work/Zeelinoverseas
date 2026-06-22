import { useState, useEffect, lazy, Suspense } from 'react';
import { useParams, useLocation, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { FiHeart, FiCheck, FiShield, FiShoppingCart, FiMessageCircle, FiStar } from 'react-icons/fi';
import Button from '../../commonComponents/buttons/Button';
import Tabs from '../../commonComponents/layouts/Tabs';
import Skeleton from '../../commonComponents/loaders/Skeleton';
import LoginRedirectModal from '../../commonComponents/modals/LoginRedirectModal';
import { Reveal, StaggerGroup, StaggerItem } from '../../commonComponents/animations/ScrollReveal';
import { motionTransitions } from '../../config/motion';
import { addProductToWishlist, removeProductFromWishlist, selectIsInWishlist } from '../../redux/slices/wishlistSlice';
import { fetchProductById, fetchProductReviews, createProductReview, clearProductDetails } from '../../redux/slices/productSlice';
import { addToCart } from '../../redux/slices/cartSlice';

const ThreeDViewer = lazy(() => import('../../commonComponents/threeDViewer/ThreeDViewer'));

const INQUIRY_THRESHOLD_QTY = 200;
const BASE_PRICE_QTY = 25;
const PRICE_TIER_QUANTITIES = [25, 50, 100, 200];

const buildPriceTiers = (basePrice, unit) => PRICE_TIER_QUANTITIES.map((qty) => {
  const totalPrice = basePrice * (qty / BASE_PRICE_QTY);

  return {
    qty,
    label: `${qty} ${unit}`,
    totalPrice,
    unitPrice: qty > 0 ? totalPrice / qty : 0,
  };
});

export default function ProductDetailsScreen() {
  const location = useLocation();
  const dispatch = useDispatch();
  const isPortal = location.pathname.startsWith('/user');
  const { id } = useParams();
  const [reviewComment, setReviewComment] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [selectedQty, setSelectedQty] = useState(25);
  const [isAdded, setIsAdded] = useState(false);
  const [activeTab, setActiveTab] = useState('specs');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();


  const isInWishlist = useSelector(selectIsInWishlist(id));
  const { user } = useSelector((state) => state.auth);

  const { productDetails, reviews, loading } = useSelector((state) => state.products);
  const fallbackProduct = {
    id: id || 'prod-001',
    name: 'Loading Product...',
    description: '',
    priceTiers: [
      { qty: 25, label: '25 Units', totalPrice: 0, unitPrice: 0 },
    ],
    moq: '25 Units',
    specs: [],
    shipping: '',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=400&q=80',
  };

  const baseTierPrice = Number(productDetails?.price) || 0;
  const salesUnit = productDetails?.unit || 'pcs';

  const product = productDetails ? {
    id: productDetails._id,
    name: productDetails.title,
    description: productDetails.description,
    priceTiers: buildPriceTiers(baseTierPrice, salesUnit),
    moq: `${productDetails.specifications?.find(s => s.key === 'moq')?.value || 25} ${productDetails.unit || 'pcs'}`,
    specs: [
      productDetails.sku && { key: 'SKU', value: productDetails.sku },
      productDetails.ply && { key: 'PLY Count', value: productDetails.ply },
      productDetails.dimension && { key: 'Dimensions', value: `${productDetails.dimension} ${productDetails.sizeUnit || 'mm'}` },
      productDetails.gsm && { key: 'Paper Weight (GSM)', value: productDetails.gsm },
      productDetails.color && { key: 'Color / Shade', value: productDetails.color },
      productDetails.bundle && { key: 'Bundle Quantity', value: `${productDetails.bundle} pcs` },
      productDetails.unit && { key: 'Sales Unit', value: productDetails.unit === 'pcs' ? 'Per Piece' : 'Per Bundle' },
      productDetails.gstRate !== undefined && { key: 'GST Rate', value: `${productDetails.gstRate}%` },
      productDetails.thickness && { key: 'Thickness', value: productDetails.thickness },
      productDetails.recyclable !== undefined && { key: 'Recyclable', value: productDetails.recyclable ? 'Yes (100% Recyclable)' : 'No' },
      productDetails.printingOption && { key: 'Printing Option', value: productDetails.printingOption },
      productDetails.burstingFactor && { key: 'Bursting Factor (BF)', value: productDetails.burstingFactor },
      ...(productDetails.specifications || [])
    ].filter(Boolean),
    // OLD (commented out - do not delete)
    // shipping: 'Vessel shipment to designated Port of Destination. Standard loading duration is 5-7 business days from order release.',
    // NEW
    shipping: 'Express shipping to your door or warehouse. Standard delivery duration is 5-7 business days from order confirmation.',
    image: productDetails.images && productDetails.images.length > 0 ? productDetails.images[0].url : fallbackProduct.image,
  } : fallbackProduct;

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    dispatch(fetchProductById(id));
    dispatch(fetchProductReviews(id));
    return () => {
      dispatch(clearProductDetails());
    };
  }, [dispatch, id]);

  const handleAddReview = (e) => {
    e.preventDefault();
    if (!user) return alert('Please login to submit a review');
    dispatch(createProductReview({
      productId: id,
      rating: reviewRating,
      title: reviewTitle,
      comment: reviewComment
    })).unwrap().then(() => {
      setReviewComment('');
      setReviewTitle('');
      setReviewRating(5);
    });
  };

  const handleAddInquiry = () => {
    if (!user) {
      setIsLoginModalOpen(true);
      return;
    }
    if (selectedTier) {
      dispatch(addToCart({
        id: product.id || id,
        name: product.name,
        price: selectedTier.totalPrice,
        qty: 1,
        image: productImages[0] || product.image
      }));
      setIsAdded(true);
      setTimeout(() => {
        setIsAdded(false);
        navigate('/user/cart');
      }, 800);
    }
  };

  const handleWishlistToggle = () => {
    if (!user) {
      setIsLoginModalOpen(true);
      return;
    }
    if (isInWishlist) {
      dispatch(removeProductFromWishlist(id));
    } else {
      dispatch(addProductToWishlist(id));
    }
  };

  const needsInquiry = selectedQty > INQUIRY_THRESHOLD_QTY;
  const selectedTier = product.priceTiers.find((tier) => tier.qty === selectedQty);
  const tabOptions = [
    { label: 'Specifications', value: 'specs' },
    { label: 'Shipping & Delivery', value: 'shipping' },
    { label: `Reviews (${reviews?.length || 0})`, value: 'reviews' },
  ];
  const productImages = (productDetails?.images || []).map((image) => image.url).filter(Boolean);
  const activeImage = productImages[selectedImageIndex] || product.image;

  return (
    <div className="flex flex-col gap-brand-xl py-brand-md">
      {/* Return Link */}
      <div>
        <Link to={isPortal ? "/user/products" : "/products"} className="text-xs text-brand-text-secondary hover:text-secondary font-bold uppercase tracking-wider">
          &larr; Back to Catalog
        </Link>
      </div>

      {/* Main Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-brand-lg lg:gap-brand-2xl">
        
        {/* Left Side: product gallery and 3D canvas */}
        <div className="lg:col-span-7 flex flex-col gap-brand-md">
          {loading ? (
            <Skeleton variant="rectangle" className="aspect-video w-full" />
          ) : (
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-900">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImage}
                  src={activeImage}
                  alt={product.name}
                  initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 1.025 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={shouldReduceMotion ? { duration: 0 } : motionTransitions.storefront}
                  className="aspect-video w-full object-cover"
                />
              </AnimatePresence>
            </div>
          )}

          {productImages.length > 1 && (
            <StaggerGroup className="grid grid-cols-4 gap-3" stagger={0.04}>
              {productImages.map((image, index) => (
                <StaggerItem key={image}>
                  <button
                    type="button"
                    onClick={() => setSelectedImageIndex(index)}
                    aria-label={`View product image ${index + 1}`}
                    className={`aspect-video w-full overflow-hidden rounded-xl border-2 transition-colors ${selectedImageIndex === index ? 'border-secondary' : 'border-transparent hover:border-slate-300 dark:hover:border-slate-700'}`}
                  >
                    <img src={image} alt="" className="h-full w-full object-cover transition-transform duration-300 hover:scale-105" />
                  </button>
                </StaggerItem>
              ))}
            </StaggerGroup>
          )}

          {productDetails?.threeDModel?.url && (
            <Suspense fallback={<Skeleton variant="rectangle" className="aspect-video w-full" />}>
              <ThreeDViewer className="aspect-video" modelUrl={productDetails.threeDModel.url} />
            </Suspense>
          )}
        </div>

        {/* Right Side: Product Details & Cart Actions */}
        <div className="lg:col-span-5 flex flex-col gap-brand-lg">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-text-primary dark:text-white tracking-tight leading-tight">
              {product.name}
            </h1>
            {/* OLD (commented out - do not delete)
            <p className="text-xs text-secondary dark:text-accent font-semibold mt-2.5 inline-flex items-center gap-brand-sm bg-secondary/10 dark:bg-slate-800 px-2.5 py-1 rounded-md">
              <FiShield className="h-4 w-4" /> Certification: SGS Verified Commodity
            </p>
            */}
            {/* NEW */}
            <p className="text-xs text-secondary dark:text-accent font-semibold mt-2.5 inline-flex items-center gap-brand-sm bg-secondary/10 dark:bg-slate-800 px-2.5 py-1 rounded-md">
              <FiShield className="h-4 w-4" /> Certification: Quality &amp; Specs Verified
            </p>
          </div>

          <p className="text-sm text-brand-text-secondary dark:text-slate-400 leading-relaxed">
            {product.description}
          </p>

          {/* Wholesale Pricing Tiers with Qty buttons */}
          <div className="border-t border-b border-brand-border dark:border-slate-800 py-brand-md">
            {/* OLD (commented out - do not delete)
            <h4 className="text-xs font-bold text-brand-text-secondary uppercase tracking-wider mb-brand-sm">
              Wholesale Pricing Tiers
            </h4>
            */}
            {/* NEW */}
            <h4 className="text-xs font-bold text-brand-text-secondary uppercase tracking-wider mb-brand-sm">
              Bulk Quantity Pricing Tiers
            </h4>
            {/* Qty selector */}
            <div className="flex flex-wrap gap-2 mb-3">
              {product.priceTiers.map((tier) => (
                <button
                  key={tier.qty}
                  onClick={() => setSelectedQty(tier.qty)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                    selectedQty === tier.qty
                      ? 'bg-secondary text-white border-secondary shadow-md'
                      : 'bg-slate-50 dark:bg-slate-900/40 text-brand-text-secondary border-brand-border dark:border-slate-800 hover:border-secondary/60'
                  }`}
                >
                  {tier.qty}
                </button>
              ))}
              <button
                onClick={() => setSelectedQty(201)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                  needsInquiry
                    ? 'bg-amber-500 text-white border-amber-500 shadow-md'
                    : 'bg-slate-50 dark:bg-slate-900/40 text-brand-text-secondary border-brand-border dark:border-slate-800 hover:border-amber-400'
                }`}
              >
                200+
              </button>
            </div>

            <div className="flex flex-col gap-brand-sm">
              {product.priceTiers.map((tier, idx) => (
                <div
                  key={idx}
                  className={`flex justify-between items-center px-brand-md py-brand-sm rounded-lg border transition-all ${
                    selectedQty === tier.qty
                      ? 'bg-secondary/10 border-secondary/40 dark:border-secondary/30'
                      : 'bg-slate-50 dark:bg-slate-900/40 border-brand-border dark:border-slate-800'
                  }`}
                >
                  <span className="text-xs font-semibold text-brand-text-secondary">{tier.label}</span>
                  <span className="text-right">
                    <span className="block text-sm font-extrabold text-brand-text-primary dark:text-white">
                      ${tier.totalPrice.toFixed(2)} total
                    </span>
                    <span className="block text-[10px] font-semibold text-brand-text-secondary">
                      ${tier.unitPrice.toFixed(2)} / {salesUnit}
                    </span>
                  </span>
                </div>
              ))}
              {/* 200+ inquiry row */}
              <div className={`flex justify-between items-center px-brand-md py-brand-sm rounded-lg border transition-all ${
                needsInquiry
                  ? 'bg-amber-50 dark:bg-amber-950/20 border-amber-400/60'
                  : 'bg-slate-50 dark:bg-slate-900/40 border-brand-border dark:border-slate-800'
              }`}>
                <span className="text-xs font-semibold text-brand-text-secondary">200+ Units</span>
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400">Contact for Pricing</span>
              </div>
            </div>

            {/* OLD (commented out - do not delete)
            {needsInquiry && (
              <p className="mt-2 text-[11px] text-amber-600 dark:text-amber-400 font-semibold">
                For quantities above 200, please send an inquiry for a custom quote.
              </p>
            )}
            */}
            {/* NEW */}
            {needsInquiry && (
              <p className="mt-2 text-[11px] text-amber-600 dark:text-amber-400 font-semibold">
                For quantities above 200, contact us for a wholesale print or custom volume quote.
              </p>
            )}

            {selectedTier && !needsInquiry && (
              <div className="mt-3 flex items-center justify-between rounded-xl border border-secondary/35 bg-secondary/10 px-brand-md py-brand-sm">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-brand-text-secondary">Selected Order</p>
                  <p className="text-xs font-semibold text-brand-text-primary">{selectedTier.label}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-extrabold text-brand-text-primary">${selectedTier.totalPrice.toFixed(2)}</p>
                  <p className="text-[10px] text-brand-text-secondary">Estimated product total</p>
                </div>
              </div>
            )}
          </div>

          {/* MOQ limits info */}
          <div className="flex items-center justify-between text-xs font-medium text-brand-text-secondary">
            <span>Minimum Order Quantity (MOQ):</span>
            <span className="font-bold text-brand-text-primary dark:text-white bg-slate-100 dark:bg-slate-800 px-brand-md py-brand-xs rounded">
              {product.moq}
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col gap-brand-sm mt-brand-sm">
            {/* OLD (commented out - do not delete)
            {needsInquiry ? (
              <Link to={isPortal ? "/user/rfq" : "/rfq"} className="flex-1">
                <Button variant="gold" size="lg" className="w-full" icon={FiMessageCircle}>
                  Send Inquiry for 200+ Units
                </Button>
              </Link>
            ) : (
            */}
            {/* NEW */}
            {needsInquiry ? (
              <Link
                to={isPortal ? "/user/rfq" : "/rfq"}
                className="flex-1"
                onClick={(e) => {
                  if (!user) {
                    e.preventDefault();
                    setIsLoginModalOpen(true);
                  }
                }}
              >
                <Button variant="gold" size="lg" className="w-full" icon={FiMessageCircle}>
                  Get Bulk Quote for 200+ Units
                </Button>
              </Link>
            ) : (
              <>
                <div className="flex flex-col sm:flex-row gap-brand-sm">
                  <Button
                    variant={isAdded ? 'success' : 'primary'}
                    className="flex-1"
                    size="lg"
                    onClick={handleAddInquiry}
                    icon={isAdded ? FiCheck : FiShoppingCart}
                  >
                    {isAdded ? 'Added!' : 'Buy Now'}
                  </Button>
                  {/* OLD (commented out - do not delete)
                  <Link to={isPortal ? "/user/rfq" : "/rfq"} className="flex-1">
                    <Button variant="gold" size="lg" className="w-full">
                      Request Quote
                    </Button>
                  </Link>
                  */}
                  {/* NEW */}
                  <Link
                    to={isPortal ? "/user/rfq" : "/rfq"}
                    className="flex-1"
                    onClick={(e) => {
                      if (!user) {
                        e.preventDefault();
                        setIsLoginModalOpen(true);
                      }
                    }}
                  >
                    <Button variant="gold" size="lg" className="w-full">
                      Get Custom Quote
                    </Button>
                  </Link>
                </div>
              </>
            )}

            {/* Wishlist toggle */}
            <button
              onClick={handleWishlistToggle}
              className={`flex items-center justify-center gap-2 w-full py-2 rounded-xl text-xs font-semibold border transition-all ${
                isInWishlist
                  ? 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-500/30 text-red-500'
                  : 'bg-slate-50 dark:bg-slate-900/40 border-brand-border dark:border-slate-800 text-brand-text-secondary hover:border-secondary/40 hover:text-secondary'
              }`}
            >
              <FiHeart className={`h-4 w-4 ${isInWishlist ? 'fill-red-400' : ''}`} />
              {isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
            </button>
          </div>
        </div>

      </div>

      {/* Tabs Specifications panel */}
      <Reveal className="mt-brand-xl border-t border-brand-border dark:border-slate-800 pt-xl">
        <Tabs tabs={tabOptions} activeTab={activeTab} onTabChange={setActiveTab} className="mb-brand-md" />

        {activeTab === 'specs' ? (
          <div className="grid max-w-4xl grid-cols-1 gap-brand-md md:grid-cols-2">
            {product.specs.length > 0 ? product.specs.map((spec, idx) => (
              <div key={`${spec.key}-${idx}`} className="flex items-center justify-between border-b border-brand-border/40 py-brand-sm text-sm dark:border-slate-800/40">
                <span className="text-brand-text-secondary font-medium">{spec.key}</span>
                <span className="text-brand-text-primary dark:text-white font-bold text-right ml-4">{spec.value}</span>
              </div>
            )) : !loading ? (
              <p className="text-sm text-brand-text-secondary">No product specifications are available.</p>
            ) : null}
          </div>
        ) : activeTab === 'shipping' ? (
          <p className="text-sm text-brand-text-secondary dark:text-slate-400 leading-relaxed max-w-2xl">
            {product.shipping}
          </p>
        ) : (
          <div className="max-w-4xl flex flex-col gap-8">
            {/* Reviews List */}
            <div className="flex flex-col gap-6">
              {reviews.length > 0 ? reviews.map(review => (
                <div key={review._id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-sm text-brand-text-primary dark:text-white">{review.title}</span>
                    <div className="flex text-amber-500 text-sm">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <FiStar key={i} className={i < review.rating ? 'fill-current' : ''} />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">{review.comment}</p>
                  <p className="text-xs text-slate-500">By {review.user?.firstName || 'User'} on {new Date(review.createdAt).toLocaleDateString()}</p>
                </div>
              )) : (
                <p className="text-sm text-slate-500">No reviews yet. Be the first to review this product!</p>
              )}
            </div>
            
            {/* Review Form */}
            {user && (
              <form onSubmit={handleAddReview} className="bg-slate-50 dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col gap-4">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase">Write a Review</h4>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-400">Rating</label>
                  <select value={reviewRating} onChange={e => setReviewRating(Number(e.target.value))} className="p-2 border rounded-lg bg-white dark:bg-slate-950 text-sm">
                    <option value="5">5 - Excellent</option>
                    <option value="4">4 - Good</option>
                    <option value="3">3 - Average</option>
                    <option value="2">2 - Poor</option>
                    <option value="1">1 - Terrible</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-400">Title</label>
                  <input required value={reviewTitle} onChange={e => setReviewTitle(e.target.value)} type="text" placeholder="Summary of your review" className="p-2 border rounded-lg bg-white dark:bg-slate-950 text-sm" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-400">Comment</label>
                  <textarea required value={reviewComment} onChange={e => setReviewComment(e.target.value)} rows="3" placeholder="Share your experience..." className="p-2 border rounded-lg bg-white dark:bg-slate-950 text-sm"></textarea>
                </div>
                <Button type="submit" variant="primary">Submit Review</Button>
              </form>
            )}
          </div>
        )}
      </Reveal>

      <LoginRedirectModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        actionName="shop products, request custom print quotes, and track orders"
      />
    </div>
  );
}
