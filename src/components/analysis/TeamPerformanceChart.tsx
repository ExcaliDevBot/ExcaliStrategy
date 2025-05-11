import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

interface TeamPerformanceChartProps {
  teamNumber: number;
}

// This would typically come from Firebase
const generateMockData = (teamNumber: number) => {
  // Generate semi-random but consistent data for a team
  const seed = teamNumber % 10;
  
  return Array.from({ length: 10 }, (_, i) => {
    const match = i + 1;
    const autoBase = 6 + seed * 0.5;
    const teleopBase = 25 + seed * 1.5;
    const endgameBase = 8 + seed * 0.8;
    
    const autoVariation = Math.sin(match * 0.5) * 3;
    const teleopVariation = Math.cos(match * 0.3) * 5;
    const endgameVariation = ((match % 3) - 1) * 4;
    
    return {
      match,
      auto: Math.max(0, Math.round((autoBase + autoVariation) * 10) / 10),
      teleop: Math.max(0, Math.round((teleopBase + teleopVariation) * 10) / 10),
      endgame: Math.max(0, Math.round((endgameBase + endgameVariation) * 10) / 10),
      total: Math.max(0, Math.round((autoBase + autoVariation + teleopBase + teleopVariation + endgameBase + endgameVariation) * 10) / 10)
    };
  });
};

const TeamPerformanceChart: React.FC<TeamPerformanceChartProps> = ({ teamNumber }) => {
  const [chartType, setChartType] = useState<'stacked' | 'line'>('stacked');
  const data = generateMockData(teamNumber);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Match Performance History</h3>
        <div className="flex space-x-2">
          <button
            className={`px-3 py-1 text-sm rounded-md ${
              chartType === 'stacked'
                ? 'bg-primary-100 text-primary-700'
                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            }`}
            onClick={() => setChartType('stacked')}
          >
            Stacked Bar
          </button>
          <button
            className={`px-3 py-1 text-sm rounded-md ${
              chartType === 'line'
                ? 'bg-primary-100 text-primary-700'
                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            }`}
            onClick={() => setChartType('line')}
          >
            Line Chart
          </button>
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'stacked' ? (
            <BarChart
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="match" 
                label={{ value: 'Match Number', position: 'insideBottom', offset: -10 }} 
              />
              <YAxis label={{ value: 'Points', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="auto" name="Auto Points" stackId="a" fill="#012265" />
              <Bar dataKey="teleop" name="Teleop Points" stackId="a" fill="#3B82F6" />
              <Bar dataKey="endgame" name="Endgame Points" stackId="a" fill="#d4af37" />
            </BarChart>
          ) : (
            <LineChart
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="match" 
                label={{ value: 'Match Number', position: 'insideBottom', offset: -10 }} 
              />
              <YAxis label={{ value: 'Points', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="total" name="Total Points" stroke="#012265" strokeWidth={2} />
              <Line type="monotone" dataKey="auto" name="Auto Points" stroke="#3B82F6" />
              <Line type="monotone" dataKey="teleop" name="Teleop Points" stroke="#10B981" />
              <Line type="monotone" dataKey="endgame" name="Endgame Points" stroke="#d4af37" />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TeamPerformanceChart;