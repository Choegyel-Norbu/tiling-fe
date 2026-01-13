import React from 'react';
import { Link } from 'react-router-dom';
import { Hammer, MapPin, Phone, Mail, Facebook, Instagram } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-primary text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Company Info */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-accent p-1 rounded-md">
                <Hammer className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-xl text-white tracking-tight">Himalayan Tiling</span>
            </div>
            <p className="text-sm leading-relaxed mb-4">
              Professional tiling and household services across Australia. Quality craftsmanship, guaranteed.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-accent transition-colors"><Facebook className="h-5 w-5" /></a>
              <a href="#" className="hover:text-accent transition-colors"><Instagram className="h-5 w-5" /></a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/services#tiling-renovation" className="hover:text-accent transition-colors">Tiling and Renovation</Link></li>
              <li><Link to="/services#waterproofing" className="hover:text-accent transition-colors">Waterproofing</Link></li>
              <li><Link to="/services#screeding" className="hover:text-accent transition-colors">Screeding</Link></li>
              <li><Link to="/services#grouting" className="hover:text-accent transition-colors">Grouting</Link></li>
              <li><Link to="/services#vinyl-hybrid-flooring" className="hover:text-accent transition-colors">Vinyls and Hybrid Flooring</Link></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="hover:text-accent transition-colors">About Us</Link></li>
              <li><Link to="/gallery" className="hover:text-accent transition-colors">Our Work</Link></li>
              <li><Link to="/reviews" className="hover:text-accent transition-colors">Reviews</Link></li>
              <li><Link to="/contact" className="hover:text-accent transition-colors">Contact</Link></li>
              <li><Link to="/admin" className="hover:text-accent transition-colors">Admin Login</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-accent shrink-0" />
                <span>Perth Western Australia</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-accent shrink-0" />
                <a href="tel:+61451270951" className="hover:text-accent">0451 270 951</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-accent shrink-0" />
                <a href="mailto:info@himalayantiling.com.au" className="hover:text-accent">info@himalayantiling.com.au</a>
              </li>
            </ul>
            <div className="mt-6 pt-6 border-t border-slate-700 text-xs text-slate-500">
              <p>ABN: 12 345 678 901</p>
              <p>Lic: 123456C</p>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-slate-800 text-center text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} Himalayan Tiling. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

