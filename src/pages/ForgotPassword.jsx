import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNotification } from '../components/notificationContext';
import { authService } from '../services/authService';
import LoadingSpinner from '../components/LoadingSpinner';
import { MdEmail, MdArrowBack } from 'react-icons/md';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { showNotification } = useNotification();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await authService.forgotPassword(email);
      setSubmitted(true);
      showNotification({
        type: 'success',
        message: 'Password reset email sent! Check your inbox.'
      });
    } catch (error) {
      showNotification({
        type: 'error',
        message: error.message || 'Failed to send reset email'
      });
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div
        className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-amber-600 px-4"
      >
        <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl m-4 p-8 relative z-10 text-center">
          <div className="mb-6">
            <img
              src="/bg.png"
              alt="Zippy Pay Logo"
              className="h-30 w-30 mx-auto rounded-full object-cover shadow"
            />
          </div>

          <div className="mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MdEmail className="text-green-600" size={32} />
            </div>
            <h1 className="text-2xl text-gray-600 font-bold mb-2">
              Check Your Email
            </h1>
            <p className="text-sm text-gray-500 mb-4">
              We've sent a password reset link to <strong>{email}</strong>
            </p>
            <p className="text-xs text-gray-400">
              Didn't receive the email? Check your spam folder or try again.
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => setSubmitted(false)}
              className="w-full bg-gradient-to-r from-purple-900 to-amber-600 text-white px-8 py-3 rounded-full font-semibold hover:from-amber-600 hover:to-amber-700 transition-all duration-300"
            >
              Try Different Email
            </button>

            <Link
              to="/login"
              className="block w-full text-center text-[#F59E0B] hover:underline font-medium"
            >
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-amber-600 px-4"
    >
      <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl m-4 p-8 relative z-10">
        <div className="text-center mb-6">
          <img
            src="/bg.png"
            alt="Zippy Pay Logo"
            className="h-30 w-30 mx-auto rounded-full object-cover shadow"
          />
          <h1 className="text-2xl text-gray-600 font-bold mt-4">
            Forgot Password?
          </h1>
          <p className="text-sm text-gray-500">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-gray-700 font-semibold mb-1">
              Email Address
            </label>
            <div className="relative">
              <MdEmail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#F59E0B]" size={20} />
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5C2D91] focus:border-transparent"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || !email.trim()}
            className="w-full bg-gradient-to-r from-purple-900 to-amber-600 text-white px-8 py-3 rounded-full font-semibold hover:from-amber-600 hover:to-amber-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <LoadingSpinner size="sm" /> : 'Send Reset Link'}
          </button>
        </form>

        {/* Back to Login */}
        <div className="text-center mt-6">
          <Link
            to="/login"
            className="inline-flex items-center text-[#F59E0B] hover:underline font-medium"
          >
            <MdArrowBack className="mr-2" size={16} />
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
