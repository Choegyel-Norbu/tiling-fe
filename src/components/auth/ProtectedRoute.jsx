import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../../context/AuthContext';
import { Dialog } from '../ui/Dialog';
import { Shield, AlertCircle } from 'lucide-react';

export function ProtectedRoute({ children }) {
  const { isAuthenticated, login, isLoading } = useAuth();
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
        title="Sign In Required"
        showCloseButton={true}
      >
        <div className="text-center">
          <div className="mb-6">
            <Shield className="h-16 w-16 text-accent mx-auto mb-4" />
            <p className="text-slate-600 mb-6">
              Please sign in with your Google account to book a service.
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
            We use Google Sign-In to keep your information secure and make booking easier.
          </p>
        </div>
      </Dialog>
    </>
  );
}

