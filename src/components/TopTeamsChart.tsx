import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label } from 'recharts';

const TopTeamsChart: React.FC = () => {
  const [data, setData] = useState<{ team: string; name: string; score: number }[]>([]);

  useEffect(() => {
    const fetchTopTeams = async () => {
      const eventKey = localStorage.getItem('eventKey') || '2025isde4';
      const apiKey = 'DGOg0BIAQjm8EO3EkO50txFeLxpklBtotoW9qnHxUzoeecJIlRzOz8CsgNjZ4fyO';

      try {
        const response = await fetch(
          `https://www.thebluealliance.com/api/v3/event/${eventKey}/rankings`,
          {
            headers: {
              'X-TBA-Auth-Key': apiKey,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Error fetching rankings: ${response.statusText}`);
        }

        const rankings = await response.json();
        const topTeams = rankings.rankings.slice(0, 7).map((team: any) => ({
          team: team.team_key.replace('frc', ''),
          name: team.nickname || `Team ${team.team_key.replace('frc', '')}`,
          score: team.sort_orders[0], // Adjust based on the API's ranking data structure
        }));

        setData(topTeams);
      } catch (error) {
        console.error('Error fetching top teams:', error);
      }
    };

    fetchTopTeams();
  }, []);

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#012265" />
          <XAxis
            dataKey="team"
            angle={-45}
            textAnchor="end"
            height={60}
            tickFormatter={(value) => `Team ${value}`}
          >
            <Label value="Teams" offset={-30} position="insideBottom" />
          </XAxis>
          <YAxis>
            <Label value="Score" angle={-90} position="insideLeft" />
          </YAxis>
          <Tooltip
            content={({ payload }) => {
              if (payload && payload.length) {
                const { team, name, score } = payload[0].payload;
                return (
                  <div className="bg-white p-2 border rounded shadow">
                    <p><strong>{`Team ${team}`}</strong></p>
                    <p>{`Name: ${name}`}</p>
                    <p>{`Score: ${score}`}</p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend />
          <Bar
            dataKey="score"
            name=""
            fill="url(#colorGradient)"
            radius={[4, 4, 0, 0]}
          />
          <defs>
            <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#012265" />
              <stop offset="100%" stopColor="#012225" />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TopTeamsChart;