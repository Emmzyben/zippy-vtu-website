import PropTypes from 'prop-types';

const LoadingSpinner = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-10 h-10 text-xs',
    md: 'w-14 h-14 text-sm',
    lg: 'w-20 h-20 text-base',
    xl: 'w-28 h-28 text-lg'
  };

  return (
    <div className="flex items-center justify-center">
      <div className="relative flex items-center justify-center">
        {/* Spinner circle */}
        <div
          className={`
            ${sizeClasses[size].split(' ')[0]} 
            ${sizeClasses[size].split(' ')[1]} 
            border-4
            border-t-4
            border-t-purple-900
            border-b-transparent
            border-l-purple-900
            border-r-transparent
            rounded-full
            animate-spin
            shadow-lg
            bg-gradient-to-br from-purple-900 via-purple-800 to-amber-600
          `}
        ></div>

        <span
          className={`absolute text-white font-bold ${sizeClasses[size].split(' ')[2]}`}
        >
          Zippy
        </span>
      </div>
    </div>
  );
};

LoadingSpinner.propTypes = {
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl'])
};

export default LoadingSpinner;
