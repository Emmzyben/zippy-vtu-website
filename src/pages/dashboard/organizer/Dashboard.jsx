import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    LayoutDashboard, Plus, Settings, Users, Banknote, Briefcase,
    TrendingUp, Calendar, ArrowRight, Loader2, Clock, CheckCircle2, Camera,
    Info, RefreshCcw
} from 'lucide-react';
import { organizerService } from '../../../services/organizerService';
import { useAuth } from '../../../context/AuthContext';
import LoadingSpinner from '../../../components/LoadingSpinner';

const OrganizerDashboard = () => {
    const [stats, setStats] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [enrolling, setEnrolling] = useState(false);
    const { user, loginWithToken } = useAuth();
    const navigate = useNavigate();

    const isOrganizer = user?.is_organizer == 1 || user?.role === 'organizer' || user?.role === 'admin';

    useEffect(() => {
        if (isOrganizer) {
            fetchDashboardData();
        } else {
            setLoading(false);
        }
    }, [isOrganizer]);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const statsResponse = await organizerService.getDashboardStats();
            const transResponse = await organizerService.getTransactions();

            if (statsResponse.success) setStats(statsResponse.data);
            if (transResponse.success) setTransactions(transResponse.data.slice(0, 5));
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEnroll = async () => {
        setEnrolling(true);
        try {
            const response = await organizerService.enroll();
            if (response.success) {
                const updatedUser = { ...user, is_organizer: 1 };
                const token = localStorage.getItem('token');
                await loginWithToken(token, updatedUser);
            }
        } catch (error) {
            alert(error.message || 'Enrollment failed');
        } finally {
            setEnrolling(false);
        }
    };

    const formatCurrency = (amount) =>
        new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount || 0);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
                <Loader2 className="w-8 h-8 text-neutral-900 animate-spin mb-4" />
                <p className="text-neutral-400 font-bold uppercase tracking-[0.2em] text-[10px]">Accessing Organizer Records...</p>
            </div>
        );
    }

    // Enrollment Landing Page for non-organizers
    if (!isOrganizer) {
        return (
            <div className="p-4 lg:p-12 max-w-5xl mx-auto">
                <div className="grid lg:grid-cols-1 gap-12 items-center min-h-[70vh]">
                    <div className="space-y-8">
                        <div>
                            <h1 className="text-4xl lg:text-5xl font-black text-neutral-900 tracking-tight leading-[1.1]">
                                Build Your Brand. <br />
                                Sell Events.
                            </h1>
                            <p className="text-neutral-500 font-medium text-sm mt-6 leading-relaxed max-w-md">
                                ZippyPay for Organizers provides the professional tools you need to sell tickets, manage entries, and receive instant payouts. No excuses, just performance.
                            </p>
                        </div>

                        <div className="space-y-4">
                            {[
                                { icon: TrendingUp, title: 'Revenue Control', desc: 'Secure payouts and real-time sales tracking.' },
                                { icon: Camera, title: 'Gate Management', desc: 'Industry-leading scanning speed (under 100ms).' },
                                { icon: CheckCircle2, title: 'Auto-Settlement', desc: 'Earnings transferred to your wallet instantly.' }
                            ].map((f, i) => (
                                <div key={i} className="flex gap-4 p-4 rounded-lg bg-neutral-50 border border-neutral-100 group hover:bg-white hover:border-neutral-200 transition-all">
                                    <div className="w-10 h-10 rounded-md bg-white border border-neutral-200 flex items-center justify-center text-[#e3984d]">
                                        <f.icon size={18} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-xs text-neutral-900 uppercase tracking-wide">{f.title}</h3>
                                        <p className="text-[10px] text-neutral-500 font-medium mt-0.5">{f.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={handleEnroll}
                            disabled={enrolling}
                            className="w-full sm:w-auto bg-[#e3984d] text-white px-8 py-4 rounded-md font-bold text-xs uppercase tracking-[0.2em] shadow-lg hover:bg-[#c98542] transition-all flex items-center justify-center gap-3"
                        >
                            {enrolling ? <LoadingSpinner size="sm" /> : <>Initialize Enrollment <ArrowRight size={16} /></>}
                        </button>
                    </div>


                </div>
            </div>
        );
    }

    return (
        <div className="p-4 lg:p-10 max-w-7xl mx-auto transition-all">
            {/* Header */}
            <div className="mb-10 flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div>
                    <h1 className="text-xl font-bold text-neutral-900 tracking-tight">Organizer Dashboard</h1>
                    <p className="text-xs text-neutral-500 font-medium mt-1 uppercase tracking-widest">Real-time event performance and revenue management</p>
                </div>

                <div className="flex gap-2">
                    <Link
                        to="/organizer/create-event"
                        className="flex items-center justify-center gap-2 bg-[#e3984d] text-white px-4 py-2.5 rounded-md font-bold text-[10px] uppercase tracking-widest shadow-sm hover:bg-[#4A1F7C] transition-all"
                    >
                        <Plus size={14} /> New Event
                    </Link>
                    <Link
                        to="/organizer/scanner"
                        className="flex items-center justify-center gap-2 bg-[#e3984d] text-white px-4 py-2.5 rounded-md font-bold text-[10px] uppercase tracking-widest shadow-sm hover:bg-[#c98542] transition-all"
                    >
                        <Camera size={14} /> Scanner
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-10">
                <div className="bg-white p-5 rounded-lg border border-neutral-100 shadow-sm transition-all hover:border-neutral-200">
                    <p className="text-neutral-400 font-bold text-[9px] uppercase tracking-widest mb-1">Total Revenue</p>
                    <h3 className="text-xl font-black text-neutral-900 tracking-tight">{formatCurrency(stats?.total_earned_overall)}</h3>
                </div>

                <div className="bg-white p-5 rounded-lg border border-neutral-100 shadow-sm transition-all hover:border-neutral-200">
                    <p className="text-neutral-400 font-bold text-[9px] uppercase tracking-widest mb-1">Items Sold</p>
                    <h3 className="text-xl font-black text-neutral-900 tracking-tight">{stats?.total_tickets_sold || 0}</h3>
                </div>

                <div className="bg-[#e3984d] p-5 rounded-lg shadow-lg text-white">
                    <p className="text-white/60 font-bold text-[9px] uppercase tracking-widest mb-1">In Escrow</p>
                    <h3 className="text-xl font-black tracking-tight">{formatCurrency(stats?.pending_balance)}</h3>
                </div>

                <div className="bg-white p-5 rounded-lg border border-neutral-100 shadow-sm transition-all hover:border-neutral-200">
                    <p className="text-neutral-400 font-bold text-[9px] uppercase tracking-widest mb-1">Active Events</p>
                    <h3 className="text-xl font-black text-neutral-900 tracking-tight">{stats?.active_events_count || 0}</h3>
                </div>
            </div>

            <div className="grid lg:grid-cols-12 gap-8">
                {/* Recent Activity */}
                <div className="lg:col-span-8">
                    <div className="flex items-center justify-between mb-4 px-1">
                        <h2 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Revenue Streams</h2>
                        <Link to="/organizer/transactions" className="text-[10px] font-bold text-[#e3984d] uppercase tracking-widest hover:underline">View Ledger</Link>
                    </div>

                    {transactions.length > 0 ? (
                        <div className="space-y-2">
                            {transactions.map((tx) => (
                                <div key={tx.id} className="bg-white p-4 rounded-lg border border-neutral-100 flex items-center justify-between shadow-sm transition-all hover:bg-neutral-50 group">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-md flex items-center justify-center border transition-colors ${tx.type === 'ticket_sale' ? 'bg-green-50 text-green-600 border-green-100' :
                                            tx.type === 'refund' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-blue-50 text-blue-600 border-blue-100'
                                            }`}>
                                            {tx.type === 'ticket_sale' ? <Banknote size={16} /> :
                                                tx.type === 'refund' ? <RefreshCcw size={16} /> : <Briefcase size={16} />}
                                        </div>
                                        <div>
                                            <p className="font-bold text-neutral-900 uppercase text-[10px] tracking-widest">
                                                {tx.type.replace('_', ' ')}
                                            </p>
                                            <p className="text-[9px] text-neutral-400 font-medium uppercase tracking-wider">{new Date(tx.created_at).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className={`font-black text-sm tracking-tight ${tx.amount > 0 ? 'text-green-600' : 'text-red-500'}`}>
                                            {tx.amount > 0 ? '+' : ''}{formatCurrency(tx.amount)}
                                        </p>
                                        <div className="inline-block px-1 border border-neutral-100 rounded text-[7px] font-bold text-neutral-400 uppercase tracking-[0.2em]">{tx.status}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg p-12 text-center border border-neutral-100">
                            <p className="text-neutral-400 font-bold uppercase tracking-widest text-[10px]">No activity recorded</p>
                        </div>
                    )}
                </div>

                {/* Management Sidebar */}
                <div className="lg:col-span-4 space-y-6">
                    <div>
                        <h2 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-4 px-1">Quick Tools</h2>
                        <div className="bg-white rounded-lg border border-neutral-100 shadow-sm overflow-hidden divide-y divide-neutral-100">
                            <Link to="/organizer/manage-events" className="group flex items-center justify-between p-4 bg-white hover:bg-neutral-50 transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="bg-neutral-50 text-neutral-900 border border-neutral-100 p-2.5 rounded-md group-hover:bg-[#e3984d] group-hover:text-white transition-colors">
                                        <Plus size={16} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-neutral-900 text-xs uppercase tracking-wide">Manage Events</p>
                                        <p className="text-[9px] text-neutral-500 font-medium uppercase tracking-wider">Modify or View Orders</p>
                                    </div>
                                </div>
                                <ArrowRight size={14} className="text-neutral-300 group-hover:text-[#e3984d] transition-all" />
                            </Link>

                            <Link to="/organizer/scanner" className="group flex items-center justify-between p-4 bg-white hover:bg-neutral-50 transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="bg-neutral-50 text-neutral-900 border border-neutral-100 p-2.5 rounded-md group-hover:bg-[#e3984d] group-hover:text-white transition-colors">
                                        <Camera size={16} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-neutral-900 text-xs uppercase tracking-wide">Access Control</p>
                                        <p className="text-[9px] text-neutral-500 font-medium uppercase tracking-wider">Scan Entry Tickets</p>
                                    </div>
                                </div>
                                <ArrowRight size={14} className="text-neutral-300 group-hover:text-[#e3984d] transition-all" />
                            </Link>


                        </div>
                    </div>


                </div>
            </div>
        </div>
    );
};

export default OrganizerDashboard;
