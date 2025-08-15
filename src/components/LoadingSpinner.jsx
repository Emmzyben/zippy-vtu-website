import PropTypes from 'prop-types';

const LoadingSpinner = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  return (
    <div className="flex items-center justify-center">
      <div
        className={`
          ${sizeClasses[size]}
          border-4
          border-t-4
          border-t-primary
          border-b-transparent
          border-l-neutral-200
          border-r-neutral-200
          rounded-full
          animate-spin
          shadow-lg
          bg-gradient-to-tr from-primary/10 to-purple/0
        `}
        style={{ borderTopColor: 'var(--tw-prose-invert)' }}
      ></div>
    </div>
  );
};

LoadingSpinner.propTypes = {
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl'])
};

export default LoadingSpinner;

