import { teamDataService, TeamPerformanceData } from './teamDataService';

interface AIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface AIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

class AIService {
  private apiKey = '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';
  private baseUrl = 'https://openrouter.ai/api/v1/chat/completions';

  async generateStrategyInsights(
    matchData: {
      matchNumber: string;
      allianceTeams: string[];
      opponentTeams: string[];
      allianceColor: string;
      matchType: string;
    }
  ): Promise<string> {
    try {
      // Fetch performance data for all teams
      const allTeamNumbers = [
        ...matchData.allianceTeams.map(Number),
        ...matchData.opponentTeams.map(Number)
      ].filter(num => !isNaN(num));

      const allTeamsData = await teamDataService.getAllTeamsData(allTeamNumbers);
      const allianceTeamsData = allTeamsData.filter(team =>
        matchData.allianceTeams.includes(team.teamNumber.toString())
      );
      const opponentTeamsData = allTeamsData.filter(team =>
        matchData.opponentTeams.includes(team.teamNumber.toString())
      );

      // Generate detailed team summaries
      const allianceDataSummary = allianceTeamsData.map(team =>
        teamDataService.generateTeamSummary(team)
      ).join('\n\n');

      const opponentDataSummary = opponentTeamsData.map(team =>
        teamDataService.generateTeamSummary(team)
      ).join('\n\n');

      // Generate alliance comparison
      const allianceComparison = teamDataService.compareAlliances(allianceTeamsData, opponentTeamsData);

      const messages: AIMessage[] = [
        {
          role: 'system',
          content: `You are an expert FRC (FIRST Robotics Competition) strategist with access to detailed team performance data. Analyze the provided team statistics and match setup to create comprehensive strategic recommendations. Focus on data-driven insights, specific tactical recommendations, and actionable strategies based on the actual performance metrics provided.`
        },
        {
          role: 'user',
          content: `Analyze this upcoming FRC match using the detailed team performance data and provide strategic recommendations:

MATCH DETAILS:
- Match Number: ${matchData.matchNumber}
- Match Type: ${matchData.matchType}
- Alliance Color: ${matchData.allianceColor}
- Our Alliance: ${matchData.allianceTeams.join(', ')}
- Opponent Alliance: ${matchData.opponentTeams.join(', ')}

ALLIANCE TEAM PERFORMANCE DATA:
${allianceDataSummary || 'No performance data available for alliance teams'}

OPPONENT TEAM PERFORMANCE DATA:
${opponentDataSummary || 'No performance data available for opponent teams'}

ALLIANCE COMPARISON:
${allianceComparison}

Based on this detailed performance data, provide:

1. **OVERALL STRATEGY**: Data-driven game plan considering scoring potentials and team strengths
2. **AUTONOMOUS RECOMMENDATIONS**: Specific auto strategies based on each team's auto performance
3. **TELEOP FOCUS AREAS**: Tactical priorities based on scoring capabilities and consistency ratings
4. **ENDGAME COORDINATION**: Climbing strategy based on success rates and reliability data
5. **DEFENSIVE STRATEGY**: When and how to play defense based on opponent strengths and your defensive capabilities
6. **RISK MITIGATION**: Backup plans considering consistency ratings and performance trends
7. **KEY MATCHUPS**: Specific team-vs-team tactical considerations
8. **SCORING PREDICTIONS**: Expected score ranges based on historical performance

Make your recommendations specific, actionable, and directly tied to the performance data provided. Include confidence levels where appropriate.`
        }
      ];

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'openrouter/cypher-alpha:free',
          messages,
          temperature: 0.7,
          max_tokens: 2000,
        }),
      });

      if (!response.ok) {
        throw new Error(`AI API request failed: ${response.statusText}`);
      }

      const data: AIResponse = await response.json();
      return data.choices[0]?.message?.content || 'Unable to generate strategy insights at this time.';
    } catch (error) {
      console.error('Error generating AI insights:', error);
      return 'Unable to generate strategy insights. Please check your connection and try again.';
    }
  }

  async generateMatchBriefing(strategyData: {
    matchNumber: string;
    matchType: string;
    allianceColor: string;
    allianceTeams: string[];
    opponentTeams: string[];
    gameplan: string;
    autoStrategy: string;
    teleopStrategy: string;
    endgameStrategy: string;
    defensiveStrategy: string;
    backupPlans: string;
    notes: string;
    aiInsights?: string;
  }): Promise<string> {
    try {
      // Fetch team performance data for context
      const allTeamNumbers = [
        ...strategyData.allianceTeams.map(Number),
        ...strategyData.opponentTeams.map(Number)
      ].filter(num => !isNaN(num));

      const allTeamsData = await teamDataService.getAllTeamsData(allTeamNumbers);
      const allianceTeamsData = allTeamsData.filter(team =>
        strategyData.allianceTeams.includes(team.teamNumber.toString())
      );
      const opponentTeamsData = allTeamsData.filter(team =>
        strategyData.opponentTeams.includes(team.teamNumber.toString())
      );

      // Generate quick team performance summaries for briefing
      const allianceQuickStats = allianceTeamsData.map(team =>
        `Team ${team.teamNumber}: ${team.calculatedMetrics.avgTotalScore}pts avg, ${team.calculatedMetrics.climbSuccessRate}% climb, ${team.calculatedMetrics.consistencyRating}/10 consistency`
      ).join('\n');

      const opponentQuickStats = opponentTeamsData.map(team =>
        `Team ${team.teamNumber}: ${team.calculatedMetrics.avgTotalScore}pts avg, ${team.calculatedMetrics.climbSuccessRate}% climb, ${team.calculatedMetrics.consistencyRating}/10 consistency`
      ).join('\n');

      const messages: AIMessage[] = [
        {
          role: 'system',
          content: `You are creating a concise, actionable match briefing document for an FRC drive team. The briefing should be clear, focused, and include key performance data and talking points for the drive coach. Format it for easy reading during competition pressure.`
        },
        {
          role: 'user',
          content: `Create a drive team briefing document for this FRC match:

MATCH INFORMATION:
Match ${strategyData.matchNumber} - ${strategyData.matchType} Match
Alliance: ${strategyData.allianceColor.toUpperCase()}
Teams: ${strategyData.allianceTeams.join(' | ')}
Opponents: ${strategyData.opponentTeams.join(' | ')}

TEAM PERFORMANCE QUICK STATS:
Alliance Teams:
${allianceQuickStats || 'Performance data not available'}

Opponent Teams:
${opponentQuickStats || 'Performance data not available'}

STRATEGY DETAILS:
Game Plan: ${strategyData.gameplan}
Auto Strategy: ${strategyData.autoStrategy}
Teleop Strategy: ${strategyData.teleopStrategy}
Endgame Strategy: ${strategyData.endgameStrategy}
Defensive Strategy: ${strategyData.defensiveStrategy}
Backup Plans: ${strategyData.backupPlans}
Additional Notes: ${strategyData.notes}

${strategyData.aiInsights ? `AI INSIGHTS:\n${strategyData.aiInsights}` : ''}

Format this as a clear, concise briefing document with:
1. **MATCH OVERVIEW** - Key numbers and expectations
2. **ALLIANCE COORDINATION** - Who does what, when
3. **OPPONENT AWARENESS** - Key threats and opportunities
4. **PHASE-BY-PHASE PLAN** - Auto, Teleop, Endgame priorities
5. **CRITICAL REMINDERS** - Must-remember points
6. **CONTINGENCIES** - If things go wrong

Keep it scannable and action-oriented for use during competition.`
        }
      ];

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'openrouter/cypher-alpha:free',
          messages,
          temperature: 0.5,
          max_tokens: 1200,
        }),
      });

      if (!response.ok) {
        throw new Error(`AI API request failed: ${response.statusText}`);
      }

      const data: AIResponse = await response.json();
      return data.choices[0]?.message?.content || 'Unable to generate briefing document at this time.';
    } catch (error) {
      console.error('Error generating briefing:', error);
      return 'Unable to generate briefing document. Please check your connection and try again.';
    }
  }

  async generateAllianceSelectionInsights(
    yourTeamNumber: number,
    availableTeams: number[]
  ): Promise<string> {
    try {
      const allTeamsData = await teamDataService.getAllTeamsData([yourTeamNumber, ...availableTeams]);
      const yourTeamData = allTeamsData.find(team => team.teamNumber === yourTeamNumber);
      const availableTeamsData = allTeamsData.filter(team => team.teamNumber !== yourTeamNumber);

      if (!yourTeamData) {
        return 'Unable to analyze alliance selection - your team data not found.';
      }

      const teamSummaries = availableTeamsData.map(team =>
        teamDataService.generateTeamSummary(team)
      ).join('\n\n');

      const yourTeamSummary = teamDataService.generateTeamSummary(yourTeamData);

      const messages: AIMessage[] = [
        {
          role: 'system',
          content: `You are an expert FRC alliance selection strategist. Analyze team performance data to recommend optimal alliance partners based on complementary strengths, strategic fit, and competitive advantage.`
        },
        {
          role: 'user',
          content: `Analyze these teams for alliance selection and recommend the best partners:

YOUR TEAM DATA:
${yourTeamSummary}

AVAILABLE TEAMS:
${teamSummaries}

Provide:
1. **TOP 3 RECOMMENDATIONS** with specific reasoning
2. **STRATEGIC COMBINATIONS** that complement your team's strengths
3. **RISK ASSESSMENT** for each recommended partner
4. **ALTERNATIVE STRATEGIES** if top choices are unavailable
5. **AVOID LIST** with teams that don't fit your strategy

Base recommendations on data-driven analysis of scoring potential, consistency, and strategic fit.`
        }
      ];

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'openrouter/cypher-alpha:free',
          messages,
          temperature: 0.6,
          max_tokens: 1500,
        }),
      });

      if (!response.ok) {
        throw new Error(`AI API request failed: ${response.statusText}`);
      }

      const data: AIResponse = await response.json();
      return data.choices[0]?.message?.content || 'Unable to generate alliance selection insights at this time.';
    } catch (error) {
      console.error('Error generating alliance selection insights:', error);
      return 'Unable to generate alliance selection insights. Please check your connection and try again.';
    }
  }
}

export const aiService = new AIService();