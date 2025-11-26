// components/NetworkSelector.jsx
import React from 'react';

const networks = [
  { id: 'mtn', name: 'MTN', logo: '/MTN.jpg' },
  { id: 'glo', name: 'Glo', logo: '/glo.jpg' },
  { id: 'airtel', name: 'Airtel', logo: '/airtel.png' },
  { id: 'etisalat', name: '9mobile', logo: '/9mobile.jpeg' },
];

const NetworkSelector = ({ value, onChange }) => {
  return (
    <div>
      <label className="form-label block mb-2">Select Network</label>
      <div className="grid grid-cols-2 gap-3">
        {networks.map((net) => (
          <button
            key={net.id}
            type="button"
            onClick={() => onChange(net.id)}
            className={`flex items-center justify-center gap-2 p-3 rounded-lg border transition ${value === net.id
                ? 'border-[#5C2D91] bg-[#5C2D91] text-white'
                : 'border-neutral-200 hover:border-[#5C2D91]'
              }`}
          >
            <img src={net.logo} alt={net.name} className="w-8 h-8" />
            <span className="font-medium">{net.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default NetworkSelector;
