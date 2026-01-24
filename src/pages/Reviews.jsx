import React from 'react';
import { Star, Quote } from 'lucide-react';
import { reviews } from '../data/reviews';
import { SEO, SEO_CONFIG } from '../components/utils/SEO';

export function Reviews() {
  return (
    <div className="bg-white min-h-screen">
      <SEO {...SEO_CONFIG.reviews} />
      <section className="bg-secondary text-white py-16 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Client Reviews</h1>
          <div className="flex justify-center items-center gap-2 text-yellow-400 mb-4">
              <Star className="fill-current w-6 h-6" />
              <Star className="fill-current w-6 h-6" />
              <Star className="fill-current w-6 h-6" />
              <Star className="fill-current w-6 h-6" />
              <Star className="fill-current w-6 h-6" />
          </div>
          <p className="text-lg text-slate-300">
            Don't just take our word for it. Here's what our customers say.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reviews.map((review) => (
              <div key={review.id} className="bg-slate-50 p-8 rounded-xl border border-slate-100 relative">
                <Quote className="h-10 w-10 text-accent/20 absolute top-6 right-6" />
                <div className="flex gap-1 text-yellow-500 mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="text-slate-700 italic mb-6 leading-relaxed">"{review.text}"</p>
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center font-bold text-slate-500">
                     {review.name.charAt(0)}
                   </div>
                   <div>
                     <p className="font-bold text-slate-900">{review.name}</p>
                     <p className="text-xs text-slate-500">{review.suburb}</p>
                   </div>
                </div>
              </div>
            ))}
            {/* Mock more reviews to fill grid */}
            {[1, 2, 3].map((i) => (
               <div key={`mock-${i}`} className="bg-slate-50 p-8 rounded-xl border border-slate-100 relative opacity-60">
                <Quote className="h-10 w-10 text-accent/20 absolute top-6 right-6" />
                <div className="flex gap-1 text-yellow-500 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="text-slate-700 italic mb-6 leading-relaxed">"Excellent service and very clean work. Would hire again."</p>
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center font-bold text-slate-500">
                     A
                   </div>
                   <div>
                     <p className="font-bold text-slate-900">Anonymous</p>
                     <p className="text-xs text-slate-500">Perth</p>
                   </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Video Testimonial Placeholder */}
      <section className="py-16 bg-slate-900 text-white text-center">
         <div className="container mx-auto px-4">
           <h2 className="text-2xl font-bold mb-8">Featured Project Story</h2>
           <div className="max-w-3xl mx-auto aspect-video bg-slate-800 rounded-xl flex items-center justify-center border border-slate-700">
              <div className="text-center">
                 <div className="w-16 h-16 rounded-full bg-accent text-white flex items-center justify-center mx-auto mb-4 cursor-pointer hover:bg-yellow-600 transition-colors">
                    <span className="ml-1 text-2xl">▶</span>
                 </div>
                 <p className="text-slate-400">Video Placeholder</p>
              </div>
           </div>
         </div>
      </section>
    </div>
  );
}
