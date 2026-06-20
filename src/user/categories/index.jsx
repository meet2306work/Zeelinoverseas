import { Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FiCpu, FiBox, FiFeather, FiArrowRight, FiGrid } from 'react-icons/fi';
import Card from '../../commonComponents/cards/Card';
import { fetchCategories } from '../../redux/slices/categorySlice';

export default function CategoriesScreen() {
  const location = useLocation();
  const dispatch = useDispatch();
  const isPortal = location.pathname.startsWith('/user');
  const { categoriesList, loading } = useSelector((state) => state.categories);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  return (
    <div className="flex flex-col gap-12 py-4 animate-fade-in-up">
      {/* Header block */}
      <section className="text-center md:text-left border-b border-brand-border/40 dark:border-slate-800/40 pb-6">
        <span className="text-label-sm text-secondary dark:text-accent tracking-widest font-bold">
          Global Trade Verticals
        </span>
        <h1 className="text-display-md font-extrabold text-slate-900 dark:text-white tracking-tight mt-1 mb-2">
          Product Categories
        </h1>
        <p className="text-body-md text-slate-500 dark:text-slate-400 max-w-2xl">
          Source directly from verified global trade lanes. Filter our active catalog by industrial category to audit specifications and models.
        </p>
      </section>

      {/* Categories Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {loading ? (
          <div className="col-span-full text-center py-10 text-slate-500">Loading categories...</div>
        ) : categoriesList.map((cat) => {
          const Icon = FiBox; // Placeholder icon since icon names aren't in DB usually
          return (
            <Card 
              key={cat._id || cat.id} 
              variant="glass" 
              className="p-8 flex flex-col justify-between hover:-translate-y-1.5 transition-all duration-300 border-slate-200/40 dark:border-slate-800/40 group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-secondary/5 to-accent/5 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-500" />
              
              <div className="flex flex-col gap-6 relative z-10">
                <div className="h-12 w-12 rounded-2xl bg-secondary/10 dark:bg-accent/10 text-secondary dark:text-accent flex items-center justify-center transition-colors duration-300">
                  <Icon className="h-6 w-6" />
                </div>
                
                <div>
                  <span className="text-[10px] font-bold text-secondary dark:text-accent uppercase tracking-wider mb-1 block">
                    {cat.count || '0 Products'}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-secondary dark:group-hover:text-accent transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {cat.description || cat.desc}
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800/60 flex justify-end relative z-10">
                <Link 
                  to={isPortal ? `/user/products?category=${cat.slug}` : `/products?category=${cat.slug}`} 
                  className="flex items-center gap-1.5 text-xs font-bold text-secondary dark:text-accent hover:gap-2.5 transition-all"
                  id={`btn-browse-cat-${cat._id || cat.id}`}
                >
                  <span>Browse Category</span>
                  <FiArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </Card>
          );
        })}
      </section>

      {/* Catalog Overview Banner */}
      <section className="bg-slate-900 dark:bg-slate-900/60 rounded-3xl p-8 border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/15 rounded-full blur-3xl pointer-events-none translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/15 rounded-full blur-3xl pointer-events-none -translate-x-1/3 translate-y-1/3" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h2 className="text-xl font-bold text-white tracking-tight mb-2">
              Browse the Entire Global Trade Catalog
            </h2>
            <p className="text-xs text-slate-400 max-w-md leading-relaxed">
              Explore our full range of manufactured components, steel spares, heavy machines, and raw cotton commodities in one place.
            </p>
          </div>
          
          <Link 
            to={isPortal ? "/user/products" : "/products"} 
            className="flex items-center gap-2 px-5 py-3 bg-white text-slate-950 font-bold text-xs rounded-xl hover:bg-slate-100 transition-all shadow-lg shadow-white/5 whitespace-nowrap"
            id="btn-all-categories-cta"
          >
            <FiGrid className="h-4 w-4" />
            <span>View All Products</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
