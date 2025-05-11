import React, { ReactNode } from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon?: ReactNode;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  changeType = 'neutral',
  icon,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 border border-neutral-100 transform transition-transform hover:translate-y-[-2px] hover:shadow-md">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-neutral-500 text-sm font-medium">{title}</p>
          <h3 className="text-2xl font-bold mt-2 text-neutral-900">{value}</h3>
          
          {change !== undefined && (
            <div className="flex items-center mt-1">
              {changeType === 'positive' ? (
                <ArrowUp size={16} className="text-success mr-1" />
              ) : changeType === 'negative' ? (
                <ArrowDown size={16} className="text-error mr-1" />
              ) : null}
              
              <span 
                className={`text-sm font-medium ${
                  changeType === 'positive' 
                    ? 'text-success' 
                    : changeType === 'negative' 
                    ? 'text-error' 
                    : 'text-neutral-500'
                }`}
              >
                {change}
              </span>
            </div>
          )}
        </div>
        
        {icon && (
          <div className="p-2 rounded-full bg-neutral-100">{icon}</div>
        )}
      </div>
    </div>
  );
};

export default MetricCard;