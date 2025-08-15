import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { User, Phone, Mail, Lock, Edit, Save, X } from 'lucide-react';

const Profile = () => {
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [profileData, setProfileData] = useState({
    full_name: user?.full_name || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleProfileChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
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
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  const handleLogout = () => {
    logout();
  };

  return (
    <div className="p-4 lg:p-6">
      <div className="container mx-auto max-w-2xl">
        <div className="mb-6">
          <h1 className="text-2xl lg:text-3xl font-bold text-neutral-800 mb-2">
            Profile Settings
          </h1>
          <p className="text-[#5C2D91]">
            Manage your account information and preferences
          </p>
        </div>

        {error && (
          <div className="alert alert-error mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="alert alert-success mb-4">
            {success}
          </div>
        )}

        {/* Profile Information */}
        <div className="card mb-6">
          <div className="flex items-center justify-between mb-4 bg-gray-200 p-2 rounded">
            <h3 className="text-lg font-semibold text-neutral-800">
              Personal Information
            </h3>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
               className="btn btn-outline flex items-center gap-2 hover:bg-[#FF8C00] p-1 rounded"
              >
                <Edit size={16} />
                Edit
              </button>
            )}
          </div>

          {isEditing ? (
            <form onSubmit={handleProfileSubmit}>
              <div className="form-group flex-col">
              <div>
                <label htmlFor="full_name" className="form-label text-sm font-medium">
                  Full Name :
                </label>
                </div>
                <div>
                <input
                  type="text"
                  id="full_name"
                  name="full_name"
                  value={profileData.full_name}
                  onChange={handleProfileChange}
                   className="mt-2 shadow border border-neutral-300 rounded-lg w-4/6 px-3 py-2 text-gray-700
 focus:shadow-outline focus:bg-blue-100 placeholder-indigo-300"
                  required
                />
              </div>
              </div>

              <div className="form-group flex-col">
              <div>
                <label htmlFor="email" className="form-label">
                  Email Address
                </label>
                </div>
                <div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleProfileChange}
                   className="mt-2 shadow border border-neutral-300 rounded-lg w-4/6 px-3 py-2 text-gray-700
 focus:shadow-outline focus:bg-blue-100 placeholder-indigo-300"
                  required
                />
              </div>
              </div>

              <div className="form-group flex-col">
              <div>
                <label htmlFor="phone" className="form-label">
                  Phone Number
                </label>
                </div>
                <div>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={profileData.phone}
                  onChange={handleProfileChange}
                  className="mt-2 shadow border border-neutral-300 rounded-lg w-4/6 px-3 py-2 text-gray-700
 focus:shadow-outline focus:bg-blue-100 placeholder-indigo-300"
                  required
                />
              </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={loading}
                   className=" flex items-center gap-2 bg-[#5C2D91] text-[#fff] mt-2 p-2 rounded-lg "
                >
                  {loading ? <LoadingSpinner size="sm" /> : <Save size={16} />}
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className=" flex items-center gap-2 bg-[#EF4444] text-[#fff] mt-2 p-2 rounded-lg "
                >
                  <X size={16} />
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <User className=" text-[#FF8C00]" size={20} />
                <div>
                  <p className="text-sm text-neutral-600">Full Name</p>
                  <p className="font-medium">{user?.full_name}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Mail className="text-[#FF8C00]" size={20} />
                <div>
                  <p className="text-sm text-neutral-600">Email</p>
                  <p className="font-medium">{user?.email}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Phone className="text-[#FF8C00]" size={20} />
                <div>
                  <p className="text-sm text-neutral-600">Phone</p>
                  <p className="font-medium">{user?.phone}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Change Password */}
        <div className="card mb-6">
      <div className="flex items-center justify-between mb-4 bg-gray-200 p-2 rounded">
            <h3 className="text-lg font-semibold text-neutral-800">
              Change Password
            </h3>
            {!isChangingPassword && (
              <button
                onClick={() => setIsChangingPassword(true)}
                className="btn btn-outline flex items-center gap-2 hover:bg-[#FF8C00] p-1 rounded"
              >
                <Lock size={16} />
                Change
              </button>
            )}
          </div>

          {isChangingPassword ? (
            <form onSubmit={handlePasswordSubmit}>
              <div className="form-group flex-col">
              <div>
                <label htmlFor="currentPassword" className="form-label">
                  Current Password
                </label>
                </div>
                <div>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  className="mt-2 shadow border border-neutral-300 rounded-lg w-4/6 px-3 py-2 text-gray-700
 focus:shadow-outline focus:bg-blue-100 placeholder-indigo-300"
                  required
                />
              </div>
              </div>

              <div className="form-group flex-col">
              <div>
                <label htmlFor="newPassword" className="form-label">
                  New Password
                </label>
                </div>
                <div>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className="mt-2 shadow border border-neutral-300 rounded-lg w-4/6 px-3 py-2 text-gray-700
 focus:shadow-outline focus:bg-blue-100 placeholder-indigo-300"
                  required
                />
              </div>
</div>
              <div className="form-group flex-col">
              <div>
                <label htmlFor="confirmPassword" className="form-label">
                  Confirm New Password
                </label>
                </div>
                <div>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className="mt-2 shadow border border-neutral-300 rounded-lg w-4/6 px-3 py-2 text-gray-700
 focus:shadow-outline focus:bg-blue-100 placeholder-indigo-300"
                  required
                />
              </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className=" flex items-center gap-2 bg-[#5C2D91] text-[#fff] mt-2 p-2 rounded-lg"
                >
                  {loading ? <LoadingSpinner size="sm" /> : <Save size={16} />}
                  Update Password
                </button>
                <button
                  type="button"
                  onClick={() => setIsChangingPassword(false)}
                  className=" flex items-center gap-2 bg-[#EF4444] text-[#fff] mt-2 p-2 rounded-lg "
                >
                  <X size={16} />
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <p className="text-neutral-600">
              Keep your account secure by using a strong password
            </p>
          )}
        </div>

        {/* Account Actions */}
        <div className="card">
      
          <div className="space-y-3">
            <button
              onClick={handleLogout}
              className="w-full bg-[#5C2D91] m-3 p-2 text-[#fff] rounded-lg hover:bg-[#FF8C00] "
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;