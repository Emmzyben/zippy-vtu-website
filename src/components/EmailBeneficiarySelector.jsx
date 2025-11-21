import { useState, useEffect } from 'react';
import { emailBeneficiariesAPI } from '../services/api';
import { Users, ChevronDown, ChevronUp, UserPlus, Trash2 } from 'lucide-react';

const EmailBeneficiarySelector = ({ value, onSelect, onAdd }) => {
    const [beneficiaries, setBeneficiaries] = useState([]);
    const [showList, setShowList] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadBeneficiaries();
    }, []);

    const loadBeneficiaries = async () => {
        try {
            setLoading(true);
            const response = await emailBeneficiariesAPI.getAll();
            setBeneficiaries(response.data.beneficiaries || []);
        } catch (error) {
            console.error('Failed to load beneficiaries:', error);
            if (error.response?.status !== 401) {
                // alert('Failed to load beneficiaries list. Please refresh.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSelect = (email) => {
        onSelect(email);
        setShowList(false);
    };

    const handleAdd = async () => {
        if (!value) return;

        try {
            await emailBeneficiariesAPI.add({
                email: value,
                name: `Beneficiary ${value.split('@')[0]}`,
            });
            await loadBeneficiaries();
            onAdd?.();
        } catch (error) {
            console.error('Failed to add beneficiary:', error);
            alert('Failed to add beneficiary. It may already exist.');
        }
    };

    const handleDelete = async (beneficiaryId, beneficiaryName) => {
        if (!window.confirm(`Remove ${beneficiaryName}?`)) return;

        try {
            await emailBeneficiariesAPI.delete(beneficiaryId);
            await loadBeneficiaries();
        } catch (error) {
            console.error('Failed to delete beneficiary:', error);
            alert('Failed to remove beneficiary. Try again.');
        }
    };

    return (
        <div className="relative">
            <label
                htmlFor="beneficiaryInput"
                className="block text-sm font-medium text-neutral-700 mb-1"
            >
                Recipient Email
            </label>

            <div className="flex gap-2">
                <input
                    type="email"
                    id="beneficiaryInput"
                    value={value}
                    onChange={(e) => onSelect(e.target.value)}
                    className="flex-1 border border-neutral-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#5C2D91] transition"
                    placeholder="recipient@example.com"
                    required
                />
                <button
                    type="button"
                    onClick={() => setShowList(!showList)}
                    className="px-4 py-3 bg-neutral-100 text-neutral-700 rounded-lg flex items-center gap-1 hover:bg-neutral-200 transition"
                >
                    <Users size={18} />
                    {showList ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
            </div>

            {showList && (
                <div className="absolute z-20 mt-2 w-full bg-white border border-neutral-200 rounded-lg max-h-48 overflow-y-auto shadow-lg">
                    {loading ? (
                        <div className="p-3 text-center text-neutral-500">Loading...</div>
                    ) : beneficiaries.length > 0 ? (
                        beneficiaries.map((b) => (
                            <div
                                key={b.id}
                                className="flex justify-between items-center px-4 py-3 hover:bg-purple-50 border-b border-neutral-100 last:border-b-0 transition"
                            >
                                <button
                                    type="button"
                                    onClick={() => handleSelect(b.email)}
                                    className="flex-1 text-left"
                                >
                                    <p className="font-medium text-neutral-800">
                                        {b.name || `Beneficiary ${b.email.split('@')[0]}`}
                                    </p>
                                    <p className="text-sm text-neutral-500">{b.email}</p>
                                </button>

                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete(b.id, b.name || `Beneficiary ${b.email.split('@')[0]}`);
                                    }}
                                    className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="p-3 text-center text-neutral-500 text-sm">
                            No beneficiaries yet
                        </div>
                    )}
                </div>
            )}

            {value && (
                <button
                    type="button"
                    onClick={handleAdd}
                    className="mt-3 inline-flex items-center gap-2 text-[#5C2D91] hover:text-[#4A1F7C] text-sm font-medium transition"
                >
                    <UserPlus size={16} />
                    Add to beneficiaries
                </button>
            )}
        </div>
    );
};

export default EmailBeneficiarySelector;
