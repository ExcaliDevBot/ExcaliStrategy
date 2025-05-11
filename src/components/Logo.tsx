import React from 'react';
import { Shield } from 'lucide-react';

const Logo: React.FC = () => {
  return (
    <div className="flex items-center">
      <Shield className="text-secondary-500" size={24} />
      <span className="ml-2 font-bold text-lg">EXCALIBUR • 6738</span>
    </div>
  );
};

export default Logo;