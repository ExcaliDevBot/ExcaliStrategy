import React, {useEffect, useState} from 'react';
import {getDatabase, ref, onValue} from '../../firebase/firebase';

interface ScoutForm {
    match: number;
    name: string;
    team: number;
    climbOption: string;
    submittedAt: number;
    l4: number;
    autoL4: number;
    notes: string;
    alliance?: string; // New field for alliance
}

const ScoutingHistory: React.FC = () => {
    const [scoutingData, setScoutingData] = useState<ScoutForm[]>([]);

    useEffect(() => {
        const fetchScoutingData = () => {
            const db = getDatabase();
            const scoutingDataRef = ref(db, 'scoutingData');

            onValue(scoutingDataRef, async (snapshot) => {
                const data: ScoutForm[] = [];
                const promises: Promise<void>[] = [];

                snapshot.forEach((childSnapshot) => {
                    const scoutForm = childSnapshot.val();
                    const entry: ScoutForm = {
                        match: scoutForm.Match,
                        name: scoutForm.Name,
                        team: scoutForm.Team,
                        climbOption: scoutForm.ClimbOption || 'No Climb',
                        submittedAt: scoutForm.submittedAt,
                        l4: scoutForm.L4,
                        autoL4: scoutForm.autoL4,
                        notes: scoutForm.Notes,
                    };

                    // Fetch alliance data from TBA
                    const fetchAlliance = async () => {
                        try {
                            const eventKey = localStorage.getItem('eventKey') || '2025isde4';
                            const apiKey = 'DGOg0BIAQjm8EO3EkO50txFeLxpklBtotoW9qnHxUzoeecJIlRzOz8CsgNjZ4fyO';
                            const response = await fetch(
                                `https://www.thebluealliance.com/api/v3/match/${eventKey}_qm${entry.match}`,
                                {
                                    headers: {
                                        'X-TBA-Auth-Key': apiKey,
                                    },
                                }
                            );

                            if (response.ok) {
                                const matchData = await response.json();
                                const isRedAlliance = matchData.alliances.red.team_keys.includes(`frc${entry.team}`);
                                entry.alliance = isRedAlliance ? 'Red' : 'Blue';
                            } else {
                                entry.alliance = 'Unknown';
                            }
                        } catch (error) {
                            console.error('Error fetching alliance data:', error);
                            entry.alliance = 'Error';
                        }
                    };

                    promises.push(fetchAlliance());
                    data.push(entry);
                });

                await Promise.all(promises);
                setScoutingData(data);
            });
        };

        fetchScoutingData();
    }, []);

    const formatDate = (timestamp: number) => {
        const date = new Date(timestamp);
        return date.toLocaleString();
    };

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Scouting History</h1>
            <div className="overflow-x-auto bg-white rounded-lg border border-neutral-200">
                <table className="min-w-full">
                    <thead>
                    <tr className="bg-neutral-50 border-b border-neutral-200">
                        <th className="py-3 px-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Match</th>
                        <th className="py-3 px-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Name</th>
                        <th className="py-3 px-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Team</th>
                        <th className="py-3 px-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Alliance</th>
                        <th className="py-3 px-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Climb
                            Option
                        </th>
                        <th className="py-3 px-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Submitted
                            At
                        </th>
                        <th className="py-3 px-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">L4</th>
                        <th className="py-3 px-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Auto
                            L4
                        </th>
                        <th className="py-3 px-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Notes</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200">
                    {scoutingData.map((entry, index) => (
                        <tr key={index} className="hover:bg-neutral-50">
                            <td className="py-3 px-4 text-sm text-neutral-900">{entry.match}</td>
                            <td className="py-3 px-4 text-sm text-neutral-900">{entry.name}</td>
                            <td className="py-3 px-4 text-sm text-neutral-900">{entry.team}</td>
                            <td className="py-3 px-4 text-sm">
                                {entry.alliance ? (
                                    <span
                                        className={`px-2 py-1 rounded text-white ${
                                            entry.alliance === 'Red' ? 'bg-red-500' : 'bg-blue-500'
                                        }`}
                                    >
      {entry.alliance}
    </span>
                                ) : (
                                    'Loading...'
                                )}
                            </td>
                            <td className="py-3 px-4 text-sm text-neutral-900">{entry.climbOption}</td>
                            <td className="py-3 px-4 text-sm text-neutral-500">{formatDate(entry.submittedAt)}</td>
                            <td className="py-3 px-4 text-sm text-neutral-900">{entry.l4}</td>
                            <td className="py-3 px-4 text-sm text-neutral-900">{entry.autoL4}</td>
                            <td className="py-3 px-4 text-sm text-neutral-500 max-w-[200px] truncate"
                                title={entry.notes}>
                                {entry.notes}
                            </td>
                        </tr>
                    ))}

                    {scoutingData.length === 0 && (
                        <tr>
                            <td colSpan={9} className="py-4 px-4 text-sm text-center text-neutral-500">
                                No scouting data found.
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