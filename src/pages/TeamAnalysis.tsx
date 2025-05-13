import React, {useState, useEffect} from 'react';
import {Search, BarChart2} from 'lucide-react';
import TeamStatsTable from '../components/analysis/TeamStatsTable';
import TeamPerformanceChart from '../components/analysis/TeamPerformanceChart';
import {calculateAndStoreAverages, getTBAStats} from '../../functions/src';
import TeamComparisonChart from "../components/analysis/TeamComparisonChart.tsx";
import { calculatePerformanceTrend } from '../../functions/src';

interface Team {
    team_number: number;
    nickname: string | null;
}

const TeamAnalysis: React.FC = () => {
    const [searchTeam, setSearchTeam] = useState('');
    const [selectedTeam, setSelectedTeam] = useState<number | null>(null);
    const [selectedTab, setSelectedTab] = useState<'performance' | 'comparison'>('performance');
    const [teams, setTeams] = useState<{ teamNumber: number; teamName: string }[]>([]);

    useEffect(() => {
        const fetchTeams = async () => {
            const eventKey = localStorage.getItem('eventKey') || '2025iscmp';
            const apiKey = 'DGOg0BIAQjm8EO3EkO50txFeLxpklBtotoW9qnHxUzoeecJIlRzOz8CsgNjZ4fyO';

            try {
                const response = await fetch(
                    `https://www.thebluealliance.com/api/v3/event/${eventKey}/teams`,
                    {
                        headers: {
                            'X-TBA-Auth-Key': apiKey,
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error(`Error fetching teams: ${response.statusText}`);
                }

                const data = await response.json();
                const formattedTeams = data.map((team: Team) => ({
                    teamNumber: team.team_number,
                    teamName: team.team_number === 6738 ? 'Our Team' : team.nickname || 'Unknown Team',
                }));
                setTeams(formattedTeams);
            } catch (error) {
                console.error('Error fetching teams:', error);
            }
        };

        fetchTeams();
    }, []);

    const filteredTeams = teams.filter(team =>
        team.teamNumber.toString().includes(searchTeam) ||
        team.teamName.toLowerCase().includes(searchTeam.toLowerCase())
    );

    const handleTeamSelect = async (teamNumber: number) => {
        setSelectedTeam(teamNumber);
        setSelectedTab('performance'); // Reset the tab to ensure graphs refresh

        try {
            await calculateAndStoreAverages(teamNumber);
            await getTBAStats(teamNumber);
            await calculatePerformanceTrend(teamNumber);
        } catch (error) {
            console.error('Error executing team selection commands:', error);
        }
    };

    return (
        <div className="animate-fade-in">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-neutral-900">Team Analysis</h1>
                <p className="text-neutral-500">Analyze performance data and team comparisons</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg shadow-sm p-4 border border-neutral-200">
                    <div className="relative mb-4">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search size={16} className="text-neutral-400"/>
                        </div>
                        <input
                            type="text"
                            placeholder="Search teams..."
                            className="pl-10 p-2 w-full border border-neutral-300 rounded-md"
                            value={searchTeam}
                            onChange={(e) => setSearchTeam(e.target.value)}
                        />
                    </div>

                    <div className="space-y-1 max-h-[calc(100vh-300px)] overflow-y-auto">
                        {filteredTeams.map((team, index) => (
                            <button
                                key={team.teamNumber || index}
                                className={`w-full text-left px-3 py-2 rounded-md ${
                                    selectedTeam === team.teamNumber
                                        ? 'bg-primary-50 text-primary-700 font-medium'
                                        : 'hover:bg-neutral-50'
                                }`}
                                onClick={() => handleTeamSelect(team.teamNumber)}
                            >
                                <div className="font-medium">{team.teamNumber}</div>
                                <div className="text-sm text-neutral-500">{team.teamName}</div>
                            </button>
                        ))}

                        {filteredTeams.length === 0 && (
                            <div className="text-center p-4 text-neutral-500">
                                No teams found with that search term.
                            </div>
                        )}
                    </div>
                </div>

                <div className="lg:col-span-3">
                    {selectedTeam ? (
                        <div className="bg-white rounded-lg shadow-sm border border-neutral-200">
                            <div className="border-b border-neutral-200">
                                <div className="flex">
                                    <button
                                        className={`px-4 py-3 font-medium text-sm flex items-center ${
                                            selectedTab === 'performance'
                                                ? 'text-primary-500 border-b-2 border-primary-500'
                                                : 'text-neutral-500 hover:text-neutral-800'
                                        }`}
                                        onClick={() => setSelectedTab('performance')}
                                    >
                                        <BarChart2 size={16} className="mr-2"/>
                                        Team Performance
                                    </button>
                                    <button
                                        className={`px-4 py-3 font-medium text-sm flex items-center ${
                                            selectedTab === 'comparison'
                                                ? 'text-primary-500 border-b-2 border-primary-500'
                                                : 'text-neutral-500 hover:text-neutral-800'
                                        }`}
                                        onClick={() => setSelectedTab('comparison')}
                                    >
                                        <Search size={16} className="mr-2"/>
                                        Team Comparison
                                    </button>
                                </div>
                            </div>

                            <div className="p-4">
                                {selectedTab === 'performance' ? (
                                    <div className="space-y-6">
                                        <TeamStatsTable teamNumber={selectedTeam}/>
                                        <TeamPerformanceChart teamNumber={selectedTeam}/>
                                    </div>
                                ) : (
                                    <TeamComparisonChart teamNumber={selectedTeam}/>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                            <BarChart2 size={40} className="mx-auto text-neutral-300 mb-4"/>
                            <h2 className="text-xl font-semibold mb-2">Select a Team</h2>
                            <p className="text-neutral-500">
                                Choose a team from the sidebar to view detailed performance analysis and statistics.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TeamAnalysis;