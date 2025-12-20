import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Clock, Award, Shield, ArrowRight, Star, Bath, ChefHat, Grid3X3, Sun, Droplets, Wrench } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { BentoGrid, BentoCard } from '../components/ui/bento-grid';
import CaseStudies from '../components/ui/case-studies';
import GalleryHoverCarousel from '../components/ui/gallery-hover-carousel';
import { reviews } from '../data/reviews';
import { projects } from '../data/projects';
import tilingImage from '../assets/images/tiling.jpg';

const features = [
  {
    Icon: Bath,
    name: "Bathroom Tiling",
    description: "Complete bathroom renovations and waterproofing from floor to ceiling.",
    href: "/services#bathroom",
    cta: "View Service",
    background: <img src="https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?q=80&w=1000&auto=format&fit=crop" className="absolute -right-20 -top-20 opacity-60 w-full h-full object-cover" alt="Bathroom" />,
    className: "lg:row-start-1 lg:row-end-4 lg:col-start-2 lg:col-end-3",
  },
  {
    Icon: ChefHat,
    name: "Kitchen Splashbacks",
    description: "Modern splashbacks to protect and style your cooking space.",
    href: "/services#kitchen",
    cta: "View Service",
    background: <img src="https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?q=80&w=1000&auto=format&fit=crop" className="absolute -right-20 -top-20 opacity-60 w-full h-full object-cover" alt="Kitchen" />,
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3",
  },
  {
    Icon: Grid3X3,
    name: "Floor Tiling",
    description: "Durable living area floors.",
    href: "/services#floor",
    cta: "View Service",
    background: <img src="https://images.unsplash.com/photo-1484154218962-a1c002085d2f?q=80&w=1000&auto=format&fit=crop" className="absolute -right-20 -top-20 opacity-60 w-full h-full object-cover" alt="Floor" />,
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4",
  },
  {
    Icon: Sun,
    name: "Outdoor & Pools",
    description: "Slip-resistant outdoor paving.",
    href: "/services#outdoor",
    cta: "View Service",
    background: <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1000&auto=format&fit=crop" className="absolute -right-20 -top-20 opacity-60 w-full h-full object-cover" alt="Outdoor" />,
    className: "lg:col-start-3 lg:col-end-3 lg:row-start-1 lg:row-end-2",
  },
  {
    Icon: Droplets,
    name: "Waterproofing",
    description: "Certified leak prevention.",
    href: "/services#waterproofing",
    cta: "View Service",
    background: <img src="https://images.unsplash.com/photo-1621905252507-b35492cc74b4?q=80&w=1000&auto=format&fit=crop" className="absolute -right-20 -top-20 opacity-60 w-full h-full object-cover" alt="Waterproofing" />,
    className: "lg:col-start-3 lg:col-end-3 lg:row-start-2 lg:row-end-4",
  },
];

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
            
            <p className="text-lg md:text-xl text-slate-200 mb-10 leading-relaxed max-w-2xl font-light">
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

      {/* Services Section - Bento Grid */}
      <section className="py-16 md:py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Our Services</h2>
            <p className="text-slate-600 text-lg">
              From minor repairs to full renovations, we deliver quality that stands the test of time.
            </p>
          </div>

          <BentoGrid className="lg:grid-rows-3">
            {features.map((feature) => (
              <BentoCard key={feature.name} {...feature} />
            ))}
          </BentoGrid>
          
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
      <CaseStudies />

      {/* Featured Projects */}
      <GalleryHoverCarousel 
        items={projects.map(p => ({
          id: p.id,
          title: p.title,
          summary: p.description + " Located in " + p.suburb + ". Duration: " + p.duration,
          url: "/gallery",
          image: p.imageAfter
        }))}
      />

      {/* Reviews */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Client Feedback</h2>
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
          <h2 className="text-2xl font-bold mb-6">Ready to transform your space?</h2>
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

