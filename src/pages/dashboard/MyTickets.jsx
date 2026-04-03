import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Ticket, Loader2, ChevronRight, Inbox, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { ticketingService } from '../../services/ticketingService';

const MyTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('active'); // 'active', 'history'
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await ticketingService.getMyTickets();
        if (response.success) {
          setTickets(response.data);
        }
      } catch (error) {
        console.error('Error fetching tickets:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  const activeTickets = tickets.filter(t => t.status === 'paid');
  const historyTickets = tickets.filter(t => t.status === 'used' || t.status === 'cancelled');

  const displayedTickets = activeTab === 'active' ? activeTickets : historyTickets;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
        <Loader2 className="w-8 h-8 text-neutral-900 animate-spin mb-4" />
        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Accessing Ticket Vault...</p>
      </div>
    );
  }

  const StatusBadge = ({ status }) => {
    switch (status) {
      case 'paid':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-green-50 text-green-700 border border-green-100 text-[10px] font-black uppercase tracking-widest">
            <CheckCircle2 size={12} /> Valid
          </span>
        );
      case 'used':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-neutral-50 text-neutral-500 border border-neutral-100 text-[10px] font-black uppercase tracking-widest">
            <Clock size={12} /> Redeemed
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-red-50 text-red-600 border border-red-100 text-[10px] font-black uppercase tracking-widest">
            <XCircle size={12} /> Refunded
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-4 lg:p-10 mx-auto transition-all">
      <div className="mb-10">
        <h1 className="text-xl font-bold text-neutral-900 tracking-tight">Your Tickets</h1>
        <p className="text-xs text-neutral-500 font-medium mt-1 uppercase tracking-widest">Manage your live and historical event entries</p>
      </div>

      {/* Tabs */}
      <div className="flex p-1 bg-neutral-100 rounded-md mb-10 w-fit">
        <button
          onClick={() => setActiveTab('active')}
          className={`px-6 py-2 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'active' ? 'bg-white text-[#e3984d] shadow-sm' : 'text-neutral-400 hover:text-neutral-600'
            }`}
        >
          Live ({activeTickets.length})
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`px-6 py-2 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'history' ? 'bg-white text-[#e3984d] shadow-sm' : 'text-neutral-400 hover:text-neutral-600'
            }`}
        >
          Archive ({historyTickets.length})
        </button>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between mb-4 px-1">
          <h3 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Issuance Log</h3>
          <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">{displayedTickets.length} items</p>
        </div>

        {displayedTickets.length > 0 ? (
          displayedTickets.map((ticket) => (
            <div
              key={ticket.id}
              onClick={() => navigate(`/my-tickets/${ticket.id}`)}
              className="bg-white rounded-lg border border-neutral-100 p-5 flex flex-col md:flex-row items-center cursor-pointer hover:border-neutral-200 shadow-sm transition-all group"
            >
              {/* Event Summary */}
              <div className="flex-1 w-full">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <StatusBadge status={ticket.status} />
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em]">{ticket.ticket_name}</span>
                </div>
                <h3 className="text-sm font-bold text-neutral-900 mb-4 tracking-tight uppercase">{ticket.event_title}</h3>

                <div className="flex flex-wrap items-center gap-8 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-neutral-300" />
                    <span>{new Date(ticket.event_date).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-neutral-300" />
                    <span className="line-clamp-1">{ticket.location}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between w-full md:w-auto md:ml-8 gap-10 pt-5 md:pt-0 mt-5 md:mt-0 border-t md:border-t-0 border-neutral-50">
                <div className="bg-neutral-50 p-2.5 rounded group-hover:bg-[#e3984d] group-hover:text-white transition-all border border-neutral-100 group-hover:border-[#e3984d]">
                  <ChevronRight size={18} />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-white rounded-lg border border-neutral-100 shadow-sm">
            <div className="w-12 h-12 rounded-lg bg-neutral-50 flex items-center justify-center mx-auto mb-4 text-neutral-300 border border-neutral-100">
              <Inbox size={24} />
            </div>
            <p className="text-xs font-bold text-neutral-900 uppercase tracking-widest">No tickets in vault</p>
            <p className="text-[10px] text-neutral-400 mt-1 uppercase">
              {activeTab === 'active' ? "Your active passes will appear here" : "Your usage history is empty"}
            </p>
            {activeTab === 'active' && (
              <button
                onClick={() => navigate('/events')}
                className="mt-8 inline-flex items-center justify-center gap-2 bg-[#e3984d] text-white px-8 py-3 rounded-md font-bold text-[10px] uppercase tracking-[0.2em] shadow-lg hover:bg-[#c98542] transition-all"
              >
                Book Entry <Ticket size={14} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTickets;
