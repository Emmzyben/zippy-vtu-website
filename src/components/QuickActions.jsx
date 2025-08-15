import { Link } from 'react-router-dom';
import { Smartphone, Wifi, Receipt, Users } from 'lucide-react';

const QuickActions = () => {
  const actions = [
    {
      icon: Smartphone,
      label: 'Buy Airtime',
      path: '/airtime',
      hoverColor: 'hover:bg-[#5C2D91]',
      iconColor: 'text-red-400'
    },
    {
      icon: Wifi,
      label: 'Buy Data',
      path: '/data',
      hoverColor: 'hover:bg-[#5C2D91]',
      iconColor: 'text-green-400'
    },
    {
      icon: Receipt,
      label: 'Pay Bills',
      path: '/bills',
      hoverColor: 'hover:bg-[#5C2D91]',
      iconColor: 'text-blue-500'
    },
    {
      icon: Users,
      label: 'Referrals',
      path: '/referral',
      hoverColor: 'hover:bg-[#5C2D91]',
      iconColor: 'text-yellow-600'
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
            className={` ${action.hoverColor} hover:text-[#F59E0B] text-dark p-6 rounded-xl shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl border border-gray-300`}
          >
            <div className="flex flex-col items-center gap-3">
              <div className="p-3 bg-white bg-opacity-20 rounded-full border border-gray-200">
                <IconComponent size={24} className={`${action.iconColor}`}/>
              </div>
              <span className="font-medium text-center">{action.label}</span>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default QuickActions;