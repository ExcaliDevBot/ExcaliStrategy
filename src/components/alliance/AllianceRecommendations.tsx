import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import AllianceTeamCard from './AllianceTeamCard';

// This would typically come from Firebase
const mockRecommendations = [
  {
    teamNumber: 254,
    teamName: 'The Cheesy Poofs',
    overallRating: 98,
    compatibilityScore: 92,
    strengthsMatch: ['High Scoring', 'Defense', 'Consistent'],
    weaknessesComplement: ['Ground Intake', 'Climb Reliability'],
    recommendation: 'high' as const,
    stats: {
      avgScore: 58.2,
      autoAvg: 12.5,
      teleopAvg: 33.2,
      endgameAvg: 12.5,
    }
  },
  {
    teamNumber: 1114,
    teamName: 'Simbotics',
    overallRating: 95,
    compatibilityScore: 90,
    strengthsMatch: ['High Scoring', 'Autonomous', 'Consistent'],
    weaknessesComplement: ['Defense Capability', 'Speed'],
    recommendation: 'high' as const,
    stats: {
      avgScore: 54.8,
      autoAvg: 13.2,
      teleopAvg: 29.6,
      endgameAvg: 12.0,
    }
  },
  {
    teamNumber: 118,
    teamName: 'Robonauts',
    overallRating: 92,
    compatibilityScore: 85,
    strengthsMatch: ['High Scoring', 'Climb Specialist', 'Driver Skill'],
    weaknessesComplement: ['Autonomous', 'Defense Against Top Teams'],
    recommendation: 'high' as const,
    stats: {
      avgScore: 52.6,
      autoAvg: 9.8,
      teleopAvg: 31.3,
      endgameAvg: 11.5,
    }
  },
  {
    teamNumber: 2056,
    teamName: 'OP Robotics',
    overallRating: 90,
    compatibilityScore: 88,
    strengthsMatch: ['Consistent', 'Autonomous', 'Defense'],
    weaknessesComplement: ['High Goal Scoring', 'Cycle Speed'],
    recommendation: 'medium' as const,
    stats: {
      avgScore: 49.3,
      autoAvg: 11.7,
      teleopAvg: 28.1,
      endgameAvg: 9.5,
    }
  },
  {
    teamNumber: 1678,
    teamName: 'Citrus Circuits',
    overallRating: 89,
    compatibilityScore: 83,
    strengthsMatch: ['Consistent', 'Strategic', 'Reliable Climb'],
    weaknessesComplement: ['Ground Intake', 'Defense'],
    recommendation: 'medium' as const,
    stats: {
      avgScore: 47.8,
      autoAvg: 10.5,
      teleopAvg: 29.8,
      endgameAvg: 7.5,
    }
  },
  {
    teamNumber: 3310,
    teamName: 'Black Hawk Robotics',
    overallRating: 85,
    compatibilityScore: 78,
    strengthsMatch: ['Defense', 'Low Goal Specialist', 'Driver Skill'],
    weaknessesComplement: ['Autonomous', 'Climb Capabilities'],
    recommendation: 'medium' as const,
    stats: {
      avgScore: 42.1,
      autoAvg: 8.2,
      teleopAvg: 26.4,
      endgameAvg: 7.5,
    }
  },
  {
    teamNumber: 195,
    teamName: 'CyberKnights',
    overallRating: 83,
    compatibilityScore: 76,
    strengthsMatch: ['Consistent', 'Defensive Capability', 'Strategic'],
    weaknessesComplement: ['Cycle Speed', 'Autonomous'],
    recommendation: 'low' as const,
    stats: {
      avgScore: 40.2,
      autoAvg: 7.8,
      teleopAvg: 25.9,
      endgameAvg: 6.5,
    }
  },
];

const AllianceRecommendations: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRecommendation, setFilterRecommendation] = useState<'all' | 'high' | 'medium' | 'low'>('all');

  const filteredTeams = mockRecommendations.filter(team => {
    const matchesSearch = 
      searchTerm === '' || 
      team.teamNumber.toString().includes(searchTerm) ||
      team.teamName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = 
      filterRecommendation === 'all' || 
      team.recommendation === filterRecommendation;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div>
      <div className="mb-6 p-4 bg-neutral-50 rounded-lg border border-neutral-200">
        <h3 className="text-lg font-semibold mb-2">Alliance Selection Strategy</h3>
        <p className="text-neutral-600 mb-4">
          Based on your team's strengths in scoring high goals and consistent autonomous, we recommend selecting alliance partners that complement with strong defense capabilities and reliable climbing.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="p-3 bg-white rounded-md border border-neutral-200">
            <p className="font-medium text-neutral-700 mb-1">Your Team Strengths</p>
            <ul className="list-disc list-inside text-neutral-600">
              <li>Consistent high goal scoring</li>
              <li>Reliable autonomous routines</li>
              <li>Fast cycle times</li>
            </ul>
          </div>
          <div className="p-3 bg-white rounded-md border border-neutral-200">
            <p className="font-medium text-neutral-700 mb-1">Your Team Weaknesses</p>
            <ul className="list-disc list-inside text-neutral-600">
              <li>Limited defense capabilities</li>
              <li>Inconsistent climbing</li>
              <li>Struggles with ground intakes</li>
            </ul>
          </div>
          <div className="p-3 bg-white rounded-md border border-neutral-200">
            <p className="font-medium text-neutral-700 mb-1">Look For Partners With</p>
            <ul className="list-disc list-inside text-neutral-600">
              <li>Strong defensive capabilities</li>
              <li>Reliable climbing mechanisms</li>
              <li>Effective ground intakes</li>
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