import React, {useEffect, useState} from 'react';
import MetricCard from '../components/MetricCard';
import EventSchedule from '../components/EventSchedule';
import TeamMatches from '../components/TeamMatches';
import UpcomingMatches from '../components/UpcomingMatches';
import {Target, Users, Clock} from 'lucide-react';
// @ts-ignore: Ignore missing type declaration for Firebase module
import {getDatabase, ref, onValue} from '../firebase/firebase.js';

const Dashboard: React.FC = () => {
    const [teamRanking, setTeamRanking] = useState<string | null>('Loading...');
    const [matchesScouted, setMatchesScouted] = useState<string | number>('Loading...');
    const [Accuracy, setAccuracy] = useState<string | number>('Loading...');
    const [qualificationScore, setQualificationScore] = useState<string | number>('Loading...');

    useEffect(() => {
        const fetchQualificationScore = () => {
            const db = getDatabase();
            const matchesRef = ref(db, 'matches');

            onValue(matchesRef, (snapshot: any) => {
                const matches = snapshot.val();
                if (matches) {
                    const matchArray = Object.values(matches);
                    type Match = {
                        alliances: {
                            red: string[];
                            blue: string[];
                            red_score: number;
                            blue_score: number;
                        };
                        match_number: number;
                    };

                    const lastMatch = matchArray
                        .filter((match: Match) => {
                                return match.alliances.red.includes('6738') || match.alliances.blue.includes('6738');
                            }
                        )
                        .sort((a: Match, b: Match) => b.match_number - a.match_number)[0];

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
            }, (error: any) => {
                console.error('Error fetching matches:', error);
                setQualificationScore('Error');
            });
        };

        fetchQualificationScore();
    }, []);

    useEffect(() => {
        const fetchTeamRanking = async () => {
            const eventKey = localStorage.getItem('eventKey') || '2025isde4';
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
            } catch (error: any) {
                console.error('Error fetching team ranking:', error);
                setTeamRanking('Error fetching ranking.');
            }
        };

        fetchTeamRanking();
    }, []);

    useEffect(() => {
        const fetchMatchesScouted = () => {
            const db = getDatabase();
            const scoutingStatsRef = ref(db, 'scoutingStats/sentForms');

            onValue(scoutingStatsRef, (snapshot: any) => {
                const value = snapshot.val();
                setMatchesScouted(value ? value.toString() : '0' as string | number);
            }, (error: any) => {
                console.error('Error fetching matches scouted:', error);
                setMatchesScouted('Error');
            });
        };

        fetchMatchesScouted();
    }, []);

    useEffect(() => {
        const fetchAccuracy = () => {
            const db = getDatabase();
            const scoutingStatsRef = ref(db, 'scoutingStats/accuracy');

            onValue(scoutingStatsRef, (snapshot: any) => {
                const value = snapshot.val();
                setAccuracy(value ? value.toString() : '0' as string | number);
            }, (error: any) => {
                console.error('Error fetching accuracy:', error);
                setAccuracy('Error');
            });
        };

        fetchAccuracy();
    }, []);

    return (
        <div className="animate-fade-in space-y-4">
            <div>
                <h1 className="text-xl font-semibold text-neutral-900">Event overview</h1>
                <p className="text-xs text-neutral-500">Israel District Event #4 · Team 6738</p>
            </div>

            {/* Key metrics - compact cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <MetricCard
                    title="Rank"
                    value={teamRanking}
                    icon={<Target className="text-primary-500" />}
                />
                <MetricCard
                    title="Matches scouted"
                    value={matchesScouted}
                    icon={<Clock className="text-neutral-500" />}
                />
                <MetricCard
                    title="Scouting accuracy"
                    value={Accuracy}
                    icon={<Users className="text-secondary-500" />}
                />
                <MetricCard
                    title="Last qual score"
                    value={qualificationScore}
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

