import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Phone, AlertCircle, Loader2, Save } from 'lucide-react';
import { Dialog } from '../ui/Dialog';
import { Button } from '../ui/Button';
import { bookingAPI } from '../../services/api';
import { cn } from '../../utils/cn';
import { isValidAustralianPhone, normalizeAustralianPhone } from '../../utils/phoneValidation';

export function UpdateBookingDialog({ booking, isOpen, onClose, onUpdateSuccess }) {
  const [formData, setFormData] = useState({});
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState(null);

  // Initialize form data when booking changes
  useEffect(() => {
    if (booking) {
      setFormData({
        date: booking.preferredDate,
        timeSlot: booking.timeSlot,
        description: booking.description || '',
        suburb: booking.suburb,
        postcode: booking.postcode,
        jobSize: booking.jobSize,
        phone: booking.customerPhone,
      });
      setError(null);
    }
  }, [booking]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsUpdating(true);

    try {
      if (formData.phone && !isValidAustralianPhone(formData.phone)) {
        throw new Error('Invalid Australian phone number format');
      }

      const updateData = {
        date: formData.date,
        timeSlot: formData.timeSlot,
        description: formData.description,
        suburb: formData.suburb,
        postcode: formData.postcode,
        jobSize: formData.jobSize,
      };

      if (formData.phone) {
        updateData.phone = normalizeAustralianPhone(formData.phone).replace(/\s/g, '');
      }

      const response = await bookingAPI.updateBooking(booking.id, updateData);

      if (response.success) {
        onUpdateSuccess();
        onClose();
      } else {
        throw new Error(response.error?.message || 'Failed to update booking');
      }
    } catch (err) {
      setError(err.message || 'Failed to update booking. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  if (!booking) return null;

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={`Update Booking - ${booking.bookingRef}`}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3 text-sm">
            <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Schedule Section */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider">Schedule</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Preferred Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                <input
                  type="date"
                  value={formData.date || ''}
                  onChange={(e) => handleChange('date', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  required
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Time Slot</label>
              <select
                value={formData.timeSlot || ''}
                onChange={(e) => handleChange('timeSlot', e.target.value)}
                required
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all appearance-none bg-white"
              >
                <option value="">Select time...</option>
                <option value="morning">Morning (8am - 12pm)</option>
                <option value="afternoon">Afternoon (12pm - 4pm)</option>
                <option value="flexible">Flexible</option>
              </select>
            </div>
          </div>
        </div>

        {/* Job Details Section */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider">Job Details</h3>
          
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">Job Size</label>
            <div className="grid grid-cols-3 gap-3">
              {['Small', 'Medium', 'Large'].map((size) => (
                <label
                  key={size}
                  className={cn(
                    "flex flex-col items-center justify-center p-3 border rounded-lg cursor-pointer transition-all",
                    formData.jobSize === size.toLowerCase()
                      ? "border-accent bg-accent/5 text-accent"
                      : "border-slate-200 hover:bg-slate-50 text-slate-600"
                  )}
                >
                  <input
                    type="radio"
                    name="jobSize"
                    value={size.toLowerCase()}
                    checked={formData.jobSize === size.toLowerCase()}
                    onChange={(e) => handleChange('jobSize', e.target.value)}
                    className="sr-only"
                  />
                  <span className="font-semibold text-sm">{size}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Suburb</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  value={formData.suburb || ''}
                  onChange={(e) => handleChange('suburb', e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 focus:border-accent focus:ring-1 focus:ring-accent outline-none"
                  placeholder="Suburb"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Postcode</label>
              <input
                type="text"
                value={formData.postcode || ''}
                onChange={(e) => handleChange('postcode', e.target.value)}
                required
                pattern="[0-9]{4}"
                maxLength={4}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:border-accent focus:ring-1 focus:ring-accent outline-none"
                placeholder="0000"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">Contact Phone</label>
            <div className="relative">
              <Phone className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
              <input
                type="tel"
                value={formData.phone || ''}
                onChange={(e) => handleChange('phone', e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 focus:border-accent focus:ring-1 focus:ring-accent outline-none"
                placeholder="0400 000 000"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">Additional Notes</label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={3}
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:border-accent focus:ring-1 focus:ring-accent outline-none resize-none"
              placeholder="Any specific requirements..."
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={isUpdating}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isUpdating}
            className="bg-accent text-white hover:bg-yellow-600 min-w-[140px]"
          >
            {isUpdating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}

