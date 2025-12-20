import React from 'react';
import { Link } from 'react-router-dom';
import { Check, Clock, Hammer, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { services } from '../data/services';

export function Services() {
  return (
    <div className="flex flex-col w-full">
      {/* Hero */}
      <section className="bg-secondary text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Expert Services</h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            We provide a comprehensive range of tiling and household services, delivering quality results for every project size.
          </p>
        </div>
      </section>

      {/* Services List */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4 space-y-24">
          {services.map((service, index) => (
            <div 
              key={service.id} 
              id={service.id}
              className={`flex flex-col ${index % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-12 items-start`}
            >
              {/* Content */}
              <div className="lg:w-1/2">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-accent/10 p-3 rounded-lg">
                    <service.icon className="h-8 w-8 text-accent" />
                  </div>
                  <h2 className="text-3xl font-bold text-slate-900">{service.title}</h2>
                </div>
                
                <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                  {service.description}
                </p>

                <div className="grid sm:grid-cols-2 gap-8 mb-8">
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                      <Check className="h-4 w-4 text-accent" /> Ideal For
                    </h3>
                    <ul className="space-y-2 text-sm text-slate-600">
                      {service.useCases.map((useCase) => (
                        <li key={useCase} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                          {useCase}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
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

                <div className="flex flex-col sm:flex-row gap-4 items-center bg-white p-4 rounded-lg border border-slate-200 shadow-sm mb-6">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Clock className="h-5 w-5 text-accent" />
                    <span className="font-medium">Typical Timeline:</span>
                    <span>{service.timeframe}</span>
                  </div>
                </div>

                <Link to={`/booking?service=${service.id}`}>
                  <Button size="lg" className="w-full sm:w-auto">
                    Book {service.title} <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>

              {/* Image Placeholder */}
              <div className="lg:w-1/2 w-full">
                <div className="aspect-video bg-slate-200 rounded-xl overflow-hidden shadow-lg relative group">
                   {/* In a real app, map these to specific images in the data file */}
                   <div className="absolute inset-0 flex items-center justify-center bg-slate-100 text-slate-400">
                      <span className="flex items-center gap-2">
                        <service.icon className="h-12 w-12 opacity-20" />
                        Image for {service.title}
                      </span>
                   </div>
                </div>
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
            <Button variant="outline" className="border-white text-white hover:bg-white hover:text-slate-900">
              Contact Us
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
