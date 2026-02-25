import React, {useEffect, useState} from 'react';
// @ts-expect-error: Ignore missing type declaration for Firebase module
import {getDatabase, ref, onValue} from '../firebase/firebase.js';

interface Match {
    key: string;
    number: number;
    time: string;
    red: string[];
    blue: string[];
    yourTeam: boolean;
    redScore?: number;
    blueScore?: number;
}

interface MatchData {
    key: string;
    comp_level: string;
    match_number: number;
    time?: number;
    alliances: {
        red: { team_keys: string[]; score: number };
        blue: { team_keys: string[]; score: number };
    };
}

const UpcomingMatches: React.FC = () => {
    const [matchesData, setMatchesData] = useState<Match[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentMatchNumber, setCurrentMatchNumber] = useState<number | null>(null);

    useEffect(() => {
        const db = getDatabase();
        const currentMatchRef = ref(db, 'currentMatch');

        const unsubscribe = onValue(
            currentMatchRef,
            (snapshot: { val: () => unknown }) => {
                const value = snapshot.val() as string | number | null;
                if (value == null) {
                    setCurrentMatchNumber(null);
                    return;
                }
                if (typeof value === 'number') {
                    setCurrentMatchNumber(value);
                } else {
                    const m = value.match(/(\d+)/);
                    const num = m ? parseInt(m[1], 10) : NaN;
                    setCurrentMatchNumber(Number.isNaN(num) ? null : num);
                }
            },
            (error: Error) => {
                console.error('Error fetching currentMatch:', error);
                setCurrentMatchNumber(null);
            }
        );

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const fetchMatches = async () => {
            const eventKey = localStorage.getItem('eventKey') || '2025iscmp';
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
                const quals = (data as MatchData[]).filter(m => m.comp_level === 'qm');

                const formattedMatches: Match[] = quals
                    .map((match) => ({
                        key: match.key,
                        number: match.match_number,
                        time: match.time
                            ? new Date(match.time * 1000).toISOString()
                            : 'TBD',
                        red: match.alliances.red.team_keys.map((team: string) => team.replace('frc', '')),
                        blue: match.alliances.blue.team_keys.map((team: string) => team.replace('frc', '')),
                        yourTeam:
                            match.alliances.red.team_keys.includes('frc6738') ||
                            match.alliances.blue.team_keys.includes('frc6738'),
                        redScore: match.alliances.red.score,
                        blueScore: match.alliances.blue.score,
                    }))
                    .sort((a, b) => a.number - b.number);

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
        return <p className="text-xs text-neutral-500">Loading matches...</p>;
    }

    const windowSize = 7; // 3 previous, current, 3 next
    let startIndex = 0;

    if (currentMatchNumber != null) {
        const currentIndex = matchesData.findIndex(m => m.number === currentMatchNumber);
        if (currentIndex >= 0) {
            startIndex = Math.max(0, currentIndex - 3);
            if (startIndex > Math.max(0, matchesData.length - windowSize)) {
                startIndex = Math.max(0, matchesData.length - windowSize);
            }
        }
    }

    const displayedMatches = matchesData.slice(startIndex, startIndex + windowSize);

    return (
        <div className="space-y-2 pb-0 text-xs">
            {displayedMatches.map((match) => {
                const isCurrent = currentMatchNumber === match.number;
                const isPlayed =
                    typeof match.redScore === 'number' &&
                    typeof match.blueScore === 'number' &&
                    match.redScore >= 0 &&
                    match.blueScore >= 0 &&
                    (currentMatchNumber == null || match.number < currentMatchNumber);

                const redWon = isPlayed && match.redScore! > match.blueScore!;
                const blueWon = isPlayed && match.blueScore! > match.redScore!;

                return (
                    <div
                        key={match.key}
                        className={`rounded-md border px-3 py-2 flex flex-col gap-1 transition-colors ${
                            isCurrent
                                ? 'border-amber-500 bg-amber-50'
                                : 'border-neutral-200 bg-white'
                        }`}
                    >
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <span className="font-medium text-sm">M{match.number}</span>
                                {isCurrent && (
                                    <span className="text-[10px] uppercase tracking-wide text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded-full">
                                        Current
                                    </span>
                                )}
                            </div>
                            <span className="text-[11px] text-neutral-500">
                                {match.time !== 'TBD'
                                    ? new Date(match.time).toLocaleTimeString([], {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                      })
                                    : 'TBD'}
                            </span>
                        </div>

                        <div className="flex gap-2 items-stretch">
                            <div
                                className={`flex-1 rounded px-2 py-1 border text-[11px] ${
                                    redWon
                                        ? 'bg-red-50 border-red-100 text-red-800'
                                        : 'bg-red-50/40 border-red-50 text-neutral-800'
                                }`}
                            >
                                <div className="flex justify-between items-center mb-0.5">
                                    <span className="uppercase tracking-wide text-[10px]">Red</span>
                                    {isPlayed && (
                                        <span className={`font-semibold ${redWon ? 'text-red-700' : 'text-neutral-600'}`}>
                                            {match.redScore}
                                        </span>
                                    )}
                                </div>
                                <div className="truncate">
                                    {match.red.join(' · ')}
                                </div>
                            </div>

                            <div
                                className={`flex-1 rounded px-2 py-1 border text-[11px] ${
                                    blueWon
                                        ? 'bg-blue-50 border-blue-100 text-blue-800'
                                        : 'bg-blue-50/40 border-blue-50 text-neutral-800'
                                }`}
                            >
                                <div className="flex justify-between items-center mb-0.5">
                                    <span className="uppercase tracking-wide text-[10px]">Blue</span>
                                    {isPlayed && (
                                        <span className={`font-semibold ${blueWon ? 'text-blue-700' : 'text-neutral-600'}`}>
                                            {match.blueScore}
                                        </span>
                                    )}
                                </div>
                                <div className="truncate">
                                    {match.blue.join(' · ')}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default UpcomingMatches;
