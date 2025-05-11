import React, { useState } from 'react';
import { Search, Filter, Download } from 'lucide-react';

// This would typically come from Firebase
const mockScoutingData = [
  {
    id: '1',
    matchNumber: 5,
    teamNumber: 254,
    alliance: 'blue',
    scoutName: 'John Smith',
    timestamp: new Date('2025-03-10T14:30:00').getTime(),
    autoGamePieceScored: 2,
    teleopGamePieceScored: 8,
    climbLevel: 3,
    notes: 'Excellent performance, consistent scoring'
  },
  {
    id: '2',
    matchNumber: 8,
    teamNumber: 1114,
    alliance: 'red',
    scoutName: 'Sarah Johnson',
    timestamp: new Date('2025-03-10T15:15:00').getTime(),
    autoGamePieceScored: 3,
    teleopGamePieceScored: 7,
    climbLevel: 2,
    notes: 'Strong autonomous, weak endgame'
  },
  {
    id: '3',
    matchNumber: 12,
    teamNumber: 118,
    alliance: 'blue',
    scoutName: 'Mike Davis',
    timestamp: new Date('2025-03-10T16:00:00').getTime(),
    autoGamePieceScored: 1,
    teleopGamePieceScored: 10,
    climbLevel: 3,
    notes: 'Excellent teleop control, reliable climber'
  },
  {
    id: '4',
    matchNumber: 15,
    teamNumber: 2056,
    alliance: 'red',
    scoutName: 'Emily Chen',
    timestamp: new Date('2025-03-10T16:45:00').getTime(),
    autoGamePieceScored: 2,
    teleopGamePieceScored: 9,
    climbLevel: 3,
    notes: 'Well-rounded robot, strong in all phases'
  },
  {
    id: '5',
    matchNumber: 18,
    teamNumber: 1678,
    alliance: 'blue',
    scoutName: 'Alex Rodriguez',
    timestamp: new Date('2025-03-10T17:30:00').getTime(),
    autoGamePieceScored: 3,
    teleopGamePieceScored: 6,
    climbLevel: 1,
    notes: 'Very strong auto, climb mechanism failed'
  },
];

const ScoutingHistory: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'team', 'match'

  const filteredData = mockScoutingData.filter(entry => {
    if (searchTerm === '') return true;
    
    if (filter === 'team') {
      return entry.teamNumber.toString().includes(searchTerm);
    } else if (filter === 'match') {
      return entry.matchNumber.toString().includes(searchTerm);
    }
    
    return (
      entry.teamNumber.toString().includes(searchTerm) ||
      entry.matchNumber.toString().includes(searchTerm) ||
      entry.scoutName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.notes.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const handleExportData = () => {
    alert('This would export the scouting data (e.g., as CSV or JSON)');
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={16} className="text-neutral-400" />
          </div>
          <input
            type="text"
            placeholder="Search by team, match, or keyword..."
            className="pl-10 p-2 w-full border border-neutral-300 rounded-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center">
          <Filter size={16} className="text-neutral-400 mr-2" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="p-2 border border-neutral-300 rounded-md bg-white"
          >
            <option value="all">All Fields</option>
            <option value="team">Team Number</option>
            <option value="match">Match Number</option>
          </select>
        </div>
        
        <button
          onClick={handleExportData}
          className="px-4 py-2 bg-secondary-500 text-primary-900 rounded-md hover:bg-secondary-600 flex items-center justify-center"
        >
          <Download size={16} className="mr-2" />
          Export Data
        </button>
      </div>
      
      <div className="overflow-x-auto bg-white rounded-lg border border-neutral-200">
        <table className="min-w-full">
          <thead>
            <tr className="bg-neutral-50 border-b border-neutral-200">
              <th className="py-3 px-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Match</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Team</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Alliance</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Scout</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Time</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Auto</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Teleop</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Climb</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            {filteredData.map((entry) => (
              <tr key={entry.id} className="hover:bg-neutral-50">
                <td className="py-3 px-4 text-sm text-neutral-900">{entry.matchNumber}</td>
                <td className="py-3 px-4 text-sm font-medium text-primary-700">{entry.teamNumber}</td>
                <td className="py-3 px-4 text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    entry.alliance === 'red' 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {entry.alliance}
                  </span>
                </td>
                <td className="py-3 px-4 text-sm text-neutral-500">{entry.scoutName}</td>
                <td className="py-3 px-4 text-sm text-neutral-500">{formatDate(entry.timestamp)}</td>
                <td className="py-3 px-4 text-sm text-neutral-900">{entry.autoGamePieceScored}</td>
                <td className="py-3 px-4 text-sm text-neutral-900">{entry.teleopGamePieceScored}</td>
                <td className="py-3 px-4 text-sm text-neutral-900">{entry.climbLevel}</td>
                <td className="py-3 px-4 text-sm text-neutral-500 max-w-[200px] truncate" title={entry.notes}>
                  {entry.notes}
                </td>
              </tr>
            ))}
            
            {filteredData.length === 0 && (
              <tr>
                <td colSpan={9} className="py-4 px-4 text-sm text-center text-neutral-500">
                  No matching scouting data found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ScoutingHistory;