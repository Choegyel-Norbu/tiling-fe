import React, { useState, useRef, useEffect } from 'react';
import { projects } from '../data/projects';
import { Button } from '../components/ui/Button';
import { cn } from '../utils/cn';
import { MapPin, Calendar, ZoomIn, ArrowRight, Play, X, Pause, Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useScreenSize } from '../hooks/use-screen-size';

const categories = ['All', 'Video', 'Shorts', 'Bathroom', 'Living Room', 'Corridors & Stairs', 'Waterproofing'];

const videos = [
  {
    id: 'video-1',
    title: 'Bathroom Renovation Process',
    description: 'See how we transform bathrooms with precision tiling and waterproofing',
    videoUrl: 'https://mj2duw9tdo.ufs.sh/f/BgASbCYvfENuUVcwkdLsOEefHAPda8cKo2nuRbytjVBxZF0T',
    thumbnail: null,
  },
  {
    id: 'video-2',
    title: 'Flooring Installation',
    description: 'Professional installation of luxury vinyl and hybrid flooring',
    videoUrl: 'https://mj2duw9tdo.ufs.sh/f/BgASbCYvfENuVNwKnZrzDiOQq2J7SCp5LuB6dxg4WPNRbTKs',
    thumbnail: null,
  },
  {
    id: 'video-3',
    title: 'Complete Home Transformation',
    description: 'From start to finish - a complete home renovation journey',
    videoUrl: 'https://mj2duw9tdo.ufs.sh/f/BgASbCYvfENudB8EgeZcbpMF6hwnt0PKvBoeL1imS3RXjrgy',
    thumbnail: null,
  },
  {
    id: 'video-4',
    title: 'Project Showcase',
    description: 'Watch our latest tiling and renovation work in action',
    videoUrl: 'https://mj2duw9tdo.ufs.sh/f/BgASbCYvfENuUVcwkdLsOEefHAPda8cKo2nuRbytjVBxZF0T',
    thumbnail: null,
  },
  {
    id: 'video-5',
    title: 'Tiling Excellence',
    description: 'Showcasing our professional tiling techniques and craftsmanship',
    videoUrl: 'https://mj2duw9tdo.ufs.sh/f/BgASbCYvfENuHFLy6MlLA2X1PZpQ3uF8kr6aUo0NICvVyOeE',
    thumbnail: null,
  }
];

export function Gallery() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [currentShortIndex, setCurrentShortIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRefs = useRef([]);
  const shortsContainerRef = useRef(null);
  const screenSize = useScreenSize();
  const isMobile = screenSize.lessThan('md');

  const filteredProjects = activeFilter === 'All' 
    ? projects 
    : activeFilter === 'Video' || activeFilter === 'Shorts'
    ? []
    : projects.filter(p => p.category === activeFilter);
  
  const showVideos = activeFilter === 'Video' || activeFilter === 'All';
  const showShorts = activeFilter === 'Shorts';

  // Prevent body scroll when shorts are active
  useEffect(() => {
    if (showShorts) {
      // Disable body scroll
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      
      // Scroll to top
      window.scrollTo(0, 0);
    } else {
      // Re-enable body scroll
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    }
    
    return () => {
      // Cleanup on unmount
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, [showShorts]);

  // Auto-play current short when index changes
  useEffect(() => {
    if (showShorts && videoRefs.current[currentShortIndex]) {
      // Pause all videos
      videoRefs.current.forEach((video) => {
        if (video) video.pause();
      });
      // Play current video
      setTimeout(() => {
        if (videoRefs.current[currentShortIndex]) {
          videoRefs.current[currentShortIndex].play().catch(() => {
            // Autoplay blocked, user interaction required
            setIsPlaying(false);
          });
        }
      }, 300);
    }
  }, [currentShortIndex, showShorts]);

  return (
    <div className="bg-slate-50 min-h-screen font-sans">

      {/* Filter Section */}
      <section className={cn(
        "sticky top-16 z-30 py-4 shadow-sm transition-all duration-300",
        showShorts 
          ? "fixed top-0 left-0 right-0 bg-transparent backdrop-blur-md border-b border-white/10 z-50" 
          : "bg-white/80 backdrop-blur-md border-b border-slate-200"
      )}>
        <div className="container mx-auto px-4 overflow-x-auto no-scrollbar">
          <div className="flex space-x-2 md:justify-center min-w-max px-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setActiveFilter(cat);
                  if (cat === 'Shorts') {
                    setCurrentShortIndex(0);
                    setIsPlaying(true);
                  } else {
                    setIsPlaying(false);
                  }
                }}
                className={cn(
                  "px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-0",
                  showShorts
                    ? activeFilter === cat
                      ? "bg-white text-black scale-105" 
                      : "bg-white/20 text-white border border-white/30 hover:bg-white/30 hover:border-white/50"
                    : activeFilter === cat 
                      ? "bg-slate-900 text-white scale-105" 
                      : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* TikTok/Reels Style Shorts Feed */}
      {showShorts && (
        <section className="fixed inset-0 bg-black z-40 overflow-hidden" style={{ top: '64px', height: 'calc(100vh - 64px)' }}>
          <div 
            ref={shortsContainerRef}
            className="relative h-full w-full overflow-y-scroll snap-y snap-mandatory no-scrollbar"
            style={{ scrollSnapType: 'y mandatory' }}
            onScroll={(e) => {
              const container = e.currentTarget;
              const scrollTop = container.scrollTop;
              const containerHeight = container.clientHeight;
              const newIndex = Math.round(scrollTop / containerHeight);
              if (newIndex !== currentShortIndex && newIndex >= 0 && newIndex < videos.length) {
                setCurrentShortIndex(newIndex);
              }
            }}
            onWheel={(e) => {
              // Prevent window scroll when scrolling in shorts container
              e.stopPropagation();
            }}
            onTouchMove={(e) => {
              // Prevent default to stop window scroll
              e.preventDefault();
            }}
          >
            {videos.map((video, index) => (
              <div
                key={video.id}
                className="relative w-full flex items-center justify-center snap-start snap-always"
                style={{ height: 'calc(100vh - 64px)', minHeight: 'calc(100vh - 64px)' }}
              >
                <div className="relative w-full h-full max-w-md mx-auto bg-black" style={{ height: 'calc(100vh - 64px)' }}>
                  {/* Video Player */}
                  <div 
                    className="relative w-full h-full flex items-center justify-center"
                    onClick={() => {
                      const videoEl = videoRefs.current[index];
                      if (videoEl) {
                        if (videoEl.paused) {
                          videoEl.play();
                          setIsPlaying(true);
                        } else {
                          videoEl.pause();
                          setIsPlaying(false);
                        }
                      }
                    }}
                  >
                    <video
                      ref={(el) => (videoRefs.current[index] = el)}
                      src={video.videoUrl}
                      className="w-full h-full object-cover"
                      loop
                      muted={isMuted}
                      playsInline
                      onPlay={() => {
                        if (index === currentShortIndex) setIsPlaying(true);
                      }}
                      onPause={() => {
                        if (index === currentShortIndex) setIsPlaying(false);
                      }}
                    />
                    
                    {/* Play/Pause Overlay */}
                    {!isPlaying && index === currentShortIndex && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none"
                      >
                        <div className="w-20 h-20 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center border-2 border-white/30">
                          <Play className="w-10 h-10 text-white ml-1" fill="white" />
                        </div>
                      </motion.div>
                    )}

                    {/* Video Info Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-6 pb-8 pointer-events-none">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-white font-bold text-lg md:text-xl mb-2 line-clamp-2">
                            {video.title}
                          </h3>
                          <p className="text-white/80 text-sm md:text-base line-clamp-2">
                            {video.description}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Controls */}
                    <div className="absolute right-4 bottom-32 flex flex-col gap-4 z-10">
                      {/* Mute/Unmute */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const newMuted = !isMuted;
                          setIsMuted(newMuted);
                          videoRefs.current.forEach((videoEl) => {
                            if (videoEl) videoEl.muted = newMuted;
                          });
                        }}
                        className="w-12 h-12 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center border-2 border-white/30 hover:bg-black/80 transition-colors"
                      >
                        {isMuted ? (
                          <VolumeX className="w-5 h-5 text-white" />
                        ) : (
                          <Volume2 className="w-5 h-5 text-white" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Scroll Indicator */}
          <div className="fixed right-4 top-1/2 transform -translate-y-1/2 z-20 flex flex-col gap-2 pointer-events-none md:pointer-events-auto">
            {videos.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentShortIndex(index);
                  const container = shortsContainerRef.current;
                  if (container) {
                    const containerHeight = container.clientHeight;
                    container.scrollTo({
                      top: index * containerHeight,
                      behavior: 'smooth'
                    });
                  }
                }}
                className={cn(
                  "w-1.5 rounded-full transition-all duration-300",
                  index === currentShortIndex 
                    ? "h-12 bg-white" 
                    : "h-6 bg-white/40 hover:bg-white/60"
                )}
              />
            ))}
          </div>
        </section>
      )}

      {/* Gallery Grid */}
      {!showShorts && (
      <section className="py-16 px-4 md:px-8">
        <div className="container mx-auto max-w-7xl">
          {/* Mobile YouTube-style Video Layout */}
          {isMobile && showVideos && videos.length > 0 && (
            <div className={cn("mb-8", activeFilter === 'Video' && "mb-0")}>
              {activeFilter === 'All' && (
                <h2 className="text-2xl font-bold text-slate-900 mb-6 px-2">Videos</h2>
              )}
              <div className="space-y-4">
                {videos.map((video) => (
                  <motion.div
                    key={video.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => setSelectedVideo(video)}
                  >
                    <div className="flex gap-3">
                      {/* Thumbnail */}
                      <div className="relative flex-shrink-0 w-40 h-24 bg-slate-900 rounded-lg overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                          <div className="w-12 h-12 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center border-2 border-white/30">
                            <Play className="w-6 h-6 text-white ml-0.5" fill="white" />
                          </div>
                        </div>
                        {/* Video Badge */}
                        <div className="absolute bottom-1 right-1 bg-black/80 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                          VIDEO
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 py-2 pr-3 flex flex-col justify-center min-w-0">
                        <h3 className="text-sm font-semibold text-slate-900 line-clamp-2 mb-1">
                          {video.title}
                        </h3>
                        <p className="text-xs text-slate-500 line-clamp-2">
                          {video.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Projects Grid - Hidden on mobile when showing videos separately */}
          {!(isMobile && activeFilter === 'Video') && (
            <motion.div 
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              <AnimatePresence>
                {/* Projects */}
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

              {/* Videos - Desktop/Tablet Grid View */}
              {showVideos && !isMobile && videos.map((video) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  key={video.id}
                  className="group relative bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col h-full"
                >
                  {/* Video Container */}
                  <div className="relative aspect-[4/3] overflow-hidden cursor-pointer bg-slate-900" onClick={() => setSelectedVideo(video)}>
                    <div className="w-full h-full relative group-hover:scale-105 transition-transform duration-700">
                      <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                        <div className="relative">
                          <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/30 transition-colors">
                            <Play className="w-10 h-10 text-white ml-1" fill="white" />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <Button variant="outline" className="text-black border-white hover:bg-white hover:text-black gap-2">
                        <Play className="w-4 h-4" fill="currentColor" /> Play Video
                      </Button>
                    </div>
                    
                    {/* Video Badge */}
                    <div className="absolute top-3 right-3 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-md tracking-wider">
                      VIDEO
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="mb-4">
                      <span className="text-xs font-bold text-red-600 uppercase tracking-wider bg-red-50 px-2 py-1 rounded-md">
                        Video
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-red-600 transition-colors">
                      {video.title}
                    </h3>
                    <p className="text-slate-600 text-sm mb-6 line-clamp-2 flex-grow">
                      {video.description}
                    </p>
                  </div>
                </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}

          {filteredProjects.length === 0 && activeFilter !== 'Video' && !(isMobile && activeFilter === 'Video') && (
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

          {activeFilter === 'Video' && videos.length === 0 && (
            <div className="text-center py-32">
              <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Play className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-medium text-slate-900">No videos available</h3>
              <p className="text-slate-500 mt-2">Check back soon for video content</p>
            </div>
          )}
        </div>
      </section>
      )}

      {/* Lightbox Modal for Images */}
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
                  <X className="w-5 h-5" />
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

      {/* Video Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-sm"
            onClick={() => setSelectedVideo(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-6xl w-full max-h-[90vh] bg-black rounded-lg overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setSelectedVideo(null)}
                className="absolute top-4 right-4 z-10 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors backdrop-blur-sm"
                aria-label="Close video"
              >
                <X className="w-6 h-6 text-white" />
              </button>

              <div className="relative w-full aspect-video bg-black">
                <video 
                  src={selectedVideo.videoUrl}
                  controls
                  autoPlay
                  className="w-full h-full"
                  style={{ maxHeight: '90vh' }}
                >
                  Your browser does not support the video tag.
                </video>
              </div>

              <div className="p-6 bg-slate-900 text-white">
                <div className="mb-2">
                  <span className="text-xs font-bold text-red-500 uppercase tracking-wider">Video</span>
                </div>
                <h2 className="text-2xl font-bold mb-2">{selectedVideo.title}</h2>
                <p className="text-slate-300 text-sm">{selectedVideo.description}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CTA Section */}
      {!showShorts && (
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
      )}
    </div>
  );
}
