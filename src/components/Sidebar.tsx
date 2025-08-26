import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Clipboard, 
  Wrench, 
  BarChart2, 
  Users, 
  Flag, 
  Settings as SettingsIcon,
  X,
  Scale
} from 'lucide-react';
import Logo from './Logo';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const navItems = [
    { path: '/', icon: <Home size={20} />, label: 'Dashboard' },
    { path: '/match-scouting', icon: <Clipboard size={20} />, label: 'Match Scouting' },
    { path: '/pit-scouting', icon: <Wrench size={20} />, label: 'Pit Scouting' },
    { path: '/team-analysis', icon: <BarChart2 size={20} />, label: 'Team Analysis' },
    { path: '/alliance-selection', icon: <Users size={20} />, label: 'Alliance Selection' },
    { path: '/alliance-comparator', icon: <Scale size={20} />, label: 'Alliance Comparator' },
    { path: '/match-strategy', icon: <Flag size={20} />, label: 'Match Strategy' },
    { path: '/settings', icon: <SettingsIcon size={20} />, label: 'Settings' },
  ];

  return (
    <>
      <aside 
        className={`fixed lg:relative inset-y-0 left-0 z-50 w-64 bg-primary-500 text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-primary-400">
          <Logo />
          <button 
            onClick={toggleSidebar} 
            className="p-1 rounded-md text-white hover:bg-primary-400 lg:hidden"
          >
            <X size={20} />
          </button>
        </div>
        <nav className="mt-5 px-2">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-3 rounded-md transition-colors ${
                      isActive 
                        ? 'bg-secondary-500 text-primary-900 font-medium' 
                        : 'text-white hover:bg-primary-400'
                    }`
                  }
                  end={item.path === '/'}
                  onClick={() => {
                    if (window.innerWidth < 1024) {
                      toggleSidebar();
                    }
                  }}
                >
                  {item.icon}
                  <span className="ml-3">{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      
      {/* Backdrop for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
};

export default Sidebar;