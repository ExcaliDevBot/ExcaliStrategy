import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { team: '254', name: 'Cheesy Poofs', score: 98 },
  { team: '1114', name: 'Simbotics', score: 94 },
  { team: '118', name: 'Robonauts', score: 91 },
  { team: '2056', name: 'OP Robotics', score: 89 },
  { team: '1678', name: 'Citrus Circuits', score: 87 },
  { team: '3310', name: 'Black Hawk', score: 85 },
  { team: '195', name: 'CyberKnights', score: 83 },
];

const TopTeamsChart: React.FC = () => {
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="team" 
            angle={-45} 
            textAnchor="end" 
            height={60}
            tickFormatter={(value) => `Team ${value}`}
          />
          <YAxis />
          <Tooltip 
            formatter={(value, name, props) => [
              `Score: ${value}`, 
              `${props.payload.team} - ${props.payload.name}`
            ]}
          />
          <Legend />
          <Bar 
            dataKey="score" 
            name="Performance Score" 
            fill="#012265" 
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TopTeamsChart;