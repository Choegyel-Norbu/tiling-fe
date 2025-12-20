import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Check, ChevronRight, ChevronLeft, Calendar, Upload, MapPin, User, FileText } from 'lucide-react';
import { Button } from '../ui/Button';
import { services } from '../../data/services';
import { cn } from '../../utils/cn';

const steps = [
  { id: 'service', title: 'Service' },
  { id: 'details', title: 'Details' },
  { id: 'schedule', title: 'Schedule' },
  { id: 'contact', title: 'Contact' },
];

export function BookingForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [bookingRef, setBookingRef] = useState('');

  const { register, handleSubmit, watch, setValue, control, formState: { errors, isValid } } = useForm({
    mode: 'onChange',
    defaultValues: {
      serviceId: searchParams.get('service') || '',
      jobSize: 'medium',
      suburb: '',
      postcode: '',
      description: '',
      date: '',
      timeSlot: '',
      name: '',
      email: '',
      phone: '',
      files: null
    }
  });

  const selectedService = watch('serviceId');
  const files = watch('files');

  // Helper to move to next step
  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  const onSubmit = async (data) => {
    console.log('Form Data:', data);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setBookingRef(`TR-${Math.floor(Math.random() * 10000)}`);
    setIsSubmitted(true);
    window.scrollTo(0, 0);
  };

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16 px-4">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check className="h-10 w-10 text-green-600" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-4">Booking Confirmed!</h2>
        <p className="text-lg text-slate-600 mb-8">
          Thank you for choosing TrueLine Tiling. Your booking reference is <span className="font-bold text-slate-900">{bookingRef}</span>.
        </p>
        <div className="bg-slate-50 p-6 rounded-lg text-left max-w-md mx-auto mb-8 border border-slate-200">
          <h3 className="font-semibold mb-4 border-b border-slate-200 pb-2">Next Steps</h3>
          <ul className="space-y-3 text-sm text-slate-600">
            <li className="flex gap-2">
              <span className="bg-slate-200 text-slate-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shrink-0">1</span>
              We have sent a confirmation email to {watch('email')}.
            </li>
            <li className="flex gap-2">
              <span className="bg-slate-200 text-slate-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shrink-0">2</span>
              Our team will review your photos and details within 24 hours.
            </li>
            <li className="flex gap-2">
              <span className="bg-slate-200 text-slate-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shrink-0">3</span>
              We'll call you to confirm the final quote and time.
            </li>
          </ul>
        </div>
        <Button onClick={() => navigate('/')}>Return Home</Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200 my-12">
      {/* Progress Bar */}
      <div className="bg-slate-50 border-b border-slate-200 p-6">
        <div className="flex items-center justify-between relative">
          {steps.map((step, index) => (
            <div key={step.id} className="flex flex-col items-center relative z-10 w-1/4">
              <div 
                className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center text-base font-bold transition-colors duration-200 shadow-sm",
                  index <= currentStep ? "bg-accent text-white" : "bg-slate-200 text-slate-500"
                )}
              >
                {index + 1}
              </div>
              <span className={cn(
                "text-sm mt-3 font-semibold hidden sm:block",
                index <= currentStep ? "text-accent" : "text-slate-400"
              )}>
                {step.title}
              </span>
            </div>
          ))}
          {/* Progress Line */}
          <div className="absolute top-6 left-0 w-full h-1 bg-slate-200 -z-0 hidden sm:block rounded-full" />
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-8 md:p-12">
        
        {/* Step 1: Service Selection */}
        {currentStep === 0 && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Select a Service</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {services.map((service) => (
                <label 
                  key={service.id}
                  className={cn(
                    "relative flex items-start p-6 cursor-pointer rounded-xl border-2 transition-all hover:bg-slate-50 hover:shadow-md",
                    selectedService === service.id ? "border-accent bg-accent/10 shadow-md" : "border-slate-200"
                  )}
                >
                  <input
                    type="radio"
                    value={service.id}
                    {...register('serviceId', { required: true })}
                    className="sr-only"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={cn(
                        "p-2 rounded-lg",
                        selectedService === service.id ? "bg-accent/20" : "bg-slate-100"
                      )}>
                        <service.icon className={cn("h-6 w-6", selectedService === service.id ? "text-accent" : "text-slate-500")} />
                      </div>
                      <span className="font-bold text-lg text-slate-900">{service.title}</span>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed">{service.description}</p>
                  </div>
                  {selectedService === service.id && (
                    <Check className="h-6 w-6 text-accent absolute top-6 right-6" />
                  )}
                </label>
              ))}
            </div>
            {errors.serviceId && <p className="text-red-500 text-base mt-2">Please select a service.</p>}
          </div>
        )}

        {/* Step 2: Job Details */}
        {currentStep === 1 && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Job Details</h2>
            
            {/* Job Size */}
            <div>
              <label className="block text-base font-semibold text-slate-900 mb-4">Estimated Job Size</label>
              <div className="grid grid-cols-3 gap-6">
                {['Small', 'Medium', 'Large'].map((size) => (
                  <label key={size} className={cn(
                    "flex flex-col items-center justify-center p-6 border-2 rounded-xl cursor-pointer hover:bg-slate-50 text-center transition-all hover:shadow-md",
                    watch('jobSize') === size.toLowerCase() ? "border-accent bg-accent/10 shadow-md" : "border-slate-200"
                  )}>
                    <input 
                      type="radio" 
                      value={size.toLowerCase()} 
                      {...register('jobSize')} 
                      className="sr-only" 
                    />
                    <span className="font-bold text-lg text-slate-900 mb-2">{size}</span>
                    <span className="text-sm text-slate-600">
                      {size === 'Small' && '< 10m²'}
                      {size === 'Medium' && '10-30m²'}
                      {size === 'Large' && '> 30m²'}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Address */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-base font-semibold text-slate-900 mb-3">Suburb</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-3.5 h-6 w-6 text-slate-400" />
                  <input
                    type="text"
                    {...register('suburb', { required: 'Suburb is required' })}
                    className="pl-12 w-full h-12 rounded-lg border-2 border-slate-300 shadow-sm focus:border-accent focus:ring-2 focus:ring-accent/20 text-base"
                    placeholder="e.g. Richmond"
                  />
                </div>
                {errors.suburb && <p className="text-red-500 text-sm mt-2">{errors.suburb.message}</p>}
              </div>
              <div>
                <label className="block text-base font-semibold text-slate-900 mb-3">Postcode</label>
                <input
                  type="text"
                  {...register('postcode', { 
                    required: 'Required',
                    pattern: { value: /^[0-9]{4}$/, message: '4 digits' }
                  })}
                  className="w-full h-12 rounded-lg border-2 border-slate-300 shadow-sm focus:border-accent focus:ring-2 focus:ring-accent/20 text-base px-4"
                  placeholder="0000"
                />
                {errors.postcode && <p className="text-red-500 text-sm mt-2">{errors.postcode.message}</p>}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-base font-semibold text-slate-900 mb-3">Additional Details</label>
              <textarea
                {...register('description')}
                rows={6}
                className="w-full rounded-lg border-2 border-slate-300 shadow-sm focus:border-accent focus:ring-2 focus:ring-accent/20 text-base p-4"
                placeholder="Describe the job... (e.g. 'Tiles are already purchased', 'Need old tiles removed')"
              />
            </div>
          </div>
        )}

        {/* Step 3: Schedule */}
        {currentStep === 2 && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Preferred Schedule</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-base font-semibold text-slate-900 mb-3">Preferred Date</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-3.5 h-6 w-6 text-slate-400" />
                  <input
                    type="date"
                    {...register('date', { required: 'Please select a date' })}
                    min={new Date().toISOString().split('T')[0]}
                    className="pl-12 w-full h-12 rounded-lg border-2 border-slate-300 shadow-sm focus:border-accent focus:ring-2 focus:ring-accent/20 text-base"
                  />
                </div>
                {errors.date && <p className="text-red-500 text-sm mt-2">{errors.date.message}</p>}
              </div>

              <div>
                <label className="block text-base font-semibold text-slate-900 mb-3">Preferred Time</label>
                <select
                  {...register('timeSlot', { required: 'Please select a time' })}
                  className="w-full h-12 rounded-lg border-2 border-slate-300 shadow-sm focus:border-accent focus:ring-2 focus:ring-accent/20 text-base px-4"
                >
                  <option value="">Select a time slot...</option>
                  <option value="morning">Morning (8am - 12pm)</option>
                  <option value="afternoon">Afternoon (12pm - 4pm)</option>
                  <option value="flexible">Flexible</option>
                </select>
                {errors.timeSlot && <p className="text-red-500 text-sm mt-2">{errors.timeSlot.message}</p>}
              </div>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg flex gap-4 text-blue-700 text-base border border-blue-200">
              <Calendar className="h-6 w-6 shrink-0 mt-0.5" />
              <p>
                <strong>Note:</strong> This is a requested time. We will confirm the actual appointment time with you via phone or email.
              </p>
            </div>
          </div>
        )}

        {/* Step 4: Contact & Confirm */}
        {currentStep === 3 && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Contact & Files</h2>
            
            {/* Contact Info */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-base font-semibold text-slate-900 mb-3">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-3.5 h-6 w-6 text-slate-400" />
                  <input
                    type="text"
                    {...register('name', { required: 'Name is required' })}
                    className="pl-12 w-full h-12 rounded-lg border-2 border-slate-300 shadow-sm focus:border-accent focus:ring-2 focus:ring-accent/20 text-base"
                    placeholder="John Doe"
                  />
                </div>
                {errors.name && <p className="text-red-500 text-sm mt-2">{errors.name.message}</p>}
              </div>
              
              <div>
                <label className="block text-base font-semibold text-slate-900 mb-3">Email</label>
                <input
                  type="email"
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' }
                  })}
                  className="w-full h-12 rounded-lg border-2 border-slate-300 shadow-sm focus:border-accent focus:ring-2 focus:ring-accent/20 text-base px-4"
                  placeholder="john@example.com"
                />
                {errors.email && <p className="text-red-500 text-sm mt-2">{errors.email.message}</p>}
              </div>
              
              <div>
                <label className="block text-base font-semibold text-slate-900 mb-3">Phone</label>
                <input
                  type="tel"
                  {...register('phone', { required: 'Phone is required' })}
                  className="w-full h-12 rounded-lg border-2 border-slate-300 shadow-sm focus:border-accent focus:ring-2 focus:ring-accent/20 text-base px-4"
                  placeholder="0400 000 000"
                />
                {errors.phone && <p className="text-red-500 text-sm mt-2">{errors.phone.message}</p>}
              </div>
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-base font-semibold text-slate-900 mb-4">Upload Photos / Plans (Optional)</label>
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-10 text-center hover:bg-slate-50 transition-colors">
                <input
                  type="file"
                  id="file-upload"
                  multiple
                  accept="image/*,.pdf"
                  className="hidden"
                  {...register('files')}
                  onChange={(e) => {
                    setValue('files', e.target.files);
                  }}
                />
                <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                  <Upload className="h-12 w-12 text-slate-400 mb-4" />
                  <span className="text-base text-slate-600 font-medium mb-2">Click to upload photos</span>
                  <span className="text-sm text-slate-400">JPG, PNG, PDF (Max 10MB)</span>
                </label>
              </div>
              {files && files.length > 0 && (
                <div className="mt-4 space-y-3">
                  {Array.from(files).map((file, i) => (
                    <div key={i} className="flex items-center gap-3 text-base text-slate-600 bg-slate-100 p-4 rounded-lg">
                      <FileText className="h-5 w-5" />
                      <span className="truncate">{file.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-6 border-t border-slate-200">
               <p className="text-sm text-slate-500 mb-4">
                 By clicking "Confirm Booking", you agree to our Terms of Service and Privacy Policy. 
                 This is a request for booking, confirmation is subject to availability.
               </p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="mt-10 flex justify-between pt-6 border-t border-slate-200">
          <Button
            type="button"
            variant="ghost"
            onClick={prevStep}
            disabled={currentStep === 0}
            className={cn(
              "px-6 py-3 text-base",
              currentStep === 0 && "invisible"
            )}
          >
            <ChevronLeft className="h-5 w-5 mr-2" /> Back
          </Button>

          {currentStep === steps.length - 1 ? (
            <Button type="submit" size="lg" className="px-8 py-3 text-base min-w-[140px] bg-accent text-white hover:bg-yellow-600">
              Confirm
            </Button>
          ) : (
            <Button type="button" size="lg" onClick={nextStep} className="px-8 py-3 text-base min-w-[140px] bg-accent text-white hover:bg-yellow-600">
              Next <ChevronRight className="h-5 w-5 ml-2" />
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}

