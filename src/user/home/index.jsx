import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCategories } from '../../redux/slices/categorySlice';
import { fetchProducts } from '../../redux/slices/productSlice';
import { FiArrowRight, FiTrendingUp, FiAnchor, FiBriefcase, FiShield, FiBox, FiSearch, FiTruck, FiGlobe, FiCheckCircle, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import Button from '../../commonComponents/buttons/Button';
import Card from '../../commonComponents/cards/Card';

export default function HomeScreen() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isPortal = location.pathname.startsWith('/user');
  const { categoriesList, loading: categoriesLoading } = useSelector((state) => state.categories);
  const { products, loading: productsLoading } = useSelector((state) => state.products);
  const { slideshowEnabled, slideshowInterval, slideshowImages } = useSelector((state) => state.settings);
  const { wishlistItems } = useSelector((state) => state.wishlist);
  const orders = useSelector((state) => state.orders?.ordersList || []);
  const [catalogSearch, setCatalogSearch] = useState('');

  // Slideshow state
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const slideTimerRef = useRef(null);

  const totalOrders = orders.length;

  const stats = [
    { label: 'Custom Boxes Manufactured', value: '12M+', icon: FiTrendingUp },
    { label: 'Active Enterprise Clients', value: '2,500+', icon: FiAnchor },
    { label: 'Sourcing Regions Supported', value: '54+', icon: FiBriefcase },
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
    <div className="flex flex-col gap-16 py-4 animate-fade-in-up">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white shadow-xl shadow-slate-200/70 dark:border-slate-800 dark:bg-slate-950 dark:shadow-black/20">
        <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.05fr_0.95fr] lg:p-10">
          <div className="flex flex-col justify-center gap-6 text-center lg:text-left">
            <span className="mx-auto inline-flex w-fit items-center gap-1.5 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-cyan-700 dark:border-cyan-500/20 dark:bg-cyan-500/10 dark:text-cyan-300 lg:mx-0">
              <FiShield className="h-3.5 w-3.5" /> Verified B2B Import Export Marketplace
            </span>

            <div>
              <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-slate-950 dark:text-white sm:text-4xl lg:text-5xl font-display">
                Source packaging products from global suppliers
              </h1>
              <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-400 sm:text-base lg:mx-0">
                Compare cartons, mailers, rigid boxes, void-fill and export-ready packaging with live MOQ, bulk pricing, RFQ support and shipment visibility in one trade desk.
              </p>
            </div>

            {/* Search + Browse Catalog */}
            <form onSubmit={handleCatalogSearch} className="rounded-2xl border border-slate-200 bg-slate-50 p-2 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
              <div className="flex flex-col gap-2 sm:flex-row">
                <label className="flex min-h-11 flex-1 items-center gap-3 rounded-xl bg-white px-4 text-sm text-slate-500 dark:bg-slate-950 dark:text-slate-400">
                  <FiSearch className="h-4.5 w-4.5 shrink-0 text-slate-400" />
                  <input
                    value={catalogSearch}
                    onChange={(e) => setCatalogSearch(e.target.value)}
                    list="home-catalog-suggestions"
                    placeholder="Search boxes, mailers, bags, wrapping rolls..."
                    className="min-w-0 flex-1 bg-transparent text-sm font-medium text-slate-700 outline-none placeholder:text-slate-500 dark:text-slate-200 dark:placeholder:text-slate-400"
                  />
                  <datalist id="home-catalog-suggestions">
                    {[...new Set(catalogSuggestions)].map((item) => (
                      <option key={item} value={item} />
                    ))}
                  </datalist>
                </label>
                <div className="sm:shrink-0">
                  <Button type="submit" variant="secondary" size="md" icon={FiArrowRight} iconPosition="right" className="w-full sm:w-auto">
                    Browse Catalog
                  </Button>
                </div>
              </div>
            </form>

            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Product SKUs', value: '8,400+' },
                { label: 'Total Orders', value: totalOrders > 0 ? `${totalOrders}` : '1,200+' },
                { label: 'RFQ Reply', value: '24h' },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl border border-slate-200 bg-white p-3 text-center dark:border-slate-800 dark:bg-slate-900">
                  <div className="text-lg font-extrabold text-slate-950 dark:text-white">{item.value}</div>
                  <div className="mt-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400">{item.label}</div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap justify-center gap-3 lg:justify-start">
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
            </div>
          </div>

          {/* Live Sourcing Board with Slideshow */}
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/60">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-extrabold text-slate-950 dark:text-white">Live Sourcing Board</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Packaging products ready for import/export</p>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                <FiCheckCircle className="h-3.5 w-3.5" /> Verified
              </span>
            </div>

            {/* Product Image Slideshow */}
            {slideshowEnabled && slideshowImages.length > 0 ? (
              <div className="relative mb-4">
                <div className="relative aspect-video overflow-hidden rounded-2xl bg-slate-900">
                  <img
                    key={currentSlide}
                    src={currentImage?.url || fallbackImage}
                    alt={currentImage?.caption || 'Product'}
                    onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = fallbackImage; }}
                    className={`w-full h-full object-cover transition-opacity duration-500 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}
                  />
                  {/* Caption overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent flex items-end p-4">
                    <p className="text-sm font-bold text-white">{currentImage?.caption}</p>
                  </div>

                  {/* Navigation arrows */}
                  {slideshowImages.length > 1 && (
                    <>
                      <button
                        onClick={() => goToSlide(currentSlide - 1)}
                        className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors"
                      >
                        <FiChevronLeft className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => goToSlide(currentSlide + 1)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors"
                      >
                        <FiChevronRight className="h-4 w-4" />
                      </button>
                    </>
                  )}
                </div>

                {/* Dot indicators */}
                {slideshowImages.length > 1 && (
                  <div className="flex justify-center gap-1.5 mt-2">
                    {slideshowImages.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => goToSlide(idx)}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          idx === currentSlide
                            ? 'w-4 bg-secondary dark:bg-accent'
                            : 'w-1.5 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400'
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
                    className="group grid grid-cols-[82px_1fr] gap-3 rounded-2xl border border-slate-200 bg-white p-3 transition hover:border-secondary/40 hover:shadow-md dark:border-slate-800 dark:bg-slate-950"
                  >
                    <div className="aspect-square overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800">
                      <img
                        src={product.images?.[0] || product.image}
                        alt={product.name}
                        onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = fallbackImage; }}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="line-clamp-2 text-sm font-bold text-slate-950 group-hover:text-secondary dark:text-white">
                          {product.name}
                        </h3>
                        <span className="whitespace-nowrap text-xs font-extrabold text-secondary dark:text-cyan-300">
                          {typeof product.price === 'number' ? `$${product.price.toFixed(2)}` : product.price}
                        </span>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                        <span className="rounded-lg bg-slate-100 px-2 py-1 dark:bg-slate-900">MOQ {product.moq}</span>
                        <span className="rounded-lg bg-slate-100 px-2 py-1 dark:bg-slate-900">FOB Ready</span>
                        <span className="rounded-lg bg-slate-100 px-2 py-1 dark:bg-slate-900">Bulk Pricing</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <FiTruck className="h-4 w-4 text-cyan-600 dark:text-cyan-300" /> Shipment Lane
                </div>
                <div className="mt-3 text-sm font-extrabold text-slate-950 dark:text-white">Mumbai to Dubai</div>
                <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">Cartons and display boxes, 18 CBM</div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <FiGlobe className="h-4 w-4 text-blue-600 dark:text-blue-300" /> Trade Terms
                </div>
                <div className="mt-3 text-sm font-extrabold text-slate-950 dark:text-white">FOB, CIF, EXW</div>
                <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">Supplier docs and export packaging support</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="flex flex-col gap-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div className="text-center md:text-left">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-955 dark:text-white tracking-tight mb-2 font-display">
              Browse Sourcing Categories
            </h2>
            <p className="text-sm text-slate-550 dark:text-slate-400 max-w-xl">
              Choose a packaging category to filter products instantly in the global catalog.
            </p>
          </div>
          <Link to={isPortal ? "/user/categories" : "/categories"} className="mx-auto md:mx-0">
            <Button variant="outline" size="sm" icon={FiArrowRight} iconPosition="right">
              Explore More Categories
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {(categoriesList || []).map((cat) => {
            return (
              <Link
                key={cat.slug}
                to={`${isPortal ? '/user/products' : '/products'}?category=${cat.slug}`}
                className="group"
              >
                <Card
                  variant="glass"
                  className="flex flex-col p-0 border-slate-200/40 dark:border-slate-800/40 hover:-translate-y-1.5 transition-all duration-300 h-full hover:border-secondary/30 overflow-hidden"
                >
                  <div className="relative aspect-video w-full overflow-hidden bg-slate-100 dark:bg-slate-800 border-b border-brand-border/20">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = fallbackImage;
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-brand-md text-center flex flex-col items-center flex-1 justify-center">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-secondary transition-colors font-display">
                      {cat.name}
                    </h3>
                    {cat.desc && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                        {cat.desc}
                      </p>
                    )}
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>

      </section>

      {/* Top Selling Products */}
      <section className="flex flex-col gap-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div className="text-center md:text-left">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-955 dark:text-white tracking-tight mb-2 font-display">
              Top Selling Packaging Solutions
            </h2>
            <p className="text-sm text-slate-550 dark:text-slate-400 max-w-xl">
              Most popular custom cardboard boxes and mailing supplies preferred by global merchants.
            </p>
          </div>
          <Link to={isPortal ? "/user/products" : "/products"} className="hidden md:inline-block">
            <Button variant="outline" icon={FiArrowRight} iconPosition="right" size="sm">
              View Sourcing Catalog
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {topProducts.map((p) => (
            <Card key={p.id} variant="default" className="flex flex-col justify-between h-full p-brand-md group">
              <div>
                <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 mb-brand-md border border-brand-border/20">
                  <img
                    src={p.images?.[0] || p.image}
                    alt={p.name}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = fallbackImage;
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2 px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-slate-900/80 text-white backdrop-blur-xs uppercase tracking-wider">
                    Top Seller
                  </div>
                </div>

                <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2 group-hover:text-secondary transition-colors font-display mb-1">
                  {p.name}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  MOQ: <span className="font-semibold text-slate-700 dark:text-slate-350">{p.moq}</span>
                </p>
              </div>

              <div className="mt-4">
                <div className="text-sm font-extrabold text-secondary dark:text-accent mb-brand-sm">
                  {typeof p.price === 'number' ? `$${p.price.toFixed(2)}` : p.price}
                </div>

                <Link to={isPortal ? `/user/products/${p.id}` : `/products/${p.id}`}>
                  <Button variant="outline" className="w-full justify-between" size="md" icon={FiArrowRight} iconPosition="right">
                    View Sourcing Details
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>

      </section>

      {/* Stats Counter Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {stats.map((stat, idx) => {
          const StatIcon = stat.icon;
          return (
            <Card key={idx} variant="glass" className="flex items-center gap-5 p-6 border-slate-200/40 dark:border-slate-800/40">
              <div className="rounded-xl p-3 bg-teal-50 dark:bg-teal-950/20 text-teal-600 dark:text-teal-400">
                <StatIcon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white leading-none mb-1">
                  {stat.value}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {stat.label}
                </p>
              </div>
            </Card>
          );
        })}
      </section>

      {/* CTA Box */}
      <section className="rounded-2xl bg-gradient-to-r from-teal-600 to-teal-700 dark:from-teal-800 dark:to-teal-950 p-8 sm:p-12 flex flex-col md:flex-row justify-between items-center gap-6 shadow-lg">
        <div className="text-center md:text-left">
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 font-display">
            Looking for Custom Dimensions or Printing?
          </h3>
          <p className="text-sm text-teal-100 max-w-lg leading-relaxed">
            Attach your package outlines or box blueprints, specify board grades, choose select void-fill styles, and receive a manufacturing quote within 24 business hours.
          </p>
        </div>
        <Link to={isPortal ? "/user/rfq" : "/rfq"}>
          <Button variant="brandGradient" size="lg" className="whitespace-nowrap">
            Launch RFQ Creator
          </Button>
        </Link>
      </section>
    </div>
  );
}
