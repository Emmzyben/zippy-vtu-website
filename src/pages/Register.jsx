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
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
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

  const handleGoogleSuccess = () => {
    navigate('/');
  };

  const handleGoogleError = (error) => {
    setError(error);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side: Form container */}
      <div className="w-full md:w-1/2 flex items-center justify-center  relative">
        <div className="w-full  relative z-10">
          <div className="text-center mb-0 bg-[#5C2D91] p-6 ">
            <div className="flex items-center justify-center mb-2">
              <img
                src="../../src/assets/logo.jpeg"
                alt="Zippy Pay Logo"
                className="h-20 w-20 rounded-full object-cover  shadow"
              />
            </div>
            <p className="text-white text-opacity-90">Create your account</p>
          </div>

          <div className="card bg-white shadow-2xl p-6">
            <form onSubmit={handleSubmit}>
              {error && (
                <div className="alert alert-error mb-4">
                  {error}
                </div>
              )}

              <div className="form-group relative mb-2">
                <label htmlFor="full_name" className="block text-gray-700 font-semibold">
                  Full Name
                </label>
                <div className="relative">
                  <MdPerson className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#F59E0B]" size={20} />
                  <input
                    type="text"
                    id="full_name"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple"
                    required
                  />
                </div>
              </div>

              <div className="form-group relative mb-2">
                <label htmlFor="email" className="block  text-gray-700 font-semibold">
                  Email Address
                </label>
                <div className="relative">
                  <MdEmail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#F59E0B]" size={20} />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                     className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple"
                    required
                  />
                </div>
              </div>

              <div className="form-group relative mb-2">
                <label htmlFor="phone" className="block  text-gray-700 font-semibold">
                  Phone Number
                </label>
                <div className="relative">
                  <MdPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#F59E0B]" size={20} />
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                     className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple"
                    required
                  />
                </div>
              </div>

              <div className="form-group relative mb-2">
                <label htmlFor="password" className="block text-gray-700 font-semibold">
                  Password
                </label>
                <div className="relative">
                  <MdLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#F59E0B]" size={20} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                     className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple"
                    required
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                    tabIndex={-1}
                  >
                    {showPassword ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
                  </button>
                </div>
              </div>

              <div className="form-group relative mb-2">
                <label htmlFor="confirmPassword" className="block text-gray-700 font-semibold">
                  Confirm Password
                </label>
                <div className="relative">
                  <MdLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#F59E0B]" size={20} />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple"
                    required
                  />
                  <button
                    type="button"
                    onClick={toggleConfirmPasswordVisibility}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
                  </button>
                </div>
              </div>

              <div className="form-group relative mb-10">
                <label htmlFor="referral_code" className="block text-gray-700 font-semibold">
                  Referral Code (Optional)
                </label>
                <input
                  type="text"
                  id="referral_code"
                  name="referral_code"
                  value={formData.referral_code}
                  onChange={handleChange}
                   className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple"
                  placeholder="Enter referral code"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                 className="w-full bg-[#5C2D91]  text-white font-semibold py-3 rounded hover:bg-[#5C2D91] disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center transition"
              >
                {loading ? <LoadingSpinner size="sm" /> : 'Create Account'}
              </button>

              <div className="relative mb-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-neutral-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-neutral-500">Or continue with</span>
                </div>
              </div>

              <div className="mb-4">
                <GoogleSignInButton 
                  referralCode={formData.referral_code}
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                />
              </div>
              <div className="text-center">
                <p className="text-neutral-600">
                  Already have an account?{' '}
                  <Link to="/login" className="text-[#F59E0B] hover:underline font-medium">
                    Sign in
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
     
       <div className="absolute inset-0 bg-black/70"></div>
     
   <div className="absolute inset-0 flex flex-col items-center justify-start p-6 pt-26 text-center">
  <h2 className="text-white text-4xl font-extrabold mb-4 tracking-wide">Welcome to Zippy Pay</h2>
  <p className="text-white text-2xl max-w-md">
    Fast, secure, and effortless payment services for everyone. Join the future of seamless transactions today.
  </p>
</div>


     </div>
     
    </div>
  );
};

export default Register;
