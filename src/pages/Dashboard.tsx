import React, {useEffect, useState} from 'react';
import MetricCard from '../components/MetricCard';
import EventSchedule from '../components/EventSchedule';
import TeamMatches from '../components/TeamMatches';
import UpcomingMatches from '../components/UpcomingMatches';
import {Target, Users, Clock, RefreshCw, MapPin} from 'lucide-react';
// @ts-expect-error: Firebase compat SDK has no TypeScript types in this project
import {getDatabase, ref, onValue} from '../firebase/firebase.js';

// Define a Match type for qualification score calculation
interface FirebaseMatch {
    alliances: {
        red: string[];
        blue: string[];
        red_score: number;
        blue_score: number;
    };
    match_number: number;
}

const Dashboard: React.FC = () => {
    const [teamRanking, setTeamRanking] = useState<string | null>('Loading...');
    const [matchesScouted, setMatchesScouted] = useState<string | number>('Loading...');
    const [Accuracy, setAccuracy] = useState<string | number>('Loading...');
    const [qualificationScore, setQualificationScore] = useState<string | number>('Loading...');
    const [eventKey, setEventKey] = useState<string>(() => localStorage.getItem('eventKey') || '2025isde4');
    const [nextMatchNumber, setNextMatchNumber] = useState<number | null>(null);
    const [currentMatchNumber, setCurrentMatchNumber] = useState<number | null>(null);

    useEffect(() => {
        const fetchQualificationScore = () => {
            const db = getDatabase();
            const matchesRef = ref(db, 'matches');

            onValue(
                matchesRef,
                (snapshot: unknown) => {
                    const snap = snapshot as { val: () => unknown };
                    const matches = snap.val() as Record<string, FirebaseMatch> | null;
                    if (matches) {
                        const matchArray: FirebaseMatch[] = Object.values(matches);

                        const lastMatch = matchArray
                            .filter((match) =>
                                match.alliances.red.includes('6738') ||
                                match.alliances.blue.includes('6738')
                            )
                            .sort((a, b) => b.match_number - a.match_number)[0];

                        if (lastMatch) {
                            const isRedAlliance = lastMatch.alliances.red.includes('6738');
                            const score = isRedAlliance
                                ? lastMatch.alliances.red_score
                                : lastMatch.alliances.blue_score;
                            setQualificationScore(score);
                        } else {
                            setQualificationScore('No matches found.');
                        }
                    } else {
                        setQualificationScore('No matches data available.');
                    }
                },
                (error: unknown) => {
                    console.error('Error fetching matches:', error);
                    setQualificationScore('Error');
                }
            );
        };

        fetchQualificationScore();
    }, []);

    useEffect(() => {
        const fetchTeamRanking = async () => {
            const apiKey = 'DGOg0BIAQjm8EO3EkO50txFeLxpklBtotoW9qnHxUzoeecJIlRzOz8CsgNjZ4fyO';

            try {
                localStorage.removeItem('teamRanking');

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

                const data = await response.json();
                type Team = {
                    team_key: string;
                    rank: number;
                };

                const teamData = data.rankings.find((team: Team) => team.team_key === 'frc6738');
                if (teamData) {
                    const ranking = `${teamData.rank}`;
                    console.log('Fetched Team Ranking:', ranking);
                    setTeamRanking(ranking);
                    localStorage.setItem('teamRanking', ranking);
                } else {
                    setTeamRanking('Team 6738 not found in rankings.');
                }
            } catch (error: unknown) {
                console.error('Error fetching team ranking:', error);
                setTeamRanking('Error fetching ranking.');
            }
        };

        fetchTeamRanking();
    }, [eventKey]);

    useEffect(() => {
        const fetchMatchesScouted = () => {
            const db = getDatabase();
            const scoutingStatsRef = ref(db, 'scoutingStats/sentForms');

            onValue(
                scoutingStatsRef,
                (snapshot: unknown) => {
                    const snap = snapshot as { val: () => unknown };
                    const value = snap.val() as number | null;
                    setMatchesScouted(value != null ? value.toString() : '0');
                },
                (error: unknown) => {
                    console.error('Error fetching matches scouted:', error);
                    setMatchesScouted('Error');
                }
            );
        };

        fetchMatchesScouted();
    }, []);

    useEffect(() => {
        const fetchAccuracy = () => {
            const db = getDatabase();
            const scoutingStatsRef = ref(db, 'scoutingStats/accuracy');

            onValue(
                scoutingStatsRef,
                (snapshot: unknown) => {
                    const snap = snapshot as { val: () => unknown };
                    const value = snap.val() as number | null;
                    setAccuracy(value != null ? value.toString() : '0');
                },
                (error: unknown) => {
                    console.error('Error fetching accuracy:', error);
                    setAccuracy('Error');
                }
            );
        };

        fetchAccuracy();
    }, []);

    // Reuse currentMatch from Firebase (like UpcomingMatches) to show live status
    useEffect(() => {
        const db = getDatabase();
        const currentMatchRef = ref(db, 'currentMatch');

        const unsubscribe = onValue(
            currentMatchRef,
            (snapshot: unknown) => {
                const snap = snapshot as { val: () => unknown };
                const value = snap.val() as string | number | null;
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
            (error: unknown) => {
                console.error('Error fetching currentMatch:', error);
                setCurrentMatchNumber(null);
            }
        );

        return () => unsubscribe();
    }, []);

    // Derive a simple "next match" number from qualificationScore stream if available
    useEffect(() => {
        // When we have a last qualification score based on the latest match with 6738,
        // we can approximate the next match number by adding 1.
        if (typeof qualificationScore === 'number' && currentMatchNumber != null) {
            setNextMatchNumber(currentMatchNumber + 1);
        }
    }, [qualificationScore, currentMatchNumber]);

    const handleRefresh = () => {
        // Simple way: reload the page so all hooks refetch
        window.location.reload();
    };

    const handleEventChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newKey = e.target.value;
        setEventKey(newKey);
        localStorage.setItem('eventKey', newKey);
        // Let existing effects that read from localStorage pick up new event on next runs / reload
    };

    const renderLiveStatus = () => {
        if (currentMatchNumber == null && nextMatchNumber == null) {
            return (
                <span className="inline-flex items-center gap-1 rounded-full bg-neutral-50 px-2 py-0.5 text-[11px] text-neutral-500 border border-dashed border-neutral-200">
                    No live match data
                </span>
            );
        }

        if (currentMatchNumber != null) {
            return (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] text-emerald-700 border border-emerald-200">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Live: Match {currentMatchNumber}
                </span>
            );
        }

        return (
            <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-2 py-0.5 text-[11px] text-sky-700 border border-sky-200">
                Next: Match {nextMatchNumber}
            </span>
        );
    };

    return (
        <div className="animate-fade-in space-y-4">
            {/* Top header bar */}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <div className="flex items-center gap-2">
                        <h1 className="text-xl font-semibold text-neutral-900">Event overview</h1>
                        <span className="inline-flex items-center gap-1 rounded-full border border-neutral-200 px-2 py-0.5 text-[11px] text-neutral-600 bg-white">
                            <MapPin size={12} className="text-neutral-400" />
                            <span className="font-medium">Team 6738</span>
                        </span>
                    </div>
                    <div className="mt-0.5 flex flex-wrap items-center gap-2">
                        <p className="text-xs text-neutral-500">Israel District Event #4 · Live scouting summary</p>
                        {renderLiveStatus()}
                    </div>
                </div>

                {/* Small controls: event selector + refresh */}
                <div className="flex items-center gap-2">
                    <select
                        value={eventKey}
                        onChange={handleEventChange}
                        className="h-8 rounded border border-neutral-200 bg-white px-2 text-xs text-neutral-700 shadow-sm focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-300"
                    >
                        <option value="2025isde4">Israel District Event #4</option>
                        <option value="2025iscmp">Israel District Championship</option>
                    </select>
                    <button
                        type="button"
                        onClick={handleRefresh}
                        className="inline-flex items-center gap-1 rounded border border-neutral-200 bg-white px-2 py-1 text-xs text-neutral-700 shadow-sm hover:bg-neutral-50 active:bg-neutral-100"
                    >
                        <RefreshCw size={14} className="text-neutral-500" />
                        <span>Refresh</span>
                    </button>
                </div>
            </div>

            {/* Key metrics - enhanced cards with subtle compact layout */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <MetricCard
                    title="Rank"
                    subtitle="Current event ranking"
                    value={teamRanking ?? '—'}
                    tooltip="Official ranking from The Blue Alliance for this event."
                    icon={<Target className="text-primary-500" />}
                    compact
                />
                <MetricCard
                    title="Matches scouted"
                    subtitle="Forms submitted"
                    value={matchesScouted}
                    tooltip="Total number of match scouting forms sent for this event."
                    icon={<Clock className="text-neutral-500" />}
                    compact
                />
                <MetricCard
                    title="Scouting accuracy"
                    subtitle="From scoutingStats/accuracy"
                    value={Accuracy}
                    unit="%"
                    tooltip="Self‑reported accuracy metric from the scouting stats."
                    icon={<Users className="text-secondary-500" />}
                    compact
                />
                <MetricCard
                    title="Last qual score"
                    subtitle="Most recent match with 6738"
                    value={qualificationScore}
                    tooltip="Alliance score for the last qualification match that included Team 6738."
                    compact
                />
            </div>

            {/* Matches + upcoming - less chrome */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 bg-white rounded-lg border border-neutral-200 p-3">
                    <TeamMatches />
                </div>
                <div className="bg-white rounded-lg border border-neutral-200 p-3">
                    <h2 className="text-sm font-medium mb-2">Upcoming matches</h2>
                    <UpcomingMatches />
                </div>
            </div>

            {/* Schedule - simple block */}
            <div className="bg-white rounded-lg border border-neutral-200 p-3">
                <h2 className="text-sm font-medium mb-2">Todays schedule</h2>
                <EventSchedule />
            </div>
        </div>
    );
};

export default Dashboard;

