import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, AlertCircle, Loader2, MapPin, Clock, User, CheckCircle, XCircle, Hourglass, Ban } from 'lucide-react';
import { startOfMonth, endOfMonth, eachDayOfInterval, format, isSameMonth, isSameDay, isToday, startOfWeek, endOfWeek, addMonths, subMonths, parseISO, isBefore, startOfDay } from 'date-fns';
import { cn } from '../../utils/cn';
import { bookingAPI } from '../../services/api';
import { Dialog } from '../ui/Dialog';
import { services } from '../../data/services';

export function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [blockedDates, setBlockedDates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, [currentDate]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await bookingAPI.getBlockedDates();
      
      if (response.success && response.data) {
        setBlockedDates(response.data);
      } else {
        throw new Error(response.error?.message || 'Failed to fetch blocked dates');
      }

    } catch (err) {
      console.error('Error fetching calendar data:', err);
      setError('Failed to load calendar data');
    } finally {
      setIsLoading(false);
    }
  };

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const getDayEvents = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const dayBlocked = blockedDates.find(b => b.date === dateStr);

    return {
      blocked: dayBlocked,
      hasEvents: !!dayBlocked
    };
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setIsDialogOpen(true);
  };

  const previousMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const goToToday = () => setCurrentDate(new Date());

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'confirmed': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'completed': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'cancelled': return 'text-rose-600 bg-rose-50 border-rose-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  const getServiceTitle = (id) => {
    return services.find(s => s.id === id)?.title || id;
  };

  if (isLoading && !blockedDates.length) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 text-accent animate-spin mb-4" />
        <p className="text-slate-600 font-medium">Loading calendar...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <div className="flex items-center justify-between w-full sm:w-auto gap-4">
            <div className="flex items-center bg-slate-100 rounded-lg p-1">
              <button
                onClick={previousMonth}
                className="p-2 hover:bg-white hover:shadow-sm rounded-md transition-all text-slate-600"
                aria-label="Previous month"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={nextMonth}
                className="p-2 hover:bg-white hover:shadow-sm rounded-md transition-all text-slate-600"
                aria-label="Next month"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 min-w-[140px] text-center sm:text-left">
              {format(currentDate, 'MMMM yyyy')}
            </h2>
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
             <div className="flex items-center gap-6 text-sm mr-4 hidden md:flex">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-slate-600">Blocked</span>
              </div>
            </div>
            <button
              onClick={goToToday}
              className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-medium text-sm shadow-sm whitespace-nowrap"
            >
              Today
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-px bg-slate-200 rounded-lg overflow-hidden border border-slate-200">
          {/* Week Day Headers */}
          {weekDays.map((day) => (
            <div
              key={day}
              className="bg-slate-50 text-center text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider py-2 sm:py-3"
            >
              {day}
            </div>
          ))}

          {/* Calendar Days */}
          {days.map((day, dayIdx) => {
            const isCurrentMonth = isSameMonth(day, currentDate);
            const isTodayDate = isToday(day);
            const { blocked } = getDayEvents(day);
            const isSelected = selectedDate && isSameDay(day, selectedDate);
            
            return (
              <button
                key={dayIdx}
                onClick={() => handleDateClick(day)}
                className={cn(
                  "relative min-h-[3.5rem] sm:h-32 p-1 sm:p-2 transition-all text-left flex flex-col group bg-white hover:bg-slate-50",
                  !isCurrentMonth && "bg-slate-50/50 text-slate-400",
                  isSelected && "ring-2 ring-inset ring-accent z-10"
                )}
              >
                <div className="flex items-center justify-between mb-1 sm:mb-2">
                  <span className={cn(
                    "w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded-full text-xs sm:text-sm font-medium transition-colors",
                    isTodayDate 
                      ? "bg-accent text-white shadow-sm" 
                      : "text-slate-700 group-hover:bg-slate-200"
                  )}>
                    {format(day, 'd')}
                  </span>
                  {blocked && (
                    <Ban className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" />
                  )}
                </div>

                <div className="flex-1 flex flex-col gap-1 overflow-hidden w-full">
                  {blocked && (
                    <>
                      <div className="hidden sm:block bg-red-50 border border-red-100 text-red-700 text-[10px] px-1.5 py-0.5 rounded truncate font-medium">
                        Blocked
                      </div>
                      <div className="sm:hidden w-full h-1.5 bg-red-500 rounded-full mt-1"></div>
                    </>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Details Dialog */}
      <Dialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title={selectedDate ? format(selectedDate, 'EEEE, MMMM d, yyyy') : 'Date Details'}
        maxWidth="md"
      >
        {selectedDate && (
          <div className="space-y-6">
            {(() => {
              const { blocked } = getDayEvents(selectedDate);
              
              if (!blocked) {
                return (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <CalendarIcon className="h-6 w-6 text-slate-400" />
                    </div>
                    <p className="text-slate-500">No events scheduled for this day.</p>
                  </div>
                );
              }

              return (
                <>
                  {/* Blocked Status */}
                  {blocked && (
                    <div className="bg-red-50 rounded-lg p-4 border border-red-100">
                      <div className="flex items-start gap-3">
                        <Ban className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-red-900">Date Blocked</h4>
                          <p className="text-sm text-red-700 mt-1">{blocked.reason || 'No reason provided'}</p>
                          <p className="text-xs text-red-500 mt-2">
                            Blocked on {format(parseISO(blocked.createdAt), 'MMM d, yyyy')}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Associated Booking Details */}
                  {blocked.booking && (
                    <div className="border border-slate-200 rounded-lg overflow-hidden">
                      <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
                        <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-emerald-600" />
                          Associated Booking
                        </h4>
                      </div>
                      <div className="p-4 space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className={cn(
                              "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border mb-1",
                              getStatusColor(blocked.booking.status)
                            )}>
                              {blocked.booking.status?.charAt(0).toUpperCase() + blocked.booking.status?.slice(1)}
                            </span>
                            <p className="font-mono text-sm text-slate-500">{blocked.booking.bookingRef}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-slate-900">{getServiceTitle(blocked.booking.serviceId)}</p>
                            <p className="text-xs text-slate-500 capitalize">{blocked.booking.jobSize} Job</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-slate-500 mb-1">Customer</p>
                            <div className="flex items-center gap-2">
                              {blocked.user?.picture ? (
                                <img src={blocked.user.picture} alt="" className="w-5 h-5 rounded-full" />
                              ) : (
                                <User className="h-4 w-4 text-slate-400" />
                              )}
                              <span className="text-sm font-medium text-slate-900 truncate">
                                {blocked.user?.name || 'Unknown User'}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5 ml-6 truncate">{blocked.user?.email}</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 mb-1">Time & Location</p>
                            <div className="flex items-center gap-2 text-sm text-slate-900">
                              <Clock className="h-3.5 w-3.5 text-slate-400" />
                              <span className="capitalize">{blocked.booking.timeSlot}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-900 mt-1">
                              <MapPin className="h-3.5 w-3.5 text-slate-400" />
                              <span className="truncate">{blocked.booking.suburb}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        )}
      </Dialog>
    </div>
  );
}