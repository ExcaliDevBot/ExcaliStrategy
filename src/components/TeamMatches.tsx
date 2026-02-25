import React, {useEffect, useState} from 'react';

interface TBAMatch {
    match_number: number;
    time: number | null;
    alliances: {
        red: { team_keys: string[] };
        blue: { team_keys: string[] };
    };
}

interface ProcessedMatch {
    number: number;
    red: string[];
    blue: string[];
    yourTeam: boolean;
    time: string;
}

const TeamMatches: React.FC = () => {
    const [matches, setMatches] = useState<ProcessedMatch[]>([]);
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

                const data: TBAMatch[] = await response.json();

                const processed: ProcessedMatch[] = data.map((match: TBAMatch) => {
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
            } catch (err: unknown) {
                console.error(err);
                setError('Failed to fetch matches.');
            } finally {
                setLoading(false);
            }
        };

        fetchMatches();
    }, [teamNumber, eventKey]);

    return (
        <div className="bg-white w-full">
            <h2 className="text-sm font-semibold text-neutral-800 mb-2">6738 Match Schedule</h2>

            {loading ? (
                <p className="text-xs text-neutral-500">Loading matches...</p>
            ) : error ? (
                <p className="text-xs text-red-500">{error}</p>
            ) : matches.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {matches.map((match) => (
                        <div
                            key={match.number}
                            className={`rounded-md border px-3 py-2 flex flex-col gap-2 text-xs transition-colors w-full bg-white ${
                                match.yourTeam ? 'border-amber-400' : 'border-neutral-200'
                            }`}
                        >
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold text-sm">M{match.number}</span>
                                </div>
                                <span className="text-[11px] text-neutral-500 leading-tight">{match.time}</span>
                            </div>

                            <div className="flex gap-2 items-stretch">
                                <div className="flex-1 rounded-md px-2 py-1 border bg-red-50/80 border-red-100 text-[11px]">
                                    <div className="flex justify-between items-center mb-0.5">
                                        <span className="uppercase tracking-wide text-[10px] text-red-700">Red</span>
                                    </div>
                                    <div className="flex flex-wrap gap-1">
                                        {match.red.map((team) => (
                                            <span
                                                key={team}
                                                className={`px-1.5 py-0.5 rounded-sm border text-[11px] leading-tight ${
                                                    team === teamNumber
                                                        ? 'bg-blue-100 border-blue-200 text-blue-700 font-semibold'
                                                        : 'bg-white border-neutral-200 text-neutral-800'
                                                }`}
                                            >
                                                {team}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex-1 rounded-md px-2 py-1 border bg-blue-50/80 border-blue-100 text-[11px]">
                                    <div className="flex justify-between items-center mb-0.5">
                                        <span className="uppercase tracking-wide text-[10px] text-blue-700">Blue</span>
                                    </div>
                                    <div className="flex flex-wrap gap-1">
                                        {match.blue.map((team) => (
                                            <span
                                                key={team}
                                                className={`px-1.5 py-0.5 rounded-sm border text-[11px] leading-tight ${
                                                    team === teamNumber
                                                        ? 'bg-blue-100 border-blue-200 text-blue-700 font-semibold'
                                                        : 'bg-white border-neutral-200 text-neutral-800'
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
                <p className="text-xs text-neutral-500">No matches found.</p>
            )}
        </div>
    );
};

export default TeamMatches;
