import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface TeamStatsTableProps {
  teamNumber: number;
}

const TeamStatsTable: React.FC<TeamStatsTableProps> = ({ teamNumber }) => {
  // This would typically come from Firebase
  const stats = {
    avgAutoScore: 8.5,
    avgTeleopScore: 32.1,
    avgEndgameScore: 12.5,
    avgTotalScore: 53.1,
    consistencyRating: 8.2,
    defenseRating: 6.5,
    climbSuccessRate: 85,
    matchesPlayed: 12,
    opr: 45.2,
    dpr: 22.8,
    ccwm: 22.4,
    trend: 'upward',
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Team {teamNumber} Performance Stats</h3>
        <div className="flex items-center text-sm">
          <span className="text-neutral-500 mr-2">Performance Trend:</span>
          {stats.trend === 'upward' ? (
            <div className="flex items-center text-success">
              <TrendingUp size={16} className="mr-1" />
              <span>Improving</span>
            </div>
          ) : (
            <div className="flex items-center text-error">
              <TrendingDown size={16} className="mr-1" />
              <span>Declining</span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-3 bg-neutral-50 rounded-lg">
          <div className="text-sm text-neutral-500">Average Auto Score</div>
          <div className="text-xl font-semibold">{stats.avgAutoScore}</div>
        </div>
        <div className="p-3 bg-neutral-50 rounded-lg">
          <div className="text-sm text-neutral-500">Average Teleop Score</div>
          <div className="text-xl font-semibold">{stats.avgTeleopScore}</div>
        </div>
        <div className="p-3 bg-neutral-50 rounded-lg">
          <div className="text-sm text-neutral-500">Average Endgame Score</div>
          <div className="text-xl font-semibold">{stats.avgEndgameScore}</div>
        </div>
        <div className="p-3 bg-neutral-50 rounded-lg">
          <div className="text-sm text-neutral-500">Average Total Score</div>
          <div className="text-xl font-semibold">{stats.avgTotalScore}</div>
        </div>
        <div className="p-3 bg-neutral-50 rounded-lg">
          <div className="text-sm text-neutral-500">Climb Success Rate</div>
          <div className="text-xl font-semibold">{stats.climbSuccessRate}%</div>
        </div>
        <div className="p-3 bg-neutral-50 rounded-lg">
          <div className="text-sm text-neutral-500">Consistency Rating</div>
          <div className="text-xl font-semibold">{stats.consistencyRating}/10</div>
        </div>
        <div className="p-3 bg-neutral-50 rounded-lg">
          <div className="text-sm text-neutral-500">Defense Rating</div>
          <div className="text-xl font-semibold">{stats.defenseRating}/10</div>
        </div>
        <div className="p-3 bg-neutral-50 rounded-lg">
          <div className="text-sm text-neutral-500">Matches Played</div>
          <div className="text-xl font-semibold">{stats.matchesPlayed}</div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-4">
        <div className="p-3 bg-primary-50 rounded-lg border border-primary-100">
          <div className="text-sm text-primary-700">OPR (Offensive Power Rating)</div>
          <div className="text-xl font-semibold text-primary-800">{stats.opr}</div>
        </div>
        <div className="p-3 bg-secondary-50 rounded-lg border border-secondary-100">
          <div className="text-sm text-secondary-700">DPR (Defensive Power Rating)</div>
          <div className="text-xl font-semibold text-secondary-800">{stats.dpr}</div>
        </div>
        <div className="p-3 bg-neutral-100 rounded-lg border border-neutral-200">
          <div className="text-sm text-neutral-700">CCWM</div>
          <div className="text-xl font-semibold text-neutral-800">{stats.ccwm}</div>
          <div className="text-xs text-neutral-500">(Contribution to Win Margin)</div>
        </div>
      </div>
    </div>
  );
};

export default TeamStatsTable;