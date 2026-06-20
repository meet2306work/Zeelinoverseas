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

  // Derive breadcrumbs based on pathname
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const breadcrumbItems = [];
  
  pathSegments.forEach((segment, index) => {
    // Skip 'admin' layout prefix and the 'dashboard' segment
    if (segment === 'admin' || segment === 'dashboard') return;
    
    const link = '/' + pathSegments.slice(0, index + 1).join('/');
    let label = segment.charAt(0).toUpperCase() + segment.slice(1).replace('-', ' ');
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
    <div className="min-h-screen flex bg-slate-50 text-slate-800 font-sans transition-colors duration-300">
      {/* Collapsible Left Sidebar (Desktop) */}
      <aside
        className={`hidden lg:flex flex-col border-r border-slate-200/80 bg-white shadow-sm transition-all duration-300 h-screen sticky top-0
          ${isSidebarCollapsed ? 'w-20' : 'w-64'}
        `}
      >
        {/* Logo Section */}
        <div className={`h-16 flex items-center border-b border-slate-200/80 ${isSidebarCollapsed ? 'justify-center' : 'justify-between px-brand-md'}`}>
          {!isSidebarCollapsed && (
            <span className="text-sm font-black tracking-widest text-slate-800 flex items-center gap-1.5 uppercase select-none">
              <span className="text-blue-600">Zeelin</span>
              <span className="text-cyan-600">CRM</span>
            </span>
          )}
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className={`p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer ${isSidebarCollapsed ? '' : 'ml-auto'}`}
          >
            <FiMenu className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation items */}
        <nav className="flex-1 overflow-y-auto px-brand-sm py-brand-md flex flex-col gap-brand-xs scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
          {sidebarLinks.map((link) => {
            const LinkIcon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                title={isSidebarCollapsed ? link.label : undefined}
                className={`flex items-center rounded-xl transition-all duration-200 relative border
                  ${isSidebarCollapsed 
                    ? 'justify-center w-10 h-10 mx-auto' 
                    : 'gap-brand-md px-brand-md py-brand-sm text-xs font-semibold'
                  }
                  ${isActive
                    ? 'bg-blue-50/80 border-blue-100/50 text-blue-600 font-bold shadow-sm'
                    : 'text-slate-500 hover:bg-slate-100/70 hover:text-slate-800 hover:translate-x-0.5 border-transparent'
                  }
                `}
              >
                {isActive && !isSidebarCollapsed && (
                  <span className="absolute left-0 top-3 bottom-3 w-0.75 rounded-r bg-blue-600" />
                )}
                <LinkIcon className={`h-4.5 w-4.5 shrink-0 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                {!isSidebarCollapsed && <span>{link.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-brand-sm border-t border-slate-200/80">
          <button
            onClick={() => setIsLogoutDialogOpen(true)}
            title={isSidebarCollapsed ? "Log Out" : undefined}
            className={`flex items-center rounded-xl transition-colors border border-transparent cursor-pointer
              ${isSidebarCollapsed 
                ? 'justify-center w-10 h-10 mx-auto' 
                : 'gap-brand-md w-full px-brand-md py-brand-sm text-xs font-semibold'
              }
              text-slate-500 hover:text-brand-danger hover:bg-red-50
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
          <div onClick={() => setIsMobileOpen(false)} className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm transition-opacity duration-300" />
          
          {/* Menu */}
          <div className="relative w-64 bg-white h-full flex flex-col p-brand-md border-r border-slate-200/80 shadow-2xl animate-fade-in-up">
            <div className="flex items-center justify-between mb-brand-lg">
              <span className="text-sm font-black tracking-widest text-slate-800 flex items-center gap-1.5 uppercase select-none">
                <span className="text-blue-600">Zeelin</span>
                <span className="text-cyan-600">CRM</span>
              </span>
              <button onClick={() => setIsMobileOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-800 cursor-pointer">
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
                    className={`flex items-center gap-brand-md px-brand-md py-brand-sm text-xs font-semibold rounded-xl border relative
                      ${isActive
                        ? 'bg-blue-50 border-blue-100 text-blue-600 font-bold'
                        : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800 border-transparent'
                      }
                    `}
                  >
                    {isActive && (
                      <span className="absolute left-0 top-3 bottom-3 w-0.75 rounded-r bg-blue-600" />
                    )}
                    <LinkIcon className={`h-4.5 w-4.5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>
            
            <div className="pt-4 border-t border-slate-200/80 mt-4">
              <button
                onClick={() => setIsLogoutDialogOpen(true)}
                className="flex items-center gap-brand-md w-full px-brand-md py-brand-sm text-xs font-semibold text-slate-500 hover:text-brand-danger hover:bg-red-50 rounded-xl transition-colors border border-transparent cursor-pointer"
              >
                <FiLogOut className="h-4.5 w-4.5" />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content Space */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-50">
        {/* Header */}
        <header className="h-16 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl sticky top-0 z-30 px-brand-md flex items-center justify-between">
          <div className="flex items-center gap-brand-sm">
            <button
              onClick={() => setIsMobileOpen(true)}
              className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors cursor-pointer"
            >
              <FiMenu className="h-6 w-6" />
            </button>
            <h2 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest hidden sm:block select-none">
              Control Panel
            </h2>
          </div>

          <div className="flex items-center gap-brand-md">
            <button className="relative p-2 text-slate-400 hover:text-slate-650 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer">
              <FiBell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-blue-600 ring-2 ring-white" />
            </button>

            {/* Profile Dropdown */}
            <Dropdown
              align="right"
              trigger={
                <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-100/80 border border-slate-200/60 hover:bg-slate-200 hover:border-slate-300 transition-all duration-200 cursor-pointer">
                  {currentUser?.avatar ? (
                    <img
                      src={currentUser.avatar}
                      alt={fullName}
                      className="h-7 w-7 rounded-lg object-cover border border-blue-500/20 shadow-md"
                    />
                  ) : (
                    <div className="h-7 w-7 rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center font-black text-white text-xs shadow-md shadow-blue-500/10">
                      {initials}
                    </div>
                  )}
                  <span className="text-xs font-bold text-slate-700 hidden md:inline">
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
