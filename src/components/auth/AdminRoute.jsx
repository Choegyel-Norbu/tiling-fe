import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Dialog } from '../ui/Dialog';
import { Shield, AlertCircle, XCircle } from 'lucide-react';

/**
 * AdminRoute - Protects admin-only routes
 * Shows login dialog if not authenticated, or access denied if authenticated but not admin
 */
export function AdminRoute({ children }) {
  const { isAuthenticated, isAdmin, login, isLoading } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // If loading, show a simple loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  const handleLoginSuccess = async (credentialResponse) => {
    setIsLoggingIn(true);
    setLoginError(null);

    try {
      const result = await login(credentialResponse.credential);
      
      if (result.success) {
        setLoginError(null);
        showToast('You are logged in', 'success', 3000);
        // If user is not admin after login, show access denied
        if (result.user?.role !== 'ADMIN') {
          setLoginError('Access denied. Admin privileges required.');
        }
      } else {
        setLoginError(result.error || 'Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoginError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLoginError = () => {
    setLoginError('Google Sign-In failed. Please try again.');
    setIsLoggingIn(false);
  };

  const handleClose = () => {
    navigate('/');
  };

  // Show access denied if authenticated but not admin
  if (isAuthenticated && !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Access Denied</h2>
            <p className="text-slate-600 mb-6">
              You don't have permission to access the admin panel. Admin privileges are required.
            </p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-accent text-white font-medium rounded-lg hover:bg-yellow-600 transition-colors"
            >
              Go to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Render children only if authenticated and admin */}
      {isAuthenticated && isAdmin ? children : null}

      {/* Show login dialog if not authenticated */}
      <Dialog
        isOpen={!isAuthenticated}
        onClose={handleClose}
        title="Admin Access Required"
        showCloseButton={true}
      >
        <div className="text-center">
          <div className="mb-6">
            <Shield className="h-16 w-16 text-accent mx-auto mb-4" />
            <p className="text-slate-600 mb-6">
              Please sign in with an admin account to access the admin panel.
            </p>
          </div>

          {loginError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 text-sm">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          {isLoggingIn && (
            <div className="mb-4 flex items-center justify-center gap-2 text-slate-600 text-sm">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-accent"></div>
              <span>Signing in...</span>
            </div>
          )}

          <div className="flex justify-center mb-4">
            <GoogleLogin
              onSuccess={handleLoginSuccess}
              onError={handleLoginError}
              disabled={isLoggingIn}
            />
          </div>

          <p className="text-xs text-slate-500 mt-4">
            Only users with admin privileges can access this area.
          </p>
        </div>
      </Dialog>
    </>
  );
}

