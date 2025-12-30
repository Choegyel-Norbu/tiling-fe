import React, { useState, useEffect } from 'react';
import { Loader2, AlertCircle, Calendar } from 'lucide-react';
import { PageHeader } from '../components/layout/PageHeader';
import { BookingCard } from '../components/booking/BookingCard';
import { UpdateBookingDialog } from '../components/booking/UpdateBookingDialog';
import { RatingDialog } from '../components/booking/RatingDialog';
import { bookingAPI } from '../services/api';

export function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for interactions
  const [expandedId, setExpandedId] = useState(null);
  const [editingBooking, setEditingBooking] = useState(null);
  const [ratingBooking, setRatingBooking] = useState(null);

  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await bookingAPI.getMyBookings();
      if (response.success && response.data) {
        setBookings(response.data.content || []);
      } else {
        throw new Error(response.error?.message || 'Failed to fetch bookings');
      }
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError(err.message || 'Failed to load bookings');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleToggle = (id) => {
    setExpandedId(current => current === id ? null : id);
  };

  if (isLoading) {
    return (
      <div className="bg-slate-50 min-h-screen">
        <PageHeader title="My Bookings" description="Manage your scheduled jobs" />
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="h-10 w-10 text-accent animate-spin mb-4" />
          <p className="text-slate-500 font-medium">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <PageHeader 
        title="My Bookings" 
        description="View and manage your service bookings" 
        className="bg-white"
      />

      <div className="container mx-auto px-4 -mt-8 relative z-10">
        
        {/* Error State */}
        {error && (
          <div className="max-w-4xl mx-auto mb-6 bg-white rounded-xl shadow-sm border-l-4 border-red-500 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <p className="text-slate-700">{error}</p>
            </div>
            <button 
              onClick={fetchBookings}
              className="text-sm font-semibold text-red-600 hover:text-red-700"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && bookings.length === 0 && (
          <div className="max-w-2xl mx-auto text-center py-16 bg-white rounded-2xl shadow-sm border border-slate-200">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No Bookings Yet</h3>
            <p className="text-slate-500 mb-8 max-w-md mx-auto">
              Ready to get started? Book a service with us today and track its progress here.
            </p>
            <a
              href="/booking"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-accent text-white font-medium hover:bg-yellow-600 transition-colors"
            >
              Book a Service
            </a>
          </div>
        )}

        {/* Bookings List */}
        <div className="max-w-4xl mx-auto space-y-4">
          {bookings.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              isExpanded={expandedId === booking.id}
              onToggle={() => handleToggle(booking.id)}
              onEdit={setEditingBooking}
              onRate={setRatingBooking}
            />
          ))}
        </div>
      </div>

      {/* Edit Dialog */}
      <UpdateBookingDialog
        booking={editingBooking}
        isOpen={!!editingBooking}
        onClose={() => setEditingBooking(null)}
        onUpdateSuccess={fetchBookings}
      />

      {/* Rating Dialog */}
      <RatingDialog
        booking={ratingBooking}
        isOpen={!!ratingBooking}
        onClose={() => setRatingBooking(null)}
        onRatingSuccess={fetchBookings}
      />
    </div>
  );
}
