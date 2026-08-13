import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { PublicLayout } from './components/layout/PublicLayout';
import { RequireAuth, GuestOnly } from './components/auth/RequireAuth';
import Dashboard from './pages/Dashboard';
import ProfileUpdate from './pages/ProfileUpdate';
import ApplyVisa from './pages/ApplyVisa';
import BulkApplyVisa from './pages/BulkApplyVisa';
import PendingPayment from './pages/PendingPayment';
import WalletRecharge from './pages/WalletRecharge';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Home from './pages/Home';
import About from './pages/About';
import EvisaCountries from './pages/EvisaCountries';
import EvisaCountryDetail from './pages/EvisaCountryDetail';
import VisaApply from './pages/VisaApply';
import { getUser, homePathForRole, isAuthenticated } from './lib/auth';

function RootRedirect() {
  if (!isAuthenticated()) return <Navigate to="/home" replace />;
  return <Navigate to={homePathForRole(getUser()?.role)} replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/evisa-countries" element={<EvisaCountries />} />
          <Route path="/evisa-countries/:id" element={<EvisaCountryDetail />} />
          <Route path="/visa-apply" element={<VisaApply />} />
        </Route>

        <Route element={<GuestOnly />}>
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
        </Route>

        <Route element={<RequireAuth />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile-update" element={<ProfileUpdate />} />
            <Route path="/apply-visa" element={<ApplyVisa />} />
            <Route path="/bulk-apply-visa" element={<BulkApplyVisa />} />
            <Route path="/pending-payment" element={<PendingPayment />} />
            <Route path="/wallet-recharge" element={<WalletRecharge />} />
            <Route path="/agent/evisa-countries" element={<EvisaCountries />} />
          </Route>
        </Route>

        <Route path="/" element={<RootRedirect />} />
        <Route path="*" element={<RootRedirect />} />
      </Routes>
    </BrowserRouter>
  );
}
