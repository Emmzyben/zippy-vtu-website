import { Link } from 'react-router-dom';
import { Smartphone, Wifi, Receipt, Plane, Ticket, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const QuickActions = () => {
  const { user } = useAuth();

  const actions = [
    {
      icon: Smartphone,
      label: 'Airtime',
      path: '/airtime',
      color: 'text-red-500'
    },
    {
      icon: Wifi,
      label: 'Data',
      path: '/data',
      color: 'text-blue-500'
    },
    {
      icon: Receipt,
      label: 'Bills',
      path: '/bills',
      color: 'text-green-500'
    },
    {
      icon: Plane,
      label: 'Flights',
      path: '/flights',
      color: 'text-purple-600'
    },
    {
      icon: Ticket,
      label: 'Events',
      path: '/app/explore-events',
      color: 'text-amber-500'
    },

    {
      icon: LayoutDashboard,
      label: 'Events Dashboard',
      path: '/organizer/dashboard',
      color: 'text-purple-900',
      hidden: !user?.is_organizer
    }
  ];

  return (
    <div className="grid grid-cols-3 gap-2">
      {actions.filter(a => !a.hidden).map((action) => {
        const Icon = action.icon;

        return (
          <Link
            key={action.path}
            to={action.path}
            className="flex flex-col items-center gap-2 p-4 bg-white border border-neutral-100 rounded-lg hover:border-neutral-200 hover:bg-neutral-50 transition-colors shadow-sm group"
          >
            <div className="p-2 rounded-md bg-neutral-50 group-hover:bg-[#e3984d] group-hover:text-white transition-colors">
              <Icon size={20} className={action.color} />
            </div>
            <span className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest text-center whitespace-nowrap">
              {action.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
};

export default QuickActions;
