import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { PageHeader } from '../components/layout/PageHeader';
import { useAuth } from '../context/AuthContext';
import { isValidAustralianPhone } from '../utils/phoneValidation';

export function Contact() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: ''
  });
  const [errors, setErrors] = useState({});

  // Auto-fill name and email from authenticated user
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+$/i.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (formData.phone && !isValidAustralianPhone(formData.phone)) {
      newErrors.phone = 'Invalid Australian phone number format';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }
    
    setErrors(newErrors);
    
    // If no errors, submit form
    if (Object.keys(newErrors).length === 0) {
      // Handle form submission
      console.log('Contact form submitted:', formData);
    }
  };
  return (
    <div className="bg-white min-h-screen">
       

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
                  <a href="mailto:info@himalayantiling.com.au" className="text-accent font-semibold hover:underline">info@himalayantiling.com.au</a>
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
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full rounded-md border-slate-300 shadow-sm focus:border-accent focus:ring-accent ${errors.name ? 'border-red-500' : ''}`}
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full rounded-md border-slate-300 shadow-sm focus:border-accent focus:ring-accent ${errors.email ? 'border-red-500' : ''}`}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone (Optional)</label>
                <input 
                  type="tel" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="0400 000 000 or 02 1234 5678"
                  className={`w-full rounded-md border-slate-300 shadow-sm focus:border-accent focus:ring-accent ${errors.phone ? 'border-red-500' : ''}`}
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>
               <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
                <select 
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full rounded-md border-slate-300 shadow-sm focus:border-accent focus:ring-accent"
                >
                  <option>General Inquiry</option>
                  <option>Quote Request</option>
                  <option>Job Application</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Message</label>
                <textarea 
                  rows={4} 
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className={`w-full rounded-md border-slate-300 shadow-sm focus:border-accent focus:ring-accent ${errors.message ? 'border-red-500' : ''}`}
                ></textarea>
                {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
              </div>
              <Button type="submit" className="w-full" size="lg">Send Message</Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
