import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FiBox, FiArrowRight, FiGrid } from 'react-icons/fi';
import Card from '../../commonComponents/cards/Card';
import { SkeletonCard } from '../../commonComponents/loaders/Skeleton';
import { Reveal } from '../../commonComponents/animations/ScrollReveal';
import EmptyState from '../../commonComponents/layouts/EmptyState';
import ErrorState from '../../commonComponents/layouts/ErrorState';
import { fetchPaginatedCategories } from '../../redux/slices/categorySlice';
import Pagination from '../../commonComponents/pagination/Pagination';

export default function CategoriesScreen() {
  const location = useLocation();
  const dispatch = useDispatch();
  const isPortal = location.pathname.startsWith('/user');
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = 6;

  const { categories, pagination, loading, error } = useSelector((state) => state.categories);

  useEffect(() => {
    dispatch(fetchPaginatedCategories(`?page=${page}&limit=${limit}`));
  }, [dispatch, page]);

  return (
    <div className="flex flex-col gap-12 py-4">
      {/* Header block */}
      <section className="text-center md:text-left border-b border-border-default/40 pb-6">
        <span className="text-label-sm text-accent-gold tracking-widest font-bold">
          Global Trade Verticals
        </span>
        <h1 className="text-display-md font-extrabold text-text-primary tracking-tight mt-1 mb-2">
          Product Categories
        </h1>
        <p className="text-body-md text-text-secondary max-w-2xl">
          Source directly from verified global trade lanes. Filter our active catalog by industrial category to audit specifications and models.
        </p>
      </section>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {loading && categories.length === 0 ? (
          Array.from({ length: 6 }, (_, index) => <SkeletonCard key={index} />)
        ) : error && categories.length === 0 ? (
          <ErrorState
            title="Categories Could Not Load"
            description={error}
            onRetry={() => dispatch(fetchPaginatedCategories(`?page=${page}&limit=${limit}`))}
            className="col-span-full"
          />
        ) : categories.length === 0 ? (
          <EmptyState
            title="No Categories Available"
            description="Active product categories will appear here after they are added."
            className="col-span-full"
          />
        ) : categories.map((cat) => {
          const Icon = FiBox; // Placeholder icon since icon names aren't in DB usually
          const fallbackImage = 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=400&q=80';
          return (
            <Card
              key={cat._id || cat.id}
              variant="glass" 
              className="h-full p-5 flex flex-col justify-between hover:-translate-y-1.5 transition-all duration-300 border-border-default/50 group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-accent-gold/5 to-accent-gold/5 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-500" />
              
              <div className="flex flex-col gap-5 relative z-10">
                {/* Category Image Header */}
                <div className="relative h-44 w-full rounded-2xl overflow-hidden bg-white dark:bg-slate-950 border border-border-default/30 flex items-center justify-center p-4">
                  <img
                    src={cat.image || fallbackImage}
                    alt={cat.name}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = fallbackImage;
                    }}
                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 h-10 w-10 rounded-xl bg-black-accent/80 backdrop-blur-xs text-accent-gold flex items-center justify-center border border-accent-gold/15">
                    <Icon className="h-5 w-5" />
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-accent-gold uppercase tracking-wider mb-1 block">
                    {cat.count ?? 0} {cat.count === 1 ? 'Product' : 'Products'}
                  </span>
                  <h3 className="text-lg font-bold text-text-primary mb-2 group-hover:text-accent-gold transition-colors font-display">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-text-secondary leading-relaxed line-clamp-3">
                    {cat.description || cat.desc}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-border-default/30 flex justify-end relative z-10">
                <Link 
                  to={isPortal ? `/user/products?category=${cat.slug}` : `/products?category=${cat.slug}`} 
                  className="flex items-center gap-1.5 text-xs font-bold text-accent-gold hover:gap-2.5 transition-all"
                  id={`btn-browse-cat-${cat._id || cat.id}`}
                >
                  <span>Browse Category</span>
                  <FiArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </Card>
          );
        })}
      </div>

      <Pagination
        currentPage={pagination?.page || 1}
        totalPages={pagination?.pages || 1}
        onPageChange={(p) => {
          const nextParams = new URLSearchParams(searchParams);
          nextParams.set('page', p.toString());
          setSearchParams(nextParams);
        }}
      />

      {/* Catalog Overview Banner */}
      <Reveal className="bg-black-accent rounded-3xl p-8 border border-border-default/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent-gold/10 rounded-full blur-3xl pointer-events-none translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-gold/10 rounded-full blur-3xl pointer-events-none -translate-x-1/3 translate-y-1/3" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            {/* OLD (commented out - do not delete)
            <h2 className="text-xl font-bold text-text-on-dark tracking-tight mb-2">
              Browse the Entire Global Trade Catalog
            </h2>
            <p className="text-xs text-text-on-dark/70 max-w-md leading-relaxed">
              Explore our full range of manufactured components, steel spares, heavy machines, and raw cotton commodities in one place.
            </p>
            */}
            {/* NEW */}
            <h2 className="text-xl font-bold text-text-on-dark tracking-tight mb-2">
              Browse the Entire Packaging Catalog
            </h2>
            <p className="text-xs text-text-on-dark/70 max-w-md leading-relaxed">
              Explore our full range of custom corrugated boxes, bubble wraps, mailers, and eco-friendly packing supplies in one place.
            </p>
          </div>
          
          <Link 
            to={isPortal ? "/user/products" : "/products"} 
            className="flex items-center gap-2 px-5 py-3 bg-background-primary text-text-primary font-bold text-xs rounded-xl hover:bg-background-surface transition-all shadow-lg whitespace-nowrap"
            id="btn-all-categories-cta"
          >
            <FiGrid className="h-4 w-4" />
            <span>View All Products</span>
          </Link>
        </div>
      </Reveal>
    </div>
  );
}
