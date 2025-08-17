import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import GoogleSignInButton from '../components/GoogleSignInButton';
import { MdEmail, MdLock, MdVisibility, MdVisibilityOff } from 'react-icons/md';
import bgImage from '../../src/assets/bg.png';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(formData.email, formData.password);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = () => {
    navigate('/');
  };

  const handleGoogleError = (error) => {
    setError(error);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  }; 

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="w-full md:w-1/2 flex items-center justify-center">
        <div className="w-full  relative z-10">
          <div className="text-center bg-[#5C2D91] p-6 ">
            <div className="flex items-center justify-center mb-2">
              <img
                src="../../src/assets/logo.jpeg"
                alt="Zippy Pay Logo"
                className="h-20 w-20 rounded-full object-cover  shadow"
              />
            </div>
            <h2 className="text-2xl font-bold text-white mb-1">Welcome Back</h2>
            <p className="text-white text-opacity-90">Sign in to your account</p>
          </div>

          <div className="bg-white shadow-2xl rounded-b-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-2" role="alert">
                  {error}
                </div>
              )}

              {/* Email Field */}
              <div className="relative">
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
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#5C2D91]"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="relative">
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
                    className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#5C2D91]"
                    required
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                    tabIndex={-1}
                  >
                    {showPassword ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
                  </button>
                </div>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#5C2D91] text-white font-semibold py-3 rounded hover:bg-[#5C2D91] disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center transition"
              >
                {loading ? <LoadingSpinner size="sm" /> : 'Sign In'}
              </button>

              {/* Divider */}
              <div className="flex items-center my-2">
                <div className="flex-grow border-t border-neutral-300"></div>
                <span className="mx-3 text-neutral-500 text-sm bg-white px-2">Or continue with</span>
                <div className="flex-grow border-t border-neutral-300"></div>
              </div>

              {/* Google Sign In */}
              <div>
                <GoogleSignInButton 
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                />
              </div>

              {/* Register Link */}
              <div className="text-center pt-2">
                  <p className="text-neutral-600">
                    Don&#39;t have an account?{' '}
                    <Link to="/register" className="text-[#F59E0B] hover:underline font-medium">
                      Sign up
                    </Link>
                  </p>
                  <p className="text-neutral-600">
                    <Link to="/" className=" hover:underline font-medium">
                     Or go to Landing Page
                    </Link>
                  </p>

              </div>
            </form>
          </div>
        </div>
      </div>



{/* Right side image */}
<div className="relative w-full md:w-1/2 h-64 md:h-auto hidden md:block">
  <div
    className="w-full h-full bg-cover bg-center"
    style={{ backgroundImage: `url(${bgImage})` }}
  ></div>

  <div className="absolute inset-0 bg-black/20"></div>

  <div className="absolute inset-0 flex items-center justify-center p-4">
    {/* Optional content */}
  </div>
</div>


    </div>
  );
};

export default Login;
