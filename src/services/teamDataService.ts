import { getDatabase, ref, get } from 'firebase/database';

export interface TeamStats {
  performanceTrend: 'upward' | 'stable' | 'downward';
  autoL4: number;
  autoL3: number;
  autoL2: number;
  autoL1: number;
  netScore: number;
  processorScore: number;
  climbRate: number;
  consistencyRate: number;
  defenseRating: number;
  matchesPlayed: number;
  opr: number;
  dpr: number;
  ccwm: number;
}

export interface TeamPerformanceData {
  teamNumber: number;
  stats: TeamStats;
  calculatedMetrics: {
    avgAutoScore: number;
    avgTeleopScore: number;
    avgEndgameScore: number;
    avgTotalScore: number;
    climbSuccessRate: number;
    consistencyRating: number;
    defenseCapability: string;
  };
}

class TeamDataService {
  async getTeamStats(teamNumber: number): Promise<TeamPerformanceData | null> {
    try {
      const db = getDatabase();
      const statsRef = ref(db, `processedData/${teamNumber}/`);
      const snapshot = await get(statsRef);

      if (snapshot.exists()) {
        const stats = snapshot.val() as TeamStats;
        return {
          teamNumber,
          stats,
          calculatedMetrics: this.calculateMetrics(stats)
        };
      }
      return null;
    } catch (error) {
      console.error(`Error fetching team ${teamNumber} stats:`, error);
      return null;
    }
  }

  async getAllTeamsData(teamNumbers: number[]): Promise<TeamPerformanceData[]> {
    const promises = teamNumbers.map(teamNumber => this.getTeamStats(teamNumber));
    const results = await Promise.all(promises);
    return results.filter((data): data is TeamPerformanceData => data !== null);
  }

  async getAllAvailableTeams(): Promise<TeamPerformanceData[]> {
    try {
      const db = getDatabase();
      const processedDataRef = ref(db, 'processedData/');
      const snapshot = await get(processedDataRef);

      if (snapshot.exists()) {
        const allData = snapshot.val();
        const teamNumbers = Object.keys(allData).map(Number);
        return this.getAllTeamsData(teamNumbers);
      }
      return [];
    } catch (error) {
      console.error('Error fetching all teams data:', error);
      return [];
    }
  }

  private calculateMetrics(stats: TeamStats) {
    const avgAutoScore = Math.round(stats.autoL4 * 7 + stats.autoL3 * 6 + stats.autoL2 * 4 + stats.autoL1 * 3) + 3;
    const avgTeleopScore = Math.round(
      stats.autoL4 * 5 +
      stats.autoL3 * 4 +
      stats.autoL2 * 3 +
      stats.autoL1 * 2 +
      stats.netScore * 4 +
      stats.processorScore * 6
    );
    const avgEndgameScore = Math.round(stats.climbRate * 0.12);
    const avgTotalScore = avgAutoScore + avgTeleopScore + avgEndgameScore;
    const climbSuccessRate = Math.round(stats.climbRate);
    const consistencyRating = Math.round(stats.consistencyRate) / 10;
    const defenseCapability = stats.defenseRating < 2 ? 'Not Defensive' : `${stats.defenseRating}/10`;

    return {
      avgAutoScore,
      avgTeleopScore,
      avgEndgameScore,
      avgTotalScore,
      climbSuccessRate,
      consistencyRating,
      defenseCapability
    };
  }

  generateTeamSummary(teamData: TeamPerformanceData): string {
    const { teamNumber, stats, calculatedMetrics } = teamData;

    return `Team ${teamNumber}:
- Performance Trend: ${stats.performanceTrend}
- Average Scores: Auto ${calculatedMetrics.avgAutoScore}, Teleop ${calculatedMetrics.avgTeleopScore}, Endgame ${calculatedMetrics.avgEndgameScore}, Total ${calculatedMetrics.avgTotalScore}
- Climb Success: ${calculatedMetrics.climbSuccessRate}%
- Consistency: ${calculatedMetrics.consistencyRating}/10
- Defense: ${calculatedMetrics.defenseCapability}
- OPR: ${stats.opr.toFixed(2)}, DPR: ${stats.dpr.toFixed(2)}, CCWM: ${stats.ccwm}
- Matches Played: ${stats.matchesPlayed}`;
  }

  analyzeAllianceStrengths(allianceTeams: TeamPerformanceData[]): string {
    if (allianceTeams.length === 0) return "No team data available for analysis.";

    const totalAvgScore = allianceTeams.reduce((sum, team) => sum + team.calculatedMetrics.avgTotalScore, 0);
    const avgClimbRate = allianceTeams.reduce((sum, team) => sum + team.calculatedMetrics.climbSuccessRate, 0) / allianceTeams.length;
    const avgConsistency = allianceTeams.reduce((sum, team) => sum + team.calculatedMetrics.consistencyRating, 0) / allianceTeams.length;
    const defensiveTeams = allianceTeams.filter(team => team.stats.defenseRating >= 5);
    const strongAutoTeams = allianceTeams.filter(team => team.calculatedMetrics.avgAutoScore >= 15);
    const reliableClimbers = allianceTeams.filter(team => team.calculatedMetrics.climbSuccessRate >= 80);

    return `Alliance Analysis:
- Combined Scoring Potential: ${totalAvgScore} points
- Average Climb Success: ${avgClimbRate.toFixed(1)}%
- Average Consistency: ${avgConsistency.toFixed(1)}/10
- Defensive Capabilities: ${defensiveTeams.length} strong defensive team(s)
- Strong Auto Teams: ${strongAutoTeams.length}
- Reliable Climbers: ${reliableClimbers.length}`;
  }

  compareAlliances(allianceTeams: TeamPerformanceData[], opponentTeams: TeamPerformanceData[]): string {
    const allianceAnalysis = this.analyzeAllianceStrengths(allianceTeams);
    const opponentAnalysis = this.analyzeAllianceStrengths(opponentTeams);

    const allianceTotal = allianceTeams.reduce((sum, team) => sum + team.calculatedMetrics.avgTotalScore, 0);
    const opponentTotal = opponentTeams.reduce((sum, team) => sum + team.calculatedMetrics.avgTotalScore, 0);

    const scoringAdvantage = allianceTotal - opponentTotal;
    const advantageText = scoringAdvantage > 0
      ? `Your alliance has a ${scoringAdvantage.toFixed(1)} point scoring advantage`
      : `Opponents have a ${Math.abs(scoringAdvantage).toFixed(1)} point scoring advantage`;

    return `${advantageText}\n\nYour Alliance:\n${allianceAnalysis}\n\nOpponent Alliance:\n${opponentAnalysis}`;
  }
}

export const teamDataService = new TeamDataService();