import { useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { DuVisasLogo } from '@/components/brand/Logo';
import { isAuthenticated, getUser, homePathForRole } from '@/lib/auth';

const LINKS = [
  { to: '/home', label: 'Home' },
  { to: '/about', label: 'About Us' },
  { to: '/evisa-countries', label: 'eVisa Countries' },
  { to: '/visa-apply', label: 'Apply Visa' },
];

export function PublicLayout() {
  const [open, setOpen] = useState(false);
  const authed = isAuthenticated();
  const user = getUser();
  const portal = homePathForRole(user?.role);

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F9FC]">
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-[#E8ECF1]">
        <div className="max-w-content mx-auto px-5 h-[64px] flex items-center justify-between gap-4">
          <DuVisasLogo to="/home" variant="color" size="md" />

          <nav className="hidden md:flex items-center gap-1">
            {LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-[8px] text-[13px] font-medium ${
                    isActive ? 'bg-brand-light text-brand-blue' : 'text-[#334155] hover:bg-gray-50'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-2">
            {authed ? (
              <Link
                to={portal}
                className="h-[36px] px-4 rounded-[8px] bg-brand-blue text-white text-[12px] font-medium inline-flex items-center"
              >
                {user?.role === 'b2b' ? 'Agent Dashboard' : 'My Portal'}
              </Link>
            ) : (
              <>
                <Link to="/sign-in" className="h-[36px] px-4 rounded-[8px] text-[12px] font-medium text-ink hover:bg-gray-50 inline-flex items-center">
                  Sign In
                </Link>
                <Link to="/sign-up" className="h-[36px] px-4 rounded-[8px] bg-brand-blue text-white text-[12px] font-medium inline-flex items-center">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          <button className="md:hidden p-2" onClick={() => setOpen((v) => !v)} aria-label="Menu">
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {open && (
          <div className="md:hidden border-t border-[#E8ECF1] bg-white px-5 py-3 space-y-1">
            {LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="block px-3 py-2 rounded-[8px] text-[13px] font-medium text-ink hover:bg-gray-50"
              >
                {l.label}
              </NavLink>
            ))}
            <Link to={authed ? portal : '/sign-in'} onClick={() => setOpen(false)} className="block px-3 py-2 text-[13px] font-medium text-brand-blue">
              {authed ? 'Go to portal' : 'Sign In / Sign Up'}
            </Link>
          </div>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-[#E8ECF1] bg-white">
        <div className="max-w-content mx-auto px-5 py-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-[13px]">
          <div>
            <DuVisasLogo to="/home" size="sm" />
            <p className="mt-3 text-sub leading-relaxed">
              Online passport & eVisa bookings for travel agents and clients.
            </p>
          </div>
          <div>
            <p className="font-semibold text-ink mb-2">Explore</p>
            <div className="space-y-1.5 text-sub">
              <Link to="/about" className="block hover:text-brand-blue">About Us</Link>
              <Link to="/evisa-countries" className="block hover:text-brand-blue">eVisa Countries</Link>
              <Link to="/visa-apply" className="block hover:text-brand-blue">Apply Visa</Link>
            </div>
          </div>
          <div>
            <p className="font-semibold text-ink mb-2">Support</p>
            <p className="text-sub">Email: support@duvisas.com</p>
            <p className="text-sub mt-1">Payments: UPI · Net banking · Cards</p>
          </div>
        </div>
        <div className="border-t border-[#E8ECF1] text-center text-[11px] text-sub py-3">
          © {new Date().getFullYear()} DU Visas. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
