import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Check, ChevronRight, ChevronLeft, Calendar, Upload, MapPin, User as UserIcon, FileText, X as XIcon, AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { services } from '../../data/services';
import { cn } from '../../utils/cn';
import { useAuth } from '../../context/AuthContext';
import { bookingAPI } from '../../services/api';
import { isValidAustralianPhone, normalizeAustralianPhone } from '../../utils/phoneValidation';

const steps = [
  { id: 'service', title: 'Service' },
  { id: 'details', title: 'Details' },
  { id: 'schedule', title: 'Schedule' },
  { id: 'contact', title: 'Contact' },
];

export function BookingForm({ onSubmitted }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [bookingRef, setBookingRef] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const { user, isAuthenticated } = useAuth();

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
      name: user?.name || '',
      email: user?.email || '',
      phone: '',
      files: null
    }
  });

  const selectedService = watch('serviceId');
  // Handle files manually to support accumulation
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);

  // Auto-fill name and email from authenticated user
  useEffect(() => {
    if (user) {
      if (user.name) {
        setValue('name', user.name, { shouldValidate: false });
      }
      if (user.email) {
        setValue('email', user.email, { shouldValidate: false });
      }
    }
  }, [user, setValue]);

  // Sync uploadedFiles with react-hook-form
  useEffect(() => {
    setValue('files', uploadedFiles, { shouldValidate: true });
  }, [uploadedFiles, setValue]);

  useEffect(() => {
    if (uploadedFiles.length === 0) {
      setPreviews([]);
      return;
    }

    const newPreviews = uploadedFiles.map(file => ({
      file,
      url: file.type.startsWith('image/') ? URL.createObjectURL(file) : null
    }));

    setPreviews(newPreviews);

    return () => {
      newPreviews.forEach(p => {
        if (p.url) URL.revokeObjectURL(p.url);
      });
    };
  }, [uploadedFiles]);

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      
      // Validate file sizes (max 10MB per file)
      const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes
      const invalidFiles = newFiles.filter(file => file.size > MAX_FILE_SIZE);
      
      if (invalidFiles.length > 0) {
        setSubmitError(`Some files exceed the 10MB limit: ${invalidFiles.map(f => f.name).join(', ')}`);
        e.target.value = '';
        return;
      }
      
      setUploadedFiles(prev => {
        const combined = [...prev, ...newFiles];
        
        // Check total size (max 50MB total)
        const MAX_TOTAL_SIZE = 50 * 1024 * 1024; // 50MB in bytes
        const totalSize = combined.reduce((sum, file) => sum + file.size, 0);
        
        if (totalSize > MAX_TOTAL_SIZE) {
          setSubmitError('Total file size exceeds 50MB limit. Please reduce file sizes or remove some files.');
          e.target.value = '';
          return prev; // Don't add new files if total exceeds limit
        }
        
        // Enforce max 5 files
        if (combined.length > 5) {
          setSubmitError('Maximum 5 files allowed. Please remove some files before adding more.');
          e.target.value = '';
          return prev.slice(0, 5); // Keep only first 5
        }
        
        return combined;
      });
    }
    // Reset input so same file can be selected again if needed
    e.target.value = '';
  };

  const removeFile = (indexToRemove) => {
    setUploadedFiles(prev => prev.filter((_, index) => index !== indexToRemove));
  };


  // Helper to move to next step
  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
      setSubmitError(null); // Clear errors when navigating
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      setSubmitError(null); // Clear errors when navigating
      window.scrollTo(0, 0);
    }
  };

  const onSubmit = async (data) => {
    // Safety check - user should already be authenticated at this point
    if (!isAuthenticated) {
      setSubmitError('Please sign in to create a booking.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Create FormData for multipart/form-data request
      const formData = new FormData();

      // Add all form fields
      formData.append('serviceId', data.serviceId);
      formData.append('jobSize', data.jobSize);
      formData.append('suburb', data.suburb);
      formData.append('postcode', data.postcode);
      
      if (data.description) {
        formData.append('description', data.description);
      }
      
      formData.append('date', data.date);
      formData.append('timeSlot', data.timeSlot);
      // Normalize phone number before sending (remove spaces for backend)
      const normalizedPhone = normalizeAustralianPhone(data.phone).replace(/\s/g, '');
      formData.append('phone', normalizedPhone);

      // Add files if any
      if (data.files && Array.isArray(data.files) && data.files.length > 0) {
        data.files.forEach((file) => {
          formData.append('files', file);
        });
      }

      // Call the API
      const response = await bookingAPI.createBooking(formData);

      if (response.success && response.data) {
        // Use bookingRef from API response
        setBookingRef(response.data.bookingRef || `TR-${Math.floor(Math.random() * 10000)}`);
        setIsSubmitted(true);
        onSubmitted?.(true);
        window.scrollTo(0, 0);
      } else {
        throw new Error(response.error?.message || 'Failed to create booking');
      }
    } catch (error) {
      console.error('Booking submission error:', error);
      setSubmitError(error.message || 'Failed to create booking. Please try again.');
      // Scroll to top to show error
      window.scrollTo(0, 0);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16 px-4">
        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check className="h-10 w-10 text-blue-600" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-4">Booking Submitted!</h2>
        <p className="text-lg text-slate-600 mb-2">
          Thank you for choosing Himalayan Tiling. Your booking has been submitted for confirmation.
        </p>
        <p className="text-base text-slate-500 mb-8">
          Your booking reference is <span className="font-bold text-slate-900">{bookingRef}</span>.
        </p>
        <div className="bg-blue-50 p-6 rounded-lg text-left max-w-md mx-auto mb-6 border border-blue-200">
          <div className="flex gap-3 items-start">
            <AlertCircle className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
            <p className="text-sm text-blue-800">
              <strong>Please wait for confirmation.</strong> We will send you an email confirmation once your booking has been reviewed and confirmed by our team.
            </p>
          </div>
        </div>
        <div className="bg-slate-50 p-6 rounded-lg text-left max-w-md mx-auto mb-8 border border-slate-200">
          <h3 className="font-semibold mb-4 border-b border-slate-200 pb-2">What Happens Next?</h3>
          <ul className="space-y-3 text-sm text-slate-600">
            <li className="flex gap-2">
              <span className="bg-slate-200 text-slate-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shrink-0">1</span>
              Our team will review your booking details and photos within 24 hours.
            </li>
            <li className="flex gap-2">
              <span className="bg-slate-200 text-slate-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shrink-0">2</span>
              Once confirmed, we'll send a confirmation email to {watch('email')}.
            </li>
            <li className="flex gap-2">
              <span className="bg-slate-200 text-slate-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shrink-0">3</span>
              We'll call you to discuss the final quote and confirm the appointment time.
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
        {/* Error Message */}
        {submitError && (
          <div className="mb-6 bg-red-50 border-2 border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-red-800 font-semibold mb-1">Booking Failed</p>
              <p className="text-red-600 text-sm">{submitError}</p>
            </div>
          </div>
        )}
        
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
                  <UserIcon className="absolute left-4 top-3.5 h-6 w-6 text-slate-400" />
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
                  {...register('phone', { 
                    required: 'Phone is required',
                    validate: {
                      validPhone: (value) => {
                        if (!value) return true; // Required check handles empty
                        return isValidAustralianPhone(value) || 'Invalid Australian phone number format';
                      }
                    }
                  })}
                  className="w-full h-12 rounded-lg border-2 border-slate-300 shadow-sm focus:border-accent focus:ring-2 focus:ring-accent/20 text-base px-4"
                  placeholder="0400 000 000 or 02 1234 5678"
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
                  onChange={handleFileSelect}
                />
                <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                  <Upload className="h-12 w-12 text-slate-400 mb-4" />
                  <span className="text-base text-slate-600 font-medium mb-2">Click to upload photos</span>
                  <span className="text-sm text-slate-400">JPG, PNG, PDF (Max 10MB, Max 5 files)</span>
                </label>
              </div>
              {/* Hidden input for react-hook-form validation if needed, but we used setValue */}
              <input type="hidden" {...register('files', { 
                  validate: {
                      maxFiles: (val) => !val || val.length <= 5 || 'Maximum 5 files allowed'
                  } 
              })} />
              
              {errors.files && <p className="text-red-500 text-sm mt-2 text-center">{errors.files.message}</p>}
              
              {uploadedFiles.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm text-slate-500 mb-2">{uploadedFiles.length} / 5 files selected</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {previews.map((preview, i) => (
                      <div key={i} className="relative group rounded-lg overflow-hidden border border-slate-200 aspect-square bg-slate-50">
                        <button
                          type="button"
                          onClick={() => removeFile(i)}
                          className="absolute top-2 right-2 z-10 bg-white/80 hover:bg-white rounded-full p-1 text-slate-600 hover:text-red-500 transition-colors shadow-sm"
                        >
                          <XIcon className="h-4 w-4" />
                        </button>
                        {preview.url ? (
                          <img 
                            src={preview.url} 
                            alt={preview.file.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center">
                            <FileText className="h-8 w-8 text-slate-400 mb-2" />
                            <span className="text-xs text-slate-500 truncate w-full px-2">{preview.file.name}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
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
            <Button 
              type="submit" 
              size="lg" 
              disabled={isSubmitting}
              className="px-8 py-3 text-base min-w-[140px] bg-accent text-white hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Confirm'}
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

