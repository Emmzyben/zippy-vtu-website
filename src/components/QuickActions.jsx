import { Link } from 'react-router-dom';
import { Smartphone, Wifi, Receipt, Users } from 'lucide-react';

const QuickActions = () => {
  const actions = [
    {
      icon: Smartphone,
      label: 'Buy Airtime',
      path: '/airtime',
      iconColor: 'text-red-500'
    },
    {
      icon: Wifi,
      label: 'Buy Data',
      path: '/data',
      iconColor: 'text-green-500'
    },
    {
      icon: Receipt,
      label: 'Pay Bills',
      path: '/bills',
      iconColor: 'text-blue-500'
    },
    {
      icon: Users,
      label: 'Referrals',
      path: '/referral',
      iconColor: 'text-yellow-500'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {actions.map((action) => {
        const IconComponent = action.icon;
        
        return (
          <Link
            key={action.path}
            to={action.path}
            className="bg-white hover:bg-neutral-50 text-neutral-800 p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.03]"
          >
            <div className="flex flex-col items-center gap-3">
              <div className="p-3 rounded-full bg-neutral-100 border border-gray-200">
                <IconComponent size={24} className={`${action.iconColor}`} />
              </div>
              <span className="font-medium text-sm text-center">{action.label}</span>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default QuickActions;
