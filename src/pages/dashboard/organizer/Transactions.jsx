import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft, Banknote, RefreshCcw, Briefcase,
    Search, Filter, Calendar, Loader2, TrendingUp, Download
} from 'lucide-react';
import { organizerService } from '../../../services/organizerService';

const OrganizerTransactions = () => {
    const navigate = useNavigate();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');

    useEffect(() => { fetchTransactions(); }, []);

    const fetchTransactions = async () => {
        setLoading(true);
        try {
            const response = await organizerService.getTransactions();
            if (response.success) setTransactions(response.data);
        } catch (error) {
            console.error('Error fetching transactions:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount) =>
        new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount || 0);

    const filteredTransactions = transactions.filter(tx => {
        const matchesSearch = tx.event_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tx.type?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterType === 'all' || tx.type === filterType;
        return matchesSearch && matchesFilter;
    });

    const handleExport = () => {
        if (filteredTransactions.length === 0) { alert('No transactions to export.'); return; }
        try {
            const headers = ['Date', 'Type', 'Event', 'Amount', 'Status'];
            const rows = filteredTransactions.map(tx => [
                `"${tx.created_at ? new Date(tx.created_at).toLocaleString() : 'N/A'}"`,
                `"${(tx.type || 'N/A').replace('_', ' ').toUpperCase()}"`,
                `"${(tx.event_title || 'N/A').replace(/"/g, '""')}"`,
                tx.amount || 0,
                `"${(tx.status || 'N/A').toUpperCase()}"`
            ].join(','));
            const csvContent = headers.join(',') + '\n' + rows.join('\n');
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `zippypay_statement_${new Date().toISOString().split('T')[0]}.csv`);
            document.body.appendChild(link);
            link.click();
            setTimeout(() => { document.body.removeChild(link); window.URL.revokeObjectURL(url); }, 100);
        } catch (error) {
            console.error('Export error:', error);
        }
    };

    const typeIcon = (type) => {
        if (type === 'ticket_sale') return <Banknote size={16} />;
        if (type === 'refund') return <RefreshCcw size={16} />;
        return <Briefcase size={16} />;
    };

    const typeIconStyle = (type) => {
        if (type === 'ticket_sale') return 'bg-green-50 text-green-600 border-green-100';
        if (type === 'refund') return 'bg-red-50 text-red-600 border-red-100';
        return 'bg-blue-50 text-blue-600 border-blue-100';
    };

    const statusStyle = (status) => {
        if (status === 'completed') return 'bg-green-50 text-green-700 border-green-100';
        if (status === 'pending') return 'bg-amber-50 text-amber-700 border-amber-100';
        return 'bg-neutral-50 text-neutral-500 border-neutral-100';
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
            <Loader2 className="w-8 h-8 text-neutral-900 animate-spin mb-4" />
            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Loading Statement...</p>
        </div>
    );

    const totalVolume = filteredTransactions.reduce((sum, tx) => sum + parseFloat(tx.amount || 0), 0);

    return (
        <div className="p-4 lg:p-10 max-w-6xl mx-auto pb-24">
            {/* Header */}
            <div className="mb-10 flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div>
                    <button
                        onClick={() => navigate('/organizer/dashboard')}
                        className="flex items-center gap-2 text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-4 hover:text-neutral-900 transition-colors"
                    >
                        <ArrowLeft size={14} /> Dashboard
                    </button>
                    <h1 className="text-xl font-bold text-neutral-900 tracking-tight">Transaction Statement</h1>
                    <p className="text-xs text-neutral-500 font-medium mt-1 uppercase tracking-widest">Full earnings and settlement history</p>
                </div>
                <button
                    onClick={handleExport}
                    className="flex items-center justify-center gap-2 bg-neutral-50 border border-neutral-100 text-neutral-600 px-5 py-2.5 rounded-md font-bold text-[10px] uppercase tracking-widest hover:bg-neutral-100 transition-all"
                >
                    <Download size={14} /> Export CSV
                </button>
            </div>

            {/* Filters + Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
                <div className="lg:col-span-2 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={14} />
                    <input
                        type="text"
                        placeholder="Search by event or type..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white border border-neutral-100 rounded-md p-3 pl-9 font-bold text-neutral-900 outline-none focus:border-neutral-300 transition-all text-xs shadow-sm"
                    />
                </div>
                <div className="relative">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={14} />
                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="w-full bg-white border border-neutral-100 rounded-md p-3 pl-9 font-bold text-neutral-900 outline-none focus:border-neutral-300 transition-all appearance-none cursor-pointer text-xs shadow-sm"
                    >
                        <option value="all">All Types</option>
                        <option value="ticket_sale">Ticket Sales</option>
                        <option value="refund">Refunds</option>
                        <option value="settlement">Settlements</option>
                    </select>
                </div>
                <div className="bg-[#e3984d] text-white rounded-md p-4 flex items-center justify-between">
                    <div>
                        <p className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest mb-1">Volume</p>
                        <p className="text-base font-black tracking-tight">{formatCurrency(totalVolume)}</p>
                    </div>
                    <TrendingUp size={18} className="text-neutral-600" />
                </div>
            </div>

            {/* Transaction Table */}
            <div className="bg-white rounded-lg border border-neutral-100 shadow-sm overflow-hidden">
                {/* Column headers */}
                <div className="hidden md:grid grid-cols-5 px-6 py-3 bg-neutral-50 border-b border-neutral-100">
                    <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">Type</span>
                    <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">Event</span>
                    <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">Date & Time</span>
                    <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest text-right">Amount</span>
                    <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest text-center">Status</span>
                </div>

                <div className="divide-y divide-neutral-50">
                    {filteredTransactions.length > 0 ? (
                        filteredTransactions.map((tx) => (
                            <div key={tx.id} className="grid grid-cols-1 md:grid-cols-5 px-6 py-4 items-center gap-4 hover:bg-neutral-50/50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-md border flex items-center justify-center shrink-0 ${typeIconStyle(tx.type)}`}>
                                        {typeIcon(tx.type)}
                                    </div>
                                    <p className="font-bold text-neutral-900 text-[10px] uppercase tracking-tight">
                                        {tx.type.replace('_', ' ')}
                                    </p>
                                </div>
                                <div className="font-bold text-xs text-neutral-600 line-clamp-1">
                                    {tx.event_title || '—'}
                                </div>
                                <div className="flex items-center gap-1.5 text-neutral-400 font-medium text-[10px] uppercase tracking-wider">
                                    <Calendar size={11} />
                                    {new Date(tx.created_at).toLocaleString()}
                                </div>
                                <div className={`text-right font-black text-sm tabular-nums ${tx.amount > 0 ? 'text-green-600' : 'text-red-500'}`}>
                                    {tx.amount > 0 ? '+' : ''}{formatCurrency(tx.amount)}
                                </div>
                                <div className="flex justify-center">
                                    <span className={`px-2.5 py-1 border rounded text-[9px] font-black uppercase tracking-widest ${statusStyle(tx.status)}`}>
                                        {tx.status}
                                    </span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="py-24 text-center">
                            <div className="w-10 h-10 rounded-md bg-neutral-50 border border-neutral-100 flex items-center justify-center mx-auto mb-5 text-neutral-300">
                                <Banknote size={20} />
                            </div>
                            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">No transactions found</p>
                            <p className="text-[10px] text-neutral-300 font-medium mt-2">Try adjusting filter or search criteria</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrganizerTransactions;
