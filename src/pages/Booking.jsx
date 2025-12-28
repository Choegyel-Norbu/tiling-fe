import React, { useState } from 'react';
import { BookingForm } from '../components/booking/BookingForm';

export function Booking() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="container mx-auto px-4">
        {!isSubmitted && (
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-slate-900 mb-4">Book a Service</h1>
            <p className="text-sm text-slate-600 max-w-2xl mx-auto">
              Schedule a free inspection or job booking in under 2 minutes. 
              Tell us what you need and we'll take care of the rest.
            </p>
          </div>
        )}
        
        <BookingForm onSubmitted={setIsSubmitted} />
        
        {!isSubmitted && (
          <div className="max-w-3xl mx-auto mt-8 text-center text-sm text-slate-500">
            <p>
              Need help? Call us directly on <a href="tel:0400000000" className="text-accent font-bold">0400 000 000</a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
