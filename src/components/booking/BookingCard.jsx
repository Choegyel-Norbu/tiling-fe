import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, MapPin, Phone, Clock, FileText, ChevronDown, 
  ExternalLink, Edit2, CheckCircle, XCircle, Hourglass, 
  Image as ImageIcon 
} from 'lucide-react';
import { Button } from '../ui/Button';
import { cn } from '../../utils/cn';
import { services } from '../../data/services';
import { formatAustralianPhone } from '../../utils/phoneValidation';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8082/api';

// --- Helper Components ---

function StatusBadge({ status }) {
  const config = {
    pending: {
      label: 'Pending',
      icon: Hourglass,
      className: 'bg-amber-50 text-amber-700 border-amber-200',
      iconClass: 'text-amber-500'
    },
    confirmed: {
      label: 'Confirmed',
      icon: CheckCircle,
      className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      iconClass: 'text-emerald-500'
    },
    completed: {
      label: 'Completed',
      icon: CheckCircle,
      className: 'bg-blue-50 text-blue-700 border-blue-200',
      iconClass: 'text-blue-500'
    },
    cancelled: {
      label: 'Cancelled',
      icon: XCircle,
      className: 'bg-rose-50 text-rose-700 border-rose-200',
      iconClass: 'text-rose-500'
    }
  };

  const style = config[status] || config.pending;
  const Icon = style.icon;

  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border",
      style.className
    )}>
      <Icon className={cn("h-3.5 w-3.5", style.iconClass)} />
      {style.label}
    </span>
  );
}

function FileThumbnail({ file, index }) {
  const [error, setError] = useState(false);
  
  const getUrl = (f) => {
    if (f.url?.startsWith('http')) return f.url;
    if (f.url?.startsWith('/')) return `${API_BASE_URL}${f.url}`;
    return `${API_BASE_URL}/files/${f.id}`;
  };

  const url = getUrl(file);
  const isImage = file.mimeType?.startsWith('image/');

  if (isImage) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative aspect-square bg-slate-100 rounded-lg overflow-hidden border border-slate-200"
      >
        {!error ? (
          <img 
            src={url} 
            alt={file.originalFilename}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            onError={() => setError(true)}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400">
            <ImageIcon className="h-6 w-6" />
          </div>
        )}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <ExternalLink className="h-5 w-5 text-white" />
        </div>
      </a>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-accent/50 hover:bg-accent/5 transition-colors group"
    >
      <div className="bg-slate-100 p-2 rounded-md group-hover:bg-white transition-colors">
        <FileText className="h-5 w-5 text-slate-500 group-hover:text-accent" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-slate-900 truncate">{file.originalFilename}</p>
        <p className="text-xs text-slate-500">{formatFileSize(file.fileSize)}</p>
      </div>
      <ExternalLink className="h-4 w-4 text-slate-400 group-hover:text-accent" />
    </a>
  );
}

function formatFileSize(bytes) {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// --- Main Component ---

export function BookingCard({ booking, isExpanded, onToggle, onEdit }) {
  const service = services.find(s => s.id === booking.serviceId);
  const formattedDate = new Date(booking.preferredDate).toLocaleDateString('en-AU', {
    weekday: 'short', day: 'numeric', month: 'short', year: 'numeric'
  });

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "bg-white rounded-xl border border-slate-200 shadow-sm transition-all duration-300 overflow-hidden",
        isExpanded ? "ring-2 ring-accent/20 shadow-md" : "hover:shadow-md hover:border-accent/30"
      )}
    >
      {/* Header / Summary */}
      <div className="p-5 cursor-pointer" onClick={onToggle}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          <div className="flex items-start gap-4">
            <div className={cn(
              "p-3 rounded-xl shrink-0",
              isExpanded ? "bg-accent text-white shadow-sm" : "bg-slate-100 text-slate-500"
            )}>
              {service?.icon ? <service.icon className="h-6 w-6" /> : <Clock className="h-6 w-6" />}
            </div>
            
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h3 className="text-lg font-bold text-slate-900">{service?.title || booking.serviceId}</h3>
                <StatusBadge status={booking.status} />
              </div>
              <p className="text-xs font-mono text-slate-500">REF: {booking.bookingRef}</p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-sm text-slate-600 pl-16 md:pl-0">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-slate-400" />
              <span className="font-medium">{formattedDate}</span>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <MapPin className="h-4 w-4 text-slate-400" />
              <span>{booking.suburb}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 pl-16 md:pl-0">
             {onEdit && booking.status?.toLowerCase() !== 'cancelled' && booking.status?.toLowerCase() !== 'confirmed' && (
               <Button
                 variant="ghost" 
                 size="sm"
                 className="h-9 px-3 text-slate-600 hover:text-accent hover:bg-accent/5"
                 onClick={(e) => {
                   e.stopPropagation();
                   onEdit(booking);
                 }}
               >
                 <Edit2 className="h-4 w-4 mr-2" />
                 Edit
               </Button>
             )}
             <div className={cn(
               "w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-300",
               isExpanded ? "bg-slate-100 rotate-180 text-slate-900" : "text-slate-400"
             )}>
               <ChevronDown className="h-5 w-5" />
             </div>
          </div>

        </div>
      </div>

      {/* Expanded Details */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="px-5 pb-6 pt-2 border-t border-slate-100 bg-slate-50/50">
              <div className="grid md:grid-cols-2 gap-8">
                
                {/* Left Column: Details */}
                <div className="space-y-6">
                  <div>
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Job Details</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white p-3 rounded-lg border border-slate-200">
                        <span className="text-xs text-slate-500 block mb-1">Time Slot</span>
                        <span className="font-medium text-slate-900 capitalize">{booking.timeSlot}</span>
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-slate-200">
                        <span className="text-xs text-slate-500 block mb-1">Job Size</span>
                        <span className="font-medium text-slate-900 capitalize">{booking.jobSize}</span>
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-slate-200">
                        <span className="text-xs text-slate-500 block mb-1">Postcode</span>
                        <span className="font-medium text-slate-900">{booking.postcode}</span>
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-slate-200">
                        <span className="text-xs text-slate-500 block mb-1">Contact</span>
                        <span className="font-medium text-slate-900">{formatAustralianPhone(booking.customerPhone)}</span>
                      </div>
                    </div>
                  </div>

                  {booking.description && (
                    <div>
                      <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Description</h4>
                      <p className="text-sm text-slate-700 bg-white p-4 rounded-lg border border-slate-200 leading-relaxed">
                        {booking.description}
                      </p>
                    </div>
                  )}
                </div>

                {/* Right Column: Files */}
                <div>
                   <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                     Attachments {booking.files?.length > 0 && `(${booking.files.length})`}
                   </h4>
                   
                   {booking.files && booking.files.length > 0 ? (
                     <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                       {booking.files.map((file, i) => (
                         <FileThumbnail key={file.id || i} file={file} index={i} />
                       ))}
                     </div>
                   ) : (
                     <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-lg bg-slate-50">
                       <FileText className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                       <p className="text-sm text-slate-500">No files attached</p>
                     </div>
                   )}
                </div>

              </div>
              
              <div className="mt-6 pt-4 border-t border-slate-200 flex justify-between items-center text-xs text-slate-400">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Created: {new Date(booking.createdAt).toLocaleString()}
                </div>
                <div>ID: {booking.id}</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

