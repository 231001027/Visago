import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar, TopBar, Footer } from './HeaderFooter';

export function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-page">
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 lg:ml-[240px]">
        <TopBar onMenu={() => setMobileOpen(true)} />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}
