import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useGoogleOneTapLogin } from '@react-oauth/google';
import { Layout } from './components/layout/Layout';
import ScrollToTop from './components/utils/ScrollToTop';
import { useAuth } from './context/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { AdminRoute } from './components/auth/AdminRoute';

// Pages
import { Home } from './pages/Home';
import { Services } from './pages/Services';
import { Booking } from './pages/Booking';
import { MyBookings } from './pages/MyBookings';
import { Gallery } from './pages/Gallery';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Reviews } from './pages/Reviews';
import { Admin } from './pages/Admin';

function App() {
  const { login, isAuthenticated } = useAuth();

  useGoogleOneTapLogin({
    onSuccess: async (credentialResponse) => {
      // credentialResponse.credential is the Google ID token
      // Pass it directly to login which will send it to backend
      await login(credentialResponse.credential);
    },
    onError: () => {
      console.log('Google One Tap Auth Failed');
    },
    disabled: isAuthenticated, // Don't show One Tap if already logged in
  });

  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route 
            path="/booking" 
            element={
              <ProtectedRoute>
                <Booking />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/my-bookings" 
            element={
              <ProtectedRoute>
                <MyBookings />
              </ProtectedRoute>
            } 
          />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/reviews" element={<Reviews />} />
        </Route>
        {/* Admin route - protected and outside main layout for separate admin UI */}
        <Route 
          path="/admin" 
          element={
            <AdminRoute>
              <Admin />
            </AdminRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
