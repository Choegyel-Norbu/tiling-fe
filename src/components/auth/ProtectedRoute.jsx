import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Dialog } from '../ui/Dialog';
import { AlertCircle, User } from 'lucide-react';

export function ProtectedRoute({ children }) {
  const { isAuthenticated, login, isLoading } = useAuth();
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
      // credentialResponse.credential is the Google ID token
      const result = await login(credentialResponse.credential);
      
      if (result.success) {
        // Login successful - dialog will close automatically
        setLoginError(null);
        showToast('You are logged in', 'success', 3000);
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
    // Navigate back to home if user closes the dialog
    navigate('/');
  };

  return (
    <>
      {/* Always render children (the booking page will be visible behind the modal) */}
      {children}

      {/* Show login dialog if not authenticated */}
      <Dialog
        isOpen={!isAuthenticated}
        onClose={handleClose}
        title=""
        showCloseButton={true}
        maxWidth="sm"
      >
        <div className="text-center px-4 pb-4">
          <div className="mb-8">
            <div className="flex justify-center mb-6">
              <div className="bg-accent p-3 rounded-full shadow-lg shadow-accent/20">
                <User className="h-8 w-8 text-white" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Sign in to Continue</h3>
            <p className="text-slate-500 text-sm leading-relaxed max-w-xs mx-auto">
              Please sign in with your Google account to manage your bookings and access our services.
            </p>
          </div>

          {loginError && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 text-red-700 text-sm text-left">
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
              <span>{loginError}</span>
            </div>
          )}

          {isLoggingIn && (
            <div className="mb-6 flex items-center justify-center gap-2 text-slate-600 text-sm">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-accent"></div>
              <span>Signing you in...</span>
            </div>
          )}

          <div className="flex justify-center mb-6">
            <GoogleLogin
              onSuccess={handleLoginSuccess}
              onError={handleLoginError}
              disabled={isLoggingIn}
              theme="filled_blue"
              shape="pill"
              text="continue_with"
              logo_alignment="left"
            />
          </div>

          <p className="text-[10px] text-slate-400">
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </Dialog>
    </>
  );
}

