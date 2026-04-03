import PropTypes from 'prop-types';

const LoadingSpinner = ({ size = 'md' }) => {
  const sizeMap = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-2',
    lg: 'w-12 h-12 border-[3px]',
    xl: 'w-16 h-16 border-[3px]',
  };

  return (
    <div className="flex items-center justify-center">
      <div
        className={`${sizeMap[size]} rounded-full border-neutral-200 border-t-[#e3984d] animate-spin`}
        role="status"
        aria-label="Loading"
      />
    </div>
  );
};

LoadingSpinner.propTypes = {
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
};

export default LoadingSpinner;
