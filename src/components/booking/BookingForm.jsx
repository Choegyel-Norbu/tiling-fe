import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Check, ChevronRight, ChevronLeft, Calendar, Upload, MapPin, 
  User as UserIcon, FileText, X as XIcon, AlertCircle, 
  Briefcase, Image, Edit2, Loader2 
} from 'lucide-react';
import { Button } from '../ui/Button';
import { services } from '../../data/services';
import { cn } from '../../utils/cn';
import { useAuth } from '../../context/AuthContext';
import { bookingAPI } from '../../services/api';
import { isValidAustralianPhone, normalizeAustralianPhone } from '../../utils/phoneValidation';

const steps = [
  { id: 'service', title: 'Service', icon: Briefcase },
  { id: 'details', title: 'Details', icon: FileText },
  { id: 'schedule', title: 'Schedule', icon: Calendar },
  { id: 'contact', title: 'Contact', icon: UserIcon },
  { id: 'review', title: 'Review', icon: Check },
];

// Animation variants for step transitions
const stepVariants = {
  initial: (direction) => ({
    x: direction > 0 ? 50 : -50,
    opacity: 0,
    position: 'absolute',
    width: '100%'
  }),
  animate: {
    x: 0,
    opacity: 1,
    position: 'relative',
    transition: {
      x: { type: "spring", stiffness: 300, damping: 30 },
      opacity: { duration: 0.2 }
    }
  },
  exit: (direction) => ({
    x: direction > 0 ? -50 : 50,
    opacity: 0,
    position: 'absolute',
    width: '100%',
    transition: {
      x: { type: "spring", stiffness: 300, damping: 30 },
      opacity: { duration: 0.2 }
    }
  })
};

// Review card component for the final review step
function ReviewCard({ title, onEdit, icon: Icon, children }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow duration-300"
    >
      <div className="flex items-center justify-between mb-4 border-b border-slate-50 pb-3">
        <div className="flex items-center gap-3">
          {Icon && (
            <div className="p-2 bg-slate-50 text-accent rounded-lg">
              <Icon className="h-5 w-5" />
            </div>
          )}
          <h3 className="font-semibold text-slate-800">{title}</h3>
        </div>
        <button
          type="button"
          onClick={onEdit}
          className="flex items-center gap-1.5 text-xs font-semibold text-accent uppercase tracking-wider hover:text-yellow-700 transition-colors bg-accent/5 px-3 py-1.5 rounded-full"
        >
          <Edit2 className="h-3.5 w-3.5" />
          Edit
        </button>
      </div>
      <div className="pl-1">
        {children}
      </div>
    </motion.div>
  );
}

export function BookingForm({ onSubmitted }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(0);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [bookingRef, setBookingRef] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const { user, isAuthenticated } = useAuth();

  const { register, handleSubmit, watch, setValue, trigger, formState: { errors } } = useForm({
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
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);

  // Auto-fill name and email from authenticated user
  useEffect(() => {
    if (user) {
      if (user.name) setValue('name', user.name, { shouldValidate: false });
      if (user.email) setValue('email', user.email, { shouldValidate: false });
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
    return () => newPreviews.forEach(p => p.url && URL.revokeObjectURL(p.url));
  }, [uploadedFiles]);

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      const MAX_FILE_SIZE = 10 * 1024 * 1024;
      const invalidFiles = newFiles.filter(file => file.size > MAX_FILE_SIZE);
      
      if (invalidFiles.length > 0) {
        setSubmitError(`Some files exceed 10MB: ${invalidFiles.map(f => f.name).join(', ')}`);
        e.target.value = '';
        return;
      }
      
      setUploadedFiles(prev => {
        const combined = [...prev, ...newFiles];
        const MAX_TOTAL_SIZE = 50 * 1024 * 1024;
        const totalSize = combined.reduce((sum, file) => sum + file.size, 0);
        
        if (totalSize > MAX_TOTAL_SIZE) {
          setSubmitError('Total size exceeds 50MB limit.');
          e.target.value = '';
          return prev;
        }
        
        if (combined.length > 5) {
          setSubmitError('Maximum 5 files allowed.');
          e.target.value = '';
          return prev.slice(0, 5);
        }
        return combined;
      });
    }
    e.target.value = '';
  };

  const removeFile = (indexToRemove) => {
    setUploadedFiles(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const nextStep = async () => {
    const fieldsToValidate = {
      0: ['serviceId'],
      1: ['suburb', 'postcode'],
      2: ['date', 'timeSlot'],
      3: ['name', 'email', 'phone'],
      4: []
    };

    const fields = fieldsToValidate[currentStep] || [];
    const isValid = await trigger(fields);
    
    if (!isValid) {
      setSubmitError('Please complete all required fields.');
      // Don't scroll to top immediately on mobile to keep context, maybe shake animation?
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (currentStep < steps.length - 1) {
      setDirection(1);
      setCurrentStep(prev => prev + 1);
      setSubmitError(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep(prev => prev - 1);
      setSubmitError(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (currentStep === steps.length - 1) {
      handleSubmit(onSubmit)();
    } else {
      nextStep();
    }
  };

  const onSubmit = async (data) => {
    if (!isAuthenticated) {
      setSubmitError('Please sign in to create a booking.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const formData = new FormData();
      formData.append('serviceId', data.serviceId);
      formData.append('jobSize', data.jobSize);
      formData.append('suburb', data.suburb);
      formData.append('postcode', data.postcode);
      if (data.description) formData.append('description', data.description);
      formData.append('date', data.date);
      formData.append('timeSlot', data.timeSlot);
      const normalizedPhone = normalizeAustralianPhone(data.phone).replace(/\s/g, '');
      formData.append('phone', normalizedPhone);

      if (data.files && Array.isArray(data.files)) {
        data.files.forEach((file) => formData.append('files', file));
      }

      const response = await bookingAPI.createBooking(formData);

      if (response.success && response.data) {
        setBookingRef(response.data.bookingRef || `TR-${Math.floor(Math.random() * 10000)}`);
        setIsSubmitted(true);
        onSubmitted?.(true);
        window.scrollTo(0, 0);
      } else {
        throw new Error(response.error?.message || 'Failed to create booking');
      }
    } catch (error) {
      console.error('Booking error:', error);
      setSubmitError(error.message || 'Failed to create booking.');
      window.scrollTo(0, 0);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto text-center py-12 px-6"
      >
        <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
          <Check className="h-12 w-12 text-green-600" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-4">Booking Submitted!</h2>
        <p className="text-lg text-slate-600 mb-8 max-w-md mx-auto">
          Thanks for choosing Himalayan Tiling. Your booking ref is <span className="font-bold text-slate-900">{bookingRef}</span>.
        </p>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 max-w-md mx-auto mb-8 text-left">
           <h3 className="font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-100">Next Steps</h3>
           <ul className="space-y-4">
             <li className="flex gap-3">
               <div className="bg-slate-100 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">1</div>
               <p className="text-sm text-slate-600">Our team will review your details within 24 hours.</p>
             </li>
             <li className="flex gap-3">
               <div className="bg-slate-100 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">2</div>
               <p className="text-sm text-slate-600">We'll email a confirmation to {watch('email')}.</p>
             </li>
             <li className="flex gap-3">
               <div className="bg-slate-100 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">3</div>
               <p className="text-sm text-slate-600">We'll call to discuss the quote and finalize time.</p>
             </li>
           </ul>
        </div>
        <Button onClick={() => navigate('/')} className="bg-slate-900 text-white hover:bg-slate-800">Return Home</Button>
      </motion.div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto my-8 md:my-12">
      {/* Mobile Header / Progress */}
      <div className="mb-6 px-4 md:px-0">
        <div className="flex justify-between items-end mb-2">
          <div>
             <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Book a Service</h1>
             <p className="text-slate-500 text-sm md:text-base hidden sm:block">Complete the form below to schedule your tiling service.</p>
          </div>
          <div className="text-right">
            <span className="text-sm font-medium text-slate-500">Step {currentStep + 1} of {steps.length}</span>
            <p className="text-xs font-bold text-accent uppercase tracking-wide">{steps[currentStep].title}</p>
          </div>
        </div>
        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-accent"
            initial={{ width: 0 }}
            animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden mx-4 md:mx-0">
        {/* Desktop Stepper */}
        <div className="hidden md:flex bg-slate-50/50 border-b border-slate-100 p-6 justify-between px-12">
          {steps.map((step, index) => {
             const Icon = step.icon;
             const isActive = index === currentStep;
             const isCompleted = index < currentStep;
             
             return (
               <div key={step.id} className="flex flex-col items-center z-10 relative group cursor-pointer" onClick={() => index < currentStep && setCurrentStep(index)}>
                 <div className={cn(
                   "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border-2",
                   isActive ? "bg-accent text-white border-accent shadow-md scale-110" : 
                   isCompleted ? "bg-green-500 text-white border-green-500" : "bg-white text-slate-400 border-slate-200"
                 )}>
                   {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                 </div>
                 <span className={cn(
                   "text-xs font-bold mt-2 uppercase tracking-wider transition-colors",
                   isActive ? "text-slate-900" : isCompleted ? "text-green-600" : "text-slate-400"
                 )}>
                   {step.title}
                 </span>
               </div>
             );
          })}
          {/* Connecting line for desktop would go here if absolute positioning used, but flex-between handles spacing well enough */}
        </div>

        <form onSubmit={handleFormSubmit} className="relative min-h-[400px]">
          <div className="p-6 md:p-10">
             <AnimatePresence mode="wait" custom={direction} initial={false}>
               <motion.div
                 key={currentStep}
                 custom={direction}
                 variants={stepVariants}
                 initial="initial"
                 animate="animate"
                 exit="exit"
                 className="w-full"
               >
                 {submitError && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-6 bg-red-50 border border-red-100 rounded-xl p-4 flex gap-3 text-red-700"
                    >
                      <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-sm">Action Required</p>
                        <p className="text-sm opacity-90">{submitError}</p>
                      </div>
                    </motion.div>
                  )}

                 {/* STEP 1: SERVICE */}
                 {currentStep === 0 && (
                   <div className="space-y-6">
                     <div className="text-center md:text-left mb-8">
                        <h2 className="text-xl md:text-2xl font-bold text-slate-900">Select a Service</h2>
                        <p className="text-slate-500 mt-1">Choose the type of tiling service you require.</p>
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       {services.map((service) => (
                         <label 
                           key={service.id}
                           className={cn(
                             "relative flex items-start p-5 cursor-pointer rounded-xl border-2 transition-all duration-200 group hover:border-accent/50",
                             selectedService === service.id 
                               ? "border-accent bg-accent/5 ring-1 ring-accent/20" 
                               : "border-slate-100 bg-white hover:bg-slate-50"
                           )}
                         >
                           <input
                             type="radio"
                             value={service.id}
                             {...register('serviceId', { required: true })}
                             className="sr-only"
                           />
                           <div className="flex-1">
                             <div className="flex items-center gap-3 mb-2">
                               <div className={cn(
                                 "p-2 rounded-lg transition-colors",
                                 selectedService === service.id ? "bg-white text-accent shadow-sm" : "bg-slate-100 text-slate-500 group-hover:bg-white"
                               )}>
                                 <service.icon className="h-5 w-5" />
                               </div>
                               <span className="font-bold text-slate-900">{service.title}</span>
                             </div>
                             <p className="text-sm text-slate-500 leading-relaxed pl-1">{service.description}</p>
                           </div>
                           <div className={cn(
                             "w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ml-4 mt-1 transition-colors",
                             selectedService === service.id ? "border-accent bg-accent text-white" : "border-slate-200 bg-slate-50"
                           )}>
                             {selectedService === service.id && <Check className="h-3.5 w-3.5" />}
                           </div>
                         </label>
                       ))}
                     </div>
                   </div>
                 )}

                 {/* STEP 2: JOB DETAILS */}
                 {currentStep === 1 && (
                   <div className="space-y-8">
                     <div className="text-center md:text-left">
                        <h2 className="text-xl md:text-2xl font-bold text-slate-900">Job Details</h2>
                        <p className="text-slate-500 mt-1">Tell us more about the property and requirements.</p>
                     </div>
                     
                     <div className="space-y-4">
                       <label className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Estimated Size</label>
                       <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                         {['Small', 'Medium', 'Large'].map((size) => (
                           <label key={size} className={cn(
                             "flex flex-col items-center justify-center p-4 border-2 rounded-xl cursor-pointer transition-all hover:bg-slate-50 text-center relative overflow-hidden",
                             watch('jobSize') === size.toLowerCase() 
                               ? "border-accent bg-accent/5" 
                               : "border-slate-100"
                           )}>
                             <input 
                               type="radio" 
                               value={size.toLowerCase()} 
                               {...register('jobSize')} 
                               className="sr-only" 
                             />
                             <span className="font-bold text-slate-900 mb-1">{size}</span>
                             <span className="text-xs text-slate-500">
                               {size === 'Small' && '< 10m²'}
                               {size === 'Medium' && '10-30m²'}
                               {size === 'Large' && '> 30m²'}
                             </span>
                             {watch('jobSize') === size.toLowerCase() && (
                               <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-accent" />
                             )}
                           </label>
                         ))}
                       </div>
                     </div>

                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                       <div className="space-y-2">
                         <label className="text-sm font-semibold text-slate-700">Suburb</label>
                         <div className="relative">
                           <MapPin className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-400" />
                           <input
                             type="text"
                             {...register('suburb', { 
                               required: 'Suburb is required',
                               minLength: { value: 2, message: 'Too short' },
                               pattern: { value: /^[a-zA-Z\s'-]+$/, message: 'Invalid characters' }
                             })}
                             className="w-full pl-11 h-12 rounded-xl border border-slate-200 focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all bg-slate-50 focus:bg-white"
                             placeholder="e.g. Richmond"
                           />
                         </div>
                         {errors.suburb && <p className="text-red-500 text-xs mt-1 ml-1">{errors.suburb.message}</p>}
                       </div>
                       <div className="space-y-2">
                         <label className="text-sm font-semibold text-slate-700">Postcode</label>
                         <input
                           type="tel"
                           {...register('postcode', { 
                             required: 'Required',
                             pattern: { value: /^[0-9]{4}$/, message: 'Must be 4 digits' }
                           })}
                           maxLength={4}
                           className="w-full h-12 rounded-xl border border-slate-200 focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all bg-slate-50 focus:bg-white px-4"
                           placeholder="0000"
                         />
                         {errors.postcode && <p className="text-red-500 text-xs mt-1 ml-1">{errors.postcode.message}</p>}
                       </div>
                     </div>

                     <div className="space-y-2">
                       <label className="text-sm font-semibold text-slate-700">Additional Details <span className="text-slate-400 font-normal">(Optional)</span></label>
                       <textarea
                         {...register('description')}
                         rows={4}
                         className="w-full rounded-xl border border-slate-200 focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all bg-slate-50 focus:bg-white p-4"
                         placeholder="Describe the job... (e.g. 'Tiles are already purchased', 'Need old tiles removed')"
                       />
                     </div>
                   </div>
                 )}

                 {/* STEP 3: SCHEDULE */}
                 {currentStep === 2 && (
                   <div className="space-y-8">
                     <div className="text-center md:text-left">
                        <h2 className="text-xl md:text-2xl font-bold text-slate-900">Preferred Schedule</h2>
                        <p className="text-slate-500 mt-1">When would you like the work to commence?</p>
                     </div>
                     
                     <div className="grid md:grid-cols-2 gap-6">
                       <div className="space-y-2">
                         <label className="text-sm font-semibold text-slate-700">Preferred Date</label>
                         <div className="relative">
                           <Calendar className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-400 z-10" />
                           <input
                             type="date"
                             {...register('date', { required: 'Date is required' })}
                             min={new Date().toISOString().split('T')[0]}
                             className="w-full pl-11 h-12 rounded-xl border border-slate-200 focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all bg-slate-50 focus:bg-white appearance-none relative"
                           />
                         </div>
                         {errors.date && <p className="text-red-500 text-xs mt-1 ml-1">{errors.date.message}</p>}
                       </div>

                       <div className="space-y-2">
                         <label className="text-sm font-semibold text-slate-700">Preferred Time</label>
                         <select
                           {...register('timeSlot', { required: 'Time is required' })}
                           className="w-full h-12 rounded-xl border border-slate-200 focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all bg-slate-50 focus:bg-white px-4"
                         >
                           <option value="">Select a time slot...</option>
                           <option value="morning">Morning (8am - 12pm)</option>
                           <option value="afternoon">Afternoon (12pm - 4pm)</option>
                           <option value="flexible">Flexible</option>
                         </select>
                         {errors.timeSlot && <p className="text-red-500 text-xs mt-1 ml-1">{errors.timeSlot.message}</p>}
                       </div>
                     </div>

                     <div className="bg-blue-50/50 p-5 rounded-xl flex gap-3 text-blue-800 border border-blue-100">
                       <Briefcase className="h-5 w-5 shrink-0 mt-0.5" />
                       <p className="text-sm leading-relaxed">
                         <strong>Note:</strong> This is a preferred time. We will confirm the actual appointment time with you via phone or email after reviewing the job requirements.
                       </p>
                     </div>
                   </div>
                 )}

                 {/* STEP 4: CONTACT */}
                 {currentStep === 3 && (
                   <div className="space-y-8">
                     <div className="text-center md:text-left">
                        <h2 className="text-xl md:text-2xl font-bold text-slate-900">Contact Details</h2>
                        <p className="text-slate-500 mt-1">How can we reach you regarding this booking?</p>
                     </div>
                     
                     <div className="space-y-5">
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-slate-700">Full Name</label>
                          <div className="relative">
                            <UserIcon className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-400" />
                            <input
                              type="text"
                              {...register('name', { required: 'Name is required' })}
                              className="w-full pl-11 h-12 rounded-xl border border-slate-200 focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all bg-slate-50 focus:bg-white"
                              placeholder="John Doe"
                            />
                          </div>
                          {errors.name && <p className="text-red-500 text-xs mt-1 ml-1">{errors.name.message}</p>}
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Email</label>
                            <input
                              type="email"
                              {...register('email', { 
                                required: 'Email is required',
                                pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' }
                              })}
                              className="w-full h-12 rounded-xl border border-slate-200 focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all bg-slate-50 focus:bg-white px-4"
                              placeholder="john@example.com"
                            />
                            {errors.email && <p className="text-red-500 text-xs mt-1 ml-1">{errors.email.message}</p>}
                          </div>
                          
                          <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Phone</label>
                            <input
                              type="tel"
                              {...register('phone', { 
                                required: 'Phone is required',
                                validate: v => !v || isValidAustralianPhone(v) || 'Invalid phone'
                              })}
                              className="w-full h-12 rounded-xl border border-slate-200 focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all bg-slate-50 focus:bg-white px-4"
                              placeholder="0400 000 000"
                            />
                            {errors.phone && <p className="text-red-500 text-xs mt-1 ml-1">{errors.phone.message}</p>}
                          </div>
                        </div>

                        {/* Files */}
                        <div className="pt-4">
                           <label className="text-sm font-semibold text-slate-700 mb-3 block">Photos / Plans (Optional)</label>
                           <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:bg-slate-50 transition-all group cursor-pointer relative">
                             <input
                               type="file"
                               multiple
                               accept="image/*,.pdf"
                               className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                               onChange={handleFileSelect}
                             />
                             <div className="flex flex-col items-center">
                               <div className="bg-slate-100 p-3 rounded-full mb-3 group-hover:bg-white group-hover:shadow-sm transition-all">
                                 <Upload className="h-6 w-6 text-slate-400 group-hover:text-accent" />
                               </div>
                               <p className="text-sm font-medium text-slate-700">Click to upload files</p>
                               <p className="text-xs text-slate-400 mt-1">Max 5 files, 10MB each</p>
                             </div>
                           </div>
                           
                           {/* File Previews */}
                           {uploadedFiles.length > 0 && (
                             <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                               {previews.map((preview, i) => (
                                 <div key={i} className="relative group rounded-lg overflow-hidden border border-slate-200 aspect-square bg-slate-50">
                                   <button
                                     type="button"
                                     onClick={() => removeFile(i)}
                                     className="absolute top-1 right-1 z-20 bg-white/90 rounded-full p-1 text-slate-500 hover:text-red-500 shadow-sm"
                                   >
                                     <XIcon className="h-3 w-3" />
                                   </button>
                                   {preview.url ? (
                                     <img src={preview.url} alt="" className="w-full h-full object-cover" />
                                   ) : (
                                     <div className="w-full h-full flex flex-col items-center justify-center p-2 text-center">
                                       <FileText className="h-6 w-6 text-slate-300 mb-1" />
                                       <span className="text-[10px] text-slate-500 truncate w-full">{preview.file.name}</span>
                                     </div>
                                   )}
                                 </div>
                               ))}
                             </div>
                           )}
                           {errors.files && <p className="text-red-500 text-xs mt-2">{errors.files.message}</p>}
                        </div>
                     </div>
                   </div>
                 )}

                 {/* STEP 5: REVIEW */}
                 {currentStep === 4 && (
                   <div className="space-y-6">
                     <div className="text-center md:text-left">
                        <h2 className="text-xl md:text-2xl font-bold text-slate-900">Review & Confirm</h2>
                        <p className="text-slate-500 mt-1">Please check your details before submitting.</p>
                     </div>

                     <div className="grid gap-4">
                       <ReviewCard title="Service" onEdit={() => setCurrentStep(0)} icon={services.find(s => s.id === watch('serviceId'))?.icon}>
                         <p className="text-base font-medium text-slate-900">
                           {services.find(s => s.id === watch('serviceId'))?.title || 'Not selected'}
                         </p>
                       </ReviewCard>

                       <ReviewCard title="Job Details" onEdit={() => setCurrentStep(1)} icon={Briefcase}>
                         <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                           <div>
                             <span className="text-slate-500 block text-xs uppercase tracking-wide">Size</span>
                             <span className="font-medium text-slate-900 capitalize">{watch('jobSize')}</span>
                           </div>
                           <div>
                             <span className="text-slate-500 block text-xs uppercase tracking-wide">Location</span>
                             <span className="font-medium text-slate-900">{watch('suburb')}, {watch('postcode')}</span>
                           </div>
                           {watch('description') && (
                             <div className="col-span-2 pt-2 mt-1 border-t border-slate-100">
                               <span className="text-slate-500 block text-xs uppercase tracking-wide">Notes</span>
                               <span className="text-slate-900 line-clamp-2">{watch('description')}</span>
                             </div>
                           )}
                         </div>
                       </ReviewCard>

                       <ReviewCard title="Schedule" onEdit={() => setCurrentStep(2)} icon={Calendar}>
                         <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                           <div>
                             <span className="text-slate-500 block text-xs uppercase tracking-wide">Date</span>
                             <span className="font-medium text-slate-900">{watch('date') ? new Date(watch('date')).toLocaleDateString() : '-'}</span>
                           </div>
                           <div>
                             <span className="text-slate-500 block text-xs uppercase tracking-wide">Time</span>
                             <span className="font-medium text-slate-900 capitalize">{watch('timeSlot')}</span>
                           </div>
                         </div>
                       </ReviewCard>

                       <ReviewCard title="Contact" onEdit={() => setCurrentStep(3)} icon={UserIcon}>
                         <div className="space-y-1 text-sm">
                           <p className="font-medium text-slate-900">{watch('name')}</p>
                           <p className="text-slate-600">{watch('email')}</p>
                           <p className="text-slate-600">{watch('phone')}</p>
                           {uploadedFiles.length > 0 && (
                             <div className="mt-2 flex items-center gap-2 text-xs text-slate-500 bg-slate-50 p-2 rounded">
                               <FileText className="h-3 w-3" />
                               {uploadedFiles.length} file(s) attached
                             </div>
                           )}
                         </div>
                       </ReviewCard>
                     </div>

                     <div className="bg-amber-50 rounded-xl p-4 text-xs text-amber-800 border border-amber-100 flex gap-2">
                       <AlertCircle className="h-4 w-4 shrink-0" />
                       <p>By confirming, you agree to our Terms of Service. Booking is subject to availability.</p>
                     </div>
                   </div>
                 )}
               </motion.div>
             </AnimatePresence>
          </div>

          {/* Footer Actions */}
          <div className="p-6 md:p-10 border-t border-slate-100 bg-slate-50/30 flex justify-between items-center sticky bottom-0 backdrop-blur-md z-20">
            <Button
              type="button"
              variant="ghost"
              onClick={prevStep}
              disabled={currentStep === 0}
              className={cn(
                "text-slate-500 hover:text-slate-900 pl-0 md:pl-4 hover:bg-transparent md:hover:bg-slate-100",
                currentStep === 0 && "opacity-0 pointer-events-none"
              )}
            >
              <ChevronLeft className="h-5 w-5 mr-1" />
              <span className="hidden xs:inline">Back</span>
            </Button>

            {currentStep === steps.length - 1 ? (
              <Button 
                type="button" // Important: keep this as button to prevent implicit submit
                size="lg" 
                onClick={() => handleSubmit(onSubmit)()}
                disabled={isSubmitting}
                className="bg-accent hover:bg-yellow-600 text-white shadow-lg shadow-accent/20 min-w-[160px]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Confirm Booking
                    <Check className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            ) : (
              <Button 
                type="button" 
                size="lg" 
                onClick={nextStep}
                className="bg-slate-900 hover:bg-slate-800 text-white min-w-[120px]"
              >
                Next Step
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
