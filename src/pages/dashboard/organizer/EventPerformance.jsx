import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
   ArrowLeft, Calendar, MapPin, Loader2,
   RefreshCcw, XSquare, AlertTriangle, Clock, BarChart3
} from 'lucide-react';
import { organizerService } from '../../../services/organizerService';
import NotificationModal from '../../../components/NotificationModal';
import LoadingSpinner from '../../../components/LoadingSpinner';

const EventPerformance = () => {
   const { id } = useParams();
   const navigate = useNavigate();
   const [data, setData] = useState(null);
   const [loading, setLoading] = useState(true);
   const [actionLoading, setActionLoading] = useState(false);
   const [showCancelModal, setShowCancelModal] = useState(false);
   const [showRescheduleModal, setShowRescheduleModal] = useState(false);
   const [showDeleteModal, setShowDeleteModal] = useState(false);
   const [newDate, setNewDate] = useState('');
   const [notification, setNotification] = useState({ isOpen: false, type: 'success', title: '', message: '' });

   const fetchData = async () => {
      try {
         const response = await organizerService.getEventPerformance(id);
         if (response.success) setData(response.data);
      } catch (error) {
         console.error('Error:', error);
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => { fetchData(); }, [id]);

   const handleCancelEvent = async () => {
      setActionLoading(true);
      try {
         const response = await organizerService.cancelEvent(id);
         setNotification({ isOpen: true, type: response.success ? 'success' : 'error', title: response.success ? 'Event Cancelled' : 'Cancellation Failed', message: response.message });
         if (response.success) { setShowCancelModal(false); fetchData(); }
      } catch (error) {
         setNotification({ isOpen: true, type: 'error', title: 'Error', message: error.message });
      } finally {
         setActionLoading(false);
      }
   };

   const handleDeleteEvent = async () => {
      setActionLoading(true);
      try {
         const response = await organizerService.deleteEvent(id);
         setNotification({ isOpen: true, type: response.success ? 'success' : 'error', title: response.success ? 'Event Deleted' : 'Deletion Failed', message: response.message });
         if (response.success) {
            setShowDeleteModal(false);
            navigate('/organizer/manage-events');
         }
      } catch (error) {
         setNotification({ isOpen: true, type: 'error', title: 'Error', message: error.message });
      } finally {
         setActionLoading(false);
      }
   };

   const handleReschedule = async () => {
      if (!newDate) return;
      setActionLoading(true);
      try {
         const response = await organizerService.rescheduleEvent(id, newDate);
         setNotification({ isOpen: true, type: response.success ? 'success' : 'error', title: response.success ? 'Event Rescheduled' : 'Reschedule Failed', message: response.message });
         if (response.success) { setShowRescheduleModal(false); fetchData(); }
      } catch (error) {
         setNotification({ isOpen: true, type: 'error', title: 'Error', message: error.message });
      } finally {
         setActionLoading(false);
      }
   };

   const formatCurrency = (amount) =>
      new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount || 0);

   if (loading) return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
         <Loader2 className="w-8 h-8 text-neutral-900 animate-spin mb-4" />
         <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Compiling Analytics...</p>
      </div>
   );

   if (!data) return <div className="p-8 text-center text-xs font-bold text-neutral-400 uppercase tracking-widest">Event data not found.</div>;

   const { event, performance } = data;
   const totalRevenue = performance.reduce((sum, p) => sum + parseFloat(p.revenue), 0);
   const totalTicketsSold = performance.reduce((sum, p) => sum + parseInt(p.sold_count), 0);
   const totalTicketsUsed = performance.reduce((sum, p) => sum + parseInt(p.used_count), 0);
   const totalCapacity = performance.reduce((sum, p) => sum + parseInt(p.quantity), 0);
   const entryRate = Math.round((totalTicketsUsed / (totalTicketsSold || 1)) * 100);

   const statusStyle = {
      active: 'bg-green-50 text-green-700 border-green-100',
      rescheduled: 'bg-amber-50 text-amber-700 border-amber-100',
      cancelled: 'bg-red-50 text-red-600 border-red-100',
   }[event.status] || 'bg-neutral-50 text-neutral-600 border-neutral-100';

   return (
      <div className="p-4 lg:p-10 max-w-6xl mx-auto pb-24 transition-all">
         {/* Back */}
         <button
            onClick={() => navigate('/organizer/manage-events')}
            className="flex items-center gap-2 text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-10 hover:text-neutral-900 transition-colors"
         >
            <ArrowLeft size={14} /> Event Registry
         </button>

         {/* Header */}
         <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-10">
            <div className="flex-1">
               <div className="flex items-center gap-2 mb-3">
                  <span className={`px-2 py-1 border rounded text-[9px] font-black uppercase tracking-widest ${statusStyle}`}>
                     {event.status}
                  </span>
                  <span className="text-[9px] font-bold text-neutral-300 uppercase tracking-widest">#{event.id}</span>
               </div>
               <h1 className="text-xl font-bold text-neutral-900 tracking-tight mb-1 uppercase">{event.title}</h1>
               <div className="flex flex-wrap gap-6 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                  <div className="flex items-center gap-2"><Calendar size={12} className="text-neutral-300" />{new Date(event.event_date).toLocaleDateString()}</div>
                  <div className="flex items-center gap-2"><MapPin size={12} className="text-neutral-300" />{event.location}</div>
               </div>
            </div>

            {event.status !== 'cancelled' && (
               <div className="flex gap-2">
                  <button
                     onClick={() => setShowRescheduleModal(true)}
                     className="flex items-center justify-center gap-2 bg-amber-500 text-white px-4 py-2.5 rounded-md font-bold text-[10px] uppercase tracking-widest hover:bg-amber-600 transition-all shadow-sm"
                  >
                     <RefreshCcw size={14} /> Reschedule
                  </button>
                  <button
                     onClick={() => setShowCancelModal(true)}
                     className="flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-2.5 rounded-md font-bold text-[10px] uppercase tracking-widest hover:bg-red-700 transition-all shadow-sm"
                  >
                     <XSquare size={14} /> Cancel
                  </button>
               </div>
            )}
            {event.status === 'cancelled' && (
               <div className="flex gap-2">
                  <button
                     onClick={() => setShowDeleteModal(true)}
                     className="flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-2.5 rounded-md font-bold text-[10px] uppercase tracking-widest hover:bg-red-700 transition-all shadow-sm"
                  >
                     <XSquare size={14} /> Delete Event
                  </button>
               </div>
            )}
         </div>

         {/* Main Grid */}
         <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
               {/* Stats Row */}
               <div className="grid grid-cols-3 gap-3">
                  <div className="bg-white p-5 rounded-lg border border-neutral-100 shadow-sm">
                     <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Sold</p>
                     <h3 className="text-xl font-black text-neutral-900 tracking-tight">
                        {totalTicketsSold}
                        <span className="text-xs text-neutral-300 font-medium ml-1">/ {totalCapacity}</span>
                     </h3>
                  </div>
                  <div className="bg-[#e3984d] p-5 rounded-lg shadow-lg">
                     <p className="text-white/60 font-bold text-[9px] uppercase tracking-widest mb-1">Revenue</p>
                     <h3 className="text-xl font-black text-white tracking-tight">{formatCurrency(totalRevenue)}</h3>
                  </div>
                  <div className="bg-white p-5 rounded-lg border border-neutral-100 shadow-sm">
                     <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Entry Rate</p>
                     <h3 className="text-xl font-black text-neutral-900 tracking-tight">{entryRate}%</h3>
                  </div>
               </div>

               {/* Tier Breakdown */}
               <div>
                  <div className="flex items-center justify-between mb-4 px-1">
                     <h3 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-2">
                        <BarChart3 size={12} /> Tier Breakdown
                     </h3>
                  </div>
                  <div className="space-y-3">
                     {performance.map((tier) => {
                        const fillPct = Math.round((tier.sold_count / (tier.quantity || 1)) * 100);
                        return (
                           <div key={tier.id} className="bg-white p-5 rounded-lg border border-neutral-100 shadow-sm">
                              <div className="flex items-center justify-between mb-4">
                                 <div>
                                    <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-tight">{tier.name}</h4>
                                    <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">{formatCurrency(tier.price)}/ticket</p>
                                 </div>
                                 <div className="text-right">
                                    <p className="text-sm font-black text-[#e3984d] tracking-tight">{formatCurrency(tier.revenue)}</p>
                                    <p className="text-[9px] font-bold text-neutral-400 uppercase">{tier.sold_count}/{tier.quantity} sold</p>
                                 </div>
                              </div>
                              <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                                 <div className="h-full bg-[#e3984d] rounded-full transition-all" style={{ width: `${fillPct}%` }} />
                              </div>
                              <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest mt-2">{fillPct}% capacity filled</p>
                           </div>
                        );
                     })}
                  </div>
               </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
               {/* Payout Card */}
               <div className="bg-[#e3984d] text-white p-6 rounded-lg shadow-lg">
                  <p className="text-white font-bold text-[9px] uppercase tracking-[0.2em] mb-2">Payout Estimate</p>
                  <h2 className="text-2xl font-black mb-6 tracking-tight">{formatCurrency(totalRevenue)}</h2>
                  <div className="flex items-center gap-3 bg-white/5 p-3 rounded-md border border-white/5">
                     <Clock className="text-white" size={14} />
                     <p className="text-[10px] font-bold text-white uppercase tracking-widest">Auto-settle 24h after end</p>
                  </div>
               </div>

               {/* Venue Card */}
               <div className="bg-white p-6 rounded-lg border border-neutral-100 shadow-sm">
                  <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest mb-4">Venue Details</p>
                  <div className="flex items-start gap-3">
                     <div className="w-9 h-9 rounded-md bg-neutral-50 border border-neutral-100 flex items-center justify-center text-neutral-500 shrink-0">
                        <MapPin size={16} />
                     </div>
                     <div>
                        <p className="font-bold text-neutral-900 text-xs">{event.location}</p>
                        <p className="text-[10px] text-neutral-400 font-medium mt-1">Verified Event Location</p>
                     </div>
                  </div>
               </div>
            </div>
         </div>

         {/* Cancel Modal */}
         {showCancelModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
               <div className="bg-white rounded-lg shadow-2xl p-8 max-w-sm w-full border border-neutral-100">
                  <div className="flex items-center gap-4 mb-6">
                     <div className="w-10 h-10 bg-red-50 text-red-600 rounded-md flex items-center justify-center border border-red-100">
                        <AlertTriangle size={18} />
                     </div>
                     <div>
                        <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-tight">Cancel Event?</h3>
                        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Permanent action</p>
                     </div>
                  </div>
                  <div className="bg-red-50 border border-red-100 p-4 rounded-md mb-6">
                     <p className="text-red-600 text-xs font-bold leading-relaxed">
                        All paid tickets will be automatically refunded. This action cannot be undone.
                     </p>
                  </div>
                  <div className="flex gap-3">
                     <button onClick={() => setShowCancelModal(false)} className="flex-1 py-3 font-bold text-[10px] text-neutral-400 uppercase tracking-widest border border-neutral-100 rounded-md hover:bg-neutral-50">
                        Back
                     </button>
                     <button
                        onClick={handleCancelEvent}
                        disabled={actionLoading}
                        className="flex-[2] bg-red-600 text-white font-bold py-3 rounded-md text-[10px] uppercase tracking-widest hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center"
                     >
                        {actionLoading ? <LoadingSpinner size="sm" /> : 'Confirm Cancel'}
                     </button>
                  </div>
               </div>
            </div>
         )}

         {/* Reschedule Modal */}
         {showRescheduleModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
               <div className="bg-white rounded-lg shadow-2xl p-8 max-w-sm w-full border border-neutral-100">
                  <div className="flex items-center gap-4 mb-6">
                     <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-md flex items-center justify-center border border-amber-100">
                        <RefreshCcw size={18} />
                     </div>
                     <div>
                        <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-tight">Reschedule Event</h3>
                        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Attendees will be notified</p>
                     </div>
                  </div>
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block mb-2">New Date & Time</label>
                  <input
                     type="datetime-local"
                     className="w-full bg-neutral-50 border border-neutral-100 rounded-md p-3 font-bold text-neutral-900 text-xs mb-6 outline-none focus:border-amber-500 focus:bg-white transition-all"
                     value={newDate}
                     onChange={(e) => setNewDate(e.target.value)}
                  />
                  <div className="flex gap-3">
                     <button onClick={() => setShowRescheduleModal(false)} className="flex-1 py-3 font-bold text-[10px] text-neutral-400 uppercase tracking-widest border border-neutral-100 rounded-md hover:bg-neutral-50">
                        Cancel
                     </button>
                     <button
                        onClick={handleReschedule}
                        disabled={actionLoading || !newDate}
                        className="flex-[2] bg-amber-500 text-white font-bold py-3 rounded-md text-[10px] uppercase tracking-widest hover:bg-amber-600 transition-colors disabled:opacity-50 flex items-center justify-center"
                     >
                        {actionLoading ? <LoadingSpinner size="sm" /> : 'Update Schedule'}
                     </button>
                  </div>
               </div>
            </div>
         )}

         {/* Delete Modal */}
         {showDeleteModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
               <div className="bg-white rounded-lg shadow-2xl p-8 max-w-sm w-full border border-neutral-100">
                  <div className="flex items-center gap-4 mb-6">
                     <div className="w-10 h-10 bg-red-50 text-red-600 rounded-md flex items-center justify-center border border-red-100">
                        <AlertTriangle size={18} />
                     </div>
                     <div>
                        <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-tight">Delete Event?</h3>
                        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Permanent action</p>
                     </div>
                  </div>
                  <div className="bg-red-50 border border-red-100 p-4 rounded-md mb-6">
                     <p className="text-red-600 text-xs font-bold leading-relaxed">
                        This will permanently delete the event along with all ticket types and ticket sales history. This action cannot be undone.
                     </p>
                  </div>
                  <div className="flex gap-3">
                     <button onClick={() => setShowDeleteModal(false)} className="flex-1 py-3 font-bold text-[10px] text-neutral-400 uppercase tracking-widest border border-neutral-100 rounded-md hover:bg-neutral-50">
                        Back
                     </button>
                     <button
                        onClick={handleDeleteEvent}
                        disabled={actionLoading}
                        className="flex-[2] bg-red-600 text-white font-bold py-3 rounded-md text-[10px] uppercase tracking-widest hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center"
                     >
                        {actionLoading ? <LoadingSpinner size="sm" /> : 'Confirm Delete'}
                     </button>
                  </div>
               </div>
            </div>
         )}

         <NotificationModal
            isOpen={notification.isOpen}
            onClose={() => setNotification({ ...notification, isOpen: false })}
            type={notification.type}
            title={notification.title}
            message={notification.message}
         />
      </div>
   );
};

export default EventPerformance;
