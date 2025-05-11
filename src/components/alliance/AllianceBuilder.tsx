import React, { useState } from 'react';
import { Search, Users, X, Download, Check } from 'lucide-react';
import AllianceTeamCard from './AllianceTeamCard';

// This would typically come from Firebase
const mockTeams = [
  {
    teamNumber: 254,
    teamName: 'The Cheesy Poofs',
    overallRating: 98,
    compatibilityScore: 92,
    strengthsMatch: ['High Scoring', 'Defense', 'Consistent'],
    weaknessesComplement: ['Ground Intake', 'Climb Reliability'],
    recommendation: 'high' as const,
  },
  {
    teamNumber: 1114,
    teamName: 'Simbotics',
    overallRating: 95,
    compatibilityScore: 90,
    strengthsMatch: ['High Scoring', 'Autonomous', 'Consistent'],
    weaknessesComplement: ['Defense Capability', 'Speed'],
    recommendation: 'high' as const,
  },
  {
    teamNumber: 118,
    teamName: 'Robonauts',
    overallRating: 92,
    compatibilityScore: 85,
    strengthsMatch: ['High Scoring', 'Climb Specialist', 'Driver Skill'],
    weaknessesComplement: ['Autonomous', 'Defense Against Top Teams'],
    recommendation: 'high' as const,
  },
  {
    teamNumber: 2056,
    teamName: 'OP Robotics',
    overallRating: 90,
    compatibilityScore: 88,
    strengthsMatch: ['Consistent', 'Autonomous', 'Defense'],
    weaknessesComplement: ['High Goal Scoring', 'Cycle Speed'],
    recommendation: 'medium' as const,
  },
  {
    teamNumber: 1678,
    teamName: 'Citrus Circuits',
    overallRating: 89,
    compatibilityScore: 83,
    strengthsMatch: ['Consistent', 'Strategic', 'Reliable Climb'],
    weaknessesComplement: ['Ground Intake', 'Defense'],
    recommendation: 'medium' as const,
  },
  {
    teamNumber: 3310,
    teamName: 'Black Hawk Robotics',
    overallRating: 85,
    compatibilityScore: 78,
    strengthsMatch: ['Defense', 'Low Goal Specialist', 'Driver Skill'],
    weaknessesComplement: ['Autonomous', 'Climb Capabilities'],
    recommendation: 'medium' as const,
  },
];

const AllianceBuilder: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeams, setSelectedTeams] = useState<number[]>([]);
  
  const filteredTeams = mockTeams.filter(team => {
    return (
      searchTerm === '' || 
      team.teamNumber.toString().includes(searchTerm) ||
      team.teamName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleAddTeam = (teamNumber: number) => {
    if (selectedTeams.length < 2) {
      setSelectedTeams([...selectedTeams, teamNumber]);
    } else {
      alert('You can only select 2 alliance partners.');
    }
  };

  const handleRemoveTeam = (teamNumber: number) => {
    setSelectedTeams(selectedTeams.filter(t => t !== teamNumber));
  };

  const getSelectedTeamData = (teamNumber: number) => {
    return mockTeams.find(t => t.teamNumber === teamNumber);
  };

  const handleExportAlliance = () => {
    alert('This would export your alliance selection as a PDF or CSV file.');
  };

  const handleSaveAlliance = () => {
    alert('Your alliance selection has been saved!');
  };

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="mb-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={16} className="text-neutral-400" />
              </div>
              <input
                type="text"
                placeholder="Search teams to add to your alliance..."
                className="pl-10 p-2 w-full border border-neutral-300 rounded-md"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTeams
              .filter(team => !selectedTeams.includes(team.teamNumber))
              .map(team => (
                <AllianceTeamCard 
                  key={team.teamNumber} 
                  team={team} 
                  showAddButton={true}
                  onAddTeam={handleAddTeam}
                />
              ))}
            
            {filteredTeams.filter(team => !selectedTeams.includes(team.teamNumber)).length === 0 && (
              <div className="col-span-2 text-center py-8 bg-neutral-50 rounded-lg">
                <p className="text-neutral-500">No additional teams match your search criteria.</p>
              </div>
            )}
          </div>
        </div>
        
        <div>
          <div className="bg-neutral-50 rounded-lg border border-neutral-200 p-4 mb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center">
                <Users size={18} className="mr-2 text-primary-500" />
                Your Alliance
              </h3>
              <div className="text-sm text-neutral-500">
                {selectedTeams.length}/2 Selected
              </div>
            </div>
            
            <div className="mb-4">
              <div className="p-3 bg-primary-50 border border-primary-100 rounded-md flex justify-between items-center mb-2">
                <div>
                  <p className="font-medium">Your Team (Captain)</p>
                  <p className="text-sm text-neutral-500">Team 148</p>
                </div>
              </div>
              
              {selectedTeams.map((teamNumber, index) => {
                const team = getSelectedTeamData(teamNumber);
                if (!team) return null;
                
                return (
                  <div key={teamNumber} className="p-3 bg-white border border-neutral-200 rounded-md flex justify-between items-center mb-2">
                    <div>
                      <p className="font-medium">Pick {index + 1}</p>
                      <p className="text-sm text-primary-700">Team {team.teamNumber}</p>
                      <p className="text-xs text-neutral-500">{team.teamName}</p>
                    </div>
                    <button 
                      onClick={() => handleRemoveTeam(teamNumber)}
                      className="p-1.5 rounded-full text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
                    >
                      <X size={16} />
                    </button>
                  </div>
                );
              })}
              
              {selectedTeams.length < 2 && (
                Array.from({ length: 2 - selectedTeams.length }).map((_, index) => (
                  <div key={`empty-${index}`} className="p-3 border border-dashed border-neutral-300 rounded-md flex justify-center items-center mb-2 bg-white">
                    <p className="text-sm text-neutral-400">Select Pick {selectedTeams.length + index + 1}</p>
                  </div>
                ))
              )}
            </div>
            
            <div className="space-y-3">
              <button
                onClick={handleSaveAlliance}
                className="w-full py-2 px-4 bg-primary-500 text-white rounded-md hover:bg-primary-600 flex items-center justify-center"
                disabled={selectedTeams.length === 0}
              >
                <Check size={16} className="mr-2" />
                Save Alliance
              </button>
              
              <button
                onClick={handleExportAlliance}
                className="w-full py-2 px-4 bg-white text-neutral-700 border border-neutral-300 rounded-md hover:bg-neutral-50 flex items-center justify-center"
                disabled={selectedTeams.length === 0}
              >
                <Download size={16} className="mr-2" />
                Export Selection
              </button>
            </div>
          </div>
          
          {selectedTeams.length > 0 && (
            <div className="bg-neutral-50 rounded-lg border border-neutral-200 p-4">
              <h3 className="font-semibold mb-3">Alliance Strengths</h3>
              <ul className="list-disc list-inside text-sm space-y-1 text-neutral-700">
                <li>Strong scoring capabilities across all positions</li>
                <li>Complementary autonomous routines</li>
                <li>{selectedTeams.length > 1 ? 'Multiple climbing options' : 'Enhanced climbing capability'}</li>
                <li>Good balance of offense and defense</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllianceBuilder;