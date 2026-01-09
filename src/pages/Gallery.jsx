import React, { useState } from 'react';
import { projects } from '../data/projects';
import { Button } from '../components/ui/Button';
import { cn } from '../utils/cn';
import { MapPin, Calendar, ZoomIn, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const categories = ['All', 'Bathroom', 'Living Room', 'Corridors & Stairs', 'Waterproofing'];

export function Gallery() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedImage, setSelectedImage] = useState(null);

  const filteredProjects = activeFilter === 'All' 
    ? projects 
    : projects.filter(p => p.category === activeFilter);

  return (
    <div className="bg-slate-50 min-h-screen font-sans">

      {/* Filter Section */}
      <section className="sticky top-16 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 py-4 shadow-sm">
        <div className="container mx-auto px-4 overflow-x-auto no-scrollbar">
          <div className="flex space-x-2 md:justify-center min-w-max px-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={cn(
                  "px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300",
                  activeFilter === cat 
                    ? "bg-slate-900 text-white shadow-md scale-105" 
                    : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16 px-4 md:px-8">
        <div className="container mx-auto max-w-7xl">
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence>
              {filteredProjects.map((project) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  key={project.id}
                  className="group relative bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col h-full"
                >
                  {/* Image Container */}
                  <div className="relative aspect-[4/3] overflow-hidden cursor-pointer" onClick={() => setSelectedImage(project)}>
                    {project.type === 'renovation' ? (
                      <div className="relative w-full h-full group-hover:scale-105 transition-transform duration-700">
                        {/* Split view for renovation: 50/50 diagonal or simple side-by-side */}
                         <div className="absolute inset-0 flex">
                            <div className="w-1/2 h-full relative border-r border-white/20">
                              <img src={project.imageBefore} alt="Before" className="w-full h-full object-cover" />
                              <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-md tracking-wider">BEFORE</div>
                            </div>
                            <div className="w-1/2 h-full relative">
                              <img src={project.imageAfter} alt="After" className="w-full h-full object-cover" />
                              <div className="absolute top-3 right-3 bg-green-500/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-md tracking-wider">AFTER</div>
                            </div>
                         </div>
                      </div>
                    ) : (
                      <div className="w-full h-full relative group-hover:scale-105 transition-transform duration-700">
                        <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                      </div>
                    )}
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <Button variant="outline" className="text-black border-white hover:bg-white hover:text-black gap-2">
                        <ZoomIn className="w-4 h-4" /> View Details
                      </Button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="mb-4">
                      <span className="text-xs font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-2 py-1 rounded-md">
                        {project.category}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-slate-600 text-sm mb-6 line-clamp-2 flex-grow">
                      {project.description}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                        <MapPin className="w-3.5 h-3.5" />
                        {project.suburb}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                        <Calendar className="w-3.5 h-3.5" />
                        {project.duration}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-32">
              <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <ZoomIn className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-medium text-slate-900">No projects found</h3>
              <p className="text-slate-500 mt-2">Try adjusting your category filter</p>
              <Button variant="outline" onClick={() => setActiveFilter('All')} className="mt-6">
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-sm"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-5xl w-full max-h-[90vh] bg-white rounded-lg overflow-hidden flex flex-col md:flex-row"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Image Side */}
              <div className="w-full md:w-2/3 bg-black flex items-center justify-center overflow-hidden">
                 {selectedImage.type === 'renovation' ? (
                   <div className="grid grid-cols-2 h-full w-full">
                      <div className="relative h-full">
                        <img src={selectedImage.imageBefore} className="w-full h-full object-cover" alt="Before" />
                        <span className="absolute bottom-4 left-4 bg-black/70 text-white text-xs px-2 py-1 rounded">Before</span>
                      </div>
                      <div className="relative h-full">
                        <img src={selectedImage.imageAfter} className="w-full h-full object-cover" alt="After" />
                        <span className="absolute bottom-4 right-4 bg-green-600 text-white text-xs px-2 py-1 rounded">After</span>
                      </div>
                   </div>
                 ) : (
                   <img src={selectedImage.image} alt={selectedImage.title} className="w-full h-full object-contain max-h-[80vh] md:max-h-full" />
                 )}
              </div>

              {/* Content Side */}
              <div className="w-full md:w-1/3 p-8 flex flex-col bg-white">
                <button 
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>

                <div className="mt-4">
                  <span className="text-blue-600 font-bold text-sm uppercase tracking-wider">{selectedImage.category}</span>
                  <h2 className="text-3xl font-bold text-slate-900 mt-2 mb-4">{selectedImage.title}</h2>
                  <p className="text-slate-600 leading-relaxed mb-8">
                    {selectedImage.description}
                  </p>

                  <div className="space-y-4 mb-8">
                    <div className="flex items-center p-3 bg-slate-50 rounded-lg">
                      <MapPin className="w-5 h-5 text-slate-400 mr-3" />
                      <div>
                        <p className="text-xs text-slate-500 uppercase font-bold">Location</p>
                        <p className="text-sm font-medium text-slate-900">{selectedImage.suburb}</p>
                      </div>
                    </div>
                    <div className="flex items-center p-3 bg-slate-50 rounded-lg">
                      <Calendar className="w-5 h-5 text-slate-400 mr-3" />
                      <div>
                        <p className="text-xs text-slate-500 uppercase font-bold">Duration</p>
                        <p className="text-sm font-medium text-slate-900">{selectedImage.duration}</p>
                      </div>
                    </div>
                  </div>

                  <Button className="mt-auto w-full gap-2" onClick={() => window.location.href='/booking'}>
                    Start A Project Like This <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CTA Section */}
      <section className="bg-slate-900 text-white py-20 text-center relative overflow-hidden">
         <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/40 via-slate-900 to-slate-900 pointer-events-none" />
         <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Inspired by our work?</h2>
          <p className="text-slate-400 max-w-xl mx-auto mb-8 text-lg">
            Let's discuss how we can transform your space into something extraordinary.
          </p>
          <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100 px-8 h-14 text-lg">
            Get a Free Quote
          </Button>
        </div>
      </section>
    </div>
  );
}
