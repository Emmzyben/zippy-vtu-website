import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, Calendar, MapPin, Ticket, Info, Image, 
  Trash2, ArrowRight, ArrowLeft, Loader2, Save,
  CheckCircle2, DollarSign, Clock
} from 'lucide-react';
import { organizerService } from '../../../services/organizerService';
import NotificationModal from '../../../components/NotificationModal';
import LoadingSpinner from '../../../components/LoadingSpinner';

const CreateEvent = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [showPolicyModal, setShowPolicyModal] = useState(false);
  const [settings, setSettings] = useState({ fee_percentage: 0.05, settlement_delay_hours: 24 });
  
  const [eventData, setEventData] = useState({
    title: '',
    description: '',
    event_date: '',
    location: '',
    banner_url: '',
    refund_deadline_hours: 24,
    ticket_types: [
      { name: 'Regular', price: '', quantity: '' }
    ]
  });

  const [notification, setNotification] = useState({
    isOpen: false, type: 'success', title: '', message: ''
  });

  const handleChange = (e) => {
    setEventData({ ...eventData, [e.target.name]: e.target.value });
  };

  const handleTicketChange = (index, field, value) => {
    const updatedTickets = [...eventData.ticket_types];
    updatedTickets[index][field] = value;
    setEventData({ ...eventData, ticket_types: updatedTickets });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadLoading(true);
    try {
      const response = await organizerService.uploadBanner(file);
      if (response.success) {
        setEventData({ ...eventData, banner_url: response.url });
      }
    } catch (error) {
      setNotification({ isOpen: true, type: 'error', title: 'Upload Failed', message: error.message || 'Failed to upload image.' });
    } finally {
      setUploadLoading(false);
    }
  };

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await organizerService.getSettings();
        if (response.success) setSettings(response.data);
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };
    fetchSettings();
  }, []);

  const addTicketType = () => {
    setEventData({ ...eventData, ticket_types: [...eventData.ticket_types, { name: '', price: '', quantity: '' }] });
  };

  const removeTicketType = (index) => {
    const updatedTickets = eventData.ticket_types.filter((_, i) => i !== index);
    setEventData({ ...eventData, ticket_types: updatedTickets });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await organizerService.createEvent(eventData);
      if (response.success) {
        setNotification({ isOpen: true, type: 'success', title: 'Event Created', message: `"${eventData.title}" is now live on the platform.` });
      }
    } catch (error) {
      setNotification({ isOpen: true, type: 'error', title: 'Submission Error', message: error.message || 'An error occurred.' });
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-neutral-50 border border-neutral-100 focus:border-[#e3984d] focus:bg-white rounded-md p-3 font-bold text-neutral-900 transition-all outline-none text-xs";
  const labelClass = "text-[10px] font-bold text-neutral-400 uppercase tracking-widest block mb-2";

  return (
    <div className="p-4 lg:p-10 max-w-2xl mx-auto pb-20">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-xl font-bold text-neutral-900 tracking-tight">Create New Event</h1>
        <p className="text-xs text-neutral-500 font-medium mt-1 uppercase tracking-widest">List a new experience on the ZippyPay marketplace</p>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center gap-0 mb-10">
        {[
          { icon: <Info size={14} />, label: 'Event Details' },
          { icon: <Ticket size={14} />, label: 'Ticket Tiers' },
          { icon: <Save size={14} />, label: 'Review & Publish' }
        ].map((s, i) => (
          <React.Fragment key={i}>
            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => i + 1 < step && setStep(i + 1)}
            >
              <div className={`w-8 h-8 rounded-md flex items-center justify-center transition-all text-[10px] font-black ${
                step === i + 1 ? 'bg-[#e3984d] text-white' :
                step > i + 1 ? 'bg-green-600 text-white' : 'bg-neutral-100 text-neutral-400'
              }`}>
                {step > i + 1 ? <CheckCircle2 size={14} /> : s.icon}
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-widest hidden sm:block ${
                step === i + 1 ? 'text-neutral-900' : 'text-neutral-400'
              }`}>{s.label}</span>
            </div>
            {i < 2 && <div className={`flex-1 h-px mx-3 ${step > i + 1 ? 'bg-green-600' : 'bg-neutral-100'}`} />}
          </React.Fragment>
        ))}
      </div>

      <div className="bg-white rounded-lg border border-neutral-100 shadow-sm overflow-hidden">

        {/* Step 1 */}
        {step === 1 && (
          <div className="p-6 md:p-10">
            <h2 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-8">Step 01 — Event Information</h2>
            <div className="space-y-6">
              <div>
                <label className={labelClass}>Event Title</label>
                <input name="title" value={eventData.title} onChange={handleChange} className={inputClass} placeholder="e.g. Lagos Tech Summit 2025" />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Event Date & Time</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={14} />
                    <input type="datetime-local" name="event_date" value={eventData.event_date} onChange={handleChange} className={`${inputClass} pl-9`} />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Venue / Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={14} />
                    <input name="location" value={eventData.location} onChange={handleChange} className={`${inputClass} pl-9`} placeholder="Eko Hotel, Victoria Island" />
                  </div>
                </div>
              </div>

              <div>
                <label className={labelClass}>Event Banner</label>
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="banner-upload" disabled={uploadLoading} />
                <label
                  htmlFor="banner-upload"
                  className={`flex flex-col items-center justify-center w-full aspect-video rounded-md border-2 border-dashed cursor-pointer overflow-hidden relative transition-all ${
                    eventData.banner_url ? 'border-neutral-200 bg-neutral-50' : 'border-neutral-100 bg-neutral-50 hover:border-[#e3984d] hover:bg-purple-50/30'
                  }`}
                >
                  {uploadLoading ? (
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 className="w-6 h-6 text-[#e3984d] animate-spin" />
                      <p className="text-[10px] font-bold text-[#e3984d] uppercase tracking-widest">Pinning to IPFS...</p>
                    </div>
                  ) : eventData.banner_url ? (
                    <>
                      <img src={eventData.banner_url} alt="Banner Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="bg-white px-4 py-2 rounded-md text-neutral-900 text-[10px] font-black uppercase tracking-widest">
                          Replace Image
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center gap-3 text-neutral-400">
                      <div className="w-10 h-10 rounded-md bg-white border border-neutral-100 flex items-center justify-center shadow-sm">
                        <Image size={20} />
                      </div>
                      <div className="text-center">
                        <p className="text-[10px] font-bold uppercase tracking-widest">Upload Banner Image</p>
                        <p className="text-[9px] font-medium mt-1">JPEG, PNG or WEBP — Max 5MB</p>
                      </div>
                    </div>
                  )}
                </label>
              </div>

              <div>
                <label className={labelClass}>Description</label>
                <textarea name="description" value={eventData.description} onChange={handleChange} className={`${inputClass} min-h-[100px] resize-none`} placeholder="What should attendees expect?" />
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-neutral-50">
                <button onClick={() => navigate('/organizer/dashboard')} className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest hover:text-neutral-600">
                  Cancel
                </button>
                <button
                  onClick={() => setStep(2)}
                  disabled={!eventData.title || !eventData.event_date || !eventData.location}
                  className="bg-[#e3984d] text-white px-6 py-3 rounded-md font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-[#4A1F7C] transition-all disabled:opacity-40"
                >
                  Next <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div className="p-6 md:p-10">
            <h2 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2">Step 02 — Ticket Configuration</h2>
            <p className="text-neutral-500 mb-8 font-medium text-xs">Configure tiers like Regular, VIP, VVIP, or Early Bird.</p>
            <div className="space-y-4">
              {eventData.ticket_types.map((ticket, index) => (
                <div key={index} className="bg-neutral-50 p-5 rounded-lg relative group border border-neutral-100 hover:border-neutral-200 transition-all">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest block mb-1.5">Tier Name</label>
                      <input value={ticket.name} onChange={(e) => handleTicketChange(index, 'name', e.target.value)} className="w-full bg-white border border-neutral-100 focus:border-[#e3984d] rounded-md p-2.5 font-bold text-neutral-900 outline-none text-xs" placeholder="e.g. VIP" />
                    </div>
                    <div>
                      <label className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest block mb-1.5">Price (₦)</label>
                      <div className="relative">
                        <DollarSign className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400" size={12} />
                        <input type="number" value={ticket.price} onChange={(e) => handleTicketChange(index, 'price', e.target.value)} className="w-full bg-white border border-neutral-100 focus:border-[#e3984d] rounded-md p-2.5 pl-7 font-bold text-neutral-900 outline-none text-xs" placeholder="0.00" />
                      </div>
                    </div>
                    <div>
                      <label className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest block mb-1.5">Quantity</label>
                      <input type="number" value={ticket.quantity} onChange={(e) => handleTicketChange(index, 'quantity', e.target.value)} className="w-full bg-white border border-neutral-100 focus:border-[#e3984d] rounded-md p-2.5 font-bold text-neutral-900 outline-none text-xs" placeholder="100" />
                    </div>
                  </div>
                  {eventData.ticket_types.length > 1 && (
                    <button onClick={() => removeTicketType(index)} className="absolute -top-2 -right-2 w-7 h-7 bg-white text-red-500 rounded-md flex items-center justify-center shadow-sm border border-neutral-100 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              ))}

              <button onClick={addTicketType} className="w-full border-2 border-dashed border-neutral-100 p-4 rounded-md flex items-center justify-center gap-2 text-neutral-400 font-bold text-[10px] uppercase tracking-widest hover:border-[#e3984d] hover:text-[#e3984d] transition-all">
                <Plus size={14} /> Add Ticket Tier
              </button>

              <div className="flex justify-between items-center pt-4 border-t border-neutral-50">
                <button onClick={() => setStep(1)} className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-2 hover:text-neutral-600">
                  <ArrowLeft size={14} /> Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={eventData.ticket_types.some(t => !t.name || !t.price || !t.quantity)}
                  className="bg-[#e3984d] text-white px-6 py-3 rounded-md font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-[#4A1F7C] transition-all disabled:opacity-40"
                >
                  Next <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div className="p-6 md:p-10">
            <h2 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-8">Step 03 — Review & Publish</h2>
            <div className="bg-neutral-50 rounded-lg p-6 border border-neutral-100 space-y-4 mb-8">
              <div className="flex justify-between items-center border-b border-neutral-100 pb-3">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Event</span>
                <span className="font-bold text-neutral-900 text-xs">{eventData.title}</span>
              </div>
              <div className="flex justify-between items-center border-b border-neutral-100 pb-3">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Location</span>
                <span className="font-bold text-neutral-900 text-xs">{eventData.location}</span>
              </div>
              <div className="flex justify-between items-center border-b border-neutral-100 pb-3">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Ticket Tiers</span>
                <span className="font-bold text-neutral-900 text-xs">{eventData.ticket_types.length} configured</span>
              </div>
              <div className="flex justify-between items-center border-b border-neutral-100 pb-3">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Refund Deadline</span>
                <span className="font-bold text-neutral-900 text-xs">{eventData.refund_deadline_hours}h</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block mb-3">Pricing Breakdown</span>
                <div className="space-y-2">
                  {eventData.ticket_types.map((t, i) => (
                    <div key={i} className="flex justify-between font-bold text-xs">
                      <span className="text-neutral-600 uppercase tracking-wide">{t.name}</span>
                      <span className="text-[#e3984d]">₦{parseFloat(t.price).toLocaleString()} × {t.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-neutral-50">
              <button onClick={() => setStep(2)} className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-2 hover:text-neutral-600">
                <ArrowLeft size={14} /> Edit
              </button>
              <button
                onClick={() => setShowPolicyModal(true)}
                disabled={loading}
                className="bg-[#e3984d] text-white px-8 py-3 rounded-md font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-[#c98542] transition-all disabled:opacity-40"
              >
                {loading ? <LoadingSpinner size="sm" /> : <><CheckCircle2 size={14} /> Publish Event</>}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Policy Agreement Modal */}
      {showPolicyModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70">
          <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full border border-neutral-100">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-10 h-10 bg-[#e3984d] text-white rounded-md flex items-center justify-center"><Save size={18} /></div>
              <div>
                <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-tight">Policy Agreement</h3>
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Final publication step</p>
              </div>
            </div>

            <div className="space-y-3 mb-8">
              {[
                { icon: DollarSign, color: 'text-green-600', text: `A <strong>${(settings.fee_percentage * 100).toFixed(1)}% service fee</strong> applies to every ticket sold.` },
                { icon: Clock, color: 'text-blue-600', text: `Payouts settle <strong>${settings.settlement_delay_hours} hours</strong> after the event concludes.` },
                { icon: CheckCircle2, color: 'text-[#e3984d]', text: `You agree to honor all tiers and the <strong>${eventData.refund_deadline_hours}h refund deadline</strong>.` },
              ].map((item, i) => (
                <div key={i} className="flex gap-4 p-4 bg-neutral-50 rounded-md border border-neutral-100">
                  <item.icon className={`${item.color} shrink-0 mt-0.5`} size={16} />
                  <p className="text-xs font-medium text-neutral-600 leading-relaxed" dangerouslySetInnerHTML={{ __html: item.text }} />
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button onClick={() => setShowPolicyModal(false)} className="flex-1 py-3 font-bold text-[10px] text-neutral-400 uppercase tracking-widest border border-neutral-100 rounded-md hover:bg-neutral-50">
                Review
              </button>
              <button
                onClick={() => { setShowPolicyModal(false); handleSubmit(); }}
                disabled={loading}
                className="flex-[2] bg-[#e3984d] text-white font-bold py-3 rounded-md text-[10px] uppercase tracking-widest hover:bg-[#c98542] transition-all flex items-center justify-center gap-2"
              >
                {loading ? <LoadingSpinner size="sm" /> : <>Accept & Publish</>}
              </button>
            </div>
          </div>
        </div>
      )}

      <NotificationModal
        isOpen={notification.isOpen}
        onClose={() => {
          setNotification({ ...notification, isOpen: false });
          if (notification.type === 'success') navigate('/organizer/dashboard');
        }}
        type={notification.type}
        title={notification.title}
        message={notification.message}
      />
    </div>
  );
};

export default CreateEvent;
