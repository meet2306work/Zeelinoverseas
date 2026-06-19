import { useState } from 'react';
import { Link, Outlet, useLocation, useSearchParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FiMenu, FiX, FiMessageSquare, FiUser } from 'react-icons/fi';
import Button from '../commonComponents/buttons/Button';
import Breadcrumb from '../commonComponents/breadcrumbs/Breadcrumb';
import PageContainer from '../commonComponents/layouts/PageContainer';
import { logout, selectIsAuthenticated, selectUserRole } from '../redux/slices/authSlice';
import { motion, AnimatePresence } from 'framer-motion';
import WhatsAppFloatingButton from '../commonComponents/buttons/WhatsAppFloatingButton';

export default function PublicLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const role = useSelector(selectUserRole);
  const { categoriesList } = useSelector((state) => state.categories);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Categories', path: '/categories' },
    { label: 'Products', path: '/products' },
    { label: 'Services', path: '/services' },
    { label: 'Submit RFQ', path: '/rfq' },
    { label: 'About', path: '/about' },
  ];
  const selectedCategory = categoriesList.find((cat) => cat.slug === searchParams.get('category'));

  // Derive breadcrumbs based on pathname
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const breadcrumbItems = pathSegments.map((segment, index) => {
    const link = '/' + pathSegments.slice(0, index + 1).join('/');
    let label = segment.charAt(0).toUpperCase() + segment.slice(1).replace('-', ' ');
    if (segment.toLowerCase() === 'rfq') label = 'RFQ';
    if (segment.toLowerCase() === 'crm') label = 'CRM';
    return { label, link };
  });

  if (selectedCategory && location.pathname === '/products') {
    breadcrumbItems.push({ label: selectedCategory.name });
  }

  return (
    <div className="min-h-screen flex flex-col bg-brand-bg dark:bg-slate-950">
      {/* Premium Glass Header */}
      <header className="sticky top-0 z-40 w-full border-b border-brand-border/40 dark:border-slate-800/40 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md">
        <div className="h-16 w-full px-brand-md sm:px-brand-lg lg:px-brand-xl flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl font-extrabold tracking-tight">
              <span className="text-secondary dark:text-blue-400">ZEELIN</span>
              <span className="text-primary dark:text-white font-medium">OVERSEAS</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-brand-md">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-semibold transition-colors
                    ${isActive 
                      ? 'text-secondary dark:text-accent' 
                      : 'text-brand-text-secondary dark:text-slate-400 hover:text-secondary dark:hover:text-accent'
                    }
                  `}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Action Icons */}
          <div className="hidden md:flex items-center gap-brand-md">
            {isAuthenticated && (
              <Link to="/inquiry-cart" className="relative p-2 text-brand-text-secondary hover:text-secondary transition-colors" title="Inquiry Follow-up">
                <FiMessageSquare className="h-5.5 w-5.5" />
              </Link>
            )}
            {isAuthenticated ? (
              <>
                <Link to={role === 'admin' ? '/admin/dashboard' : '/user/home'}>
                  <Button variant="primary" size="sm">
                    {role === 'admin' ? 'Admin CRM' : 'My Portal'}
                  </Button>
                </Link>
                <Button variant="outline" size="sm" onClick={() => dispatch(logout())}>
                  Sign Out
                </Button>
              </>
            ) : (
              <Link to="/auth/login">
                <Button variant="outline" size="sm" icon={FiUser}>
                  Sign In
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-brand-text-secondary dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {isMobileMenuOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 z-30 bg-white dark:bg-slate-900 border-b border-brand-border dark:border-slate-800 p-brand-md flex flex-col gap-brand-md shadow-xl">
          <nav className="flex flex-col gap-brand-sm">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-base font-semibold text-brand-text-primary dark:text-slate-200 hover:text-secondary"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          
          <div className="h-px bg-brand-border dark:bg-slate-800 my-1" />

          <div className="flex flex-col gap-brand-sm">
            {isAuthenticated && (
              <Link to="/inquiry-cart" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full" icon={FiMessageSquare}>
                  Inquiry Follow-up
                </Button>
              </Link>
            )}
            {isAuthenticated ? (
              <>
                <Link to={role === 'admin' ? '/admin/dashboard' : '/user/home'} onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="primary" className="w-full">
                    {role === 'admin' ? 'Admin CRM' : 'My Portal'}
                  </Button>
                </Link>
                <Button variant="outline" className="w-full" onClick={() => { setIsMobileMenuOpen(false); dispatch(logout()); }}>
                  Sign Out
                </Button>
              </>
            ) : (
              <Link to="/auth/login" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="primary" className="w-full">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col py-brand-md">
        {/* Dynamic Breadcrumbs block (hidden on home) */}
        {location.pathname !== '/' && (
          <PageContainer className="py-brand-sm">
            <Breadcrumb items={breadcrumbItems} />
          </PageContainer>
        )}

        <PageContainer className="flex-1 flex flex-col">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="flex-1 flex flex-col"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </PageContainer>
      </main>

      {/* Premium Footer */}
      <footer className="bg-primary text-slate-400 border-t border-slate-800 py-brand-xl">
        <PageContainer className="grid grid-cols-1 md:grid-cols-4 gap-brand-lg mb-brand-xl">
          <div className="flex flex-col gap-brand-sm">
            <span className="text-lg font-bold tracking-tight text-white">
              ZEELIN<span className="text-accent font-medium">OVERSEAS</span>
            </span>
            <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
              Global import-export and customized manufacturing solutions. Supporting enterprises with high-fidelity logistics and custom CRM order processing.
            </p>
          </div>
          <div>
            <h5 className="text-sm font-semibold text-white uppercase tracking-wider mb-brand-sm">Services</h5>
            <ul className="flex flex-col gap-brand-xs text-xs">
              <li><Link to="/services" className="hover:text-accent">Freight Forwarding</Link></li>
              <li><Link to="/services" className="hover:text-accent">Custom Brokerage</Link></li>
              <li><Link to="/services" className="hover:text-accent">Quality Inspections</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="text-sm font-semibold text-white uppercase tracking-wider mb-brand-sm">Support</h5>
            <ul className="flex flex-col gap-brand-xs text-xs">
              <li><Link to="/faq" className="hover:text-accent">FAQs</Link></li>
              <li><Link to="/support" className="hover:text-accent">Submit Ticket</Link></li>
              <li><Link to="/terms" className="hover:text-accent">Terms of Use</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="text-sm font-semibold text-white uppercase tracking-wider mb-brand-sm">Newsletter</h5>
            <div className="flex gap-brand-sm">
              <input
                type="email"
                placeholder="Enter Email"
                className="rounded-lg bg-slate-800 border-none text-xs text-white px-brand-md py-brand-sm outline-none focus:ring-1 focus:ring-accent w-full"
              />
              <Button variant="secondary" size="sm" className="whitespace-nowrap">Join</Button>
            </div>
          </div>
        </PageContainer>
        <div className="border-t border-slate-850 pt-md">
          <PageContainer className="flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-brand-sm">
            <span>&copy; {new Date().getFullYear()} Zeelinoverseas. All rights reserved.</span>
            <div className="flex gap-brand-md">
              <Link to="/privacy" className="hover:underline">Privacy Policy</Link>
              <Link to="/terms" className="hover:underline">Terms & Conditions</Link>
            </div>
          </PageContainer>
        </div>
      </footer>

      <WhatsAppFloatingButton />
    </div>
  );
}
