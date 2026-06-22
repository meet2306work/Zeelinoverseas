import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCategories } from '../../redux/slices/categorySlice';
import { fetchProducts } from '../../redux/slices/productSlice';
import { FiArrowRight, FiTrendingUp, FiAnchor, FiBriefcase, FiShield, FiSearch, FiTruck, FiGlobe, FiCheckCircle, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import Button from '../../commonComponents/buttons/Button';
import Card from '../../commonComponents/cards/Card';
import AnimatedNumber from '../../commonComponents/animations/AnimatedNumber';
import { Reveal, StaggerGroup, StaggerItem } from '../../commonComponents/animations/ScrollReveal';
import useHeroAnimation from '../../hooks/useHeroAnimation';
import LoginRedirectModal from '../../commonComponents/modals/LoginRedirectModal';
import { motion, AnimatePresence } from 'framer-motion';
import useTiltEffect from '../../hooks/useTiltEffect';

function TiltCard({ children, ...props }) {
  const { tiltProps, style } = useTiltEffect(6);
  return (
    <motion.div {...tiltProps} style={style} className="h-full">
      <Card {...props} hover={false}>
        {children}
      </Card>
    </motion.div>
  );
}

export default function HomeScreen() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isPortal = location.pathname.startsWith('/user');
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const { categoriesList } = useSelector((state) => state.categories);
  const { products } = useSelector((state) => state.products);
  const { slideshowEnabled, slideshowInterval, slideshowImages } = useSelector((state) => state.settings);
  const orders = useSelector((state) => state.orders?.ordersList || []);
  const [catalogSearch, setCatalogSearch] = useState('');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState('request a bulk order quote');

  // Slideshow state
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const slideTimerRef = useRef(null);
  const heroRef = useRef(null);
  useHeroAnimation(heroRef);

  const totalOrders = orders.length;

  const stats = [
    { label: 'Custom Boxes Manufactured', value: 12, suffix: 'M+', icon: FiTrendingUp },
    { label: 'Active Enterprise Clients', value: 2500, suffix: '+', icon: FiAnchor },
    { label: 'Sourcing Regions Supported', value: 54, suffix: '+', icon: FiBriefcase },
  ];

  const topProducts = (products || []).slice(0, 3);

  const fallbackImage = 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=400&q=80';
  const catalogSuggestions = [
    ...topProducts.map((product) => product.name || product.title),
    ...(categoriesList || []).flatMap((cat) => [cat.name, cat.slug, cat.desc]),
  ].filter(Boolean);

  const handleCatalogSearch = (e) => {
    e.preventDefault();
    const query = catalogSearch.trim();
    const path = isPortal ? '/user/products' : '/products';
    navigate(query ? `${path}?q=${encodeURIComponent(query)}` : path);
  };

  // Auto-advance slideshow
  const goToSlide = (index) => {
    if (!slideshowImages.length) return;
    const next = (index + slideshowImages.length) % slideshowImages.length;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentSlide(next);
      setIsAnimating(false);
    }, 300);
  };

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchProducts('?limit=6'));
  }, [dispatch]);

  useEffect(() => {
    if (!slideshowEnabled || slideshowImages.length <= 1) return;
    slideTimerRef.current = setInterval(() => {
      setCurrentSlide(prev => {
        const next = (prev + 1) % slideshowImages.length;
        return next;
      });
    }, slideshowInterval * 1000);
    return () => clearInterval(slideTimerRef.current);
  }, [slideshowEnabled, slideshowInterval, slideshowImages.length]);

  const currentImage = slideshowImages[currentSlide];

  return (
    <div className="flex flex-col gap-16 py-4">
      {/* Hero Section */}
      <section ref={heroRef} className="relative overflow-hidden rounded-3xl border border-border-default/30 hero-gradient shadow-2xl">
        <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.05fr_0.95fr] lg:p-10">
          <div className="flex flex-col justify-center gap-6 text-center lg:text-left">
            {/* OLD (commented out - do not delete)
            <span data-hero-item className="mx-auto inline-flex w-fit items-center gap-1.5 rounded-full border border-accent-gold/20 bg-accent-gold/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-accent-gold lg:mx-0">
              <FiShield className="h-3.5 w-3.5" /> Verified B2B Import Export Marketplace
            </span>
            */}
            {/* NEW */}
            <span data-hero-item className="mx-auto inline-flex w-fit items-center gap-1.5 rounded-full border border-accent-gold/20 bg-accent-gold/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-accent-gold lg:mx-0">
              <FiShield className="h-3.5 w-3.5" /> Verified Custom Packaging & Bulk Store
            </span>

            <div data-hero-item>
              {/* OLD (commented out - do not delete)
              <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-text-primary sm:text-4xl lg:text-5xl font-display">
                Source packaging products from <span className="text-accent-gold">global suppliers</span>
              </h1>
              <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-text-secondary sm:text-base lg:mx-0">
                Compare cartons, mailers, rigid boxes, void-fill and export-ready packaging with live MOQ, bulk pricing, RFQ support and shipment visibility in one trade desk.
              </p>
              */}
              {/* NEW */}
              <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-text-primary sm:text-4xl lg:text-5xl font-display">
                Order custom packaging from <span className="text-accent-gold">top manufacturers</span>
              </h1>
              <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-text-secondary sm:text-base lg:mx-0">
                Shop premium boxes, mailers, and wrapping supplies with custom sizes, low wholesale MOQ, bulk discounts, and express tracking in one place.
              </p>
            </div>

            {/* Search + Browse Catalog */}
            <form data-hero-item onSubmit={handleCatalogSearch} className="rounded-2xl border border-border-default/60 bg-background-surface/40 p-2 shadow-inner">
              <div className="flex flex-col gap-2 sm:flex-row">
                <label className="flex min-h-11 flex-1 items-center gap-3 rounded-xl bg-background-primary px-4 text-sm text-text-secondary border border-border-default/50">
                  <FiSearch className="h-4.5 w-4.5 shrink-0 text-text-secondary" />
                  <input
                    value={catalogSearch}
                    onChange={(e) => setCatalogSearch(e.target.value)}
                    list="home-catalog-suggestions"
                    placeholder="Search boxes, mailers, bags, wrapping rolls..."
                    className="min-w-0 flex-1 bg-transparent text-sm font-medium text-text-primary outline-none placeholder:text-text-secondary/50"
                  />
                  <datalist id="home-catalog-suggestions">
                    {[...new Set(catalogSuggestions)].map((item) => (
                      <option key={item} value={item} />
                    ))}
                  </datalist>
                </label>
                <div className="sm:shrink-0">
                  <Button type="submit" variant="primary" size="md" icon={FiArrowRight} iconPosition="right" className="w-full sm:w-auto">
                    Browse Catalog
                  </Button>
                </div>
              </div>
            </form>

            <div data-hero-item className="grid grid-cols-3 gap-3">
              {/* OLD (commented out - do not delete)
              {[
                { label: 'Product SKUs', value: '8,400+' },
                { label: 'Total Orders', value: totalOrders > 0 ? `${totalOrders}` : '1,200+' },
                { label: 'RFQ Reply', value: '24h' },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl border border-border-default/60 bg-background-surface/30 p-3 text-center">
                  <div className="text-lg font-extrabold text-text-primary">{item.value}</div>
                  <div className="mt-1 text-[10px] font-bold text-text-secondary uppercase tracking-wider">{item.label}</div>
                </div>
              ))}
              */}
              {/* NEW */}
              {[
                { label: 'Available Items', value: '8,400+' },
                { label: 'Orders Shipped', value: totalOrders > 0 ? `${totalOrders}` : '1,200+' },
                { label: 'Quote Reply', value: '24h' },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl border border-border-default/60 bg-background-surface/30 p-3 text-center">
                  <div className="text-lg font-extrabold text-text-primary">{item.value}</div>
                  <div className="mt-1 text-[10px] font-bold text-text-secondary uppercase tracking-wider">{item.label}</div>
                </div>
              ))}
            </div>

            <div data-hero-item className="flex flex-wrap justify-center gap-3 lg:justify-start">
              {/* OLD (commented out - do not delete)
              <Link to={isPortal ? "/user/rfq" : "/rfq"}>
                <Button variant="brandGradient" size="md">
                  Request Bulk Quote
                </Button>
              </Link>
              <Link to={isPortal ? "/user/categories" : "/categories"}>
                <Button variant="outline" size="md" icon={FiArrowRight} iconPosition="right">
                  Explore Categories
                </Button>
              </Link>
              */}
              {/* NEW */}
              <Link 
                to={isPortal ? "/user/rfq" : "/rfq"}
                onClick={(e) => {
                  if (!isPortal && !isAuthenticated) {
                    e.preventDefault();
                    setModalAction('request a bulk order quote');
                    setIsLoginModalOpen(true);
                  }
                }}
              >
                <Button variant="brandGradient" size="md">
                  Get Bulk Quote
                </Button>
              </Link>
              <Link to={isPortal ? "/user/categories" : "/categories"}>
                <Button variant="outline" size="md" icon={FiArrowRight} iconPosition="right">
                  Shop Categories
                </Button>
              </Link>
            </div>
          </div>

          {/* Live Sourcing Board with Slideshow */}
          <div data-hero-board className="rounded-3xl border border-border-default/50 bg-background-surface/40 p-4 shadow-lg backdrop-blur-xs flex flex-col h-full">
            <div className="mb-4 flex items-center justify-between gap-3 shrink-0">
              <div>
                {/* OLD (commented out - do not delete)
                <h2 className="text-sm font-extrabold text-text-primary font-display uppercase tracking-wider">Live Sourcing Board</h2>
                <p className="text-[11px] text-text-secondary">Packaging products ready for import/export</p>
                */}
                {/* NEW */}
                <h2 className="text-sm font-extrabold text-text-primary font-display uppercase tracking-wider">Live Store Catalog</h2>
                <p className="text-[11px] text-text-secondary">Custom box styles & supplies ready for order</p>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                <FiCheckCircle className="h-3.5 w-3.5" /> Verified
              </span>
            </div>

            {/* Product Image Slideshow */}
            {slideshowEnabled && slideshowImages.length > 0 ? (
              <div className="relative flex-1 flex flex-col min-h-[300px]">
                <div className="relative flex-1 overflow-hidden rounded-2xl bg-black-accent shadow-md">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={currentSlide}
                      src={currentImage?.url || fallbackImage}
                      alt={currentImage?.caption || 'Product'}
                      onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = fallbackImage; }}
                      initial={{ opacity: 0, scale: 1.05 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </AnimatePresence>
                  
                  {/* Caption overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black-accent/80 via-transparent to-transparent flex items-end p-5 z-10">
                    <motion.p
                      key={currentSlide}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.3 }}
                      className="text-sm font-bold text-text-on-dark"
                    >
                      {currentImage?.caption}
                    </motion.p>
                  </div>

                  {/* Navigation arrows */}
                  {slideshowImages.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={() => goToSlide(currentSlide - 1)}
                        className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/35 transition-all cursor-pointer z-20"
                      >
                        <FiChevronLeft className="h-4.5 w-4.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => goToSlide(currentSlide + 1)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/35 transition-all cursor-pointer z-20"
                      >
                        <FiChevronRight className="h-4.5 w-4.5" />
                      </button>
                    </>
                  )}
                </div>

                {/* Dot indicators */}
                {slideshowImages.length > 1 && (
                  <div className="flex justify-center gap-1.5 mt-3 shrink-0">
                    {slideshowImages.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => goToSlide(idx)}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          idx === currentSlide
                            ? 'w-4 bg-accent-gold'
                            : 'w-1.5 bg-border-default hover:bg-text-secondary/50'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              /* Fallback: static product links */
              <div className="grid gap-3 mb-4">
                {topProducts.slice(0, 2).map((product) => (
                  <Link
                    key={product.id}
                    to={isPortal ? `/user/products/${product.id}` : `/products/${product.id}`}
                    className="group grid grid-cols-[82px_1fr] gap-3 rounded-2xl border border-border-default/50 bg-background-surface p-3 transition hover:border-accent-gold/45 hover:shadow-md"
                  >
                    <div className="aspect-square overflow-hidden rounded-xl bg-background-primary">
                      <img
                        src={product.images?.[0] || product.image}
                        alt={product.name}
                        onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = fallbackImage; }}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="line-clamp-2 text-sm font-bold text-text-primary group-hover:text-accent-gold">
                          {product.name}
                        </h3>
                        <span className="whitespace-nowrap text-xs font-extrabold text-accent-gold">
                          {typeof product.price === 'number' ? `$${product.price.toFixed(2)}` : product.price}
                        </span>
                      </div>
                      {/* OLD (commented out - do not delete)
                      <div className="mt-3 flex flex-wrap gap-2 text-[11px] font-semibold text-text-secondary">
                        <span className="rounded-lg bg-background-primary/85 px-2 py-1">MOQ {product.moq}</span>
                        <span className="rounded-lg bg-background-primary/85 px-2 py-1">FOB Ready</span>
                        <span className="rounded-lg bg-background-primary/85 px-2 py-1">Bulk Pricing</span>
                      </div>
                      */}
                      {/* NEW */}
                      <div className="mt-3 flex flex-wrap gap-2 text-[11px] font-semibold text-text-secondary">
                        <span className="rounded-lg bg-background-primary/85 px-2 py-1">MOQ {product.moq}</span>
                        <span className="rounded-lg bg-background-primary/85 px-2 py-1">In Stock</span>
                        <span className="rounded-lg bg-background-primary/85 px-2 py-1">Wholesale Rates</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* 
            <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <TiltCard className="rounded-2xl border border-border-default/50 bg-background-surface p-4">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-text-secondary">
                  <FiTruck className="h-4 w-4 text-accent-gold" /> Shipment Lane
                </div>
                <div className="mt-3 text-sm font-extrabold text-text-primary">Mumbai to Dubai</div>
                <div className="mt-1 text-xs text-text-secondary">Cartons and display boxes, 18 CBM</div>
              </TiltCard>
              <TiltCard className="rounded-2xl border border-border-default/50 bg-background-surface p-4">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-text-secondary">
                  <FiGlobe className="h-4 w-4 text-accent-gold" /> Trade Terms
                </div>
                <div className="mt-3 text-sm font-extrabold text-text-primary">FOB, CIF, EXW</div>
                <div className="mt-1 text-xs text-text-secondary">Supplier docs and export packaging support</div>
              </TiltCard>
            </div>
            */}
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <Reveal className="flex flex-col gap-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div className="text-center md:text-left">
            {/* OLD (commented out - do not delete)
            <h2 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight mb-2 font-display">
              Browse Sourcing Categories
            </h2>
            <p className="text-sm text-text-secondary max-w-xl">
              Choose a packaging category to filter products instantly in the global catalog.
            </p>
            */}
            {/* NEW */}
            <h2 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight mb-2 font-display">
              Browse Shop Categories
            </h2>
            <p className="text-sm text-text-secondary max-w-xl">
              Choose a product category to shop specific packaging styles instantly.
            </p>
          </div>
          <Link to={isPortal ? "/user/categories" : "/categories"} className="mx-auto md:mx-0">
            {/* OLD (commented out - do not delete)
            <Button variant="outline" size="sm" icon={FiArrowRight} iconPosition="right">
              Explore More Categories
            </Button>
            */}
            {/* NEW */}
            <Button variant="outline" size="sm" icon={FiArrowRight} iconPosition="right">
              Shop All Categories
            </Button>
          </Link>
        </div>

        <StaggerGroup className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {(categoriesList || []).map((cat) => {
            return (
              <StaggerItem key={cat.slug} className="h-full">
                <Link
                  to={`${isPortal ? '/user/products' : '/products'}?category=${cat.slug}`}
                  className="group block h-full"
                >
                  <TiltCard variant="glass" className="flex h-full flex-col overflow-hidden border-border-default/50 p-0 hover:border-accent-gold/45">
                    <div className="relative aspect-video w-full overflow-hidden bg-background-primary border-b border-border-default/40">
                      <img src={cat.image} alt={cat.name} onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = fallbackImage; }} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                    <div className="p-brand-md text-center flex flex-col items-center flex-1 justify-center">
                      <h3 className="text-sm font-bold text-text-primary group-hover:text-accent-gold transition-colors font-display">{cat.name}</h3>
                      {cat.desc && <p className="text-xs text-text-secondary mt-1 line-clamp-2">{cat.desc}</p>}
                    </div>
                  </TiltCard>
                </Link>
              </StaggerItem>
            );
          })}
        </StaggerGroup>

      </Reveal>

      {/* Top Selling Products */}
      <Reveal className="flex flex-col gap-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div className="text-center md:text-left">
            {/* OLD (commented out - do not delete)
            <h2 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight mb-2 font-display">
              Top Selling Packaging Solutions
            </h2>
            <p className="text-sm text-text-secondary max-w-xl">
              Most popular custom cardboard boxes and mailing supplies preferred by global merchants.
            </p>
            */}
            {/* NEW */}
            <h2 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight mb-2 font-display">
              Top Selling Packaging &amp; Boxes
            </h2>
            <p className="text-sm text-text-secondary max-w-xl">
              Most popular boxes, mailers, and supplies trusted by online sellers.
            </p>
          </div>
          <Link to={isPortal ? "/user/products" : "/products"} className="hidden md:inline-block">
            {/* OLD (commented out - do not delete)
            <Button variant="outline" icon={FiArrowRight} iconPosition="right" size="sm">
              View Sourcing Catalog
            </Button>
            */}
            {/* NEW */}
            <Button variant="outline" icon={FiArrowRight} iconPosition="right" size="sm">
              Shop Full Catalog
            </Button>
          </Link>
        </div>

        <StaggerGroup className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {topProducts.map((p) => (
            <StaggerItem key={p.id} className="h-full"><TiltCard variant="default" className="flex flex-col justify-between h-full p-brand-md border border-border-default/50 hover:border-accent-gold/45 group">
              <div>
                <div className="relative aspect-video rounded-xl overflow-hidden bg-background-primary mb-brand-md border border-border-default/40">
                  <img
                    src={p.images?.[0] || p.image}
                    alt={p.name}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = fallbackImage;
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2 px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-background-surface/85 text-text-primary border border-border-default/30 backdrop-blur-xs uppercase tracking-wider">
                    Top Seller
                  </div>
                </div>

                <h4 className="text-sm font-bold text-text-primary line-clamp-2 group-hover:text-accent-gold transition-colors font-display mb-1">
                  {p.name}
                </h4>
                <p className="text-xs text-text-secondary">
                  MOQ: <span className="font-semibold text-text-primary">{p.moq}</span>
                </p>
              </div>

              <div className="mt-4">
                <div className="text-sm font-extrabold text-accent-gold mb-brand-sm">
                  {typeof p.price === 'number' ? `$${p.price.toFixed(2)}` : p.price}
                </div>

                <Link to={isPortal ? `/user/products/${p.id}` : `/products/${p.id}`}>
                  {/* OLD (commented out - do not delete)
                  <Button variant="outline" className="w-full justify-between" size="md" icon={FiArrowRight} iconPosition="right">
                    View Sourcing Details
                  </Button>
                  */}
                  {/* NEW */}
                  <Button variant="outline" className="w-full justify-between" size="md" icon={FiArrowRight} iconPosition="right">
                    Shop Product
                  </Button>
                </Link>
              </div>
            </TiltCard></StaggerItem>
          ))}
        </StaggerGroup>

      </Reveal>

      {/* Stats Counter Grid */}
      {/* 
      <StaggerGroup className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {stats.map((stat, idx) => {
          const StatIcon = stat.icon;
          return (
            <StaggerItem key={idx}><Card variant="glass" className="flex items-center gap-5 p-6 border-border-default/40">
              <div className="rounded-xl p-3 bg-accent-gold/15 text-accent-gold">
                <StatIcon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-2xl font-extrabold text-text-primary leading-none mb-1">
                  <AnimatedNumber value={stat.value} suffix={stat.suffix} />
                </h3>
                <p className="text-xs text-text-secondary font-medium">
                  {stat.label}
                </p>
              </div>
            </Card></StaggerItem>
          );
        })}
      </StaggerGroup>
      */}

      {/* CTA Box */}
      <Reveal className="rounded-2xl bg-gradient-to-r from-background-surface via-background-primary to-background-surface border border-accent-gold/30 p-8 sm:p-12 flex flex-col md:flex-row justify-between items-center gap-6 shadow-lg">
        <div className="text-center md:text-left">
          {/* OLD (commented out - do not delete)
          <h3 className="text-xl sm:text-2xl font-bold text-accent-gold mb-2 font-display">
            Looking for Custom Dimensions or Printing?
          </h3>
          <p className="text-sm text-text-secondary max-w-lg leading-relaxed">
            Attach your package outlines or box blueprints, specify board grades, choose select void-fill styles, and receive a manufacturing quote within 24 business hours.
          </p>
          */}
          {/* NEW */}
          <h3 className="text-xl sm:text-2xl font-bold text-accent-gold mb-2 font-display">
            Need Custom Sizes or Branded Printing?
          </h3>
          <p className="text-sm text-text-secondary max-w-lg leading-relaxed">
            Upload your box dimensions or logo files, select your thickness, choose your print style, and get a wholesale price quote in under 24 hours.
          </p>
        </div>
        <Link 
          to={isPortal ? "/user/rfq" : "/rfq"}
          onClick={(e) => {
            if (!isPortal && !isAuthenticated) {
              e.preventDefault();
              setModalAction('request a custom print quote');
              setIsLoginModalOpen(true);
            }
          }}
        >
          {/* NEW */}
          <Button variant="brandGradient" size="lg" className="whitespace-nowrap">
            Get Custom Print Quote
          </Button>
        </Link>
      </Reveal>

      <LoginRedirectModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        actionName={modalAction}
      />
    </div>
  );
}
