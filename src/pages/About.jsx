import React from 'react';
import { Shield, Award, Users, CheckCircle } from 'lucide-react';

export function About() {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <section className="bg-primary text-white py-20 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About TrueLine Tiling</h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
             Building trust through quality craftsmanship and reliable service since 2008.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="md:w-1/2">
               <img 
                 src="https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80&w=1000" 
                 alt="Tiling Team" 
                 className="rounded-lg shadow-xl"
               />
            </div>
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Our Story</h2>
              <div className="space-y-4 text-slate-600 leading-relaxed">
                <p>
                  TrueLine Tiling began with a simple mission: to provide Australian homeowners with tiling services they could actually rely on. 
                  Founded by master tiler John Smith, we grew from a one-man operation to a dedicated team of certified professionals.
                </p>
                <p>
                  We understand that inviting tradespeople into your home requires trust. That's why we prioritize communication, cleanliness, and punctuality just as much as the quality of our tiling.
                </p>
                <p>
                  Over the last 15 years, we've completed over 2,000 projects across Sydney, ranging from small splashback repairs to luxury bathroom renovations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values/Stats */}
      <section className="bg-slate-50 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm text-center">
               <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                 <Shield className="h-8 w-8 text-accent" />
               </div>
               <h3 className="text-xl font-bold mb-2">Licensed & Insured</h3>
               <p className="text-slate-600">
                 Fully licensed (Lic: 123456C) and carrying $20M Public Liability Insurance for your peace of mind.
               </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm text-center">
               <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                 <Award className="h-8 w-8 text-accent" />
               </div>
               <h3 className="text-xl font-bold mb-2">Quality Guarantee</h3>
               <p className="text-slate-600">
                 We stand by our work with a 7-year workmanship warranty on all waterproofing and tiling.
               </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm text-center">
               <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                 <Users className="h-8 w-8 text-accent" />
               </div>
               <h3 className="text-xl font-bold mb-2">Expert Team</h3>
               <p className="text-slate-600">
                 Our team consists of qualified tradespeople, not unskilled subcontractors.
               </p>
            </div>
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-16 text-center">
         <div className="container mx-auto px-4">
           <h2 className="text-2xl font-bold text-slate-900 mb-8">Our Credentials</h2>
           <div className="flex flex-wrap justify-center gap-8 md:gap-16 items-center opacity-70 grayscale hover:grayscale-0 transition-all">
              {/* Mock Logos */}
              <div className="flex items-center gap-2 font-bold text-slate-800 text-xl border-2 border-slate-800 p-2 rounded">
                Housing Industry Association
              </div>
              <div className="flex items-center gap-2 font-bold text-slate-800 text-xl border-2 border-slate-800 p-2 rounded">
                Master Builders
              </div>
              <div className="flex items-center gap-2 font-bold text-slate-800 text-xl border-2 border-slate-800 p-2 rounded">
                SafeWork NSW
              </div>
           </div>
         </div>
      </section>
    </div>
  );
}
