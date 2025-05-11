import React from 'react';
import { Menu, Bell } from 'lucide-react';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  return (
    <header className="bg-white border-b border-neutral-200 py-3 px-4 flex items-center justify-between">
      <div className="flex items-center">
        <button 
          onClick={toggleSidebar}
          className="p-2 rounded-md text-neutral-500 hover:bg-neutral-100 lg:hidden"
        >
          <Menu size={20} />
        </button>
        <h1 className="text-lg font-semibold text-primary-500 ml-2 md:ml-0">
          FRC Strategy System
        </h1>
      </div>
      <div className="flex items-center space-x-3">
        <button className="p-2 rounded-full text-neutral-500 hover:bg-neutral-100">
          <Bell size={20} />
        </button>
        <div className="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center text-white">
          <span className="text-sm font-medium">TS</span>
        </div>
      </div>
    </header>
  );
};

export default Header;