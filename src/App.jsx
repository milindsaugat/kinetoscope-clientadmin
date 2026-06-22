/* ============================================================
   Root: App.jsx
   Description: Client portal root component with routing
   ============================================================ */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './components/ui/Toast';

// Layout
import MainLayout from './components/layout/MainLayout';

// Auth Pages
import Login from './pages/auth/Login';
import ForgotPassword from './pages/auth/ForgotPassword';

// Main Pages
import DashboardHome from './pages/dashboard/DashboardHome';
import InvestmentOverview from './pages/investment/InvestmentOverview';
import CompleteTransactionDetails from './pages/investment/CompleteTransactionDetails';
import Portfolio from './pages/portfolio/Portfolio';
import ProjectSelection from './pages/projects/ProjectSelection';
import PerksAndRecognition from './pages/perks/PerksAndRecognition';
import PaymentRequests from './pages/payments/PaymentRequests';
import ServiceRequests from './pages/service-requests/ServiceRequests';
import NewServiceRequest from './pages/service-requests/NewServiceRequest';
import ServiceRequestDetail from './pages/service-requests/ServiceRequestDetail';
import Profile from './pages/profile/Profile';
import MediaFeed from './pages/media/MediaFeed';
import OnboardingDetails from './pages/onboarding/OnboardingDetails';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Protected Routes (MainLayout wraps all) */}
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<DashboardHome />} />
            <Route path="/investment" element={<InvestmentOverview />} />
            <Route path="/complete-transaction-details" element={<CompleteTransactionDetails />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/projects" element={<ProjectSelection />} />
            <Route path="/perks" element={<PerksAndRecognition />} />
            <Route path="/payments" element={<PaymentRequests />} />
            <Route path="/service-requests" element={<ServiceRequests />} />
            <Route path="/service-requests/new" element={<NewServiceRequest />} />
            <Route path="/service-requests/:id" element={<ServiceRequestDetail />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/media" element={<MediaFeed />} />
            <Route path="/onboarding/details" element={<OnboardingDetails />} />
          </Route>

          {/* Redirects & Catch-all */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ToastProvider>
    </BrowserRouter>
  );
}

/* ============ END: App.jsx ============ */
