import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNotification } from '../../components/notificationContext';
import { authService } from '../../services/authService';
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

  const Spinner = () => (
    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
  );

  if (submitted) {
    return (
      <div
        className="flex items-center justify-center min-h-screen bg-neutral-50 px-4 py-12"
      >
        <div className="w-full max-w-lg bg-white shadow-[0_0_40px_rgba(0,0,0,0.05)] border border-neutral-100 rounded-[2rem] m-4 p-8 md:p-10 relative z-10 text-center">
          <div className="mb-6">
            <Link to="/" className="inline-block text-2xl font-black mb-4 hover:scale-105 transition-transform">
              <span className="text-[#e3984d]">Zippy</span><span className="text-neutral-900">Pay</span>
            </Link>
          </div>

          <div className="mb-8">
            <div className="w-20 h-20 bg-[#e3984d]/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <MdEmail className="text-[#e3984d]" size={40} />
            </div>
            <h1 className="text-3xl text-neutral-900 font-black mt-2 mb-3">
              Check Your Email
            </h1>
            <p className="text-base text-neutral-500 mb-4 px-4 leading-relaxed">
              We've sent a password reset link to <strong className="text-neutral-800">{email}</strong>
            </p>
            <p className="text-sm text-neutral-400">
              Didn't receive the email? Check your spam folder or try again.
            </p>
          </div>

          <div className="space-y-4 pt-6 border-t border-neutral-100">
            <button
              onClick={() => setSubmitted(false)}
              className="w-full bg-[#e3984d] text-white px-8 py-4 rounded-xl font-bold text-base hover:bg-[#c98542] transition-all duration-300 flex items-center justify-center shadow-lg shadow-[#e3984d]/25"
            >
              Try Different Email
            </button>

            <div className="pt-4 text-center">
              <Link
                to="/login"
                className="font-bold text-neutral-600 hover:text-[#e3984d] transition-colors inline-block"
              >
                Back to Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-neutral-50 px-4 py-12"
    >
      <div className="w-full max-w-lg bg-white shadow-[0_0_40px_rgba(0,0,0,0.05)] border border-neutral-100 rounded-[2rem] m-4 p-8 md:p-10 relative z-10">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block text-2xl font-black mb-4 hover:scale-105 transition-transform">
            <img src="/logo.png" alt="Zippy Pay" className="w-35 h-20 object-cover" />
          </Link>
          <h1 className="text-3xl text-neutral-900 font-black mt-2">
            Forgot Password?
          </h1>
          <p className="text-base text-neutral-500 mt-2">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-neutral-700 font-bold mb-2 text-sm uppercase tracking-wide">
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
                className="w-full pl-10 pr-3 py-3 text-base border border-neutral-200 rounded-xl focus:ring-2 focus:ring-[#e3984d]/20 focus:border-[#e3984d] transition-all bg-neutral-50 focus:bg-white"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || !email.trim()}
            className="w-full bg-[#e3984d] text-white px-8 py-4 rounded-xl font-bold text-base hover:bg-[#c98542] transition-all duration-300 flex items-center justify-center shadow-lg shadow-[#e3984d]/25 mt-8 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Spinner /> : 'Send Reset Link'}
          </button>

          {/* Back to Login and Home */}
          <div className="pt-6 border-t border-neutral-100 flex flex-col space-y-3 mt-8">
            <p className="text-center text-base text-neutral-600">
              <Link to="/login" className="hover:text-[#e3984d] transition-colors font-medium">
                Back to Sign In
              </Link>
            </p>
            <p className="text-center text-sm text-neutral-400 mt-2">
              <Link to="/" className="hover:text-neutral-600 transition-colors">← Back to Home</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
