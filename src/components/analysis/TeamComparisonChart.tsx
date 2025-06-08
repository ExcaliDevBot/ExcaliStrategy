import React, { useState } from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from 'recharts';

interface TeamComparisonChartProps {
  teamNumber: number;
}

// This would typically come from Firebase
const generateMockComparisonData = (selectedTeamNumber: number) => {
  // These would come from actual team data
  const teams = [
    { 
      teamNumber: selectedTeamNumber, 
      name: 'Selected Team',
      color: '#012265',
    },
    { 
      teamNumber: 6738, // Your team
      name: 'Your Team',
      color: '#d4af37',
    },
    { 
      teamNumber: 1690, // Top team
      name: 'Top Ranked Team',
      color: '#10B981',
    }
  ];

  const seed = selectedTeamNumber % 10;
  
  const categories = [
    { name: 'Auto', fullMark: 100 },
    { name: 'Teleop', fullMark: 20 },
    { name: 'Endgame', fullMark: 100 },
    { name: 'Defense', fullMark: 100 },
    { name: 'Driver Skill', fullMark: 100 },
    { name: 'Consistency', fullMark: 100 },
  ];
  
  return {
    teams,
    data: categories.map(category => {
      const result: any = { name: category.name };
      
      teams.forEach(team => {
        // Generate score based on team number and category
        let baseScore;
        const teamSeed = team.teamNumber % 10;
        
        switch (category.name) {
          case 'Auto':
            baseScore = 60 + teamSeed * 4;
            break;
          case 'Teleop':
            baseScore = 70 + teamSeed * 3;
            break;
          case 'Endgame':
            baseScore = 65 + teamSeed * 3.5;
            break;
          case 'Defense':
            baseScore = 50 + teamSeed * 5;
            break;
          case 'Driver Skill':
            baseScore = 1 + teamSeed * 3;
            break;
          case 'Consistency':
            baseScore = 55 + teamSeed * 4.5;
            break;
          default:
            baseScore = 50 + teamSeed * 5;
        }
        
        // Add some randomization but keep it consistent
        const hash = category.name.length * team.teamNumber;
        const variation = (hash % 10) - 5;
        
        result[team.teamNumber] = Math.min(100, Math.max(0, baseScore + variation));
      });
      
      return result;
    })
  };
};

const TeamComparisonChart: React.FC<TeamComparisonChartProps> = ({ teamNumber }) => {
  const { teams, data } = generateMockComparisonData(teamNumber);
  const [compareTeams, setCompareTeams] = useState<number[]>([teamNumber, 148, 254]);

  const toggleTeam = (teamNumber: number) => {
    if (compareTeams.includes(teamNumber)) {
      setCompareTeams(compareTeams.filter(t => t !== teamNumber));
    } else {
      setCompareTeams([...compareTeams, teamNumber]);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Team Comparison</h3>
        <p className="text-neutral-500 text-sm">
          Compare performance metrics between teams to identify strengths and weaknesses.
        </p>
        
        <div className="flex flex-wrap gap-2 mt-4">
          {teams.map(team => (
            <button
              key={team.teamNumber}
              className={`px-3 py-1 text-sm rounded-md border ${
                compareTeams.includes(team.teamNumber)
                  ? 'bg-neutral-100 border-neutral-300 font-medium'
                  : 'border-neutral-200 text-neutral-500'
              }`}
              onClick={() => toggleTeam(team.teamNumber)}
              style={{ 
                color: compareTeams.includes(team.teamNumber) ? team.color : undefined,
                borderColor: compareTeams.includes(team.teamNumber) ? team.color : undefined,
                opacity: compareTeams.includes(team.teamNumber) ? 1 : 0.6
              }}
            >
              {team.name} ({team.teamNumber})
            </button>
          ))}
        </div>
      </div>

      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
            <PolarGrid />
            <PolarAngleAxis dataKey="name" />
            <PolarRadiusAxis angle={30} domain={[0, 100]} />
            
            {teams
              .filter(team => compareTeams.includes(team.teamNumber))
              .map(team => (
                <Radar
                  key={team.teamNumber}
                  name={`${team.name} (${team.teamNumber})`}
                  dataKey={team.teamNumber}
                  stroke={team.color}
                  fill={team.color}
                  fillOpacity={0.2}
                />
              ))}
            
            <Legend />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TeamComparisonChart;