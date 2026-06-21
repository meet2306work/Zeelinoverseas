import { useEffect, useState } from 'react';
import { Link, Outlet, useLocation, useSearchParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FiMenu, FiX, FiMessageSquare, FiUser } from 'react-icons/fi';
import Button from '../commonComponents/buttons/Button';
import Breadcrumb from '../commonComponents/breadcrumbs/Breadcrumb';
import PageContainer from '../commonComponents/layouts/PageContainer';
import PageTransition from '../commonComponents/layouts/PageTransition';
import { logout, selectIsAuthenticated, selectUserRole } from '../redux/slices/authSlice';
import WhatsAppFloatingButton from '../commonComponents/buttons/WhatsAppFloatingButton';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { motionTransitions } from '../config/motion';

export default function PublicLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const role = useSelector(selectUserRole);
  const { categoriesList } = useSelector((state) => state.categories);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Categories', path: '/categories' },
    { label: 'Products', path: '/products' },
    { label: 'Services', path: '/services' },
    { label: 'Submit RFQ', path: '/rfq' },
    { label: 'About', path: '/about' },
  ];
  const selectedCategory = (categoriesList || []).find((cat) => cat.slug === searchParams.get('category'));

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
    <div className="min-h-screen flex flex-col bg-background-primary text-text-primary">
      {/* Premium Glass Header */}
      <motion.header layout={!shouldReduceMotion} transition={motionTransitions.admin} className={`sticky top-0 z-40 w-full border-b backdrop-blur-xl transition-[background-color,border-color,box-shadow] ${isScrolled ? 'border-accent-gold/20 bg-black-accent/95 shadow-lg shadow-accent-gold/5' : 'border-border-default/40 bg-black-accent/90'}`}>
        <div className={`${isScrolled ? 'h-14' : 'h-16'} w-full px-brand-md sm:px-brand-lg lg:px-brand-xl flex items-center justify-between transition-[height] duration-brand-fast`}>
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl font-extrabold tracking-tight">
              <span className="text-brand-mark font-black tracking-wide">ZEELIN</span>
              <span className="text-text-on-dark font-medium ml-1">OVERSEAS</span>
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
                  className={`text-xs uppercase tracking-widest font-bold transition-colors relative py-1
                    ${isActive 
                      ? 'text-accent-gold' 
                      : 'text-text-on-dark/70 hover:text-accent-gold'
                    }
                  `}
                >
                  {link.label}
                  {isActive && (
                    <motion.span layoutId="activeNavLine" className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent-gold" transition={motionTransitions.interface} />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Action Icons */}
          <div className="hidden md:flex items-center gap-brand-md">
            {isAuthenticated && (
              <Link to="/inquiry-cart" className="relative p-2 text-text-on-dark/70 hover:text-accent-gold transition-colors" title="Inquiry Follow-up">
                <FiMessageSquare className="h-5 w-5" />
              </Link>
            )}
            {isAuthenticated ? (
              <>
                {role === 'user' && (
                  <Link to="/user/home">
                    <Button variant="primary" size="sm">
                      My Portal
                    </Button>
                  </Link>
                )}
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
            className="md:hidden p-2 rounded-lg text-text-on-dark/70 hover:text-accent-gold hover:bg-black-accent/80 transition-colors"
          >
            {isMobileMenuOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
          </button>
        </div>
      </motion.header>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
      {isMobileMenuOpen && (
        <motion.div initial={{ opacity: 0, y: shouldReduceMotion ? 0 : -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -12 }} transition={shouldReduceMotion ? { duration: 0 } : motionTransitions.interface} className="md:hidden fixed inset-x-0 top-16 z-30 bg-black-accent/95 border-b border-border-default/20 p-brand-md flex flex-col gap-brand-md shadow-2xl">
          <nav className="flex flex-col gap-brand-sm">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-sm uppercase tracking-wider font-bold text-text-on-dark/80 hover:text-accent-gold py-1"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          
          <div className="h-px bg-border-default/20 my-1" />

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
                {role === 'user' && (
                  <Link to="/user/home" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="primary" className="w-full">
                      My Portal
                    </Button>
                  </Link>
                )}
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
        </motion.div>
      )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col py-brand-md">
        {/* Dynamic Breadcrumbs block (hidden on home) */}
        {location.pathname !== '/' && (
          <PageContainer className="py-brand-sm">
            <Breadcrumb items={breadcrumbItems} />
          </PageContainer>
        )}

        <PageContainer className="flex-1 flex flex-col">
          <PageTransition routeKey={location.pathname}>
            <Outlet />
          </PageTransition>
        </PageContainer>
      </main>

      {/* Premium Footer */}
      <footer className="bg-black-accent text-text-on-dark/70 border-t border-border-default/20 py-brand-xl">
        <PageContainer className="grid grid-cols-1 md:grid-cols-4 gap-brand-lg mb-brand-xl">
          <div className="flex flex-col gap-brand-sm">
            <span className="text-lg font-bold tracking-tight text-text-on-dark">
              <span className="text-brand-mark font-black">ZEELIN</span><span className="text-text-on-dark font-medium ml-1">OVERSEAS</span>
            </span>
            <p className="text-xs text-text-on-dark/65 max-w-xs leading-relaxed">
              Global import-export and customized manufacturing solutions. Supporting enterprises with high-fidelity logistics and custom CRM order processing.
            </p>
          </div>
          <div>
            <h5 className="text-sm font-semibold text-text-on-dark uppercase tracking-wider mb-brand-sm">Services</h5>
            <ul className="flex flex-col gap-brand-xs text-xs">
              <li><Link to="/services" className="hover:text-accent-gold">Freight Forwarding</Link></li>
              <li><Link to="/services" className="hover:text-accent-gold">Custom Brokerage</Link></li>
              <li><Link to="/services" className="hover:text-accent-gold">Quality Inspections</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="text-sm font-semibold text-text-on-dark uppercase tracking-wider mb-brand-sm">Support</h5>
            <ul className="flex flex-col gap-brand-xs text-xs">
              <li><Link to="/faq" className="hover:text-accent-gold">FAQs</Link></li>
              <li><Link to="/support" className="hover:text-accent-gold">Submit Ticket</Link></li>
              <li><Link to="/terms" className="hover:text-accent-gold">Terms of Use</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="text-sm font-semibold text-text-on-dark uppercase tracking-wider mb-brand-sm">Newsletter</h5>
            <div className="flex gap-brand-sm">
              <input
                type="email"
                placeholder="Enter Email"
                className="rounded-lg bg-background-surface/15 text-text-on-dark placeholder:text-text-on-dark/40 border border-border-default/20 text-xs px-brand-md py-brand-sm outline-none focus:ring-1 focus:ring-accent-gold w-full"
              />
              <Button variant="gold" size="sm" className="whitespace-nowrap">Join</Button>
            </div>
          </div>
        </PageContainer>
        <div className="border-t border-border-default/10 pt-md">
          <PageContainer className="flex flex-col sm:flex-row justify-between items-center text-xs text-text-on-dark/40 gap-brand-sm">
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
