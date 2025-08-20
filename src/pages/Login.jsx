import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import GoogleSignInButton from '../components/GoogleSignInButton';
import { MdEmail, MdLock, MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { useNotification } from '../components/notificationContext';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(formData.email, formData.password);
      showNotification({ type: 'success', message: 'Login successful! Welcome back.' });
      navigate('/home');
    } catch (err) {
      showNotification({ type: 'error', message: err.message });
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div 
      className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-amber-600 px-4"
    >
      <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl m-4 p-8 relative z-10">
        <div className="text-center mb-6">
          <img
            src="../../src/assets/logo.png"
            alt="Zippy Pay Logo"
            className="h-30 w-30 mx-auto rounded-full object-cover shadow"
          />
          <h1 className="text-2xl text-gray-600 font-bold mt-4">
            Sign In
          </h1>
          <p className="text-sm text-gray-500">
            Your gateway to seamless transactions
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
                value={formData.email}
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
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-900 to-amber-600 text-white px-8 py-3 rounded-full font-semibold hover:from-amber-600 hover:to-amber-700 transition-all duration-300"
          >
            {loading ? <LoadingSpinner size="sm" /> : 'Sign In'}
          </button>

          {/* Divider */}
          <div className="flex items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-2 text-gray-500 text-sm">Or</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          {/* Google */}
          <GoogleSignInButton 
            onSuccess={() => {
              showNotification({ type: 'success', message: 'Google login successful! Welcome back.' });
              navigate('/home');
            }}
            onError={(err) => showNotification({ type: 'error', message: err })}
          />

          {/* Register */}
          <p className="text-center text-sm text-gray-600 mt-4">
            Don’t have an account?{' '}
            <Link to="/register" className="text-[#F59E0B] hover:underline font-medium">
              Sign up
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

export default Login;
