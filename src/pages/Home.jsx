import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Clock, Award, Shield, ArrowRight, Star } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { services } from '../data/services';
import { reviews } from '../data/reviews';
import { projects } from '../data/projects';
import tilingImage from '../assets/images/tiling.jpg';

export function Home() {
  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative h-[85vh] min-h-[600px] flex items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src={tilingImage} 
            alt="Professional Tiling Work" 
            className="w-full h-full object-cover"
          />
          {/* Professional Gradient Overlay - Improves text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/80 to-transparent"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/20 border border-accent/30 text-accent font-semibold text-sm mb-8 backdrop-blur-sm">
              <Star className="w-4 h-4 fill-current" />
              <span>#1 Rated Tiling Specialists in Sydney</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight tracking-tight">
              Precision Tiling <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-yellow-200">
                Masterfully Crafted
              </span>
            </h1>
            
            <p className="text-sm text-slate-200 mb-10 leading-relaxed max-w-2xl font-light">
              Transform your home with Australia's most trusted tiling experts. 
              From luxury bathroom renovations to durable outdoor paving, we deliver 
              flawless finishes guaranteed to last a lifetime.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/booking">
                <Button size="lg" className="w-full sm:w-auto text-lg px-8 py-4 h-auto shadow-lg shadow-accent/20 transition-transform hover:scale-105">
                  Book a Free Inspection
                </Button>
              </Link>
              <Link to="/gallery">
                <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg px-8 py-4 h-auto border-white/30 text-white hover:bg-white hover:text-slate-900 backdrop-blur-sm">
                  View Our Portfolio
                </Button>
              </Link>
            </div>
            
            {/* Trust Indicators */}
            <div className="mt-12 pt-8 border-t border-white/10 flex flex-wrap gap-8 text-sm font-medium text-slate-300">
              <div className="flex items-center gap-3">
                <Shield className="h-6 w-6 text-accent" />
                <div>
                  <span className="block text-white font-semibold">Fully Licensed</span>
                  <span className="text-xs opacity-70">Lic No. 123456C</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Award className="h-6 w-6 text-accent" />
                <div>
                  <span className="block text-white font-semibold">15+ Years</span>
                  <span className="text-xs opacity-70">Experience</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-6 w-6 text-accent" />
                <div>
                  <span className="block text-white font-semibold">7 Year Warranty</span>
                  <span className="text-xs opacity-70">On All Workmanship</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 md:py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Our Services</h2>
            <p className="text-slate-600 text-lg">
              From minor repairs to full renovations, we deliver quality that stands the test of time.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div key={service.id} className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow group">
                <div className="bg-accent/10 w-14 h-14 rounded-lg flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
                  <service.icon className="h-7 w-7 text-accent" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{service.title}</h3>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  {service.description}
                </p>
                <Link to="/services" className="inline-flex items-center text-accent font-semibold hover:text-accent/80">
                  Learn more <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Link to="/services">
              <Button variant="outline" size="lg" className="border-accent text-accent hover:bg-accent hover:text-white">
                View All Services
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <img 
                src="https://images.unsplash.com/photo-1584622050111-993a426fbf0a?auto=format&fit=crop&q=80&w=1000" 
                alt="Tiler working" 
                className="rounded-lg shadow-xl"
              />
            </div>
            <div className="lg:w-1/2">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                Why Homeowners Trust TrueLine
              </h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="bg-green-100 p-3 rounded-full h-fit">
                    <Clock className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">On Time, Every Time</h4>
                    <p className="text-slate-600">We respect your time. We show up when we say we will and finish on schedule.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="bg-blue-100 p-3 rounded-full h-fit">
                    <Shield className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">Quality Guaranteed</h4>
                    <p className="text-slate-600">All our work complies with Australian Standards and comes with a 7-year workmanship warranty.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="bg-accent/20 p-3 rounded-full h-fit">
                    <CheckCircle className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">Transparent Pricing</h4>
                    <p className="text-slate-600">No hidden costs. Detailed quotes provided upfront before any work begins.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Recent Transformations</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {projects.slice(0, 3).map((project) => (
              <div key={project.id} className="group overflow-hidden rounded-xl shadow-md">
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={project.imageAfter} 
                    alt={project.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                    <span className="text-white font-medium">View Project Details</span>
                  </div>
                </div>
                <div className="bg-white p-6">
                  <p className="text-sm text-accent font-semibold mb-2">{project.category} • {project.suburb}</p>
                  <h3 className="text-xl font-bold text-slate-900">{project.title}</h3>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/gallery">
              <Button variant="outline">View Full Gallery</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Client Feedback</h2>
            <div className="flex justify-center items-center gap-2 text-yellow-500 mb-2">
              <Star className="fill-current" />
              <Star className="fill-current" />
              <Star className="fill-current" />
              <Star className="fill-current" />
              <Star className="fill-current" />
            </div>
            <p className="text-slate-600">5.0 Average rating based on Google Reviews</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((review) => (
              <div key={review.id} className="bg-slate-50 p-6 rounded-lg border border-slate-100">
                <div className="flex gap-1 text-yellow-500 mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="text-slate-700 italic mb-6">"{review.text}"</p>
                <div>
                  <p className="font-bold text-slate-900">{review.name}</p>
                  <p className="text-xs text-slate-500">{review.suburb} • {review.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to transform your space?</h2>
          <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
            Book a free inspection or get a quote online in under 2 minutes. No obligation.
          </p>
          <Link to="/booking">
            <Button size="lg" className="text-lg px-8">Book a Job Now</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

