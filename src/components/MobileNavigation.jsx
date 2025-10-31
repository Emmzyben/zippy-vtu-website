import { Link, useLocation } from 'react-router-dom';
import { Home, Smartphone, Wifi, Receipt, Wallet, User } from 'lucide-react';

const MobileNavigation = () => {
  const location = useLocation();

  const navItems = [
    { path: '/home', icon: Home, label: 'Home' },
    { path: '/airtime', icon: Smartphone, label: 'Airtime' },
    { path: '/data', icon: Wifi, label: 'Data' },
    { path: '/bills', icon: Receipt, label: 'Bills' },
    { path: '/wallet', icon: Wallet, label: 'Wallet' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg backdrop-blur-sm z-50">
      <div className="flex justify-around items-center h-16">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path;

          return (
            <Link
              key={path}
              to={path}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'text-[#5C2D91]'
                  : 'text-gray-500 hover:text-[#5C2D91]'
              }`}
            >
              <div
                className={`p-2 rounded-full transition-all duration-200 ${
                  isActive ? 'bg-[#5C2D91]/10 scale-110' : ''
                }`}
              >
                <Icon size={20} />
              </div>
              <span
                className={`text-xs font-medium ${
                  isActive ? 'text-[#5C2D91]' : 'text-gray-500'
                }`}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileNavigation;
