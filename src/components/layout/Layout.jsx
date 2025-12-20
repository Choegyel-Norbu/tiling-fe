import React, { useEffect, useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { Button } from '../ui/Button';

export function Layout() {
  const location = useLocation();
  const [showSticky, setShowSticky] = useState(true);

  // Hide sticky button on booking page or admin
  useEffect(() => {
    if (location.pathname.startsWith('/booking') || location.pathname.startsWith('/admin')) {
      setShowSticky(false);
    } else {
      setShowSticky(true);
    }
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      
      {/* Mobile Sticky Book Button */}
      {showSticky && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-200 md:hidden z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
          <Link to="/booking">
            <Button size="lg" className="w-full shadow-lg text-base">Book a Job Now</Button>
          </Link>
        </div>
      )}
    </div>
  );
}

