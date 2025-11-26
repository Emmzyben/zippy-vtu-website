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
    { path: '/home', icon: Home, label: 'Home' },
    { path: '/airtime', icon: Smartphone, label: 'Airtime' },
    { path: '/data', icon: Wifi, label: 'Data' },
    { path: '/bills', icon: Receipt, label: 'Bills' },
    { path: '/wallet', icon: Wallet, label: 'Wallet' },
    { path: '/transactions', icon: History, label: 'History' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <nav className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col bg-white border-r border-gray-200 shadow-sm">
      {/* Logo Section */}
      <div className="flex h-20 items-center justify-center border-b border-gray-100">
        <img
          src="/bg.png"
          alt="Zippy Pay Logo"
          className="h-20 w-40 rounded-full object-cover"
        />
      </div>

      {/* User Section */}
      <div className="p-4">
        <div className="rounded-2xl bg-[#5C2D91]/10 border border-[#5C2D91]/20 p-4 text-[#5C2D91] shadow-sm">
          <p className="text-sm opacity-80">Welcome back,</p>
          <p className="font-semibold text-lg">
            {user?.full_name || 'User'}
          </p>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-4">
        <ul className="space-y-1">
          {navItems.map(({ path, icon: Icon, label }) => {
            const isActive = location.pathname === path;
            return (
              <li key={path}>
                <Link
                  to={path}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 font-medium transition-all duration-200 ${isActive
                    ? 'bg-[#5C2D91] text-white shadow-md'
                    : 'text-neutral-600 hover:text-[#5C2D91] hover:bg-[#5C2D91]/10'
                    }`}
                >
                  <Icon size={20} />
                  <span>{label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Footer / Logout */}
      <div className="border-t border-gray-100 p-4">
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-neutral-600 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
        >
          <LogOut size={20} />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </nav>
  );
};

export default Navigation;
