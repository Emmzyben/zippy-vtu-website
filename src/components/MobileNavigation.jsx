import { Link, useLocation } from 'react-router-dom';
import { Home, Smartphone, Wifi, Receipt, Wallet,User } from 'lucide-react';

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
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 z-50">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'text-primary'
                  : 'text-neutral-500 hover:text-primary'
              }`}
            >
              <IconComponent size={20} />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileNavigation;