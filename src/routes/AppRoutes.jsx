import React, { lazy, Suspense } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Loader from '../commonComponents/loaders/Loader';

// Layouts
import PublicLayout from '../layouts/PublicLayout';
import UserLayout from '../layouts/UserLayout';
import AdminLayout from '../layouts/AdminLayout';

// Lazy-loaded User Screens
const HomeScreen = lazy(() => import('../user/home'));
const AboutScreen = lazy(() => import('../user/about'));
const ServicesScreen = lazy(() => import('../user/services'));
const ImportServicesScreen = lazy(() => import('../user/importServices'));
const ExportServicesScreen = lazy(() => import('../user/exportServices'));
const ProductsScreen = lazy(() => import('../user/products'));
const CategoriesScreen = lazy(() => import('../user/categories'));
const ProductDetailsScreen = lazy(() => import('../user/productDetails'));
const ComparisonScreen = lazy(() => import('../user/comparison'));
const WishlistScreen = lazy(() => import('../user/wishlist'));
const CartScreen = lazy(() => import('../user/cart'));
const InquiryCartScreen = lazy(() => import('../user/inquiryCart'));
const RfqScreen = lazy(() => import('../user/rfq'));
const CheckoutScreen = lazy(() => import('../user/checkout'));
const PaymentScreen = lazy(() => import('../user/payment'));
const OrderSuccessScreen = lazy(() => import('../user/orders'));
const OrdersScreen = lazy(() => import('../user/orders'));
const OrderTrackingScreen = lazy(() => import('../user/orderTracking'));
const ProfileScreen = lazy(() => import('../user/profile'));
const ReviewsScreen = lazy(() => import('../user/reviews'));
const SupportTicketsScreen = lazy(() => import('../user/supportTickets'));
const NotificationsScreen = lazy(() => import('../user/notifications'));
const SettingsScreen = lazy(() => import('../user/settings'));

// Lazy-loaded Admin Screens
const AdminDashboardScreen = lazy(() => import('../admin/dashboard'));
const AdminCategoriesScreen = lazy(() => import('../admin/categories'));
const AdminSubCategoriesScreen = lazy(() => import('../admin/subCategories'));
const AdminProductsScreen = lazy(() => import('../admin/products'));
const AdminUsersScreen = lazy(() => import('../admin/users'));
const AdminInquiriesScreen = lazy(() => import('../admin/inquiries'));
const AdminRfqScreen = lazy(() => import('../admin/rfq'));
const AdminLeadsScreen = lazy(() => import('../admin/leads'));
const AdminOrdersScreen = lazy(() => import('../admin/orders'));
const AdminPaymentsScreen = lazy(() => import('../admin/payments'));
const AdminInventoryScreen = lazy(() => import('../admin/inventory'));
const AdminReportsScreen = lazy(() => import('../admin/reports'));
const AdminAnalyticsScreen = lazy(() => import('../admin/analytics'));
const AdminNotificationsScreen = lazy(() => import('../admin/notifications'));
const AdminBlogsScreen = lazy(() => import('../admin/blogs'));
const AdminFaqScreen = lazy(() => import('../admin/faq'));
const AdminTestimonialsScreen = lazy(() => import('../admin/testimonials'));
const AdminCertificationsScreen = lazy(() => import('../admin/certifications'));
const AdminMediaLibraryScreen = lazy(() => import('../admin/mediaLibrary'));
const AdminCmsScreen = lazy(() => import('../admin/cms'));
const AdminSupportTicketsScreen = lazy(() => import('../admin/supportTickets'));
const AdminAuditLogsScreen = lazy(() => import('../admin/auditLogs'));
const AdminRolesPermissionsScreen = lazy(() => import('../admin/rolesPermissions'));
const AdminSettingsScreen = lazy(() => import('../admin/settings'));
const AdminDesignSystemScreen = lazy(() => import('../admin/designSystem'));

// Lazy-loaded Auth Screens
const AuthLoginScreen = lazy(() => import('../auth/login'));
const AuthSignupScreen = lazy(() => import('../auth/signup'));
const AuthForgotPasswordScreen = lazy(() => import('../auth/forgotPassword'));
const AuthResetPasswordScreen = lazy(() => import('../auth/resetPassword'));
const AuthOtpVerificationScreen = lazy(() => import('../auth/otpVerification'));
const AuthEmailVerificationScreen = lazy(() => import('../auth/emailVerification'));

export default function AppRoutes() {
  return (
    <HashRouter>
      <Suspense fallback={<Loader type="page" />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<HomeScreen />} />
            <Route path="about" element={<AboutScreen />} />
            <Route path="services" element={<ServicesScreen />} />
            <Route path="services/import" element={<ImportServicesScreen />} />
            <Route path="services/export" element={<ExportServicesScreen />} />
            <Route path="products" element={<ProductsScreen />} />
            <Route path="categories" element={<CategoriesScreen />} />
            <Route path="products/:id" element={<ProductDetailsScreen />} />
            <Route path="comparison" element={<ComparisonScreen />} />
            <Route path="inquiry-cart" element={<InquiryCartScreen />} />
            <Route path="rfq" element={<RfqScreen />} />
          </Route>

          {/* User Workspace Routes */}
          <Route path="/user" element={<UserLayout />}>
            <Route index element={<Navigate to="/user/home" replace />} />
            <Route path="home" element={<HomeScreen />} />
            <Route path="cart" element={<CartScreen />} />
            <Route path="wishlist" element={<WishlistScreen />} />
            <Route path="checkout" element={<CheckoutScreen />} />
            <Route path="payment" element={<PaymentScreen />} />
            <Route path="order-success" element={<OrderSuccessScreen />} />
            <Route path="orders" element={<OrdersScreen />} />
            <Route path="order-tracking/:id" element={<OrderTrackingScreen />} />
            <Route path="profile" element={<ProfileScreen />} />
            <Route path="reviews" element={<ReviewsScreen />} />
            <Route path="support" element={<SupportTicketsScreen />} />
            <Route path="notifications" element={<NotificationsScreen />} />
            <Route path="settings" element={<SettingsScreen />} />
            <Route path="products" element={<ProductsScreen />} />
            <Route path="categories" element={<CategoriesScreen />} />
            <Route path="products/:id" element={<ProductDetailsScreen />} />
            <Route path="inquiry-cart" element={<InquiryCartScreen />} />
            <Route path="rfq" element={<RfqScreen />} />
          </Route>

          {/* Admin CRM Control Panel */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboardScreen />} />
            <Route path="categories" element={<AdminCategoriesScreen />} />
            <Route path="subcategories" element={<AdminSubCategoriesScreen />} />
            <Route path="products" element={<AdminProductsScreen />} />
            <Route path="users" element={<AdminUsersScreen />} />
            <Route path="inquiries" element={<AdminInquiriesScreen />} />
            <Route path="rfq" element={<AdminRfqScreen />} />
            <Route path="leads" element={<AdminLeadsScreen />} />
            <Route path="orders" element={<AdminOrdersScreen />} />
            <Route path="payments" element={<AdminPaymentsScreen />} />
            <Route path="inventory" element={<AdminInventoryScreen />} />
            <Route path="reports" element={<AdminReportsScreen />} />
            <Route path="analytics" element={<AdminAnalyticsScreen />} />
            <Route path="notifications" element={<AdminNotificationsScreen />} />
            <Route path="blogs" element={<AdminBlogsScreen />} />
            <Route path="faq" element={<AdminFaqScreen />} />
            <Route path="testimonials" element={<AdminTestimonialsScreen />} />
            <Route path="certifications" element={<AdminCertificationsScreen />} />
            <Route path="media" element={<AdminMediaLibraryScreen />} />
            <Route path="cms" element={<AdminCmsScreen />} />
            <Route path="tickets" element={<AdminSupportTicketsScreen />} />
            <Route path="audit-logs" element={<AdminAuditLogsScreen />} />
            <Route path="roles" element={<AdminRolesPermissionsScreen />} />
            <Route path="settings" element={<AdminSettingsScreen />} />
            <Route path="design-system" element={<AdminDesignSystemScreen />} />
          </Route>

          {/* Auth Routes */}
          <Route path="/auth">
            <Route index element={<Navigate to="/auth/login" replace />} />
            <Route path="login" element={<AuthLoginScreen />} />
            <Route path="signup" element={<AuthSignupScreen />} />
            <Route path="forgot-password" element={<AuthForgotPasswordScreen />} />
            <Route path="reset-password" element={<AuthResetPasswordScreen />} />
            <Route path="verify-otp" element={<AuthOtpVerificationScreen />} />
            <Route path="verify-email" element={<AuthEmailVerificationScreen />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </HashRouter>
  );
}
