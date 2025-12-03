import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';

import { MdEmail, MdLock, MdVisibility, MdVisibilityOff } from 'react-icons/md';


const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [notif, setNotif] = useState({ type: "", message: "" });
  const [showNotif, setShowNotif] = useState(false);

  const { login, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && loading) {
      setLoading(false);
    }
  }, [authLoading, loading]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setNotif({ type: "", message: "" });
    setShowNotif(false);

    try {
      await login(formData.email, formData.password);
      setNotif({ type: "success", message: "Login successful!" });
      setShowNotif(true);

      // Hide notification after 3 seconds
      setTimeout(() => setShowNotif(false), 3000);

      navigate('/home');
    } catch (err) {
      setNotif({ type: "error", message: err.message || "Login failed" });
      setShowNotif(true);

      setTimeout(() => setShowNotif(false), 3000);
    } finally {
      setLoading(false);
    }
  };

  const Spinner = () => (
    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
  );

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
            src="/bg.png"
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
          {notif.message && showNotif && (
            <div
              className={`mb-4 p-3 rounded-lg text-sm font-medium transition-opacity duration-500 ${notif.type === "error"
                ? "bg-red-100 text-red-700 border border-red-300"
                : "bg-green-100 text-green-700 border border-green-300"
                }`}
              style={{ opacity: showNotif ? 1 : 0 }}
            >
              {notif.message}
            </div>
          )}

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
            className="w-full bg-gradient-to-r from-purple-900 to-amber-600 text-white px-8 py-3 rounded-full font-semibold hover:from-amber-600 hover:to-amber-700 transition-all duration-300 flex items-center justify-center"
          >
            {loading ? <Spinner /> : 'Sign In'}
          </button>




          {/* Register */}
          <p className="text-center text-sm text-gray-600 mt-4">
            Don’t have an account?{' '}
            <Link to="/register" className="text-[#F59E0B] hover:underline font-medium">
              Sign up
            </Link>
          </p>
          <p className="text-center text-sm text-gray-600">
            <Link to="/forgot-password" className="text-[#F59E0B] hover:underline font-medium">
              Forgot Password?
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
