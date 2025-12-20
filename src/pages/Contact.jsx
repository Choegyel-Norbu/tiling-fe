import React from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { Button } from '../components/ui/Button';

export function Contact() {
  return (
    <div className="bg-white min-h-screen">
       <section className="bg-primary text-white py-16 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-lg text-slate-300">
            Get in touch for quotes, questions, or advice.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Info */}
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-8">Get In Touch</h2>
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="bg-accent/10 p-3 rounded-lg shrink-0">
                  <Phone className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900">Phone</h3>
                  <p className="text-slate-600 mb-1">Mon-Fri from 8am to 6pm</p>
                  <a href="tel:0400000000" className="text-accent font-semibold text-lg hover:underline">0400 000 000</a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-accent/10 p-3 rounded-lg shrink-0">
                  <Mail className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900">Email</h3>
                  <p className="text-slate-600 mb-1">We'll respond within 24 hours</p>
                  <a href="mailto:info@truelinetiling.com.au" className="text-accent font-semibold hover:underline">info@truelinetiling.com.au</a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-accent/10 p-3 rounded-lg shrink-0">
                  <MapPin className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900">Office</h3>
                  <p className="text-slate-600">
                    123 Trade Street<br />
                    Parramatta NSW 2150<br />
                    Australia
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                 <div className="bg-accent/10 p-3 rounded-lg shrink-0">
                  <Clock className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900">Operating Hours</h3>
                  <p className="text-slate-600">Monday - Friday: 7:00 AM - 5:00 PM</p>
                  <p className="text-slate-600">Saturday: 8:00 AM - 1:00 PM</p>
                  <p className="text-slate-600">Sunday: Closed</p>
                </div>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="mt-8 h-64 bg-slate-200 rounded-xl overflow-hidden relative">
               <div className="absolute inset-0 flex items-center justify-center text-slate-400 font-medium">
                 <MapPin className="h-8 w-8 mr-2" />
                 Map Area (Google Maps Embed)
               </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 h-fit">
            <h3 className="text-2xl font-bold text-slate-900 mb-6">Send us a Message</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                <input type="text" className="w-full rounded-md border-slate-300 shadow-sm focus:border-accent focus:ring-accent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input type="email" className="w-full rounded-md border-slate-300 shadow-sm focus:border-accent focus:ring-accent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                <input type="tel" className="w-full rounded-md border-slate-300 shadow-sm focus:border-accent focus:ring-accent" />
              </div>
               <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
                <select className="w-full rounded-md border-slate-300 shadow-sm focus:border-accent focus:ring-accent">
                  <option>General Inquiry</option>
                  <option>Quote Request</option>
                  <option>Job Application</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Message</label>
                <textarea rows={4} className="w-full rounded-md border-slate-300 shadow-sm focus:border-accent focus:ring-accent"></textarea>
              </div>
              <Button className="w-full" size="lg">Send Message</Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
