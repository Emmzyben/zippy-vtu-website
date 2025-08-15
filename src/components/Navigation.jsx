import { Link, useLocation } from 'react-router-dom';
import {
  Home, Smartphone, Wifi, Receipt,
  Wallet, History, User, Users, LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navigation = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/airtime', icon: Smartphone, label: 'Airtime' },
    { path: '/data', icon: Wifi, label: 'Data' },
    { path: '/bills', icon: Receipt, label: 'Bills' },
    { path: '/wallet', icon: Wallet, label: 'Wallet' },
    { path: '/transactions', icon: History, label: 'History' },
    { path: '/referral', icon: Users, label: 'Referral' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];          

  return (
    <nav className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col lg:bg-white lg:shadow">
      <div className="flex h-16 items-center justify-center ">
        <img
          src="../../src/assets/logo.jpeg"
          alt="Zippy Pay Logo"
          className="h-50 w-50 rounded-full"
        />
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="mb-6 rounded-lg bg-[#5C2D91] p-4 text-white">
          <p className="text-sm opacity-90">Welcome back,</p>
          <p className="font-semibold">{user?.full_name || 'User'}</p>
        </div>

        <ul className="space-y-2">
          {navItems.map(({ path, icon: Icon, label }) => {
            const isActive = location.pathname === path;
            return (
              <li key={path}>
                <Link
                  to={path}
                  className={`flex items-center gap-3 rounded-lg px-4 py-3 transition ${
                    isActive
                      ? 'bg-[#5C2D91] text-white shadow'
                      : 'text-neutral-600 hover:bg-neutral-100 hover:text-[#F59E0B]'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="border-t border-neutral-200 p-4"></div>
      <button
        onClick={logout}
        className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-neutral-600 transition hover:bg-red-50 hover:text-red-600"
      >
        <LogOut size={20} />
        <span className="font-medium">Sign Out</span>
      </button>
    </nav>
  );
};

export default Navigation;
