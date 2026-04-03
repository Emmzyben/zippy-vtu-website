import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/LoadingSpinner';

import { MdPerson, MdEmail, MdPhone, MdLock, MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { useNotification } from '../../components/notificationContext';

const Register = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { showNotification } = useNotification();
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      showNotification({ type: 'error', message: 'Passwords do not match' });
      setLoading(false);
      return;
    }

    try {
      const userData = {
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password
      };

      const response = await register(userData);
      showNotification({ type: 'success', message: 'Registration successful! Welcome aboard.' });
      navigate('/home');
    } catch (err) {
      setError(err.message);
      showNotification({ type: 'error', message: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-neutral-50 px-4 py-12"
    >
      <div className="w-full max-w-lg bg-white shadow-[0_0_40px_rgba(0,0,0,0.05)] border border-neutral-100 rounded-[2rem] m-4 p-8 md:p-10 relative z-10">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block text-2xl font-black mb-4 hover:scale-105 transition-transform">
            <img src="/bg.png" alt="Zippy Pay" className="w-40 h-16 mx-auto object-contain" />
          </Link>
          <h1 className="text-3xl font-black mt-2 text-neutral-900">
            Create Account
          </h1>
          <p className="text-base text-neutral-500 mt-2">
            Join us for a seamless transaction experience
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
              {error}
            </div>
          )}

          {/* Full Name */}
          <div>
            <label htmlFor="full_name" className="block text-neutral-700 font-bold mb-2 text-sm uppercase tracking-wide">
              Full Name
            </label>
            <div className="relative">
              <MdPerson className="absolute left-3 top-1/2 -translate-y-1/2 text-[#F59E0B]" size={20} />
              <input
                type="text"
                id="full_name"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-3 text-base border border-neutral-200 rounded-xl focus:ring-2 focus:ring-[#e3984d]/20 focus:border-[#e3984d] transition-all bg-neutral-50 focus:bg-white"
                required
              />
            </div>
          </div>

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
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-3 text-base border border-neutral-200 rounded-xl focus:ring-2 focus:ring-[#e3984d]/20 focus:border-[#e3984d] transition-all bg-neutral-50 focus:bg-white"
                required
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-neutral-700 font-bold mb-2 text-sm uppercase tracking-wide">
              Phone Number
            </label>
            <div className="relative">
              <MdPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-[#F59E0B]" size={20} />
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-3 text-base border border-neutral-200 rounded-xl focus:ring-2 focus:ring-[#e3984d]/20 focus:border-[#e3984d] transition-all bg-neutral-50 focus:bg-white"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-neutral-700 font-bold mb-2 text-sm uppercase tracking-wide">
              Password
            </label>
            <div className="relative">
              <MdLock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#F59E0B]" size={20} />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-10 py-3 text-base border border-neutral-200 rounded-xl focus:ring-2 focus:ring-[#e3984d]/20 focus:border-[#e3984d] transition-all bg-neutral-50 focus:bg-white"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-neutral-700 font-bold mb-2 text-sm uppercase tracking-wide">
              Confirm Password
            </label>
            <div className="relative">
              <MdLock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#F59E0B]" size={20} />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full pl-10 pr-10 py-3 text-base border border-neutral-200 rounded-xl focus:ring-2 focus:ring-[#e3984d]/20 focus:border-[#e3984d] transition-all bg-neutral-50 focus:bg-white"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showConfirmPassword ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
              </button>
            </div>
          </div>



          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#e3984d] text-white px-8 py-4 rounded-xl font-bold text-base hover:bg-[#c98542] transition-all duration-300 flex items-center justify-center shadow-lg shadow-[#e3984d]/25 mt-8"
          >
            {loading ? <LoadingSpinner size="sm" /> : 'Create Account'}
          </button>



          {/* Login Link */}
          <div className="pt-6 border-t border-neutral-100 flex flex-col space-y-3">
            <p className="text-center text-base text-neutral-600">
              Already have an account?{' '}
              <Link to="/login" className="text-[#e3984d] hover:underline font-bold">
                Sign in instead
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

export default Register;
