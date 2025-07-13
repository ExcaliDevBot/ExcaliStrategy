import {GoogleGenAI} from "@google/genai";
import {teamDataService, TeamPerformanceData} from './teamDataService';

interface AIMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

class AIService {
    private ai = new GoogleGenAI({
        apiKey: 'AIzaSyCmzkvnTB-61cW4xihwMMCEEctMn8HhZ64', // Your key
    });
    private model = "gemini-2.5-flash";

    private async makeAIRequest(messages: AIMessage[]): Promise<string> {
        try {
            const prompt = messages.map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n\n');
            const response = await this.ai.models.generateContent({
                model: this.model,
                contents: prompt
            });

            return response.text || 'Unable to generate response at this time.';
        } catch (error) {
            console.error('AI Service Error:', error);
            throw new Error('Error while contacting Google AI service.');
        }
    }

    async generateStrategyInsights(matchData: {
        matchNumber: string;
        allianceTeams: string[];
        opponentTeams: string[];
        allianceColor: string;
        matchType: string;
    }): Promise<string> {
        try {
            const allTeamNumbers = [...matchData.allianceTeams, ...matchData.opponentTeams].map(Number).filter(n => !isNaN(n));
            const allTeamsData = await teamDataService.getAllTeamsData(allTeamNumbers);

            const allianceTeamsData = allTeamsData.filter(team => matchData.allianceTeams.includes(team.teamNumber.toString()));
            const opponentTeamsData = allTeamsData.filter(team => matchData.opponentTeams.includes(team.teamNumber.toString()));

            if (allTeamsData.length === 0) return this.generateBasicStrategy(matchData);

            const allianceDataSummary = allianceTeamsData.map(team => teamDataService.generateTeamSummary(team)).join('\n\n');
            const opponentDataSummary = opponentTeamsData.map(team => teamDataService.generateTeamSummary(team)).join('\n\n');
            const allianceComparison = teamDataService.compareAlliances(allianceTeamsData, opponentTeamsData);

            const messages: AIMessage[] = [
                {
                    role: 'system',
                    content: `You are a strategic analyst for an FRC drive team. You are given the following inputs:

allianceDataSummary – a summary of your alliance’s performance, team roles, strengths, and weaknesses.

opponentDataSummary – a summary of the opposing alliance’s performance and characteristics.

allianceComparison – a comparative analysis showing how your alliance stacks up against the opponent alliance across auto, teleop, defense, and endgame.

Your task is to analyze this data and generate a concise and practical match strategy that includes:

1. Unknowns & Warnings
Point out any gaps, missing data, or uncertainties in either alliance's profile.

Suggest how to prepare for or scout around these unknowns.

2. Predicted Roles
Identify the likely role of each robot in both alliances (e.g. scorer, defender, support).

Highlight potential mismatches or roles that can be exploited.

3. Strategy by Game Phase
Break the plan into these categories:

✅ Auto Phase:
Who should run mobility or multi-piece autos?

Where to position robots?

Where to gain early advantage?

🔄 Teleop:
What scoring strategies to prioritize (amp, speaker, trap)?

How to cycle efficiently?

Which opponents to avoid or slow down?

🛡️ Defense & Counter-Play:
Identify opponents likely to defend.

Assign a robot to counter them.

Suggest chokepoints or field zones to control.

🪜 Endgame:
Analyze climb, chain, and trap potential.

Suggest contingencies if something fails.

4. Risk Factors
Note anything that could flip the match (penalties, poor climb, over-reliance on one robot).

5. Callouts & Priorities
Provide 3–5 bullet points to be used in drive team pre-match briefing.

✅ Be tactical, specific, and realistic. Don’t just restate the data – extract insight and recommend a plan.`
                },

                {
                    role: 'user',
                    content: `Analyze this FRC match and provide strategic recommendations:

MATCH: ${matchData.matchNumber} (${matchData.matchType})
ALLIANCE: ${matchData.allianceColor} - Teams ${matchData.allianceTeams.join(', ')}
OPPONENTS: Teams ${matchData.opponentTeams.join(', ')}

ALLIANCE PERFORMANCE DATA:
${allianceDataSummary || 'Limited data available'}

OPPONENT PERFORMANCE DATA:
${opponentDataSummary || 'Limited data available'}

COMPARISON:
${allianceComparison}

Provide recommendations for:
1. Overall strategy
2. Auto
3. Teleop
4. Endgame
5. Defense
6. Risks & backups`
                }
            ];

            return await this.makeAIRequest(messages);
        } catch (error) {
            console.error('Error generating strategy insights:', error);
            return this.generateBasicStrategy(matchData);
        }
    }

    private generateBasicStrategy(matchData: {
        matchNumber: string;
        allianceTeams: string[];
        opponentTeams: string[];
        allianceColor: string;
        matchType: string;
    }): string {
        return `BASIC STRATEGY for Match ${matchData.matchNumber}

- Focus on consistent scoring
- Execute reliable auto routines
- Assign roles: scorer, support, defense
- Coordinate climb strategy early
- Be ready with backup plans if mechanisms fail.`;
    }
}

export const aiService = new AIService();