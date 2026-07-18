import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

import { useTheme } from '@/hooks/useTheme';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import ErrorBoundary from '@/components/ui/ErrorBoundary';
import ProtectedRoute from '@/components/ProtectedRoute';
import ScrollToTop from '@/components/ScrollToTop';

import MainLayout from '@/layouts/MainLayout';
import DashboardLayout from '@/layouts/DashboardLayout';
import type { DashboardLink } from '@/layouts/DashboardLayout';

import Landing from '@/pages/Landing';
import Catalog from '@/pages/Catalog';
import ProductDetail from '@/pages/ProductDetail';
import Cart from '@/pages/Cart';
import Checkout from '@/pages/Checkout';
import CheckoutVerify from '@/pages/CheckoutVerify';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import Pricing from '@/pages/Pricing';
import NotFound from '@/pages/NotFound';

import Login from '@/pages/auth/Auth';
import ForgotPassword from '@/pages/auth/ForgotPassword';
import ResetPassword from '@/pages/auth/ResetPassword';
import VerifyEmail from '@/pages/auth/VerifyEmail';

import StudentHome from '@/pages/dashboard/StudentHome';
import Purchases from '@/pages/dashboard/Purchases';
import Player from '@/pages/dashboard/Player';
import Downloads from '@/pages/dashboard/Downloads';
import Wishlist from '@/pages/dashboard/Wishlist';
import Profile from '@/pages/dashboard/Profile';

import InstructorHome from '@/pages/instructor/InstructorHome';
import UploadContent from '@/pages/instructor/UploadContent';

import AdminHome from '@/pages/admin/AdminHome';
import AdminUsers from '@/pages/admin/AdminUsers';
import AdminOrders from '@/pages/admin/AdminOrders';
import AdminProducts from '@/pages/admin/AdminProducts';
import AdminCoupons from '@/pages/admin/AdminCoupons';

import {
  FiGrid, FiShoppingBag, FiDownload, FiHeart, FiUser, FiUpload,
  FiUsers, FiBox, FiTag,
} from 'react-icons/fi';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: false } },
});

const studentLinks: DashboardLink[] = [
  { to: '/dashboard', label: 'Overview', icon: FiGrid, end: true },
  { to: '/dashboard/purchases', label: 'Purchases', icon: FiShoppingBag },
  { to: '/dashboard/downloads', label: 'Downloads', icon: FiDownload },
  { to: '/dashboard/wishlist', label: 'Wishlist', icon: FiHeart },
  { to: '/dashboard/profile', label: 'Profile', icon: FiUser },
];

const instructorLinks: DashboardLink[] = [
  { to: '/instructor', label: 'Overview', icon: FiGrid, end: true },
  { to: '/instructor/upload', label: 'Upload Content', icon: FiUpload },
  { to: '/instructor/profile', label: 'Profile', icon: FiUser },
];

const adminLinks: DashboardLink[] = [
  { to: '/admin', label: 'Overview', icon: FiGrid, end: true },
  { to: '/admin/users', label: 'Users', icon: FiUsers },
  { to: '/admin/products', label: 'Products', icon: FiBox },
  { to: '/admin/orders', label: 'Orders', icon: FiShoppingBag },
  { to: '/admin/coupons', label: 'Coupons', icon: FiTag },
];

const App = () => {
  useTheme();
  const { fetchMe } = useAuthStore();
  const user = useAuthStore((s) => s.user);
  const fetchCart = useCartStore((s) => s.fetch);

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  useEffect(() => {
    if (user) fetchCart();
  }, [user, fetchCart]);

  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <BrowserRouter>
          <ScrollToTop />
          <Toaster position="top-right" toastOptions={{ className: 'dark:!bg-slate-800 dark:!text-white' }} />
          <Routes>
            <Route element={<MainLayout />}>
              <Route index element={<Landing />} />
              <Route path="courses" element={<Catalog type="course" title="Courses" subtitle="Master AI & ML with complete recorded courses." />} />
              <Route path="videos" element={<Catalog type="video" title="Videos" subtitle="Individual class recordings and tutorials." />} />
              <Route path="snapshots" element={<Catalog type="snapshot" title="Snapshots" subtitle="Class slides, snapshots and visual notes." />} />
              <Route path="resources" element={<Catalog title="All Resources" subtitle="Browse everything on LazerVault." />} />
              <Route path="product/:id" element={<ProductDetail />} />
              <Route path="cart" element={<Cart />} />
              <Route path="pricing" element={<Pricing />} />
              <Route path="about" element={<About />} />
              <Route path="contact" element={<Contact />} />

              <Route path="login" element={<Login />} />
              <Route path="forgot-password" element={<ForgotPassword />} />
              <Route path="reset-password" element={<ResetPassword />} />
              <Route path="verify-email" element={<VerifyEmail />} />

              <Route path="checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
              <Route path="checkout/verify" element={<ProtectedRoute><CheckoutVerify /></ProtectedRoute>} />

              {/* Student dashboard */}
              <Route
                path="dashboard"
                element={<ProtectedRoute><DashboardLayout links={studentLinks} title="Student" /></ProtectedRoute>}
              >
                <Route index element={<StudentHome />} />
                <Route path="purchases" element={<Purchases />} />
                <Route path="library/:id" element={<Player />} />
                <Route path="downloads" element={<Downloads />} />
                <Route path="wishlist" element={<Wishlist />} />
                <Route path="profile" element={<Profile />} />
              </Route>

              {/* Instructor dashboard */}
              <Route
                path="instructor"
                element={<ProtectedRoute roles={['instructor', 'admin']}><DashboardLayout links={instructorLinks} title="Instructor" /></ProtectedRoute>}
              >
                <Route index element={<InstructorHome />} />
                <Route path="upload" element={<UploadContent />} />
                <Route path="profile" element={<Profile />} />
              </Route>

              {/* Admin dashboard */}
              <Route
                path="admin"
                element={<ProtectedRoute roles={['admin']}><DashboardLayout links={adminLinks} title="Admin" /></ProtectedRoute>}
              >
                <Route index element={<AdminHome />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="coupons" element={<AdminCoupons />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ErrorBoundary>
    </QueryClientProvider>
  );
};

export default App;
