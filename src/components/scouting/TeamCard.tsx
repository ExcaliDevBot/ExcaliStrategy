import React from 'react';
import { Info, Edit, CheckCircle, XCircle } from 'lucide-react';

interface TeamCardProps {
  team: {
    teamNumber: number;
    teamName: string;
    robotName?: string;
    drivetrainType?: string;
    canClimb?: boolean;
    autoCapabilities?: string[];
    notes?: string;
    imageUrl?: string;
  };
}

const TeamCard: React.FC<TeamCardProps> = ({ team }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden transform transition-all hover:shadow-md hover:translate-y-[-2px]">
      {team.imageUrl && (
        <div className="h-48 overflow-hidden">
          <img 
            src={team.imageUrl} 
            alt={`Team ${team.teamNumber} robot`} 
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-lg font-semibold">Team {team.teamNumber}</h3>
            <p className="text-neutral-500">{team.teamName}</p>
          </div>
          <div className="flex space-x-2">
            <button className="p-2 rounded-full text-neutral-500 hover:bg-neutral-100">
              <Info size={16} />
            </button>
            <button className="p-2 rounded-full text-neutral-500 hover:bg-neutral-100">
              <Edit size={16} />
            </button>
          </div>
        </div>
        
        {team.robotName && (
          <div className="mb-3">
            <p className="text-sm text-neutral-500">Robot Name</p>
            <p className="font-medium">{team.robotName}</p>
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-3 mb-3">
          {team.drivetrainType && (
            <div>
              <p className="text-sm text-neutral-500">Drivetrain</p>
              <p className="font-medium">{team.drivetrainType}</p>
            </div>
          )}
          
          <div>
            <p className="text-sm text-neutral-500">Can Climb</p>
            <div className="flex items-center">
              {team.canClimb ? (
                <CheckCircle size={16} className="text-success mr-1" />
              ) : (
                <XCircle size={16} className="text-error mr-1" />
              )}
              <span>{team.canClimb ? 'Yes' : 'No'}</span>
            </div>
          </div>
        </div>
        
        {team.autoCapabilities && team.autoCapabilities.length > 0 && (
          <div className="mb-3">
            <p className="text-sm text-neutral-500 mb-1">Auto Capabilities</p>
            <div className="flex flex-wrap gap-1">
              {team.autoCapabilities.map((capability, index) => (
                <span 
                  key={index}
                  className="px-2 py-1 bg-primary-50 text-primary-700 text-xs rounded-md"
                >
                  {capability}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {team.notes && (
          <div>
            <p className="text-sm text-neutral-500 mb-1">Notes</p>
            <p className="text-sm text-neutral-700">{team.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamCard;