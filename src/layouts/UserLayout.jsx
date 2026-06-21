import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FiHome, FiShoppingBag, FiHeart, FiSettings, FiUser, FiBell, FiLogOut, FiMenu, FiX, FiHelpCircle, FiBox, FiFileText, FiGrid, FiMessageSquare } from 'react-icons/fi';
import Breadcrumb from '../commonComponents/breadcrumbs/Breadcrumb';
import Dropdown from '../commonComponents/dropdowns/Dropdown';
import PageContainer from '../commonComponents/layouts/PageContainer';
import PageTransition from '../commonComponents/layouts/PageTransition';
import { logout, selectIsAuthenticated, selectUserRole, selectCurrentUser } from '../redux/slices/authSlice';
import ConfirmationDialog from '../commonComponents/modals/ConfirmationDialog';
import WhatsAppFloatingButton from '../commonComponents/buttons/WhatsAppFloatingButton';

export default function UserLayout() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const role = useSelector(selectUserRole);
  const currentUser = useSelector(selectCurrentUser);
  const { categoriesList } = useSelector((state) => state.categories);

  const fullName = currentUser ? `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim() || 'User' : 'User';
  const initials = currentUser && currentUser.firstName && currentUser.lastName
    ? `${currentUser.firstName[0]}${currentUser.lastName[0]}`.toUpperCase()
    : (currentUser?.firstName ? currentUser.firstName[0].toUpperCase() : 'U');

  useEffect(() => {
    if (!isAuthenticated || role !== 'user') {
      navigate('/auth/login');
    }
  }, [isAuthenticated, role, navigate]);

  const sidebarLinks = [
    { label: 'Dashboard', path: '/user/home', icon: FiHome },
    { label: 'Products Catalog', path: '/user/products', icon: FiBox },
    { label: 'Categories', path: '/user/categories', icon: FiGrid },
    { label: 'B2B Custom RFQs', path: '/user/rfq', icon: FiFileText },
    { label: 'My Orders', path: '/user/orders', icon: FiShoppingBag },
    { label: 'Wishlist', path: '/user/wishlist', icon: FiHeart },
    { label: 'Support Tickets', path: '/user/support', icon: FiHelpCircle },
    { label: 'Profile Settings', path: '/user/profile', icon: FiUser },
    { label: 'System Settings', path: '/user/settings', icon: FiSettings },
  ];

  // Derive breadcrumbs based on pathname
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const breadcrumbItems = [];
  
  pathSegments.forEach((segment, index) => {
    // Skip 'user' layout prefix and the 'home' segment
    if (segment === 'user' || segment === 'home') return;
    
    let link = '/' + pathSegments.slice(0, index + 1).join('/');
    if (segment === 'order-tracking') {
      link = '/user/orders';
    }
    let label = segment.charAt(0).toUpperCase() + segment.slice(1).replace('-', ' ');
    if (segment.toLowerCase() === 'rfq') label = 'RFQ';
    if (segment.toLowerCase() === 'crm') label = 'CRM';
    
    breadcrumbItems.push({ label, link });
  });

  const selectedCategory = (categoriesList || []).find((cat) => cat.slug === searchParams.get('category'));

  if (selectedCategory && location.pathname === '/user/products') {
    breadcrumbItems.push({ label: selectedCategory.name });
  }

  const handleLogout = () => {
    dispatch(logout());
    navigate('/auth/login');
  };

  const profileItems = [
    { label: 'My Profile', onClick: () => navigate('/user/profile'), icon: FiUser },
    { label: 'Settings', onClick: () => navigate('/user/settings'), icon: FiSettings },
    { label: 'Sign Out', onClick: () => setIsLogoutDialogOpen(true), icon: FiLogOut },
  ];

  return (
    <div className="min-h-screen flex bg-background-primary font-sans text-text-primary">
      {/* Collapsible Left Sidebar (Desktop only) */}
      <aside
        className={`hidden lg:flex flex-col border-r border-border-default/20 bg-black-accent transition-all duration-300 h-screen sticky top-0
          ${isSidebarCollapsed ? 'w-20' : 'w-64'}
        `}
      >
        {/* Logo Block */}
        <div className={`h-16 flex items-center border-b border-border-default/20 ${isSidebarCollapsed ? 'justify-center' : 'justify-between px-brand-md'}`}>
          {!isSidebarCollapsed && (
            <span className="text-lg font-bold tracking-tight text-text-on-dark">
              <span className="text-brand-mark font-black tracking-wide">ZEELIN</span><span className="text-text-on-dark font-medium ml-1">PORTAL</span>
            </span>
          )}
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className={`p-1.5 rounded-lg text-text-on-dark/70 hover:text-accent-gold hover:bg-black-accent/80 transition-colors cursor-pointer ${isSidebarCollapsed ? '' : 'ml-auto'}`}
          >
            <FiMenu className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-brand-sm py-brand-md flex flex-col gap-brand-xs overflow-y-auto scrollbar-thin scrollbar-thumb-accent-gold/20">
          {sidebarLinks.map((link) => {
            const LinkIcon = link.icon;
            const isActive = location.pathname === link.path || 
              (link.path === '/user/orders' && location.pathname.startsWith('/user/order-tracking')) ||
              (link.path === '/user/products' && (location.pathname.startsWith('/user/products/') || location.pathname.startsWith('/user/categories')));
            return (
              <Link
                key={link.path}
                to={link.path}
                title={isSidebarCollapsed ? link.label : undefined}
                className={`flex items-center rounded-xl transition-all duration-200 border border-transparent
                  ${isSidebarCollapsed 
                    ? 'justify-center w-10 h-10 mx-auto' 
                    : 'gap-brand-md px-brand-md py-brand-sm text-sm font-semibold'
                  }
                  ${isActive
                    ? 'bg-accent-gold border-accent-gold/20 text-text-on-accent shadow-md shadow-accent-gold/15'
                    : 'text-text-on-dark/70 hover:bg-background-surface/10 hover:text-text-on-dark'
                  }
                `}
              >
                <LinkIcon className={`h-5 w-5 shrink-0 ${isActive ? 'text-text-on-accent' : 'text-text-on-dark/60'}`} />
                {!isSidebarCollapsed && <span>{link.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer actions */}
        <div className="p-brand-sm border-t border-border-default/20">
          <button
            onClick={() => setIsLogoutDialogOpen(true)}
            title={isSidebarCollapsed ? "Sign Out" : undefined}
            className={`flex items-center rounded-xl transition-colors cursor-pointer
              ${isSidebarCollapsed 
                ? 'justify-center w-10 h-10 mx-auto' 
                : 'gap-brand-md w-full px-brand-md py-brand-sm text-sm font-semibold'
              }
              text-text-on-dark/60 hover:text-brand-danger hover:bg-red-950/10
            `}
          >
            <FiLogOut className="h-5 w-5 shrink-0" />
            {!isSidebarCollapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Drawer Navigation */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div onClick={() => setIsMobileOpen(false)} className="fixed inset-0 bg-slate-955/60 backdrop-blur-xs" />
          
          {/* Menu */}
          <div className="relative w-64 bg-black-accent h-full flex flex-col p-brand-md border-r border-border-default/20 shadow-2xl glass-panel text-text-on-dark">
            <div className="flex items-center justify-between mb-brand-lg border-b border-border-default/10 pb-3">
              <span className="text-lg font-bold">
                <span className="text-brand-mark font-black tracking-wide">ZEELIN</span><span className="text-text-on-dark font-medium ml-1">PORTAL</span>
              </span>
              <button onClick={() => setIsMobileOpen(false)} className="p-1.5 text-text-on-dark/70 hover:text-text-on-dark">
                <FiX className="h-6 w-6" />
              </button>
            </div>
            
            <nav className="flex-1 flex flex-col gap-brand-xs">
              {sidebarLinks.map((link) => {
                const LinkIcon = link.icon;
                const isActive = location.pathname === link.path || 
                  (link.path === '/user/orders' && location.pathname.startsWith('/user/order-tracking')) ||
                  (link.path === '/user/products' && (location.pathname.startsWith('/user/products/') || location.pathname.startsWith('/user/categories')));
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMobileOpen(false)}
                    className={`flex items-center gap-brand-md px-brand-md py-brand-sm text-sm font-semibold rounded-xl border border-transparent
                      ${isActive
                        ? 'bg-accent-gold border-accent-gold/20 text-text-on-accent shadow-md shadow-accent-gold/15'
                        : 'text-text-on-dark/70 hover:bg-background-surface/10'
                      }
                    `}
                  >
                    <LinkIcon className={`h-5 w-5 ${isActive ? 'text-text-on-accent' : 'text-text-on-dark/60'}`} />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>

            <button
              onClick={() => setIsLogoutDialogOpen(true)}
              className="flex items-center gap-brand-md w-full px-brand-md py-brand-sm text-sm font-semibold text-text-on-dark/60 hover:text-brand-danger rounded-xl"
            >
              <FiLogOut className="h-5 w-5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}

      {/* Right Content Workspace */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Right Header */}
        <header className="h-16 border-b border-border-default/20 bg-black-accent/90 backdrop-blur-md sticky top-0 z-30 px-brand-md flex items-center justify-between shadow-lg shadow-black-accent/5">
          <div className="flex items-center gap-brand-sm">
            <button
              onClick={() => setIsMobileOpen(true)}
              className="lg:hidden p-2 rounded-lg text-text-on-dark/75 hover:bg-background-surface/10 hover:text-accent-gold"
            >
              <FiMenu className="h-6 w-6" />
            </button>
            <h2 className="text-sm font-extrabold text-text-on-dark hidden sm:block uppercase tracking-wider font-display">
              Global Trade Desk
            </h2>
          </div>

          <div className="flex items-center gap-brand-md">
            <Link to="/user/inquiry-cart" className="relative p-2 text-text-on-dark/75 hover:text-accent-gold transition-colors" title="Inquiry Follow-up">
              <FiMessageSquare className="h-5.5 w-5.5" />
            </Link>
            <Link to="/user/notifications" className="relative p-2 text-text-on-dark/75 hover:text-accent-gold transition-colors">
              <FiBell className="h-5.5 w-5.5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-brand-danger ring-2 ring-black-accent" />
            </Link>

            {/* Profile Dropdown */}
            <Dropdown
              trigger={
                <div className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-background-surface/10 transition-colors cursor-pointer">
                  {currentUser?.avatar ? (
                    <img
                      src={currentUser.avatar}
                      alt={fullName}
                      className="h-8.5 w-8.5 rounded-full object-cover border border-accent-gold/25 shadow-sm"
                    />
                  ) : (
                    <div className="h-8.5 w-8.5 rounded-full bg-background-surface/10 flex items-center justify-center font-bold text-accent-gold border border-border-default/30">
                      {initials}
                    </div>
                  )}
                  <span className="text-xs font-bold text-text-on-dark hidden md:inline">
                    {fullName}
                  </span>
                </div>
              }
              items={profileItems}
            />
          </div>
        </header>

        {/* Content Viewport */}
        <main className="flex-1 flex flex-col py-brand-lg">
          <PageContainer className="flex-1 flex flex-col">
            {/* Breadcrumbs */}
            {location.pathname !== '/user/home' && (
              <Breadcrumb items={breadcrumbItems} className="mb-brand-md" homeLink="/user/home" />
            )}
            
            <PageTransition routeKey={location.pathname}>
              <Outlet />
            </PageTransition>
          </PageContainer>
        </main>
      </div>

      <ConfirmationDialog
        isOpen={isLogoutDialogOpen}
        onClose={() => setIsLogoutDialogOpen(false)}
        onConfirm={handleLogout}
        title="Sign Out"
        message="Are you sure you want to sign out of your account?"
        confirmLabel="Sign Out"
        cancelLabel="Cancel"
        isDanger={true}
        icon={FiLogOut}
      />

      <WhatsAppFloatingButton />
    </div>
  );
}
