import React, { useState } from 'react';
import { projects } from '../data/projects';
import { Button } from '../components/ui/Button';
import { cn } from '../utils/cn';
import { MapPin, Calendar, CheckCircle } from 'lucide-react';

const categories = ['All', 'Bathroom', 'Kitchen', 'Outdoor', 'Floor', 'Waterproofing'];

export function Gallery() {
  const [activeFilter, setActiveFilter] = useState('All');

  const filteredProjects = activeFilter === 'All' 
    ? projects 
    : projects.filter(p => p.category === activeFilter);

  return (
    <div className="bg-white min-h-screen">
      

      {/* Filter */}
      <section className="py-8 border-b border-slate-200 sticky top-16 bg-white/95 backdrop-blur z-40 shadow-sm">
        <div className="container mx-auto px-4 overflow-x-auto pb-2 md:pb-0">
          <div className="flex space-x-2 md:justify-center min-w-max">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-colors border",
                  activeFilter === cat 
                    ? "bg-accent text-white border-accent" 
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {filteredProjects.map((project) => (
              <div key={project.id} className="flex flex-col rounded-2xl overflow-hidden border border-slate-100 shadow-lg group">
                {/* Images */}
                <div className="relative aspect-[16/9] md:aspect-[21/9] lg:aspect-[16/9] bg-slate-200 group-hover:shadow-xl transition-shadow">
                  {/* We display After image by default, and a small inset for Before, or a split view */}
                  {/* Split View Approach */}
                  <div className="absolute inset-0 flex">
                    <div className="w-1/2 relative border-r-2 border-white">
                       <img src={project.imageBefore} alt="Before" className="w-full h-full object-cover" />
                       <span className="absolute top-4 left-4 bg-black/70 text-white text-xs font-bold px-2 py-1 rounded">BEFORE</span>
                    </div>
                    <div className="w-1/2 relative">
                       <img src={project.imageAfter} alt="After" className="w-full h-full object-cover" />
                       <span className="absolute top-4 right-4 bg-accent text-white text-xs font-bold px-2 py-1 rounded">AFTER</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 md:p-8 bg-white flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                       <span className="text-accent text-sm font-bold uppercase tracking-wider mb-1 block">{project.category}</span>
                       <h3 className="text-2xl font-bold text-slate-900">{project.title}</h3>
                    </div>
                  </div>
                  
                  <p className="text-slate-600 mb-6 flex-grow">{project.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm text-slate-500 pt-6 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-accent" />
                      <span>{project.suburb}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-accent" />
                      <span>{project.duration}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-20 text-slate-500">
              <p>No projects found in this category.</p>
              <Button variant="ghost" onClick={() => setActiveFilter('All')} className="mt-4">Clear Filters</Button>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-slate-50 py-16 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Like what you see?</h2>
          <Button size="lg" onClick={() => window.location.href='/booking'}>Start Your Project</Button>
        </div>
      </section>
    </div>
  );
}
