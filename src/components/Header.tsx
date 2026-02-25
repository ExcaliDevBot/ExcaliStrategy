import React from 'react';
import { Menu } from 'lucide-react';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  return (
    <header className="bg-white border-b border-neutral-200 py-2 px-4 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md text-neutral-500 hover:bg-neutral-100 lg:hidden"
        >
          <Menu size={18} />
        </button>
        <span className="text-base font-semibold text-neutral-800 tracking-tight">
          Strategy
        </span>
      </div>
    </header>
  );
};

export default Header;