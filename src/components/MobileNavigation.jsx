import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home, Globe, Wallet, Plus, Menu, X,
  Smartphone, Wifi, Receipt, History, User, LogOut,
  Ticket, Plane, LayoutDashboard, ChevronRight, Settings
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const MobileNavigation = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [activeMenu, setActiveMenu] = useState(null); // 'payments', 'explore', 'menu'

  const navItems = [
    { path: '/home', icon: Home, label: 'Home' },
    { id: 'explore', icon: Globe, label: 'Explore', action: () => setActiveMenu('explore') },
    { path: '/wallet', icon: Wallet, label: 'Wallet' },
    { id: 'payments', icon: Plus, label: 'Pay', action: () => setActiveMenu('payments'), isAction: true },
    { id: 'menu', icon: Menu, label: 'Menu', action: () => setActiveMenu('menu') }
  ];

  const MenuOverlay = ({ isOpen, onClose, title, children }) => (
    <div
      className={`fixed inset-0 z-[60] flex flex-col justify-end transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
    >
      <div className="absolute inset-0 bg-[#e3984d]/40" onClick={onClose} />
      <div
        className={`relative bg-white rounded-t-2xl shadow-2xl transition-transform duration-300 transform ${isOpen ? 'translate-y-0' : 'translate-y-full'
          } max-h-[85vh] overflow-hidden flex flex-col`}
      >
        <div className="h-1 w-10 bg-neutral-200 rounded-full mx-auto mt-3 mb-1" />
        <div className="px-5 py-4 flex items-center justify-between border-b border-neutral-100">
          <h3 className="text-sm font-bold text-neutral-900 tracking-tight">{title}</h3>
          <button onClick={onClose} className="p-1.5 hover:bg-neutral-50 rounded-full transition-colors">
            <X size={18} className="text-white" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar pb-10">
          {children}
        </div>
      </div>
    </div>
  );

  const ActionGrid = ({ items, onClose }) => (
    <div className="grid grid-cols-3 gap-2">
      {items.map((item, i) => (
        <Link
          key={i}
          to={item.path}
          onClick={onClose}
          className="flex flex-col items-center gap-2 p-3 rounded-lg border border-neutral-100 bg-neutral-50 hover:bg-neutral-100 transition-colors group"
        >
          <div className="p-2 rounded-md bg-white shadow-sm transition-colors group-hover:bg-[#e3984d] group-hover:text-white">
            <item.icon size={20} className={item.color || 'text-[#e3984d]'} />
          </div>
          <span className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest text-center">{item.label}</span>
        </Link>
      ))}
    </div>
  );

  return (
    <>
      <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-sm">
        <div className="bg-[#e3984d] shadow-xl rounded-xl p-1.5 flex items-center justify-between border border-neutral-800">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || activeMenu === item.id;
            const Icon = item.icon;

            return (
              <button
                key={item.label}
                onClick={item.action || (() => { setActiveMenu(null); })}
                className="flex-1"
              >
                {item.path ? (
                  <Link
                    to={item.path}
                    onClick={() => setActiveMenu(null)}
                    className={`flex flex-col items-center gap-1 py-1.5 rounded-lg transition-colors ${isActive ? 'text-white' : 'text-neutral-500'
                      }`}
                  >
                    <Icon size={18} className={isActive ? 'text-white' : 'text-white'} />
                    <span className="text-[9px] font-bold uppercase tracking-widest leading-none mt-1">{item.label}</span>
                  </Link>
                ) : (
                  <div className={`flex flex-col items-center gap-1 py-1.5 rounded-lg transition-colors ${isActive ? 'text-white' : 'text-neutral-500'
                    }`}>
                    {item.isAction ? (
                      <div className="w-9 h-9 bg-[#e3984d] rounded-lg flex items-center justify-center -mt-6 shadow-lg border border-purple-400/20">
                        <Plus size={20} className="text-white" />
                      </div>
                    ) : (
                      <Icon size={18} className={isActive ? 'text-white' : 'text-white'} />
                    )}
                    <span className={`text-[9px] font-bold uppercase tracking-widest leading-none mt-1 ${item.isAction ? 'text-[#fff]' : ''}`}>
                      {item.label}
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Overlays */}
      <MenuOverlay isOpen={activeMenu === 'explore'} onClose={() => setActiveMenu(null)} title="Discovery">
        <ActionGrid
          onClose={() => setActiveMenu(null)}
          items={[
            { path: '/app/explore-events', icon: Globe, label: 'All Events', color: 'text-[#622186]' },
            { path: '/my-tickets', icon: Ticket, label: 'My Tickets', color: 'text-amber-500' },
          ]}
        />
      </MenuOverlay>

      <MenuOverlay isOpen={activeMenu === 'payments'} onClose={() => setActiveMenu(null)} title="Payments & Services">
        <ActionGrid
          onClose={() => setActiveMenu(null)}
          items={[
            { path: '/airtime', icon: Smartphone, label: 'Airtime', color: 'text-red-500' },
            { path: '/data', icon: Wifi, label: 'Data', color: 'text-blue-500' },
            { path: '/bills', icon: Receipt, label: 'Bills', color: 'text-green-500' },
            { path: '/transactions', icon: History, label: 'History', color: 'text-white' },
            { path: '/flights', icon: Plane, label: 'Flights', color: 'text-purple-500' },
          ]}
        />
      </MenuOverlay>

      <MenuOverlay isOpen={activeMenu === 'menu'} onClose={() => setActiveMenu(null)} title="Account Menu">
        <div className="space-y-4">
          <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-[#e3984d] rounded-lg flex items-center justify-center text-white font-bold text-sm">
                {user?.full_name?.charAt(0) || 'U'}
              </div>
              <div>
                <h4 className="text-sm font-bold text-neutral-900 leading-tight">{user?.full_name || 'User'}</h4>
                <p className="text-[10px] text-neutral-500">{user?.phone || user?.email}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-2">
              <Link to="/profile" onClick={() => setActiveMenu(null)} className="flex items-center justify-center gap-2 bg-white border border-neutral-200 py-2 rounded-md text-[10px] font-bold text-neutral-700">
                <User size={12} /> Profile
              </Link>

            </div>
          </div>

          <div>
            <h4 className="text-[9px] font-bold text-white uppercase tracking-widest mb-2 px-1">Management</h4>
            {user?.is_organizer ? (
              <Link to="/organizer/dashboard" onClick={() => setActiveMenu(null)} className="flex items-center justify-between p-3.5 bg-amber-50 rounded-xl border border-amber-100 group">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-100 text-amber-700 rounded-md group-hover:bg-amber-700 group-hover:text-white transition-colors">
                    <LayoutDashboard size={18} />
                  </div>
                  <span className="text-xs font-bold text-amber-900">Organizer Portal</span>
                </div>
                <ChevronRight size={16} className="text-amber-400" />
              </Link>
            ) : (
              <Link to="/organizer/enroll" onClick={() => setActiveMenu(null)} className="flex items-center justify-between p-3.5 bg-purple-50 rounded-xl border border-purple-100 group">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 text-[#e3984d] rounded-md group-hover:bg-[#e3984d] group-hover:text-white transition-colors">
                    <Plus size={18} />
                  </div>
                  <span className="text-xs font-bold text-[#e3984d]">Become an Organizer</span>
                </div>
                <ChevronRight size={16} className="text-purple-400" />
              </Link>
            )}
          </div>

          <button
            onClick={() => { setActiveMenu(null); logout(); }}
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-red-50 text-red-600 rounded-xl border border-red-100 text-[10px] font-bold uppercase tracking-widest transition-colors"
          >
            <LogOut size={14} /> Sign Out Safely
          </button>
        </div>
      </MenuOverlay>
    </>
  );
};

export default MobileNavigation;
