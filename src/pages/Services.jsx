import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Check, Clock, Hammer, ArrowRight, X } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Dialog } from '../components/ui/Dialog';
import { services } from '../data/services';
import tiling2Image from '../assets/images/tiling2 (2).jpeg';
import tiling3Image from '../assets/images/tiling3.jpeg';

export function Services() {
  const [previewImage, setPreviewImage] = useState(null);
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        // Add a small delay to ensure layout is stable and to override ScrollToTop if needed
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }
  }, [location]);

  return (
    <div className="flex flex-col w-full">
      

      {/* Services List */}
      <section className="py-8 lg:py-16 bg-slate-50">
        <div className="container mx-auto px-4 space-y-6 lg:space-y-24">
          {services.map((service, index) => (
            <div 
              key={service.id} 
              id={service.id}
              className={`scroll-mt-24 group flex flex-col ${index % 2 === 0 ? 'lg:flex-row-reverse' : 'lg:flex-row'} lg:gap-12 lg:items-start bg-white lg:bg-transparent rounded-2xl shadow-sm lg:shadow-none border border-slate-200 lg:border-none overflow-hidden`}
            >
              {/* Image Section */}
              <div className="lg:w-1/2 w-full bg-slate-100 lg:bg-transparent">
                {service.id === 'tiling-renovation' ? (
                  <div className="grid grid-cols-2 gap-1 lg:gap-3 h-full">
                    <div 
                      className="aspect-[4/3] lg:aspect-video lg:rounded-xl overflow-hidden shadow-none lg:shadow-lg relative cursor-pointer"
                      onClick={() => setPreviewImage(tiling2Image)}
                    >
                      <img 
                        src={tiling2Image} 
                        alt="Tiling and renovation work" 
                        className="w-full h-full object-cover lg:group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                    </div>
                    <div 
                      className="aspect-[4/3] lg:aspect-video lg:rounded-xl overflow-hidden shadow-none lg:shadow-lg relative cursor-pointer"
                      onClick={() => setPreviewImage(tiling3Image)}
                    >
                      <img 
                        src={tiling3Image} 
                        alt="Tiling and renovation work" 
                        className="w-full h-full object-cover lg:group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                    </div>
                  </div>
                ) : (
                  <div className="aspect-video w-full lg:rounded-xl overflow-hidden shadow-none lg:shadow-lg relative bg-slate-200">
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-100 text-slate-400">
                      <span className="flex items-center gap-2">
                        <service.icon className="h-12 w-12 opacity-20" />
                        <span className="sr-only">Image for {service.title}</span>
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="lg:w-1/2 p-6 lg:p-0">
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-accent/10 p-3 rounded-lg shrink-0">
                    <service.icon className="h-6 w-6 lg:h-8 lg:w-8 text-accent" />
                  </div>
                  <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 leading-tight">{service.title}</h2>
                </div>
                
                {/* <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                  {service.description}
                </p> */}

                <div className="grid sm:grid-cols-2 gap-6 lg:gap-8 mb-8">
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2 text-sm lg:text-base">
                      <Check className="h-4 w-4 text-accent" /> Ideal For
                    </h3>
                    <ul className="space-y-2 text-sm text-slate-600">
                      {service.useCases.slice(0, 4).map((useCase) => (
                        <li key={useCase} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                          {useCase}
                        </li>
                      ))}
                      {service.useCases.length > 4 && (
                        <li className="text-xs text-slate-400 pl-3.5">+ {service.useCases.length - 4} more</li>
                      )}
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2 text-sm lg:text-base">
                      <Hammer className="h-4 w-4 text-accent" /> Materials
                    </h3>
                    <ul className="space-y-2 text-sm text-slate-600">
                      {service.materials.map((material) => (
                        <li key={material} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                          {material}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center bg-slate-50 lg:bg-white p-4 rounded-lg border border-slate-100 lg:border-slate-200 shadow-sm mb-6 w-full">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Clock className="h-5 w-5 text-accent shrink-0" />
                    <span className="font-medium text-sm lg:text-base">Typical Timeline:</span>
                    <span className="text-sm lg:text-base">{service.timeframe}</span>
                  </div>
                </div>

                <Link to={`/booking?service=${service.id}`} className="block">
                  <Button size="lg" className="w-full sm:w-auto shadow-md lg:shadow-none">
                    Book {service.title} <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">Not sure what you need?</h2>
          <p className="text-slate-300 mb-8">
            Contact us for a free consultation and we'll help you find the right solution.
          </p>
          <Link to="/contact">
            <Button variant="outline" className="border-white text-black hover:bg-white hover:text-slate-900">
              Contact Us
            </Button>
          </Link>
        </div>
      </section>

      {/* Image Preview Modal */}
      <Dialog
        isOpen={!!previewImage}
        onClose={() => setPreviewImage(null)}
        maxWidth="full"
        showCloseButton={false}
      >
        <div className="relative">
          <button
            onClick={() => setPreviewImage(null)}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
            aria-label="Close preview"
          >
            <X className="h-5 w-5" />
          </button>
          <img 
            src={previewImage || ''} 
            alt="Tiling and renovation work preview" 
            className="w-full h-auto max-h-[90vh] object-contain rounded-lg"
          />
        </div>
      </Dialog>
    </div>
  );
}
