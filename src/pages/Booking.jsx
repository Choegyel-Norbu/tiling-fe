import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { BookingForm } from '../components/booking/BookingForm';
// COMMENTED OUT: ServiceNotAvailable import - uncomment when re-enabling IP filter
// import { ServiceNotAvailable } from '../components/booking/ServiceNotAvailable';
// COMMENTED OUT: useGeolocation hook - uncomment when re-enabling IP filter
// import { useGeolocation } from '../hooks/useGeolocation';
import { useAuth } from '../context/AuthContext';
import { Dialog } from '../components/ui/Dialog';
import { Loader2, User, AlertCircle } from 'lucide-react';

export function Booking() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loginError, setLoginError] = useState(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const navigate = useNavigate();
  
  // ============================================================================
  // AUSTRALIA-ONLY IP FILTER - COMMENTED OUT (Temporarily disabled)
  // ============================================================================
  // This geolocation check restricts booking access to Australian users only.
  // To re-enable: Uncomment the useGeolocation hook and the country checks below.
  // ============================================================================
  // const { country, isLoading: isGeolocationLoading } = useGeolocation();
  const country = null; // Set to null to bypass country check
  const isGeolocationLoading = false; // Set to false to skip loading state
  
  const { isAuthenticated, login, isLoading: isAuthLoading } = useAuth();

  // Show loading state while detecting location or checking auth
  // COMMENTED OUT: Geolocation loading check - uncomment to re-enable IP filtering
  // if (isGeolocationLoading || isAuthLoading) {
  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-accent animate-spin mx-auto mb-4" />
          <p className="text-slate-600 font-medium">Checking service availability...</p>
        </div>
      </div>
    );
  }

  // ============================================================================
  // AUSTRALIA-ONLY RESTRICTION - COMMENTED OUT (Temporarily disabled)
  // ============================================================================
  // This check shows "Service Not Available" page for non-Australian users.
  // To re-enable: Uncomment the code below and restore the useGeolocation hook above.
  // ============================================================================
  // Show "Service Not Available" if user is not from Australia
  // AU is the country code for Australia
  // if (country && country !== 'AU') {
  //   return <ServiceNotAvailable country={country} />;
  // }

  // Handle Google login success
  const handleLoginSuccess = async (credentialResponse) => {
    setIsLoggingIn(true);
    setLoginError(null);

    try {
      const result = await login(credentialResponse.credential);
      
      if (result.success) {
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

  // If there's an error detecting location or country is AU, check authentication
  return (
    <>
      {/* Only show booking form if authenticated */}
      {isAuthenticated ? (
        <div className="bg-slate-50 min-h-screen py-12">
          <div className="container mx-auto px-4">
            {!isSubmitted && (
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-slate-900 mb-4">Book a Service</h1>
                <p className="text-sm text-slate-600 max-w-2xl mx-auto">
                  Schedule a free inspection or job booking in under 2 minutes. 
                  Tell us what you need and we'll take care of the rest.
                </p>
              </div>
            )}
            
            <BookingForm onSubmitted={setIsSubmitted} />
            
            {!isSubmitted && (
              <div className="max-w-3xl mx-auto mt-8 text-center text-sm text-slate-500">
                <p>
                  Need help? Call us directly on <a href="tel:0400000000" className="text-accent font-bold">0400 000 000</a>
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        // Show empty state while sign-in dialog is displayed
        <div className="bg-slate-50 min-h-screen" />
      )}

      {/* Show login dialog if not authenticated */}
      {/* COMMENTED OUT: Country check - previously only showed for Australian users */}
      {/* To re-enable IP filtering: Change condition to: !isAuthenticated && (country === 'AU' || !country) */}
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
              Please sign in with your Google account to book a service.
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
