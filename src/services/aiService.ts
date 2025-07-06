import {teamDataService, TeamPerformanceData} from './teamDataService';

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

    private async makeAIRequest(messages: AIMessage[], maxTokens: number = 1500): Promise<string> {
        try {
            const requestPayload = {
                model: 'openrouter/cypher-alpha:free',
                messages,
                temperature: 0.7,
                max_tokens: maxTokens,
            };

            console.log('Making AI Request...');
            console.log('Request URL:', this.baseUrl);
            console.log('Request Headers:', {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': window.location.origin,
                'X-Title': 'FRC Strategy System',
            });
            console.log('Request Payload:', requestPayload);

            const response = await fetch(this.baseUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json',
                    'HTTP-Referer': window.location.origin,
                    'X-Title': 'FRC Strategy System',
                },
                body: JSON.stringify(requestPayload),
            });

            console.log('Response Status:', response.status);
            console.log('Response Status Text:', response.statusText);

            if (!response.ok) {
                if (response.status === 401) {
                    console.error('Error: API authentication failed.');
                    throw new Error('API authentication failed. Please check your API key.');
                } else if (response.status === 429) {
                    console.error('Error: Rate limit exceeded.');
                    throw new Error('Rate limit exceeded. Please try again in a moment.');
                } else if (response.status === 500) {
                    console.error('Error: AI service temporarily unavailable.');
                    throw new Error('AI service temporarily unavailable. Please try again later.');
                } else {
                    console.error(`Error: AI API request failed with status ${response.status} ${response.statusText}`);
                    throw new Error(`AI API request failed: ${response.status} ${response.statusText}`);
                }
            }

            const data: AIResponse = await response.json();
            console.log('Response Data:', data);

            if (!data.choices || data.choices.length === 0) {
                console.error('Error: No response generated from AI service.');
                throw new Error('No response generated from AI service.');
            }

            return data.choices[0]?.message?.content || 'Unable to generate response at this time.';
        } catch (error) {
            console.error('AI Service Error:', error);

            if (error instanceof Error) {
                throw error;
            } else {
                throw new Error('Unknown error occurred while contacting AI service.');
            }
        }
    }

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

            // If no team data is available, provide basic strategic advice
            if (allTeamsData.length === 0) {
                return this.generateBasicStrategy(matchData);
            }

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
                    content: `You are an expert FRC (FIRST Robotics Competition) strategist. Analyze team performance data and provide specific,
                     actionable strategic recommendations for match preparation. Focus on data-driven insights and practical tactics,
                      here is imporatnt knowlage: Reefscape is the 2025 FRC game focused on ocean exploration and conservation, inspired by coral reefs 
community.firstinspires.org
Each match features two alliances (Red vs Blue), 3 robots per alliance, working to:
Score Coral (4″ PVC pipes)
Remove and score Algae (16″ playground balls)
Climb onto structures at match end 
2. Match Flow & Field Elements
Start Configuration: Robots begin in designated zones.
Autonomous Period (~15 sec): Robots act without driver control.
Teleoperated Period (~2 min): Drivers control robots.
Endgame: Robots climb on Cages attached to the Barge before time expires.
Field elements include:
Reef structures (branches/shelves) for Coral
Processor and Net goals for Algae
Elevated Barge with hanging Cages 
3. Scoring Breakdown
Coral (PVC Pipes)
Points for scoring Coral on Reef structures.
Points vary depending on structure height or placement (manual details).
Algae (Playground Balls)
Robots collect Algae from the Reef and score in:
Processor – higher points
Net – lower points
Scoring 2 or more Algae in each alliance’s Processor grants a Coopertition Point, benefiting both alliances' rankings 
Climbing / Endgame
Robots climb Cages hanging from the Barge:
Grabbing and climbing onto/against them before match end yields endgame points 
May also need to park under or on the Barge.
4. Ranking Points (Qualifiers)
Earn Ranking Points (RP) by:
Wining or tying the match
Achieving Coopertition bonus (2+ Algae in Processors)
Reaching set scoring thresholds (e.g. building a barrier of Coral? manual likely clarifies)
5. Robot Rules & Safety
Robots must follow design constraints (size, weight, bumpers) 
frcmanual.com
en.wikipedia.org
firstinspires.org
.
Must not deliberately damage opposing robots. Major fouls or cards apply for violations. Non-intentional damage from incidental contact is handled differently 
en.wikipedia.org


Bumper rules were relaxed in 2025 to make them easier to build and inspect 
firstinspires.org
.

6. Gracious Professionalism & Coopertition
A program cornerstone: teams compete hard while cooperating, helping each other, and acting respectfully 


“Coopertition” encourages this mindset on and off the field.
In the 2025 FRC game, **REEFSCAPE**, teams score points by completing tasks involving Coral (PVC pipes), Algae (large balls), and climbing in the Endgame. During the **Autonomous Period** (first 15 seconds), each robot that leaves its starting zone earns 3 points. Coral can be scored on different reef levels: Trough (lowest) gives 3 points in Auto and 2 in Teleop; higher Branch levels give more—up to 7 points in Auto and 5 in Teleop depending on height. Algae scored in the **Processor** earns 6 points, while scoring in the **Net** gives 4 points. In the **Endgame**, robots can earn points by parking on the Barge zone floor (2 points), climbing a Shallow Cage (6 points), or climbing a Deep Cage (12 points). If both alliances score at least 2 Algae in their respective Processors, each gets a Coopertition Ranking Point (RP) and lowered thresholds for Coral RP. Ranking Points during qualification matches are awarded for wins (3 RP), ties (1 RP), and specific achievements like all 3 robots exiting Auto zones plus at least one Coral scored during Auto (Auto RP), placing 5 Coral on all 4 reef levels (or 3 if Coop achieved) for the Coral RP, and earning 14 or more Endgame points for the Barge RP. Fouls can give the opposing alliance bonus points—2 for minor, 6 for technical fouls. This system encourages balanced scoring across all match phases while rewarding coordination and strategy.

`

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

Provide concise recommendations for:
1. Overall strategy and scoring focus
2. Autonomous coordination
3. Teleop priorities and roles
4. Endgame/climbing plan
5. Defensive tactics
6. Key risks and backup plans

Keep recommendations specific and actionable for drive team use.`
                }
            ];

            return await this.makeAIRequest(messages, 1500);
        } catch (error) {
            console.error('Error generating strategy insights:', error);

            // Fallback to basic strategy if AI fails
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
        return `BASIC STRATEGY RECOMMENDATIONS for Match ${matchData.matchNumber}

**OVERALL APPROACH:**
- Focus on consistent scoring and reliable autonomous routines
- Coordinate with alliance partners for optimal field coverage
- Prioritize high-percentage scoring opportunities

**AUTONOMOUS PHASE:**
- Execute your most reliable autonomous routine
- Coordinate starting positions with alliance partners
- Aim for consistent point contribution rather than risky high-scoring attempts

**TELEOP STRATEGY:**
- Establish clear roles: primary scorer, support, and defensive player
- Maintain good field awareness and communication
- Focus on cycle efficiency and consistent scoring

**ENDGAME COORDINATION:**
- Plan climbing sequence early in the match
- Ensure all alliance partners know their climbing assignments
- Have backup plans if primary climbing strategy fails

**DEFENSIVE CONSIDERATIONS:**
- Identify the strongest opponent scorer for potential defensive focus
- Balance offensive scoring with strategic defensive plays
- Communicate defensive switches clearly with alliance partners

**BACKUP PLANS:**
- If autonomous fails, focus on strong teleop performance
- If climbing mechanisms fail, maximize scoring until match end
- Adapt strategy based on early match performance

Note: This is a basic strategy template. For detailed insights based on actual team performance data, please ensure team data is available in the system.`;
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
            const messages: AIMessage[] = [
                {
                    role: 'system',
                    content: `Create a concise, scannable match briefing for an FRC drive team. Format for quick reading during competition pressure.`
                },
                {
                    role: 'user',
                    content: `Create a drive team briefing for Match ${strategyData.matchNumber}:

MATCH INFO: ${strategyData.matchType} | ${strategyData.allianceColor.toUpperCase()} Alliance
TEAMS: ${strategyData.allianceTeams.join(' | ')} vs ${strategyData.opponentTeams.join(' | ')}

STRATEGY:
Game Plan: ${strategyData.gameplan || 'Focus on consistent scoring and coordination'}
Auto: ${strategyData.autoStrategy || 'Execute reliable autonomous routine'}
Teleop: ${strategyData.teleopStrategy || 'Maintain scoring efficiency and field awareness'}
Endgame: ${strategyData.endgameStrategy || 'Coordinate climbing sequence'}
Defense: ${strategyData.defensiveStrategy || 'Strategic defensive plays as needed'}
Backup: ${strategyData.backupPlans || 'Adapt based on match conditions'}
Notes: ${strategyData.notes || 'Stay focused and communicate clearly'}

Format as a clear briefing with key points and reminders.`
                }
            ];

            return await this.makeAIRequest(messages, 1000);
        } catch (error) {
            console.error('Error generating briefing:', error);

            // Fallback briefing
            return `MATCH ${strategyData.matchNumber} BRIEFING

**MATCH SETUP**
Type: ${strategyData.matchType}
Alliance: ${strategyData.allianceColor.toUpperCase()}
Teams: ${strategyData.allianceTeams.join(' | ')}
Opponents: ${strategyData.opponentTeams.join(' | ')}

**KEY STRATEGY POINTS**
${strategyData.gameplan ? `• Game Plan: ${strategyData.gameplan}` : '• Focus on consistent execution'}
${strategyData.autoStrategy ? `• Auto: ${strategyData.autoStrategy}` : '• Execute reliable autonomous'}
${strategyData.teleopStrategy ? `• Teleop: ${strategyData.teleopStrategy}` : '• Maintain scoring efficiency'}
${strategyData.endgameStrategy ? `• Endgame: ${strategyData.endgameStrategy}` : '• Coordinate climbing'}

**CRITICAL REMINDERS**
• Communicate clearly with alliance partners
• Stay focused on your role and responsibilities
• Adapt strategy based on match conditions
• Execute backup plans if needed

**BACKUP PLANS**
${strategyData.backupPlans || 'Adapt based on match performance and field conditions'}

Good luck and drive smart!`;
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

            if (!yourTeamData || availableTeamsData.length === 0) {
                return this.generateBasicAllianceAdvice(yourTeamNumber, availableTeams);
            }

            const teamSummaries = availableTeamsData
                .sort((a, b) => b.calculatedMetrics.avgTotalScore - a.calculatedMetrics.avgTotalScore)
                .slice(0, 10) // Limit to top 10 teams to avoid token limits
                .map(team => teamDataService.generateTeamSummary(team))
                .join('\n\n');

            const yourTeamSummary = teamDataService.generateTeamSummary(yourTeamData);

            const messages: AIMessage[] = [
                {
                    role: 'system',
                    content: `You are an FRC alliance selection expert. Analyze team data to recommend optimal alliance partners based on performance metrics and strategic fit.`
                },
                {
                    role: 'user',
                    content: `Recommend alliance partners for Team ${yourTeamNumber}:

YOUR TEAM:
${yourTeamSummary}

TOP AVAILABLE TEAMS:
${teamSummaries}

Provide:
1. Top 3 recommended partners with reasoning
2. Strategic combinations that work well together
3. Teams to avoid and why
4. Backup options if top choices are taken

Focus on data-driven recommendations.`
                }
            ];

            return await this.makeAIRequest(messages, 1200);
        } catch (error) {
            console.error('Error generating alliance selection insights:', error);
            return this.generateBasicAllianceAdvice(yourTeamNumber, availableTeams);
        }
    }

    private generateBasicAllianceAdvice(yourTeamNumber: number, availableTeams: number[]): string {
        return `ALLIANCE SELECTION GUIDANCE for Team ${yourTeamNumber}

**GENERAL STRATEGY:**
Look for teams that complement your strengths and cover your weaknesses.

**KEY FACTORS TO CONSIDER:**
• **Scoring Consistency**: Choose reliable, consistent performers
• **Complementary Abilities**: Balance offensive and defensive capabilities
• **Climbing Reliability**: Ensure strong endgame coordination
• **Communication**: Select teams known for good alliance cooperation
• **Track Record**: Consider past performance and reliability

**EVALUATION CRITERIA:**
1. **Performance Metrics**: Average scores, consistency ratings
2. **Strategic Fit**: How well they complement your team's abilities
3. **Reliability**: Mechanical reliability and driver skill
4. **Flexibility**: Ability to adapt strategies during matches

**AVAILABLE TEAMS:** ${availableTeams.join(', ')}

**RECOMMENDATION PROCESS:**
1. Identify your team's strongest capabilities
2. Look for partners who excel where you're weaker
3. Ensure at least one strong defensive option
4. Verify climbing coordination possibilities
5. Have backup choices ready

For detailed analysis, ensure team performance data is loaded in the system.`;
    }
}

export const aiService = new AIService();