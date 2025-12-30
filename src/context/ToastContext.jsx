import React, { createContext, useContext, useState, useCallback } from 'react';
import { SnackbarContainer } from '../components/ui/Snackbar';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [snackbars, setSnackbars] = useState([]);

  const showToast = useCallback((message, type = 'info', duration = 3000) => {
    const id = Date.now() + Math.random();
    const newSnackbar = { id, message, type, duration };
    
    setSnackbars((prev) => [...prev, newSnackbar]);
    
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setSnackbars((prev) => prev.filter((snackbar) => snackbar.id !== id));
  }, []);

  const value = {
    showToast,
    removeToast,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <SnackbarContainer snackbars={snackbars} onClose={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

