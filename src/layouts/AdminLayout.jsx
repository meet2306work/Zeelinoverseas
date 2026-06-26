import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  FiGrid, FiLayers, FiBox, FiMessageSquare, FiFileText, FiTrendingUp,
  FiShoppingCart, FiDollarSign, FiArchive, FiBell, FiLogOut,
  FiMenu, FiX, FiSettings, FiBriefcase, FiLock, FiTerminal
} from 'react-icons/fi';
import Breadcrumb from '../commonComponents/breadcrumbs/Breadcrumb';
import Dropdown from '../commonComponents/dropdowns/Dropdown';
import PageContainer from '../commonComponents/layouts/PageContainer';
import PageTransition from '../commonComponents/layouts/PageTransition';
import { logout, selectIsAuthenticated, selectUserRole, selectCurrentUser } from '../redux/slices/authSlice';
import ConfirmationDialog from '../commonComponents/modals/ConfirmationDialog';

export default function AdminLayout() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const role = useSelector(selectUserRole);
  const loading = useSelector((state) => state.auth.loading);
  const currentUser = useSelector(selectCurrentUser);

  const fullName = currentUser ? `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim() || 'Admin User' : 'Admin User';
  const initials = currentUser && currentUser.firstName && currentUser.lastName
    ? `${currentUser.firstName[0]}${currentUser.lastName[0]}`.toUpperCase()
    : (currentUser?.firstName ? currentUser.firstName[0].toUpperCase() : 'AD');

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (loading || (token && !role)) {
      return;
    }
    if (!isAuthenticated || role !== 'admin') {
      navigate('/auth/login');
    }
  }, [isAuthenticated, role, loading, navigate]);

  const sidebarLinks = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: FiGrid },
    { label: 'Products', path: '/admin/products', icon: FiBox },
    { label: 'Categories', path: '/admin/categories', icon: FiLayers },
    { label: 'CRM Leads', path: '/admin/leads', icon: FiTrendingUp },
    { label: 'RFQs Requests', path: '/admin/rfq', icon: FiFileText },
    { label: 'Product Inquiries', path: '/admin/inquiries', icon: FiMessageSquare },
    { label: 'Support Tickets', path: '/admin/tickets', icon: FiMessageSquare },
    { label: 'Client Orders', path: '/admin/orders', icon: FiShoppingCart },
    { label: 'Payments Receipts', path: '/admin/payments', icon: FiDollarSign },
    { label: 'Inventory Log', path: '/admin/inventory', icon: FiArchive },
    { label: 'Audit System Logs', path: '/admin/audit-logs', icon: FiTerminal },
    { label: 'Roles & Permissions', path: '/admin/roles', icon: FiLock },
    { label: 'Design System', path: '/admin/design-system', icon: FiLayers },
    { label: 'System Settings', path: '/admin/settings', icon: FiSettings },
  ];

  const { productDetails } = useSelector((state) => state.products || {});

  // Derive breadcrumbs based on pathname
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const breadcrumbItems = [];
  
  pathSegments.forEach((segment, index) => {
    // Skip 'admin' layout prefix and the 'dashboard' segment
    if (segment === 'admin' || segment === 'dashboard') return;
    
    const link = '/' + pathSegments.slice(0, index + 1).join('/');
    let label = segment.charAt(0).toUpperCase() + segment.slice(1).replace('-', ' ');
    
    // Check if the segment is a 24-character hexadecimal string (ObjectId)
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(segment);
    if (isObjectId && productDetails && productDetails._id === segment) {
      // NEW: display product name (title) or fallback to SKU/original label
      label = productDetails.title || productDetails.sku || label;
    }

    if (segment.toLowerCase() === 'rfq') label = 'RFQ';
    if (segment.toLowerCase() === 'crm') label = 'CRM';
    
    breadcrumbItems.push({ label, link });
  });

  const handleLogout = () => {
    dispatch(logout());
    navigate('/auth/login');
  };

  const profileItems = [
    { label: 'Public Website', onClick: () => navigate('/'), icon: FiBriefcase },
    { label: 'Sign Out', onClick: () => setIsLogoutDialogOpen(true), icon: FiLogOut },
  ];

  return (
    <div className="min-h-screen flex bg-background-primary text-text-primary font-sans transition-colors duration-300">
      {/* Collapsible Left Sidebar (Desktop) */}
      <aside
        className={`hidden lg:flex flex-col border-r border-border-default/20 bg-black-accent transition-all duration-300 h-screen sticky top-0
          ${isSidebarCollapsed ? 'w-20' : 'w-64'}
        `}
      >
        {/* Logo Section */}
        <div className={`h-16 flex items-center border-b border-border-default/20 ${isSidebarCollapsed ? 'justify-center' : 'justify-between px-brand-md'}`}>
          {!isSidebarCollapsed && (
            <span className="text-sm font-black tracking-widest text-text-on-dark flex items-center gap-1.5 uppercase select-none font-display">
              <span className="text-brand-mark">Zeelin</span>
              <span className="text-text-secondary">CRM</span>
            </span>
          )}
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className={`p-1.5 rounded-lg text-text-on-dark/70 hover:text-accent-gold hover:bg-black-accent/80 transition-colors cursor-pointer ${isSidebarCollapsed ? '' : 'ml-auto'}`}
          >
            <FiMenu className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation items */}
        <nav className="flex-1 overflow-y-auto px-brand-sm py-brand-md flex flex-col gap-brand-xs scrollbar-thin scrollbar-thumb-accent-gold/20 scrollbar-track-transparent">
          {sidebarLinks.map((link) => {
            const LinkIcon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                title={isSidebarCollapsed ? link.label : undefined}
                className={`flex items-center rounded-xl transition-all duration-200 relative border border-transparent
                  ${isSidebarCollapsed 
                    ? 'justify-center w-10 h-10 mx-auto' 
                    : 'gap-brand-md px-brand-md py-brand-sm text-xs font-semibold'
                  }
                  ${isActive
                    ? 'bg-accent-gold border-accent-gold/20 text-text-on-accent font-bold shadow-sm shadow-accent-gold/15'
                    : 'text-text-on-dark/70 hover:bg-background-surface/10 hover:text-text-on-dark hover:translate-x-0.5'
                  }
                `}
              >
                {isActive && !isSidebarCollapsed && (
                  <span className="absolute left-0 top-3 bottom-3 w-0.75 rounded-r bg-text-on-accent" />
                )}
                <LinkIcon className={`h-4.5 w-4.5 shrink-0 ${isActive ? 'text-text-on-accent' : 'text-text-on-dark/60'}`} />
                {!isSidebarCollapsed && <span>{link.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-brand-sm border-t border-border-default/20">
          <button
            onClick={() => setIsLogoutDialogOpen(true)}
            title={isSidebarCollapsed ? "Log Out" : undefined}
            className={`flex items-center rounded-xl transition-colors border border-transparent cursor-pointer
              ${isSidebarCollapsed 
                ? 'justify-center w-10 h-10 mx-auto' 
                : 'gap-brand-md w-full px-brand-md py-brand-sm text-xs font-semibold'
              }
              text-text-on-dark/60 hover:text-brand-danger hover:bg-red-950/10
            `}
          >
            <FiLogOut className="h-4.5 w-4.5 shrink-0" />
            {!isSidebarCollapsed && <span>Log Out</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Drawer Navigation */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div onClick={() => setIsMobileOpen(false)} className="fixed inset-0 bg-slate-955/65 backdrop-blur-xs transition-opacity duration-300" />
          
          {/* Menu */}
          <div className="relative w-64 bg-black-accent h-full flex flex-col p-brand-md border-r border-border-default/20 shadow-2xl glass-panel text-text-on-dark animate-fade-in-up">
            <div className="flex items-center justify-between mb-brand-lg border-b border-border-default/10 pb-3">
              <span className="text-sm font-black tracking-widest text-text-on-dark flex items-center gap-1.5 uppercase select-none font-display">
                <span className="text-brand-mark">Zeelin</span>
                <span className="text-text-secondary">CRM</span>
              </span>
              <button onClick={() => setIsMobileOpen(false)} className="p-1.5 text-text-on-dark/70 hover:text-text-on-dark cursor-pointer">
                <FiX className="h-6 w-6" />
              </button>
            </div>
            
            <nav className="flex-1 overflow-y-auto flex flex-col gap-brand-xs">
              {sidebarLinks.map((link) => {
                const LinkIcon = link.icon;
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMobileOpen(false)}
                    className={`flex items-center gap-brand-md px-brand-md py-brand-sm text-xs font-semibold rounded-xl border border-transparent relative
                      ${isActive
                        ? 'bg-accent-gold border-accent-gold/20 text-text-on-accent font-bold shadow-sm shadow-accent-gold/15'
                        : 'text-text-on-dark/70 hover:bg-background-surface/10 border-transparent'
                      }
                    `}
                  >
                    {isActive && (
                      <span className="absolute left-0 top-3 bottom-3 w-0.75 rounded-r bg-text-on-accent" />
                    )}
                    <LinkIcon className={`h-4.5 w-4.5 ${isActive ? 'text-text-on-accent' : 'text-text-on-dark/60'}`} />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>
            
            <div className="pt-4 border-t border-border-default/20 mt-4">
              <button
                onClick={() => setIsLogoutDialogOpen(true)}
                className="flex items-center gap-brand-md w-full px-brand-md py-brand-sm text-xs font-semibold text-text-on-dark/60 hover:text-brand-danger hover:bg-red-950/10 rounded-xl transition-colors border border-transparent cursor-pointer"
              >
                <FiLogOut className="h-4.5 w-4.5" />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content Space */}
      <div className="flex-1 flex flex-col min-w-0 bg-background-primary">
        {/* Header */}
        <header className="h-16 border-b border-border-default/20 bg-black-accent/90 backdrop-blur-xl sticky top-0 z-30 px-brand-md flex items-center justify-between shadow-lg shadow-black-accent/5">
          <div className="flex items-center gap-brand-sm">
            <button
              onClick={() => setIsMobileOpen(true)}
              className="lg:hidden p-2 rounded-lg text-text-on-dark/75 hover:bg-background-surface/10 hover:text-accent-gold transition-colors cursor-pointer"
            >
              <FiMenu className="h-6 w-6" />
            </button>
            <h2 className="text-xs font-extrabold text-text-on-dark/70 uppercase tracking-widest hidden sm:block select-none">
              Control Panel
            </h2>
          </div>

          <div className="flex items-center gap-brand-md">
            <button className="relative p-2 text-text-on-dark/70 hover:text-accent-gold hover:bg-black-accent/80 rounded-lg transition-colors cursor-pointer">
              <FiBell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-brand-danger ring-2 ring-black-accent" />
            </button>

            {/* Profile Dropdown */}
            <Dropdown
              align="right"
              trigger={
                <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-background-surface/10 border border-border-default/20 hover:bg-background-surface/20 hover:border-border-default/40 transition-all duration-200 cursor-pointer">
                  {currentUser?.avatar ? (
                    <img
                      src={currentUser.avatar}
                      alt={fullName}
                      className="h-7 w-7 rounded-lg object-cover border border-accent-gold/25 shadow-md"
                    />
                  ) : (
                    <div className="h-7 w-7 rounded-lg bg-gradient-to-tr from-accent-gold to-accent-gold-hover flex items-center justify-center font-black text-text-on-accent text-xs shadow-md shadow-accent-gold/10">
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

        {/* Content Body */}
        <main className="flex-1 flex flex-col py-brand-lg">
          <PageContainer className="flex-1 flex flex-col">
            {/* Breadcrumbs */}
            {location.pathname !== '/admin/dashboard' && (
              <Breadcrumb items={breadcrumbItems} className="mb-brand-md opacity-80" homeLink="/admin/dashboard" />
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
    </div>
  );
}
