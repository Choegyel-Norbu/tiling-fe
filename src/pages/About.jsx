import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Link } from 'react-router-dom';
import { ContactSection } from '../components/layout/ContactSection';

export function About() {
  const team = [
    {
      name: "Rinchen Dorji",
      role: "Lead Tiler",
      image: "/leadtiler.jpeg",
      bio: "Lead tiler with extensive hands-on experience across residential and commercial projects."
    },
    {
      name: "Tandin Norbu",
      role: "Tiler",
      image: "/leadtiling1.jpeg",
      bio: "Detail-focused tiler specialising in waterproofing and precise finishes."
    },
    {
      name: "Tshering",
      role: "Tiler",
      image: "/tiling1.jpeg",
      bio: "Experienced tiler dedicated to clean lines and durable workmanship."
    }
  ];

  return (
    <div className="bg-white min-h-screen font-sans text-slate-900">
      
      {/* 1. Hero / Header Section */}
      <section className="pt-10 pb-16 md:pt-22 md:pb-24 text-center px-4 max-w-5xl mx-auto">
        <div className="flex items-center justify-center gap-2 mb-6">
            <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm font-medium text-slate-600">
                <span className="mr-2 h-2 w-2 rounded-full bg-accent"></span>
                Our team
            </span>
        </div>
        
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 mb-6 leading-[1.1]">
          We’ve got an <span className="relative inline-block text-accent">
            entire team
            <svg className="absolute w-full h-3 -bottom-1 left-0 text-accent/20" viewBox="0 0 100 10" preserveAspectRatio="none">
                 <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="3" fill="none" />
            </svg>
          </span> dedicated to building your dream space.
        </h1>
        
        <p className="text-sm md:text-base text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
          From master tilers to project managers, get the support you need for your renovation journey. We're here to help you transform your home.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/booking">
            <Button size="lg" className="h-12 px-8 text-base bg-slate-900 text-white hover:bg-slate-800 rounded-full">
              Book a consultation
            </Button>
          </Link>
          <Button
            variant="outline"
            size="lg"
            className="h-12 px-8 text-base border-slate-300 text-slate-700 hover:bg-slate-50 rounded-full"
            onClick={() => {
              const el = document.getElementById('about-contact');
              if (el) {
                el.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            Get in touch
          </Button>
        </div>
      </section>

      {/* 2. Team Carousel Section */}
      <section className="py-12 border-y border-slate-100 bg-slate-50/50">
        <div className="container mx-auto px-4">
           {/* Team Members - Centered and Smaller */}
           <div className="flex flex-wrap justify-center gap-8 md:gap-12">
              {team.map((member, index) => (
                 <div key={index} className="relative bg-white w-full max-w-[240px] aspect-[4/5] flex flex-col justify-end shadow-sm">
                    <img 
                      src={member.image} 
                      alt={member.name}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="relative z-10 bg-white p-3 m-3 shadow-sm border border-slate-100 rounded-lg">
                       <h3 className="font-bold text-slate-900 text-sm">{member.name}</h3>
                       <p className="text-accent text-sm font-medium">{member.role}</p>
                    </div>
                 </div>
              ))}
           </div>
        </div>
      </section>

      {/* 3. Contact & Form Section (shared with Contact page) */}
      <section id="about-contact" className="bg-white">
        <ContactSection />
      </section>

    </div>
  );
}
