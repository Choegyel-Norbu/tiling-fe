import { useState, useEffect } from 'react';

/**
 * Hook to detect user's country based on IP geolocation
 * Returns country code and loading state
 * 
 * NOTE: This hook is currently disabled in Booking.jsx (commented out).
 * To re-enable Australia-only IP filtering, uncomment the usage in Booking.jsx
 */
export function useGeolocation() {
  const [country, setCountry] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const detectCountry = async () => {
      try {
        setIsLoading(true);
        
        // Try ipapi.co first (free, no API key required)
        const response = await fetch('https://ipapi.co/json/', {
          method: 'GET',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch location');
        }

        const data = await response.json();
        
        // ipapi.co returns country_code (e.g., "AU" for Australia)
        setCountry(data.country_code || null);
        setError(null);
      } catch (err) {
        console.error('Geolocation detection error:', err);
        setError(err.message);
        // Default to null if detection fails (you can change this behavior)
        setCountry(null);
      } finally {
        setIsLoading(false);
      }
    };

    detectCountry();
  }, []);

  return { country, isLoading, error };
}

