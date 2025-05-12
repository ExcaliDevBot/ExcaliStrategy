import React, {useEffect, useState} from 'react';

const TeamMatches: React.FC = () => {
    const [matches, setMatches] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const teamNumber = '6738';
    const eventKey = '2025isde4';
    const apiKey = 'DGOg0BIAQjm8EO3EkO50txFeLxpklBtotoW9qnHxUzoeecJIlRzOz8CsgNjZ4fyO';

    useEffect(() => {
        const fetchMatches = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await fetch(
                    `https://www.thebluealliance.com/api/v3/team/frc${teamNumber}/event/${eventKey}/matches`,
                    {
                        headers: {'X-TBA-Auth-Key': apiKey},
                    }
                );

                if (!response.ok) throw new Error(`Error: ${response.statusText}`);

                const data = await response.json();

                const processed = data.map((match: any) => {
                    const red = match.alliances.red.team_keys.map((t: string) => t.replace('frc', ''));
                    const blue = match.alliances.blue.team_keys.map((t: string) => t.replace('frc', ''));
                    const yourTeam = red.includes(teamNumber) || blue.includes(teamNumber);
                    const time = match.time
                        ? new Date(match.time * 1000).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                        })
                        : 'TBD';

                    return {
                        number: match.match_number,
                        red,
                        blue,
                        yourTeam,
                        time,
                    };
                });

                // Shift two matches in a row
                if (processed.length > 1) {
                    const temp = processed[0];
                    processed[0] = processed[1];
                    processed[1] = temp;
                }

                setMatches(processed);
            } catch (err: any) {
                console.error(err);
                setError('Failed to fetch matches.');
            } finally {
                setLoading(false);
            }
        };

        fetchMatches();
    }, [teamNumber, eventKey]);
    return (
        <div className="p-4 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold text-neutral-800 mb-3">Team {teamNumber} Matches</h2>

            {loading ? (
                <p className="text-neutral-500">Loading matches...</p>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : matches.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {matches.map((match) => (
                        <div
                            key={match.number}
                            className={`p-2 rounded-md border text-sm ${
                                match.yourTeam
                                    ? 'border-blue-400 bg-blue-50'
                                    : 'border-neutral-200 bg-neutral-50'
                            }`}
                        >
                            <div className="flex justify-between items-center mb-1">
                                <span className="font-medium text-neutral-700">Match {match.number}</span>
                                <span className="text-xs text-neutral-500">{match.time}</span>
                            </div>

                            <div className="flex text-xs">
                                <div className="w-1/2 pr-1">
                                    <p className="text-red-500 mb-0.5 font-bold">Red</p>
                                    <div className="flex flex-wrap gap-0.5">
                                        {match.red.map((team: string, i: number) => (
                                            <span
                                                key={i}
                                                className={`min-w-[40px] text-center px-3 py-1.5 rounded text-sm ${
                                                    team === teamNumber
                                                        ? 'bg-blue-100 text-blue-700 font-medium'
                                                        : 'bg-white text-neutral-500 border border-neutral-200'
                                                }`}
                                            >
                                {team}
                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="w-1/2 pl-1">
                                    <p className="text-blue-700 mb-0.5 font-bold">Blue</p>
                                    <div className="flex flex-wrap gap-0.5">
                                        {match.blue.map((team: string, i: number) => (
                                            <span
                                                key={i}
                                                className={`min-w-[40px] text-center px-3 py-1.5 rounded text-sm ${
                                                    team === teamNumber
                                                        ? 'bg-blue-100 text-blue-700 font-medium'
                                                        : 'bg-white text-neutral-500 border border-neutral-200'
                                                }`}
                                            >
                                {team}
                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-neutral-500">No matches found.</p>
            )}
        </div>
    );
};

export default TeamMatches;
