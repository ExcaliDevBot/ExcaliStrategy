import React from 'react';
import { Star, BarChart2, PlusCircle } from 'lucide-react';

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
  showAddButton = false,
}) => {
  const renderStars = () => {
    if (team.recommendation === 'high') return 3;
    if (team.recommendation === 'medium') return 2;
    return 1;
  };

  return (
    <div
      className={`rounded-md border transition-colors text-[11px] ${
        selected
          ? 'border-secondary-500 bg-secondary-50 shadow-sm'
          : 'border-neutral-200 bg-white hover:border-neutral-300'
      }`}
    >
      <div className="px-3 py-2 space-y-1.5">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-sm">{team.teamNumber}</span>
              <span className="text-[10px] uppercase tracking-wide text-neutral-400">team</span>
              <div className="flex items-center ml-1 text-secondary-500">
                {Array.from({ length: renderStars() }).map((_, i) => (
                  <Star
                    key={i}
                    size={11}
                    className="fill-secondary-500 text-secondary-500"
                  />
                ))}
              </div>
            </div>
            <p className="text-[10px] text-neutral-500 truncate max-w-[160px]">
              {team.teamName}
            </p>
          </div>

          {showAddButton && onAddTeam && (
            <button
              onClick={() => onAddTeam(team.teamNumber)}
              className="inline-flex items-center rounded-full border border-neutral-200 px-2 py-0.5 text-[10px] text-neutral-700 hover:bg-neutral-50 whitespace-nowrap"
            >
              <PlusCircle size={12} className="mr-1" />
              Add
            </button>
          )}
        </div>

        {/* Ratings + stats in one compact row */}
        <div className="flex items-center justify-between gap-2 mt-1">
          <div className="flex items-center gap-1.5 text-neutral-600">
            <span className="text-[10px] uppercase tracking-wide text-neutral-400">
              OVR
            </span>
            <span className="font-semibold text-sm">{team.overallRating}</span>
            <span className="h-3 w-px bg-neutral-200" />
            <BarChart2 size={12} className="text-secondary-500" />
            <span className="text-[10px] uppercase tracking-wide text-neutral-400">
              Fit
            </span>
            <span className="font-semibold text-xs">{team.compatibilityScore}</span>
          </div>

          {team.stats && (
            <div className="flex items-center gap-1 text-neutral-500">
              <span className="px-1.5 py-0.5 rounded-full bg-neutral-50 border border-neutral-200 text-[10px]">
                Avg {team.stats.avgScore.toFixed ? team.stats.avgScore.toFixed(1) : team.stats.avgScore}
              </span>
            </div>
          )}
        </div>

        {/* Tags row, truncated */}
        <div className="flex flex-wrap gap-1 mt-1">
          {team.strengthsMatch.slice(0, 2).map((strength, index) => (
            <span
              key={`s-${index}`}
              className="px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] border border-emerald-100 max-w-[120px] truncate"
              title={strength}
            >
              {strength}
            </span>
          ))}
          {team.weaknessesComplement.slice(0, 1).map((weakness, index) => (
            <span
              key={`w-${index}`}
              className="px-1.5 py-0.5 rounded-full bg-neutral-50 text-neutral-500 text-[10px] border border-neutral-200 max-w-[120px] truncate"
              title={weakness}
            >
              {weakness}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllianceTeamCard;