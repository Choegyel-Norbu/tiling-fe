import React, { useState } from 'react';
import { Star, Loader2, AlertCircle, Send } from 'lucide-react';
import { Dialog } from '../ui/Dialog';
import { Button } from '../ui/Button';
import { ratingAPI } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { cn } from '../../utils/cn';

export function RatingDialog({ booking, isOpen, onClose, onRatingSuccess }) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const { showToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    if (rating < 1 || rating > 10) {
      setError('Rating must be between 1 and 10');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await ratingAPI.submitRating(booking.id, rating, comment);

      if (response.success) {
        showToast('Thank you for your rating!', 'success', 3000);
        onRatingSuccess?.();
        onClose();
        // Reset form
        setRating(0);
        setComment('');
        setHoveredRating(0);
      } else {
        throw new Error(response.error?.message || 'Failed to submit rating');
      }
    } catch (err) {
      setError(err.message || 'Failed to submit rating. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setRating(0);
      setComment('');
      setHoveredRating(0);
      setError(null);
      onClose();
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={handleClose}
      title={`Rate Your Experience - ${booking?.bookingRef}`}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3 text-sm">
            <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Rating Selection */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-slate-900">
            How would you rate your experience? <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRating(value)}
                  onMouseEnter={() => setHoveredRating(value)}
                  onMouseLeave={() => setHoveredRating(0)}
                  disabled={isSubmitting}
                  className={cn(
                    "transition-all duration-150",
                    "hover:scale-110 active:scale-95",
                    isSubmitting && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <Star
                    className={cn(
                      "h-8 w-8 transition-colors",
                      (hoveredRating >= value || rating >= value)
                        ? "fill-yellow-400 text-yellow-400"
                        : "fill-slate-200 text-slate-300"
                    )}
                  />
                </button>
              ))}
            </div>
            {(rating > 0 || hoveredRating > 0) && (
              <span className="text-lg font-bold text-slate-700 ml-2 min-w-[3rem]">
                {(hoveredRating || rating)}/10
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500">
            Click on a star to rate from 1 to 10
          </p>
        </div>

        {/* Comment Section */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-900">
            Share your experience (optional)
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            maxLength={500}
            disabled={isSubmitting}
            className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-accent focus:ring-1 focus:ring-accent outline-none resize-none disabled:opacity-50 disabled:cursor-not-allowed"
            placeholder="Tell us about your experience with our service..."
          />
          <p className="text-xs text-slate-500 text-right">
            {comment.length}/500 characters
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <Button
            type="button"
            variant="ghost"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || rating === 0}
            className="bg-accent text-white hover:bg-yellow-600 min-w-[140px]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Submit Rating
              </>
            )}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}

