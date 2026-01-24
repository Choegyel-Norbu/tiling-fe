import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Clock, Award, Shield, ArrowRight, Star, Grid3X3, Droplets, Layers, Paintbrush, Square } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { BentoGrid, BentoCard } from '../components/ui/bento-grid';
import CaseStudies from '../components/ui/case-studies';
import GalleryHoverCarousel from '../components/ui/gallery-hover-carousel';
import { PixelTrail } from '../components/ui/pixel-trail';
import { RetroGrid } from '../components/ui/retro-grid';
import { StaggerTestimonials } from '../components/ui/stagger-testimonials';
import { useScreenSize } from '../hooks/use-screen-size';
import { reviews } from '../data/reviews';
import { projects } from '../data/projects';
import { SEO, SEO_CONFIG } from '../components/utils/SEO';

const features = [
  {
    Icon: Grid3X3,
    name: "Tiling and Renovation",
    description: "Complete tiling and renovation services for all interior spaces with expert installation.",
    href: "/services#tiling-renovation",
    cta: "View Service",
    background: <img src="/bathroom1.jpeg" className="absolute inset-0 opacity-60 w-full h-full object-cover" alt="Tiling and Renovation" />,
    className: "lg:row-start-1 lg:row-end-4 lg:col-start-2 lg:col-end-3",
  },
  {
    Icon: Droplets,
    name: "Waterproofing",
    description: "Certified waterproofing services to prevent leaks and structural damage.",
    href: "/services#waterproofing",
    cta: "View Service",
    background: <img src="/waterproofing.jpeg" className="absolute inset-0 opacity-60 w-full h-full object-cover" alt="Waterproofing" />,
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3",
  },
  {
    Icon: Layers,
    name: "Screeding",
    description: "Professional floor screeding for level, smooth surfaces ready for installation.",
    href: "/services#screeding",
    cta: "View Service",
    background: <img src="/corridors.jpeg" className="absolute inset-0 opacity-60 w-full h-full object-cover" alt="Screeding" />,
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4",
  },
  {
    Icon: Paintbrush,
    name: "Grouting",
    description: "Expert grouting services including new installations and restoration.",
    href: "/services#grouting",
    cta: "View Service",
    background: <img src="/bathroom3.jpeg" className="absolute inset-0 opacity-60 w-full h-full object-cover" alt="Grouting" />,
    className: "lg:col-start-3 lg:col-end-3 lg:row-start-1 lg:row-end-2",
  },
  {
    Icon: Square,
    name: "Vinyls and Hybrid Flooring",
    description: "Professional installation of luxury vinyl planks and hybrid flooring solutions.",
    href: "/services#vinyl-hybrid-flooring",
    cta: "View Service",
    background: <img src="/livingroom.jpeg" className="absolute inset-0 opacity-60 w-full h-full object-cover" alt="Vinyls and Hybrid Flooring" />,
    className: "lg:col-start-3 lg:col-end-3 lg:row-start-2 lg:row-end-4",
  },
];

export function Home() {
  const screenSize = useScreenSize();

  return (
    <div className="flex flex-col w-full">
      <SEO {...SEO_CONFIG.home} />
      {/* Hero Section */}
      <section className="relative h-[85vh] min-h-[600px] flex items-center overflow-hidden bg-white">
        {/* Retro Grid Background */}
        <div className="absolute inset-0 z-0">
          <RetroGrid angle={65} />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/30 text-accent font-semibold text-sm mb-8 backdrop-blur-sm">
              <Star className="w-4 h-4 fill-current" />
              <span>#1 Rated Tiling Specialists in Perth</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 mb-6 leading-tight tracking-tight">
              Himalayan Tiling <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-yellow-600">
                Masterfully Crafted
              </span>
            </h1>
            
            <p className="text-sm text-slate-600 mb-10 leading-relaxed max-w-2xl font-light">
              Transform your home with Australia's most trusted tiling experts. 
              From luxury bathroom renovations to durable outdoor paving, we deliver 
              flawless finishes guaranteed to last a lifetime.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/booking">
                <Button size="sm" className="w-full sm:w-auto shadow-lg shadow-accent/20 transition-transform hover:scale-105 bg-accent text-white hover:bg-yellow-600 cursor-pointer">
                  Book a Free Inspection
                </Button>
              </Link>
              <Link to="/gallery">
                <Button variant="outline" size="sm" className="w-full sm:w-auto border-slate-300 text-slate-900 hover:bg-slate-100 hover:text-slate-900 cursor-pointer">
                  View Our Portfolio
                </Button>
              </Link>
            </div>
            
            {/* Trust Indicators */}
            <div className="mt-12 pt-8 border-t border-slate-200 flex flex-wrap gap-8 text-sm font-medium text-slate-700">
              <div className="flex items-center gap-3">
                <Shield className="h-6 w-6 text-accent" />
                <div>
                  <span className="block text-slate-900 font-semibold">Fully Licensed</span>
                  <span className="text-xs text-slate-500">Lic No. 123456C</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Award className="h-6 w-6 text-accent" />
                <div>
                  <span className="block text-slate-900 font-semibold">2+ Years</span>
                  <span className="text-xs text-slate-500">Experience</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-6 w-6 text-accent" />
                <div>
                  <span className="block text-slate-900 font-semibold">1 Year Warranty</span>
                  <span className="text-xs text-slate-500">On All Workmanship</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section - Bento Grid */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Our Services</h2>
            <p className="text-slate-600 text-sm">
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
      {/* <GalleryHoverCarousel 
        items={projects.map(p => ({
          id: p.id,
          title: p.title,
          summary: p.description + " Located in " + p.suburb + ". Duration: " + p.duration,
          url: "/gallery",
          image: p.imageAfter
        }))}
      /> */}

      {/* Reviews */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Client Feedback</h2>
            <p className="text-slate-600">5.0 Average rating based on Google Reviews</p>
          </div>
          <StaggerTestimonials />
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-xl font-bold mb-6">Ready to transform your space?</h2>
          <p className="text-sm text-slate-300 mb-8 max-w-2xl mx-auto">
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

