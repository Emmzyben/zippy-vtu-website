import { Link } from 'react-router-dom';
import { Smartphone, Wifi, Receipt, Plane } from 'lucide-react';

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
      icon: Plane,
      label: 'Book Flight',
      path: '/flights',
      iconColor: 'text-purple-500',
      comingSoon: true
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
      {actions.map((action) => {
        const IconComponent = action.icon;
        const isComingSoon = action.comingSoon;

        const Content = (
          <div className="flex flex-col items-center gap-3 relative">
            <div className="p-3 rounded-full bg-neutral-100 border border-gray-200">
              <IconComponent size={24} className={`${action.iconColor}`} />
            </div>
            <span className="font-medium text-sm text-center">{action.label}</span>
            {isComingSoon && (
              <span className="absolute -top-2 -right-2 bg-purple-100 text-purple-700 text-[10px] px-2 py-0.5 rounded-full font-bold border border-purple-200">
                Coming Soon
              </span>
            )}
          </div>
        );

        if (isComingSoon) {
          return (
            <div
              key={action.path}
              className="bg-white/50 cursor-not-allowed text-neutral-400 p-6 rounded-xl border border-gray-100 shadow-sm opacity-70"
            >
              {Content}
            </div>
          );
        }

        return (
          <Link
            key={action.path}
            to={action.path}
            className="bg-white hover:bg-neutral-50 text-neutral-800 p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.03]"
          >
            {Content}
          </Link>
        );
      })}
    </div>
  );
};

export default QuickActions;
