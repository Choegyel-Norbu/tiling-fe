import React, { useState } from 'react';
import { Calendar as CalendarIcon, List, Settings, Search, Bell, User, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import { mockBookings } from '../data/mockBookings';
import { cn } from '../utils/cn';

export function Admin() {
  const [activeTab, setActiveTab] = useState('bookings');

  const getStatusColor = (status) => {
    switch (status) {
      case 'New': return 'bg-blue-100 text-blue-700';
      case 'Confirmed': return 'bg-green-100 text-green-700';
      case 'Completed': return 'bg-slate-100 text-slate-700';
      case 'Cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 hidden md:flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-white tracking-tight">TrueLine Admin</h1>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <button 
            onClick={() => setActiveTab('bookings')}
            className={cn(
              "flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-colors",
              activeTab === 'bookings' ? "bg-accent text-white" : "hover:bg-slate-800"
            )}
          >
            <List className="h-5 w-5" />
            Bookings
          </button>
          <button 
            onClick={() => setActiveTab('calendar')}
            className={cn(
              "flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-colors",
              activeTab === 'calendar' ? "bg-accent text-white" : "hover:bg-slate-800"
            )}
          >
            <CalendarIcon className="h-5 w-5" />
            Calendar
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={cn(
              "flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-colors",
              activeTab === 'settings' ? "bg-accent text-white" : "hover:bg-slate-800"
            )}
          >
            <Settings className="h-5 w-5" />
            Settings
          </button>
        </nav>
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
               <User className="h-4 w-4" />
             </div>
             <div>
               <p className="text-sm font-medium text-white">Admin User</p>
               <p className="text-xs text-slate-500">View Profile</p>
             </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-8">
           <h2 className="text-xl font-bold text-slate-800 capitalize">{activeTab}</h2>
           <div className="flex items-center gap-4">
             <div className="relative">
               <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
               <input type="text" placeholder="Search..." className="pl-9 pr-4 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:border-accent" />
             </div>
             <button className="p-2 text-slate-400 hover:text-slate-600 relative">
               <Bell className="h-5 w-5" />
               <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
             </button>
           </div>
        </header>

        {/* Content Area */}
        <div className="p-8 overflow-auto flex-1">
          {activeTab === 'bookings' && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
               <table className="w-full text-left text-sm">
                 <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                   <tr>
                     <th className="px-6 py-4">ID</th>
                     <th className="px-6 py-4">Customer</th>
                     <th className="px-6 py-4">Service</th>
                     <th className="px-6 py-4">Date</th>
                     <th className="px-6 py-4">Location</th>
                     <th className="px-6 py-4">Status</th>
                     <th className="px-6 py-4 text-right">Actions</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                   {mockBookings.map((booking) => (
                     <tr key={booking.id} className="hover:bg-slate-50 transition-colors">
                       <td className="px-6 py-4 font-medium text-slate-900">{booking.id}</td>
                       <td className="px-6 py-4">{booking.customer}</td>
                       <td className="px-6 py-4">{booking.service}</td>
                       <td className="px-6 py-4">{booking.date}</td>
                       <td className="px-6 py-4">{booking.location}</td>
                       <td className="px-6 py-4">
                         <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                           {booking.status}
                         </span>
                       </td>
                       <td className="px-6 py-4 text-right">
                         <button className="text-slate-400 hover:text-accent font-medium">Edit</button>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
            </div>
          )}

          {activeTab === 'calendar' && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center text-slate-500">
              <CalendarIcon className="h-16 w-16 mx-auto mb-4 text-slate-300" />
              <h3 className="text-lg font-medium text-slate-900">Calendar View</h3>
              <p>Calendar integration would go here (e.g. FullCalendar or React-Big-Calendar).</p>
            </div>
          )}

          {activeTab === 'settings' && (
             <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 max-w-2xl">
               <h3 className="text-lg font-bold text-slate-900 mb-6">System Settings</h3>
               <div className="space-y-4">
                 <div className="flex items-center justify-between py-4 border-b border-slate-100">
                   <div>
                     <p className="font-medium text-slate-900">Email Notifications</p>
                     <p className="text-sm text-slate-500">Receive emails for new bookings</p>
                   </div>
                   <div className="w-10 h-6 bg-accent rounded-full relative cursor-pointer">
                     <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                   </div>
                 </div>
                 <div className="flex items-center justify-between py-4 border-b border-slate-100">
                   <div>
                     <p className="font-medium text-slate-900">SMS Notifications</p>
                     <p className="text-sm text-slate-500">Send SMS to customers</p>
                   </div>
                    <div className="w-10 h-6 bg-slate-200 rounded-full relative cursor-pointer">
                     <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                   </div>
                 </div>
               </div>
             </div>
          )}
        </div>
      </main>
    </div>
  );
}
