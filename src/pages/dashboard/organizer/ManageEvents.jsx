import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Loader2, PlusCircle, Info, ChevronRight } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { organizerService } from '../../../services/organizerService';

const ManageEvents = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await organizerService.getOrganizerEvents();
        if (response.success) setEvents(response.data);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const statusStyle = (status) => {
    switch (status) {
      case 'active':     return 'bg-green-50 text-green-700 border-green-100';
      case 'rescheduled': return 'bg-amber-50 text-amber-700 border-amber-100';
      default:           return 'bg-red-50 text-red-600 border-red-100';
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
        <Loader2 className="w-8 h-8 text-neutral-900 animate-spin mb-4" />
        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Fetching Event Registry...</p>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-10 max-w-5xl mx-auto pb-20 transition-all">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-10">
        <div>
          <h1 className="text-xl font-bold text-neutral-900 tracking-tight">Manage Events</h1>
          <p className="text-xs text-neutral-500 font-medium mt-1 uppercase tracking-widest">Monitor performance and manage your event schedule</p>
        </div>
        <button
          onClick={() => navigate('/organizer/create-event')}
          className="flex items-center justify-center gap-2 bg-[#e3984d] text-white px-5 py-2.5 rounded-md font-bold text-[10px] uppercase tracking-widest shadow-sm hover:bg-[#4A1F7C] transition-all"
        >
          <PlusCircle size={14} /> New Event
        </button>
      </div>

      {events.length > 0 ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between mb-4 px-1">
            <h3 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Active Portfolio</h3>
            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">{events.length} events</p>
          </div>

          {events.map((event) => (
            <Link
              key={event.id}
              to={`/organizer/event-performance/${event.id}`}
              className="bg-white rounded-lg border border-neutral-100 shadow-sm hover:border-neutral-200 transition-all p-4 flex flex-col md:flex-row items-center gap-5 group"
            >
              {/* Thumbnail */}
              <div className="w-16 h-16 rounded-md overflow-hidden shrink-0 border border-neutral-100 bg-neutral-50">
                <img
                  src={event.banner_url || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=400&q=80'}
                  alt={event.title}
                  className="w-full h-full object-cover grayscale-[0.4] group-hover:grayscale-0 transition-all duration-500"
                />
              </div>

              {/* Details */}
              <div className="flex-1 text-center md:text-left min-w-0">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-2">
                  <span className={`px-2 py-0.5 rounded border text-[9px] font-black uppercase tracking-widest ${statusStyle(event.status)}`}>
                    {event.status}
                  </span>
                  <span className="text-[9px] font-bold text-neutral-300 uppercase tracking-widest">#{event.id}</span>
                </div>
                <h2 className="text-sm font-bold text-neutral-900 mb-2 group-hover:text-[#e3984d] transition-colors uppercase tracking-tight line-clamp-1">{event.title}</h2>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-6 gap-y-1 text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={12} className="text-neutral-300" />
                    <span>{new Date(event.event_date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin size={12} className="text-neutral-300" />
                    <span className="line-clamp-1">{event.location}</span>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-6 shrink-0">
                <div className="text-right">
                  <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Sold</p>
                  <p className="text-lg font-black text-neutral-900 leading-none">{event.tickets_sold ?? 0}</p>
                </div>
                <div className="w-9 h-9 rounded-md bg-neutral-50 border border-neutral-100 flex items-center justify-center text-neutral-300 group-hover:bg-[#e3984d] group-hover:text-white group-hover:border-[#e3984d] transition-all">
                  <ChevronRight size={18} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-white rounded-lg border border-neutral-100 shadow-sm">
          <div className="w-12 h-12 rounded-lg bg-neutral-50 border border-neutral-100 flex items-center justify-center mx-auto mb-6 text-neutral-300">
            <Info size={24} />
          </div>
          <p className="text-xs font-bold text-neutral-900 uppercase tracking-widest">No Events in Registry</p>
          <p className="text-[10px] text-neutral-400 mt-2 mb-10 max-w-xs mx-auto">Create your first event to begin selling tickets and tracking attendance.</p>
          <button
            onClick={() => navigate('/organizer/create-event')}
            className="bg-[#e3984d] text-white px-8 py-3 rounded-md font-bold text-[10px] uppercase tracking-widest hover:bg-[#c98542] transition-all"
          >
            Create First Event
          </button>
        </div>
      )}
    </div>
  );
};

export default ManageEvents;
