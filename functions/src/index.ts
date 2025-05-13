import { getDatabase, ref, get, set, update } from '../../src/firebase/firebase.js';
import axios from 'axios';

const TBA_API_BASE_URL = 'https://www.thebluealliance.com/api/v3';
const TBA_API_KEY = 'DGOg0BIAQjm8EO3EkO50txFeLxpklBtotoW9qnHxUzoeecJIlRzOz8CsgNjZ4fyO';
const TBA_EVENT_KEY = '2025iscmp';

export const calculateAndStoreAverages = async (teamId: number): Promise<void> => {
    try {
        const db = getDatabase();
        const scoutingDataRef = ref(db, 'scoutingData');
        const snapshot = await get(scoutingDataRef);

        if (!snapshot.exists()) {
            console.error('No scouting data found.');
            return;
        }

        const scoutingData = snapshot.val();
        const valuesToCompute = ['autoL1', 'autoL2', 'autoL3', 'autoL4', 'L1', 'L2', 'L3', 'L4', 'autoRemoveAlgae', 'defensivePins', 'netScore', 'processorScore', 'removeAlgae'];
        const totals: Record<string, number> = {};
        const counts: Record<string, number> = {};
        let deepClimbCount = 0;
        let totalMatches = 0;
        let consistentMatches = 0;
        let defensivePinsTotal = 0;
        let defensivePinsCount = 0;

        // Initialize totals and counts
        valuesToCompute.forEach((key) => {
            totals[key] = 0;
            counts[key] = 0;
        });

        // Iterate through all matches
        Object.keys(scoutingData).forEach((matchKey) => {
            if (matchKey.includes(`T${teamId}`)) {
                const matchData = scoutingData[matchKey];
                totalMatches++;

                // Count deep climbs
                if (matchData.climbOption === 'DEEP') {
                    deepClimbCount++;
                }

                // Count consistent matches
                const totalScore = calculateTotalScore(matchData);
                if (totalScore > 40) {
                    consistentMatches++;
                }

                // Process defensive pins
                if (matchData.defensivePins !== undefined && typeof matchData.defensivePins === 'number') {
                    defensivePinsTotal += matchData.defensivePins;
                    defensivePinsCount++;
                }

                valuesToCompute.forEach((key) => {
                    if (matchData[key] !== undefined && typeof matchData[key] === 'number') {
                        totals[key] += matchData[key];
                        counts[key]++;
                    } else {
                        console.warn(`No valid data for ${key} in match ${matchKey}`);
                    }
                });
            }
        });

        // Calculate averages and store in Firebase
        const teamAverageRef = ref(db, `processedData/${teamId}`);
        const averages: Record<string, number> = {};

        valuesToCompute.forEach((key) => {
            if (counts[key] > 0) {
                averages[key] = totals[key] / counts[key];
            } else {
                console.warn(`No matches found for team ${teamId} with ${key} data.`);
                averages[key] = 0; // Default to 0 if no data is found
            }
        });

        averages['matchesPlayed'] = totalMatches;

        // Store averages in Firebase
        await set(teamAverageRef, averages);

        console.log(`Averages, matches played, consistency rate, and defense rating for team ${teamId} successfully calculated and stored:`, averages);

        // Calculate climb rate
        const climbRate = totalMatches > 0 ? (deepClimbCount / totalMatches) * 100 : 0;
        averages['climbRate'] = climbRate;

        // Calculate consistency rate
        const consistencyRate = totalMatches > 0 ? (consistentMatches / totalMatches) * 100 : 0;
        averages['consistencyRate'] = consistencyRate;

        // Calculate defense rating
        if (defensivePinsCount >= 3) {
            averages['defenseRating'] = defensivePinsTotal / defensivePinsCount;
        } else {
            console.warn(`Not enough defensive pins data for team ${teamId}.`);
            averages['defenseRating'] = 0; // Default to 0 if insufficient data
        }

        await set(teamAverageRef, averages);

        console.log(`Averages, consistency rate, and defense rating for team ${teamId} successfully calculated and stored:`, averages);

        // Store match scores
        await storeMatchScores(teamId, scoutingData);

        // Calculate performance trend
        await calculatePerformanceTrend(teamId);
    } catch (error) {
        console.error('Error calculating and storing averages, consistency rate, and defense rating:', error);
    }
};

const calculateTotalScore = (matchData: any): number => {
    const autoScore = (matchData.autoL4 || 0) * 7 +
        (matchData.autoL3 || 0) * 6 +
        (matchData.autoL2 || 0) * 4 +
        (matchData.autoL1 || 0) * 3 +
        3;

    const teleopScore = (matchData.autoL4 || 0) * 5 +
        (matchData.autoL3 || 0) * 4 +
        (matchData.autoL2 || 0) * 3 +
        (matchData.autoL1 || 0) * 2 +
        (matchData.netScore || 0) * 4 +
        (matchData.processorScore || 0) * 6;

    let endgameScore = 0;
    if (matchData.climbOption === 'DEEP') {
        endgameScore = 12;
    } else if (matchData.climbOption === 'SHALLOW') {
        endgameScore = 6;
    } else if (matchData.climbOption === 'PARKED') {
        endgameScore = 2;
    }

    return autoScore + teleopScore + endgameScore;
};

const storeMatchScores = async (teamId: number, scoutingData: any): Promise<void> => {
    const db = getDatabase();

    for (const matchKey of Object.keys(scoutingData)) {
        if (matchKey.includes(`T${teamId}`)) {
            const matchData = scoutingData[matchKey];
            const totalScore = calculateTotalScore(matchData);

            const matchScoreRef = ref(db, `processedData/${teamId}matches/${matchKey}`);
            console.log(`Writing to path: processedData/${teamId}matches/${matchKey}`);
            try {
                await set(matchScoreRef, {
                    autoScore: totalScore,
                    teleopScore: totalScore,
                    endgameScore: totalScore,
                    totalScore,
                });
                console.log(`Scores for match ${matchKey} successfully stored in Firebase.`);
            } catch (error) {
                console.error(`Failed to store scores for match ${matchKey}:`, error);
            }
        }
    }
};

export const getTBAStats = async (teamId: number): Promise<void> => {
    try {
        const response = await axios.get(`${TBA_API_BASE_URL}/event/${TBA_EVENT_KEY}/oprs`, {
            headers: {
                'X-TBA-Auth-Key': TBA_API_KEY,
            },
        });

        const data = response.data;

        if (data.oprs && data.dprs) {
            const opr = data.oprs[`frc${teamId}`] || 0;
            const dpr = data.dprs[`frc${teamId}`] || 0;

            console.log(`OPR: ${opr}, DPR: ${dpr} for team ${teamId} in competition ${TBA_EVENT_KEY}`);

            const db = getDatabase();
            const teamStatsRef = ref(db, `processedData/${teamId}`);
            await update(teamStatsRef, { opr, dpr });

            console.log(`OPR and DPR for team ${teamId} successfully updated in Firebase.`);
        } else {
            console.error('OPR or DPR data not found in the response.');
        }
    } catch (error) {
        console.error('Error fetching or updating TBA stats:', error);
    }
};

export const calculatePerformanceTrend = async (teamId: number): Promise<void> => {
    try {
        const db = getDatabase();
        const scoutingDataRef = ref(db, 'scoutingData');
        const snapshot = await get(scoutingDataRef);

        if (!snapshot.exists()) {
            console.error('No scouting data found.');
            return;
        }

        const scoutingData = snapshot.val();
        const matchScores: number[] = [];

        Object.keys(scoutingData).forEach((matchKey) => {
            if (matchKey.includes(`T${teamId}`)) {
                const matchData = scoutingData[matchKey];
                const totalScore = calculateTotalScore(matchData);
                matchScores.push(totalScore);
            }
        });

        let trend = 'stable';
        if (matchScores.length > 1) {
            const differences = matchScores.slice(1).map((score, i) => score - matchScores[i]);
            const allPositive = differences.every((diff) => diff > 0);
            const allNegative = differences.every((diff) => diff < 0);

            if (allPositive) {
                trend = 'upward';
            } else if (allNegative) {
                trend = 'downward';
            }
        }

        const teamTrendRef = ref(db, `processedData/${teamId}/performanceTrend`);
        await set(teamTrendRef, trend);

        console.log(`Performance trend for team ${teamId} successfully calculated and stored: ${trend}`);
    } catch (error) {
        console.error('Error calculating and storing performance trend:', error);
    }
};