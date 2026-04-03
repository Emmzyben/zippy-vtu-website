import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import { User, Phone, Mail, Lock, X, Save, Eye, EyeOff, LayoutDashboard, CheckCircle2 } from 'lucide-react';

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout, changePassword } = useAuth();
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      setLoading(false);
      return;
    }

    try {
      await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      setSuccess('Password changed successfully!');
      setIsChangingPassword(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 lg:p-10 mx-auto transition-all">
      <div className="mb-10">
        <h1 className="text-xl font-bold text-neutral-900 tracking-tight">
          Account Settings
        </h1>
        <p className="text-xs text-neutral-500 font-medium mt-1 uppercase tracking-widest">Manage your profile and security credentials</p>
      </div>

      <div className="space-y-6">
        {error && <div className="p-3 border border-red-100 rounded-md bg-red-50 text-red-700 text-xs font-bold uppercase tracking-wide">{error}</div>}
        {success && <div className="p-3 border border-green-100 rounded-md bg-green-50 text-green-700 text-xs font-bold uppercase tracking-wide">{success}</div>}

        {/* User Details */}
        <div className="bg-white border border-neutral-100 shadow-sm p-6 rounded-lg">
          <h2 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-6">Identity Records</h2>

          <div className="space-y-5">
            <div className="flex items-center gap-4 border-b border-neutral-50 pb-4">
              <div className="w-10 h-10 rounded-md bg-[#e3984d] border border-neutral-800 flex items-center justify-center text-white">
                <User size={18} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Full Legal Name</p>
                <p className="font-bold text-neutral-900 text-sm">{user?.full_name}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 border-b border-neutral-50 pb-4">
              <div className="w-10 h-10 rounded-md bg-neutral-50 border border-neutral-100 flex items-center justify-center text-neutral-600">
                <Mail size={18} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Email Address</p>
                <p className="font-bold text-neutral-900 text-sm">{user?.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-md bg-neutral-50 border border-neutral-100 flex items-center justify-center text-neutral-600">
                <Phone size={18} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Mobile Contact</p>
                <p className="font-bold text-neutral-900 text-sm">{user?.phone}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Password Section */}
        <div className="bg-white border border-neutral-100 shadow-sm p-6 rounded-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <h3 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Authentication key</h3>
            {!isChangingPassword && (
              <button
                onClick={() => setIsChangingPassword(true)}
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-md border border-neutral-200 text-[10px] font-bold uppercase tracking-widest text-neutral-900 bg-neutral-50 hover:bg-neutral-100 transition-colors"
              >
                <Lock size={14} /> Update Credentials
              </button>
            )}
          </div>

          {isChangingPassword ? (
            <form onSubmit={handlePasswordSubmit} className="space-y-4">

              <div className="relative">
                <input
                  type={showCurrent ? "text" : "password"}
                  name="currentPassword"
                  placeholder="Current Password"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  className="w-full pl-3 pr-10 py-3 bg-neutral-50 border border-neutral-100 rounded-md focus:border-[#e3984d] focus:bg-white focus:outline-none transition-all text-xs font-bold text-neutral-900"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                >
                  {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              <div className="relative">
                <input
                  type={showNew ? "text" : "password"}
                  name="newPassword"
                  placeholder="New Password"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className="w-full pl-3 pr-10 py-3 bg-neutral-50 border border-neutral-100 rounded-md focus:border-[#e3984d] focus:bg-white focus:outline-none transition-all text-xs font-bold text-neutral-900"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                >
                  {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm New Password"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className="w-full pl-3 pr-10 py-3 bg-neutral-50 border border-neutral-100 rounded-md focus:border-[#e3984d] focus:bg-white focus:outline-none transition-all text-xs font-bold text-neutral-900"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 bg-[#e3984d] text-white px-4 py-3 rounded-md text-[10px] font-bold uppercase tracking-widest hover:bg-[#c98542] transition-colors"
                >
                  {loading ? <LoadingSpinner size="sm" /> : <Save size={14} />} Confirm
                </button>
                <button
                  type="button"
                  onClick={() => setIsChangingPassword(false)}
                  className="flex items-center justify-center gap-2 bg-white border border-neutral-200 text-neutral-900 px-4 py-3 rounded-md text-[10px] font-bold uppercase tracking-widest hover:bg-neutral-50 transition-colors"
                >
                  <X size={14} /> Cancel
                </button>
              </div>
            </form>
          ) : (
            <p className="text-neutral-500 text-xs font-medium border-l-2 border-neutral-200 pl-3">Maintaining a strong, unique password ensures your wallet and ticket assets remain secure.</p>
          )}
        </div>

        {/* Organizer Program Section */}
        <div className="bg-white border border-neutral-100 shadow-sm p-6 rounded-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <h3 className="text-[10px] font-bold text-[#e3984d] uppercase tracking-widest flex items-center gap-2"><LayoutDashboard size={14} /> Partner Privileges</h3>
            {user?.is_organizer == 1 ? (
              <span className="flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-1 rounded border border-green-100 text-[10px] font-black uppercase tracking-widest">
                <CheckCircle2 size={12} /> Active
              </span>
            ) : (
              <button
                onClick={() => navigate('/organizer/dashboard')}
                className="text-[10px] font-bold uppercase tracking-widest text-[#e3984d] hover:text-[#4A1F7C] underline"
              >
                Access Portal
              </button>
            )}
          </div>

          <p className="text-neutral-600 text-xs font-medium leading-relaxed mb-6">
            {user?.is_organizer == 1
              ? "You hold an active Organizer status. Use the Command Center to list events, monitor sales, and access the gate scanner."
              : "Expand your reach. Enroll in the ZippyPay Organizer network to manage independent events and receive direct ticket settlements."}
          </p>

          {user?.is_organizer != 1 && (
            <button
              onClick={() => navigate('/organizer/dashboard')}
              className="w-full py-3 rounded-md border border-[#e3984d] text-[#e3984d] bg-purple-50 font-bold text-[10px] uppercase tracking-widest hover:bg-[#e3984d] hover:text-white transition-colors flex items-center justify-center gap-2"
            >
              Initialize Enrollment
            </button>
          )}
        </div>

        {/* Help & Support */}
        <div className="bg-white border border-neutral-100 shadow-sm p-6 rounded-lg">
          <h3 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-4">Support & Diagnostics</h3>
          <p className="text-neutral-600 text-xs font-medium mb-6">
            Require operational assistance? Connect with the network support desk via WhatsApp.
          </p>

          <a
            href="https://wa.me/2349056897432"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-[#e3984d] text-white py-3 rounded-md text-[10px] font-bold uppercase tracking-widest hover:bg-[#075E54] transition-colors shadow-sm"
          >
            Open Support Ticket
          </a>
        </div>

        <button
          onClick={logout}
          className="w-full border-2 border-[#e3984d] border-dashed text-neutral-900 bg-transparent py-4 rounded-md text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#e3984d] hover:text-white transition-all hover:border-solid"
        >
          Log out
        </button>
      </div>
    </div>
  );
};

export default Profile;
