import React, { useEffect, useState } from 'react';
import { getDatabase, ref, onValue } from '../firebase/firebase';

interface Match {
    number: number;
    time: string;
    red: string[];
    blue: string[];
    yourTeam: boolean;
}

const UpcomingMatches: React.FC = () => {
    const [matchesData, setMatchesData] = useState<Match[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCurrentMatch = () => {
            const db = getDatabase();
            const currentMatchRef = ref(db, 'currentMatch');

            onValue(
                currentMatchRef,
                (snapshot: { val: () => unknown }) => {
                    const value = snapshot.val();
                    console.log('Current Match:', value ? value.toString() : 'No data available');
                },
                (error: Error) => {
                    console.error('Error fetching currentMatch:', error);
                }
            );
        };

        fetchCurrentMatch();
    }, []);

    const startMatch = 12;
    const matchesToShow = 6;

    useEffect(() => {
        const fetchMatches = async () => {
            const eventKey = localStorage.getItem('eventKey') || '2025isde4';
            const apiKey = 'DGOg0BIAQjm8EO3EkO50txFeLxpklBtotoW9qnHxUzoeecJIlRzOz8CsgNjZ4fyO';

            try {
                const response = await fetch(
                    `https://www.thebluealliance.com/api/v3/event/${eventKey}/matches`,
                    {
                        headers: {
                            'X-TBA-Auth-Key': apiKey,
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error(`Error fetching matches: ${response.statusText}`);
                }

                const data = await response.json();
                const formattedMatches = data
                    .filter((match: { match_number: number }) => match.match_number)
                    .map((match: unknown) => ({
                        number: match.match_number,
                        time: match.time
                            ? new Date(match.time * 1000).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit',
                              })
                            : 'TBD',
                        red: match.alliances.red.team_keys.map((team: string) => team.replace('frc', '')),
                        blue: match.alliances.blue.team_keys.map((team: string) => team.replace('frc', '')),
                        yourTeam:
                            match.alliances.red.team_keys.includes('frc6738') ||
                            match.alliances.blue.team_keys.includes('frc6738'),
                    }));

                setMatchesData(formattedMatches);
            } catch (error) {
                console.error('Error fetching matches:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMatches();
    }, []);

    if (loading) {
        return <p>Loading matches...</p>;
    }

    const displayedMatches = matchesData.slice(startMatch - 1, startMatch - 1 + matchesToShow);

    return (
        <div className="space-y-3 pb-0">
            {displayedMatches.map((match) => (
                <div
                    key={match.number}
                    className={`p-3 rounded-lg border ${
                        match.yourTeam
                            ? 'border-secondary-500 bg-secondary-50'
                            : 'border-neutral-200 bg-white'
                    }`}
                >
                    <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">Match {match.number}</span>
                        <span className="text-sm text-neutral-500">{match.time}</span>
                    </div>

                    <div className="flex">
                        <div className="w-1/2 pr-2">
                            <p className="text-xs text-neutral-500 mb-1">Red Alliance</p>
                            <div className="text-sm">
                                {match.red.map((team, i) => (
                                    <span
                                        key={i}
                                        className={`mr-1 px-1.5 py-0.5 rounded ${
                                            team === '6738'
                                                ? 'bg-secondary-100 text-secondary-800 font-semibold'
                                                : ''
                                        }`}
                                    >
                                        {team}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="w-1/2 pl-2">
                            <p className="text-xs text-neutral-500 mb-1">Blue Alliance</p>
                            <div className="text-sm">
                                {match.blue.map((team, i) => (
                                    <span
                                        key={i}
                                        className={`mr-1 px-1.5 py-0.5 rounded ${
                                            team === '6738'
                                                ? 'bg-secondary-100 text-secondary-800 font-semibold'
                                                : ''
                                        }`}
                                    >
                                        {team}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {match.yourTeam && (
                        <div className="mt-2 text-xs flex items-center text-secondary-600">
                            <span className="w-2 h-2 rounded-full bg-secondary-500 mr-1"></span>
                            Your Team's Match
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default UpcomingMatches;