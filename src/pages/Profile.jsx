import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { User, Phone, Mail, Lock, X, Save, Eye, EyeOff } from 'lucide-react';

const Profile = () => {
  const { user, logout } = useAuth();
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
      await new Promise(resolve => setTimeout(resolve, 1000));
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
    <div className="min-h-screen p-6 flex justify-center bg-gradient-to-br from-[#f7f5ff] to-[#fff]">
      <div className="w-full max-w-xl space-y-8">

        <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">
          Account Settings
        </h1>

        {error && <div className="p-3 rounded-lg bg-red-100 text-red-700">{error}</div>}
        {success && <div className="p-3 rounded-lg bg-green-100 text-green-700">{success}</div>}

        {/* User Details */}
        <div className="backdrop-blur-md border border-white/40 shadow-lg bg-white/60 p-6 rounded-2xl space-y-5">
          <h2 className="text-lg font-semibold text-neutral-800">Your Information</h2>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <User className="text-[#5C2D91]" size={20} />
              <div>
                <p className="text-sm text-neutral-500">Full Name</p>
                <p className="font-medium">{user?.full_name}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Mail className="text-[#5C2D91]" size={20} />
              <div>
                <p className="text-sm text-neutral-500">Email Address</p>
                <p className="font-medium">{user?.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="text-[#5C2D91]" size={20} />
              <div>
                <p className="text-sm text-neutral-500">Phone</p>
                <p className="font-medium">{user?.phone}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Password Section */}
        <div className="backdrop-blur-md border border-white/40 shadow-lg bg-white/60 p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-neutral-800">Security</h3>
            {!isChangingPassword && (
              <button
                onClick={() => setIsChangingPassword(true)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-neutral-300 text-neutral-700 hover:bg-neutral-100"
              >
                <Lock size={16} /> Change Password
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
                  className="w-full px-3 py-2 border rounded-lg pr-10 focus:ring-2 focus:ring-[#5C2D91]"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-600"
                >
                  {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <div className="relative">
                <input
                  type={showNew ? "text" : "password"}
                  name="newPassword"
                  placeholder="New Password"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-3 py-2 border rounded-lg pr-10 focus:ring-2 focus:ring-[#5C2D91]"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-600"
                >
                  {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm New Password"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-3 py-2 border rounded-lg pr-10 focus:ring-2 focus:ring-[#5C2D91]"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-600"
                >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 bg-[#5C2D91] text-white px-4 py-2 rounded-lg hover:bg-[#4a2174]"
                >
                  {loading ? <LoadingSpinner size="sm" /> : <Save size={16} />} Update
                </button>
                <button
                  type="button"
                  onClick={() => setIsChangingPassword(false)}
                  className="flex items-center gap-2 bg-neutral-300 text-neutral-800 px-4 py-2 rounded-lg hover:bg-neutral-400"
                >
                  <X size={16} /> Cancel
                </button>
              </div>

            </form>
          ) : (
            <p className="text-neutral-600 text-sm">Use a strong and secure password.</p>
          )}
        </div>

       {/* Help & Support */}
<div className="backdrop-blur-md border border-white/40 shadow-lg bg-white/60 p-6 rounded-2xl space-y-3">
  <h3 className="text-lg font-semibold text-neutral-800">Help & Support</h3>
  <p className="text-neutral-600 text-sm">
    Need assistance? Contact our support team directly on WhatsApp.
  </p>

  <a
    href="https://wa.me/2349056897432"
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center justify-center gap-2 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
  >
    Contact Us on WhatsApp
  </a>
</div>

<button
  onClick={logout}
  className="w-full bg-[#5C2D91] text-white py-3 rounded-xl font-medium hover:bg-[#FF8C00] transition"
>
  Sign Out
</button>


      </div>
    </div>
  );
};

export default Profile;
