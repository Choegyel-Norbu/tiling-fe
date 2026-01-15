import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, User, MessageSquare, Send } from 'lucide-react';
import { Button } from '../ui/Button';
import { isValidAustralianPhone } from '../../utils/phoneValidation';

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

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

    if (Object.keys(newErrors).length === 0) {
      const recipient = 'drdrinchhendorji@gmail.com';
      const subject = encodeURIComponent(formData.subject);
      const body = encodeURIComponent(
        `Name: ${formData.name}\n` +
          `Email: ${formData.email}\n` +
          (formData.phone ? `Phone: ${formData.phone}\n` : '') +
          `\nMessage:\n${formData.message}`,
      );

      window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;
    }
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="grid md:grid-cols-2 gap-12">
        {/* Info */}
        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-8">Get In Touch</h2>
          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="bg-accent/10 p-3 rounded-lg shrink-0">
                <Phone className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900">Phone</h3>
                <p className="text-sm text-slate-600 mb-1">Mon-Fri from 8am to 6pm</p>
                <a
                  href="tel:0451270951"
                  className="text-sm text-accent font-semibold hover:underline"
                >
                  0451 270 951
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-accent/10 p-3 rounded-lg shrink-0">
                <Mail className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900">Email</h3>
                <p className="text-sm text-slate-600 mb-1">We'll respond within 24 hours</p>
                <a
                  href="mailto:drdrinchhendorji@gmail.com"
                  className="text-sm text-accent font-semibold hover:underline"
                >
                  drdrinchhendorji@gmail.com
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-accent/10 p-3 rounded-lg shrink-0">
                <MapPin className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900">Office</h3>
                <p className="text-sm text-slate-600">Perth Western Australia</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-accent/10 p-3 rounded-lg shrink-0">
                <Clock className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900">Operating Hours</h3>
                <p className="text-sm text-slate-600">Monday - Friday: 7:00 AM - 5:00 PM</p>
                <p className="text-sm text-slate-600">Saturday: 8:00 AM - 1:00 PM</p>
                <p className="text-sm text-slate-600">Sunday: Closed</p>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="mt-8 h-80 rounded-xl overflow-hidden relative border-2 border-slate-200 shadow-lg group">
            <iframe
              src={`https://maps.google.com/maps?q=${-31.9523},${115.8613}&hl=en&z=15&output=embed`}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 w-full h-full"
              title="Office Location"
            ></iframe>
            {/* Overlay link to open in Google Maps */}
            <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <a
                href={`https://www.google.com/maps?q=${-31.9523},${115.8613}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/90 backdrop-blur-sm text-slate-900 px-4 py-2 rounded-lg font-semibold text-sm shadow-lg hover:bg-white transition-colors flex items-center gap-2"
              >
                <MapPin className="h-4 w-4 text-accent" />
                Open in Maps
              </a>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-gradient-to-br from-white to-slate-50 p-8 md:p-10 rounded-3xl border border-slate-200/60 shadow-xl shadow-slate-200/50 h-fit">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-accent/10 p-2 rounded-lg">
                <Mail className="h-5 w-5 text-accent" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Send us an Email</h3>
            </div>
            <p className="text-slate-600 text-sm ml-12">
              Fill out the form below and we'll get back to you soon
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <User className="h-4 w-4 text-accent" />
                Full Name
                <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  autoComplete="off"
                  placeholder="Enter your full name"
                  className={`w-full px-4 py-3 pl-11 rounded-xl border-2 transition-all duration-200 bg-white/80 backdrop-blur-sm
                      ${
                        errors.name
                          ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                          : 'border-slate-200 focus:border-accent focus:ring-2 focus:ring-accent/20'
                      }
                      placeholder:text-slate-400 text-slate-900 focus:bg-white`}
                />
                <User
                  className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 ${
                    errors.name ? 'text-red-400' : 'text-slate-400'
                  }`}
                />
              </div>
              {errors.name && (
                <p className="text-red-500 text-xs font-medium flex items-center gap-1 ml-1">
                  <span>•</span> {errors.name}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <Mail className="h-4 w-4 text-accent" />
                Email Address
                <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="off"
                  placeholder="your.email@example.com"
                  className={`w-full px-4 py-3 pl-11 rounded-xl border-2 transition-all duration-200 bg-white/80 backdrop-blur-sm
                      ${
                        errors.email
                          ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                          : 'border-slate-200 focus:border-accent focus:ring-2 focus:ring-accent/20'
                      }
                      placeholder:text-slate-400 text-slate-900 focus:bg-white`}
                />
                <Mail
                  className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 ${
                    errors.email ? 'text-red-400' : 'text-slate-400'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs font-medium flex items-center gap-1 ml-1">
                  <span>•</span> {errors.email}
                </p>
              )}
            </div>

            {/* Phone Field */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <Phone className="h-4 w-4 text-accent" />
                Phone Number
                <span className="text-slate-400 text-xs font-normal">(Optional)</span>
              </label>
              <div className="relative">
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="0451 270 951 or 02 1234 5678"
                  className={`w-full px-4 py-3 pl-11 rounded-xl border-2 transition-all duration-200 bg-white/80 backdrop-blur-sm
                      ${
                        errors.phone
                          ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                          : 'border-slate-200 focus:border-accent focus:ring-2 focus:ring-accent/20'
                      }
                      placeholder:text-slate-400 text-slate-900 focus:bg-white`}
                />
                <Phone
                  className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 ${
                    errors.phone ? 'text-red-400' : 'text-slate-400'
                  }`}
                />
              </div>
              {errors.phone && (
                <p className="text-red-500 text-xs font-medium flex items-center gap-1 ml-1">
                  <span>•</span> {errors.phone}
                </p>
              )}
            </div>

            {/* Subject Field */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <MessageSquare className="h-4 w-4 text-accent" />
                Subject
              </label>
              <div className="relative">
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 pl-11 rounded-xl border-2 border-slate-200 bg-white/80 backdrop-blur-sm
                      focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all duration-200
                      text-slate-900 focus:bg-white appearance-none cursor-pointer"
                >
                  <option>General Inquiry</option>
                  <option>Quote Request</option>
                  <option>Job Application</option>
                </select>
                <MessageSquare className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg
                    className="w-5 h-5 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Message Field */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <MessageSquare className="h-4 w-4 text-accent" />
                Message
                <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={5}
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us about your project or inquiry..."
                className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 bg-white/80 backdrop-blur-sm resize-none
                    ${
                      errors.message
                        ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                        : 'border-slate-200 focus:border-accent focus:ring-2 focus:ring-accent/20'
                    }
                    placeholder:text-slate-400 text-slate-900 focus:bg-white`}
              ></textarea>
              {errors.message && (
                <p className="text-red-500 text-xs font-medium flex items-center gap-1 ml-1">
                  <span>•</span> {errors.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full mt-8 py-4 text-base font-semibold rounded-xl shadow-lg shadow-accent/20 
                  hover:shadow-xl hover:shadow-accent/30 transition-all duration-200 
                  bg-gradient-to-r from-accent to-accent/90 hover:from-accent/90 hover:to-accent"
              size="lg"
            >
              <Send className="h-5 w-5 mr-2 inline" />
              Send Email
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}


