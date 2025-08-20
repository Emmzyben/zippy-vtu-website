import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import GoogleSignInButton from '../components/GoogleSignInButton';
import { MdPerson, MdEmail, MdPhone, MdLock, MdVisibility, MdVisibilityOff } from 'react-icons/md';
import bgImage from '../../src/assets/bg.png';

const Register = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    referral_code: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
      setLoading(false);
      return;
    }

    try {
      const userData = {
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        referral_code: formData.referral_code
      };

      await register(userData);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
       className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-amber-600 px-4"
    >
         <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl m-4 p-8 relative z-10">
        <div className="text-center mb-6">
          <img
            src="../../src/assets/logo.jpeg"
            alt="Zippy Pay Logo"
            className="h-30 w-30 mx-auto rounded-full object-cover shadow"
          />
          <h1 className="text-2xl font-bold mt-4 text-gray-700">
            Create Account
          </h1>
          <p className="text-sm text-gray-500">
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
            <label htmlFor="full_name" className="block text-gray-700 font-semibold mb-1">
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
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5C2D91]"
                required
              />
            </div>
          </div>

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
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5C2D91]"
                required
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-gray-700 font-semibold mb-1">
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
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5C2D91]"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-gray-700 font-semibold mb-1">
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
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5C2D91]"
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
            <label htmlFor="confirmPassword" className="block text-gray-700 font-semibold mb-1">
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
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5C2D91]"
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

          {/* Referral Code */}
          <div>
            <label htmlFor="referral_code" className="block text-gray-700 font-semibold mb-1">
              Referral Code (Optional)
            </label>
            <input
              type="text"
              id="referral_code"
              name="referral_code"
              value={formData.referral_code}
              onChange={handleChange}
              placeholder="Enter referral code"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5C2D91]"
            />
          </div>

          {/* Submit */}
          <button 
            type="submit"
            disabled={loading}
               className="w-full bg-gradient-to-r from-purple-900 to-amber-600 text-white px-8 py-3 rounded-full font-semibold hover:from-amber-600 hover:to-amber-700 transition-all duration-300"
          >
            {loading ? <LoadingSpinner size="sm" /> : 'Create Account'}
          </button>

          {/* Divider */}
          <div className="flex items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-2 text-gray-500 text-sm">Or</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          {/* Google */}
          <GoogleSignInButton 
            referralCode={formData.referral_code}
            onSuccess={() => navigate('/')}
            onError={(err) => setError(err)}
          />

          {/* Login Link */}
          <p className="text-center text-sm text-gray-600 mt-4">
            Already have an account?{' '}
            <Link to="/login" className="text-[#F59E0B] hover:underline font-medium">
              Sign in
            </Link>
          </p>
          <p className="text-center text-sm text-gray-600">
            <Link to="/" className="hover:underline font-medium">Or go to Landing Page</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
