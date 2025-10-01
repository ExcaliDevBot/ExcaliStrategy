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
import { getStatboticsTeamEventMatches } from '../../services/statboticsService';

interface TeamPerformanceChartProps {
    teamNumber: number;
    dataSource?: 'scouting' | 'statbotics';
    eventKey?: string;
}

const TeamPerformanceChart: React.FC<TeamPerformanceChartProps> = ({teamNumber, dataSource='scouting', eventKey='2025iscmp'}) => {
    const [chartType, setChartType] = useState<'stacked' | 'line'>('stacked');
    interface PerfRow { rawMatch: string; match: string; auto: number; teleop: number; endgame: number; total: number; source: 'statbotics' | 'scouting'; }
    const [data, setData] = useState<PerfRow[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                if (dataSource === 'statbotics') {
                    const matches = await getStatboticsTeamEventMatches(teamNumber, eventKey);
                    const formatted: PerfRow[] = matches.map(m => {
                        const numeric = (m.match || '').replace(/^[^0-9]*/, '');
                        const auto = m.epa_breakdown?.auto ?? m.epa_breakdown?.auto_points ?? 0;
                        const teleop = m.epa_breakdown?.teleop ?? m.epa_breakdown?.teleop_points ?? 0;
                        const endgame = m.epa_breakdown?.endgame ?? m.epa_breakdown?.endgame_points ?? 0;
                        const total = m.epa_breakdown?.total ?? m.epa_breakdown?.total_points ?? (auto+teleop+endgame);
                        return { rawMatch: m.match, match: numeric || m.match, auto, teleop, endgame, total, source: 'statbotics' };
                    }).sort((a,b)=> parseInt(a.match)-parseInt(b.match));
                    setData(formatted);
                } else {
                    const db = getDatabase();
                    const matchesRef = ref(db, `processedData/${teamNumber}matches/`);
                    const snapshot = await get(matchesRef);
                    if (snapshot.exists()) {
                        const rawData = snapshot.val();
                        const formattedData: PerfRow[] = Object.keys(rawData)
                            .map((matchKey) => {
                                const matchNumberMatch = matchKey.match(/M(\d+)/);
                                const matchNumber = matchNumberMatch ? matchNumberMatch[1] : matchKey;
                                const {autoScore, teleopScore, endgameScore} = rawData[matchKey];
                                const auto = autoScore || 0;
                                const teleop = teleopScore || 0;
                                const endgame = endgameScore || 0;
                                const total = auto + teleop + endgame;
                                return { rawMatch: matchKey, match: matchNumber, auto, teleop, endgame, total, source: 'scouting' };
                            })
                            .sort((a, b) => parseInt(a.match) - parseInt(b.match));
                         setData(formattedData);
                    } else {
                        setData([]);
                    }
                }
            } catch (e) {
                console.error('Error fetching data:', e);
                setError('Failed to load chart data');
                setData([]);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [teamNumber, dataSource, eventKey]);

    if (loading) {
        return <div className="h-80 flex items-center justify-center text-neutral-500 text-sm">Loading chart...</div>;
    }
    if (error) {
        return <div className="h-80 flex items-center justify-center text-neutral-500 text-sm">{error}</div>;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Match Performance History</h3>
                <div className="text-xs text-neutral-400 mr-4">Source: {dataSource === 'statbotics' ? 'Statbotics' : 'Scouting'}</div>
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
            <div className="mt-6">
              <h4 className="text-sm font-semibold mb-2">Match Breakdown</h4>
              <div className="overflow-x-auto border border-neutral-200 rounded-md max-h-72">
                <table className="min-w-full text-xs">
                  <thead className="bg-neutral-100 sticky top-0 z-10">
                    <tr className="text-neutral-600">
                      <th className="py-2 px-2 text-left">#</th>
                      <th className="py-2 px-2 text-right">Auto</th>
                      <th className="py-2 px-2 text-right">Teleop</th>
                      <th className="py-2 px-2 text-right">Endgame</th>
                      <th className="py-2 px-2 text-right">Total</th>
                      <th className="py-2 px-2 text-center">Src</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.length === 0 && (
                      <tr><td colSpan={6} className="py-4 px-3 text-center text-neutral-500">No match data available.</td></tr>
                    )}
                    {data.map(row => (
                      <tr key={row.rawMatch} className="border-t hover:bg-neutral-50">
                        <td className="py-1.5 px-2 font-medium">{row.match}</td>
                        <td className="py-1.5 px-2 text-right">{row.auto}</td>
                        <td className="py-1.5 px-2 text-right">{row.teleop}</td>
                        <td className="py-1.5 px-2 text-right">{row.endgame}</td>
                        <td className="py-1.5 px-2 text-right font-semibold">{row.total}</td>
                        <td className="py-1.5 px-2 text-center">
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${row.source==='statbotics' ? 'bg-blue-100 text-blue-700' : 'bg-primary-100 text-primary-700'}`}>{row.source==='statbotics' ? 'SB' : 'SC'}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
        </div>
    );
};

export default TeamPerformanceChart;