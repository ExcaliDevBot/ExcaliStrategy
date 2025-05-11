import React from 'react';
import { Star, BarChart2, PlusCircle, Shield } from 'lucide-react';

interface AllianceTeamCardProps {
  team: {
    teamNumber: number;
    teamName: string;
    overallRating: number;
    compatibilityScore: number;
    strengthsMatch: string[];
    weaknessesComplement: string[];
    recommendation: 'high' | 'medium' | 'low';
    stats?: {
      avgScore: number;
      autoAvg: number;
      teleopAvg: number;
      endgameAvg: number;
    };
  };
  onAddTeam?: (teamNumber: number) => void;
  selected?: boolean;
  showAddButton?: boolean;
}

const AllianceTeamCard: React.FC<AllianceTeamCardProps> = ({ 
  team, 
  onAddTeam, 
  selected = false,
  showAddButton = false
}) => {
  return (
    <div 
      className={`border rounded-lg overflow-hidden transition-all ${
        selected 
          ? 'border-secondary-500 bg-secondary-50' 
          : 'border-neutral-200 bg-white hover:shadow-md'
      }`}
    >
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <div className="flex items-center">
              <h3 className="text-lg font-semibold">Team {team.teamNumber}</h3>
              {team.recommendation === 'high' && (
                <div className="ml-2 flex items-center text-secondary-600">
                  <Star size={16} className="fill-secondary-500 text-secondary-500" />
                  <Star size={16} className="fill-secondary-500 text-secondary-500" />
                  <Star size={16} className="fill-secondary-500 text-secondary-500" />
                </div>
              )}
              {team.recommendation === 'medium' && (
                <div className="ml-2 flex items-center text-secondary-600">
                  <Star size={16} className="fill-secondary-500 text-secondary-500" />
                  <Star size={16} className="fill-secondary-500 text-secondary-500" />
                  <Star size={16} className="text-secondary-300" />
                </div>
              )}
              {team.recommendation === 'low' && (
                <div className="ml-2 flex items-center text-secondary-600">
                  <Star size={16} className="fill-secondary-500 text-secondary-500" />
                  <Star size={16} className="text-secondary-300" />
                  <Star size={16} className="text-secondary-300" />
                </div>
              )}
            </div>
            <p className="text-neutral-500">{team.teamName}</p>
          </div>
          
          {showAddButton && onAddTeam && (
            <button 
              onClick={() => onAddTeam(team.teamNumber)}
              className="p-2 rounded-full bg-primary-50 text-primary-500 hover:bg-primary-100"
            >
              <PlusCircle size={20} />
            </button>
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-neutral-500 mb-1">Overall Rating</p>
            <div className="flex items-center">
              <Shield size={16} className="text-primary-500 mr-1" />
              <span className="font-semibold">{team.overallRating}/100</span>
            </div>
          </div>
          <div>
            <p className="text-sm text-neutral-500 mb-1">Compatibility</p>
            <div className="flex items-center">
              <BarChart2 size={16} className="text-secondary-500 mr-1" />
              <span className="font-semibold">{team.compatibilityScore}/100</span>
            </div>
          </div>
        </div>
        
        {team.stats && (
          <div className="grid grid-cols-4 gap-2 mb-4 bg-neutral-50 p-2 rounded-md">
            <div className="text-center p-1">
              <p className="text-xs text-neutral-500">Avg Score</p>
              <p className="font-semibold text-sm">{team.stats.avgScore}</p>
            </div>
            <div className="text-center p-1">
              <p className="text-xs text-neutral-500">Auto</p>
              <p className="font-semibold text-sm">{team.stats.autoAvg}</p>
            </div>
            <div className="text-center p-1">
              <p className="text-xs text-neutral-500">Teleop</p>
              <p className="font-semibold text-sm">{team.stats.teleopAvg}</p>
            </div>
            <div className="text-center p-1">
              <p className="text-xs text-neutral-500">Endgame</p>
              <p className="font-semibold text-sm">{team.stats.endgameAvg}</p>
            </div>
          </div>
        )}
        
        <div>
          <p className="text-sm text-neutral-500 mb-1">Complementary Strengths</p>
          <div className="flex flex-wrap gap-1 mb-3">
            {team.strengthsMatch.map((strength, index) => (
              <span 
                key={index}
                className="px-2 py-1 bg-primary-50 text-primary-700 text-xs rounded-md"
              >
                {strength}
              </span>
            ))}
          </div>
          
          <p className="text-sm text-neutral-500 mb-1">Covers Weaknesses</p>
          <div className="flex flex-wrap gap-1">
            {team.weaknessesComplement.map((weakness, index) => (
              <span 
                key={index}
                className="px-2 py-1 bg-secondary-50 text-secondary-700 text-xs rounded-md"
              >
                {weakness}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllianceTeamCard;