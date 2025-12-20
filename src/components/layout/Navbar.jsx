import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, Hammer, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../ui/Button';
import { cn } from '../../utils/cn';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const location = useLocation();

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
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
              <div className="bg-accent p-1.5 rounded-md">
                <Hammer className="h-6 w-6 text-white" />
              </div>
              <span className="font-bold text-xl text-primary tracking-tight">TrueLine Tiling</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-accent",
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
                  "text-sm font-medium transition-colors hover:text-accent flex items-center gap-1",
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
                          className="block px-4 py-3 text-sm font-medium text-slate-700 hover:bg-accent/5 hover:text-accent transition-colors duration-200 ease-in-out"
                        >
                          {service.name}
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="flex items-center gap-4 ml-4">
              <a href="tel:+61400000000" className="flex items-center gap-2 text-slate-600 hover:text-accent font-medium text-sm">
                <Phone className="h-4 w-4" />
                <span>0400 000 000</span>
              </a>
              <Link to="/booking">
                <Button className="bg-accent text-white hover:bg-yellow-600">Book a Job</Button>
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-slate-500 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-accent"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="pt-2 pb-3 space-y-1 px-4 sm:px-6">
            <Link
              to="/"
              onClick={() => setIsOpen(false)}
              className={cn(
                "block px-3 py-2 rounded-md text-base font-medium",
                isActive('/')
                  ? "bg-accent/10 text-accent"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              Home
            </Link>
            
            {/* Services Dropdown for Mobile */}
            <div>
              <button
                onClick={() => setIsServicesOpen(!isServicesOpen)}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2 rounded-md text-base font-medium",
                  isActive('/services')
                    ? "bg-accent/10 text-accent"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
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
                          className="block px-3 py-2 rounded-md text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all duration-200 ease-in-out"
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
                  "block px-3 py-2 rounded-md text-base font-medium",
                  isActive(link.path)
                    ? "bg-accent/10 text-accent"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-4 border-t border-slate-200 mt-4">
              <a href="tel:+61400000000" className="flex items-center gap-2 text-slate-600 px-3 py-2">
                <Phone className="h-5 w-5" />
                <span className="font-medium">0400 000 000</span>
              </a>
              <div className="mt-3 px-3">
                <Link to="/booking" onClick={() => setIsOpen(false)}>
                  <Button className="w-full bg-accent text-white hover:bg-yellow-600">Book a Job</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

