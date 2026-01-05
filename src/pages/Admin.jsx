import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, List, Settings, Search, Bell, User, CheckCircle, XCircle, Clock, AlertCircle, LogOut, Loader2, Phone, Mail, MapPin, Menu, X, Ban, Home, Eye, Image as ImageIcon, FileText, ExternalLink, MoreVertical, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../utils/cn';
import { useAuth } from '../context/AuthContext';
import { bookingAPI, notificationsAPI } from '../services/api';
import { services } from '../data/services';
import { Dialog } from '../components/ui/Dialog';
import { CalendarView } from '../components/admin/CalendarView';

export function Admin() {
  const [activeTab, setActiveTab] = useState('bookings');
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  
  // Confirmation dialog state
  const [confirmationDialog, setConfirmationDialog] = useState({
    isOpen: false,
    action: null, // 'confirm', 'complete', 'reject'
    bookingId: null,
    bookingRef: null,
    message: '',
    onConfirm: null
  });
  
  // Notifications state
  const [notifications, setNotifications] = useState([]);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false);
  const [notificationsError, setNotificationsError] = useState(null);
  const [notificationsPage, setNotificationsPage] = useState(0);
  const [notificationsTotalPages, setNotificationsTotalPages] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  const [expandedNotificationId, setExpandedNotificationId] = useState(null);
  
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Fetch bookings on mount and when tab changes
  useEffect(() => {
    if (activeTab === 'bookings') {
      fetchBookings();
    } else if (activeTab === 'notifications') {
      fetchNotifications(0);
    }
  }, [activeTab]);

  // Fetch notifications on mount to get unread count (only if not already on notifications tab)
  useEffect(() => {
    if (activeTab !== 'notifications') {
      fetchNotifications(0);
    }
  }, []);

  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await bookingAPI.getBookings();
      if (response.success && response.data?.content) {
        setBookings(response.data.content);
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

  const fetchNotifications = async (page = 0) => {
    try {
      setIsLoadingNotifications(true);
      setNotificationsError(null);
      const response = await notificationsAPI.getNotifications(page, 20);
      if (response.success && response.data) {
        setNotifications(response.data.content || []);
        setNotificationsPage(response.data.page || 0);
        setNotificationsTotalPages(response.data.totalPages || 0);
        // Count unread notifications from current page
        // Note: This only counts unread from the current page
        // For a full count, you'd need to fetch all pages or have a separate endpoint
        const unread = (response.data.content || []).filter(n => !n.isRead).length;
        // Only update unread count if we're on the first page or if it's higher
        if (page === 0 || unread > 0) {
          setUnreadCount(prev => page === 0 ? unread : Math.max(prev, unread));
        }
      } else {
        throw new Error(response.error?.message || 'Failed to fetch notifications');
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setNotificationsError(err.message || 'Failed to load notifications');
    } finally {
      setIsLoadingNotifications(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    // Optimistically update the UI
    const notification = notifications.find(n => n.id === notificationId);
    if (!notification || notification.isRead) {
      return; // Already read, no need to update
    }

    // Update local state immediately for better UX
    setNotifications(prevNotifications =>
      prevNotifications.map(n =>
        n.id === notificationId ? { ...n, isRead: true } : n
      )
    );
    
    // Update unread count
    setUnreadCount(prev => Math.max(0, prev - 1));

    try {
      const response = await notificationsAPI.markAsRead(notificationId);
      if (!response.success) {
        // Revert on error
        setNotifications(prevNotifications =>
          prevNotifications.map(n =>
            n.id === notificationId ? { ...n, isRead: false } : n
          )
        );
        setUnreadCount(prev => prev + 1);
        throw new Error(response.error?.message || 'Failed to mark notification as read');
      }
    } catch (err) {
      console.error('Error marking notification as read:', err);
      // Error is already handled by reverting the optimistic update
    }
  };

  const handleToggleNotification = (notificationId) => {
    const isCurrentlyExpanded = expandedNotificationId === notificationId;
    
    if (isCurrentlyExpanded) {
      // Collapse
      setExpandedNotificationId(null);
    } else {
      // Expand - mark as read when expanding
      setExpandedNotificationId(notificationId);
      const notification = notifications.find(n => n.id === notificationId);
      if (notification && !notification.isRead) {
        handleMarkAsRead(notificationId);
      }
    }
  };

  const handleConfirmBooking = async (bookingId) => {
    const booking = bookings.find(b => b.id === bookingId);
    setConfirmationDialog({
      isOpen: true,
      action: 'confirm',
      bookingId,
      bookingRef: booking?.bookingRef || 'N/A',
      message: 'Are you sure you want to confirm this booking?',
      onConfirm: async () => {
        try {
          setUpdatingStatus(bookingId);
          const response = await bookingAPI.updateBookingStatus(bookingId, 'confirmed');
          if (response.success) {
            // Update the booking in the local state
            setBookings(prevBookings =>
              prevBookings.map(booking =>
                booking.id === bookingId
                  ? { ...booking, status: 'confirmed' }
                  : booking
              )
            );
            setConfirmationDialog({ isOpen: false, action: null, bookingId: null, bookingRef: null, message: '', onConfirm: null });
          } else {
            throw new Error(response.error?.message || 'Failed to confirm booking');
          }
        } catch (err) {
          console.error('Error confirming booking:', err);
          alert(err.message || 'Failed to confirm booking. Please try again.');
        } finally {
          setUpdatingStatus(null);
          setOpenDropdownId(null);
        }
      }
    });
  };

  const handleRejectBooking = async (bookingId) => {
    const booking = bookings.find(b => b.id === bookingId);
    setConfirmationDialog({
      isOpen: true,
      action: 'reject',
      bookingId,
      bookingRef: booking?.bookingRef || 'N/A',
      message: 'Are you sure you want to reject this booking? This action cannot be undone.',
      onConfirm: async () => {
        try {
          setUpdatingStatus(bookingId);
          const response = await bookingAPI.updateBookingStatus(bookingId, 'cancelled');
          if (response.success) {
            // Update the booking in the local state
            setBookings(prevBookings =>
              prevBookings.map(booking =>
                booking.id === bookingId
                  ? { ...booking, status: 'cancelled' }
                  : booking
              )
            );
            setConfirmationDialog({ isOpen: false, action: null, bookingId: null, bookingRef: null, message: '', onConfirm: null });
          } else {
            throw new Error(response.error?.message || 'Failed to reject booking');
          }
        } catch (err) {
          console.error('Error rejecting booking:', err);
          alert(err.message || 'Failed to reject booking. Please try again.');
        } finally {
          setUpdatingStatus(null);
          setOpenDropdownId(null);
        }
      }
    });
  };

  const handleCompleteBooking = async (bookingId) => {
    const booking = bookings.find(b => b.id === bookingId);
    setConfirmationDialog({
      isOpen: true,
      action: 'complete',
      bookingId,
      bookingRef: booking?.bookingRef || 'N/A',
      message: 'Mark this booking as completed?',
      onConfirm: async () => {
        try {
          setUpdatingStatus(bookingId);
          const response = await bookingAPI.updateBookingStatus(bookingId, 'completed');
          if (response.success) {
            // Update the booking in the local state
            setBookings(prevBookings =>
              prevBookings.map(booking =>
                booking.id === bookingId
                  ? { ...booking, status: 'completed' }
                  : booking
              )
            );
            setConfirmationDialog({ isOpen: false, action: null, bookingId: null, bookingRef: null, message: '', onConfirm: null });
          } else {
            throw new Error(response.error?.message || 'Failed to complete booking');
          }
        } catch (err) {
          console.error('Error completing booking:', err);
          alert(err.message || 'Failed to complete booking. Please try again.');
        } finally {
          setUpdatingStatus(null);
          setOpenDropdownId(null);
        }
      }
    });
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const handleNavigateHome = () => {
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };

  // Get service name from serviceId
  const getServiceName = (serviceId) => {
    const service = services.find(s => s.id === serviceId);
    return service ? service.title : serviceId;
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-AU', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  // Format time slot
  const formatTimeSlot = (timeSlot) => {
    if (!timeSlot) return 'N/A';
    return timeSlot.charAt(0).toUpperCase() + timeSlot.slice(1);
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Get file URL
  const getFileUrl = (file) => {
    if (file.url?.startsWith('http')) return file.url;
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8082/api';
    if (file.url?.startsWith('/')) return `${API_BASE_URL}${file.url}`;
    return `${API_BASE_URL}/files/${file.id}`;
  };

  // Handle view details
  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setIsDetailsOpen(true);
    setOpenDropdownId(null);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openDropdownId && !event.target.closest('.dropdown-container')) {
        setOpenDropdownId(null);
      }
    };

    if (openDropdownId) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [openDropdownId]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'confirmed': return 'bg-green-100 text-green-700 border-green-200';
      case 'completed': return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  // Filter bookings based on search query
  const filteredBookings = bookings.filter(booking => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      booking.bookingRef?.toLowerCase().includes(query) ||
      booking.user?.name?.toLowerCase().includes(query) ||
      booking.user?.email?.toLowerCase().includes(query) ||
      booking.suburb?.toLowerCase().includes(query) ||
      booking.postcode?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - Desktop */}
      <aside className="w-64 bg-slate-900 text-slate-300 hidden md:flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-white tracking-tight">Himalayan Admin</h1>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <button 
            onClick={handleNavigateHome}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-colors hover:bg-slate-800 text-slate-300 text-sm"
          >
            <Home className="h-5 w-5" />
            Home
          </button>
          <button 
            onClick={() => handleTabChange('bookings')}
            className={cn(
              "flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-colors text-sm",
              activeTab === 'bookings' ? "bg-accent text-white" : "hover:bg-slate-800"
            )}
          >
            <List className="h-5 w-5" />
            Bookings
          </button>
          <button 
            onClick={() => handleTabChange('calendar')}
            className={cn(
              "flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-colors text-sm",
              activeTab === 'calendar' ? "bg-accent text-white" : "hover:bg-slate-800"
            )}
          >
            <CalendarIcon className="h-5 w-5" />
            Calendar
          </button>
          <button 
            onClick={() => handleTabChange('notifications')}
            className={cn(
              "flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-colors text-sm relative",
              activeTab === 'notifications' ? "bg-accent text-white" : "hover:bg-slate-800"
            )}
          >
            <Bell className="h-5 w-5" />
            Notifications
            {unreadCount > 0 && (
              <span className="ml-auto bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
          <button 
            onClick={() => handleTabChange('settings')}
            className={cn(
              "flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-colors text-sm",
              activeTab === 'settings' ? "bg-accent text-white" : "hover:bg-slate-800"
            )}
          >
            <Settings className="h-5 w-5" />
            Settings
          </button>
        </nav>
        <div className="p-4 border-t border-slate-800 space-y-3">
          <div className="flex items-center gap-3">
            {user?.picture ? (
              <img 
                src={user.picture} 
                alt={user.name || 'Admin'} 
                className="w-8 h-8 rounded-full border-2 border-slate-700"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
                <User className="h-4 w-4" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.name || 'Admin User'}</p>
              <p className="text-xs text-slate-500 truncate">{user?.email || 'admin@example.com'}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 rounded-md transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <aside className={cn(
        "fixed top-0 left-0 h-full w-64 bg-slate-900 text-slate-300 z-50 transform transition-transform duration-300 ease-in-out md:hidden flex flex-col",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6 flex items-center justify-between border-b border-slate-800">
          <h1 className="text-xl font-bold text-white tracking-tight">Himalayan Admin</h1>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
          <button 
            onClick={handleNavigateHome}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-colors hover:bg-slate-800 text-slate-300 text-sm"
          >
            <Home className="h-5 w-5" />
            Home
          </button>
          <button 
            onClick={() => handleTabChange('bookings')}
            className={cn(
              "flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-colors text-sm",
              activeTab === 'bookings' ? "bg-accent text-white" : "hover:bg-slate-800"
            )}
          >
            <List className="h-5 w-5" />
            Bookings
          </button>
          <button 
            onClick={() => handleTabChange('calendar')}
            className={cn(
              "flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-colors text-sm",
              activeTab === 'calendar' ? "bg-accent text-white" : "hover:bg-slate-800"
            )}
          >
            <CalendarIcon className="h-5 w-5" />
            Calendar
          </button>
          <button 
            onClick={() => handleTabChange('notifications')}
            className={cn(
              "flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-colors text-sm relative",
              activeTab === 'notifications' ? "bg-accent text-white" : "hover:bg-slate-800"
            )}
          >
            <Bell className="h-5 w-5" />
            Notifications
            {unreadCount > 0 && (
              <span className="ml-auto bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
          <button 
            onClick={() => handleTabChange('settings')}
            className={cn(
              "flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-colors text-sm",
              activeTab === 'settings' ? "bg-accent text-white" : "hover:bg-slate-800"
            )}
          >
            <Settings className="h-5 w-5" />
            Settings
          </button>
        </nav>
        <div className="p-4 border-t border-slate-800 space-y-3">
          <div className="flex items-center gap-3">
            {user?.picture ? (
              <img 
                src={user.picture} 
                alt={user.name || 'Admin'} 
                className="w-8 h-8 rounded-full border-2 border-slate-700"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
                <User className="h-4 w-4" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.name || 'Admin User'}</p>
              <p className="text-xs text-slate-500 truncate">{user?.email || 'admin@example.com'}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 rounded-md transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 md:px-8">
           <div className="flex items-center gap-3">
             <button
               onClick={() => setIsMobileMenuOpen(true)}
               className="md:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"
             >
               <Menu className="h-5 w-5 text-slate-600" />
             </button>
             <h2 className="text-lg md:text-xl font-bold text-slate-800 capitalize">{activeTab}</h2>
           </div>
           <div className="flex items-center gap-2 md:gap-4">
             {activeTab === 'bookings' && (
               <div className="relative">
                 <Search className="absolute left-2 md:left-3 top-2.5 h-4 w-4 text-slate-400" />
                 <input 
                   type="text" 
                   placeholder="Search..." 
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   className="pl-8 md:pl-9 pr-3 md:pr-4 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:border-accent w-32 md:w-64" 
                 />
               </div>
             )}
             <button 
               onClick={() => handleTabChange('notifications')}
               className="p-2 text-slate-400 hover:text-slate-600 relative"
             >
               <Bell className="h-5 w-5" />
               {unreadCount > 0 && (
                 <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                   {unreadCount > 9 ? '9+' : unreadCount}
                 </span>
               )}
             </button>
           </div>
        </header>

        {/* Content Area */}
        <div className="p-4 md:p-8 overflow-auto flex-1">
          {activeTab === 'bookings' && (
            <>
              {isLoading ? (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 flex flex-col items-center justify-center">
                  <Loader2 className="h-8 w-8 text-accent animate-spin mb-4" />
                  <p className="text-slate-600 font-medium">Loading bookings...</p>
                </div>
              ) : error ? (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                  <div className="flex items-center gap-3 text-red-600 mb-4">
                    <AlertCircle className="h-5 w-5" />
                    <p className="font-medium">{error}</p>
                  </div>
                  <button
                    onClick={fetchBookings}
                    className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-yellow-600 transition-colors font-medium"
                  >
                    Try Again
                  </button>
                </div>
              ) : filteredBookings.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
                  <List className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-600 font-medium">
                    {searchQuery ? 'No bookings match your search.' : 'No bookings found.'}
                  </p>
                </div>
              ) : (
                <>
                  {/* Desktop Table View */}
                  <div className="hidden md:block bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                          <tr>
                            <th className="px-6 py-4">Booking Ref</th>
                            <th className="px-6 py-4">Customer</th>
                            <th className="px-6 py-4">Service</th>
                            <th className="px-6 py-4">Date & Time</th>
                            <th className="px-6 py-4">Location</th>
                            <th className="px-6 py-4">Images</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {filteredBookings.map((booking) => (
                            <tr key={booking.id} className="hover:bg-slate-50 transition-colors">
                              <td className="px-6 py-4">
                                <span className="font-mono font-semibold text-slate-900">{booking.bookingRef}</span>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex flex-col gap-1">
                                  <span className="font-medium text-slate-900">{booking.user?.name || 'N/A'}</span>
                                  <div className="flex items-center gap-2 text-xs text-slate-500">
                                    <Mail className="h-3 w-3" />
                                    <span className="truncate max-w-[200px]">{booking.user?.email || 'N/A'}</span>
                                  </div>
                                  {booking.customerPhone && (
                                    <div className="flex items-center gap-2 text-xs text-slate-500">
                                      <Phone className="h-3 w-3" />
                                      <span>{booking.customerPhone}</span>
                                    </div>
                                  )}
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <span className="text-slate-700">{getServiceName(booking.serviceId)}</span>
                                {booking.jobSize && (
                                  <span className="ml-2 text-xs text-slate-500 capitalize">({booking.jobSize})</span>
                                )}
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex flex-col gap-1">
                                  <span className="text-slate-900 font-medium">{formatDate(booking.preferredDate)}</span>
                                  <span className="text-xs text-slate-500">{formatTimeSlot(booking.timeSlot)}</span>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-1 text-slate-700">
                                  <MapPin className="h-3 w-3 text-slate-400" />
                                  <span>{booking.suburb}, {booking.postcode}</span>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                {booking.files && booking.files.length > 0 ? (
                                  <div className="flex items-center gap-2">
                                    <div className="flex -space-x-2">
                                      {booking.files.slice(0, 3).map((file, idx) => {
                                        const url = getFileUrl(file);
                                        const isImage = file.mimeType?.startsWith('image/');
                                        return (
                                          <div
                                            key={file.id || idx}
                                            className="relative w-10 h-10 rounded-lg border-2 border-white overflow-hidden bg-slate-100 group cursor-pointer"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              window.open(url, '_blank');
                                            }}
                                          >
                                            {isImage ? (
                                              <img
                                                src={url}
                                                alt={file.originalFilename}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                  e.target.style.display = 'none';
                                                }}
                                              />
                                            ) : (
                                              <div className="w-full h-full flex items-center justify-center">
                                                <FileText className="h-4 w-4 text-slate-400" />
                                              </div>
                                            )}
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                              <ExternalLink className="h-3 w-3 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                          </div>
                                        );
                                      })}
                                    </div>
                                    {booking.files.length > 3 && (
                                      <span className="text-xs text-slate-500 font-medium">
                                        +{booking.files.length - 3}
                                      </span>
                                    )}
                                  </div>
                                ) : (
                                  <span className="text-slate-400 text-sm">No files</span>
                                )}
                              </td>
                              <td className="px-6 py-4">
                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(booking.status)}`}>
                                  {booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1) || 'N/A'}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center justify-end">
                                  <div className="relative dropdown-container">
                                    <button
                                      onClick={() => setOpenDropdownId(openDropdownId === booking.id ? null : booking.id)}
                                      disabled={updatingStatus === booking.id}
                                      className={cn(
                                        "p-2 rounded-lg transition-colors",
                                        updatingStatus === booking.id
                                          ? "text-slate-400 cursor-not-allowed"
                                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                                      )}
                                    >
                                      {updatingStatus === booking.id ? (
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                      ) : (
                                        <MoreVertical className="h-5 w-5" />
                                      )}
                                    </button>
                                    {openDropdownId === booking.id && (
                                      <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-slate-200 z-50 py-1">
                                        <button
                                          onClick={() => handleViewDetails(booking)}
                                          className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                                        >
                                          <Eye className="h-4 w-4" />
                                          View Details
                                        </button>
                                        {booking.status?.toLowerCase() === 'pending' && (
                                          <>
                                            <button
                                              onClick={() => handleConfirmBooking(booking.id)}
                                              disabled={updatingStatus === booking.id}
                                              className="w-full px-4 py-2 text-left text-sm text-green-700 hover:bg-green-50 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                              <CheckCircle className="h-4 w-4" />
                                              Confirm
                                            </button>
                                            <button
                                              onClick={() => handleRejectBooking(booking.id)}
                                              disabled={updatingStatus === booking.id}
                                              className="w-full px-4 py-2 text-left text-sm text-red-700 hover:bg-red-50 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                              <Ban className="h-4 w-4" />
                                              Cancel
                                            </button>
                                          </>
                                        )}
                                        {booking.status?.toLowerCase() === 'confirmed' && (
                                          <button
                                            onClick={() => handleCompleteBooking(booking.id)}
                                            disabled={updatingStatus === booking.id}
                                            className="w-full px-4 py-2 text-left text-sm text-blue-700 hover:bg-blue-50 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                          >
                                            <CheckCircle className="h-4 w-4" />
                                            Complete
                                          </button>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Mobile Card View */}
                  <div className="md:hidden space-y-4">
                    {filteredBookings.map((booking) => (
                      <div key={booking.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <span className="font-mono font-semibold text-slate-900 text-sm">{booking.bookingRef}</span>
                            <span className={`ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(booking.status)}`}>
                              {booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1) || 'N/A'}
                            </span>
                          </div>
                          {/* Action Menu - Top Right */}
                          <div className="relative dropdown-container">
                            <button
                              onClick={() => setOpenDropdownId(openDropdownId === booking.id ? null : booking.id)}
                              disabled={updatingStatus === booking.id}
                              className={cn(
                                "p-2 rounded-lg transition-colors",
                                updatingStatus === booking.id
                                  ? "text-slate-400 cursor-not-allowed"
                                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                              )}
                            >
                              {updatingStatus === booking.id ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                              ) : (
                                <MoreVertical className="h-5 w-5" />
                              )}
                            </button>
                            {openDropdownId === booking.id && (
                              <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-slate-200 z-50 py-1">
                                <button
                                  onClick={() => handleViewDetails(booking)}
                                  className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                                >
                                  <Eye className="h-4 w-4" />
                                  View Details
                                </button>
                                {booking.status?.toLowerCase() === 'pending' && (
                                  <>
                                    <button
                                      onClick={() => handleConfirmBooking(booking.id)}
                                      disabled={updatingStatus === booking.id}
                                      className="w-full px-4 py-2 text-left text-sm text-green-700 hover:bg-green-50 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                      <CheckCircle className="h-4 w-4" />
                                      Confirm
                                    </button>
                                    <button
                                      onClick={() => handleRejectBooking(booking.id)}
                                      disabled={updatingStatus === booking.id}
                                      className="w-full px-4 py-2 text-left text-sm text-red-700 hover:bg-red-50 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                      <Ban className="h-4 w-4" />
                                      Cancel
                                    </button>
                                  </>
                                )}
                                {booking.status?.toLowerCase() === 'confirmed' && (
                                  <button
                                    onClick={() => handleCompleteBooking(booking.id)}
                                    disabled={updatingStatus === booking.id}
                                    className="w-full px-4 py-2 text-left text-sm text-blue-700 hover:bg-blue-50 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    <CheckCircle className="h-4 w-4" />
                                    Complete
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          {/* Customer Info */}
                          <div>
                            <p className="font-semibold text-slate-900 mb-1">{booking.user?.name || 'N/A'}</p>
                            <div className="flex flex-col gap-1 text-xs text-slate-600">
                              <div className="flex items-center gap-2">
                                <Mail className="h-3 w-3" />
                                <span className="truncate">{booking.user?.email || 'N/A'}</span>
                              </div>
                              {booking.customerPhone && (
                                <div className="flex items-center gap-2">
                                  <Phone className="h-3 w-3" />
                                  <span>{booking.customerPhone}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Service & Job Size */}
                          <div>
                            <p className="text-sm font-medium text-slate-700">
                              {getServiceName(booking.serviceId)}
                              {booking.jobSize && (
                                <span className="ml-2 text-xs text-slate-500 font-normal capitalize">({booking.jobSize})</span>
                              )}
                            </p>
                          </div>

                          {/* Date & Time */}
                          <div className="flex items-center gap-4 text-sm">
                            <div>
                              <p className="text-slate-900 font-medium">{formatDate(booking.preferredDate)}</p>
                              <p className="text-xs text-slate-500">{formatTimeSlot(booking.timeSlot)}</p>
                            </div>
                          </div>

                          {/* Location */}
                          <div className="flex items-center gap-2 text-sm text-slate-700">
                            <MapPin className="h-4 w-4 text-slate-400" />
                            <span>{booking.suburb}, {booking.postcode}</span>
                          </div>

                          {/* Files Preview */}
                          {booking.files && booking.files.length > 0 && (
                            <div>
                              <p className="text-xs text-slate-500 mb-2">Files ({booking.files.length})</p>
                              <div className="flex items-center gap-2 flex-wrap">
                                {booking.files.slice(0, 3).map((file, idx) => {
                                  const url = getFileUrl(file);
                                  const isImage = file.mimeType?.startsWith('image/');
                                  return (
                                    <div
                                      key={file.id || idx}
                                      className="relative w-12 h-12 rounded-lg border border-slate-200 overflow-hidden bg-slate-100"
                                      onClick={() => window.open(url, '_blank')}
                                    >
                                      {isImage ? (
                                        <img
                                          src={url}
                                          alt={file.originalFilename}
                                          className="w-full h-full object-cover"
                                          onError={(e) => {
                                            e.target.style.display = 'none';
                                          }}
                                        />
                                      ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                          <FileText className="h-5 w-5 text-slate-400" />
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                                {booking.files.length > 3 && (
                                  <div className="w-12 h-12 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-center">
                                    <span className="text-xs text-slate-500 font-medium">+{booking.files.length - 3}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </>
          )}

          {activeTab === 'calendar' && (
            <CalendarView />
          )}

          {activeTab === 'notifications' && (
            <>
              {isLoadingNotifications ? (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 flex flex-col items-center justify-center">
                  <Loader2 className="h-8 w-8 text-accent animate-spin mb-4" />
                  <p className="text-slate-600 font-medium">Loading notifications...</p>
                </div>
              ) : notificationsError ? (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                  <div className="flex items-center gap-3 text-red-600 mb-4">
                    <AlertCircle className="h-5 w-5" />
                    <p className="font-medium">{notificationsError}</p>
                  </div>
                  <button
                    onClick={() => fetchNotifications(0)}
                    className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-yellow-600 transition-colors font-medium"
                  >
                    Try Again
                  </button>
                </div>
              ) : notifications.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
                  <Bell className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-600 font-medium">No notifications found.</p>
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="p-4 md:p-6 border-b border-slate-200">
                    <h3 className="text-lg font-bold text-slate-900">Notifications</h3>
                    <p className="text-sm text-slate-500 mt-1">
                      {notifications.length} notification{notifications.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {notifications.map((notification) => {
                      const isExpanded = expandedNotificationId === notification.id;
                      return (
                        <div
                          key={notification.id}
                          className={cn(
                            "transition-colors",
                            !notification.isRead && "bg-blue-50/50"
                          )}
                        >
                          {/* Collapsed Header - Always Visible */}
                          <div
                            onClick={() => handleToggleNotification(notification.id)}
                            className={cn(
                              "p-4 md:p-6 hover:bg-slate-50 cursor-pointer transition-colors",
                              isExpanded && "bg-slate-50"
                            )}
                          >
                            <div className="flex items-start gap-4">
                              <div className={cn(
                                "w-2 h-2 rounded-full mt-2 flex-shrink-0",
                                !notification.isRead ? "bg-blue-500" : "bg-slate-300"
                              )} />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-4">
                                  <p className={cn(
                                    "text-sm md:text-base font-medium",
                                    !notification.isRead ? "text-slate-900" : "text-slate-700"
                                  )}>
                                    {notification.message}
                                  </p>
                                  <div className="flex items-center gap-3 flex-shrink-0">
                                    <span className="text-xs text-slate-500">
                                      {new Date(notification.createdAt).toLocaleDateString('en-AU', {
                                        day: 'numeric',
                                        month: 'short',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                      })}
                                    </span>
                                    <ChevronDown
                                      className={cn(
                                        "h-4 w-4 text-slate-400 transition-transform",
                                        isExpanded && "rotate-180"
                                      )}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Expanded Details - Only shown when expanded */}
                          {isExpanded && (
                            <div className="px-4 md:px-6 pb-4 md:pb-6 pt-0 border-t border-slate-100">
                              <div className="ml-6 space-y-3">
                                {notification.booking && (
                                  <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                                    <div className="flex flex-wrap items-center gap-4 text-sm">
                                      <div>
                                        <span className="text-slate-500">Booking:</span>
                                        <span className="ml-2 font-mono font-semibold text-slate-900">
                                          {notification.booking.bookingRef}
                                        </span>
                                      </div>
                                      <div>
                                        <span className="text-slate-500">Service:</span>
                                        <span className="ml-2 text-slate-900">
                                          {getServiceName(notification.booking.serviceId)}
                                        </span>
                                      </div>
                                      <div>
                                        <span className="text-slate-500">Date:</span>
                                        <span className="ml-2 text-slate-900">
                                          {formatDate(notification.booking.preferredDate)}
                                        </span>
                                      </div>
                                      <div>
                                        <span className="text-slate-500">Status:</span>
                                        <span className={cn(
                                          "ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border",
                                          getStatusColor(notification.booking.status)
                                        )}>
                                          {notification.booking.status?.charAt(0).toUpperCase() + notification.booking.status?.slice(1) || 'N/A'}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                )}
                                {notification.user && (
                                  <div className="flex items-center gap-2 text-xs text-slate-500">
                                    {notification.user.picture && (
                                      <img
                                        src={notification.user.picture}
                                        alt={notification.user.name || 'User'}
                                        className="w-5 h-5 rounded-full"
                                      />
                                    )}
                                    <span>{notification.user.name || notification.user.email}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  {notificationsTotalPages > 1 && (
                    <div className="p-4 md:p-6 border-t border-slate-200 flex items-center justify-between">
                      <button
                        onClick={() => fetchNotifications(notificationsPage - 1)}
                        disabled={notificationsPage === 0}
                        className={cn(
                          "px-4 py-2 rounded-lg font-medium transition-colors",
                          notificationsPage === 0
                            ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                            : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                        )}
                      >
                        Previous
                      </button>
                      <span className="text-sm text-slate-600">
                        Page {notificationsPage + 1} of {notificationsTotalPages}
                      </span>
                      <button
                        onClick={() => fetchNotifications(notificationsPage + 1)}
                        disabled={notificationsPage >= notificationsTotalPages - 1}
                        className={cn(
                          "px-4 py-2 rounded-lg font-medium transition-colors",
                          notificationsPage >= notificationsTotalPages - 1
                            ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                            : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                        )}
                      >
                        Next
                      </button>
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {activeTab === 'settings' && (
             <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8 max-w-2xl">
               <h3 className="text-base md:text-lg font-bold text-slate-900 mb-6">System Settings</h3>
               <div className="space-y-4">
                 <div className="flex items-center justify-between py-4 border-b border-slate-100">
                   <div className="flex-1 pr-4">
                     <p className="font-medium text-slate-900 text-sm md:text-base">Email Notifications</p>
                     <p className="text-xs md:text-sm text-slate-500 mt-1">Receive emails for new bookings</p>
                   </div>
                   <div className="w-10 h-6 bg-accent rounded-full relative cursor-pointer flex-shrink-0">
                     <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                   </div>
                 </div>
                 <div className="flex items-center justify-between py-4 border-b border-slate-100">
                   <div className="flex-1 pr-4">
                     <p className="font-medium text-slate-900 text-sm md:text-base">SMS Notifications</p>
                     <p className="text-xs md:text-sm text-slate-500 mt-1">Send SMS to customers</p>
                   </div>
                    <div className="w-10 h-6 bg-slate-200 rounded-full relative cursor-pointer flex-shrink-0">
                     <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                   </div>
                 </div>
               </div>
             </div>
          )}
        </div>
      </main>

      {/* Confirmation Dialog */}
      <Dialog
        isOpen={confirmationDialog.isOpen}
        onClose={() => {
          if (updatingStatus !== confirmationDialog.bookingId) {
            setConfirmationDialog({ isOpen: false, action: null, bookingId: null, bookingRef: null, message: '', onConfirm: null });
          }
        }}
        title=""
        showCloseButton={updatingStatus !== confirmationDialog.bookingId}
        maxWidth="sm"
      >
        {confirmationDialog.isOpen && (
          <div className="space-y-4">
            {/* Icon and Title */}
            <div className="flex flex-col items-center text-center space-y-3">
              <div className={cn(
                "w-16 h-16 rounded-full flex items-center justify-center",
                confirmationDialog.action === 'confirm' && "bg-green-100",
                confirmationDialog.action === 'complete' && "bg-blue-100",
                confirmationDialog.action === 'reject' && "bg-red-100"
              )}>
                {confirmationDialog.action === 'confirm' && (
                  <CheckCircle className="h-8 w-8 text-green-600" />
                )}
                {confirmationDialog.action === 'complete' && (
                  <CheckCircle className="h-8 w-8 text-blue-600" />
                )}
                {confirmationDialog.action === 'reject' && (
                  <Ban className="h-8 w-8 text-red-600" />
                )}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  {confirmationDialog.action === 'confirm' && 'Confirm Booking'}
                  {confirmationDialog.action === 'complete' && 'Complete Booking'}
                  {confirmationDialog.action === 'reject' && 'Reject Booking'}
                </h3>
                <p className="text-sm text-slate-500 mt-1 font-mono">
                  {confirmationDialog.bookingRef}
                </p>
              </div>
            </div>

            {/* Message */}
            <div className="text-center">
              <p className="text-slate-700">
                {confirmationDialog.message}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => {
                  if (updatingStatus !== confirmationDialog.bookingId) {
                    setConfirmationDialog({ isOpen: false, action: null, bookingId: null, bookingRef: null, message: '', onConfirm: null });
                  }
                }}
                disabled={updatingStatus === confirmationDialog.bookingId}
                className={cn(
                  "flex-1 px-4 py-2.5 rounded-lg font-medium text-sm transition-colors",
                  updatingStatus === confirmationDialog.bookingId
                    ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                    : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                )}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (confirmationDialog.onConfirm) {
                    confirmationDialog.onConfirm();
                  }
                }}
                disabled={updatingStatus === confirmationDialog.bookingId}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-colors text-white",
                  updatingStatus === confirmationDialog.bookingId
                    ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                    : confirmationDialog.action === 'confirm' && "bg-green-600 hover:bg-green-700",
                    confirmationDialog.action === 'complete' && "bg-blue-600 hover:bg-blue-700",
                    confirmationDialog.action === 'reject' && "bg-red-600 hover:bg-red-700"
                )}
              >
                {updatingStatus === confirmationDialog.bookingId ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    {confirmationDialog.action === 'confirm' && (
                      <>
                        <CheckCircle className="h-4 w-4" />
                        <span>Confirm</span>
                      </>
                    )}
                    {confirmationDialog.action === 'complete' && (
                      <>
                        <CheckCircle className="h-4 w-4" />
                        <span>Complete</span>
                      </>
                    )}
                    {confirmationDialog.action === 'reject' && (
                      <>
                        <Ban className="h-4 w-4" />
                        <span>Reject</span>
                      </>
                    )}
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </Dialog>

      {/* Booking Details Dialog */}
      <Dialog
        isOpen={isDetailsOpen}
        onClose={() => {
          setIsDetailsOpen(false);
          setSelectedBooking(null);
        }}
        title={selectedBooking ? `Booking Details - ${selectedBooking.bookingRef}` : 'Booking Details'}
        maxWidth="lg"
      >
        {selectedBooking && (
          <div className="space-y-6">
            {/* Status Badge */}
            <div className="flex items-center justify-between">
              <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium border ${getStatusColor(selectedBooking.status)}`}>
                {selectedBooking.status?.charAt(0).toUpperCase() + selectedBooking.status?.slice(1) || 'N/A'}
              </span>
              <span className="text-xs text-slate-500">
                Created: {new Date(selectedBooking.createdAt).toLocaleString()}
              </span>
            </div>

            {/* Customer Information */}
            <div className="bg-slate-50 rounded-lg p-4 space-y-3">
              <h3 className="font-semibold text-slate-900 mb-3">Customer Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Name</p>
                  <p className="font-medium text-slate-900">{selectedBooking.user?.name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Email</p>
                  <div className="flex items-center gap-2">
                    <Mail className="h-3 w-3 text-slate-400" />
                    <p className="font-medium text-slate-900 break-all">{selectedBooking.user?.email || 'N/A'}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Phone</p>
                  <div className="flex items-center gap-2">
                    <Phone className="h-3 w-3 text-slate-400" />
                    <p className="font-medium text-slate-900">{selectedBooking.customerPhone || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Service Details */}
            <div className="space-y-3">
              <h3 className="font-semibold text-slate-900">Service Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-3 rounded-lg">
                  <p className="text-xs text-slate-500 mb-1">Service</p>
                  <p className="font-medium text-slate-900">{getServiceName(selectedBooking.serviceId)}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg">
                  <p className="text-xs text-slate-500 mb-1">Job Size</p>
                  <p className="font-medium text-slate-900 capitalize">{selectedBooking.jobSize || 'N/A'}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg">
                  <p className="text-xs text-slate-500 mb-1">Preferred Date</p>
                  <p className="font-medium text-slate-900">{formatDate(selectedBooking.preferredDate)}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg">
                  <p className="text-xs text-slate-500 mb-1">Time Slot</p>
                  <p className="font-medium text-slate-900">{formatTimeSlot(selectedBooking.timeSlot)}</p>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="bg-slate-50 p-3 rounded-lg">
              <p className="text-xs text-slate-500 mb-1">Location</p>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-slate-400" />
                <p className="font-medium text-slate-900">{selectedBooking.suburb}, {selectedBooking.postcode}</p>
              </div>
            </div>

            {/* Description */}
            {selectedBooking.description && (
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Description</h3>
                <p className="text-sm text-slate-700 bg-slate-50 p-4 rounded-lg leading-relaxed">
                  {selectedBooking.description}
                </p>
              </div>
            )}

            {/* Files */}
            {selectedBooking.files && selectedBooking.files.length > 0 && (
              <div>
                <h3 className="font-semibold text-slate-900 mb-3">Attachments ({selectedBooking.files.length})</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {selectedBooking.files.map((file, idx) => {
                    const url = getFileUrl(file);
                    const isImage = file.mimeType?.startsWith('image/');
                    return (
                      <a
                        key={file.id || idx}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative aspect-square bg-slate-100 rounded-lg overflow-hidden border border-slate-200 hover:border-accent/50 transition-all"
                      >
                        {isImage ? (
                          <img
                            src={url}
                            alt={file.originalFilename}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center p-2">
                            <FileText className="h-8 w-8 text-slate-400 mb-2" />
                            <span className="text-xs text-slate-500 text-center truncate w-full px-1">
                              {file.originalFilename}
                            </span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                          <ExternalLink className="h-5 w-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-1.5 opacity-0 group-hover:opacity-100 transition-opacity truncate px-2">
                          {file.originalFilename}
                        </div>
                      </a>
                    );
                  })}
                </div>
                <div className="mt-2 text-xs text-slate-500">
                  {selectedBooking.files.map((file, idx) => (
                    <div key={file.id || idx} className="flex items-center justify-between py-1">
                      <span className="truncate flex-1">{file.originalFilename}</span>
                      <span className="ml-2 text-slate-400">{formatFileSize(file.fileSize)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            {selectedBooking.status?.toLowerCase() === 'pending' && (
              <div className="flex gap-3 pt-4 border-t border-slate-200">
                <button
                  onClick={() => {
                    setIsDetailsOpen(false);
                    setTimeout(() => handleConfirmBooking(selectedBooking.id), 100);
                  }}
                  disabled={updatingStatus === selectedBooking.id}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-colors",
                    updatingStatus === selectedBooking.id
                      ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                      : "bg-green-600 text-white hover:bg-green-700"
                  )}
                >
                  {updatingStatus === selectedBooking.id ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4" />
                      <span>Confirm Booking</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    setIsDetailsOpen(false);
                    setTimeout(() => handleRejectBooking(selectedBooking.id), 100);
                  }}
                  disabled={updatingStatus === selectedBooking.id}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-colors",
                    updatingStatus === selectedBooking.id
                      ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                      : "bg-red-600 text-white hover:bg-red-700"
                  )}
                >
                  {updatingStatus === selectedBooking.id ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <Ban className="h-4 w-4" />
                      <span>Reject</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}
      </Dialog>
    </div>
  );
}
