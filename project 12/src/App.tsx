import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';
import { AuthProvider } from './contexts/AuthContext';
import DashboardLayout from './components/dashboard/DashboardLayout';
import AdminLayout from './components/admin/AdminLayout';
import AuthLayout from './components/auth/AuthLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Public pages
import HomePage from './pages/HomePage';
import ProcessPage from './pages/ProcessPage';
import PricingPage from './pages/PricingPage';
import ExamplesPage from './pages/ExamplesPage';
import OrderPage from './pages/OrderPage';
import AboutUsPage from './pages/AboutUsPage';
import ContactPage from './pages/ContactPage';
import ImprintPage from './pages/ImprintPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import OrderUploadPage from './pages/OrderUploadPage';
import OrderCustomizePage from './pages/OrderCustomizePage';
import OrderUpsellPage from './pages/OrderUpsellPage';
import OrderReviewPage from './pages/OrderReviewPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';

// Auth pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminOrders from './pages/admin/AdminOrders';
import AdminOrderDetail from './pages/admin/AdminOrderDetail';
import AdminCustomers from './pages/admin/AdminCustomers';
import AdminVideos from './pages/admin/AdminVideos';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminPayments from './pages/admin/AdminPayments';

// Dashboard pages
import DashboardHome from './pages/dashboard/DashboardHome';
import DashboardOrders from './pages/dashboard/DashboardOrders';
import DashboardVideos from './pages/dashboard/DashboardVideos';
import DashboardSettings from './pages/dashboard/DashboardSettings';

function App() {
  return (
    <AuthProvider>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#171717',
            color: '#F4F4F4',
            border: '1px solid rgba(255, 88, 0, 0.3)',
          },
          success: {
            iconTheme: {
              primary: '#FF5800',
              secondary: '#FFFFFF',
            },
          },
          error: {
            iconTheme: {
              primary: '#FF5800',
              secondary: '#FFFFFF',
            },
          },
        }}
      />
      <Routes>
        {/* Main public routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="prozess" element={<ProcessPage />} />
          <Route path="preise" element={<PricingPage />} />
          <Route path="beispiele" element={<ExamplesPage />} />
          <Route path="bestellen" element={<OrderPage />} />
          <Route path="ueber-uns" element={<AboutUsPage />} />
          <Route path="bestellen/upload" element={<OrderUploadPage />} />
          <Route path="bestellen/customize" element={<OrderCustomizePage />} />
          <Route path="bestellen/upsell" element={<OrderUpsellPage />} />
          <Route path="bestellen/review" element={<OrderReviewPage />} />
          <Route path="payment/success" element={<PaymentSuccessPage />} />
          <Route path="kontakt" element={<ContactPage />} />
          <Route path="impressum" element={<ImprintPage />} />
          <Route path="datenschutz" element={<PrivacyPage />} />
          <Route path="agb" element={<TermsPage />} />
        </Route>

        {/* Auth routes */}
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
        </Route>

        {/* Dashboard routes - protected */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardHome />} />
          <Route path="orders" element={<DashboardOrders />} />
          <Route path="videos" element={<DashboardVideos />} />
          <Route path="settings" element={<DashboardSettings />} />
        </Route>

        {/* Admin routes - protected */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="orders/:orderId" element={<AdminOrderDetail />} />
          <Route path="customers" element={<AdminCustomers />} />
          <Route path="videos" element={<AdminVideos />} />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="payments" element={<AdminPayments />} />
        </Route>

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;