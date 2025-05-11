import React from 'react';
import { Clock, Users, Layout, FileText } from 'lucide-react';

// This would typically come from Firebase
const mockStrategy = {
  matchNumber: 24,
  matchType: 'qualification',
  time: '10:15 AM',
  allianceColor: 'red',
  alliance: ['148', '254', '118'],
  opponents: ['1114', '2056', '1678'],
  gameplan: "Focus on scoring high goals and playing defense against their strongest scorer (1114). Our alliance has superior autonomous capabilities, so we should aim for a strong lead in the first 15 seconds.",
  autoStrategy: "Our team (148): Score pre-loaded game piece and exit tarmac.\nTeam 254: Score two game pieces from loading zone.\nTeam 118: Score one game piece and play defense on 1114.",
  teleopStrategy: "Our team: Focus on high goal scoring and cycling game pieces.\nTeam 254: Continue high goal scoring.\nTeam 118: Split time between scoring and playing defense on 1114.",
  endgameStrategy: "All teams should aim to climb. Our team takes low rung, 254 takes mid rung, 118 takes high rung.",
  defensiveStrategy: "Team 118 should focus defense on team 1114, their strongest scorer. If we're ahead by more than 20 points in the last minute, have 254 also switch to defense.",
  backupPlans: "If 118's climb mechanism fails, they should continue scoring until the end. If we're significantly behind, all robots should focus on scoring and abandon defense.",
  notes: "Team 1114 has been experiencing connectivity issues in previous matches. Their autonomous mode has failed twice today.",
};

const MatchStrategyNotes: React.FC = () => {
  const handlePrintBriefing = () => {
    alert('This would print or export the strategy briefing document');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold">Match {mockStrategy.matchNumber} Strategy</h3>
          <p className="text-neutral-500">
            {mockStrategy.matchType.charAt(0).toUpperCase() + mockStrategy.matchType.slice(1)} Match
          </p>
        </div>
        <button
          onClick={handlePrintBriefing}
          className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 flex items-center"
        >
          <FileText size={16} className="mr-2" />
          Print Briefing
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center bg-neutral-50 p-3 rounded-lg">
          <Clock size={16} className="text-neutral-500 mr-2" />
          <div>
            <p className="text-sm text-neutral-500">Match Time</p>
            <p className="font-medium">{mockStrategy.time}</p>
          </div>
        </div>
        
        <div className="flex items-center bg-neutral-50 p-3 rounded-lg">
          <div className={`w-3 h-3 rounded-full ${
            mockStrategy.allianceColor === 'red' ? 'bg-red-500' : 'bg-blue-500'
          } mr-2`}></div>
          <div>
            <p className="text-sm text-neutral-500">Alliance Color</p>
            <p className="font-medium">
              {mockStrategy.allianceColor.charAt(0).toUpperCase() + mockStrategy.allianceColor.slice(1)}
            </p>
          </div>
        </div>
        
        <div className="flex items-center bg-neutral-50 p-3 rounded-lg">
          <Layout size={16} className="text-neutral-500 mr-2" />
          <div>
            <p className="text-sm text-neutral-500">Field Position</p>
            <p className="font-medium">TBD</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-primary-50 p-4 rounded-lg border border-primary-100">
          <h4 className="font-semibold mb-2 flex items-center text-primary-800">
            <Users size={16} className="mr-2" />
            Your Alliance
          </h4>
          <div className="space-y-2">
            {mockStrategy.alliance.map((team, index) => (
              <div key={index} className="flex justify-between bg-white p-2 rounded-md border border-primary-100">
                <span className="font-medium">{team}</span>
                <span className="text-neutral-500">
                  {index === 0 ? 'Your Team' : `Partner ${index}`}
                </span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-neutral-100 p-4 rounded-lg border border-neutral-200">
          <h4 className="font-semibold mb-2 flex items-center">
            <Users size={16} className="mr-2" />
            Opponent Alliance
          </h4>
          <div className="space-y-2">
            {mockStrategy.opponents.map((team, index) => (
              <div key={index} className="flex justify-between bg-white p-2 rounded-md border border-neutral-200">
                <span className="font-medium">{team}</span>
                <span className="text-neutral-500">
                  Opponent {index + 1}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white p-5 rounded-lg border border-neutral-200">
        <h4 className="font-semibold mb-4">Overall Game Plan</h4>
        <p className="text-neutral-700 bg-neutral-50 p-3 rounded-md">
          {mockStrategy.gameplan}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-semibold mb-3">Autonomous Strategy</h4>
          <div className="bg-neutral-50 p-3 rounded-md border border-neutral-200 whitespace-pre-line text-neutral-700">
            {mockStrategy.autoStrategy}
          </div>
        </div>
        
        <div>
          <h4 className="font-semibold mb-3">Teleop Strategy</h4>
          <div className="bg-neutral-50 p-3 rounded-md border border-neutral-200 whitespace-pre-line text-neutral-700">
            {mockStrategy.teleopStrategy}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-semibold mb-3">Endgame Strategy</h4>
          <div className="bg-neutral-50 p-3 rounded-md border border-neutral-200 whitespace-pre-line text-neutral-700">
            {mockStrategy.endgameStrategy}
          </div>
        </div>
        
        <div>
          <h4 className="font-semibold mb-3">Defensive Strategy</h4>
          <div className="bg-neutral-50 p-3 rounded-md border border-neutral-200 whitespace-pre-line text-neutral-700">
            {mockStrategy.defensiveStrategy}
          </div>
        </div>
      </div>

      <div>
        <h4 className="font-semibold mb-3">Backup Plans</h4>
        <div className="bg-neutral-50 p-3 rounded-md border border-neutral-200 text-neutral-700">
          {mockStrategy.backupPlans}
        </div>
      </div>

      <div>
        <h4 className="font-semibold mb-3">Additional Notes</h4>
        <div className="bg-yellow-50 p-3 rounded-md border border-yellow-200 text-neutral-700">
          {mockStrategy.notes}
        </div>
      </div>
    </div>
  );
};

export default MatchStrategyNotes;