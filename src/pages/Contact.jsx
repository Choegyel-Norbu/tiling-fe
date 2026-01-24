import React from 'react';
import { ContactSection } from '../components/layout/ContactSection';
import { SEO, SEO_CONFIG } from '../components/utils/SEO';

export function Contact() {
  return (
    <div className="bg-white min-h-screen">
      <SEO {...SEO_CONFIG.contact} />
      <ContactSection />
    </div>
  );
}
