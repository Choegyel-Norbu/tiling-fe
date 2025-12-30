import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { cn } from '../../utils/cn';

const snackbarIcons = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
};

export function Snackbar({ id, message, type = 'info', duration = 3000, onClose }) {
  const Icon = snackbarIcons[type] || Info;

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const iconColors = {
    success: 'text-green-400',
    error: 'text-red-400',
    info: 'text-blue-400',
    warning: 'text-yellow-400',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 100, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 100, scale: 0.95 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="bg-slate-900 text-white rounded-lg shadow-2xl min-w-[320px] max-w-md px-4 py-3 flex items-center gap-3"
    >
      <Icon className={cn("h-5 w-5 shrink-0", iconColors[type])} />
      <p className="flex-1 text-sm font-medium text-white">{message}</p>
      <button
        onClick={onClose}
        className="shrink-0 p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        aria-label="Close snackbar"
      >
        <X className="h-4 w-4" />
      </button>
    </motion.div>
  );
}

export function SnackbarContainer({ snackbars, onClose }) {
  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-[200] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence>
        {snackbars.map((snackbar) => (
          <div key={snackbar.id} className="pointer-events-auto">
            <Snackbar {...snackbar} onClose={() => onClose(snackbar.id)} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}

