import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { cn } from '../../utils/cn';

const toastIcons = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
};

export function Toast({ id, message, type = 'info', duration = 3000, onClose }) {
  const Icon = toastIcons[type] || Info;

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const bgColors = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    info: 'bg-blue-50 border-blue-200',
    warning: 'bg-yellow-50 border-yellow-200',
  };

  const iconColors = {
    success: 'text-green-600',
    error: 'text-red-600',
    info: 'text-blue-600',
    warning: 'text-yellow-600',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "flex items-center gap-3 px-5 py-4 rounded-lg shadow-xl border min-w-[320px] max-w-lg",
        bgColors[type]
      )}
    >
      <Icon className={cn("h-5 w-5 shrink-0", iconColors[type])} />
      <p className="flex-1 text-sm font-medium text-slate-900">{message}</p>
      <button
        onClick={onClose}
        className="shrink-0 p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-white/50 transition-colors"
        aria-label="Close snackbar"
      >
        <X className="h-4 w-4" />
      </button>
    </motion.div>
  );
}

export function ToastContainer({ toasts, onClose }) {
  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-[200] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <Toast {...toast} onClose={() => onClose(toast.id)} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}

