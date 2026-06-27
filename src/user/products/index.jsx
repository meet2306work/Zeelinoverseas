import { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useSearchParams, useLocation } from 'react-router-dom';
import { FiSearch, FiSliders, FiBox, FiArrowRight, FiX } from 'react-icons/fi';
import LoginRedirectModal from '../../commonComponents/modals/LoginRedirectModal';
import Card from '../../commonComponents/cards/Card';
import Input from '../../commonComponents/inputs/Input';
import Dropdown from '../../commonComponents/dropdowns/Dropdown';
import Button from '../../commonComponents/buttons/Button';
import { SkeletonCard } from '../../commonComponents/loaders/Skeleton';
import { Reveal, StaggerGroup, StaggerItem } from '../../commonComponents/animations/ScrollReveal';
import { fetchProducts } from '../../redux/slices/productSlice';
import { fetchCategories } from '../../redux/slices/categorySlice';
import { motion, AnimatePresence } from 'framer-motion';
import useTiltEffect from '../../hooks/useTiltEffect';
import Pagination from '../../commonComponents/pagination/Pagination';

const fallbackImage = 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=400&q=80';

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

const CardImageSlider = ({ images, defaultImage, alt, hasThreeD }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef(null);

  const productImages = images && images.length > 0 
    ? images.map(img => img.url).filter(Boolean) 
    : [defaultImage].filter(Boolean);

  useEffect(() => {
    if (isHovered && productImages.length > 1) {
      timerRef.current = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % productImages.length);
      }, 1500);
    } else {
      setActiveIndex(0);
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isHovered, productImages.length]);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative aspect-video rounded-xl overflow-hidden bg-white dark:bg-slate-950 mb-brand-md border border-border-default/40 w-full flex items-center justify-center p-2"
    >
      <div className="w-full h-full flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.img
            key={activeIndex}
            src={productImages[activeIndex] || fallbackImage}
            alt={alt}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = fallbackImage;
            }}
            className="max-h-full max-w-full object-contain"
          />
        </AnimatePresence>
      </div>

      {/* Dots overlay for multiple images */}
      {productImages.length > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-20 bg-black/30 px-2.5 py-1 rounded-full backdrop-blur-xs">
          {productImages.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === activeIndex
                  ? 'w-3.5 bg-accent-gold'
                  : 'w-1.5 bg-white/60'
              }`}
            />
          ))}
        </div>
      )}

      {/* 3D Model Badge */}
      {hasThreeD && (
        <div className="absolute top-2 left-2 px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-background-surface/85 text-text-primary border border-border-default/30 backdrop-blur-xs uppercase tracking-wider z-10">
          3D Model
        </div>
      )}
    </div>
  );
};

export default function ProductsScreen() {
  const location = useLocation();
  const dispatch = useDispatch();
  const isPortal = location.pathname.startsWith('/user');
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';
  const query = searchParams.get('q') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const minMoq = searchParams.get('minMoq') || '';
  const maxMoq = searchParams.get('maxMoq') || '';
  const minRating = searchParams.get('rating') || '';
  const tradeTerm = searchParams.get('tradeTerm') || '';
  const region = searchParams.get('region') || '';
  const stockStatus = searchParams.get('stock') || '';
  const sortBy = searchParams.get('sort') || 'relevance';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = 9;

  const { categoriesList } = useSelector((state) => state.categories);
  const { products, pagination, loading } = useSelector((state) => state.products);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const selectedCategory = (categoriesList || []).find((cat) => cat.slug === category);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    const params = new URLSearchParams();
    params.set('page', page.toString());
    params.set('limit', limit.toString());

    if (search.trim()) {
      params.set('search', search.trim());
    }
    if (category) {
      params.set('category', category);
    }
    if (minPrice) {
      params.set('minPrice', minPrice);
    }
    if (maxPrice) {
      params.set('maxPrice', maxPrice);
    }
    if (minRating) {
      params.set('rating', minRating);
    }
    if (sortBy && sortBy !== 'relevance') {
      params.set('sort', sortBy);
    }

    dispatch(fetchProducts(`?${params.toString()}`));
  }, [dispatch, page, search, category, minPrice, maxPrice, minRating, sortBy]);

  const handleCategoryChange = (e) => {
    const newVal = e.target.value;
    const nextParams = new URLSearchParams(searchParams);
    if (newVal) {
      nextParams.set('category', newVal);
    } else {
      nextParams.delete('category');
    }
    nextParams.set('page', '1');
    setSearchParams(nextParams);
  };

  const handleSearchChange = (e) => {
    const nextValue = e.target.value;
    const nextParams = new URLSearchParams(searchParams);
    if (nextValue.trim()) {
      nextParams.set('q', nextValue);
    } else {
      nextParams.delete('q');
    }
    nextParams.set('page', '1');
    setSearchParams(nextParams);
  };

  const setFilterParam = (key, value) => {
    const nextParams = new URLSearchParams(searchParams);
    if (value) {
      nextParams.set(key, value);
    } else {
      nextParams.delete(key);
    }
    nextParams.set('page', '1');
    setSearchParams(nextParams);
  };

  const resetFilters = () => {
    setSearchParams({ page: '1' });
  };

  const categoryOptions = [
    { label: 'All Categories', value: '' },
    ...(categoriesList || []).map(c => ({ label: c.name, value: c.slug }))
  ];
  const catalogSuggestions = [
    ...(products || []).flatMap((product) => [
      product.name || product.title,
      product.category?.name || product.category,
      product.material,
      product.tradeTerm,
      product.region,
      // OLD (commented out - do not delete)
      // product.stock === 'ready' ? 'Ready stock' : product.stock === 'custom' ? 'Custom order' : 'Limited stock',
      // NEW
      product.stock === 'ready' ? 'In Stock' : product.stock === 'custom' ? 'Pre-Order/Custom' : 'Limited Stock',
    ]),
    ...(categoriesList || []).flatMap((cat) => [cat.name, cat.slug, cat.desc]),
  ].filter(Boolean);
  const ratingOptions = [
    { label: 'Any Rating', value: '' },
    { label: '4.8 and above', value: '4.8' },
    { label: '4.7 and above', value: '4.7' },
    { label: '4.5 and above', value: '4.5' },
  ];
  // OLD (commented out - do not delete)
  // const tradeTermOptions = [
  //   { label: 'All Trade Terms', value: '' },
  //   { label: 'FOB', value: 'FOB' },
  //   { label: 'CIF', value: 'CIF' },
  //   { label: 'EXW', value: 'EXW' },
  // ];
  // NEW
  const tradeTermOptions = [
    { label: 'All Shipping Options', value: '' },
    { label: 'Standard Courier Delivery', value: 'FOB' },
    { label: 'Express Courier Delivery', value: 'CIF' },
    { label: 'Warehouse Self-Pickup', value: 'EXW' },
  ];
  // OLD (commented out - do not delete)
  // const regionOptions = [
  //   { label: 'All Supplier Regions', value: '' },
  //   ...Array.from(new Set((products || []).map((p) => p.region).filter(Boolean))).map((value) => ({ label: value, value })),
  // ];
  // NEW
  const regionOptions = [
    { label: 'All Shipping Locations', value: '' },
    ...Array.from(new Set((products || []).map((p) => p.region).filter(Boolean))).map((value) => ({ label: value, value })),
  ];
  // OLD (commented out - do not delete)
  // const stockOptions = [
  //   { label: 'All Stock Status', value: '' },
  //   { label: 'Ready Stock', value: 'ready' },
  //   { label: 'Custom Order', value: 'custom' },
  //   { label: 'Limited Stock', value: 'limited' },
  // ];
  // NEW
  const stockOptions = [
    { label: 'All Stock Status', value: '' },
    { label: 'In Stock', value: 'ready' },
    { label: 'Custom/Pre-Order', value: 'custom' },
    { label: 'Limited Stock', value: 'limited' },
  ];
  const sortOptions = [
    { label: 'Sort by Relevance', value: 'relevance' },
    { label: 'Price: Low to High', value: 'price-asc' },
    { label: 'Price: High to Low', value: 'price-desc' },
    { label: 'MOQ: Low to High', value: 'moq-asc' },
    { label: 'Rating: High to Low', value: 'rating-desc' },
  ];

  const normalizedSearch = search.trim().toLowerCase();
  const matchingCategories = normalizedSearch
    ? (categoriesList || []).filter((cat) =>
        [cat.name, cat.slug, cat.desc]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(normalizedSearch))
      )
    : [];
  const matchingCategorySlugs = matchingCategories.map((cat) => cat.slug);

  const filteredProducts = products || [];

  const hasSearch = Boolean(normalizedSearch);
  const hasActiveFilters = Boolean(query || category || minPrice || maxPrice || minMoq || maxMoq || minRating || tradeTerm || region || stockStatus || sortBy !== 'relevance');

  const fallbackImage = 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=400&q=80';

  return (
    <div className="flex flex-col gap-brand-md py-brand-sm">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-brand-md border-b border-border-default/40 pb-md">
        {/* OLD (commented out - do not delete)
        <div>
          <h1 className="text-2xl font-extrabold text-text-primary tracking-tight mb-1">
            {selectedCategory ? selectedCategory.name : 'Global Trade Catalog'}
          </h1>
          <p className="text-xs text-text-secondary">
            {selectedCategory
              ? `Browse ${selectedCategory.name.toLowerCase()} with live MOQ, export-ready pricing, and supplier details.`
              : 'Source premium packaging products with certified suppliers, MOQ filters, and RFQ support.'}
          </p>
        </div>
        
        <Link to={isPortal ? "/user/rfq" : "/rfq"}>
          <Button variant="gold" size="md">
            Request Custom Quotation
          </Button>
        </Link>
        */}
        {/* NEW */}
        <div>
          <h1 className="text-2xl font-extrabold text-text-primary tracking-tight mb-1">
            {selectedCategory ? selectedCategory.name : 'Packaging Catalog'}
          </h1>
          <p className="text-xs text-text-secondary">
            {selectedCategory
              ? `Browse ${selectedCategory.name.toLowerCase()} with clear wholesale quantities, direct shop pricing, and warehouse details.`
              : 'Shop premium packaging products with wholesale pricing, MOQ filters, and custom print support.'}
          </p>
        </div>
        
        <Link 
          to={isPortal ? "/user/rfq" : "/rfq"}
          onClick={(e) => {
            if (!isPortal && !isAuthenticated) {
              e.preventDefault();
              setIsLoginModalOpen(true);
            }
          }}
        >
          <Button variant="gold" size="md">
            Get Custom Print Quote
          </Button>
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row gap-brand-lg">
        {/* Filters Sidebar */}
        <aside className="w-full lg:w-64 shrink-0 flex flex-col gap-brand-md">
          <Card variant="glass" hover={false} className="p-brand-md flex flex-col gap-brand-md border-border-default/40">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider flex items-center gap-brand-sm">
                <FiSliders className="h-4.5 w-4.5 text-text-secondary" /> Filters
              </h3>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="inline-flex items-center gap-1 text-xs font-bold text-accent-gold hover:text-accent-gold-hover"
                >
                  <FiX className="h-3.5 w-3.5" /> Clear
                </button>
              )}
            </div>

            <Input
              placeholder="Search catalog..."
              value={search}
              onChange={handleSearchChange}
              icon={FiSearch}
              suggestions={catalogSuggestions}
            />

            <Dropdown
              label="Select Category"
              value={category}
              onChange={handleCategoryChange}
              options={categoryOptions}
              placeholder="All Categories"
              searchable={false}
            />

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Min Price"
                type="number"
                placeholder="$0"
                value={minPrice}
                onChange={(e) => setFilterParam('minPrice', e.target.value)}
                min="0"
              />
              <Input
                label="Max Price"
                type="number"
                placeholder="$50"
                value={maxPrice}
                onChange={(e) => setFilterParam('maxPrice', e.target.value)}
                min="0"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Min MOQ"
                type="number"
                placeholder="0"
                value={minMoq}
                onChange={(e) => setFilterParam('minMoq', e.target.value)}
                min="0"
              />
              <Input
                label="Max MOQ"
                type="number"
                placeholder="1000"
                value={maxMoq}
                onChange={(e) => setFilterParam('maxMoq', e.target.value)}
                min="0"
              />
            </div>

            <Dropdown
              label="Minimum Rating"
              value={minRating}
              onChange={(e) => setFilterParam('rating', e.target.value)}
              options={ratingOptions}
              searchable={false}
            />

            <Dropdown
              label="Trade Term"
              value={tradeTerm}
              onChange={(e) => setFilterParam('tradeTerm', e.target.value)}
              options={tradeTermOptions}
              searchable={false}
            />

            {/* OLD (commented out - do not delete)
            <Dropdown
              label="Supplier Region"
              value={region}
              onChange={(e) => setFilterParam('region', e.target.value)}
              options={regionOptions}
              searchable={false}
            />
            */}
            {/* NEW */}
            <Dropdown
              label="Shipping Location"
              value={region}
              onChange={(e) => setFilterParam('region', e.target.value)}
              options={regionOptions}
              searchable={false}
            />

            <Dropdown
              label="Stock Status"
              value={stockStatus}
              onChange={(e) => setFilterParam('stock', e.target.value)}
              options={stockOptions}
              searchable={false}
            />

            <Dropdown
              label="Sort Results"
              value={sortBy}
              onChange={(e) => setFilterParam('sort', e.target.value === 'relevance' ? '' : e.target.value)}
              options={sortOptions}
              searchable={false}
            />
          </Card>
        </aside>

        {/* Product Grid */}
        <div className="flex-1 flex flex-col gap-brand-md">
          {hasSearch && (
            <div className="rounded-2xl border border-border-default/50 bg-background-surface p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-sm font-extrabold text-text-primary">
                    Search results for "{search.trim()}"
                  </h2>
                  <p className="mt-1 text-xs text-text-secondary">
                    Found {filteredProducts.length} product{filteredProducts.length === 1 ? '' : 's'}
                    {matchingCategories.length > 0 ? ` across ${matchingCategories.length} matching categor${matchingCategories.length === 1 ? 'y' : 'ies'}.` : '.'}
                  </p>
                </div>
                {matchingCategories.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {matchingCategories.map((cat) => (
                      <Link
                        key={cat.slug}
                        to={`${isPortal ? '/user/products' : '/products'}?category=${cat.slug}`}
                        className="rounded-full border border-border-default/50 bg-background-surface px-3 py-1 text-xs font-bold text-accent-gold transition hover:bg-accent-gold/10"
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-brand-md" aria-label="Loading products">
              {Array.from({ length: 6 }, (_, index) => <SkeletonCard key={index} />)}
            </div>
          ) : filteredProducts.length === 0 ? (
            <>
              {/* OLD (commented out - do not delete)
              <Reveal className="text-center py-20 border border-dashed border-border-default rounded-2xl bg-background-surface">
                <FiBox className="h-10 w-10 text-text-secondary mx-auto mb-3" />
                <h3 className="text-base font-bold text-text-primary mb-1">
                  Not available in products or categories
                </h3>
                <p className="text-xs text-text-secondary">
                  Try another keyword, browse all categories, or request a custom quotation.
                </p>
              </Reveal>
              */}
              {/* NEW */}
              <Reveal className="text-center py-20 border border-dashed border-border-default rounded-2xl bg-background-surface">
                <FiBox className="h-10 w-10 text-text-secondary mx-auto mb-3" />
                <h3 className="text-base font-bold text-text-primary mb-1">
                  No products or categories found
                </h3>
                <p className="text-xs text-text-secondary">
                  Try another keyword, browse all categories, or request a custom print quote.
                </p>
              </Reveal>
            </>
          ) : (
            <>
              <StaggerGroup key={searchParams.toString()} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-brand-md">
                {filteredProducts.map((p) => (
                  <StaggerItem key={p._id || p.id} className="h-full"><TiltCard variant="default" className="flex flex-col h-full p-brand-md border border-border-default/50 hover:border-accent-gold/45 group">
                    <CardImageSlider
                      images={p.images}
                      defaultImage={p.image}
                      alt={p.title || p.name}
                      hasThreeD={!!p.threeDModel?.url}
                    />

                      <div className="flex-1 flex flex-col justify-between gap-brand-sm">
                      <div>
                        <h4 className="text-sm font-bold text-text-primary line-clamp-2 group-hover:text-accent-gold transition-colors font-display">
                          {p.title || p.name}
                        </h4>
                        <p className="text-xs text-text-secondary mt-1">
                          Category: <span className="font-semibold text-text-primary">{p.category?.name || 'Uncategorized'}</span>
                        </p>
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {/* OLD (commented out - do not delete)
                          <span className="rounded-md bg-background-primary/80 border border-border-default/45 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-text-secondary">
                              {p.stock > 0 ? 'Ready Stock' : 'Out of Stock'}
                          </span>
                          */}
                          {/* NEW */}
                          <span className={`rounded-md border px-2 py-1 text-[10px] font-bold uppercase tracking-wide ${
                             (p.stock === 0 || p.availabilityStatus === 'Out Of Stock')
                               ? 'bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-455'
                               : p.availabilityStatus === 'Pre-Order'
                               ? 'bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400'
                               : p.availabilityStatus === 'Archived'
                               ? 'bg-slate-500/10 border-slate-500/20 text-slate-600 dark:text-slate-400'
                               : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                           }`}>
                               {(p.stock === 0 || p.availabilityStatus === 'Out Of Stock')
                                 ? 'Out of Stock'
                                 : p.availabilityStatus === 'Pre-Order'
                                 ? 'Pre-Order'
                                 : p.availabilityStatus === 'Archived'
                                 ? 'Archived'
                                 : 'In Stock'}
                           </span>
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between gap-3 text-sm font-extrabold text-accent-gold mb-brand-sm">
                          <span>${p.price?.toFixed(2)} / 25 units</span>
                          <span className="text-xs text-accent-gold-hover">{(p.averageRating || p.rating || 0).toFixed(1)} ★</span>
                        </div>

                        {/* OLD (commented out - do not delete)
                        <Link to={isPortal ? `/user/products/${p._id || p.id}` : `/products/${p._id || p.id}`}>
                          <Button variant="outline" className="w-full justify-between" size="md" icon={FiArrowRight} iconPosition="right">
                            View details
                          </Button>
                        </Link>
                        */}
                        {/* NEW */}
                        <Link to={isPortal ? `/user/products/${p._id || p.id}` : `/products/${p._id || p.id}`}>
                          <Button variant="outline" className="w-full justify-between" size="md" icon={FiArrowRight} iconPosition="right">
                            Shop Product
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </TiltCard></StaggerItem>
                ))}
              </StaggerGroup>
              <Pagination
                currentPage={pagination?.page || 1}
                totalPages={pagination?.pages || 1}
                onPageChange={(p) => {
                  const nextParams = new URLSearchParams(searchParams);
                  nextParams.set('page', p.toString());
                  setSearchParams(nextParams);
                }}
                className="mt-6"
              />
            </>
          )}
        </div>
      </div>
      <LoginRedirectModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        actionName="request a custom print quote"
      />
    </div>
  );
}
