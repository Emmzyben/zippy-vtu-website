import { useState, useEffect } from 'react';
import { beneficiariesAPI } from '../services/api';
import { Users, ChevronDown, ChevronUp, UserPlus, Trash2 } from 'lucide-react';

const BeneficiarySelector = ({
  selectedNetwork,
  value,
  onSelect,
  onAdd,
}) => {
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [showList, setShowList] = useState(false);
  const [loading, setLoading] = useState(false);

  // Load beneficiaries on mount
  useEffect(() => {
    loadBeneficiaries();
  }, []);

  const loadBeneficiaries = async () => {
    try {
      setLoading(true);
      const response = await beneficiariesAPI.getBeneficiaries();
      setBeneficiaries(response.data.beneficiaries || []);
    } catch (error) {
      console.error('Failed to load beneficiaries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (beneficiary) => {
    onSelect(beneficiary);
    setShowList(false);
  };

  const handleAdd = async () => {
    if (!value || !selectedNetwork) return;

    try {
      await beneficiariesAPI.addBeneficiary({
        phone_number: value,
        network: selectedNetwork,
        name: `Beneficiary ${value.slice(-4)}`,
      });
      await loadBeneficiaries();
      onAdd?.();
    } catch (error) {
      console.error('Failed to add beneficiary:', error);
    }
  };

  const handleDelete = async (beneficiaryId, beneficiaryName) => {
    if (!window.confirm(`Are you sure you want to remove ${beneficiaryName} from your beneficiaries?`)) {
      return;
    }

    try {
      await beneficiariesAPI.deleteBeneficiary(beneficiaryId);
      await loadBeneficiaries();
    } catch (error) {
      console.error('Failed to delete beneficiary:', error);
      alert('Failed to remove beneficiary. Please try again.');
    }
  };

  return (
    <div className="relative">
      <label
        htmlFor="beneficiaryPhone"
        className="block text-sm font-medium text-neutral-700 mb-1"
      >
        Phone Number
      </label>

      <div className="flex gap-2">
        <input
          type="tel"
          id="beneficiaryPhone"
          value={value}
          onChange={(e) => onSelect({ phone_number: e.target.value })}
          className="flex-1 border border-neutral-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#5C2D91] transition"
          placeholder="08012345678"
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

      {/* Dropdown List */}
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
                  onClick={() => handleSelect(b)}
                  className="flex-1 text-left"
                >
                  <div className="text-left">
                    <p className="font-medium text-neutral-800">
                      {b.name || `Beneficiary ${b.phone_number.slice(-4)}`}
                    </p>
                    <p className="text-sm text-neutral-500">{b.phone_number}</p>
                  </div>
                </button>
                <div className="flex items-center gap-2">
                  {b.network && (
                    <span className="text-xs bg-[#5C2D91]/10 text-[#5C2D91] px-2 py-1 rounded-md">
                      {b.network.toUpperCase()}
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(b.id, b.name || `Beneficiary ${b.phone_number.slice(-4)}`);
                    }}
                    className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition"
                    title="Remove beneficiary"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-3 text-center text-neutral-500 text-sm">
              No beneficiaries yet
            </div>
          )}
        </div>
      )}

      {/* Add Beneficiary */}
      {value && selectedNetwork && (
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

export default BeneficiarySelector;
