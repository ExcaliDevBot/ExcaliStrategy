import React, {useEffect, useState} from 'react';
import {TrendingUp, TrendingDown, ArrowRightFromLine } from 'lucide-react';
import {getDatabase, ref, get} from '../../firebase/firebase';

interface TeamStatsTableProps {
    teamNumber: number;
}

const TeamStatsTable: React.FC<TeamStatsTableProps> = ({teamNumber}) => {
    const [stats, setStats] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const db = getDatabase(); // Initialize Firebase Realtime Database
                const statsRef = ref(db, `processedData/${teamNumber}/`);
                const snapshot = await get(statsRef);

                if (snapshot.exists()) {
                    setStats(snapshot.val());
                } else {
                    console.error('No data available for the team.');
                }
            } catch (error) {
                console.error('Error fetching team stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [teamNumber]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!stats) {
        return <div>No stats available for Team {teamNumber}.</div>;
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Team {teamNumber} Performance Stats</h3>
                <div className="flex items-center text-sm">
                    <span className="text-neutral-500 mr-2">Performance Trend:</span>
                    {stats.performanceTrend === 'upward' ? (
                        <div className="flex items-center text-success">
                            <TrendingUp size={16} className="mr-1"/>
                            <span>Improving</span>
                        </div>
                    ) : stats.performanceTrend === 'stable' ? (
                        <div className="flex items-center text-warning">
                            <ArrowRightFromLine  size={16} className="mr-1"/>
                            <span>Stable</span>
                        </div>
                    ) : (
                        <div className="flex items-center text-error">
                            <TrendingDown size={16} className="mr-1"/>
                            <span>Declining</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 bg-neutral-50 rounded-lg">
                    <div className="text-sm text-neutral-500">Average Auto Score</div>
                    <div className="text-xl font-semibold">{stats.autoL4 * 7 +
                        stats.autoL3 * 6 + stats.autoL2 * 4 + stats.autoL1 * 3 + 3}</div>
                </div>
                <div className="p-3 bg-neutral-50 rounded-lg">
                    <div className="text-sm text-neutral-500">Average Teleop Score</div>
                    <div className="text-xl font-semibold">{stats.autoL4 * 5 +
                        stats.autoL3 * 4 + stats.autoL2 * 3 + stats.autoL1 * 2 + stats.netScore * 4 +
                        stats.netScore * 4 + stats.processorScore * 6}</div>
                </div>
                <div className="p-3 bg-neutral-50 rounded-lg">
                    <div className="text-sm text-neutral-500">Average Endgame Score</div>
                    <div className="text-xl font-semibold">{stats.climbRate * 0.12}</div>
                </div>
                <div className="p-3 bg-neutral-50 rounded-lg">
                    <div className="text-sm text-neutral-500">Average Total Score</div>
                    <div className="text-xl font-semibold">{stats.autoL4 * 7 +
                        stats.autoL3 * 6 + stats.autoL2 * 4 + stats.autoL1 * 3 + 3 + stats.autoL4 * 5 +
                        stats.autoL3 * 4 + stats.autoL2 * 3 + stats.autoL1 * 2 + stats.netScore * 4 +
                        stats.netScore * 4 + stats.processorScore * 6 + stats.climbRate * 0.12}</div>
                </div>
                <div className="p-3 bg-neutral-50 rounded-lg">
                    <div className="text-sm text-neutral-500">Climb Success Rate</div>
                    <div className="text-xl font-semibold">{stats.climbRate}%</div>
                </div>
                <div className="p-3 bg-neutral-50 rounded-lg">
                    <div className="text-sm text-neutral-500">Consistency Rating</div>
                    <div className="text-xl font-semibold">{stats.consistencyRate / 10}/10</div>
                </div>
                <div className="p-3 bg-neutral-50 rounded-lg">
                    <div className="text-sm text-neutral-500">Defense Rating</div>
                    <div className="text-xl font-semibold">
                        {stats.defenseRating < 2 ? "Not Defensive" : `${stats.defenseRating}/10`}
                    </div>
                </div>
                <div className="p-3 bg-neutral-50 rounded-lg">
                    <div className="text-sm text-neutral-500">Matches Played</div>
                    <div className="text-xl font-semibold">{stats.matchesPlayed / 2}</div>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="p-3 bg-primary-50 rounded-lg border border-primary-100">
                    <div className="text-sm text-primary-700">OPR (Offensive Power Rating)</div>
                    <div className="text-xl font-semibold text-primary-800">{stats.opr.toFixed(3)}</div>
                </div>
                <div className="p-3 bg-secondary-50 rounded-lg border border-secondary-100">
                    <div className="text-sm text-secondary-700">DPR (Defensive Power Rating)</div>
                    <div className="text-xl font-semibold text-secondary-800">{stats.dpr.toFixed(3)}</div>
                </div>
                <div className="p-3 bg-neutral-100 rounded-lg border border-neutral-200">
                    <div className="text-sm text-neutral-700">CCWM</div>
                    <div className="text-xl font-semibold text-neutral-800">{stats.ccwm}</div>
                    <div className="text-xs text-neutral-500">(Contribution to Win Margin)</div>
                </div>
            </div>
        </div>
    );
};

export default TeamStatsTable;