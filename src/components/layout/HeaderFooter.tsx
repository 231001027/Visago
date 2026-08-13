import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Home, LogOut, Menu, X, UserCircle,
  UserCog, Plane, Layers, CreditCard, Wallet, Globe2,
} from 'lucide-react';
import { DuVisasLogoMark } from '@/components/brand/Logo';
import { getUser, signOut } from '@/lib/auth';

const NAV = [
  { to: '/dashboard', label: 'Dashboard', icon: Home },
  { to: '/profile-update', label: 'Profile Update', icon: UserCog },
  { to: '/apply-visa', label: 'Apply Visa', icon: Plane },
  { to: '/bulk-apply-visa', label: 'Bulk Apply Visa', icon: Layers },
  { to: '/agent/evisa-countries', label: 'eVisa Countries', icon: Globe2 },
  { to: '/pending-payment', label: 'Pending Payment', icon: CreditCard },
  { to: '/wallet-recharge', label: 'Wallet Recharge', icon: Wallet },
];

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const navigate = useNavigate();
  const user = getUser();

  const logout = () => {
    onNavigate?.();
    signOut();
    navigate('/home');
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2.5 px-4 h-[60px] border-b border-white/10 shrink-0">
        <Link to="/home" onClick={onNavigate}>
          <DuVisasLogoMark variant="color" size="md" />
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/dashboard'}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-[8px] text-[13px] font-medium transition-colors ${
                isActive
                  ? 'bg-white text-brand-blue shadow-sm'
                  : 'text-white/90 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            <item.icon className="w-4 h-4 shrink-0" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-white/10 shrink-0 space-y-1">
        <button
          onClick={() => {
            onNavigate?.();
            navigate('/profile-update');
          }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-[8px] text-[13px] font-medium text-white/90 hover:bg-white/10"
        >
          <UserCircle className="w-4 h-4 shrink-0" />
          <span className="truncate">{user?.name || 'Travel Agency'}</span>
        </button>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-[8px] text-[13px] font-medium text-white/90 hover:bg-white/10"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          Logout
        </button>
      </div>
    </div>
  );
}

export function Sidebar({
  mobileOpen,
  onClose,
}: {
  mobileOpen: boolean;
  onClose: () => void;
}) {
  return (
    <>
      <aside className="hidden lg:flex fixed inset-y-0 left-0 z-40 w-[240px] bg-brand-blue text-white shadow-lg flex-col">
        <SidebarNav />
      </aside>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={onClose} />
          <aside className="absolute inset-y-0 left-0 w-[260px] bg-brand-blue text-white shadow-xl flex flex-col">
            <button
              onClick={onClose}
              className="absolute top-3 right-3 p-1.5 rounded-md hover:bg-white/10"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
            <SidebarNav onNavigate={onClose} />
          </aside>
        </div>
      )}
    </>
  );
}

export function TopBar({ onMenu }: { onMenu: () => void }) {
  return (
    <div className="lg:hidden sticky top-0 z-30 h-[50px] bg-brand-blue text-white shadow-md flex items-center gap-3 px-4">
      <button onClick={onMenu} className="p-1.5 rounded-md hover:bg-white/10" aria-label="Open menu">
        <Menu className="w-5 h-5" />
      </button>
      <DuVisasLogoMark variant="color" size="sm" />
    </div>
  );
}

export function Footer() {
  return (
    <footer className="w-full">
      <div className="px-5 pt-4">
        <div className="h-[38px] rounded-t-[14px] bg-gradient-to-r from-brand-dark to-brand-blue flex items-center justify-center text-[10.5px] text-white/90 tracking-wide">
          Powered by DU Visas © 2026
        </div>
      </div>
    </footer>
  );
}
