import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Phone, Hammer, ChevronDown, LogOut, User, Calendar, Shield, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../ui/Button';
import { Dialog } from '../ui/Dialog';
import { cn } from '../../utils/cn';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, isAdmin, isUser } = useAuth();
  const { showToast } = useToast();

  const handleLogout = () => {
    setShowLogoutDialog(true);
    setIsUserMenuOpen(false);
  };

  const confirmLogout = () => {
    logout();
    setShowLogoutDialog(false);
    setIsOpen(false);
    showToast('You have been successfully signed out', 'success', 3000);
    navigate('/');
  };

  const servicesMenu = [
    { name: 'Bathroom Tiling', path: '/services#bathroom' },
    { name: 'Kitchen Splashbacks', path: '/services#kitchen' },
    { name: 'Floor Tiling', path: '/services#floor' },
    { name: 'Outdoor & Pools', path: '/services#outdoor' },
    { name: 'Waterproofing', path: '/services#waterproofing' },
  ];

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path) => {
    if (path === '/' && location.pathname !== '/') return false;
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="bg-slate-900 md:bg-white border-b border-slate-800 md:border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 min-h-[64px]">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2 cursor-pointer">
              <div className="bg-accent p-1.5 rounded-md">
                <Hammer className="h-6 w-6 text-white" />
              </div>
              <span className="font-bold text-xl text-white md:text-primary tracking-tight hidden sm:inline">Himalayan Tiling</span>
              <span className="font-bold text-lg text-white md:text-primary tracking-tight sm:hidden">HT</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex md:items-center md:space-x-4 lg:space-x-8 flex-shrink-0">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={cn(
                  "text-xs lg:text-sm font-medium transition-colors hover:text-accent cursor-pointer whitespace-nowrap",
                  isActive(link.path) ? "text-accent" : "text-slate-600"
                )}
              >
                {link.name}
              </Link>
            ))}
            
            {/* Services Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setIsServicesOpen(true)}
              onMouseLeave={() => setIsServicesOpen(false)}
            >
              <Link
                to="/services"
                className={cn(
                  "text-xs lg:text-sm font-medium transition-colors hover:text-accent flex items-center gap-1 cursor-pointer whitespace-nowrap",
                  isActive('/services') ? "text-accent" : "text-slate-600"
                )}
              >
                Services
                <ChevronDown className={cn(
                  "h-4 w-4 transition-transform duration-200",
                  isServicesOpen && "rotate-180"
                )} />
              </Link>

              <AnimatePresence>
                {isServicesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-slate-200 z-50"
                    style={{ 
                      transform: 'translateZ(0)',
                      backfaceVisibility: 'hidden',
                      perspective: 1000
                    }}
                  >
                    <div className="py-2 overflow-hidden">
                      {servicesMenu.map((service) => (
                        <Link
                          key={service.path}
                          to={service.path}
                          className="block px-4 py-3 text-sm font-medium text-slate-700 hover:bg-accent/5 hover:text-accent transition-none cursor-pointer"
                        >
                          {service.name}
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          <div className="flex items-center gap-2 lg:gap-4 ml-2 lg:ml-4 flex-shrink-0">
            <a href="tel:+61400000000" className="hidden xl:flex items-center gap-2 text-slate-600 hover:text-accent font-medium text-sm cursor-pointer">
              <Phone className="h-4 w-4" />
              <span>0400 000 000</span>
            </a>
            <Link to="/booking" className="cursor-pointer">
              <Button className="bg-accent text-white hover:bg-yellow-600 text-xs lg:text-sm px-3 lg:px-4">Book a Job</Button>
            </Link>
            
            {/* User Menu - Desktop */}
            {isAuthenticated && user && (
              <div 
                className="relative"
                onMouseEnter={() => setIsUserMenuOpen(true)}
                onMouseLeave={() => setIsUserMenuOpen(false)}
              >
                <button
                  className="flex items-center gap-1 lg:gap-2 px-2 lg:px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  {user.picture ? (
                    <img 
                      src={user.picture} 
                      alt={user.name || 'User'} 
                      className="h-8 w-8 rounded-full border-2 border-slate-200 flex-shrink-0"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <User className="h-4 w-4 text-accent" />
                    </div>
                  )}
                  <span className="text-xs lg:text-sm font-medium text-slate-700 hidden xl:block max-w-[120px] truncate">
                    {user.name || user.email}
                  </span>
                  <ChevronDown className={cn(
                    "h-4 w-4 text-slate-400 transition-transform duration-200 flex-shrink-0",
                    isUserMenuOpen && "rotate-180"
                  )} />
                </button>

                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-slate-200 z-50"
                    >
                      <div className="p-4 border-b border-slate-100">
                        <p className="text-sm font-semibold text-slate-900">{user.name || 'User'}</p>
                        <p className="text-xs text-slate-500 mt-1">{user.email}</p>
                      </div>
                      <div className="p-2 space-y-1">
                        {isUser && (
                          <Link
                            to="/my-bookings"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-md transition-colors cursor-pointer"
                          >
                            <Calendar className="h-4 w-4" />
                            <span>My Bookings</span>
                          </Link>
                        )}
                        {isAdmin && (
                          <Link
                            to="/admin"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-md transition-colors cursor-pointer"
                          >
                            <span>Admin Dashboard</span>
                          </Link>
                        )}
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                        >
                          <LogOut className="h-4 w-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 md:text-slate-400 hover:text-slate-500 md:hover:text-slate-500 hover:bg-slate-100 md:hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-accent cursor-pointer"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-slate-900 border-t border-slate-800">
          <div className="pt-2 pb-3 space-y-1 px-4 sm:px-6 bg-slate-900">
            <Link
              to="/"
              onClick={() => setIsOpen(false)}
              className={cn(
                "block px-3 py-2 rounded-md text-base font-medium cursor-pointer",
                isActive('/')
                  ? "bg-accent/20 text-accent"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              )}
            >
              Home
            </Link>
            
            {/* Services Dropdown for Mobile */}
            <div>
              <button
                onClick={() => setIsServicesOpen(!isServicesOpen)}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2 rounded-md text-base font-medium cursor-pointer",
                  isActive('/services')
                    ? "bg-accent/20 text-accent"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                )}
              >
                <span>Services</span>
                <ChevronDown className={cn(
                  "h-4 w-4 transition-transform duration-200",
                  isServicesOpen && "rotate-180"
                )} />
              </button>
              
              <AnimatePresence>
                {isServicesOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="pl-6 pt-1 space-y-1">
                      {servicesMenu.map((service) => (
                        <Link
                          key={service.path}
                          to={service.path}
                          onClick={() => {
                            setIsOpen(false);
                            setIsServicesOpen(false);
                          }}
                          className="block px-3 py-2 rounded-md text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-none cursor-pointer"
                        >
                          {service.name}
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {navLinks.slice(1).map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "block px-3 py-2 rounded-md text-base font-medium cursor-pointer",
                  isActive(link.path)
                    ? "bg-accent/20 text-accent"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                )}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-4 border-t border-slate-800 mt-4">
              <a href="tel:+61400000000" className="flex items-center gap-2 text-slate-300 px-3 py-2 cursor-pointer">
                <Phone className="h-5 w-5" />
                <span className="font-medium">0400 000 000</span>
              </a>
              <div className="mt-3 px-3">
                <Link to="/booking" onClick={() => setIsOpen(false)} className="cursor-pointer">
                  <Button className="w-full bg-accent text-white hover:bg-yellow-600">Book a Job</Button>
                </Link>
              </div>
              
              {/* User Menu - Mobile */}
              {isAuthenticated && user && (
                <div className="mt-4 border-t border-slate-800 pt-4 px-3">
                  <div className="flex items-center gap-3 px-3 py-2 mb-2">
                    {user.picture ? (
                      <img 
                        src={user.picture} 
                        alt={user.name || 'User'} 
                        className="h-10 w-10 rounded-full border-2 border-slate-700"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-accent/20 flex items-center justify-center">
                        <User className="h-5 w-5 text-accent" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white truncate">{user.name || 'User'}</p>
                      <p className="text-xs text-slate-400 truncate">{user.email}</p>
                    </div>
                  </div>
                  {isUser && (
                    <Link
                      to="/my-bookings"
                      onClick={() => setIsOpen(false)}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-200 hover:bg-slate-800 rounded-md transition-colors mb-1 cursor-pointer"
                    >
                      <Calendar className="h-4 w-4" />
                      <span>My Bookings</span>
                    </Link>
                  )}
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setIsOpen(false)}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-200 hover:bg-slate-800 rounded-md transition-colors mb-1 cursor-pointer"
                    >
                      <span>Admin Dashboard</span>
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-900/30 rounded-md transition-colors cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Sign Out Confirmation Dialog */}
      <Dialog
        isOpen={showLogoutDialog}
        onClose={() => setShowLogoutDialog(false)}
        maxWidth="sm"
        position="top"
      >
        <div className="text-center py-6 px-4">
          {/* Title and Message */}
          <h2 className="text-2xl font-bold text-slate-900 mb-3">
            Sign Out?
          </h2>
          <p className="text-slate-600 mb-8 text-sm leading-relaxed">
            Are you sure you want to sign out? You'll need to sign in again to access your bookings.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              variant="outline"
              onClick={() => setShowLogoutDialog(false)}
              className="flex-1 sm:flex-none sm:px-6"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmLogout}
              className="flex-1 sm:flex-none sm:px-6 bg-red-600 text-white hover:bg-red-700"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </Dialog>
    </nav>
  );
}

