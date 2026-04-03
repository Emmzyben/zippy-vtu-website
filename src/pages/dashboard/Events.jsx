import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Search, Ticket, Loader2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ticketingService } from '../../services/ticketingService';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [filterTime, setFilterTime] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await ticketingService.getEvents();
        if (response.success) {
          setEvents(response.data);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          event.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesDate = true;
    if (filterDate) {
      // Create local date string YYYY-MM-DD
      const dateObj = new Date(event.event_date);
      const tzOffset = dateObj.getTimezoneOffset() * 60000;
      const localISOTime = new Date(dateObj - tzOffset).toISOString().slice(0, 10);
      matchesDate = localISOTime === filterDate;
    }

    let matchesTime = true;
    if (filterTime) {
      const timeStr = new Date(event.event_date).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
      matchesTime = timeStr === filterTime;
    }

    return matchesSearch && matchesDate && matchesTime;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
        <Loader2 className="w-8 h-8 text-neutral-900 animate-spin mb-4" />
        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Scanning for Live Events...</p>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-10 max-w-6xl mx-auto transition-all">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 mb-10">
        <div>
          <h1 className="text-xl font-bold text-neutral-900 tracking-tight">Explore Events</h1>
          <p className="text-xs text-neutral-500 font-medium mt-1 uppercase tracking-widest">Discover and book the premium local experiences</p>
        </div>
        <Link 
          to="/my-tickets"
          className="bg-[#e3984d] text-white px-4 py-2.5 rounded-md font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#c98542] transition-all shadow-sm shadow-[#e3984d]/10"
        >
          <Ticket size={14} /> My Tickets
        </Link>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-10">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search size={16} className="text-neutral-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-3 bg-neutral-50 border border-neutral-100 rounded-md focus:bg-white focus:border-[#e3984d] focus:outline-none transition-all text-xs font-bold text-neutral-900 shadow-sm"
            placeholder="Search items or locations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-4 md:w-auto">
          <input 
            type="date"
            className="block w-full px-3 py-3 bg-neutral-50 border border-neutral-100 rounded-md focus:bg-white focus:border-[#e3984d] focus:outline-none transition-all text-xs font-bold text-neutral-500 shadow-sm uppercase tracking-widest"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
          />
          <input 
            type="time"
            className="block w-full px-3 py-3 bg-neutral-50 border border-neutral-100 rounded-md focus:bg-white focus:border-[#e3984d] focus:outline-none transition-all text-xs font-bold text-neutral-500 shadow-sm uppercase tracking-widest"
            value={filterTime}
            onChange={(e) => setFilterTime(e.target.value)}
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4 px-1">
           <h3 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Live Listings</h3>
           <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">{filteredEvents.length} active</p>
        </div>

        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <Link
                key={event.id}
                to={`/app/events/${event.id}`}
                className="group bg-white rounded-lg overflow-hidden border border-neutral-100 shadow-sm hover:border-neutral-200 transition-all duration-300"
              >
                <div className="relative h-44 overflow-hidden bg-neutral-100">
                  <img
                    src={event.banner_url || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&q=80'}
                    alt={event.title}
                    className="w-full h-full object-cover grayscale-[0.2] transition-transform duration-700 group-hover:scale-110 group-hover:grayscale-0"
                  />
                  <div className="absolute top-3 right-3 flex flex-col items-end gap-2">
                    <div className="bg-white px-2 py-1 rounded shadow-sm text-[9px] font-black text-neutral-900 uppercase tracking-widest">
                      {new Date(event.event_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </div>
                    {event.status === 'rescheduled' && (
                      <div className="bg-amber-500 text-white px-2 py-1 rounded text-[8px] font-black uppercase tracking-widest shadow-sm">
                        Updated
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="text-sm font-bold text-neutral-900 mb-3 line-clamp-1 group-hover:text-[#e3984d] transition-colors uppercase tracking-tight">
                    {event.title}
                  </h3>
                  
                  <div className="space-y-2.5 mb-5">
                    <div className="flex items-center text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
                      <Calendar size={14} className="mr-2 text-neutral-300 shrink-0" />
                      <span>{new Date(event.event_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div className="flex items-center text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
                      <MapPin size={14} className="mr-2 text-neutral-300 shrink-0" />
                      <span className="line-clamp-1">{event.location}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-neutral-50">
                    <div className="flex items-center text-[#e3984d] text-[9px] font-bold uppercase tracking-[0.2em]">
                      <Ticket size={14} className="mr-2" />
                      <span>Secure Entry</span>
                    </div>
                    <ArrowRight size={14} className="text-neutral-300 group-hover:text-[#e3984d] group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-lg border border-neutral-100 shadow-sm">
             <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">No matching experiences</p>
             <p className="text-[10px] text-neutral-400 mt-1">Try broadening your search criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;
