import React, {useState, useEffect} from 'react';
import {getDatabase, ref, get} from 'firebase/database';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    LineChart,
    Line
} from 'recharts';

interface TeamPerformanceChartProps {
    teamNumber: number;
}

const TeamPerformanceChart: React.FC<TeamPerformanceChartProps> = ({teamNumber}) => {
    const [chartType, setChartType] = useState<'stacked' | 'line'>('stacked');
    const [data, setData] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const db = getDatabase();
            const matchesRef = ref(db, `processedData/${teamNumber}matches/`);

            console.log('Fetching data from path:', `processedData/${teamNumber}matches/`);

            try {
                const snapshot = await get(matchesRef);
                console.log('Snapshot:', snapshot);

                if (snapshot.exists()) {
                    const rawData = snapshot.val();
                    console.log('Raw data fetched:', rawData);

                    const formattedData = Object.keys(rawData)
                        .map((matchKey) => {
                            const matchNumberMatch = matchKey.match(/M(\d+)/); // Extract the number after "M"
                            const matchNumber = matchNumberMatch ? matchNumberMatch[1] : matchKey; // Default to matchKey if no match
                            const {autoScore, teleopScore, endgameScore} = rawData[matchKey];
                            return {
                                match: matchNumber, // Use the extracted match number
                                auto: autoScore || 0,
                                teleop: teleopScore || 0,
                                endgame: endgameScore || 0,
                                total: (autoScore || 0) + (teleopScore || 0) + (endgameScore || 0),
                            };
                        })
                        .sort((a, b) => parseInt(a.match) - parseInt(b.match)); // Sort by numeric match number
                    setData(formattedData);
                } else {
                    console.error('No data found for the specified team. Snapshot exists:', snapshot.exists());
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [teamNumber]);

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
                            margin={{top: 10, right: 30, left: 0, bottom: 20}}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/>
                            <XAxis
                                dataKey="match"
                                label={{value: 'Match Number', position: 'insideBottom', offset: -10}}
                            />
                            <YAxis label={{value: 'Points', angle: -90, position: 'insideLeft'}}/>
                            <Tooltip/>
                            <Legend/>
                            <Bar dataKey="auto" name="Auto Points" stackId="a" fill="#012265"/>
                            <Bar dataKey="teleop" name="Teleop Points" stackId="a" fill="#3B82F6"/>
                            <Bar dataKey="endgame" name="Endgame Points" stackId="a" fill="#d4af37"/>
                        </BarChart>
                    ) : (
                        <LineChart
                            data={data}
                            margin={{top: 10, right: 30, left: 0, bottom: 20}}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/>
                            <XAxis
                                dataKey="match"
                                label={{value: 'Match Number', position: 'insideBottom', offset: -10}}
                            />
                            <YAxis label={{value: 'Points', angle: -90, position: 'insideLeft'}}/>
                            <Tooltip/>
                            <Legend/>
                            <Line type="monotone" dataKey="total" name="Total Points" stroke="#012265" strokeWidth={2}/>
                            <Line type="monotone" dataKey="auto" name="Auto Points" stroke="#3B82F6"/>
                            <Line type="monotone" dataKey="teleop" name="Teleop Points" stroke="#10B981"/>
                            <Line type="monotone" dataKey="endgame" name="Endgame Points" stroke="#d4af37"/>
                        </LineChart>
                    )}
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default TeamPerformanceChart;