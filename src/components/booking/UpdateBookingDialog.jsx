import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Phone, AlertCircle, Loader2, Save, X, Image as ImageIcon, FileText, Trash2, ExternalLink, CheckCircle, Upload } from 'lucide-react';
import { Dialog } from '../ui/Dialog';
import { Button } from '../ui/Button';
import { bookingAPI, fileAPI } from '../../services/api';
import { cn } from '../../utils/cn';
import { isValidAustralianPhone, normalizeAustralianPhone } from '../../utils/phoneValidation';
import { useToast } from '../../context/ToastContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8082/api';

function formatFileSize(bytes) {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function UpdateBookingDialog({ booking, isOpen, onClose, onUpdateSuccess }) {
  const [formData, setFormData] = useState({});
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState(null);
  const [files, setFiles] = useState([]);
  const [newFiles, setNewFiles] = useState([]); // New files to upload
  const [newFilePreviews, setNewFilePreviews] = useState([]); // Previews for new files
  const [deletingFileIds, setDeletingFileIds] = useState(new Set());
  const [deletedFileIds, setDeletedFileIds] = useState(new Set()); // Track locally deleted files
  const [deletionMessage, setDeletionMessage] = useState(null);
  const { showToast } = useToast();

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
      
      // Filter out locally deleted files when booking updates
      const bookingFiles = booking.files || [];
      const filteredFiles = bookingFiles.filter(f => !deletedFileIds.has(f.id));
      setFiles(filteredFiles);
      
      setNewFiles([]);
      setNewFilePreviews([]);
      setError(null);
      setDeletionMessage(null);
    }
  }, [booking, deletedFileIds]);

  // Generate previews for new files
  useEffect(() => {
    if (newFiles.length === 0) {
      setNewFilePreviews([]);
      return;
    }

    const previews = newFiles.map(file => ({
      file,
      url: file.type.startsWith('image/') ? URL.createObjectURL(file) : null
    }));

    setNewFilePreviews(previews);

    return () => {
      previews.forEach(p => {
        if (p.url) URL.revokeObjectURL(p.url);
      });
    };
  }, [newFiles]);

  // Clear deletion message when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setDeletionMessage(null);
      setDeletingFileIds(new Set());
      setDeletedFileIds(new Set()); // Clear deleted file tracking when dialog closes
      setNewFiles([]);
      setNewFilePreviews([]);
    }
  }, [isOpen]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError(null);
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      
      // Validate file sizes (max 10MB per file)
      const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes
      const invalidFiles = selectedFiles.filter(file => file.size > MAX_FILE_SIZE);
      
      if (invalidFiles.length > 0) {
        setError(`Some files exceed the 10MB limit: ${invalidFiles.map(f => f.name).join(', ')}`);
        e.target.value = '';
        return;
      }
      
      setNewFiles(prev => {
        const combined = [...prev, ...selectedFiles];
        
        // Check total size (max 50MB total for new files)
        const MAX_TOTAL_SIZE = 50 * 1024 * 1024; // 50MB in bytes
        const totalSize = combined.reduce((sum, file) => sum + file.size, 0);
        
        if (totalSize > MAX_TOTAL_SIZE) {
          setError('Total file size exceeds 50MB limit. Please reduce file sizes or remove some files.');
          e.target.value = '';
          return prev;
        }
        
        // Enforce max 5 new files at once (can have more total with existing files)
        if (combined.length > 5) {
          setError('Maximum 5 new files can be added at once. Please remove some files before adding more.');
          e.target.value = '';
          return prev.slice(0, 5);
        }
        
        return combined;
      });
      
      if (error) setError(null);
    }
    e.target.value = '';
  };

  const removeNewFile = (indexToRemove) => {
    setNewFiles(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleDeleteFile = async (file) => {
    if (!file.filename) {
      setError('File key not found. Cannot delete file.');
      return;
    }

    setDeletingFileIds(prev => new Set(prev).add(file.id));
    setError(null);
    setDeletionMessage(`Deleting "${file.originalFilename || 'file'}"...`);

    try {
      const response = await fileAPI.deleteFile(file.filename);
      
      // Mark file as deleted and remove from local state immediately
      setDeletedFileIds(prev => new Set(prev).add(file.id));
      setFiles(prev => prev.filter(f => f.id !== file.id));
      
      // Show success message
      const message = response?.data?.message || response?.message || 'File deleted successfully';
      showToast(message, 'success', 3000);
      setDeletionMessage(null);
      
      // Refresh booking data to sync with backend (but our local state will filter out deleted files)
      if (onUpdateSuccess) {
        // Use setTimeout to ensure state update completes before refetch
        setTimeout(() => {
          onUpdateSuccess();
        }, 100);
      }
    } catch (err) {
      setError(err.message || 'Failed to delete file. Please try again.');
      setDeletionMessage(null);
      // Remove from deletedFileIds if deletion failed
      setDeletedFileIds(prev => {
        const next = new Set(prev);
        next.delete(file.id);
        return next;
      });
    } finally {
      setDeletingFileIds(prev => {
        const next = new Set(prev);
        next.delete(file.id);
        return next;
      });
    }
  };

  const handleDeleteMultipleFiles = async (fileIds) => {
    const filesToDelete = files.filter(f => fileIds.includes(f.id));
    const fileKeys = filesToDelete.map(f => f.filename).filter(Boolean);

    if (fileKeys.length === 0) {
      setError('No valid file keys found for deletion.');
      return;
    }

    setDeletingFileIds(prev => new Set([...prev, ...fileIds]));
    setError(null);
    setDeletionMessage(`Deleting ${fileKeys.length} file${fileKeys.length > 1 ? 's' : ''}...`);

    try {
      const response = await fileAPI.deleteFiles(fileKeys);
      
      // Mark files as deleted and remove from local state immediately
      setDeletedFileIds(prev => {
        const next = new Set(prev);
        fileIds.forEach(id => next.add(id));
        return next;
      });
      setFiles(prev => prev.filter(f => !fileIds.includes(f.id)));
      
      // Show success message
      const message = response?.data?.message || response?.message || `Successfully deleted ${fileKeys.length} file${fileKeys.length > 1 ? 's' : ''}`;
      showToast(message, 'success', 3000);
      setDeletionMessage(null);
      
      // Refresh booking data to sync with backend (but our local state will filter out deleted files)
      if (onUpdateSuccess) {
        // Use setTimeout to ensure state update completes before refetch
        setTimeout(() => {
          onUpdateSuccess();
        }, 100);
      }
    } catch (err) {
      setError(err.message || 'Failed to delete files. Please try again.');
      setDeletionMessage(null);
      // Remove from deletedFileIds if deletion failed
      setDeletedFileIds(prev => {
        const next = new Set(prev);
        fileIds.forEach(id => next.delete(id));
        return next;
      });
    } finally {
      setDeletingFileIds(prev => {
        const next = new Set(prev);
        fileIds.forEach(id => next.delete(id));
        return next;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsUpdating(true);

    try {
      if (formData.phone && !isValidAustralianPhone(formData.phone)) {
        throw new Error('Invalid Australian phone number format');
      }

      // If there are new files, use FormData; otherwise use JSON
      const hasNewFiles = newFiles.length > 0;
      
      if (hasNewFiles) {
        // Use FormData for multipart/form-data when files are present
        const formDataObj = new FormData();
        
        formDataObj.append('date', formData.date);
        formDataObj.append('timeSlot', formData.timeSlot);
        formDataObj.append('description', formData.description || '');
        formDataObj.append('suburb', formData.suburb);
        formDataObj.append('postcode', formData.postcode);
        formDataObj.append('jobSize', formData.jobSize);
        
        if (formData.phone) {
          formDataObj.append('phone', normalizeAustralianPhone(formData.phone).replace(/\s/g, ''));
        }

        // Add new files
        newFiles.forEach((file) => {
          formDataObj.append('files', file);
        });

        const response = await bookingAPI.updateBooking(booking.id, formDataObj, true);

        if (response.success) {
          showToast('Booking updated successfully', 'success', 3000);
          onUpdateSuccess();
          onClose();
        } else {
          throw new Error(response.error?.message || 'Failed to update booking');
        }
      } else {
        // Use JSON for regular updates without files
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
          showToast('Booking updated successfully', 'success', 3000);
          onUpdateSuccess();
          onClose();
        } else {
          throw new Error(response.error?.message || 'Failed to update booking');
        }
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

        {/* File Deletion Loading Message */}
        {deletionMessage && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center gap-3 text-sm">
            <Loader2 className="h-5 w-5 text-blue-600 shrink-0 animate-spin" />
            <p className="text-blue-700 font-medium">{deletionMessage}</p>
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
                placeholder="0451 270 951"
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

        {/* Files Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider">
              Files {files.length > 0 && `(${files.length} existing${newFiles.length > 0 ? `, ${newFiles.length} new` : ''})`}
            </h3>
            {files.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleDeleteMultipleFiles(files.map(f => f.id))}
                disabled={deletingFileIds.size > 0 || isUpdating}
                className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-3 w-3 mr-1" />
                Delete All Existing
              </Button>
            )}
          </div>

          {/* Add New Files */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-slate-900 mb-2">Add New Files</label>
            <div className="relative">
              <input
                type="file"
                multiple
                accept="image/*,.pdf"
                onChange={handleFileSelect}
                disabled={isUpdating || deletingFileIds.size > 0}
                className="hidden"
                id="file-upload-input"
              />
              <label
                htmlFor="file-upload-input"
                className={cn(
                  "flex items-center justify-center gap-2 p-4 border-2 border-dashed rounded-lg cursor-pointer transition-all",
                  "hover:border-accent hover:bg-accent/5",
                  (isUpdating || deletingFileIds.size > 0) && "opacity-50 cursor-not-allowed"
                )}
              >
                <Upload className="h-5 w-5 text-slate-400" />
                <span className="text-sm font-medium text-slate-600">
                  {newFiles.length > 0 ? `Add more files (${newFiles.length} selected)` : 'Select files to upload'}
                </span>
              </label>
            </div>
            <p className="text-xs text-slate-500">
              Max 10MB per file, 50MB total. Images and PDFs only. Up to 5 new files at once.
            </p>
          </div>

          {/* New Files Preview */}
          {newFiles.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider">New Files to Upload</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {newFilePreviews.map((preview, index) => {
                  const file = preview.file;
                  const isImage = file.type.startsWith('image/');
                  
                  return (
                    <div
                      key={index}
                      className="relative group rounded-lg border border-accent/30 overflow-hidden bg-accent/5"
                    >
                      {isImage && preview.url ? (
                        <div className="aspect-square">
                          <img
                            src={preview.url}
                            alt={file.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 p-3">
                          <div className="bg-slate-200 p-2 rounded-md shrink-0">
                            <FileText className="h-4 w-4 text-slate-500" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-medium text-slate-900 truncate">
                              {file.name}
                            </p>
                            <p className="text-xs text-slate-500">
                              {formatFileSize(file.size)}
                            </p>
                          </div>
                        </div>
                      )}
                      
                      {/* Remove Button */}
                      <button
                        type="button"
                        onClick={() => removeNewFile(index)}
                        disabled={isUpdating}
                        className={cn(
                          "absolute top-2 right-2 p-1.5 rounded-full bg-white/90 backdrop-blur-sm",
                          "opacity-0 group-hover:opacity-100 transition-opacity",
                          "hover:bg-red-50 hover:text-red-600 text-slate-600",
                          "shadow-sm border border-slate-200"
                        )}
                        title="Remove file"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Existing Files */}
          {files && files.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Existing Files</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {files.map((file) => {
                const isDeleting = deletingFileIds.has(file.id);
                const isImage = file.mimeType?.startsWith('image/');
                const fileUrl = file.url?.startsWith('http') 
                  ? file.url 
                  : file.url?.startsWith('/')
                  ? `${API_BASE_URL}${file.url}`
                  : `${API_BASE_URL}/files/${file.id}`;

                return (
                  <div
                    key={file.id}
                    className={cn(
                      "relative group rounded-lg border border-slate-200 overflow-hidden bg-slate-50",
                      isDeleting && "opacity-50 pointer-events-none"
                    )}
                  >
                    {isImage ? (
                      <a
                        href={fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block aspect-square"
                      >
                        <img
                          src={fileUrl}
                          alt={file.originalFilename}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                        <div className="hidden w-full h-full items-center justify-center bg-slate-100">
                          <ImageIcon className="h-6 w-6 text-slate-400" />
                        </div>
                      </a>
                    ) : (
                      <a
                        href={fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 p-3"
                      >
                        <div className="bg-slate-200 p-2 rounded-md shrink-0">
                          <FileText className="h-4 w-4 text-slate-500" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium text-slate-900 truncate">
                            {file.originalFilename}
                          </p>
                          <p className="text-xs text-slate-500">
                            {formatFileSize(file.fileSize)}
                          </p>
                        </div>
                        <ExternalLink className="h-3 w-3 text-slate-400 shrink-0" />
                      </a>
                    )}
                    
                    {/* Delete Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDeleteFile(file);
                      }}
                      disabled={isDeleting || isUpdating}
                      className={cn(
                        "absolute top-2 right-2 p-1.5 rounded-full bg-white/90 backdrop-blur-sm",
                        "opacity-0 group-hover:opacity-100 transition-opacity",
                        "hover:bg-red-50 hover:text-red-600 text-slate-600",
                        "shadow-sm border border-slate-200",
                        isDeleting && "opacity-100"
                      )}
                      title="Delete file"
                    >
                      {isDeleting ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <X className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
            </div>
          )}

          {files.length === 0 && newFiles.length === 0 && (
            <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-lg bg-slate-50">
              <FileText className="h-8 w-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm text-slate-500">No files attached</p>
            </div>
          )}

          {(files.length > 0 || newFiles.length > 0) && (
            <p className="text-xs text-slate-500">
              Click on existing files to view them. Hover to see delete button. New files will be uploaded when you save.
            </p>
          )}
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

