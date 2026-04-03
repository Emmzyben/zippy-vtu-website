import { Link, useLocation } from 'react-router-dom';
import {
  Home, Smartphone, Wifi, Receipt,
  Wallet, History, User, LogOut,
  Ticket, Plane, LayoutDashboard, Globe
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navigation = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const navSections = [
    {
      title: 'Overview',
      items: [
        { path: '/home', icon: Home, label: 'Home' },
        { path: '/wallet', icon: Wallet, label: 'Wallet' },
      ]
    },
    {
      title: 'Payments',
      items: [
        { path: '/airtime', icon: Smartphone, label: 'Airtime' },
        { path: '/data', icon: Wifi, label: 'Data' },
        { path: '/bills', icon: Receipt, label: 'Bills' },
        { path: '/transactions', icon: History, label: 'History' },
        { path: '/flights', icon: Plane, label: 'Flights' },
      ]
    },
    {
      title: 'Discovery',
      items: [
        { path: '/app/explore-events', icon: Globe, label: 'Explore Events' },
        { path: '/my-tickets', icon: Ticket, label: 'My Tickets' },
      ]
    }
  ];

  const adminItems = user?.is_organizer ? [
    { path: '/organizer/dashboard', icon: LayoutDashboard, label: 'Organizer Portal' }
  ] : [];

  const accountItems = [
    { path: '/profile', icon: User, label: 'Profile' }
  ];

  return (
    <nav className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col bg-white border-r border-neutral-200">
      {/* Brand Section */}
      <div className="h-16 flex items-center px-6 border-b border-neutral-100">
        <Link to="/home" className="flex items-center gap-2">
          <img src="/logo.png" alt="ZippyPay" className="w-30 h-30" />
        </Link>
      </div>

      {/* User Info Simplified */}
      <div className="px-6 py-4">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Account Holder</span>
          <span className="text-sm font-bold text-neutral-900 truncate">
            {user?.full_name || 'User Name'}
          </span>
        </div>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-3 pb-6 custom-scrollbar">
        {navSections.map((section) => (
          <div key={section.title} className="mb-4">
            <h3 className="px-3 py-2 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
              {section.title}
            </h3>
            <ul className="space-y-0.5">
              {section.items.map(({ path, icon: Icon, label }) => {
                const isActive = location.pathname === path;
                return (
                  <li key={path}>
                    <Link
                      to={path}
                      className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-semibold transition-colors duration-150 ${isActive
                        ? 'bg-[#e3984d] text-white shadow-sm'
                        : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50'
                        }`}
                    >
                      <Icon size={18} className={isActive ? 'text-white' : 'text-neutral-400'} />
                      <span>{label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}

        {adminItems.length > 0 && (
          <div className="mb-4">
            <h3 className="px-3 py-2 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Management</h3>
            <ul className="space-y-0.5">
              {adminItems.map(({ path, icon: Icon, label }) => (
                <li key={path}>
                  <Link to={path} className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-bold text-[#e3984d] bg-purple-50 hover:bg-purple-100 transition-colors">
                    <Icon size={18} />
                    <span>{label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mb-4">
          <h3 className="px-3 py-2 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Account</h3>
          <ul className="space-y-0.5">
            {accountItems.map(({ path, icon: Icon, label }) => {
              const isActive = location.pathname === path;
              return (
                <li key={path}>
                  <Link
                    to={path}
                    className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-semibold transition-colors duration-150 ${isActive
                      ? 'bg-[#e3984d] text-white shadow-sm'
                      : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50'
                      }`}
                  >
                    <Icon size={18} className={isActive ? 'text-white' : 'text-neutral-400'} />
                    <span>{label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* Logout */}
      <div className="border-t border-neutral-100 p-4">
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold text-neutral-500 hover:text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </div>
    </nav>
  );
};

export default Navigation;
