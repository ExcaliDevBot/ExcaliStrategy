import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, ArrowRightFromLine } from 'lucide-react';
import { teamDataService, TeamPerformanceData } from '../../services/teamDataService';
import { getStatboticsTeamPerformance, TeamPerformanceDataLike } from '../../services/statboticsService';

interface TeamStatsTableProps {
  teamNumber: number;
  dataSource?: 'scouting' | 'statbotics';
  eventKey?: string;
}

type UnifiedTeamData = TeamPerformanceData | TeamPerformanceDataLike;

const TeamStatsTable: React.FC<TeamStatsTableProps> = ({ teamNumber, dataSource='scouting', eventKey='2025iscmp' }) => {
  const [teamData, setTeamData] = useState<UnifiedTeamData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setError(null);
        setLoading(true);
        if (dataSource === 'statbotics') {
          const statData = await getStatboticsTeamPerformance(teamNumber, eventKey);
            setTeamData(statData);
        } else {
          const data = await teamDataService.getTeamStats(teamNumber);
          setTeamData(data);
        }
      } catch (error) {
        console.error('Error fetching team stats:', error);
        setError('Failed to load team data');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [teamNumber, dataSource, eventKey]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-neutral-500">Loading team data...</div>
      </div>
    );
  }

  if (!teamData) {
    return (
      <div className="text-center py-8">
        <div className="text-neutral-500">{error || `No stats available for Team ${teamNumber}.`}</div>
      </div>
    );
  }

  const { stats, calculatedMetrics } = teamData as UnifiedTeamData['stats'] extends infer S
    ? { stats: (UnifiedTeamData['stats']); calculatedMetrics: UnifiedTeamData['calculatedMetrics'] }
    : never;
  const usingStatbotics = dataSource === 'statbotics';

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Team {teamNumber} Performance Stats</h3>
        <div className="flex items-center gap-3 text-xs text-neutral-500">
          <span className="px-2 py-0.5 rounded-full border bg-neutral-50">Source: {usingStatbotics ? 'Statbotics' : 'Scouting DB'}</span>
        </div>
        <div className="flex items-center text-sm">
          <span className="text-neutral-500 mr-2">Performance Trend:</span>
          {stats.performanceTrend === 'upward' ? (
            <div className="flex items-center text-success">
              <TrendingUp size={16} className="mr-1" />
              <span>Improving</span>
            </div>
          ) : stats.performanceTrend === 'stable' ? (
            <div className="flex items-center text-warning">
              <ArrowRightFromLine size={16} className="mr-1" />
              <span>Stable</span>
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
          <div className="text-xl font-semibold">{calculatedMetrics.avgAutoScore}</div>
        </div>
        <div className="p-3 bg-neutral-50 rounded-lg">
          <div className="text-sm text-neutral-500">Average Teleop Score</div>
          <div className="text-xl font-semibold">{calculatedMetrics.avgTeleopScore}</div>
        </div>
        <div className="p-3 bg-neutral-50 rounded-lg">
          <div className="text-sm text-neutral-500">Average Endgame Score</div>
          <div className="text-xl font-semibold">{calculatedMetrics.avgEndgameScore}</div>
        </div>
        <div className="p-3 bg-neutral-50 rounded-lg">
          <div className="text-sm text-neutral-500">Average Total Score</div>
          <div className="text-xl font-semibold">{calculatedMetrics.avgTotalScore}</div>
        </div>
        <div className="p-3 bg-neutral-50 rounded-lg">
          <div className="text-sm text-neutral-500">Climb Success Rate</div>
          <div className="text-xl font-semibold">{calculatedMetrics.climbSuccessRate}%</div>
        </div>
        <div className="p-3 bg-neutral-50 rounded-lg">
          <div className="text-sm text-neutral-500">Consistency Rating</div>
          <div className="text-xl font-semibold">{calculatedMetrics.consistencyRating}/10</div>
        </div>
        <div className="p-3 bg-neutral-50 rounded-lg">
          <div className="text-sm text-neutral-500">Defense Rating</div>
          <div className="text-xl font-semibold">{usingStatbotics ? 'N/A' : calculatedMetrics.defenseCapability}</div>
        </div>
        <div className="p-3 bg-neutral-50 rounded-lg">
          <div className="text-sm text-neutral-500">Matches Played</div>
          <div className="text-xl font-semibold">{stats.matchesPlayed}</div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-4">
        <div className="p-3 bg-primary-50 rounded-lg border border-primary-100">
          <div className="text-sm text-primary-700">OPR</div>
          <div className="text-xl font-semibold text-primary-800">{stats.opr?.toFixed ? stats.opr.toFixed(3) : stats.opr}</div>
        </div>
        <div className="p-3 bg-secondary-50 rounded-lg border border-secondary-100">
          <div className="text-sm text-secondary-700">DPR</div>
          <div className="text-xl font-semibold text-secondary-800">{stats.dpr?.toFixed ? stats.dpr.toFixed(3) : stats.dpr}</div>
        </div>
        <div className="p-3 bg-neutral-100 rounded-lg border border-neutral-200">
          <div className="text-sm text-neutral-700">CCWM</div>
          <div className="text-xl font-semibold text-neutral-800">{stats.ccwm}</div>
          <div className="text-xs text-neutral-500">Contribution to Win Margin</div>
        </div>
      </div>

      {/* Detailed Performance Breakdown */}
      {!usingStatbotics && (
      <div className="mt-6 bg-neutral-50 p-4 rounded-lg border border-neutral-200">
        <h4 className="font-semibold mb-3">Detailed Performance Breakdown</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <div className="text-neutral-500">Auto L4 Avg</div>
            <div className="font-medium">{stats.autoL4.toFixed(1)}</div>
          </div>
          <div>
            <div className="text-neutral-500">Auto L3 Avg</div>
            <div className="font-medium">{stats.autoL3.toFixed(1)}</div>
          </div>
          <div>
            <div className="text-neutral-500">Auto L2 Avg</div>
            <div className="font-medium">{stats.autoL2.toFixed(1)}</div>
          </div>
          <div>
            <div className="text-neutral-500">Auto L1 Avg</div>
            <div className="font-medium">{stats.autoL1.toFixed(1)}</div>
          </div>
          <div>
            <div className="text-neutral-500">Net Score Avg</div>
            <div className="font-medium">{stats.netScore.toFixed(1)}</div>
          </div>
          <div>
            <div className="text-neutral-500">Processor Score Avg</div>
            <div className="font-medium">{stats.processorScore.toFixed(1)}</div>
          </div>
          <div>
            <div className="text-neutral-500">Climb Rate</div>
            <div className="font-medium">{stats.climbRate.toFixed(1)}%</div>
          </div>
          <div>
            <div className="text-neutral-500">Consistency Rate</div>
            <div className="font-medium">{stats.consistencyRate.toFixed(1)}</div>
          </div>
        </div>
      </div>
      )}
      {usingStatbotics && (
        <div className="mt-6 text-xs text-neutral-500 italic">Detailed element-level breakdown not available from Statbotics API and is hidden.</div>
      )}
    </div>
  );
};

export default TeamStatsTable;