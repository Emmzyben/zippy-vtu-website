const NetworkSelector = ({ value, onChange, networks }) => {
  return (
    <div className="form-group">
      <label className="form-label mb-2">Select Network</label>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {networks.map((network) => (
          <button
            key={network.code}
            type="button"
            onClick={() => onChange(network.code)}
            className={`p-4 rounded-lg border-2 transition-all duration-200 ${
              value === network.code
                ? 'border-[#5C2D91] bg-[#5C2D91] text-white'
                : 'border-neutral-200 hover:border-[#5C2D91] hover:bg-[#5C2D91] hover:bg-opacity-10'
            }`}
          >
            <div className="flex flex-col items-center gap-2">
              <img
                src={network.logo}
                alt={network.name}
                className="w-15 h-15 rounded"
              />
              <span className="text-sm font-medium">{network.name}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default NetworkSelector;