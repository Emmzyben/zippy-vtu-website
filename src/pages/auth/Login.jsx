import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import NotificationModal from '../../components/NotificationModal';
import LoadingSpinner from '../../components/LoadingSpinner';
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
      className="flex items-center justify-center min-h-screen bg-neutral-50 px-4 py-12"
    >
      <div className="w-full max-w-lg bg-white shadow-[0_0_40px_rgba(0,0,0,0.05)] border border-neutral-100 rounded-[2rem] m-4 p-8 md:p-10 relative z-10">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block text-2xl font-black mb-4 hover:scale-105 transition-transform">
            <img src="/bg.png" alt="Zippy Pay" className="w-35 h-20 object-cover" />
          </Link>

          <p className="text-base text-neutral-500 mt-2">
            Sign in to your ZippyPay dashboard
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
            className="w-full bg-[#e3984d] text-white px-8 py-4 rounded-xl font-bold text-base hover:bg-[#c98542] transition-all duration-300 flex items-center justify-center shadow-lg shadow-[#e3984d]/25 mt-8"
          >
            {loading ? <Spinner /> : 'Sign In'}
          </button>




          {/* Register */}
          <div className="pt-6 border-t border-neutral-100 flex flex-col space-y-3">
            <p className="text-center text-base text-neutral-600">
              Don’t have an account?{' '}
              <Link to="/register" className="text-[#e3984d] hover:underline font-bold">
                Sign up instead
              </Link>
            </p>
            <p className="text-center text-base text-neutral-600">
              <Link to="/forgot-password" className="hover:text-[#e3984d] transition-colors font-medium">
                Forgot Password?
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

export default Login;
