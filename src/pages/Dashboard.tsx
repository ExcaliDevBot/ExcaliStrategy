import React, {useEffect, useState} from 'react';
import MetricCard from '../components/MetricCard';
import EventSchedule from '../components/EventSchedule';
import TeamMatches from '../components/TeamMatches';
import UpcomingMatches from '../components/UpcomingMatches';
import {ArrowUp, Target, Users, Clock} from 'lucide-react';
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
        <div className="animate-fade-in">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-neutral-900">Event Dashboard</h1>
                <p className="text-neutral-500">Israel District Event #4</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <MetricCard
                    title="Your Team Ranking"
                    value={teamRanking}
                    change={2}
                    changeType="positive"
                    icon={<Target className="text-primary-500"/>}
                />
                <MetricCard
                    title="Matches Scouted"
                    value={matchesScouted}
                    change={8}
                    changeType="positive"
                    icon={<Clock className="text-info"/>}
                />
                <MetricCard
                    title="Accuracy Rate"
                    value={Accuracy}
                    change={-4}
                    changeType="negative"
                    icon={<Users className="text-secondary-500"/>}
                />
                <MetricCard
                    title="Qualification Score"
                    value={qualificationScore}
                    change={1.2}
                    changeType="negative"
                    icon={<ArrowUp className="text-success"/>}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-4">
                    <TeamMatches/>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-4 h-full pb-0">
                    <h2 className="text-lg font-semibold mb-4">Upcoming Matches</h2>
                    <UpcomingMatches/>
                </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4">
                <h2 className="text-lg font-semibold mb-4">Event Schedule</h2>
                <EventSchedule/>
            </div>
        </div>
    );
};

export default Dashboard;