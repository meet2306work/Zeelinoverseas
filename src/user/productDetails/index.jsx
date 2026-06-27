import { useState, useEffect, lazy, Suspense } from 'react';
import { useParams, useLocation, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { FiHeart, FiCheck, FiShield, FiShoppingCart, FiMessageCircle, FiStar, FiImage, FiBox, FiX } from 'react-icons/fi';
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
  const [showcaseMode, setShowcaseMode] = useState('photo');
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();


  const isInWishlist = useSelector(selectIsInWishlist(id));
  const { user } = useSelector((state) => state.auth);

  const { productDetails, reviews, loading } = useSelector((state) => state.products);
  const isProductLoading = loading || !productDetails || productDetails._id !== id;
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
    stock: productDetails.stock !== undefined ? productDetails.stock : 0,
    availabilityStatus: productDetails.availabilityStatus || 'In Stock',
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
        image: productImages[0] || product.image,
        availabilityStatus: product.availabilityStatus,
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
      {isProductLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-brand-lg lg:gap-brand-2xl">
          {/* Left Side: gallery skeleton */}
          <div className="lg:col-span-7 flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Skeleton variant="rectangle" className="aspect-[4/3] w-full" />
            </div>
            <div className="w-full sm:w-24 shrink-0 flex flex-row sm:flex-col gap-3">
              <Skeleton variant="rectangle" className="aspect-video sm:aspect-square w-full" />
              <Skeleton variant="rectangle" className="aspect-video sm:aspect-square w-full" />
              <Skeleton variant="rectangle" className="aspect-video sm:aspect-square w-full" />
            </div>
          </div>

          {/* Right Side: detail skeleton */}
          <div className="lg:col-span-5 flex flex-col gap-brand-lg">
            <div>
              <Skeleton variant="heading" className="w-3/4 mb-3" />
              <Skeleton variant="rectangle" height="1.75rem" className="w-2/5" />
            </div>

            <Skeleton lines={3} />

            {/* Configurator Purchase Card Skeleton */}
            <div className="bg-white/60 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 shadow-premium flex flex-col gap-5">
              <div className="flex flex-col gap-3">
                <Skeleton variant="text" className="w-1/3 mb-1" />
                <Skeleton variant="rectangle" height="3.25rem" className="w-full" />
                <Skeleton variant="rectangle" height="3.25rem" className="w-full" />
                <Skeleton variant="rectangle" height="3.25rem" className="w-full" />
                <Skeleton variant="rectangle" height="3.25rem" className="w-full" />
              </div>
              <div className="border-t border-slate-200 dark:border-slate-800/80 pt-4">
                <Skeleton variant="text" className="w-2/3" />
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex gap-3">
                  <Skeleton variant="rectangle" height="3.5rem" className="flex-1" />
                  <Skeleton variant="rectangle" height="3.5rem" className="flex-1" />
                </div>
                <Skeleton variant="rectangle" height="2.5rem" className="w-full" />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-brand-lg lg:gap-brand-2xl">
          
          {/* Left Side: product gallery and 3D canvas */}
          <div className="lg:col-span-7 flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-955 shadow-premium group aspect-[4/3]">
              {/* Media viewport */}
              <div className={`absolute inset-0 flex items-center justify-center ${showcaseMode === '3d' ? 'p-0' : 'p-6'}`}>
                <AnimatePresence mode="wait">
                  {showcaseMode === '3d' && productDetails?.threeDModel?.url ? (
                    <motion.div
                      key="3d-viewer"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="w-full h-full flex items-center justify-center"
                    >
                      <Suspense fallback={<Skeleton variant="rectangle" className="w-full h-full" />}>
                        <ThreeDViewer className="w-full h-full" modelUrl={productDetails.threeDModel.url} />
                      </Suspense>
                    </motion.div>
                  ) : (
                    <motion.img
                      key={activeImage}
                      src={activeImage}
                      alt={product.name}
                      initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 1.025 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={shouldReduceMotion ? { duration: 0 } : motionTransitions.storefront}
                      className="max-h-full max-w-full object-contain"
                    />
                  )}
                </AnimatePresence>
              </div>
              {productDetails?.threeDModel?.url && (
                <div className="absolute top-4 right-4 z-20 flex gap-1 rounded-xl bg-white/90 dark:bg-slate-900/90 p-1 border border-slate-200 dark:border-slate-800/80 backdrop-blur-md shadow-premium transition-opacity duration-300 opacity-90 hover:opacity-100">
                  <button
                    onClick={() => setShowcaseMode('photo')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all duration-200 ${
                      showcaseMode === 'photo'
                        ? 'bg-secondary text-white shadow-sm'
                        : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                    }`}
                  >
                    <FiImage className="h-3.5 w-3.5" /> Photos
                  </button>
                  <button
                    onClick={() => setShowcaseMode('3d')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all duration-200 ${
                      showcaseMode === '3d'
                        ? 'bg-secondary text-white shadow-sm'
                        : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                    }`}
                  >
                    <FiBox className="h-3.5 w-3.5" /> 3D Model
                  </button>
                </div>
              )}
            </div>

            {/* Thumbnails list */}
            {(productImages.length > 1 || productDetails?.threeDModel?.url) && (
              <div className="w-full sm:w-24 shrink-0">
                <StaggerGroup className="flex flex-row sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto sm:max-h-full pr-1" stagger={0.04}>
                  {productImages.map((image, index) => (
                    <StaggerItem key={image} className="w-full">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedImageIndex(index);
                          setShowcaseMode('photo');
                        }}
                        aria-label={`View product image ${index + 1}`}
                        className={`aspect-video sm:aspect-square w-full overflow-hidden rounded-xl border-2 bg-white dark:bg-slate-955 p-1 transition-all duration-300 shadow-sm hover:shadow-md ${
                          selectedImageIndex === index && showcaseMode === 'photo'
                            ? 'border-secondary ring-2 ring-secondary/20 scale-[1.02]'
                            : 'border-slate-200 dark:border-slate-800 hover:border-slate-355'
                        }`}
                      >
                        <img src={image} alt="" className="h-full w-full object-contain transition-transform duration-300 hover:scale-105 rounded-lg" />
                      </button>
                    </StaggerItem>
                  ))}

                  {productDetails?.threeDModel?.url && (
                    <StaggerItem className="w-full">
                      <button
                        type="button"
                        onClick={() => setShowcaseMode('3d')}
                        aria-label="View interactive 3D model"
                        className={`aspect-video sm:aspect-square w-full overflow-hidden rounded-xl border-2 bg-white dark:bg-slate-955 p-1 transition-all duration-300 shadow-sm hover:shadow-md flex flex-col items-center justify-center gap-1 ${
                          showcaseMode === '3d'
                            ? 'border-secondary ring-2 ring-secondary/20 scale-[1.02]'
                            : 'border-slate-200 dark:border-slate-800 hover:border-slate-355'
                        }`}
                      >
                        <FiBox className={`h-5 w-5 transition-transform duration-300 ${showcaseMode === '3d' ? 'text-secondary scale-110' : 'text-slate-500 hover:scale-105'}`} />
                        <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500">3D Model</span>
                      </button>
                    </StaggerItem>
                  )}
                </StaggerGroup>
              </div>
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
              <div className="flex flex-wrap gap-2.5 items-center mt-2.5">
                <span className={`text-[10px] font-extrabold uppercase tracking-wider inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border ${
                  (product.stock === 0 || product.availabilityStatus === 'Out Of Stock')
                    ? 'bg-rose-50 text-rose-700 border-rose-200/60 dark:bg-rose-500/10 dark:text-red-400 dark:border-red-500/25'
                    : product.availabilityStatus === 'Pre-Order'
                    ? 'bg-amber-50 text-amber-700 border-amber-200/60 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/25'
                    : product.availabilityStatus === 'Archived'
                    ? 'bg-slate-50 text-slate-700 border-slate-200/60 dark:bg-slate-500/10 dark:text-slate-400 dark:border-slate-500/25'
                    : 'bg-emerald-50 text-emerald-700 border-emerald-200/60 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/25'
                }`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${
                    (product.stock === 0 || product.availabilityStatus === 'Out Of Stock')
                      ? 'bg-rose-500'
                      : product.availabilityStatus === 'Pre-Order'
                      ? 'bg-amber-500 animate-pulse'
                      : 'bg-emerald-500 animate-pulse'
                  }`} />
                  {(product.stock === 0 || product.availabilityStatus === 'Out Of Stock')
                    ? 'Out of Stock'
                    : product.availabilityStatus === 'Pre-Order'
                    ? 'Pre-Order'
                    : product.availabilityStatus === 'Archived'
                    ? 'Archived'
                    : `In Stock (${product.stock} Units)`}
                </span>

                <p className="text-xs text-secondary dark:text-accent font-semibold inline-flex items-center gap-brand-sm bg-secondary/10 dark:bg-slate-800 px-2.5 py-1 rounded-md">
                  <FiShield className="h-4 w-4" /> Certification: Quality &amp; Specs Verified
                </p>
              </div>
            </div>

            <p className="text-sm text-brand-text-secondary dark:text-slate-400 leading-relaxed">
              {product.description}
            </p>

            {/* Order Configuration Card */}
            <div className="bg-white/60 dark:bg-slate-900/40 backdrop-blur-md border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 shadow-premium flex flex-col gap-5">
              <div>
                {/* OLD (commented out - do not delete)
                <h4 className="text-xs font-bold text-brand-text-secondary uppercase tracking-wider mb-brand-sm">
                  Wholesale Pricing Tiers
                </h4>
                */}
                {/* NEW */}
                <h4 className="text-xs font-bold text-brand-text-secondary uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <FiBox className="text-secondary h-4 w-4" /> Bulk Quantity Pricing Tiers
                </h4>

                {/* Pricing Cards Stack */}
                <div className="flex flex-col gap-2.5">
                  {product.priceTiers.map((tier, idx) => {
                    const isSelected = selectedQty === tier.qty;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedQty(tier.qty)}
                        className={`w-full flex items-center justify-between p-3.5 rounded-xl border-2 text-left cursor-pointer transition-all duration-200 ${
                          isSelected
                            ? 'border-secondary bg-white dark:bg-slate-900 shadow-md scale-[1.01] ring-1 ring-secondary/20'
                            : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-955/20 hover:border-slate-355 dark:hover:border-slate-700 hover:bg-white/40 dark:hover:bg-slate-900/20'
                        }`}
                      >
                        {/* Left: Radio indicator + Label */}
                        <div className="flex items-center gap-3">
                          <div className={`h-4.5 w-4.5 rounded-full border flex items-center justify-center transition-all ${
                            isSelected
                              ? 'border-secondary bg-secondary/10'
                              : 'border-slate-355 dark:border-slate-700 bg-white/50 dark:bg-slate-955/50'
                          }`}>
                            {isSelected && (
                              <div className="h-2 w-2 rounded-full bg-secondary" />
                            )}
                          </div>
                          <span className={`text-sm font-bold transition-colors ${
                            isSelected ? 'text-brand-text-primary dark:text-white' : 'text-brand-text-secondary dark:text-slate-400'
                          }`}>
                            {tier.label}
                          </span>
                        </div>

                        {/* Right: Price Details */}
                        <div className="text-right">
                          <span className="block text-sm font-extrabold text-brand-text-primary dark:text-white">
                            ${tier.totalPrice.toFixed(2)} total
                          </span>
                          <span className="block text-[10px] font-semibold text-brand-text-secondary">
                            ${tier.unitPrice.toFixed(2)} / {salesUnit}
                          </span>
                        </div>
                      </button>
                    );
                  })}

                  {/* 200+ inquiry card */}
                  <button
                    type="button"
                    onClick={() => setSelectedQty(201)}
                    className={`w-full flex items-center justify-between p-3.5 rounded-xl border-2 text-left cursor-pointer transition-all duration-200 ${
                      needsInquiry
                        ? 'border-amber-500 bg-amber-50/30 dark:bg-amber-955/10 shadow-md scale-[1.01] ring-1 ring-amber-500/20'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 hover:border-slate-355 dark:hover:border-slate-700 hover:bg-white/40 dark:hover:bg-slate-900/20'
                    }`}
                  >
                    {/* Left: Radio indicator + Label */}
                    <div className="flex items-center gap-3">
                      <div className={`h-4.5 w-4.5 rounded-full border flex items-center justify-center transition-all ${
                        needsInquiry
                          ? 'border-amber-500 bg-amber-500/10'
                          : 'border-slate-355 dark:border-slate-700 bg-white/50 dark:bg-slate-955/50'
                      }`}>
                        {needsInquiry && (
                          <div className="h-2 w-2 rounded-full bg-amber-500" />
                        )}
                      </div>
                      <span className={`text-sm font-bold transition-colors ${
                        needsInquiry ? 'text-amber-700 dark:text-amber-400' : 'text-brand-text-secondary dark:text-slate-400'
                      }`}>
                        200+ Units
                      </span>
                    </div>

                    {/* Right: Status */}
                    <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                      Contact for Pricing
                    </span>
                  </button>
                </div>

                {/* Inquiry warning/tip helper text */}
                {/* OLD (commented out - do not delete)
                {needsInquiry && (
                  <p className="mt-2 text-[11px] text-amber-600 dark:text-amber-400 font-semibold">
                    For quantities above 200, please send an inquiry for a custom quote.
                  </p>
                )}
                */}
                {/* NEW */}
                {needsInquiry && (
                  <p className="mt-3 text-[11px] text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1 bg-amber-50 dark:bg-amber-955/20 p-2.5 rounded-lg border border-amber-500/20">
                    <span>For quantities above 200, contact us for a wholesale print or custom volume quote.</span>
                  </p>
                )}
              </div>

              {/* Selected Order Summary Receipt breakdown */}
              {selectedTier && !needsInquiry && (
                <div className="border-t border-dashed border-slate-200 dark:border-slate-800/80 pt-4 flex flex-col gap-2">
                  <div className="flex justify-between items-center text-xs text-brand-text-secondary">
                    <span>Subtotal ({selectedTier.label})</span>
                    <span className="font-semibold text-brand-text-primary dark:text-white">${selectedTier.totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-brand-text-secondary">
                    <span>Unit Price</span>
                    <span className="font-semibold text-brand-text-primary dark:text-white">${selectedTier.unitPrice.toFixed(2)} / {salesUnit}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-brand-text-secondary">
                    <span>Estimated Shipping</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5"><FiCheck /> Fast Shipping</span>
                  </div>
                  
                  <div className="flex items-center justify-between rounded-xl bg-secondary/10 px-4 py-3 border border-secondary/20 mt-1">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-brand-text-secondary">Selected Order</p>
                      <p className="text-xs font-semibold text-brand-text-primary">{selectedTier.label}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-extrabold text-brand-text-primary">${selectedTier.totalPrice.toFixed(2)}</p>
                      <p className="text-[10px] text-brand-text-secondary">Estimated product total</p>
                    </div>
                  </div>
                </div>
              )}

              {/* MOQ limits info */}
              <div className="flex items-center justify-between text-xs font-medium text-brand-text-secondary border-t border-slate-200 dark:border-slate-800/80 pt-4">
                <span>Minimum Order Quantity (MOQ):</span>
                <span className="font-bold text-brand-text-primary dark:text-white bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded">
                  {product.moq}
                </span>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col gap-3">
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
                    className="w-full block"
                    onClick={(e) => {
                      if (!user) {
                        e.preventDefault();
                        setIsLoginModalOpen(true);
                      }
                    }}
                  >
                    <Button variant="gold" size="lg" className="w-full py-3.5 shadow-md hover:shadow-lg transition-all" icon={FiMessageCircle}>
                      Get Bulk Quote for 200+ Units
                    </Button>
                  </Link>
                ) : (
                  <>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button
                        variant={(product.stock === 0 || product.availabilityStatus === 'Out Of Stock') ? 'secondary' : (isAdded ? 'success' : 'primary')}
                        className="flex-1 py-3.5 shadow-md hover:shadow-lg transition-all"
                        size="lg"
                        onClick={handleAddInquiry}
                        disabled={product.stock === 0 || product.availabilityStatus === 'Out Of Stock'}
                        icon={(product.stock === 0 || product.availabilityStatus === 'Out Of Stock') ? FiX : (isAdded ? FiCheck : FiShoppingCart)}
                      >
                        {(product.stock === 0 || product.availabilityStatus === 'Out Of Stock') ? 'Out of Stock' : (isAdded ? 'Added!' : 'Buy Now')}
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
                        <Button variant="gold" size="lg" className="w-full py-3.5 shadow-md hover:shadow-lg transition-all">
                          Get Custom Quote
                        </Button>
                      </Link>
                    </div>
                  </>
                )}

                {/* Wishlist toggle */}
                <button
                  onClick={handleWishlistToggle}
                  className={`flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    isInWishlist
                      ? 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-500/30 text-red-500 hover:bg-red-100/50'
                      : 'bg-slate-50/50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 text-brand-text-secondary hover:border-secondary/40 hover:text-secondary hover:bg-white/40 dark:hover:bg-slate-900/40'
                  }`}
                >
                  <FiHeart className={`h-4 w-4 transition-transform duration-200 ${isInWishlist ? 'fill-red-400 scale-110' : 'group-hover:scale-105'}`} />
                  {isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
            )) : !isProductLoading ? (
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
