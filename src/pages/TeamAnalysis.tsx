import React, { useState } from 'react';
import { Search, BarChart2 } from 'lucide-react';
import TeamPerformanceChart from '../components/analysis/TeamPerformanceChart';
import TeamStatsTable from '../components/analysis/TeamStatsTable';
import TeamComparisonChart from '../components/analysis/TeamComparisonChart';

const TeamAnalysis: React.FC = () => {
  const [searchTeam, setSearchTeam] = useState('');
  const [selectedTeam, setSelectedTeam] = useState<number | null>(null);
  const [selectedTab, setSelectedTab] = useState<'performance' | 'comparison'>('performance');
  
  // This would typically come from Firebase
  const teams = [
    { teamNumber: 1690, teamName: 'Orbit' },
    { teamNumber: 1114, teamName: 'Simbotics' },
    { teamNumber: 118, teamName: 'Robonauts' },
    { teamNumber: 2056, teamName: 'OP Robotics' },
    { teamNumber: 1678, teamName: 'Citrus Circuits' },
    { teamNumber: 3310, teamName: 'Black Hawk Robotics' },
    { teamNumber: 195, teamName: 'CyberKnights' },
    { teamNumber: 148, teamName: 'Your Team' },
  ];
  
  const filteredTeams = teams.filter(team => 
    team.teamNumber.toString().includes(searchTeam) || 
    team.teamName.toLowerCase().includes(searchTeam.toLowerCase())
  );
  
  const handleTeamSelect = (teamNumber: number) => {
    setSelectedTeam(teamNumber);
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">Team Analysis</h1>
        <p className="text-neutral-500">Analyze performance data and team comparisons</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Team selector sidebar */}
        <div className="bg-white rounded-lg shadow-sm p-4 border border-neutral-200">
          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-neutral-400" />
            </div>
            <input
              type="text"
              placeholder="Search teams..."
              className="pl-10 p-2 w-full border border-neutral-300 rounded-md"
              value={searchTeam}
              onChange={(e) => setSearchTeam(e.target.value)}
            />
          </div>
          
          <div className="space-y-1 max-h-[calc(100vh-300px)] overflow-y-auto">
            {filteredTeams.map(team => (
              <button
                key={team.teamNumber}
                className={`w-full text-left px-3 py-2 rounded-md ${
                  selectedTeam === team.teamNumber
                    ? 'bg-primary-50 text-primary-700 font-medium'
                    : 'hover:bg-neutral-50'
                }`}
                onClick={() => handleTeamSelect(team.teamNumber)}
              >
                <div className="font-medium">{team.teamNumber}</div>
                <div className="text-sm text-neutral-500">{team.teamName}</div>
              </button>
            ))}
            
            {filteredTeams.length === 0 && (
              <div className="text-center p-4 text-neutral-500">
                No teams found with that search term.
              </div>
            )}
          </div>
        </div>
        
        {/* Main content area */}
        <div className="lg:col-span-3">
          {selectedTeam ? (
            <div className="bg-white rounded-lg shadow-sm border border-neutral-200">
              <div className="border-b border-neutral-200">
                <div className="flex">
                  <button
                    className={`px-4 py-3 font-medium text-sm flex items-center ${
                      selectedTab === 'performance'
                        ? 'text-primary-500 border-b-2 border-primary-500'
                        : 'text-neutral-500 hover:text-neutral-800'
                    }`}
                    onClick={() => setSelectedTab('performance')}
                  >
                    <BarChart2 size={16} className="mr-2" />
                    Team Performance
                  </button>
                  <button
                    className={`px-4 py-3 font-medium text-sm flex items-center ${
                      selectedTab === 'comparison'
                        ? 'text-primary-500 border-b-2 border-primary-500'
                        : 'text-neutral-500 hover:text-neutral-800'
                    }`}
                    onClick={() => setSelectedTab('comparison')}
                  >
                    <Search size={16} className="mr-2" />
                    Team Comparison
                  </button>
                </div>
              </div>
              
              <div className="p-4">
                {selectedTab === 'performance' ? (
                  <div className="space-y-6">
                    <TeamStatsTable teamNumber={1690} />
                    <TeamPerformanceChart teamNumber={selectedTeam} />
                  </div>
                ) : (
                  <TeamComparisonChart teamNumber={selectedTeam} />
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <BarChart2 size={40} className="mx-auto text-neutral-300 mb-4" />
              <h2 className="text-xl font-semibold mb-2">Select a Team</h2>
              <p className="text-neutral-500">
                Choose a team from the sidebar to view detailed performance analysis and statistics.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamAnalysis;