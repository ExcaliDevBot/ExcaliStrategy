import React, { useState, useEffect } from 'react';
import { Search, Filter, Sparkles, Loader2 } from 'lucide-react';
import AllianceTeamCard from './AllianceTeamCard';
import { aiService } from '../../services/aiService';
import { teamDataService, TeamPerformanceData } from '../../services/teamDataService';

const AllianceRecommendations: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRecommendation, setFilterRecommendation] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [allTeamsData, setAllTeamsData] = useState<TeamPerformanceData[]>([]);
  const [aiInsights, setAiInsights] = useState<string>('');
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);
  const [loading, setLoading] = useState(true);

  const yourTeamNumber = 6738; // This would typically come from settings or context

  useEffect(() => {
    loadTeamData();
  }, []);

  const loadTeamData = async () => {
    try {
      const teamsData = await teamDataService.getAllAvailableTeams();
      setAllTeamsData(teamsData);
    } catch (error) {
      console.error('Error loading team data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateAIInsights = async () => {
    setIsGeneratingInsights(true);
    try {
      const availableTeams = allTeamsData
        .filter(team => team.teamNumber !== yourTeamNumber)
        .map(team => team.teamNumber);

      const insights = await aiService.generateAllianceSelectionInsights(
        yourTeamNumber,
        availableTeams
      );
      setAiInsights(insights);
    } catch (error) {
      console.error('Error generating AI insights:', error);
    } finally {
      setIsGeneratingInsights(false);
    }
  };

  // Convert team data to the format expected by AllianceTeamCard
  const convertToCardFormat = (teamData: TeamPerformanceData) => {
    const { stats, calculatedMetrics } = teamData;

    // Determine recommendation level based on performance
    let recommendation: 'high' | 'medium' | 'low' = 'medium';
    if (calculatedMetrics.avgTotalScore >= 50 && calculatedMetrics.consistencyRating >= 7) {
      recommendation = 'high';
    } else if (calculatedMetrics.avgTotalScore < 35 || calculatedMetrics.consistencyRating < 5) {
      recommendation = 'low';
    }

    // Generate strengths and weaknesses based on data
    const strengthsMatch: string[] = [];
    const weaknessesComplement: string[] = [];

    if (calculatedMetrics.avgAutoScore >= 15) strengthsMatch.push('Strong Autonomous');
    if (calculatedMetrics.avgTeleopScore >= 30) strengthsMatch.push('High Teleop Scoring');
    if (calculatedMetrics.climbSuccessRate >= 80) strengthsMatch.push('Reliable Climbing');
    if (calculatedMetrics.consistencyRating >= 7) strengthsMatch.push('Consistent Performance');
    if (stats.defenseRating >= 5) strengthsMatch.push('Defensive Capability');

    if (calculatedMetrics.avgAutoScore < 10) weaknessesComplement.push('Autonomous Improvement');
    if (calculatedMetrics.climbSuccessRate < 60) weaknessesComplement.push('Climbing Reliability');
    if (stats.defenseRating < 3) weaknessesComplement.push('Defense Capability');
    if (calculatedMetrics.consistencyRating < 6) weaknessesComplement.push('Consistency');

    return {
      teamNumber: teamData.teamNumber,
      teamName: `Team ${teamData.teamNumber}`, // You might want to fetch actual team names
      overallRating: Math.min(100, Math.round(calculatedMetrics.avgTotalScore * 1.5 + calculatedMetrics.consistencyRating * 5)),
      compatibilityScore: Math.round(85 + Math.random() * 15), // This could be calculated based on complementary analysis
      strengthsMatch,
      weaknessesComplement,
      recommendation,
      stats: {
        avgScore: calculatedMetrics.avgTotalScore,
        autoAvg: calculatedMetrics.avgAutoScore,
        teleopAvg: calculatedMetrics.avgTeleopScore,
        endgameAvg: calculatedMetrics.avgEndgameScore,
      }
    };
  };

  const filteredTeams = allTeamsData
    .filter(team => team.teamNumber !== yourTeamNumber) // Exclude your own team
    .map(convertToCardFormat)
    .filter(team => {
      const matchesSearch =
        searchTerm === '' ||
        team.teamNumber.toString().includes(searchTerm) ||
        team.teamName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilter =
        filterRecommendation === 'all' ||
        team.recommendation === filterRecommendation;

      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => b.overallRating - a.overallRating); // Sort by overall rating

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-neutral-500">Loading team data...</div>
      </div>
    );
  }

  const yourTeamData = allTeamsData.find(team => team.teamNumber === yourTeamNumber);

  return (
    <div>
      {/* AI Insights Section */}
      <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center">
            <Sparkles size={18} className="mr-2 text-purple-500" />
            AI Alliance Selection Insights
          </h3>
          <button
            onClick={generateAIInsights}
            disabled={isGeneratingInsights}
            className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 disabled:opacity-50 flex items-center"
          >
            {isGeneratingInsights ? (
              <Loader2 size={16} className="mr-2 animate-spin" />
            ) : (
              <Sparkles size={16} className="mr-2" />
            )}
            {isGeneratingInsights ? 'Analyzing...' : 'Generate AI Recommendations'}
          </button>
        </div>

        {aiInsights && (
          <div className="bg-white p-4 rounded-md border border-purple-100">
            <div className="whitespace-pre-wrap text-neutral-700 text-sm">
              {aiInsights}
            </div>
          </div>
        )}

        {!aiInsights && !isGeneratingInsights && (
          <div className="text-center py-4 text-neutral-500">
            Click "Generate AI Recommendations" to get data-driven alliance selection insights.
          </div>
        )}
      </div>

      {/* Strategy Overview */}
      <div className="mb-6 p-4 bg-neutral-50 rounded-lg border border-neutral-200">
        <h3 className="text-lg font-semibold mb-2">Alliance Selection Strategy</h3>
        <p className="text-neutral-600 mb-4">
          Based on your team's performance data and available teams, here are strategic recommendations for alliance selection.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="p-3 bg-white rounded-md border border-neutral-200">
            <p className="font-medium text-neutral-700 mb-1">Your Team Performance</p>
            {yourTeamData ? (
              <ul className="list-disc list-inside text-neutral-600">
                <li>Avg Score: {yourTeamData.calculatedMetrics.avgTotalScore}</li>
                <li>Consistency: {yourTeamData.calculatedMetrics.consistencyRating}/10</li>
                <li>Climb Rate: {yourTeamData.calculatedMetrics.climbSuccessRate}%</li>
              </ul>
            ) : (
              <p className="text-neutral-500">Team data not available</p>
            )}
          </div>
          <div className="p-3 bg-white rounded-md border border-neutral-200">
            <p className="font-medium text-neutral-700 mb-1">Look For Partners With</p>
            <ul className="list-disc list-inside text-neutral-600">
              <li>Complementary strengths</li>
              <li>High consistency ratings</li>
              <li>Reliable climbing mechanisms</li>
            </ul>
          </div>
          <div className="p-3 bg-white rounded-md border border-neutral-200">
            <p className="font-medium text-neutral-700 mb-1">Available Teams</p>
            <ul className="list-disc list-inside text-neutral-600">
              <li>Total: {allTeamsData.length - 1} teams</li>
              <li>High rated: {filteredTeams.filter(t => t.recommendation === 'high').length}</li>
              <li>Medium rated: {filteredTeams.filter(t => t.recommendation === 'medium').length}</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={16} className="text-neutral-400" />
          </div>
          <input
            type="text"
            placeholder="Search by team number or name..."
            className="pl-10 p-2 w-full border border-neutral-300 rounded-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center">
          <Filter size={16} className="text-neutral-400 mr-2" />
          <select
            value={filterRecommendation}
            onChange={(e) => setFilterRecommendation(e.target.value as any)}
            className="p-2 border border-neutral-300 rounded-md bg-white"
          >
            <option value="all">All Recommendations</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTeams.map(team => (
          <AllianceTeamCard 
            key={team.teamNumber} 
            team={team} 
            showAddButton={true}
            onAddTeam={(teamNumber) => {
              alert(`Team ${teamNumber} would be added to your alliance selection list`);
            }}
          />
        ))}
        
        {filteredTeams.length === 0 && (
          <div className="col-span-3 text-center py-8 bg-neutral-50 rounded-lg">
            <p className="text-neutral-500">No teams match your search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllianceRecommendations;