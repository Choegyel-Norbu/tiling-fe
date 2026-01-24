import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Clock, Hammer, ArrowRight, X, ChevronRight, Star } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { services } from '../data/services';
import tiling2Image from '../assets/images/tiling2 (2).jpeg';
import { SEO, SEO_CONFIG } from '../components/utils/SEO';

// Service image mapping
const serviceImages = {
  'tiling-renovation': tiling2Image,
  'waterproofing': '/waterproofing.jpeg',
  'screeding': '/bathroom1.jpeg',
  'grouting': '/bathroom2.jpeg',
  'vinyl-hybrid-flooring': '/livingroom1.jpeg',
};

const ServiceSection = ({ service, index, setPreviewImage }) => {
  const isEven = index % 2 === 0;

  return (
    <div 
      id={service.id}
      className="scroll-mt-32 py-12 lg:py-24 border-b border-slate-100 last:border-0"
    >
      <div className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 lg:gap-20 items-center`}>
        {/* Image Column */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="w-full lg:w-1/2"
        >
          <div 
            className="relative group cursor-pointer overflow-hidden rounded-2xl shadow-xl shadow-slate-200/50"
            onClick={() => setPreviewImage(serviceImages[service.id])}
          >
            <div className="aspect-[4/3] lg:aspect-[16/11] bg-slate-100 overflow-hidden">
              {serviceImages[service.id] ? (
                <img 
                  src={serviceImages[service.id]} 
                  alt={service.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-slate-300">
                  <service.icon className="w-20 h-20" />
                </div>
              )}
            </div>
            
            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
              <span className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium text-slate-900 shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                View Gallery
              </span>
            </div>
          </div>
        </motion.div>

        {/* Content Column */}
        <motion.div 
          initial={{ opacity: 0, x: isEven ? 20 : -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full lg:w-1/2"
        >
          <div className="flex items-center gap-3 mb-6">
            <span className="bg-accent/10 text-accent p-2 rounded-lg">
              <service.icon className="w-6 h-6" />
            </span>
            <span className="text-sm font-bold uppercase tracking-wider text-accent">
              Service 0{index + 1}
            </span>
          </div>

          <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-6 leading-tight">
            {service.title}
          </h2>

          <p className="text-sm text-slate-600 mb-8 leading-relaxed">
            {service.description}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
            {/* Specs */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-400" /> Timeline
              </h3>
              <p className="text-sm text-slate-600 font-medium bg-slate-50 px-3 py-2 rounded-lg inline-block">
                {service.timeframe}
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                <Hammer className="w-4 h-4 text-slate-400" /> Materials
              </h3>
              <div className="flex flex-wrap gap-2">
                {service.materials.slice(0, 3).map(m => (
                  <span key={m} className="text-xs font-medium px-2 py-1 bg-slate-50 text-slate-600 rounded-md border border-slate-100">
                    {m}
                  </span>
                ))}
              </div>
            </div>

            <div className="col-span-1 sm:col-span-2 space-y-4">
              <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                <Check className="w-4 h-4 text-slate-400" /> Ideal For
              </h3>
              <div className="flex flex-wrap gap-x-6 gap-y-2">
                {service.useCases.slice(0, 5).map(u => (
                  <span key={u} className="text-sm text-slate-600 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
                    {u}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <Link to={`/booking?service=${service.id}`}>
            <Button size="lg" className="rounded-full pl-8 pr-6 shadow-lg shadow-accent/20 hover:shadow-accent/30 transition-all">
              Book Service <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export function Services() {
  const [previewImage, setPreviewImage] = useState(null);
  const location = useLocation();

  // Scroll to hash handling
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-white">
      <SEO {...SEO_CONFIG.services} />
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 lg:pt-48 lg:pb-32 overflow-hidden bg-slate-900 text-white">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1620626012053-1c1adc32d000?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/0 via-slate-900/50 to-slate-900"></div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto"
          >
            <span className="text-accent font-medium tracking-widest uppercase text-sm mb-4 block">Our Expertise</span>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 tracking-tight">
              Craftsmanship <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">in Every Detail</span>
            </h1>
            <p className="text-slate-300 text-base lg:text-md leading-relaxed max-w-2xl mx-auto">
              From precision tiling to complete bathroom renovations, we bring professional excellence to every project.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Sticky Navigation */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-100 hidden lg:block">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-1 py-4 overflow-x-auto no-scrollbar">
            {services.map((service) => (
              <a
                key={service.id}
                href={`#${service.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(service.id)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-accent hover:bg-slate-50 rounded-full transition-colors whitespace-nowrap"
              >
                {service.title}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Services List */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4">
          {services.map((service, index) => (
            <ServiceSection 
              key={service.id} 
              service={service} 
              index={index} 
              setPreviewImage={setPreviewImage} 
            />
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-slate-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-slate-200/50 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6">
              Ready to Transform Your Space?
            </h2>
            <p className="text-base text-slate-600 mb-10 max-w-2xl mx-auto">
              Book a consultation today and let our team bring your vision to life with precision and care.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/booking">
                <Button size="lg" className="w-full sm:w-auto text-base px-8 py-6 rounded-full shadow-xl shadow-accent/20 bg-black text-white hover:bg-slate-900">
                  Book a Consultation
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" size="lg" className="w-full sm:w-auto text-base px-8 py-6 rounded-full bg-white">
                  Get a Quote
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Image Preview Modal */}
      <AnimatePresence>
        {previewImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
            onClick={() => setPreviewImage(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-7xl w-full max-h-[90vh]"
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={() => setPreviewImage(null)}
                className="absolute -top-12 right-0 p-2 text-white/70 hover:text-white transition-colors"
              >
                <X className="w-8 h-8" />
          </button>
          <img 
                src={previewImage} 
                alt="Service preview" 
                className="w-full h-full object-contain rounded-lg shadow-2xl"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
